const app = getApp()

Component({
  data: {
    curPath: "/pages/message/index",
    tabBarList: [
      {
        label: "消息",
        icon: {
          name: 'message',
          prefix: 'icon'
        },
        pagePath: "/pages/message/index"
      },
      {
        label: "通讯录",
        icon: {
          name: 'contacts',
          prefix: 'icon'
        },
        pagePath: "/pages/contacts/index"
      },
      {
        label: "我的",
        icon: {
          name: 'profile',
          prefix: 'icon'
        },
        pagePath: "/pages/profile/index"
      }
    ]
  },
  methods: {
    onChange(e) {
      const pagePath = e.detail.value
      wx.switchTab({
        url: pagePath
      })
    }
  }
})
