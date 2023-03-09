import emojiList from "../../vendor/emoji";
import {InputType} from "../../utils/types";
const app = getApp()
const recordDurationTrigger = 1000

Component({
  data: {
    inputValue: '',
    inputMarginBottom: 0,
    emojiList: emojiList,
    showEmoji: false,
    showOthers: false,
    showHiddenArea: false,
    visibleTab: ''
  },
  methods: {
    switchShow(e) {
      const tabName = e.target.dataset.tabName
      if (tabName === 'emojiList') {
        this.setData({
          showEmoji: !this.data.showEmoji,
          showOthers: false
        })
      } else {
        this.setData({
          showEmoji: false,
          showOthers: !this.data.showOthers
        })
      }
      this.setData({
        showHiddenArea: this.data.showEmoji || this.data.showOthers,
        visibleTab: tabName
      })
    },
    /**
     * 初始化录音器
     */
    initRecord() {
      this.record = wx.getRecorderManager()
      this.record.onStart((res) => {
        this.onRecordStart(res)
      })
      this.record.onStop((res) => {
        this.onRecordStop(res)
      })
      this.record.onFrameRecorded((res) => {
        this.frameBuffer = res.frameBuffer
      })
    },
    /**
     * 录音开始
     */
    onRecordStart() {
      this.recordStartTime = new Date().getTime()
      this.setData({
        recording: true
      })
      wx.showToast({
        icon: 'none',
        title: '录音中，请说话',
        duration: 30 * 1000
      })
    },
    /**
     * 检查录音持续时间
     * @returns {boolean} 录音持续时间是否够长，避免误触
     */
    checkRecordDuration() {
      // 这个duration在音频上传的时候要用到
      this.recordDuration = this.recordEndTime - this.recordStartTime
      if (this.recordDuration < recordDurationTrigger) {
        wx.showToast({
          icon: 'error',
          title: '录音时间太短'
        })
        return false
      }
      return true
    },
    /**
     * 录音结束回调
     * @param res
     */
    onRecordStop(res) {
      this.recordEndTime = new Date().getTime()
      this.setData({
        recording: false
      })
      if (this.checkRecordDuration()) {
        wx.showToast({
          icon: 'none',
          title: '录音结束'
        })
      }
      this.inputEnd({
        recordDuration: this.recordDuration,
        tempFilePath: res.tempFilePath,
        frameBuffer: this.frameBuffer
      }, InputType.VOICE)
    },
    /**
     * 点击录音图标
     */
    onTouchStart() {
      this.record.start({
        duration: 30 * 1000,
        sampleRate: 44100,
        numberOfChannels: 1,
        encodeBitRate: 192000,
        format: 'aac',
        frameSize: 50
      })
    },
    onTouchEnd() {
      this.record.stop()
    },
    choosePicture() {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: (res) => {
          this.inputEnd(res.tempFiles[0], InputType.PICTURE)
        }
      })
    },
    choosePosition() {
      wx.chooseLocation({
        success(res) {
          this.inputEnd(res, InputType.POSITION)
        }
      })
    },
    addEmoji(e) {
      const emoji = e.target.dataset.emoji
      this.setData({
        inputValue: this.data.inputValue + emoji
      })
    },
    onBlur() {
      this.setData({
        inputMarginBottom: 0
      })
    },
    /**
     * 重置隐藏区域
     */
    resetHiddenArea() {
      this.setData({
        showEmoji: false,
        showOthers: false,
        showHiddenArea: false
      })
    },
    /**
     * input输入框聚焦
     * @param e
     */
    onFocus(e) {
      this.setData({
        inputMarginBottom: e.detail.height - app.globalData.safeAreaHeight
      })
      this.resetHiddenArea()
    },
    /**
     * 键盘确认事件
     */
    onConfirm() {
      if (!this.data.inputValue) {
        wx.showToast({
          icon: 'none',
          title: '请输入内容'
        })
      } else {
        this.inputEnd(this.data.inputValue, InputType.TEXT)
        this.clearInput()
      }
    },
    inputEnd(data, type) {
      this.triggerEvent('inputEnd', { data, type })
    },
    clearInput() {
      this.setData({
        inputValue: ''
      })
    },
    onInput(e) {
      const inputValue = e.detail.value.trim()
      this.setData({
        inputValue
      })
    }
  },
  lifetimes: {
    attached: function() {
      this.initRecord()
    }
  },
})
