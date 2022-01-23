import Element from 'element-ui'
import LbTable from '../../src/components/lb-table/lb-table'
import PanelForm from '../../src/components/EasyUI/PanelForm/index'
import DialogPanelForm from '../../src/components/EasyUI/DialogPanelForm/index'
import DemoBlock from './components/demo-block/demo-block'
import 'element-ui/lib/theme-chalk/index.css'
import '../../src/styles/index.scss'
import '../../src/styles/element-variables.scss'
import '../../src/styles/element-ui.scss'
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  Vue.use(Element)
  Vue.component('lb-table', LbTable)
  Vue.component('panel-form', PanelForm)
  Vue.component('dialog-panel-form', DialogPanelForm)
  Vue.component('demo-block', DemoBlock)
}
