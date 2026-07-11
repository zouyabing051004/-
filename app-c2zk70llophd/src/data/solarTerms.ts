// 二十四节气完整数据
export interface PhenologyKid {
  raw: string;   // 三候原文
  kids: string;  // 儿童通俗解说
  illustration: string; // 插画描述
}

export interface FolkCustoms {
  north: { eat: string; do: string };
  south: { eat: string; do: string };
  kidsExplain: string; // 儿童通俗解说
}

export interface SolarTerm {
  id: string;
  name: string;
  season: '春' | '夏' | '秋' | '冬';
  date: string;
  month: number;
  day: number;
  imageUrl?: string;
  climate: string;
  phenology: string;
  phenologyKids?: PhenologyKid[]; // 三候儿童通俗解说
  folkCustoms?: FolkCustoms;      // 南北民俗
  customs: {
    eat: string;
    do: string;
    wear: string;
  };
  story: {
    title: string;
    content: string;
  };
  poem: {
    title: string;
    author: string;
    content: string;
    annotation?: string;  // 字词注解
    readingTip?: string;  // 朗诵提示
  };
  keywords: string[];
}

export const solarTerms: SolarTerm[] = [
  {
    id: 'lichun',
    name: '立春',
    season: '春',
    date: '2月3日-5日',
    month: 2,
    day: 4,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8f7c1158-02c0-49fb-aa92-352787d2f8a5.jpg',
    climate: '东风解冻，万物复苏，气温开始回升',
    phenology: '一候东风解冻，二候蛰虫始振，三候鱼陟负冰',
    customs: {
      eat: '春饼、春卷、萝卜，寓意"咬春"',
      do: '贴春联、迎春、打春牛',
      wear: '穿红色或亮色衣物，迎接新春'
    },
    story: {
      title: '立春迎春的由来',
      content: '很久以前，立春这天，人们会举行盛大的迎春仪式。传说中，春神句芒会在这一天驾着春风来到人间，唤醒沉睡的大地。人们用彩纸做成小牛，叫做"春牛"，抬着它走街串巷，祈求新的一年五谷丰登。这个习俗一直流传到今天，提醒我们春天来了，要珍惜时光，努力耕耘。'
    },
    phenologyKids: [
      { raw: '一候东风解冻', kids: '东风像温暖的小手，把河面的冰块慢慢吹化啦！', illustration: '卡通：风精灵吹碎冰块；写实：融化的河面' },
      { raw: '二候蛰虫始振', kids: '土里的小虫子伸懒腰，睡醒了要出来玩耍咯！', illustration: '卡通：小虫打哈欠；写实：土中蚯蚓' },
      { raw: '三候鱼陟负冰', kids: '小鱼游到冰面下面，好像头顶着一块透明的玻璃！', illustration: '卡通：小鱼头顶冰块；写实：冰下游鱼' },
    ],
    folkCustoms: {
      north: { eat: '春饼、萝卜，"咬春"迎新', do: '打春牛，提醒大家春耕开始啦' },
      south: { eat: '春卷，炸得金黄香脆', do: '贴宜春字，祈求新年平安顺遂' },
      kidsExplain: '春牛提醒大家种地；春饼、萝卜香香，咬一口就咬住了整个春天！',
    },
    poem: {
      title: '立春',
      author: '白玉蟾（宋）',
      content: '东风吹散梅梢雪，一夜挽回天下春。从此阳春应有脚，百花富贵草精神。',
      annotation: '梅梢=梅花枝头；挽回=迎来；阳春=温暖的春天',
      readingTip: '欢快活泼，读出春天到来的惊喜感',
    },
    keywords: ['春天', '复苏', '春饼', '迎春']
  },
  {
    id: 'yushui',
    name: '雨水',
    season: '春',
    date: '2月18日-20日',
    month: 2,
    day: 19,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b6c55e29-3261-4370-8826-7887bca45726.jpg',
    climate: '降雨开始增多，气温回升较快',
    phenology: '一候獭祭鱼，二候鸿雁来，三候草木萌动',
    customs: {
      eat: '龙须饼、爆米花、红枣粥',
      do: '回娘屋、拉保保（认干爹）',
      wear: '穿轻薄外套，注意保暖防潮'
    },
    story: {
      title: '雨水润万物',
      content: '雨水节气，春雨绵绵，滋润着大地。古人说"春雨贵如油"，因为这个时候的雨水对庄稼的生长特别重要。传说龙王会在雨水节气这天，把天上的甘露洒向人间，让干渴的土地喝饱水。农民伯伯们看到春雨落下，就知道播种的好时候到了。'
    },
    phenologyKids: [
      { raw: '一候獭祭鱼', kids: '水獭把抓到的鱼摆成一排，像在请客吃饭！', illustration: '卡通：水獭摆鱼宴；写实：溪边水獭' },
      { raw: '二候鸿雁来', kids: '大雁排着队从南方飞回来，一会儿排成"一"字，一会儿排成"人"字！', illustration: '卡通：雁群飞翔编队；写实：雁阵蓝天' },
      { raw: '三候草木萌动', kids: '小草小树悄悄冒出了绿色嫩芽，春天真的来了！', illustration: '卡通：嫩芽从土里冒出来微笑；写实：春芽特写' },
    ],
    folkCustoms: {
      north: { eat: '爆米花和龙须饼，香脆好吃', do: '"拉保保"认干亲，祈求孩子健康' },
      south: { eat: '红枣粥和汤圆，甜甜糯糯', do: '回娘家，女儿带礼物回娘家探望父母' },
      kidsExplain: '南方小朋友吃汤圆，北方小朋友吃爆米花，大家都盼着春雨来哦！',
    },
    poem: {
      title: '春夜喜雨',
      author: '杜甫（唐）',
      content: '好雨知时节，当春乃发生。随风潜入夜，润物细无声。',
      annotation: '知时节=懂得时机；乃=就；潜=悄悄地；润物=滋润万物',
      readingTip: '声音轻柔，读出春雨悄悄来临的温柔感',
    },
    keywords: ['春雨', '播种', '润物']
  },
  {
    id: 'jingzhe',
    name: '惊蛰',
    season: '春',
    date: '3月5日-7日',
    month: 3,
    day: 6,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_fa1c490f-f249-46b6-b72c-63adbb8684b0.jpg',
    climate: '春雷始鸣，气温回升，昆虫惊醒',
    phenology: '一候桃始华，二候仓庚鸣，三候鹰化为鸠',
    customs: {
      eat: '梨子、炒豆、鸡蛋',
      do: '祭白虎、打小人、吃梨润肺',
      wear: '穿轻薄春装，注意防风'
    },
    story: {
      title: '惊蛰雷声唤醒万物',
      content: '惊蛰这天，天上会响起第一声春雷。传说雷神会敲响天鼓，"轰隆隆"的雷声把冬眠的小动物们都叫醒了。小青蛙从泥里钻出来，小蛇从洞里爬出来，小虫子们也纷纷探出头来。古人认为，惊蛰的雷声是老天爷在提醒大家：春天真的来了，快快起床干活吧！'
    },
    phenologyKids: [
      { raw: '一候桃始华', kids: '桃树开满了粉红色的花，像给大地穿上了花裙子！', illustration: '卡通：桃树开花；写实：桃花特写' },
      { raw: '二候仓庚鸣', kids: '黄鹂鸟叫声"叽叽喳喳"，在枝头唱春天的歌！', illustration: '卡通：黄鹂鸟张嘴唱歌；写实：黄鹂树枝' },
      { raw: '三候鹰化为鸠', kids: '老鹰躲起来孵小鸟，到处都能听到布谷鸟的叫声！', illustration: '卡通：鹰变成布谷鸟；写实：布谷鸟' },
    ],
    folkCustoms: {
      north: { eat: '梨子，吃梨润肺防干燥', do: '打小人，贴符咒，驱走霉运' },
      south: { eat: '炒豆，炒得香脆叫"炒虫"', do: '祭白虎，祈求出入平安' },
      kidsExplain: '惊蛰吃梨是为了润润嗓子，因为春雷把空气都震干了！',
    },
    poem: {
      title: '观田家',
      author: '韦应物（唐）',
      content: '微雨众卉新，一雷惊蛰始。田家几日闲，耕种从此起。',
      annotation: '众卉=所有花草；卉新=长出新芽；田家=农家；从此起=从这时开始',
      readingTip: '前两句轻读，最后一句加重语气，体会农家开始忙碌的感觉',
    },
    keywords: ['春雷', '虫醒', '桃花']
  },
  {
    id: 'chunfen',
    name: '春分',
    season: '春',
    date: '3月20日-22日',
    month: 3,
    day: 21,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0ac7acdc-290c-4366-923b-e4250618d9dc.jpg',
    climate: '昼夜平分，春暖花开',
    phenology: '一候玄鸟至，二候雷乃发声，三候始电',
    customs: {
      eat: '春菜、汤圆、驴打滚',
      do: '竖蛋、放风筝、踏青',
      wear: '穿舒适春装，适合户外活动'
    },
    story: {
      title: '春分竖蛋的传说',
      content: '春分这天，白天和黑夜一样长。传说在春分这天，地球的引力最平衡，鸡蛋最容易竖起来。每年春分，全世界很多人都会玩"竖蛋"游戏。据说，能在春分这天把鸡蛋竖起来的人，一整年都会有好运气呢！小朋友们，你也来试试吧！'
    },
    phenologyKids: [
      { raw: '一候玄鸟至', kids: '燕子从南方飞回来了，在屋檐下衔泥巴盖新家！', illustration: '卡通：燕子衔泥；写实：燕巢特写' },
      { raw: '二候雷乃发声', kids: '轰隆隆！天上的雷公开始打鼓了，不要怕！', illustration: '卡通：雷公打鼓；写实：乌云闪电' },
      { raw: '三候始电', kids: '天上出现了明亮的闪电，像照相机的闪光灯！', illustration: '卡通：闪电划过夜空；写实：闪电照亮云层' },
    ],
    folkCustoms: {
      north: { eat: '驴打滚（豆面糕），香甜黏糯', do: '竖蛋游戏，看谁能把鸡蛋站起来' },
      south: { eat: '春菜，用野菜做的"春汤"', do: '放风筝，祈求消灾去病' },
      kidsExplain: '春分竖蛋最有趣！因为今天白天和黑夜一样长，地球最平衡，鸡蛋最容易站稳！',
    },
    poem: {
      title: '春分日',
      author: '徐铉（五代）',
      content: '仲春初四日，春色正中分。绿野徘徊月，晴天断续云。',
      annotation: '仲春=春季中间；中分=平分；徘徊=慢慢移动；断续=时隐时现',
      readingTip: '语速舒缓，读出春色美好、悠然自在的感觉',
    },
    keywords: ['昼夜平分', '竖蛋', '风筝']
  },
  {
    id: 'qingming',
    name: '清明',
    season: '春',
    date: '4月4日-6日',
    month: 4,
    day: 5,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e33800d8-7cb0-4c8f-a74e-398906df3196.jpg',
    climate: '天气晴朗，草木繁茂',
    phenology: '一候桐始华，二候田鼠化为鴽，三候虹始见',
    customs: {
      eat: '青团、馓子、清明果',
      do: '扫墓祭祖、踏青郊游、插柳',
      wear: '穿轻便春装，适合郊游'
    },
    story: {
      title: '清明节的由来',
      content: '春秋时期，晋国公子重耳流亡在外，随臣介子推曾割肉为他充饥。后来重耳做了国君，想报答介子推，但介子推不愿做官，躲进了绵山。重耳放火烧山想逼他出来，没想到介子推被烧死在山上。重耳非常伤心，下令这一天禁止生火做饭，只能吃冷食，这就是"寒食节"。后来寒食节和清明合在一起，就成了我们现在的清明节。'
    },
    phenologyKids: [
      { raw: '一候桐始华', kids: '泡桐树开出了紫色的喇叭花，香香的，好漂亮！', illustration: '卡通：紫色喇叭花树；写实：泡桐花特写' },
      { raw: '二候田鼠化为鴽', kids: '田鼠躲进地下睡大觉，到处都能看到小鹌鹑出来玩！', illustration: '卡通：鹌鹑在草地跑；写实：鹌鹑草地' },
      { raw: '三候虹始见', kids: '下雨后天空出现了彩虹！七种颜色像彩色糖果！', illustration: '卡通：彩虹桥连天地；写实：雨后彩虹' },
    ],
    folkCustoms: {
      north: { eat: '馓子、清明果，香脆可口', do: '扫墓祭祖，感恩先人；插柳条，寓意生命延续' },
      south: { eat: '青团，用艾草汁做的绿色糯米团子，软软甜甜', do: '踏青郊游，荡秋千，放纸鸢' },
      kidsExplain: '清明是祭祖的日子，我们要记住爱我们的亲人；南方的青团绿色软糯，超好吃！',
    },
    poem: {
      title: '清明',
      author: '杜牧（唐）',
      content: '清明时节雨纷纷，路上行人欲断魂。借问酒家何处有，牧童遥指杏花村。',
      annotation: '纷纷=细细的；欲断魂=心情很难过；借问=请问；遥指=远远指向',
      readingTip: '前两句节奏稍慢带忧愁，后两句轻快，读出遇见牧童的惊喜',
    },
    keywords: ['扫墓', '踏青', '青团']
  },
  {
    id: 'guyu',
    name: '谷雨',
    season: '春',
    date: '4月19日-21日',
    month: 4,
    day: 20,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_514dc538-ff0d-460e-950f-191b5e8f2b19.jpg',
    climate: '雨量增多，适合谷物生长',
    phenology: '一候萍始生，二候鸣鸠拂其羽，三候戴胜降于桑',
    customs: {
      eat: '香椿、谷雨茶、菠菜',
      do: '赏牡丹、走谷雨、喝谷雨茶',
      wear: '穿舒适春装，注意防雨'
    },
    story: {
      title: '谷雨采茶的传说',
      content: '谷雨是春季最后一个节气。传说这天采的茶叶特别香，喝了能清火明目。古时候有个叫谷雨的年轻人，为了救乡亲们，勇敢地与恶龙搏斗，最后牺牲了自己。人们为了纪念他，就把这个节气叫做"谷雨"。每到谷雨，人们都会泡上一壶新茶，纪念这位勇敢的年轻人。'
    },
    phenologyKids: [
      { raw: '一候萍始生', kids: '池塘里的浮萍冒出来了，绿色小圆片漂在水上好可爱！', illustration: '卡通：浮萍漂水面；写实：池塘浮萍特写' },
      { raw: '二候鸣鸠拂其羽', kids: '布谷鸟用嘴梳理羽毛，发出"咕咕"的叫声呢！', illustration: '卡通：布谷鸟梳羽毛；写实：布谷鸟树枝' },
      { raw: '三候戴胜降于桑', kids: '戴胜鸟（头上有漂亮冠羽的鸟）飞到桑树上啦！', illustration: '卡通：戴冠鸟降落桑树；写实：戴胜鸟特写' },
    ],
    folkCustoms: {
      north: { eat: '香椿炒鸡蛋，香气扑鼻', do: '赏牡丹花，牡丹是谷雨的标志花' },
      south: { eat: '谷雨前采的新茶，清香好喝', do: '走谷雨：在田间散步祈求风调雨顺' },
      kidsExplain: '谷雨茶是一年里最香的茶！北方伯伯赏牡丹，南方伯伯采新茶，都是盼着好收成！',
    },
    poem: {
      title: '谷雨',
      author: '朱槔（宋）',
      content: '天点纷林际，虚檐写梦中。明朝知谷雨，无策禁花风。',
      annotation: '天点=细雨；林际=树林边；虚檐=空屋檐；明朝=明天；无策=没有办法',
      readingTip: '语气轻柔，想象自己站在屋檐下看春雨，慢慢地读',
    },
    keywords: ['采茶', '牡丹', '播种']
  },
  {
    id: 'lixia',
    name: '立夏',
    season: '夏',
    date: '5月5日-7日',
    month: 5,
    day: 6,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_341f9585-8d5a-4ff8-9fed-a2159d5eeb1f.jpg',
    climate: '温度明显升高，炎暑将临',
    phenology: '一候蝼蝈鸣，二候蚯蚓出，三候王瓜生',
    customs: {
      eat: '立夏蛋、立夏饭、蚕豆',
      do: '称体重、斗蛋、尝新',
      wear: '穿轻薄夏装，注意防晒'
    },
    story: {
      title: '立夏称体重的由来',
      content: '立夏这天，很多地方有"称人"的习俗。大人会把小孩子放在大秤上称一称体重，据说这样夏天就不会疰夏（就是夏天不想吃饭、变瘦的意思）。传说这个习俗和三国时期的刘备有关，他怕儿子刘禅在夏天变瘦，就在立夏这天称了体重，后来大家就都跟着做了。'
    },
    phenologyKids: [
      { raw: '一候蝼蝈鸣', kids: '蝼蛄和青蛙在田里"呱呱呱"地唱起了夏天的歌！', illustration: '卡通：青蛙合唱团；写实：田间蛙鸣' },
      { raw: '二候蚯蚓出', kids: '蚯蚓从土里钻出来啦，它是大地的"土壤小医生"！', illustration: '卡通：蚯蚓探头微笑；写实：雨后蚯蚓' },
      { raw: '三候王瓜生', kids: '王瓜藤子蹿出来了，绿绿的叶子爬满了篱笆！', illustration: '卡通：王瓜藤爬篱笆；写实：王瓜植株' },
    ],
    folkCustoms: {
      north: { eat: '立夏蛋，用红网兜挂在脖子上，超好玩', do: '称体重，看看一冬天胖了多少斤' },
      south: { eat: '嫩蚕豆，炒着吃或煮着吃都香', do: '斗蛋游戏，谁的蛋壳最硬谁赢！' },
      kidsExplain: '立夏蛋挂脖子上，不光能吃还能玩！斗蛋游戏是谁的蛋顶不碎谁厉害！',
    },
    poem: {
      title: '立夏',
      author: '陆游（宋）',
      content: '赤帝收春半，祝融送夏来。日斜汤沐罢，熟练试单衣。',
      annotation: '赤帝=春天的神；祝融=火神/夏天的神；汤沐=热水澡；单衣=薄衣服',
      readingTip: '语气欢快，第二句重音落在"夏来"，读出夏天到来的喜悦！',
    },
    keywords: ['夏天', '称体重', '立夏蛋']
  },
  {
    id: 'xiaoman',
    name: '小满',
    season: '夏',
    date: '5月20日-22日',
    month: 5,
    day: 21,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f46b56f0-6171-430e-bf80-b08c3a1b5c0a.jpg',
    climate: '夏熟作物籽粒开始饱满',
    phenology: '一候苦菜秀，二候靡草死，三候麦秋至',
    customs: {
      eat: '苦菜、麦糕、桑葚',
      do: '祭车神、祈蚕节、看麦梢黄',
      wear: '穿透气夏装，注意防暑'
    },
    story: {
      title: '小满不满，麦有一险',
      content: '小满的意思是"麦粒渐满，还未全满"。这个时候，田里的麦子开始鼓起来了，但还没有完全成熟。农民伯伯说"小满不满，麦有一险"，意思是如果这个时候不下雨，麦子就长不好。所以小满时节，大家都盼着下雨，让庄稼长得更好。小满告诉我们：做事要一步一步来，不要着急，慢慢就会变好的。'
    },
    phenologyKids: [
      { raw: '一候苦菜秀', kids: '苦菜长高啦，虽然有点苦，却是最好的天然野菜！', illustration: '卡通：苦菜开黄花；写实：苦菜田野' },
      { raw: '二候靡草死', kids: '那些怕热的小草开始枯萎了，好像热晕了一样！', illustration: '卡通：小草晒蔫了；写实：枯草特写' },
      { raw: '三候麦秋至', kids: '麦子熟了！金黄金黄的，是丰收的颜色！', illustration: '卡通：麦穗金黄弯腰；写实：麦田收割' },
    ],
    folkCustoms: {
      north: { eat: '麦糕和桑葚，麦香果甜', do: '祈蚕节，感谢蚕宝宝给我们提供丝绸' },
      south: { eat: '苦菜，清热解暑；青梅酒，酸酸甜甜', do: '看麦梢黄，亲戚间互相走动庆丰收' },
      kidsExplain: '小满麦子黄了一半，农民伯伯最高兴！南方小朋友吃苦菜败火，酸梅汤超解渴！',
    },
    poem: {
      title: '小满',
      author: '欧阳修（宋）',
      content: '夜莺啼绿柳，皓月醒长空。最爱垄头麦，迎风笑落红。',
      annotation: '夜莺=黄鹂鸟；皓月=明亮的月亮；垄头=田埂上；笑落红=笑着送走春天的花',
      readingTip: '最后一句读出喜爱之情，语气轻快，重音在"最爱"和"笑"上',
    },
    keywords: ['麦子', '饱满', '苦菜']
  },
  {
    id: 'mangzhong',
    name: '芒种',
    season: '夏',
    date: '6月5日-7日',
    month: 6,
    day: 6,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_8f8afd21-5aa8-4d87-bf1e-2d4faab22fcc.jpg',
    climate: '气温升高，雨量充沛，农事繁忙',
    phenology: '一候螳螂生，二候鵙始鸣，三候反舌无声',
    customs: {
      eat: '青梅、粽子、杨梅',
      do: '送花神、安苗、煮梅',
      wear: '穿轻薄透气衣物，注意防暑降温'
    },
    story: {
      title: '芒种送花神',
      content: '芒种是夏天最忙的时候，既要收麦子，又要种稻子。古人认为芒种过后，百花开始凋谢，花神也要回天上去了。所以人们会在芒种这天举行"送花神"的仪式，用花瓣和彩带装饰树枝，感谢花神带来的美丽春天。这个美丽的习俗，表达了人们对大自然的感恩之情。'
    },
    phenologyKids: [
      { raw: '一候螳螂生', kids: '小螳螂从卵里孵出来啦，举着两把"小镰刀"！', illustration: '卡通：萌版小螳螂举爪；写实：螳螂出壳' },
      { raw: '二候鵙始鸣', kids: '伯劳鸟站在高枝上大声叫，是夏天最响的歌手！', illustration: '卡通：伯劳鸟张嘴唱歌；写实：伯劳鸟枝头' },
      { raw: '三候反舌无声', kids: '百舌鸟不唱歌了，它要安静地换羽毛了！', illustration: '卡通：百舌鸟闭嘴休息；写实：百舌鸟' },
    ],
    folkCustoms: {
      north: { eat: '煮青梅，酸甜解暑；粽子，糯米香软', do: '安苗祭祀，祈求秧苗平安成长' },
      south: { eat: '杨梅，红彤彤的超甜；乌饭，紫黑色的糯米饭', do: '送花神仪式，感谢花神一年的美丽' },
      kidsExplain: '芒种是最忙的节气，要收麦子又要种水稻！吃颗酸梅提提神，加油干活！',
    },
    poem: {
      title: '芒种后积雨骤冷',
      author: '范成大（宋）',
      content: '梅霖倾泻九河翻，百渎交流海面宽。良苦吴农田下湿，年年披絮插秧寒。',
      annotation: '梅霖=梅雨；九河翻=河水涨；吴农=江南农民；披絮=穿棉衣；插秧寒=冒寒种水稻',
      readingTip: '最后一句放慢语速，读出农民辛苦劳作、心疼农民的感情',
    },
    keywords: ['农忙', '收麦', '种稻']
  },
  {
    id: 'xiazhi',
    name: '夏至',
    season: '夏',
    date: '6月21日-22日',
    month: 6,
    day: 21,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_1fe169da-03ed-4a7f-8da8-7e3d238364c6.jpg',
    climate: '日长夜短，气温最高',
    phenology: '一候鹿角解，二候蝉始鸣，三候半夏生',
    customs: {
      eat: '凉面、馄饨、荔枝',
      do: '祭地、消夏避伏、吃凉面',
      wear: '穿轻薄透气衣物，做好防晒'
    },
    story: {
      title: '夏至日最长',
      content: '夏至是一年中白天最长的一天。在夏至这天，太阳升得最高，白天的时间也最长。古人说"夏至一阴生"，意思是虽然天气最热，但从夏至开始，阴气就开始慢慢增长了。夏至这天，北方人喜欢吃凉面，南方人喜欢吃馄饨，都是为了消暑解热。'
    },
    phenologyKids: [
      { raw: '一候鹿角解', kids: '雄鹿的犄角掉下来了，不用担心，明年还会长新的！', illustration: '卡通：小鹿犄角掉了微笑；写实：雄鹿鹿角' },
      { raw: '二候蝉始鸣', kids: '蝉（知了）"吱吱吱"叫个不停，是夏天最大声的乐手！', illustration: '卡通：知了夹树叫；写实：知了特写' },
      { raw: '三候半夏生', kids: '半夏草长出来了，这是一种很厉害的中草药！', illustration: '卡通：半夏草药拟人；写实：半夏植株' },
    ],
    folkCustoms: {
      north: { eat: '凉面过水，清爽解暑；"吃过夏至面，一天短一线"', do: '祭地仪式，感谢大地一年的丰收' },
      south: { eat: '荔枝，红彤彤水灵灵；馄饨，皮薄馅鲜', do: '消夏避暑，去河边乘凉纳凉' },
      kidsExplain: '夏至是白天最长的一天！北方小朋友吃凉面，南方小朋友吃荔枝，都超解暑！',
    },
    poem: {
      title: '夏至避暑北池',
      author: '韦应物（唐）',
      content: '昼晷已云极，宵漏自此长。绿筠尚含粉，圆荷始散芳。',
      annotation: '昼晷=白天时间；云极=到了最长；宵漏=夜晚；绿筠=翠竹；圆荷=荷花',
      readingTip: '语速缓慢悠长，感受夏至日长夜短、荷花初开的美好',
    },
    keywords: ['白天最长', '消暑', '凉面']
  },
  {
    id: 'xiaoshu',
    name: '小暑',
    season: '夏',
    date: '7月6日-8日',
    month: 7,
    day: 7,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_cc3ccc6f-11ee-4916-9d3e-2ea7231871be.jpg',
    climate: '天气开始炎热，但还没到最热',
    phenology: '一候温风至，二候蟋蟀居宇，三候鹰始鸷',
    customs: {
      eat: '莲藕、绿豆汤、西瓜',
      do: '晒书画、晒衣服、吃藕',
      wear: '穿轻薄透气衣物，注意防暑'
    },
    story: {
      title: '小暑晒伏的习俗',
      content: '小暑时节，天气越来越热。古人有个好习惯，就是在这天把家里的书画、衣服拿出来晒一晒，叫做"晒伏"。因为夏天阳光强烈，晒一晒可以防虫防霉。传说六月六是龙王爷晒鳞的日子，所以大家也跟着晒东西。这个习俗告诉我们，夏天要注意防潮防霉，保持家里干净整洁。'
    },
    phenologyKids: [
      { raw: '一候温风至', kids: '吹来的风都是热的，像从烤箱里出来的一样！', illustration: '卡通：热风吹着小朋友汗珠；写实：烈日炎炎' },
      { raw: '二候蟋蟀居宇', kids: '蟋蟀（秋虫）从田野搬到屋檐下，它也觉得太热了！', illustration: '卡通：蟋蟀搬家；写实：蟋蟀屋角' },
      { raw: '三候鹰始鸷', kids: '老鹰开始在高空练习飞翔抓猎物，准备捕食啦！', illustration: '卡通：老鹰翱翔俯冲；写实：鹰击长空' },
    ],
    folkCustoms: {
      north: { eat: '莲藕炖排骨，清凉败火', do: '晒书晒衣，大太阳杀菌去霉' },
      south: { eat: '绿豆汤、西瓜，超解暑', do: '晒龙袍（六月六晒衣服），祈求平安' },
      kidsExplain: '小暑天热极了！北方晒书画，南方喝绿豆汤，西瓜是全国小朋友最爱的解暑神器！',
    },
    poem: {
      title: '小暑六月节',
      author: '元稹（唐）',
      content: '倏忽温风至，因循小暑来。竹喧先觉雨，山暗已闻雷。',
      annotation: '倏忽=一下子；因循=随之；竹喧=竹林哗哗响；山暗=山色变暗',
      readingTip: '前两句慢，后两句节奏加快，模拟暴雨来临前的紧张感',
    },
    keywords: ['炎热', '晒伏', '绿豆汤']
  },
  {
    id: 'dashu',
    name: '大暑',
    season: '夏',
    date: '7月22日-24日',
    month: 7,
    day: 23,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_e4fad643-c8cb-418f-8247-e2697d970265.jpg',
    climate: '一年中最热的时期',
    phenology: '一候腐草为萤，二候土润溽暑，三候大雨时行',
    customs: {
      eat: '仙草、烧仙草、荔枝',
      do: '饮伏茶、晒伏姜、送大暑船',
      wear: '穿最轻薄的衣物，注意防暑降温'
    },
    story: {
      title: '大暑萤火虫的传说',
      content: '大暑是一年中最热的时候。古人观察到，大暑时节，腐烂的草会变成萤火虫。当然，这只是古人的想象，萤火虫其实是从小虫子变来的。夏天的夜晚，萤火虫在草丛中飞来飞去，像一盏盏小灯笼，非常美丽。小朋友们可以在大暑的晚上，去草丛边看看这些发光的小精灵。'
    },
    phenologyKids: [
      { raw: '一候腐草为萤', kids: '腐草间飞出了萤火虫！小屁股一闪一闪的，像会飞的小灯笼！', illustration: '卡通：萤火虫夜晚飞舞；写实：萤光草丛' },
      { raw: '二候土润溽暑', kids: '地面湿湿的，空气黏黏的，热得像蒸笼一样！', illustration: '卡通：小朋友热得流汗；写实：湿热大地' },
      { raw: '三候大雨时行', kids: '轰隆隆，下起大暴雨了，地球在洗澡！', illustration: '卡通：地球在淋浴；写实：大雨倾盆' },
    ],
    folkCustoms: {
      north: { eat: '羊肉，大暑吃羊叫"伏羊"，补气血', do: '饮伏茶，茶摊免费提供防暑茶' },
      south: { eat: '仙草（烧仙草冻），清凉滑嫩', do: '送大暑船，把灾难送走，祈求平安' },
      kidsExplain: '大暑是全年最热的！南方小朋友吃仙草冻超凉快，萤火虫是大暑最美的礼物！',
    },
    poem: {
      title: '大暑',
      author: '曾几（宋）',
      content: '赤日几时过，清风无处寻。经书聊枕籍，瓜李漫浮沉。',
      annotation: '赤日=烈日；聊=姑且；枕籍=枕着书睡觉；瓜李=瓜果；漫浮沉=随意浸泡在水里',
      readingTip: '语气懒洋洋，读出大暑天太热、不想动弹的感觉，第四句要读得悠哉悠哉',
    },
    keywords: ['最热', '萤火虫', '消暑']
  },
  {
    id: 'liqiu',
    name: '立秋',
    season: '秋',
    date: '8月7日-9日',
    month: 8,
    day: 8,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f141ac65-5788-49b7-a409-23b2b2ea700c.jpg',
    climate: '暑去凉来，秋意渐浓',
    phenology: '一候凉风至，二候白露生，三候寒蝉鸣',
    customs: {
      eat: '西瓜、四季豆、秋桃',
      do: '贴秋膘、啃秋、晒秋',
      wear: '穿薄外套，早晚注意保暖'
    },
    story: {
      title: '立秋贴秋膘',
      content: '立秋是秋天的第一个节气。夏天天气热，很多人吃不下饭，变瘦了。到了立秋，天气凉快了，胃口也好了，人们就开始吃好吃的，把夏天掉的肉补回来，这就叫"贴秋膘"。不过小朋友们要注意，不能吃太多油腻的食物，要均衡饮食才健康哦！'
    },
    phenologyKids: [
      { raw: '一候凉风至', kids: '凉风吹来了！风不再是热的，变成了凉爽的秋风！', illustration: '卡通：秋风吹落叶小朋友开心；写实：秋风摇树' },
      { raw: '二候白露生', kids: '早晨草叶上有了小水珠，像一颗颗珍珠，那是露水！', illustration: '卡通：草叶上水珠发光；写实：晨露特写' },
      { raw: '三候寒蝉鸣', kids: '知了声音变小了，在叫最后的歌，秋天真的来了！', illustration: '卡通：知了哭泣依依不舍；写实：枯叶上的蝉' },
    ],
    folkCustoms: {
      north: { eat: '啃秋西瓜，吃最后的西瓜告别夏天', do: '贴秋膘：吃大肉补补身子，准备过冬' },
      south: { eat: '秋桃，吃了留核讨吉利', do: '晒秋：把收获的粮食铺在屋顶上晒干' },
      kidsExplain: '立秋啃西瓜是向夏天说再见！南方山村屋顶的五颜六色秋晒，像一幅美丽的图画！',
    },
    poem: {
      title: '立秋',
      author: '刘翰（宋）',
      content: '乳鸦啼散玉屏空，一枕新凉一扇风。睡起秋声无觅处，满阶梧叶月明中。',
      annotation: '乳鸦=小乌鸦；玉屏=精美的屏风；新凉=初秋的清凉；梧叶=梧桐叶',
      readingTip: '语气轻柔，读出立秋夜晚的清凉静谧，最后一句放慢速度，描绘满地梧桐叶',
    },
    keywords: ['秋天', '贴秋膘', '凉风']
  },
  {
    id: 'chushu',
    name: '处暑',
    season: '秋',
    date: '8月22日-24日',
    month: 8,
    day: 23,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_b5dbe0fb-707c-4816-ad41-516a5c224bfd.jpg',
    climate: '暑气渐消，天气转凉',
    phenology: '一候鹰乃祭鸟，二候天地始肃，三候禾乃登',
    customs: {
      eat: '鸭子、龙眼、白丸子',
      do: '放河灯、开渔节、出游迎秋',
      wear: '穿薄外套，注意早晚温差'
    },
    story: {
      title: '处暑放河灯',
      content: '处暑的意思是"暑气到此为止"，炎热的夏天终于要结束了。处暑这天，有些地方的人们会到河边放河灯。一盏盏小灯笼顺水漂流，非常好看。古人放河灯是为了祭奠祖先和祈求平安。现在，放河灯成了一种美丽的民俗活动，寄托着人们对美好生活的向往。'
    },
    phenologyKids: [
      { raw: '一候鹰乃祭鸟', kids: '老鹰把抓到的小鸟摆成一排，像在庆祝丰收！', illustration: '卡通：老鹰排列战利品；写实：老鹰俯冲' },
      { raw: '二候天地始肃', kids: '天气变得凉飕飕的，花草树木开始收缩准备过冬了！', illustration: '卡通：植物穿上小棉袄；写实：秋日萧瑟' },
      { raw: '三候禾乃登', kids: '稻子、高粱成熟了！农民伯伯开始大丰收！', illustration: '卡通：金黄稻穗弯腰；写实：稻田收割' },
    ],
    folkCustoms: {
      north: { eat: '处暑鸭，鸭肉清凉；百合粥，润肺去燥', do: '出游迎秋，踏入秋天第一次郊游' },
      south: { eat: '龙眼（桂圆），甜甜补气血', do: '放河灯，漂亮的小灯笼顺水漂流祈祷平安' },
      kidsExplain: '处暑暑气走了！放河灯是最浪漫的习俗，一盏灯代表一个美好的愿望！',
    },
    poem: {
      title: '处暑后风雨',
      author: '仇远（宋）',
      content: '疾风驱急雨，残暑扫除空。因识炎凉态，都来顷刻中。',
      annotation: '疾风=猛风；驱=驱赶；残暑=剩余的暑热；炎凉态=天气冷热变化',
      readingTip: '前两句有力，读出风雨扫暑的痛快感；后两句感慨，读出对天气变化的感悟',
    },
    keywords: ['暑气消', '河灯', '秋凉']
  },
  {
    id: 'bailu',
    name: '白露',
    season: '秋',
    date: '9月7日-9日',
    month: 9,
    day: 8,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_2ca21e39-7d20-46b9-b422-b0ef236cdec5.jpg',
    climate: '天气转凉，露水凝结',
    phenology: '一候鸿雁来，二候玄鸟归，三候群鸟养羞',
    customs: {
      eat: '白露茶、龙眼、番薯',
      do: '收清露、祭禹王、吃龙眼',
      wear: '穿长袖外套，注意保暖'
    },
    story: {
      title: '白露收清露',
      content: '白露时节，天气变凉了，清晨的时候，草叶上会出现一颗颗晶莹的小水珠，这就是"露水"。古人认为白露这天的露水有神奇的功效，会收集露水来泡茶、做药。白露的名字就是这么来的——白色的露水。小朋友们可以在白露的早晨，去草地上看看这些美丽的小水珠。'
    },
    phenologyKids: [
      { raw: '一候鸿雁来', kids: '大雁又排着队从北方飞来，像飞机编队一样！', illustration: '卡通：大雁V字编队；写实：雁群飞行' },
      { raw: '二候玄鸟归', kids: '燕子要飞回南方过冬啦，明年春天再见！', illustration: '卡通：燕子挥手告别；写实：燕子南飞' },
      { raw: '三候群鸟养羞', kids: '鸟儿们开始储存食物，为过冬做准备，好勤劳！', illustration: '卡通：小鸟搬粮食存仓；写实：鸟类觅食' },
    ],
    folkCustoms: {
      north: { eat: '白露茶，这天采的茶最香；龙眼，白露龙眼大如蛋', do: '祭禹王，感谢大禹治水的功绩' },
      south: { eat: '番薯，清甜软糯', do: '收清露：用荷叶收集露水泡茶喝' },
      kidsExplain: '白露早晨草叶上的露水晶莹剔透，古人用这露水泡茶，是世界上最特别的茶！',
    },
    poem: {
      title: '蒹葭',
      author: '诗经·秦风',
      content: '蒹葭苍苍，白露为霜。所谓伊人，在水一方。',
      annotation: '蒹葭=芦苇；苍苍=茂盛的样子；伊人=思念的人；在水一方=在河的对岸',
      readingTip: '语气深情悠远，像在想念很久没见的好朋友，读得慢而有情',
    },
    keywords: ['露水', '秋凉', '大雁']
  },
  {
    id: 'qiufen',
    name: '秋分',
    season: '秋',
    date: '9月22日-24日',
    month: 9,
    day: 23,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_756d6888-d05f-4523-9a25-5d64461fe429.jpg',
    climate: '昼夜平分，秋高气爽',
    phenology: '一候雷始收声，二候蛰虫坯户，三候水始涸',
    customs: {
      eat: '秋菜、汤圆、桂花酒',
      do: '竖蛋、吃秋菜、送秋牛',
      wear: '穿舒适秋装，适合户外活动'
    },
    story: {
      title: '秋分竖蛋',
      content: '和春分一样，秋分这天白天和黑夜也是一样长的。秋分竖蛋也是一个有趣的习俗。传说秋分这天，天地间的阴阳之气最平衡，鸡蛋最容易竖起来。秋分时节，秋高气爽，正是放风筝、赏秋景的好时候。小朋友们，快去户外感受美丽的秋天吧！'
    },
    phenologyKids: [
      { raw: '一候雷始收声', kids: '雷公公收工啦，夏天的雷声不响了，秋天真的来了！', illustration: '卡通：雷公收起鼓槌休息；写实：晴朗秋空' },
      { raw: '二候蛰虫坯户', kids: '小虫子用泥巴把洞口堵住，开始准备睡冬觉了！', illustration: '卡通：小虫砌墙关门睡觉；写实：土壤虫洞' },
      { raw: '三候水始涸', kids: '有的小河水少了，秋天空气干燥，要多喝水！', illustration: '卡通：小河变浅鱼儿担心；写实：秋季干涸溪流' },
    ],
    folkCustoms: {
      north: { eat: '秋菜（野苋菜做"秋汤"）；月饼，中秋节吃月饼赏月', do: '竖蛋游戏，和春分一样好玩' },
      south: { eat: '汤圆，团团圆圆；螃蟹，秋分蟹肥', do: '送秋牛：送祝丰收的画报给农家' },
      kidsExplain: '秋分和春分一样，白天黑夜一样长！月饼圆圆的，代表家人团圆，中秋快乐！',
    },
    poem: {
      title: '秋词',
      author: '刘禹锡（唐）',
      content: '自古逢秋悲寂寥，我言秋日胜春朝。晴空一鹤排云上，便引诗情到碧霄。',
      annotation: '寂寥=空旷寂寞；春朝=春天早晨；排云=穿过云层；碧霄=蓝天',
      readingTip: '第二句自豪有力，第三四句越来越高亢，读出鹤飞云天的豪迈！',
    },
    keywords: ['昼夜平分', '竖蛋', '秋高气爽']
  },
  {
    id: 'hanlu',
    name: '寒露',
    season: '秋',
    date: '10月8日-9日',
    month: 10,
    day: 8,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_9c090bbb-d809-4984-bbc2-eec396d66eba.jpg',
    climate: '气温更低，露水更冷',
    phenology: '一候鸿雁来宾，二候雀入大水为蛤，三候菊有黄华',
    customs: {
      eat: '菊花茶、芝麻、柿子',
      do: '登高、赏菊、饮菊花酒',
      wear: '穿厚外套，注意保暖防寒'
    },
    story: {
      title: '寒露赏菊花',
      content: '寒露时节，天气更冷了，露水快要结成霜了。这个时候，菊花却开得正艳丽！古人特别喜欢在寒露时节赏菊花、喝菊花茶。菊花不怕冷，在百花凋谢的时候独自绽放，所以人们把菊花看作坚强、高洁的象征。小朋友们，寒露时节去看看菊花展吧，感受秋天的美丽！'
    },
    phenologyKids: [
      { raw: '一候鸿雁来宾', kids: '最后一批大雁飞来了，它们是留在南方过冬的！', illustration: '卡通：大雁找旅馆入住；写实：大雁南飞' },
      { raw: '二候雀入大水为蛤', kids: '麻雀不见了，海里却有了很多蛤蜊！（古人的有趣想象）', illustration: '卡通：麻雀跳入水变蛤蜊；写实：蛤蜊海滩' },
      { raw: '三候菊有黄华', kids: '菊花开啦！金黄色的菊花是秋天最后的美丽！', illustration: '卡通：金色菊花微笑盛开；写实：菊花特写' },
    ],
    folkCustoms: {
      north: { eat: '芝麻，吃黑芝麻补肾；柿子，红彤彤甜蜜蜜', do: '登高望远，登山看秋色' },
      south: { eat: '菊花茶，清热解毒；螃蟹，膏肥黄满', do: '赏菊花展，饮菊花酒' },
      kidsExplain: '寒露登高看枫叶，菊花比百花都坚强！吃柿子要记得别空腹吃哦！',
    },
    poem: {
      title: '月夜梧桐叶上见寒露',
      author: '戴察（唐）',
      content: '萧疏桐叶上，月白露初团。滴沥清光满，荧煌素彩寒。',
      annotation: '萧疏=稀疏；月白=月光洁白；初团=刚凝聚；滴沥=水滴声；荧煌=光辉闪烁',
      readingTip: '轻声朗读，感受寒露月夜的静谧清冷，每个字都要读清楚',
    },
    keywords: ['菊花', '登高', '寒冷']
  },
  {
    id: 'shuangjiang',
    name: '霜降',
    season: '秋',
    date: '10月23日-24日',
    month: 10,
    day: 23,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_131873ee-f8e2-4cd5-91a6-232285572e01.jpg',
    climate: '天气渐冷，开始降霜',
    phenology: '一候豺乃祭兽，二候草木黄落，三候蛰虫咸俯',
    customs: {
      eat: '柿子、栗子、牛肉',
      do: '赏红叶、吃柿子、登高远眺',
      wear: '穿厚外套和毛衣，注意保暖'
    },
    story: {
      title: '霜降吃柿子的传说',
      content: '霜降是秋天的最后一个节气。传说霜降这天吃柿子，一整个冬天嘴唇都不会裂开。有个故事说，明朝皇帝朱元璋小时候很穷，有一次霜降那天饿得不行，发现一棵柿子树，摘了柿子吃才活了下来。后来他当了皇帝，就封那棵柿子树为"凌霜侯"。从此，霜降吃柿子就成了习俗。'
    },
    phenologyKids: [
      { raw: '一候豺乃祭兽', kids: '豺狼把猎到的动物排成排，像在感谢大自然的馈赠！', illustration: '卡通：豺狼献祭仪式；写实：秋日豺狼' },
      { raw: '二候草木黄落', kids: '树叶变成红色、黄色、橙色，然后纷纷飘落！', illustration: '卡通：彩色叶子飘舞跳舞；写实：秋叶满地' },
      { raw: '三候蛰虫咸俯', kids: '所有冬眠的小虫子都低下头，准备睡大觉了！', illustration: '卡通：小虫们排队钻土睡觉；写实：土壤冬眠' },
    ],
    folkCustoms: {
      north: { eat: '柿子，朱元璋封"凌霜侯"的水果；栗子，甜糯香', do: '赏枫叶红叶，登高远眺' },
      south: { eat: '牛肉，补气暖身；鸭子，霜降前鸭最肥', do: '扫墓祭祖（部分地区）' },
      kidsExplain: '霜降柿子最甜！红叶比春花还好看！枫叶红了黄了，是大自然画的最美图画！',
    },
    poem: {
      title: '霜降',
      author: '元稹（唐）',
      content: '霜降三旬后，蓂馀一叶秋。玄阴迎落日，凉魄尽残钩。',
      annotation: '三旬=三十天；蓂=传说中的瑞草；玄阴=秋冬的阴气；凉魄=月亮；残钩=弯月',
      readingTip: '语调沉静，读出秋末冬初的萧条与宁静',
    },
    keywords: ['降霜', '柿子', '红叶']
  },
  {
    id: 'lidong',
    name: '立冬',
    season: '冬',
    date: '11月7日-8日',
    month: 11,
    day: 7,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_eda5c60b-b227-436e-ad32-a84b41e6540b.jpg',
    climate: '水始冰，地始冻，冬季开始',
    phenology: '一候水始冰，二候地始冻，三候雉入大水为蜃',
    customs: {
      eat: '饺子、羊肉、糍粑',
      do: '补冬、吃饺子、酿黄酒',
      wear: '穿棉衣羽绒服，注意保暖'
    },
    story: {
      title: '立冬吃饺子的由来',
      content: '立冬是冬天的第一个节气。北方人立冬要吃饺子，因为饺子长得像耳朵，人们说"立冬不端饺子碗，冻掉耳朵没人管"。这个习俗和医圣张仲景有关。传说张仲景在冬天看到很多穷人耳朵冻烂了，就用面皮包上药材做成"娇耳汤"给大家吃，治好了冻耳朵。后来人们就在立冬这天吃饺子纪念他。'
    },
    phenologyKids: [
      { raw: '一候水始冰', kids: '水开始结冰啦！池塘边有薄薄的一层冰，踩上去"咔嚓"！', illustration: '卡通：小朋友踩薄冰听咔嚓声；写实：初冰水面' },
      { raw: '二候地始冻', kids: '地面被冻硬了，挖土很费力，地球穿上了盔甲！', illustration: '卡通：地面结冻变盔甲；写实：冻土特写' },
      { raw: '三候雉入大水为蜃', kids: '野鸡躲起来了，海边出现了很多大蛤蜊！（古人的想象）', illustration: '卡通：野鸡变蛤蜊魔法；写实：蛤蜊海滩' },
    ],
    folkCustoms: {
      north: { eat: '饺子！"立冬不端饺子碗，冻掉耳朵没人管"', do: '补冬：吃滋补食物，如羊肉炖萝卜' },
      south: { eat: '糍粑，软糯香甜；姜母鸭，暖身驱寒', do: '酿米酒，冬天是酿酒的好时候' },
      kidsExplain: '立冬吃饺子是因为饺子像耳朵，吃了冬天耳朵不会冻！南方吃糍粑，黏黏的超好吃！',
    },
    poem: {
      title: '立冬',
      author: '李白（唐）',
      content: '冻笔新诗懒写，寒炉美酒时温。醉看墨花月白，恍疑雪满前村。',
      annotation: '冻笔=冻僵的笔；懒写=懒得写；寒炉=冷天的炉火；恍疑=好像以为',
      readingTip: '读出冬天懒洋洋、暖炉喝酒的惬意感，语气悠然轻松',
    },
    keywords: ['冬天', '饺子', '保暖']
  },
  {
    id: 'xiaoxue',
    name: '小雪',
    season: '冬',
    date: '11月22日-23日',
    month: 11,
    day: 22,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_cd151093-854d-402e-94dc-6c5f3fb53a28.jpg',
    climate: '开始降雪，雪量不大',
    phenology: '一候虹藏不见，二候天气上升地气下降，三候闭塞而成冬',
    customs: {
      eat: '腊肉、糍粑、刨汤',
      do: '腌腊肉、吃糍粑、晒鱼干',
      wear: '穿厚棉衣，注意防寒保暖'
    },
    story: {
      title: '小雪腌腊肉',
      content: '小雪时节，天气变冷了，开始下起小雪。这个时候，很多地方的人们开始腌腊肉。因为天气冷了，肉不容易坏，腌好的腊肉可以保存很久，留着过年吃。古人说"冬腊风腌，蓄以御冬"，就是冬天把食物腌制保存起来，准备过冬。小朋友们，小雪时节可以帮爸爸妈妈一起腌腊肉哦！'
    },
    phenologyKids: [
      { raw: '一候虹藏不见', kids: '彩虹不见了！因为冬天雨少太阳弱，彩虹躲起来了！', illustration: '卡通：彩虹躲进云里睡觉；写实：冬季阴云' },
      { raw: '二候天气上升地气下降', kids: '天上的气往上飘，地上的气往下沉，天地分开了！', illustration: '卡通：天地气流分向；写实：冬日天地' },
      { raw: '三候闭塞而成冬', kids: '天地关上了大门，万物都进入了冬眠模式！', illustration: '卡通：大门关闭动物冬眠；写实：冬日萧瑟' },
    ],
    folkCustoms: {
      north: { eat: '腊肉腊肠，提前腌制过年备货', do: '腌泡菜，白菜大葱放地窖越冬' },
      south: { eat: '糍粑，小雪糍粑是湖南传统；刨汤（新鲜猪肉宴席）', do: '晒鱼干，海边人家晒鱼虾' },
      kidsExplain: '小雪开始腌腊肉了！腊肉挂满屋檐，香气飘十里，过年时候最好吃！',
    },
    poem: {
      title: '小雪',
      author: '戴叔伦（唐）',
      content: '花雪随风不厌看，更多还肯失林峦。愁人正在书窗下，一片飞来一片寒。',
      annotation: '不厌看=看不够；林峦=树林山峦；愁人=心里有烦恼的人；片片=一片一片',
      readingTip: '前两句欢快，最后两句慢下来，读出小雪带来的诗意忧愁',
    },
    keywords: ['小雪', '腊肉', '糍粑']
  },
  {
    id: 'daxue',
    name: '大雪',
    season: '冬',
    date: '12月6日-8日',
    month: 12,
    day: 7,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_82588f28-8b4b-4f16-ae5b-05fbb302e923.jpg',
    climate: '雪量增大，天气更冷',
    phenology: '一候鹖鴠不鸣，二候虎始交，三候荔挺出',
    customs: {
      eat: '红薯粥、羊肉、萝卜',
      do: '腌肉、进补、赏雪',
      wear: '穿最厚的棉衣羽绒服，做好保暖'
    },
    story: {
      title: '大雪瑞雪兆丰年',
      content: '大雪时节，雪下得更大了。古人说"瑞雪兆丰年"，意思是冬天下大雪，来年庄稼就会长得好。因为厚厚的雪像一床大棉被，保护着地里的庄稼不被冻坏，还能冻死害虫。等春天来了，雪融化了，又给庄稼提供了充足的水分。所以农民伯伯都盼着冬天多下雪呢！'
    },
    phenologyKids: [
      { raw: '一候鹖鴠不鸣', kids: '寒号鸟不叫了，因为太冷了叫不出声！', illustration: '卡通：小鸟裹棉袄沉默；写实：冬鸟枝头' },
      { raw: '二候虎始交', kids: '老虎开始找伴侣啦，冬天也有爱情！', illustration: '卡通：两只老虎相遇；写实：雪地老虎' },
      { raw: '三候荔挺出', kids: '荔挺草冒出新芽，大雪天也有顽强的小生命！', illustration: '卡通：雪中小草勇敢出芽；写实：冬草破雪' },
    ],
    folkCustoms: {
      north: { eat: '羊肉炖萝卜，暖胃暖身；红薯粥，甜甜暖暖', do: '堆雪人打雪仗，冬天最快乐的事' },
      south: { eat: '冬至汤圆，全家一起搓；腌鱼腌肉，准备年货', do: '赏雪景，南方难得下雪要好好看' },
      kidsExplain: '"瑞雪兆丰年"，大雪是明年好收成的预告！堆雪人、打雪仗是冬天最幸福的事！',
    },
    poem: {
      title: '江雪',
      author: '柳宗元（唐）',
      content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
      annotation: '鸟飞绝=没有鸟飞；人踪灭=没有人走动；蓑笠翁=穿蓑衣戴斗笠的老人',
      readingTip: '声音越来越轻，读出天地皆白、万籁俱寂的孤独美感',
    },
    keywords: ['大雪', '瑞雪', '进补']
  },
  {
    id: 'dongzhi',
    name: '冬至',
    season: '冬',
    date: '12月21日-23日',
    month: 12,
    day: 22,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_38e3fb35-30e2-42f4-b4d3-09b69a4c5dc3.jpg',
    climate: '日短夜长，数九寒天开始',
    phenology: '一候蚯蚓结，二候麋角解，三候水泉动',
    customs: {
      eat: '饺子（北方）、汤圆（南方）、羊肉汤',
      do: '祭祖、数九、吃饺子/汤圆',
      wear: '穿最厚的冬装，注意防寒'
    },
    story: {
      title: '冬至吃饺子的由来',
      content: '冬至这天，白天最短，夜晚最长。传说医圣张仲景在冬至这天看到很多穷人耳朵冻烂了，就用面皮包上羊肉和药材，做成耳朵形状的"娇耳"，煮汤给大家喝。人们吃了以后，耳朵都好了。后来人们就在冬至这天吃饺子，纪念张仲景的善心。南方人则吃汤圆，寓意团团圆圆。'
    },
    phenologyKids: [
      { raw: '一候蚯蚓结', kids: '蚯蚓把身体缩成一团取暖，在土里冬眠了！', illustration: '卡通：蚯蚓抱团取暖；写实：冻土蚯蚓' },
      { raw: '二候麋角解', kids: '麋鹿（四不像）的角掉了，春天才会长回来！', illustration: '卡通：麋鹿角掉了无奈；写实：麋鹿特写' },
      { raw: '三候水泉动', kids: '地下的泉水在微微流动，带着一丁点热量！', illustration: '卡通：地下泉水热气冒；写实：冬日泉眼' },
    ],
    folkCustoms: {
      north: { eat: '饺子（北方冬至必吃！）；羊肉汤，驱寒', do: '数九消寒：每天在纸上填格子，熬到春天' },
      south: { eat: '汤圆，寓意团团圆圆', do: '祭祖，冬至是重要的祭祖节日' },
      kidsExplain: '冬至是最短的一天！南方汤圆北方饺子，全家围坐吃饭是最温暖的事！',
    },
    poem: {
      title: '冬至',
      author: '杜甫（唐）',
      content: '年年至日长为客，忽忽穷愁泥杀人。江上形容吾独老，天边风俗自相亲。',
      annotation: '至日=冬至；长为客=长期在外作客；忽忽=时间飞逝；形容=样貌；风俗=家乡习俗',
      readingTip: '深情地读，读出杜甫冬至在外思念家乡的心情',
    },
    keywords: ['冬至', '饺子', '汤圆', '数九']
  },
  {
    id: 'xiaohan',
    name: '小寒',
    season: '冬',
    date: '1月5日-7日',
    month: 1,
    day: 6,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_cd41093f-9b5a-4652-808e-2362f98ddd9d.jpg',
    climate: '天气寒冷，但还没到最冷',
    phenology: '一候雁北乡，二候鹊始巢，三候雉始鸲',
    customs: {
      eat: '腊八粥、糯米饭、羊肉',
      do: '探梅、吃腊八粥、准备年货',
      wear: '穿最厚的冬装，做好全面保暖'
    },
    story: {
      title: '小寒腊八粥的传说',
      content: '小寒是一年中最冷的时候之一。传说佛祖释迦牟尼在修行时，饿得快不行了，一个牧女给他煮了一碗粥，他喝了以后恢复了体力，在腊月初八这天悟道成佛。后来人们就在腊月初八这天煮粥纪念，叫做"腊八粥"。小寒时节喝一碗热乎乎的腊八粥，全身都暖和了！'
    },
    phenologyKids: [
      { raw: '一候雁北乡', kids: '大雁准备飞回北方了！感觉到春天快来，它们提前出发！', illustration: '卡通：大雁打行李出发；写实：大雁北飞' },
      { raw: '二候鹊始巢', kids: '喜鹊开始捡树枝盖新房子，准备迎接春天！', illustration: '卡通：喜鹊建筑师盖房子；写实：喜鹊叼枝' },
      { raw: '三候雉始鸲', kids: '野鸡开始"咯咯咯"叫了，它们也知道春天要来了！', illustration: '卡通：野鸡唱春天的歌；写实：野鸡鸣叫' },
    ],
    folkCustoms: {
      north: { eat: '腊八粥，腊月初八喝八种粮食煮的粥，热乎乎', do: '探梅：去梅园赏梅花，最早的春色' },
      south: { eat: '糯米饭，广东人小寒吃糯米暖身', do: '准备年货，小寒到了年不远了' },
      kidsExplain: '腊八粥里有八种食材：大米、红豆、花生、红枣……喝一碗浑身暖！梅花是最勇敢的花！',
    },
    poem: {
      title: '小寒',
      author: '元稹（唐）',
      content: '小寒连大吕，欢鹊垒新巢。拾食寻河曲，衔紫绕树梢。',
      annotation: '大吕=农历十二月别称；欢鹊=喜鹊；垒新巢=建新巢；衔紫=叼紫色树枝',
      readingTip: '轻快活泼，读出喜鹊建巢的忙碌与喜悦，感受冬日生机',
    },
    keywords: ['寒冷', '腊八粥', '梅花']
  },
  {
    id: 'dahan',
    name: '大寒',
    season: '冬',
    date: '1月20日-21日',
    month: 1,
    day: 20,
    imageUrl: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_f8b24b2f-a06f-4f7e-ad37-80d681f970ee.jpg',
    climate: '一年中最冷的时期',
    phenology: '一候鸡乳，二候征鸟厉疾，三候水泽腹坚',
    customs: {
      eat: '八宝饭、年糕、消寒糕',
      do: '除旧布新、准备年货、蒸供',
      wear: '穿最厚的冬装，注意防寒保暖'
    },
    story: {
      title: '大寒迎新年',
      content: '大寒是二十四节气中最后一个节气，也是一年中最冷的时候。大寒过后就是立春，新的一年又要开始了。所以大寒时节，人们都在忙着准备过年：打扫房子、买年货、贴春联。虽然天气很冷，但大家心里都很温暖，因为新年就要来了！大寒告诉我们：最冷的时候过去，春天就不远了。'
    },
    phenologyKids: [
      { raw: '一候鸡乳', kids: '母鸡开始孵小鸡了！鸡宝宝要在大寒天里来到世界！', illustration: '卡通：母鸡孵蛋温柔；写实：母鸡抱窝' },
      { raw: '二候征鸟厉疾', kids: '老鹰在高空飞得又快又猛，俯冲抓猎物像离弦的箭！', illustration: '卡通：老鹰俯冲超速；写实：鹰击猎物' },
      { raw: '三候水泽腹坚', kids: '河里的冰冻到最厚了，站上去也不会掉下去！', illustration: '卡通：小朋友在厚冰上滑冰；写实：坚冰河面' },
    ],
    folkCustoms: {
      north: { eat: '年糕，大寒吃年糕取"年年高"的好彩头', do: '除旧布新，大扫除迎新年' },
      south: { eat: '八宝饭，甜糯丰盛；消寒糕，吃了暖身', do: '蒸供品，准备祭祖供品' },
      kidsExplain: '大寒是最后一个节气，大寒过后就是立春！年糕年年高，吃了学习更厉害！',
    },
    poem: {
      title: '大寒出江陵西门',
      author: '陆游（宋）',
      content: '平明羸马出西门，淡日寒云久吐吞。醉面冲风惊易醒，重裘藏手取微温。',
      annotation: '平明=天刚亮；羸马=瘦弱的马；淡日=昏淡的太阳；重裘=厚皮衣；取微温=感受一点点温暖',
      readingTip: '语气沉稳，读出大寒清晨出门的寒冷和诗人豁达的心情',
    },
    keywords: ['最冷', '年货', '迎新年']
  }
];

