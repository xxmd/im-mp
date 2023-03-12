# IMMPP

运行在微信小程序的 `IM` 即时通讯 APP， 目前只支持 `单聊`。

- 后端使用 [网易云信](https://doc.yunxin.163.com/TM5MzM5Njk/docs/jk3MzY2MTI?platform=server) 提供的单聊接口。
- 单聊界面可发送 `文本` ，`语音` ，`图片` 和 `位置` 等信息。

## 项目目录结构

```text
im-mp/
├── cloudfunctions/     // 云函数
└── miniprogram/        // 小程序源码
    ├── assets/         // 静态资源
    ├── components/     // 单聊界面用到的组件
    │   ├── FootInput   // 信息输入(支持文本，表情，语音，图片和位置信息等输入) 组件
    │   ├── IconText    // 图标文字展示组件
    │   ├── Message     // 聊天消息展示组合  
    │   └── Position    // 位置信息卡片组件               
    ├── custom-tab-bar  // 自定义tab-bar
    ├── pages/          // 小程序所有页面
    │   ├── contacts    // 联系人页面
    │   ├── profile     // 个人信息页面   
    │   ├── session     // 会话页面  
    │   └── single-chat // 单聊界面
    ├── utils           // 工具包
    └── vendor          // 第三方库
```

## 截图
<center> 
<img src="https://s2.xptou.com/2023/03/12/640dad6912fd7.PNG" width="100"/>
<img src="https://s2.xptou.com/2023/03/12/640dada522da7.PNG" width="100"/>
<img src="https://s2.xptou.com/2023/03/12/640dadde6bd5e.PNG" width="100"/>
<img src="https://s2.xptou.com/2023/03/12/640dae0b9b845.PNG" width="100"/>
</center>

## 扫码体验
<img style="width: 200px; object-fit: cover;" src="https://s2.xptou.com/2023/03/12/640db2a959640.png" />
