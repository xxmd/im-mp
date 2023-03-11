// pages/message/index.js
import {MSG_TYPE} from "../../utils/types";

Page({
  data: {
    sessionList: []
  },
  toChatPage(e) {
    const item = e.target.dataset.item
    wx.navigateTo({
      url: '/pages/single-chat/index',
      success(res) {
        const params = {
          friendOpenId: item.friendOpenId,
          friendInfo: item.friendInfo
        }
        res.eventChannel.emit('sendParams', params)
      }
    })
  },
  getLastMsgContent(friendOpenId) {
    // const chatRecord = getChatRecord(friendOpenId)
    // const lastMsg = chatRecord.slice(-1)
    // if (lastMsg) {
    //   switch (lastMsg.type) {
    //     case MSG_TYPE.TEXT_MSG:
    //       return lastMsg.data
    //     case MSG_TYPE.VOICE_MSG:
    //       return '[语音]'
    //     case MSG_TYPE.PICTURE_MSG:
    //       return '[图片]'
    //     case MSG_TYPE.POSITION_MSG:
    //       return '[位置]'
    //   }
    // } else {
    //   return ''
    // }
  },
  getSessionList() {
    const sessionList = wx.getStorageSync('sessionList') || []
    sessionList.map(item => {
      item.desc = this.getLastMsgContent(item.friendOpenId)
    })
    this.setData({
      sessionList
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function') {
      this.getTabBar().setData({
        curPath: '/' + this.route
      })
    }
    this.getSessionList()
  }
})
