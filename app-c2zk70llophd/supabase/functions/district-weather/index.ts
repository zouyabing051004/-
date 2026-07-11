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

  // 解析请求体：district_id 可为空（回退到北京）
  let districtId: string;
  let dataType: string;
  try {
    const body = await req.json();
    districtId = body.district_id || "110100"; // 默认北京
    dataType = body.data_type ?? "now";
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

  const url = new URL("https://app-c2zk70llophd-api-oLpZbd8ed8wa-gateway.appmiaoda.com/weather/v1/");
  url.searchParams.set("district_id", districtId);
  url.searchParams.set("data_type", dataType);

  const upstream = await fetch(url.toString(), {
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
