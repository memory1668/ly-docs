<template>
  <div>
    <el-dialog
      :title="isStepCrop ? '图片裁剪' : '搜索图片 '"
      top="3vh"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      :width="isStepCrop ? '340px' : '940px'"
      :close-on-click-modal="!isStepCrop"
    >
      <div class="pt-10">
        <!--单选 - 图片裁剪和上传-->
        <div v-if="isStepCrop" class="step" style="width: 300px;">
          <div style="height: 300px; width: 300px;">
            <vueCropper
              ref="cropper"
              :img="cropImage"
              :auto-crop="true"
              :fixed="true"
              :fixed-number="[1,1]"
              :center-box="true"
              :output-size="1"
            />
          </div>

          <div class="mt-15 text-right">
            <el-button icon="el-icon-back" size="small" @click="clickBack">上一步</el-button>
            <el-button type="primary" icon="el-icon-check" size="small" :loading="isUploading" @click="confirmCrop">{{ isUploading ? '处理中': '确定' }}</el-button>
          </div>
        </div>

        <!--图片选择框-->
        <div v-show="isStepSelect" class="">
          <div class="mb-15">
            <div class="flex">
              <div class="search-box">
                <el-input v-model="query.keyword" :placeholder="keywordPlaceholder" class="input-with-select" @keyup.enter.native="clickSearch">
                  <el-button slot="append" icon="el-icon-search" :loading="isSearching" @click="clickSearch">搜索</el-button>
                </el-input>
              </div>

              <div class="flex-1 text-right">
                <el-button-group>
                  <el-button
                    v-if="query.page > 1"
                    type="default"
                    size="small"
                    icon="el-icon-arrow-left"
                    round
                    @click="changePage(false)"
                  >上一页</el-button>
                  <el-button
                    v-if="list.length > query.limit * 0.8"
                    type="default"
                    size="small"
                    round
                    @click="changePage(true)"
                  >下一页<i class="el-icon-arrow-right el-icon--right" />
                  </el-button>
                </el-button-group>
              </div>
            </div>

            <div v-if="list.length === 0" class="mt-15">
              <div v-if="isSearching">
                <i class="el-icon-loading" />
                <span>搜索中</span>
              </div>
            </div>
          </div>

          <div class="list-box flex">
            <div v-for="(item, index) in list" :key="index" class="item">
              <el-image
                class="img-item"
                :src="item.thumb"
                fit="contain"
                :preview-src-list="[item.origin]"
              />

              <div :class="{'icon-select': true, 'active': item.is_selected}" @click="clickSelect(index)">
                <i v-if="!item.is_loading" class="el-icon-circle-check" />
                <i v-if="item.is_loading" class="el-icon-loading" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import apiFile from '@/api/file'
import { VueCropper } from 'vue-cropper'
import request from '@/utils/request'