// 二十四节气歌
export const solarTermSong = {
  title: '二十四节气歌',
  content: '春雨惊春清谷天，夏满芒夏暑相连。秋处露秋寒霜降，冬雪雪冬小大寒。',
  description: '这首朗朗上口的节气歌，帮助小朋友们记住二十四节气的顺序。'
};

// 节气诗词集合
export const solarTermPoems = [
  {
    title: '二十四节气歌',
    author: '民间',
    content: '春雨惊春清谷天，夏满芒夏暑相连。秋处露秋寒霜降，冬雪雪冬小大寒。',
    season: '全年'
  },
  {
    title: '春晓',
    author: '孟浩然',
    content: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。',
    season: '春'
  },
  {
    title: '小池',
    author: '杨万里',
    content: '泉眼无声惜细流，树阴照水爱晴柔。小荷才露尖尖角，早有蜻蜓立上头。',
    season: '夏'
  },
  {
    title: '山行',
    author: '杜牧',
    content: '远上寒山石径斜，白云生处有人家。停车坐爱枫林晚，霜叶红于二月花。',
    season: '秋'
  },
  {
    title: '梅花',
    author: '王安石',
    content: '墙角数枝梅，凌寒独自开。遥知不是雪，为有暗香来。',
    season: '冬'
  }
];

