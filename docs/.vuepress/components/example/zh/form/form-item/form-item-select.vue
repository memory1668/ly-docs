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
                  type: 'select', label: '基础用法', prop: 'select-basic', defaultValue: 1,
                  options: [
                    { attrs: { label: '在职', value: 1 } },
                    { attrs: { label: '离职', value: 2 } }
                  ]
                },
                {
                  type: 'select', label: '有禁用选项', prop: 'select-disabled-option', defaultValue: 1,
                  options: [
                    { attrs: { label: '在职', value: 1 } },
                    { attrs: { label: '离职', value: 2 } },
                    { attrs: { label: '禁用选项', value: 3, disabled: true } }
                  ]
                },
                {
                  type: 'select', label: '禁用状态', prop: 'select-disabled', defaultValue: 1,
                  attrs: { disabled: true },
                  options: [
                    { attrs: { label: '在职', value: 1 } },
                    { attrs: { label: '离职', value: 2 } }
                  ]
                },
                {
                  type: 'select', label: '可清空单选', prop: 'select-clearable', defaultValue: 1,
                  attrs: { clearable: true },
                  options: [
                    { attrs: { label: '在职', value: 1 } },
                    { attrs: { label: '离职', value: 2 } }
                  ]
                },
                {
                  type: 'select', label: '多选', prop: 'select-multiple', defaultValue: [1, 2],
                  attrs: { multiple: true },
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } },
                    { attrs: { label: '上海', value: 3 } }
                  ]
                },
                {
                  type: 'select', label: '多选折叠选中值', prop: 'select-multiple-collapse-tags', defaultValue: [1, 2],
                  attrs: { multiple: true, collapseTags: true },
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } },
                    { attrs: { label: '上海', value: 3 } }
                  ]
                },
                {
                  type: 'select', label: '分组', prop: 'select-group', defaultValue: 1,
                  optionGroups: [{
                    attrs: { label: '热门城市' },
                    options: [{
                      attrs: {
                        value: 1,
                        label: '上海'
                      }
                    }, {
                      attrs: {
                        value: 2,
                        label: '北京'
                      }
                    }]
                  }, {
                    attrs: { label: '城市名' },
                    options: [{
                      attrs: {
                        value: 3,
                        label: '成都'
                      }
                    }, {
                      attrs: {
                        value: 4,
                        label: '深圳'
                      }
                    }, {
                      attrs: {
                        value: 5,
                        label: '广州'
                      }
                    }, {
                      attrs: {
                        value: 6,
                        label: '大连'
                      }
                    }]
                  }],
                },
                {
                  type: 'select', label: '可搜索', prop: 'select-filterable', defaultValue: 1,
                  attrs: { filterable: true },
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } },
                    { attrs: { label: '上海', value: 3 } }
                  ]
                },
                {
                  type: 'select', label: '创建条目', prop: 'select-allow-create', defaultValue: [],
                  attrs: {
                    filterable: true, // filterable必须为true
                    multiple: true,
                    allowCreate: true
                  },
                  options: [
                    { attrs: { label: '广州', value: 1 } },
                    { attrs: { label: '深圳', value: 2 } },
                    { attrs: { label: '上海', value: 3 } }
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
