Page({
  data: {
    calendars: [],
    events: []
  },

  onLoad() {
    this.loadCalendars();
    this.loadEvents();
  },

  loadCalendars() {
    const calendars = wx.getStorageSync('calendars') || [];
    this.setData({ calendars });
  },

  loadEvents() {
    const events = wx.getStorageSync('events') || [];
    this.setData({ events });
  },

  onAddCalendar() {
    wx.navigateTo({
      url: '/pages/invite/index'
    });
  },

  onCalendarTap(e) {
    const { calendarId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/members/index?calendarId=${calendarId}`
    });
  },

  onEventTap(e) {
    const { eventId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/detail?eventId=${eventId}`
    });
  }
});