// 获取北京时间（UTC+8）的当前日期，避免 UTC 时差问题
function getChinaDate(): { month: number; day: number } {
  const now = new Date();
  // 转换为北京时间（UTC+8）
  const chinaOffset = 8 * 60; // 分钟
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const chinaDate = new Date(utcMs + chinaOffset * 60000);
  return {
    month: chinaDate.getMonth() + 1,
    day: chinaDate.getDate(),
  };
}

// 节气日期表（固定不变）
const TERM_DATES = [
  { month: 1,  day: 6,  id: 'xiaohan' },
  { month: 1,  day: 20, id: 'dahan' },
  { month: 2,  day: 4,  id: 'lichun' },
  { month: 2,  day: 19, id: 'yushui' },
  { month: 3,  day: 6,  id: 'jingzhe' },
  { month: 3,  day: 21, id: 'chunfen' },
  { month: 4,  day: 5,  id: 'qingming' },
  { month: 4,  day: 20, id: 'guyu' },
  { month: 5,  day: 6,  id: 'lixia' },
  { month: 5,  day: 21, id: 'xiaoman' },
  { month: 6,  day: 6,  id: 'mangzhong' },
  { month: 6,  day: 21, id: 'xiazhi' },
  { month: 7,  day: 7,  id: 'xiaoshu' },
  { month: 7,  day: 23, id: 'dashu' },
  { month: 8,  day: 8,  id: 'liqiu' },
  { month: 8,  day: 23, id: 'chushu' },
  { month: 9,  day: 8,  id: 'bailu' },
  { month: 9,  day: 23, id: 'qiufen' },
  { month: 10, day: 8,  id: 'hanlu' },
  { month: 10, day: 23, id: 'shuangjiang' },
  { month: 11, day: 7,  id: 'lidong' },
  { month: 11, day: 22, id: 'xiaoxue' },
  { month: 12, day: 7,  id: 'daxue' },
  { month: 12, day: 22, id: 'dongzhi' },
];

