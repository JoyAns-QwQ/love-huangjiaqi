const festivalInfo = {
  '1-1': '元旦',
  '2-14': '情人节',
  '3-8': '妇女节',
  '3-12': '植树节',
  '4-1': '愚人节',
  '5-1': '劳动节',
  '5-4': '青年节',
  '6-1': '儿童节',
  '7-1': '建党节',
  '8-1': '建军节',
  '9-10': '教师节',
  '10-1': '国庆节',
  '12-25': '圣诞节'
};

const solarTerms = [
  { name: '小寒', date: '1-5' },
  { name: '大寒', date: '1-20' },
  { name: '立春', date: '2-4' },
  { name: '雨水', date: '2-19' },
  { name: '惊蛰', date: '3-6' },
  { name: '春分', date: '3-21' },
  { name: '清明', date: '4-5' },
  { name: '谷雨', date: '4-20' },
  { name: '立夏', date: '5-6' },
  { name: '小满', date: '5-21' },
  { name: '芒种', date: '6-6' },
  { name: '夏至', date: '6-22' },
  { name: '小暑', date: '7-7' },
  { name: '大暑', date: '7-23' },
  { name: '立秋', date: '8-8' },
  { name: '处暑', date: '8-23' },
  { name: '白露', date: '9-8' },
  { name: '秋分', date: '9-23' },
  { name: '寒露', date: '10-8' },
  { name: '霜降', date: '10-24' },
  { name: '立冬', date: '11-8' },
  { name: '小雪', date: '11-22' },
  { name: '大雪', date: '12-7' },
  { name: '冬至', date: '12-22' },
  { name: '小寒', date: '1-5' },
  { name: '大寒', date: '1-20' }
];

// 获取节日信息
export function getFestivalInfo(month, day) {
  const key = `${month}-${day}`;
  return festivalInfo[key] || null;
}

// 获取节气信息
export function getSolarTerm(month, day) {
  const dateStr = `${month}-${day}`;
  return solarTerms.find(term => term.date === dateStr) || null;
}

// 获取农历信息
export function getLunarInfo(year, month, day) {
  // 这里可以添加农历计算逻辑
  // 简化版：返回节日或节气信息
  const festival = getFestivalInfo(month, day);
  const solarTerm = getSolarTerm(month, day);
  
  return {
    festival,
    solarTerm: solarTerm ? solarTerm.name : null,
    isHoliday: festival !== null || solarTerm !== null
  };
}
