// 精选古诗词知识库（原文锚定层）
// 智能体引用诗词时只允许逐字使用本库原文、拼音与英文释义，避免大模型凭记忆背错字/标错音。
// 面向国际儿童：每首诗附带拼音（朗读用）与儿童友好英文意译（理解用），均为人工校准。
// 选篇以幼小衔接/小学低段必背经典为主，均为公有领域文本。

export interface PoemEntry {
  id: string;
  title: string;
  titleEn: string; // 英文标题（意译）
  author: string;
  authorPinyin: string;
  dynasty: string;
  dynastyEn: string;
  lines: string[]; // 原文逐句
  pinyin: string[]; // 与 lines 一一对应的拼音
  english: string[]; // 与 lines 一一对应的儿童友好英文意译
  theme: string[]; // 主题标签（中文），用于关键词检索
  themeEn: string[]; // 主题标签（英文），用于英文输入检索
  season?: '春' | '夏' | '秋' | '冬';
  solarTerm?: string; // 关联节气/节日
  kidNote: string; // 一句儿童白话导读（中文）
  kidNoteEn: string; // 一句儿童导读（英文）
  visualKeywords: string[]; // 画面意象，用于场景生成
}

export const poetryLibrary: PoemEntry[] = [
  {
    id: 'chunxiao',
    title: '春晓',
    titleEn: 'Spring Morning',
    author: '孟浩然',
    authorPinyin: 'Mèng Hàorán',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
    pinyin: [
      'chūn mián bù jué xiǎo, chù chù wén tí niǎo.',
      'yè lái fēng yǔ shēng, huā luò zhī duō shǎo.',
    ],
    english: [
      'Sleeping in spring, I missed the dawn; birds are singing everywhere.',
      'Last night I heard wind and rain — how many flowers fell?',
    ],
    theme: ['春天', '小鸟', '花', '下雨', '睡觉'],
    themeEn: ['spring', 'bird', 'flower', 'rain', 'sleep'],
    season: '春',
    solarTerm: '春分',
    kidNote: '春天睡得香，醒来听见小鸟叫，想起昨晚的风雨，不知吹落了多少花瓣。',
    kidNoteEn: 'A cozy spring sleep, birdsong at dawn, and a gentle wonder about the flowers after rain.',
    visualKeywords: ['清晨', '啼鸟', '落花', '春雨初歇', '窗前'],
  },
  {
    id: 'yongliu',
    title: '咏柳',
    titleEn: 'Ode to the Willow',
    author: '贺知章',
    authorPinyin: 'Hè Zhīzhāng',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['碧玉妆成一树高，万条垂下绿丝绦。', '不知细叶谁裁出，二月春风似剪刀。'],
    pinyin: [
      'bì yù zhuāng chéng yī shù gāo, wàn tiáo chuí xià lǜ sī tāo.',
      'bù zhī xì yè shuí cái chū, èr yuè chūn fēng sì jiǎn dāo.',
    ],
    english: [
      'The tall willow looks dressed in green jade, with thousands of silky ribbons hanging down.',
      'Who cut out these fine leaves? The spring wind of February — sharp as scissors!',
    ],
    theme: ['柳树', '春风', '春天'],
    themeEn: ['willow', 'spring wind', 'spring'],
    season: '春',
    solarTerm: '立春',
    kidNote: '柳树像碧玉打扮的姑娘，春风像剪刀，裁出了细细的柳叶。',
    kidNoteEn: 'The willow is dressed like a lady in jade, and the spring wind is the scissors that cut her leaves.',
    visualKeywords: ['垂柳', '嫩绿柳条', '春风', '河岸'],
  },
  {
    id: 'cunju',
    title: '村居',
    titleEn: 'Village Life',
    author: '高鼎',
    authorPinyin: 'Gāo Dǐng',
    dynasty: '清',
    dynastyEn: 'Qing Dynasty',
    lines: ['草长莺飞二月天，拂堤杨柳醉春烟。', '儿童散学归来早，忙趁东风放纸鸢。'],
    pinyin: [
      'cǎo zhǎng yīng fēi èr yuè tiān, fú dī yáng liǔ zuì chūn yān.',
      'ér tóng sàn xué guī lái zǎo, máng chèn dōng fēng fàng zhǐ yuān.',
    ],
    english: [
      'Grass grows and orioles fly in the second month; willows by the bank sway in the spring mist.',
      'Children come home early from school, hurrying to fly kites on the east wind.',
    ],
    theme: ['风筝', '春天', '儿童', '柳树'],
    themeEn: ['kite', 'spring', 'children', 'willow'],
    season: '春',
    solarTerm: '雨水',
    kidNote: '小草长高了，黄莺飞来了，小朋友放学早，赶紧趁着东风放风筝！',
    kidNoteEn: 'Spring is here — grass, birds, and kids rushing out after school to fly kites in the wind!',
    visualKeywords: ['放风筝的孩子', '杨柳', '春烟', '田野'],
  },
  {
    id: 'qingming',
    title: '清明',
    titleEn: 'Qingming Festival',
    author: '杜牧',
    authorPinyin: 'Dù Mù',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['清明时节雨纷纷，路上行人欲断魂。', '借问酒家何处有，牧童遥指杏花村。'],
    pinyin: [
      'qīng míng shí jié yǔ fēn fēn, lù shàng xíng rén yù duàn hún.',
      'jiè wèn jiǔ jiā hé chù yǒu, mù tóng yáo zhǐ xìng huā cūn.',
    ],
    english: [
      'Around Qingming, a soft drizzle keeps falling; travelers on the road feel heavy-hearted.',
      'Asking where an inn might be, a little cowherd points far away — to Apricot Blossom Village.',
    ],
    theme: ['清明', '下雨', '牧童', '杏花'],
    themeEn: ['qingming', 'rain', 'cowherd', 'apricot blossom'],
    season: '春',
    solarTerm: '清明',
    kidNote: '清明前后总爱下小雨，牧童指着远处开满杏花的小村庄。',
    kidNoteEn: 'It often drizzles around Qingming; a cowherd points to a village full of apricot blossoms.',
    visualKeywords: ['细雨', '牧童骑牛', '杏花村', '田间小路', '斜风细雨'],
  },
  {
    id: 'xiaochi',
    title: '小池',
    titleEn: 'The Little Pond',
    author: '杨万里',
    authorPinyin: 'Yáng Wànlǐ',
    dynasty: '宋',
    dynastyEn: 'Song Dynasty',
    lines: ['泉眼无声惜细流，树阴照水爱晴柔。', '小荷才露尖尖角，早有蜻蜓立上头。'],
    pinyin: [
      'quán yǎn wú shēng xī xì liú, shù yīn zhào shuǐ ài qíng róu.',
      'xiǎo hé cái lù jiān jiān jiǎo, zǎo yǒu qīng tíng lì shàng tóu.',
    ],
    english: [
      'A quiet spring lets water trickle gently; tree shadows love the soft sunny pond.',
      'A little lotus bud just shows its pointy tip — and a dragonfly is already standing on it!',
    ],
    theme: ['荷花', '蜻蜓', '夏天', '池塘'],
    themeEn: ['lotus', 'dragonfly', 'summer', 'pond'],
    season: '夏',
    solarTerm: '小满',
    kidNote: '小荷叶刚刚露出尖尖角，蜻蜓就飞来站在上面啦！',
    kidNoteEn: 'The baby lotus just poked out its tip, and a dragonfly already landed on it!',
    visualKeywords: ['小荷尖角', '蜻蜓', '池塘', '树荫', '晴日柔光'],
  },
  {
    id: 'xiaochu-jingci',
    title: '晓出净慈寺送林子方',
    titleEn: 'West Lake in June',
    author: '杨万里',
    authorPinyin: 'Yáng Wànlǐ',
    dynasty: '宋',
    dynastyEn: 'Song Dynasty',
    lines: ['毕竟西湖六月中，风光不与四时同。', '接天莲叶无穷碧，映日荷花别样红。'],
    pinyin: [
      'bì jìng xī hú liù yuè zhōng, fēng guāng bù yǔ sì shí tóng.',
      'jiē tiān lián yè wú qióng bì, yìng rì hé huā bié yàng hóng.',
    ],
    english: [
      'West Lake in June is truly special — its scenery is like no other season.',
      'Lotus leaves reach the sky in endless green; lotus flowers glow extra red in the sun.',
    ],
    theme: ['荷花', '西湖', '夏天', '莲叶'],
    themeEn: ['lotus', 'west lake', 'summer', 'lotus leaves'],
    season: '夏',
    solarTerm: '小暑',
    kidNote: '六月的西湖，莲叶绿到天边，荷花被太阳照得特别红。',
    kidNoteEn: 'In June at West Lake, green lotus leaves stretch to the sky and the flowers shine red in the sun.',
    visualKeywords: ['接天莲叶', '映日荷花', '西湖', '盛夏晨光'],
  },
  {
    id: 'suojian',
    title: '所见',
    titleEn: 'What I Saw',
    author: '袁枚',
    authorPinyin: 'Yuán Méi',
    dynasty: '清',
    dynastyEn: 'Qing Dynasty',
    lines: ['牧童骑黄牛，歌声振林樾。', '意欲捕鸣蝉，忽然闭口立。'],
    pinyin: [
      'mù tóng qí huáng niú, gē shēng zhèn lín yuè.',
      'yì yù bǔ míng chán, hū rán bì kǒu lì.',
    ],
    english: [
      'A cowherd rides his ox, his song ringing through the woods.',
      'Wanting to catch a singing cicada, he suddenly shuts his mouth and stands still.',
    ],
    theme: ['牧童', '蝉', '夏天', '黄牛'],
    themeEn: ['cowherd', 'cicada', 'summer', 'ox'],
    season: '夏',
    solarTerm: '大暑',
    kidNote: '牧童唱着歌骑黄牛，想抓树上的蝉，马上闭紧嘴巴站住了。',
    kidNoteEn: 'A singing cowherd spots a cicada — and instantly goes quiet to sneak up on it.',
    visualKeywords: ['牧童骑牛', '树林', '鸣蝉', '夏日午后'],
  },
  {
    id: 'xiaoer-chuidiao',
    title: '小儿垂钓',
    titleEn: 'The Little Angler',
    author: '胡令能',
    authorPinyin: 'Hú Lìngnéng',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['蓬头稚子学垂纶，侧坐莓苔草映身。', '路人借问遥招手，怕得鱼惊不应人。'],
    pinyin: [
      'péng tóu zhì zǐ xué chuí lún, cè zuò méi tái cǎo yìng shēn.',
      'lù rén jiè wèn yáo zhāo shǒu, pà dé yú jīng bù yìng rén.',
    ],
    english: [
      'A messy-haired child learns to fish, sitting side-on in the moss, half-hidden by grass.',
      'When a passerby asks the way, he only waves — afraid to scare the fish, he says nothing.',
    ],
    theme: ['钓鱼', '儿童', '夏天'],
    themeEn: ['fishing', 'children', 'summer'],
    season: '夏',
    solarTerm: '夏至',
    kidNote: '小娃娃学钓鱼，怕吓跑小鱼，连话都不敢回答呢。',
    kidNoteEn: 'The little angler is so careful not to scare the fish that he won’t even talk!',
    visualKeywords: ['垂钓孩童', '河边青苔', '草丛', '安静的水面'],
  },
  {
    id: 'shanxing',
    title: '山行',
    titleEn: 'A Mountain Walk',
    author: '杜牧',
    authorPinyin: 'Dù Mù',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['远上寒山石径斜，白云生处有人家。', '停车坐爱枫林晚，霜叶红于二月花。'],
    pinyin: [
      'yuǎn shàng hán shān shí jìng xié, bái yún shēng chù yǒu rén jiā.',
      'tíng chē zuò ài fēng lín wǎn, shuāng yè hóng yú èr yuè huā.',
    ],
    english: [
      'A stone path winds up the cool mountain; homes appear where white clouds rise.',
      'I stop my carriage to admire the maple woods at dusk — frosted leaves redder than spring flowers.',
    ],
    theme: ['枫叶', '秋天', '霜', '山'],
    themeEn: ['maple', 'autumn', 'frost', 'mountain'],
    season: '秋',
    solarTerm: '霜降',
    kidNote: '秋天的枫叶被霜一打，比春天的花还要红！',
    kidNoteEn: 'After the frost, autumn maple leaves turn even redder than spring flowers!',
    visualKeywords: ['红枫林', '山间石径', '白云', '山中人家', '夕照'],
  },
  {
    id: 'jiuyuejiuri',
    title: '九月九日忆山东兄弟',
    titleEn: 'Missing My Brothers on Double Ninth Day',
    author: '王维',
    authorPinyin: 'Wáng Wéi',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['独在异乡为异客，每逢佳节倍思亲。', '遥知兄弟登高处，遍插茱萸少一人。'],
    pinyin: [
      'dú zài yì xiāng wéi yì kè, měi féng jiā jié bèi sī qīn.',
      'yáo zhī xiōng dì dēng gāo chù, biàn chā zhū yú shǎo yī rén.',
    ],
    english: [
      'Alone in a faraway land, I miss my family even more on festival days.',
      'I know my brothers are climbing the hills, wearing dogwood — with one person missing: me.',
    ],
    theme: ['重阳', '思念', '登高', '茱萸', '秋天'],
    themeEn: ['double ninth', 'missing family', 'hiking', 'autumn'],
    season: '秋',
    solarTerm: '重阳节',
    kidNote: '重阳节要登高、插茱萸，诗人在远方想念家里的亲人。',
    kidNoteEn: 'On Double Ninth Day people climb hills together; the poet, far from home, misses his family.',
    visualKeywords: ['登高远眺', '茱萸', '秋日山峰', '思乡'],
  },
  {
    id: 'fengqiao-yebo',
    title: '枫桥夜泊',
    titleEn: 'Night Mooring by Maple Bridge',
    author: '张继',
    authorPinyin: 'Zhāng Jì',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['月落乌啼霜满天，江枫渔火对愁眠。', '姑苏城外寒山寺，夜半钟声到客船。'],
    pinyin: [
      'yuè luò wū tí shuāng mǎn tiān, jiāng fēng yú huǒ duì chóu mián.',
      'gū sū chéng wài hán shān sì, yè bàn zhōng shēng dào kè chuán.',
    ],
    english: [
      'The moon sets, crows caw, frost fills the sky; by riverside maples and fishing lights, I lie sleepless.',
      'From Hanshan Temple outside Suzhou, the midnight bell reaches my boat.',
    ],
    theme: ['秋天', '霜', '月亮', '枫树', '夜晚'],
    themeEn: ['autumn', 'frost', 'moon', 'maple', 'night'],
    season: '秋',
    solarTerm: '霜降',
    kidNote: '秋夜的江边，月亮落下、霜气满天，远处传来寺庙的钟声。',
    kidNoteEn: 'On a frosty autumn night by the river, a faraway temple bell rings through the dark.',
    visualKeywords: ['江枫', '渔火', '客船', '秋夜', '古寺钟声'],
  },
  {
    id: 'jingyesi',
    title: '静夜思',
    titleEn: 'Thoughts on a Quiet Night',
    author: '李白',
    authorPinyin: 'Lǐ Bái',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
    pinyin: [
      'chuáng qián míng yuè guāng, yí shì dì shàng shuāng.',
      'jǔ tóu wàng míng yuè, dī tóu sī gù xiāng.',
    ],
    english: [
      'Bright moonlight before my bed — I thought it was frost on the ground.',
      'I look up at the bright moon, then lower my head, thinking of home.',
    ],
    theme: ['月亮', '思念', '中秋', '夜晚'],
    themeEn: ['moon', 'homesick', 'mid-autumn', 'night'],
    season: '秋',
    solarTerm: '中秋节',
    kidNote: '月光洒在床前像霜一样白，抬头看月亮，就想起了家乡。',
    kidNoteEn: 'The moonlight looks like frost; looking at the moon makes the poet think of home.',
    visualKeywords: ['明月', '月光如霜', '窗前', '安静的夜'],
  },
  {
    id: 'jiangxue',
    title: '江雪',
    titleEn: 'River Snow',
    author: '柳宗元',
    authorPinyin: 'Liǔ Zōngyuán',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'],
    pinyin: [
      'qiān shān niǎo fēi jué, wàn jìng rén zōng miè.',
      'gū zhōu suō lì wēng, dú diào hán jiāng xuě.',
    ],
    english: [
      'No birds fly over the thousand mountains; no footprints on the ten thousand paths.',
      'One old man in a straw cape, alone in a little boat, fishing in the snowy river.',
    ],
    theme: ['雪', '冬天', '钓鱼', '江'],
    themeEn: ['snow', 'winter', 'fishing', 'river'],
    season: '冬',
    solarTerm: '大雪',
    kidNote: '大雪天里，一位老爷爷穿着蓑衣，独自在江上钓鱼。',
    kidNoteEn: 'In the falling snow, one old grandpa fishes all alone on the quiet river.',
    visualKeywords: ['孤舟', '蓑笠翁', '寒江', '漫天飞雪', '空寂群山'],
  },
  {
    id: 'meihua',
    title: '梅花',
    titleEn: 'Plum Blossoms',
    author: '王安石',
    authorPinyin: 'Wáng Ānshí',
    dynasty: '宋',
    dynastyEn: 'Song Dynasty',
    lines: ['墙角数枝梅，凌寒独自开。', '遥知不是雪，为有暗香来。'],
    pinyin: [
      'qiáng jiǎo shù zhī méi, líng hán dú zì kāi.',
      'yáo zhī bù shì xuě, wèi yǒu àn xiāng lái.',
    ],
    english: [
      'A few plum branches by the wall bloom all alone in the cold.',
      'From far away I know they are not snow — a secret sweet scent drifts over.',
    ],
    theme: ['梅花', '冬天', '雪', '香'],
    themeEn: ['plum blossom', 'winter', 'snow', 'fragrance'],
    season: '冬',
    solarTerm: '小寒',
    kidNote: '墙角的梅花不怕冷，远远就能闻到淡淡的香味，所以知道那不是雪。',
    kidNoteEn: 'Brave plum flowers bloom in the cold — you can tell they’re not snow by their sweet smell.',
    visualKeywords: ['墙角梅枝', '白梅', '残雪', '寒冬清晨'],
  },
  {
    id: 'yuanri',
    title: '元日',
    titleEn: 'New Year’s Day',
    author: '王安石',
    authorPinyin: 'Wáng Ānshí',
    dynasty: '宋',
    dynastyEn: 'Song Dynasty',
    lines: ['爆竹声中一岁除，春风送暖入屠苏。', '千门万户曈曈日，总把新桃换旧符。'],
    pinyin: [
      'bào zhú shēng zhōng yī suì chú, chūn fēng sòng nuǎn rù tú sū.',
      'qiān mén wàn hù tóng tóng rì, zǒng bǎ xīn táo huàn jiù fú.',
    ],
    english: [
      'Firecrackers crackle as the old year ends; spring wind brings warmth to the New Year wine.',
      'The rising sun shines on every home, and everyone hangs new lucky charms for old.',
    ],
    theme: ['春节', '过年', '爆竹', '春联'],
    themeEn: ['spring festival', 'chinese new year', 'firecracker', 'couplets'],
    season: '冬',
    solarTerm: '春节',
    kidNote: '过年啦！放爆竹、喝屠苏酒、换上新的春联，家家户户亮堂堂。',
    kidNoteEn: 'It’s Chinese New Year! Firecrackers, festive wine, and brand-new red couplets on every door.',
    visualKeywords: ['红灯笼', '春联', '爆竹', '朝阳', '家家户户'],
  },
  {
    id: 'minnong',
    title: '悯农（其二）',
    titleEn: 'Pity the Farmers',
    author: '李绅',
    authorPinyin: 'Lǐ Shēn',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['锄禾日当午，汗滴禾下土。', '谁知盘中餐，粒粒皆辛苦。'],
    pinyin: [
      'chú hé rì dāng wǔ, hàn dī hé xià tǔ.',
      'shuí zhī pán zhōng cān, lì lì jiē xīn kǔ.',
    ],
    english: [
      'Hoeing under the noon sun, sweat drips onto the soil below the seedlings.',
      'Do you know? Every grain of rice on your plate comes from hard, hard work.',
    ],
    theme: ['农事', '粮食', '珍惜', '夏天'],
    themeEn: ['farming', 'food', 'gratitude', 'summer'],
    season: '夏',
    solarTerm: '芒种',
    kidNote: '农民伯伯顶着大太阳种地，每一粒粮食都来得不容易，要珍惜哦。',
    kidNoteEn: 'Farmers work under the hot sun — every grain of rice is precious, so don’t waste food!',
    visualKeywords: ['农田', '烈日', '锄地的农人', '禾苗'],
  },
  {
    id: 'denguanquelou',
    title: '登鹳雀楼',
    titleEn: 'Climbing Stork Tower',
    author: '王之涣',
    authorPinyin: 'Wáng Zhīhuàn',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'],
    pinyin: [
      'bái rì yī shān jìn, huáng hé rù hǎi liú.',
      'yù qióng qiān lǐ mù, gèng shàng yī céng lóu.',
    ],
    english: [
      'The white sun sets behind the mountains; the Yellow River flows to the sea.',
      'To see a thousand miles farther, climb one more floor!',
    ],
    theme: ['黄河', '登高', '励志', '太阳'],
    themeEn: ['yellow river', 'climbing', 'inspiration', 'sun'],
    kidNote: '想看得更远，就要再登上一层楼——学习也是这样呀。',
    kidNoteEn: 'To see farther, climb higher — learning works the same way!',
    visualKeywords: ['落日群山', '黄河奔流', '高楼远眺'],
  },
  {
    id: 'wanglushan',
    title: '望庐山瀑布',
    titleEn: 'Watching the Lushan Waterfall',
    author: '李白',
    authorPinyin: 'Lǐ Bái',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['日照香炉生紫烟，遥看瀑布挂前川。', '飞流直下三千尺，疑是银河落九天。'],
    pinyin: [
      'rì zhào xiāng lú shēng zǐ yān, yáo kàn pù bù guà qián chuān.',
      'fēi liú zhí xià sān qiān chǐ, yí shì yín hé luò jiǔ tiān.',
    ],
    english: [
      'Sunlight on Incense Burner Peak makes purple mist; far off, a waterfall hangs like a ribbon.',
      'It plunges three thousand feet — like the Milky Way falling from the sky!',
    ],
    theme: ['瀑布', '山', '夏天', '银河'],
    themeEn: ['waterfall', 'mountain', 'summer', 'milky way'],
    season: '夏',
    kidNote: '瀑布从高高的山上冲下来，像银河从天上掉下来一样壮观！',
    kidNoteEn: 'The waterfall rushes down the mountain like the Milky Way pouring from the sky!',
    visualKeywords: ['飞瀑', '紫烟缭绕', '青山', '水雾'],
  },
  {
    id: 'jueju-huangli',
    title: '绝句',
    titleEn: 'A Quatrain',
    author: '杜甫',
    authorPinyin: 'Dù Fǔ',
    dynasty: '唐',
    dynastyEn: 'Tang Dynasty',
    lines: ['两个黄鹂鸣翠柳，一行白鹭上青天。', '窗含西岭千秋雪，门泊东吴万里船。'],
    pinyin: [
      'liǎng gè huáng lí míng cuì liǔ, yī háng bái lù shàng qīng tiān.',
      'chuāng hán xī lǐng qiān qiū xuě, mén bó dōng wú wàn lǐ chuán.',
    ],
    english: [
      'Two orioles sing in the green willow; a line of white egrets rises into the blue sky.',
      'My window frames the western peaks’ ancient snow; by my door moor boats from ten thousand miles away.',
    ],
    theme: ['黄鹂', '白鹭', '春天', '雪山', '柳树'],
    themeEn: ['oriole', 'egret', 'spring', 'snow mountain', 'willow'],
    season: '春',
    solarTerm: '春分',
    kidNote: '窗外有唱歌的黄鹂、飞上蓝天的白鹭，还能看见远处的雪山。',
    kidNoteEn: 'Singing orioles, flying egrets, and faraway snowy mountains — all from one window!',
    visualKeywords: ['黄鹂翠柳', '白鹭青天', '远山积雪', '江边船只'],
  },
  {
    id: 'jiangnan',
    title: '江南',
    titleEn: 'Jiangnan (South of the River)',
    author: '汉乐府',
    authorPinyin: 'Hàn Yuèfǔ (Han folk song)',
    dynasty: '汉',
    dynastyEn: 'Han Dynasty',
    lines: [
      '江南可采莲，莲叶何田田。',
      '鱼戏莲叶间。',
      '鱼戏莲叶东，鱼戏莲叶西，鱼戏莲叶南，鱼戏莲叶北。',
    ],
    pinyin: [
      'jiāng nán kě cǎi lián, lián yè hé tián tián.',
      'yú xì lián yè jiān.',
      'yú xì lián yè dōng, yú xì lián yè xī, yú xì lián yè nán, yú xì lián yè běi.',
    ],
    english: [
      'In Jiangnan we pick lotus; how lush and full the lotus leaves are!',
      'Fish play among the lotus leaves.',
      'Fish play east of the leaves, west of the leaves, south of the leaves, north of the leaves.',
    ],
    theme: ['采莲', '莲叶', '鱼', '夏天', '江南'],
    themeEn: ['lotus picking', 'lotus leaves', 'fish', 'summer', 'jiangnan'],
    season: '夏',
    solarTerm: '大暑',
    kidNote: '江南的莲叶挨挨挤挤，小鱼在莲叶间游来游去，多快活！',
    kidNoteEn: 'Among the crowded lotus leaves of Jiangnan, happy little fish dart east, west, south, and north!',
    visualKeywords: ['采莲小船', '田田莲叶', '游鱼', '江南水乡'],
  },
];

// 关键词检索：匹配题目/作者/原文/主题（中英）/节气，按命中数排序
export function searchPoems(query: string, limit = 3): PoemEntry[] {
  const lowerQuery = query.toLowerCase();
  const scored = poetryLibrary
    .map((poem) => {
      let score = 0;
      if (query.includes(poem.title)) score += 10;
      if (lowerQuery.includes(poem.titleEn.toLowerCase())) score += 10;
      if (query.includes(poem.author)) score += 5;
      if (poem.solarTerm && query.includes(poem.solarTerm)) score += 4;
      for (const t of poem.theme) {
        if (query.includes(t)) score += 2;
      }
      for (const t of poem.themeEn) {
        if (lowerQuery.includes(t)) score += 2;
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

// 供系统提示词注入：原文 + 拼音 + 英文意译，全部来自人工校准数据
export function formatPoemForPrompt(poem: PoemEntry): string {
  const body = poem.lines
    .map((line, i) => `${line}\n  [拼音] ${poem.pinyin[i]}\n  [English] ${poem.english[i]}`)
    .join('\n');
  return `《${poem.title}》/ "${poem.titleEn}"（${poem.dynasty}·${poem.author} / ${poem.dynastyEn}, ${poem.authorPinyin}）\n${body}`;
}
