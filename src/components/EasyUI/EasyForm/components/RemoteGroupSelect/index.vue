<template>
  <div>
    <el-select
      v-model="selected"
      filterable
      v-bind="$attrs"
    >
      <el-option-group
        v-for="go in groupOptions"
        :key="go[group.valueField]"
        :label="go[group.labelField]"
      >
        <el-option
          v-for="opt in go[option.dataField]"
          :key="opt[option.valueField]"
          :label="opt[option.labelField]"
          :value="opt[option.valueField]"
        />
      </el-option-group>
    </el-select>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'
// import axiosInstance from '@/utils/request'

export default {
  name: 'RemoteGroupSelect',
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
          url: process.env.VUE_APP_BASE_API + '/remote-group-select',
          // 请求头
          headers: {
            'Authorization': 'Bearer ' + getToken()
          },
          // query 参数
          params: {},
          method: 'GET',
          data: {},
          // axios 实例
          httpClient: axiosInstance
        }
      }
    },

    /**
       * option 的配置
       */
    group: {
      type: Object,
      default: () => {
        return {
          dataField: 'list', // 获取响应数据 data 中的那个字段的数据
          labelField: 'name',
          valueField: 'id'
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
          dataField: 'secondaries',
          labelField: 'name',
          valueField: 'id'
        }
      }
    }
  },
  data: function () {
    return {
      selected: '',

      /**
         * 分组样例
         */
      groupOptions: [
        // {
        //   id: 'xxx',
        //   name: 'xxx',
        //   secondaries: [
        //     {
        //       id: 'xxx',
        //       name: 'xxx'
        //     }
        //   ]
        // },
      ]
    }
  },
  watch: {
    selected (val) {
      this.$emit('input', val)
    },

    value (val) {
      this.selected = val
    }
  },
  created () {
    this.initAndRequest()
  },
  methods: {

    /**
       * 发起请求
       */
    initAndRequest () {
      // 初始化设置 request 的参数
      // if (this.request.url.slice(0, 4) !== 'http') { // 如果不以 http or https 开头，则自动拼接上系统配置的前缀路由
      //   this.request.url = process.env.VUE_APP_BASE_API + this.request.url
      // }
      // !this.request.hasOwnProperty('method') && (this.request.method = 'GET')
      // !this.request.hasOwnProperty('header') && (this.request.header = { 'Authorization': 'Bearer ' + getToken() })
      // if (!this.request.hasOwnProperty('httpClient') || !this.request.httpClient) {
      //   this.request.httpClient = axiosInstance
      // }
      //
      // // 发送请求
      // this.request.httpClient.request({
      //   url: this.request.url,
      //   method: this.request.method.toUpperCase(),
      //   data: this.request.data ? this.request.data : null,
      //   params: this.request.params ? this.request.params : null,
      //   headers: this.request.headers ? this.request.headers : null
      // }).then(res => {
      //   // 数据数据的哪个字段
      //   const dataField = this.group.hasOwnProperty('dataField') && this.group.dataField ? this.group.dataField : 'list'
      //
      //   // 获取响应数据的 list 字段的数据
      //   this.groupOptions = res.data[dataField]
      // }).catch(error => {
      //   this.$message.error('请求失败: ' + error)
      // })
      // 模拟请求成功
      Promise.resolve().then(() => {
        this.groupOptions = [
          { name: '热门城市',
            id: '001',
            children: [
              { name: '广州', id: '0001' },
              { name: '深圳', id: '0002' },
              { name: '上海', id: '0003' }
            ]
          },
          { name: '城市名',
            id: '002',
            children: [
              { name: '佛山', id: '0004' },
              { name: '东莞', id: '0005' }
            ]
          }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
