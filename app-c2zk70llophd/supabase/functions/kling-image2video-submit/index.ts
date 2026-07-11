// Kling 图生视频 - 提交任务
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });

  let image: string;
  let prompt: string | undefined;
  let model_name = "kling-v1-6";
  let mode = "std";
  let duration = "5";

  try {
    const body = await req.json();
    image = body.image;
    if (!image) throw new Error("Missing required field: image");
    prompt = body.prompt;
    if (body.model_name) model_name = body.model_name;
    if (body.mode) mode = body.mode;
    if (body.duration) duration = body.duration;
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

  const requestBody: Record<string, unknown> = { image, model_name, mode, duration };
  if (prompt) requestBody.prompt = prompt;

  const upstream = await fetch(
    "https://app-c2zk70llophd-api-DY8MN3QBydBa-gateway.appmiaoda.com/v1/videos/image2video",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
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
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
