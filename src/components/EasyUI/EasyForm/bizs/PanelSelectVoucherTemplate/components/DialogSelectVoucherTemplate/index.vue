<template>
  <dialog-panel-list-select
    ref="dialogPanelListSelect"
    v-model="selectedItem"
    :options="dialogPanelListSelectOptions"
    @selection-change="handleSelectionChange"
  />
</template>

<script>
import DialogPanelListSelect from '@/components/EasyUI/DialogPanelListSelect'
import voucherTemplateType from '@/common/const/voucher/VoucherTemplateType'
import apiVoucherTemplates from '@/api/voucher/voucher-templates'

export default {
  name: 'DialogVoucherTemplate',
  components: { DialogPanelListSelect },
  props: {
    // v-model 配置
    value: {
      type: [Number, String, Object, Array],
      default() {
        return ''
      }
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
      // 选中的项
      selectedItem: null,
      dialogPanelListSelectOptions: {
        dialog: {
          title: '选择优惠券',
          width: '800px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: '/voucher-templates'
          },

          filterForm: {
            autoRefresh: true,
            /**
             * 表单配置
             */
            form: {
              title: '筛选条件',
              attrs: { labelPosition: 'left', labelWidth: '90px' },
              rows: [
                {
                  col: { span: 12 },
                  items: [
                    {
                      type: 'select', label: '优惠券类型', prop: 'type', defaultValue: '',
                      options: [
                        { attrs: { label: voucherTemplateType.map.get(voucherTemplateType.TYPE_GIVING_PRODUCT).mean, value: voucherTemplateType.TYPE_GIVING_PRODUCT }}
                      ]
                    },
                    {
                      type: 'select', label: '状态', prop: 'status', defaultValue: '',
                      options: [
                        { attrs: { label: '已启用', value: apiVoucherTemplates.STATUS_ENABLE }},
                        { attrs: { label: '已停用', value: apiVoucherTemplates.STATUS_DISABLE }}
                      ]
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

          // 3.1 中间按钮栏快捷配置
          operationButtons: [
            {
              label: '新建优惠券模板',
              icon: 'el-icon-plus',
              type: 'primary',
              clickMethod: this.handleCreate
              // vPermission: ['user-member-card-open']
            }
          ], // END - operationButtons

          // 4.1 表格列表
          lbTable: {
            title: '优惠券模板',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              { prop: 'name', label: '优惠券名称', minWidth: 100 },
              {
                label: '优惠券详情', minWidth: 180, render: (h, { row }) => {
                  if (!row.giving_products || row.giving_products.length === 0) {
                    return (<div>-</div>)
                  }
                  return (
                    <div>
                      {
                        row.giving_products.map(item => {
                          let propValue = '' // 规格
                          item.sku.props.forEach(prop => {
                            propValue += `${prop.value} `
                          })
                          return <div>{item.product.name} {propValue}x{item.num}</div>
                        })
                      }
                    </div>
                  )
                }
              },
              {
                label: '使用须知', minWidth: 180, align: 'left', headerAlign: 'left', render: (h, { row }) => {
                  return (
                    <div style='white-space: pre-wrap;text-align: left'>{row.note}</div>
                  )
                }
              },
              {
                label: '类型', minWidth: 180, render: (h, { row }) => {
                  return (
                    <div>{voucherTemplateType.map.get(row.type).mean}</div>
                  )
                }
              },
              {
                label: '有效期', minWidth: 230, render: (h, { row }) => {
                  let text = ''
                  if (row.begin_type === apiVoucherTemplates.BEGIN_TYPE_AUTO && row.end_type === apiVoucherTemplates.END_TYPE_AUTO) {
                    text = `自领券日起${row.valid_days}天内有效`
                  } else if (row.begin_type === apiVoucherTemplates.BEGIN_TYPE_AUTO && row.end_type === apiVoucherTemplates.END_TYPE_FIXED) {
                    text = `自领券日起至${row.end_at}有效`
                  } else if (row.begin_type === apiVoucherTemplates.BEGIN_TYPE_FIXED && row.end_type === apiVoucherTemplates.END_TYPE_AUTO) {
                    text = `${row.begin_at}起${row.valid_days}天内有效`
                  } else if (row.begin_type === apiVoucherTemplates.BEGIN_TYPE_FIXED && row.end_type === apiVoucherTemplates.END_TYPE_FIXED) {
                    text = `${row.begin_at}至${row.end_at}有效`
                  }
                  return (
                    <div>{text}</div>
                  )
                }
              },
              { prop: 'created_at', label: '时间', width: '180px' }
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
    /**
     * 选中值
     */
    selectedItem(val) {
      if (!val) return
      this.$emit('input', this.valueFormatter(val))
      this.$emit('change', val)
    }
  },
  created() {
    // 配置单选 / 多选
    this.dialogPanelListSelectOptions.panelListOptions.lbTable.selection.multiple = this.multiple
    if (this.multiple) {
      this.dialogPanelListSelectOptions.panelListOptions.lbTable.columns.unshift({ type: 'selection' })
    }
  },
  methods: {
    /**
     * 确认选择
     */
    onClickSubmit() {
      this.$refs.dialogPanelListSelect.onClickSubmit()
    },

    /**
     * 显示弹框
     */
    handleCreate() {
      this.$refs.dialogPanelListSelect.handleCreate()
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
        const selection = this.dialogPanelListSelectOptions.panelListOptions.lbTable.selection
        if (selection && !selection.multiple) {
          this.onClickSubmit()
        }
      }, 50)
    },

    // 选中的值格式化
    valueFormatter: (val) => {
      if (val instanceof Array) {
        let ids = ''
        val.forEach((item) => {
          ids = ids + item.id + ','
        })
        return ids.slice(0, ids.length - 1) // 删除最后一个逗号
      } else {
        return val.id
      }
    }
  }
}
</script>

<style scoped>

</style>
