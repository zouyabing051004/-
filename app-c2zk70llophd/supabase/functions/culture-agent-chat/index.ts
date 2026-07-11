// 传统文化智能体「知节」· 服务端编排函数
// 职责：数据库检索 500 首诗词知识库 → 组装系统提示词 → 调 DeepSeek 流式返回
// 站内页面与外站悬浮挂件共用此函数，保证知识库与人设只有一份权威实现。
// 环境变量：DEEPSEEK_API_KEY（必须）；SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY（平台自带）
// 未配置 DEEPSEEK_API_KEY 时返回 501，调用方可降级到已部署的 multimodal-chat（文心）。
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";

// 二十四节气速查表（与前端 solarTerms.ts 同源的精简版）
const SOLAR_TERMS: Array<{
  name: string; season: string; date: string; climate: string; phenology: string;
  eat: string; doThing: string; poemTitle: string; poemAuthor: string;
  poemContent: string; keywords: string[];
}> = [{"name": "立春", "season": "春", "date": "2月3日-5日", "climate": "东风解冻，万物复苏，气温开始回升", "phenology": "一候东风解冻，二候蛰虫始振，三候鱼陟负冰", "eat": "春饼、春卷、萝卜，寓意\"咬春\"", "doThing": "贴春联、迎春、打春牛", "poemTitle": "立春", "poemAuthor": "白玉蟾（宋）", "poemContent": "东风吹散梅梢雪，一夜挽回天下春。从此阳春应有脚，百花富贵草精神。", "keywords": ["春天", "复苏", "春饼", "迎春"]}, {"name": "雨水", "season": "春", "date": "2月18日-20日", "climate": "降雨开始增多，气温回升较快", "phenology": "一候獭祭鱼，二候鸿雁来，三候草木萌动", "eat": "龙须饼、爆米花、红枣粥", "doThing": "回娘屋、拉保保（认干爹）", "poemTitle": "春夜喜雨", "poemAuthor": "杜甫（唐）", "poemContent": "好雨知时节，当春乃发生。随风潜入夜，润物细无声。", "keywords": ["春雨", "播种", "润物"]}, {"name": "惊蛰", "season": "春", "date": "3月5日-7日", "climate": "春雷始鸣，气温回升，昆虫惊醒", "phenology": "一候桃始华，二候仓庚鸣，三候鹰化为鸠", "eat": "梨子、炒豆、鸡蛋", "doThing": "祭白虎、打小人、吃梨润肺", "poemTitle": "观田家", "poemAuthor": "韦应物（唐）", "poemContent": "微雨众卉新，一雷惊蛰始。田家几日闲，耕种从此起。", "keywords": ["春雷", "虫醒", "桃花"]}, {"name": "春分", "season": "春", "date": "3月20日-22日", "climate": "昼夜平分，春暖花开", "phenology": "一候玄鸟至，二候雷乃发声，三候始电", "eat": "春菜、汤圆、驴打滚", "doThing": "竖蛋、放风筝、踏青", "poemTitle": "春分日", "poemAuthor": "徐铉（五代）", "poemContent": "仲春初四日，春色正中分。绿野徘徊月，晴天断续云。", "keywords": ["昼夜平分", "竖蛋", "风筝"]}, {"name": "清明", "season": "春", "date": "4月4日-6日", "climate": "天气晴朗，草木繁茂", "phenology": "一候桐始华，二候田鼠化为鴽，三候虹始见", "eat": "青团、馓子、清明果", "doThing": "扫墓祭祖、踏青郊游、插柳", "poemTitle": "清明", "poemAuthor": "杜牧（唐）", "poemContent": "清明时节雨纷纷，路上行人欲断魂。借问酒家何处有，牧童遥指杏花村。", "keywords": ["扫墓", "踏青", "青团"]}, {"name": "谷雨", "season": "春", "date": "4月19日-21日", "climate": "雨量增多，适合谷物生长", "phenology": "一候萍始生，二候鸣鸠拂其羽，三候戴胜降于桑", "eat": "香椿、谷雨茶、菠菜", "doThing": "赏牡丹、走谷雨、喝谷雨茶", "poemTitle": "谷雨", "poemAuthor": "朱槔（宋）", "poemContent": "天点纷林际，虚檐写梦中。明朝知谷雨，无策禁花风。", "keywords": ["采茶", "牡丹", "播种"]}, {"name": "立夏", "season": "夏", "date": "5月5日-7日", "climate": "温度明显升高，炎暑将临", "phenology": "一候蝼蝈鸣，二候蚯蚓出，三候王瓜生", "eat": "立夏蛋、立夏饭、蚕豆", "doThing": "称体重、斗蛋、尝新", "poemTitle": "立夏", "poemAuthor": "陆游（宋）", "poemContent": "赤帝收春半，祝融送夏来。日斜汤沐罢，熟练试单衣。", "keywords": ["夏天", "称体重", "立夏蛋"]}, {"name": "小满", "season": "夏", "date": "5月20日-22日", "climate": "夏熟作物籽粒开始饱满", "phenology": "一候苦菜秀，二候靡草死，三候麦秋至", "eat": "苦菜、麦糕、桑葚", "doThing": "祭车神、祈蚕节、看麦梢黄", "poemTitle": "小满", "poemAuthor": "欧阳修（宋）", "poemContent": "夜莺啼绿柳，皓月醒长空。最爱垄头麦，迎风笑落红。", "keywords": ["麦子", "饱满", "苦菜"]}, {"name": "芒种", "season": "夏", "date": "6月5日-7日", "climate": "气温升高，雨量充沛，农事繁忙", "phenology": "一候螳螂生，二候鵙始鸣，三候反舌无声", "eat": "青梅、粽子、杨梅", "doThing": "送花神、安苗、煮梅", "poemTitle": "芒种后积雨骤冷", "poemAuthor": "范成大（宋）", "poemContent": "梅霖倾泻九河翻，百渎交流海面宽。良苦吴农田下湿，年年披絮插秧寒。", "keywords": ["农忙", "收麦", "种稻"]}, {"name": "夏至", "season": "夏", "date": "6月21日-22日", "climate": "日长夜短，气温最高", "phenology": "一候鹿角解，二候蝉始鸣，三候半夏生", "eat": "凉面、馄饨、荔枝", "doThing": "祭地、消夏避伏、吃凉面", "poemTitle": "夏至避暑北池", "poemAuthor": "韦应物（唐）", "poemContent": "昼晷已云极，宵漏自此长。绿筠尚含粉，圆荷始散芳。", "keywords": ["白天最长", "消暑", "凉面"]}, {"name": "小暑", "season": "夏", "date": "7月6日-8日", "climate": "天气开始炎热，但还没到最热", "phenology": "一候温风至，二候蟋蟀居宇，三候鹰始鸷", "eat": "莲藕、绿豆汤、西瓜", "doThing": "晒书画、晒衣服、吃藕", "poemTitle": "小暑六月节", "poemAuthor": "元稹（唐）", "poemContent": "倏忽温风至，因循小暑来。竹喧先觉雨，山暗已闻雷。", "keywords": ["炎热", "晒伏", "绿豆汤"]}, {"name": "大暑", "season": "夏", "date": "7月22日-24日", "climate": "一年中最热的时期", "phenology": "一候腐草为萤，二候土润溽暑，三候大雨时行", "eat": "仙草、烧仙草、荔枝", "doThing": "饮伏茶、晒伏姜、送大暑船", "poemTitle": "大暑", "poemAuthor": "曾几（宋）", "poemContent": "赤日几时过，清风无处寻。经书聊枕籍，瓜李漫浮沉。", "keywords": ["最热", "萤火虫", "消暑"]}, {"name": "立秋", "season": "秋", "date": "8月7日-9日", "climate": "暑去凉来，秋意渐浓", "phenology": "一候凉风至，二候白露生，三候寒蝉鸣", "eat": "西瓜、四季豆、秋桃", "doThing": "贴秋膘、啃秋、晒秋", "poemTitle": "立秋", "poemAuthor": "刘翰（宋）", "poemContent": "乳鸦啼散玉屏空，一枕新凉一扇风。睡起秋声无觅处，满阶梧叶月明中。", "keywords": ["秋天", "贴秋膘", "凉风"]}, {"name": "处暑", "season": "秋", "date": "8月22日-24日", "climate": "暑气渐消，天气转凉", "phenology": "一候鹰乃祭鸟，二候天地始肃，三候禾乃登", "eat": "鸭子、龙眼、白丸子", "doThing": "放河灯、开渔节、出游迎秋", "poemTitle": "处暑后风雨", "poemAuthor": "仇远（宋）", "poemContent": "疾风驱急雨，残暑扫除空。因识炎凉态，都来顷刻中。", "keywords": ["暑气消", "河灯", "秋凉"]}, {"name": "白露", "season": "秋", "date": "9月7日-9日", "climate": "天气转凉，露水凝结", "phenology": "一候鸿雁来，二候玄鸟归，三候群鸟养羞", "eat": "白露茶、龙眼、番薯", "doThing": "收清露、祭禹王、吃龙眼", "poemTitle": "蒹葭", "poemAuthor": "诗经·秦风", "poemContent": "蒹葭苍苍，白露为霜。所谓伊人，在水一方。", "keywords": ["露水", "秋凉", "大雁"]}, {"name": "秋分", "season": "秋", "date": "9月22日-24日", "climate": "昼夜平分，秋高气爽", "phenology": "一候雷始收声，二候蛰虫坯户，三候水始涸", "eat": "秋菜、汤圆、桂花酒", "doThing": "竖蛋、吃秋菜、送秋牛", "poemTitle": "秋词", "poemAuthor": "刘禹锡（唐）", "poemContent": "自古逢秋悲寂寥，我言秋日胜春朝。晴空一鹤排云上，便引诗情到碧霄。", "keywords": ["昼夜平分", "竖蛋", "秋高气爽"]}, {"name": "寒露", "season": "秋", "date": "10月8日-9日", "climate": "气温更低，露水更冷", "phenology": "一候鸿雁来宾，二候雀入大水为蛤，三候菊有黄华", "eat": "菊花茶、芝麻、柿子", "doThing": "登高、赏菊、饮菊花酒", "poemTitle": "月夜梧桐叶上见寒露", "poemAuthor": "戴察（唐）", "poemContent": "萧疏桐叶上，月白露初团。滴沥清光满，荧煌素彩寒。", "keywords": ["菊花", "登高", "寒冷"]}, {"name": "霜降", "season": "秋", "date": "10月23日-24日", "climate": "天气渐冷，开始降霜", "phenology": "一候豺乃祭兽，二候草木黄落，三候蛰虫咸俯", "eat": "柿子、栗子、牛肉", "doThing": "赏红叶、吃柿子、登高远眺", "poemTitle": "霜降", "poemAuthor": "元稹（唐）", "poemContent": "霜降三旬后，蓂馀一叶秋。玄阴迎落日，凉魄尽残钩。", "keywords": ["降霜", "柿子", "红叶"]}, {"name": "立冬", "season": "冬", "date": "11月7日-8日", "climate": "水始冰，地始冻，冬季开始", "phenology": "一候水始冰，二候地始冻，三候雉入大水为蜃", "eat": "饺子、羊肉、糍粑", "doThing": "补冬、吃饺子、酿黄酒", "poemTitle": "立冬", "poemAuthor": "李白（唐）", "poemContent": "冻笔新诗懒写，寒炉美酒时温。醉看墨花月白，恍疑雪满前村。", "keywords": ["冬天", "饺子", "保暖"]}, {"name": "小雪", "season": "冬", "date": "11月22日-23日", "climate": "开始降雪，雪量不大", "phenology": "一候虹藏不见，二候天气上升地气下降，三候闭塞而成冬", "eat": "腊肉、糍粑、刨汤", "doThing": "腌腊肉、吃糍粑、晒鱼干", "poemTitle": "小雪", "poemAuthor": "戴叔伦（唐）", "poemContent": "花雪随风不厌看，更多还肯失林峦。愁人正在书窗下，一片飞来一片寒。", "keywords": ["小雪", "腊肉", "糍粑"]}, {"name": "大雪", "season": "冬", "date": "12月6日-8日", "climate": "雪量增大，天气更冷", "phenology": "一候鹖鴠不鸣，二候虎始交，三候荔挺出", "eat": "红薯粥、羊肉、萝卜", "doThing": "腌肉、进补、赏雪", "poemTitle": "江雪", "poemAuthor": "柳宗元（唐）", "poemContent": "千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。", "keywords": ["大雪", "瑞雪", "进补"]}, {"name": "冬至", "season": "冬", "date": "12月21日-23日", "climate": "日短夜长，数九寒天开始", "phenology": "一候蚯蚓结，二候麋角解，三候水泉动", "eat": "饺子（北方）、汤圆（南方）、羊肉汤", "doThing": "祭祖、数九、吃饺子/汤圆", "poemTitle": "冬至", "poemAuthor": "杜甫（唐）", "poemContent": "年年至日长为客，忽忽穷愁泥杀人。江上形容吾独老，天边风俗自相亲。", "keywords": ["冬至", "饺子", "汤圆", "数九"]}, {"name": "小寒", "season": "冬", "date": "1月5日-7日", "climate": "天气寒冷，但还没到最冷", "phenology": "一候雁北乡，二候鹊始巢，三候雉始鸲", "eat": "腊八粥、糯米饭、羊肉", "doThing": "探梅、吃腊八粥、准备年货", "poemTitle": "小寒", "poemAuthor": "元稹（唐）", "poemContent": "小寒连大吕，欢鹊垒新巢。拾食寻河曲，衔紫绕树梢。", "keywords": ["寒冷", "腊八粥", "梅花"]}, {"name": "大寒", "season": "冬", "date": "1月20日-21日", "climate": "一年中最冷的时期", "phenology": "一候鸡乳，二候征鸟厉疾，三候水泽腹坚", "eat": "八宝饭、年糕、消寒糕", "doThing": "除旧布新、准备年货、蒸供", "poemTitle": "大寒出江陵西门", "poemAuthor": "陆游（宋）", "poemContent": "平明羸马出西门，淡日寒云久吐吞。醉面冲风惊易醒，重裘藏手取微温。", "keywords": ["最冷", "年货", "迎新年"]}];

