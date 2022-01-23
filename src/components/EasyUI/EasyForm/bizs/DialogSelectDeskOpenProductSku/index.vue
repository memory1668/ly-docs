<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="700px"
      top="8vh"
      @closed="closedDialog"
    >
      <div slot="title">当前台位出品过的商品</div>
      <div class="flex mt-5">
        <div class="flex-1 pl-15 pr-15">
          <div v-if="list.length === 0" class="empty-product-box">
            <div class="fz-42">
              <i class="el-icon-document-remove" />
            </div>
            <div class="fz-14 mt-5">台位暂无出品过商品</div>
          </div>
          <div
            v-for="(item, itemIndex) in list"
            :key="'sku'+item.sku.id"
          >
            <div class="product-item">
              <div class="flex">
                <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="item.product.cover" fit="fill" />
                <div class="ml-15 flex-1">
                  <div class="flex">
                    <span class="fz-15 bold mr-15">{{ item.product.name }}</span>
                    <!--                    <div style="margin-top: -2px;">-->
                    <!--                      <el-tag v-if="item.product.status" type="success" size="mini">已上架</el-tag>-->
                    <!--                      <el-tag v-else type="info" size="mini">已下架</el-tag>-->
                    <!--                    </div>-->
                  </div>
                  <div class="fz-13 pt-7">
                    <el-tag
                      v-for="(skuProp, skuPropIndex) in item.sku.props"
                      :key="skuPropIndex"
                      type="primary"
                      size="mini"
                      class="bold mr-5"
                    >{{ skuProp.name }}:{{ skuProp.value }}</el-tag>
                    <span class="color-red">￥{{ parseFloat(item.sku.price) }}</span>
                    <!--                    <span class="ml-15">库存: {{ item.product.inventory }} {{ item.product.unit }}</span>-->
                  </div>
                </div>

                <div class="pt-10">
                  <el-checkbox
                    v-model="item.is_checked"
                    size="mini"
                    border
                    @change="checkSku($event, itemIndex, item.sku, item.product)"
                  >选择</el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" icon="el-icon-check" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiDeskOpen from '@/api/desk-open'

export default {
  name: 'DialogSelectProductSku',
  components: {},

  props: {

    /**
     * 是否显示
     */
    visible: {
      type: Boolean,
      default: false
    },

    /**
     * 台位 ID
     */
    deskId: {
      type: String,
      default: ''
    }

  },

  data() {
    return {
      dialogVisible: true,

      // 商品列表
      list: []
    }
  },

  watch: {

    visible(val) {
      this.dialogVisible = val

      if (this.dialogVisible && this.deskId) {
        this.getOrderProducts()
      }
    },

    /**
     * 监听台位 ID 变化
     */
    deskId: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('--> desk id: ', val)
        if (val) {
          this.getOrderProducts()
        }
      }
    }
  },

  created() {
    this.dialogVisible = this.visible
  },

  methods: {
    /**
     * 选中 SKU
     */
    checkSku(e, itemIndex, sku, product) {
      console.log('itemIndex: ', itemIndex, 'sku: ', sku, 'product: ', product)
    },

    /**
     * 取消
     */
    cancel() {
      this.setDialogVisible(false)
      this.$emit('cancel')
    },

    /**
     * 确定选择
     */
    confirm() {
      const data = []
      this.list.forEach(v => {
        if (!v.is_checked) {
          return
        }

        data.push(v)
      })

      this.$emit('input', data)
      this.$emit('confirm', data)
      this.setDialogVisible(false)
    },

    /**
     * 获取开台记录的商品信息
     */
    getOrderProducts() {
      apiDeskOpen.getOrderProducts(this.deskId).then(res => {
        console.log('product info: ', res)
        res.data.list.forEach(v => {
          v.is_checked = false
        })

        this.list = res.data.list
      }).catch(e => {
        console.log(e)
        this.$message.error('获取产品信息失败，请重试')
      })
    },

    /**
       * 设置弹框是否可见
       * @param flag
       */
    setDialogVisible(flag) {
      this.dialogVisible = flag
    },

    /**
       * 关闭弹窗时的回调
       */
    closedDialog() {
      //  清空数据
      this.setDialogVisible(false)
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>

  .product-item {
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f3f3f3;
  }

  .sku-box {
    padding-left: 70px;

    .sku-row {
      border-bottom: 1px solid #f3f3f3;
      &:last-child {
        border-bottom: none;
      }
    }
  }

  .empty-product-box {
    background-color: #f9f9f9;
    text-align: center;
    padding: 30px;
    color: #999;
  }

</style>
