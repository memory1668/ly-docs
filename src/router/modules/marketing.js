import Layout from '@/layout'
import LayoutMarketingIndex from '@/views/marketing/layout/index'

const childMenu1 = {
  name: 'spm-marketing',
  meta: { title: '营销获客', icon: 'el-icon-wind-power', roles: ['admin'] },
  routers: [
    {
      path: '/marketing/preview',
      component: LayoutMarketingIndex,
      name: 'store-system',
      meta: { title: '营销概览', icon: 'icon-chart-bar' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/marketing/index'),
          name: 'store-system:index',
          meta: { title: '营销概览', icon: 'icon-chart-bar' }
        }
      ]
    },
    {
      path: '/marketing',
      component: Layout,
      name: 'marketing',
      meta: { title: '活动管理', icon: 'icon-hot' },
      children: [
        {
          path: 'activity/list',
          component: () => import('@/views/marketing/activity/list'),
          name: 'activity:list',
          meta: { title: '活动管理', icon: 'icon-marketing' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '活动营销' },
              children: [
                { label: '添加', name: 'marketing-activity-add' },
                { label: '修改', name: 'marketing-activity-edit' },
                { label: '删除', name: 'marketing-activity-delete' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/marketing/user',
      component: Layout,
      name: 'marketing:sms-marketing',
      meta: { title: '短信营销', icon: 'el-icon-message' },
      // hidden: true,
      children: [
        {
          path: 'sms-plan',
          component: () => import('@/views/marketing/sms/plan'),
          name: 'sms-plan',
          meta: { title: '营销计划', icon: 'el-icon-document-checked' }
        },
        {
          path: 'plan/list',
          hidden: true,
          component: () => import('@/views/marketing/plan/list'),
          name: 'plan:list',
          meta: { title: '营销激活', icon: 'icon-share-round' }
        },
        {
          path: 'customer',
          component: () => import('@/views/marketing/sms/customer-active'),
          name: 'customer',
          meta: { title: '顾客激活', icon: 'icon-user-group' }
        },
        {
          path: 'custom-marketing',
          component: () => import('@/views/marketing/sms/custom-marketing'),
          name: 'custom-marketing',
          meta: { title: '手机号营销', icon: 'icon-sms' }
        },
        {
          path: 'sms-template',
          component: () => import('@/views/marketing/sms/template'),
          name: 'sms-template',
          meta: { title: '短信模板', icon: 'icon-mobile' }
        },
        {
          path: 'sms-cost',
          component: () => import('@/views/marketing/sms/sms-cost'),
          name: 'sms-cost',
          meta: { title: '短信余额', icon: 'icon-order' }
        }
      ]
    },
    {
      path: '/marketing/douyin',
      component: Layout,
      name: 'marketing:douyin-marketing',
      meta: { title: '抖音营销', icon: 'icon-douyin' },
      // hidden: true,
      children: [
        {
          path: 'account',
          component: () => import('@/views/marketing/douyin/account'),
          name: 'account',
          meta: { title: '抖音号', icon: 'icon-douyin' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '抖音号操作' },
              children: [
                { label: '控制台', name: 'marketing-douyin-view-console' },
                { label: '删除抖音号', name: 'marketing-douyin-account-delete' },
                { label: '配置员工', name: 'marketing-douyin-account-staff' }
              ]
            }
          ]
        },
        {
          path: 'potential-customer',
          component: () => import('@/views/marketing/douyin/potential-customer'),
          name: 'potential-customer',
          meta: { title: '潜客分析', icon: 'icon-user-group' },
          buttons: [{
            group: { title: '潜客分析操作' },
            children: [
              { label: '查看详情', name: 'marketing-douyin-potential-customer-detail' },
              { label: '私信', name: 'marketing-douyin-potential-customer-message' }
            ]
          }]
        },
        {
          path: 'console',
          component: () => import('@/views/marketing/douyin/console/index'),
          name: 'douyin-console',
          meta: { title: '控制台', icon: 'el-icon-s-operation' }
        }
        // {
        //   path: 'custom-marketing',
        //   component: () => import('@/views/marketing/sms/custom-marketing'),
        //   name: 'index',
        //   meta: { title: '手机号营销', icon: 'icon-sms' }
        // },
        // {
        //   path: 'sms-cost',
        //   component: () => import('@/views/marketing/sms/sms-cost'),
        //   name: 'index',
        //   meta: { title: '短信余额', icon: 'icon-order' }
        // }
      ]
    }
    // {
    //   path: '/marketing',
    //   component: Layout,
    //   name: 'system',
    //   meta: { title: '分享引流', icon: 'icon-hot' },
    //   children: [
    //     {
    //       path: 'share',
    //       component: () => import('@/views/account/index'),
    //       name: 'system:department',
    //       meta: { title: '分享引流', icon: 'icon-share-round' }
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
  name: 'group-spm-marketing',
  meta: { title: '运营营销', roles: ['admin'] },
  children: [
    childMenu1
  ]

}

export default systemRouter
