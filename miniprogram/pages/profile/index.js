import { login } from "../../utils/api";

Page({
  data: {
    userInfo: {},
    openId: '',
    dialogVisible: false,
    newOpenId: ''
  },
  cleanStorage() {
    wx.clearStorageSync()
    wx.reLaunch({
      url: '/pages/profile/index',
      success: (res) => {
        wx.showToast({
          title: '清除缓存成功'
        })
      }
    })
  },
  switchAccount() {
    this.setData({
      dialogVisible: true
    })
  },
  onBlur(e) {
    this.data.newOpenId = e.detail.value.trim()
  },
  onConfirm() {
    this.closeDialog()
    if (this.data.newOpenId == this.data.openId) {
      wx.showToast({
        icon: 'error',
        title: 'OpenId已登录'
      })
      return
    }
    if (this.data.newOpenId) {
      wx.clearStorageSync()
      wx.setStorageSync('openId', this.data.newOpenId)
      wx.reLaunch({
        url: '/pages/profile/index'
      })
    }
  },
  closeDialog() {
    this.setData({
      dialogVisible: false
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({
        curPath: '/' + this.route
      })
    }
  },
  onLoad() {
    this.initOpenId()
  },
  initOpenId() {
    // openId有两种来源：从云空间请求获取或从storage中取得
    if (!wx.getStorageSync('openId')) {
      wx.cloud.init({
        env: 'im-3gelvp9c7681a2f7',
      })
      wx.cloud.callFunction({
        name: 'getOpenId',
        success: res => {
          this.setOpenId(res.result.openid)
          this.setUserInfo()
        },
        fail: error => console.log(error)
      })
    } else {
      this.setUserInfo()
    }
  },
  setUserInfo() {
    login((userInfo) => {
      this.setData({
        openId: wx.getStorageSync('openId'),
        userInfo
      })
    })
  },
  setOpenId(srcOpenId) {
    // 不能截取的太短，微信用户的openId前面几位是重复的
    // 通过服务端 API 创建账号时，服务端会对 accid 做小写转换
    // https://doc.yunxin.163.com/messaging/docs/DQ3Nzk1MTY?platform=server
    const openId = srcOpenId.substr(0, 11).toLowerCase()
    wx.setStorageSync('openId', openId)
    this.setData({
      openId
    })
  },
  toPersonalMessagePage() {
    wx.navigateTo({
      url: '/pages/personal-message/index'
    })
  }
})