export default {
  name: 'ButtonDialogSelectSearchImage',
  components: { VueCropper },
  props: {

    /**
       * 弹框是否可见
       */
    visible: {
      type: Boolean,
      default: false
    },

    /**
       * v-model 选中的值
       */
    value: {
      type: [String, Number, Array, Object],
      default: ''
    },

    /**
     * 提示
     */
    keywordPlaceholder: {
      type: String,
      default: '请输入酒水关键字'
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
      query: {
        keyword: '',
        limit: 45,
        page: 1
      },

      dialogVisible: false,

      // 图片列表
      isSearching: false,
      list: [],

      // 选中图片
      selected: [],

      // 裁剪的数据
      cropImage: '',

      // 是否上传中
      isUploading: false,

      // 上传的Url
      uploadedUrl: '',

      // 当前所处第一步
      curStep: 1

    }
  },

  computed: {
    /**
       * 是否处于裁剪的步骤
       */
    isStepCrop() {
      return this.curStep === 2
    },

    /**
       * 是否选图步骤
       */
    isStepSelect() {
      return this.curStep === 1
    }
  },

  watch: {

    /**
       * 弹框是否显示
       */
    visible: {
      deep: true,
      immediate: true,
      handler(val) {
        val !== this.dialogVisible && (this.dialogVisible = val)
      }
    },

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

    dialogVisible(val) {
      if (!val) {
        this.$emit('close')
        this._reset()
      }

      // 如果有值并且显示弹框，自动查找
      if (val && this.query.keyword) {
        this.searchImage()
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
      if (val.hasOwnProperty('keyword')) {
        this.query = { ...this.query, keyword: val.keyword }
      }
    },

    /**
       * 上下页
       */
    changePage(flag) {
      this.query = { ...this.query, page: flag ? ++this.query.page : --this.query.page }
      this.searchImage()
    },

    /**
       * emit 值
       */
    emitValue() {
      this.$emit('input', this.uploadedUrl)
    },

    /**
       * 搜索图片
       */
    clickSearch() {
      this.query = { ...this.query, page: 1 }
      this.searchImage()
    },

    /**
       * 确定裁剪
       */
    confirmCrop() {
      this.$refs.cropper.getCropBlob((data) => {
        this.isUploading = true
        const form = new FormData()
        form.append('file', this.blobToFile(data, 'file'))
        request.post('/file/upload', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          console.log(res)
          this.uploadedUrl = res.data.url
          this.emitValue()

          this.dialogVisible = false
          this._reset()
        }).catch(e => {
          console.log(e)
        }).finally(() => {
          this.isUploading = false
        })
      })
    },

    /**
       * 重置选择
       */
    _reset() {
      this.cropImage = null
      this.curStep = 1

      this.list.forEach((v, index) => {
        this.$set(this.list[index], 'is_selected', false)
        this.selected = []
      })
    },

    /**
       * 上一步
       */
    clickBack() {
      this.list.forEach((v, index) => {
        this.$set(this.list[index], 'is_selected', false)
      })

      this.cropImage = null
      this.curStep = 1
    },

    /**
       * 点击选择
       */
    clickSelect(index) {
      this.$set(this.list[index], 'is_selected', !this.list[index].is_selected)

      if (!this.multiple) {
        this.list.forEach((v, i) => {
          if (i !== index) {
            this.$set(this.list[i], 'is_selected', false)
          }
        })

        // 整理选中项
        const tmpSelected = []
        this.list.forEach(v => {
          if (v.is_selected) {
            tmpSelected.push(v)
          }
        })
        this.selected = tmpSelected

        // 如果单图，进行裁剪
        if (!this.multiple) {
          this.$set(this.list[index], 'is_loading', true)
          this.getCanvasBase64(index, this.selected[0].origin, this.selected[0].thumb)
        }
      }
    },

    /**
       * 搜索图片
       */
    searchImage() {
      this.isSearching = true
      apiFile.searchImage(this.query).then(res => {
        res.data.list.forEach(v => {
          v.is_selected = false
        })
        this.list = res.data.list

        if (this.list.length === 0) {
          this.$message.info('查无相关图片，请换其他关键字进行搜索。')
        }
      }).catch(e => {
        console.log(e)
      }).finally(() => {
        this.isSearching = false
      })
    },

    /**
       * base64 转文件
       */
    base64ToFile(data, filename = 'file') {
      const blob = this.dataURLtoBlob(data)
      return this.blobToFile(blob, filename)
    },
    /**
       * base64 转 blob
       */
    dataURLtoBlob: function(dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },

    /**
       * blob 转文件
       */
    blobToFile: function(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()
      theBlob.name = fileName
      return theBlob
    },

    /**
       * 将图片生成 base64
       */
    getBase64Image(img, width, height) {
      const canvas = document.createElement('canvas')
      canvas.width = width || img.width
      canvas.height = height || img.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL()
    },

    /**
       * 图片转 base 64
       * @returns {JQuery.Promise<TR, TJ, TN>}
       * @param imgUrl
       * @param backupUrl
       */
    getCanvasBase64(index, imgUrl, backupUrl) {
      this.cropImage = null
      const image = new Image()

      // 至关重要
      image.crossOrigin = ''
      image.src = imgUrl
      if (imgUrl) {
        image.onload = () => {
          const baseImg = this.getBase64Image(image)
          this.cropImage = baseImg

          this.$set(this.list[index], 'is_loading', false)
          this.curStep = 2
        }
        image.onerror = (e) => {
          console.log(e)

          if (backupUrl) {
            this.getCanvasBase64(index, backupUrl)
          } else {
            this.proxyImage(index, imgUrl)
          }
        }
      }
    },

    /**
       * 最后一招，通过服务器拉取图片
       * @param url
       */
    proxyImage(index, url) {
      apiFile.proxyImage(url, true).then(res => {
        this.cropImage = res.data.file
        this.curStep = 2
      }).catch(e => {
        this.$message.error('图片加载失败')
      }).finally(() => {
        this.$set(this.list[index], 'is_loading', false)
      })
    }

  }
}
</script>

<style lang="scss" scoped>
  .list-box {
    display: flex;
    flex-direction: row;
    justify-content: left;
    flex-wrap: wrap;
  }

  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 90px;
    height: 90px;
    overflow: hidden;
    border-radius: 5px;
    margin-right: 5px;
    margin-left: 5px;
    margin-bottom: 10px;
    border: 1px solid #eee;

    position: relative;
    /*transition: all 0.2s;*/
    /*&:hover {*/
    /*transform: scale(1.15);*/
    /*}*/
    &:hover {
      border: 1px solid #f50084;
    }
  }

  .img-item {
    width: 80px;
  }

  .icon-select {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.15);
    font-size: 22px;
    color: white;
    text-align: center;
    padding: 5px;
    line-height: 1em;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: bold;
    &:hover {
      background-color: rgba(246, 0, 132, 0.31);
    }

    &.active {
      background-color: rgba(246, 0, 132, 1);
    }
  }

  .search-box {
    width: 400px;
  }

  .preview {
    width: 180px;
    height: 180px;
  }
</style>
