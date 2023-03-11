const { SHA1 } = require("crypto-js");
import config from "../config";

/**
 * 生成随机字符串
 * @param x
 * @returns {string}
 */
function randString(x) {
  let s = "";
  while (s.length < x && x > 0) {
    const v = Math.random() < 0.5 ? 32 : 0;
    s += String.fromCharCode(
      Math.round(Math.random() * (122 - v - (97 - v)) + (97 - v))
    );
  }
  return s;
}

/**
 * 生成IM所需的部分头信息
 * @returns {{Nonce: string, CheckSum, AppKey: string, CurTime: string}}
 */
function geneHeadParams() {
  const [Nonce, CurTime] = [randString(20), new Date().getTime().toString().slice(0, 10)]
  return {
    AppKey: config.appKey,
    Nonce,
    CurTime,
    CheckSum: SHA1(config.appSecret + Nonce + CurTime).toString()
  }
}

/**
 * 封装微信请求
 * @param options
 */
export function request(options) {
  wx.showLoading({
    title: options.loadingTips || '网络请求中...'
  })
  wx.request({
    url: options.url,
    method: options.method || 'POST',
    header: {
      ...geneHeadParams(),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      accid: options.data.openId || wx.getStorageSync('openId'),
      ...options.data
    },
    success(res) {
      wx.hideLoading()
      if (typeof options.success === 'function') {
        options.success(res)
      }
    },
    fail(error) {
      console.log(error)
      wx.showToast({
        icon: 'error',
        title: 'Request fail'
      })
      options.fail(error)
    },
    complete() {
      wx.hideLoading()
    }
  })
}
