import {request} from "./request";


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

export function sendMsg(success) {
  request({
    url: 'https://api.netease.im/nimserver/msg/sendMsg.action',
    data: {
    }
  })
}

export function getFriendList(success) {
  request({
    url: 'https://api.netease.im/nimserver/friend/get.action',
    data: {
      updatetime: '1443599631111'
    },
    success
  })
}

export function getUserInfo(data, success) {
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
    success(res) {
      success(res)
    }
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

export function upload(data, success) {
  request({
    url: 'https://api.netease.im/nimserver/msg/upload.action',
    data,
    success
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

export function getSingleChatHistory(data, success) {
  request({
    url: 'https://api.netease.im/nimserver/history/querySessionMsg.action',
    data: {
      from: wx.getStorageSync('openId'),
      to: data.friendOpenId,
      begintime: new Date().getTime() - 7 * 24 * 3600 * 1000,
      endtime: new Date().getTime(),
      limit: 50
    },
    success
  })
}
