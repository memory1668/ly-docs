<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      :width="showSelectedPreview ? '1100px' : '740px'"
      top="8vh"
      @closed="closedDialog"
    >
      <div slot="title">选择商品</div>
      <div class="flex mt-5">
        <div class="flex-1">
          <div class="mb-10">
            <el-input
              v-model="keyword"
              placeholder="搜索商品"
              class="input-with-select"
              clearable
              @change="searchKeyword"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </div>
          <div class="flex">
            <!-- 分类-->
            <div class="w-180">
              <el-menu
                :default-active="activeIndex"
                class="el-menu-demo"
                mode="vertical"
                @select="changeCategory"
              >
                <el-menu-item
                  v-for="(category,index) in listCategories"
                  :key="category.id"
                  :index="'' +index"
                  :disabled="!category.is_show"
                >
                  <div class="aic">
                    <div class="mt-0">
                      <el-image style="width: 20px;height: 20px;border-radius: 3px;" :src="category.icon" fit="fill" />
                    </div>
                    <span class="ml-15 fz-15 bold category-name">{{ category.name }}</span>
                  </div>
                </el-menu-item>
              </el-menu>
            </div>

            <!--商品/套餐列表-->
            <div class="flex-1 pl-20 pr-15">
              <div class="aic-jcsb">
                <div class="bold">商品列表({{ activeListLength }})</div>
                <el-checkbox
                  v-if="selectAll"
                  v-model="isSelectAll[activeIndex]"
                  size="mini"
                  border
                  @change="handleSelectAll($event)"
                >
                  {{ isSelectAll[activeIndex] ? '全不选' : '全选' }}
                </el-checkbox>
              </div>
              <div v-if="activeListLength === 0" class="empty-product-box">
                <div class="fz-42">
                  <i class="el-icon-document-remove" />
                </div>
                <div class="fz-14 mt-5">暂无商品</div>
              </div>
              <div
                v-for="(item, itemIndex) in activeList"
                :key="item.id"
              >

                <!--商品-->
                <div v-if="listCategories[activeIndex].type === 1 && item.is_show">
                  <div class="product-item">
                    <div class="flex">
                      <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="item.cover" fit="fill" />
                      <div class="ml-15 flex-1">
                        <div class="flex">
                          <span class="fz-15 bold mr-15">{{ item.name }}</span>
                          <div style="margin-top: -2px;">
                            <el-tag v-if="item.status" type="success" size="mini">已上架</el-tag>
                            <el-tag v-else type="info" size="mini">已下架</el-tag>
                          </div>
                        </div>
                        <div class="fz-13 pt-7">
                          <span class="color-red">￥{{ item.price_range }}</span>
                          <span class="ml-15">库存: {{ item.inventory }} {{ item.unit }}</span>
                        </div>
                      </div>

                      <div v-if="!item.has_many_sku" class="pt-10">
                        <!--有套装-->
                        <div v-if="showSuit && item.has_suit" class="flex max-width">
                          <template v-if="!showSoldOut || (item.skus[0].status && item.skus[0].status !== 0)">
                            <div v-for="(suit) in item.product_suits" :key="suit.id" class="mr-5 mb-10">
                              <el-checkbox
                                v-model="skuCheckSuits[item.skus[0].id +'_'+suit.id]"
                                size="mini"
                                border
                                @change="checkSuitSku($event, suit, item.skus[0], item)"
                              >{{ suit.name }}
                              </el-checkbox>
                            </div>
                          </template>
                          <el-tag v-else>已售空</el-tag>
                        </div>
                        <!--无套装-->
                        <template v-else>
                          <el-checkbox
                            v-if="!showSoldOut || (item.skus[0].status && item.skus[0].status !== 0)"
                            v-model="checked[item.skus[0].id]"
                            size="mini"
                            border
                            @change="checkSku($event, item.skus[0], item)"
                          >选择
                          </el-checkbox>
                          <el-tag v-else>已售空</el-tag>
                        </template>
                      </div>
                    </div>

                    <!--多 sku 的情况-->
                    <div v-if="item.has_many_sku" class="sku-box">
                      <div v-for="(sku, skuIndex) in item.skus" :key="sku.id + skuIndex" class="flex sku-row">
                        <div class="pt-15 pb-15 flex-1 fz-14">
                          <span
                            v-for="(skuProp, skuPropIndex) in sku.props"
                            :key="skuPropIndex+skuProp"
                            class="bold mr-5"
                          >{{ skuProp.name }}:{{ skuProp.value }}</span>
                          <span class="ml-15 fz-13">￥{{ parseFloat(sku.price) }}</span>
                          <span class="ml-10 fz-13">库存 {{ sku.inventory }} {{ item.unit }}</span>
                        </div>

                        <div class="pt-10 pb-10">
                          <div v-if="showSuit && item.has_suit" class="flex max-width">
                            <template v-if="!showSoldOut || sku.status">
                              <div v-for="(suit) in item.product_suits" :key="suit.id" class="mr-5 mb-10">
                                <el-checkbox
                                  v-model="skuCheckSuits[sku.id +'_'+suit.id]"
                                  size="mini"
                                  border
                                  @change="checkSuitSku($event, suit, sku, item)"
                                >{{ suit.name }}
                                </el-checkbox>
                              </div>
                            </template>
                            <el-tag v-else>已售空</el-tag>
                          </div>
                          <template v-else>
                            <el-checkbox
                              v-if="!showSoldOut || sku.status"
                              v-model="checked[sku.id]"
                              size="mini"
                              border
                              @change="checkSku($event, sku, item)"
                            >选择
                            </el-checkbox>
                            <el-tag v-else>已售空</el-tag>
                          </template>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!--套餐-->
                <div v-if="listCategories[activeIndex].type === 2 && item.is_show">
                  <div class="product-item">
                    <div class="flex">
                      <el-image style="width: 50px;height: 50px;border-radius: 3px;" :src="item.cover" fit="fill" />
                      <div class="ml-15 flex-1">
                        <div class="flex">
                          <span class="fz-15 bold mr-15">{{ item.name }}</span>
                          <div style="margin-top: -2px;">
                            <el-tag v-if="item.status" type="success" size="mini">已上架</el-tag>
                            <el-tag v-else type="info" size="mini">已下架</el-tag>
                          </div>
                        </div>
                        <div class="fz-13 pt-7">
                          <span class="color-red">￥{{ parseFloat(item.price) }} / 套</span>
                        </div>

                        <!--套餐的商品-->
                        <div class=" pkg-products">
                          <div class="bold">
                            <span>包含</span>
                            <span v-if="item.is_choose_any" class="color-theme">
                              （任选 {{ item.choose_any_num }}{{ showConfigNum ? `, 已选 ${ item.buy_selected_num }`: '' }}）
                            </span>
                          </div>
                          <div
                            v-for="(buyItem, pkgProductIndex) in item.buy_products"
                            :key="buyItem.id + pkgProductIndex"
                            class="mt-5"
                          >
                            <div v-if="!buyItem.product.has_many_sku">{{ buyItem.product.name }}
                              <span v-if="!item.is_choose_any || !buyItem.is_choose_any" class="ml-15">x {{
                                buyItem.num
                              }}</span>
                              <span v-else-if="showConfigNum" class="ml-15">
                                <el-input-number
                                  v-model="buyItem.selected_num"
                                  :step="buyItem.num"
                                  :min="0"
                                  :max="buyItem.max"
                                  size="mini"
                                  @change="packageProductChange($event, itemIndex, pkgProductIndex, true)"
                                />
                              </span>
                            </div>
                            <div v-else class="flex">
                              <div>{{ buyItem.product.name }}</div>
                              <div class="fz-14 ml-10">
                                <span
                                  v-for="(skuProp, skuPropIndex) in buyItem.sku.props"
                                  :key="buyItem+'-'+skuPropIndex"
                                  class="mr-5"
                                >{{ skuProp.value }}</span>
                              </div>
                              <div v-if="!item.is_choose_any || !buyItem.is_choose_any" class="ml-15">x {{
                                buyItem.num
                              }}
                              </div>
                              <div v-else-if="showConfigNum" class="ml-15">
                                <el-input-number
                                  v-model="buyItem.selected_num"
                                  :step="buyItem.num"
                                  :min="0"
                                  :max="buyItem.max"
                                  size="mini"
                                  @change="packageProductChange($event, itemIndex, pkgProductIndex, true)"
                                />
                              </div>
                            </div>
                          </div>

                          <div v-if="item.present_products.length > 0" class="bold mt-10">
                            <span>赠送</span>
                            <span v-if="item.is_present_choose_any" class="color-theme">
                              （任选 {{ item.present_choose_any_num }}{{ showConfigNum ? `, 已选 ${ item.present_selected_num}` : '' }}）
                            </span>
                          </div>
                          <div
                            v-for="(presentItem, pkgProductIndex) in item.present_products"
                            :key="presentItem.id+'present'+pkgProductIndex"
                            class="mt-5"
                          >
                            <div v-if="!presentItem.product.has_many_sku">
                              <span>{{ presentItem.product.name }}</span>
                              <span
                                v-if="!item.is_present_choose_any || !presentItem.is_choose_any"
                                class="ml-15"
                              >x {{ presentItem.num }}</span>
                              <span v-else-if="showConfigNum" class="ml-15">
                                <el-input-number
                                  v-model="presentItem.selected_num"
                                  :min="0"
                                  :max="presentItem.max"
                                  :step="presentItem.num"
                                  size="mini"
                                  @change="packageProductChange($event, itemIndex, pkgProductIndex, false)"
                                />
                              </span>
                            </div>
                            <div v-else class="flex">
                              <div>{{ presentItem.product.name }}</div>
                              <div class="fz-14 ml-10">
                                <span
                                  v-for="(skuProp, skuPropIndex) in presentItem.sku.props"
                                  :key="presentItem.id+'prop' + skuPropIndex"
                                  class="mr-5"
                                >{{ skuProp.value }}</span>
                              </div>
                              <div v-if="!item.is_present_choose_any || !presentItem.is_choose_any" class="ml-15">x
                                {{ presentItem.num }}
                              </div>
                              <div v-else-if="showConfigNum" class="ml-15">
                                <el-input-number
                                  v-model="presentItem.selected_num"
                                  :min="0"
                                  :max="presentItem.max"
                                  :step="presentItem.num"
                                  size="mini"
                                  @change="packageProductChange($event, itemIndex, pkgProductIndex, false)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div v-if="(!item.is_choose_any && !item.is_present_choose_any) || !showConfigNum" class="pt-10 ml-10">
                        <el-checkbox
                          v-model="checked[item.id]"
                          size="mini"
                          border
                          @change="checkPackage($event, item.id, item)"
                        >选择
                        </el-checkbox>
                      </div>
                      <div v-else class="ml-10">
                        <div
                          v-if=" (!item.is_choose_any || (item.is_choose_any && item.choose_any_num === item.buy_selected_num)) && (!item.is_present_choose_any || (item.is_present_choose_any && item.present_choose_any_num === item.present_selected_num))"
                        >
                          <el-checkbox
                            v-model="checked[item.id]"
                            size="mini"
                            border
                            @change="checkPackage($event, item.id, item)"
                          >选择
                          </el-checkbox>
                        </div>
                        <div v-else>
                          <el-checkbox
                            v-model="checked[item.id]"
                            size="mini"
                            disabled
                            border
                            @change="checkPackage($event, item.id, item)"
                          >选择
                          </el-checkbox>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--选中预览-->
        <div v-if="showSelectedPreview" class="selected-box pl-15 ml-10">
          <div class="bold mb-15">已选商品({{ checkedList.length }})</div>

          <div v-if="checkedList.length === 0" class="mt-10 empty-select">暂未选择商品</div>
          <div v-if="checkedList.length > 0" class="mb-10">
            <div class="mb-15 text-right">
              <el-button type="primary" size="mini" icon="el-icon-check" @click="confirm">确定选择</el-button>
            </div>

            <div v-for="(item, checkedIndex ) in checkedList" :key="'checked-' +checkedIndex" class="selected-item">
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
                  <div v-if="item.package.buy_products.length" class="mt-5">
                    <div>包含</div>
                    <div v-for="(bp, bpIndex) in item.package.buy_products" :key="bpIndex">
                      <div v-if="bp.selected_num > 0" class="mt-5">{{ bp.product.name }} x {{ bp.selected_num }}</div>
                    </div>
                  </div>
                  <div v-if="item.package.present_products.length" class="mt-10">
                    <div>赠送</div>
                    <div v-for="(bp, bpIndex) in item.package.present_products" :key="bpIndex">
                      <div v-if="bp.selected_num > 0" class="mt-5">{{ bp.product.name }} x {{ bp.selected_num }}</div>
                    </div>
                  </div>

                  <div class="mt-10">
                    <el-input-number
                      v-model="checkedList[checkedIndex].num"
                      size="mini"
                      :min="1"
                      @change="changeInputNum($event, checkedIndex)"
                    />
                  </div>
                </div>

                <div class="ml-15 pt-2 fz-18">
                  <i
                    class="el-icon-circle-close  icon-remove"
                    @click="removeItem($event, 2, item.package.id, checkedIndex)"
                  />
                </div>
              </div>

              <!--商品-->
              <div v-if="item.type === 1" class="flex">
                <el-image style="width: 50px;height: 50px;border-radius: 3px;flex-shrink: 0" :src="item.product.cover" fit="fill" />

                <div class="ml-15 flex-1">
                  <div class="flex mt-2">
                    <span class="fz-15 bold mr-15 product-name">{{ item.product.name }}</span>
                  </div>
                  <div v-if="item.product.has_many_sku" class="fz-13 product-sku">
                    <el-tag size="mini" type="primary" class="mr-5 mt-5">
                      <span
                        v-for="(skuProp, skuPropIndex) in item.sku.props"
                        :key="skuPropIndex"
                        class="bold mr-5"
                      >{{ skuProp.name }}:{{ skuProp.value }}</span>
                    </el-tag>
                    <el-tag v-if="item.suit" size="mini" type="primary" class="mr-5 mt-5 pb-1">{{ item.suit.name }}</el-tag>
                    <span v-if="!item.suit" class="color-red product-price">￥{{ parseFloat(item.sku.price) }}</span>
                    <span v-else class="color-red product-price">￥{{ parseFloat(item.suit.price) }}</span>
                  </div>
                  <div v-else class="fz-13 product-sku">
                    <el-tag v-if="item.suit" size="mini" type="primary" class="mr-5 mt-5">{{ item.suit.name }}</el-tag>
                    <span v-if="!item.suit" class="color-red product-price mt-5">￥{{ parseFloat(item.sku.price) }}</span>
                    <span v-else class="color-red product-price mt-5">￥{{ parseFloat(item.suit.price) }}</span>
                  </div>

                  <div class="mt-10">
                    <el-input-number
                      v-model="checkedList[checkedIndex].num"
                      size="mini"
                      :min="1"
                      @change="changeInputNum($event, checkedIndex)"
                    />
                  </div>
                </div>

                <div class="ml-15 pt-2 fz-18">
                  <i
                    class="el-icon-circle-close icon-remove"
                    @click="removeItem($event, 1, item.sku.id, checkedIndex)"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" icon="el-icon-check" @click="confirm">确定选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiCategory from '@/api/category'

