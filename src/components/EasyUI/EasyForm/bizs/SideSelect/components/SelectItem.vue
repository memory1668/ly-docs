<template>
  <div id="menu-item" class="menu-item">
    <el-menu-item
      :index="index"
      :disabled="disabled"
    >
      <div class="flex menu-item-container collapse-content">
        <div class="aic flex-1 pr-15">
          <!-- 显示图片链接 -->
          <div v-if="item.icon" class="mt-0 mr-15">
            <el-image style="width: 20px;height: 20px;border-radius: 3px;" :src="item.icon" fit="fill" />
          </div>
          <icon v-if="item.i" :icon-class="item.i" class="mr-15 mt-2" />
          <div class="label-name">
            <span :class="{'label-name-text': true, 'line-2': ellipsis}">{{ item[option.labelField] }}</span>
            <!--右上角信息-->
            <span
              v-if="getInfo(item)"
              :class="{'menu-info': true, 'active': index === activeIndex}"
            >{{ getInfo(item) }}</span>
          </div>
        </div>
        <div v-if="getTag(item)">
          <el-tag
            v-bind="option.tag"
            :type="option.tag.type || 'primary'"
            :size="option.tag.size || 'mini'"
          >{{ getTag(item) }}
          </el-tag>
        </div>
      </div>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'SelectItem',
  props: {
    /**
     * 选项数据
     */
    item: {
      type: Object,
      default() {
        return {}
      }
    },

    /**
     * 选项配置
     */
    option: {
      type: Object,
      default() {
        return {}
      }
    },

    /**
     * 唯一标志
     */
    index: {
      type: String,
      default: ''
    },

    /**
     * 当前选中项的标志
     */
    activeIndex: {
      type: String,
      default: ''
    },

    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: false
    },

    /**
     * 名称过长是否显示省略号
     */
    ellipsis: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    /**
     * 根据配置获取选项标记内容
     * @param option
     */
    getTag(option) {
      if (!option) {
        return
      }
      const tagOpt = this.option.tag
      if (!tagOpt) {
        return
      }
      if (tagOpt.name) {
        return tagOpt.name + ''
      }
      if (tagOpt.field) {
        return option[tagOpt.field] + ''
      }
      if (tagOpt.formatter && typeof tagOpt.formatter === 'function') {
        return tagOpt.formatter(option) + ''
      }
      return ''
    },

    /**
     * 根据配置获取右上角显示信息
     * @param option
     */
    getInfo(option) {
      if (!option) {
        return
      }
      const infoOpt = this.option.info
      if (!infoOpt) {
        return
      }
      if (infoOpt.name) {
        return infoOpt.name + ''
      }
      if (infoOpt.field) {
        return option[infoOpt.field] + ''
      }
      if (infoOpt.formatter && typeof infoOpt.formatter === 'function') {
        return infoOpt.formatter(option) + ''
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item-container {
  align-items: center;
  min-height: 50px;
  line-height: 50px;
}

.label-name {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin: 10px 0;

  .label-name-text {
    white-space: normal;
    line-height: 1.5em;
    font-size: 14px;
    font-weight: 500;
  }

  .line-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .menu-info {
    background-color: #ffe6f3;
    color: #ff0089;
    position: absolute;
    top: -6px;
    right: 0;
    height: 16px;
    line-height: 16px;
    min-width: 16px;
    border-radius: 16px;
    text-align: center;
    font-size: 12px;
    box-sizing: border-box;
    padding: 0 3px;
    transform: translateX(70%);
  }

  .active {
    background-color: #FFFFFF;
  }
}

#menu-item.menu-item {
  /deep/ .el-menu-item{
    height: auto;
    min-width: 149px !important;
    padding: 0 10px !important; // 减小选项左右间距
    // 设置选中项文字样式
    &.is-active .label-name-text {
      color: #ff0089;
    }
    &:hover {
      background-color: #F6F6F6; // 修改鼠标悬停时菜单的背景色
    }
  }

  // 设置选中栏背景色保持不变
  /deep/ .el-menu-item.is-active {
    background-color: rgba(254, 227, 241, 1);
  }

  // 一级菜单的颜色继承
  /deep/ > .el-menu-item i {
    color: inherit;
  }
}
</style>
