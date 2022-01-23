import Layout from '@/layout'
import EmptyLayout from '@/layout/empty'
import LayoutFinanceIndex from '@/views/finance/layout/index'
import LayoutFinancePro from '@/views/finance-pro/layout/index'

const childMenu1 = {
  name: 'spm-finance',
  meta: { title: '财务工作台', icon: 'el-icon-tickets', roles: ['admin'] },
  routers: [
    {
      path: '/finance/quick',
      component: LayoutFinanceIndex,
      name: 'finance:quick',
      meta: { title: '财务概览', icon: 'icon-chart-bar' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/finance/index'),
          name: 'index',
          meta: { title: '财务概览', icon: 'icon-chart-bar' }
        }
      ]
    },
    // 点单参考：https://wenku.baidu.com/view/1e64cacd86868762caaedd3383c4bb4cf7ecb732.html
    {
      path: '/finance',
      component: Layout,
      name: 'finance:order',
      meta: { title: '订单管理', icon: 'icon-order' },
      children: [
        {
          path: 'desk-open',
          component: () => import('@/views/finance/desk-open'),
          name: 'desk-open',
          meta: { title: '开台历史', icon: 'icon-order' }
          // buttons: [ // 页面需要配置权限的按钮
          //   {
          //     group: { title: '开台记录' },
          //     children: [
          //       // { label: '打印账单', name: 'finance-desk-open' }
          //     ]
          //   }
          // ]
        },
        {
          path: 'commission-order',
          component: () => import('@/views/finance/commission-order'),
          name: 'commission-order',
          meta: { title: '商品提成记录', icon: 'icon-order' }
          // buttons: [ // 页面需要配置权限的按钮
          //   {
          //     group: { title: '开台记录' },
          //     children: [
          //       // { label: '打印账单', name: 'finance-desk-open' }
          //     ]
          //   }
          // ]
        },
        {
          path: 'index',
          component: () => import('@/views/finance/order'),
          name: 'index',
          meta: { title: '订单管理', icon: 'icon-order' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '订单详情' },
              children: [
                { label: '收银交接报表', name: 'order-export-handover-report' },
                { label: '财务审计报表', name: 'finance-export-handover-report' },
                { label: '消费项目明细', name: 'finance-export-order-item' },
                { label: '打印账单', name: 'finance-order-detail-print-order' }
              ]
            }
          ]
        },
        {
          path: 'abnormal-order',
          component: () => import('@/views/finance/abnormal-order'),
          name: 'exception-order',
          meta: { title: '异常订单', icon: 'el-icon-magic-stick' }
        }
      ]
    },
    {
      path: '/finance/handover-report',
      component: EmptyLayout,
      name: 'finance:for-print-finance-handover-report',
      meta: { title: '收银交接报表 - 预览打印', icon: 'icon-order' },
      hidden: true,
      children: [
        {
          path: 'for-print',
          component: () => import('@/views/finance/for-print-finance-handover-report'),
          name: 'for-print-finance-handover-report',
          meta: { title: '收银交接报表', icon: 'icon-order' }
        }
      ]
    },
    {
      path: '/finance/handover-report/for-print',
      component: EmptyLayout,
      name: 'finance:for-print-handover-report',
      meta: { title: '财务审计报表 - 预览打印', icon: 'icon-order' },
      hidden: true,
      children: [
        {
          path: 'index',
          component: () => import('@/views/finance/for-print-handover-report'),
          name: 'for-print-handover-report',
          meta: { title: '财务审计报表', icon: 'icon-order' }
        }
      ]
    },

    {
      path: '/finance/hang-debt',
      component: Layout,
      name: 'finance:hang-debt',
      meta: { title: '挂账管理', icon: 'icon-hang-debt' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/finance/hang-debt/index'),
          name: 'index',
          meta: { title: '挂账记录', icon: 'icon-hang-debt' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '挂账挂账记录' },
              children: [
                { label: '操作还款', name: 'finance-hang-debt-operation-refund' },
                { label: '打印挂账单', name: 'finance-hang-debt-operation-print' },
                { label: '更多', name: 'finance-hang-debt-more' }
              ]
            }
          ]
        },
        {
          path: 'pay-record',
          component: () => import('@/views/finance/hang-debt/pay-record'),
          name: 'pay-record',
          meta: { title: '还款记录', icon: 'el-icon-document-checked' }
        }
      ]
    },
    {
      path: '/finance/staff-giving',
      component: Layout,
      name: 'finance:staff-giving',
      meta: { title: '赠送分析', icon: 'icon-gifg' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/finance/staff-giving'),
          name: 'index',
          meta: { title: '员工赠送', icon: 'icon-gift' },
          buttons: [ // 页面需要配置权限的按钮
            // {
            //   group: { title: '挂账管理' },
            //   children: [
            //     { label: '操作还款', name: 'finance-hang-debt-operation-refund' },
            //     { label: '打印挂账单', name: 'finance-hang-debt-operation-print' },
            //     { label: '更多', name: 'finance-hang-debt-more' }
            //   ]
            // }
          ]
        }
      ]
    },
    // {
    //   path: '/finance/bill',
    //   component: Layout,
    //   name: 'finance:bill',
    //   meta: { title: '线上流水', icon: 'icon-bill' },
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/finance/bill'),
    //       name: 'index',
    //       meta: { title: '线上流水', icon: 'icon-bill' }
    //     }
    //   ]
    // },
    {
      path: '/finance/settlement',
      component: Layout,
      name: 'finance:settlement',
      meta: { title: '每日结算', icon: 'icon-export' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/finance/settlement'),
          name: 'index',
          meta: { title: '每日结算', icon: 'icon-export' }
        }
      ]
    },
    // {
    //   path: '/finance',
    //   component: Layout,
    //   name: 'finance',
    //   children: [
    //     {
    //       path: 'change-order',
    //       component: () => import('@/views/finance/index'),
    //       name: 'finance:order',
    //       meta: { title: '换单退单', icon: 'icon-export' }
    //     }
    //   ]
    // },
    // {
    //   path: '/finance',
    //   component: Layout,
    //   name: 'finance',
    //   children: [
    //     {
    //       path: 'change-product-order',
    //       component: () => import('@/views/finance/index'),
    //       name: 'finance:order',
    //       meta: { title: '换品退品', icon: 'icon-folder' }
    //     }
    //   ]
    // },
    // {
    //   path: '/finance',
    //   component: Layout,
    //   name: 'finance',
    //   children: [
    //     {
    //       path: 'member-order',
    //       component: () => import('@/views/finance/index'),
    //       name: 'finance:order',
    //       meta: { title: '会员充值', icon: 'icon-card' }
    //     }
    //   ]
    // },
    // {
    //   path: '/finance',
    //   component: Layout,
    //   name: 'finance',
    //   children: [
    //     {
    //       path: 'present-order',
    //       component: () => import('@/views/finance/index'),
    //       name: 'finance:order',
    //       meta: { title: '赠送管理', icon: 'icon-gift' }
    //     }
    //   ]
    // },
    {
      path: '/finance/stat-order-month',
      component: Layout,
      name: 'finance:stat-order-month',
      meta: { title: '月度汇总', icon: 'icon-month' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/finance/stat-order-month'),
          name: 'index',
          meta: { title: '月度汇总', icon: 'icon-month' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '月度汇总' },
              children: [
                { label: '导出', name: 'finance-stat-order-month-export' }
              ]
            }
          ]
        }
      ]
    },
    // {
    //   path: '/finance/stat-order',
    //   component: Layout,
    //   name: 'finance:stat-order',
    //   meta: { title: '销售报表', icon: 'icon-month' },
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/finance/stat-order'),
    //       name: 'index',
    //       meta: { title: '销售报表', icon: 'icon-sale-report' }
    //     }
    //   ]
    // },
    {
      path: '/finance-pro',
      component: LayoutFinancePro,
      name: 'finance-pro',
      meta: { title: '专业财务工作台', icon: 'icon-chart-bar' },
      hidden: true,
      children: [
        {
          path: 'index',
          component: () => import('@/views/finance-pro/index'),
          name: 'index',
          meta: { title: '首页', icon: 'icon-chart-bar' }
        },
        {
          path: 'group',
          component: () => import('@/views/finance-pro/settings/index'),
          name: 'group',
          meta: { title: '基础配置', icon: 'icon-chart-bar' }
        },
        {
          path: 'rule',
          component: () => import('@/views/finance-pro/rule/index'),
          name: 'rule',
          meta: { title: '提成规则制定', icon: 'icon-chart-bar' }
        },
        {
          path: 'scheme',
          component: () => import('@/views/finance-pro/scheme/index'),
          name: 'scheme',
          meta: { title: '员工提成方案', icon: 'icon-chart-bar' }
        },
        {
          path: 'commission-stat',
          component: () => import('@/views/finance-pro/commission-stat/index'),
          name: 'commission-stat',
          meta: { title: '业绩提成数据分析', icon: 'icon-chart-bar' }
        },
        {
          path: 'product-stat',
          component: () => import('@/views/finance-pro/product-stat/index'),
          name: 'product-stat',
          meta: { title: '酒水数据分析', icon: 'icon-chart-bar' }
        }
      ]
    }
  ]
}

/**
 * 系统路由
 * @type {{path: string, component, redirect: string, alwaysShow: boolean, name: string, meta: {title: string, icon: string, roles: string[]}}[]}
 */
const systemRouter = {
  name: 'group-spm-finance',
  meta: { title: '财务工作台', roles: ['admin'] },
  children: [
    childMenu1
  ]
}

export default systemRouter
