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
          attrs: { labelPosition: 'left', labelWidth: '110px' },
          rows: [
            {
              col: { span: 24 },
              items: [
                {
                  type: 'radio-group', label: '基础用法', prop: 'radio-base', defaultValue: 1,
                  options: [
                    { attrs: { label: '男', value: 1 } },
                    { attrs: { label: '女', value: 2 } }
                  ]
                },
                {
                  type: 'radio-group', label: '禁用状态', prop: 'radio-disabled', defaultValue: 1,
                  attrs: {disabled: true},
                  options: [
                    { attrs: { label: '男', value: 1} },
                    { attrs: { label: '女', value: 2} }
                  ]
                },
                {
                  type: 'radio-group', label: '禁用某些选项', prop: 'radio-disabled-some', defaultValue: 1,
                  options: [
                    { attrs: { label: '男', value: 1, disabled: true} },
                    { attrs: { label: '女', value: 2} }
                  ]
                },
                {
                  type: 'radio-group', label: '带有边框', prop: 'radio-border', defaultValue: 1,
                  options: [
                    { attrs: { label: '男', value: 1, border: true } },
                    { attrs: { label: '女', value: 2, border: true } }
                  ]
                },
                {
                  type: 'radio-group', label: '按钮样式', prop: 'radio-button', defaultValue: 1,
                  mode: 'radio-button',
                  options: [
                    { attrs: { label: '男', value: 1} },
                    { attrs: { label: '女', value: 2} }
                  ]
                },
                {
                  type: 'radio-group', label: '按钮颜色', prop: 'radio-color', defaultValue: 1,
                  mode: 'radio-button',
                  attrs: {textColor: 'rgba(255, 255, 255, .8)', fill: '#409EFF'},
                  options: [
                    { attrs: { label: '男', value: 1} },
                    { attrs: { label: '女', value: 2} }
                  ]
                },
                {
                  type: 'radio-group', label: '不同尺寸', prop: 'radio-size', defaultValue: 1,
                  attrs: {size: 'small'}, // 可选值medium / small / mini
                  mode: 'radio-button',
                  options: [
                    { attrs: { label: '男', value: 1 } },
                    { attrs: { label: '女', value: 2 } }
                  ]
                }
              ]
            }
          ]
        },
        buttons: {
          cancel: {
            show: false
          },
          submit: {
            show: false
          }
        }
      }
    }
  }
}
</script>
