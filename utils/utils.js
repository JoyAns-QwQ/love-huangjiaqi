// 工具函数

// 获取当前用户ID
export function getUserId() {
  const userInfo = wx.getStorageSync('userInfo');
  return userInfo ? userInfo.userId : null;
}

// 格式化日期
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 格式化时间
export function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 生成随机ID
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 显示提示信息
export function showToast(title, icon = 'none') {
  wx.showToast({
    title,
    icon,
    duration: 2000
  });
}

// 显示加载中
export function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

// 隐藏加载中
export function hideLoading() {
  wx.hideLoading();
}

// 导航到页面
export function navigateTo(url) {
  wx.navigateTo({ url });
}

// 重启应用
export function reLaunch() {
  wx.reLaunch();
}

// 获取设备信息
export function getDeviceInfo() {
  return wx.getSystemInfoSync();
}

// 检查网络状态
export function checkNetwork() {
  return wx.getNetworkType();
}

// 存储数据
export function setStorage(key, value) {
  wx.setStorageSync(key, value);
}

// 获取存储数据
export function getStorage(key) {
  return wx.getStorageSync(key);
}

// 删除存储数据
export function removeStorage(key) {
  wx.removeStorageSync(key);
}

// 清空存储
export function clearStorage() {
  wx.clearStorageSync();
}
