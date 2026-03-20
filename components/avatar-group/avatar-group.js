Component({
  properties: {
    avatars: {
      type: Array,
      value: []
    },
    size: {
      type: String,
      value: 'normal'
    }
  },

  data: {
    displayAvatars: []
  },

  lifetimes: {
    attached() {
      this.updateDisplayAvatars();
    }
  },

  methods: {
    updateDisplayAvatars() {
      const { avatars, size } = this.properties;
      const maxSize = size === 'small' ? 3 : 5;
      const displayAvatars = avatars.slice(0, maxSize);
      
      this.setData({ displayAvatars });
    }
  }
});
