// 安全过滤模块 - 封闭知识库，确保儿童安全

// 敏感词列表
const SENSITIVE_WORDS = [
  '暴力', '色情', '赌博', '毒品', '自杀', '杀人',
  '血腥', '恐怖', '炸弹', '枪支', '武器',
  '政治', '宗教极端', '邪教', '传销',
  '广告', '推销', '优惠', '打折', '促销',
  '贷款', '借款', '信用卡', '网贷'
];

// 检查文本是否包含敏感词
export function containsSensitiveContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return SENSITIVE_WORDS.some(word => lowerText.includes(word));
}

// 过滤敏感词，替换为星号
export function filterText(text: string): string {
  let result = text;
  for (const word of SENSITIVE_WORDS) {
    const regex = new RegExp(word, 'gi');
    result = result.replace(regex, '*'.repeat(word.length));
  }
  return result;
}

// 验证输入是否与节气相关
const SOLAR_TERM_KEYWORDS = [
  '春', '夏', '秋', '冬', '节气', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑',
  '立秋', '处暑', '白露', '秋分', '寒露', '霜降',
  '立冬', '小雪', '大雪', '冬至', '小寒', '大寒',
  '天气', '气候', '温度', '习俗', '故事', '诗词', '古诗',
  '吃什么', '做什么', '穿什么', '农事', '种地', '庄稼',
  '花', '草', '树', '雨', '雪', '风', '太阳', '月亮',
  '饺子', '汤圆', '粽子', '月饼', '春饼', '腊八粥',
  '学习', '知识', '为什么', '怎么', '什么', '哪里',
  '你好', '谢谢', '再见', '早上好', '晚上好'
];

export function isSolarTermRelated(text: string): boolean {
  const lowerText = text.toLowerCase();
  return SOLAR_TERM_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// 安全的AI回复模板
export const SAFE_RESPONSES = {
  unrelated: '小朋友，我是节气小老师，只回答和二十四节气有关的问题哦！你可以问我关于春天、夏天、秋天、冬天的事情。',
  sensitive: '请使用文明用语哦！我们一起来学习二十四节气吧。',
  error: '哎呀，我暂时想不起来了，请稍等一下再试试吧！',
  greeting: '你好呀！我是节气小老师，很高兴认识你！你想了解哪个节气呢？',
  default: '这个问题很有趣！不过我更擅长讲二十四节气的故事，你想听哪个节气的故事呢？'
};