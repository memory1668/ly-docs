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
              <el-input v-model="item.condition" size="small" :placeholder="cond.placeholder">
                <span slot="prepend">{{ cond.label }}</span>
                <span slot="append">{{ cond.unit }}</span>
              </el-input>
            </div>
          </div>
          <div class="flex-1 flex">
            <div class="ml-15">
              <el-input v-model="item.meet" size="small" :placeholder="meet.placeholder">
                <span slot="prepend">{{ meet.label }}</span>
                <span slot="append">{{ meet.unit }}</span>
              </el-input>
            </div>
          </div>

          <div class="ml-15 fz-18" style="margin-top: -2px;">
            <i class="el-icon-circle-close  icon-remove" @click="removeItem($event, index)" />
          </div>

        </div>

        <div class="ml-50 pl-15">
          <div class="mt-5 mb-5 color-grey">额外赠送酒水（可选）</div>
          <panel-select-product-sku v-model="item.product_sku_config" :show-choose-any-tip="false" />
        </div>

        <div v-if="showVoucherConfig" class="ml-50 pl-15">
          <div class="mt-5 mb-5 color-grey">额外赠送优惠券（可选）</div>
          <panel-select-voucher-template v-model="item.voucher_template_config" :show-choose-any-tip="false" />
        </div>

      </div>
    </div>
    <div>
      <el-button size="mini" type="default" icon="el-icon-plus" @click="clickAdd">{{ btnText }}</el-button>
    </div>
  </div>
</template>

<script>
import PanelSelectProductSku from '@/components/EasyUI/EasyForm/bizs/PanelSelectProductSku/index'
import PanelSelectVoucherTemplate from '@/components/EasyUI/EasyForm/bizs/PanelSelectVoucherTemplate'

export default {
  name: 'MultiEchelonSetting',
  components: { PanelSelectVoucherTemplate, PanelSelectProductSku },

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
      default: '规则'
    },

    cond: {
      type: Object,
      default: () => {
        return {
          label: '充',
          placeholder: '金额',
          unit: '元'
        }
      }
    },
    meet: {
      type: Object,
      default: () => {
        return {
          label: '送',
          placeholder: '百分比',
          unit: '%'
        }
      }
    },

    btnText: {
      type: String,
      default: '添加'
    },

    /**
     * 显示优惠券配置
     */
    showVoucherConfig: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      list: [
        // {condition: xx, meet: xx}
      ]
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
    }
  },

  created() {

  },

  methods: {

    /**
     * 添加
     */
    clickAdd() {
      this.list.push({
        condition: '',
        meet: '',
        product_sku_config: [],
        voucher_template_config: []
      })

      this.emitInput()
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
        this.emitInput()
      }).catch(() => {})
    },

    /**
     * emit input 事件
     */
    emitInput() {
      const val = []
      this.list.forEach(v => {
        val.push({
          condition: v.condition,
          meet: v.meet,
          product_sku_config: v.product_sku_config,
          voucher_template_config: v.voucher_template_config
        })
      })

      console.log('--> emit MultiEchelonSetting: ', val)
      this.$emit('input', val)
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
