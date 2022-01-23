<template>
  <div>
    <el-radio-group v-model="labelPosition" size="small">
      <el-radio-button label="left">左对齐</el-radio-button>
      <el-radio-button label="right">右对齐</el-radio-button>
      <el-radio-button label="top">顶部对齐</el-radio-button>
    </el-radio-group>
    <div style="margin: 20px;"></div>
    <panel-form
      :options="panelFormOptions"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      labelPosition: 'left'
    }
  },
  computed: {
    panelFormOptions() {
      return {
        form: {
          title: '添加员工',
          attrs: { labelPosition: this.labelPosition},
          rows: [
            {
              items: [
                {
                  type: 'input', label: '员工姓名', prop: 'name', defaultValue: '',
                  attrs: { placeholder: '请输入员工姓名' }
                },
                {
                  type: 'input', label: '手机号', prop: 'phone', defaultValue: '',
                  attrs: { placeholder: '请输入手机号' }
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
