const BASE_URL = 'http://localhost:3001/api/v1'; // 替换为你的实际API地址
const REQUEST_TIMEOUT = 10000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// 刷新token
async function refreshToken() {
  try {
    const token = wx.getStorageSync('token');
    if (!token) return null;

    const res = await post('/auth/refresh', { token });
    wx.setStorageSync('token', res.token);
    return res.token;
  } catch (e) {
    wx.removeStorageSync('token');
    return null;
  }
}

// 请求拦截器
function requestInterceptor(config) {
  const token = wx.getStorageSync('token');
  if (token) {
    config.header = {
      ...config.header,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
}

// 响应拦截器
function responseInterceptor(response) {
  const { statusCode, data } = response;
  if (statusCode === 401) {
    wx.removeStorageSync('token');
    wx.navigateTo({ url: '/pages/login/login' });
    return Promise.reject(new Error('未授权'));
  }
  return data;
}

// 错误处理
function handleError(error, retryCount = 0) {
  console.error(`Request error (attempt ${retryCount + 1}):`, error);

  // 如果是网络错误且还有重试次数，返回可重试的Promise
  if (retryCount < MAX_RETRIES - 1 && (error.errMsg?.includes('request:fail') || error.errMsg?.includes('timeout'))) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(error);
      }, RETRY_DELAY * (retryCount + 1));
    });
  }

  // 显示错误提示
  wx.showToast({
    title: '网络请求失败',
    icon: 'none',
    duration: 2000
  });

  return Promise.reject(error);
}

// 封装请求方法
async function request(method, url, data = {}, config = {}) {
  let retryCount = 0;

  while (retryCount < MAX_RETRIES) {
    try {
      const token = await refreshToken();
      if (token) {
        config.header = {
          ...config.header,
          Authorization: `Bearer ${token}`
        };
      }

      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: BASE_URL + url,
          method,
          data,
          header: {
            'Content-Type': 'application/json',
            ...config.header
          },
          timeout: REQUEST_TIMEOUT,
          success: resolve,
          fail: reject
        });
      });

      return responseInterceptor(response);
    } catch (error) {
      const shouldRetry = await handleError(error, retryCount);
      if (!shouldRetry) break;
      retryCount++;
    }
  }

  return Promise.reject(new Error(`请求失败，已重试 ${MAX_RETRIES} 次`));
}

// GET请求
export function get(url, config = {}) {
  return request('GET', url, {}, config);
}

// POST请求
export function post(url, data = {}, config = {}) {
  return request('POST', url, data, config);
}

// PUT请求
export function put(url, data = {}, config = {}) {
  return request('PUT', url, data, config);
}

// DELETE请求
export function del(url, config = {}) {
  return request('DELETE', url, {}, config);
}

// 实时数据同步
export function subscribeToEvents(callback) {
  // 模拟WebSocket连接，实际项目中应使用WebSocket
  const interval = setInterval(() => {
    get('/events')
      .then(events => callback(events))
      .catch(error => console.error('获取事件失败:', error));
  }, 30000); // 每30秒同步一次

  return () => clearInterval(interval);
}
