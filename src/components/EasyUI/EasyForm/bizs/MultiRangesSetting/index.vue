<template>
  <div :class="{'panel-active': list.length > 0}">
    <div v-if="list.length > 0" class="panel-content">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="row-cond"
      >
        <div class="flex">
          <div class="mr-15 label-index">{{ label }} {{ index + 1 }}</div>
          <div class="flex-1 flex">
            <div class="mr-15">
              <el-input v-model="item[0]" size="small" :placeholder="min.placeholder" :disabled="index > 0" @input="onMinInput($event, index)" />
            </div>
          </div>
          <div>-</div>
          <div class="flex-1 flex">
            <div class="ml-15">
              <el-input
                v-model="item[1]"
                size="small"
                :placeholder="max.placeholder"
                @input="onMaxInput($event, index)"
                @change="onMaxChange($event, index)"
              />
            </div>
          </div>

          <div class="ml-15 fz-18" style="margin-top: -2px;">
            <i class="el-icon-circle-close  icon-remove" @click="removeItem($event, index)" />
          </div>

        </div>
      </div>
    </div>
    <div>
      <el-button size="mini" type="default" icon="el-icon-plus" @click="clickAdd">{{ btnText }}</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MultiRangesSetting',
  props: {
    /**
     * 初始化的值
     */
    value: {
      type: Array,
      default: () => {
        return []
      }
    },

    label: {
      type: String,
      default: '区间'
    },

    min: {
      type: Object,
      default: () => {
        return {
          placeholder: '最小值'
        }
      }
    },

    max: {
      type: Object,
      default: () => {
        return {
          placeholder: '最大值'
        }
      }
    },

    btnText: {
      type: String,
      default: '添加'
    }
  },

  data() {
    return {
      list: []
    }
  },

  watch: {
    /**
     * 监听值变更
     */
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('boon value: ', val)
        if (!val) {
          return
        }
        this.list = val
      }
    },

    list: {
      handler(val) {
        val.forEach(item => {
          !isNaN(parseFloat(item[0])) && (item[0] = parseFloat(item[0]))
          !isNaN(parseFloat(item[1])) && (item[1] = parseFloat(item[1]))
        })
        // console.log('输入值转换成数值', val)
        this.$emit('input', val)
      },
      deep: true
    }
  },

  methods: {

    /**
     * 添加
     */
    clickAdd() {
      let listItem = []
      const length = this.list.length
      // 添加第一个范围
      if (length === 0) {
        listItem = [0, '']
      } else if (!isNaN(parseFloat(this.list[length - 1][1]))) {
        listItem = [this.list[length - 1][1], '']
      } else {
        listItem = ['', '']
      }
      this.list.push(listItem)
    },

    /**
     * @param e
     * @param index
     */
    removeItem(e, index) {
      this.$confirm('确认移除该规则项？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
      }).catch(() => {})
    },

    /**
     * 输入区间最大值
     * @param value 输入的值
     * @param index 当前输入区间索引
     */
    onMinInput(value, index) {
      if (index !== 0) {
        return
      }
      // 当区间的最小值大于等于最大值
      if (parseFloat(value) >= parseFloat(this.list[index][1])) {
        // 重置当前区间的最大值和后面所有区间的最大最小值
        this.$set(this.list[index], 1, '')
        for (let i = index + 1; i < this.list.length; i++) {
          this.$set(this.list, i, ['', ''])
        }
      }
    },
    /**
     * 输入区间最大值
     * @param value 输入的值
     * @param index 当前输入区间索引
     */
    onMaxInput(value, index) {
      if (!value) {
        return
      }
      // 最后一个区间
      if (index === this.list.length - 1) {
        return
      }
      // 修改下一个区间的最小值
      this.$set(this.list[index + 1], 0, value)
      // 下一个区间的最小值大于等于最大值
      if (parseFloat(this.list[index + 1][0]) >= parseFloat(this.list[index + 1][1])) {
        // 重置下一个区间的最大值和后面所有区间的最大最小值
        this.$set(this.list[index + 1], 1, '')
        for (let i = index + 2; i < this.list.length; i++) {
          this.$set(this.list, i, ['', ''])
        }
      }
    },

    /**
     * 输入区间最大值
     * @param value 输入的值
     * @param index 当前输入区间索引
     */
    onMaxChange(value, index) {
      if (!value) {
        return
      }
      // console.log('输入最大值', value, index)
      // 当区间的最小值大于等于最大值
      if (parseFloat(this.list[index][0]) >= parseFloat(this.list[index][1])) {
        // 重置当前区间的最小值和前面所有区间的最大最小值
        this.$set(this.list[index], 0, '')
        this.$message.warning(`${this.max.placeholder}应大于${this.min.placeholder}`)
        for (let i = 0; i < index; i++) {
          this.$set(this.list, i, ['', ''])
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .panel-active {
    border: 1px solid #f3f3f3;
    padding: 15px;
    border-radius: 5px;
  }

  .label-index {
    padding: 0px 8px;
    background-color: #f3f3f3;
    color: #999;
    line-height: 1.6em;
    height: 1.6em;
    border-radius: 3px;
    font-size: 12px;
    margin-top: 7px;
  }

  .panel-content {
    margin-bottom: 5px;
  }

  .row-cond {
    border-bottom: 1px dashed #f3f3f3;
    padding-bottom: 15px;
    padding-top: 15px;
    &:last-child {
     border-bottom: none;
      padding-bottom: 0px;
    }
    &:first-child {
      padding-top: 0;
    }
  }

  .icon-remove {
    color: #999;
    &:hover {
      color: #ff5646;
      cursor: pointer;
    }
  }

</style>
