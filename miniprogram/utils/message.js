import { MSG_STATUS, MSG_TYPE } from "../utils/types";
import { sendMsg as sendMsgApi, upload } from "../utils/api";
import CryptoJS from "crypto-js";
const STORAGE_KEY = 'friendMsgMap'

function getFriendMsgMap() {
  if (!wx.getStorageSync(STORAGE_KEY)) {
    wx.setStorageSync(STORAGE_KEY, {})
  }
  return wx.getStorageSync(STORAGE_KEY)
}

/**
 * 将用户发送的消息存至本地
 * @param friendOpenId
 * @param message
 * @returns {*}
 */
function storageMsg(friendOpenId, message) {
  const friendMsgMap = getFriendMsgMap()

  if (!friendMsgMap[friendOpenId]) {
    friendMsgMap[friendOpenId] = []
  }

  friendMsgMap[friendOpenId].push(message)
  wx.setStorageSync(STORAGE_KEY, friendMsgMap)
  return friendMsgMap[friendOpenId]
}

/**
 * 发送消息
 * @param friendOpenId 朋友(消息接收者)的OpenId
 * @param type 消息类型
 * @param data 数据
 * @param success 成功回调
 */
export function sendMsg(friendOpenId, type, data, success) {
  const message = geneLocalMsg(friendOpenId, type, data)

  // 消息发送成功回调
  success(storageMsg(friendOpenId, message))

  try {
    // 将消息推送至网易云信服务器
    sendMsgToServer(message)
  } catch (error) {
    console.log(error)
    // 推送过程中发生错误
    message.status = MSG_STATUS.SEND_FAIL
    return
  }
}

/**
 * 生成本地消息
 * @param friendOpenId 朋友(消息接收者)的OpenId
 * @param type 消息类型
 * @param data 数据
 * @returns {{data, msgid: number, from: any, to, type, status: string}}
 */
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

/**
 * 发送文本消息
 * @param message
 */
function sendTextMsg(message) {
  message.body = {
    msg: message.data
  }
  sendMsgApi(message)
}

/**
 * 发送语音消息
 * @param message
 */
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

/**
 * 发送位置消息
 * @param message
 */
function sendPositionMsg(message) {
  const data = message.data
  message.body = {
    title: JSON.stringify({
      name: data.name,
      address: data.address
    }),
    lng: data.longitude,
    lat: data.latitude
  }
  sendMsgApi(message, MSG_TYPE.POSITION_MSG)
}

/**
 * 发送图片消息
 * @param message
 */
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

/**
 * 将消息推送至网易云信服务器
 * @param message
 */
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
