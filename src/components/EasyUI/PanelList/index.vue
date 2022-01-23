/**
* 使用用例参考： README.md
*/
<template>
  <div>
    <!--页面顶部-->
    <slot name="header" />

    <!--过滤栏-->
    <div
      v-if="options.filterForm"
      :class="{'mod': true, 'bg-white': true, 'round': true, 'panel-list-filter-form': true, 'folded': options.filterForm.showBtnFold && isFilterFolded, 'mb-15': !options.lbTable.operationButtons}"
    >

      <!--展开/关闭-->
      <div v-if="options.filterForm && options.filterForm.showBtnFold" class="btn-fold">
        <el-button
          size="mini"
          type="primary"
          plain
          :icon="isFilterFolded ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
          round
          @click="toggleFilterFold"
        >{{ isFilterFolded ? '展开筛选条件' : '收起筛选条件' }}
        </el-button>
      </div>

      <slot name="filter-header" />
      <filter-form
        ref="filterForm"
        :options="options.filterForm"
        @onSearch="onSearch"
        @onChange="onChange"
      />

      <slot name="filter-footer" />
    </div>

    <!--页面中间操作面板-->
    <slot
      name="middle-panel"
    />

    <!--编辑配置操作按钮栏-->
    <div
      v-if="options.operationButtons && options.operationButtons.length > 0"
      class="button-container"
    >
      <el-button
        v-for="(btn,index) in options.operationButtons"
        :key="index"
        v-permission="btn.vPermission ? btn.vPermission : []"
        :size="btn.size || 'small'"
        :type="btn.type || 'primary'"
        :plain="btn.hasOwnProperty('plain') ? btn.plain : false"
        :round="btn.hasOwnProperty('round') ? btn.round : false"
        @click="btn.clickMethod(filters)"
      >
        <i v-if="btn.icon" :class="btn.icon" />
        {{ btn.label }}
      </el-button>
    </div>

    <!--页面列表-->
    <div v-if="options.lbTable" class="mod bg-white round list-container">
      <slot name="table-header" />

      <div v-if="options.lbTable.title" class="title" :style="options.lbTable.titleStyle || ''">
        <span>{{ options.lbTable.title }}</span>
      </div>

      <div class="flex">
        <!--左侧过滤栏 必须固定宽度 用于计算表格宽度-->
        <div v-if="options.leftFilterForm" ref="leftFilterForm" class="filter-left w-200">
          <filter-form
            :options="options.leftFilterForm"
            @onSearch="onSearch"
            @onChange="onLeftFilterChange"
          />
        </div>
        <div
          :id="id"
          :style="{width: options.leftFilterForm ? `calc(100% - 200px)` : '100%'}"
          :class="{'hide-header': options.lbTable.hasOwnProperty('showHeader') && !options.lbTable.showHeader}"
        >
          <lb-table
            ref="lbTable"
            v-loading="listLoading"
            :highlight-current-row="options.lbTable.selection && !options.lbTable.selection.multiple"
            :stripe="options.lbTable.hasOwnProperty('stripe') ? options.lbTable.stripe : true"
            v-bind="$attrs"
            :column="options.lbTable.columns || []"
            :data="list"
            :only-one-expand="options.lbTable.onlyOneExpand"
            :border="options.lbTable.hasOwnProperty('border') ? options.lbTable.border : false"
            :pagination="options.lbTable.pagination || false"
            :pagination-align="options.lbTable.paginationAlign"
            :pagination-top="options.lbTable.paginationTop"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="listQuery.page"
            :total="total"
            :align="options.lbTable.align || 'center'"
            :header-align="options.lbTable.headerAlign || 'center'"
            :page-size="listQuery.pagesize"
            :page-sizes="[20, 50, 100, 200, 500, 1000]"
            :row-key="options.lbTable.rowKey"
            :lazy="options.lbTable.lazy || false"
            :tree-props="treeProps"
            :load="mockLoadTreeData"
            :show-summary="options.lbTable.showSummary"
            :summary-method="options.lbTable.summaryMethod"
            :class="{'fix-scroll-bar': options.lbTable.showSummary, 'sticky-header': canIUseSticky}"
            class="lb-table-container"
            @selection-change="handleSelectionChange"
            @size-change="handleSizeChange"
            @p-current-change="handlePCurrentChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>

      <slot name="table-footer" />
    </div>

    <!--页面底部-->
    <slot name="footer" />
  </div>
</template>

