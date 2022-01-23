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
        }
      }
    }
  }
}
</script>
