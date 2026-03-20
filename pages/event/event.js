Page({
  data: {
    date: '',
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isAllDay: false,
    location: '',
    color: '#1677ff',
    colorOptions: ['#1677ff', '#ff4d4f', '#fa8c16', '#13c2c2', '#722ed1', '#1890ff'],
    colorLabels: ['蓝色', '红色', '橙色', '青色', '紫色', '天蓝色'],
    isLoading: false,
    formErrors: {}
  },

  onLoad(options) {
    // 设置默认日期
    const today = new Date();
    const dateStr = options.date || today.toISOString().split('T')[0];

    this.setData({
      date: dateStr,
      startDate: dateStr,
      endDate: dateStr,
      startTime: '09:00',
      endTime: '10:00'
    });
  },

  // 表单提交
  onSubmit(e) {
    const formData = e.detail.value;
    const errors = this.validateForm(formData);

    if (Object.keys(errors).length > 0) {
      this.setData({ formErrors: errors });
      wx.showToast({ title: '请填写必填项', icon: 'none' });
      return;
    }

    // 构建事件数据
    const event = {
      title: formData.title,
      description: formData.description || '',
      startTime: formData.isAllDay
        ? formData.startDate
        : `${formData.startDate} ${formData.startTime}`,
      endTime: formData.isAllDay
        ? formData.endDate
        : `${formData.endDate} ${formData.endTime}`,
      isAllDay: formData.isAllDay,
      location: formData.location || '',
      color: formData.color
    };

    // 显示加载状态
    wx.showLoading({ title: '保存中...', mask: true });
    this.setData({ isLoading: true });

    // 发送请求
    wx.request({
      url: 'http://localhost:3001/api/v1/events',
      method: 'POST',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        'Content-Type': 'application/json'
      },
      data: event,
      success: (res) => {
        wx.hideLoading();
        this.setData({ isLoading: false });

        if (res.data.success) {
          wx.showToast({ title: '保存成功', icon: 'success' });

          // 返回并刷新日历
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2];
          if (prevPage && prevPage.loadEvents) {
            prevPage.loadEvents();
          }

          setTimeout(() => {
            wx.navigateBack();
          }, 500);
        } else {
          wx.showToast({ title: res.data.message || '保存失败', icon: 'none' });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        this.setData({ isLoading: false });
        wx.showToast({ title: '网络错误，请重试', icon: 'none' });
        console.error('保存事件失败:', err);
      }
    });
  },

  // 表单验证
  validateForm(formData) {
    const errors = {};

    if (!formData.title || formData.title.trim() === '') {
      errors.title = '请输入事件标题';
    }

    if (!formData.isAllDay) {
      if (!formData.startDate) errors.startDate = '请选择开始日期';
      if (!formData.startTime) errors.startTime = '请选择开始时间';
      if (!formData.endDate) errors.endDate = '请选择结束日期';
      if (!formData.endTime) errors.endTime = '请选择结束时间';
    }

    return errors;
  },

  // 关闭页面
  onClose() {
    wx.navigateBack();
  },

  // 日期变更处理
  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value });
    this.clearError('startDate');
  },

  onStartTimeChange(e) {
    this.setData({ startTime: e.detail.value });
    this.clearError('startTime');
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value });
    this.clearError('endDate');
  },

  onEndTimeChange(e) {
    this.setData({ endTime: e.detail.value });
    this.clearError('endTime');
  },

  // 全天事件切换
  onAllDayChange(e) {
    const isAllDay = e.detail.value;
    this.setData({ isAllDay });

    if (isAllDay) {
      // 如果是全天事件，清除时间选择
      this.setData({
        startTime: '',
        endTime: ''
      });
      this.clearError('startTime');
      this.clearError('endTime');
    } else {
      // 如果不是全天事件，设置默认时间
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 5);
      this.setData({
        startTime: timeStr,
        endTime: new Date(now.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5)
      });
    }
  },

  // 颜色选择
  onColorChange(e) {
    this.setData({ color: this.data.colorOptions[e.detail.value] });
  },

  // 清除错误
  clearError(field) {
    const errors = { ...this.data.formErrors };
    delete errors[field];
    this.setData({ formErrors: errors });
  }
});
