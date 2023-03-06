App({
  initUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.setStorageSync('userInfo', {
        avatarUrl: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
        nickName: '默认昵称'
      })
    }
  },
  initOpenId(openId) {
    wx.setStorageSync('openId', openId.substr(0, 6))
  },
  onLaunch: function () {
    wx.cloud.init({
      env: 'im-3gelvp9c7681a2f7',
    })
    wx.cloud.callFunction({
      name: 'login',
      success: res => this.initOpenId(res.result.openid),
      fail: error => console.log(error)
    })
    this.initUserInfo()
  }
});
