import request from '../utils/request'

export default {

  // /**
  //  * 用户登录
  //  * @param data
  //  */
  // login(data) {
  //   return request.post('/site/login', data)
  // }

  /**
   * 微信扫码登录
   * @param code
   * @returns {*}
   */
  wechatLogin(code) {
    return request.post('/site/wechat-login', { code: code })
  }
}
