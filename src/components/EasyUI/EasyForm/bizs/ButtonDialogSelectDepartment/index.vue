<template>
  <div>

    <el-button :disabled="disabled" @click="showDialog">{{ labelPlaceholder }}</el-button>

    <!--:before-close="handleClose"-->
    <!--:close-on-click-modal="false"-->
    <el-dialog
      :visible.sync="dialogVisible"
      width="500px"
      append-to-body
    >
      <!-- 标题 -->
      <div slot="title" class="fz-18" style="color: #303133">
        选择部门
        <el-tooltip v-if="showTip" class="item" effect="dark" content="系统自动包含所有下级部门，无需逐个勾选" placement="top">
          <i class="el-icon-info" size="15px" />
        </el-tooltip>
      </div>
      <div class="bg-white">
        <div class="company-tree">
          <!--draggable-->
          <el-tree
            ref="tree"
            :data="list"
            :show-checkbox="false"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
          >
            <!-- 多选情况 -->
            <el-checkbox v-if="multiple" slot-scope="{ node }" :value="departmentIdMapChecked[node.data.id] || false" class="flex-1" @change="selectNode(node.data.id)">{{ node.data.name }}</el-checkbox>
            <!-- 单选情况 -->
            <el-radio v-else v-model="departmentIdMapChecked[node.data.id]" slot-scope="{ node }" class="flex-1" :label="node.data.id" @change="selectNode">{{ node.data.name }}</el-radio>
          </el-tree>
        </div>
      </div>

      <div v-if="multiple" slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancel">取 消</el-button>
        <el-button type="primary" size="mini" icon="el-icon-check" @click="confirm">确定选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiDepartment from '@/api/department'

export default {
  name: 'ButtonDialogSelectMerchant',
  components: {},
  props: {
    /**
       * v-model 选中的值
       */
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },

    /**
     * 是否不可选择
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * 是否多选
     */
    multiple: {
      type: Boolean,
      default: false
    },

    /**
     * 是否显示表头提示信息
     */
    showTip: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {

      // 目录树数据
      list: [
        // {
        //   id: 1,
        //   name: '一级 1',
        //   children: [{
        //     id: 4,
        //     name: '二级 1-1',
        //     children: [{
        //       id: 9,
        //       name: '三级 1-1-1'
        //     }, {
        //       id: 10,
        //       name: '三级 1-1-2'
        //     }]
        //   }
        //   ]
        // }
      ],

      departmentIdMapChecked: {},
      copyDepartmentIdMapChecked: null, // 选中节点备份，用于多选情况下点击取消按钮

      dialogVisible: false,

      // 选中项
      selectedItem: {},

      // 选中的部门 ID
      selectedId: '',

      labelPlaceholder: '选择部门'

    }
  },

  watch: {

    /**
     * 值变更
     */
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          if (this.multiple && val.length) {
            this.departmentIdMapChecked = {}
            this.copyDepartmentIdMapChecked = {}
            val.forEach(v => {
              this.selectNode(v)
              this.copyDepartmentIdMapChecked[v] = true
            })
          }
          if (!this.multiple) {
            this.selectNode(val)
          }
        } else {
          this.departmentIdMapChecked = {}
          this.selectedItem = {}
          this.selectedId = ''
          this.labelPlaceholder = '选择部门'
        }
      }
    }
  },

  async created() {
    // 获取部门结构
    this.getArchitecture()

    // 如果配置了按钮的初始值
    if (this.value) {
      this.labelPlaceholder = await this.labelFormatterByFormValue(this.value)
    }
  },
  methods: {
    /**
     * 显示弹框
     */
    showDialog() {
      this.dialogVisible = true
    },

    /**
       * 搜索部门
       */
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },

    /**
       * 选中部门
       */
    handleCheckChange(data, checked, indeterminate) {
      /* 主要通过checked进行判断 */
      if (checked) {
        const arr = [data.id]
        this.$refs.tree.setCheckedKeys(arr)
      }
    },

    /**
       * 选中节点
       */
    async selectNode(departmentId) {
      // 多选情况
      if (this.multiple && departmentId) {
        if (this.departmentIdMapChecked[departmentId]) {
          this.$set(this.departmentIdMapChecked, departmentId, false)
        } else {
          this.$set(this.departmentIdMapChecked, departmentId, true)
        }
        return
      }

      this.departmentIdMapChecked = {}
      this.$set(this.departmentIdMapChecked, departmentId, departmentId)
      this.selectedId = departmentId

      // 显示选中部门，并关闭弹窗
      this.labelPlaceholder = await this.labelFormatterByFormValue(departmentId)
      this.dialogVisible = false

      this.$emit('input', this.selectedId)
    },

    /**
       * 获取公司部门结构
       */
    getArchitecture() {
      apiDepartment.getArchitecture().then(res => {
        this.list = res.data.list
      }).catch(e => {
        console.log(e)
      })
    },

    /**
       * @param val
       * @returns {Promise<*>}
       */
    async labelFormatterByFormValue(val) {
      if (parseInt(val) <= 0) {
        return '选择部门'
      }

      // 多选情况
      if (this.multiple) {
        return '已选' + val.length + '个部门'
      }

      // 单选情况
      const res = await apiDepartment.getById(val)
      return '已选：' + res.data.name
    },

    /**
     * 点击取消
     */
    async cancel() {
      if (this.copyDepartmentIdMapChecked) {
        this.departmentIdMapChecked = JSON.parse(JSON.stringify(this.copyDepartmentIdMapChecked))
        this.labelPlaceholder = await this.labelFormatterByFormValue(Object.keys(this.departmentIdMapChecked))
      }
      this.dialogVisible = false
    },

    /**
     * 点击确定按钮
     */
    async confirm() {
      // 过滤掉未选中的情况
      const deparments = Object.keys(this.departmentIdMapChecked).filter(v => this.departmentIdMapChecked[v])
      this.$emit('input', deparments)
      this.labelPlaceholder = await this.labelFormatterByFormValue(deparments)
      this.dialogVisible = false
    }
  }
}
</script>
