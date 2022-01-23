<template>
  <div>
    <easy-form-panel
      ref="easyFormPanel"
      v-model="formData"
      :options="options.forms ? options.forms: options.form"
      :buttons="buttonConfig"
    />
  </div>
</template>

<script>
import EasyFormPanel from '@/components/EasyUI/EasyFormPanel'

export default {
  name: 'PanelForm',
  components: { EasyFormPanel },
  props: {

    /**
       * 表单内容配置
       * 具体配置参考：EasyForm 配置
       */
    options: {
      type: Object,
      default: () => {
        return {
          form: {},
          forms: [],
          buttons: {
            align: 'left',

            // 提交按钮
            submit: {
              show: true,
              text: '查找',
              scene: {
                formatter: (data) => { // 格式化数据
                  return data
                }
              }
            },

            // 取消按钮
            cancel: { show: true, text: '取消' }
          }
        }
      }
    }
  },

  data() {
    return {
      // 表单数据
      formData: {},

      // 按钮配置
      buttonConfig: {
        submit: {
          show: true,
          text: '搜索'
        },
        cancel: {
          show: true,
          confirm: {},
          text: '取消'
        }
      }
    }
  },
  /**
   * 监听值变更
   */
  watch: {
    /**
     * 监听表单值参数是否变更
     */
    formData: {
      /**
       * 触发 onChange 事件
       */
      handler(data) {
        this.eventOnChange(data)
      },

      deep: true
    }
  },
  created() {
    this.buttonConfig = { ...this.options.buttons }
    if (this.buttonConfig.hasOwnProperty('submit')) {
      this.buttonConfig.submit.clickMethod = this.facadeSubmitClick
    }

    if (this.buttonConfig.hasOwnProperty('cancel')) {
      this.buttonConfig.cancel.clickMethod = () => {
        this.facadeCancelClick()

        if (this.buttonConfig.cancel.hasOwnProperty('callback')) {
          this.buttonConfig.cancel.callback(this.formData)
        }
        this.$message.success('成功重置条件')
      }
    }
  },

  methods: {
    /**
     * 使用 提交按钮上面配置的 formatter，统一做数据格式化，再 emit 回去
     */
    dataFormatter(formData) {
      let tmpData = JSON.stringify(formData)
      tmpData = JSON.parse(tmpData)

      // 1.1 获取场景配置
      const btnSubmit = this.buttonConfig.submit
      if (!btnSubmit.hasOwnProperty('scene')) {
        return tmpData
      }

      // 执行数据格式化
      const scene = btnSubmit.scene
      let data = {}
      if (scene.hasOwnProperty('formatter')) {
        data = scene.formatter(tmpData)
      }

      return data
    },

    /**
       * 覆写 click submit 事件
       * @param formData
       */
    facadeSubmitClick(formData) {
      const data = this.dataFormatter(formData)
      this.$emit('onSearch', data)
    },

    /**
     * 当表单值变更时，触发 onChange 事件
     */
    eventOnChange(formData) {
      const data = this.dataFormatter(formData)
      this.$emit('onChange', data)
    },

    /**
     *  点击取消（重置）按钮，重置表单
     */
    facadeCancelClick() {
      this.$refs['easyFormPanel'].resetForm()
    },

    /**
     * 设置按钮 loading
     * @param flag
     */
    toggleLoading(flag) {
      // const buttons = Object.assign({}, this.options.buttons)
      const buttonConfig = Object.assign({}, this.buttonConfig)
      buttonConfig.submit.isLoading = flag
      // this.options.buttons = buttons
      this.buttonConfig = buttonConfig
    }
  }
}
</script>
