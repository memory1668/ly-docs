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
        }
      }
    }
  }
}
</script>
