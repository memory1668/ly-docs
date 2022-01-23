<template>
  <div>
    <el-button icon="el-icon-upload2" @click="toggleShow">{{ placeholder }}</el-button>
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

    <div
      v-if="imageUrls && imageUrls.length > 0"
      style="margin-top: 10px; display: block"
    >
      <div
        v-for="(imgUrl, index) in imageUrls"
        :key="index"
        class="img-item"
      >
        <img
          :style="{ width: preview.width + 'px', height: preview.height + 'px' }"
          :src="imgUrl"
          class="img"
        >
        <i class="el-icon-circle-close close" @click="removeImage(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import VueImageCorpUpload from 'vue-image-crop-upload'
import { getToken } from '@/utils/auth'

const MAX_PREVIEW = 200

export default {
  name: 'UploadImages',
  components: {
    VueImageCorpUpload
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
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
  data() {
    return {
      show: false,
      params: {
        w: this.width,
        h: this.height
      },
      headers: {
        'Authorization': 'Bearer ' + getToken()
      },

      // url
      imageUrls: [],

      // 预览的最大宽高
      preview: {
        width: MAX_PREVIEW,
        height: MAX_PREVIEW
      }
    }
  },

  watch: {
    imageUrls(val) {
      this.$emit('input', val)
    },

    value(val) {
      this.imageUrls = val
    }
  },
  created() {
    /**
       * 图片 url 数组
       * @type {default.props.value|{type, default}}
       */
    this.imageUrls = this.value

    // 计算显示的宽高
    this.calculatePreviewSize()
  },
  methods: {

    /**
       * 计算预览的宽高
       */
    calculatePreviewSize() {
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
    toggleShow() {
      this.show = !this.show
    },

    /**
       * 上传文件成功
       */
    cropUploadSuccess(res, field) {
      !this.imageUrls && (this.imageUrls = [])
      this.imageUrls.push(res.data.url)

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
    },

    /**
     * 移除数组元素
     * @param index
     */
    removeImage(index) {
      this.$confirm('确定移除图片？', '操作确认').then((val) => {
        this.imageUrls.splice(index, 1)
      }).catch((error) => {
        console.log('cancel: ', error)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .img-item {
    display: inline-block;
    margin-right: 5px;
    margin-bottom: 5px;
    position: relative;
    .img {
      border: 2px solid #e5e5e5;
     }
    .close {
      position: absolute;
      color: white;
      right: 5px;
      top: 5px;
      font-size: 20px;
    }

    .close:hover {
      cursor: pointer;
      color: #ffe3e3;
    }
  }

</style>
