import Layout from '@/layout'
import LayoutEmpty from '@/layout/empty'
import WarehouseManageLayout from '@/views/warehouse-manage/warehouse/layout/index'

const childMenu1 = {
  name: 'spm-warehouse',
  meta: { title: '进销存', icon: 'el-icon-receiving', roles: ['admin'] },
  routers: [
    // {
    //   path: '/warehouse-manage',
    //   component: Layout,
    //   name: 'warehouse-manage',
    //   meta: { title: '仓库概览', icon: 'icon-chart-bar' },
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/views/warehouse-manage/index'),
    //       name: 'warehouse-manage:index',
    //       meta: { title: '仓库概览', icon: 'icon-chart-bar' }
    //     }
    //   ]
    // },
    {
      path: '/warehouse',
      component: Layout,
      name: 'warehouse:product',
      meta: { title: '小程序', icon: 'icon-mini' },
      children: [
        {
          path: 'product',
          component: () => import('@/views/warehouse/product/index'),
          name: 'warehouse:product',
          meta: { title: '点单商品', icon: 'icon-wine' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '商品操作' },
              children: [
                { label: '添加', name: 'warehouse-product-add' },
                { label: '修改', name: 'warehouse-product-edit' },
                { label: '修改库存/售价', name: 'warehouse-product-inventory-price-edit' },
                { label: '上架', name: 'warehouse-product-online-operation' },
                { label: '下架', name: 'warehouse-product-offline-operation' },
                { label: '删除', name: 'warehouse-product-delete' }
              ]
            }
          ]
        },
        {
          path: 'operation',
          component: () => import('@/views/warehouse/package/index'),
          name: 'warehouse:operation',
          meta: { title: '点单套餐', icon: 'icon-package' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '套餐操作' },
              children: [
                { label: '添加', name: 'warehouse-package-add' },
                { label: '修改', name: 'warehouse-package-edit' },
                { label: '上架', name: 'warehouse-package-online-operation' },
                { label: '下架', name: 'warehouse-package-offline-operation' },
                { label: '删除', name: 'warehouse-package-delete' }
              ]
            }
          ]
        },
        {
          path: 'category',
          component: () => import('@/views/warehouse/category/index'),
          name: 'warehouse:category',
          meta: { title: '点单分类', icon: 'icon-layers' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '分类操作' },
              children: [
                { label: '添加', name: 'warehouse-category-add' },
                { label: '修改', name: 'warehouse-category-edit' },
                { label: '删除', name: 'warehouse-category-delete' }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '/warehouse-manage/warehouse/list',
      component: Layout,
      name: 'warehouse-manage',
      meta: { title: '仓库管理', icon: 'icon-layers' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/warehouse-manage/warehouse/index'),
          name: 'warehouse-manage:warehouse',
          meta: { title: '仓库管理', icon: 'icon-layers' },
          buttons: [ // 页面需要配置权限的按钮
          ]
        }
      ]
    },

    {
      path: '/warehouse-manage/warehouse',
      component: WarehouseManageLayout,
      name: 'warehouse-manage',
      hidden: true,
      meta: { title: '仓库管理', icon: 'icon-layers' },
      children: [
        {
          path: 'receipt/index',
          component: () => import('@/views/warehouse-manage/warehouse/receipt/index'),
          name: 'receipt:index',
          hidden: true,
          meta: { title: '入库单', icon: 'icon-layers', activeMenu: '/warehouse-manage/warehouse/list/index' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '入库单操作' },
              children: [
                { label: '打印', name: 'warehouse-in-print' }
              ]
            }
          ]
        },
        {
          path: 'receipt/outbound',
          component: () => import('@/views/warehouse-manage/warehouse/receipt/outbound'),
          name: 'receipt:outbound',
          hidden: true,
          meta: { title: '出库单', icon: 'icon-layers', activeMenu: '/warehouse-manage/warehouse/list/index' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '出库单操作' },
              children: [
                { label: '打印', name: 'warehouse-out-print' }
              ]
            }
          ]
        },
        {
          path: 'receipt/check',
          component: () => import('@/views/warehouse-manage/warehouse/receipt/check'),
          name: 'receipt:check',
          hidden: true,
          meta: { title: '盘点单', icon: 'icon-layers', activeMenu: '/warehouse-manage/warehouse/list/index' },
          buttons: [ // 页面需要配置权限的按钮
            {
              group: { title: '盘点单操作' },
              children: [
                { label: '打印', name: 'warehouse-check-print' }
              ]
            }
          ]
        },
        {
          path: 'warehouse-product/index',
          component: () => import('@/views/warehouse-manage/warehouse/warehouse-product/index'),
          name: 'product:search',
          hidden: true,
          meta: { title: '商品查询', icon: 'icon-layers', activeMenu: '/warehouse-manage/warehouse/list/index' },
          buttons: [ // 页面需要配置权限的按钮
          ]
        }
      ]
    },
    {
      path: '/warehouse-manage/warehouse/print',
      component: LayoutEmpty,
      name: 'warehouse-print',
      hidden: true,
      meta: { title: '入库单出库单盘点单打印', icon: 'el-icon-printer' },
      children: [{
        path: 'index',
        component: () => import('@/views/warehouse-manage/warehouse/receipt/print'),
        name: 'receipt:print',
        hidden: true,
        meta: { title: '打印', icon: 'el-icon-printer' }
      }]
    },
    {
      path: '/warehouse-manage/product',
      component: Layout,
      name: 'warehouse-manage',
      meta: { title: '商品管理', icon: 'icon-wine' },
      children: [
        {
          path: 'index',
          component: () => import('@/views/warehouse-manage/product/index'),
          name: 'product:index',
          meta: { title: '商品管理', icon: 'icon-wine' },
          buttons: [ // 页面需要配置权限的按钮
          ]
        }
      ]
    },
    {
      path: '/warehouse-manage/category',
      component: Layout,
      name: 'warehouse-manage',
      meta: { title: '资产分类', icon: 'category' },
      children: [
        {
          path: '',
          component: () => import('@/views/warehouse-manage/category'),
          name: 'warehouse:category',
          meta: { title: '资产分类', icon: 'category' },
          buttons: [ // 页面需要配置权限的按钮
          ]
        }
      ]
    },
    {
      path: '/warehouse-manage/supplier',
      component: Layout,
      name: 'warehouse-manage',
      meta: { title: '供应商', icon: 'icon-user' },
      children: [
        {
          path: '',
          component: () => import('@/views/warehouse-manage/supplier'),
          name: 'warehouse-manage:supplier',
          meta: { title: '供应商', icon: 'icon-user' },
          buttons: [ // 页面需要配置权限的按钮
          ]
        }
      ]
    }

    // {
    //   path: '/warehouse/operation',
    //   component: Layout,
    //   name: 'warehouse:package',
    //   meta: { title: '套餐管理', icon: 'icon-package' },
    //   children: [
    //   ]
    // },
    // {
    //   path: '/warehouse/category',
    //   component: Layout,
    //   name: 'warehouse:category',
    //   meta: { title: '分类管理', icon: 'icon-layers' },
    //   children: [
    //     {
    //       path: '',
    //       component: () => import('@/views/warehouse/category/index'),
    //       name: 'warehouse:category',
    //       meta: { title: '分类管理', icon: 'icon-layers' },
    //       buttons: [ // 页面需要配置权限的按钮
    //         {
    //           group: { title: '分类操作' },
    //           children: [
    //             { label: '添加', name: 'warehouse-category-add' },
    //             { label: '修改', name: 'warehouse-category-edit' },
    //             { label: '删除', name: 'warehouse-category-delete' }
    //           ]
    //         }
    //       ]
    //     }
    //   ]
    // }
    // {
    //   path: '/warehouse',
    //   component: Layout,
    //   name: 'warehouse:category',
    //   children: [
    //     {
    //       path: 'category',
    //       component: () => import('@/views/warehouse/index'),
    //       name: 'warehouse:category',
    //       meta: { title: '分类管理', icon: 'category' }
    //     }
    //   ]
    // },
    // {
    //   path: '/warehouse/product',
    //   component: Layout,
    //   name: 'warehouse',
    //   children: [
    //     {
    //       path: 'category',
    //       component: () => import('@/views/owner/category-product/index'),
    //       name: 'OwnerCategoryProductIndex',
    //       meta: { title: '商品分类', icon: 'icon-layers' }
    //     }
    //   ]
    // },
    // {
    //   path: '/warehouse',
    //   component: Layout,
    //   name: 'warehouse',
    //   children: [
    //     {
    //       path: 'record',
    //       component: () => import('@/views/warehouse/index'),
    //       name: 'warehouse:record',
    //       meta: { title: '变更记录', icon: 'icon-toggle-right' }
    //     }
    //   ]
    // },
    // {
    //   path: '/warehouse',
    //   component: Layout,
    //   name: 'warehouse:notify',
    //   children: [
    //     {
    //       path: 'setting-notify',
    //       component: () => import('@/views/warehouse/index'),
    //       name: 'warehouse:notify',
    //       meta: { title: '预警设置', icon: 'icon-mobile' }
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
  name: 'group-spm-warehouse',
  meta: { title: '进销存', roles: ['admin'] },
  children: [
    childMenu1
  ]

}

export default systemRouter
