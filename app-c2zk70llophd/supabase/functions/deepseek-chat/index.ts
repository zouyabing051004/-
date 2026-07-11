// DeepSeek 对话 Edge Function
// 支持两种模式：
//   stream: true  -> 直接透传上游 SSE 流（前端用 sendStreamRequest 消费）
//   stream: false -> 返回 JSON { content: "..." }
// 需在 Supabase 项目中配置环境变量 DEEPSEEK_API_KEY（platform.deepseek.com 获取）
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let messages: unknown[];
  let stream = false;
  let temperature = 0.7;
  let jsonMode = false;
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("messages 不能为空");
    }
    if (typeof body.stream === "boolean") stream = body.stream;
    if (typeof body.temperature === "number") temperature = body.temperature;
    if (body.json_mode === true) jsonMode = true;
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error: missing DEEPSEEK_API_KEY" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const upstream = await fetch(DEEPSEEK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature,
      stream,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (upstream.status === 429 || upstream.status === 402) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status} ${errText}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 流式：SSE 透传，前端边收边渲染
  if (stream) {
    return new Response(upstream.body, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
      },
    });
  }

  // 非流式：提取完整文本
  const data = await upstream.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  return new Response(
    JSON.stringify({ content }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
