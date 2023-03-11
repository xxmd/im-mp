// pages/position-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: {},
    markers: [],
    operators: [
      {
        icon: 'car',
        text: '打车'
      },
      {
        icon: 'navigator',
        text: '导航'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOpenerEventChannel().once('sendParams',(params)=>{
      console.log(params)
      this.setData({
        position: params.position,
        markers: [
          params.position
        ]
      })
    })
  }
})
