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
                  type: 'remote-select', label: '远程搜索', prop: 'remote-select', defaultValue: '',
                  attrs: {
                    placeholder: '请选择',
                    clearable: true,
                    multiple: false,
                    option: {
                      dataField: 'list',
                      labelField: 'name',
                      valueField: 'id'
                    },
                    request: { url: '/cities', method: 'GET', headers: {}, params: { pagesize: 10000 }}
                  }
                },
                {
                  type: 'remote-select', label: '分组', prop: 'remote-select-group', defaultValue: '',
                  attrs: {
                    placeholder: '请选择',
                    clearable: true,
                    multiple: false,
                    group: {
                      dataField: 'list',
                      labelField: 'name',
                      valueField: 'id'
                    },
                    option: {
                      dataField: 'children', // 子选项列表字段
                      labelField: 'name',
                      valueField: 'id'
                    },
                    request: { url: '/cities', method: 'GET', headers: {}, params: { pagesize: 10000 }}
                  }
                },
                {
                  type: 'remote-select', label: '过滤选项', prop: 'remote-select-filter-option', defaultValue: '',
                  attrs: {
                    placeholder: '请选择',
                    clearable: true,
                    multiple: false,
                    option: { dataField: 'list', labelField: 'name', valueField: 'id' },
                    request: { url: '/cities', method: 'GET', headers: {}, params: { pagesize: 10000 }},
                    optionsFilter: options=>{
                      if (!options) {
                        return []
                      }
                      return options.filter(option=>option.name !== '广州')
                    }
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
