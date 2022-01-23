<template>
  <div>

    <div v-for="(config, index) in configs" :key="index" class="mb-10 time-row flex">
      <el-time-select
        v-model="configs[index].start"
        placeholder="开始时间"
        :picker-options="{
          start: '00:30',
          step: '00:15',
          end: '24:00',
        }"
        @change="changeConfig(index, 'start')"
      />

      <span class="ml-15 mr-15"> 至 </span>

      <el-time-select
        v-model="configs[index].end"
        placeholder="结束时间"
        :picker-options="{
          start: '00:30',
          step: '00:15',
          end: '24:00',
        }"
        @change="changeConfig(index, 'end')"
      />

      <div class="color-red fz-18 ml-15 icon-operation" @click="removeTimeRange(index)">
        <i class="el-icon-remove" />
      </div>
    </div>

    <div v-if="configs.length <= 2" :class="{'mt-5': configs.length > 0}">
      <el-button icon="el-icon-plus" type="default" @click="addTimeRange">添加时间</el-button>
    </div>

  </div>
</template>

<script>

export default {
  name: 'PanelConfigMultiTimeRange',
  components: { },

  props: {

    /**
     * 传进来的值
     */
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {

      // 时间范围配置
      configs: [
        { start: '', end: '' }
      ]
    }
  },

  computed: {

  },

  watch: {

    /**
     * 监听值变更
     */
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) {
          val = [{ start: '', end: '' }]
        }
        this.configs = val
      }
    }

  },

  created() {
    // this.list = []
    // this.selected = []
  },

  methods: {
    /**
     * 添加时间范围
     */
    addTimeRange() {
      if (this.configs.length >= 3) {
        this.$message.info('最多设置 3 个时间范围')
        return
      }

      this.configs.push({ start: '', end: '' })
      this._emitInput()
    },

    /**
     * 移除时间范围
     * @param index
     */
    removeTimeRange(index) {
      this.configs.splice(index, 1)
      this._emitInput()
    },

    /**
     * 配置修改
     * @param index
     * @param type
     */
    changeConfig(index, type) {
      console.log(this.configs)
      this._emitInput()
    },

    /**
     * emit 值
     * @private
     */
    _emitInput() {
      this.$emit('input', this.configs)
    }

  }
}
</script>

<style lang="scss" scoped>

.time-row {
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}

.icon-operation {
  cursor: pointer;
}

</style>
