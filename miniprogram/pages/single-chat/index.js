import {MSG_TYPE, InputType} from "../../utils/types";
const computedBehavior = require('miniprogram-computed').behavior;
import { createStoreBindings } from "mobx-miniprogram-bindings";
import messageStore from "../../store/message";

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
    this.sendMsg(this.data.friendOpenId, msgType, data)
    this.setData({
      chatRecord: this.data.friendMsgMap[this.data.friendOpenId]
    })
  },
  setNavBarTitle() {
    wx.setNavigationBarTitle({
      title: this.data.friendInfo.nickName
    })
  },
  bindMsgStore() {
    this.storeBindings = createStoreBindings(this, {
      store: messageStore,
      fields: ['friendMsgMap'],
      actions: ['sendMsg']
    })
  },
  onLoad(options) {
    this.setData({
      friendOpenId: options.friendOpenId,
      friendInfo: JSON.parse(options.friendInfo)
    })
    this.setNavBarTitle()
    this.bindMsgStore()
  }
})
