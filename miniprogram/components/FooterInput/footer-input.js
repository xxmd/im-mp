import emojiList from "../../vendor/emoji";
import {InputType} from "../../utils/types";
const app = getApp()
const recordDurationTrigger = 1000

// 聊天界面底部输入框，支持文字，表情，语言和图片
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
    /**
     * 控制底部隐藏区域显示与否
     * @param e
     */
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
      // 设置录音开始回调
      this.record.onStart((res) => {
        this.onRecordStart(res)
      })
      // 这里拿到这个frameBuffer用于获取录音的时长和录音文件大小信息,这个回调在onStop回调之前
      this.record.onFrameRecorded((res) => {
        this.frameBuffer = res.frameBuffer
      })
      // 设置录音结束回调
      this.record.onStop((res) => {
        this.onRecordStop(res)
      })
    },
    /**
     * 录音开始
     */
    onRecordStart() {
      // 记录录音开始时间
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
     * 检查录音时长，避免误触
     * @returns {boolean} 录音时长是否合格
     */
    checkRecordDuration() {
      // 这个recordDuration在音频上传的时候要用到
      this.recordDuration = this.recordEndTime - this.recordStartTime
      if (Number.isNaN(this.recordDurationthis) || this.recordDuration < recordDurationTrigger) {
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
      // 记录录音结束时间
      this.recordEndTime = new Date().getTime()
      this.setData({
        recording: false
      })
      if (this.checkRecordDuration()) {
        wx.showToast({
          icon: 'none',
          title: '录音结束'
        })
        this.inputEnd({
          duration: this.recordDuration,
          tempFilePath: res.tempFilePath,
          frameBuffer: this.frameBuffer
        }, InputType.VOICE)
      }
    },
    /**
     * 点击录音按钮开始
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
    /**
     * 点击录音按钮结束
     */
    onTouchEnd() {
      this.record.stop()
    },
    /**
     * 选择图片
     */
    choosePicture() {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        success: (res) => {
          this.inputEnd(res.tempFiles[0], InputType.PICTURE)
        }
      })
    },
    /**
     * 选择位置
     */
    choosePosition() {
      const _this = this
      wx.chooseLocation({
        success(res) {
          _this.inputEnd(res, InputType.POSITION)
        }
      })
    },
    /**
     * 添加表情
     * @param e
     */
    addEmoji(e) {
      const emoji = e.target.dataset.emoji
      this.setData({
        inputValue: this.data.inputValue + emoji
      })
    },
    /**
     * 输入框失去焦点
     */
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
          icon: 'error',
          title: '请输入内容'
        })
      } else {
        this.inputEnd(this.data.inputValue, InputType.TEXT)
        this.clearInput()
      }
    },
    /**
     * 输入结束
     * @param data
     * @param type
     */
    inputEnd(data, type) {
      this.triggerEvent('inputEnd', { data, type })
    },
    clearInput() {
      this.setData({
        inputValue: ''
      })
    },
    onInput(e) {
      this.setData({
        inputValue: e.detail.value
      })
    }
  },
  lifetimes: {
    attached: function() {
      // 页面attached生命周期初始化录音器
      this.initRecord()
    }
  }
})
