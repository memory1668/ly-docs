PanelList
---

常用列表页

### 一、使用用例

````
<!--页面标签配置样例-->
<panel-list
  :options="panelListOptions"
  @multiple-selected="handleMultipleSelected"
/>
````

````
// PanelList 页面配置样例

panelListOptions: {
  // 1.1 列表页 http 请求配置
  request: {
    url: '/products',
    params: {key: value}, // 默认请求参数
  },
  
  // 2.1 过滤栏配置
  filterForm: {
    /**
       * 当值变更时，自动请求列表
       */
    autoRefresh: true,

    /**
       * 表单配置
       * 配置方式参考：EasyForm
       */
    form: {
      title: '筛选条件',
      attrs: { labelPosition: 'left', labelWidth: '90px' },
      rows: [
        {
          col: { span: 6 },
          items: [
            {
              type: 'input', prop: 'name', label: '课程名称',
              col: { span: 8 },
              attrs: { placeholder: '请输入课程名称', clearable: true }
            },
            {
              type: 'remote-select', label: '课程分类', prop: 'category_id', defaultValue: '',
              attrs: {
                placeholder: '请选择分类',
                clearable: true,
                // 如果去掉 group 配置，则是非分组的选择
                group: { dataField: 'list', labelField: 'name', valueField: 'id' },
                option: { dataField: 'secondaries', labelField: 'name', valueField: 'id' },
                request: { url: '/categories', method: 'GET', headers: {}, params: {}}
              }
            },
            {
              type: 'select', prop: 'status', label: '课程状态',
              attrs: { placeholder: '请选择状态', clearable: true },
              options: [
                { attrs: { label: '正常', value: 1 }},
                { attrs: { label: '临时关闭', value: 2 }}
              ]
            }
          ]
        }
      ]
    },

    /**
       * 表单按钮
       */
    buttons: {
      align: 'right',

      submit: {
        show: true,
        text: '查找',
        icon: 'el-icon-search',
        scene: {
          formatter: (query) => {
            return query
          }
        }
      },
      cancel: {
        show: true,
        text: '重置条件'
      }
    }
  },

  // 3.1 中间按钮栏快捷配置
  operationButtons: [
    {
      label: '添加商品',
      icon: 'el-icon-plus',
      type: 'success',
      clickMethod: this.handleCreate
    },
    {
      label: '批量删除',
      icon: 'el-icon-delete',
      type: 'danger',
      clickMethod: this.handleCreate
    }
  ],

  // 4.1 列表配置
  lbTable: {
    title: '产品列表',
    pagination: true, // 启动分页
    columns: [
      { type: 'selection' },
      { prop: 'name', label: '产品名称' },
      { prop: 'price', label: '价格' },
      // 操作栏快捷配置, 指定 operation  字段，进行对应的按钮配置
      {
        label: '操作', width: '290px', operation: { // 操作栏专有配置字段: operation
          mode: 'text', // mode = button || text
          buttons: [
            {
              label: '查看', scene: {
                action: 'click',
                clickMethod: (row) => { console.log('点击查看: ', row) }
              }
            },
            {
              label: '上架', type: 'primary', scene: {
                action: 'request',
                confirm: { content: '确定上架' }, // 操作确认
                loading: { text: '上架中' },
                request: { // 发起 HTTP 请求
                  urlFormatter: (row) => { return `/products2/${row.id}` }, // 格式化请求 url
                  method: 'PUT',
                  // params: { field: 'value' }, // 可选
                  // headers: { key: 'value' }, // 可选
                  data: { status: 1 }
                }
              }
            },
            {
              label: '删除', type: 'danger', icon: 'el-icon-delete', scene: {
                action: 'request',
                confirm: { content: '删除该记录？' }, // 操作确认
                // loading: { text: '删除中', prop: 'id' }, // 配置 loading 关键字, 如果需要指定唯一标识(默认： prop: 'id')，配置样例： // e.g: prop: 'table数据字段名称'
                request: { // 发起 HTTP 请求
                  urlFormatter: (row) => { return `/products2/${row.id}` }, // 格式化请求 url
                  method: 'DELETE',
                  // params: { field: 'value' }, // 可选
                  // headers: { key: 'value' }, // 可选
                  // data: { field: 'value' } // or String // 可选

                  onSuccess: (res, row) => { console.log(row, res) }, // 执行成功回调方法
                  onError: (error, row) => { console.log('--> error callback: ', error, row) } // 执行 error 回调方法
                }
              }
            },
            { label: '更多', type: 'primary', group: [
              {
                  label: '查看', visibleFormatter: (row) => { return row.id > 0 }, scene: { // visibleFormatter(row) 将行的数据传递进去，判断是否要显示该操作按钮
                  action: 'click',
                  clickMethod: (row) => { console.log('点击查看: ', row) }
                }
              },
              {
                label: '删除', type: 'danger', scene: {
                  action: 'request',
                  confirm: { content: '删除该记录？' }, // 操作确认
                  request: { // 发起 HTTP 请求
                    urlFormatter: (row) => { return `/products2/${row.id}` }, // 格式化请求 url
                    method: 'DELETE'
                    // params: { field: 'value' }, // 可选
                    // headers: { key: 'value' }, // 可选
                    // data: { field: 'value' } // or String // 可选
                  }
                }
              }
            ] }
          ]
        }
      }
    ]
  }
},
````