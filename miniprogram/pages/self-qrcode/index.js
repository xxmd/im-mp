import drawQrcode from '../../vendor/weapp.qrcode.esm.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrCodeSize: 200,
    userInfo: {},
    openId: ''
  },
  geneCode() {
    drawQrcode({
      width: this.data.qrCodeSize,
      height: this.data.qrCodeSize,
      canvasId: 'myQrcode',
      // ctx: wx.createCanvasContext('myQrcode'),
      text: 'https://github.com/yingye'
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
