<template>
  <!--<div :class="{'panel-active': list.length > 0}">-->
  <div>
    <div v-if="list.length > 0" class="list-container">
      <div
        v-for="(printer,index ) in list"
        :key="index"
        class="flex printer-ops-item"
      >
        <div class="flex">
          <div>
            <div class="printer-item">
              <div class="fz-48 pt-10"><i class="el-icon-printer" /></div>

              <div class="ml-15">
                <div class="fz-15 bold mr-15">{{ printer.name }}</div>

                <div style="margin-top: -5px;">
                  <!--<el-tag v-if="printer.is_default" type="info" size="mini">默认</el-tag>-->

                  <el-tag v-if="printer.status === 1" type="warning" size="mini">离线状态</el-tag>
                  <el-tag v-else-if="printer.status=== 2" type="success" size="mini">状态正常</el-tag>
                  <el-tag v-else-if="printer.status=== 3" type="danger" size="mini">状态异常</el-tag>
                  <el-tag v-else type="info" size="mini">未知状态</el-tag>
                </div>
              </div>
            </div>
            <div v-show="editPrintNum" class="mt-10 flex">
              <div class="mr-15" style="margin-top: -5px">打印数量</div>
              <el-input-number
                v-model="printerIdMapNum[printer.id]"
                size="mini"
                :min="1"
                @change="changeInputNum($event, printer.id)"
              />
            </div>
          </div>

          <div class="ml-15 pt-2 fz-18">
            <i class="el-icon-circle-close  icon-remove" @click="removeItem($event, index, printer.id)" />
          </div>
        </div>
      </div>
    </div>

    <div>
      <el-button type="default" icon="el-icon-plus" @click="clickAdd">选择打印机</el-button>
    </div>

    <!--选择打印机-->
    <dialog-select-printer
      :visible.sync="dialogVisible"
      :is-default-checked="true"
      :is-show-print-num="false"
      @close="handleCloseDialog"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import DialogSelectPrinter from './components/DialogSelectPrinter/index'

export default {
  name: 'PanelSelectPrinter',
  components: { DialogSelectPrinter },

  props: {

    /**
     * 传进来的值
     */
    value: {
      type: Array,
      default: () => {
        return []
      }
    },

    /**
     * 是否可编辑打印数量
     */
    editPrintNum: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {

      dialogVisible: false,

      // 用于展示
      list: [
        // {}
      ],

      // 选中的打印机
      selected: [
        // {product_id: 0, sku_id: 0}
      ],

      // 每台打印机对应的打印数量
      printerIdMapNum: {}
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
        // 如果空值，则返回
        if (!val || val.length === 0) {
          this.clear()
          return
        }

        // 如果已经初始化过，不进行初始化，不进行初始化
        if (this.selected.length > 0) {
          return
        }

        this.initData(val)
      }
    }
  },

  created() {
    this.list = []
    this.selected = []
  },

  methods: {

    /**
     * 清空
     */
    clear() {
      this.selected = []
      this.list = []
    },

    /**
     * 初始化数据
     */
    initData(val) {

    },

    /**
     * emit input 的值
     */
    emitInput() {
      this.$nextTick(() => {
        const val = []
        this.selected.forEach((v) => {
          val.push({
            printer_id: v,
            num: this.printerIdMapNum[v]
          })
        })

        console.log('emit printer: ', val)
        this.$emit('input', val)
      })
    },

    /**
     * 确认选择事件
     */
    handleConfirm(list) {
      list.forEach(item => {
        const printer = item.printer
        const printNum = item.print_num
        if (this.selected.indexOf(printer.id) < 0) {
          this.selected.push(printer.id)
          this.$set(this.printerIdMapNum, printer.id, printNum)
          this.list.push(printer)
        } else {
          this.$message.warning(`打印机[${printer.name}]已选择，自动忽略。`)
        }
      })

      this.emitInput()
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
    },

    /**
     * 数量变更
     * @param num
     * @param printerId
     */
    changeInputNum(num, printerId) {
      this.printerIdMapNum[printerId] = num

      this.emitInput()
    },

    /**
     * 移除打印机
     * @param e
     * @param index
     * @param printerId
     */
    removeItem(e, index, printerId) {
      this.$confirm('确认移除该打印机？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
        this.selected.splice(index, 1)
        delete this.printerIdMapNum[printerId]

        this.emitInput()
      }).catch(() => {})
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

  .list-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .printer-ops-item {
    border: 1px solid #eee;
    margin-bottom: 15px;
    margin-right: 15px;
    padding: 10px 15px 15px;
    border-radius: 3px;
  }

  .printer-item {
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    margin-right: 16px;
    margin-bottom: 15px;
  }
</style>
