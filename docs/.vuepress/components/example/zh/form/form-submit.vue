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
          title: '登录',
          attrs: { labelPosition: 'left'},
          rows: [
            {
              col: { span: 24 },
              items: [
                { type: 'input', label: '用户名', prop: 'name', defaultValue: '',
                  attrs: { placeholder: '请输入用户名' }
                },
                { type: 'input', label: '密码', prop: 'password', defaultValue: '',
                  attrs: { placeholder: '请输入密码', type: 'password' }
                }
              ]
            }
          ]
        },

        buttons: {
          align: 'right',
          submit: {
            show: true,
            text: '确认',
            scene: {
              // 格式化要提交的数据
              formatter: (data) => {
                return data
              },
              request: {
                url: '/login',
                method: 'POST',
                /**
                 * 某些情况formatter需要配置data才生效。
                 * 具体情况是formatter没有原路返回data
                 */
                data: {},
                /**
                 * 请求成功
                 * @param res 返回值
                 * @param data 提交的数据
                 */
                onSuccess: (res, data) => {
                  this.$message({ showClose: true, message: '登录成功', type: 'success' })
                }
              }
            }
          },
          cancel: {
            show: true,
            text: '取消'
          }
        }
      }
    }
  }
}
</script>
