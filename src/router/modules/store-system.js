import Layout from '@/layout'
import LayoutStoreSystem from '@/views/store-system/layout/index'

const childMenu1 = {
  name: 'spm-store-system',
  meta: { title: '存取酒', icon: 'el-icon-cold-drink', roles: ['admin'] },
  routers: [
    {
      path: '/store-system-overview',
      component: LayoutStoreSystem,
      name: 'store-system:overview',
      meta: { title: '概览', icon: 'icon-chart-bar' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/store-system/index'),
          name: 'index',
          meta: { title: '存酒概览', icon: 'icon-chart-bar' }
        }
      ]
    },
    {
      path: '/store-system',
      component: Layout,
      name: 'store-system',
      meta: { title: '存取酒', icon: 'icon-layers' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/store-system/list'),
          name: 'list',
          meta: { title: '存取酒', icon: 'icon-layers' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '存取酒管理' },
              children: [
                { label: '存酒', name: 'store-system-wine-card-save' },
                { label: '取酒', name: 'store-system-wine-card-get' },
                { label: '导入', name: 'store-system-wine-card-import' },
                { label: '查看存酒记录', name: 'store-system-wine-card-action-save-list' },
                { label: '查看取酒记录', name: 'store-system-wine-card-action-get-list' },
                { label: '取酒不需要验证码', name: 'store-system-wine-card-get-without-code' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/store-system/action-list',
      component: Layout,
      name: 'store-system',
      meta: { title: '存取记录', icon: 'icon-order' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/store-system/action-list'),
          name: 'action-list:index',
          meta: { title: '存取记录', icon: 'icon-order' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '存取记录' },
              children: [
                { label: '打印存酒单', name: 'store-system-wine-card-save-print' },
                { label: '打印取酒单', name: 'store-system-wine-card-get-print' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/store-system/stat',
      component: Layout,
      name: 'store-system:stat',
      meta: { title: '存取汇总', icon: 'icon-chart-bar' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/store-system/stat'),
          name: 'index',
          meta: { title: '存取汇总', icon: 'icon-chart-bar' }
        }
      ]
    },
    {
      path: '/store-system/stat-full',
      component: Layout,
      name: 'store-system:stat-full',
      meta: { title: '整支汇总', icon: 'icon-chart-bar' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/store-system/stat-full'),
          name: 'index',
          meta: { title: '整支汇总', icon: 'icon-chart-bar' }
        }
      ]
    },
    {
      path: '/store-system/save-list',
      component: Layout,
      name: 'store-system:save-list',
      meta: { title: '存酒明细', icon: 'el-icon-box' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/store-system/save-list'),
          name: 'index',
          meta: { title: '顾客存酒明细', icon: 'el-icon-box' }
        },
        {
          path: 'expire',
          component: () => import('@/views/store-system/expire-list'),
          name: 'expire',
          meta: { title: '存酒过期报表', icon: 'el-icon-document-delete' }
        }
      ]
    },
    {
      path: '/store-system/remain',
      component: Layout,
      name: 'store-system:remain',
      meta: { title: '剩余存酒汇总', icon: 'el-icon-receiving' },
      children: [
        {
          path: 'summary',
          component: () => import('@/views/store-system/remain-summary'),
          name: 'summary',
          meta: { title: '剩余存酒汇总', icon: 'el-icon-receiving' }
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
  name: 'group-spm-store-system',
  meta: { title: '存酒系统', roles: ['admin'] },
  children: [
    childMenu1
  ]

}

export default systemRouter
