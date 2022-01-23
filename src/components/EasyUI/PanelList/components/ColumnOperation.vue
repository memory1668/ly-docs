<template>
  <div class="column-operation">
    <!--按钮样式-->
    <div v-if="mode === 'button'" class="button-container" :class="[direction]">
      <template v-for="(btn,index) in buttonsOptions">
        <el-button
          v-if="!btn.hasOwnProperty('group') && (btn.hasOwnProperty('visibleFormatter') ? btn.visibleFormatter(row) : true)"
          :key="index"
          v-permission="btn.vPermission ? btn.vPermission : []"
          :loading="btn.scene.action === 'request' && loadingKeyMap[formatLoadingKey(btn.scene, row)]"
          :size="btn.size || 'mini'"
          :type="btn.type || 'primary'"
          :plain="btn.hasOwnProperty('plain') ? btn.plain : false"
          :round="btn.hasOwnProperty('round') ? btn.round : false"
          @click="handleClick(btn)"
        >
          <i v-if="btn.icon && (!loadingKeyMap[formatLoadingKey(btn.scene, row)])" :class="btn.icon" />
          {{
            btn.scene.action !== 'request' ? btn.label : (loadingKeyMap[formatLoadingKey(btn.scene, row)] ? btn.scene.loading.text : btn.label)
          }}
        </el-button>

        <el-dropdown
          v-if="btn.hasOwnProperty('group') && allNoPermissionGroupIndexes.indexOf(index) < 0 && isSomeGroupButtonVisible(btn.group)"
          :key="index"
          v-permission="btn.vPermission ? btn.vPermission : []"
          style="margin-left: 10px;"
          :style="{marginLeft: direction === 'column' ? 0 : '10px', marginTop: direction === 'column' ? '10px' : 0}"
          :size="btn.size || 'small'"
          :type="btn.type || 'primary'"
          @visible-change="(value)=> { $set(dropdownArrow, index, value)}"
        >
          <el-button
            :size="btn.size || 'mini'"
            :type="btn.type || 'primary'"
          >
            {{ btn.label ? btn.label : '更多' }}
            <i v-if="dropdownArrow[index]" class="el-icon-arrow-up el-icon--right" />
            <i v-else class="el-icon-arrow-down el-icon--right" />
          </el-button>

          <el-dropdown-menu slot="dropdown">
            <template v-for="(subBtn, subIndex) in btn.group">
              <el-dropdown-item
                v-if="subBtn.hasOwnProperty('visibleFormatter') ? subBtn.visibleFormatter(row) : true"
                :key="subIndex + 'sub-button'"
                v-permission="subBtn.vPermission ? subBtn.vPermission : []"
                class="group-dropdown"
              >
                <div
                  :class="subBtn.type"
                  @click="handleClick(subBtn)"
                >
                  <i v-if="subBtn.icon && (!loadingKeyMap[formatLoadingKey(subBtn.scene, row)])" :class="subBtn.icon" />
                  <i
                    v-if="subBtn.scene.action === 'request' && loadingKeyMap[formatLoadingKey(subBtn.scene, row)]"
                    class="el-icon-loading"
                  />
                  {{
                    subBtn.scene.action !== 'request' ? subBtn.label : (loadingKeyMap[formatLoadingKey(subBtn.scene, row)] ? subBtn.scene.loading.text : subBtn.label)
                  }}
                </div>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>

    <!--文本样式-->
    <div v-else>
      <template v-for="(btn,index) in buttonsOptions">
        <a
          v-if="!btn.hasOwnProperty('group') && (btn.hasOwnProperty('visibleFormatter') ? btn.visibleFormatter(row) : true)"
          :key="(index + 'text')"
          v-permission="btn.vPermission ? btn.vPermission : []"
          style="display: inline-block; margin-right: 10px;"
          :class="btn.type ? btn.type : 'primary'"
          @click="handleClick(btn)"
        >
          <i v-if="btn.icon && (!loadingKeyMap[formatLoadingKey(btn.scene, row)])" :class="btn.icon" />
          <i
            v-if="btn.scene.action === 'request' && loadingKeyMap[formatLoadingKey(btn.scene, row)]"
            class="el-icon-loading"
          />
          {{
            btn.scene.action !== 'request' ? btn.label : (loadingKeyMap[formatLoadingKey(btn.scene, row)] ? btn.scene.loading.text : btn.label)
          }}
        </a>

        <el-dropdown
          v-if="btn.hasOwnProperty('group')"
          :key="index"
          v-permission="btn.vPermission ? btn.vPermission : []"
          :size="btn.size || 'small'"
          :type="btn.type || 'primary'"
          @visible-change="(value)=> { $set(dropdownArrow, index, value)}"
        >
          <span class="el-dropdown-link" :style="{color: btn.color || '#ff0089'}">
            {{ btn.label ? btn.label : '更多' }}
            <i v-if="dropdownArrow[index]" class="el-icon-arrow-up el-icon--right" />
            <i v-else class="el-icon-arrow-down el-icon--right" />
          </span>

          <el-dropdown-menu slot="dropdown">
            <template v-for="(subBtn, subIndex) in btn.group">
              <el-dropdown-item
                v-if="subBtn.hasOwnProperty('visibleFormatter') ? subBtn.visibleFormatter(row) : true"
                :key="subIndex + 'sub-button'"
                v-permission="subBtn.vPermission ? subBtn.vPermission : []"
                class="group-dropdown"
              >
                <div
                  :class="subBtn.type"
                  @click="handleClick(subBtn)"
                >
                  <i v-if="subBtn.icon && (!loadingKeyMap[formatLoadingKey(subBtn.scene, row)])" :class="subBtn.icon" />
                  <i
                    v-if="subBtn.scene.action === 'request' && loadingKeyMap[formatLoadingKey(subBtn.scene, row)]"
                    class="el-icon-loading"
                  />
                  {{
                    subBtn.scene.action !== 'request' ? subBtn.label : (loadingKeyMap[formatLoadingKey(subBtn.scene, row)] ? subBtn.scene.loading.text : subBtn.label)
                  }}
                </div>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utils/request'
