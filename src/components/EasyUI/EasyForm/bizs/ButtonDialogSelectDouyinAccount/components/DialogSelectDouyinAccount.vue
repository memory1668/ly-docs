<template>
  <dialog-panel-list-select
    ref="dialogPanelListSelect"
    v-model="selectedItem"
    :options="dialogPanelListSelectOptions"
    @selection-change="handleSelectionChange"
  />
</template>

<script>
import DialogPanelListSelect from '@/components/EasyUI/DialogPanelListSelect'

export default {
  name: 'DialogSelectDouyinAccount',
  components: { DialogPanelListSelect },
  props: {
    // v-model 配置
    value: {
      type: [Number, String, Object, Array],
      default() {
        return ''
      }
    },
    /**
     * 是否多选
     */
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 选中的项
      selectedItem: null,
      dialogPanelListSelectOptions: {
        dialog: {
          title: '选择抖音号',
          width: '500px'
        },

        panelListOptions: {
          // 1.1 请求配置
          request: {
            url: '/douyin/douyin-accounts/all'
          },

          // 4.1 表格列表
          lbTable: {
            highlightCurrentRow: false,
            showHeader: false,
            selection: { multiple: false },
            columns: [
              {
                minWidth: 200, render: (h, { row }) => {
                  return (<account-info account={row} direction='row'/>)
                }
              }
              // {
              //   minWidth: 750, render: (h, { row }) => {
              //     return (<account-data latestStat={row.latest_stat}/>)
              //   }
              // }
            ]
          }
        },

        buttons: {
          align: 'right',
          // 提交按钮
          submit: {
            show: true, text: '确定选择',
            scene: {
              formatter: (data) => {
                return data
              }
            },
            clickMethod: (data) => {
            }
          },
          // 取消按钮
          cancel: {
            show: true, text: '取消',
            clickMethod: (data) => {
            }
          }
        }
      }
    }
  },
  watch: {
    /**
     * 选中值
     */
    selectedItem(val) {
      if (!val) return
      this.$emit('input', this.valueFormatter(val))
      this.$emit('change', val)
    }
  },
  created() {
    // 配置单选 / 多选
    this.dialogPanelListSelectOptions.panelListOptions.lbTable.selection.multiple = this.multiple
    if (this.multiple) {
      this.dialogPanelListSelectOptions.panelListOptions.lbTable.columns.unshift({ type: 'selection' })
    }
  },
  methods: {
    /**
     * 确认选择
     */
    onClickSubmit() {
      this.$refs.dialogPanelListSelect.onClickSubmit()
    },

    /**
     * 显示弹框
     */
    handleCreate() {
      this.$refs.dialogPanelListSelect.handleCreate()
    },

    /**
     * 值选中
     * @param val
     */
    handleSelectionChange(val) {
      // 这是使用 setTimeout 的原因：因为有可能 DialogPanelList 的 v-model 值还没变更，这里是等待它变更完再触发
      // 50 ms 只是一个大概值
      setTimeout(() => {
        this.$emit('selection-change', val)
        // 如果是单选，则默认自动关闭弹框
        const selection = this.dialogPanelListSelectOptions.panelListOptions.lbTable.selection
        if (selection && !selection.multiple) {
          this.onClickSubmit()
        }
      }, 50)
    },

    // 选中的值格式化
    valueFormatter: (val) => {
      if (val instanceof Array) {
        let ids = ''
        val.forEach((item) => {
          ids = ids + item.id + ','
        })
        return ids.slice(0, ids.length - 1) // 删除最后一个逗号
      } else {
        return val.id
      }
    }
  }
}
</script>

<style scoped>

</style>
