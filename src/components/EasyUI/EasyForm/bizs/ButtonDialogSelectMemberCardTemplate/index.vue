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
import apiMemberCardTemplate from '@/api/member-card-template'
export default {
  name: 'ButtonDialogSelectMemberCardTemplate',
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
        placeholder: '点击选择会员卡类型', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个会员卡类型'
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
            return '已选择 ' + val.length + ' 个会员卡类型'
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
          title: '选择会员卡类型',
          width: '800px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: `/member-card-templates`,
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
                    { type: 'input', prop: 'name__like', label: '会员卡名称', attrs: { placeholder: '请输入会员卡名称', clearable: true }}
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
            title: '会员卡类型列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              // { type: 'selection', fixed: 'left' },
              { prop: 'name', label: '会员卡', width: 200 },
              { label: '卡片样式', width: 140, formatter: (row) => {
                switch (row.style_type) {
                  case 1:
                    return (<div class='card-item bg-silver'>银卡样式</div>)
                  case 2:
                    return (<div class='card-item bg-gold'>金卡样式</div>)
                  case 3:
                    return (<div class='card-item bg-black'>黑卡样式</div>)
                  case 4:
                    return (<div><el-image style='width: 120px;border-radius: 5px;' src={row.bg} fit='fill'></el-image></div>)
                }
              } },
              { label: '首充最低', width: 120, render: (h, { row }) => {
                switch (row.is_first_recharge_limit) {
                  case true:
                    return (<div>￥{row.first_recharge_limit}</div>)
                  case false:
                    return (<el-tag type='info'>无限制</el-tag>)
                }
              } },
              { label: '非首充最低', width: 120, render: (h, { row }) => {
                switch (row.is_non_first_recharge_limit) {
                  case true:
                    return (<div>￥{row.non_first_recharge_limit}</div>)
                  case false:
                    return (<el-tag type='info'>无限制</el-tag>)
                }
              } },

              { label: '开启充值权益', width: 120, render: (h, { row }) => {
                switch (row.is_recharge_boon_open) {
                  case true:
                    switch (row.recharge_boon_type) {
                      case 1:
                        return (<el-tag type='primary'>充值送百分比</el-tag>)
                      case 2:
                        return (<el-tag type='warning'>充值送固定额度</el-tag>)
                      default:
                        return (<div>-</div>)
                    }
                  case false:
                    return (<el-tag type='info'>否</el-tag>)
                }
              } },

              { label: '充值权益配置', width: 180, render: (h, { row }) => {
                if (!row.is_recharge_boon_open || !row.recharge_boon_config.config) {
                  return (<div>-</div>)
                }

                switch (row.recharge_boon_type) {
                  case 1:
                    return (<div>
                      {
                        row.recharge_boon_config.config.map(v => {
                          return (<div>充￥{parseFloat(v.condition)}送{v.meet}%</div>)
                        })
                      }
                    </div>)
                  case 2:
                    return (<div>
                      {
                        row.recharge_boon_config.config.map(v => {
                          return (<div>充￥{parseFloat(v.condition)}送￥{v.meet}</div>)
                        })
                      }
                    </div>)
                }
              } },

              { label: '开启消费权益', width: 120, render: (h, { row }) => {
                switch (row.is_consume_boon_open) {
                  case true:
                    switch (row.consume_boon_type) {
                      case 1:
                        return (<el-tag type='primary'>消费满折扣</el-tag>)
                      case 2:
                        return (<el-tag type='warning'>消费满减</el-tag>)
                      default:
                        return (<div>-</div>)
                    }
                  case false:
                    return (<el-tag type='info'>否</el-tag>)
                }
              } },
              { label: '消费权益配置', width: 180, render: (h, { row }) => {
                if (!row.is_consume_boon_open || !row.consume_boon_config.config) {
                  return (<div>-</div>)
                }

                switch (row.consume_boon_type) {
                  case 1:
                    return (<div>
                      {
                        row.consume_boon_config.config.map(v => {
                          return (<div>消费满￥{parseFloat(v.condition)}折扣{v.meet}%</div>)
                        })
                      }
                    </div>)
                  case 2:
                    return (<div>
                      {
                        row.consume_boon_config.config.map(v => {
                          return (<div>消费满￥{parseFloat(v.condition)}减￥{v.meet}</div>)
                        })
                      }
                    </div>)
                }
              } },
              { label: '允许挂账', width: 140, render: (h, { row }) => {
                switch (row.is_allow_hang_debt) {
                  case true:
                    return (<el-tag type='primary'>允许 ￥{parseFloat(row.hang_debt_amount)}</el-tag>)
                  case false:
                    return (<el-tag type='info'>不允许</el-tag>)
                  default:
                    return '未知'
                }
              } },
              { label: '开票收费', width: 140, render: (h, { row }) => {
                return (<div>{parseFloat(row.invoice_tax)}%</div>)
              } },
              { prop: 'num_open', label: '已开卡数量', width: 200 },
              { label: '开启状态', width: 80, render: (h, { row }) => {
                switch (row.status) {
                  case true:
                    return (<el-tag type='success'>开启</el-tag>)
                  case false:
                    return (<el-tag type='info'>停用</el-tag>)
                  default:
                    return '未知'
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
      const res = await apiMemberCardTemplate.getById(val)
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
