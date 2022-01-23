<template>
  <div>
    <el-tabs v-model="activeTabName" tab-position="top">
      <el-tab-pane v-for="(module, index) in data" :key="index" :label="module.label" :name="module.name">
        <div>
          <el-checkbox
            v-model="module.is_checked_all"
            @change="changeCheckPage($event, module)"
          >[{{ module.label }}] 的所有权限
          </el-checkbox>
        </div>

        <div>
          <div v-for="(page, pageIndex) in module.children" :key="'page-' + pageIndex" class="mb-15">
            <div class="bold module-title mb-15">{{ page.label }}</div>
            <el-checkbox
              v-for="(btn, btnIndex) in page.children"
              :key="'btn-' + btnIndex"
              v-model="btn.is_checked"
              :label="btn.label"
              size="small"
              @change="changeCheckBtn($event, {btn: btn, moduleIndex: index, pageIndex: pageIndex, btnIndex: btnIndex}, page, module)"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 页面配置
const PAGE_CONFIG = [
  {
    label: '首页',
    name: 'mobile-home',
    children: [
      {
        label: '首页',
        name: 'default',
        children: [
          { label: '每日业绩', name: 'daily-performance' },
          { label: '历史开台', name: 'history-desk-open' },
          // { label: '今日订单', name: 'today-order-list' },
          { label: '部门统计', name: 'department-stat' }
        ]
      }
    ]
  },
  {
    label: '咨客台',
    name: 'mobile-platform',
    children: [
      {
        label: '咨客台',
        name: 'default',
        children: [
          { label: '查看所有台位消费', name: 'view-all-desk-open-consume' },
          { label: '赠送', name: 'do-giving' },
          { label: '开台', name: 'mobile-desk-open' },
          { label: '锁台', name: 'mobile-desk-lock' },
          { label: '解锁台', name: 'mobile-desk-unlock' },
          { label: '预订', name: 'mobile-desk-reserve' },
          { label: '修改预订', name: 'mobile-desk-reserve-modify' },
          { label: '取消预订', name: 'mobile-desk-reserve-cancel' },
          { label: '转预订', name: 'mobile-desk-reserve-transfer' }
        ]
      }
    ]
  },
  {
    label: '办公',
    name: 'mobile-office',
    children: [
      {
        label: '员工管理',
        name: 'online',
        children: [
          { label: '部门管理', name: 'department' },
          { label: '入职办理', name: 'staff-work' },
          { label: '员工离职', name: 'edit-department' }
        ]
      }, {
        label: '客户管理',
        name: 'customer',
        children: [
          { label: '我的客户', name: 'my-customer' }
        ]
      }
    ]
  },
  {
    label: '获客',
    name: 'mobile-marketing',
    children: [
      {
        label: '概览',
        name: 'default',
        children: [
          { label: '查看近7天老顾客激活情况', name: 'weekly-customer-active' }
        ]
      },
      {
        label: '短信营销',
        name: 'sms-marketing',
        children: [
          { label: '营销计划', name: 'marketing-plan' },
          { label: '顾客激活计划', name: 'customer-active' },
          { label: '账户充值', name: 'sms-cost' }
        ]
      }
    ]
  },
  {
    label: '统计',
    name: 'mobile-stat',
    children: [
      {
        label: '业绩汇总',
        name: 'default',
        children: [
          { label: '查看3天业绩走势', name: 'latest-performance-trend' },
          { label: '查看今日业绩', name: 'today-performance' },
          { label: '查看自定义营业额类型', name: 'custom-performance' }
        ]
      },
      {
        label: '业绩统计',
        name: 'performance-stat',
        children: [
          { label: '营业报表', name: 'report-performance' },
          { label: '部门业绩', name: 'department-performance' },
          { label: '员工业绩', name: 'staff-performance' },
          { label: '今日员工排行', name: 'today-staff-ranking-performance' }
        ]
      },
      {
        label: '订单收银',
        name: 'order-bill-stat',
        children: [
          { label: '财务交接报表', name: 'stat-hand-over-report' },
          { label: '点单统计', name: 'stat-order-default' },
          { label: '开通会员卡', name: 'stat-member-card-open' },
          { label: '会员卡充值', name: 'stat-member-card-recharge' },
          { label: '挂账统计', name: 'stat-hang-debt' },
          { label: '赠送统计', name: 'stat-giving' }
          // { label: '纯支付统计', name: 'stat-pure-pay' },
          // { label: '线上支付流水', name: 'stat-online-bill' },
          // { label: '支付方式统计', name: 'stat-pay-type' }
        ]
      },
      {
        label: '顾客会员',
        name: 'user-stat',
        children: [
          { label: '新增顾客', name: 'stat-new-user' },
          { label: '所有顾客', name: 'stat-all-user' },
          { label: '今日到访', name: 'stat-visit-user' }
        ]
      },
      {
        label: '台情分析',
        name: 'desk-stat',
        children: [
          { label: '台情分析', name: 'desk-analysis' }
        ]
      },
      {
        label: '出品存取酒',
        name: 'order-make-wine-stat',
        children: [
          { label: '出品报表', name: 'stat-output' },
          { label: '存取酒统计', name: 'stat-store-wine' }
        ]
      },
      {
        label: '仓库管理',
        name: 'warehouse-management',
        children: [
          { label: '仓库统计', name: 'total' },
          { label: '入库统计', name: 'inbound' },
          { label: '出库统计', name: 'outbound' }
        ]
      }
    ]
  }
]

