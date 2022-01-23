<template>
  <div>
    <el-cascader ref="elCascader" v-model="selectedValues" :props="props" :options="options" clearable="clearable" @change="handleChange" />
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'ProvinceCityArea',
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: Array,
      default: () => []
    },
    /**
     * containsArea: 是否包括区
     * false(default): 选择省市
     * true: 选择省市区
     * */
    containsArea: {
      type: Boolean,
      default: false
    },

    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 选中的值
      selectedValues: [],
      flag: true,
      // props: {
      //   lazy: true,
      //   containsArea: this.containsArea,
      //   flag: this.flag,
      //   async lazyLoad(node, resolve) {
      //     // level是当前选中节点的等级: 0初始值/1一级菜单/2二级菜单/3三级菜单...
      //     const { level } = node
      //     const URL = '/areas?level=' + (level + 1) + (level === 0 ? '' : '&pid=' + node.data.value)
      //     const res = await request.get(URL)
      //     const nodes = res.data.map(item => ({
      //       value: item.id,
      //       label: item.name,
      //       leaf: item.name === '钓鱼岛' ? true : level >= (this.containsArea ? 2 : 1)
      //     }))
      //     console.log('this.flag', this, this.flag, level)
      //     // if (level === 0) {
      //     //   console.log('this.flag', this, this.flag)
      //     //   // this.flag = true
      //     // }
      //     resolve(nodes)
      //   }
      // }
      // 所有省市数据
      options: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'cities',
        leaf: 'leaf',
        checkStrictly: true,
        expandTrigger: 'hover'
      }
    }
  },
  watch: {
    value(val) {
      console.log('selectedVal', val)
      this.selectedValues = [...val]
      this.$nextTick(() => {
        // 获取选中的节点
        const node = this.$refs.elCascader.getCheckedNodes()[0]
        console.log('获取选中的节点', node)
        if (node) {
          this.getCityAreaByNode(node)
        } else if (this.selectedValues.length > 0) {
          console.log('this.selectedValues', this.selectedValues)
          this.getCityAreaById()
        }
      })
    }
  },
  async created() {
    this.options = await this.getProvince()
  },
  methods: {
    async handleChange(val) {
      this.$emit('input', val)
      console.log('选中的省市区', val)
      if (val.length !== 0) {
        this.$nextTick(() => {
          // 获取选中的节点
          const node = this.$refs.elCascader.getCheckedNodes()[0]
          this.getCityAreaByNode(node)
        })
      }
    },

    // 获取全部省份数据
    async getProvince() {
      const res = await request.get('/areas/?level=1')
      return [...res.data]
    },

    //  通过选中节点获取市或区数据
    async getCityAreaByNode(node) {
      if (node) {
        const URL = '/areas?level=' + (node.level + 1) + '&pid=' + node.value
        const res = await request.get(URL)
        // 选中省节点
        if (node.level === 1) {
          // 选中省的索引
          const idx = this.options.findIndex((item) => {
            return item.id === node.value
          })
          // 添加市数据
          this.$set(this.options[idx], 'cities', res.data)
        } else if (node.level === 2 && this.containsArea) { // 选中市节点且配置文件配置要请求市节点
          // 省节点索引
          const provinceIdx = this.options.findIndex((item) => {
            return item.id === node.parent.value
          })
          // 市节点索引
          const cityIdx = this.options[provinceIdx].cities.findIndex((item) => {
            return item.id === node.value
          })
          // 添加区数据
          this.$set(this.options[provinceIdx].cities[cityIdx], 'cities', res.data)
        }
      }
    },
    //  通过选中的id获取市或区数据
    async getCityAreaById() {
      let level = 1
      // 如果还没有省数据
      if (this.options.length === 0) {
        this.options = await this.getProvince()
      }
      while (level <= (this.containsArea ? 2 : 1)) {
        const pid = this.selectedValues[0]
        const URL = '/areas?level=' + (level + 1) + '&pid=' + pid
        const res = await request.get(URL)
        // 选中省节点
        if (level === 1) {
          // 选中省的索引
          const idx = this.options.findIndex((item) => {
            return item.id === this.selectedValues[0]
          })
          console.log('选中省', this.options[idx])
          // 添加市数据
          this.$set(this.options[idx], 'cities', res.data)
        } else if (level === 2) { // 选中市节点
          // 省节点索引
          const provinceIdx = this.options.findIndex((item) => {
            return item.id === this.selectedValues[0]
          })
          // 市节点索引
          const cityIdx = this.options[provinceIdx].cities.findIndex((item) => {
            return item.id === this.selectedValues[1]
          })
          // 添加区数据
          this.$set(this.options[provinceIdx].cities[cityIdx], 'cities', res.data)
        }
        level++
      }
    }
  }
}
</script>

<style scoped>

</style>
