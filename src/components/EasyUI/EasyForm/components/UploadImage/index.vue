<template>
  <div>
    <div class="flex">
      <el-button v-if="!forceSearch" icon="el-icon-upload2" @click="toggleShow">{{ placeholder }}</el-button>
      <div v-if="enableSearch && !forceSearch" class="ml-15 mr-15">或</div>
      <el-button v-if="enableSearch || forceSearch" icon="el-icon-search" @click="toggleSearchDialog">搜图上传</el-button>
    </div>

<!--    <vue-image-corp-upload-->
<!--      ref="vueImageCorpUpload"-->
<!--      v-model="show"-->
<!--      field="file"-->
<!--      :width="width"-->
<!--      :height="height"-->
<!--      :params="params"-->
<!--      :headers="headers"-->
<!--      :url="url"-->
<!--      :img-format="imgFormat"-->
<!--      v-bind="$attrs"-->
<!--      @crop-upload-success="cropUploadSuccess"-->
<!--      @crop-upload-fail="cropUploadFail"-->
<!--    />-->
    <img
      v-if="value !== ''"
      :style="{ width: preview.width + 'px', height: preview.height + 'px' }"
      :src="imageUrl"
      style="margin-top: 10px; display: block"
    >

    <!--搜图-->
<!--    <dialog-select-search-image-->
<!--      ref="dialogSelectSearchImage"-->
<!--      v-model="searchUploadedUrl"-->
<!--      keyword-placeholder="请填写搜索关键字"-->
<!--      :visible.sync="dialogSearchVisible"-->
<!--      @close="dialogSearchVisible = false"-->
<!--    />-->
  </div>
</template>

<script>
// import VueImageCorpUpload from 'vue-image-crop-upload'
// import { getToken } from '@/utils/auth'
// import DialogSelectSearchImage from '../DialogSelectSearchImage/index'

const MAX_PREVIEW = 200

export default {
  name: 'UploadImage',
  components: {
    // VueImageCorpUpload
    // DialogSelectSearchImage
  },
  props: {
    /**
     * 是否开启可选搜图
     */
    searchImage: {
      type: Object,
      default: () => {
        return {
          enable: false,
          force: false
        }
      }
    },

    value: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    placeholder: {
      type: String,
      default: '上传图标'
    },
    imgFormat: {
      type: String,
      default: 'png'
    },
    url: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/file/upload'
    }
  },

  data: function () {
    return {

      // 搜图弹窗
      dialogSearchVisible: false,
      searchUploadedUrl: '',

      show: false,
      params: {
        w: this.width,
        h: this.height
      },
      headers: {
        // 'Authorization': 'Bearer ' + getToken()
      },
      imageUrl: '',

      // 预览的最大宽高
      preview: {
        width: MAX_PREVIEW,
        height: MAX_PREVIEW
      }
    }
  },

  computed: {
    /**
     * 强制搜图
     */
    forceSearch () {
      return this.searchImage && this.searchImage.force
    },

    /**
     * 是否开启搜图
     */
    enableSearch () {
      return this.searchImage && this.searchImage.enable
    }

  },

  watch: {
    value: {
      handler (val) {
        this.imageUrl = val
      }
    },

    /**
     * 搜图值变更
     */
    searchUploadedUrl: {
      deep: true,
      // immediate: true,
      handler (val) {
        this.imageUrl = val
        this.$emit('input', this.imageUrl)
      }
    }
  },
  created () {
    this.imageUrl = this.value

    // 计算显示的宽高
    this.calculatePreviewSize()
  },
  methods: {

    /**
     * 监听表单的数据: 变更
     */
    watchForm (val) {
      console.log('invoke watch form: ', val)
      this.$refs['dialogSelectSearchImage'].watchForm(val)
    },

    /**
     * 计算预览的宽高
     */
    calculatePreviewSize () {
      if (this.width < MAX_PREVIEW && this.height < MAX_PREVIEW) {
        this.preview = {
          width: this.width,
          height: this.height
        }
        return
      }

      if (this.width >= this.height) { // 宽较长，以宽为比例
        this.preview = {
          width: MAX_PREVIEW,
          height: MAX_PREVIEW * this.height / this.width
        }
      } else { // 长较长，以长为比例
        this.preview = {
          width: MAX_PREVIEW * this.width / this.height,
          height: MAX_PREVIEW
        }
      }
    },

    /**
     * 显示和收起
     */
    toggleShow () {
      this.show = !this.show
    },

    /**
     * 搜图框显示和隐藏
     */
    toggleSearchDialog () {
      this.dialogSearchVisible = !this.dialogSearchVisible
    },

    /**
     * 上传文件成功
     */
    cropUploadSuccess (jsonData, field) {
      this.imageUrl = jsonData.data.url
      this.$emit('input', this.imageUrl)

      // 关闭 & 重置
      this.toggleShow()
      this.$refs['vueImageCorpUpload'].setStep(1)
    },

    /**
     * 上传文件失败
     */
    cropUploadFail (status, field) {
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>

<style scoped>

</style>
