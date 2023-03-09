import {MSG_TYPE} from "../../utils/types";

Component({
  properties: {
    message: {
      type: Object
    },
    friendInfo: {
      type: Object
    }
  },
  data: {
    selfOpenId: wx.getStorageSync('openId'),
    selfInfo: wx.getStorageSync('userInfo'),
    MSG_TYPE: MSG_TYPE
  },
  methods: {
    previewImage(e) {
      wx.previewImage({
        urls: [e.currentTarget.dataset.url]
      })
    },
    playVoice(e) {
      wx.showToast({
        icon: 'none',
        title: '播放语言'
      })
      const context = wx.createInnerAudioContext()
      context.src = e.currentTarget.dataset.url
      context.play()
    }
  }
})
