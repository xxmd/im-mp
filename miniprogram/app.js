import PubSub from "./utils/pubsub";

App({
  pubSub: new PubSub(),
  globalData: {},
  init() {
    this.initSafeArea()
  },
  initSafeArea() {
    wx.getSystemInfo({
      success: res => {
        this.globalData.safeAreaHeight = res.screenHeight - res.safeArea.bottom;
      }
    })
  },
  onLaunch: function () {
    this.init()
  }
});
