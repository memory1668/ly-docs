<template>
  <div>
    <el-select
      v-model="selected"
      filterable
      v-bind="$attrs"
    >
      <el-option
        v-for="opt in formattedOptions"
        :key="opt[option.valueField]"
        :label="opt[option.labelField]"
        :value="opt[option.valueField]"
      />
    </el-select>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'
// import axiosInstance from '@/utils/request'

export default {
  name: 'RemoteSelect',
  components: {},
  props: {
    /**
       * v-model 选中的值
       */
    value: {
      type: [String, Number, Array],
      default: ''
    },

    /**
       * 远程请求的配置
       */
    request: {
      type: Object,
      default: () => {
        return {
          // 远程接口配置
          url: process.env.VUE_APP_BASE_API + '/remote-select',
          // 请求头
          headers: {
            'Authorization': 'Bearer ' + getToken()
          },
          // query 参数
          params: {},
          method: 'GET',
          data: {}
          // axios 实例
          // httpClient: axiosInstance
        }
      }
    },

    /**
       * option 的配置
       */
    option: {
      type: Object,
      default: () => {
        return {
          dataField: 'list',
          labelField: 'name',
          valueField: 'id'
        }
      }
    },

    // 选项过滤器
    optionsFilter: {
      type: Function,
      default: null
    },

    // 更新值重新获取数据
    refreshData: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      selected: '',

      /**
         * 分组样例
         */
      options: [
        // {
        //   id: 'xxx',
        //   name: 'xxx',
        // },
      ]
    }
  },
  computed: {
    formattedOptions () {
      if (this.optionsFilter && typeof this.optionsFilter === 'function') {
        return this.optionsFilter(this.options)
      }
      return this.options
    }
  },
  watch: {
    selected (val) {
      this.$emit('input', val)
    },

    value: {
      immediate: true,
      deep: true,
      handler (val) {
        if (this.refreshData && val) {
          this.initAndRequest()
        }
        this.selected = val
      }
    }
  },
  created () {
    if (!this.refreshData) {
      this.initAndRequest()
    }
  },
  methods: {

    /**
       * 发起请求
       */
    initAndRequest () {
      // console.log('initAndRequest!')
      // // 初始化设置 request 的参数
      // if (this.request.url.slice(0, 4) !== 'http') { // 如果不以 http or https 开头，则自动拼接上系统配置的前缀路由
      //   this.request.url = process.env.VUE_APP_BASE_API + this.request.url
      // }
      // !this.request.hasOwnProperty('method') && (this.request.method = 'GET')
      // !this.request.hasOwnProperty('header') && (this.request.header = { 'Authorization': 'Bearer ' + getToken() })
      // if (!this.request.hasOwnProperty('httpClient') || !this.request.httpClient) {
      //   this.request.httpClient = axiosInstance
      // }

      // 发送请求
      // this.request.httpClient.request({
      //   url: this.request.url,
      //   method: this.request.method.toUpperCase(),
      //   data: this.request.data ? this.request.data : null,
      //   params: this.request.params ? this.request.params : null,
      //   headers: this.request.headers ? this.request.headers : null
      // }).then(res => {
      //   // 数据数据的哪个字段
      //   const dataField = this.option.hasOwnProperty('dataField') && this.option.dataField ? this.option.dataField : 'list'
      //
      //   // 获取响应数据的 list 字段的数据
      //   this.options = res.data[dataField]
      //   console.log(dataField, this.options)
      // }).catch(error => {
      //   this.$message.error('请求失败: ' + error)
      // })

      // 模拟请求成功
      Promise.resolve().then(() => {
        this.options = [
          { name: '广州', id: '0001' },
          { name: '深圳', id: '0002' },
          { name: '上海', id: '0003' }
        ]
      })
    }
  }
}
</script>
