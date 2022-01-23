<template>
  <div>
    <button-dialog-panel-list-select
      ref="buttonDialogPanelListSelect"
      v-model="selectedItem"
      :button="button"
      :dialog-panel-list-select-options="dialogPanelListSelectOptions"
    />
  </div>
</template>

<script>
import ButtonDialogPanelListSelect from '@/components/EasyUI/ButtonDialogPanelListSelect'
import apiPrinter from '@/api/printer'
export default {
  name: 'ButtonDialogSelectPrinter',
  components: { ButtonDialogPanelListSelect },
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },

    /**
     * 指定查询某个状态
     * 默认：查询状态为开启的卡模板
     */
    status: {
      type: Number,
      default: 1
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

      // 按钮配置
      button: {
        // button初始显示的文字
        placeholder: '选择打印机', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个打印机'
          } else {
            return '已选：' + val.name
          }
        },
        // 选中的值格式化
        valueFormatter: (val) => {
          if (val instanceof Array) {
            const ids = []
            val.forEach((item) => {
              ids.push(item.id)
            })
            return ids
          } else {
            return val.id
          }
        },
        labelFormatterByFormValue: async(val) => {
          // 1. 发送网络请求
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个打印机'
          } else {
            return this.labelFormatterByFormValue(val)
          }
        }
      },

      /**
       * 弹框选择
       */
      dialogPanelListSelectOptions: {
        dialog: {
          title: '选择打印机',
          width: '800px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: `/printers`,
            params: {
              status: this.status
            }
          },

          // 2.1 过滤栏配置
          filterForm: {
            autoRefresh: true,
            /**
                 * 表单配置
                 */
            form: {
              title: '筛选条件',
              attrs: { labelPosition: 'left', labelWidth: '120px' },
              rows: [
                {
                  col: { span: 12 },
                  items: [
                    { type: 'input', prop: 'name__like', label: '打印机', attrs: { placeholder: '请输入打印机名称', clearable: true }}
                  ]
                }
              ]

            },

            /**
            * 表单按钮
            */
            buttons: {
              align: 'right',

              submit: {
                show: true,
                text: '查找',
                icon: 'el-icon-search',
                scene: {
                  formatter: (query) => {
                    return query
                  }
                }
              },
              cancel: {
                show: true,
                text: '重置条件'
              }
            }
          },

          // 4.1 表格列表
          lbTable: {
            title: '打印机列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              { prop: 'name', label: '打印机', minWidth: 180 },
              { prop: 'sn', label: '编号', width: 120 },
              { prop: 'key', label: '识别码', width: 120 },
              { prop: 'phone_number', label: '流量卡号', width: 120 },
              { label: '状态', width: 80, render: (h, { row }) => {
                switch (row.status) {
                  case 0:
                    return (<el-tag type='info'>未知</el-tag>)
                  case 1:
                    return (<el-tag type='danger'>离线</el-tag>)
                  case 2:
                    return (<el-tag type='success'>正常</el-tag>)
                  case 3:
                    return (<el-tag type='warning'>异常</el-tag>)
                  default:
                    return (<div>-</div>)
                }
              } },
              { label: '账单打印机', width: 150, render: (h, { row }) => {
                switch (row.is_order_printer) {
                  case true:
                    return (<el-tag type='primary'>是</el-tag>)
                  case false:
                    return (<el-tag type='info'>否</el-tag>)
                }
              } },
              { label: '出品单打印机', width: 150, render: (h, { row }) => {
                switch (row.is_make_printer) {
                  case true:
                    return (<el-tag type='primary'>是</el-tag>)
                  case false:
                    return (<el-tag type='info'>否</el-tag>)
                }
              } }
            ]
          }
        },

        buttons: {
          align: 'right',

          // 提交按钮
          submit: {
            show: true, text: '确定选择',
            scene: {
              formatter: (data) => {
                return data
              }
            },
            clickMethod: (data) => {
            }
          },

          // 取消按钮
          cancel: {
            show: true, text: '取消',
            clickMethod: (data) => {
            }
          }
        }
      }
    }
  },

  watch: {
    selectedItem(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.selectedItem = val
    }
  },

  async created() {
    // 配置单选 / 多选
    this.dialogPanelListSelectOptions.panelListOptions.lbTable.selection.multiple = this.multiple
    // 如果配置了按钮的初始值
    if (this.value) {
      // button初始显示的文字
      const btnText = await this.labelFormatterByFormValue(this.value)
      this.button.placeholder = btnText
    }
  },
  methods: {
    async labelFormatterByFormValue(val) {
      if (!val || parseInt(val) === 0) {
        return '选择打印机'
      }
      const res = await apiPrinter.getById(val)
      return '已选：' + res.data.name
    }
  }
}
</script>
<style lang="scss" scoped>

  .card-item {
    padding: 15px;
    border-radius: 5px;
    color: white;
  }

  .bg-silver {
    background-color: silver;
  }

  .bg-black {
    background-color: #1b1b1b;
  }

  .bg-gold {
    background-color: gold;
  }
</style>
