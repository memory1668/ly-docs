<template>
  <div>
    <el-tabs v-model="activeTabName" tab-position="top">
      <el-tab-pane v-for="(module, index) in data" :key="index" :label="module.label" :name="module.name">
        <div>
          <el-checkbox
            v-model="module.is_checked_all"
            @change="changeCheckModule($event, module)"
          >[{{ module.label }}] 的所有权限
          </el-checkbox>
        </div>

        <div>
          <div v-for="(subModule, subModuleIndex) in module.children" :key="'sub-' + subModuleIndex" class="mb-15">
            <div class="bold module-title">{{ subModule.label }}</div>
            <div>
              <div
                v-for="(page, pageIndex) in subModule.children"
                :key="'page-' + pageIndex"
                class="page-row"
              >

                <div class="column-page-item">
                  <el-checkbox
                    v-model="page.is_checked"
                    :label="page.label"
                    size="small"
                    border
                    @change="changeCheckPage($event, page, subModule, module)"
                  />
                </div>

                <div v-if="pageButtons[page.name] && pageButtons[page.name].length > 0" class="page-row-buttons">
                  <!--按钮组-->
                  <div
                    v-for="(item, itemIndex) in pageButtons[page.name]"
                    :key="'button-group-' + pageIndex + '-group-' + itemIndex"
                    class="button-group"
                  >

                    <div class="button-group-title">{{ item.group.title }}</div>

                    <el-checkbox
                      v-for="(btn, btnIndex) in item.children"
                      :key="'button-' + pageIndex + '-btn-' + btnIndex "
                      v-model="btn.is_checked"
                      :label="btn.label"
                      size="mini"
                      @change="changeCheckButton($event, {btn: btn, groupIndex: itemIndex, btnIndex: btnIndex}, page, subModule, module)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { asyncRoutes, scopeList } from '@/router'

