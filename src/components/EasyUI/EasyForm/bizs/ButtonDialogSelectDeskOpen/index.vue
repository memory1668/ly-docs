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
import apiDeskOpen from '@/api/desk-open'
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
    }
  },

  data() {
    return {
      // 选中项
      selectedItem: {},

      // 按钮配置
      button: {
        // button初始显示的文字
        placeholder: '开台记录', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个/开台记录'
          } else {
            return '已选：' + (val.desk ? val.desk.name + (val.marketing_staff ? '/' + val.marketing_staff.name : '') + (val.created_at ? '/' + val.created_at : '') : '加载中')
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
            return '已选择 ' + val.length + ' 个开台记录'
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
          title: '选择开台记录',
          width: '1000px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: '/desk-opens'
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
                    {
                      col: { span: 6 },
                      type: 'button-dialog-select-desk', label: '台号', prop: 'desk_id', defaultValue: '',
                      attrs: { placeholder: '台号' }
                    },
                    {
                      col: { span: 18 },
                      type: 'date-picker', label: '日期区间', prop: 'date_range', defaultValue: [],
                      attrs: { type: 'daterange', placeholder: '选择日期', startPlaceholder: '开始日期', endPlaceholder: '结束日期', valueFormat: 'yyyy-MM-dd' }
                    },
                    {
                      col: { span: 10 },
                      type: 'button-dialog-select-staff', label: '订台人', prop: 'marketing_staff_id', defaultValue: '',
                      attrs: { placeholder: '请选择订台人' }
                    },
                    {
                      col: { span: 10 },
                      type: 'button-dialog-select-staff', label: '服务员', prop: 'serve_staff_id', defaultValue: '',
                      attrs: { placeholder: '请选择服务员' }
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
                    if (query.date_range && query.date_range.length > 1) {
                      query.created_at__between = query.date_range[0] + ' 00:00:00,' + query.date_range[1] + ' 23:59:59'
                    }
                    delete query.date_range
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
            title: '开台记录列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              // { type: 'selection' },
              { prop: 'created_at', label: '开台时间', width: 180 },
              { label: '台号', formatter: row => {
                if (!row.desk) {
                  return (<div>-</div>)
                }
                return (<div>{row.desk.name}</div>)
              } },
              { label: '订台人', width: 180, render: (h, { row }) => {
                if (!row.marketing_staff) {
                  return (<div>-</div>)
                }

                return (<div>
                  <user-cell user={row.marketing_staff}
                  />
                </div>)
              } },

              { label: '服务员', width: 180, render: (h, { row }) => {
                if (!row.serve_staff) {
                  return (<div>-</div>)
                }

                return (<div>
                  <user-cell user={row.serve_staff}
                  />
                </div>)
              } },
              { label: '分区', formatter: row => {
                if (!row.zone) {
                  return (<div>-</div>)
                }
                return (<div>{row.zone.name}</div>)
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
      if (parseInt(val) <= 0) {
        return this.button.placeholder
      }
      const res = await apiDeskOpen.getById(val)
      return '已选：' + (res.data.desk ? res.data.desk.name + (res.data.marketing_staff ? '/' + res.data.marketing_staff.name : '') + (res.data.created_at ? '/' + res.data.created_at : '') : '加载中')
    }
  }
}
</script>
