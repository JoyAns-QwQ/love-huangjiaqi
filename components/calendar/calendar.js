Component({
  properties: {
    currentYear: {
      type: Number,
      value: new Date().getFullYear()
    },
    currentMonth: {
      type: Number,
      value: new Date().getMonth()
    },
    events: {
      type: Array,
      value: []
    }
  },

  data: {
    days: []
  },

  lifetimes: {
    attached() {
      this.generateCalendar();
    }
  },

  methods: {
    // 生成日历数据
    generateCalendar() {
      const { currentYear, currentMonth, events } = this.data;
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

        const hasEvent = events.some(event => {
          const eventDate = new Date(event.startTime);
          return eventDate.getDate() === i &&
                 eventDate.getMonth() === currentMonth &&
                 eventDate.getFullYear() === currentYear;
        });

        days.push({
          day: i,
          month: currentMonth,
          year: currentYear,
          isCurrentMonth: true,
          isToday: isToday,
          hasEvent: hasEvent
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

      this.setData({ days });
    },

    // 月份导航
    onPrevMonth() {
      const { currentMonth, currentYear } = this.data;
      let newMonth = currentMonth - 1;
      let newYear = currentYear;

      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }

      this.setData({
        currentMonth: newMonth,
        currentYear: newYear
      });

      this.generateCalendar();
      this.triggerEvent('monthchange', { year: newYear, month: newMonth });
    },

    onNextMonth() {
      const { currentMonth, currentYear } = this.data;
      let newMonth = currentMonth + 1;
      let newYear = currentYear;

      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }

      this.setData({
        currentMonth: newMonth,
        currentYear: newYear
      });

      this.generateCalendar();
      this.triggerEvent('monthchange', { year: newYear, month: newMonth });
    },

    // 日期点击
    onDayTap(e) {
      const { year, month, day } = e.currentTarget.dataset;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      this.triggerEvent('daytap', { date: dateStr });
    }
  },

  // 监听属性变化
  observers: {
    'currentYear, currentMonth, events': function() {
      this.generateCalendar();
    }
  }
});
