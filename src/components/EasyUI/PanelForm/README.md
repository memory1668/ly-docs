PanelForm 自动表单
--

````
<!--页面表单-->
<panel-form
  :options="panelFormOptions"
/>
````

````
/**
 * 表单配置
 */
panelFormOptions: {

  multiple: false,

  /**
   * 表单配置
   */
  form: {
    title: '新建账号',
    attrs: { labelPosition: 'left', labelWidth: '90px' },
    rows: [
      {
        // col: { span: 6 },
        items: [
          {
            type: 'input',
            label: '姓名',
            prop: 'name',
            defaultValue: '',
            attrs: {
              placeholder: '请输入姓名'
            },
            rules: [
              { required: true, message: '姓名不能为空', trigger: 'blur' }
            ],
            events: {
              change: (val) => {
                console.log('change: ', val)
              }
            },
            slots: {
              append: '元'
            }
          },
          {
            type: 'radio-group',
            label: '性别',
            prop: 'gender',
            defaultValue: 1,

            // group 配置
            attrs: {},
            rules: [
              { required: true, message: '请选择性别', trigger: 'change' }
            ],
            events: {},

            // 元素配置
            mode: 'radio-button', // radio || radio-button
            options: [
              {
                attrs: {
                  label: '男',
                  value: 1,
                  border: true
                },
                events: {}
              },
              {
                attrs: {
                  label: '女',
                  value: 2,
                  border: true
                },
                events: {}
              }
            ]
          },
          {
            type: 'checkbox-group',
            label: '城市',
            prop: 'city',
            defaultValue: [1],

            // group 配置
            attrs: {},
            rules: [
              { required: true, message: '请选择城市', trigger: 'change' }
            ],
            events: {},

            // 元素配置
            mode: 'checkbox', // checkbox || checkbox-button
            options: [
              {
                attrs: {
                  label: '北京',
                  value: 1
                },
                events: {}
              },
              {
                attrs: {
                  label: '上海',
                  value: 2
                },
                events: {}
              }
            ]
          },
          {
            type: 'input-number',
            label: '分数',
            prop: 'score',
            defaultValue: 90,
            attrs: {
              style: 'width: 120px',
              controlsPosition: 'right'
            },
            rules: [
              { required: true, message: '请填写分数', trigger: 'change' }
            ],
            events: {
              change: (val) => {
                console.log(val)
              }
            }
          }
        ]
      },
      {
        col: { span: 6 },
        items: [
          {
            type: 'select',
            label: '分类',
            prop: 'category',
            defaultValue: [],
            attrs: {
              multiple: true,
              filterable: true
            },
            rules: [
              { required: true, message: '请选择分类', trigger: 'blur' }
            ],
            events: {
              change: (val) => {
                console.log(val)
              }
            },

            // 选项分组
            optionGroups: [
              {
                attrs: { label: '北京' },
                events: {},
                options: [
                  {
                    attrs: {
                      label: '海淀区',
                      value: 1
                    },
                    events: {}
                  },
                  {
                    attrs: {
                      label: '朝阳区',
                      value: 2
                    },
                    events: {}
                  }
                ]
              }
            ],

            // 选项列表
            options: [
              {
                attrs: {
                  label: '天河区',
                  value: 3
                },
                events: {}
              }
            ]
          },
          {
            type: 'cascader',
            label: '省市区',
            prop: 'region',
            defaultValue: [],
            attrs: {
              filterable: true,
              clearable: true,
              props: {
                multiple: true
              },
              options: [
                {
                  value: 'test',
                  label: 'TEST',
                  children: [
                    {
                      value: 'test1',
                      label: 'TEST2'
                    }
                  ]
                }
              ]
            },
            rules: [
              { required: true, message: '请选择分类', trigger: 'change' }
            ],
            events: {}
          },
          {
            type: 'switch',
            label: '开关',
            prop: 'switch',
            defaultValue: false,
            attrs: {
              activeText: '按月',
              inactiveText: '按日'
            },
            rules: [
              { required: true, message: '请选择开关', trigger: 'change' }
            ],
            events: {}
          },
          {
            type: 'slider',
            label: '滑块',
            prop: 'slider1',
            defaultValue: 10,
            attrs: {},
            rules: [
              { required: true, message: '请选择开关', trigger: 'change' }
            ],
            events: {}
          }
        ]
      },
      {
        col: { span: 6 },
        items: [
          {
            type: 'time-select',
            label: '时间1',
            prop: 'timeSelect',
            defaultValue: '09:30',
            attrs: {
              style: 'width: 150px'
            },
            rules: [
              { required: true, message: '请选择开关', trigger: 'change' }
            ],
            events: {},

            // 关联依赖, 表示当前元素依赖的元素(prop)的值等于配置中 value 的值，该元素才会显示
            depends: [
              {
                prop: 'name', // 依赖元素的 prop （属性名）
                value: 'xxx'
              },
              {
                prop: 'switch',
                value: true
              }
            ]
          },
          {
            type: 'time-picker',
            label: '时间2',
            prop: 'timePicker',
            defaultValue: '',
            attrs: {
              style: 'width: 150px',
              placeholder: '选择时间'
            },
            rules: [
              { required: true, message: '请选择开关', trigger: 'change' }
            ],
            events: {}
          },
          {
            type: 'date-picker',
            label: '时间3',
            prop: 'datePicker',
            defaultValue: '',
            attrs: {
              type: 'daterange',
              placeholder: '选择日期',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期'
            },
            rules: [
              { required: true, message: '请选择开关', trigger: 'change' }
            ],
            events: {}
          }
        ]
      },
      {
        col: { span: 6 },
        items: [
          {
            type: 'rate',
            label: '评分',
            prop: 'rate',
            defaultValue: 3,
            attrs: {
              style: 'margin-top: 8px;'
            },
            rules: [
              { required: true, message: '请选择选择', trigger: 'change' }
            ],
            events: {}
          },
          {
            type: 'color-picker',
            label: '颜色',
            prop: 'colorPicker',
            defaultValue: '#0099cc',
            attrs: {},
            rules: [
              { required: true, message: '请选择颜色', trigger: 'change' }
            ],
            events: {}
          }
        ]
      },
      {
        col: { span: 24 },
        items: [
          {
            type: 'transfer',
            label: '穿梭框',
            prop: 'transfer',
            defaultValue: [],
            attrs: {
              data: [{
                label: 'Test1',
                key: 0
              }]
            },
            rules: [
              { required: true, message: '请选择内容', trigger: 'change' }
            ],
            events: {}
          },
          {
            type: 'upload-avatar',
            label: '头像',
            prop: 'avatar',
            defaultValue: '',
            attrs: {},
            rules: [
              { required: true, message: '请上传头像', trigger: 'change' }
            ],
            events: {}
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
},
````