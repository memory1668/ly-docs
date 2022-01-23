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
          title: '添加商品',
          attrs: { labelPosition: 'left'},
          rows: [
            {
              col: {span: 24},
              items: [
                {
                  type: 'input', label: '售价', prop: 'price', defaultValue: '',
                  attrs: { placeholder: '请输入售价' },
                  rules: [{
                    trigger: 'blur',
                    validator: (rule, value, callback)=>{
                      if (value === '') {
                        return callback(new Error('请输入售价'))
                      }
                      if (isNaN(Number(value))) {
                        return callback(new Error('售价请输入正确的数值'))
                      }
                      if (parseFloat(value) < 0) {
                        return callback(new Error('售价应大于0'))
                      }
                      callback() // 通过校验
                    }
                  }]
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
