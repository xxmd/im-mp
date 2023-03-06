// pages/message/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({
        curPath: '/' + this.route
      })
    }
  }
})
