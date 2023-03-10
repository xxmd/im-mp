import { MSG_STATUS, MSG_TYPE } from "../utils/types";
import { sendMsg as sendMsgApi, upload } from "../utils/api";
import CryptoJS from "crypto-js";
import { observable, action } from "mobx-miniprogram";

const messageStore = observable({
  friendMsgMap: new Map(),
  sendMsg: action(function (friendOpenId, type, data) {
    const message = geneLocalMsg(friendOpenId, type, data)
    if (!this.friendMsgMap[friendOpenId]) {
      this.friendMsgMap[friendOpenId] = []
    }
    this.friendMsgMap[friendOpenId].push(message)
    // 封装消息
    try {
      // 将消息推送至网易云信服务器
      sendMsgToServer(message)
    } catch (error) {
      console.log(error)
      // 推送过程中发生错误
      message.status = MSG_STATUS.SEND_FAIL
      return
    }
  })
})

export default messageStore

function geneLocalMsg(friendOpenId, type, data) {
  const message = {
    msgid: new Date().getTime(),
    from: wx.getStorageSync('openId'),
    to: friendOpenId,
    type,
    data,
    status: MSG_STATUS.SENDING
  }
  return message
}

function sendTextMsg(message) {
  message.body = {
    msg: message.data
  }
  sendMsgApi(message)
}

function sendVoiceMsg(message) {
  upload(message.data.tempFilePath, (res) => {
    message.body = {
      dur: message.data.duration,
      md5: CryptoJS.MD5(message.data.frameBuffer),
      url: res.data.url,
      ext: "aac",
      size: message.data.frameBuffer.byteLength
    }
    sendMsgApi(message, MSG_TYPE.VOICE_MSG)
  })
}

function sendPositionMsg(message) {
  const data = message.data
  message.body = {
    title: data.address,
    lng: data.longitude,
    lat: data.latitude
  }
  sendMsgApi(message, MSG_TYPE.POSITION_MSG)
}

function sendPictureMsg(message) {
  const data = message.data
  const tempFilePath = data.tempFilePath
  const pictureName = tempFilePath.slice(tempFilePath.lastIndexOf('/') + 1, tempFilePath.length)
  const pictureExt = tempFilePath.slice(tempFilePath.lastIndexOf('.') + 1, tempFilePath.length)
  wx.getImageInfo({
    src: tempFilePath,
    success(pictureInfo) {
      upload(tempFilePath, (res) => {
        message.body = {
          name: pictureName,
          md5: CryptoJS.MD5(data),
          url: res.data.url,
          ext: pictureExt,
          w: pictureInfo.width,
          h: pictureInfo.height,
          size: data.size
        }
        sendMsgApi(message, MSG_TYPE.PICTURE_MSG)
      })
    }
  })
}

function sendMsgToServer(message) {
  switch (message.type) {
    case MSG_TYPE.TEXT_MSG:
      sendTextMsg(message)
      break
    case MSG_TYPE.VOICE_MSG:
      sendVoiceMsg(message)
      break
    case MSG_TYPE.PICTURE_MSG:
      sendPictureMsg(message)
      break
    case MSG_TYPE.POSITION_MSG:
      sendPositionMsg(message)
      break
  }
}

export function sendMsg(friendOpenId, type, data) {
  const message = geneLocalMsg(friendOpenId, type, data)
  // 封装消息
  try {
    // 将消息推送至网易云信服务器
    sendMsgToServer(message)
  } catch (error) {
    // 推送过程中发生错误
    message.status = MSG_STATUS.SEND_FAIL
    return
  }
}
