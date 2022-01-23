<template>
  <div>
    <easy-form-panel
      ref="easyFormPanel"
      :options="opts.forms ? opts.forms: opts.form"
      :buttons="opts.buttons"
    >
      <template #footer>
        <slot name="footer"/>
      </template>
    </easy-form-panel>
  </div>
</template>

<script>
import EasyFormPanel from '@/components/EasyUI/EasyFormPanel'
// import axiosInstance from '@/utils/request'

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
              text: '提交',
              scene: {
                formatter: (data) => {
                  return data
                }, // 格式化请求数据
                request: {
                  httpClient: axiosInstance, // axios 实例

                  url: '',
                  method: 'POST',
                  headers: {},
                  params: {}
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

  data () {
    return {
      buttonConfig: {
        submit: {
          show: true,
          text: '提交'
        },
        cancel: {
          show: true,
          text: '取消'
        }
      },

      opts: {}
    }
  },

  watch: {
    options: {
      immediate: true,
      handler (val) {
        this.opts = val

        this.buttonConfig = { ...this.opts.buttons }
        if (this.buttonConfig.hasOwnProperty('submit')) {
          this.buttonConfig.submit.clickMethod = this.facadeSubmitClick
        }
      }
    }
  },
  created () {
  },

  methods: {

    /**
     * 清除表单验证的结果信息
     */
    clearValidate () {
      this.$refs.easyFormPanel.clearValidate()
    },

    /**
     * 设置表单的值
     */
    resetFormData (data) {
      this.$refs.easyFormPanel.resetFormData(data)
    },

    /**
     * 覆写 click submit 事件
     * @param formData
     */
    facadeSubmitClick (formData) {
      // 1.1 获取场景配置
      const btnSubmit = this.buttonConfig.submit
      if (!btnSubmit.hasOwnProperty('scene')) {
        return
      }
      const scene = btnSubmit.scene
      if (!btnSubmit.scene.hasOwnProperty('request')) {
        return
      }

      const request = scene.request

      // 2.1 发送 http 请求
      let data = {}

      // 如果有指定格式化表单数据进行发送请求，执行数据格式化
      if (scene.hasOwnProperty('formatter')) {
        data = scene.formatter(formData)
      }

      const submitData = request.data ? { ...request.data, ...data } : formData
      if (scene.confirm) {
        scene.confirm(submitData).then(() => {
          this.submitData(request, submitData)
        }).catch(() => {

        })
        return
      }
      this.submitData(request, submitData)
    },

    /**
     * 提交表单数据
     * @param request
     * @param data
     */
    submitData (request, data) {
      // http 客户端进行请求发送
      let buttons = Object.assign({}, this.opts.buttons)
      buttons.submit.isLoading = true
      this.opts.buttons = buttons

      // !request.httpClient && (request.httpClient = axiosInstance)
      // !request.method && (request.method = 'POST')
      // request.httpClient.request({
      //   url: request.url,
      //   method: request.method.toUpperCase(),
      //   data,
      //   params: request.params ? request.params : null,
      //   headers: request.headers ? request.headers : null
      // })

      // 模拟请求成功
      Promise.resolve().then(res => {
        buttons = Object.assign({}, this.opts.buttons)
        buttons.submit.isLoading = false
        this.opts.buttons = buttons

        // 执行 onSuccess 回调
        if (request.hasOwnProperty('onSuccess') && typeof request.onSuccess === 'function') {
          request.onSuccess(res, data)
        }
      }).catch(error => {
        buttons = Object.assign({}, this.opts.buttons)
        buttons.submit.isLoading = false
        this.opts.buttons = buttons

        // 执行回调
        if (request.hasOwnProperty('onError') && typeof request.onError === 'function') {
          request.onError(error, data)
        }
        console.log('error: ', error)
      })
    }
  }
}

</script>
