<template>
  <div>
    <tinymce
      ref="editor"
      v-model="content"
      :value="content"
      :height="height"
      upload-name="file"
      :upload-url="uploadUrl"
      :upload-btn-text="uploadBtnText"
      :upload-headers="uploadHeaders"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { getToken } from '@/utils/auth'

export default {
  name: 'RichEditor',
  components: {
    Tinymce
  },
  props: {
    value: {
      type: String,
      default: ''
    },

    height: {
      type: Number,
      default: 400
    },

    uploadBtnText: {
      type: String,
      default: '上传图片'
    },

    uploadUrl: {
      type: String,
      default: process.env.VUE_APP_BASE_API + '/file/upload'
    },

    uploadHeaders: {
      type: Object,
      default: () => {
        return {
          'Authorization': 'Bearer ' + getToken()
        }
      }
    }
  },
  data() {
    return {
      content: null
    }
  },

  watch: {
    content(val) {
      this.$emit('input', val)
    }

    // value(val) {
    // this.$refs['editor'].setContent(val)
    // console.log('value:', val)
    // }
  },

  created() {
    this.content = this.value
  },

  methods: {
    /**
       * 设置编辑器中的值
       * @param val
       */
    setContent(val) {
      this.$refs['editor'].setContent(val)
    }
  }
}
</script>
