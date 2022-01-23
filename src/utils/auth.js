import Cookies from 'js-cookie'

// 判断如果是连娱宝的域名，那么种 cookie 在一级域名下
let param = null
if (window.location.href.indexOf('lianyubao.com') >= 0) {
  param = {}
  param.domain = '.lianyubao.com'
}

/**
 * 当前用户认证 Token 的操作
 * @type {string}
 */

const TokenKey = 'Y-Dashboard-Token'

export function getToken() {
  return Cookies.get(TokenKey, param)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, param)
}

export function removeToken() {
  return Cookies.remove(TokenKey, param)
}
