const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,

  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  // merchant
  merchant: state => state.merchant,
  staff: state => state.staff,

  user: state => state.user,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  rolePermission: state => state.user.rolePermission,

  permission_routes: state => state.permission.routes,
  routerScope: state => state.permission.routerScope,
  scopeList: state => state.permission.scopeList,

  // 当前选中的仓库
  warehouse: state => state.warehouse.warehouse,
  receipt: state => state.warehouse.receipt,

  // 当前选中抖音账号
  douyinAccount: state => state.douyin.account,

  // 设置
  settings: state => state.settings,

  errorLogs: state => state.errorLog.logs,

  // 线下支付方式
  customOfflinePayMethods: state => state.customOfflinePayMethod.customOfflinePayMethods,
  customOfflinePayMethodsMap: state => state.customOfflinePayMethod.customOfflinePayMethodsMap,

  // 开台是否必选服务员 && 营销员
  isDeskOpenRequireServeStaff: state => state.merchant.isDeskOpenRequireServeStaff,
  isDeskOpenRequireMarketingStaff: state => state.merchant.isDeskOpenRequireMarketingStaff,

  // 订单修改服务员
  modifyDeskOpenServeStaff: state => state.merchant.modifyDeskOpenServeStaff
}
export default getters
