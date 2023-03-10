// 位置组件
Component({
  lifetimes: {
    attached: function() {
      this.setData({
        markers: [
          {
            latitude: this.data.position.latitude,
            longitude: this.data.position.longitude
          }
        ]
      })
    }
  },
  properties: {
    position: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    markers: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetailPage() {
      wx.navigateTo({
        url: `/pages/position-detail/index?position=${ JSON.stringify(this.data.position) }`
      })
    }
  }
})
