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
        placeholder: '选择会员卡', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个会员卡'
          } else {
            return '已选：' + val.name + '/' + val.phone
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
            return '已选择 ' + val.length + ' 个会员'
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
          title: '选择会员卡',
          width: '800px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: `/member-cards`,
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
                    { type: 'input', prop: 'name__like', label: '会员名称', attrs: { placeholder: '请输入会员手机', clearable: true }},
                    { type: 'input', prop: 'phone__like', label: '会员手机', attrs: { placeholder: '请输入会员手机', clearable: true }}
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
            title: '会员卡列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              { prop: 'name', label: '会员姓名', minWidth: 100 },
              { prop: 'phone', label: '手机号/卡号', width: 120 },
              { label: '关联微信', minWidth: 180, render: (h, { row }) => {
                if (!row.user) {
                  return (<div>-</div>)
                }

                return (<user-cell user={row.user}/>)
              } },
              { prop: 'total_amount_remain', label: '总余额', width: 180 },
              { prop: 'amount_remain', label: '充值余额', width: 180 },
              { prop: 'amount_boon_remain', label: '赠送余额', width: 180 },
              { prop: 'total_amount_consume', label: '总消费额', width: 180 },
              { prop: 'amount_consume', label: '充值消费', width: 180 },
              { prop: 'amount_boon_consume', label: '赠送消费', width: 180 },
              { label: '会员卡类型', width: 140, formatter: (row) => {
                if (!row.member_card_template) {
                  return (<div>-</div>)
                }

                switch (row.member_card_template.style_type) {
                  case 1:
                    return (<div class='card-item bg-silver'>{row.member_card_template.name}</div>)
                  case 2:
                    return (<div class='card-item bg-gold'>{row.member_card_template.name}</div>)
                  case 3:
                    return (<div class='card-item bg-black'>{row.member_card_template.name}</div>)
                  case 4:
                    return (<div><el-image style='width: 120px;border-radius: 5px;' src={row.bg} fit='fill'></el-image></div>)
                }
              } },
              { prop: 'wechat', label: '微信号', width: 120 },
              { prop: 'birthday', label: '生日', width: 120 },
              { prop: 'card_name', label: '身份证姓名', width: 180 },
              { prop: 'card_number', label: '身份证号', width: 180 },
              { label: '状态', minWidth: 80, render: (h, { row }) => {
                switch (row.status) {
                  case true:
                    return (<el-tag type='primary'>正常</el-tag>)
                  case false:
                    return (<el-tag type='info'>停用</el-tag>)
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
        return '选择会员卡'
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
