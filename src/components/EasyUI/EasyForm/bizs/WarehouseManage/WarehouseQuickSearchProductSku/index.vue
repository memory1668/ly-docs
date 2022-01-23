<template>
  <div>
    <el-select
      v-model="skuId"
      style="width: 100%;"
      filterable
      placeholder="例如：名仕可以输入ms"
      remote
      :loading="loading"
      :remote-method="search"
      :disabled="disabled"
    >
      <el-option
        v-for="(item, index) in skus"
        :key="item.value + '_' + index"
        :label="item.label"
        :value="item.value"
      >
        <div class="flex option-item">
          <span>{{ item.label }}</span>
          <span class="inventory">库存: {{ item.inventory }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script>
import ApiSku from '@/api/warehouse/sku'

export default {
  name: 'WarehouseQuickSearchProduct',

  props: {
    value: {
      type: String,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * 传入一个选项，这样在展示的时候就不用请求数据
     * 否则如果入库很多商品，查看入库单时会同时发出很多请求
     */
    option: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      skus: [],
      // currentSelect: null,
      skuId: '',
      loading: false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.skuId = val
      }
    },
    option: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val || Object.keys(val).length === 0) {
          return
        }
        this.skus = [val]
      }
    },
    skuId: {
      immediate: true,
      handler(val) {
        if (this.skuId === this.value) {
          return
        }
        this.$emit('input', val)
      }
    }
  },
  methods: {
    search(query) {
      this.loading = true
      ApiSku.quickSearch({
        keyword: query
      })
        .then(res => {
          this.skus = res.data
          this.loading = false
        })
        .catch(err => {
          console.error(err)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .option-item {
    justify-content: space-between;
    .inventory {
      font-size: 12px;
      color: #999;
      flex-shrink: 0;
      padding-left: 15px;
    }
  }
</style>
