import Cookies from 'js-cookie'

// 判断如果是连娱宝的域名，那么种 cookie 在一级域名下
let param = null
if (window.location.href.indexOf('lianyubao.com') >= 0) {
  param = {}
  param.domain = '.lianyubao.com'
}

/**
 * 当前用户查看的商户 ID
 * @type {string}
 */

const KeyMerchantId = 'Y-Dashboard-Merchant-Id'

export function getMerchantId() {
  return Cookies.get(KeyMerchantId, param)
}

export function setMerchantId(merchantId) {
  return Cookies.set(KeyMerchantId, merchantId, param)
}

export function removeMerchantId() {
  return Cookies.remove(KeyMerchantId, param)
}
