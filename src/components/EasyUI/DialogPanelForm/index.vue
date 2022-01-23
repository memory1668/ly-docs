<template>
  <div>
    <el-dialog
      v-bind="formattedDialogAttrs"
      :top="formattedDialogAttrs.top ? formattedDialogAttrs.top: '8vh'"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      @close="handleCloseDialog"
    >
      <panel-form
        v-if="!formattedDialogAttrs || !formattedDialogAttrs.destroyOnClose || (formattedDialogAttrs.destroyOnClose && dialogVisible)"
        ref="panelForm"
        :options="formattedPanelFormOptions"
      >
        <template #footer>
          <slot name="footer" />
        </template>
      </panel-form>
    </el-dialog>
  </div>
</template>

<script>
import PanelForm from '@/components/EasyUI/PanelForm'

export default {
  name: 'DialogPanelForm',
  components: { PanelForm },

  props: {
    /**
     * 配置
     */
    options: {
      type: Object,
      default: () => {
        return {
          dialog: {}, // dialog 属性
          form: {}, // form 配置
          buttons: {} // 底部按钮配置
        }
      }
    }
  },

  data () {
    return {
      dialogVisible: false,

      /**
       * dialog 配置属性
       */
      formattedDialogAttrs: {},

      /**
       * dialog 中表单配置属性
       */
      formattedPanelFormOptions: {
        form: {},
        forms: {},
        buttons: {}
      }
    }
  },

  watch: {
    options: {
      immediate: true,
      handler (val) {
        this.initOptions()
      }
    }
  },

  created () {
  },

  methods: {
    /**
     * 关闭对话框时，充值表单数据
     */
    handleCloseDialog () {
      this.$refs.panelForm.resetFormData({})
    },

    /**
     * 初始化配置表单选项
     */
    initOptions () {
      this.formattedDialogAttrs = { ...this.options.dialog }
      this.formattedDialogAttrs = { ...this.options.dialog }
      this.formattedDialogAttrs.hasOwnProperty('visible') && (this.dialogVisible = this.formattedDialogAttrs.visible)
      this.formattedPanelFormOptions = Object.assign({}, this.options)
    },

    /**
     * 设置弹框是否可见
     * @param flag
     */
    setDialogVisible (flag) {
      this.dialogVisible = flag
    },

    /**
     * 显示弹框 & 初始化表单
     */
    handleCreate () {
      this.setDialogVisible(true)
      this.$nextTick(() => {
        this.$refs.panelForm.clearValidate()
        this.$refs.panelForm.resetFormData()
      })
    },

    /**
     * 显示弹框 & 初始化表单 & 初始化值
     */
    handleUpdate (data, buttons) {
      this.setDialogVisible(true)
      this.$nextTick(() => {
        this.$refs.panelForm.clearValidate()
        this.$refs.panelForm.resetFormData(data)

        if (buttons) {
          this.formattedPanelFormOptions = { ...this.formattedPanelFormOptions, buttons: buttons }
        }
      })
    },

    /**
     * 自定义触发点击提交按钮
     * @param {Object} data 表单提交的值
     */
    clickSubmit (data) {
      this.$refs.panelForm.facadeSubmitClick(data)
    }
  }
}

</script>
