<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="750px"
      top="9vh"
      @closed="closedDialog"
    >
      <div slot="title">选择打印机</div>
      <div class="flex mt-5">
        <div class="flex-1">
          <div class="printer-box">
            <div v-for="(printer, index) in list" :key="printer.id">
              <div :class="{'printer-item': true, 'selected' : checked[printer.id]}">
                <div class="flex">
                  <div class="fz-48"><i class="el-icon-printer" /></div>

                  <div class="ml-15">
                    <div class="fz-15 bold mr-15">{{ printer.name }}</div>

                    <div class="mt-10">
                      <el-tag v-if="printer.is_default" type="info" size="mini">默认</el-tag>

                      <el-tag v-if="printer.status === 1" type="warning" size="mini">离线状态</el-tag>
                      <el-tag v-else-if="printer.status=== 2" type="success" size="mini">状态正常</el-tag>
                      <el-tag v-else-if="printer.status=== 3" type="danger" size="mini">状态异常</el-tag>
                      <el-tag v-else type="info" size="mini">未知状态</el-tag>
                    </div>
                  </div>

                  <div class="ml-30">
                    <el-checkbox
                      v-model="checked[printer.id]"
                      size="mini"
                      border
                      @change="checkChange($event, index, printer)"
                    >选择</el-checkbox>
                  </div>
                </div>

                <div v-if="isShowPrintNum" class="mt-10 flex">
                  <div class="mr-15 pt-5">打印数量</div>
                  <el-input-number
                    v-model="printerIdMapNum[printer.id]"
                    size="mini"
                    :min="1"
                    :disabled="!checked[printer.id]"
                    @change="changeInputNum($event, printer.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiPrinter from '@/api/printer'

export default {
  name: 'DialogSelectPrinter',
  components: {},

  props: {

    /**
     * 是否显示
     */
    visible: {
      type: Boolean,
      default: false
    },

    /**
     * 默认打印机是否自动选中
     */
    isDefaultChecked: {
      type: Boolean,
      default: false
    },

    /**
     * 显示打印数量
     */
    isShowPrintNum: {
      type: Boolean,
      default: true
    },

    /**
     * 选中的 ID
     */
    selectedIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      dialogVisible: true,
      list: [],

      checked: {},
      checkedList: [],

      // 每台打印机对应的打印数量
      printerIdMapNum: {}
    }
  },

  watch: {

    visible(val) {
      this.dialogVisible = val
      if (this.dialogVisible) {
        this.getList()
      }
    }
  },

  created() {
    this.dialogVisible = this.visible
  },

  methods: {

    /**
     * 数量变更
     * @param num
     * @param printerId
     */
    changeInputNum(num, printerId) {
      this.printerIdMapNum[printerId] = num
    },

    /**
     * 选择打印机
     */
    checkChange(e, index, printer) {
      if (this.checked[printer.id]) { // 选中
        this.checkedList.push(printer)
      } else { // 取消选中
        let targetIndex = -1
        for (let i = 0; i < this.checkedList.length; i++) {
          if (this.checkedList[i].id === printer.id) {
            targetIndex = i
            break
          }
        }
        if (targetIndex >= 0) {
          this.checkedList.splice(targetIndex, 1)
        }
      }
    },

    /**
     * 取消
     */
    cancel() {
      this.setDialogVisible(false)
      this.$emit('cancel')
    },

    /**
     * 确定选择
     */
    confirm() {
      const data = []
      this.checkedList.forEach(printer => {
        data.push({
          printer: printer,
          print_num: this.printerIdMapNum[printer.id]
        })
      })
      this.$emit('input', data)
      this.$emit('confirm', data)
      console.log('--> printers: ', data)
      this.setDialogVisible(false)
    },

    /**
     * 获取打印机列表
     */
    getList() {
      apiPrinter.list().then(res => {
        this.list = res.data.list

        this.list.forEach(printer => {
          this.$set(this.printerIdMapNum, printer.id, 1)

          if (printer.is_default && this.isDefaultChecked) {
            this.$set(this.checked, printer.id, true)
            this.checkedList.push(printer)
          } else if (this.selectedIds.length > 0 && this.selectedIds.indexOf(printer.id) >= 0) {
            this.$set(this.checked, printer.id, true)
            this.checkedList.push(printer)
          } else {
            this.$set(this.checked, printer.id, false)
          }
        })
      }).catch(e => {
        console.log(e)
        this.$message.error('获取打印机失败，请重试')
      })
    },

    /**
       * 设置弹框是否可见
       * @param flag
       */
    setDialogVisible(flag) {
      this.dialogVisible = flag
    },

    /**
       * 关闭弹窗时的回调
       */
    closedDialog() {
      this.checkedList = []
      this.checked = {}
      this.setDialogVisible(false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

  .printer-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: left;
    margin-top: 10px;
  }

  .printer-item {
    border: 1px solid #eee;
    border-radius: 3px;
    padding: 15px;
    margin-right: 16px;
    margin-bottom: 15px;

    &.selected {
      border: 1px solid #ff0089;
    }
  }

</style>
