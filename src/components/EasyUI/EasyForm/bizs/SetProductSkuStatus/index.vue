<template>
  <div>
    <div v-if="skus.length" class="sku-box">
      <div
        v-for="(sku, index) in skus"
        :key="index"
        class="flex sku-row lh"
      >
        <div
          class="pt-8 pb-8 fz-14 sku flex-1"
        >
          <div class="flex-1">
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
            <span class="ml-15 fz-13">库存 <span class=" color-red bold ml-5">{{ parseFloat(sku.inventory) }}{{ sku.unit }}</span></span>
          </div>
          <el-switch
            v-model="sku.status"
            style="display: block;"
            active-text="上架"
            inactive-text="下架"
            class="ml-20"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SetProductSkuStatus',
  components: {},
  props: {
    /**
       * v-model 选中的值
       */
    value: {
      type: [String, Number, Object, Array],
      default: ''
    }
  },
  data: function() {
    return {
      skus: [] // 商品规格
    }
  },
  watch: {
    skus: {
      deep: true,
      handler(val) {
        // 格式化当前的数据
        const formValue = []
        val.forEach(sku => {
          formValue.push({
            id: sku.id,
            status: sku.status ? 1 : 0
          })
        })
        this.$emit('input', formValue)
      }
    },

    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val.length || !val[0].props) {
          return
        }
        val.forEach(sku => {
          if (sku.status && sku.status !== 0) {
            // sku.status_flag = true
            sku.status = true
          } else {
            // sku.status_flag = false
            sku.status = false
          }
        })
        this.skus = val
      }
    }
  },
  created() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .sku {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 200px;
  }

lh {
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
  margin-top: -8px;
  .sku-row {
    border-bottom: 1px dashed #f0f0f0;
    &:last-child {
      // border-bottom: 1px dashed #f0f0f0;
    }
  }
}
</style>
