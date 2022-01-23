<template>
  <div class="switch-operation" :class="direction">
    <el-switch
      v-for="(item, index) in switches"
      :key="index"
      :value="values[index]"
      v-bind="item.attrs"
      class="switch-item"
      @change="onSwitchChange($event, index)"
    />
  </div>
</template>

<script>
import axiosInstance from '@/utils/request'
export default {
  name: 'SwitchOperation',
  props: {
    // 开关配置
    /**
     * {
          value: false, // 初始化值
          autoRefresh: false, // 打开开关后是否刷新列表
          // 传给el-switch的属性
          attrs: {
           activeText: '',
           inactiveText: '',
          }
          // 配置确认框
          confirm: {
             title: '操作确认', // 弹框标题
             message:{
                active: '' // 开启确认提示 字符串或者函数
                inactive: '' // 关闭确认提示 字符串或者函数
             },
             confirmButtonText: '确定', // 确认按钮文本
             cancelButtonText: '取消' // 取消按钮文本
          },
          // HTTP 请求
          request: {
            httpClient: null, // axios 实例
            url: '', // 请求url(忽略urlFormatter)
            urlFormatter: (row) => { // 格式化url
              return ''
            },
            method: 'PUT',
            params: {}, // 请求参数
            paramsFormatter: ()=>{} // 格式化请求参数
            data: {}, // 请求数据
            dataFormatter: ()=>{} // 格式化请求数据
            success: {
              message: {
                active: '' // 开关开启成功提示 字符串或者函数
                inactive: '' // 开关关闭成功提示 字符串或者函数
              },
              callback: (row, status, data)=>{} // 请求成功回调函数
            },
            // 请求失败的提示和回调，同success
            error: {}
          }
        }
     */
    switches: {
      type: Array,
      default() {
        return []
      }
    },

    // 数据行记录
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },

    // 开关排列方向 row 水平排列(默认)/ column 垂直排列
    direction: {
      type: String,
      default: 'row'
    }
  },

  data() {
    return {
      values: []
    }
  },

  watch: {
    switches: {
      handler(val) {
        if (!val || val.length === 0) {
          return
        }
        this.initValues()
      },
      immediate: true,
      deep: true
    },

    row: {
      handler(val) {
        // console.log('row change', val)
        this.initValues()
      }
    }
  },

  methods: {
    /**
     * 初始化各个开关的值
     */
    initValues() {
      const values = []
      this.switches.forEach(item => {
        let value = false
        if (item.hasOwnProperty('prop')) {
          value = this.row[item.prop]
        }
        if (item.hasOwnProperty('valueFormatter') && typeof item.valueFormatter === 'function') {
          value = item.valueFormatter(this.row)
        }
        values.push(value)
      })
      this.values = values
    },

    /**
     * 开关状态改变
     * @param {Boolean} status 当前开关状态
     * @param {Number}index 开关索引
     */
    onSwitchChange(status, index) {
      // console.log('开关状态改变', status, index)
      const { confirm } = this.switches[index]
      if (confirm) {
        this.$confirm(`${this._getMessage(status, confirm.message)}`, confirm.title || '操作确认', {
          confirmButtonText: confirm.confirmButtonText || '确定',
          cancelButtonText: confirm.cancelButtonText || '取消',
          type: 'warning'
        }).then(() => {
          return this.handleRequest(status, index)
        }).then(() => {
          this.$set(this.values, index, status)
        }).catch(err => {
          console.error(err)
        })
        return
      }
      this.handleRequest(status, index).then(() => {
        this.$set(this.values, index, status)
      }).catch(err => {
        console.error('请求失败', err)
      })
    },

    /**
     * 发起请求
     * @param {Boolean} status 当前开关状态
     * @param {Number}index 开关索引
     */
    async handleRequest(status, index) {
      const { request, autoRefresh } = this.switches[index]
      if (!request) {
        return
      }
      const httpClient = request.httpClient || axiosInstance
      try {
        const { data } = await httpClient.request({
          url: request.url || (typeof request.urlFormatter === 'function' && request.urlFormatter(this.row, status)) || '',
          method: (request.method || 'PUT').toUpperCase(),
          headers: request.headers || null,
          params: request.params || (typeof request.paramsFormatter === 'function' && request.paramsFormatter(this.row, status)) || null,
          data: request.data || (typeof request.dataFormatter === 'function' && request.dataFormatter(this.row, status)) || null
        })
        // console.log('发起请求成功')
        // 成功提示
        if (request.success && request.success.message) {
          this.$message.success(this._getMessage(status, request.success.message))
        }
        // 成功回调
        if (request.success && request.success.callback) {
          request.success.callback(this.row, status, data)
        }
        if (autoRefresh) {
          this.$emit('autoRefresh')
        }
      } catch (e) {
        console.error('发起请求失败', e, e.response, e.message, e.request, e.status)
        // 失败回调
        if (request.error && request.error.callback) {
          request.error.callback(this.row, status, e)
        }
        // 网络异常 不显示配置的失败提示
        if (e.message && e.message === 'Network Error') {
          this.$message.error('网络异常，请稍后重试')
          throw e
        }
        // 服务端返回错误信息 不显示配置的失败提示
        if (e.response) {
          throw e
        }
        // 失败提示
        if (request.error && request.error.message) {
          this.$message.error(this._getMessage(status, request.error.message, e))
        }
        throw e
      }
    },

    /**
     * 获取确认弹框和请求结果的提示信息
     * @param {Boolean} status 当前开关状态
     * @param {Object} option 消息配置
     * @param {Object} error 错误信息对象
     * @private
     */
    _getMessage(status, option, error = null) {
      if (!option) {
        return ''
      }
      const message = status ? option.active : option.inactive
      if (typeof message === 'function') {
        return message(this.row, error)
      }
      return message
    }
  }
}
</script>

<style lang="scss" scoped>
  .switch-operation {
    display: flex;
    justify-content: center;
    .switch-item:not(:last-child) {
      margin-right: 10px;
    }
    &.column {
      flex-direction: column;
      align-items: center;
      .switch-item:not(:last-child) {
        margin-bottom: 10px;
        margin-right: 0;
      }
    }
  }
</style>
