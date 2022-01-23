<template>
  <div>

    <!--是否使用自定义按钮-->
    <slot v-if="isCustomBtn" name="custom-btn" />
    <el-button v-else :icon="button.icon" :type="button.type" :plain="button.plain" @click="showDialogPanelListSelect">{{ labelPlaceholder }}</el-button>

    <dialog-panel-list-select
      ref="dialogPanelListSelect"
      v-model="selectedItem"
      :options="dialogPanelListSelectOptions"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script>
import DialogPanelListSelect from '@/components/EasyUI/DialogPanelListSelect'

export default {
  name: 'ButtonDialogPanelListSelect',
  components: { DialogPanelListSelect },
  props: {
    /**
     * 是否自定义按钮
     */
    isCustomBtn: {
      type: Boolean,
      default: false
    },

    // v-model 配置
    value: {
      type: [Number, String, Object, Array],
      default() {
        return ''
      }
    },

    dialogPanelListSelectOptions: {
      type: Object,
      default: () => {
        return {
          dialog: {},
          panelListOptions: {},
          buttons: {}
        }
      }
    },

    // 展示的按钮配置
    button: {
      type: Object,
      default: () => {
        return {
          placeholder: '点击选择', // 按钮上的提示文字

          // 按钮上的图标
          icon: '',
          type: 'default',
          plain: false,

          // 通过选中的行记录，格式化按钮显示的内容
          labelFormatter: (val) => {
            return val.label
          },
          // 选中的值格式化, 用户表单提交
          valueFormatter: (val) => {
            return val
          },
          // 根据表单的值，获取对应的展示的内容
          async labelFormatterByFormValue(formValue) {
            return '已选 ' + formValue
          }
        }
      }
    }
  },
  data() {
    return {
      // 选中的项
      selectedItem: null,

      // 显示的文本
      labelPlaceholder: ''
    }
  },
  watch: {
    /**
     * 监听 placeholder 变更
     */
    button: {
      handler(val) {
        this.labelPlaceholder = val.placeholder
      },
      deep: true
    },

    /**
     * 选中值
     */
    selectedItem(val) {
      if (!val) return
      // 修改显示的内容
      this.labelPlaceholder = this.button.labelFormatter(val)
      // 格式化值
      this.$emit('input', this.button.valueFormatter(val))
    },

    /**
     * 传入值变更
     */
    value(val) {
      // 值变更，设置按钮显示的文本
      if (!val) {
        this.labelPlaceholder = this.button.placeholder
      } else {
        this.labelFormatterByFormValue(val)
      }
    }
  },
  created() {
    this.labelPlaceholder = this.button.placeholder
  },
  methods: {
    /**
     * 根据初始的值，格式化按钮显示的内容
     */
    async labelFormatterByFormValue(formValue) {
      if (this.button.hasOwnProperty('labelFormatterByFormValue')) {
        this.labelPlaceholder = await this.button.labelFormatterByFormValue(formValue)
      } else {
        return '选择'
      }
    },

    /**
       * 显示弹框
       */
    showDialogPanelListSelect() {
      this.$refs.dialogPanelListSelect.handleCreate()
    },

    /**
     * 确认选择
     */
    onClickSubmit() {
      this.$refs.dialogPanelListSelect.onClickSubmit()
    },

    /**
     * 值选中
     * @param val
     */
    handleSelectionChange(val) {
      // 这是使用 setTimeout 的原因：因为有可能 DialogPanelList 的 v-model 值还没变更，这里是等待它变更完再触发
      // 50 ms 只是一个大概值
      setTimeout(() => {
        this.$emit('selection-change', val)

        // 如果是单选，则默认自动关闭弹框
        if (this.dialogPanelListSelectOptions.panelListOptions.lbTable.selection && !this.dialogPanelListSelectOptions.panelListOptions.lbTable.selection.multiple) {
          this.onClickSubmit()
        }
      }, 50)
    }
  }
}
</script>
