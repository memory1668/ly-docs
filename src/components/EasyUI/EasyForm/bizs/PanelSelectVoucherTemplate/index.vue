<template>
  <div :class="{'panel-active': list.length > 0}">
    <div v-if="list.length > 0" class="panel-content">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="row-cond"
      >
        <div class="flex">
          <div class="mr-15 flex-1">{{ item.name }}</div>
          <div class="flex">
            <div class="ml-15">
              <el-input
                v-model="item.num"
                size="small"
                :placeholder="placeholder"
              >
                <template #append>
                  <span>张</span>
                </template>
              </el-input>
            </div>
          </div>

          <div class="ml-15 fz-18" style="margin-top: -2px;">
            <i class="el-icon-circle-close  icon-remove" @click="removeItem($event, index)" />
          </div>

        </div>
      </div>
    </div>
    <div>
      <el-button type="default" icon="el-icon-plus" @click="showDialogSelectVoucherTemplate">{{ btnText }}</el-button>
    </div>
    <dialog-select-voucher-template
      ref="dialogSelectVoucherTemplate"
      :multiple="true"
      @change="onSelectVoucherTemplate"
    />
  </div>
</template>

<script>
import DialogSelectVoucherTemplate from './components/DialogSelectVoucherTemplate'
import apiVoucherTemplate from '@/api/voucher/voucher-templates'

export default {
  name: 'PanelSelectVoucherTemplate',
  components: { DialogSelectVoucherTemplate },
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

    placeholder: {
      type: String,
      default: '发放数量'
    },

    btnText: {
      type: String,
      default: '选择优惠券'
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
        // 如果空值，则重置值后返回
        if ((!val || val.length === 0)) {
          this.list.length > 0 && (this.list = [])
          return
        }
        // 如果已经初始化过，不进行初始化
        if (this.list.length > 0) {
          return
        }
        this.initList(val)
        // this.list = val // 初始化列表的值
      }
    },

    list: {
      handler(val) {
        // 数量转换为数字
        let flag = false
        const value = val.map(item => {
          if (item.num === '' || isNaN(parseFloat(item.num))) {
            if (!flag && item.num !== '') {
              this.$message.error('发放数量应填写数字')
              flag = true
            }
            return item
          }
          return {
            ...item,
            num: parseFloat(item.num)
          }
        })
        this.$emit('input', value)
      },
      deep: true
    }
  },

  methods: {
    /**
     * 根据表单值初始化list
     */
    async initList(value) {
      let ids = ''
      value.forEach(item => {
        ids += `${item.template_id},`
      })
      ids = ids.slice(0, ids.length - 1)
      try {
        const { data } = await apiVoucherTemplate.getListByIds(ids)
        const list = []
        // 添加优惠券模板名
        value.forEach(item => {
          const voucherItem = data.filter(vItem => vItem.id === item.template_id)[0]
          const voucherTemplate = { ...item, name: voucherItem && voucherItem.name || '-' }
          list.push(voucherTemplate)
        })
        this.list = list
        console.log('通过ID获取优惠券模板信息成功', data)
      } catch (e) {
        console.error('失败', e)
      }
    },
    /**
     * 显示选择优惠券模板弹框
     */
    showDialogSelectVoucherTemplate() {
      this.$refs.dialogSelectVoucherTemplate.handleCreate()
    },

    /**
     * @param e
     * @param index
     */
    removeItem(e, index) {
      this.$confirm('确认移除该优惠券？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
      }).catch(() => {
      })
    },

    /**
     * 选中优惠券模板
     * @param val {Array} 选中的值
     */
    onSelectVoucherTemplate(val) {
      if (!val) {
        return
      }
      // const selectedVouchers = []
      console.log('选中优惠券模板', this.list, val)
      val.forEach(item => {
        const index = this.list.findIndex(voucher => {
          return voucher.template_id === item.id
        })
        // 重复选择，数量加1
        if (index !== -1) {
          this.list[index].num += 1
          return
        }
        this.list.push({
          template_id: item.id,
          name: item.name,
          num: 1 // 初始化数量
        })
      })
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
