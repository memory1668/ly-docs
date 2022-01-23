<template>
  <div>
    <panel-form
      :options="panelFormOptions"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      panelFormOptions: {
        form: {
          title: '存酒',
          attrs: { labelPosition: 'left', labelWidth: '120px' },
          rows: [
            {
              col: { span: 24 },
              items: [
                {
                  type: 'radio-group',
                  label: '存酒有效期',
                  prop: 'expire_time',
                  defaultValue: 1,
                  mode: 'radio-button',
                  options: [
                    { attrs: { label: '7天', value: 1, border: true } },
                    { attrs: { label: '15天', value: 2, border: true } },
                    { attrs: { label: '30天', value: 3, border: true } },
                    { attrs: { label: '自定义', value: -1, border: true } }
                  ],
                  rules: [
                    { required: true, message: '请选择存酒有效期', trigger: 'change' },
                  ]
                },
                {
                  type: 'input', label: '自定义有效期', prop: 'custom_expire_time', defaultValue: '',
                  attrs: { placeholder: '请输入自定义有效期' },
                  rules: [
                    { required: true, message: '请输入自定义有效期', trigger: 'blur' },
                  ],
                  // 表示当前表单项依赖的表单项的值等于配置中 value 的值，当前表单项才会显示
                  depends: [{ prop: 'expire_time', value: -1 }]
                }
              ]
            }
          ]
        },
        buttons: {
          align: 'right'
        }
      }
    }
  }
}
</script>
