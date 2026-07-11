const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method Not Allowed" }),
      { status: 405, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // 解析可选参数
  let ip: string | undefined;
  let coor: string | undefined;
  try {
    const body = await req.json();
    ip = body.ip;
    coor = body.coor;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const apiKey = Deno.env.get("INTEGRATIONS_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  // 构建上游 URL（不传 ip 则自动定位请求来源 IP）
  const params = new URLSearchParams();
  if (ip) params.set("ip", ip);
  if (coor) params.set("coor", coor);
  const upstreamUrl = `https://app-c2zk70llophd-api-79jK62Ze2pQL-gateway.appmiaoda.com/location/ip${
    params.toString() ? "?" + params.toString() : ""
  }`;

  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "X-Gateway-Authorization": `Bearer ${apiKey}`,
    },
  });

  if (upstream.status === 429 || upstream.status === 402) {
    const errText = await upstream.text();
    return new Response(errText, {
      status: upstream.status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
  if (!upstream.ok) {
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status}` }),
      { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const data = await upstream.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
