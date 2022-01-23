<template>
  <div>
    <el-button icon="el-icon-plus" @click="handleCreate">新建账号</el-button>
    <dialog-panel-form
      ref="dialogPanelForm"
      :options="dialogPanelFormOptions"
    />
  </div>
</template>

<script>
export default {
  name: 'ExampleDialogPanelForm',
  data() {
    return {
      // 修改标签
      dialogPanelFormOptions: {
        // 弹窗配置
        dialog: { title: '添加员工', width: '600px', destroyOnClose: true },
        // 表单配置
        forms: {
          attrs: { labelPosition: 'left'},
          rows: [
            {
              col: { span: 24 },
              items: [
                { type: 'input', label: '姓名', prop: 'name', defaultValue: '' },
                {
                  type: 'select', label: '在职状态', prop: 'status', defaultValue: 1,
                  options: [
                    { attrs: { label: '在职', value: 1 }},
                    { attrs: { label: '离职', value: 2 }}
                  ]
                },
                {
                  type: 'radio-group', label: '性别', prop: 'gender', defaultValue: 1,
                  options: [
                    {
                      attrs: {
                        label: '男',
                        value: 1
                      },
                    },
                    {
                      attrs: {
                        label: '女',
                        value: 2
                      }
                    }
                  ]
                },
                { type: 'checkbox-group', label: '城市', prop: 'city', defaultValue: [1],
                  options: [
                    {
                      attrs: {
                        label: '北京',
                        value: 1
                      }
                    },
                    {
                      attrs: {
                        label: '上海',
                        value: 2
                      }
                    }
                  ]
                },
                {
                  type: 'switch', label: '允许登录', prop: 'is_allow_login', defaultValue: true,
                  attrs: { activeText: '是', inactiveText: '否' }
                }
              ]
            }
          ]
        },
        // 表单按钮
        buttons: {
          align: 'right',

          // 提交按钮
          submit: {
            show: true, text: '确定', scene: {
              request: {
                url: ``,
                method: 'PUT',

                onSuccess: (res, data) => {
                  this.$message.success('添加成功')
                  this.$refs.dialogPanelForm.setDialogVisible(false)
                }
              }
            }
          },

          // 取消按钮
          cancel: {
            show: true, text: '取消', clickMethod: (data) => {
              this.$refs.dialogPanelForm.setDialogVisible(false)
            }
          }
        }
      }
    }
  },

  methods: {
    handleCreate() {
      this.$refs.dialogPanelForm.handleCreate()
    }
  }
}
</script>
