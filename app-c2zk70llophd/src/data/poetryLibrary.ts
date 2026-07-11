// 精选古诗词知识库（原文锚定层）
// 智能体引用诗词时只允许逐字使用本库原文，避免大模型凭记忆背错字。
// 选篇以幼小衔接/小学低段必背经典为主，均为公有领域文本。

export interface PoemEntry {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  lines: string[]; // 原文逐句
  theme: string[]; // 主题标签，用于关键词检索
  season?: '春' | '夏' | '秋' | '冬';
  solarTerm?: string; // 关联节气/节日
  kidNote: string; // 一句儿童白话导读
  visualKeywords: string[]; // 画面意象，用于场景生成
}

export const poetryLibrary: PoemEntry[] = [
  {
    id: 'chunxiao',
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐',
    lines: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
    theme: ['春天', '小鸟', '花', '下雨', '睡觉'],
    season: '春',
    solarTerm: '春分',
    kidNote: '春天睡得香，醒来听见小鸟叫，想起昨晚的风雨，不知吹落了多少花瓣。',
    visualKeywords: ['清晨', '啼鸟', '落花', '春雨初歇', '窗前'],
  },
  {
    id: 'yongliu',
    title: '咏柳',
    author: '贺知章',
    dynasty: '唐',
    lines: ['碧玉妆成一树高，万条垂下绿丝绦。', '不知细叶谁裁出，二月春风似剪刀。'],
    theme: ['柳树', '春风', '春天'],
    season: '春',
    solarTerm: '立春',
    kidNote: '柳树像碧玉打扮的姑娘，春风像剪刀，裁出了细细的柳叶。',
    visualKeywords: ['垂柳', '嫩绿柳条', '春风', '河岸'],
  },
  {
    id: 'cunju',
    title: '村居',
    author: '高鼎',
    dynasty: '清',
    lines: ['草长莺飞二月天，拂堤杨柳醉春烟。', '儿童散学归来早，忙趁东风放纸鸢。'],
    theme: ['风筝', '春天', '儿童', '柳树'],
    season: '春',
    solarTerm: '雨水',
    kidNote: '小草长高了，黄莺飞来了，小朋友放学早，赶紧趁着东风放风筝！',
    visualKeywords: ['放风筝的孩子', '杨柳', '春烟', '田野'],
  },
  {
    id: 'qingming',
    title: '清明',
    author: '杜牧',
    dynasty: '唐',
    lines: ['清明时节雨纷纷，路上行人欲断魂。', '借问酒家何处有，牧童遥指杏花村。'],
    theme: ['清明', '下雨', '牧童', '杏花'],
    season: '春',
    solarTerm: '清明',
    kidNote: '清明前后总爱下小雨，牧童指着远处开满杏花的小村庄。',
    visualKeywords: ['细雨', '牧童骑牛', '杏花村', '田间小路', '斜风细雨'],
  },
  {
    id: 'xiaochi',
    title: '小池',
    author: '杨万里',
    dynasty: '宋',
    lines: ['泉眼无声惜细流，树阴照水爱晴柔。', '小荷才露尖尖角，早有蜻蜓立上头。'],
    theme: ['荷花', '蜻蜓', '夏天', '池塘'],
    season: '夏',
    solarTerm: '小满',
    kidNote: '小荷叶刚刚露出尖尖角，蜻蜓就飞来站在上面啦！',
    visualKeywords: ['小荷尖角', '蜻蜓', '池塘', '树荫', '晴日柔光'],
  },
  {
    id: 'xiaochu-jingci',
    title: '晓出净慈寺送林子方',
    author: '杨万里',
    dynasty: '宋',
    lines: ['毕竟西湖六月中，风光不与四时同。', '接天莲叶无穷碧，映日荷花别样红。'],
    theme: ['荷花', '西湖', '夏天', '莲叶'],
    season: '夏',
    solarTerm: '小暑',
    kidNote: '六月的西湖，莲叶绿到天边，荷花被太阳照得特别红。',
    visualKeywords: ['接天莲叶', '映日荷花', '西湖', '盛夏晨光'],
  },
  {
    id: 'suojian',
    title: '所见',
    author: '袁枚',
    dynasty: '清',
    lines: ['牧童骑黄牛，歌声振林樾。', '意欲捕鸣蝉，忽然闭口立。'],
    theme: ['牧童', '蝉', '夏天', '黄牛'],
    season: '夏',
    solarTerm: '大暑',
    kidNote: '牧童唱着歌骑黄牛，想抓树上的蝉，马上闭紧嘴巴站住了。',
    visualKeywords: ['牧童骑牛', '树林', '鸣蝉', '夏日午后'],
  },
  {
    id: 'xiaoer-chuidiao',
    title: '小儿垂钓',
    author: '胡令能',
    dynasty: '唐',
    lines: ['蓬头稚子学垂纶，侧坐莓苔草映身。', '路人借问遥招手，怕得鱼惊不应人。'],
    theme: ['钓鱼', '儿童', '夏天'],
    season: '夏',
    solarTerm: '夏至',
    kidNote: '小娃娃学钓鱼，怕吓跑小鱼，连话都不敢回答呢。',
    visualKeywords: ['垂钓孩童', '河边青苔', '草丛', '安静的水面'],
  },
  {
    id: 'shanxing',
    title: '山行',
    author: '杜牧',
    dynasty: '唐',
    lines: ['远上寒山石径斜，白云生处有人家。', '停车坐爱枫林晚，霜叶红于二月花。'],
    theme: ['枫叶', '秋天', '霜', '山'],
    season: '秋',
    solarTerm: '霜降',
    kidNote: '秋天的枫叶被霜一打，比春天的花还要红！',
    visualKeywords: ['红枫林', '山间石径', '白云', '山中人家', '夕照'],
  },
  {
    id: 'jiuyuejiuri',
    title: '九月九日忆山东兄弟',
    author: '王维',
    dynasty: '唐',
    lines: ['独在异乡为异客，每逢佳节倍思亲。', '遥知兄弟登高处，遍插茱萸少一人。'],
    theme: ['重阳', '思念', '登高', '茱萸', '秋天'],
    season: '秋',
    solarTerm: '重阳节',
    kidNote: '重阳节要登高、插茱萸，诗人在远方想念家里的亲人。',
    visualKeywords: ['登高远眺', '茱萸', '秋日山峰', '思乡'],
  },
  {
    id: 'fengqiao-yebo',
    title: '枫桥夜泊',
    author: '张继',
    dynasty: '唐',
    lines: ['月落乌啼霜满天，江枫渔火对愁眠。', '姑苏城外寒山寺，夜半钟声到客船。'],
    theme: ['秋天', '霜', '月亮', '枫树', '夜晚'],
    season: '秋',
    solarTerm: '霜降',
    kidNote: '秋夜的江边，月亮落下、霜气满天，远处传来寺庙的钟声。',
    visualKeywords: ['江枫', '渔火', '客船', '秋夜', '古寺钟声'],
  },
  {
    id: 'jingyesi',
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    lines: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
    theme: ['月亮', '思念', '中秋', '夜晚'],
    season: '秋',
    solarTerm: '中秋节',
    kidNote: '月光洒在床前像霜一样白，抬头看月亮，就想起了家乡。',
    visualKeywords: ['明月', '月光如霜', '窗前', '安静的夜'],
  },
  {
    id: 'jiangxue',
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐',
    lines: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'],
    theme: ['雪', '冬天', '钓鱼', '江'],
    season: '冬',
    solarTerm: '大雪',
    kidNote: '大雪天里，一位老爷爷穿着蓑衣，独自在江上钓鱼。',
    visualKeywords: ['孤舟', '蓑笠翁', '寒江', '漫天飞雪', '空寂群山'],
  },
  {
    id: 'meihua',
    title: '梅花',
    author: '王安石',
    dynasty: '宋',
    lines: ['墙角数枝梅，凌寒独自开。', '遥知不是雪，为有暗香来。'],
    theme: ['梅花', '冬天', '雪', '香'],
    season: '冬',
    solarTerm: '小寒',
    kidNote: '墙角的梅花不怕冷，远远就能闻到淡淡的香味，所以知道那不是雪。',
    visualKeywords: ['墙角梅枝', '白梅', '残雪', '寒冬清晨'],
  },
  {
    id: 'yuanri',
    title: '元日',
    author: '王安石',
    dynasty: '宋',
    lines: ['爆竹声中一岁除，春风送暖入屠苏。', '千门万户曈曈日，总把新桃换旧符。'],
    theme: ['春节', '过年', '爆竹', '春联'],
    season: '冬',
    solarTerm: '春节',
    kidNote: '过年啦！放爆竹、喝屠苏酒、换上新的春联，家家户户亮堂堂。',
    visualKeywords: ['红灯笼', '春联', '爆竹', '朝阳', '家家户户'],
  },
  {
    id: 'minnong',
    title: '悯农（其二）',
    author: '李绅',
    dynasty: '唐',
    lines: ['锄禾日当午，汗滴禾下土。', '谁知盘中餐，粒粒皆辛苦。'],
    theme: ['农事', '粮食', '珍惜', '夏天'],
    season: '夏',
    solarTerm: '芒种',
    kidNote: '农民伯伯顶着大太阳种地，每一粒粮食都来得不容易，要珍惜哦。',
    visualKeywords: ['农田', '烈日', '锄地的农人', '禾苗'],
  },
  {
    id: 'denguanquelou',
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    lines: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'],
    theme: ['黄河', '登高', '励志', '太阳'],
    kidNote: '想看得更远，就要再登上一层楼——学习也是这样呀。',
    visualKeywords: ['落日群山', '黄河奔流', '高楼远眺'],
  },
  {
    id: 'wanglushan',
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    lines: ['日照香炉生紫烟，遥看瀑布挂前川。', '飞流直下三千尺，疑是银河落九天。'],
    theme: ['瀑布', '山', '夏天', '银河'],
    season: '夏',
    kidNote: '瀑布从高高的山上冲下来，像银河从天上掉下来一样壮观！',
    visualKeywords: ['飞瀑', '紫烟缭绕', '青山', '水雾'],
  },
  {
    id: 'jueju-huangli',
    title: '绝句',
    author: '杜甫',
    dynasty: '唐',
    lines: ['两个黄鹂鸣翠柳，一行白鹭上青天。', '窗含西岭千秋雪，门泊东吴万里船。'],
    theme: ['黄鹂', '白鹭', '春天', '雪山', '柳树'],
    season: '春',
    solarTerm: '春分',
    kidNote: '窗外有唱歌的黄鹂、飞上蓝天的白鹭，还能看见远处的雪山。',
    visualKeywords: ['黄鹂翠柳', '白鹭青天', '远山积雪', '江边船只'],
  },
  {
    id: 'jiangnan',
    title: '江南',
    author: '汉乐府',
    dynasty: '汉',
    lines: ['江南可采莲，莲叶何田田。', '鱼戏莲叶间。', '鱼戏莲叶东，鱼戏莲叶西，鱼戏莲叶南，鱼戏莲叶北。'],
    theme: ['采莲', '莲叶', '鱼', '夏天', '江南'],
    season: '夏',
    solarTerm: '大暑',
    kidNote: '江南的莲叶挨挨挤挤，小鱼在莲叶间游来游去，多快活！',
    visualKeywords: ['采莲小船', '田田莲叶', '游鱼', '江南水乡'],
  },
];

// 关键词检索：匹配题目/作者/原文/主题/节气，按命中数排序
export function searchPoems(query: string, limit = 3): PoemEntry[] {
  const scored = poetryLibrary
    .map((poem) => {
      let score = 0;
      if (query.includes(poem.title)) score += 10;
      if (query.includes(poem.author)) score += 5;
      if (poem.solarTerm && query.includes(poem.solarTerm)) score += 4;
      for (const t of poem.theme) {
        if (query.includes(t)) score += 2;
      }
      for (const line of poem.lines) {
        // 用户引用了某句诗
        if (line.length > 4 && query.includes(line.slice(0, 5))) score += 8;
      }
      if (poem.season && query.includes(poem.season)) score += 1;
      return { poem, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.poem);
}

export function formatPoemForPrompt(poem: PoemEntry): string {
  return `《${poem.title}》（${poem.dynasty}·${poem.author}）\n${poem.lines.join('\n')}`;
}
