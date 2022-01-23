const path = require('path')

// const { join } = require('path')
const webpack = require('webpack')
// const env = Object.assign({}, process.env)
// const defineEnv = Object.keys(env).reduce((acc, k) => {
//   acc[`process.env.${k}`] = JSON.stringify(env[k])
//   return acc
// }, {})
// console.log('defineEnv', process)
const env = {}
Object.keys(process.env).forEach(key => {
  // if (prefixRE.test(key) || key === 'NODE_ENV') {
  env[key] = process.env[key]
  // }
})
env.VUE_APP_BASE_API = '' // 文档不需要实际发起请求

for (const key in env) {
  env[key] = JSON.stringify(env[key])
}

module.exports = {
  base: '/ly-form/',
  locales: {
    '/zh/': {
      lang: 'zh-CN',
      title: 'ly-form',
      description: '基于element ui form二次封装，几乎支持原form所有的功能。'
    }
  },
  themeConfig: {
    // repo: 'liub1934/lb-element-table',
    docsDir: 'docs',
    locales: {
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        nav: [{
          text: '主页',
          link: '/zh/'
        },
          {
            text: '表单',
            link: '/zh/form/'
          }
          // {
          //   text: '表格',
          //   link: '/zh/guide/'
          // }
          // {
          //   text: '个人小站',
          //   link: 'https://liubing.me'
          // }
        ],
        sidebar: {
          // '/zh/form/': [
          //   '',
          //   '/zh/form/start'
          // ]
          // '/': [
          //   ''
          // ]
        },
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        //https://github.com/vuejs/vuepress/issues/214
        //https://forum.vuejs.org/t/how-to-use-env-variable-in-vuepress/61451
        // 'process.env': env, // 不知为何这样配置process会为undefied
        'process': {
          env
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../src')
      }
    }
  },

  // 引入全局sass变量 参考：https://juejin.cn/post/6944604256338968583
  scss: {
    data: `@import "@/styles/variables.scss";`
  }

  // chainWebpack: (config, isServer) => {
  //   config
  //     .plugin('define')
  //     .use(webpack.DefinePlugin, [
  //       {
  //         'process': {
  //           env
  //         }
  //       }
  //     ])
  // }
}