export default {
  name: 'SelectMobilePermissionIndex',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 选中的 tab
      activeTabName: '',

      scopeMap: {},
      visible: true,
      data: [],

      result: {
        checked: [],
        halfChecked: []
      },

      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 表单已配置的模块、页面、按钮权限映射关系
      checkedPermissions: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        if (!val || !val.is_init) { // 如果有指定初始化参数，才进行初始化
          return
        }

        // 初始化信息
        this.checkedPermissions = val
        this.formatData()

        this.emitValue()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.formatData()
  },
  methods: {

    /**
     * 格式化配置
     */
    formatConfig(config, namePrefix = '', level = 0) {
      config.forEach((page, pageIndex) => {
        page.name = (level === 0 ? page.name : namePrefix + page.name)
        page.is_checked = !!this.checkedPermissions[page.name]

        if (page.children && page.children.length > 0) {
          page.children = this.formatConfig(page.children, page.name + ':', level + 1)
        }
      })

      return config
    },

    /**
       * 模块选择变更
       */
    changeCheckPage(isChecked, module) {
      module.is_checked_all = isChecked
      module.is_checked = isChecked

      // 遍历子页面，全部标记为选中状态
      module.children.forEach(page => {
        page.is_checked = isChecked

        // 页面标记为选中
        page.children.forEach(btn => {
          btn.is_checked = isChecked
        })
      })

      this.data = Object.assign([], this.data)

      this.emitValue()
    },

    /**
       * 按钮选择变更
       */
    changeCheckBtn(isChecked, btnInfo, page, module) {
      console.log('--> btn info: ', btnInfo, isChecked)

      this.data[btnInfo.moduleIndex].children[btnInfo.pageIndex].children[btnInfo.btnIndex].is_checked = isChecked
      this.data = Object.assign([], this.data)

      if (!isChecked) {
        module.is_checked_all = false
      } else {
        module.is_checked = true
        page.is_checked = true
      }

      // 判断模块是否完全选择或部分选择
      let isModuleCheckedAll = true
      let isModuleHasChecked = false
      module.children.forEach(page => {
        let isPageHasChecked = false // 判断页面是否选中
        page.children.forEach(btn => {
          if (!btn.is_checked) {
            isModuleCheckedAll = false
          }

          if (btn.is_checked) {
            isModuleHasChecked = true
            isPageHasChecked = true
          }
        })
        page.is_checked = isPageHasChecked
      })

      module.is_checked_all = isModuleCheckedAll
      module.is_checked = isModuleHasChecked
      console.log(this.data)
      this.emitValue()
    },

    /**
       * emit 值
       */
    emitValue() {
      const val = {
        modules: [],
        pages: [],
        buttons: []
      }
      this.data.forEach((module, index) => {
        // 1.1 一级模块
        if (module.is_checked) {
          val.modules.push({
            name: module.name,
            label: module.label
          })
        }

        // 2.1 页面
        module.children.forEach((page, pageIndex) => {
          if (page.is_checked) {
            val.pages.push({
              name: page.name,
              label: page.label
            })
          }

          page.children.forEach((btn, btnIndex) => {
            if (btn.is_checked) {
              val.buttons.push({
                name: btn.name,
                label: btn.label
              })
            }
          })
        })
      })

      console.log(val)
      this.$emit('input', val)
    },

    /**
       * 格式化数据
       */
    formatData() {
      this.activeTabName = PAGE_CONFIG[0].name
      const cfg = JSON.parse(JSON.stringify(PAGE_CONFIG))
      this.data = this.formatConfig(cfg, '')
      console.log('--> formatted data: ', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
  .page-item {
    padding: 5px;
    margin-right: 10px;
    border: 1px solid #efefef;
    border-radius: 5px;
  }

  .page-row {
    display: flex;
    flex-direction: row;
    padding: 15px 0;
    border-bottom: 1px dashed #efefef;
  }

  .page-row-buttons {
    flex: 1;
    /*display: flex;*/
    /*flex-direction: row;*/
    /*flex-wrap: wrap;*/
    padding: 0 15px;
  }

  .column-page-item {
    width: 120px;
  }

  .module-title {
    line-height: 1em;
    margin-top: 15px;
  }

  .button-group {
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .button-group-title {
    line-height: 1em;
    margin-bottom: 5px;
    color: #9b9b9b;
  }
</style>
