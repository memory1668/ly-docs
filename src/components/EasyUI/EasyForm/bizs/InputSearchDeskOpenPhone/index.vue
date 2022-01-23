<template>
  <div>
    <div class="flex">
      <div class="flex-1 mr-10">
        <el-input
          v-model="phone"
          placeholder="填写顾客手机号"
          class="input-with-select"
        />
      </div>

      <el-button icon="el-icon-search" @click="clickFilterUser">筛选台位手机号</el-button>
    </div>

    <el-dialog
      title="台位顾客和工作人员"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
      append-to-body
    >
      <div class="mod">
        <div class="title">订单顾客</div>
        <div v-if="users.length === 0" class="empty-info">
          暂无有效顾客信息
        </div>
        <div>
          <div v-for="user in users" :key="user.id" class="user-item" @click="selectItem(user)">
            <div class="flex">
              <div style="padding-top: 3px;">
                <el-image class="w-40" style="border-radius: 5px;" :src="user.avatar" fit="fill" />
              </div>
              <div class="ml-10 pt-2">
                <div class="bold mb-5">{{ user.name }}</div>
                <div v-if="user.phone"><i class="el-icon-mobile-phone" />{{ user.phone }}</div>
                <div v-else>-</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="mod">
        <div class="title">工作人员</div>
        <div v-if="staffs.length === 0" class="empty-info">
          暂无有效工作人员信息
        </div>
        <div>
          <div v-for="staff in staffs" :key="staff.id" class="user-item" @click="selectItem(staff)">
            <div class="flex">
              <div style="padding-top: 3px;">
                <el-image class="w-40" style="border-radius: 5px;" :src="staff.avatar" fit="fill" />
              </div>
              <div class="ml-10 pt-5">
                <div class="bold mb-5">{{ staff.name }} <el-tag v-if="staff.department" class="ml-5" type="primary" size="mini">{{ staff.department.name }}</el-tag></div>
                <div v-if="staff.phone"><i class="el-icon-mobile-phone" />{{ staff.phone }}</div>
                <div v-else>-</div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import apiDeskOpen from '@/api/desk-open'

export default {
  name: 'InputSearchDeskOpenPhone',
  components: { },
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      phone: '',

      deskId: '',

      // 可选择的用户/员工信息
      users: [],
      staffs: [],

      dialogVisible: false
    }
  },

  watch: {

    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.phone = val
      }
    },

    phone: {
      immediate: true,
      handler(val) {
        this.$emit('input', val)
      }
    }
  },

  created() {

  },

  methods: {

    /**
     * 监听表单值变更
     */
    watchForm(form) {
      this.deskId = form.desk_id
    },

    /**
     * 获取台位相关人员信息
     */
    getRelatedUserStaffs() {
      if (!this.deskId) {
        this.$message.error('台位信息无效，请重试')
        return
      }
      apiDeskOpen.getRelatedUserStaffs(this.deskId).then(res => {
        this.users = res.data.users
        this.staffs = res.data.staffs

        if (this.users.length > 0 || this.staffs.length > 0) {
          this.dialogVisible = true
        } else {
          this.$message.info('未筛选到有效用户信息，请手动填写')
        }
      }).catch(e => {
        console.log(e)
        this.$message.error('筛选台位相关用户和工作人员信息失败')
      })
    },

    /**
     * 点击筛选手机号
     */
    clickFilterUser() {
      this.getRelatedUserStaffs()
    },

    /**
     * 关闭筛选弹框
     */
    handleClose() {
      this.dialogVisible = false
    },

    /**
     * 选中用户/工作人员
     * @param item
     */
    selectItem(item) {
      this.phone = item.phone

      this.$emit('input', this.phone)
      this.dialogVisible = false
    }

  }
}
</script>

<style lang="scss">
  .user-item {
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    display: inline-block;
    padding: 10px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: rgba(255, 0, 139, .06);
      cursor: pointer;

      border-color: #ff0089;
    }
  }

  .empty-info {
    background: #fafafa;
    padding: 20px 15px;
    border-radius: 5px;
  }
</style>