// 获取当前节气（北京时间）
export function getCurrentSolarTerm(): SolarTerm {
  const { month, day } = getChinaDate();

  // 从后往前找最近已过的节气
  let currentId = 'dongzhi';
  for (let i = TERM_DATES.length - 1; i >= 0; i--) {
    const td = TERM_DATES[i];
    if (month > td.month || (month === td.month && day >= td.day)) {
      currentId = td.id;
      break;
    }
  }

  return solarTerms.find(t => t.id === currentId) || solarTerms[0];
}

// 获取下一个节气（北京时间）
export function getNextSolarTerm(): SolarTerm {
  const { month, day } = getChinaDate();

  for (const td of TERM_DATES) {
    if (month < td.month || (month === td.month && day < td.day)) {
      return solarTerms.find(t => t.id === td.id) || solarTerms[0];
    }
  }

  return solarTerms[0];
}

// 按季节分组
export function getTermsBySeason(season: '春' | '夏' | '秋' | '冬'): SolarTerm[] {
  return solarTerms.filter(t => t.season === season);
}


// 根据ID获取节气
export function getTermById(id: string): SolarTerm | undefined {
  return solarTerms.find(t => t.id === id);
}

// ─────────────────────────────────────────────
// 小朋友怎么做：幼小衔接（3-8岁口语化）
// ─────────────────────────────────────────────
export interface ChildTip {
  wear: string;   // 👕 穿着
  eat: string;    // 🍜 饮食
  outdoor: string; // 🌿 户外活动
}

