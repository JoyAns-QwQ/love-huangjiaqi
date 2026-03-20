App({
  globalData: {
    userInfo: null,
    isLogin: false,
    ws: null,
    calendars: []
  },

  onLaunch() {
    this.checkLogin();
    this.initWebSocket();
  },

  onShow() {
    // 应用显示时检查登录状态
    this.checkLogin();
  },

  onHide() {
    // 应用隐藏时关闭WebSocket
    if (this.globalData.ws) {
      closeWebSocket();
    }
  },

  onError(err) {
    console.error('App error:', err);
  },

  // 检查登录状态
  checkLogin() {
    const token = getToken();
    const userInfo = getUserInfo();
    
    if (token && userInfo) {
      this.globalData.userInfo = userInfo;
      this.globalData.isLogin = true;
    } else {
      this.globalData.userInfo = null;
      this.globalData.isLogin = false;
    }
  },

  // 初始化WebSocket
  initWebSocket() {
    if (this.globalData.isLogin) {
      connectWebSocket();
      this.globalData.ws = true;
    }
  },

  // 全局登录方法
  login() {
    return new Promise((resolve, reject) => {
      login()
        .then(user => {
          this.globalData.userInfo = user;
          this.globalData.isLogin = true;
          this.initWebSocket();
          resolve(user);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 全局登出方法
  logout() {
    logout();
    this.globalData.userInfo = null;
    this.globalData.isLogin = false;
    closeWebSocket();
  },

  // 获取用户信息
  getUserInfo() {
    return this.globalData.userInfo;
  },

  // 获取登录状态
  isLoggedIn() {
    return this.globalData.isLogin;
  }
});
