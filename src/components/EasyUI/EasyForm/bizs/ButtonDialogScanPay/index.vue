<template>
  <div>
    <div class="w-180">
      <el-button icon="el-icon-full-screen" type="default" @click="openDialogScanPay">主扫（微信/支付宝）
      </el-button>
    </div>
    <!--扫码支付-->
    <el-dialog
      class="scan-pay"
      title="扫码支付（商家扫顾客）"
      :visible.sync="isDialogScanVisible"
      width="600px"
      append-to-body
      :show-close="false"
      :close-on-click-modal="false"
    >
      <div v-if="orderDetail && orderDetail.status === ORDER_STATUS_FINISHED" class="scan-pay-result">
        <i class="el-icon-success" />
        <div>支付成功！<span class="bold color-theme">（￥{{ successPaidAmount }})</span></div>
      </div>
      <div v-else-if="orderDetail && orderDetail.status === ORDER_STATUS_PAID_FAILED" class="scan-pay-result">
        <i class="el-icon-error" />
        <div>支付失败</div>
      </div>
      <div v-else class="scan-button">
        <div class="aic">
          <i class="el-icon-full-screen" />
          <div>使用扫码枪或者扫码盒扫描客户微信或支付宝二维码</div>
        </div>
        <div v-show="isMergePaying" class="aic ml-15 scan-pay-loading">
          <i class="el-icon-loading mr-3" />
          <div class="fz-12 loading-text">支付中...</div>
        </div>
      </div>
      <div slot="footer" class="dialog-scan-footer">
        <div v-if="!orderDetail || orderDetail.status !== ORDER_STATUS_FINISHED" class="total-pay-amount">合计：<span
          class="bold color-theme"
        >￥{{ form.real_pay_amount }}</span></div>
        <el-button
          v-if="orderDetail && orderDetail.status === ORDER_STATUS_FINISHED"
          type="primary"
          @click="handleFinishPay"
        >完成支付
        </el-button>
        <el-button
          v-else-if="orderDetail && orderDetail.status === ORDER_STATUS_PAID_FAILED"
          type="primary"
          @click="handleResetScanPay"
        >重新支付
        </el-button>
        <el-button v-else type="primary" :loading="cancelLoading" @click="handleCancelScanPay">取消支付</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiOrder from '@/api/order'
import axios from '@/utils/request'

