Page({
  data: {
    currentDate: new Date(),
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth(),
    currentView: 'month', // month, week, day
    events: [],
    calendars: [],
    days: [],
    isLoading: false,
    selectedDate: null
  },

  onLoad() {
    this.loadCalendars();
    this.generateCalendar();
  },

  onShow() {
    this.loadCalendars();
    this.generateCalendar();
  },

  // 视图切换
  onMonthView() {
    this.setData({ currentView: 'month' });
    this.generateCalendar();
  },

  onWeekView() {
    this.setData({ currentView: 'week' });
    this.generateCalendar();
  },

  onDayView() {
    this.setData({ currentView: 'day' });
    this.generateCalendar();
  },

  // 日期导航
  onPrevMonth() {
    this.changeMonth(-1);
  },

  onNextMonth() {
    this.changeMonth(1);
  },

  onToday() {
    const today = new Date();
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth()
    });
    this.generateCalendar();
  },

  // 月份变更
  changeMonth(direction) {
    const { currentMonth, currentYear } = this.data;
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    this.setData({
      currentMonth: newMonth,
      currentYear: newYear
    });

    this.generateCalendar();
  },

  // 生成日历数据
  generateCalendar() {
    wx.showLoading({ title: '加载中...', mask: true });
    this.setData({ isLoading: true });

    const { currentYear, currentMonth, currentView } = this.data;
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const daysInPrevMonth = prevLastDay.getDate();

    const days = [];

    // 添加上个月的天数
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: currentMonth - 1,
        year: currentMonth === 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false
      });
    }

    // 添加当月的天数
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday =
        today.getDate() === i &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;

      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday: isToday,
        hasEvent: false // 后续从events中获取
      });
    }

    // 添加下个月的天数
    const remainingDays = 42 - days.length; // 6行 x 7列
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: currentMonth + 1,
        year: currentMonth === 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
        isToday: false,
        hasEvent: false
      });
    }

    this.setData({ days }, () => {
      this.loadEvents();
      wx.hideLoading();
      this.setData({ isLoading: false });
    });
  },

  loadCalendars() {
    const calendars = wx.getStorageSync('calendars') || [];
    this.setData({ calendars });
  },

  loadEvents() {
    const { currentYear, currentMonth } = this.data;
    const events = wx.getStorageSync(`events_${currentYear}_${currentMonth}`) || [];

    // 更新有事件标记
    const updatedDays = this.data.days.map(day => {
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.startTime);
        return eventDate.getDate() === day.day &&
               eventDate.getMonth() === day.month &&
               eventDate.getFullYear() === day.year;
      });
      return { ...day, hasEvent };
    });

    this.setData({ events, days: updatedDays });
  },

  onDayTap(e) {
    const { year, month, day } = e.currentTarget.dataset;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // 添加选中效果
    const updatedDays = this.data.days.map(d => ({
      ...d,
      isSelected: d.day === day && d.month === month && d.year === year
    }));

    this.setData({ days: updatedDays, selectedDate: dateStr });

    wx.showToast({
      title: `选择日期: ${dateStr}`,
      icon: 'none',
      duration: 1500
    });

    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/day/day?date=${dateStr}`
      });
    }, 500);
  },

  onManageTap() {
    wx.navigateTo({
      url: '/pages/manage/manage'
    });
  },

  // 事件处理
  onEventCreated(event) {
    this.loadEvents();
  }
});
