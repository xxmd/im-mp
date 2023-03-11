import {addFriend, getSingleChatHistory, getUserInfo, isFriend} from "../../utils/api";
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    friendOpenId: '',
    friendInfo: {},
    isFriend: false,
    selfOpenId: ''
  },
  sendMsg() {
    const friendOpenId = this.data.friendOpenId
    // 这里用set存储的话有bug
    const sessionList = wx.getStorageSync('sessionList') || []
    if (!sessionList.some(item => item.friendOpenId === friendOpenId)) {
      sessionList.unshift({
        friendOpenId: friendOpenId,
        friendInfo: this.data.friendInfo
      })
      wx.setStorageSync('sessionList', sessionList)
    }
    const _this = this
    wx.navigateTo({
      url: '/pages/single-chat/index',
      success(res) {
        const params = {
          friendOpenId: _this.data.friendOpenId,
          friendInfo: _this.data.friendInfo
        }
        res.eventChannel.emit('sendParams', params)
      }
    })
  },
  addFriend() {
    addFriend({
      faccid: this.data.friendOpenId
    }, () => {
      Message.success({
        context: this,
        offset: ['20rpx', '32rpx'],
        duration: 3000,
        content: '添加好友成功'
      })
      this.onAddSuccess()
    })
  },
  onAddSuccess() {
    const pages = getCurrentPages();
    const beforePage = pages[pages.length - 2];
    if (typeof beforePage.getFriendList === 'function') {
      beforePage.getFriendList()
    }
  },
  assertRelation() {
    isFriend({
      faccid: this.data.friendOpenId
    }, (res) => {
      this.setData({
        isFriend: res.data.code !== 404
      })
    })
  },
  getFriendInfo() {
    getUserInfo({ openId: this.data.friendOpenId }, (res) => {
      const userInfo = res.data.uinfos[0]
      this.setData({
        friendInfo: {
          nickName: userInfo.name,
          avatarUrl: userInfo.icon
        }
      })
    })
  },
  onLoad(options) {
    this.setData({
      friendOpenId: options.friendOpenId,
      selfOpenId: wx.getStorageSync('openId')
    })
    this.getFriendInfo()
    this.assertRelation()
  }
})
