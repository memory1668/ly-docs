<template>
  <div>
    <el-button type="default" icon="el-icon-search" @click="dialogVisible=true">{{ uploadedUrl ? '重新选图' : '搜索图片' }}</el-button>

    <!--已上传预览-->
    <div v-if="uploadedUrl" class="mt-10">
      <el-image
        class="round preview"
        :src="uploadedUrl"
        fit="contain"
        :preview-src-list="[uploadedUrl]"
      />
    </div>

    <!---->
    <dialog-select-search-image
      ref="dialogSelectSearchImage"
      v-model="uploadedUrl"
      :visible.sync="dialogVisible"
      @close="dialogVisible = false"
    />

  </div>
</template>

<script>
import DialogSelectSearchImage from '../DialogSelectSearchImage/index'

export default {
  name: 'ButtonDialogSelectSearchImage',
  components: { DialogSelectSearchImage },
  props: {
    /**
       * v-model 选中的值
       */
    value: {
      type: [String, Number, Array, Object],
      default: ''
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

      dialogVisible: false,

      // 上传的Url
      uploadedUrl: ''

    }
  },
  watch: {

    /**
       * 赋值
       */
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.uploadedUrl = val
      }
    },

    uploadedUrl: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log('emit upload url')
        this.emitValue()
      }
    }

  },

  created() {

  },
  methods: {

    /**
     * 监听表单的数据: 变更
     */
    watchForm(val) {
      console.log('invoke watch form: ', val)
      this.$refs['dialogSelectSearchImage'].watchForm(val)
    },

    /**
     * emit 值
     */
    emitValue() {
      this.$emit('input', this.uploadedUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
  .preview {
    width: 180px;
    height: 180px;
  }
</style>
