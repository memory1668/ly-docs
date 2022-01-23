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
          attrs: {
            labelPosition: 'left',
            labelWidth: '100px' // 为表单项设置相同的标签宽度
          },
          rows: [
            {
              items: [
                {
                  type: 'input', label: '员工姓名', prop: 'name', defaultValue: '',
                  labelWidth: '120px', // 单独设置表单项的标签宽度
                  attrs: { placeholder: '请输入员工姓名' }
                },
                {
                  type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
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
