import { register, getUserInfo } from "./utils/im-api";

App({
  init() {
    wx.cloud.init({
      env: 'im-3gelvp9c7681a2f7',
    })
    wx.cloud.callFunction({
      name: 'getOpenId',
      success: res => {
        this.initOpenId(res.result.openid)
        this.initUserInfo()
      },
      fail: error => console.log(error)
    })
  },
  initUserInfo() {
    register((res) => {
      if (res.data.code === 414) {
        // 已经注册了
        return
      }
    })
    getUserInfo({ openId: wx.getStorageSync('openId') },(res) => {
      const userInfo = res.data.uinfos[0]
      wx.setStorageSync('userInfo', {
        nickName: userInfo.name,
        avatarUrl: userInfo.icon
      })
    })
  },
  initOpenId(openId) {
    // 不能截取的太短，用户的openId前面几位是重复的
    // 通过服务端 API 创建账号时，云信服务端会对 accid 做小写转换（https://doc.yunxin.163.com/messaging/docs/DQ3Nzk1MTY?platform=server）
    wx.setStorageSync('openId', openId.substr(0, 11).toLowerCase())
  },
  onLaunch: function () {
    this.init()
  }
});
