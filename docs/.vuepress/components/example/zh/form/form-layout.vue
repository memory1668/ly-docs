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
            // 表单项默认平分一行
            {
              items: [
                {
                  type: 'input', label: '员工姓名', prop: 'name', defaultValue: '',
                  attrs: { placeholder: '请输入员工姓名' }
                },
                {
                  type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
                  attrs: { placeholder: '请输入手机号' }
                }
              ]
            },
            // 为表单项指定相同的列数
            {
              col: { span: 24 },
              items: [
                {
                  type: 'select', label: '在职状态', prop: 'status', defaultValue: 1,
                  options: [
                    { attrs: { label: '在职', value: 1 }},
                    { attrs: { label: '离职', value: 2 }}
                  ]
                },
                {
                  type: 'switch', label: '允许登录', prop: 'is_allow_login', defaultValue: true,
                  attrs: { activeText: '是', inactiveText: '否' }
                }
              ]
            },
            // 为表单项单独指定列数
            {
              items: [
                {
                  col: { span: 8 },
                  type: 'select', label: '性别', prop: 'gender', defaultValue: 0,
                  options: [
                    { attrs: { label: '保密', value: 0 }},
                    { attrs: { label: '男', value: 1 }},
                    { attrs: { label: '女', value: 2 }}
                  ]
                },
                {
                  col: { span: 16 },
                  type: 'input', label: '住址', prop: 'address', defaultValue: '',
                  attrs: { placeholder: '请输入住址'}
                }
              ]
            }
          ]
        },
        /**
         * 表单按钮
         */
        buttons: {
          align: 'right'
        }
      }
    }
  }
}
</script>