export const childTips: Record<string, ChildTip> = {
  lichun: {
    wear: '换上漂亮的春装吧！穿红色或粉色的衣服，春天喜欢鲜艳的颜色哦～',
    eat: '立春要吃春饼！用薄薄的饼皮卷上蔬菜，脆脆的，叫做"咬春"，一口咬下春天的味道！',
    outdoor: '和爸爸妈妈去公园找找有没有小花开了，数一数地上有几片绿叶，春天悄悄来啦！',
  },
  yushui: {
    wear: '天还有点凉，穿一件薄薄的外套，里面可以穿毛衣，像个小洋葱一样暖暖的～',
    eat: '雨水节气喝一碗热热的红枣粥，甜甜的，暖暖的，身体棒棒的！',
    outdoor: '下小雨的时候，穿上雨靴踩水坑，溅起水花！不下雨就看看小草有没有变绿～',
  },
  jingzhe: {
    wear: '穿轻薄的春装，但早晚还是要带件小外套，天气还会突然变凉的哦！',
    eat: '惊蛰吃梨润润嗓子！爆米花也是惊蛰的零食，"轰"的一声，像春雷一样！',
    outdoor: '去泥土边找一找，有没有小虫子探出头来？惊蛰之后小动物们都醒了哦！',
  },
  chunfen: {
    wear: '穿舒舒服服的春装，不太冷也不太热，正好出去玩！',
    eat: '春分吃汤圆，圆圆的汤圆代表圆圆满满！也可以吃驴打滚，甜甜软软的～',
    outdoor: '和爸爸妈妈去竖鸡蛋！把鸡蛋轻轻放在桌上，据说春分这天最容易竖起来哦！',
  },
  qingming: {
    wear: '穿柔软舒适的春装，颜色淡淡的，像嫩嫩的树叶一样清爽！',
    eat: '清明节吃青团！绿绿的糯米皮，里面包着甜甜的馅，漂亮又好吃！',
    outdoor: '去放风筝吧！清明风大，风筝飞得老高啦！也可以去野外摘几朵小野花～',
  },
  guyu: {
    wear: '谷雨前后可以换薄一点的衣服了，但还是要防雨，带一把小雨伞出门！',
    eat: '谷雨喝谷雨茶！清清的茶水，最养我们的身体，苦苦的但很健康哦！',
    outdoor: '去找找紫色的樱花还在不在，或者看看草地上有没有小蝴蝶飞过来！',
  },
  lixia: {
    wear: '夏天来啦！穿短袖短裤，轻轻松松的，记得涂防晒霜哦！',
    eat: '立夏要称体重，看看长高了没有！还要喝酸梅汤，酸酸甜甜，消暑解渴！',
    outdoor: '去草地上找蜗牛和小蚂蚁！立夏以后小虫子越来越多，睁大眼睛找找看！',
  },
  xiaoman: {
    wear: '穿透气的棉质衣服，越薄越好，出汗了要及时换衣服哦！',
    eat: '小满吃苦菜！苦苦的蔬菜夏天吃最好，还可以吃绿豆糕，清凉又消暑！',
    outdoor: '去麦田边看看金黄的小麦穗，鼓鼓的，快成熟啦！用手轻轻摸摸麦穗～',
  },
  mangzhong: {
    wear: '头上戴顶小草帽，穿浅色宽松的衣服，记得多喝水不然会被太阳晒哦！',
    eat: '芒种吃青梅！酸酸甜甜，开开胃口；也可以做杨梅汁，鲜红鲜红的～',
    outdoor: '如果有机会，去农田看看农民伯伯怎么割麦子，金黄色的麦浪可漂亮啦！',
  },
  xiazhi: {
    wear: '穿最薄最透气的衣服！夏至是一年里白天最长的一天，要防晒保护皮肤哦！',
    eat: '夏至吃面条！细细长长的面条，代表"夏至到，麦秸扎"，凉面最好吃！',
    outdoor: '中午不要出去，太阳太热啦！傍晚出去抓知了，"知了知了"叫个不停～',
  },
  xiaoshu: {
    wear: '穿浅色薄薄的衣服，最好是白色或淡蓝色，凉快！帽子和凉鞋不能少！',
    eat: '小暑吃藕！莲藕清脆脆的，凉拌藕片酸酸甜甜；还可以吃绿豆冰棒，哇！',
    outdoor: '傍晚去荷花池边，荷花开了好漂亮！荷叶上的水珠圆溜溜的，轻轻碰一碰～',
  },
  dashu: {
    wear: '大暑是最热的时候！穿最薄的衣服，待在凉快的地方，少出去晒太阳哦！',
    eat: '大暑喝姜茶或者吃仙草冻！黑黑的仙草冻加上甜甜的糖水，清凉一整天！',
    outdoor: '早上或傍晚去捉虫子！萤火虫开始飞啦，黑暗中看到小光点，好神奇！',
  },
  liqiu: {
    wear: '立秋以后早晚变凉了，出门记得带件薄外套，白天还是穿短袖舒服！',
    eat: '立秋要"贴秋膘"，吃烤肉！还要咬秋，咬一口西瓜，把夏天的热气咬跑！',
    outdoor: '去找找梧桐树，看看叶子有没有变黄，"梧桐一叶落，天下皆知秋"！',
  },
  chushu: {
    wear: '处暑天气开始凉了，穿长裤和薄长袖，早晚要多穿一件！',
    eat: '处暑吃鸭肉！鸭子是秋天最棒的食物，鸭汤又香又暖！也可以吃百合汤～',
    outdoor: '去公园找找月季花，秋天的月季开得特别好！也可以摘几片落叶做标本！',
  },
  bailu: {
    wear: '白露之后真的要加衣服了！穿长袖长裤，晚上可能还要穿薄毛衣哦！',
    eat: '白露喝白露茶！还可以吃芋头和红薯，甜甜软软的，秋天的味道！',
    outdoor: '早上起来看看草叶上有没有白白的露珠，圆圆的，摸一摸凉凉的～',
  },
  qiufen: {
    wear: '秋分昼夜一样长，穿舒适的秋装，记得早晚要添衣！',
    eat: '秋分吃秋菜！还可以吃月饼（如果中秋节到了），圆圆的月饼代表团圆！',
    outdoor: '去放风筝！秋天风大，风筝飞得最高！也可以踩踩金黄的落叶，沙沙响！',
  },
  hanlu: {
    wear: '寒露比较凉了，要穿厚一些的秋装，脚上穿上闭口的鞋，不要露脚趾头！',
    eat: '寒露吃螃蟹和柿子！橙黄色的螃蟹，软糯的柿子，都是秋天最棒的美食！',
    outdoor: '去看看枫叶红了没有，红红黄黄的叶子捡一把，夹在书里做书签！',
  },
  shuangjiang: {
    wear: '霜降要穿秋冬装了！穿上厚外套，围巾也可以拿出来了，暖暖的！',
    eat: '霜降吃柿子！红彤彤软软的柿子，甜甜的，据说能防冻！还可以喝热汤！',
    outdoor: '早上去草地上找白白的霜！用手指碰一碰霜，哇，凉凉的，好神奇！',
  },
  lidong: {
    wear: '立冬要穿冬衣啦！羽绒服、帽子、手套都拿出来，全副武装准备过冬！',
    eat: '立冬吃饺子！热腾腾的饺子，暖暖的身体，一家人一起包饺子最开心！',
    outdoor: '去找找有没有松鼠在藏过冬的粮食，它们把坚果埋起来，留着冬天吃！',
  },
  xiaoxue: {
    wear: '小雪下雪啦！穿上厚厚的棉衣，戴上毛绒帽子，冬天的装备全上！',
    eat: '小雪腌咸菜！还可以吃热腾腾的羊肉汤，暖烘烘的，从里到外都是热的！',
    outdoor: '如果下雪了，快去堆雪人！给雪人戴上胡萝卜鼻子，好可爱！',
  },
  daxue: {
    wear: '大雪天气超级冷！穿最厚的棉衣或者羽绒服，帽子围巾手套一个都不少！',
    eat: '大雪喝八宝粥！红红绿绿各种豆子和米，甜甜的，抗冻又好吃！',
    outdoor: '下大雪啦！去打雪仗、堆雪人！接雪花放在手上，看它慢慢融化成水！',
  },
  dongzhi: {
    wear: '冬至是一年最冷的开始！把最厚的衣服都穿上，出门一定要捂严实！',
    eat: '冬至吃汤圆！圆圆的汤圆，一家人围在一起吃，热热闹闹，团团圆圆！',
    outdoor: '数九寒冬开始啦！每天画一个圆圈，九九八十一天后，春天就来啦！',
  },
  xiaohan: {
    wear: '小寒超级冷！穿最厚的羽绒服，脖子上系围巾，戴厚手套，保暖第一！',
    eat: '小寒喝腊八粥！各种各样的豆子和果仁，甜甜糯糯，暖暖的冬日美食！',
    outdoor: '一起去堆个超大雪人吧！还可以在雪地上踩脚印，看看自己的脚有多大！',
  },
  dahan: {
    wear: '大寒是最冷的时候！把所有保暖的衣服都穿上，出门就像一个小球球哈！',
    eat: '大寒吃糯米饭！热腾腾的糯米饭，软糯香甜，给身体加满能量过冬天！',
    outdoor: '在暖暖的屋子里做手工！用红纸剪小灯笼，为春节做准备，新年快要到啦！',
  },
};

