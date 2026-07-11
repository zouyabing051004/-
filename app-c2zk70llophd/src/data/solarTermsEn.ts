// 二十四节气标准英文译名（联合国教科文组织非遗名录常用译法）
export const SOLAR_TERM_EN: Record<string, string> = {
  lichun: 'Start of Spring',
  yushui: 'Rain Water',
  jingzhe: 'Awakening of Insects',
  chunfen: 'Spring Equinox',
  qingming: 'Pure Brightness',
  guyu: 'Grain Rain',
  lixia: 'Start of Summer',
  xiaoman: 'Grain Buds',
  mangzhong: 'Grain in Ear',
  xiazhi: 'Summer Solstice',
  xiaoshu: 'Minor Heat',
  dashu: 'Major Heat',
  liqiu: 'Start of Autumn',
  chushu: 'End of Heat',
  bailu: 'White Dew',
  qiufen: 'Autumn Equinox',
  hanlu: 'Cold Dew',
  shuangjiang: "Frost's Descent",
  lidong: 'Start of Winter',
  xiaoxue: 'Minor Snow',
  daxue: 'Major Snow',
  dongzhi: 'Winter Solstice',
  xiaohan: 'Minor Cold',
  dahan: 'Major Cold',
};

export const SEASON_EN: Record<string, string> = {
  春: 'Spring',
  夏: 'Summer',
  秋: 'Autumn',
  冬: 'Winter',
};

export function termNameEn(id: string): string {
  return SOLAR_TERM_EN[id] ?? '';
}
