<template>
  <div>
    <!--规格名和规格值配置-->
    <div class="mb-15">
      <el-table v-if="propsTableData.length > 0" :data="propsTableData" border stripe>
        <el-table-column label="规格名" width="130" align="center">
          <template slot-scope="scope">
            <el-input v-model="propsTableData[scope.$index].name" disabled size="mini" placeholder="规格名称" />
          </template>
        </el-table-column>
        <el-table-column label="规格值" align="left">
          <template slot-scope="scope">
            <div
              v-for="(opt, i) in propsTableData[scope.$index].options"
              :key="i + '_option'"
              class="prop-option"
            >
              <el-input v-model="propsTableData[scope.$index].options[i].name" disabled size="mini" placeholder="规格值" />
            </div>
          </template>
        </el-table-column>

        <el-table-column label="图标" width="80px" align="center">
          <template slot-scope="scope">
            <el-switch v-model="propsTableData[scope.$index].is_icon_open" @change="switchPropIcon(scope.$index)" />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--图标配置-->
    <div v-if="showIconTable" class="skus-title mt-15">规格图标</div>
    <el-table v-if="showIconTable" :data="propsOptionsIconTableData" border stripe style="margin-bottom: 20px;">
      <el-table-column label="规格名" width="130" align="center">
        <template slot-scope="scope">
          <span>{{ propsTableData[scope.row.index].name ? propsTableData[scope.row.index].name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格值的图标" align="left">
        <template slot-scope="scope">
          <div
            v-for="(opt, i) in propsTableData[scope.row.index].options"
            :key="i + '_option_icon'"
            class="option-icon-item"
          >
            <div class="option-icon-box">
              <upload-image-inner
                v-model="propsTableData[scope.row.index].options[i].icon"
                :width="100"
                :height="100"
                :preview-width="30"
                :preview-height="30"
                :icon-size="30"
                :no-circle="true"
              />
              <span class="icon-text">{{ propsTableData[scope.row.index].options[i].name }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- SKU 详细配置-->
    <div class="skus-title">商品规格数据配置</div>

    <!--待删除规格-->
    <div v-if="formData.remove_skus && formData.remove_skus.length > 0" class="flex mb-15 pt-10">
      <div class="mr-10 color-red">待删除商品规格:</div>
      <div v-for="(item,index) in formData.remove_skus" :key="index" class="flex wait-delete-item mr-10 ">
        <div v-for="(propItem, propIndex) in item.detail" :key="propIndex" class="mr-5"> {{ propItem.value }}</div>

        <i class="el-icon-close ml-10 mt-11 btn-cancel-wait-remove" @click="cancelWaitRemove(index)" />
      </div>
    </div>

    <el-table :data="skusTableData" border stripe>
      <el-table-column
        v-for="(col, index) in columns"
        :key="index + '-title'"
        align="center"
      >
        <!--自定义表头-->
        <!--这里必须指定 slot-scope 不然 columns 表格表头的值不会跟着上面规格名称变更自动渲染新值-->
        <!--而下面的 :id="{{scope.$index}}" 只是为了使用 scope 这个变量，不然 es-lint 会报错-->
        <template slot="header" slot-scope="scope">
          <span :id="scope.$index" style="display: block;">
            {{ columns[index].label }}
            <el-tooltip v-if="columns[index].editable &&columns[index].batchEditable " class="item" effect="dark" :content="'批量修改' + columns[index].label" placement="top-start">
              <a href="javascript:void(0);" @click="batchEditSku(index)"><i class="el-icon-edit" /></a>
            </el-tooltip>
          </span>
        </template>

        <!--表格内容-->
        <template slot-scope="scope">
          <!--v-model="input4"-->
          <el-input v-if="col.editable" v-model="skusTableData[scope.$index][col.prop]" size="mini" :placeholder=" col.label" />
          <span v-else>{{ skusTableData[scope.$index][col.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span :id="scope.$index" style="display: block;">操作</span>
        </template>

        <!--表格内容-->
        <template slot-scope="scope">
          <el-button v-if="skusTableData.length > 1" :id="scope.$index" slot="append" icon="el-icon-close" size="mini" @click="removeSkuRow(scope.$index)" />
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>

    <!--多 SKU 商品才可以添加规格-->
    <div v-if="propsTableData.length > 0" class="mt-10">
      <el-button icon="el-icon-plus" size="mini" @click="addSkuRow">添加规格</el-button>
    </div>
  </div>
</template>

<script>
import UploadImageInner from '@/components/EasyUI/EasyForm/components/UploadImageInner/index'

export default {
  name: 'ProductSkuManagement',
  components: {
    UploadImageInner
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          /**
             * 规格名配置
             */
          props: [
            // {
            //   name: '',
            //   options: [{name: '', icon: ''}],
            //   is_icon_open: true
            // }
          ],

          /**
             * SKU 配置
             * 新 sku 配置, 其中可能有包含新添加的 SKU 记录 (新添加的没有sku_id 字段)
             */
          skus: [
            // {
            // sku_id: '',
            // prop_0, prop_1, ...
            // price: 0,
            // inventory: 0,
            // weight: 0,
            // sku_code: '',
            // bar_code: '',
            // market_price: 0
            // }
          ],

          /**
            * 要删除的 sku 配置，配置内容与 skus 字段的配置一样
            */
          remove_skus: []
        }
      }
    }
  },
  data() {
    return {
      /**
         * 组件值
         */
      formData: {
        // props: []
        // remove_skus: [],
        // skus: []
      },

      /**
         * sku 数据初始参数表格模板
         */
      columnsTemplate: [
        { label: '价格（元）', editable: true, batchEditable: true, prop: 'price' },
        { label: '库存', editable: true, batchEditable: true, prop: 'inventory' },
        // { label: '规格编码', editable: true, batchEditable: true, prop: 'sku_code' }
        { label: '规格数量', isEdit: false, editable: true, prop: 'unit_num' }
      ],
      /**
         * 标题栏
         */
      columns: [
        // ...this.columnsTemplate
      ],

      /**
         * SKU 表格值
         */
      skusTableData: [ // 如果不配置规格，则默认一行
        {
          price: 0,
          sku_code: '',
          inventory: 0,
          unit_num: 1,
          weight: 0,
          bar_code: '',
          market_price: 0
        }
      ],

      /**
         * 规格名称配置
         */
      propsTableData: [
        // {
        //   name: '',
        //   options: [{name: '', icon: ''}],
        //   is_icon_open: false
        // }
      ],

      /**
         * 规格名称选项是否开启配置图标
         */
      showIconTable: false,
      propsOptionsIconTableData: [
        //  index 是 propTableData 的 index
        // {index: x}
      ]
    }
  },
  watch: {
    /**
       * 监听 formData 变更
       */
    formData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit('input', val)
      }
    },

    /**
       * 监听传进来的值变更
       */
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.formData = val
        !this.formData.remove_skus && (this.formData.remove_skus = [])

        // 有传入值才进行数据转换
        if (val.props || val.skus) {
          this.transFormDataToInnerData()
        }
      }
    },

    /**
       * 监听规格名称和规格值的变更
       */
    propsTableData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.formatToFormData()
      }
    },

    /**
       * 监听 SKU 表格中数据的变更
       */
    skusTableData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.formatToFormData()
      }
    }
  },
  created() {
    this.formData = this.value

    // 初始化规格表格
    this.columns = Object.assign({}, this.columnsTemplate)
  },
  methods: {
    /**
       * 删除一条 SKU
       */
    removeSkuRow(rowIndex) {
      const item = this.skusTableData.splice(rowIndex, 1)
      if (!item[0].sku_id) {
        return
      }
      this.formData.remove_skus.push(...item)
    },

    /**
       * 取消待删除 SKU
       */
    cancelWaitRemove(index) {
      this.skusTableData.push(... this.formData.remove_skus.splice(index, 1))
    },

    /**
       * 添加 SKU
       */
    addSkuRow() {
      const row = {}
      this.columns.forEach(v => {
        row[v.prop] = ''
      })

      this.skusTableData.push(row)
    },

    /**
       * 将组建内的数据格式化为 formData 期望的数据结构
       */
    formatToFormData() {
      this.formData = {
        props: this.propsTableData,
        skus: this.skusTableData,
        remove_skus: this.formData.remove_skus
      }

      console.log('prop_skus: ', this.formData)
    },

    /**
       * 将 formData 转为该组件需要的参数
       * 需要还原
       * propsTableData, skusTableData, columns, showIconTable, propsOptionsIconTableData
       */
    transFormDataToInnerData() {
      // 1.1 规格名称和规格选项表的数据
      this.propsTableData = this.formData.props
      this.skusTableData = this.formData.skus
      this.showIconTable = false

      // 2.1 SKU 规格数据配置表格的列配置
      const propCols = []
      const rowIcons = []
      this.propsTableData.forEach((prop, propIndex) => {
        propCols.push({ label: prop.name, editable: true, prop: 'prop_' + propIndex })

        // 3.1 判断是否显示配置规格选项的 icon 表格
        // 配置规格选项的 icon 表格中的数据
        if (prop.is_icon_open) {
          this.showIconTable = true
          rowIcons.push({ index: propIndex })
        }
      })
      this.columns = [...propCols, ...this.columnsTemplate]
      this.propsOptionsIconTableData = rowIcons
    },

    /**
       * 批量修改某个 SKU 列表数据
       */
    batchEditSku(columnIndex) {
      const col = this.columns[columnIndex]
      this.$prompt('请输入' + col.label, '批量修改: ' + col.label, {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        const tempData = Object.assign([], this.skusTableData)
        tempData.forEach((v, i) => {
          tempData[i][col.prop] = value
        })

        this.skusTableData = tempData
      }).catch(() => {
      })
    },

    /**
       * 计算 SKU 各行
       */
    calculateSkuRows(index, list = []) {
      // 遍历完成，终止递归
      if (index >= this.propsTableData.length) {
        return list
      }

      const tempProp = this.propsTableData[index]
      const tempOptions = tempProp.options
      console.log('tempOptions: ', tempProp.options)

      if (index === 0) { // 第一个属性
        tempOptions.forEach((opt, optIndex) => {
          const key = 'sku_' + index + ':' + optIndex
          list.push({
            key: key,
            options: [opt],
            detail: [{ name: tempProp.name, value: opt.name }],
            value: opt
          })
        })
      } else {
        const tempList = []
        list.forEach((item, itemIndex) => {
          tempOptions.forEach((opt, optIndex) => {
            const key = item.key + '_' + index + ':' + optIndex
            const rowOptions = Object.assign([], item.options)
            rowOptions.push(opt)

            const rowDetail = Object.assign([], item.detail)
            rowDetail.push({ name: tempProp.name, value: opt.name })

            tempList.push({
              key: key,
              options: rowOptions,
              detail: rowDetail,
              value: opt
            })
          })
        })

        list = tempList
      }

      return this.calculateSkuRows(++index, list)
    },

    /**
       * 计算重新生成的 SKU 配置行数据
       */
    calculateSkusTableData() {
      if (this.propsTableData.length === 0) { // 如果不配置规格，则默认一行
        this.skusTableData = [{
          price: 0,
          inventory: 0,
          unit_num: 1,
          sku_code: '',
          bar_code: '',
          market_price: 0,
          weight: 0
        }]
        return
      }

      // 计算得出各行 SKU 属性和值
      const skuRows = this.calculateSkuRows(0, [])
      const templateData = []
      skuRows.forEach((row, index) => {
        const propValues = { 'detail': row.detail } // detail： sku 的规格配置，数据库会保存，方便编辑页面重新恢复表单
        row.options.forEach((val, valIndex) => {
          propValues['prop_' + valIndex] = val.name
        })

        // 行数没变，表示：只修改规格名称和规格值, 那么表格的值不变
        // 否则，重置表格的值
        if (this.skusTableData.length === skuRows.length) {
          templateData.push({ ...this.skusTableData[index], ...propValues })
        } else {
          templateData.push({
            ...propValues,
            price: 0,
            inventory: 0,
            unit_num: 1,
            sku_code: '',

            weight: 0,
            bar_code: '',
            market_price: 0
          })
        }
      })

      this.skusTableData = templateData
    },

    /**
       * 规格值输入
       * @param val
       */
    optionInput(val, propIndex, optionIndex) {
      console.log(val, propIndex, optionIndex)

      this.calculateSkusTableData()
    },

    /**
       * 选择规格名是否配置图标
       * @param index
       */
    switchPropIcon(index) {
      // 配置需要配置图标的规格行
      if (!this.propsTableData[index].is_icon_open) { // 移除
        for (let i = 0; i < this.propsOptionsIconTableData.length; i++) {
          if (this.propsOptionsIconTableData[i].index === index) {
            this.propsOptionsIconTableData.splice(i, 1)
          }
        }
      } else { // 添加
        this.propsOptionsIconTableData.push({ index: index })
      }

      //  判断是否显示配置图标的表格
      this.checkShowIconTable()
    },

    /**
       * 判断是否显示配置图标的表格
       */
    checkShowIconTable() {
      for (let i = 0; i < this.propsTableData.length; i++) {
        if (this.propsTableData[i].is_icon_open) {
          this.showIconTable = true
          break
        } else {
          this.showIconTable = false
        }
      }
    },

    /**
       * 移除配置规格 icon
       */
    removePropsOptionsIcon(index) {
      for (let i = 0; i < this.propsOptionsIconTableData.length; i++) {
        if (this.propsOptionsIconTableData[i].index === index) {
          this.propsOptionsIconTableData.splice(i, 1)
        }
      }

      this.checkShowIconTable()
    },

    /**
       * 添加规格值时，处理规格值对应的 icon
       * @param index
       */
    addOptionDealOptionsIcon(index) {
      if (!this.propsTableData[index].is_icon_open) {
        return
      }

      for (let i = 0; i < this.propsOptionsIconTableData.length; i++) {
        if (this.propsOptionsIconTableData[i].index === index) {
          this.propsOptionsIconTableData[i].icons.push({
            index: this.propsTableData[index].options.length - 1
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .item {
    margin: 5px 0;
  }

  .prop-option {
    display: inline-block;
    width: 180px;
    padding: 5px 5px 5px 0;
  }

  .operation-prop {
    margin-bottom: 20px;
    margin-top: 5px;
  }

  .skus-title {
    color: rgba(5, 0, 28, 0.4);
    border-left: 2px solid rgba(5, 0, 28, 0.2);
    padding-left: 10px;
    font-size: 13px;
    line-height: 13px;
    margin-bottom: 10px;
  }

  .option-icon-item {
    background-color: white;
    display: inline-block;
    padding: 5px 15px;
    margin: 5px 5px 5px 0;
    border: 1px solid #f3f3f3;
    border-radius: 5px;
    float: left;
  }

  .option-icon-box {
    display: flex;
    flex-direction: row;

    .icon-text {
      flex: 1;
      margin-left: 10px;
      padding-top: 2px;
    }
  }

  /*待删除*/
  .wait-delete-item {
    background-color: #ffebdf;
    color: #ff3b4a;
    padding: 0px 10px;
    border-radius: 3px;
  }

  .btn-cancel-wait-remove {
    display: block;
    height: 15px;
    width: 15px;
    &:hover {
      cursor: pointer;
      background-color: #ff3b4a;
      color: white;
    }
  }

</style>
