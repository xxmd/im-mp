import {request} from "./request";
const app = getApp()

export function register(success) {
  const openId = wx.getStorageSync('openId')
  request({
    url: 'https://api.netease.im/nimserver/user/create.action',
    data: {
      accid: openId,
      token: openId,
      name: '默认昵称',
      icon: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png'
    },
    success
  })
}

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

export function getUserInfo(data, success) {
  return new Promise(resolve => {
    let accids = []
    if (data.openId) {
      accids = [data.openId]
    } else {
      accids = data.openIds
    }
    request({
      url: 'https://api.netease.im/nimserver/user/getUinfos.action',
      data: {
        accids: JSON.stringify(accids)
      },
      success
    })
  })
}

export function updateUserInfo(data, success) {
  request({
    url: 'https://api.netease.im/nimserver/user/updateUinfo.action',
    data: {
      accid: wx.getStorageSync('openId'),
      name: data.newUserInfo.nickName,
      icon: data.newUserInfo.avatarUrl
    },
    success
  })
}

export function addFriend(data, success) {
  request({
    url: 'https://api.netease.im/nimserver/friend/add.action',
    data: {
      accid: wx.getStorageSync('openId'),
      faccid: data.faccid,
      type: 1,
      msg: '我是' + wx.getStorageSync('userInfo').nickName,
    },
    success(res) {
      success(res)
    }
  })
}

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

export function isFriend(data, success) {
  request({
    url: 'https://api.netease.im/nimserver/friend/getByAccid.action',
    data: {
      accid: wx.getStorageSync('openId'),
      faccid: data.faccid
    },
    success
  })
}

/**
 * 初始化用户信息
 * @param success 成功回调
 */
export function initUserInfo(success) {
  return new Promise(async resolve => {
    await register()
    const res = await getUserInfo({ openId: wx.getStorageSync('openId') })
  })
}


export function login(success) {
  wx.showLoading({
    title: '登录中...',
    mask: true
  })
  getUserInfo({
    openId: wx.getStorageSync('openId')
  }, (res) => {
    const userInfo = {
      nickName: res.data.uinfos[0].name,
      avatarUrl: res.data.uinfos[0].icon
    }
    wx.setStorageSync('userInfo', userInfo)
    wx.hideLoading()
    if (typeof success === 'function') {
      success(userInfo)
    }
  })
}
