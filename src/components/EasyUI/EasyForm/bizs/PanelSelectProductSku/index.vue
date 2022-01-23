<template>
  <div :class="{'panel-active': list.length > 0, 'panel-categroy': hasCategory}">
    <div v-if="list.length > 0" class="flex mb-10">
      <!-- 显示商品的分类 -->
      <div v-if="hasCategory" class="w-180">
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
      <div :class="{'flex-1': true, ' pl-15 pr-15': hasCategory}">
        <template v-for="(item, index) in list">
          <div
            v-if="!categoryList.length || item.category && item.category.id === categoryList[parseFloat(activeIndex)].id"
            :key="index"
            class="product-item"
          >
            <div class="flex">
              <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="item.product.cover" fit="fill" />
              <div class="ml-15 flex-1">
                <div class="flex mt-2">
                  <span class="fz-15 bold mr-15 product-name">{{ item.product.name }}</span>
                </div>
                <div v-if="item.product.has_many_sku" class="mt-0 fz-13">
                  <el-tag size="mini" type="primary">
                    <span
                      v-for="(skuProp, skuPropIndex) in item.sku.props"
                      :key="skuPropIndex"
                      class="bold mr-5"
                    >{{ skuProp.name }}:{{ skuProp.value }}</span>
                  </el-tag>
                  <span class="mr-5 color-red">￥{{ parseFloat(item.sku.price) }}</span>
                </div>
                <div v-else class="mt-0 fz-13">
                  <span class="color-red">￥{{ parseFloat(item.sku.price) }}</span>
                </div>
              </div>
              <div v-if="showConfigNum" class="mt-2">
                <el-input-number
                  v-model="skuIdMapNum[item.sku.id]"
                  size="small"
                  :min="0"
                  @change="changeInputNum($event, item.sku.id)"
                />
              </div>
              <div v-if="isPkgChooseAny" class="mt-2 ml-30">
                <el-switch
                  v-model="skuIdMapIsChooseAny[item.sku.id]"
                  active-text="可任选"
                  inactive-text="不任选"
                  @change="changeIsChooseAny"
                />
                <!--<el-input-number-->
                <!--v-model="skuIdMapNum[item.sku.id]"-->
                <!--size="small"-->
                <!--:min="0"-->
                <!--@change="changeInputNum($event, item.sku.id)"-->
                <!--/>-->
              </div>
              <div class="ml-15 pt-2 fz-18">
                <i class="el-icon-circle-close  icon-remove" @click="removeItem($event, index, item.sku.id)" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div>
      <el-button type="default" icon="el-icon-plus" @click="clickAdd">选择商品</el-button>
    </div>

    <div v-if="showChooseAnyTip" class="choose-any-tip">提示：当未开任选模式，则表示商品在套餐中的数量；当开启任选模式，则表示任选时增加/减少的步长（任选数量只计算可任选的商品数量汇总）。</div>

    <dialog-select-product-sku
      ref="dialogSelectProductSku"
      :visible.sync="dialogVisible"
      :select-all="selectAll"
      :show-button="inverse ? true : showButton"
      :show-empty="showEmpty"
      @close="handleCloseDialog"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
import DialogSelectProductSku from '../DialogSelectProductSku/index'
import apiSku from '@/api/sku'

