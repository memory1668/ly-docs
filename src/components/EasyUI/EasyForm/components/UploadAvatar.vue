<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="url"
      v-bind="$attrs"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :on-error="handleAvatarError"
      :on-progress="handleOnProcess"
      :before-upload="beforeAvatarUpload"
      :headers="headers"
      :limit="1"
      :multiple="false"
      v-on="$listeners"
    >
      <div class="avatar-box">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <template v-else>
          <i v-if="!loading" class="el-icon-plus avatar-uploader-icon" />
        </template>

        <div v-if="loading" class="box-icon-loading">
          <i class="el-icon-loading avatar-uploader-icon icon-loading" />
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'

export default {
  name: 'UploadAvatar',
  props: {
    /**
       * v-model 配置参数
       */
    value: {
      type: String,
      default: ''
    },

    url: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/file/upload'
    },

    headers: {
      type: Object,
      default: () => {
        return {
          // 'Authorization': 'Bearer ' + getToken()
        }
      }
    },

    /**
       * 限制图片大小，最大不超过 xx KB, 默认 2 MB
       */
    limitSize: {
      type: Number,
      default: 1024 * 2
    }

  },

  data() {
    return {
      loading: false,

      // 已上传的图片地址
      imageUrl: ''
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.imageUrl = val
        }
      }
    }
  },

  created() {
  },

  methods: {
    /**
       * 上传成功处理
       */
    handleAvatarSuccess(res, file) {
      this.imageUrl = res.data.url
      this.loading = false

      // emit input 事件，实现组件 v-model 指令
      this.$emit('input', this.imageUrl)
    },

    /**
       * 上传失败处理
       * @param res
       * @param file
       * @param fileList
       */
    handleAvatarError(res, file, fileList) {
      this.loading = false
      console.log(res, file)
      this.$message.error('上传失败，请稍后重试')
    },

    /**
       * 上传中
       */
    handleOnProcess(event, file, fileList) {
    },

    /**
       * 上传图片前判断
       * @param file
       * @returns {boolean}
       */
    beforeAvatarUpload(file) {
      if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) < 0) {
        this.$message.error('图片只允许是 jpg/jpeg/png 格式')
        return false
      }

      const isLt2M = file.size / 1024 / this.limitSize
      if (!isLt2M) {
        const limit = (this.limitSize / 1024).toFixed(2)
        this.$message.error('上传图片大小不能超过 ' + limit + 'MB')
        return false
      }

      // 标记为loading
      this.loading = true
      return true
    }
  }
}

</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-box {
    width: 178px;
    height: 178px;
    position: relative;
    display: table-cell;
    vertical-align: middle;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    /*width: 178px;*/
    /*height: 178px;*/
    /*line-height: 178px;*/
    display: inline-block;
    vertical-align: middle;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .box-icon-loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    display: block;
    vertical-align: middle;
  }

  .icon-loading {
    display: inline-block;
    vertical-align: middle;
  }
</style>
