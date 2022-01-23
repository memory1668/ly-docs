import Layout from '@/layout'
import LayoutUserIndex from '@/views/finance/layout/index'

const childMenu1 = {
  name: 'spm-user',
  meta: { title: '顾客中心', icon: 'el-icon-bank-card', roles: ['admin'] },
  routers: [
    {
      path: '/user/overview',
      component: LayoutUserIndex,
      name: 'user-overview',
      meta: { title: '顾客概览', icon: 'icon-chart-bar' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/user/index'),
          name: 'user:index',
          meta: { title: '顾客概览', icon: 'icon-chart-bar' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '会员卡操作' },
              children: [
                { label: '会员管理', name: 'user-overview-member-management' },
                { label: '开通会员卡', name: 'user-overview-member-card-open' },
                { label: '线下充值', name: 'user-overview-member-card-offline-recharge' },
                { label: '线下扣费', name: 'user-overview-member-card-offline-consume' },
                { label: '会员卡消费记录', name: 'user-overview-member-card-update-record' }
              ]
            },
            {
              group: { title: '会员卡模板配置' },
              children: [
                { label: '会员卡模板设置', name: 'user-overview-member-card-template-setting' }
              ]
            },
            {
              group: { title: '顾客数据统计' },
              children: [
                { label: '查看顾客信息', name: 'user-overview-stat-list' }
              ]
            },
            {
              group: { title: '顾客数据库管理' },
              children: [
                { label: '全部顾客信息', name: 'user-overview-db-list' }
              ]
            },
            {
              group: { title: '营销工具' },
              children: [
                { label: '自动营销管理', name: 'user-overview-marketing-sms-plan' },
                { label: '进入手动营销', name: 'user-overview-marketing-customer' },
                { label: '进入手机号营销', name: 'user-overview-marketing-custom-marketing' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/user',
      component: Layout,
      name: 'user',
      meta: { title: '顾客资料', icon: 'icon-user' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/user/list'),
          name: 'user:list',
          meta: { title: '顾客资料', icon: 'icon-user' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '顾客管理' },
              children: [
                { label: '分配跟进人', name: 'merchant-user-alloc' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/user/card',
      component: Layout,
      name: 'user',
      meta: { title: '会员卡', icon: 'icon-vip-img' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/user/card/list'),
          name: 'user:members',
          meta: { title: '会员管理', icon: 'icon-vip-img' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '会员管理' },
              children: [
                { label: '开通会员卡', name: 'user-member-card-open' },
                { label: '线下充值', name: 'user-member-card-offline-recharge' },
                { label: '线下扣费', name: 'user-member-card-offline-consume' },
                { label: '积分兑换', name: 'user-member-card-integral-exchange' },
                { label: '余额转赠', name: 'user-member-card-amount-transfer' },
                { label: '修改会员资料', name: 'user-member-card-edit' },
                { label: '查看消费记录', name: 'user-member-card-update-record-view' },
                { label: '查看兑换记录', name: 'user-member-card-exchange-record-view' }
              ]
            }
          ]
        },
        {
          path: 'member-card-update-record',
          component: () => import('@/views/user/card/member-card-update-record'),
          name: 'user:member-card-update-record',
          meta: { title: '充值消费记录', icon: 'icon-order' }
        },
        {
          path: 'integral-update-record',
          component: () => import('@/views/user/card/integral-update-record'),
          name: 'integral-update-record',
          meta: { title: '积分兑换记录', icon: 'icon-order' }
        },
        {
          path: 'integral-rule',
          component: () => import('@/views/user/card/integral-rule'),
          name: 'integral-rule',
          meta: { title: '积分兑换规则', icon: 'icon-order' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '积分兑换规则' },
              children: [
                { label: '添加兑换规则', name: 'user-integral-rule-add' },
                { label: '修改兑换规则', name: 'user-integral-rule-edit' },
                { label: '修改积分兑换介绍', name: 'user-integral-intro-edit' }
              ]
            }
          ]
        },
        {
          path: 'template',
          component: () => import('@/views/user/card/template'),
          name: 'member-card-template',
          meta: { title: '会员卡模板', icon: 'icon-card' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '会员卡模板' },
              children: [
                { label: '添加', name: 'user-member-card-template-add' },
                { label: '修改', name: 'user-member-card-template-edit' },
                { label: '删除', name: 'user-member-card-template-delete' }
              ]
            }
          ]
        }
      ]
    },
    // {
    //   path: '/user/member-card-update-record',
    //   component: Layout,
    //   name: 'user:member-card-update-record',
    //   meta: { title: '消费记录', icon: 'icon-order' },
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/user/member-card-update-record'),
    //       name: 'user:member-card-update-record:index',
    //       meta: { title: '消费记录', icon: 'icon-order' }
    //     }
    //   ]
    // },
    // {
    //   path: '/user/card/setting',
    //   component: Layout,
    //   name: 'member-card-template',
    //   meta: { title: '会员卡设置', icon: 'icon-card' },
    //   children: [
    //     {
    //       path: '',
    //       component: () => import('@/views/user/card/setting'),
    //       name: 'setting',
    //       meta: { title: '会员卡设置', icon: 'icon-card' },
    //       buttons: [ // 页面需要配置权限的按钮
    //         {
    //           group: { title: '会员卡模板' },
    //           children: [
    //             { label: '添加', name: 'user-member-card-template-add' },
    //             { label: '修改', name: 'user-member-card-template-edit' },
    //             { label: '删除', name: 'user-member-card-template-delete' }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      path: '/user/voucher',
      component: Layout,
      name: 'voucher',
      meta: { title: '优惠券', icon: 'el-icon-s-ticket' },
      children: [
        {
          path: 'list',
          component: () => import('@/views/user/voucher/list'),
          name: 'list',
          meta: { title: '用户优惠券', icon: 'el-icon-s-ticket' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '用户优惠券操作' },
              children: [
                { label: '发放优惠券', name: 'user-voucher-add' },
                { label: '删除', name: 'user-voucher-delete' }
              ]
            }
          ]
        }, {
          path: 'template',
          component: () => import('@/views/user/voucher/template'),
          name: 'template',
          meta: { title: '优惠券模板', icon: 'el-icon-tickets' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '优惠券模板操作' },
              children: [
                { label: '新建优惠券模板', name: 'user-voucher-template-add' }
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
  name: 'group-spm-user',
  meta: { title: '顾客中心', roles: ['admin'] },
  children: [
    childMenu1
  ]

}

export default systemRouter