import md5 from 'js-md5'
import checkPermission from '../../../../utils/permission'

export default {
  name: 'ColumnOperation',
  props: {

    // 数据行记录
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },

    // 操作按钮的形态, button || text
    // 按钮或文本
    mode: {
      type: String,
      default: 'button'
    },

    // 排列方向 row(水平)/column垂直
    direction: {
      type: String,
      default: 'row'
    },

    // 按钮配置
    buttons: {
      type: Array,
      default: () => {
        return [
          {
            label: '删除',
            type: 'danger',
            class: '',
            scene: {
              action: 'request',

              // 启用按钮 loading
              loading: { enabled: true, prop: 'id', text: '加载中' },

              // 配置确认框
              confirm: { title: '', content: '', btnOk: {}, btnCancel: {}},

              // HTTP 请求
              request: {
                httpClient: null, // axios 实例

                urlFormatter: (row) => {
                  return ''
                },
                method: 'DELETE',
                params: {},
                data: {}
              }
            }
          },

          {
            label: '查看',
            type: 'default',
            class: '',
            scene: {
              action: 'click',
              data: {},
              clickMethod: (data) => {
                console.log('ColumnOperation: ', data)
              }
            }
          }
        ]
      }
    }
  },
  data() {
    return {

      // 按钮配置
      buttonsOptions: [],

      // loading 状态变更
      loadingKeyMap: {
        // key: boolean
      },

      // 更多的箭头配置
      dropdownArrow: {},

      // 按钮组里面的按钮全部没有权限，组 index
      allNoPermissionGroupIndexes: []

    }
  },
  created() {
    // 格式化按钮 loading 配置
    this.buttons.forEach((btn, index) => {
      if (btn.hasOwnProperty('group')) {
        let isGroupAllNoPermission = true
        btn.group.forEach((subBtn, subIndex) => {
          btn.group[subIndex] = this.formatLoadingConfig(subBtn)

          // 判断组内按钮是否全部没有权限, 如果都没有，那么这个按钮组会被自动隐藏
          if (!subBtn.hasOwnProperty('vPermission') || checkPermission(subBtn.vPermission)) {
            isGroupAllNoPermission = false
          }
        })
        if (isGroupAllNoPermission) {
          this.allNoPermissionGroupIndexes.push(index)
        }

        this.buttonsOptions.push(btn)
      } else {
        this.buttonsOptions.push(this.formatLoadingConfig(btn))
      }
    })
  },
  methods: {

    /**
     * 格式化按钮 loading 配置
     */
    formatLoadingConfig(btn) {
      if (!btn.scene.hasOwnProperty('loading')) {
        btn.scene.loading = {
          enabled: true,
          text: btn.label + '中',
          prop: 'id'
        }
      } else {
        btn.scene.loading = {
          enabled: true,
          text: btn.label + '中',
          prop: 'id',
          ...btn.scene.loading
        }
      }

      return btn
    },

    /**
     * 点击按钮触发事件
     * @param btn
     */
    handleClick(btn) {
      console.log('btn: ', btn)

      // 1.1 未指定操作场景，默认直接将 data 通过配置的 clickMethod 回调回去
      if (!btn.hasOwnProperty('scene')) {
        console.log('Invalid scene config: ', btn)
        return
      }

      // 2.1 指定操作场景, 根据配置发起 HTTP 请求
      const scene = btn.scene
      if (scene.confirm) {
        // 2.1.0 判断当前请求是否结束，如果未结束，不发起请求
        const loadingKey = this.formatLoadingKey(scene, this.row)
        if (this.loadingKeyMap[loadingKey]) {
          this.$message.info('操作未结束，无法发起重复操作')
          return
        }

        // 2.1.1 如果配置了确认框，
        this.$confirm(scene.confirm.content ? scene.confirm.content : '确定执行该操作?',
          scene.confirm.title ? scene.confirm.title : '操作确认', {
            confirmButtonText: scene.confirm.confirmButtonText ? scene.confirm.confirmButtonText : '确定',
            cancelButtonText: scene.confirm.cancelButtonText ? scene.confirm.cancelButtonText : '取消',
            type: 'warning'
          }).then(() => {
          this.dealWithScene(btn)
        }).catch((e) => {
          console.log('error: ', e, btn, this.row)
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // })
        })
      } else {
        this.dealWithScene(btn)
      }
    },

    /**
     * 根据 scene 配置，处理对应操作
     * request || click || -
     *
     * @param btn
     */
    dealWithScene(btn) {
      const scene = btn.scene
      if (scene.action === 'request') {
        // 设置 loading 为 true
        const loadingKey = this.formatLoadingKey(scene, this.row)
        this.$set(this.loadingKeyMap, loadingKey, true)

        // 发起 http 请求
        const request = scene.request
        !request.httpClient && (request.httpClient = axiosInstance)
        request.httpClient.request({
          url: request.urlFormatter(this.row),
          method: request.method.toUpperCase(),
          data: request.data ? request.data : (request.hasOwnProperty('dataFormatter') ? request.dataFormatter(this.row) : null),
          params: request.params ? request.params : (request.hasOwnProperty('paramsFormatter') ? request.paramsFormatter(this.row) : null),
          headers: request.headers ? request.headers : null
        }).then(res => {
          // setTimeout(() => {
          //   this.$set(this.loadingKeyMap, loadingKey, false) // 设置 loading false
          //   console.log('res: ', res)
          // }, 5000)

          // 设置 loading false
          this.$set(this.loadingKeyMap, loadingKey, false) // 设置 loading false

          // 自动刷新列表
          if (!scene.hasOwnProperty('autoRefresh') || scene.autoRefresh) {
            console.log('fresh')
            this.$emit('autoRefresh')
          }

          // 执行 onSuccess 回调
          if (scene.request.hasOwnProperty('onSuccess') && typeof scene.request.onSuccess === 'function') {
            scene.request.onSuccess(res, this.row)
          } else {
            this.$message({ message: btn.label + '成功', type: 'success' })
          }
        }).catch(error => {
          // setTimeout(() => {
          //   this.$set(this.loadingKeyMap, loadingKey, false) // 设置 loading false
          // }, 5000)

          // 设置 loading false
          this.$set(this.loadingKeyMap, loadingKey, false)

          // 执行回调
          if (scene.request.hasOwnProperty('onError') && typeof scene.request.onError === 'function') {
            scene.request.onError(error, this.row)
          }
          console.log('error: ', error)
        })
      } else if (scene.action === 'click') {
        scene.clickMethod(this.row)
      } else {
        console.log('Invalid operation: ', scene.action)
      }
    },

    /**
     * 格式化 loading 状态表示的的 key
     * @param scene
     * @param row
     * @returns {*}
     */
    formatLoadingKey(scene, row) {
      if (scene.action === 'request') {
        return md5(scene.action + row[scene.loading.prop] + scene.request.method + scene.request.urlFormatter(row))
      } else {
        return md5(scene.action + row[scene.loading.prop]) // scene.action 非 request 类型，loading key 没起什么作用
      }
    },

    /**
     * 按钮组的按钮是否至少一个按钮可见
     * @param {Array} group 按钮组配置
     */
    isSomeGroupButtonVisible(group) {
      const result = group.some(btn => {
        let visible = true
        if (btn.hasOwnProperty('visibleFormatter') && typeof btn.visibleFormatter === 'function') {
          visible = btn.visibleFormatter(this.row)
        }
        if (visible && btn.hasOwnProperty('vPermission')) {
          return checkPermission(btn.vPermission || [])
        }
        return visible
      })
      return result
    }
  }
}
</script>
<style lang="scss">
.column-operation .button-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  &.column {
    flex-direction: column;
    .el-button+.el-button {
      margin-top: 10px;
      margin-left: 0;
    }
  }
}

.el-dropdown-link {
  cursor: pointer;
  color: #ff0089;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-dropdown {
  .el-icon--right {
    margin-left: 0px;
    font-size: 12px;
  }
}

.primary {
  color: #ff0089;

  &:hover {
    color: #ff0089;
  }
}

.danger {
  color: #F56C6C;

  &:hover {
    color: #c95858;
  }
}

.success {
  color: #30B08F;

  &:hover {
    color: #278165;
  }
}

.warning {
  color: #E6A23C;

  &:hover {
    color: #b47f2f;
  }
}

.info {
  color: #909399;

  &:hover {
    color: #686a6f;
  }
}

</style>
