自动表单
---

````
<panel-form
  :options="panelFormOptions"
/>
````

备注：更详细表单 json 配置，参考：EasyForm README.md

#  一、 单表单配置

````
/**
 * 表单配置
 */
panelFormOptions: {
  /**
   * 表单配置
   */
  form: {
    title: '新建账号',
    attrs: { labelPosition: 'left', labelWidth: '90px' },
    rows: [
      {
        col: { span: 24 },
        items: [
          {
            type: 'input', label: '账号', prop: 'account', defaultValue: '',
            attrs: {
              placeholder: '请输入账号'
            },
            rules: [
              { required: true, message: '账号不能为空', trigger: 'blur' }
            ]
          },
          {
            type: 'input', label: '密码', prop: 'password', defaultValue: '',
            attrs: {
              placeholder: '请输入密码',
              showPassword: true
            },
            rules: [
              { required: true, message: '密码不能为空', trigger: 'blur' }
            ]
          },
          {
            type: 'radio-group', label: '角色', prop: 'role', defaultValue: 0,

            // group 配置
            attrs: {},
            rules: [
              { required: true, message: '请选择角色', trigger: 'change' }
            ],

            // 元素配置
            mode: 'radio', // radio || radio-button
            options: [
              { attrs: { label: '管理员', value: 0, border: true }},
              { attrs: { label: '运营人员', value: 1, border: true }},
              { attrs: { label: '供应商', value: 2, border: true }}
            ]
          },
          {
            type: 'input', label: '姓名', prop: 'username', defaultValue: '',
            attrs: {
              placeholder: '请输入姓名'
            },
            rules: [
              { required: true, message: '姓名不能为空', trigger: 'blur' }
            ]
          },
          {
            type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
            attrs: {
              placeholder: '请输入手机号'
            }
          },
          {
            type: 'input', label: '邮箱', prop: 'email', defaultValue: '',
            attrs: {
              placeholder: '请输入邮箱'
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
    align: 'left',

    submit: {
      show: true,
      text: '提交',
      scene: {
        fomatter: (data) => { return data },
        request: {
          url: '/accounts',
          method: 'PUT'
        }
      }
    },
    cancel: {
      show: true,
      text: '取消',
      clickMethod: (data) => {
        console.log('cancel: ', data)
      }
    }
  }
}
````

#  二、多表单配置

````

panelFormOptions: {
  /**
   * 表单配置
   */
  // form: {
  //
  // },
  forms: [
    {
      title: '新建账号',
      attrs: { labelPosition: 'left', labelWidth: '90px' },
      rows: [
        {
          col: { span: 24 },
          items: [
            {
              type: 'input', label: '账号', prop: 'account', defaultValue: '',
              attrs: {
                placeholder: '请输入账号'
              },
              rules: [
                { required: true, message: '账号不能为空', trigger: 'blur' }
              ]
            },
            {
              type: 'input', label: '密码', prop: 'password', defaultValue: '',
              attrs: {
                placeholder: '请输入密码',
                showPassword: true
              },
              rules: [
                { required: true, message: '密码不能为空', trigger: 'blur' }
              ]
            },
            {
              type: 'radio-group', label: '角色', prop: 'role', defaultValue: 0,

              // group 配置
              attrs: {},
              rules: [
                { required: true, message: '请选择角色', trigger: 'change' }
              ],

              // 元素配置
              mode: 'radio', // radio || radio-button
              options: [
                { attrs: { label: '管理员', value: 0, border: true }},
                { attrs: { label: '运营人员', value: 1, border: true }},
                { attrs: { label: '供应商', value: 2, border: true }}
              ]
            },
            {
              type: 'input', label: '姓名', prop: 'username', defaultValue: '',
              attrs: {
                placeholder: '请输入姓名'
              },
              rules: [
                { required: true, message: '姓名不能为空', trigger: 'blur' }
              ]
            },
            {
              type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
              attrs: {
                placeholder: '请输入手机号'
              }
            },
            {
              type: 'input', label: '邮箱', prop: 'email', defaultValue: '',
              attrs: {
                placeholder: '请输入邮箱'
              }
            }
          ]
        }
      ]
    },

    {
      title: '新建账号2',
      attrs: { labelPosition: 'left', labelWidth: '90px' },
      rows: [
        {
          col: { span: 24 },
          items: [
            {
              type: 'input', label: '账号', prop: 'account1', defaultValue: '',
              attrs: {
                placeholder: '请输入账号'
              },
              rules: [
                { required: true, message: '账号不能为空', trigger: 'blur' }
              ]
            },
            {
              type: 'input', label: '密码', prop: 'password1', defaultValue: '',
              attrs: {
                placeholder: '请输入密码',
                showPassword: true
              },
              rules: [
                { required: true, message: '密码不能为空', trigger: 'blur' }
              ]
            },
            {
              type: 'radio-group', label: '角色', prop: 'role1', defaultValue: 0,

              // group 配置
              attrs: {},
              rules: [
                { required: true, message: '请选择角色', trigger: 'change' }
              ],

              // 元素配置
              mode: 'radio', // radio || radio-button
              options: [
                { attrs: { label: '管理员', value: 0, border: true }},
                { attrs: { label: '运营人员', value: 1, border: true }},
                { attrs: { label: '供应商', value: 2, border: true }}
              ]
            },
            {
              type: 'input', label: '姓名', prop: 'username1', defaultValue: '',
              attrs: {
                placeholder: '请输入姓名'
              },
              rules: [
                { required: true, message: '姓名不能为空', trigger: 'blur' }
              ]
            },
            {
              type: 'input', label: '手机号', prop: 'phone1', defaultValue: '',
              attrs: {
                placeholder: '请输入手机号'
              }
            },
            {
              type: 'input', label: '邮箱', prop: 'email1', defaultValue: '',
              attrs: {
                placeholder: '请输入邮箱'
              }
            }
          ]
        }
      ]
    }

  ],

  /**
   * 表单按钮
   */
  buttons: {
    align: 'left',

    submit: {
      show: true,
      text: '提交',
      scene: {
        fomatter: (data) => { return data },
        request: {
          url: '/accounts',
          method: 'PUT'
        }
      }
    },
    cancel: {
      show: true,
      text: '取消',
      clickMethod: (data) => {
        console.log('cancel: ', data)
      }
    }
  }
}
    

````