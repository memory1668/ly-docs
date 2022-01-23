<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :top="formattedOptions.dialog.top ? formattedOptions.dialog.top : '8vh'"
      v-bind="formattedOptions.dialog"
      :modal="formattedOptions.dialog.modal"
      :append-to-body="true"
      @closed="closedDialog"
    >
      <panel-list
        v-if="dialogVisible"
        ref="panelList"
        :options="formattedOptions.panelListOptions"
        @selection-change="handleSelectionChange"
        v-on="$listeners"
      >
        <template slot="footer">
          <slot name="footer" />
        </template>
      </panel-list>
    </el-dialog>
  </div>
</template>

<script>
import PanelList from '@/components/EasyUI/PanelList'

export default {
  name: 'DialogPanelList',
  components: { PanelList },

  props: {
    options: {
      type: Object,
      default: () => {
        return {
          // dialog 配置
          dialog: {},

          // panel list 配置
          panelListOptions: {}
        }
      }
    }
  },

  data() {
    return {
      dialogVisible: false,
      formattedOptions: {
        dialog: {},
        panelListOptions: {}
      }
    }
  },

  created() {
    this.initOptions()
  },

  methods: {

    /**
     * 初始化配置表单选项
     */
    initOptions() {
      this.formattedOptions = { ...this.options }
      this.dialogVisible = this.formattedOptions.dialog.hasOwnProperty('visible') ? this.formattedOptions.dialog.visible : false
    },

    /**
     * 设置弹框是否可见
     * @param flag
     */
    setDialogVisible(flag) {
      this.dialogVisible = flag
    },

    /**
     * 显示弹框 & 初始化表单
     */
    handleCreate(query) {
      this.setDialogVisible(true)

      // url = baseUrl + query
      if (query) {
        this.formattedOptions.request.url = this.formattedOptions.request.baseUrl + query
      }

      this.$nextTick(() => {
        // 重新获取列表
        this.$refs.panelList.fetchList()
      })
    },
    /**
     * 选择
     * @param val
     */
    handleSelectionChange(val) {
      this.$emit('selection-change', val)
    },

    /**
     * 拉去列表
     */
    fetchList() {
      this.$refs.panelList.fetchList()
    },
    /**
     * 关闭弹窗时的回调
     */
    closedDialog() {
      if (this.formattedOptions.dialog.hasOwnProperty('closed')) {
        this.formattedOptions.dialog.closed()
      }
    }
  }
}

</script>
