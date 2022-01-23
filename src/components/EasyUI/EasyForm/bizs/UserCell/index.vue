<template>
  <div>
    <div v-if="!user">
      -
    </div>
    <div v-if="user">
      <div style="display: flex; flex-direction: row;">
        <div style="padding-top: 3px;">
          <el-image style="width: 40px; height: 40px; border-radius: 5px;" :src="user.avatar" fit="fill" />
        </div>
        <div style="margin-left: 10px; text-align: left;">
          <div style="">{{ user.name }}</div>
          <div v-if="user.phone"><i class="el-icon-mobile-phone" />{{ user.phone }}</div>
          <div v-else>-</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    user: {
      type: Object,
      default: null
    }
  }
}
</script>

<style scoped>

</style>
