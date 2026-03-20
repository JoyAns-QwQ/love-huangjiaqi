Page({
  data: {
    calendarId: '',
    members: [],
    calendarName: ''
  },

  onLoad(options) {
    this.setData({
      calendarId: options.calendarId
    });
    this.loadMembers();
  },

  loadMembers() {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: 'http://localhost:3001/api/v1/calendars/' + this.data.calendarId + '/members',
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        this.setData({
          members: res.data,
          calendarName: res.data[0]?.calendarName || '日历'
        });
        wx.hideLoading();
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  onRemoveMember(e) {
    const { userId } = e.currentTarget.dataset;
    wx.showLoading({ title: '移除中...' });
    wx.request({
      url: 'http://localhost:3001/api/v1/calendars/' + this.data.calendarId + '/share/' + userId,
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '移除成功', icon: 'success' });
        this.loadMembers();
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '移除失败', icon: 'none' });
      }
    });
  }
});
