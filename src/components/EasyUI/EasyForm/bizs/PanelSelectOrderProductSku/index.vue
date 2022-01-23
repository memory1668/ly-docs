<template>
  <div :class="{'panel-active': list.length > 0}">
    <div v-if="list.length === 0" class="empty-order-make-item">当前订单暂无可退商品。</div>
    <div v-if="list.length > 0">
      <div
        v-for="(item,index ) in list"
        :key="index"
        class="product-item"
      >
        <div class="flex">
          <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="item.cover" fit="fill" />

          <div class="ml-15 flex-1">
            <div class="flex mt-2">
              <span class="fz-15 bold mr-15 product-name">{{ item.name }}</span>
            </div>
            <div class="mt-0 fz-13">
              <!-- 显示规格 -->
              <!-- <el-tag v-if="item.sku && item.sku.props.length > 0" size="mini" type="primary">
                <span
                  v-for="(skuProp, skuPropIndex) in item.sku.props"
                  :key="skuPropIndex"
                  class="bold mr-5"
                >{{ skuProp.name }}:{{ skuProp.value }}</span>
              </el-tag> -->

              <!-- 显示套装 -->
              <el-tag v-if="parseFloat(item.product_suit_id)" size="mini" type="primary">
                <span>{{ item.product_suit_name }}</span>
              </el-tag>
              <span class="mr-5 color-red">￥{{ parseFloat(item.pay_price) }}</span>
            </div>
          </div>

          <div class="mt-2">
            <el-input-number
              v-model="list[index].selected_num"
              size="small"
              :min="0"
              :max="item.refund_remain_count"
              @change="changeInputNum($event, index)"
            />
          </div>

        </div>
      </div>

      <div v-if="remainAmounts && summaryAmount >= 0" class="remain-amount">
        <div class="line-title mt-15 mb-10">剩余可退款金额</div>
        <template v-for="(item, index) in remainAmountOptions">
          <div v-if="parseFloat(remainAmounts[item.field]) > 0" :key="index" class="remain-amount-item">
            <div class="aic mt-8">
              <img :src="item.icon" class="pay-way-icon">
              <div class="remain-amount-price">{{ item.name }} <span class="color-red">￥{{ parseFloat(remainAmounts[item.field]) }}</span></div>
            </div>
            <div class="refund-amounts">
              <el-input v-model="refundAmounts[item.refundField]" placeholder="实际退款金额" size="small">
                <template slot="prepend">实际退款</template>
                <template slot="append">元</template>
              </el-input>
              <!--              <div v-if="refundAmounts[item.refundField] === ''">请输入{{ item.name }}实际退款金额</div>-->
              <div v-if="refundAmounts[item.refundField] === ''" class="validate-info color-red">请输入{{ item.name }}实际退款金额</div>
              <div v-else-if="isNaN(Number(refundAmounts[item.refundField]))" class="validate-info color-red">请输入数字</div>
              <div v-else-if="refundAmounts[item.refundField] > parseFloat(remainAmounts[item.field]) || refundAmounts[item.refundField] < 0" class="validate-info color-red">{{ item.name }}退款金额应在0-{{ parseFloat(remainAmounts[item.field]) }}之间</div>
            </div>
          </div>
        </template>
      </div>

      <!--      <div v-if="summaryAmount > 0" class="flex mt-10">-->
      <!--        <div class="flex-1">-->
      <!--          <el-input v-model="refundAmount" placeholder="请填写实际退款金额">-->
      <!--            <template slot="prepend">实际退款</template>-->
      <!--            <template slot="append">元</template>-->
      <!--          </el-input>-->
      <!--        </div>-->

      <div v-if="summaryAmount >= 0" class="text-right ml-30 mt-10"><span class="mr-10">汇总</span> <span
        class="total-amount"
      >￥{{ summaryAmount }}</span></div>
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import apiOrder from '@/api/order'
import apiCustomOfflinePayMethods from '@/api/custom-offline-pay-methods'

