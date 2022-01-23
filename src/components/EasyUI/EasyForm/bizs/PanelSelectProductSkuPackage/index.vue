<template>
  <div :class="{'panel-active': list.length > 0, 'panel-category': dealCategory}">
    <div v-if="list.length > 0" class="flex mb-10">
      <!-- 显示商品的分类 -->
      <div v-if="dealCategory" class="w-180 pt-15 mr-15">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="vertical"
          active-text-color="#303133"
          @select="changeCategory"
        >
          <el-menu-item
            v-for="(category,index) in categoryList"
            :key="category.id"
            :index="'' +index"
          >
            <div class="flex flex-1" style="align-items: center;">
              <div class="mt-0">
                <el-image style="width: 20px;height: 20px;border-radius: 3px;" :src="category.icon" fit="fill" />
              </div>
              <span class="ml-15 fz-15 bold flex-1" :style="{'color': activeIndex === '' + index ? '#ff0089' : ''}">{{ category.name }}</span>
            </div>
          </el-menu-item>
        </el-menu>
      </div>

      <div class="flex-1">
        <template v-for="(item, checkedIndex ) in list">
          <div v-if="!dealCategory || !item.category || (item.category.id === categoryList[activeIndex].id)" :key="'checked-' +checkedIndex" class="selected-item">
            <!--套餐-->
            <div v-if="item.type === 2" class="flex">
              <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="item.package.cover" fit="fill" />

              <div class="ml-15 flex-1">
                <div class="flex mt-2">
                  <span class="fz-15 bold mr-15 product-name">{{ item.package.name }}</span>
                </div>
                <div class="mt-5 fz-13">
                  <span class="color-red">￥{{ parseFloat(item.package.price) }}</span>
                </div>
                <div v-if="showPackageProducts && item.package.buy_products.length" class="mt-5" style="line-height: 1.2em;">
                  <div>包含{{ item.package.is_choose_any && !showConfigNum ? `（任选${item.package.choose_any_num}）`: '' }}</div>
                  <div v-for="(bp, bpIndex) in item.package.buy_products" :key="bpIndex">
                    <div v-if="!showConfigNum" class="mt-5">{{ bp.product.name }}{{ item.package.is_choose_any ? '': ` x ${ bp.num }` }}</div>
                    <div v-else-if="bp.selected_num > 0" class="mt-5">
                      <span class="mr-5">{{ bp.product.name }}</span>
                      <span
                        v-for="(skuProp, skuPropIndex) in bp.sku.props"
                        :key="skuPropIndex"
                        class="mr-5"
                      >
                        {{ skuProp.value }}
                      </span>
                      <span>x {{ bp.selected_num }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="showPackageProducts && item.package.present_products.length" class="mt-10" style="line-height: 1.2em;">
                  <div>赠送{{ item.package.is_present_choose_any && !showConfigNum ? `（任选${item.package.present_choose_any_num}）`: '' }}</div>
                  <div v-for="(pp, ppIndex) in item.package.present_products" :key="ppIndex">
                    <div v-if="!showConfigNum" class="mt-5">{{ pp.product.name }}{{ item.package.is_present_choose_any ? '': ` x ${ pp.num }` }}</div>
                    <div v-else-if="pp.selected_num > 0" class="mt-5">
                      <span class="mr-5">{{ pp.product.name }}</span>
                      <span
                        v-for="(skuProp, skuPropIndex) in pp.sku.props"
                        :key="skuPropIndex"
                        class="mr-5"
                      >
                        {{ skuProp.value }}
                      </span>
                      <span>x {{ pp.selected_num }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="showConfigNum" class="mt-0">
                <el-input-number
                  v-model="list[checkedIndex].num"
                  size="mini"
                  :min="1"
                  @change="changeInputNum($event, checkedIndex)"
                />
              </div>

              <div class="ml-15 pt-2 fz-18">
                <i class="el-icon-circle-close  icon-remove" @click="removeItem($event, 2, checkedIndex, item.package.id)" />
              </div>
            </div>

            <!--商品-->
            <div v-if="item.type === 1" class="flex">
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
                  <el-tag v-if="item.suit" size="mini" type="primary" class="ml-5">{{ item.suit.name }} </el-tag>
                  <span v-if="!item.suit" class="mr-5 color-red">￥{{ parseFloat(item.sku.price) }}</span>
                  <span v-else class="mr-5 color-red">￥{{ parseFloat(item.suit.price) }}</span>
                </div>
                <div v-else class="mt-5 fz-13">
                  <el-tag v-if="item.suit" size="mini" type="primary" class="ml-5">{{ item.suit.name }} </el-tag>
                  <span v-if="!item.suit" class="mr-5 color-red">￥{{ parseFloat(item.sku.price) }}</span>
                  <span v-else class="mr-5 color-red">￥{{ parseFloat(item.suit.price) }}</span>
                </div>
              </div>

              <div v-if="showConfigNum" class="mt-0">
                <el-input-number
                  v-model="list[checkedIndex].num"
                  size="mini"
                  :min="1"
                  @change="changeInputNum($event, checkedIndex)"
                />
              </div>

              <div class="ml-15 pt-2 fz-18">
                <i class="el-icon-circle-close icon-remove" @click="removeItem($event, 1, checkedIndex, item.sku.id)" />
              </div>
            </div>
          </div>
        </template>
      </div>

    </div>

    <div class="flex">
      <el-button type="default" icon="el-icon-plus" @click="clickAdd">选择商品</el-button>
      <div v-if="showTotalAmount && totalAmount > 0" class="flex-1 text-right"><span class="mr-10">小计</span> <span class="total-amount">￥{{ parseInt(totalAmount) === totalAmount ? totalAmount : totalAmount.toFixed(2) }}</span></div>
    </div>

    <dialog-select-product-sku-package
      v-model="list"
      v-bind="$attrs"
      :visible.sync="dialogVisible"
      :show-config-num="showConfigNum"
      @close="handleCloseDialog"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import DialogSelectProductSkuPackage from '../DialogSelectProductSkuPackage/index'
import apiCategory from '@/api/category'

const TYPE_PRODUCT = 1
const TYPE_PACKAGE = 2

export default {
  name: 'PanelSelectProductSkuPackage',
  components: { DialogSelectProductSkuPackage },

  props: {

    /**
     * 传进来的值
     */
    value: {
      type: Array,
      default: () => {
        return []
      }
    },

    /**
     * 显示配置数量
     */
    showConfigNum: {
      type: Boolean,
      default: true
    },

    /**
     * 显示小计
     */
    showTotalAmount: {
      type: Boolean,
      default: true
    },

    /**
     * 商品数据是否携带分类信息
     */
    dealCategory: {
      type: Boolean,
      default: false
    },

    /**
     * 显示套餐包含的商品
     */
    showPackageProducts: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {

      dialogVisible: false,

      // 用于展示
      list: [
        // {
        //   sku: {},
        //   product: {}
        // }
      ],
      listCategories: [],

      activeIndex: '0' // 当前选中分类
    }
  },

  computed: {
    /**
     * 所选商品总金额
     */
    totalAmount() {
      let amount = 0
      this.list.forEach(item => {
        if (item.type === TYPE_PRODUCT) {
          if (!item.suit) {
            amount += parseFloat(item.sku.price) * item.num
          } else {
            amount += parseFloat(item.suit.price) * item.num
          }
        } else if (item.type === TYPE_PACKAGE) {
          amount += parseFloat(item.package.price) * item.num
        } else {
          console.log('invalid type: ', item)
        }
      })
      return amount
    },

    // 选中商品/套餐的分类列表
    categoryList() {
      const categories = []
      this.list.forEach(item => {
        if (!item.category) {
          return
        }
        if (!categories.some(category => category.id === item.category.id)) {
          categories.push(item.category)
        }
      })
      return categories
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
        // 如果空值，则返回
        if (!val || val.length === 0) {
          this.clear()
          return
        }

        // 如果已经初始化过，不进行初始化，不进行初始化
        if (this.list.length > 0) {
          return
        }

        this.initData(val)
      }
    },

    /**
     * 监听分类长度变化
     */
    categoryList: {
      handler(val) {
        // 更新之后的类别长度小于上一次选中的下标，重置下标
        if (val.length <= parseFloat(this.activeIndex)) {
          this.activeIndex = '0'
        }
      }
    }
  },

  created() {
    this.list = []
  },

  methods: {

    /**
     * 清空
     */
    clear() {
      this.list = []
      this.activeIndex = '0'
    },

    /**
     * 初始化数据
     */
    async initData(val) {
      const selectedProductSkuPackageMap = {}
      val.forEach(item => {
        if (item.type === TYPE_PRODUCT) {
          selectedProductSkuPackageMap[item.product_id + '-' + item.sku_id] = item
        }
        if (item.type === TYPE_PACKAGE) {
          selectedProductSkuPackageMap[item.package_id] = item
        }
      })
      try {
        const listCategories = await this.listProductSkuPackages()
        const list = []
        listCategories.forEach(category => {
          // 商品
          if (category.type === TYPE_PRODUCT) {
            // 找到当前选中商品
            category.products.forEach(product => {
              // 找到当前选中sku
              product.skus.forEach(sku => {
                const key = product.id + '-' + sku.id
                if (selectedProductSkuPackageMap[key] && selectedProductSkuPackageMap[key].sku_id === sku.id) {
                  list.push({
                    ...selectedProductSkuPackageMap[key],
                    product,
                    sku,
                    category
                  })
                }
              })
            })
          }
          // 商品
          if (category.type === TYPE_PACKAGE) {
            // 找到当前选中套餐
            category.packages.forEach(pkg => {
              if (selectedProductSkuPackageMap[pkg.id]) {
                list.push({
                  ...selectedProductSkuPackageMap[pkg.id],
                  category,
                  package: pkg
                })
              }
            })
          }
        })
        this.list = list
        // console.log('初始化数据成功', listCategories, list)
      } catch (e) {
        console.error('初始化数据失败', e)
      }
    },

    /**
     * 获取所有分类和商品信息
     */
    async listProductSkuPackages() {
      try {
        const { data } = await apiCategory.listProductSkuPackages()
        this.listCategories = data.list
        // console.log('获取所有分类和商品信息成功', data)
        return data.list
      } catch (e) {
        console.error('获取所有分类和商品信息失败', e)
        throw e
      }
    },

    /**
     * emit input 的值
     */
    emitInput() {
      this.$nextTick(() => {
        const val = []
        this.list.forEach((v) => {
          if (v.type === TYPE_PRODUCT) {
            const tmpProd = {
              type: v.type,
              product_id: v.product_id,
              sku_id: v.sku_id,
              num: v.num
            }
            if (v.suit) {
              tmpProd.product_suit_id = v.suit.id
            }
            val.push(tmpProd)
          } else { // 套餐
            // 2.1 获取套餐选中的单品和配置的数量
            const detail = {
              buy_products: [],
              present_products: []
            }

            v.package.buy_products.forEach(bp => {
              if (bp.selected_num <= 0) {
                return
              }
              detail.buy_products.push({
                product_id: bp.product_id,
                sku_id: bp.sku_id,
                num: bp.selected_num
              })
            })

            v.package.present_products.forEach(pp => {
              if (pp.selected_num <= 0) {
                return
              }
              detail.present_products.push({
                product_id: pp.product_id,
                sku_id: pp.sku_id,
                num: pp.selected_num
              })
            })

            val.push({
              type: v.type,
              package_id: v.package_id,
              num: v.num,
              detail: detail
            })
          }
        })

        console.log('emit panel select product sku package: ', val)
        this.$emit('input', val)
      })
    },

    /**
     * 确认选择事件
     */
    handleConfirm(checkedList) {
      // checkedList.forEach(item => {
      //   // 如果已经选过，忽略
      //   for (let i = 0; i < this.list.length; i++) {
      //     if ((item.type === TYPE_PRODUCT && this.list[i].sku_id === item.sku_id) ||
      //       (item.type === TYPE_PACKAGE && this.list[i].package_id === item.package_id)) {
      //       if (item.type === TYPE_PRODUCT) {
      //         this.$message.warning(`商品[${item.product.name}]已选择过，忽略选择`)
      //       } else {
      //         this.$message.warning(`套餐[${item.package.name}]已选择过，忽略选择`)
      //       }
      //       return
      //     }
      //   }
      //
      //   // 添加到选中队列
      //   this.list.push(item)
      // })

      console.log('-->', this.list)
      this.emitInput()
    },

    /**
     * 弹框关闭事件
     */
    handleCloseDialog(e) {
      this.dialogVisible = false
    },

    /**
     * 添加
     */
    clickAdd(e) {
      this.dialogVisible = true
    },

    /**
     * 数量变更
     * @param num
     * @param skuId
     */
    changeInputNum(num, skuId) {
      this.emitInput()
    },

    /**
     * 移除产品项
     * @param e
     * @param type
     * @param index
     * @param targetId
     */
    removeItem(e, type, index, targetId) {
      this.$confirm('确认移除该商品项？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === TYPE_PRODUCT) {
          this.list = this.list.filter(item => item.type === TYPE_PACKAGE || item.sku_id !== targetId) // 删除sku_id等于当前targetId的商品
        } else if (type === TYPE_PACKAGE) {
          this.list = this.list.filter(item => item.type === TYPE_PRODUCT || item.package_id !== targetId) // 删除package_id等于当前targetId的套餐
        } else {
          this.list.splice(index, 1)
        }
        // 分类下没有商品/套餐 重置选中分类为第一个
        if (this.dealCategory && !this.categoryList[this.activeIndex]) {
          this.activeIndex = '0'
        }
        this.emitInput()
      }).catch(() => {})
    },

    /**
     * 选择其他分类
     */
    changeCategory(index) {
      this.activeIndex = '' + index
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-active {
    border: 1px solid #f3f3f3;
    padding: 0 15px 15px;
    border-radius: 5px;
  }
  .panel-category {
    margin-top: 40px;
    margin-left: -180px;
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

  .selected-item {
    border-bottom: 1px solid #f6f6f6;
    /*background-color: rgba(255, 86, 0, 0.07);*/
    padding: 15px 0;
  }

  .total-amount {
    color: #ff0089;
    font-size: 18px;
    font-weight: bold;
  }
</style>
