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
              col: {span: 24},
              items: [
                {
                  type: 'input', label: '员工姓名', prop: 'name', defaultValue: '',
                  attrs: { placeholder: '请输入员工姓名' },
                  rules: [{ required: true, message: '员工姓名不能为空', trigger: 'blur' }]
                },
                {
                  type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
                  attrs: { placeholder: '请输入手机号' },
                  rules: [
                    { required: true, message: '手机号不能为空', trigger: 'blur' },
                    { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
                  ]
                },
                {
                  type: 'input', label: '邮箱', prop: 'email', defaultValue: '',
                  attrs: { placeholder: '请输入邮箱' },
                  rules: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }
                  ]
                },
                {
                  type: 'input', label: '简介', prop: 'intro', defaultValue: '',
                  attrs: { placeholder: '请输入简介' },
                  rules: [
                    { required: true, message: '请输入简介', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                  ]
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
