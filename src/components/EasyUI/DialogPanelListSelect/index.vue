<template>
  <div>
    <dialog-panel-list
      ref="dialogPanelList"
      :options="options"
      @selection-change="handleSelectionChange"
    >
      <!--如果有配置按钮，并且是多选的情况，才展示确定选择的按钮-->
      <template v-if="options.buttons && options.panelListOptions.lbTable.selection && options.panelListOptions.lbTable.selection.multiple" slot="footer">
        <div :class="buttonAlign()" style="margin-top: 15px">
          <!--取消按钮-->
          <el-button
            v-if="btnCancel.show"
            :type="btnCancel.type || 'default'"
            :plain="btnCancel.hasOwnProperty('plain') ? btnCancel.plain : false"
            :round="btnCancel.hasOwnProperty('round') ? btnCancel.round : false"
            :icon="btnCancel.icon"
            @click="onClickCancel"
          >{{ btnCancel.text }}
          </el-button>

          <!--提交按钮-->
          <el-button
            v-if="btnSubmit.show"
            :type="btnSubmit.type || 'primary'"
            :plain="btnSubmit.hasOwnProperty('plain') ? btnSubmit.plain : false"
            :round="btnSubmit.hasOwnProperty('round') ? btnSubmit.round : false"
            :icon="btnSubmit.icon || 'el-icon-check'"
            @click="onClickSubmit"
          >{{ btnSubmit.text }}
          </el-button>
        </div>
      </template>
    </dialog-panel-list>
  </div>
</template>

<script>
import axiosInstance from '@/utils/request'
import DialogPanelList from '@/components/EasyUI/DialogPanelList'

export default {
  name: 'DialogPanelListSelect',
  components: { DialogPanelList },

  props: {
    /**
     * v-model 配置参数
     */
    value: {
      type: [Number, String, Object, Array],
      default: () => {}
    },
    /**
     * 配置
     */
    options: {
      type: Object,
      default: () => {
        return {
          // 弹窗属性配置
          dialog: {},

          // panel list 配置
          panelListOptions: {},

          /**
           * 按钮配置
           */
          buttons: {
            type: Object,
            default: () => {
              return {
                // 按钮位置
                align: 'left', // right || center

                // 提交按钮
                submit: {
                  show: true,
                  text: '提交',
                  confirm: { title: '', content: '' },
                  clickMethod: (formData) => {
                  }
                },

                // 取消按钮
                cancel: {
                  show: true,
                  text: '取消',
                  confirm: { title: '', content: '' },
                  clickMethod: (formData) => {
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  data() {
    return {
      /**
       * 提交按钮配置
       */
      btnSubmit: { show: true, text: '提交' },

      /**
       * 取消按钮配置
       */
      btnCancel: { show: true, text: '取消' },

      // 选中的值
      selectedItems: []
    }
  },

  created() {
    this.initButtons()
  },

  methods: {
    /**
     * 初始化配置按钮
     */
    initButtons() {
      if (this.options.buttons.hasOwnProperty('submit')) {
        this.btnSubmit = { ...this.options.buttons.submit }
      }

      if (this.options.buttons.hasOwnProperty('cancel')) {
        this.btnCancel = { ...this.options.buttons.cancel }
      }
    },

    /**
     * 选择变更
     */
    handleSelectionChange(val) {
      this.selectedItems = val
      this.$emit('selection-change', val)
    },

    /**
     * 显示弹框 & 初始化表单
     */
    handleCreate() {
      this.$refs.dialogPanelList.handleCreate()
    },

    /*
    *点击取消按钮
    * */
    onClickCancel() {
      if (!this.btnCancel || !this.btnCancel.hasOwnProperty('clickMethod')) {
        return
      }
      // 关闭对话框
      this.$refs.dialogPanelList.setDialogVisible(false)
      this.btnCancel.clickMethod()
    },

    /*
    * 点击确定选择按钮
    * */
    onClickSubmit() {
      // 是否是多选
      const isMultiple = !this.options.panelListOptions.lbTable.hasOwnProperty('selection') || this.options.panelListOptions.lbTable.selection.multiple

      // // 获取选中项的值(如果是多选，则是数组；如果是单选，则是单个元素)
      const selected = isMultiple ? this.selectedItems : this.selectedItems.pop()

      // 更新父组件 v-model 的值
      this.$emit('input', selected)

      // 1.1 获取场景配置
      const btnSubmit = this.btnSubmit
      if (!btnSubmit.hasOwnProperty('scene')) {
        return
      }

      // 2.1 根据指定场景，执行：HTTP 请求 或者 执行 v-model 和 clickMethod 回调事件
      const scene = btnSubmit.scene
      if (btnSubmit.scene.hasOwnProperty('request')) { // 执行发送 HTTP 请求
        // http 客户端进行请求发送
        const request = scene.request
        !request.httpClient && (request.httpClient = axiosInstance)
        !request.method && (request.method = 'POST')
        request.httpClient.request({
          url: request.urlFormatter(selected),
          method: request.method.toUpperCase(),
          data: request.hasOwnProperty('dataFormatter') ? request.dataFormatter(selected) : (request.data ? request.data : null),
          params: request.hasOwnProperty('paramsFormatter') ? request.paramsFormatter(selected) : (request.params ? request.params : null),
          headers: request.headers ? request.headers : null
        }).then(res => {
          // 执行 onSuccess 回调
          if (request.hasOwnProperty('onSuccess') && typeof request.onSuccess === 'function') {
            request.onSuccess(res)
          }
        }).catch(error => {
          // 执行回调
          if (request.hasOwnProperty('onError') && typeof request.onError === 'function') {
            request.onError(error)
          }
          console.log('error: ', error)
        }).finally(() => {
          console.log('关闭弹框')
          // 关闭弹框
          this.$refs.dialogPanelList.setDialogVisible(false)
        })
      } else {
        // 关闭单选框
        if (!this.btnSubmit || !this.btnSubmit.hasOwnProperty('clickMethod')) {
          return
        }

        // 关闭对话框
        this.$refs.dialogPanelList.setDialogVisible(false)
        this.btnSubmit.clickMethod(selected)
      }
    },
    /*
    * 确定按钮的位置
    * */
    buttonAlign() {
      console.log(this.options.buttons.align)
      if (!this.options.buttons.hasOwnProperty('align')) {
        return 'text-left'
      }
      return 'text-' + this.options.buttons.align
    }
  }
}
</script>
