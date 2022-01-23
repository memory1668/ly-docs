<template>
  <panel-form
    :options="panelFormOptions"
  />
</template>

<script>
export default {
  data () {
    return {
      panelFormOptions: {
        form: {
          title: '添加员工',
          attrs: { labelPosition: 'left'},
          rows: [
            {
              col: { span: 24 },
              items: [
                { type: 'input', label: '姓名', prop: 'name', defaultValue: '',
                  attrs: { placeholder: '请输入姓名' }
                },
                {
                  type: 'switch', label: '允许登录', prop: 'is_allow_login', defaultValue: true,
                  attrs: { activeText: '是', inactiveText: '否' }
                }
              ]
            }
          ]
        },

        buttons: {
          align: 'right',
          submit: {
            show: true,
            text: '确认',
            round: true,
          },
          cancel: {
            show: true,
            text: '取消',
            round: true
          },
          // 自定义类型按钮
          custom: {
            show: true,
            text: '自定义按钮',
            type: 'danger',
            plain: true,
            icon: 'el-icon-document-copy',
          }
        }
      }
    }
  }
}
</script>
