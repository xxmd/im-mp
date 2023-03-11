import {getUserInfo} from "./api";

export function addFriend(friendOpenId) {
  const selfOpenId = wx.getStorageSync('openId')
  if (friendOpenId === selfOpenId) {
    wx.showToast({
      icon: 'error',
      title: '自己的OpenId'
    })
    return
  }
  if (!friendOpenId) {
    wx.showToast({
      icon: 'error',
      title: 'OpenId为空'
    })
    return
  }
  getUserInfo({ openId: friendOpenId }, (res) => {
    if (res.data.code === 414) {
      wx.showToast({
        icon: 'error',
        title: '该OpenId未注册'
      })
    } else {
      wx.navigateTo({
        url: `/pages/user-card/index?friendOpenId=${ friendOpenId }`
      })
    }
  })
}
