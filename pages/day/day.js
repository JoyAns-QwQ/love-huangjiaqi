Page({
  data: {
    date: '',
    events: [],
    calendarName: ''
  },

  onLoad(options) {
    this.setData({
      date: options.date
    });
    this.loadEvents();
  },

  loadEvents() {
    const { date } = this.data;
    const events = wx.getStorageSync(`events_${date}`) || [];
    this.setData({ events });
    
    // 获取日历名称
    const calendars = wx.getStorageSync('calendars') || [];
    const calendar = calendars.find(cal => cal.calendarId === 'default') || { name: '我的日历' };
    this.setData({ calendarName: calendar.name });
  },

  onEventTap(e) {
    const { eventId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?eventId=${eventId}`
    });
  },

  onAddEvent() {
    wx.navigateTo({
      url: `/pages/event/event?date=${this.data.date}`
    });
  }
});