// ─────────────────────────────────────────────
// 当季实景图生成 Prompt（写实风格）
// ─────────────────────────────────────────────
export const sceneryPrompts: Record<string, string> = {
  lichun: '立春时节，中国乡村，柳条吐出嫩绿新芽，田间第一朵野花盛开，远处农夫犁地，晨雾笼罩山野，写实摄影风格，自然光，超高清',
  yushui: '雨水节气，春雨绵绵，池塘水面泛起涟漪，嫩绿草芽破土而出，青蛙探头水边，山间云雾弥漫，写实自然摄影，柔和光线',
  jingzhe: '惊蛰时节，桃花盛开满山，春雷过后天空湛蓝，青蛙从泥地中探头，田野间布谷鸟飞过，写实摄影风格，春日暖阳',
  chunfen: '春分时节，油菜花海金黄灿烂，蝴蝶翩翩起舞，远处青山苍翠，蓝天白云，儿童在花田放风筝，写实摄影风格',
  qingming: '清明节气，烟雨江南，绿柳依依，杏花盛开，踏青游人漫步田间小路，青山隐隐，写实自然风光摄影',
  guyu: '谷雨时节，茶园嫩绿，茶农采茶，雨后山野清新，牡丹花盛放，农田里嫩苗破土，写实摄影风格，自然光',
  lixia: '立夏时节，荷叶初展田田，青蛙跳上荷叶，稻田插秧，燕子低飞，绿荫浓郁，写实夏日自然摄影',
  xiaoman: '小满时节，麦田翠绿金黄，麦穗饱满沉甸甸，蜜蜂在花间飞舞，农村全景，蓝天白云，写实农田摄影',
  mangzhong: '芒种时节，金黄麦浪滚滚，农民挥镰收割，田间蝴蝶飞舞，梅雨季节天空，写实农耕文化摄影',
  xiazhi: '夏至时节，荷花盛开粉红如霞，荷叶上露珠晶莹，蜻蜓点水，正午阳光强烈，写实夏日水乡摄影',
  xiaoshu: '小暑时节，荷花盛放，荷叶铺满水面，知了鸣叫，榕树成荫，儿童树下纳凉，写实中国夏日摄影',
  dashu: '大暑时节，骄阳似火，向日葵田一望无际，蜻蜓在稻田上空飞翔，远处山脉在热浪中摇曳，写实夏日摄影',
  liqiu: '立秋时节，梧桐叶开始变黄，稻田金黄，秋风吹过树梢，蟋蟀在草间，天空湛蓝，写实初秋摄影',
  chushu: '处暑时节，田野稻谷金黄丰收，晒稻场上农民忙碌，天高云淡，候鸟南飞成行，写实秋日农村摄影',
  bailu: '白露时节，清晨草叶上露珠晶莹，枫树渐红，芦苇穗随风摇曳，山间薄雾，写实秋日晨景摄影',
  qiufen: '秋分时节，枫叶如火如荼，银杏叶金黄满地，果园苹果压弯枝头，天空高远，写实中国秋日摄影',
  hanlu: '寒露时节，枫叶漫山红遍，菊花盛开，螃蟹肥美，霜前草尖泛白，写实深秋自然摄影',
  shuangjiang: '霜降时节，草地上铺满白霜，枯黄落叶飘零，柿子挂满枝头橙红，晨雾中山村，写实深秋摄影',
  lidong: '立冬时节，北方平原初雪，麦苗覆盖白雪，松树苍翠，炊烟袅袅农家小院，写实冬日摄影',
  xiaoxue: '小雪时节，白雪覆盖山野，村庄屋顶积雪，孩子踩雪留下脚印，银装素裹，写实冬日雪景摄影',
  daxue: '大雪时节，山村大雪纷飞，白雪皑皑，儿童堆雪人，雪地脚印，松枝压雪，写实中国北方雪景摄影',
  dongzhi: '冬至时节，夕阳西下最长夜，家家户户灯火通明，热气腾腾的饺子出锅，屋外白雪，写实冬至摄影',
  xiaohan: '小寒时节，腊梅傲雪盛开，白雪映衬黄花，冰挂垂枝，远处山野银白，写实冬日腊梅摄影',
  dahan: '大寒时节，春节将近，家家户户贴春联挂灯笼，红红喜庆，雪地年货集市，写实中国年味摄影',
};