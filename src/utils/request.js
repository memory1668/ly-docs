// import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'
// import { getMerchantId } from '@/utils/auth-merchant'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// HTTP 请求拦截器
service.interceptors.request.use(
  config => {
    //  在发送 HTTP 请求前进行配置
    // 1.1 配置 Token
    // if (store.getters.token) {
    //   config.headers['Authorization'] = 'Bearer ' + getToken()
    // }
    //
    // // 2.1 配置商户 ID
    // if (store.getters.merchant) {
    //   config.headers['Y-Dashboard-Merchant-Id'] = getMerchantId()
    // }
    //
    // // 3.1 如果有选中仓库
    // if (store.getters.warehouse && store.getters.warehouse.id) {
    //   config.headers['Y-Dashboard-Warehouse-Id'] = store.getters.warehouse.id
    // }
    //
    // // 4.1 如果有选中抖音账号
    // if (store.getters.douyinAccount && store.getters.douyinAccount.id || store.state.douyin.id) {
    //   config.headers['Y-Dashboard-Douyin-Account-Id'] = store.getters.douyinAccount && store.getters.douyinAccount.id || store.state.douyin.id
    // }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// HTTP 响应拦截
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */
  response => {
    const res = response.data

    if (res.code !== 200) { // 请求响应失败
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })

      // 1401: 未登录
      if (res.code === 1401) {
        // to re-login
        MessageBox.confirm('账号登录状态已失效，你可以点击取消按钮留在当前页，也可以重新登录。', '登录状态失效', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/resetToken').then(() => {
          //   location.reload()
          // })
        })
      }

      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err: ' + error) // for debug
    console.log('response: ', error.response) // for debug
    if (error.response) {
      const errMsg = error.response.data.message ? error.response.data.message : error.response.data.msg
      Message({
        message: errMsg,
        type: 'error',
        duration: 3 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
