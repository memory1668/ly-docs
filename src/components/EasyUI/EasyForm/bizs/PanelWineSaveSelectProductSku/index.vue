<template>
  <div :class="{'panel-active': list.length > 0}">
    <div v-if="list.length > 0" class="mb-10">
      <div
        v-for="(item,index ) in list"
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

          <div class="mt-2">
            <div>
              <el-input
                v-model="item.num"
                placeholder="数量，如：3.5 指 3 瓶半"
                size="small"
                @change="valueChange"
              >
                <template slot="append">{{ item.product.unit }}</template>
              </el-input>
            </div>
            <div>
              <el-radio-group v-model="item.expire" size="mini" @change="valueChange">
                <el-radio-button :label="15">15天</el-radio-button>
                <el-radio-button :label="30">30天</el-radio-button>
                <el-radio-button :label="7">1周</el-radio-button>
                <el-radio-button label="">自定义</el-radio-button>
                <el-radio-button :label="-1">指定日期</el-radio-button>
              </el-radio-group>
            </div>
            <div v-if="item.expire === ''">
              <el-input
                v-model="item.custom_expire"
                placeholder="填写过期天数"
                size="small"
                @change="valueChange"
              >
                <template slot="append">天</template>
              </el-input>
            </div>
            <!--指定日期-->
            <div v-if="item.expire === -1">
              <el-date-picker
                v-model="item.expire_at"
                format="yyyy-MM-dd 23:59:59"
                style="width: 100%"
                type="date"
                placeholder="选择日期"
                @change="valueChange"
              />
            </div>
          </div>

          <div class="ml-15 pt-2 fz-18">
            <i class="el-icon-circle-close  icon-remove" @click="removeItem($event, index, item.sku.id)" />
          </div>

        </div>
      </div>
    </div>

    <div>
      <el-button type="default" icon="el-icon-plus" @click="clickAdd">选择商品</el-button>
      <el-button type="default" icon="el-icon-menu" @click="showAllProduct">所有酒水</el-button>
    </div>

    <!--  查询开台的商品  -->
    <dialog-select-desk-open-product-sku
      :visible.sync="dialogVisible"
      :desk-id="deskId"
      @close="handleCloseDialog"
      @confirm="handleConfirm"
    />

    <!--选择仓库商品-->
    <warehouse-dialog-select-product-sku ref="dialogSelectProductSku" @confirm="handleConfirmSelectProductSku" />
  </div>
</template>

<script>
import DialogSelectDeskOpenProductSku from '../DialogSelectDeskOpenProductSku/index'
import WarehouseDialogSelectProductSku from '@/components/EasyUI/EasyForm/bizs/WarehouseManage/WarehouseDialogSelectProductSku/index'

export default {
  name: 'PanelSelectDeskOpenProductSku',
  components: { DialogSelectDeskOpenProductSku, WarehouseDialogSelectProductSku },

  props: {

    /**
     * 传进来的值
     */
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {

      // 台位 ID
      deskId: '',
      dialogVisible: false,
      allProductVisible: false,

      // 用于展示
      list: [
        // {
        //   sku: {},
        //   product: {}
        //   num: '',
        //  expire: '',
        // }
      ]
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
          this.list = []
          return
        }

        // this.initData(val)
      }
    }
  },

  created() {
    this.list = []
  },

  methods: {
    /**
     * 仓库商品选择回调
     * @param data
     */
    handleConfirmSelectProductSku(data) {
      if (!data || data.length === 0) {
        return
      }

      // 已选择的 sku id
      const skuIds = []
      this.list.forEach(v => {
        skuIds.push(v.sku.id)
      })

      const tmp = []
      // 重复选择的 sku
      const repeatSkus = []

      data.forEach(v => {
        // 已经存在商品将忽略
        if (skuIds.includes(v.sku.id)) {
          repeatSkus.push(v)
          return
        }

        // 添加
        tmp.push({
          sku: v.sku,
          product: v.product,
          num: '',
          expire: 15,
          custom_expire: '',
          expire_at: ''
        })
      })
      this.list.push(...tmp)
      this.emitInput()

      this.$refs.dialogSelectProductSku.removeAll()

      // 存在重复选择的商品
      if (repeatSkus.length > 0) {
        const name = repeatSkus[0].product['name']
        let more = ''
        if (repeatSkus.length > 1) {
          more = '等共' + repeatSkus.length + '件商品'
        }
        this.$message.warning(`「${name}」${more}已选择，自动忽略重复商品。`)
      }
    },

    /**
     * 显示仓库商品
     */
    showAllProduct() {
      this.$refs.dialogSelectProductSku.setDialogVisible(true)
    },

    /**
     * 监听表单值变更
     */
    watchForm(form) {
      this.deskId = form.desk_id
    },

    /**
     * 初始化数据
     */
    initData(val) {
      // 初始化数据
      this.list = []
    },

    /**
     * 表单值变更
     */
    valueChange() {
      this.emitInput()
    },

    /**
     * emit input 的值
     */
    emitInput() {
      this.$nextTick(() => {
        const val = []
        this.list.forEach((v) => {
          val.push({
            product_id: v.product.id,
            sku_id: v.sku.id,
            num: v.num,
            expire: v.expire === '' ? v.custom_expire : v.expire,
            expire_at: v.expire === -1 ? v.expire_at : ''
          })
        })

        this.$emit('input', val)
      })
    },

    /**
     * 确认选择事件
     */
    handleConfirm(data) {
      if (!data || data.length === 0) {
        return
      }

      const tmp = []
      data.forEach(v => {
        // 添加
        tmp.push({
          sku: v.sku,
          product: v.product,
          num: '',
          expire: 15,
          custom_expire: '',
          expire_at: ''
        })
      })
      this.list.push(...tmp)
      console.log('list: ', this.list)
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
      // this.skuIdMapNum[skuId] = num

      this.emitInput()
    },

    /**
     * 过期日期变更
     */
    changeExpire(date, skuId) {
      console.log(date, skuId)
      // this.skuIdMapExpire[skuId] = date

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
</style>
