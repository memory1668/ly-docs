// import apiAccount from '@/api/account'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '../../router'
import store from '../../store'

const state = {
  // token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  rolePermission: null,
  staffName: '' // 员工姓名
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE_PERMISSION: (state, rolePermission) => {
    state.rolePermission = rolePermission
  },
  SET_STAFF_NAME: (state, staffName) => {
    state.staffName = staffName
  }
}

const actions = {
  /**
   * 用户登录(因为是扫码登录，所以直接将登录成功的 token 传过来初始化就行)
   * @param commit
   * @param userInfo
   * @returns {Promise<any>}
   */
  login({ commit }, userInfo) {
    const { token } = userInfo
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', token)
      // setToken(token)
      resolve()
    })
  },

  /**
   * 获取用户当前信息
   * @param commit
   * @param state
   * @returns {Promise<any>}
   */
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // apiAccount.getInfo().then(response => {
      //   const { data } = response
      //   if (!data) {
      //     reject('验证失败，请重新登录')
      //   }
      //
      //   // 处理响应结果
      //   const { roles, username, avatar, intro, rolePermission, staff_name } = data
      //   commit('SET_ROLES', roles)
      //   commit('SET_NAME', username)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_INTRODUCTION', intro)
      //   commit('SET_ROLE_PERMISSION', rolePermission)
      //   commit('SET_STAFF_NAME', staff_name)
      //   resolve({
      //     username: username,
      //     avatar: avatar,
      //     introduction: intro,
      //     roles: roles,
      //     rolePermission: rolePermission
      //   })
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_ROLE_PERMISSION', null) // 清空角色权限
      // removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      // removeToken()
      resolve()
    })
  },

  /**
   * 修改用户角色
   * @param commit
   * @param dispatch
   * @param role
   * @returns {Promise<any>}
   */
  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      // setToken(token)

      const { rolePermission } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', { rolePermission }, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      await store.dispatch('permission/changeRouterScope', { scope: store.getters.routerScope })

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
