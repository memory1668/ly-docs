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
        forms: [
          {
            title: '基础信息',
            attrs: { labelPosition: 'left', labelWidth: '100px' },
            rows: [
              {
                col: { span: 12 },
                items: [
                  {
                    type: 'input', label: '员工姓名', prop: 'name', defaultValue: '',
                    attrs: { placeholder: '请输入员工姓名' },
                    rules: [{ required: true, message: '员工姓名不能为空', trigger: 'blur' }]
                  },
                  {
                    type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
                    attrs: { placeholder: '请输入手机号' },
                    rules: [{ required: true, message: '手机号不能为空', trigger: 'blur' }]
                  },
                  {
                    type: 'select', label: '在职状态', prop: 'status', defaultValue: 1,
                    rules: [{ required: true, message: '请选择在职状态', trigger: 'change' }],
                    options: [
                      { attrs: { label: '在职', value: 1 }},
                      { attrs: { label: '离职', value: 2 }}
                    ]
                  },
                  {
                    type: 'switch', label: '允许登录', prop: 'is_allow_login', defaultValue: true,
                    attrs: { activeText: '是', inactiveText: '否' },
                    rules: [{ required: true, message: '是否允许登录', trigger: 'change' }]
                  },
                  {
                    type: 'input', label: '工号', prop: 'work_number', defaultValue: '',
                    attrs: { placeholder: '请输入工号' }
                  },
                  {
                    type: 'input', label: '邮箱', prop: 'email', defaultValue: '',
                    attrs: { placeholder: '请输入邮箱' }
                  },
                  {
                    type: 'select', label: '性别', prop: 'gender', defaultValue: 0,
                    options: [
                      { attrs: { label: '保密', value: 0 }},
                      { attrs: { label: '男', value: 1 }},
                      { attrs: { label: '女', value: 2 }}
                    ]
                  }
                ]
              },
              {
                col: { span: 24 },
                items: [
                  {
                    type: 'input', label: '住址', prop: 'live_location', defaultValue: '',
                    attrs: { placeholder: '请输入住址' }
                  }
                ]
              }
            ]
          },

          {
            title: '证件信息',
            attrs: { labelPosition: 'left', labelWidth: '100px' },
            rows: [
              {
                col: { span: 12 },
                items: [
                  {
                    type: 'input', label: '社保账号', prop: 'social_security_account', defaultValue: '',
                    attrs: { placeholder: '请输入社保账号' }
                  },

                  {
                    type: 'input', label: '公积金账号', prop: 'accumulation_fund_account', defaultValue: '',
                    attrs: { placeholder: '请输入公积金账号' }
                  },

                  {
                    type: 'input', label: '银行卡号', prop: 'bank_number', defaultValue: '',
                    attrs: { placeholder: '请输入银行卡号' }
                  },
                  {
                    type: 'input', label: '开户行', prop: 'bank_name', defaultValue: '',
                    attrs: { placeholder: '请输入开户行' }
                  },

                  {
                    type: 'input', label: '身份证姓名', prop: 'card_name', defaultValue: '',
                    attrs: { placeholder: '请输入身份证姓名' }
                  },
                  {
                    type: 'input', label: '身份证号码', prop: 'card_number', defaultValue: '',
                    attrs: { placeholder: '请输入身份证号码' }
                  },
                  {
                    type: 'input', label: '身份证地址', prop: 'card_location', defaultValue: '',
                    attrs: { placeholder: '请输入身份证地址' }
                  },
                  {
                    type: 'switch', label: '证件有效期', prop: 'is_card_forever', defaultValue: false,
                    attrs: { activeText: '永久', inactiveText: '非永久' }
                    // rules: [{ required: true, message: '是否身份证永久有效', trigger: 'change' }]
                  },
                  {
                    type: 'date-picker', label: '身份证有效期', prop: 'card_expire', defaultValue: null,
                    attrs: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' },
                    depends: [{ prop: 'is_card_forever', value: false }]
                  }
                ]
              },
              {
                col: { span: 12 },
                items: [
                  {
                    type: 'upload-image', label: '身份证正面', prop: 'card_pic_1', defaultValue: '',
                    attrs: { placeholder: '上传身份证正面', width: 640, height: 480, noCircle: true }
                  },
                  {
                    type: 'upload-image', label: '身份证反面', prop: 'card_pic_2', defaultValue: '',
                    attrs: { placeholder: '上传身份证反面', width: 640, height: 480, noCircle: true }
                  }
                ]
              }
            ]
          },
          {
            title: '入职信息',
            attrs: { labelPosition: 'left', labelWidth: '100px' },
            rows: [
              {
                col: { span: 12 },
                items: [
                  {
                    labelWidth: '90px',
                    type: 'date-picker', label: '入职日期', prop: 'entry_date', defaultValue: null,
                    attrs: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd'}
                  },
                  {
                    type: 'select', label: '员工类型', prop: 'type', defaultValue: 0,
                    options: [
                      { attrs: { label: '默认', value: 0 }},
                      { attrs: { label: '全职', value: 1 }},
                      { attrs: { label: '实习', value: 2 }},
                      { attrs: { label: '兼职', value: 3 }},
                      { attrs: { label: '劳务外包', value: 4 }}
                    ]
                  },
                  {
                    type: 'select', label: '试用期', prop: 'probation_period', defaultValue: 0,
                    options: [
                      { attrs: { label: '无试用期', value: 0 }},
                      { attrs: { label: '1个月', value: 1 }},
                      { attrs: { label: '2个月', value: 2 }},
                      { attrs: { label: '3个月', value: 3 }},
                      { attrs: { label: '4个月', value: 4 }},
                      { attrs: { label: '5个月', value: 5 }},
                      { attrs: { label: '6个月', value: 6 }},
                      { attrs: { label: '其他', value: 7 }}
                    ]
                  },
                  {
                    type: 'date-picker', label: '转正日期', prop: 'positive_date', defaultValue: null,
                    attrs: { type: 'date', placeholder: '选择日期', valueFormat: 'yyyy-MM-dd' }
                  },
                  {
                    type: 'select', label: '户籍类型', prop: 'household_type', defaultValue: 0,
                    options: [
                      { attrs: { label: '未知', value: 0 }},
                      { attrs: { label: '本地城镇', value: 1 }},
                      { attrs: { label: '本地农村', value: 2 }},
                      { attrs: { label: '外地城镇', value: 3 }},
                      { attrs: { label: '外地农村', value: 4 }}
                    ]
                  },
                  {
                    type: 'select', label: '政治面貌', prop: 'political_status', defaultValue: 0,
                    options: [
                      { attrs: { label: '未知', value: 0 }},
                      { attrs: { label: '群众', value: 1 }},
                      { attrs: { label: '团员', value: 2 }},
                      { attrs: { label: '党员', value: 3 }},
                      { attrs: { label: '其他', value: 4 }}
                    ]
                  },
                  {
                    type: 'input', label: '民族', prop: 'nation_type', defaultValue: '',
                    attrs: { placeholder: '请输入名族，如：汉族' }
                  },
                  {
                    type: 'select', label: '婚姻状况', prop: 'marital_status', defaultValue: 0,
                    options: [
                      { attrs: { label: '保密', value: 0 }},
                      { attrs: { label: '未婚', value: 1 }},
                      { attrs: { label: '已婚', value: 2 }},
                      { attrs: { label: '离异', value: 3 }},
                      { attrs: { label: '丧偶', value: 4 }}
                    ]
                  },
                  {
                    type: 'upload-image', label: '前离职证明', prop: 'release_cert', defaultValue: '',
                    attrs: { placeholder: '上传前离职证明', width: 640, height: 480, noCircle: true }
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
          align: 'right',
          submit: {
            show: true,
            text: '提交',
            scene: {
              formatter: (data) => {
                return data
              },
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
    }
  }
}
</script>
