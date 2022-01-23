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
import apiMemberCard from '@/api/member-card'
export default {
  name: 'ButtonDialogSelectKeyword',
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
        placeholder: '选择关键字', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个关键字'
          } else {
            return '已选：' + val.name + '/' + val.phone
          }
        },
        // 选中的值格式化
        valueFormatter: (val) => {
          if (val instanceof Array) {
            let ids = ''
            val.forEach((item) => {
              ids = ids + item.id + ','
              // ids.push(item.id)
            })
            return ids.slice(0, ids.length - 1) // 删除最后一个逗号
          } else {
            return val.id
          }
        }
        // labelFormatterByFormValue: async(val) => {
        //   // 是否多选
        //   if (val.includes(',')) {
        //     return '已选择 ' + val.split(',').length + ' 个关键字'
        //   } else {
        //     return this.labelFormatterByFormValue(val)
        //   }
        // }
      },

      /**
       * 弹框选择
       */
      dialogPanelListSelectOptions: {
        dialog: {
          title: '选择关键字',
          width: '800px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: '/douyin/keywords'
          },

          // 3.1 中间按钮栏快捷配置
          // operationButtons: [
          //   {
          //     label: '新建关键字',
          //     icon: 'el-icon-plus',
          //     type: 'primary',
          //     clickMethod: () => {
          //       this.handleCreate()
          //     }
          //   }
          // ], // END - operationButtons

          // 4.1 表格列表
          lbTable: {
            title: '监控关键字列表',
            pagination: true, // 开启分页
            selection: { multiple: true },
            columns: [
              { prop: 'text', label: '关键字', minWidth: 100 },
              { prop: 'num_fit_comment', label: '评论命中次数', minWidth: 100 },
              { prop: 'num_fit_direct_msg', label: '私信命中次数', minWidth: 100 },
              { prop: 'created_at', label: '时间', width: 200 }
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
    if (this.multiple) {
      this.dialogPanelListSelectOptions.panelListOptions.lbTable.columns.unshift({ type: 'selection' })
    }
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
        return '选择关键字'
      }
      const res = await apiMemberCard.getById(val)
      return '已选：' + res.data.name + '/' + res.data.phone
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
