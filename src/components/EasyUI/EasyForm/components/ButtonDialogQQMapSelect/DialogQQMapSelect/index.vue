<!-- 云阁科技 [ http://yungeio.com ] -->
<!-- Copyright (c) 2019~x http://yungeio.com All rights reserved. -->
<!-- Author  : hikoqiu <qiuzhaohai@yungeio.com> -->
<!-- Datetime: 2019-10-02-->
<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      :top="formattedOptions.dialog.top ? formattedOptions.dialog.top : '8vh'"
      v-bind="formattedOptions.dialog"
    >
      <qq-map-select
        v-model="point"
        :height="400"
      />

      <div class="text-right margin-top-20">
        <el-button type="default" @click="onClickCancel">取消</el-button>
        <el-button type="primary" icon="el-icon-check" @click="onClickSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QqMapSelect from '../../QQMapSelect'

export default {
  name: 'DialogPanelList',
  components: { QqMapSelect },

  props: {
    options: {
      type: Object,
      default: () => {
        return {
          // dialog 配置
          dialog: {}
        }
      }
    }
  },

  data() {
    return {
      // [经度，纬度]
      point: {
        longitude: 0,
        latitude: 0
      },

      dialogVisible: false,
      formattedOptions: {
        dialog: {}
      }
    }
  },

  watch: {
    point(val) {
      console.log('map change: ', val)
    }
  },

  created() {
    this.initOptions()
  },

  methods: {

    /**
       * 初始化配置表单选项
       */
    initOptions() {
      this.formattedOptions = { ...this.options }
      this.dialogVisible = this.formattedOptions.dialog.hasOwnProperty('visible') ? this.formattedOptions.dialog.visible : false
    },

    /**
       * 设置弹框是否可见
       * @param flag
       */
    setDialogVisible(flag) {
      this.dialogVisible = flag
    },

    /**
       * 显示弹框 & 初始化表单
       */
    handleCreate(query) {
      this.setDialogVisible(true)
    },

    /**
     * 确定选择
     */
    onClickSubmit() {
      this.$emit('input', this.point)
      this.setDialogVisible(false)
    },

    /**
     * 关闭弹框
     */
    onClickCancel() {
      this.setDialogVisible(false)
    }
  }
}

</script>

<style>
 .el-dialog__body {
   padding-top: 0;
 }
</style>
