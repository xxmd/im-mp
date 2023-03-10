import drawQrcode from '../../vendor/weapp.qrcode.esm.js'
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    qrCodeSize: 250,
    userInfo: {},
    openId: '',
    canvasId: 'myQrcode'
  },
  scanCode() {
    wx.scanCode({
      success (res) {
        // 执行添加好友功能
        console.log(res)
      }
    })
  },
  saveCode() {
    wx.canvasToTempFilePath({
      canvasId: this.data.canvasId,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            // 这里不用message是因为ios弹不出来
            wx.showToast({
              icon: 'success',
              title: '二维码保存成功'
            })
          }
        })
      },
    })
  },
  geneCode() {
    drawQrcode({
      width: this.data.qrCodeSize,
      height: this.data.qrCodeSize,
      canvasId: this.data.canvasId,
      text: this.data.openId
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      openId: wx.getStorageSync('openId')
    })
    this.geneCode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
})
