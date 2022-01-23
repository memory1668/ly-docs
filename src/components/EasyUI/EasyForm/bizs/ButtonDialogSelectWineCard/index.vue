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
import apiWineCard from '@/api/wine-card'
export default {
  name: 'ButtonDialogSelectWineCard',
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
        icon: 'el-icon-notebook-2',
        type: 'primary',
        plain: true,

        // button初始显示的文字
        placeholder: '选择存酒卡', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个存酒卡'
          } else {
            return val.phone
            // const userInfo = val.user ? val.user.name + '/' + val.user.phone : ''
            // return (val.name ? val.name + ' / ' + val.phone : (userInfo === '' ? val.phone : userInfo))
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
            return '已选择 ' + val.length + ' 个存酒卡'
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
          title: '选择存酒卡',
          width: '800px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: `/wine-cards`
          },

          // 2.1 过滤栏配置
          filterForm: {
            autoRefresh: true,
            /**
                 * 表单配置
                 */
            form: {
              title: '筛选条件',
              attrs: { labelPosition: 'left', labelWidth: '100px' },
              rows: [
                {
                  col: { span: 12 },
                  items: [
                    { type: 'input', prop: 'name__like', label: '姓名', attrs: { placeholder: '请输入顾客姓名', clearable: true }},
                    { type: 'input', prop: 'phone__like', label: '存酒卡手机号', attrs: { placeholder: '请输入手机号', clearable: true }}
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
            title: '存酒卡列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              {
                label: '存酒卡手机号', width: 120, render: (h, { row }) => {
                  return (<div style='color: #f44b5e;'>{row.phone}</div>)
                }
              },
              { prop: 'name', label: '顾客姓名', width: 140 },
              { label: '所属顾客', width: 180, render: (h, { row }) => {
                if (row.user) {
                  return (<user-cell user={row.user}/>)
                } else {
                  return (<div>-</div>)
                }
              } },
              { prop: 'num_remain', label: '剩余' },
              { prop: 'num_expire', label: '已过期' }
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
        return '选择存酒卡'
      }
      const res = await apiWineCard.getById(val)
      const card = res.data
      // const userInfo = card.user ? card.user.name + '/' + card.user.phone : ''
      return (card.phone)
      // return (res.data.name ? res.data.name + ' / ' + res.data.phone : (userInfo === '' ? card.phone : userInfo))
    }
  }
}
</script>
