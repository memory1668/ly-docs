// import Layout from '@/layout'

/**
 * 静态路由，所有用户都会有的路由
 * @type {*[]}
 */
const routeConstant = [
  // 默认没有指定访问路径，通过 src/permission.js 中获取第一个有权限访问的地址
  // {
  //   path: '',
  //   component: Layout,
  //   hidden: true,
  //   redirect: '/auto-redirect/index'
  // },

  {
    path: '/auto-redirect/index',
    component: () => import('../views/auto-redirect/index'),
    hidden: true
  },
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },
  {
    path: '/authorize',
    component: () => import('../views/login/authorize'),
    hidden: true
  }
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/auth-redirect'),
  //   hidden: true
  // },
  // {
  //   path: '/404',
  //   component: () => import('@/views/error-page/404'),
  //   hidden: true
  // },
  // {
  //   path: '/401',
  //   component: () => import('@/views/error-page/401'),
  //   hidden: true
  // }
]

export default routeConstant
