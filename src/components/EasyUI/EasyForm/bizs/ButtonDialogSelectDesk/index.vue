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
import apiDesk from '@/api/desk'
export default {
  name: 'ButtonDialogSelectDesk',
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
        placeholder: '选择台号', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个/台号'
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
            return '已选择 ' + val.length + ' 个台号'
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
          title: '选择台号',
          width: '1000px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: '/desks'
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
                  col: { span: 8 },
                  items: [
                    { type: 'input', prop: 'name__like', label: '台号名称', attrs: { placeholder: '请输入台号名称', clearable: true }},
                    {
                      type: 'remote-select', label: '台号分区', prop: 'zone_id', defaultValue: '',
                      attrs: {
                        placeholder: '请选择台号分区',
                        clearable: true,
                        multiple: false,

                        // 如果去掉 group 配置，则是非分组的选择
                        option: { dataField: 'list', labelField: 'name', valueField: 'id' },
                        request: { url: '/zones', method: 'GET', headers: {}, params: {}}
                      }
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
            title: '台号列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            headerAlign: 'left',
            align: 'left',
            columns: [
              // { type: 'selection' },
              { prop: 'name', label: '台号名称', minWidth: 180 },
              { prop: 'min_consume_amount', label: '最低消费', width: 180, formatter: row => {
                return '￥' + parseFloat(row.min_consume_amount)
              } },
              // {
              //   label: '开台必买', minWidth: 200, align: 'left', render: (h, { row }) => {
              //     if (!row.buy_products || row.buy_products.length === 0) {
              //       return (<div class='text-center'>-</div>)
              //     }
              //     return (<div>
              //       <div class='item-categories'>
              //         {
              //           row.buy_products.map((v) => {
              //             if (!v.product || !v.sku) {
              //               return (<span class='color-red fz-13'>已删除</span>)
              //             }
              //             return (
              //               <div class='flex fz-13'>
              //                 <div>{v.product.name}</div>
              //                 <div class='ml-10'>{
              //                   v.sku.props.map(pitem => {
              //                     return (pitem.name + ':' + pitem.value)
              //                   })
              //                 }</div>
              //                 <div class='ml-10'> x {v.num}</div>
              //               </div>
              //             )
              //           })
              //         }
              //       </div>
              //     </div>)
              //   }
              // },
              // {
              //   label: '开台赠送', minWidth: 200, align: 'left', render: (h, { row }) => {
              //     if (!row.present_products || row.present_products.length === 0) {
              //       return (<div class='text-center'>-</div>)
              //     }
              //     return (<div>
              //       <div class='item-categories'>
              //         {
              //           row.present_products.map((v) => {
              //             if (!v.product || !v.sku) {
              //               return (<span class='color-red fz-13'>已删除</span>)
              //             }
              //
              //             return (
              //               <div class='flex fz-13'>
              //                 <div>{v.product.name}</div>
              //                 <div class='ml-10'>{
              //                   v.sku.props.map(pitem => {
              //                     return (pitem.name + ':' + pitem.value)
              //                   })
              //                 }</div>
              //                 <div class='ml-10'> x {v.num}</div>
              //               </div>
              //             )
              //           })
              //         }
              //       </div>
              //     </div>)
              //   }
              // },
              { label: '状态', minWidth: 80, render: (h, { row }) => {
                switch (row.status) {
                  case true:
                    return (<el-tag type='primary'>已启用</el-tag>)
                  case false:
                    return (<el-tag type='info'>已停用</el-tag>)
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
      if (parseInt(val) <= 0) {
        return this.button.placeholder
      }
      const res = await apiDesk.getById(val)
      return '已选：' + res.data.name
    }
  }
}
</script>