export default {
  name: 'SelectPermissionIndex',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 选中的 tab
      activeTabName: '',

      scopeMap: {},
      visible: true,
      data: [],

      result: {
        checked: [],
        halfChecked: []
      },

      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 表单已配置的模块、页面、按钮权限映射关系
      checkedPermissions: {},

      // 页面对应配置的操作
      pageButtons: {
        // e.g: spam-platform:platform:index: [
        //   {label: xxx, key: xxx}
        //       ]
      }

    }
  },
  watch: {
    value: {
      handler(val) {
        if (!val || !val.is_init) { // 如果有指定初始化参数，才进行初始化
          return
        }

        // 初始化信息
        this.checkedPermissions = val
        this.formatData()
        this.emitValue()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.formatData()
  },
  methods: {
    /**
     * 模块选择变更
     */
    changeCheckModule(isChecked, module) {
      module.is_checked_all = isChecked
      module.is_checked = isChecked

      // 遍历子页面，全部标记为选中状态
      module.children.forEach(subModule => {
        subModule.is_checked = isChecked // 此属性没有在视图使用？

        // 页面标记为选中
        subModule.children.forEach(page => {
          page.is_checked = isChecked

          // 修改页面下所有按钮的选中状态
          this.changePageButtons(page, isChecked)
        })
      })

      this.emitValue()
    },

    /**
     * 修改页面下所有按钮的选中状态
     */
    changePageButtons(page, isChecked) {
      // 遍历模块下所有页面的所有操作, 标记选中状态
      if (!this.pageButtons[page.name]) { // 如果该页面下有配置按钮
        return
      }

      this.pageButtons[page.name].forEach((group, groupIndex) => {
        group.children.forEach((btn, btnIndex) => {
          this.pageButtons[page.name][groupIndex].children[btnIndex].is_checked = isChecked
        })
      })
    },

    /**
     * 页面选择变更
     */
    changeCheckPage(isChecked, page, subModule, module) {
      if (!isChecked) {
        module.is_checked_all = false
      } else {
        module.is_checked = true
        subModule.is_checked = true
      }

      // 判断模块是否完全选择或部分选择
      let isModuleCheckedAll = true
      let isModuleHasChecked = false
      module.children.forEach(subModule => {
        let isSubModuleHasChecked = false
        subModule.children.forEach(page => {
          if (!page.is_checked) {
            isModuleCheckedAll = false
          }
          // 只要页面选中 模块和子模块都选中
          if (page.is_checked) {
            isModuleHasChecked = true
            isSubModuleHasChecked = true
          }
        })
        subModule.is_checked = isSubModuleHasChecked
      })

      module.is_checked_all = isModuleCheckedAll
      module.is_checked = isModuleHasChecked

      // 修改页面下所有按钮的选中状态
      this.changePageButtons(page, isChecked)
      this.emitValue()
    },

    /**
     * 修改按钮选中状态
     */
    changeCheckButton(isChecked, btnInfo, page, subModule, module) {
      if (!this.pageButtons[page.name]) {
        return
      }

      // 1.1 修改按钮选中状态
      const btnGroupIndex = btnInfo.groupIndex
      const btnIndex = btnInfo.btnIndex
      this.pageButtons[page.name][btnGroupIndex].children[btnIndex].is_checked = isChecked
      this.pageButtons = Object.assign({}, this.pageButtons)

      // 2.1 修改按钮所在页面的选中状态
      if (isChecked) {
        module.is_checked = true
        subModule.is_checked = true
        page.is_checked = true

        // 2.1.2 判断是否所有页面和按钮都选中, 如果是，则主模块标记选中全部
        let hasNotChecked = false
        // 遍历子页面，全部标记为选中状态
        module.children.forEach(subModule => {
          if (hasNotChecked) {
            return
          }

          if (!subModule.is_checked) {
            hasNotChecked = true
            return
          }

          // 页面标记为选中
          subModule.children.forEach(page => {
            if (!page.is_checked) {
              hasNotChecked = true
              return
            }

            if (!this.pageButtons[page.name]) {
              return
            }

            this.pageButtons[page.name].forEach(group => {
              group.children.forEach(btn => {
                !btn.is_checked && (hasNotChecked = true)
              })
            })
          })
        })

        if (hasNotChecked) {
          module.is_checked_all = false
        } else {
          module.is_checked_all = true
        }
      } else {
        // 模块所有权限标记为非全选
        module.is_checked_all = false

        // 2.2.2 判断页面下所有按钮是否都没选，如果都没选，页面标记为非选中
        // let hasButtonChecked = false
        // this.pageButtons[page.name].forEach(group => {
        //   group.children.forEach(btn => {
        //     btn.is_checked && (hasButtonChecked = true)
        //   })
        // })
        // if (!hasButtonChecked) {
        //   subModule.is_checked = false
        //   page.is_checked = false
        // }
      }

      this.emitValue()
    },

    /**
     * emit 值
     */
    emitValue() {
      const val = {
        modules: [],
        sub_modules: [],
        pages: [],
        buttons: []
      }
      this.data.forEach((module, index) => {
        // 1.1 一级模块
        if (module.is_checked) {
          console.log('module: ', module)
          val.modules.push({
            name: module.name,
            label: module.label
          })
        }

        // 2.1 二级模块和页面
        module.children.forEach((subModule, subModuleIndex) => {
          if (subModule.is_checked) {
            val.sub_modules.push({
              name: subModule.name,
              label: subModule.label
            })
          }

          subModule.children.forEach((page, pageIndex) => {
            if (page.is_checked) {
              val.pages.push({
                name: page.name,
                label: page.label
              })
            }

            // 3.1 按钮
            if (this.pageButtons[page.name]) {
              this.pageButtons[page.name].forEach(group => {
                group.children.forEach(btn => {
                  if (!btn.is_checked) {
                    return
                  }
                  val.buttons.push({
                    name: btn.name,
                    label: btn.label
                  })
                })
              })
            }
          })
        })
      })

      console.log(val)
      this.$emit('input', val)
    },

    /**
     * 格式化数据
     */
    formatData() {
      this.scopeMap = {}
      this.formatRoutes(asyncRoutes)
      this.data = this.formatScopeList(scopeList)

      this.activeTabName = scopeList[0].name
      console.log('--> data: ', this.data)
    },

    /**
     * 格式化权限，此处的权限指的是路由配置中的：meta.permissions
     * @returns {[]}
     * @param route
     */
    formatButtons(route) {
      if (!route.buttons) {
        return
      }

      const tmpButtons = Object.assign([], route.buttons)
      tmpButtons.forEach(v => {
        if (!v.children) {
          return
        }

        v.children.forEach((btn, btnIndex) => {
          const keyBtn = ((btn.name.indexOf('btn:') === 0 ? '' : 'btn:') + btn.name)
          v.children[btnIndex].name = keyBtn
          v.children[btnIndex].is_checked = !!this.checkedPermissions[keyBtn]
        })
      })

      this.$set(this.pageButtons, route.name, tmpButtons)
    },
    /**
     * 格式化路由
     * @param routes
     * @param level
     * @returns {[]}
     */
    formatRoutes(routes, level = 0) {
      const res = []

      routes.forEach(route => {
        if (!route.name) {
          console.log('-> Empty route name: ', route)
          return
        }

        const tmp = {
          name: route.name,
          label: route.meta ? route.meta.title : '-',
          is_checked: !!this.checkedPermissions[route.name]
        }

        // 如果还有子路由，则解析
        if (route.children) {
          tmp.children = this.formatRoutes(route.children, level + 1)
        } else if (route.meta && route.buttons) {
          // 如果没有子路由，并且配置有权限列表，则格式化权限列表
          tmp.children = this.formatButtons(route)
        }

        res.push(tmp)

        // 如果该路由的上一级是作用域（scope）
        if (level === 0) {
          if (!this.scopeMap[route.scope]) {
            this.scopeMap[route.scope] = []
          }
          // 保存以便路由作用域读取
          this.scopeMap[route.scope].push(tmp)
        }
      })

      return res
    },

    /**
     * 格式化路由作用域
     * @param scopeList
     * @returns {[]}
     */
    formatScopeList(scopeList) {
      const res = []

      scopeList.forEach(scope => {
        const tmp = {
          name: scope.name,
          label: scope.meta.title
        }

        if (scope.children) {
          // 如果该作用域还有子级，则解析
          tmp.children = this.formatScopeList(scope.children)
        } else if (this.scopeMap[scope.name]) {
          // 否则 children 为该作用域下的路由列表
          tmp.children = this.scopeMap[scope.name]
          tmp.is_checked = false

          // 判断是否已经全选
          let isCheckedAll = true
          tmp.children.forEach(tv => {
            // if (!tv.is_checked) {
            //   isCheckedAll = false
            // } else { // 只要有一个子模块或者页面选中，则表示该主模块选中
            //   tmp.is_checked = true
            // }
            tv.children.forEach(item => {
              // 只要有一个子模块或者页面选中，则表示该主模块选中
              if (item.is_checked) {
                tmp.is_checked = true
              } else {
                // 只要有一个子模块或者页面没选中，则表示没有全选
                isCheckedAll = false
              }
              const isAllButtonChecked = this.checkAllPageButton(item.name)
              !isAllButtonChecked && (isCheckedAll = false)
            })
          })
          tmp.is_checked_all = isCheckedAll
        }

        res.push(tmp)
      })

      return res
    },

    /**
     * 检查某个页面的按钮是否都勾选
     * @param name 页面名称
     * @return {boolean}
     */
    checkAllPageButton(name) {
      const buttons = this.pageButtons[name]
      // 没有按钮配置
      if (!buttons || buttons.length === 0) {
        return true
      }
      if (buttons.some(button => button.children.some(child => !child.is_checked))) {
        return false
      }
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-item {
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #efefef;
  border-radius: 5px;
}

.page-row {
  display: flex;
  flex-direction: row;
  padding: 15px 0;
  border-bottom: 1px dashed #efefef;
}

.page-row-buttons {
  flex: 1;
  /*display: flex;*/
  /*flex-direction: row;*/
  /*flex-wrap: wrap;*/
  padding: 0 15px;
}

.column-page-item {
  width: 120px;
}

.module-title {
  line-height: 1em;
  margin-top: 15px;
}

.button-group {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

.button-group-title {
  line-height: 1em;
  margin-bottom: 5px;
  color: #9b9b9b;
}
</style>
