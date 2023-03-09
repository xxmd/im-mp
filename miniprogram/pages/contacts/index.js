import {getFriendList, getUserInfo} from "../../utils/im-api";
import Message from 'tdesign-miniprogram/message/index';
import { pinyin } from 'pinyin-pro';
import {groupBy} from "../../utils/arr-util";

Page({
  data: {
    dialogVisible: false,
    friendOpenId: '',
    friendList: [],
    sortedList: [],
    indexList: []
  },
  showUserCard(e) {
    wx.navigateTo({
      url: `/pages/user-card/index?friendOpenId=${ e.target.dataset.openId }`
    })
  },
  formatterFriendList() {
    for (let friend of this.data.friendList) {
      friend.firstLetter = pinyin(friend.nickName)[0].toUpperCase()
    }
    const groupedList = groupBy(this.data.friendList, 'firstLetter');
    const sortedList = groupedList.sort((a, b) => a.firstLetter - b.firstLetter)
    this.setData({
      sortedList,
      indexList: sortedList.map(item => item.index)
    })
  },
  getFriendList() {
    getFriendList((res) => {
      const friendOpenIds = res.data.friends.map(item => item.faccid)
      getUserInfo({ openIds: friendOpenIds }, (res) => {
        this.data.friendList = res.data.uinfos.map(item => {
          return {
            openId: item.accid,
            nickName: item.name,
            avatarUrl: item.icon
          }
        })
        this.setData({
          friendList: this.data.friendList
        })
        this.formatterFriendList()
      })
    })
  },
  addFriend() {
    this.setData({
      dialogVisible: true
    })
  },
  onShow() {
    this.getFriendList()
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({
        curPath: '/' + this.route
      })
    }
  },
  onBlur(e) {
    this.data.friendOpenId = e.detail.value.trim()
  },
  onConfirm() {
    this.closeDialog()
    getUserInfo({ openId: this.data.friendOpenId }, (res) => {
      if (res.data.code === 414) {
        Message.warning({
          context: this,
          offset: ['20rpx', '32rpx'],
          duration: 5000,
          content: '该OpenId未注册IM'
        });
      } else {
        wx.navigateTo({
          url: `/pages/user-card/index?friendOpenId=${ this.data.friendOpenId }`
        })
      }
    })
  },
  closeDialog() {
    this.setData({
      dialogVisible: false
    })
  },
})
