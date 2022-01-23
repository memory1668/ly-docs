<template>
  <div>
    <el-button :icon="button.icon" :type="button.type" :plain="button.plain" @click="showDialogSelectDouyinAccount">
      {{ labelPlaceholder }}
    </el-button>
    <dialog-select-douyin-account
      ref="dialogSelectDouyinAccount"
      v-model="selectedItem"
      :multiple="multiple"
      @change="handleSelectedItemChange"
    />
  </div>
</template>

<script>
import apiMemberCard from '@/api/member-card'
import DialogSelectDouyinAccount
  from '@/components/EasyUI/EasyForm/bizs/ButtonDialogSelectDouyinAccount/components/DialogSelectDouyinAccount'

export default {
  name: 'ButtonDialogSelectDouyinAccount',
  components: { DialogSelectDouyinAccount },
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },

    /**
     * 是否多选
     */
    multiple: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 选中项
      selectedItem: {},

      // 显示的文本
      labelPlaceholder: '',

      // 按钮配置
      button: {
        placeholder: '所有抖音号', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个抖音号'
          } else {
            return '已选：' + val.user.nickname
          }
        }
        // labelFormatterByFormValue: async(val) => {
        //   // 1. 发送网络请求
        //   if (val instanceof Array) {
        //     return '已选择 ' + val.length + ' 个抖音号'
        //   } else {
        //     return this.labelFormatterByFormValue(val)
        //   }
        // }
      }
    }
  },

  watch: {
    selectedItem(val) {
      // console.log('selectedItem change', val)
      // 修改显示的内容
      // this.labelPlaceholder = this.button.labelFormatter(val)
      this.$emit('input', val)
    },
    async value(val) {
      this.selectedItem = val
      // 值变更，设置按钮显示的文本
      if (!val) {
        this.labelPlaceholder = this.button.placeholder
      } else {
        if (this.button.hasOwnProperty('labelFormatterByFormValue')) {
          this.labelPlaceholder = await this.button.labelFormatterByFormValue(val)
        } else {
          return '选择'
        }
      }
    },
    /**
     * 监听 placeholder 变更
     */
    button: {
      handler(val) {
        this.labelPlaceholder = val.placeholder
      },
      deep: true,
      immediate: true
    }
  },

  async created() {
    // 如果配置了按钮的初始值
    // if (this.value) {
    //   // button初始显示的文字
    //   const btnText = await this.labelFormatterByFormValue(this.value)
    //   this.button.placeholder = btnText
    // }
  },
  methods: {
    async labelFormatterByFormValue(val) {
      if (!val || parseInt(val) === 0) {
        return '选择抖音号'
      }
      const res = await apiMemberCard.getById(val)
      return '已选：' + res.data.name
    },

    /**
     *  选中选项
     */
    handleSelectedItemChange(selected) {
      console.log('选中选项', selected)
      this.labelPlaceholder = this.button.labelFormatter(selected)
    },

    /**
     * 显示选择抖音号弹框
     * */
    showDialogSelectDouyinAccount() {
      this.$refs.dialogSelectDouyinAccount.handleCreate()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
