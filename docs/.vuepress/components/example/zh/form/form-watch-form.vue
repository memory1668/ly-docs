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
                  type: 'input', label: '手机号', prop: 'phone_number', defaultValue: '',
                  attrs: { placeholder: '请输入手机号' },
                  rules: [{ required: true, message: '请输入手机号', trigger: 'blur' },],
                },
                {
                  type: 'radio-select-wine-save-role', label: '存酒人身份', prop: 'save_wine_role', defaultValue: 1,
                  rules: [{ required: true, message: '请选择存酒人身份', trigger: 'change' }],
                  watchForm: {
                    enable: true,
                    formatter: formData => formData
                  }
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
