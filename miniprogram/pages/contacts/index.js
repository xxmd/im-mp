import {getFriendList, getUserInfo} from "../../utils/api";
import {addFriend} from "../../utils/common";

Page({
  data: {
    dialogVisible: false,
    friendOpenId: '',
    friendList: []
  },
  showUserCard(e) {
    wx.navigateTo({
      url: `/pages/user-card/index?friendOpenId=${ e.target.dataset.openId }`
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
      })
    })
  },
  addFriend() {
    const _this = this
    wx.showActionSheet({
      itemList: ['扫一扫', '输入账号'],
      success({ tapIndex }) {
        switch (tapIndex) {
          case 0:
            _this.scanAddFriend()
            break
          case 1:
            _this.openDialog()
            break
        }
      }
    })
  },
  scanAddFriend() {
    wx.scanCode({
      success (res) {
        addFriend(res.result)
      }
    })
  },
  openDialog() {
    this.setData({
      dialogVisible: true
    })
  },
  onLoad() {
    this.getFriendList()
  },
  onShow() {
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
    addFriend(this.data.friendOpenId)
  },
  closeDialog() {
    this.setData({
      dialogVisible: false
    })
  },
})
