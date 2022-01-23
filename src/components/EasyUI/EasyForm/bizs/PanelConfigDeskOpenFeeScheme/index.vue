<template>
  <div>

    <el-table :data="tableData" border stripe>
      <el-table-column align="center">
        <template slot="header">
          <span>部门（含子部门）</span>
        </template>
        <template slot-scope="scope">
          <div>
            <button-dialog-select-department
              v-model="tableData[scope.$index].department_id"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header">
          <span>开台费</span>
        </template>
        <template slot-scope="scope">
          <div>
            <el-input v-model="tableData[scope.$index].desk_open_fee" size="normal" placeholder="请填写开台费">
              <template slot="append">元</template>
            </el-input>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center">
        <template slot="header">
          <span>是否赠送套餐</span>
        </template>
        <template slot-scope="scope">
          <div>
            <div>
              <el-switch
                v-model="tableData[scope.$index].is_giving_package"
                style="display: block"
                active-text="赠送"
                inactive-text="不赠送"
              />
            </div>
            <div v-if="tableData[scope.$index].is_giving_package" class="mt-15">
              <remote-select
                v-model="tableData[scope.$index].giving_package_id"
                :mutiple="false"
                placeholder="请选择套餐"
                :option="{ dataField: 'list', labelField: 'name', valueField: 'id' }"
                :request="{ url: '/packages', method: 'GET', headers: {}, params: { pagesize: 1000 }}"
              />
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center" width="120">
        <template slot="header">
          <span>操作</span>
        </template>
        <template slot-scope="scope">
          <div>
            <el-button v-if="tableData.length > 1" :id="scope.$index" slot="append" icon="el-icon-close" size="mini" @click="removeRow(scope.$index)" />
            <div v-else>-</div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-10">
      <el-button icon="el-icon-plus" size="small" @click="addRow">添加配置项</el-button>
    </div>

  </div>
</template>

<script>
import ButtonDialogSelectDepartment from '@/components/EasyUI/EasyForm/bizs/ButtonDialogSelectDepartment'
import RemoteSelect from '@/components/EasyUI/EasyForm/components/RemoteSelect/index'
export default {
  name: 'PanelConfigDeskOpenFeeScheme',
  components: { ButtonDialogSelectDepartment, RemoteSelect },
  props: {
    /**
       * v-model 选中的值
       */
    value: {
      type: Array,
      default: () => {
        return []
      }
    }

  },

  data() {
    return {
      /**
       * 表格内容
       */
      tableData: [
        { department_id: '', desk_open_fee: 0, is_giving_package: true, giving_package_id: '' }
      ],

      columns: [
        { label: '用于部门(含子部门)', prop: 'department_id' },
        { label: '开台费', prop: 'desk_open_fee' },
        { label: '赠送套餐', prop: 'is_giving_package' },
        { label: '选择套餐', prop: 'giving_package_id' }
      ]
    }
  },

  watch: {

    /**
     * 监听值变更
     */
    value: {
      immediate: true,
      deep: true,
      handler: function(val) {
        if (!val) {
          return val
        }
        if (val.length === 0) {
          val.push({
            department_id: '',
            desk_open_fee: 0,
            is_giving_package: true,
            giving_package_id: ''
          })
        }
        this.tableData = val
      }
    },

    /**
     * 表格内数据变更，emit input
     */
    tableData: {
      immediate: true,
      deep: true,
      handler: function(val) {
        this.$emit('input', val)
      }
    }
  },

  created() {

  },

  methods: {

    /**
     * 移除行
     * @param rowIndex
     */
    removeRow(rowIndex) {
      this.tableData.splice(rowIndex, 1)
    },

    /**
     * 添加配置项
     */
    addRow() {
      this.tableData.push({
        department_id: '',
        desk_open_fee: 0
      })
    }

  }
}
</script>