export default {
  name: 'PanelSelectProductSku',
  components: {},

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

    /**
     * 要查询的订单 ID
     */
    orderId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      // 用于展示
      list: [
        // {
        //   sku: {},
        //   product: {}
        // }
      ],

      // 实际退款金额
      refundAmounts: {},

      remainAmounts: null, // 订单剩余可退金额

      customOfflineRemainAmountOption: null // 自定义线下支付方法列表
    }
  },

  computed: {
    /**
     * 汇总金额
     */
    summaryAmount() {
      let amount = 0
      let flag = false // 是否选中商品
      this.list.forEach(v => {
        if (parseFloat(v.selected_num) && !flag) {
          flag = true
        }
        if (parseFloat(v.pay_price) === 0) {
          return
        }

        amount += parseFloat(v.pay_price) * v.selected_num
      })
      return flag ? amount : -1
    },

    // 剩余可退款金额配置
    remainAmountOptions() {
      const options = [
        {
          name: '微信支付',
          field: 'wechat_remain_amount', // 可退款金额字段
          refundField: 'wechat_refund_amount', // 实际退款金额字段
          icon: require('@/assets/images/icon-wechat-pay.png')
        },
        {
          name: '支付宝',
          field: 'alipay_remain_amount',
          refundField: 'alipay_refund_amount',
          icon: require('@/assets/images/icon-alipay.png')
        },
        {
          name: '(线下) 微信支付',
          field: 'offline_wechat_remain_amount',
          refundField: 'offline_wechat_refund_amount',
          icon: require('@/assets/images/icon-wechat-pay.png')
        },
        {
          name: '(线下) 支付宝',
          field: 'offline_alipay_remain_amount',
          refundField: 'offline_alipay_refund_amount',
          icon: require('@/assets/images/icon-alipay.png')
        },
        {
          name: '现金',
          field: 'offline_cash_remain_amount',
          refundField: 'offline_cash_refund_amount',
          icon: require('@/assets/images/icon-cash-pay.png')
        },
        {
          name: '刷卡',
          field: 'offline_card_remain_amount',
          refundField: 'offline_card_refund_amount',
          icon: require('@/assets/images/icon-card-pay.png')
        },
        {
          name: '会员卡支付',
          field: 'member_card_remain_amount',
          refundField: 'member_card_refund_amount',
          icon: require('@/assets/images/icon-card-pay.png')
        },
        {
          name: '挂账',
          field: 'hang_debt_remain_amount',
          refundField: 'hang_debt_refund_amount',
          icon: require('@/assets/images/icon-custom-pay.png')
        }
      ]
      if (this.customOfflineRemainAmountOption) {
        return [
          ...options,
          ...this.customOfflineRemainAmountOption
        ]
      }
      return options
    }
  },

  watch: {
    /**
     * 监听传进来的值变更
     */
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!Object.keys(val).length) {
          this.initRemainOrder()
        }
      }
    },

    refundAmounts: {
      immediate: true,
      deep: true,
      handler() {
        this.emitInput()
      }
    }

  },

  created() {
    this.initRemainOrder()
  },

  methods: {
    /**
     * 初始化剩余订单
     */
    async initRemainOrder() {
      this.getOrderMakeItems()
      try {
        await this.getOrdersRemainAmounts()
        if (!this.customOfflineRemainAmountOption) {
          await this.getCustomOfflineRemainAmountOption()
        }
        this.initRefundAmounts()
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * 获取订单出品详情
     */
    getOrderMakeItems() {
      apiOrder.getRemainOrderItem(this.orderId).then(res => {
        res.data.forEach(v => {
          v.selected_num = 0
        })
        this.list = res.data
      }).catch(e => {
        console.log(e)
      })
    },

    /**
     * 初始化数据
     */
    initData(val) {
      this.getOrderMakeItems()
    },

    /**
     * emit input 的值
     */
    emitInput() {
      this.$nextTick(() => {
        const val = []
        this.list.forEach((v) => {
          if (v.selected_num <= 0) {
            return
          }

          val.push({
            order_make_id: v.id,
            product_id: v.product_id,
            sku_id: v.sku_id,
            num: v.selected_num
          })
        })

        const totalRefund = this.getTotalRefund() // 实际退款汇总信息

        this.$emit('input', {
          amounts: { ...this.refundAmounts },
          product_sku_config: val,
          totalRefund
        })
      })
    },

    /**
     * 获取实际退款总额
     */
    getTotalRefund() {
      let total = 0
      let totalRefund = ''// 实际退款汇总信息
      this.remainAmountOptions.forEach(option => {
        const refundAmount = parseFloat(this.refundAmounts[option.refundField])
        if (refundAmount > 0) {
          total += refundAmount
          totalRefund += `${option.name}￥${refundAmount} + `
        }
      })
      totalRefund = totalRefund.substring(0, totalRefund.length - 3) // 删除最后一个加号
      return `实际退款总额为￥${total}${totalRefund ? '（' + totalRefund + '）' : ''}`
    },

    /**
     * 数量变更
     * @param num
     * @param index
     */
    changeInputNum(num, index) {
      console.log('数量变更', num, index)
      this.list[index].selected_num = num
      this.emitInput()
    },

    /**
     * 获取订单剩余可退款金额
     */
    async getOrdersRemainAmounts() {
      try {
        const { data } = await apiOrder.getOrdersRemainAmounts(this.orderId)
        this.remainAmounts = data
        console.log('获取订单剩余可退款金额成功', data)
      } catch (e) {
        console.error('获取订单剩余可退款金额失败', e)
        throw e
      }
    },

    /**
     * 获取自定义线下可退款金额配置
     */
    async getCustomOfflineRemainAmountOption() {
      try {
        const { data } = await apiCustomOfflinePayMethods.getCustomOfflinePayMethods()
        this.customOfflineRemainAmountOption = data.map(item => ({
          ...item,
          field: item.field.replace('pay', 'remain'),
          refundField: item.field.replace('pay', 'refund'),
          icon: require('@/assets/images/icon-custom-pay.png')
        }))
        console.log('获取自定义线下可退款金额配置成功', data)
      } catch (e) {
        console.error('获取自定义线下可退款金额配置失败', e)
        throw e
      }
    },

    /**
     * 初始化实际退款金额
     */
    initRefundAmounts() {
      const refundAmounts = {}
      this.remainAmountOptions.forEach(option => {
        refundAmounts[option.refundField] = parseFloat(this.remainAmounts[option.field])
      })
      this.refundAmounts = refundAmounts
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-order-make-item {
  padding: 30px;
  color: #ff0089;
  background-color: rgba(255, 0, 134, 0.05);
  border-radius: 5px;
}

.panel-active {
  border: 1px solid #f3f3f3;
  padding: 15px;
  border-radius: 5px;
}

.product-item {
  padding: 10px 0;
  border-bottom: 1px solid #f3f3f3;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
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

.product-name {
  line-height: 1em;
}

.choose-any-tip {
  line-height: 1.6em;
  margin-top: 15px;
  font-size: 14px;
  color: #999;
}

.total-amount {
  color: #ff0089;
  font-size: 18px;
  font-weight: bold;
}

.remain-amount-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .pay-way-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }

  .remain-amount-price {
    max-width: 260px;
    line-height: 20px;
  }
}

.refund-amounts {
  width: 260px;
  padding-bottom: 16px;
  position: relative;

  .validate-info {
    font-size: 12px;
    line-height: 12px;
    position: absolute;
    left: 0;
    bottom: 4px;
  }
}
</style>
