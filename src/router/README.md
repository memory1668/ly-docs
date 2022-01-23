router 结构和配置方式说明
---
一、目录结构

范例：

````
|____index.js
|____README.md
|____route-constant.js
|____route-async.js
|____modules
| |____system.js
| |____demo.js
| |____components
| | |____charts.js
| | |____components.js
| | |____table.js
| | |____nested.js
````

二、详细介绍

1. 项目的菜单整体分为两个区域：页面顶部菜单和左侧导航。
2. modules 目录主要是分模块显示左侧菜单。按照 scope（作用域） 定义某个作用域下，左侧菜单显示的菜单有哪些。
3. 当点击顶部菜单栏的时候，设置当前选中的 scope，通过 Vuex(store) 刷新左侧菜单栏。
4. 为了目录结构更清晰，有了上面的目录结构：

- index.js 是 router 的入口。
- route-async.js 是动态路由配置(页面上会根据角色、权限判断可访问和不可访问的路由)，也就是上面提到的作用域路由配置汇总。
- route-constant.js 是静态路由配置，也就是这些路由是固定存在的，不因当前账户、角色、作用域的影响，比如：登录界面、帮助页等人畜无害的路由配置。
- modules 按照顶部菜单独立配置每个顶部菜单的作用域和对应的路由。
- modules/components 有的作用域菜单太多元素，可以再把里面的元素封装到 components 里面，或者个别路由多处共用，也可以封装到 components 里面。

三、路由配置参考

动态路由配置，打开 route-async.js ，将新建在 modules 里面的当个作用域路由配置 import 进来。

接着配置在此处：

````
route-sync.js

/**
 * 路由配置
 * 备注：新的作用域路由配置直接在此配置就可以
 *
 */
const listScopedRouters = [
  systemRouter,
  demoRouter,
  -> 将作用域路由配置加载这里 <-
]

如：

const listScopedRouters = [
  systemRouter,
  demoRouter,
  
  // 新添加配置
  myOwnRouter
]
````

注意，module 中的作用域路由配置如下：

````
const systemRouter = {
  name: 'group-spm-system',
  meta: { title: '系统分组', roles: ['admin', 'editor'] },
  children: [
      {
          name: 'spm-system',
          path: 'http://baidu.com',
          meta: { title: '系统', roles: ['admin', 'editor'] },
          routers: [
            {
              path: '/permission2',
              component: Layout,
              redirect: '/permission/page',
              alwaysShow: true, // will always show the root menu
              name: 'permission2',
              meta: { title: '系统管理',icon: 'lock', roles: ['admin', 'editor']},
              children: [
                {
                  path: 'index',
                  component: () => import('@/views/tab/index'),
                  name: 'tab1',
                  meta: { title: 'Tab', icon: 'tab' }
                },
                {
                  path: '/index22',
                  component: () => import('@/views/tab/index'),
                  name: 'tab2',
                  meta: { title: 'Tab', icon: 'tab' }
                }
              ]
            },
            {
              path: '/xab2',
              component: Layout,
              children: [
                {
                  path: 'index',
                  component: () => import('@/views/tab/index'),
                  name: 'xab',
                  meta: { title: 'Tab', icon: 'tab' }
                }
              ]
            }
          ]
      } 
  ]

}

export default systemRouter

````

备注：当 children 只有一个元素，那么顶部菜单栏不会显示下拉列表, 会将这个元素直接显示在菜单栏。
