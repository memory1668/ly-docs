<template>
  <div>
    <el-cascader
      v-model="selectedItem"
      :options="options"
      :props="option.props"
      :clearable="option.clearable"
    >
      <template slot-scope="{ node, data }">
        <span>{{ option.props.label ? data[option.props.label] : data['label'] }}</span>
      </template>
    </el-cascader>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: [Array, String],
      default: () => {
        return ''
      }
    },
    /**
     * option 的配置
     * 对应文档：https://element.eleme.cn/#/zh-CN/component/cascader#props
     */
    option: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /**
     * 请求配置
     */
    request: {
      type: Object,
      default() {
        return {
          api: {},
          params: {}, // 调用方法时携带的参数
          methodName: 'getAllData' // 指定调用 api 中哪一个方法
        }
      }
    }
  },
  data() {
    return {
      // 数据格式地址：https://element.eleme.cn/#/zh-CN/component/cascader
      options: [],
      selectedItem: ''
    }
  },
  watch: {
    selectedItem(val) {
      this.$emit('input', val)
      console.log('级联选择：', val)
    },
    value: {
      immediate: true,
      handler(val) {
        this.selectedItem = val
      }
    }
  },
  created() {
    this.request.api[this.request.methodName](this.request.params).then(res => {
      this.options = res.data
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped>

</style>
