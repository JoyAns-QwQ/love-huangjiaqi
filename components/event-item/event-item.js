Component({
  properties: {
    event: {
      type: Object,
      value: {}
    }
  },

  data: {
    displayTime: ''
  },

  lifetimes: {
    attached() {
      this.updateDisplayTime();
    }
  },

  methods: {
    // 更新显示时间
    updateDisplayTime() {
      const { event } = this.properties;
      if (!event.startTime) return;

      const startTime = new Date(event.startTime);
      const endTime = event.endTime ? new Date(event.endTime) : null;

      let timeStr = '';

      if (event.isAllDay) {
        // 全天事件
        const startDate = startTime.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
        timeStr = `全天 · ${startDate}`;
      } else {
        // 非全天事件
        const timeFormat = { hour: '2-digit', minute: '2-digit' };
        timeStr = startTime.toLocaleTimeString('zh-CN', timeFormat);

        if (endTime) {
          timeStr += ' - ' + endTime.toLocaleTimeString('zh-CN', timeFormat);
        }
      }

      this.setData({ displayTime: timeStr });
    }
  }
});
