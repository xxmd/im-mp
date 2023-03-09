import {getSingleChatHistory} from "../../utils/im-api";
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    btnDisabled: true,
    friendOpenId: '',
    friendInfo: {},
    chatHistory: [],
    inputValue: ''
  },
  sendMsg() {
    if (!this.data.inputValue) {
      Message.warning({
        context: this,
        offset: ['20rpx', '32rpx'],
        duration: 3000,
        content: '请输入内容'
      });
    } else {

    }
  },
  onChange(e) {
    const inputValue = e.detail.value.trim()
    this.setData({
      inputValue,
      btnDisabled: !inputValue || inputValue.trim().length === 0
    })
  },
  getChatHistory() {
    getSingleChatHistory({
      friendOpenId: this.data.friendOpenId
    }, (res) => {
      console.log(res)
    })
  },
  setNavBarTitle() {
    wx.setNavigationBarTitle({
      title: this.data.friendInfo.nickName
    })
  },
  onLoad(options) {
    this.setData({
      friendOpenId: options.friendOpenId,
      friendInfo: JSON.parse(options.friendInfo)
    })
    this.setNavBarTitle()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getChatHistory()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
