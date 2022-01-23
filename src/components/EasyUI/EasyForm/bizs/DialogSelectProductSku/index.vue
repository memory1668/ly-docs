<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="700px"
      top="9vh"
      @closed="closedDialog"
    >
      <div slot="title">选择商品</div>
      <el-input
        v-model="keyword"
        placeholder="搜索商品"
        class="input-with-select"
        clearable
        @change="searchKeyword"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <div class="flex mt-5">
        <div class="w-180">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="vertical"
            @select="changeCategory"
          >
            <el-menu-item
              v-for="(category,index) in categoryProducts"
              :key="category.id"
              :index="'' +index"
              :disabled="!category.is_show"
            >
              <div class="flex" style="align-items: center;">
                <div class="flex flex-1" style="align-items: center;">
                  <div class="mt-0">
                    <el-image style="width: 20px;height: 20px;border-radius: 3px;" :src="category.icon" fit="fill" />
                  </div>
                  <span class="ml-15 fz-15 bold flex-1 line-1">{{ category.name }}</span>
                </div>
                <!-- 新增选择按钮 -->
                <!--                <el-checkbox-->
                <!--                  v-if="selectAll"-->
                <!--                  v-model="checked['' + index]"-->
                <!--                  size="mini"-->
                <!--                  class="all-select"-->
                <!--                  @change="changeAllSelect($event, category)"-->
                <!--                />-->
              </div>
            </el-menu-item>
          </el-menu>
        </div>

        <div class="flex-1 pl-15 pr-15">
          <div v-if="activeListLength === 0" class="empty-product-box">
            <div class="fz-42">
              <i class="el-icon-document-remove" />
            </div>
            <div class="fz-14 mt-5">暂无商品</div>
          </div>
          <div v-else class="select-all">
            <div class="bold">商品列表({{ activeListLength }})</div>
            <el-checkbox
              v-if="selectAll"
              v-model="checked[activeIndex]"
              size="mini"
              border
              @change="changeAllSelect($event, categoryProducts[activeIndex])"
            >
              {{ checked[activeIndex] ? '全不选' : '全选' }}
            </el-checkbox>
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
                    <div style="margin-top: -2px;">
                      <el-tag v-if="product.status" type="success" size="mini">已上架</el-tag>
                      <el-tag v-else type="info" size="mini">已下架</el-tag>
                    </div>
                  </div>
                  <div class="fz-13 pt-7">
                    <span class="color-red">￥{{ product.price_range }}</span>
                    <span class="ml-15">库存: {{ product.inventory }} {{ product.unit }}</span>
                  </div>
                </div>

                <div v-if="!product.has_many_sku" class="pt-10">
                  <el-checkbox
                    v-if="product.skus[0].status && product.skus[0].status !== 0 || !showEmpty"
                    v-model="checked[product.skus[0].id]"
                    size="mini"
                    border
                    @change="checkSku($event, product.skus[0], product)"
                  >选择</el-checkbox>
                  <el-tag v-else>已售空</el-tag>
                </div>
              </div>

              <!--多 sku 的情况-->
              <div v-if="product.has_many_sku" class="sku-box">
                <div v-for="(sku, skuIndex) in product.skus" :key="skuIndex" class="flex sku-row">
                  <div class="pt-15 pb-15 flex-1 fz-14">
                    <span
                      v-for="(skuProp, skuPropIndex) in sku.props"
                      :key="skuPropIndex"
                      class="bold mr-5"
                    >{{ skuProp.name }}:{{ skuProp.value }}</span>
                    <span class="ml-15 fz-13">￥{{ parseFloat(sku.price) }}</span>
                    <span class="ml-10 fz-13">库存 {{ sku.inventory }} {{ product.unit }}</span>
                  </div>

                  <div class="pt-10">
                    <el-checkbox v-if="sku.status && sku.status !== 0 || !showEmpty" v-model="checked[sku.id]" size="mini" border @change="checkSku($event, sku, product)">选择</el-checkbox>
                    <el-tag v-else>已售空</el-tag>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div v-if="showButton || inverse" slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiCategory from '@/api/category'

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
     * 是否开启全选按钮
     */
    selectAll: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示底部按钮
     */
    showButton: {
      type: Boolean,
      default: false
    },
    /**
     * 传过来的商品数据
     */
    productList: {
      type: Array,
      default: null
    },
    /**
     * 商品下架状态是否显示已售空
     */
    showEmpty: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialogVisible: true,
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
      selectData: [], // 选中的商品数据
      inverse: false, // 是否反选
      keyword: ''
    }
  },

  computed: {
    /**
     * 当前分类商品列表长度
     */
    activeListLength() {
      if (!this.products) {
        return 0
      }
      console.log('当前分类商品列表长度', this.products.filter(item => item.is_show).length)
      return this.products.filter(item => item.is_show).length
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
    },
    products: {
      deep: true,
      handler(val) {
        console.log('products change', val)
      }
    }
  },

  created() {
    this.dialogVisible = this.visible
    this.allCategoryProducts()
  },

  methods: {
    /**
     * 用于一开始传进来数值进行选中
     * 格式化选中的数据
     */
    handlerUpdate(data) {
      console.log('用于一开始传进来数值进行选中', data)
      this.inverse = true
      this.selectData = JSON.parse(JSON.stringify(data))
      this.selectData.forEach(item => {
        this.$set(this.checked, `${item.sku.id}`, true)
      })
      this.initIsSelectAll()
    },
    /**
     * 点击全选
     */
    changeAllSelect(e, category) {
      this.$set(this.checked, `${category.id}`, e)
      this.selectAllProduct(e)
    },
    /**
     * 选中全部商品
     */
    selectAllProduct(flag) {
      this.categoryProducts[this.activeIndex].products.forEach(product => {
        // 商品分为单规格和多规格
        if (!product.has_many_sku) {
          this.checkAllSku(flag, product.skus[0], product)
        } else {
          product.skus.forEach(sku => {
            this.checkAllSku(flag, sku, product)
          })
        }
      })
    },
    /**
     * 选中所有 SKU
     */
    checkAllSku(e, sku, product) {
      // 不选中已售空sku
      if (this.showEmpty && sku.status === 0) {
        return
      }
      if (!this.showButton) {
        this.checked[this.checkedSkuId] = false
        this.checked[sku.id] = true
        this.checkedSkuId = sku.id
        this.checkedSku = sku
        this.checkedProduct = product
        this.selectData = {
          sku: this.checkedSku,
          product: this.checkedProduct
        }
        this.confirm()
      } else {
        this.$set(this.checked, `${sku.id}`, e)
        this.checkedSkuId = sku.id
        this.checkedSku = sku
        this.checkedProduct = product
        if (e) {
          // 判断当前是否已经选中该商品
          let flag = false
          this.selectData.forEach(item => {
            if (item.sku.id === this.checkedSkuId && !flag) {
              flag = true
            }
          })
          if (flag) {
            return
          }
          this.selectData.push({
            sku: this.checkedSku,
            product: this.checkedProduct,
            category: {
              id: this.categoryProducts[parseFloat(this.activeIndex)].id,
              icon: this.categoryProducts[parseFloat(this.activeIndex)].icon,
              name: this.categoryProducts[parseFloat(this.activeIndex)].name
            }
          })
        } else {
          this.selectData.forEach((item, index) => {
            if (item.sku.id === this.checkedSku.id) {
              this.selectData.splice(index, 1)
            }
          })
        }
      }
    },
    /**
     * 选中 SKU
     */
    checkSku(e, sku, product) {
      // 没有设置底部按钮，单选
      if (!this.showButton) {
        this.checked[this.checkedSkuId] = false
        this.checked[sku.id] = true
        this.checkedSkuId = sku.id
        this.checkedSku = sku
        this.checkedProduct = product
        this.selectData = {
          sku: this.checkedSku,
          product: this.checkedProduct
        }
        this.confirm()
      } else {
        this.checked[sku.id] = e
        if (!e) {
          this.checked[this.activeIndex] = false
        } else {
          this.initIsSelectAll()
        }
        this.checkedSkuId = sku.id
        this.checkedSku = sku
        this.checkedProduct = product
        if (e) {
          this.selectData.push({
            sku: this.checkedSku,
            product: this.checkedProduct,
            category: {
              id: this.categoryProducts[parseFloat(this.activeIndex)].id,
              icon: this.categoryProducts[parseFloat(this.activeIndex)].icon,
              name: this.categoryProducts[parseFloat(this.activeIndex)].name
            }
          })
        } else {
          this.selectData.forEach((item, index) => {
            if (item.sku.id === this.checkedSku.id) {
              this.selectData.splice(index, 1)
            }
          })
        }
      }
    },

    /**
     * 选择其他分类
     */
    changeCategory(index) {
      this.activeIndex = '' + index
      this.products = this.categoryProducts[this.activeIndex].products
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
      this.$emit('input', this.selectData)
      this.$emit('confirm', this.selectData)
      this.setDialogVisible(false)
    },

    /**
     * 获取所有分类和商品信息
     */
    allCategoryProducts() {
      apiCategory.allCategoryProducts().then(res => {
        this.categoryProducts = res.data.list
        this.categoryProducts.forEach(category => {
          category.is_show = category.products && category.products.length > 0 // 初始化商品分类是否显示字段
          category.products.forEach(product => {
            product.is_show = true // 初始化商品是否显示字段
          })
        })
        if (this.categoryProducts.length > 0) {
          this.activeIndex = '0'
          this.products = this.categoryProducts[this.activeIndex].products
        }
        this.initIsSelectAll()
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
      Object.keys(this.checked).forEach(item => {
        this.checked[item] = false
      })
      this.selectData = []
      this.checkedSkuId = ''
      this.checkedSku = null
      this.checkedProduct = null

      this.activeIndex = '0'
      this.products = this.categoryProducts[this.activeIndex].products
      this.keyword = ''

      this.setDialogVisible(false)
      this.$emit('close')
    },

    /**
     * 搜索关键字变化
     */
    searchKeyword(keyword) {
      // 重新选择激活的分类
      let isReseletActive = false
      this.categoryProducts.forEach((category, index) => {
        let isAllHidden = true
        const list = category.products
        console.log('搜索关键字变化', keyword, list === this.products)
        list.forEach((prod, prodIndex) => {
          // 搜索关键字为空 || 找到包含关键字的套餐/商品
          if (!keyword || prod.name.indexOf(keyword) >= 0) {
            list[prodIndex].is_show = true
            isAllHidden = false

            // 重新选择分类
            if (!isReseletActive) {
              this.changeCategory(index)
              isReseletActive = true
            }
          } else {
            list[prodIndex].is_show = false
          }
        })
        category.is_show = !isAllHidden
      })
      this.products = [...this.categoryProducts[this.activeIndex].products]
      this.initIsSelectAll()
    },

    /**
     * 查找当前是否存在全部选中的分类
     */
    initIsSelectAll() {
      this.categoryProducts.forEach((category, index) => {
        // 不查找当前隐藏分类
        if (!category.is_show) {
          return
        }
        let flag = true
        // 判断当前选中的分类是否是全选
        if (!category.products.length) {
          flag = false
        }
        category.products.forEach(product => {
          if (!flag) {
            return
          }
          // 隐藏商品视为已选中
          if (!product.is_show) {
            return
          }
          if (!product.has_many_sku) {
            // 售空sku视为已选中
            if (this.showEmpty && product.skus[0].status === 0) {
              return
            }
            if (!this.checked[product.skus[0].id]) {
              flag = false
            }
          } else {
            product.skus.forEach(sku => {
              // 售空sku视为已选中
              if (this.showEmpty && sku.status === 0) {
                return
              }
              if (!this.checked[sku.id]) {
                flag = false
              }
            })
          }
        })
        this.$set(this.checked, `${'' + index}`, flag)
      })
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

  .select-all {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }

  // 全选
  .all-select {
    display: block;
    margin-left: 10px;
  }
  .line-1 {
    // width: 0;

    // white-space: normal;
    // overflow: hidden;
    // text-overflow: ellipsis;
  }

  .el-menu-demo {
    margin-left: -15px;
  }
</style>
