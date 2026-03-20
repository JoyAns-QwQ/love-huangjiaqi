Page({
  data: {
    calendars: [],
    selectedCalendar: null,
    inviteCode: '',
    scanning: false
  },

  onLoad() {
    this.loadCalendars();
  },

  loadCalendars() {
    const calendars = wx.getStorageSync('calendars') || [];
    this.setData({ calendars });
  },

  onCalendarSelect(e) {
    const { calendarId } = e.currentTarget.dataset;
    this.setData({ selectedCalendar: calendarId });
  },

  generateInviteCode() {
    if (!this.data.selectedCalendar) {
      wx.showToast({ title: '请先选择日历', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '生成中...' });
    wx.request({
      url: 'http://localhost:3001/api/v1/calendars/' + this.data.selectedCalendar + '/share',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        userId: 'invite_user',
        permission: 'view'
      },
      success: (res) => {
        this.setData({ inviteCode: res.data.code });
        wx.hideLoading();
        wx.showToast({ title: '生成成功', icon: 'success' });
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '生成失败', icon: 'none' });
      }
    });
  },

  onScan() {
    this.setData({ scanning: true });
    wx.scanCode({
      success: (res) => {
        this.setData({ inviteCode: res.result });
        this.setData({ scanning: false });
      },
      fail: () => {
        this.setData({ scanning: false });
      }
    });
  },

  onAccept() {
    if (!this.data.inviteCode) {
      wx.showToast({ title: '请先输入邀请码', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '接受中...' });
    wx.request({
      url: 'http://localhost:3001/api/v1/calendars/accept',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      data: {
        code: this.data.inviteCode
      },
      success: (res) => {
        wx.hideLoading();
        wx.showToast({ title: '加入成功', icon: 'success' });
        wx.navigateBack();
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '加入失败', icon: 'none' });
      }
    });
  }
});