interface PoemRow {
  title: string; title_en: string | null; author: string; author_pinyin: string | null;
  dynasty: string; curated: boolean; lines: string[]; pinyin: string[] | null;
  english: string[] | null; kid_note: string | null; kid_note_en: string | null;
  genre: string;
}

function formatPoem(p: PoemRow): string {
  const head = p.curated
    ? `【诗词资料·精选层】《${p.title}》/ "${p.title_en ?? ""}"（${p.dynasty}·${p.author}${p.author_pinyin ? " / " + p.author_pinyin : ""}）`
    : `【诗词资料·底层库】《${p.title}》（${p.dynasty}·${p.author}，${p.genre}）`;
  const body = p.lines.map((line, i) => {
    let s = line;
    if (p.pinyin?.[i]) s += `\n  [拼音${p.curated ? "" : "·机器标注"}] ${p.pinyin[i]}`;
    if (p.curated && p.english?.[i]) s += `\n  [English] ${p.english[i]}`;
    return s;
  }).join("\n");
  const notes = [
    p.kid_note ? `儿童导读：${p.kid_note}` : "",
    p.kid_note_en ? `Kid note: ${p.kid_note_en}` : "",
  ].filter(Boolean).join("\n");
  return [head, body, notes].filter(Boolean).join("\n");
}

