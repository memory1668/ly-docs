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
          attrs: { labelPosition: 'left', labelWidth: '110px'},
          rows: [
            {
              col: { span: 24 },
              items: [
                {
                  type: 'input-number', label: '基础用法', prop: 'input-number', defaultValue: 0,
                  attrs: { placeholder: '请输入内容'}
                },
                {
                  type: 'input-number', label: '输入范围', prop: 'input-number-min-max', defaultValue: 0,
                  attrs: {
                    placeholder: '请输入内容',
                    min: 0,
                    max: 10
                  }
                },
                {
                  type: 'input-number', label: '禁用状态', prop: 'input-number-disabled', defaultValue: 0,
                  attrs: {
                    placeholder: '请输入内容',
                    disabled: true
                  }
                },
                {
                  type: 'input-number', label: '步长', prop: 'input-number-step', defaultValue: 0,
                  attrs: {
                    placeholder: '请输入内容',
                    step: 2
                  }
                },
                {
                  type: 'input-number', label: '严格步数', prop: 'input-number-step-strictly', defaultValue: 0,
                  // step-strictly设置为true，则只能输入步数的倍数。
                  attrs: {
                    placeholder: '请输入内容',
                    stepStrictly: true,
                    step: 2
                  }
                },
                {
                  type: 'input-number', label: '精度', prop: 'input-number-precision', defaultValue: 0,
                  // precision 的值必须是一个非负整数，并且不能小于 step 的小数位数。
                  attrs: {
                    placeholder: '请输入内容',
                    precision: 1,
                    step: 0.1
                  }
                },
                {
                  type: 'input-number', label: '尺寸', prop: 'input-number-size', defaultValue: '',
                  attrs: {
                    placeholder: '请输入内容',
                    size: 'small' // 可选值 medium, small, mini
                  }
                },
                {
                  type: 'input-number', label: '按钮位置', prop: 'input-number-controls-position', defaultValue: 0,
                  attrs: {
                    placeholder: '请输入内容',
                    controlsPosition: 'right'
                  }
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
