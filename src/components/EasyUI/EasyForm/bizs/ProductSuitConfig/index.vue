<template>
  <div>
    <el-table :data="suitsTableData" border stripe>
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
          <el-input v-if="col.editable" v-model="suitsTableData[scope.$index][col.prop]" size="mini" :placeholder=" col.label" />
          <span v-else>{{ suitsTableData[scope.$index][col.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <span :id="scope.$index" style="display: block;">操作</span>
        </template>

        <!--表格内容-->
        <template slot-scope="scope">
          <el-button v-if="suitsTableData.length > 1" :id="scope.$index" slot="append" icon="el-icon-close" size="mini" @click="removeSkuRow(scope.$index)" />
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-10">
      <el-button icon="el-icon-plus" size="mini" @click="addSuitRow">添加套装</el-button>
    </div>
  </div>
</template>

<script>
// import UploadImageInner from '@/components/EasyUI/EasyForm/components/UploadImageInner/index'

export default {
  name: 'ProductSuitConfig',
  components: {
    // UploadImageInner
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {

          /**
             * 套装配置
             */
          suits: [
            // {
            // id: xx,
            // name: '',
            // price: 0,
            // num: 0,
            // }
          ]
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
        { label: '套装名称', isEdit: false, editable: true, prop: 'name' },
        { label: '商品数量', isEdit: false, editable: true, prop: 'num' },
        { label: '价格（元）', editable: true, batchEditable: false, prop: 'price' }
      ],
      /**
         * 标题栏
         */
      columns: [
        // ...this.columnsTemplate
      ],

      /**
         * 套装表格值
         */
      suitsTableData: [
        {
          price: 0,
          name: '',
          num: 0
        }
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

        // // 有传入值才进行数据转换
        if (val.suits) {
          this.transFormDataToInnerData()
        }
      }
    },

    /**
       * 监听套装表格中数据的变更
       */
    suitsTableData: {
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
       * 删除一条套装
       */
    removeSkuRow(rowIndex) {
      const item = this.suitsTableData.splice(rowIndex, 1)
      if (!item[0].sku_id) {
        return
      }
      this.formData.remove_skus.push(...item)
    },

    /**
       * 添加套装
       */
    addSuitRow() {
      const row = {}
      this.columnsTemplate.forEach(v => {
        row[v.prop] = ''
      })

      this.suitsTableData.push(row)
    },

    /**
       * 将组建内的数据格式化为 formData 期望的数据结构
       */
    formatToFormData() {
      this.formData = {
        suits: this.suitsTableData
      }
    },

    /**
       * 将 formData 转为该组件需要的参数
       * 需要还原
       * suitsTableData
       */
    transFormDataToInnerData() {
      this.suitsTableData = this.formData.suits
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
        const tempData = Object.assign([], this.suitsTableData)
        tempData.forEach((v, i) => {
          tempData[i][col.prop] = value
        })

        this.suitsTableData = tempData
      }).catch(() => {
      })
    },

    /**
       * 规格值输入
       * @param val
       */
    optionInput(val, propIndex, optionIndex) {
      console.log(val, propIndex, optionIndex)

      this.calculatesuitsTableData()
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
