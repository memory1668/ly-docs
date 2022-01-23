<template>
  <el-upload
    :action="url"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :on-success="handleSuccess"
    :on-error="handleError"
    multiple
    :limit="limit"
    :on-exceed="handleExceed"
    :headers="headers"
    :file-list="fileList"
  >
    <el-button icon="el-icon-upload2" size="small" type="primary">{{ placeholder }}</el-button>
  </el-upload>

</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    /**
     *  e.g: [
     *    {name: 'filename.ext', url: '/path || or url'}
     *  ]
     */
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    placeholder: {
      type: String,
      default: '上传文件'
    },
    url: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/file/upload'
    },
    headers: {
      type: Object,
      default: () => {
        return {
          'Authorization': 'Bearer ' + getToken()
        }
      }
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {

      /**
       * 已上传的文件
       */
      uploadedFileList: [
        // {
        //   url: 'xxx',
        //   name: '',
        // }
      ],

      /**
       * 上传的文件列表
       */
      fileList: [
        // {
        //   name: 'food.jpeg',
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ]
    }
  },
  watch: {
    /**
     *  监听值变更
     */
    value(val) {
      // 初始化赋值
      this.uploadedFileList = val

      const tmpFileList = []
      for (let i = 0; i < this.uploadedFileList.length; i++) {
        const item = this.uploadedFileList[i]
        console.log('item: ', item)
        tmpFileList.push({
          name: item.name,
          url: item.url
        })
      }

      this.fileList = tmpFileList
    }
  },
  methods: {
    /**
     * 上传成功
     */
    handleSuccess(res, full) {
      const tmpData = res.data
      this.uploadedFileList.push({
        url: tmpData.url,
        name: full.name
      })

      console.log('emit uploadedFileList: ', this.uploadedFileList)
      this.$emit('input', this.uploadedFileList)
    },

    /**
     * 长传失败
     */
    handleError(error) {
      console.log(error)
      this.$message.error('上传失败：' + error)
    },
    /**
     * 移除
     */
    handleRemove(file, fileList) {
      console.log('file: ', file)
      console.log('fileList: ', fileList)
      console.log(file, fileList)
    },

    /**
     * 预览
     */
    handlePreview(file) {
      console.log(file)
    },

    /**
     * 文件超出个数限制时的钩子
     */
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      console.log(files)
    },

    /**
     *
     * @param file
     * @param fileList
     * @returns {Promise<MessageBoxData> | *}
     */
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style scoped>

</style>
