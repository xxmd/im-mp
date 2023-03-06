Page({
  data: {
    userInfo: {},
    openId: ''
  },
  onLoad() {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      openId: wx.getStorageSync('openId'),
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({
        curPath: '/' + this.route
      })
    }
  },
  toPersonalMessagePage() {
    wx.navigateTo({
      url: '/pages/personal-message/index'
    })
  }
})
