<template>
  <div id="side-select" class="side-select">
    <el-menu
      :default-active="activeIndex"
      :default-openeds="defaultOpeneds"
      mode="vertical"
      @select="changeSelect"
    >
      <template v-for="(submenu, index) in options">
        <el-submenu
          v-if="group && submenu[group.childField]"
          :key="submenu[option.valueField]"
          :index="index + ''"
          :class="{'has-i': submenu.i, 'has-icon': submenu.icon}"
        >
          <template slot="title">
            <div class="sub-title">
              <!-- 显示图片链接 -->
              <div v-if="submenu.icon" class="mt-0 mr-15" :style="{'margin-right': iconRight}">
                <el-image style="width: 20px;height: 20px;border-radius: 3px;" :src="submenu.icon" fit="fill" />
              </div>
              <icon v-if="submenu.i" :icon-class="submenu.i" class="mr-15 mt-2" />
              <span>{{ submenu[group.labelField] }}</span>
            </div>
          </template>
          <template v-for="(menuItem, menuItemIndex) in submenu[group.childField]">
            <select-item
              :key="menuItem[option.valueField]"
              :item="menuItem"
              :option="option"
              :index="index + '-' +menuItemIndex"
              :active-index="activeIndex"
              :disabled="disabledOptions && disabledOptions.includes(menuItem[option.valueField])"
              v-bind="$attrs"
            />
          </template>
        </el-submenu>
        <select-item
          v-else
          :key="submenu[option.valueField]"
          :item="submenu"
          :option="option"
          :index="'' +index"
          :active-index="activeIndex"
          :disabled="disabledOptions && disabledOptions.includes(submenu[option.valueField])"
          v-bind="$attrs"
        />
      </template>
    </el-menu>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import axiosInstance from '@/utils/request'
import SelectItem from '@/components/EasyUI/EasyForm/bizs/SideSelect/components/SelectItem'

const DEFAULT_INDEX = '-1'