<script>
import LbTable from '../LbTable'
import axiosInstance from '@/utils/request'
import ColumnOperation from './components/ColumnOperation'
import SwitchOperation from './components/SwitchOperation'
import FilterForm from '@/components/EasyUI/FilterForm'
import checkPermission from '@/utils/permission'
import { StickyHeaderModel } from '@/models/StickyHeader'

export default {
  name: 'PanelList',
  components: { LbTable, FilterForm },
  props: {
    value: {
      type: Array,
      default() {
        return []
      }
    },
    // 完整配置
    options: {
      type: Object,
      default: () => {
        return {
          request: {
            // 列表 URL
            url: '',

            // url 的 query 参数, e.g: {field: 'value', status: 1}
            // 初始化请求参数
            params: {},

            // 指定 axios 实例, 不指定则默认使用 @/utils/request 实例
            httpClient: null,

            length: 0 // 数据列表总长度
          },

          // 过滤栏配置
          filterForm: {
            // 过滤栏值变化自动刷新
            autoRefresh: false,

            // 是否显示展开收起按钮
            showBtnFold: false,

            // 默认收起
            defaultFolded: false

          },

          leftFilterForm: null, // 表格左侧过滤栏

          // 操作按钮栏
          operationButtons: [],

          // 列表配置
          lbTable: {
            title: '', // 列表标题
            columns: [], // 表格字段
            pagination: false, // 是否显示分页

            // 多选 or 单选
            selection: { multiple: true },

            spanMethod: () => {
            },
            paginationTop: '15px',
            paginationAlign: 'right',
            merge: []
          }
        }
      }
    }
  },

  data() {
    return {
      id: 'table-' + Date.now() + Math.random() * 10000, // 保证唯一
      // 表格数据
      lastReqId: 0,
      listLoading: false,
      list: [], // 数据列表
      listBackup: [],
      total: 0, // 数据总数
      listQuery: {
        page: 1, // 当前分页
        pagesize: 20 // 分页大小
      },

      // 查询字段
      filters: {},

      // 左侧filter组件的查询字段
      leftFilters: {},

      // 列表多选选中的行
      multipleSelection: [],

      // 是否过滤栏收起来
      isFilterFolded: true,

      canIUseSticky: false // 浏览器是否支持position: sticky
    }
  },

  computed: {
    treeProps() {
      if (this.options.lbTable && this.options.lbTable.treeProps) {
        return this.options.lbTable.treeProps
      }
      return { children: 'children', hasChildren: 'hasChildren' }
    }
  },

  watch: {
    value(val) {
      this.list = [...val]
    }
  },

  mounted() {
    // 初始化配置
    this.init()
    this.initStickyHeader()
  },

  methods: {
    /**
     * 展开/收起过滤栏
     */
    toggleFilterFold() {
      this.isFilterFolded = !this.isFilterFolded
    },

    /**
     * 初始化参数
     */
    init() {
      // 1.1 配置默认的 HTTP 请求 axios 实例
      if (this.options.request && !this.options.request.httpClient) {
        this.options.request.httpClient = axiosInstance
      }

      // 1.2 配置初始过滤参数
      if (this.options.request && this.options.request.params) {
        this.filters = {
          ...this.filters,
          ...this.options.request.params
        }
      }

      // 2.1 配置按钮栏默认事件
      if (this.options.operationButtons && this.options.operationButtons.length > 0) {
        this.options.operationButtons.forEach((item, index) => {
          if (!item.hasOwnProperty('clickMethod')) {
            item.clickMethod = () => {
            }
          }
        })
      }

      // 3.1 table 默认值
      if (this.options && this.options.lbTable) {
        if (this.options.lbTable.hasOwnProperty('columns')) {
          this.options.lbTable.columns.forEach((item, index) => {
            // 如果有指定操作栏配置，格式化操作栏配置
            if (item.hasOwnProperty('operation')) {
              this.options.lbTable.columns[index] = this.formatColumnButtons(item)
            }

            // 如果有指定开关操作栏配置，格式化开关操作栏配置
            if (item.hasOwnProperty('switchOperation')) {
              this.options.lbTable.columns[index] = this.formatSwitchOperation(item)
            }

            // 如果有指定可查看权限，进行权限判断
            if (item.hasOwnProperty('vPermission') && !checkPermission(item.vPermission)) {
              this.options.lbTable.columns.splice(index, 1)
            } else {
              // 如果字段没有配置 vPermission，则判断是否是操作栏；如果是，自动判断操作栏下按钮是否全部没有权限，如果是自动移除该栏
              if (item.hasOwnProperty('operation')) {
                let isAllNotPermission = true
                this.options.lbTable.columns[index].operation.buttons.forEach(btn => {
                  if (btn.hasOwnProperty('group')) {
                    btn.group.forEach(btn => {
                      if (!btn.hasOwnProperty('vPermission') || checkPermission(btn.vPermission)) {
                        isAllNotPermission = false
                      }
                    })
                    return
                  }

                  if (!btn.hasOwnProperty('vPermission') || checkPermission(btn.vPermission)) {
                    isAllNotPermission = false
                  }
                })

                if (isAllNotPermission) {
                  this.options.lbTable.columns.splice(index, 1)
                }
              }
            }
          })
        }
      }

      // 没有配置过滤 请求列表数据
      const { filterForm, leftFilterForm } = this.options
      if ((!filterForm || !filterForm.form || !filterForm.form.rows.length) && (!leftFilterForm || !leftFilterForm.form || !leftFilterForm.form.rows.length)) {
        this.fetchList()
        return
      }
      // 只配置顶部过滤栏且没有自动刷新 请求列表数据
      if (filterForm && !filterForm.autoRefresh && !leftFilterForm) {
        this.fetchList()
        return
      }
      // 只配置左侧过滤栏且没有自动刷新 请求列表数据
      if (leftFilterForm && !leftFilterForm.autoRefresh && !filterForm) {
        this.fetchList()
      }
    },

    /**
     * 根据 column 配置，判断如果有配置 buttons，则自动转化为按钮栏的配置
     */
    formatColumnButtons(column) {
      const item = {
        ...column, render: (h, { row }) => {
          return (
            <ColumnOperation
              row={row}
              mode={column.operation.mode ? column.operation.mode : 'button'}
              buttons={column.operation.buttons}
              direction={column.operation.direction}
              onAutoRefresh={() => {
                this.fetchList()
              }}
            ></ColumnOperation>
          )
        }
      }

      // this.options.lbTable.columns.push(item)
      return item
    },

    /**
     * 根据 column 配置，显示开关操作
     */
    formatSwitchOperation(column) {
      const item = {
        ...column, render: (h, { row }) => {
          return (
            <SwitchOperation
              row={row}
              direction={column.switchOperation.direction}
              switches={column.switchOperation.switches}
              onAutoRefresh={() => {
                this.fetchList()
              }}
            >
            </SwitchOperation>
          )
        }
      }

      // this.options.lbTable.columns.push(item)
      return item
    },

    /**
     * filter 组件点击搜索
     * @param query
     */
    onSearch(query) {
      this.filters = Object.assign({}, this.leftFilters, query)
      console.log('onSearch event.', this.options.request.params)
      this.fetchList()
    },

    /**
     * 左侧filter 组件值变更
     * @param query
     */
    onLeftFilterChange(query) {
      this.leftFilters = { ...query }
      this.filters = Object.assign({}, this.filters, query) // 合并过滤参数

      // 向父组件传递过滤参数
      let filters = Object.assign({}, this.filters)
      if (this.options.request && this.options.request.params) {
        filters = Object.assign(filters, this.options.request.params)
      }
      this.$emit('filters-change', filters)

      if (this.options.leftFilterForm.autoRefresh) {
        // 这里会触发两次，一次是传来空参数加载数据，一次是传来defaultValue加载数据
        // 空参数本可以不必加载数据，为防止影响到其他地方，新增空参数不加载数据字段（emptyUnLoad）
        if (this.options.leftFilterForm.emptyUnLoad && Object.keys(query).length === 0) {
          return
        }
        this.fetchList()
      }
    },

    /**
     * filter 组件值变更
     * @param query
     */
    onChange(query) {
      // this.filters = {
      //   ...this.filters,
      //   ...query
      // }
      this.filters = Object.assign({}, this.leftFilters, query)

      // 向父组件传递过滤参数
      let filters = Object.assign({}, this.filters)
      if (this.options.request && this.options.request.params) {
        filters = Object.assign(filters, this.options.request.params)
      }
      this.$emit('filters-change', filters)

      if (this.options.filterForm.autoRefresh) {
        // 这里会触发两次，一次是传来空参数加载数据，一次是传来defaultValue加载数据
        // 空参数本可以不必加载数据，为防止影响到其他地方，新增空参数不加载数据字段（emptyUnLoad）
        if (this.options.filterForm.emptyUnLoad && Object.keys(query).length === 0) {
          return
        }
        console.log('FilterForm onChange: query: ', query)
        this.fetchList()
      }
    },

    /**
     * 单选模式：当前行
     */
    handleCurrentChange(row) {
      // p-current-change 也会触发 current-change 事件
      // 所以这里判断到不是 current-change 直接触发的事件，选择忽略
      if (row instanceof Object) {
        this.handleSelectionChange([row])
      }
    },

    /**
     * 选择多选
     * @param val
     */
    handleSelectionChange(val) {
      // 判断单选 or 多选
      let multiple = true
      if (this.options.lbTable.hasOwnProperty('selection') && this.options.lbTable.selection.multiple === false) {
        multiple = false
      }

      if (!multiple) {
        if (val.length === 0) {
          this.multipleSelection = []
        } else if (val.length === 1) {
          this.multipleSelection = val
        } else {
          const selectedItem = val.pop()
          this.$refs.lbTable.clearSelection()
          this.$refs.lbTable.toggleRowSelection(selectedItem)
          this.multipleSelection = [selectedItem]
        }
      } else {
        this.multipleSelection = val
      }

      // 多选选中, emit 事件：selection-change
      this.$emit('selection-change', this.multipleSelection)
    },

    /**
     * 分页组件修改分页大小
     * @param val
     */
    handleSizeChange(val) {
      this.listQuery.page = 1
      this.listQuery.pagesize = val
      this.fetchList()
    },

    /**
     * 切换当前列表分页
     */
    handlePCurrentChange(e) {
      this.fetchList()
    },

    /**
     * 查询列表
     */
    fetchList() {
      if (!this.options.request) {
        return
      }
      const ReqId = ++this.lastReqId
      this.listLoading = true

      // 设置过滤表单 loading 状态
      this.$refs.filterForm && (this.$refs.filterForm.toggleLoading(true))

      // 配置上默认的过滤配置
      if (this.options.request && this.options.request.params) {
        this.filters = {
          ...this.filters,
          ...this.options.request.params
        }
      }

      const req = this.options.request
      let params = { ...this.listQuery, ...this.filters }
      if (req.hasOwnProperty('formatterQuery')) {
        params = req.formatterQuery(params)
      }
      console.log(req, 'URL: fetchList, ', req.url, 'params: ', params, this.options.request)
      req.httpClient.get(req.url, { params }).then(res => {
        let list = res.data.list || res.data
        // 格式化列表数据
        if (this.options.lbTable.hasOwnProperty('formatter') && typeof this.options.lbTable.formatter === 'function') {
          list = this.options.lbTable.formatter(list, { ...this.filters })
        }
        if (ReqId === this.lastReqId) {
          // 开启模拟懒加载 解决树形表格展开卡顿问题
          if (this.options.lbTable.mockLazyLoad) {
            this.listBackup = this.formatTreeLazyLoadData(list) // 备份列表数据 用于懒加载时往list项添加children属性
            this.list = list.map((item, index) => {
              if (item.children && item.children.length > 0) {
                delete item.children // 模拟懒加载得删除children属性 否则无法开启lb-table组件的懒加载
                item.hasChildren = true
              } else {
                item.hasChildren = false
              }
              return item
            })
          } else {
            this.list = list
          }
          this.listLoading = false
          // 设置响应值
          this.total = res.data.total
          this.listQuery.page = res.data.page
          this.listQuery.pagesize = res.data.pagesize
        }
        this.$emit('input', this.list) // 设置 v-model 的值
        this.$emit('get-list', this.list)
        req.length = res.data.total // 传递数据总长度
        // console.log(this.list)
      }).catch(error => {
        this.listLoading = false
        console.log(error)
      }).finally(() => {
        this.$refs.filterForm && (this.$refs.filterForm.toggleLoading(false))
      })
    },

    /**
     * 将列表数据格式化成懒加载需要的数据格式
     * @param {Array} list 数据列表
     */
    formatTreeLazyLoadData(list) {
      if (!list || list.length === 0) {
        return []
      }
      const listCopy = JSON.parse(JSON.stringify(list))
      const result = listCopy.map(item => {
        if (item.children && item.children.length > 0) {
          item.children = this.formatTreeLazyLoadData(item.children)
          item.hasChildren = true // 表示表格是否需要懒加载(显示展开图标)
        } else {
          item.hasChildren = false
        }
        return item
      })
      return result
    },

    /**
     * 模拟懒加载
     * @param row
     * @param treeNode
     * @param resolve
     */
    mockLoadTreeData(row, treeNode, resolve) {
      console.log('模拟懒加载', row)
      // 表格多级嵌套
      if (row.children) {
        resolve(row.children)
        return
      }
      const listBackup = this.listBackup
      for (let i = 0; i < listBackup.length; i++) {
        if (listBackup[i].id === row.id) {
          // 点击一级行，动态添加备份中的子行
          resolve(listBackup[i].children || [])
          return
        }
      }
    },

    /**
     * 初始化表头吸顶所需参数
     */
    initStickyHeader() {
      const lbTable = this.options.lbTable
      if (!lbTable || (lbTable.hasOwnProperty('showHeader') && !lbTable.showHeader)) {
        return
      }
      const { stickyOffsetTop } = this.options.lbTable
      const stickyHeaderModel = new StickyHeaderModel()
      this.canIUseSticky = stickyHeaderModel.canIUseSticky
      this.$nextTick(() => {
        this.canIUseSticky && stickyHeaderModel.setStickyOffsetTop(stickyOffsetTop, this.id)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-list-filter-form {
  position: relative;
}

.folded {
  height: 110px;
  overflow-y: hidden;
}

.btn-fold {
  position: absolute;
  top: 15px;
  right: 15px;
}

.button-container {
  margin: 15px 0;
}

.filter-left {
  flex-shrink: 0;
  padding-right: 15px;
}

.lb-table-container {
  flex-grow: 1;
  //width: calc(100% - 256px);
}

// 修复合计时表格滚动条出现在合计顶部的问题
//.fix-scroll-bar {
//  /deep/ .el-table {
//    overflow: auto;
//  }
//
//  /deep/ .el-table__header-wrapper, /deep/ .el-table__body-wrapper, /deep/ .el-table__footer-wrapper {
//    overflow: visible;
//  }
//}

// 隐藏表头 因为直接设置show-header属性为false会报错（https://blog.csdn.net/zj25xy11/article/details/103156589）
.hide-header /deep/ .el-table__header{
  display:none
}

// 表头吸顶相关样式
.sticky-header {
  /deep/ .el-table {
    overflow: visible;
  }

  /deep/ .el-table__header-wrapper, /deep/ .el-table__fixed-header-wrapper {
    position: -webkit-sticky;
    position: sticky;
    top: 0px;
    z-index: 9;
    overflow: hidden;
  }

  /deep/ .el-table__fixed-header-wrapper {
    height: 44px;
  }

  /deep/ .el-table__fixed-right {
    overflow-x: visible;
    overflow-y: visible;
    z-index: 10;
    box-shadow: -5px 3px 10px -5px rgba(0, 0, 0, 0.1);

    .el-table__header, .el-table__body, .el-table__footer {
      position: absolute;
      right: 0;
    }

    .el-table__fixed-body-wrapper {
      width: 100%;
      height: calc(100% - 44px);
      overflow: hidden;
    }

    .el-table__fixed-footer-wrapper {
      width: 100%;
      overflow: hidden;
    }
  }

  /deep/ .el-table__fixed {
    overflow-x: visible;
    overflow-y: visible;
    z-index: 10;
    box-shadow: 5px 3px 10px -5px rgba(0, 0, 0, 0.1);

    .el-table__header, .el-table__body {
      position: absolute;
      left: 0;
    }

    .el-table__fixed-body-wrapper {
      width: 100%;
      height: calc(100% - 44px);
      overflow: hidden;
    }

    .el-table__fixed-footer-wrapper {
      width: 100%;
      overflow: hidden;
    }
  }
  // 表格滚动到右侧 隐藏右固定列阴影
  /deep/ .el-table__body-wrapper.is-scrolling-right ~ .el-table__fixed-right{
    box-shadow: none;
  }
  // 表格滚动到左侧 隐藏左固定列阴影
  /deep/ .el-table__body-wrapper.is-scrolling-left ~ .el-table__fixed {
    box-shadow: none;
  }
  // 表格无滚动条 隐藏左右固定列阴影
  /deep/.el-table__body-wrapper.is-scrolling-none{
    &~.el-table__fixed, &~.el-table__fixed-right {
      box-shadow: none;
    }
  }
}

/deep/ .form-title {
  margin-left: -15px;
}
</style>
