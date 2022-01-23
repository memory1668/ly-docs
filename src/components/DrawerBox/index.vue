<template>
  <div>
    <el-drawer
      :visible.sync="visible"
      :direction="direction"
      :before-close="handleClose"
      :append-to-body="true"
      :destroy-on-close="destroyOnClose"
      :custom-class="theme"
      :size="size"
      @close="onClosed"
    >
      <div slot="title">
        <div class="title-box">
          <div class="title">{{ title }}</div>
          <div v-if="path" class="link" @click="goTo(path)"><i class="el-icon-link" /> <span class="ml-2">源页面</span></div>
        </div>
      </div>
      <div v-if="visible || !destroyOnClose" :style="{'overflow-y': 'auto', 'height' : height}">
        <slot />
      </div>
    </el-drawer>

  </div>
</template>

<script>
export default {
  name: 'Drawer',
  components: {},
  props: {
    /**
     * 主题，light: 白色，dark: 主题深色
     */
    theme: {
      type: String,
      default: 'light'
    },

    /**
     * 弹出方向
     */
    direction: {
      type: String,
      default: 'rtl'
    },

    title: {
      type: String,
      default: '报表'
    },

    size: {
      type: String,
      default: '80%'
    },

    height: {
      type: String,
      default: '90vh'
    },

    /**
     * 页面源地址
     */
    path: {
      type: String,
      default: ''
    },

    /**
     * 控制是否在关闭 Drawer 之后将子元素全部销毁 !!不生效，使用v-if代替
     */
    destroyOnClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {

    handleShow() {
      this.visible = true
    },

    handleClose(done) {
      this.visible = false
    },

    /**
     * 跳转页面
     * @param path
     */
    goTo(path) {
      this.$router.push({ path: path })
    },

    /**
     * 关闭时触发
     */
    onClosed() {
      this.$emit('close')
    }

  }
}
</script>

<style lang="scss" scoped>
.title-box {
  display: flex;
  flex-direction: row;

  .link {
    color: $color-theme;
    font-size: 14px;
    cursor: pointer;
    margin-left: 15px;
    margin-top: 2px;

    &:hover {
      text-decoration: underline;
    }
  }
}

/deep/ .el-drawer {
  &.dark {
    background-color: #1d1a4f;

    .el-drawer__header {
      color: rgba(255, 255, 255, .6);
    }
  }
}
</style>
