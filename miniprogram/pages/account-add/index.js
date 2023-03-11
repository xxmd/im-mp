// pages/account-add/index.js
import {randomStr} from "../../utils/str-util";
import {login, register, reLogin, upload} from "../../utils/api";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogVisible: false,
    account: {
      openId: '',
      nickName: '默认昵称'
    },
    fileList: [
      {
        url: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
        realUrl: 'https://tdesign.gtimg.com/miniprogram/images/avatar1.png',
        name: 'avatar.png',
        type: 'image'
      }
    ]
  },
  onShow() {
    this.data.account.openId = randomStr(11).toLowerCase()
    this.setData({
      account: this.data.account
    })
  },
  handleAdd(e) {
    const file = e.detail.files[0]
    file.status = 'loading'
    this.data.fileList.push(file)
    this.setData({
      fileList: this.data.fileList
    })
    upload(file.url, (res) => {
      file.status = 'done'
      file.realUrl = res.data.url
      this.setData({
        fileList: this.data.fileList
      })
    })
  },
  confirm() {
    this.data.account.avatarUrl = this.data.fileList[0].realUrl
    register(this.data.account, (res) => {
      this.openDialog()
    })
  },
  onChange(e) {
    const field = e.target.dataset.field
    this.data.account[field] = e.detail.value
    this.setData({
      account: this.data.account
    })
  },
  login() {
    this.closeDialog()
    reLogin(this.data.account.openId)
  },
  closeDialog() {
    this.setData({
      dialogVisible: false
    })
  },
  openDialog() {
    this.setData({
      dialogVisible: true
    })
  },
  handleRemove(e) {
    const { index } = e.detail;
    const { fileList } = this.data;
    fileList.splice(index, 1);
    this.setData({
      fileList
    });
  },
  handleClick(e) {
    console.log(e.detail.file);
  }
})
