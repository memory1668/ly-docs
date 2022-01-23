<template>
  <div>
    <el-radio-group v-model="selectedRole" size="small" :disabled="hasRelatedStaff">
      <el-radio-button label="1">顾客存酒</el-radio-button>
      <el-radio-button label="2">员工存酒</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
/**
 * 选择存酒人身份
 */
export default {
  name: 'RadioSelectWineSaveRole',
  props: {
    /**
     * 传进来的值
     */
    value: {
      type: Number,
      default: () => {
        return 1
      }
    }
  },
  data () {
    return {
      phone: '',
      hasRelatedStaff: false // 存酒手机号是否有关联员工
    }
  },
  computed: {
    selectedRole: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },

  methods: {
    watchForm (form) {
      if (form.phone_number === this.phone) {
        return
      }
      this.phone = form.phone_number
      this.checkHasRelatedStaff()
    },

    /**
     * 判断存酒手机号是否有关联员工
     */
    checkHasRelatedStaff () {
      const phone = this.phone
      if (!phone) {
        this.hasRelatedStaff = false
        return
      }
      if (phone === '888888') {
        this.hasRelatedStaff = true
        this.selectedRole = 2
        return
      }
      this.hasRelatedStaff = false
    }
  }
}
</script>

<style scoped>

</style>
