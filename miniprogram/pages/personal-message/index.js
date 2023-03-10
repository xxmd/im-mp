import {updateUserInfo, upload} from "../../utils/api";

Page({
  data: {
    userInfo: {},
    dialogVisible: false
  },
  onBlur(e) {
    this.data.inputValue = e.detail.value.trim()
  },
  onConfirm() {
    this.closeDialog()
    if (this.data.inputValue) {
      this.data.userInfo.nickName = this.data.inputValue
      this.updateUserInfo(this.data.userInfo)
    }
  },
  updateUserInfo(newUserInfo) {
    this.setData({
      userInfo: newUserInfo
    })
    updateUserInfo({ newUserInfo }, () => {
      wx.setStorageSync('userInfo', newUserInfo)
    })
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
  uploadAvatar(tempFilePath) {
    upload(tempFilePath, (res) => {
      this.data.userInfo.avatarUrl = res.data.url
      this.updateUserInfo(this.data.userInfo)
    })
  },
  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: (res) => {
        this.uploadAvatar(res.tempFiles[0].tempFilePath)
      }
    })
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({
      userInfo
    })
  }
})
