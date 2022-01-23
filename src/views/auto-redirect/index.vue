<template>
  <div />
</template>
<script>
import store from '../../store'

export default {
  async beforeCreate () {
    const { rolePermission } = await store.dispatch('user/getInfo')
    console.log('rolePermission:', rolePermission)
    // 3.1 基于角色，过滤出可访问的菜单，并注册到 Vue Router
    // const accessRoutes = await store.dispatch('permission/generateRoutes', { rolePermission })
    // this.$router.addRoutes(accessRoutes)

    const merchant = await store.dispatch('merchant/setMerchantId')
    console.log('当前商家:' + merchant)

    this.$router.push({ path: '/platform/index', query: {} })
  }
}
</script>
