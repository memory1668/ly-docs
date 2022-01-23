<!-- 云阁科技 [ http://yungeio.com ] -->
<!-- Copyright (c) 2019~x http://yungeio.com All rights reserved. -->
<!-- Author  : hikoqiu <qiuzhaohai@yungeio.com> -->
<!-- Datetime: 2019-10-02-->
<template>
  <div>
    <el-button @click="showDialogPanelListSelect">{{ labelPlaceholder }}</el-button>
    <dialog-qq-map-select
      ref="dialogPanelListSelect"
      v-model="point"
      :options="formattedOptions"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import DialogQqMapSelect from './DialogQQMapSelect/index'

export default {
  name: 'DialogPanelList',
  components: { DialogQqMapSelect },

  props: {
    value: {
      type: Object,
      default: () => {
        return {
          longitude: 0,
          latitude: 0
        }
      }
    },

    // 配置
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
      // 经纬度
      point: {
        longitude: 0,
        latitude: 0
      },

      // 显示的文本
      labelPlaceholder: '选择经纬度',

      formattedOptions: {
        dialog: {}
      }
    }
  },

  watch: {
    point(val) {
      console.log('buttonDialogQQMapSelect: ', val)
      this.labelPlaceholder = '经度:' + val.longitude + ' 纬度:' + val.latitude
      this.$emit('input', val)
    },
    value(val) {
      this.labelPlaceholder = '经度:' + val.longitude + ' 纬度:' + val.latitude
    }
  },

  created() {
    this.initOptions()
  },

  methods: {

    showDialogPanelListSelect() {
      this.$refs.dialogPanelListSelect.handleCreate()
    },

    /**
       * 初始化配置表单选项
       */
    initOptions() {
      this.formattedOptions = { ...this.options, dialog: {
        title: '选择经纬度',
        top: '2vh',
        width: '1000px'
      }}
    }
  }
}

</script>