export default {
  name: 'ButtonDialogScanPay',
  props: {
    // 支付要提交的数据
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    // 支付url
    payUrl: {
      type: String,
      default: ''
    },
    // 取消支付url
    cancelPayUrl: {
      type: String,
      default: ''
    },
    // 打开支付弹框后查询订单是否处于支付中状态的配置
    checkOrderPayingOption: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      ORDER_STATUS_PAID_FAILED: apiOrder.STATUS_PAID_FAILED, // 订单失败状态
      ORDER_STATUS_FINISHED: apiOrder.STATUS_FINISHED, // 订单成功状态
      isDialogScanVisible: false, // 扫码支付弹框是否可见
      isMergePaying: false, // 是否合并线上支付中
      cancelLoading: false,
      orderId: '', // 扫码支付订单id
      orderDetail: null,
      successPaidAmount: 0, // 成功支付金额
      timer: null,
      code: ''
    }
  },
  watch: {
    isDialogScanVisible: {
      handler(val) {
        if (val) {
          document.onkeydown = this.handleScanCode
          if (!this.isMergePaying) {
            this.checkOrderPaying()
          }
          return
        }
        document.onkeydown = null // 取消监听扫码
        this.handleResetScanPay()
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 打开扫码支付弹框
     */
    openDialogScanPay() {
      // 未选中收银员
      if (!this.form.cashier_staff_id) {
        this.$message.error('请先选择收银员')
        return
      }
      this.isDialogScanVisible = true
    },

    /**
     * 完成支付
     */
    handleFinishPay() {
      this.isDialogScanVisible = false
      this.$root.$emit('global::desk-scan-pay-click-success')
      // this.closedDialog()
    },

    /**
     * 重新扫码支付
     */
    handleResetScanPay() {
      this.orderDetail = null
      this.orderId = ''
    },

    /**
     * 扫码回调
     */
    handleScanCode(e) {
      let nextCode
      let nextTime = ''
      const lastTime = this.lastTime
      let code = this.code
      if (window.event) { // IE
        nextCode = e.keyCode
      } else if (e.which) { // Netscape/Firefox/Opera
        nextCode = e.which
      }
      nextTime = new Date().getTime()
      // 字母上方 数字键0-9 对应键码值 48-57; 数字键盘 数字键0-9 对应键码值 96-105
      if ((nextCode >= 48 && nextCode <= 57) || (nextCode >= 96 && nextCode <= 105)) {
        const codes = {
          '48': 48, '49': 49, '50': 50, '51': 51, '52': 52, '53': 53, '54': 54, '55': 55, '56': 56, '57': 57,
          '96': 48, '97': 49, '98': 50, '99': 51, '100': 52, '101': 53, '102': 54, '103': 55, '104': 56, '105': 57
        }
        nextCode = codes[nextCode]
        nextTime = new Date().getTime()
      }
      // 第二次输入延迟两秒，删除之前的数据重新计算
      if (nextTime && lastTime && nextTime - lastTime > 2000) {
        code = String.fromCharCode(nextCode)
      } else {
        code += String.fromCharCode(nextCode)
      }
      // 保存数据
      this.nextCode = nextCode
      this.lastTime = nextTime
      this.code = code
      // console.log('监听扫码', e, this.code, code.length)
      // 键入Enter(扫码结束)
      if (e.which === 13) {
        // code = $.trim(code) // 去除首尾空格
        code = code.slice(0, code.length - 1)// 去除回车
        if (code.length === 18) {
          this.submitPay(code)
          console.log('付款码:' + code)
        } else if (code.length === 0) {
          console.log('请输入条码')
          this.$message.warning('付款码为空')
        } else {
          this.$message.warning('付款码无效')
          console.log('条码不合法：' + code)
        }
        // 键入回车务必清空code值
        this.code = ''
        return false
      }
    },

    /**
     * 提交支付
     * @param {string} code 付款码
     */
    async submitPay(code) {
      if (this.isMergePaying) {
        this.$message.error('交易进行中，请稍后')
        return
      }
      if (this.orderDetail && this.orderDetail.status === this.ORDER_STATUS_FINISHED) {
        this.$message.warning('订单已支付成功')
        return
      }
      if (this.orderDetail && this.orderDetail.status === this.ORDER_STATUS_PAID_FAILED) {
        this.$message.warning('请先点击重新支付')
        return
      }
      if (!this.payUrl) {
        console.error('没有配置扫码支付请求的url')
        return
      }
      try {
        this.isMergePaying = true
        this.successPaidAmount = this.form.real_pay_amount // 保存实际支付金额
        const { data } = await axios.request({
          url: this.payUrl,
          method: 'POST',
          data: {
            pay_code: code,
            ...this.form
          }
        })
        this.$root.$emit('global::desk-pay-submit-success')
        console.log('合并扫码支付', data)
        this.orderId = data.order_id // 保存订单id, 用于取消支付
        this.startTimerRefreshOrder(data.order_id)
      } catch (e) {
        console.log('合并扫码支付失败', e)
        this.isMergePaying = false
      }
    },

    /**
     * 启动刷新订单定时器
     */
    startTimerRefreshOrder(orderId) {
      if (this.timer) {
        return
      }
      this.timer = setInterval(() => {
        this.getOrderDetail(orderId)
      }, 2000)
    },

    /**
     * 清除定时器
     */
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },

    /**
     * 获取订单详情
     * @param id
     * @returns {*}
     */
    async getOrderDetail(id) {
      try {
        const { data } = await apiOrder.getById(id)
        this.orderDetail = data
        console.log('获取订单详情成功', data)
        //  支付成功 || 支付失败
        if (data.status === apiOrder.STATUS_FINISHED || data.status === apiOrder.STATUS_PAID_FAILED) {
          data.status === apiOrder.STATUS_FINISHED && this.$root.$emit('global::desk-pay-success')
          this.isMergePaying = false
          this.clearTimer()
        }
      } catch (e) {
        console.error('获取订单详情成功失败', e)
      }
    },

    /**
     * 点击取消扫码支付
     */
    handleCancelScanPay() {
      // 还未提交订单
      if (!this.orderId) {
        this.isDialogScanVisible = false
        return
      }
      this.$confirm('确定取消支付？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cancelPay()
      }).catch(() => {
      })
    },

    /**
     * 取消支付
     */
    async cancelPay() {
      if (!this.cancelPayUrl) {
        console.error('没有配置取消扫码支付请求的url')
        return
      }
      try {
        this.cancelLoading = true
        await axios.request({
          url: this.cancelPayUrl.replace(/\{id\}/, this.orderId),
          method: 'PUT'
        })
        this.$root.$emit('global::cancel-desk-pay-success')
        this.$message.warning('已取消支付')
        this.isDialogScanVisible = false
        this.isMergePaying = false
        this.clearTimer()
        console.log('取消合并扫码支付成功')
      } catch (e) {
        console.error('取消合并扫码支付失败', e)
      } finally {
        this.cancelLoading = false
      }
    },

    /**
     * 查询订单是否处于支付中状态
     */
    async checkOrderPaying() {
      if (!this.checkOrderPayingOption || !this.form.order_id) {
        console.log('查询订单是否处于支付中状态失败，没有订单id或没有配置查询参数')
        return
      }
      try {
        const { data } = await axios.request({
          url: this.checkOrderPayingOption.url.replace(/\{id\}/, this.form.order_id), // 替换url中的{id}占位符
          method: 'GET'
        })
        if (data.order) {
          this.orderId = data.order.id // 保存订单id, 用于取消支付
          this.isMergePaying = true
          this.startTimerRefreshOrder(data.order.id)
        }
        console.log('查询订单是否处于支付中状态成功', data)
      } catch (e) {
        console.error('查询订单是否处于支付中状态失败', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables";

.scan-pay {
  /deep/ .el-dialog__body {
    padding-bottom: 10px;
  }
}

.scan-pay-result {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin: 30px 0;

  i {
    margin-right: 10px;
    font-size: 28px;
  }
}

.el-icon-success {
  color: $color-success;
}

.el-icon-error {
  color: $color-danger;
}

.scan-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  margin: 30px;
  border: 1px solid $color-theme;

  i {
    color: $color-theme;
  }

  .el-icon-full-screen {
    margin-right: 15px;
    font-size: 28px;
  }

  .scan-pay-loading {
    color: $color-theme;

    .loading-text {
      line-height: 14px;
    }
  }
}

.dialog-scan-footer {
  display: flex;
  justify-content: center;
  position: relative;

  .total-pay-amount {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;

    span {
      font-size: 16px;
    }
  }
}
</style>
