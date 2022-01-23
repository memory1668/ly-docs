import Layout from '@/layout'
import LayoutOutputIndex from '@/views/output/layout/index'

const childMenu1 = {
  name: 'spm-output',
  meta: { title: '出品台', icon: 'el-icon-fork-spoon', roles: ['admin'] },
  routers: [
    {
      path: '/output-wait',
      component: LayoutOutputIndex,
      name: 'output',
      meta: { title: '出品台', icon: 'icon-layers-2' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/output/list'),
          name: 'list',
          meta: { title: '出品台', icon: 'icon-layers-2' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '出品操作' },
              children: [
                { label: '确认出品（部分或全部）', name: 'output-confirm' },
                { label: '打印出品单', name: 'output-print-doc' }
              ]
            },
            {
              group: { title: '右边栏' },
              children: [
                { label: '配置打印机', name: 'output-config-printer' },
                { label: '配置自动操作', name: 'output-config-auto-operation' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/output',
      component: Layout,
      name: 'output',
      children: [
        {
          path: 'stat',
          component: () => import('@/views/output/stat'),
          name: 'stat',
          meta: { title: '出品报表', icon: 'icon-chart-bar' }
        }
      ]
    }
    // {
    //   path: '/output',
    //   component: Layout,
    //   name: 'output:out-list',
    //   children: [
    //     {
    //       path: 'out-list',
    //       component: () => import('@/views/output/index'),
    //       name: 'output:out-list',
    //       meta: { title: '酒水估清', icon: 'icon-calculator' }
    //     }
    //   ]
    // },
    // {
    //   path: '/output',
    //   component: Layout,
    //   name: 'output:out-list',
    //   children: [
    //     {
    //       path: 'forfeit',
    //       component: () => import('@/views/output/index'),
    //       name: 'output:forfeit-list',
    //       meta: { title: '酒水充公', icon: 'icon-recycle' }
    //     }
    //   ]
    // },
    // {
    //   path: '/output',
    //   component: Layout,
    //   name: 'output:damage-list',
    //   children: [
    //     {
    //       path: 'damage',
    //       component: () => import('@/views/output/index'),
    //       name: 'output:damage-list',
    //       meta: { title: '酒水报损', icon: 'icon-damage' }
    //     }
    //   ]
    // }
  ]
}

/**
 * 系统路由
 * @type {{path: string, component, redirect: string, alwaysShow: boolean, name: string, meta: {title: string, icon: string, roles: string[]}}[]}
 */
const systemRouter = {
  name: 'group-spm-output',
  meta: { title: '出品台', roles: ['admin'] },
  children: [
    childMenu1
  ]

}

export default systemRouter
