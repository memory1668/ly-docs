<template>
  <div>
    <div v-if="!smsTemplateId" class="preview">
      请先选择短信模板
    </div>
    <div>
      <div v-if="params && params.length > 0" class="w-200 mb-15">
        <div v-for="(param, index) in params" :key="index">
          <div>参数 {{ index + 1 }}: {{ param }}</div>
          <el-input v-model="paramValues[param]" placeholder="请填写参数" />
        </div>
      </div>
      <div>
        <div v-if="smsTemplate" class="preview">
          <div class="preview-title">短信预览</div>
          <div class="content">{{ content }}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>

import apiSmsTemplate from '@/api/sms-template'

export default {
  name: 'PanelConfigSmsParams',
  components: { },

  props: {

    /**
     * 传进来的值
     */
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },

  data() {
    return {

      dialogVisible: false,

      // 短信模板 ID
      smsTemplateId: '',
      smsTemplate: null,
      params: [],
      paramValues: {}
    }
  },

  computed: {

    /**
     * 内容
     */
    content() {
      if (!this.smsTemplate) {
        return '-'
      }

      let tmp = this.smsTemplate.content
      this.params.forEach(v => {
        if (!this.paramValues[v]) {
          return
        }

        tmp = tmp.replace('${' + v + '}', this.paramValues[v])
      })

      return `【${this.smsTemplate.signature}】${tmp}`
    }
  },

  watch: {
    /**
     * 监听传进来的值变更
     */
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('val: ', val)
      }
    },

    /**
     * 监听模板 ID
     */
    smsTemplateId: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('ID: ', val)
        if (!val) {
          this.smsTemplate = null
          this.params = []
          this.paramValues = {}
          return
        }

        this.initData(val)
      }
    },

    /**
     * 监听参数
     */
    paramValues: {
      // immediate: true,
      deep: true,
      handler(val) {
        this.emitInput()
      }
    }
  },

  created() {
    // this.list = []
    // this.selected = []
  },

  methods: {

    /**
     * 监听表单值变更
     */
    watchForm(form) {
      console.log('---> watch form: ', form)
      this.smsTemplateId = form.sms_template_id
    },

    /**
     * 初始化数据
     */
    initData(val) {
      this.getParamsAndDetail(val)
    },

    /**
     * emit input 的值
     */
    emitInput() {
      this.$emit('input', this.paramValues)
    },

    /**
     * 确认选择事件
     */
    handleConfirm(data) {

    },

    /**
     * 获取短信模板的参数和模板详情
     */
    getParamsAndDetail(id) {
      apiSmsTemplate.paramsAndDetail(id).then(res => {
        console.log('获取短信模板的参数和模板详情成功', res)
        this.params = res.data.params
        this.smsTemplate = res.data.template
        if (this.params && this.params.length > 0) {
          this.params.forEach(v => {
            this.$set(this.paramValues, v, this.value[v] || '')
          })
        } else {
          this.paramValues = {} // 重置参数
        }
      }).catch(e => {
        console.log(e)
      })
    },

    /**
     * 弹框关闭事件
     */
    handleCloseDialog(e) {
      this.dialogVisible = false
    },

    /**
     * 添加
     */
    clickAdd(e) {
      this.dialogVisible = true
    }

  }
}
</script>

<style lang="scss" scoped>
  .panel-active {
    border: 1px solid #f3f3f3;
    padding: 15px;
    border-radius: 5px;
  }
  .product-item {
    padding: 10px 0;
    border-bottom: 1px solid #f3f3f3;
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    &:first-child {
      padding-top: 0;
    }
  }

  .icon-remove {
    color: #999;
    &:hover {
      color: #ff5646;
      cursor: pointer;
    }
  }

  .preview {
    background: #f7f7f7;
    border-radius: 5px;
    padding: 5px 15px;
  }

  .preview-title {
    font-weight: bold;
    color: #ff5646;
  }

  .content {
    line-height: 1.7em;
  }

</style>