function formatTerm(t: (typeof SOLAR_TERMS)[number]): string {
  return `【节气资料】${t.name}（${t.date}，${t.season}季）\n气候：${t.climate}\n物候：${t.phenology}\n` +
    `习俗：吃${t.eat}；${t.doThing}\n代表诗：《${t.poemTitle}》（${t.poemAuthor}）\n${t.poemContent}`;
}

const LANGUAGE_RULES: Record<string, string> = {
  zh: "【语言】始终用中文回答。像温柔的老师跟小朋友说话：句子短、用词简单、多打比方、适当用emoji。",
  en: "【Language】Always reply in simple, warm English for children aged 5-10 (short sentences, friendly tone, some emoji). " +
    "When quoting a Chinese poem, show each line as: Chinese characters, then pinyin, then English meaning — copied EXACTLY from the reference material. " +
    "Briefly explain Chinese cultural words (e.g. jiaozi = Chinese dumplings).",
  bilingual: "【语言/Language】Reply bilingually: a short Chinese sentence, then its simple English translation, pair by pair. " +
    "Poem lines must show Chinese + pinyin + English, copied EXACTLY from the reference material.",
};

function buildSystemPrompt(docs: string, language: string, nickname: string, recentTopics: string[]): string {
  const today = new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
  const memory = [
    nickname ? `用户希望被称呼为"${nickname}"。` : "",
    recentTopics.length ? `用户最近聊过：${recentTopics.join("、")}。可以自然衔接，但不要每句都提。` : "",
  ].filter(Boolean).join("");
  return `你是"知节"（英文名 Zhijie），一位温润博学的中国传统文化向导，服务于一个面向全世界儿童传播中华传统文化的网站。用户主要是5-10岁的外国小朋友和他们的家长，多数不以中文为母语。

今天是${today}。

【你的使命】
让不了解中国的孩子也能听懂、喜欢上二十四节气、古诗词和传统节日。多用世界儿童熟悉的事物打比方（比如：冬至像"中国的感恩节晚餐夜"，春节像"最盛大的家庭派对"）。

【你的能力】
1. 讲二十四节气：由来、三候、习俗、饮食、农事
2. 教古诗词：逐句带读（汉字+拼音+英文意思）、讲背后的小故事
3. 讲传统节日：春节、元宵、清明、端午、七夕、中秋、重阳等
4. 陪小朋友玩诗词接龙、猜节气等小游戏

【铁律：锚定资料，防止幻觉】
- 诗词的原文、拼音、英文意思，只能逐字使用下方【参考资料】提供的内容，并注明题目和作者
- 标注"精选层"的资料是人工校准的，可放心引用拼音和英译
- 标注"底层库"的资料原文可靠，但拼音是机器标注：引用其拼音时提醒"个别多音字读音请以老师讲解为准"；英文意思可以由你意译，但要说明是大意（paraphrase）
- 参考资料里没有的诗，可以介绍它讲了什么，但不要默写原文或自编拼音
- 不编造习俗、典故和出处，不确定就说不确定

【延时记忆】
${memory || "（暂无用户记忆）"}

【参考资料】
${docs || "（本次没有检索到相关资料）"}

${LANGUAGE_RULES[language] ?? LANGUAGE_RULES.zh}

【边界】
回答不超过250字（或同等长度英文）。只聊中华传统文化相关话题，无关问题温柔地引导回来。尊重各国文化，只做介绍分享，不做比较贬低。`;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  let message = "";
  let history: Array<{ role: string; content: string }> = [];
  let language = "zh";
  let nickname = "";
  let recentTopics: string[] = [];
  try {
    const body = await req.json();
    message = String(body.message ?? "").slice(0, 2000);
    if (!message) throw new Error("message 不能为空");
    if (Array.isArray(body.history)) history = body.history.slice(-8);
    if (typeof body.language === "string") language = body.language;
    if (typeof body.nickname === "string") nickname = body.nickname.slice(0, 30);
    if (Array.isArray(body.recentTopics)) recentTopics = body.recentTopics.slice(0, 5).map(String);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Invalid request body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "deepseek_not_configured" }),
      { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // ---- 知识检索 ----
  const docs: string[] = [];
  for (const t of SOLAR_TERMS) {
    if (message.includes(t.name) || t.keywords.some((k) => k.length >= 2 && message.includes(k))) {
      docs.push(formatTerm(t));
      if (docs.length >= 2) break;
    }
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data } = await supabase.rpc("search_culture_poems", { q: message, max_rows: 3 });
    for (const p of (data ?? []) as PoemRow[]) docs.push(formatPoem(p));
  } catch {
    // 知识库表未就绪时降级为无检索（迁移 00005/00006 执行后自动生效）
  }

  // ---- 调 DeepSeek（SSE 透传） ----
  const upstream = await fetch(DEEPSEEK_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.7,
      stream: true,
      messages: [
        { role: "system", content: buildSystemPrompt(docs.join("\n\n"), language, nickname, recentTopics) },
        ...history,
        { role: "user", content: message },
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: `Upstream error: ${upstream.status} ${errText}` }),
      { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
});
