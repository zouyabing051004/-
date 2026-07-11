// MiniMax 文生图 Edge Function
// 调用 MiniMax 图片生成接口，将临时URL转存至Supabase Storage后返回持久化URL
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

async function streamMediaToStorage(
  mediaUrl: string,
  bucketName: string
): Promise<{ success: true; publicUrl: string } | { success: false; error: string }> {
  try {
    const response = await fetch(mediaUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "image/png";
    const ext = contentType.split("/")[1]?.split(";")[0] ?? "png";
    const filePath = `uploads/${crypto.randomUUID()}.${ext}`;
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, response.body!, { contentType, cacheControl: "no-cache", upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return { success: true, publicUrl: urlData.publicUrl };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let prompt: string;
  let model = "image-01";
  let aspect_ratio = "1:1";
  let n = 1;

  try {
    const body = await req.json();
    prompt = body.prompt;
    if (!prompt) throw new Error("Missing prompt");
    if (body.model) model = body.model;
    if (body.aspect_ratio) aspect_ratio = body.aspect_ratio;
    if (body.n) n = body.n;
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const apiKey = Deno.env.get("INTEGRATIONS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const upstream = await fetch(
    "https://app-c2zk70llophd-api-DLEO7vB8pQba-gateway.appmiaoda.com/v1/image_generation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, prompt, aspect_ratio, n, response_format: "url", prompt_optimizer: true }),
    }
  );

  if (upstream.status === 429 || upstream.status === 402) {
    const t = await upstream.text();
    return new Response(t, { status: upstream.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (!upstream.ok) {
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const data = await upstream.json();
  if (data.base_resp?.status_code !== 0) {
    return new Response(
      JSON.stringify({ error: `MiniMax error ${data.base_resp?.status_code}: ${data.base_resp?.status_msg}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const rawUrls: string[] = data.data?.image_urls ?? [];
  const persistentUrls: string[] = [];
  for (const url of rawUrls) {
    const result = await streamMediaToStorage(url, "generated-media");
    persistentUrls.push(result.success ? result.publicUrl : url);
  }

  return new Response(
    JSON.stringify({ image_urls: persistentUrls, metadata: data.metadata }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
