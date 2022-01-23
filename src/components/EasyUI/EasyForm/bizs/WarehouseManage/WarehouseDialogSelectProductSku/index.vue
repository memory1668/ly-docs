<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      width="1000px"
      top="9vh"
      @closed="closedDialog"
    >
      <div slot="title">选择商品</div>
      <div class="flex">
        <div class="mt-5 flex-1">
          <div class="mb-10">
            <el-input v-model="keyword" placeholder="搜索商品" class="input-with-select" :clearable="true" @change="searchKeyword">
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
          <div class="flex ">
            <div class="w-200">
              <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="vertical"
                :default-openeds="openedIndexes"
              >
                <el-submenu
                  v-for="(category,index) in categoryProducts"
                  :key="category.id"
                  :index="'' +index"
                >
                  <template slot="title"><i class="el-icon-d-arrow-right" /> {{ category.name }}</template>
                  <el-menu-item
                    v-for="(subCategory,subCategoryIndex) in category.sub_categories"
                    :key="subCategory.id + '-' +subCategoryIndex "
                    :index="'' +index + '-' + subCategoryIndex"
                    :disabled="!subCategory.is_show"
                    @click="changeCategory(index, subCategoryIndex)"
                  >{{ subCategory.name }}</el-menu-item>
                </el-submenu>

              </el-menu>
            </div>

            <div class="flex-1 pl-15 pr-15">
              <div v-if="!products || products.length === 0" class="empty-product-box">
                <div class="fz-42">
                  <i class="el-icon-document-remove" />
                </div>
                <div class="fz-14 mt-5">暂无商品</div>
              </div>
              <div
                v-for="(product) in products"
                :key="product.id"
              >
                <div v-if="product.is_show" class="product-item">
                  <div class="flex">
                    <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="product.cover" fit="fill" />
                    <div class="ml-15 flex-1">
                      <div class="flex">
                        <span class="fz-15 bold mr-15">{{ product.name }}</span>
                        <!--<div style="margin-top: -2px;">-->
                        <!--<el-tag v-if="product.status" type="success" size="mini">已上架</el-tag>-->
                        <!--<el-tag v-else type="info" size="mini">已下架</el-tag>-->
                        <!--</div>-->
                      </div>
                      <div class="fz-13 pt-7">
                        <span class="color-red">￥{{ product.price_range }}</span>
                      </div>
                    </div>

                    <div v-if="!product.has_many_sku" class="pt-10">
                      <el-checkbox
                        v-model="checked[product.w_skus[0].id]"
                        size="mini"
                        border
                        @change="checkSku($event, product.w_skus[0], product)"
                      >选择</el-checkbox>
                    </div>
                  </div>

                  <!--多 sku 的情况-->
                  <div v-if="product.has_many_sku" class="sku-box">
                    <div v-for="(sku, skuIndex) in product.w_skus" :key="skuIndex" class="flex sku-row">
                      <div class="pt-15 pb-15 flex-1 fz-14">
                        <span
                          v-for="(skuProp, skuPropIndex) in sku.props"
                          :key="skuPropIndex"
                          class="bold mr-5"
                        >{{ skuProp.name }}:{{ skuProp.value }}</span>
                        <span class="ml-15 fz-13">￥{{ parseFloat(sku.price) }}</span>
                      </div>

                      <div class="pt-10">
                        <el-checkbox v-model="checked[sku.id]" size="mini" border @change="checkSku($event, sku, product)">选择</el-checkbox>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        <div class="mod ml-15" style="width: 300px;">
          <div class="title">已选商品</div>

          <div v-if="checkedList.length === 0" class="mt-10 empty-select">暂未选择商品</div>
          <div v-if="checkedList.length > 0" class="mb-10">
            <div v-for="(item, checkedIndex ) in checkedList" :key="'checked-' +checkedIndex" class="selected-item">
              <!--商品-->
              <div class="flex">
                <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="item.product.cover" fit="fill" />

                <div class="ml-15 flex-1">
                  <div class="flex mt-2">
                    <span class="fz-15 bold mr-15 product-name">{{ item.product.name }}</span>
                  </div>
                  <div v-if="item.product.has_many_sku" class="mt-5 fz-13">
                    <el-tag size="mini" type="primary">
                      <span
                        v-for="(skuProp, skuPropIndex) in item.sku.props"
                        :key="skuPropIndex"
                        class="bold mr-5"
                      >{{ skuProp.name }}:{{ skuProp.value }}</span>
                    </el-tag>
                    <span class="mr-5 color-red">￥{{ parseFloat(item.sku.price) }}</span>
                  </div>
                </div>

                <div class="ml-15 pt-2 fz-18">
                  <i class="el-icon-circle-close icon-remove" @click="removeItem($event, 1, item.sku.id, checkedIndex)" />
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
import apiWarehouseCategory from '@/api/warehouse/category'

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
    }
  },

  data() {
    return {
      dialogVisible: true,

      // 分类展开的下标
      openedIndexes: [],

      activeIndex: '0',

      checked: {},

      checkedSkuId: '',
      checkedSku: null,
      checkedProduct: null,

      // [
      //   {category => products => skus}
      // ]
      categoryProducts: [],
      products: [], // 选中的分类的所有商品

      keyword: '',

      // 已选商品列表
      checkedList: []
    }
  },

  watch: {

    visible(val) {
      this.dialogVisible = val
    },

    /**
     * 搜索商品
     */
    keyword(val) {
      this.searchKeyword(val)
    }
  },

  created() {
    this.dialogVisible = this.visible
    this.allCategoryProducts()
  },

  methods: {
    /**
     * 搜索关键字变化
     */
    searchKeyword(keyword) {
      // 重新选择激活的分类
      let isReseletActive = false

      this.categoryProducts.forEach((v, index) => {
        v.sub_categories.forEach((sv, subIndex) => {
          let isAllHidden = true
          sv.w_products.forEach((prod, prodIndex) => {
            if (!keyword || prod.name.indexOf(keyword) >= 0) {
              sv.w_products[prodIndex].is_show = true
              isAllHidden = false

              // 重新选择分类
              if (!isReseletActive) {
                this.changeCategory(index, subIndex)
                isReseletActive = true
              }
            } else {
              sv.w_products[prodIndex].is_show = false
            }
          })

          sv.is_show = !isAllHidden
        })
      })

      console.log(this.categoryProducts)
    },
    /**
     * 选中 SKU
     */
    checkSku(isChecked, sku, product) {
      if (isChecked) { // 选中，添加到选中列表
        this.checkedList.push({
          product: product,
          sku: sku
        })
      } else { // 取消选中，移除
        let targetIndex = -1
        for (let i = 0; i < this.checkedList.length; i++) {
          if (this.checkedList[i].sku.id === sku.id) {
            targetIndex = i
            break
          }
        }

        if (targetIndex >= 0) {
          this.checkedList.splice(targetIndex, 1)
        }
      }
    },

    /**
     * 移除
     */
    removeItem(e, type, targetId, checkedIndex) {
      this.$confirm('确定移除商品？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // const removedItem = this.checkedList[checkedIndex]
        this.checkedList.splice(checkedIndex, 1)
        this.$set(this.checked, targetId, false)
      }).catch(() => {
      })
    },

    /**
     * 移除已选择商品
     */
    removeAll() {
      this.checkedList = []
      Object.keys(this.checked).forEach(v => {
        this.$set(this.checked, v, false)
      })
    },

    /**
     * 选择其他分类
     */
    changeCategory(index, subCategoryIndex) {
      this.activeIndex = '' + index + '-' + subCategoryIndex
      this.products = this.categoryProducts[index].sub_categories[subCategoryIndex].w_products
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
      this.$emit('input', this.checkedList)
      this.$emit('confirm', this.checkedList)
      this.setDialogVisible(false)
    },

    /**
     * 获取所有分类和商品信息
     */
    allCategoryProducts() {
      apiWarehouseCategory.allGroupedCategoryProducts().then(res => {
        res.data.list.forEach((v, index) => {
          v.sub_categories.forEach((sv, subIndex) => {
            sv.w_products.forEach((prod, prodIndex) => {
              sv.w_products[prodIndex].is_show = true
            })

            if (sv.w_products.length > 0) {
              sv.is_show = true
            } else {
              sv.is_show = false
            }
          })
        })
        this.categoryProducts = res.data.list

        // 默认展开所有
        this.categoryProducts.forEach((v, index) => {
          this.openedIndexes.push('' + index)
        })

        // 默认选中第一个分类
        if (this.categoryProducts.length > 0 && this.categoryProducts[0].sub_categories.length > 0) {
          this.changeCategory(0, 0)
        }
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
      this.checked[this.checkedSkuId] = false
      this.checkedSkuId = ''
      this.checkedSku = null
      this.checkedProduct = null

      // 默认选中第一个分类
      if (this.categoryProducts.length > 0 && this.categoryProducts[0].sub_categories.length > 0) {
        this.changeCategory(0, 0)
      }

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

  .empty-select {
    padding: 15px;
    background-color: rgba(255, 86, 0, 0.07);
    color: #ff0089;
    text-align: center;
    border-radius: 5px;
  }

  .empty-product-box {
    margin-top: 15px;
    background-color: #f9f9f9;
    text-align: center;
    padding: 30px;
    color: #999;
  }

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

  .selected-item {
    border-bottom: 1px dashed rgba(255, 86, 0, 0.21);
    background-color: rgba(255, 86, 0, 0.07);
    border-radius: 5px;
    padding: 15px;

    &:last-child {
      border-bottom: none;
    }
  }

</style>
