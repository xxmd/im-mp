import {MSG_TYPE} from "../../utils/types";

// 消息展示组件，可展示文字，图片，语言，位置等消息
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
  lifetimes: {
    attached: function() {
      // 页面attached生命周期初始化录音器
      this.initAudioContext()
    }
  },
  methods: {
    initAudioContext() {
      this.audioContext = wx.createInnerAudioContext()
    },
    previewImage(e) {
      wx.previewImage({
        urls: [e.currentTarget.dataset.url]
      })
    },
    /**
     * 语言播放
     * @param e
     */
    playVoice(e) {
      // 先停止上一段音频
      wx.showToast({
        icon: 'none',
        title: '播放语言'
      })
      this.audioContext.src = e.currentTarget.dataset.url
      this.audioContext.play()
    }
  }
})
