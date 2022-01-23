<!-- 云阁科技 [ http://yungeio.com ] -->
<!-- Copyright (c) 2019~x http://yungeio.com All rights reserved. -->
<!-- Author  : hikoqiu <qiuzhaohai@yungeio.com> -->
<!-- Datetime: 2019-10-02-->
<template>
  <div>
    <a v-if="value == ''" href="javascript: void(0)" style="display: block;" @click="toggleShow">
      <i class="el-icon-picture-outline empty-image" :style="{fontSize: iconSize + 'px'}" />
    </a>
    <vue-image-corp-upload
      ref="vueImageCorpUpload"
      v-model="show"
      field="file"
      :width="width"
      :height="height"
      :params="params"
      :headers="headers"
      :url="url"
      :img-format="imgFormat"
      v-bind="$attrs"
      @crop-upload-success="cropUploadSuccess"
      @crop-upload-fail="cropUploadFail"
    />
    <img
      v-if="value !== ''"
      :style="{ width: preview.width + 'px', height: preview.height + 'px' }"
      :src="imageUrl"
      style="display: block;cursor: pointer;"
      @click="toggleShow"
    >
  </div>
</template>

<script>
import VueImageCorpUpload from 'vue-image-crop-upload'
import { getToken } from '@/utils/auth'

const MAX_PREVIEW = 200

export default {
  name: 'UploadImageInner',
  components: {
    VueImageCorpUpload
  },
  props: {
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
    previewWidth: {
      type: Number,
      default: 50
    },
    previewHeight: {
      type: Number,
      default: 50
    },
    imgFormat: {
      type: String,
      default: 'png'
    },
    iconSize: {
      type: Number,
      default: 45
    },
    url: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/file/upload'
    }
  },
  data: function() {
    return {
      show: false,
      params: {
        w: this.width,
        h: this.height
      },
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },
      imageUrl: '',

      // 预览的最大宽高
      preview: {
        width: MAX_PREVIEW,
        height: MAX_PREVIEW
      }
    }
  },

  watch: {
    value(val) {
      this.imageUrl = val
    }
  },
  created() {
    this.imageUrl = this.value

    this.preview = {
      width: this.previewWidth,
      height: this.previewHeight
    }

    // 计算显示的宽高
    this.calculatePreviewSize()
  },
  methods: {

    /**
     * 计算预览的宽高
     */
    calculatePreviewSize() {
      if (this.width < this.preview.width && this.height < this.preview.height) {
        this.preview = {
          width: this.width,
          height: this.height
        }
        return
      }

      if (this.width >= this.height) { // 宽较长，以宽为比例
        this.preview = {
          width: this.preview.width,
          height: this.preview.width * this.height / this.width
        }
      } else { // 长较长，以长为比例
        this.preview = {
          width: this.preview.height * this.width / this.height,
          height: this.preview.height
        }
      }
    },

    /**
     * 显示和收起
     */
    toggleShow() {
      this.show = !this.show
    },

    /**
     * 上传文件成功
     */
    cropUploadSuccess(jsonData, field) {
      this.imageUrl = jsonData.data.url
      this.$emit('input', this.imageUrl)

      // 关闭 & 重置
      this.toggleShow()
      this.$refs['vueImageCorpUpload'].setStep(1)
    },

    /**
     * 上传文件失败
     */
    cropUploadFail(status, field) {
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>

<style scoped>
  .empty-image {
    display: block;
  }
</style>
