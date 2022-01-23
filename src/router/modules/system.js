import Layout from '@/layout'
import LayoutSystem from '@/views/system/layout/index'

const childMenu1 = {
  name: 'spm-system',
  meta: { title: '系统', icon: 'el-icon-set-up', roles: ['admin'] },
  routers: [
    {
      path: '/system/dashboard',
      component: LayoutSystem,
      name: 'system:dashboard',
      meta: { title: '商户资料', icon: 'icon-merchant-card' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/system/dashboard'),
          name: 'index',
          meta: { title: '首页导航', icon: 'el-icon-guide' }
        }
      ]
    },
    {
      path: '/system',
      component: Layout,
      name: 'system:merchant',
      meta: { title: '商户资料', icon: 'icon-merchant-card' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/system/index'),
          name: 'index',
          meta: { title: '商户资料', icon: 'icon-merchant-card' }
        },
        {
          path: 'basic',
          component: () => import('@/views/system/merchant'),
          name: 'basic',
          meta: { title: '门店信息', icon: 'icon-basic' }
        }
      ]
    },
    {
      path: '/system/merchant',
      component: Layout,
      name: 'system:printer',
      meta: { title: '打印机', icon: 'icon-printer' },
      children: [
        {
          path: 'printer',
          component: () => import('@/views/system/printer'),
          name: 'index',
          meta: { title: '打印机', icon: 'icon-printer' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '打印机管理' },
              children: [
                { label: '添加', name: 'system-printer-add' },
                { label: '修改', name: 'system-printer-edit' },
                { label: '激活', name: 'system-printer-active' },
                { label: '查看打印任务', name: 'system-printer-view-task' },
                { label: '删除', name: 'system-printer-delete' }
              ]
            }
          ]
        },
        {
          path: 'category-printer',
          component: () => import('@/views/system/category-printer'),
          name: 'category-printer',
          meta: { title: '分类出品', icon: 'nested' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '分类出品' },
              children: [
                { label: '添加', name: 'system-category-printer-add' },
                { label: '启用', name: 'system-category-printer-enable' },
                { label: '停用', name: 'system-category-printer-disable' },
                { label: '删除', name: 'system-category-printer-delete' }
              ]
            }
          ]
        },
        {
          path: 'printer-task',
          component: () => import('@/views/system/printer-task'),
          name: 'task',
          meta: { title: '打印任务', icon: 'icon-order' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '打印任务' },
              children: [
                { label: '重新打印', name: 'system-printer-task-reprint' }
              ]
            }
          ]
        },
        {
          path: 'print-setting',
          component: () => import('@/views/system/print-setting'),
          name: 'print-setting',
          meta: { title: '打印配置', icon: 'icon-setting' }
        }
      ]
    },
    {
      path: '/system/department',
      component: Layout,
      name: 'department',
      meta: { title: '部门管理', icon: 'icon-team' },
      children: [
        {
          path: 'architecture',
          component: () => import('@/views/system/department/architecture'),
          name: 'architecture',
          meta: { title: '公司部门', icon: 'icon-department' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '公司架构' },
              children: [
                { label: '添加下级部门', name: 'system-department-add' },
                { label: '修改部门', name: 'system-department-edit' },
                { label: '添加部门负责人', name: 'system-department-add-manager' },
                { label: '移除部门负责人', name: 'system-department-remove-manager' },
                { label: '删除部门', name: 'system-department-delete' }
              ]
            }
          ]
        },
        {
          path: 'staff',
          component: () => import('@/views/system/department/staff'),
          name: 'staff',
          meta: { title: '员工管理', icon: 'icon-staff' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '员工管理' },
              children: [
                { label: '配置服务台号', name: 'system-staff-config-service-desk' },
                { label: '添加', name: 'system-staff-add' },
                { label: '修改', name: 'system-staff-edit' },
                { label: '删除', name: 'system-staff-delete' }
              ]
            }
          ]
        },
        {
          path: 'role',
          component: () => import('@/views/system/department/role'),
          name: 'role',
          meta: { title: '角色权限', icon: 'icon-staff' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '角色管理' },
              children: [
                { label: '添加', name: 'system-role-add' },
                { label: '修改', name: 'system-role-edit' },
                { label: '删除', name: 'system-role-delete' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/system/scheme-giving',
      component: Layout,
      name: 'scheme-giving',
      meta: { title: '赠送方案', icon: 'icon-gift' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/system/scheme-giving/index'),
          name: 'role',
          meta: { title: '赠送方案', icon: 'icon-gift' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '赠送方案和权限' },
              children: [
                { label: '添加赠送方案', name: 'system-scheme-giving-add' },
                { label: '添加部门/员工权限', name: 'system-scheme-giving-add-target' },
                { label: '修改赠送方案', name: 'system-scheme-giving-edit' },
                { label: '删除赠送方案', name: 'system-scheme-giving-delete' }
              ]
            }
          ]
        }
      ]
    },
    // {
    //   path: '/system/pay-method',
    //   component: Layout,
    //   name: 'pay-method',
    //   meta: { title: '支付方式', icon: 'icon-money-pocket' },
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/system/pay-method/index'),
    //       name: 'role',
    //       meta: { title: '支付方式', icon: 'icon-money-pocket' },
    //       buttons: [ // 页面需要配置权限的按钮
    //         {
    //           group: { title: '支付方式' },
    //           children: [
    //             { label: '添加支付方式', name: 'system-pay-method-add' },
    //             { label: '修改支付方式', name: 'system-pay-method-edit' },
    //             { label: '删除支付方式', name: 'system-pay-method-delete' }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // },
    {
      path: '/system/performance-type',
      component: Layout,
      name: 'performance-type',
      meta: { title: '营业额类型', icon: 'icon-data-bar' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/system/performance-type/index'),
          name: 'role',
          meta: { title: '营业额类型', icon: 'icon-data-bar' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '营业额类型' },
              children: [
                { label: '添加营业额类型', name: 'system-performance-type-add' },
                { label: '修改营业额类型', name: 'system-performance-type-edit' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/system/performance-fee',
      component: Layout,
      name: 'performance-fee',
      meta: { title: '业绩提成', icon: 'icon-lock' },
      children: [
        {
          path: 'department-product',
          component: () => import('@/views/system/performance-fee/department-product'),
          name: 'department-product',
          meta: { title: '酒水提成人', icon: 'icon-staff' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '酒水提成人' },
              children: [
                { label: '添加', name: 'system-department-product-add' },
                { label: '删除', name: 'system-department-product-delete' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/system/department-visible-product',
      component: Layout,
      name: 'department-visible-product',
      meta: { title: '部门可见商品', icon: 'icon-team' },
      children: [
        {
          path: 'department-visible-product',
          component: () => import('@/views/system/department-visible-product/index'),
          name: 'department-visible-product',
          meta: { title: '限制部门商品', icon: 'el-icon-set-up' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '部门可见商品' },
              children: [
                { label: '添加', name: 'system-department-visible-product-add' },
                { label: '修改', name: 'system-department-visible-product-edit' },
                { label: '删除', name: 'system-department-visible-product-delete' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/system/scheme-commission',
      component: Layout,
      name: 'scheme-commission',
      meta: { title: '提成方案', icon: 'icon-staff' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/system/scheme-commission/index'),
          name: 'role',
          meta: { title: '提成方案', icon: 'el-icon-medal' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '提成方案' },
              children: [
                { label: '添加提成方案', name: 'system-scheme-commission-add' },
                { label: '修改提成方案', name: 'system-scheme-commission-edit' }
              ]
            }
          ]
        },
        {
          path: 'stat-daily-staff-task',
          component: () => import('@/views/system/scheme-commission/stat-daily-staff-task'),
          name: 'stat-daily-staff-task',
          meta: { title: '重算提成任务', icon: 'el-icon-s-claim' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '重算提成任务' },
              children: [
                { label: '新建任务', name: 'system-stat-daily-staff-task-add' },
                { label: '执行任务', name: 'system-stat-daily-staff-task-exec' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/system/zone-desk',
      component: Layout,
      name: 'system',
      meta: { title: '台号管理', icon: 'icon-sofa' },
      children: [
        {
          path: 'zone',
          component: () => import('@/views/system/zone-desk/zone'),
          name: 'zone-desk:zone',
          meta: { title: '分区管理', icon: 'icon-zone' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '分区管理' },
              children: [
                { label: '添加', name: 'system-zone-add' },
                { label: '修改', name: 'system-zone-edit' },
                { label: '删除', name: 'system-zone-delete' }
              ]
            }
          ]
        },
        {
          path: 'desk',
          component: () => import('@/views/system/zone-desk/desk'),
          name: 'zone-desk:desk',
          meta: { title: '台号管理', icon: 'icon-sofa' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '台号管理' },
              children: [
                { label: '添加', name: 'system-desk-add' },
                { label: '修改', name: 'system-desk-edit' },
                { label: '删除', name: 'system-desk-delete' }
              ]
            }
          ]
        },
        {
          path: 'desk-open-fee-scheme',
          component: () => import('@/views/system/zone-desk/desk-open-fee-scheme'),
          name: 'zone-desk:desk:desk-open-fee-scheme',
          meta: { title: '开台费方案', icon: 'icon-desk-open-fee' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '开台费方案' },
              children: [
                { label: '添加', name: 'system-desk-open-scheme-add' },
                { label: '修改', name: 'system-desk-open-scheme-edit' },
                { label: '删除', name: 'system-desk-open-scheme-delete' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/system/system-configuration',
      component: Layout,
      name: 'system',
      meta: { title: '系统配置', icon: 'icon-setting' },
      children: [
        {
          path: 'pay',
          component: () => import('@/views/system/system-configuration/pay-method'),
          name: 'pay',
          meta: { title: '支付方式', icon: 'icon-money-pocket' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '支付方式' },
              children: [
                { label: '添加支付方式', name: 'system-pay-method-add' },
                { label: '修改支付方式', name: 'system-pay-method-edit' },
                { label: '删除支付方式', name: 'system-pay-method-delete' }
              ]
            }
          ]
        },
        {
          path: 'merchant',
          component: () => import('@/views/system/system-configuration/merchant-configuration'),
          name: 'configuration-merchant',
          meta: { title: '商家配置', icon: 'icon-setting' }
        }
      ]
    },
    {
      path: '/system/op-records',
      component: Layout,
      name: 'system:op-records',
      meta: { title: '操作日志', icon: 'icon-setting' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/system/op-record/index'),
          name: 'index',
          meta: { title: '操作日志', icon: 'el-icon-tickets' }
        }
      ]
    },
    // {
    //   path: '/system/permission',
    //   component: Layout,
    //   name: 'system',
    //   meta: { title: '角色管理', icon: 'icon-lock' },
    //   children: [
    //     {
    //       path: 'commission',
    //       component: () => import('@/views/account/index'),
    //       name: 'system:department',
    //       meta: { title: '提成方案', icon: 'icon-money-pocket' }
    //     }
    //   ]
    // },
    {
      path: '',
      component: Layout,
      name: 'system',
      meta: { title: '关于连娱宝', icon: 'icon-info' },
      children: [
        {
          path: 'https://lianyubao.com',
          name: 'official-link',
          meta: { title: '关于连娱宝', icon: 'icon-info' }
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
  name: 'group-spm-system',
  meta: { title: '系统', roles: ['admin', 'editor'] },
  children: [
    childMenu1
  ]
}

export default systemRouter
