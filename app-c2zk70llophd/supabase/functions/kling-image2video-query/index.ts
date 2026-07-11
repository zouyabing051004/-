// Kling 图生视频 - 查询任务 + 视频转存
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
    const contentType = response.headers.get("content-type") ?? "video/mp4";
    const ext = contentType.split("/")[1]?.split(";")[0] ?? "mp4";
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
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });

  let task_id: string;
  let transfer_video = true;

  try {
    const body = await req.json();
    task_id = body.task_id;
    if (!task_id) throw new Error("Missing required field: task_id");
    if (body.transfer_video !== undefined) transfer_video = body.transfer_video;
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
    `https://app-c2zk70llophd-api-zYkZzgKook1L-gateway.appmiaoda.com/v1/videos/image2video/${task_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Gateway-Authorization": `Bearer ${apiKey}`,
      },
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

  const result = await upstream.json();

  // 成功且需要转存时，把视频URL转存到Storage
  if (
    result.code === 0 &&
    result.data?.task_status === "succeed" &&
    transfer_video &&
    result.data?.task_result?.videos?.length > 0
  ) {
    const videos = result.data.task_result.videos as Array<{ id: string; url: string; duration: string }>;
    result.data.task_result.videos = await Promise.all(
      videos.map(async (video) => {
        const transfer = await streamMediaToStorage(video.url, "generated-media");
        return transfer.success
          ? { ...video, url: transfer.publicUrl, original_url: video.url }
          : { ...video, storage_transfer_error: transfer.error };
      })
    );
  }

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
