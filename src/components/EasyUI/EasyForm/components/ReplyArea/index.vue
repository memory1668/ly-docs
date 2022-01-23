<template>
  <div>
    <!-- 显示聊天记录列表 -->
    <div class="container mb-25">
      <el-scrollbar
        ref="scrollBox"
        tag="section"
        :native="false"
      >
        <div class="reply-container pr-15 pl-15 pt-5 pb-5">
          <div v-for="(item, index) in replyList" :key="index">
            <div
              class="flex mt-25 message-item"
              :style="{'justify-content': item.type === 1 ? 'flex-end': ''}"
            >
              <text-message
                :content="item.content"
                :float="item.type === 1 ? 'left' : 'right'"
              />
            </div>
          </div>
          <!-- 显示暂无回复内容 -->
          <div v-if="!replyList.length" class="empty-tip">无回复记录</div>
        </div>
      </el-scrollbar>
    </div>

    <!-- 回复内容 -->
    <div class="form-title">回复内容</div>
    <el-input v-model="content" type="textarea" :placeholder="placeholder" />
  </div>
</template>

<script>
import TextMessage from '@/components/ChatBox/components/chat/components/TextMessage'
import apiComment from '@/api/douyin-comment'
export default {
  name: 'ReplyArea',
  components: { TextMessage },
  props: {
    value: {
      type: String,
      default: ''
    },

    /**
     * 评论id
     */
    commentId: {
      type: String,
      default: ''
    },

    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      content: '',
      replyList: [],
      id: '' // 新增参数，解决请求问题
    }
  },
  watch: {
    value: {
      handler(val) {
        this.content = val
      }
    },

    content: {
      handler(val) {
        this.$emit('input', val)
      }
    },

    commentId: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getCommentReplyList(val)
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 获取评论回复记录
     * @param {String} id
     */
    getCommentReplyList(id) {
      apiComment.commentReplyList(id).then(res => {
        this.replyList = res.data.map(item => {
          return {
            ...item,
            type: 2
          }
        })

        // 记录滚动到底部
        this.$nextTick(() => {
          const el = this.$refs['scrollBox'].$refs['wrap']
          el.scroll({
            top: el.scrollHeight
          })
        })
      }).catch(error => { console.log('获取回复记录失败==>', error) })
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    background-color: #F6F6F6;
  }
  .reply-container {
    border-radius: 2px;
    line-height: normal;
    margin-top: -25px;

    box-sizing: border-box;

    .empty-tip {
      height: 120px;
      text-align: center;
      line-height: 145px;
      color: #999;
    }
  }
 .form-title {
    margin-bottom: 20px;
    font-size: 14px;
    margin-top: 10px;
    padding-left: 10px;
    border-left: 3px solid #ff0089;
    line-height: 1em;
  }

  /deep/ .el-scrollbar__wrap {
    margin-bottom: 0 !important;
    overflow-y: scroll;
    overflow-x: hidden;
    min-height: 50px;
    max-height: 190px;
  }
</style>
