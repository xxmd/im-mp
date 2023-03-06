import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    userInfo: {},
    dialogVisible: false
  },
  geneCode() {
  },
  getMore() {
    Message.warning({
      context: this,
      offset: ['20rpx', '32rpx'],
      duration: 5000,
      content: '更多功能暂未开放'
    });
  },
  onBlur(e) {
    this.data.inputValue = e.detail.value.trim()
  },
  onConfirm() {
    this.closeDialog()
    console.log(this.data.inputValue)
    if (this.data.inputValue) {
      this.data.userInfo.nickName = this.data.inputValue
      this.updateUserInfo(this.data.userInfo)
    }
  },
  updateUserInfo(newUserInfo) {
    this.setData({
      userInfo: newUserInfo
    })
    wx.setStorageSync('userInfo', newUserInfo)
  },
  closeDialog() {
    this.setData({
      dialogVisible: false
    })
  },
  modifyNickName() {
    this.setData({
      dialogVisible: true
    })
  },
  onChooseAvatar(e) {
    this.data.userInfo.avatarUrl = e.detail.avatarUrl
    this.updateUserInfo(this.data.userInfo)
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    if (!userInfo.nickName) {
      userInfo.nickName = '默认名称'
    }
    this.setData({
      userInfo
    })
  }
})
