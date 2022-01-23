<template>
  <div>
    <el-select
      v-model="selected"
      filterable
      clearable
      v-bind="$attrs"
      :style="{ width: width + 'px'}"
      :remote-method="getRemoteData"
      remote
      @clear="clear"
    >
      <el-option
        v-for="opt in searchOptions"
        :key="opt[option.valueField]"
        :label="opt[option.labelField]"
        :value="opt[option.valueField]"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'RemoteSearchSelect',
  components: {},
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: [String, Number, Array],
      default: ''
    },
    width: {
      type: Number,
      default: 200
    },
    /**
      * option 的配置
      */
    option: {
      type: Object,
      default: () => {
        return {
          labelField: 'name',
          valueField: 'id'
        }
      }
    },
    request: {
      type: Object,
      default() {
        return {
          api: {},
          params: {} // 调用 index 方法时携带的参数
        }
      }
    }
  },
  data: function() {
    return {
      searchOptions: [],
      selected: '',
      selectedData: null
    }
  },
  watch: {
    selected(val) {
      this.$emit('input', val)
    },
    value: {
      immediate: true,
      handler(val) {
        this.getRemoteData()
        this.selected = val
      }
    }
  },
  created() {
    if (this.value === '') {
      this.getRemoteData()
    }
  },
  methods: {
    getRemoteData(query) {
      if (query) {
        const key = this.option.labelField + '__like'
        this.request.api.index({ ...{ [key]: query }, ...this.request.params }).then(res => {
          this.searchOptions = res.data.list
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.request.api.index(this.request.params).then(res => {
          this.searchOptions = res.data.list
          if (!this.value) return
          if (this.value instanceof Array) return
          this.request.api.show(this.value).then(res => {
            const data = res.data
            const index = this.searchOptions.findIndex(x => x[this.option.valueField] === this.value)
            if (index === -1) {
              this.searchOptions.push(data)
            }
          }).catch(error => {
            console.error(error)
          })
        }).catch(error => {
          console.log(error)
        })
      }
    },
    clear() {
      this.getRemoteData()
    }
  }
}
</script>

<style scoped>

</style>
