<template>
  <div>
    <button-dialog-panel-list-select
      ref="buttonDialogPanelListSelect"
      v-model="selectedItem"
      :is-custom-btn="true"
      :button="button"
      :dialog-panel-list-select-options="dialogPanelListSelectOptions"
    >
      <div slot="custom-btn">
        <div v-if="!simpleMode" class="info-item">
          <div class="flex">
            <div>
              <img v-if="itemRow" style="width: 40px; height: 40px;border-radius: 5px;" :src="itemRow.avatar" fit="fill">
              <img v-else style="width: 40px; height: 40px;border-radius: 5px;" src="@/assets/images/default-avatar.jpg" fit="fill">
            </div>
            <div class="ml-10" style="line-height: 1em;">
              <div class="bold">
                <span class="mr-10">{{ itemRow ? itemRow.name : '未选择' }}</span>
                <el-tag v-if="itemRow && itemRow.status === 1" size="mini" type="success">在职</el-tag>
                <el-tag v-if="itemRow && itemRow.status === 2" size="mini" type="primary">离职</el-tag>
              </div>
              <div class="mt-6" style="line-height: 1em;"><i class="el-icon-mobile-phone" /> {{ itemRow ? itemRow.phone : '-' }}</div>
            </div>

            <div class="ml-15"><el-button size="mini" icon="el-icon-user-solid" @click="showDialogPanelListSelect">{{ itemRow ? '修改' : '选择工作人员' }}</el-button></div>
          </div>
          <slot name="bottom" />
        </div>
        <div v-else>
          <div><el-button icon="el-icon-user-solid" :disabled="disabled" @click="showDialogPanelListSelect">{{ itemRow ? itemRow.name : '选择工作人员' }}</el-button></div>
        </div>
      </div>
    </button-dialog-panel-list-select>
  </div>
</template>

<script>
import ButtonDialogPanelListSelect from '@/components/EasyUI/ButtonDialogPanelListSelect'
import apiStaff from '@/api/staff'
export default {
  name: 'ButtonDialogSelectStaff',
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
     * 简单的显示方式
     */
    simpleMode: {
      type: Boolean,
      default: false
    },

    /**
    * 工作人员类型
    * 1：正常工作人员
    * 2：虚拟工作人员
    * 0: 所有类型的工作人员
    */
    type: {
      type: Number,
      default: 0
    },

    /**
     * 是否不可选择
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 选中项
      selectedItem: {},

      // 选中项的记录信息
      itemRow: null,

      // 按钮配置
      button: {
        // button初始显示的文字
        placeholder: '选择工作人员', // 按钮上的提示文字

        // 展示的标签格式化
        labelFormatter: (val) => {
          console.log('LabelFormatter: ', val)
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个工作人员'
          } else {
            return '已选：' + val.name
          }
        },

        // 选中的值格式化
        valueFormatter: (val) => {
          console.log('ValueFormatter: ', val)
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

        // 通过表单配置的值初始化标签
        labelFormatterByFormValue: async(val) => {
          // 1. 发送网络请求
          if (val instanceof Array) {
            return '已选择 ' + val.length + ' 个工作人员'
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
          title: '选择工作人员',
          width: '1000px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: '/staffs'
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
                    // {
                    //   type: 'remote-select', label: '部门', prop: 'department_id', defaultValue: '',
                    //   attrs: {
                    //     placeholder: '请选择部门',
                    //     clearable: true,
                    //     multiple: false,
                    //
                    //     // 如果去掉 group 配置，则是非分组的选择
                    //     option: { dataField: 'list', labelField: 'name', valueField: 'id' },
                    //     request: { url: '/departments', method: 'GET', headers: {}, params: {}}
                    //   }
                    // },

                    {
                      col: { span: 8 },
                      type: 'button-dialog-select-department', label: '所属部门', prop: 'department_id', defaultValue: '',
                      attrs: { placeholder: '请选择所属部门' }
                    },
                    { type: 'input', prop: 'name__like', label: '工作人员', attrs: { placeholder: '请输入工作人员姓名或缩写', clearable: true }}
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
            title: '工作人员',
            pagination: true, // 开启分页
            selection: { multiple: false },
            columns: [
              // { type: 'selection' },
              {
                label: '员工', width: 180, align: 'left', render: (h, { row }) => {
                  return (
                    <div>
                      <div class='flex'>
                        <div class='user-avatar'>
                          <el-image style='width: 40px; height: 40px;border-radius: 5px;' src={row.avatar} fit='fill'/>
                        </div>
                        <div class='ml-10'>
                          <div class='bold'>
                            <span class='mr-10'>{row.name}</span>
                            <el-tag size='mini' type='success' v-show={row.status === 1}>在职</el-tag>
                            <el-tag size='mini' type='primary' v-show={row.status === 2}>离职</el-tag>
                          </div>
                          <div><i class='el-icon-mobile-phone'></i> {row.phone}</div>
                        </div>
                      </div>
                    </div>
                  )
                }
              },

              {
                label: '所属部门', width: 120, align: 'center', render: (h, { row }) => {
                  return (<div><i class='el-icon-user'></i> {row.department ? row.department.name : '未配置'}</div>)
                }
              },

              {
                label: '默认服务台号', minWidth: 180, align: 'left', render: (h, { row }) => {
                  if (!row.desks || row.desks.length === 0) {
                    return (<div class='text-center fz-13'>未分配</div>)
                  }

                  return (
                    <div class='text-center'>
                      {
                        row.desks.map(item => {
                          return (<span class='mr-5 mb-5'><el-tag size='mini'>{item.name}</el-tag></span>)
                        })
                      }
                    </div>
                  )
                }
              },
              { label: '允许登录', minWidth: 80, render: (h, { row }) => {
                switch (row.is_allow_login) {
                  case true:
                    return (<el-tag type='primary'>是</el-tag>)
                  case false:
                    return (<el-tag type='info'>否</el-tag>)
                }
              } },
              { label: '角色权限', formatter: (row) => {
                if (!row.account_merchant) {
                  return '未分配'
                }

                switch (row.account_merchant.role) {
                  case 'admin':
                    return (<el-tag type='success'>管理员</el-tag>)
                  case 'staff':
                    return (<el-tag type='success'>员工</el-tag>)
                  default:
                    return '-'
                }
              } },
              { label: '微信名', width: 100, formatter: (row) => {
                if (!row.user_wechat) {
                  return '-'
                }
                return row.user_wechat.nickname
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
      if (!this.selectedItem) {
        this.itemRow = null
      }
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
      if (parseInt(val) === 0) {
        return '选择工作人员'
      }
      const res = await apiStaff.getById(val)
      this.itemRow = res.data
      return '已选：' + res.data.name
    },

    /**
     * 弹框修改
     */
    showDialogPanelListSelect() {
      this.$refs.buttonDialogPanelListSelect.showDialogPanelListSelect()
    }
  }
}
</script>

<style lang="scss" scoped>
  .info-item {
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    display: inline-block;
    padding: 10px 15px 10px;
    margin-right: -10px;
    background: white;
  }

  div {
    line-height: 1em;
  }
</style>
