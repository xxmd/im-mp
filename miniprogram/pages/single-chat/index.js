import {MSG_TYPE, InputType} from "../../utils/types";
import { sendMsg } from "../../utils/message";
const computedBehavior = require("miniprogram-computed").behavior;

Page({
  behaviors: [computedBehavior],
  computed: {
    lastViewId(data) {
      const lastHistory = data.chatRecord.slice(-1)[0]
      return lastHistory ? lastHistory.msgid : ''
    }
  },
  data: {
    chatRecord: [],
    viewIdPrefix: 'view_id',
    friendOpenId: '',
    friendInfo: {}
  },
  pageTap(e) {
    if (e.target.id !== 'footer-input') {
      this.selectComponent("#footer-input").resetHiddenArea()
    }
  },
  inputEnd(e) {
    const { data, type } = e.detail
    let msgType
    switch (type) {
      case InputType.TEXT:
        msgType = MSG_TYPE.TEXT_MSG
        break
      case InputType.PICTURE:
        msgType = MSG_TYPE.PICTURE_MSG
        break
      case InputType.VOICE:
        msgType = MSG_TYPE.VOICE_MSG
        break
      case InputType.POSITION:
        msgType = MSG_TYPE.POSITION_MSG
        break
    }
    sendMsg(this.data.friendOpenId, msgType, data, (chatRecord) => {
      this.setData({
        chatRecord
      })
    })
  },
  setNavBarTitle() {
    wx.setNavigationBarTitle({
      title: this.data.friendInfo.nickName
    })
  },
  onReady() {
    this.setNavBarTitle()
    const friendMsgMap = wx.getStorageSync('friendMsgMap')
    this.setData({
      chatRecord: friendMsgMap[this.data.friendOpenId] || []
    })
  },
  onLoad(options) {
    this.getOpenerEventChannel().once('sendParams',(params)=>{
      this.setData({
        friendOpenId: params.friendOpenId,
        friendInfo: params.friendInfo
      })
    })
  }
})
