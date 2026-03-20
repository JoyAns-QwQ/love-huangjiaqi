import { post } from './request';

// 微信登录
export async function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: async ({ code }) => {
        try {
          const res = await post('/auth/login', { code });
          wx.setStorageSync('token', res.token);
          wx.setStorageSync('userInfo', res.user);
          resolve(res.user);
        } catch (e) {
          reject(e);
        }
      },
      fail: reject
    });
  });
}

// 获取token
export function getToken() {
  return wx.getStorageSync('token');
}

// 检查是否登录
export function isLoggedIn() {
  return !!getToken();
}

// 获取用户信息
export function getUserInfo() {
  return wx.getStorageSync('userInfo');
}

// 登出
export function logout() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
}

// 获取当前用户ID
export function getUserId() {
  const userInfo = getUserInfo();
  return userInfo ? userInfo.userId : null;
}
