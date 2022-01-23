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
import userWechatApi from '@/api/user-wechat'
export default {
  name: 'ButtonDialogSelectUserWechat',
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
        placeholder: '选择微信', // 按钮上的提示文字
        // 展示的标签格式化
        labelFormatter: (val) => {
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个/微信'
          } else {
            return '已选：' + val.nickname
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
            return '已选择 ' + val.length + ' 个微信'
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
          title: '选择微信',
          width: '1000px',
          modal: true
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: '/merchant-users/user-wechat/list'
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
                    { type: 'input', prop: 'nickname', label: '微信昵称', attrs: { placeholder: '请输入微信昵称', clearable: true }},
                    { type: 'input', prop: 'phone_number', label: '手机号', attrs: { placeholder: '请输入手机号', clearable: true }}
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
            title: '微信列表',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              // { type: 'selection' },
              { label: '用户头像', width: 100, formatter: (row) => {
                return (
                  <div><el-image style='width: 80px; height: 80px' src={row.avatar} fit='fill'></el-image></div>
                )
              } },
              { prop: 'nickname', label: '昵称' },
              { prop: 'phone_number', label: '手机号' },
              { prop: 'gender', label: '性别', formatter: row => {
                switch (row.gender) {
                  case 0:
                    return '未知'
                  case 1:
                    return '男'
                  case 2:
                    return '女'
                }
              } },
              { prop: 'province', label: '地区', width: 240, formatter: row => {
                const country = row.country ? row.country : '-'
                const province = row.province ? row.province : '-'
                const city = row.city ? row.city : '-'

                return `${country} / ${province} / ${city}`
              } },
              { prop: 'created_at', label: '创建时间', width: 180 }
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
      const res = await userWechatApi.getById(val)
      return '已选：' + res.data.nickname
    }
  }
}
</script>
