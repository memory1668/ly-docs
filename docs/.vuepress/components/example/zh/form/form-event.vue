<template>
  <div>
    <div v-if="parseFloat(price) > 0">售价：￥{{price}}</div>
    <panel-form
      :options="panelFormOptions"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      price: '',
      panelFormOptions: {
        form: {
          title: '添加商品',
          attrs: { labelPosition: 'left' },
          rows: [
            {
              col: { span: 24 },
              items: [
                {
                  type: 'input', label: '售价', prop: 'price', defaultValue: '',
                  attrs: { placeholder: '请输入售价' },
                  rules: [
                    { required: true, message: '请输入售价', trigger: 'blur' },
                  ],
                  events: {
                    input: (val) => {
                      this.price = val
                    }
                  }
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
