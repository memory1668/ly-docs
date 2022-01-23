import { spreadListScopedRouters } from '../utils/router'
// 路由模块导入
import platform from './modules/platform'
import user from './modules/user'
import system from './modules/system'
import warehouse from './modules/warehouse'
import finance from './modules/finance'
import stat from './modules/stat'
import storeSystem from './modules/store-system'
import output from './modules/ouput'
import marketing from './modules/marketing'

/**
 * 路由配置
 * 备注：新的作用域路由配置直接在此配置就可以
 *
 */
const listScopedRouters = [
  platform,
  output,
  finance,
  storeSystem,
  warehouse,
  user,
  marketing,
  stat,
  system

]

// 路由和路由作用域配置
const { scopeList, routerList } = spreadListScopedRouters(listScopedRouters)
const routeAsync = [
  ...routerList,

  // 404 page 需要配置在最后
  { path: '*', redirect: '/404', hidden: true }
]

export { scopeList }
export default routeAsync
