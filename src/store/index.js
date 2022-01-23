import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)

/**
 * 导入 modules 所有子模块
 * you do not need `import app from './modules/app'`
 * it will auto require all vuex module from modules file
 */
// https://webpack.js.org/guides/dependency-management/#requirecontext
const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

/**
 * 创建 Store
 * @type {Store}
 */
const store = new Vuex.Store({
// 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。
// 生产环境不启用严格模式
// 当在严格模式中使用 Vuex 时，在属于 Vuex 的 state 上使用 v-model 会比较棘手：https://vuex.vuejs.org/zh/guide/forms.html
// strict: process.env.NODE_ENV !== 'production',

  modules,
  getters
})

export default store
