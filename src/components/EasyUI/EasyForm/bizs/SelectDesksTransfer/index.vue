<template>
  <div>
    <el-transfer
      v-model="responseKeys"
      style="text-align: left; display: inline-block"
      filterable
      :titles="['未选台号', '已选台号']"
      :button-texts="['取消选择', '添加选择']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      :data="data"
      @change="handleChange"
    >
      <span slot-scope="{ option }">{{ option.label }}</span>
    </el-transfer>
  </div>
</template>

<script>
import apiDesk from '@/api/desk'
export default {
  name: 'Index',
  components: {

  },

  props: {

    /**
     * 当前选中的台号 ID
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

      data: [],

      responseKeys: [],
      currentResponseIds: [],

      initDeskIds: [] // 初始化值
    }
  },

  watch: {
    value: {
      immediate: true,
      deep: true,
      handler: function(val) {
        if (!val) {
          val = []
        }
        this.initDeskIds = val
      }
    },
    /**
     * 监听initDeskId变化
     */
    initDeskIds: {
      handler(val) {
        this.responseKeys = this.initDeskIds
        this.currentResponseIds = this.initDeskIds
      }
    }
  },

  created() {
    this.listAll()
  },

  methods: {

    /**
     * 穿梭框变化
     */
    handleChange(value, direction, movedKeys) {
      this.currentResponseIds = value
      this.$emit('input', value)
    },

    /**
     * 获取员工负责的台号情况
     */
    listAll() {
      apiDesk.listAll().then(res => {
        this.data = []
        this.responseKeys = []

        res.data.list.forEach(item => {
          this.data.push({
            key: item.id,
            label: (item.zone ? item.zone.name + ' - ' : '') + item.name,
            disabled: false
          })
        })

        this.responseKeys = this.initDeskIds
        this.currentResponseIds = this.initDeskIds
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-transfer-panel__list {
  line-height: 0;
}
</style>
