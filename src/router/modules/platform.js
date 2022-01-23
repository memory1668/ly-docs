// import LayoutMain from '@/layout/main'
import LayoutPlatformIndex from '@/views/platform/layout/index'

/**
 * 默认第一项菜单
 * @type {{name: string, meta: {title: string, roles: string[]}, routers: {path: string, component, name: string, meta: {title: string, icon: string}, children: {path: string, component: (function(): (Promise<*>|*)), name: string, meta: {title: string, icon: string}}[]}[]}}
 */
const menu1 = {
  name: 'spm-platform',
  meta: { title: '咨客台', icon: 'el-icon-news', roles: ['admin'] },
  routers: [
    {
      path: '/platform',
      component: LayoutPlatformIndex,
      name: 'platform',
      meta: { title: '咨客台', icon: 'el-icon-tickets' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/platform/index'),
          name: 'index',
          meta: { title: '咨客台', icon: 'el-icon-tickets' },

          // 页面需要配置权限的按钮
          buttons: [
            {
              group: { title: '台位管理' },
              children: [
                { label: '查看所有台位消费', name: 'dashboard-view-all-desk-open-consume' },
                { label: '开台', name: 'desk-detail-open' },
                { label: '预订', name: 'desk-detail-reserve' },
                { label: '点单', name: 'desk-detail-order' },
                { label: '清台', name: 'desk-detail-clear' },
                { label: '换台', name: 'desk-detail-change' },
                { label: '并台', name: 'desk-detail-merge' },
                { label: '存酒', name: 'desk-detail-wine-card-save' },
                { label: '取酒', name: 'desk-detail-wine-card-get' },
                { label: '赠送', name: 'desk-detail-present' },
                { label: '锁台', name: 'desk-detail-lock' },
                { label: '解锁台', name: 'desk-detail-unlock' },
                { label: '复台', name: 'desk-detail-recover' },
                { label: '修改预订', name: 'desk-detail-edit-reserve' },
                { label: '取消预订', name: 'desk-detail-cancel-reserve' },
                { label: '转预订', name: 'desk-detail-transfer-reserve' },
                { label: '结账', name: 'desk-detail-pay' },
                { label: '修改订台人', name: 'desk-detail-edit-marketing-staff' },
                { label: '修改服务员', name: 'desk-detail-edit-serve-staff' },
                { label: '打印账单', name: 'desk-detail-print-order' },
                { label: '打印存酒单', name: 'desk-detail-print-wine-card-save' },
                { label: '修改服务员', name: 'desk-detail-modify-serve-staff' },
                { label: '打印取酒单', name: 'desk-detail-print-wine-card-get' },
                { label: '转单', name: 'desk-detail-transfer-order' },
                { label: '退单重点', name: 'desk-detail-charge-back-order' },
                { label: '退单退款', name: 'desk-detail-refund-order' },
                { label: '开始出品', name: 'desk-detail-accept-order' },
                { label: '预出品', name: 'desk-detail-pre-accept-order' },
                { label: '出品催单', name: 'desk-detail-output-remind' },
                { label: '确认收款（线下支付）', name: 'desk-detail-confirm-pay' },
                { label: '取消订单', name: 'desk-detail-cancel-order' },
                { label: '取消赠送单', name: 'desk-detail-cancel-giving-order' },
                { label: '开启/关闭台费', name: 'set-desk-open-fee' },
                { label: '台位显示顾客信息', name: 'desk-detail-show-customer-info' },
                { label: '台位显示预订顾客信息', name: 'desk-detail-show-reverse-customer-info' },
                { label: '修改台位顾客信息', name: 'edit-customer-info' },
                { label: '修改台位低消', name: 'edit-desk-open-mini-consume-amount' }
              ]
            },
            {
              group: { title: '右边栏' },
              children: [
                { label: '最新', name: 'platform-right-tab-latest-order' },
                { label: '酒吧', name: 'platform-right-tab-merchant' },
                { label: '排行', name: 'platform-right-tab-ranking' },
                { label: '酒吧 - 修改营业/休息', name: 'platform-right-tab-merchant:edit-status' },
                { label: '酒吧 - 配置打印机', name: 'platform-right-tab-merchant:config-printer' },
                { label: '酒吧 - 配置自动操作', name: 'platform-right-tab-merchant:config-auto-operation' },
                { label: '酒吧 - 快捷操作', name: 'platform-right-tab-merchant:quick-menu' },
                { label: '排行 - 营销员业绩', name: 'platform-right-tab-ranking:ranking-marketing-staff-performance' },
                { label: '排行 - 台位实时排行', name: 'platform-right-tab-ranking:ranking-marketing-staff-desk' }
              ]
            },
            {
              group: { title: '主界面' },
              children: [

                { label: '全部清台', name: 'platform-main-clear-all' },
                { label: '预订管理', name: 'platform-main-reserve' }
              ]
            }
          ]
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
  name: 'group-spm-community',
  meta: { title: '咨客台', roles: ['admin'] },
  children: [
    menu1
  ]

}

export default systemRouter
