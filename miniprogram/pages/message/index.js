// pages/message/index.js
Page({
  data: {
    sessionList: []
  },
  toChatPage(e) {
    const item = e.target.dataset.item
    wx.navigateTo({
      url: `/pages/single-chat/index?friendOpenId=${ item.friendOpenId }&friendInfo=${ JSON.stringify(item.friendInfo) }`
    })
  },
  getSessionList() {
    this.setData({
      sessionList: wx.getStorageSync('sessionList')
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({
        curPath: '/' + this.route
      })
    }
    this.getSessionList()
  }
})