export default {
  name: 'PanelSelectProductSku',
  components: { DialogSelectProductSku },

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
     * 是否显示任选提示
     */
    showChooseAnyTip: {
      type: Boolean,
      default: true
    },

    /**
     * 显示配置数量
     */
    showConfigNum: {
      type: Boolean,
      default: true
    },
    /**
     * 是否开启全选
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
     * 商品数据是否携带分类信息
     */
    dealCategory: {
      type: Boolean,
      default: false
    },
    /**
     * 是否反选数据
     */
    inverse: {
      type: Boolean,
      default: false
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

      dialogVisible: false,

      // 用于展示
      list: [
        // {
        //   sku: {},
        //   product: {}
        // }
      ],

      // 选中的SKU ID和产品 ID
      selected: [
        // {product_id: 0, sku_id: 0}
      ],
      skuIdMapNum: {},
      skuIdMapIsChooseAny: {}, // 标记 sku 是否可以任选

      // 套餐包含/赠送是否开启任选
      isPkgChooseAny: false,
      hasCategory: false, // 数据是否携带商品分类
      categoryList: [], // 商品分类信息
      activeIndex: '0'
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
        if (this.selected.length > 0) {
          return
        }

        this.initData(val)
      }
    },

    selected: {
      immediate: true,
      deep: true,
      handler(val) {
        console.log('=====> SELECTED CHANGE: ', val)
      }
    },
    dealCategory: {
      immediate: true,
      handler(val) {
        this.hasCategory = val
      }
    }
  },

  created() {
    // this.list = []
    // this.selected = []
  },

  methods: {

    /**
     * 监听表单值变更
     */
    watchForm(form) {
      console.log('---> watchform: ', form)
      this.isPkgChooseAny = form.isChooseAny
    },

    /**
     * 清空
     */
    clear() {
      this.selected = []
      this.skuIdMapNum = {}
      this.list = []
      this.skuIdMapIsChooseAny = {}
    },

    /**
     * 初始化数据
     */
    initData(val) {
      // 初始化数据
      this.selected = []
      this.skuIdMapNum = {}
      this.list = []

      const skuIds = []
      const tmpSeleted = []
      val.forEach(v => {
        tmpSeleted.push({
          product_id: v.product_id,
          sku_id: v.sku_id
        })
        this.$set(this.skuIdMapNum, v.sku_id, v.num)
        this.$set(this.skuIdMapIsChooseAny, v.sku_id, v.hasOwnProperty('is_choose_any') ? v.is_choose_any : true)
        skuIds.push(v.sku_id)
      })
      this.selected = tmpSeleted

      this.getSkuByIds(skuIds)
    },

    /**
     * 获取商品信息
     */
    getSkuByIds(ids) {
      apiSku.getByIds(ids).then(res => {
        this.categoryList = []
        this.activeIndex = '0'
        const list = res.data.list

        const skuIdMapItem = {}
        list.forEach(item => {
          const tempProduct = item.product
          delete item.product
          const tempSku = item
          // 当前不需要显示商品分类信息
          if (!this.hasCategory) {
            delete item.category
            skuIdMapItem[item.id] = {
              sku: tempSku,
              product: tempProduct
            }
          } else {
            // 当前的分类列表是否存在该分类
            let flag = false
            this.categoryList.forEach(category => {
              if (category.id === item.category.id) {
                flag = true
              }
            })
            if (!flag) {
              this.categoryList.push(item.category)
            }
            skuIdMapItem[item.id] = {
              sku: tempSku,
              product: tempProduct,
              category: item.category
            }
          }
        })

        // 按照传传进来的 ids 顺序设置 list
        ids.forEach(skuId => {
          if (!skuIdMapItem[skuId]) {
            console.log('--> skuId 不存在: ', skuId)
            this.$message.error('商品 SKU ' + skuId + ' 信息不存在')
            return
          }
          this.list.push(skuIdMapItem[skuId])
        })
      }).catch(e => {
        this.$message.error('获取商品信息失败，请重试')
        console.log(e)
      })
    },

    /**
     * 选择其他分类
     */
    changeCategory(index) {
      this.activeIndex = '' + index
    },

    /**
     * emit input 的值
     */
    emitInput() {
      this.$nextTick(() => {
        const val = []
        this.selected.forEach((v) => {
          val.push({
            ...v,
            num: this.skuIdMapNum[v.sku_id],
            is_choose_any: this.skuIdMapIsChooseAny[v.sku_id]
          })
        })

        console.log('emit: ', val)

        this.$emit('input', val)
      })
    },

    /**
     * 配置单品是否可任选
     */
    changeIsChooseAny(val) {
      this.emitInput()
    },

    /**
     * 确认选择事件
     */
    handleConfirm(data) {
      // 如果是反选，每次传来数据需要清空已选值
      if (this.inverse) {
        this.selected = []
        this.list = []
        this.categoryList = []
        this.activeIndex = '0'
        if (this.hasCategory) {
          // 重置选中的分类
          data.forEach(item => {
            let flag = false
            this.categoryList.forEach(category => {
              if (category.id === item.category.id) {
                flag = true
              }
            })
            if (!flag) {
              this.categoryList.push(item.category)
            }
          })
        }
        this.emitInput() // 重新emit，防止数据为空
      }
      if (Array.isArray(data)) {
        data.forEach(item => {
          this.dealConfirm(item)
        })
        return
      }
      this.dealConfirm(data)
    },
    /**
     * 处理确认选择事件
     * @param {Object} data
     */
    dealConfirm(data) {
      if (!data.sku) {
        return
      }
      // 如果已经选过，忽略
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i].sku_id === data.sku.id) {
          if (!this.inverse) {
            this.$message.warning(`商品「${data.product.name}」已选择过，忽略选择。`)
          }
          return
        }
      }
      // 判断是否添加新的商品分类数据
      if (this.hasCategory && data.category) {
        let flag = true
        this.categoryList.forEach(category => {
          if (category.id === data.category.id) {
            flag = false
          }
        })
        if (flag) {
          this.categoryList.push(data.category)
        }
        this.selected.push({
          product_id: data.product.id,
          sku_id: data.sku.id,
          category: data.category
        })
        this.list.push({
          sku: data.sku,
          product: data.product,
          category: data.category
        })
      } else {
        this.selected.push({
          product_id: data.product.id,
          sku_id: data.sku.id
        })
        this.list.push({
          sku: data.sku,
          product: data.product
        })
      }
      // 添加
      this.$set(this.skuIdMapNum, data.sku.id, 1)
      this.$set(this.skuIdMapIsChooseAny, data.sku.id, true)
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
      if (this.inverse) {
        this.$refs.dialogSelectProductSku.handlerUpdate(this.list)
      }
      this.dialogVisible = true
    },

    /**
     * 数量变更
     * @param num
     * @param skuId
     */
    changeInputNum(num, skuId) {
      this.skuIdMapNum[skuId] = num
      this.emitInput()
    },

    /**
     * 移除产品项
     * @param e
     * @param index
     * @param skuId
     */
    removeItem(e, index, skuId) {
      this.$confirm('确认移除该商品项？', '操作确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.list.splice(index, 1)
        this.selected.splice(index, 1)
        delete this.skuIdMapNum[skuId]
        // 删除数据之后判断当前所属的分类下是否存在数据
        if (this.hasCategory) {
          this.categoryList.forEach((category, index) => {
            let flag = false
            this.list.forEach(item => {
              if (item.category.id === category.id && !flag) {
                flag = true
              }
            })
            if (!flag) {
              // 重置当前的选中项
              if (parseFloat(this.activeIndex) === this.categoryList.length - 1) {
                this.activeIndex = '0'
              }
              this.categoryList.splice(index, 1)
            }
          })
        }
        this.emitInput()
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
  .panel-active {
    border: 1px solid #f3f3f3;
    padding: 15px;
    border-radius: 5px;
  }
  .panel-categroy {
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

  .choose-any-tip {
    line-height: 1.6em;
    margin-top: 15px;
    font-size: 14px;
    color: #999;
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
