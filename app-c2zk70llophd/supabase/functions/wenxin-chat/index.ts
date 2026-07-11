// 文心文本生成 Edge Function
// 内部收集完整SSE流，返回 JSON { content: "..." }
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WENXIN_ENDPOINT =
  "https://app-c2zk70llophd-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions";

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let messages: unknown[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("messages 不能为空");
    }
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

  // 调用上游，接收 SSE 流
  const upstream = await fetch(WENXIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Gateway-Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (upstream.status === 429 || upstream.status === 402) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // 在服务端收集完整SSE流 → 拼接完整文本
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // 按行处理 SSE
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") break;
      try {
        const parsed = JSON.parse(data);
        const chunk = parsed.choices?.[0]?.delta?.content ?? "";
        if (chunk) fullContent += chunk;
      } catch {
        // 跳过不完整 chunk
      }
    }
  }

  return new Response(
    JSON.stringify({ content: fullContent }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
});
