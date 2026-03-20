Page({
  data: {
    event: null,
    calendarName: ''
  },

  onLoad(options) {
    const { eventId } = options;
    this.loadEvent(eventId);
  },

  loadEvent(eventId) {
    wx.showLoading({ title: '加载中...' });
    wx.request({
      url: 'http://localhost:3001/api/v1/events/' + eventId,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        const event = res.data;
        this.setData({ event });
        
        // 获取日历名称
        const calendars = wx.getStorageSync('calendars') || [];
        const calendar = calendars.find(cal => cal.calendarId === event.calendarId) || { name: '未知日历' };
        this.setData({ calendarName: calendar.name });
        
        wx.hideLoading();
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '加载失败', icon: 'none' });
        wx.navigateBack();
      }
    });
  },

  onEdit() {
    wx.navigateTo({
      url: `/pages/event/event?eventId=${this.data.event.eventId}`
    });
  },

  onDelete() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个事件吗？',
      success: (res) => {
        if (res.confirm) {
          this.deleteEvent();
        }
      }
    });
  },

  deleteEvent() {
    wx.showLoading({ title: '删除中...' });
    wx.request({
      url: 'http://localhost:3001/api/v1/events/' + this.data.event.eventId,
      method: 'DELETE',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: () => {
        wx.hideLoading();
        wx.showToast({ title: '删除成功', icon: 'success' });
        wx.navigateBack();
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showToast({ title: '删除失败', icon: 'none' });
      }
    });
  }
});
