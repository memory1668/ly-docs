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
                  type: 'checkbox-group', label: '基础用法', prop: 'checkbox-base', defaultValue: [],
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } }
                  ]
                },
                {
                  type: 'checkbox-group', label: '禁用状态', prop: 'checkbox-disabled', defaultValue: [],
                  attrs: {disabled: true},
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } }
                  ]
                },
                {
                  type: 'checkbox-group', label: '禁用某些选项', prop: 'checkbox-disabled-some', defaultValue: [],
                  options: [
                    { attrs: { label: '广州', value: 1, disabled: true } },
                    { attrs: { label: '深圳', value: 2 } }
                  ]
                },
                {
                  type: 'checkbox-group', label: '带有边框', prop: 'checkbox-border', defaultValue: [],
                  options: [
                    { attrs: { label: '广州', value: 1, border: true } },
                    { attrs: { label: '深圳', value: 2, border: true } }
                  ]
                },
                {
                  type: 'checkbox-group', label: '按钮样式', prop: 'checkbox-button', defaultValue: [1],
                  mode: 'checkbox-button',
                  options: [
                    { attrs: { label: '广州', value: 1} },
                    { attrs: { label: '深圳', value: 2} }
                  ]
                },
                {
                  type: 'checkbox-group', label: '按钮颜色', prop: 'checkbox-color', defaultValue: [1],
                  mode: 'checkbox-button',
                  attrs: {textColor: 'rgba(255, 255, 255, .8)', fill: '#409EFF'},
                  options: [
                    { attrs: { label: '广州', value: 1} },
                    { attrs: { label: '深圳', value: 2} }
                  ]
                },
                {
                  type: 'checkbox-group', label: '限制可选数量', prop: 'checkbox-disabled', defaultValue: [1],
                  attrs: {min: 1, max: 2},
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } },
                    { attrs: { label: '北京', value: 3 } },
                    { attrs: { label: '上海', value: 4 } }
                  ]
                },
                {
                  type: 'checkbox-group', label: '不同尺寸', prop: 'checkbox-size', defaultValue: [1],
                  attrs: {size: 'small'}, // 可选值medium / small / mini
                  mode: 'checkbox-button',
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } }
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
