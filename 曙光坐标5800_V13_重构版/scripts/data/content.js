/* 曙光坐标·5800 — 事实与内容主数据
   自 V12 app/data/content.ts 原样继承：事实陈述、数字、来源 ID/URL、图片路径与身份边界均未改动。*/
(function () {
  "use strict";
const sources = [
  { id: "SRC-01", title: "在牛河梁进行拉网式排查 为红山文化申遗全力冲刺", publisher: "辽宁省文化和旅游厅／辽宁日报", url: "https://whly.ln.gov.cn/whly/mtjj/2026030511221196726/index.shtml", grade: "A2" },
  { id: "SRC-02", title: "牛河梁遗址第一地点台基发掘简报", publisher: "中国社会科学院考古研究所／《考古》2026年第1期", url: "https://kaogu.cssn.cn/xsqy/kycg/jbbg/202602/W020260228597873858401.pdf", grade: "A1" },
  { id: "SRC-03", title: "牛河梁九台最新解读", publisher: "中国日报网转辽宁日报", url: "https://ln.chinadaily.com.cn/a/202606/09/WS6a279e5da310942cc49b0bf6.html", grade: "B1" },
  { id: "SRC-04", title: "全国十大考古新发现：牛河梁遗址", publisher: "辽宁省文化和旅游厅", url: "https://whly.ln.gov.cn/whly/wlzt/lnww/qgsdkg/FCF6E28E91D248C2BF5119121DB4FB86/index.shtml", grade: "A2" },
  { id: "SRC-05", title: "牛河梁第一地点九台相关报道", publisher: "朝阳市人民政府转载央视", url: "https://www.chaoyang.gov.cn/html/CYSZF/202409/0172705538617338.html", grade: "B1" },
  { id: "SRC-06", title: "牛河梁台基与规划专家访谈", publisher: "朝阳市自然资源局", url: "https://zrzyj.chaoyang.gov.cn/html/ZRZYJ/202409/0172587053112122.html", grade: "B1" },
  { id: "SRC-07", title: "红山女神像与牛河梁资料", publisher: "人民日报海外版", url: "https://paper.people.com.cn/rmrbhwb/html/2024-08/06/content_26073127.htm", grade: "B1" },
  { id: "SRC-08", title: "牛河梁未解之谜专题", publisher: "新华网", url: "https://www.news.cn/politics/20240821/3f813f81373240eea2540e46fe9c8730/c.html", grade: "B1" },
  { id: "SRC-09", title: "礼出红山", publisher: "中国社会科学网", url: "https://cssn.cn/kgxc/kgxc_kgsb/202207/t20220728_5431503.shtml", grade: "A2" },
  { id: "SRC-10", title: "牛河梁墓葬与玉器统计讲座记录", publisher: "中国科学院大学", url: "https://renwen.ucas.ac.cn/index.php/rczp/2015-12-09-08-37-4/55672-2022-09-21-01-06-37", grade: "B2" },
  { id: "SRC-11", title: "Sites of Hongshan Culture — Tentative List Ref.5804", publisher: "UNESCO World Heritage Centre", url: "https://whc.unesco.org/en/tentativelists/5804/", grade: "A1" },
  { id: "SRC-12", title: "辽宁省牛河梁遗址保护条例", publisher: "辽宁省文化和旅游厅", url: "https://whly.ln.gov.cn/whly/zfxxgk/fdzdgknr/lzyj/dfxfg/2025122609264496858/index.shtml", grade: "A1" },
  { id: "SRC-13", title: "牛河梁红山文化遗址保护规划（2025—2040）征求意见公告", publisher: "朝阳市文旅广电局", url: "https://wlgdj.chaoyang.gov.cn/html/CYWLG/202605/0177917473100994.html", grade: "A2" },
  { id: "SRC-14", title: "何以文明·牛河梁数字展", publisher: "央视央博", url: "https://yangbo.cctv.com/2024/04/07/ARTIs1hYUe52Jjaj23WGKSdA240407.shtml", grade: "B1" },
  { id: "SRC-15", title: "红山文化", publisher: "中国大百科全书", url: "https://www.zgbk.com/ecph/words?Name=%E7%BA%A2%E5%B1%B1%E6%96%87%E5%8C%96&SiteID=1", grade: "B1" },
  { id: "SRC-16", title: "Demographic and climatic changes in the West Liao River Basin", publisher: "Nature Communications", url: "https://www.nature.com/articles/s41467-019-12138-0", grade: "A2" },
  { id: "SRC-17", title: "Early mixed farming and sedentism in Northeast China", publisher: "PLOS ONE", url: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0218751", grade: "A2" },
  { id: "SRC-18", title: "小河沿文化", publisher: "中国大百科全书", url: "https://www.zgbk.com/ecph/words?Name=%E5%B0%8F%E6%B2%B3%E6%B2%BF%E6%96%87%E5%8C%96&SiteID=1", grade: "B1" },
  { id: "SRC-19", title: "红山文化考古发现与研究史", publisher: "中国社会科学网", url: "https://www.cssn.cn/lsx/lsx_kgx/202210/t20221024_5552755.shtml", grade: "B1" },
  { id: "SRC-20", title: "Regional human activity and environmental change in the Yan-Liao region", publisher: "Journal of Geographical Sciences", url: "https://link.springer.com/article/10.1007/s11442-019-1609-y", grade: "A2" },
];

const chapters = [
  {
    id: "PAN-01", slug: "land-and-people", no: "01", title: "地与人：辽西并非文明的背景板", titleEn: "Land and People", eyebrow: "山脊 · 河谷 · 资源",
    thesis: "山地、河谷和资源塑造了选择，却不能单独解释社会为何变得复杂。",
    body: "牛河梁位于辽西山地河谷环境，遗址地点多见于山脊或丘顶。公众常把环境直接写成文明的原因；考古更谨慎：环境提供条件，人群的技术、协作与观念才让条件变成历史。",
    known: ["遗址区常用海拔口径约550—680米", "辽西地区在更早阶段已有定居与植物利用的考古实例", "当代地貌照片只能帮助理解区域尺度"],
    inferred: "地形与视野可能影响地点选择，但不能由地形直接推出礼仪功能。",
    unknown: "5800年前的微地貌、植被与季节性路径仍需多学科重建。",
    image: "/assets/maps_environment_methods/environment/MAP_ENV_003_Lingyuan_South_G25.webp", imageAlt: "凌源南部当代山地与河谷景观", imageLabel: "当代辽西区域景观｜非史前原貌",
    secondaryImages: [
      { src: "/assets/maps_environment_methods/environment/MAP_ENV_004_Shuiquan_Approaching_Niuheliang.webp", alt: "水泉村方向的当代山地道路", label: "接近牛河梁的当代区域景观" },
      { src: "/assets/maps_environment_methods/environment/MAP_ENV_001_Dalai_Nur_Landsat_NASA.webp", alt: "辽西地区遥感环境比较图", label: "区域环境比较素材｜非牛河梁测绘图" },
    ], claimIds: ["HIS-003", "HIS-016"], sourceIds: ["SRC-16", "SRC-17"], accent: "earth",
  },
  {
    id: "PAN-02", slug: "cultural-sequence", no: "02", title: "时间不是直线：文化序列与源流", titleEn: "A Non-linear Cultural Sequence", eyebrow: "延续 · 并存 · 差异",
    thesis: "小河西、兴隆洼、赵宝沟、红山与小河沿，并不是一列整齐接替的车厢。",
    body: "类型学、碳十四测年与区域调查把许多遗址放入时间框架，但文化之间仍可能并存、重叠并呈现地区差异。把所有变化画成单线进化，会抹去真实历史的复杂性。大型礼仪中心约5800—5300 cal BP是遗址活动研究口径，“古国时代第一阶段约5800—5200年”则是更宏观的阶段框架；对象不同，不能混写成一条精确年表。",
    known: ["红山大型礼仪中心常用年代框架约距今5800—5300年", "区域研究汇集数百个碳十四数据", "不同文化的器物和聚落材料可进行比较"],
    inferred: "器物风格的延续可能反映技术与观念传递，但不等于族群身份不变。",
    unknown: "不同区域之间人口移动、知识交换与年代边界仍在持续研究。",
    image: "/assets/early_culture_sequence/EC004_xinglongwa_pottery_group_01.webp", imageAlt: "兴隆洼文化陶器群博物馆陈列", imageLabel: "兴隆洼文化陶器群｜文化序列比较",
    secondaryImages: [
      { src: "/assets/early_culture_sequence/EC001_xiaohexi_pottery_miniature_head.webp", alt: "小河西文化陶塑人头像", label: "小河西文化比较材料" },
      { src: "/assets/early_culture_sequence/EC012_xiaoheyan_bird_shaped_pottery_jar.webp", alt: "小河沿文化鸟形陶罐", label: "小河沿文化比较材料" },
    ], claimIds: ["HIS-001", "HIS-002", "HIS-005"], sourceIds: ["SRC-15", "SRC-16"], accent: "jade",
  },
  {
    id: "PAN-03", slug: "settlement-and-subsistence", no: "03", title: "生活的尺度：聚落、工具与生业", titleEn: "Settlement and Subsistence", eyebrow: "房址 · 工具 · 食物",
    thesis: "礼仪中心之外，日常生活的证据正在改变牛河梁的旧印象。",
    body: "房址、窖穴、磨盘、石刀、陶器以及动植物遗存共同提示，辽西史前人群通过黍作、养猪、狩猎与采集组织生活。2026年区域调查公布的日用陶片与聚落群线索，使礼仪和生活的关系重新成为问题。",
    known: ["区域遗址可见半地穴房址与储藏设施", "磨盘、石刀和陶器是生业研究的重要材料", "2026调查公布1599片日用陶片与5个聚落群线索"],
    inferred: "生活活动与礼仪活动可能在更大景观中相互交叠。",
    unknown: "不同地点之间是否季节性分工、人口如何流动，尚不能由陶片数量直接回答。",
    image: "/assets/early_culture_sequence/EC006_xinglongwa_grinding_slab_and_roller.webp", imageAlt: "兴隆洼文化石磨盘和石磨棒", imageLabel: "石磨盘与石磨棒｜区域生业比较材料",
    secondaryImages: [
      { src: "/assets/artifacts_sites_expanded/AX022_stone_knife_liaoning.webp", alt: "辽宁省博物馆陈列的石刀", label: "生产工具比较标本" },
      { src: "/assets/environment_methods_expanded/MX002_charred_food_crust_microscope.webp", alt: "显微镜下炭化食物残留", label: "现代考古分析方法示例" },
    ], claimIds: ["HIS-004", "HIS-008", "CLM-021"], sourceIds: ["SRC-01", "SRC-17"], accent: "earth",
  },
  {
    id: "PAN-04", slug: "craft-and-exchange", no: "04", title: "物如何被做成：工艺、陶器与交换", titleEn: "Craft, Pottery and Exchange", eyebrow: "材料 · 技术 · 路线",
    thesis: "技术会在材料上留下痕迹，但一条交流路线不能只凭相似造型被画出来。",
    body: "制陶、石器与玉器研究可以从原料、制作痕迹与使用磨损讨论技术。实验考古帮助解释‘可能怎样做’，却不等于重演了某一件红山器物的真实制作过程。",
    known: ["调查公布筒形器陶片598片", "数百件玉器样本已进入材料检测", "实验考古可检验工序是否可行"],
    inferred: "器形与技术相似可能提示区域联系，需要原料和年代共同约束。",
    unknown: "玉料产地、作坊位置和具体交换路线仍需更多检测与发掘证据。",
    image: "/assets/environment_methods_expanded/MX001_experimental_pottery_shaping_decoration.webp", imageAlt: "现代实验考古中的陶器成形与纹饰制作", imageLabel: "现代实验考古｜非红山工艺实录",
    secondaryImages: [
      { src: "/assets/artifacts_sites/A013_painted_pottery_inner_mongolia_museum.webp", alt: "红山文化彩陶博物馆陈列", label: "彩陶比较标本" },
      { src: "/assets/environment_methods_expanded/MX004_experimental_archaeology_pottery_kiln.webp", alt: "现代实验考古陶窑", label: "实验陶窑｜仅解释方法" },
    ], claimIds: ["CLM-021", "CLM-029"], sourceIds: ["SRC-01", "SRC-09"], accent: "night",
  },
  {
    id: "PAN-05", slug: "jade-and-belief", no: "05", title: "玉不只是图案：器形、语境与观念", titleEn: "Jade, Context and Belief", eyebrow: "器形 · 墓序 · 解释",
    thesis: "一件玉器能被看见；它代表谁、为何被放置，则必须回到出土语境。",
    body: "玉器的视觉魅力很容易遮蔽考古方法。器类、制作痕迹、空间位置与组合关系必须并置，才能区分对象本身、研究判断与现代想象。本站大量馆藏图只作为红山文化比较标本。",
    known: ["66墓专题样本中37座有玉，共145件", "N2Z1M21有玉器20件，为该样本中单墓数量最多实例", "玉器数量与墓葬规格必须分开记录"],
    inferred: "玉器组合与墓葬差异可能关联礼仪秩序和社会位置。",
    unknown: "具体身份、称谓与神话人物无法由器形直接确定。",
    image: "/assets/artifacts_sites/A003_jade_hooked_cloud_npm.webp", imageAlt: "红山文化勾云形玉佩馆藏图", imageLabel: "红山文化馆藏比较标本｜非牛河梁出土声明",
    secondaryImages: [
      { src: "/assets/artifacts_sites/A002_jade_pig_dragon_npm.webp", alt: "红山文化玉猪龙馆藏图", label: "器形比较标本" },
      { src: "/assets/artifacts_sites_expanded/AX025_jade_burial_group_liaoning_02.webp", alt: "辽宁省博物馆玉器随葬展示", label: "博物馆展示语境｜非发掘现场" },
      { src: "/assets/artifacts_sites_expanded/AX034_silkworm_pendant_slam.webp", alt: "圣路易斯艺术博物馆藏红山文化蚕形玉佩", label: "蚕形玉佩｜跨馆比较标本｜Public Domain｜非牛河梁出土" },
      { src: "/assets/artifacts_sites_expanded/AX035_squarish_bi_aic_front.webp", alt: "芝加哥艺术博物馆藏红山文化圆角方形玉璧正面", label: "圆角方形玉璧·正面｜跨馆比较标本｜CC0｜非牛河梁出土" },
      { src: "/assets/artifacts_sites_expanded/AX036_squarish_bi_aic_back.webp", alt: "芝加哥艺术博物馆藏红山文化圆角方形玉璧背面", label: "圆角方形玉璧·背面｜与上一图为同一件器物｜CC0" },
    ], claimIds: ["CLM-014", "CLM-016", "CLM-017"], sourceIds: ["SRC-09", "SRC-10"], accent: "jade",
  },
  {
    id: "PAN-06", slug: "ritual-architecture", no: "06", title: "营造共同体：台、庙、坛与冢", titleEn: "Ritual Architecture", eyebrow: "尺度 · 方位 · 营造",
    thesis: "建筑规模是可测量的证据，建筑原貌却不能被轻易补全。",
    body: "第一地点台基与女神庙、第二地点三重圆坛与积石冢，共同呈现复杂礼仪景观。我们用比例、剖面与材料表达营造事实，同时拒绝把未经证实的屋顶、色彩和仪式画成定论。",
    known: ["第一地点目前应写至少9座台基，女神庙位于9号台基", "2号台基南北64.61米、东西约41.39米", "第二地点三圈直径约11、15.6、22米"],
    inferred: "大尺度土石营造说明跨家庭协作与持续组织能力。",
    unknown: "台基上的具体建筑形态、使用频率与仪式过程仍未被完整确认。",
    image: "/assets/generated/three-rings-study.webp", imageAlt: "AI生成的三重环形土石材料模型设计示意", imageLabel: "AI生成材料模型／设计示意｜依据公开直径关系，不对应遗址测绘与建筑复原",
    secondaryImages: [
      { src: "/assets/generated/nine-platforms-study.webp", alt: "AI生成的土石台基材料模型设计示意", label: "AI生成材料模型／设计示意｜不表达真实位置和比例" },
      { src: "/assets/maps_environment_methods/methods/MAP_METH_004_Aerial_Excavation_Trenches.webp", alt: "考古发掘区航拍方法示例", label: "考古航拍方法示例｜非牛河梁" },
    ], claimIds: ["CLM-005", "CLM-006", "CLM-007", "CLM-012"], sourceIds: ["SRC-02", "SRC-04"], accent: "night",
  },
  {
    id: "PAN-07", slug: "social-complexity", no: "07", title: "差异如何被看见：墓序与社会复杂化", titleEn: "Social Complexity", eyebrow: "工程 · 墓葬 · 组合",
    thesis: "差异可以被测量；身份却不能被现代称谓直接命名。",
    body: "大型工程、墓葬规格、随葬品组合与区域中心性共同构成社会复杂化的证据。它们支持讨论组织能力与分化，却不能直接证明王朝、国王或固定职业。",
    known: ["专题样本共66座墓：37座有玉、29座无玉", "29是66减37的衍生值", "墓葬规格、玉器数量、身份解释是三个不同字段"],
    inferred: "墓葬之间持续而系统的差异提示社会位置并不均一。",
    unknown: "这些差异对应怎样的亲属、礼仪或政治身份，仍存在多种解释。",
    image: "/assets/artifacts_sites_expanded/AX026_jade_burial_group_liaoning_06.webp", imageAlt: "辽宁省博物馆红山文化玉器随葬展示", imageLabel: "红山文化馆藏展示｜不可替代墓葬原位记录",
    secondaryImages: [
      { src: "/assets/artifacts_sites_expanded/AX006_jade_group_liaoning_03.webp", alt: "辽宁省博物馆红山文化玉器组合", label: "器物组合比较" },
      { src: "/assets/artifacts_sites/A017_stone_tools_liaoning_museum.webp", alt: "辽宁省博物馆石器陈列", label: "生产工具比较材料" },
    ], claimIds: ["CLM-013", "CLM-014", "CLM-015", "CLM-016", "CLM-017"], sourceIds: ["SRC-10"], accent: "earth",
  },
  {
    id: "PAN-08", slug: "discovery-and-redrawing", no: "08", title: "答案仍在生长：发现、发掘与重绘", titleEn: "Discovery and Redrawing", eyebrow: "调查 · 测年 · 修正",
    thesis: "新证据不是旧研究的否定，而是旧边界被重新画出的过程。",
    body: "调查、发掘、命名、测年和区域研究共同建构了今天的红山知识。2026年公开的系统调查把更多生活活动材料带入讨论，使‘独立祭祀区’这一简化认识需要被修正。",
    known: ["系统调查面积31.076平方公里", "518指发现陶片的50米网格，不是518处遗址", "调查材料被划分为5个聚落群线索，不等于5座城市"],
    inferred: "居住与礼仪活动在区域景观中可能存在交叠关系。",
    unknown: "聚落群的年代、规模、相互关系仍需发掘和测年进一步约束。",
    image: "/assets/environment_methods_expanded/MX006_archaeological_photogrammetry_fieldwork.webp", imageAlt: "现代考古摄影测量田野工作", imageLabel: "摄影测量方法示例｜非牛河梁调查现场",
    secondaryImages: [
      { src: "/assets/maps_environment_methods/methods/MAP_METH_003_Fieldwalking_Find_Markers.webp", alt: "田野调查发现物标记", label: "田野调查方法示例" },
      { src: "/assets/maps_environment_methods/methods/MAP_METH_001_Chronosphere_Radiocarbon_Lab.webp", alt: "放射性碳测年实验设施", label: "测年设施｜非牛河梁样本" },
    ], claimIds: ["CLM-018", "CLM-019", "CLM-020", "CLM-021", "CLM-022", "CLM-023", "CLM-024"], sourceIds: ["SRC-01"], accent: "jade",
  },
  {
    id: "PAN-09", slug: "protection-and-present", no: "09", title: "遗址仍在今天：保护、申遗与公众责任", titleEn: "Protection and the Present", eyebrow: "法规 · 名录 · 开放",
    thesis: "保护状态、世界遗产预备名单与公众传播，是三套不同的责任。",
    body: "牛河梁的价值不仅在展示，也在持续保护、研究与谨慎传播。本站把法定保护、UNESCO预备名单、规划征求意见和数字资源分别标示，避免把愿景提前写成既成事实。",
    known: ["1988年列入第三批全国重点文物保护单位", "2013年作为红山文化遗址系列的一部分进入UNESCO预备名单Ref.5804", "修订后的保护条例自2026年1月1日起施行"],
    inferred: "开放数据与公众解释可以帮助保护，但必须同步呈现来源、版权和知识边界。",
    unknown: "《保护规划（2025—2040）》当前公开页面为征求意见，不应写成已批准实施。",
    image: "/assets/maps_environment_methods/environment/MAP_ENV_004_Shuiquan_Approaching_Niuheliang.webp", imageAlt: "水泉村方向接近牛河梁的当代区域景观", imageLabel: "当代区域景观｜非遗址本体照片",
    secondaryImages: [
      { src: "/assets/artifacts_sites/A020_hongshan_culture_museum_chifeng.webp", alt: "赤峰红山文化博物馆建筑", label: "当代文化机构｜非牛河梁遗址" },
      { src: "/assets/maps_environment_methods/methods/MAP_METH_005_Total_Station_Karleby.webp", alt: "考古现场全站仪测量", label: "数字记录方法示例" },
    ], claimIds: ["CLM-003", "CLM-004", "CLM-029", "CLM-030"], sourceIds: ["SRC-11", "SRC-12", "SRC-13"], accent: "night",
  },
];

const tourScenes = [
  { id: "T01", no: "01", title: "5800，不是一个神秘数字", titleEn: "Why 5800?", question: "它是一年，还是一个时间坐标？", conclusion: "约5800年前，是认识牛河梁大型礼仪中心的重要时间入口，并非所有遗迹的统一建成年份。", duration: "00:55", image: "/assets/generated/hero-strata-dawn.webp", alt: "地层与曙光构成的AI生成策展意象", sourceIds: ["SRC-07"] },
  { id: "T02", no: "02", title: "辽西与牛河梁", titleEn: "Liaoxi and Niuheliang", question: "为什么地点总在山地与河谷之间出现？", conclusion: "地形提供条件；社会组织才让条件转化为历史。", duration: "00:55", image: "/assets/maps_environment_methods/environment/MAP_ENV_003_Lingyuan_South_G25.webp", alt: "凌源南部当代山地景观", sourceIds: ["SRC-16"] },
  { id: "T03", no: "03", title: "九台与公共工程", titleEn: "Nine Platforms", question: "一座台基怎样让组织能力可见？", conclusion: "至少9座台基与可测量的土石工程，让长期协作成为考古证据。", duration: "01:05", image: "/assets/generated/nine-platforms-study.webp", alt: "AI生成的土石台基材料模型设计示意", sourceIds: ["SRC-02"] },
  { id: "T04", no: "04", title: "女神庙：证据与想象的边界", titleEn: "The Goddess Temple", question: "遗迹确认了什么，又没有替我们确认什么？", conclusion: "塑像与建筑支持礼仪空间判断；人物身份、仪式过程与完整原貌仍属未知。", duration: "01:00", image: "/assets/artifacts_sites/A014_pregnant_female_torso_national_museum_china.webp", alt: "史前女性陶塑比较标本", sourceIds: ["SRC-07"] },
  { id: "T05", no: "05", title: "玉与墓序", titleEn: "Jade and Burial Order", question: "玉器数量能直接等于身份等级吗？", conclusion: "数量、墓葬规格与身份解释必须分开；组合关系比单件造型更接近秩序。", duration: "01:05", image: "/assets/artifacts_sites_expanded/AX025_jade_burial_group_liaoning_02.webp", alt: "辽宁省博物馆玉器随葬展示", sourceIds: ["SRC-10"] },
  { id: "T06", no: "06", title: "2026：旧边界被重绘", titleEn: "Redrawn in 2026", question: "518究竟意味着什么？", conclusion: "它是发现陶片的50米调查网格数，不是遗址数；新材料让生活与礼仪的关系更复杂。", duration: "01:10", image: "/assets/generated/survey-landscape-study.webp", alt: "AI生成的辽西山地调查地景材料模型", sourceIds: ["SRC-01"] },
  { id: "T07", no: "07", title: "保护与仍然开放的问题", titleEn: "Protection and Open Questions", question: "公众如何在好奇与证据之间保持诚实？", conclusion: "把来源、许可与未知一起公开，是数字传播对遗址最基本的尊重。", duration: "01:10", image: "/assets/maps_environment_methods/environment/MAP_ENV_004_Shuiquan_Approaching_Niuheliang.webp", alt: "接近牛河梁的当代区域景观", sourceIds: ["SRC-11", "SRC-12"] },
];

const labs = [
  { id: "coordinate", no: "LAB 01", slug: "coordinate", title: "5800年前：怎样读懂考古年代", titleEn: "Reading Archaeological Time", question: "标题中的“5800”指一个准确年份，还是一段约略的时间范围？", instruction: "点击三个时间范围，分别看它们用于回答“文化阶段”“礼仪中心活动”和“后来变化”中的哪一个问题。", conclusion: "考古年代通常以范围表达。“距今约5800年”是帮助公众进入历史的时间坐标，不是所有遗迹共同建成的某一年。", boundary: "一个阶段范围或一次测年结果，都不能代表整个牛河梁遗址在同一时间发生了同一件事。", sourceIds: ["SRC-07", "SRC-16"], image: "/assets/maps_environment_methods/methods/MAP_METH_001_Chronosphere_Radiocarbon_Lab.webp", imageAvif: "", imageAlt: "现代AMS放射性碳测年设施的展陈与实验空间", imageLabel: "MAP_METH_001 · AMS测年设施｜通用方法图像，非牛河梁样本测定记录", imageWidth: 1920, imageHeight: 1440, objectPosition: "50% 54%" },
  { id: "engineering", no: "LAB 02", slug: "nine-platforms", title: "九座台基：怎样从遗迹看见工程", titleEn: "Reading Engineering from Platform Remains", question: "只剩下台基，研究者怎样判断这里曾进行过大型工程？", instruction: "点击1—9号关系节点，查看目前能够确认的尺度、方向和土石结构，并区分哪些信息仍未被发现。", conclusion: "第一地点目前至少发现9座台基。2号台基的尺度、方向和土石结构可以被测量，这些工程记录支持长期规划与多人协作的判断。", boundary: "台基不是一座完整建筑。现有材料不能确定屋顶、墙体和具体用途，也不能根据编号给台基排列等级。页面中的3×3节点只是查看索引，不是真实平面图。", sourceIds: ["SRC-02"], image: "/assets/generated/nine-platforms-study.webp", imageAvif: "/assets/generated/nine-platforms-study.avif", imageAlt: "AI生成的土石台基研究性概念模型", imageLabel: "AI生成研究性概念模型／设计示意｜不对应台基真实位置、数量与比例", imageWidth: 1586, imageHeight: 992, objectPosition: "50% 54%" },
  { id: "lens", no: "LAB 03", slug: "goddess-lens", title: "女神庙：从考古发现到研究解释", titleEn: "From Finds to Interpretation", question: "同一组材料中，哪些是直接发现，哪些是研究解释，哪些仍然不知道？", instruction: "依次切换“记录事实、综合判断、研究解释、尚未确认”，看一句结论怎样从材料逐步走向解释。", conclusion: "考古工作记录了建筑遗迹以及泥塑人像、动物塑像等材料；多类材料共同支持这里曾是一处重要礼仪空间。", boundary: "现有材料不能直接回答塑像是谁、仪式怎样举行或建筑原貌如何。页面照片是红山文化陶塑比较标本，不是女神庙出土塑像。", sourceIds: ["SRC-07"], image: "/assets/artifacts_sites/A014_pregnant_female_torso_national_museum_china.webp", imageAvif: "", imageAlt: "中国国家博物馆陈列的红山文化陶塑比较标本", imageLabel: "A014 · 红山文化陶塑比较标本｜不是牛河梁女神庙出土塑像", imageWidth: 1000, imageHeight: 1138, objectPosition: "50% 38%" },
  { id: "tomb", no: "LAB 04", slug: "tomb-matrix", title: "66座墓葬样本：玉器数量与墓葬规格", titleEn: "A 66-Burial Sample: Jade and Burial Scale", question: "一座墓随葬的玉器最多，是否就说明它的墓葬规格最高？", instruction: "依次查看全部66座墓、有玉的37座墓和无玉的29座墓。再比较两座重点墓，判断“玉器数量最多”和“墓葬规格较高”是不是同一件事。", conclusion: "在这组66座墓的研究样本中，37座发现了玉器，29座没有记录到玉器。N2Z1M21随葬玉器20件，是样本中玉器数量最多的单座墓；但这一纪录不能证明它的墓葬规格最高。", boundary: "这66座墓是为了回答特定问题而整理的专题研究样本，不是牛河梁已经发现的全部墓葬。页面中的66个方格只用于计数，不代表墓葬的真实位置、年代或大小；馆藏玉器照片也不是这些墓葬的原位记录。", sourceIds: ["SRC-10"], image: "/assets/artifacts_sites_expanded/AX025_jade_burial_group_liaoning_02.webp", imageAvif: "", imageAlt: "辽宁省博物馆红山文化玉器随葬主题展陈", imageLabel: "AX025 · 辽宁省博物馆红山文化玉器随葬主题陈列｜用于观察器物组合，不是66座墓的原位记录", imageWidth: 1920, imageHeight: 1280, objectPosition: "50% 52%" },
  { id: "survey", no: "LAB 05", slug: "survey-redraw", title: "2026区域调查：一个网格能说明什么？", titleEn: "What Can a Survey Grid Tell Us?", question: "一个调查网格里发现了陶片，是否就等于发现了一处独立遗址？", instruction: "先比较较早认识与2026年调查，再点击四个数字，查看每个数字统计的对象和不能代表的内容。", conclusion: "调查覆盖31.076平方公里，以50米×50米网格记录材料；其中518个网格发现陶片，研究者据材料分布提出5个聚落群线索。", boundary: "518不是518处遗址，5个聚落群也不是5座城市。页面方格和AI地景只解释调查方法，不显示真实位置、密度或聚落边界。", sourceIds: ["SRC-01"], image: "/assets/generated/survey-landscape-study.webp", imageAvif: "/assets/generated/survey-landscape-study.avif", imageAlt: "AI生成的辽西山地调查地景材料模型", imageLabel: "AI生成理论地景模型／设计示意｜不表达518个网格真实位置与聚落群边界", imageWidth: 1586, imageHeight: 992, objectPosition: "50% 50%" },
];

const evidenceCards = [
  { id: "E01", title: "“5800年”是什么时间？", statement: "“5800”是进入距今约5800—5200年宏观阶段的时间坐标，不是某一个精确年份。", boundary: "牛河梁大型礼仪中心常用约5800—5300 cal BP描述主要活动时间；两个范围回答的问题不同，不能混写。", claimIds: ["CLM-001", "HIS-002"], sourceIds: ["SRC-07", "SRC-16"], image: { src: "/assets/maps_environment_methods/methods/MAP_METH_001_Chronosphere_Radiocarbon_Lab.webp", assetId: "MAP_METH_001", kind: "通用方法图", alt: "现代AMS放射性碳测年设施的展陈与实验空间", caption: "AMS测年设施｜非牛河梁样本检测记录", fit: "cover" } },
  { id: "E02", title: "牛河梁何时被发现和发掘？", statement: "1979年第十六地点已有局部发现；1981年进行系统发现与确认，1983年开始正式考古发掘。", boundary: "“局部发现”“系统发现”和“正式发掘”是三个不同阶段，不能只保留其中一个年份。", claimIds: ["CLM-002"], sourceIds: ["SRC-04"], image: { src: "/assets/maps_environment_methods/methods/MAP_METH_005_Total_Station_Karleby.webp", assetId: "MAP_METH_005", kind: "通用方法图", alt: "考古人员使用全站仪记录发掘区坐标和编号标记", caption: "系统记录方法｜非牛河梁发掘现场", fit: "cover" } },
  { id: "E03", title: "牛河梁何时获得国家级保护？", statement: "1988年，牛河梁遗址被公布为第三批全国重点文物保护单位。", boundary: "全国重点文物保护单位是中国的法定保护身份，不等于已经列入《世界遗产名录》。", claimIds: ["CLM-003"], sourceIds: ["SRC-04"], image: { src: "/assets/maps_environment_methods/environment/MAP_ENV_003_Lingyuan_South_G25.webp", assetId: "MAP_ENV_003", kind: "真实区域图", alt: "2022年凌源南部城郊、道路与山地景观", caption: "凌源南部当代区域景观｜非保护范围图", fit: "cover" } },
  { id: "E04", title: "牛河梁已经是世界遗产吗？", statement: "2013年，红山文化遗址相关项目进入中国世界遗产预备名单，参考编号为Ref.5804。", boundary: "预备名单是申报前的候选阶段；截至本站最近核验日期，不能写成已经成为世界遗产。", claimIds: ["CLM-004"], sourceIds: ["SRC-11"], image: { src: "/assets/maps_environment_methods/environment/MAP_ENV_004_Shuiquan_Approaching_Niuheliang.webp", assetId: "MAP_ENV_004", kind: "真实区域图", alt: "2022年从水泉村方向接近牛河梁的山地与农田景观", caption: "接近牛河梁的当代景观｜非遗产核心区图", fit: "cover" } },
  { id: "E05", title: "第一地点发现了多少座台基？", statement: "目前的考古材料确认第一地点至少有9座台基。", boundary: "“至少9座”不等于总数已经最终确定，更不能把它们直接写成9座宫殿。", claimIds: ["CLM-005"], sourceIds: ["SRC-02"], image: { src: "/assets/generated/nine-platforms-study.webp", kind: "AI设计示意", alt: "AI生成的辽西山脊土石台基研究性概念模型", caption: "台基群研究性概念模型｜位置与比例均非测绘", fit: "cover", objectPosition: "32% 48%" } },
  { id: "E06", title: "2号台基南北方向有多长？", statement: "发掘记录显示，2号台基南北方向长64.61米。", boundary: "这个数字只描述已记录的尺度，不能单独说明台基上曾建造什么。", claimIds: ["CLM-006"], sourceIds: ["SRC-02"], image: { src: "/assets/generated/nine-platforms-study.webp", kind: "AI设计示意", alt: "土石台基概念模型上的南北向尺度观察区域", caption: "2号台基尺度关系｜数值来自简报，底图为示意", fit: "cover", objectPosition: "55% 42%" } },
  { id: "E07", title: "2号台基东西方向有多宽？", statement: "2号台基东西方向约41.39米。", boundary: "资料使用了“约”，页面也必须保留这一限定，不能把近似值写成绝对精确值。", claimIds: ["CLM-007"], sourceIds: ["SRC-02"], image: { src: "/assets/generated/nine-platforms-study.webp", kind: "AI设计示意", alt: "土石台基概念模型上的东西向尺度观察区域", caption: "2号台基横向尺度关系｜设计示意，非测绘图", fit: "cover", objectPosition: "72% 56%" } },
  { id: "E08", title: "女神庙遗迹有多长？", statement: "公开资料按不同测量范围记为：主体约18.4米；另有总长约22米或25米的口径。", boundary: "这些数字对应不同测量范围，不能相加成一个“唯一长度”，也不能据此复原完整建筑。", claimIds: ["CLM-009"], sourceIds: ["SRC-07"], image: { src: "/assets/maps_environment_methods/methods/MAP_METH_005_Total_Station_Karleby.webp", assetId: "MAP_METH_005", kind: "通用方法图", alt: "考古全站仪测量与坐标记录方法", caption: "尺寸来自考古记录｜图片仅说明测量方法", fit: "cover", objectPosition: "52% 45%" } },
  { id: "E09", title: "泥塑头像留下了哪些直接证据？", statement: "头像残存部分现高22.4厘米、面宽16.5厘米；泥中掺植物纤维，未经烧制，表面曾施红，眼部嵌玉片。", boundary: "尺寸只描述残存部分；材料和工艺也不能直接回答塑像身份或完整原貌。", claimIds: ["CLM-010", "CLM-011"], sourceIds: ["SRC-07"], image: { src: "/assets/artifacts_sites/A014_pregnant_female_torso_national_museum_china.webp", assetId: "A014", kind: "馆藏比较标本", alt: "中国国家博物馆陈列的红山文化女性陶塑比较标本", caption: "红山文化陶塑比较标本｜非女神庙出土头像", fit: "contain" } },
  { id: "E10", title: "三重圆坛有多大？", statement: "第二地点的三圈遗迹直径约为11米、15.6米和22米。", boundary: "三个数字描述的是直径，不是半径，也不是三件器物；页面圆环只作关系示意，不是测绘图。", claimIds: ["CLM-012"], sourceIds: ["SRC-09"], image: { src: "/assets/generated/three-rings-study.webp", kind: "AI设计示意", alt: "AI生成的三重同心土石环材料模型", caption: "三重圆形遗迹材料关系｜设计示意，非遗址测绘", fit: "cover" } },
  { id: "E11", title: "“66座墓”是全部墓葬吗？", statement: "专题统计中的上层积石冢阶段共有66座墓。", boundary: "这是一组有明确阶段与研究问题的专题样本，不能写成牛河梁已经发现的全部墓葬总数。", claimIds: ["CLM-013"], sourceIds: ["SRC-10"], image: { src: "/assets/artifacts_sites/A016_neolithic_tomb_display_liaoning_museum.webp", assetId: "A016", kind: "博物馆复原陈列", alt: "辽宁省博物馆的史前墓葬复原陈列", caption: "史前墓葬复原陈列｜非牛河梁发掘现场；含人体遗存图像", fit: "cover", objectPosition: "50% 40%" } },
  { id: "E12", title: "样本中有多少座墓发现了玉器？", statement: "在这组66座墓中，37座记录到随葬玉器；样本合计记录145件玉器。", boundary: "是否发现玉器只是观察字段，不能单凭“有玉”判断墓主人的身份；145件也不是牛河梁全部玉器。", claimIds: ["CLM-014"], sourceIds: ["SRC-10"], image: { src: "/assets/artifacts_sites/A008_hongshan_jade_burial_object_liaoning_museum.webp", assetId: "A008", kind: "馆藏比较标本", alt: "辽宁省博物馆陈列的红山文化墓葬玉器", caption: "红山文化墓葬玉器展陈｜不对应本样本的具体墓号", fit: "contain" } },
  { id: "E13", title: "“29座无玉墓”怎样得出？", statement: "29由样本总数66减去37座有玉墓计算得到。", boundary: "这是计算结果，不是另一项独立统计；展示时必须同时说明算式和样本范围。", claimIds: ["CLM-015"], sourceIds: ["SRC-10"], image: { src: "/assets/maps_environment_methods/methods/MAP_METH_002_Stratigraphy_An_Son.webp", assetId: "MAP_METH_002", kind: "通用方法图", alt: "带比例尺的考古探方地层剖面记录", caption: "66－37＝29｜背景为通用地层记录图，非牛河梁墓葬", fit: "cover" } },
  { id: "E14", title: "哪座墓被评价为规格较高？", statement: "研究者将N16M4视为目前所知红山文化晚期规格最高的石棺墓之一。", boundary: "这是基于墓葬结构与比较提出的研究评价，不能直接称为“王墓”或断定墓主人身份。", claimIds: ["CLM-016"], sourceIds: ["SRC-10"], image: { src: "/assets/artifacts_sites/A016_neolithic_tomb_display_liaoning_museum.webp", assetId: "A016", kind: "博物馆复原陈列", alt: "辽宁省博物馆的史前墓葬复原陈列", caption: "墓葬空间比较背景｜复原陈列，不对应N16M4", fit: "cover", objectPosition: "50% 58%" } },
  { id: "E15", title: "哪座墓的随葬玉器数量最多？", statement: "N2Z1M21随葬玉器20件，是这组样本中玉器数量最多的单座墓。", boundary: "玉器件数最多不等于墓葬规模最高，也不能直接转换成墓主人的身份称号。", claimIds: ["CLM-017"], sourceIds: ["SRC-10"], image: { src: "/assets/artifacts_sites_expanded/AX025_jade_burial_group_liaoning_02.webp", assetId: "AX025", kind: "馆藏比较标本", alt: "辽宁省博物馆红山文化玉器随葬主题展陈中的玉器", caption: "红山文化随葬主题展陈｜无法对应N2Z1M21", fit: "contain" } },
  { id: "E16", title: "2026年调查覆盖了多大范围？", statement: "公开资料记载的系统调查范围为31.076平方公里。", boundary: "这是调查覆盖面积，不是单处遗址建筑面积，也不是完整保护区面积。", claimIds: ["CLM-018"], sourceIds: ["SRC-01"], image: { src: "/assets/maps_environment_methods/environment/MAP_ENV_005_Lingyuan_Southern_Suburbs_A.webp", assetId: "MAP_ENV_005", kind: "真实区域图", alt: "2022年凌源南部河谷、农田、城镇与山地景观", caption: "凌源南部当代区域景观｜非31.076平方公里边界图", fit: "cover" } },
  { id: "E17", title: "一个调查网格有多大？", statement: "田野记录采用50米×50米网格。", boundary: "网格是记录单位，不等于一处遗址的固定大小。", claimIds: ["CLM-019"], sourceIds: ["SRC-01"], image: { src: "/assets/maps_environment_methods/methods/MAP_METH_003_Fieldwalking_Find_Markers.webp", assetId: "MAP_METH_003", kind: "通用方法图", alt: "调查人员按系统路线进行地表踏查并设置发现标记", caption: "系统地表踏查方法｜非牛河梁调查现场", fit: "cover" } },
  { id: "E18", title: "“518”究竟是什么？", statement: "518指发现陶片的50米调查网格数量。", boundary: "它不是518处遗址，也不是518片陶片。", claimIds: ["CLM-020"], sourceIds: ["SRC-01"], image: { src: "/assets/generated/survey-landscape-study.webp", kind: "AI设计示意", alt: "AI生成的辽西山地调查地景模型与抽象网格痕迹", caption: "518个发现陶片的网格｜理论地景模型，非分布图", fit: "cover", objectPosition: "36% 50%" } },
  { id: "E19", title: "调查记录了多少日用陶片？", statement: "公开调查资料记录1599片日用陶片。", boundary: "这只是该次调查公开的记录数量，不代表区域内全部生活遗物。", claimIds: ["CLM-021"], sourceIds: ["SRC-01"], image: { src: "/assets/artifacts_sites/A012_pottery_vessels_liaoning_museum.webp", assetId: "A012", kind: "馆藏比较标本", alt: "辽宁省博物馆陈列的两件红山文化深腹陶器", caption: "红山文化陶器馆藏比较｜不是2026调查采集陶片", fit: "contain" } },
  { id: "E20", title: "“5个聚落群”意味着什么？", statement: "研究者根据材料聚集关系识别出5组聚落群线索。", boundary: "它们不是5座城市；各组的年代、范围和相互关系仍需继续研究。", claimIds: ["CLM-022"], sourceIds: ["SRC-01"], image: { src: "/assets/generated/survey-landscape-study.webp", kind: "AI设计示意", alt: "AI生成的辽西山地调查模型，以材料聚集表现空间分析", caption: "5个聚落群是分析线索｜不是真实聚落分布地图", fit: "cover", objectPosition: "70% 48%" } },
];

const knowledgeCheck = [
  { q: "标题中的“5800”最准确的含义是？", options: ["所有遗迹的统一建成年份", "距今约5800年的时间入口", "公元前5800年"], answer: 1 },
  { q: "第二地点的11、15.6、22米描述什么？", options: ["三圈直径", "三件玉器", "三圈半径"], answer: 0 },
  { q: "2026调查中的518指什么？", options: ["518处遗址", "518座墓", "发现陶片的50米网格"], answer: 2 },
  { q: "66座墓这一数字如何使用？", options: ["牛河梁全部墓葬总数", "特定专题研究样本", "已知王陵总数"], answer: 1 },
  { q: "牛河梁目前的UNESCO状态是？", options: ["已列入世界遗产", "不在任何名录", "红山文化遗址系列预备名单的一部分"], answer: 2 },
];

  window.DC = Object.assign(window.DC || {}, { sources, chapters, tourScenes, labs, evidenceCards, knowledgeCheck });
})();
