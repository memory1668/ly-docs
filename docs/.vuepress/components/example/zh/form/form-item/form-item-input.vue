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
                  type: 'input', label: '基础输入框', prop: 'input-disabled', defaultValue: '',
                  attrs: { placeholder: '请输入内容' }
                },
                {
                  type: 'input', label: '禁用状态', prop: 'input-disabled', defaultValue: '',
                  attrs: { placeholder: '请输入内容', disabled: true }
                },
                {
                  type: 'input', label: '可清空', prop: 'input-clearable', defaultValue: '',
                  attrs: { placeholder: '请输入内容', clearable: true }
                },
                {
                  type: 'input', label: '密码框', prop: 'input-password', defaultValue: '',
                  attrs: { placeholder: '请输入密码', showPassword: true }
                },
                {
                  type: 'input', label: '带icon', prop: 'input-icon', defaultValue: '',
                  attrs: { placeholder: '请输入内容', prefixIcon: 'el-icon-search', suffixIcon: 'el-icon-date' }
                },
                {
                  type: 'input', label: '文本域', prop: 'input-textarea', defaultValue: '',
                  attrs: {
                    placeholder: '请输入内容',
                    type: 'textarea',
                    rows: 3 // 指定文本域高度
                  }
                },
                {
                  type: 'input', label: '文本域自适应高度', prop: 'input-textarea-auto-size', defaultValue: '',
                  attrs: {
                    placeholder: '请输入内容',
                    type: 'textarea',
                    autosize: true
                  }
                },
                {
                  type: 'input', label: '文本域自适应高度范围', prop: 'input-textarea-auto-size-range', defaultValue: '',
                  attrs: {
                    placeholder: '请输入内容',
                    type: 'textarea',
                    autosize: {minRows: 2, maxRows: 4} // 通过对象指定最小行数和最大行数
                  }
                },
                {
                  type: 'input', label: '前置元素', prop: 'input-prepend', defaultValue: '',
                  attrs: { placeholder: '请输入内容' },
                  slots: {
                    prepend: 'https'
                  }
                },
                {
                  type: 'input', label: '后置元素', prop: 'input-append', defaultValue: '',
                  attrs: { placeholder: '请输入价格' },
                  slots: {
                    append: '元'
                  }
                },
                {
                  type: 'input', label: '尺寸', prop: 'input-size', defaultValue: '',
                  attrs: {
                    placeholder: '请输入内容',
                    size: 'small' // 可选值：large, medium, small, mini
                  }
                },
                {
                  type: 'input', label: '输入长度限制', prop: 'input-length', defaultValue: '',
                  attrs: {
                    placeholder: '请输入内容',
                    // minLength: 10,
                    maxlength: 10,
                    showWordLimit: true // 展示字数统计
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
