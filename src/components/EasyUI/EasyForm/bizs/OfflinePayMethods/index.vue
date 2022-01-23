<template>
  <div :style="{marginTop: offsetTop, marginLeft: offsetLeft}">
    <div class="offline-pay-method">
      <div
        v-for="(item, index) in offlinePayMethods"
        :key="index"
        :class="{active: selectedOfflinePayMethods[item.field]}"
        class="offline-pay-method-item"
        @click="clickOfflinePayMethod(item.field)"
      >
        <img :src="item.icon" class="icon">
        <div class="pay-method-name">{{ item.name }}</div>
        <img :src="require('@/assets/images/icon-checked.png')" class="icon-checked">
      </div>
    </div>
    <div>
      <template v-for="(payMethod, index) in offlinePayMethods">
        <div v-if="selectedOfflinePayMethods[payMethod.field]" :key="index" class="flex mt-15">
          <div class="color-red mt-12 mr-3" style="line-height: 20px">*</div>
          <div class="pt-10 mr-15 w-120" style="line-height: 20px">{{ payMethod.name }}</div>
          <div class="w-180 mt-6">
            <el-input v-model="form[payMethod.field]" size="small" :placeholder="payMethod.name + '金额'">
              <template slot="append">元</template>
            </el-input>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import apiCustomOfflinePayMethods from '@/api/custom-offline-pay-methods'
let DEFAULT_FORM = null // 默认表单值
export default {
  name: 'OfflinePayMethods',
  props: {
    /**
     * 传进来的值
     */
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 实收金额
    realPayAmount: {
      type: [Number, String],
      default: 0
    },
    offsetTop: {
      type: String,
      default: '0px'
    },

    offsetLeft: {
      type: String,
      default: '0px'
    }
  },
  data() {
    return {
      customOfflinePayMethods: null, // 自定义线下支付方法列表
      selectedOfflinePayMethods: {}, // 选中的线下支付方式
      form: {}
    }
  },
  computed: {
    // 线下支付方式
    offlinePayMethods() {
      const payMethods = [
        { name: '微信支付', field: 'offline_wechat_pay_amount', icon: require('@/assets/images/icon-wechat-pay.png') },
        { name: '支付宝', field: 'offline_alipay_pay_amount', icon: require('@/assets/images/icon-alipay.png') },
        { name: '现金', field: 'offline_cash_pay_amount', icon: require('@/assets/images/icon-cash-pay.png') },
        { name: '刷卡', field: 'offline_card_pay_amount', icon: require('@/assets/images/icon-card-pay.png') }
      ]
      if (this.customOfflinePayMethods) {
        return [
          ...payMethods,
          ...this.customOfflinePayMethods
        ]
      }
      return payMethods
    }
  },
  watch: {
    offlinePayMethods(val) {
      const form = {}
      // 初始化各支付金额的值
      val.forEach(payMethod => {
        form[payMethod.field] = 0
      })
      DEFAULT_FORM = { ...form }
      this.form = { ...form }
    },
    form: {
      handler(val) {
        // console.log('form data change', val)
        this.$emit('input', val)
      },
      deep: true
    },
    value(val) {
      if (!val || Object.keys(val).length === 0) {
        this.selectedOfflinePayMethods = {} // 重置选中支付方式
        if (DEFAULT_FORM) {
          this.form = { ...DEFAULT_FORM } // 重置支付金额
        }
      }
    }
  },
  created() {
    if (!this.customOfflinePayMethods) {
      this.getCustomOfflinePayMethods()
    }
  },
  methods: {
    /**
     * 获取自定义线下支付方法列表
     */
    async getCustomOfflinePayMethods() {
      try {
        const { data } = await apiCustomOfflinePayMethods.getCustomOfflinePayMethods()
        this.customOfflinePayMethods = data.map(item => ({
          ...item,
          icon: require('@/assets/images/icon-custom-pay.png')
        }))
        console.log('获取自定义线下支付方法列表成功', data)
      } catch (e) {
        console.error('获取自定义线下支付方法列表失败', e)
      }
    },

    /**
     * 点击选择支付方式
     */
    clickOfflinePayMethod(field) {
      this.$set(this.selectedOfflinePayMethods, field, !this.selectedOfflinePayMethods[field])
      let selectedCount = 0 // 选中支付方式的数量
      let firstPayWay = '' // 第一个选中支付方式
      for (const key in this.selectedOfflinePayMethods) {
        if (this.selectedOfflinePayMethods[key]) {
          selectedCount++
          firstPayWay = key
        }
      }
      // 选中第一个支付方式，支付金额设为实收金额
      if (selectedCount === 1) {
        this.form[firstPayWay] = this.realPayAmount
      }

      // 重置隐藏线下支付方式的支付金额
      this.offlinePayMethods.forEach(payMethod => {
        if (this.selectedOfflinePayMethods[payMethod.field]) {
          return
        }
        this.form[payMethod.field] = 0
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/styles/variables";
.offline-pay-method {
  display: flex;
  flex-wrap: wrap;

  .offline-pay-method-item {
    flex-basis: 134px;
    background-color: #f9f9f9;
    margin-top: 10px;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid #f9f9f9;
    margin-right: 10px;

    .pay-method-name {
      line-height: 20px;
    }

    .icon-checked {
      width: 8px;
      height: 8px;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: -9999;
    }

    &:hover, &.active {
      border-color: $color-theme;

      .icon-checked {
        z-index: 100;
      }
    }

    &:hover::after, &.active::after {
      content: '';
      width: 0;
      height: 0;
      border-left: 14px solid transparent;
      position: absolute;
      bottom: 0;
      right: 0;
      z-index: 99;
      border-bottom: 14px solid $color-theme;
    }

    .icon {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
}
</style>
