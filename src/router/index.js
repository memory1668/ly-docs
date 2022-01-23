import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// -----------------------------------------------------------------------------------------------------
//
// Route 路由元素和菜单的配置规则
//
// -----------------------------------------------------------------------------------------------------
// Note: sub-menu only appear when route children.length >= 1
// Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
//
// hidden: true                   if set true, item will not show in the sidebar(default is false)
// alwaysShow: true               if set true, will always show the root menu
//                                if not set alwaysShow, when item has more than one children route,
//                                it will becomes nested mode, otherwise not show the root menu
// redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
// name:'router-name'             the name is used by <keep-alive> (must set!!!)
// meta : {
//  roles: ['admin','editor']    control the page roles (you can set multiple roles)
//  title: 'title'               the name show in sidebar and breadcrumb (recommend set)
//  icon: 'svg-name'             the icon show in the sidebar
//  noCache: true                if set true, the page will no be cached(default is false)
//  affix: true                  if set true, the tag will affix in the tags-view
//  breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
//  activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
// }
// -----------------------------------------------------------------------------------------------------
//
// 注意：左侧菜单栏如果期望有弹出子菜单，那么 children 的元素至少得有 2 个元素
//
// -----------------------------------------------------------------------------------------------------
import constantRoutes from './route-constant'
// import asyncRoutes, { scopeList } from './route-async'

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// export 路由配置
export {
  // 静态路由，所有用户都会有的路由
  constantRoutes

  // 动态路由，根据用户角色和路由分组进行显示

  // 路由作用域配置
}

export default router
