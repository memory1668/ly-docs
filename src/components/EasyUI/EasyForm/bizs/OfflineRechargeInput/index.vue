<template>
  <div class="offline-recharge-input">
    <div class="row-item">
      <!--      <div class="color-red mt-5 mr-3">*</div>-->
      <div class="pt-2 row-label"><span class="color-red">*</span>选择充值额度</div>
      <div class="flex-1">
        <el-radio-group v-model="selectedIndex" class="radio-group" @change="dealSelectItem">
          <template v-if="memberCardTemplate">
            <el-radio
              v-for="(item, index) in memberCardTemplate.recharge_boon_config.config"
              :key="index"
              :label="index"
              border
              class="radio"
            >￥{{ parseFloat(item.condition) }}</el-radio>
          </template>
          <el-radio
            :label="-1"
            border
            class="radio"
          >自定义</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div v-if="selectedIndex === -1" class="row-item mt-12">
      <div class="row-label">自定义金额</div>
      <el-input v-model="amount" placeholder="充值金额（一般情况下，充值金额等于实收金额）" @input="inputChange">
        <template #append>
          <span>元</span>
        </template>
      </el-input>
    </div>

    <div v-if="rechargeBoonAmount > 0" class="row-item mt-10">
      <div class="row-label">赠送金额</div>
      <div class="row-value">
        ￥{{ rechargeBoonAmount }}
      </div>
    </div>

    <div v-if="selectedBoonProducts.length > 0" class="row-item mt-1 mb-15">
      <div class="row-label">赠送酒水</div>
      <div class="row-value mt-10">
        <div v-for="(item, index) in selectedBoonProducts" :key="index" class="product-item">
          <img :src="item.product.cover" class="product-cover" mode="aspectFill">
          <div class="product-name">
            <div>{{ item.product.name + ' ' }}</div>
            <div v-if="item.sku.props.length > 0">
              <span
                v-for="(prop, propIndex) in item.sku.props"
                :key="propIndex"
                class="prop-item"
              >{{ prop.value + ' ' }}</span>
            </div>
            <div class="boon-num">x{{ item.num }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedBoonVoucherTemplates.length > 0" class="row-item mt-1">
      <div class="row-label">赠送优惠券</div>
      <div class="row-value mt-4">
        <div v-for="(item, index) in selectedBoonVoucherTemplates" :key="index" class="voucher-item">
          {{ item.template.name }} x{{ item.num }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiMemberCard from '@/api/member-card'

/**
 * 线下充值输入
 */
export default {
  name: 'OfflineRechargeInput',
  props: {
    /**
     * 传进来的值
     */
    value: {
      type: [Number, String, Object],
      default: ''
    }
  },
  data() {
    return {
      rechargeBoonAmount: 0,
      // 选择的充值项
      selectedIndex: -1,
      // 输入的金额
      amount: '',
      member_card_id: '', // 当前选中的会员卡id
      memberCardTemplate: null, // 当前选中会员卡的模板

      // 充值赠送酒水
      keyConditionMeetMapProducts: {},
      // 充值赠送优惠券模板
      keyConditionMeetMapVoucherTemplates: {},

      // 选中的充值金额对应的赠送酒水
      selectedBoonProducts: [],

      // 选中的充值金额对应的赠送优惠券模板
      selectedBoonVoucherTemplates: []
    }
  },

  watch: {
    amount(val) {
      this.$emit('input', {
        amount: val,
        memberCardTemplate: this.memberCardTemplate
      })
    }
  },

  methods: {
    watchForm(formData) {
      // console.log('线下充值输入', formData)
      // 重置
      if (!formData.member_card_id) {
        this.reset()
        return
      }
      // 同一张会员卡
      if (formData.member_card_id === this.member_card_id) {
        return
      }
      this.member_card_id = formData.member_card_id
      // 获取会员卡详情信息
      this.getMemberCardById(formData.member_card_id)
    },

    /**
     * 重置
     */
    reset() {
      this.selectedIndex = -1
      this.memberCardTemplate = null
      this.member_card_id = ''
      this.amount = ''
      this.rechargeBoonAmount = 0
      this.selectedBoonProducts = []
      this.selectedBoonVoucherTemplates = []
      this.keyConditionMeetMapProducts = {}
      this.keyConditionMeetMapVoucherTemplates = {}
    },

    /**
     * 通过会员卡id获取会员卡信息
     * @param id
     */
    async getMemberCardById(id) {
      try {
        const { data } = await apiMemberCard.getById(id)
        this.memberCardTemplate = data.member_card_template
        // 格式化会员卡模板不同充值与赠送酒水的映射关系
        const tmpKeyMapProduct = {}
        this.memberCardTemplate.boon_products.forEach(v => {
          if (!tmpKeyMapProduct[v.key_condition_meet]) {
            tmpKeyMapProduct[v.key_condition_meet] = []
          }
          tmpKeyMapProduct[v.key_condition_meet].push(v)
        })
        this.keyConditionMeetMapProducts = tmpKeyMapProduct
        // 格式化会员卡模板不同充值与赠送优惠券的映射关系
        const tmpKeyMapVoucherTemplate = {}
        this.memberCardTemplate.boon_voucher_templates.forEach(v => {
          if (!tmpKeyMapVoucherTemplate[v.key_condition_meet]) {
            tmpKeyMapVoucherTemplate[v.key_condition_meet] = []
          }
          tmpKeyMapVoucherTemplate[v.key_condition_meet].push(v)
        })
        this.keyConditionMeetMapVoucherTemplates = tmpKeyMapVoucherTemplate

        this.dealSelectItem(0)
        console.log('通过会员卡id获取会员卡信息成功', data)
      } catch (e) {
        console.error('通过会员卡id获取会员卡信息失败', e)
      }
    },

    /**
     * 键盘输入变化
     * @param e
     */
    inputChange(value) {
      // 格式化值
      this._formatAmount({
        value: value
      })
    },

    /**
     * 处理选中项
     * @param index
     */
    dealSelectItem(index) {
      this.selectedIndex = index
      if (!this.memberCardTemplate) {
        return
      }
      // 设置选中金额
      if (this.memberCardTemplate.recharge_boon_config.config) {
        this.amount = parseFloat(this.memberCardTemplate.recharge_boon_config.config[0].condition)
      }

      // 选择自定义
      if (this.selectedIndex === -1) {
        // 设置最低充值金额
        if (this.memberCardTemplate.is_non_first_recharge_limit) {
          this._formatAmount({
            value: parseFloat(this.memberCardTemplate.non_first_recharge_limit)
          })
        } else {
          this._formatAmount({
            // value: 0
            value: '' // 自定义金额初始化为空
          })
        }
      } else {
        // 设置选中金额
        this._formatAmount({
          value: parseFloat(this.memberCardTemplate.recharge_boon_config.config[index].condition)
        })
      }
    },

    /**
     * @param data
     * @private
     */
    _formatAmount(data) {
      const { value } = data
      this.amount = value
      // 计算赠送金额
      this._calculateBoonAmount()
    },

    /**
     * 计算充值赠送的额度
     * @private
     */
    _calculateBoonAmount() {
      if (!this.memberCardTemplate) {
        return
      }
      const configLength = this.memberCardTemplate.recharge_boon_config.config.length
      const rechargeBoonType = this.memberCardTemplate.recharge_boon_type
      for (let i = (configLength - 1); i >= 0; i--) {
        const item = this.memberCardTemplate.recharge_boon_config.config[i]
        const condition = parseFloat(item.condition)
        console.log('condition: ', condition, '  amount: ', this.amount)
        if (condition <= this.amount) {
          if (rechargeBoonType === 1) { // 按百分比赠送
            this.rechargeBoonAmount = this.amount * parseFloat(item.meet) / 100
          } else { // 固定金额赠送
            this.rechargeBoonAmount = parseFloat(item.meet)
          }

          // 设置选中的充值金额对应的赠送酒水
          const key = rechargeBoonType + '_' + parseFloat(item.condition) + '_' + parseFloat(item.meet)
          if (!this.keyConditionMeetMapProducts[key]) {
            this.selectedBoonProducts = []
          } else {
            this.selectedBoonProducts = this.keyConditionMeetMapProducts[key]
          }
          // 设置选中的充值金额对应的赠送优惠券
          if (!this.keyConditionMeetMapVoucherTemplates[key]) {
            this.selectedBoonVoucherTemplates = []
          } else {
            this.selectedBoonVoucherTemplates = this.keyConditionMeetMapVoucherTemplates[key]
          }
          break
        } else {
          this.rechargeBoonAmount = 0
          this.selectedBoonProducts = [] // 清空选中的赠送商品
          this.selectedBoonVoucherTemplates = [] // 清空选中的赠送优惠券模板
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .offline-recharge-input {
    //margin-left: -15px;
    .row-item {
      background-color: white;
      display: flex;
      flex-direction: row;
      //border-bottom: 1px solid #fafafa;
    }

    .row-label {
      //padding: 15px;
      color: #606266;
      font-weight: 700;
      width: 140px;
      flex-shrink: 0;
    }

    .row-value {
      flex: 1;
      //text-align: right;
      //padding: 15px;
    }

    .row-value.not-selected {
      color: #999;
    }

    .radio-group {
      display: flex;
      flex-wrap: wrap;
      .radio {
        flex-basis: calc(33.33% - 7px);
        &:not(:nth-child(3n + 3)) {
          margin-right: 10px;
        }
      }
      /deep/ .el-radio {
        margin: 0;
        margin-bottom: 10px;
      }
    }
  }

  /*赠送酒水商品*/
  .product-item {
    display: flex;
    margin-top: 5px;
    justify-content: right;
    align-items: center;
    white-space: pre-wrap;
  }

  .product-item:first-child {
    margin-top: 0;
  }

  .product-cover {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    margin-right: 5px;
  }

  .product-name {
    display: flex;
  }

  .voucher-item {
    line-height: 2em;
  }
</style>