export default {
  name: 'SideSelect',
  components: { SelectItem },
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: [String, Number, Array],
      default: ''
    },

    /**
     * 远程请求的配置
     */
    request: {
      type: Object,
      default: () => {
        return {
          // 远程接口配置
          url: '',
          // 请求头
          headers: {
            'Authorization': 'Bearer ' + getToken()
          },
          // query 参数
          params: {},
          method: 'GET',
          data: {},
          // axios 实例
          httpClient: axiosInstance
        }
      }
    },

    /**
     * 选项配置
     */
    option: {
      type: Object,
      default: () => {
        return {
          dataField: 'list', // 响应数据哪个字段作为选项列表
          labelField: 'name', // 选项名字段
          valueField: 'id', // 选项值字段
          tag: null // 标签
        }
      }
    },

    /**
     * 分组选择
     * {
     *  childField: 'children', // 以哪个字段作为各分组选项的列表
        labelField: 'name', // 分组选项名字段
        valueField: 'key' // 分组选项值字段
     * }
     */
    group: {
      type: Object,
      default: null
    },

    /**
     * 默认选项
     */
    sideOptions: {
      type: Array,
      default() {
        return []
      }
    },

    // 禁用的选项id列表
    disabledOptions: {
      type: Array,
      default: null
    },

    /**
     * 是否展开所有菜单
     */
    openAll: {
      type: Boolean,
      default: false
    },

    /**
     * 默认展开的菜单索引
     */
    defaultOpenedMenus: {
      type: Array,
      default() {
        return [] // 默认不展开
      }
    },

    /**
     * 图片与文件的间距
     */
    iconRight: {
      type: String,
      default: '15px'
    }
  },

  data() {
    return {
      selected: '',
      activeIndex: '-1',
      options: [
        // {
        //   id: 'xxx',
        //   name: 'xxx',
        // },
      ]
    }
  },

  computed: {
    defaultOpeneds() {
      if (this.openAll) {
        return this.options.map((option, index) => index + '')
      }
      return this.defaultOpenedMenus
    }
  },

  watch: {
    selected(val) {
      this.$emit('input', val)
      console.log('selected change', val)
      this.getActiveIndex(val)
    },

    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.selected = val
      }
    },

    disabledOptions() {
      this.getActiveIndex(this.selected)
    }
  },

  created() {
    if (!this.request || !this.request.url) {
      this.options = this.sideOptions
      return
    }
    this.initOptions()
  },

  methods: {
    /**
     * 初始化可选项
     */
    initOptions() {
      // 初始化设置 request 的参数
      if (this.request.url.slice(0, 4) !== 'http') { // 如果不以 http or https 开头，则自动拼接上系统配置的前缀路由
        this.request.url = process.env.VUE_APP_BASE_API + this.request.url
      }
      !this.request.hasOwnProperty('method') && (this.request.method = 'GET')
      !this.request.hasOwnProperty('header') && (this.request.header = { 'Authorization': 'Bearer ' + getToken() })
      if (!this.request.hasOwnProperty('httpClient') || !this.request.httpClient) {
        this.request.httpClient = axiosInstance
      }

      // 发送请求
      this.request.httpClient.request({
        url: this.request.url,
        method: this.request.method.toUpperCase(),
        data: this.request.data ? this.request.data : null,
        params: this.request.params ? this.request.params : null,
        headers: this.request.headers ? this.request.headers : null
      }).then(async res => {
        // 判断是否需要格式化获取到的数据
        if (this.request.hasOwnProperty('formatter')) {
          res = await this.request.formatter(res)
        }
        // 数据数据的哪个字段
        const dataField = this.option.hasOwnProperty('dataField') && this.option.dataField ? this.option.dataField : 'list'
        // 获取响应数据的 list 字段的数据
        this.options = res.data[dataField]
        this.activeIndex === DEFAULT_INDEX && this.getActiveIndex(this.selected)
      }).catch(error => {
        this.$message.error('请求失败: ' + error)
      })
    },

    /**
     * 选中选项
     */
    changeSelect(index, indexPath) {
      // console.log('选中选项', indexPath)
      const subMenuIndex = indexPath[0]
      const menuItemIndex = indexPath[1] && indexPath[1].split('-')[1]
      if (menuItemIndex) {
        this.selected = this.options[subMenuIndex][this.group.childField][menuItemIndex][this.group.valueField]
        return
      }
      this.selected = this.options[subMenuIndex][this.option.valueField]
    },

    /**
     * 根据选项选中值获取当前选中项的索引
     * @param {String} value 当前选中项的值
     */
    getActiveIndex(value) {
      const valueField = this.option.valueField
      const groupValueField = this.group && this.group.valueField
      if (!value || !this.options || this.options.length === 0) {
        this.activeIndex = DEFAULT_INDEX
        return
      }
      // 当前选项禁用
      if (this.disabledOptions && this.disabledOptions.includes(value)) {
        //  选中第一个不禁用的项
        if (!this.group) {
          this.activeIndex = this.options.findIndex(option => !this.disabledOptions.includes(option[valueField])) + ''
        } else {
          for (let i = 0; i < this.options.length; i++) {
            const index = this.options[i][this.group.childField].findIndex(sub => !this.disabledOptions.includes(sub[groupValueField]))
            if (index !== -1) {
              this.activeIndex = `${i}-${index}` // 分组选择activeIndex为父索引+子索引
              break
            }
          }
        }
        // console.log('选中第一个不禁用的项', this.activeIndex)
        return
      }
      if (!this.group) {
        this.activeIndex = this.options.findIndex(option => option[valueField] === value) + ''
      } else {
        for (let i = 0; i < this.options.length; i++) {
          const subList = this.options[i][this.group.childField]
          // 非展开菜单
          if (!subList) {
            if (this.options[i][groupValueField] === value) {
              this.activeIndex = i + ''
              break
            }
            continue
          }
          const index = subList.findIndex(sub => sub[groupValueField] === value)
          if (index !== -1) {
            this.activeIndex = `${i}-${index}` // 分组选择activeIndex为父索引+子索引
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../../../styles/variables";

.side-select {
  min-width: 150px;
}

.sub-title {
  white-space: normal;
  line-height: 1.5em;
  padding: 10px 28px 10px 0;
  font-size: 14px;
  min-height: 50px;
  box-sizing: border-box;
  vertical-align: center;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #444444;
}

#side-select.side-select {
  // 修改鼠标悬停时菜单的背景色
  /deep/ .el-submenu__title:hover {
    background-color: #F6F6F6;
  }

  // 增加左右边距
  > /deep/ .el-menu {
    padding: 0 8px;
  }

  /deep/ .el-submenu {
    min-width: 149px !important;
  }

  // 调小分组选项左右间距
  /deep/ .el-submenu {
    // 防止左侧菜单收起时展开图标隐藏
    overflow: visible !important;
    .el-submenu__icon-arrow{
      // 防止左侧菜单收起时展开图标隐藏
      display: block !important;
    }
    .el-submenu__title {
      height: auto;
      padding: 0 10px !important;
    }

    .el-menu-item {
      padding: 0 20px !important;
    }

    .label-name-text {
      color: #808080;
      font-weight: normal;
    }
  }

  // 展开图标垂直居中
  /deep/ .el-submenu__title .el-submenu__icon-arrow {
    margin-top: -5px;
    right: 10px;
  }

  // 一级菜单的颜色继承
  /deep/ .el-submenu__title i {
    color: inherit;
  }

  // 调整文本对齐
  .has-i /deep/ .el-menu-item {
    padding-left: 39px !important;
  }

  .has-icon /deep/ .el-menu-item {
    padding-left: 44px !important;
  }
}
</style>
