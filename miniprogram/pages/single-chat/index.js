import {getSingleChatHistory, sendMsg, upload} from "../../utils/im-api";
import CryptoJS from 'crypto-js';
import {MSG_TYPE, InputType} from "../../utils/types";
const computedBehavior = require('miniprogram-computed').behavior;

Page({
  behaviors: [computedBehavior],
  computed: {
    lastViewId(data) {
      const lastHistory = data.chatHistory.slice(-1)[0]
      console.log(lastHistory)
      return lastHistory ? lastHistory.msgid : ''
    },
  },
  data: {
    viewIdPrefix: 'view_id',
    friendOpenId: '',
    friendInfo: {},
    chatHistory: []
  },
  pageTap(e) {
    if (e.target.id !== 'footer-input') {
      this.selectComponent("#footer-input").resetHiddenArea()
    }
  },
  sendPicture(picture) {
    console.log(picture)
    const tempFilePath = picture.tempFilePath
    const pictureName = tempFilePath.slice(tempFilePath.lastIndexOf('/') + 1, tempFilePath.length)
    const pictureExt = tempFilePath.slice(tempFilePath.lastIndexOf('.') + 1, tempFilePath.length)
    const _this = this
    wx.getImageInfo({
      src: tempFilePath,
      success(pictureInfo) {
        upload(tempFilePath, (res) => {
          const body = {
            name: pictureName,
            md5: CryptoJS.MD5(picture),
            url: res.data.url,
            ext: pictureExt,
            w: pictureInfo.width,
            h: pictureInfo.height,
            size: picture.size		//语音文件大小，单位为字节（Byte）
          }
          _this.sendMsg(body, MSG_TYPE.PICTURE_MSG)
        })
      }
    })
  },
  sendText(text) {
    const body = {
      msg: text
    }
    this.sendMsg(body, MSG_TYPE.TEXT_MSG)
  },
  sendPosition(position) {

  },
  sendVoice({ recordDuration, tempFilePath, frameBuffer }) {
    upload(tempFilePath, (res) => {
      const body = {
        dur: recordDuration,		//语音持续时长ms
        md5: CryptoJS.MD5(frameBuffer),	//语音文件的md5值，按照字节流加密
        url: res.data.url,	//生成的url
        ext: "aac",		//语音消息格式，只能是aac格式
        size: frameBuffer.byteLength		//语音文件大小，单位为字节（Byte）
      }
      this.sendMsg(body, MSG_TYPE.VOICE_MSG)
    })
  },
  inputEnd(e) {
    const { data, type } = e.detail
    switch (type) {
      case InputType.TEXT:
        this.sendText(data)
        break
      case InputType.PICTURE:
        this.sendPicture(data)
        break
      case InputType.VOICE:
        this.sendVoice(data)
        break
      case InputType.POSITION:
        this.sendPosition(data)
        break
    }
  },
  pushMsg(body, type) {
    this.data.chatHistory.push({
      msgid: new Date().getTime().toString(),
      body,
      type,
      from: wx.getStorageSync('openId'),
      sendTime: new Date().getTime()
    })
    this.setData({
      chatHistory: this.data.chatHistory
    })
  },
  sendMsg(body, type) {
    this.pushMsg(body, type)
    sendMsg({
      friendOpenId: this.data.friendOpenId,
      type,
      body
    })
  },
  getChatHistory() {
    getSingleChatHistory({
      friendOpenId: this.data.friendOpenId
    }, (res) => {
      this.setData({
        chatHistory: res.data.msgs.reverse()
      })
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
  onShow() {
    this.getChatHistory()
  }
})
