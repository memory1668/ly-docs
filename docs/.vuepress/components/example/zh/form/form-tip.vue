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
          attrs: { labelPosition: 'left' },
          rows: [
            {
              col: {span: 24},
              items: [
                {
                  type: 'input', label: '员工姓名', prop: 'name', defaultValue: '',
                  attrs: { placeholder: '请输入员工姓名' }
                },
                {
                  type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
                  tip: '重要联系方式，请务必填写正确。',
                  attrs: { placeholder: '请输入手机号' }
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
