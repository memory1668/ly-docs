<template>
  <div>授权登录</div>
</template>
<script>
import apiSite from '../../api/site'
// import apiAccount from '@/api/account'
// import { setMerchantId } from '@/utils/auth-merchant'
export default {
  name: 'Authorize',

  data() {
    return {
      // 微信授权重定向的 code
      code: '',

      // 登录中
      loading: false,

      // 账号有权限的商家账号列表
      listAccountMerchant: []

    }
  },

  created() {
    // 判断是否有微信授权重定向的 code
    // 如果没有重定向回登录页面
    if (!this.$route.query.code) {
      this.$router.push({ path: '/login', query: { }})
      return
    }

    // 如果是开发环境，跳转到开发环境
    if (this.$route.query.state === 'development') {
      window.location.href = 'http://localhost:9627/#/authorize?code=' + this.$route.query.code
      return
    }

    this.code = this.$route.query.code

    // 授权登录
    this.authorize()
  },
  methods: {

    /**
     * 授权登录
     */
    authorize() {
      this.loading = true
      apiSite.wechatLogin(this.code).then(res => {
        this.$store.dispatch('user/login', { token: res.data.token }).then(() => {
          this.getAvailableAccountMerchant()
        }).catch((e) => {
          console.log(e)
        })
      }).catch(e => {
        console.log(e)
        this._redirect()
      }).finally(() => {
        this.loading = false
      })
    },

    /**
     * 获取账号有权限的商家账号信息
     */
    getAvailableAccountMerchant() {
      apiAccount.availableAccountMerchants().then(res => {
        this.listAccountMerchant = res.data.list

        if (this.listAccountMerchant.length === 0) {
          this.$message.error('账号无商家权限')
        } else {
          setMerchantId(this.listAccountMerchant[0].merchant_id)
          this.$message.success('登录成功' + (this.listAccountMerchant[0].merchant ? '，进入[' + this.listAccountMerchant[0].merchant.name + ']' : ''))
        }
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.loading = false
        this._redirect()
      })
    },

    _redirect() {
      this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
    }
  }
}
</script>
