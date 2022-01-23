<template>
  <div>

    <div v-if="product" class="product">
      <div class="flex">
        <el-image class="w-120 h-120 round" :src="product.cover" fit="cover" style="flex-shrink: 0" />

        <div class="ml-15">
          <div class="lh name">{{ product.name }}</div>
          <div class="flex lh mt-5">
            <div><el-tag type="success" size="mini">{{ warehouseType === 1 ? '总仓' : (warehouseType === 2 ? '吧台仓' : '未知') }}</el-tag></div>
            <div class="ml-15">
              <el-tag v-if="product.has_many_sku" size="mini">{{ product.w_skus.length }} 个规格</el-tag>
              <el-tag v-else size="mini" type="warning">单品</el-tag>
            </div>
          </div>
          <div class="flex mt-10">
            <div class="lh">售价：<span class="color-red bold">￥{{ product.price_range }}</span></div>
            <div class="ml-15 lh">库存：<span class="bold">{{ product.warehouse_product.inventory }} {{ product.unit }}</span></div>
          </div>
          <div class="mt-10 lh">简介：{{ product.description ? product.description : '暂无简介' }}</div>
        </div>
      </div>

      <div class="sku-box">
        <div class="bold lh mb-10">商品规格</div>
        <div
          v-for="(sku, index) in product.w_skus "
          :key="index"
          class="flex sku-row lh"
        >
          <div
            class="pt-8 pb-8 flex-1 fz-14"
          >
            <span class="bold mr-5">规格 {{ index + 1 }}</span>
            <span class="bold mr-5">
              <el-tag
                v-for="(skuProp, skuPropIndex) in sku.props"
                :key="skuPropIndex"
                type="primary"
                size="mini"
              >{{ skuProp.value }}</el-tag>
            </span>
            <span class="ml-15 fz-13">售价 <span class=" color-red bold">￥{{ parseFloat(sku.price) }}</span></span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="reSelectable" :class="{'mt-15': !!product}">
      <el-button type="default" icon="el-icon-search" @click="clickSelect">{{ product ? '重选商品' : '选择商品' }}</el-button>
    </div>

    <!--选择商品-->
    <dialog-select-warehouse-product ref="dialogSelectWarehouseProduct" :limit="1" @confirm="handleConfirmSelectProduct" />
  </div>
</template>

<script>

import apiWarehouseProduct from '@/api/warehouse/warehouse-product'
import DialogSelectWarehouseProduct from './components/DialogSelectWarehouseProduct/index'

// const TYPE_TOTAL = 1 // 总仓
const TYPE_BAR = 2 // 吧台

export default {
  name: 'PanelSelectWarehouseProduct',
  components: { DialogSelectWarehouseProduct },

  props: {

    /**
     * 传进来的值
     */
    value: {
      type: String,
      default: ''
    },

    /**
     * 要进行仓库商品选择的仓库类型
     */
    warehouseType: {
      type: Number,
      default: () => {
        return TYPE_BAR
      }
    },

    /**
     * 是否可以重选
     */
    reSelectable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      product: null
    }
  },

  computed: {

  },

  watch: {

    value: {
      immediate: true,
      handler(val) {
        if (!val || typeof (val) === 'object') {
          this.product = null
          return
        }

        // 加载商品
        this.getWarehouseProductDetail(val)
      }
    }

  },

  created() {

  },

  methods: {

    /**
     * 确定选择商品
     * @param list
     */
    handleConfirmSelectProduct(list) {
      if (list.length < 1) {
        this.$message.error('未选择商品')
        return
      }

      this.product = list[0].product
      this.$emit('input', this.product.id)
    },

    /**
     * 点击选择商品
     */
    clickSelect() {
      this.$refs.dialogSelectWarehouseProduct.groupedCategoriesBarProducts() // 更新商品数据
      this.$refs.dialogSelectWarehouseProduct.setDialogVisible(true)
    },

    /**
     * 获取仓库产品详情
     * @param id
     */
    getWarehouseProductDetail(id) {
      apiWarehouseProduct.getWarehouseProductDetail(id).then(res => {
        this.product = res.data.w_product
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.lh {
  line-height: 1.7em;
}

.product {
  background: #fafafa;
  padding: 15px;
  border-radius: 5px;

 .name {
   font-size: 16px;
   font-weight: bold;
 }

}
.sku-box {
  margin-top: 10px;

  .sku-row {
    border-top: 1px dashed #f0f0f0;
    &:last-child {
      border-bottom: 1px dashed #f0f0f0;
    }
  }
}

</style>