const TYPE_PRODUCT = 1
const TYPE_PACKAGE = 2

export default {
  name: 'DialogSelectProductSkuPackage',
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
     * 默认传进来的参数
     */
    value: {
      type: Array,
      default: () => {
        return []
      }
    },

    // 是否显示套装
    showSuit: {
      type: Boolean,
      default: true
    },

    // 是否显示售空
    showSoldOut: {
      type: Boolean,
      default: true
    },

    // 是否显示选中商品预览
    showSelectedPreview: {
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
     * 分类是否全选
     */
    selectAll: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialogVisible: true,
      activeIndex: '0',

      // [
      //   {category => products => skus}
      //   {category => package => product -> sku }
      // ]
      listCategories: [],
      // 选中的分类的所有商品
      activeList: [],

      // 选中的商品/套餐
      checked: {},
      checkedList: [
        // {
        //   type: 1 || 2,
        //
        //   package_id: '',
        //   product_id: '',
        //   sku_id: '',
        //
        //   package: {},
        //   product: {},
        //   sku: {},
        //
        //   num: 1
        // }
      ],

      /**
       * sku 选中的套装
       */
      skuCheckSuits: {
        // skuId_suitId : true || false
      },
      keyword: '',
      isSelectAll: {} // 分类下的商品是否全选
    }
  },

  computed: {
    /**
     * 当前分类商品/套餐列表长度
     */
    activeListLength() {
      if (!this.activeList) {
        return 0
      }
      return this.activeList.filter(item => item.is_show).length
    }
  },

  watch: {

    visible(val) {
      this.dialogVisible = val
      if (this.dialogVisible) {
        this.clear()
        this.initChecked(this.value)
        this.listProductSkuPackages()
      }
    },

    /**
     * 搜索商品
     */
    keyword(val) {
      this.searchKeyword(val)
    },

    value(val) {
      this.initChecked(val)
    }
  },

  created() {
    this.dialogVisible = this.visible
  },

  methods: {
    /**
     * 套餐商品数量变化
     */
    packageProductChange(e, packageIndex, productIndex, isBuy) {
      console.log(e, packageIndex, productIndex, isBuy)

      // 1.1 计算包含和赠送的分别包含多少数量
      if (isBuy) {
        // 计算任选总数量
        let chooseAnyNum = 0
        this.listCategories[this.activeIndex].packages[packageIndex].buy_products.forEach(bp => {
          if (bp.is_choose_any) {
            chooseAnyNum += bp.selected_num
          }
        })
        this.listCategories[this.activeIndex].packages[packageIndex].buy_selected_num = chooseAnyNum
      } else {
        // 计算任选总数量
        let presentChooseAnyNum = 0
        this.listCategories[this.activeIndex].packages[packageIndex].present_products.forEach(pp => {
          if (pp.is_choose_any) {
            presentChooseAnyNum += pp.selected_num
          }
        })
        this.listCategories[this.activeIndex].packages[packageIndex].present_selected_num = presentChooseAnyNum
      }
      this.changePackageProductMax(packageIndex, isBuy)
    },

    /**
     * 修改套餐商品/赠送商品最大可选数量
     * @param {number} packageIndex 要修改的套餐索引
     * @param {boolean} isBuy 是否商品
     */
    changePackageProductMax(packageIndex, isBuy) {
      const curPackage = this.listCategories[this.activeIndex].packages[packageIndex] // 当前操作的套餐
      const products = isBuy ? curPackage.buy_products : curPackage.present_products
      // 计算每个商品/赠送商品的最大可选数量
      products.forEach((product, index) => {
        // 非任选商品不用计算
        if (!product.is_choose_any) {
          return
        }
        let total = 0 // 除去当前商品, 选中的商品数量和
        products.forEach((p, i) => {
          if (i === index || !p.is_choose_any) {
            return
          }
          total += p.selected_num
        })
        product.max = isBuy ? curPackage.choose_any_num - total : curPackage.present_choose_any_num - total
      })
    },

    /**
     * 选中套餐
     */
    checkPackage(isChecked, pkgId, pkg) {
      console.log('check package: ', isChecked, pkgId, pkg)
      if (isChecked) { // 选中，添加到选中列表
        this.checkedList.push({
          type: TYPE_PACKAGE,
          package_id: pkgId,
          package: pkg,
          num: 1,
          category: this.listCategories[this.activeIndex]
        })
      } else { // 取消选中，移除
        // let targetIndex = -1
        // for (let i = 0; i < this.checkedList.length; i++) {
        //   if (this.checkedList[i].type !== TYPE_PACKAGE) {
        //     continue
        //   }

        //   if (this.checkedList[i].package_id === pkgId) {
        //     targetIndex = i
        //     break
        //   }
        // }

        // if (targetIndex >= 0) {
        //   this.checkedList.splice(targetIndex, 1)
        // }
        const new_check_list = this.checkedList.filter(v => {
          return v.type !== TYPE_PACKAGE || v.package_id !== pkgId
        })
        this.checkedList = new_check_list
      }
      this.initIsSelectAll()
    },

    /**
     * 选中带套装的 sku
     */
    checkSuitSku(isChecked, suit, sku, product) {
      const tmpSkuCheckSuits = Object.assign({}, this.skuCheckSuits)
      const skuSuitKeys = Object.keys(tmpSkuCheckSuits)

      // 1.1 移除该sku 的所有其他选择
      skuSuitKeys.forEach(key => {
        if (key.indexOf('' + sku.id) >= 0) {
          tmpSkuCheckSuits[key] = false
          const arr = key.split('_')
          if (arr.length > 1) {
            this._removeCheckListSkuSuit(arr[0], arr[1])
          }
        }
      })

      tmpSkuCheckSuits[sku.id + '_' + suit.id] = isChecked
      this.skuCheckSuits = tmpSkuCheckSuits

      // 2.1 判断选中
      if (isChecked) {
        this.checkedList.push({
          type: TYPE_PRODUCT,
          product_id: product.id,
          sku_id: sku.id,
          product: product,
          product_suit_id: suit.id,
          sku: sku,
          suit: suit,
          num: 1
        })
      } else {
        this._removeCheckListSkuSuit(sku.id, suit.id)
      }
    },

    /**
     * 移除选中列表的 sku 套装
     */
    _removeCheckListSkuSuit(skuId, suitId) {
      let targetIndex = -1
      for (let i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i].type !== TYPE_PRODUCT || !this.checkedList[i].suit) {
          continue
        }

        if (this.checkedList[i].sku_id === skuId && this.checkedList[i].product_suit_id === suitId) {
          targetIndex = i
          break
        }
      }

      if (targetIndex >= 0) {
        this.checkedList.splice(targetIndex, 1)
      }
    },

    /**
     * 选中 SKU
     */
    checkSku(isChecked, sku, product) {
      console.log('check product: ', isChecked, sku, product)

      if (isChecked) { // 选中，添加到选中列表
        const category = this.listCategories[this.activeIndex]
        this.checkedList.push({
          type: TYPE_PRODUCT,
          product_id: product.id,
          sku_id: sku.id,
          product: product,
          sku: sku,
          num: 1,
          category
        })
      } else { // 取消选中，移除
        // let targetIndex = -1
        // for (let i = 0; i < this.checkedList.length; i++) {
        //   if (this.checkedList[i].type !== TYPE_PRODUCT) {
        //     continue
        //   }

        //   if (this.checkedList[i].sku_id === sku.id) {
        //     targetIndex = i
        //     break
        //   }
        // }

        // if (targetIndex >= 0) {
        //   this.checkedList.splice(targetIndex, 1)
        // }
        const new_check_list = this.checkedList.filter(v => {
          return v.type !== TYPE_PRODUCT || v.sku_id !== sku.id
        })
        this.checkedList = new_check_list
      }
      this.initIsSelectAll()
    },

    /**
     * 选择其他分类
     */
    changeCategory(index) {
      this.activeIndex = '' + index
      if (this.listCategories[this.activeIndex].type === TYPE_PRODUCT) {
        this.activeList = this.listCategories[this.activeIndex].products
      } else {
        this.activeList = this.listCategories[this.activeIndex].packages
      }
    },

    /**
     * 取消
     */
    cancel() {
      this.setDialogVisible(false)
      this.clear()
      this.$emit('cancel')
    },

    clear() {
      this.listCategories = []
      this.activeList = []
      this.checkedList = []
      this.checked = {}
      this.keyword = ''
    },

    /**
     * 确定选择
     */
    confirm() {
      console.log('checkedList: ', this.checkedList)
      this.$emit('input', this.checkedList)
      this.$emit('confirm', this.checkedList)
      this.setDialogVisible(false)
    },

    /**
     * 获取所有分类和商品信息
     */
    listProductSkuPackages() {
      apiCategory.listProductSkuPackages().then(res => {
        // 格式化套餐任选和不任选的情况
        const tmpList = res.data.list

        // 1.1 初始化商品有套装的的情况
        //     选择的情况
        tmpList.forEach((category, categoryIndex) => {
          if (category.type !== TYPE_PRODUCT) {
            return
          }
          category.is_show = category.products && category.products.length > 0 // 初始化商品分类是否显示字段
          category.products.forEach((prod, prodIndex) => {
            prod.is_show = true // 初始化商品是否显示字段
            if (!prod.has_suit) {
              return
            }

            prod.skus.forEach((sku, skuIndex) => {
              prod.product_suits.forEach((suit, psIndex) => {
                const key = sku.id + '_' + suit.id
                this.skuCheckSuits[key] = false
              })
            })
          })
        })

        // 2.1 初始化套餐中任选和不任选的情况
        tmpList.forEach((category, categoryIndex) => {
          if (category.type !== TYPE_PACKAGE) {
            return
          }
          category.is_show = category.packages && category.packages.length > 0 // 初始化套餐分类是否显示字段
          // 初始化套餐中任选和不任选的情况
          category.packages.forEach((pkg, pkgIndex) => {
            pkg.is_show = true // 初始化套餐是否显示字段
            if (pkg.is_choose_any) {
              pkg.buy_products.forEach((bp, bpIndex) => {
                if (bp.is_choose_any) {
                  bp.selected_num = 0
                  bp.max = pkg.choose_any_num
                } else {
                  bp.selected_num = bp.num
                }
              })
              pkg.buy_selected_num = 0
            } else {
              pkg.buy_products.forEach((bp, bpIndex) => {
                bp.selected_num = bp.num
              })
            }

            if (pkg.is_present_choose_any) {
              pkg.present_products.forEach((pp, ppIndex) => {
                if (pp.is_choose_any) {
                  pp.selected_num = 0
                  pp.max = pkg.present_choose_any_num
                } else {
                  pp.selected_num = pp.num
                }
              })
              pkg.present_selected_num = 0
            } else {
              pkg.present_products.forEach((pp, ppIndex) => {
                pp.selected_num = pp.num
              })
            }
          })
        })

        this.listCategories = tmpList
        if (this.listCategories.length > 0) {
          this.activeIndex = '0'
          if (this.listCategories[this.activeIndex].type === TYPE_PRODUCT) {
            this.activeList = this.listCategories[this.activeIndex].products
          } else {
            this.activeList = this.listCategories[this.activeIndex].packages
          }
        }

        console.log('-----> ', this.listCategories)

        // 判断是否需要初始化
        if (this.value.length > 0) {
          this.checkedList = JSON.parse(JSON.stringify(this.value))
        }
        this.initIsSelectAll()
      }).catch(e => {
        console.log(e)
        this.$message.error('获取产品信息失败，请重试')
      })
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
        const removedItem = this.checkedList[checkedIndex]
        this.checkedList.splice(checkedIndex, 1)

        if (!removedItem.suit) { // 普通商品或者套餐项
          this.$set(this.checked, targetId, false)
        } else { // 套装项
          console.log('suit item: ', removedItem)
          const keySkuSuit = removedItem.sku.id + '_' + removedItem.suit.id
          const tmpSkuCheckSuits = Object.assign({}, this.skuCheckSuits)
          tmpSkuCheckSuits[keySkuSuit] = false
          this.skuCheckSuits = tmpSkuCheckSuits
        }
      }).catch(() => {
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
      // this.checked[this.checkedSkuId] = false
      // this.checkedSkuId = ''
      // this.checkedSku = null
      // this.checkedProduct = null

      this.activeIndex = '0'
      if (!this.listCategories[this.activeIndex]) {
        this.setDialogVisible(false)
        this.$emit('close')
        return
      }
      if (this.listCategories[this.activeIndex].type === TYPE_PRODUCT) {
        this.activeList = this.listCategories[this.activeIndex].products
      } else {
        this.activeList = this.listCategories[this.activeIndex].packages
      }

      this.setDialogVisible(false)
      this.$emit('close')
    },

    /**
     * 修改数量
     * @param e
     * @param checkedIndex
     */
    changeInputNum(e, checkedIndex) {
      console.log(e, checkedIndex)
    },

    /**
     * 搜索关键字变化
     */
    searchKeyword(keyword) {
      console.log('搜索关键字变化', keyword)
      // 重新选择激活的分类
      let isReseletActive = false
      this.listCategories.forEach((category, index) => {
        let isAllHidden = true
        let list = []
        // 商品
        if (category.type === TYPE_PRODUCT) {
          list = category.products
        }
        // 套餐
        if (category.type === TYPE_PACKAGE) {
          list = category.packages
        }
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
      this.initIsSelectAll()
    },

    /**
     * 初始化选中商品/套餐
     * @param {Array} 初始化选中商品sku/套餐列表
     */
    initChecked(list) {
      if (!list || list.length === 0) {
        return
      }
      list.forEach(item => {
        if (item.type === TYPE_PRODUCT) {
          this.$set(this.checked, item.sku_id, true)
        }
        if (item.type === TYPE_PACKAGE) {
          this.$set(this.checked, item.package_id, true)
        }
      })
      console.log('初始化选中商品/套餐', list, this.checked)
    },

    /**
     * 初始化分类下的商品/套餐是否全选
     */
    initIsSelectAll() {
      if (!this.selectAll) {
        return
      }
      const isSelectAll = {}
      this.listCategories.forEach((category, index) => {
        if (category.type === TYPE_PRODUCT) {
          isSelectAll[index] = category.products.every(product => {
            // 隐藏商品视为已选中
            if (!product.is_show) {
              return true
            }
            return product.skus.every(sku => !!this.checked[sku.id])
          })
        }
        if (category.type === TYPE_PACKAGE) {
          // 隐藏套餐视为已选中
          isSelectAll[index] = category.packages.every(pkg => !pkg.is_show || !!this.checked[pkg.id])
        }
      })
      this.isSelectAll = isSelectAll
    },

    /**
     * 点击全选
     * @param {boolean} selectAll 是否全选
     */
    handleSelectAll(selectAll) {
      console.log('全选', selectAll, this.activeIndex)
      this.activeList.forEach(item => {
        // 不选中隐藏商品/套餐
        if (!item.is_show) {
          return
        }
        if (this.listCategories[this.activeIndex].type === TYPE_PRODUCT) {
          item.skus.forEach(sku => {
            if (this.checked[sku.id] !== selectAll) {
              this.$set(this.checked, sku.id, selectAll)
              this.checkSku(this.checked[sku.id], sku, item)
            }
          })
          return
        }
        if (this.listCategories[this.activeIndex].type === TYPE_PACKAGE) {
          if (this.checked[item.id] !== selectAll) {
            this.$set(this.checked, item.id, selectAll)
            this.checkPackage(this.checked[item.id], item.id, item)
          }
        }
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

.pkg-products {
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 5px 15px 10px;
  margin-top: 10px;
}

.selected-box {
  width: 330px;
  border-left: 1px dashed #eee;

  /deep/ .el-tag {
    height: auto !important;
    white-space: pre-wrap !important;
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

.category-name {
  white-space: pre-wrap;
  line-height: 20px;
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

.product-sku {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.product-price {
  margin-top: 5px;
  margin-right: 5px;
  display: inline-block;
}

.icon-remove {
  cursor: pointer;

  &:hover {
    color: #ff5646;
  }
}

.max-width {
  max-width: 250px;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-bottom: -10px;
}

</style>
