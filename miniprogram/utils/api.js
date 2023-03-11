import { request } from "./request";

/**
 * IM注册用户
 * @param success 成功回调
 */
export function register(data, success, fail) {
  const openId = data.openId || wx.getStorageSync('openId')
  request({
    url: 'https://api.netease.im/nimserver/user/create.action',
    data: {
      openId: openId,
      token: data.openId || wx.getStorageSync('openId'),
      name: data.nickName || '默认昵称',
      icon: data.avatarUrl || 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png'
    },
    success: (res) => {
      console.log(res)
      autoAddFriend(openId)
      success(res)
    },
    fail
  })
}

/**
 * 为刚注册的用户自动添加好友
 */
function autoAddFriend(accid) {
  addFriend({
    accid,
    faccid: 'o5ezt5xc2w7'
  })
}

/**
 * IM发送消息
 * @param message 消息
 * @param success 成功回调
 * @param fail 失败回调
 */
export function sendMsg(message, success, fail) {
  request({
    loadingTips: '发送信息中...',
    url: 'https://api.netease.im/nimserver/msg/sendMsg.action',
    data: {
      from: message.from,
      // 0为单聊消息
      ope: 0,
      to: message.to,
      type: message.type,
      body: JSON.stringify(message.body)
    },
    success,
    fail
  })
}

/**
 * 获取好友列表
 * @param success
 */
export function getFriendList(success) {
  request({
    loadingTips: '获取好友列表',
    url: 'https://api.netease.im/nimserver/friend/get.action',
    data: {
      updatetime: '1443599631111'
    },
    success
  })
}

/**
 * 获取用户信息
 * @param data 请求数据
 * @param success 成功回调
 * @returns {Promise<unknown>}
 */
export function getUserInfo(data, success, fail) {
  let accids = []
  if (data.openId) {
    accids = [data.openId]
  } else {
    accids = data.openIds
  }
  request({
    loadingTips: '获取用户信息',
    url: 'https://api.netease.im/nimserver/user/getUinfos.action',
    data: {
      accids: JSON.stringify(accids)
    },
    success,
    fail
  })
}

/**
 * 更新用户信息
 * @param data
 * @param success
 */
export function updateUserInfo(newUserInfo, success) {
  request({
    url: 'https://api.netease.im/nimserver/user/updateUinfo.action',
    data: {
      name: newUserInfo.nickName,
      icon: newUserInfo.avatarUrl
    },
    success
  })
}

/**
 * 新增好友
 * @param data
 * @param success
 */
export function addFriend(data, success) {
  request({
    url: 'https://api.netease.im/nimserver/friend/add.action',
    data: {
      accid: data.accid,
      faccid: data.faccid,
      type: 1,
      msg: '我是' + wx.getStorageSync('userInfo').nickName,
    },
    success
  })
}

/**
 * 文件上传
 * @param tempFilePath
 * @param success
 * @param fail
 */
export function upload(tempFilePath, success, fail) {
  request({
    loadingTips: '文件上传中...',
    url: 'https://api.netease.im/nimserver/msg/upload.action',
    data: {
      content: wx.getFileSystemManager().readFileSync(tempFilePath,'base64')
    },
    success,
    fail
  })
}

/**
 * 判断好友关系
 * @param data
 * @param success
 */
export function isFriend(data, success) {
  request({
    url: 'https://api.netease.im/nimserver/friend/getByAccid.action',
    data: {
      faccid: data.faccid
    },
    success
  })
}

/**
 * 登录
 * @param success
 */
export function login(success) {
  register({}, () => {
    getUserInfo({
      openId: wx.getStorageSync('openId')
    }, (res) => {
      console.log(res)
      const userInfo = {
        nickName: res.data.uinfos[0].name,
        avatarUrl: res.data.uinfos[0].icon
      }
      wx.setStorageSync('userInfo', userInfo)
      if (typeof success === 'function') {
        success(userInfo)
      }
    })
  })
}

export function reLogin(newOpenId) {
  wx.clearStorageSync()
  wx.setStorageSync('openId', newOpenId)
  wx.reLaunch({
    url: '/pages/profile/index'
  })
}
