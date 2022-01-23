import Layout from '@/layout'
import EmptyLayout from '@/layout/empty'
import LayoutStat from '@/views/stat/layout/index'

const childMenu1 = {
  name: 'spm-stat',
  meta: { title: '数据分析', icon: 'el-icon-data-analysis', roles: ['admin'] },
  routers: [
    {
      path: '/stat',
      component: LayoutStat,
      name: 'stat',
      meta: { title: '汇总概览', icon: 'dashboard' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/stat/index'),
          name: 'index',
          meta: { title: '汇总概览', icon: 'dashboard' }
        }
      ]
    },
    {
      path: '/stat/today',
      component: EmptyLayout,
      name: 'stat:today',
      hidden: true,
      meta: { title: '今日大盘', icon: 'dashboard' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/stat/daily-dashboard/index'),
          name: 'index',
          meta: { title: '今日大盘', icon: 'dashboard' }
        }
      ]
    },
    {
      path: '/stat/biz',
      component: Layout,
      name: 'stat:biz',
      meta: { title: '营业报表', icon: 'icon-data-view' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/stat/biz'),
          name: 'biz',
          meta: { title: '营业报表', icon: 'icon-data-view' }
        }
      ]
    },
    {
      path: '/stat/performance-marketing',
      component: Layout,
      name: 'stat:performance-marketing',
      meta: { title: '营销业绩', icon: 'el-icon-s-custom' },
      children: [
        // {
        //   path: 'month-performance',
        //   component: () => import('@/views/stat/month-performance'),
        //   name: 'month-performance',
        //   meta: { title: '业绩概览', icon: 'icon-chart-bar' }
        // },
        {
          path: 'department',
          component: () => import('@/views/stat/performance-marketing/department'),
          name: 'department',
          meta: { title: '部门业绩', icon: 'icon-user-group' }
        },
        {
          path: 'staff',
          component: () => import('@/views/stat/performance-marketing/staff'),
          name: 'staff',
          meta: { title: '员工业绩', icon: 'icon-user' }
        },
        {
          path: 'staff-month-ranking',
          component: () => import('@/views/stat/performance-marketing/staff-month-ranking'),
          name: 'staff-month-ranking',
          meta: { title: '业绩排行', icon: 'el-icon-medal-1' }
        }
      ]
    },
    {
      path: '/stat/performance-commission',
      component: Layout,
      name: 'stat:performance-commission',
      meta: { title: '提成人业绩', icon: 'el-icon-user-solid' },
      children: [
        // {
        //   path: 'month-performance',
        //   component: () => import('@/views/stat/month-performance'),
        //   name: 'month-performance',
        //   meta: { title: '业绩概览', icon: 'icon-chart-bar' }
        // },
        {
          path: 'department',
          component: () => import('@/views/stat/performance-commission/department'),
          name: 'department',
          meta: { title: '部门业绩', icon: 'icon-user-group' }
        },
        {
          path: 'staff',
          component: () => import('@/views/stat/performance-commission/staff'),
          name: 'staff',
          meta: { title: '员工业绩', icon: 'icon-user' }
        },
        {
          path: 'staff-month-ranking',
          component: () => import('@/views/stat/performance-commission/staff-month-ranking'),
          name: 'staff-month-ranking',
          meta: { title: '业绩排行', icon: 'el-icon-medal-1' }
        }
      ]
    },
    {
      path: '/stat/performance-serve',
      component: Layout,
      name: 'stat:performance-serve',
      meta: { title: '服务员业绩', icon: 'el-icon-s-order' },
      children: [
        // {
        //   path: 'month-performance',
        //   component: () => import('@/views/stat/month-performance'),
        //   name: 'month-performance',
        //   meta: { title: '业绩概览', icon: 'icon-chart-bar' }
        // },
        {
          path: 'department',
          component: () => import('@/views/stat/performance-serve/department'),
          name: 'index',
          meta: { title: '部门业绩', icon: 'icon-user-group' }
        },
        {
          path: 'staff',
          component: () => import('@/views/stat/performance-serve/staff'),
          name: 'staff',
          meta: { title: '员工业绩', icon: 'icon-user' }
        },
        {
          path: 'staff-month-ranking',
          component: () => import('@/views/stat/performance-serve/staff-month-ranking'),
          name: 'staff-month-ranking',
          meta: { title: '业绩排行', icon: 'el-icon-medal-1' }
        }
      ]
    },
    // {
    //   path: '/stat/department',
    //   component: Layout,
    //   name: 'stat:department',
    //   meta: { title: '部门业绩', icon: 'icon-data-bar' },
    //   children: [
    //     // {
    //     //   path: 'month-performance',
    //     //   component: () => import('@/views/stat/month-performance'),
    //     //   name: 'month-performance',
    //     //   meta: { title: '业绩概览', icon: 'icon-chart-bar' }
    //     // },
    //     {
    //       path: 'index',
    //       component: () => import('@/views/stat/department'),
    //       name: 'index',
    //       meta: { title: '部门业绩', icon: 'icon-user-group' }
    //     },
    //     {
    //       path: 'staff',
    //       component: () => import('@/views/stat/staff'),
    //       name: 'staff',
    //       meta: { title: '员工业绩', icon: 'icon-user' }
    //     },
    //     {
    //       path: 'staff-month-ranking',
    //       component: () => import('@/views/stat/staff-month-ranking'),
    //       name: 'staff-month-ranking',
    //       meta: { title: '业绩排行', icon: 'icon-data-bar' }
    //     }
    //   ]
    // },
    // {
    //   path: '/stat',
    //   component: Layout,
    //   name: 'stat',
    //   children: [
    //     {
    //       path: 'vip-card',
    //       component: () => import('@/views/stat/index'),
    //       name: 'stat:vip-card',
    //       meta: { title: '充值业绩', icon: 'icon-recharge-money' }
    //     }
    //   ]
    // },
    // {
    //   path: '/stat',
    //   component: Layout,
    //   name: 'stat',
    //   children: [
    //     {
    //       path: 'other',
    //       component: () => import('@/views/stat/index'),
    //       name: 'stat:other',
    //       meta: { title: '其他业绩', icon: 'icon-data-view' }
    //     }
    //   ]
    // },
    {
      path: '/stat/product-sku',
      component: Layout,
      name: 'stat:product-sku',
      meta: { title: '酒水分析', icon: 'icon-wine' },
      children: [
        // {
        //   path: 'index',
        //   component: () => import('@/views/stat/product-sku/index'),
        //   name: 'index',
        //   meta: { title: '销售分析', icon: 'icon-data-view' }
        // },
        // {
        //   path: 'stat-order',
        //   component: () => import('@/views/stat/product-sku/stat-order'),
        //   name: 'stat-order',
        //   meta: { title: '销售报表', icon: 'bill' }
        // },
        {
          path: 'stat-category-order',
          component: () => import('@/views/stat/product-sku/stat-category-order'),
          name: 'stat-category-order',
          meta: { title: '分类销售报表', icon: 'bill' }
        },
        {
          path: 'product-profit',
          component: () => import('@/views/stat/product-profit'),
          name: 'product-profit',
          meta: { title: '利润报表', icon: 'bill' }
        }
      ]
    },
    {
      path: '/stat/zone-desk',
      component: Layout,
      name: 'stat:zone-desk',
      meta: { title: '台号分析', icon: 'icon-sofa' },
      children: [
        {
          path: 'desk',
          component: () => import('@/views/stat/zone-desk/desk'),
          name: 'desk',
          meta: { title: '开台统计', icon: 'icon-sofa' }
        }
        // {
        //   path: 'desk-item',
        //   component: () => import('@/views/stat/zone-desk/desk-item'),
        //   name: 'desk-item',
        //   meta: { title: '台情分析', icon: 'icon-hot' }
        // },
        // {
        //   path: 'zone',
        //   component: () => import('@/views/stat/zone-desk/zone'),
        //   name: 'zone',
        //   meta: { title: '分区统计', icon: 'icon-folder' }
        // }
      ]
    },
    {
      path: '/stat/giving',
      component: Layout,
      name: 'stat:giving',
      meta: { title: '赠送统计', icon: 'icon-gift' },
      children: [
        {
          path: 'daily-giving',
          component: () => import('@/views/stat/giving/daily-giving'),
          name: 'daily-giving',
          meta: { title: '每日赠送', icon: 'icon-gift' }
        },
        {
          path: 'monthly-giving',
          component: () => import('@/views/stat/giving/monthly-giving'),
          name: 'monthly-giving',
          meta: { title: '每月赠送', icon: 'icon-gift' }
        }
      ]
    }
    // {
    //   path: '/stat/user',
    //   component: Layout,
    //   name: 'stat:user',
    //   meta: { title: '顾客会员', icon: 'icon-user-group' },
    //   children: [
    //     {
    //       path: 'new',
    //       component: () => import('@/views/stat/user/new'),
    //       name: 'new',
    //       meta: { title: '新顾客', icon: 'icon-user' }
    //     }
    //     // {
    //     //   path: 'index',
    //     //   component: () => import('@/views/stat/index'),
    //     //   name: 'index',
    //     //   meta: { title: '顾客消费', icon: 'icon-data-view' }
    //     // },
    //     // {
    //     //   path: 'member',
    //     //   component: () => import('@/views/stat/index'),
    //     //   name: 'member',
    //     //   meta: { title: '会员分析', icon: 'icon-data-view' }
    //     // }
    //   ]
    // }
  ]
}

/**
 * 系统路由
 * @type {{path: string, component, redirect: string, alwaysShow: boolean, name: string, meta: {title: string, icon: string, roles: string[]}}[]}
 */
const systemRouter = {
  name: 'group-spm-stat',
  meta: { title: '数据分析', roles: ['admin'] },
  children: [
    childMenu1
  ]

}

export default systemRouter
