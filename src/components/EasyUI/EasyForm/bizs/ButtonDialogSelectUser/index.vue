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
import apiUser from '@/api/user'
export default {
  name: 'ButtonDialogSelectUser',
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
     * 是否多选
     */
    multiple: {
      type: Boolean,
      default: false
    },
    /**
    * 用户类型
    * 1：正常用户
    * 2：虚拟用户
    * 0: 所有类型的用户
    */
    type: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      // 选中项
      selectedItem: {},

      // 按钮配置
      button: {
        // button初始显示的文字
        placeholder: '选择顾客', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个用户'
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
            return '已选择 ' + val.length + ' 个用户'
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
          title: '选择顾客',
          width: '1000px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: `/merchant-users/user/list`
          },

          // 2.1 过滤栏配置
          filterForm: {
            autoRefresh: true,
            /**
                 * 表单配置
                 */
            form: {
              title: '筛选条件',
              attrs: { labelPosition: 'left', labelWidth: '70px' },
              rows: [
                {
                  col: { span: 8 },
                  items: [
                    { type: 'input', prop: 'name', label: '用户名', attrs: { placeholder: '请输入用户名', clearable: true }},
                    { type: 'input', prop: 'phone', label: '手机号', attrs: { placeholder: '请输入手机号', clearable: true }},
                    {
                      col: { span: 12 },
                      type: 'date-picker', label: '首次到访', prop: 'created_at', defaultValue: [],
                      attrs: { type: 'datetimerange', placeholder: '选择日期', startPlaceholder: '开始日期', endPlaceholder: '结束日期', valueFormat: 'yyyy-MM-dd hh:mm:ss' }
                    },
                    {
                      col: { span: 12 },
                      type: 'date-picker', label: '最近到访', prop: 'latest_visited_at', defaultValue: [],
                      attrs: { type: 'datetimerange', placeholder: '选择日期', startPlaceholder: '开始日期', endPlaceholder: '结束日期', valueFormat: 'yyyy-MM-dd hh:mm:ss' }
                    }
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
                    if (query.created_at && query.created_at.length >= 2) {
                      query.created_at__min = query.created_at[0]
                      query.created_at__max = query.created_at[1]
                    }
                    delete query.created_at

                    if (query.latest_visited_at && query.latest_visited_at.length >= 2) {
                      query.latest_visited_at__min = query.latest_visited_at[0]
                      query.latest_visited_at__max = query.latest_visited_at[1]
                    }
                    delete query.latest_visited_at
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
            title: '用户列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              { label: '顾客', width: 220, align: 'center', render: (h, { row }) => {
                if (!row) {
                  return (<div>-</div>)
                }

                return (<user-cell user={row}/>)
              } },
              { label: '性别', render: (h, { row }) => {
                if (!row) {
                  return (<el-tag type='warning'>未知</el-tag>)
                }

                if (row.gender === 1) {
                  return (<el-tag type='info'>男</el-tag>)
                } else if (row.gender === 2) {
                  return (<el-tag type='primary'>女</el-tag>)
                } else {
                  return (<el-tag type='warning'>未知</el-tag>)
                }
              } },
              { label: '地区', width: 250, render: (h, { row }) => {
                if (!row.user_wechat || (!row.user_wechat.country && !row.user_wechat.province)) {
                  return (<div>-</div>)
                }

                return (
                  <div>
                    <span class='mr-10' v-show={row.user_wechat.country}>{row.user_wechat.country}</span>
                    <span class='mr-10' v-show={row.user_wechat.province}>{row.user_wechat.province}</span>
                    <span class='mr-10' v-show={row.user_wechat.city}>{row.user_wechat.city}</span>
                  </div>
                )
              } },
              { prop: 'amount_consume', label: '总消费额', formatter: row => {
                if (!row.merchant_user) {
                  return <div>-</div>
                }

                return row.merchant_user.amount_consume
              } },
              { prop: 'num_desk', label: '开台次数', width: 120, formatter: row => {
                if (!row.merchant_user) {
                  return <div>-</div>
                }

                return row.merchant_user.num_desk
              } },
              { prop: 'num_order', label: '下单次数', width: 120, formatter: row => {
                if (!row.merchant_user) {
                  return <div>-</div>
                }

                return row.merchant_user.num_order
              } },
              { prop: 'created_at', label: '首次到访', width: 180, formatter: row => {
                if (!row.merchant_user) {
                  return <div>-</div>
                }

                return row.merchant_user.created_at
              } },
              { prop: 'updated_at', label: '最近到访', width: 180, fixed: 'right', formatter: row => {
                if (!row.merchant_user) {
                  return <div>-</div>
                }

                return row.merchant_user.updated_at
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
      console.log('val:', val)
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
      const res = await apiUser.getById(val)
      return '已选：' + res.data.name
    }
  }
}
</script>
