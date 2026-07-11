import { supabase } from "@/db/supabase";

export interface WeatherNow {
  text: string;       // 天气现象，如"晴"
  temp: number;       // 温度（℃）
  feels_like: number; // 体感温度（℃）
  rh: number;         // 相对湿度（%）
  wind_class: string; // 风力等级
  wind_dir: string;   // 风向
  uptime: string;     // 数据更新时间
}

export interface WeatherLocation {
  city: string;
  name: string;
  province: string;
}

export interface WeatherResult {
  location: WeatherLocation;
  now: WeatherNow;
}

// 天气现象 → 童趣 emoji 映射
const WEATHER_EMOJI_MAP: Record<string, string> = {
  晴: "☀️",
  多云: "⛅",
  阴: "☁️",
  小雨: "🌦️",
  中雨: "🌧️",
  大雨: "🌧️",
  暴雨: "⛈️",
  雷阵雨: "⛈️",
  阵雨: "🌦️",
  小雪: "🌨️",
  中雪: "❄️",
  大雪: "❄️",
  雨夹雪: "🌨️",
  雾: "🌫️",
  霾: "😶‍🌫️",
  沙尘暴: "🌪️",
  扬沙: "🌪️",
  浮尘: "🌫️",
  大风: "💨",
};

export function getWeatherEmoji(text: string): string {
  for (const [key, emoji] of Object.entries(WEATHER_EMOJI_MAP)) {
    if (text.includes(key)) return emoji;
  }
  return "🌤️";
}

// Step 1: 通过 IP 定位获取用户所在城市的 adcode
async function fetchAdcodeByIp(): Promise<string> {
  const { data, error } = await supabase.functions.invoke("baidu-ip-geolocation", {
    body: {}, // 不传 ip，由 Edge Function 自动定位来源 IP
  });

  if (error) {
    const msg = await error?.context?.text?.();
    throw new Error(msg || error.message);
  }
  if (!data || data.status !== 0) {
    throw new Error(`IP 定位失败: ${data?.status ?? "未知"}`);
  }

  // adcode 示例: "110000"（北京）
  const adcode: string = data?.content?.address_detail?.adcode;
  if (!adcode) throw new Error("IP 定位未返回 adcode");
  return adcode;
}

// Step 2: 用 adcode 查询实时天气
async function fetchWeatherByAdcode(adcode: string): Promise<WeatherResult> {
  const { data, error } = await supabase.functions.invoke("district-weather", {
    body: { district_id: adcode, data_type: "now" },
  });

  if (error) {
    const msg = await error?.context?.text?.();
    throw new Error(msg || error.message);
  }
  if (!data || data.status !== 0) {
    throw new Error(`天气查询失败: ${data?.status ?? "未知"}`);
  }
  return data.result as WeatherResult;
}

/**
 * 主入口：先 IP 定位城市，再查当地实时天气。
 * 任一步骤失败自动回退到北京（110100）。
 */
export async function fetchCityWeather(): Promise<WeatherResult> {
  let adcode = "110100"; // 默认北京

  try {
    adcode = await fetchAdcodeByIp();
  } catch {
    // IP 定位失败，静默回退北京
  }

  return fetchWeatherByAdcode(adcode);
}
