import {addFriend, getSingleChatHistory, getUserInfo, isFriend} from "../../utils/api";
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    friendOpenId: '',
    friendInfo: {},
    isFriend: false
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
    wx.navigateTo({
      url: `/pages/single-chat/index?friendOpenId=${ this.data.friendOpenId }&friendInfo=${ JSON.stringify(this.data.friendInfo) }`
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
      });
    })
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
      friendOpenId: options.friendOpenId
    })
    this.getFriendInfo()
    this.assertRelation()
  }
})
