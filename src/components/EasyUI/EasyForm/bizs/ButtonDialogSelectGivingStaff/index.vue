<template>
  <div>
    <!--选择工作人员账号-->
    <button-dialog-select-staff
      v-model="selectedStaffId"
    >
      <template #bottom>
        <!--赠送统计-->
        <div v-if="givingStat" class="mt-15 pl-15">
          <div class="title title-tip mb-5">
            <span class="title-number">赠送信息</span>
          </div>
          <div class="stat-item">
            <span class="label">本月已赠</span>
            <span class="value">￥{{ givingStat.month_giving_amount | filterPrice }}</span>
          </div>
          <div class="stat-item">
            <span class="label">本月剩余</span>
            <span class="value">￥{{ givingStat.month_remain_amount | filterPrice }}</span>
          </div>
          <div class="stat-item">
            <span class="label">本台已赠</span>
            <span class="value">￥{{ givingStat.desk_open_giving_amount | filterPrice }}</span>
          </div>
          <div class="stat-item">
            <span class="label">本台剩额</span>
            <span v-if="givingStat.is_limit_desk_amount" class="value">￥{{ givingStat.desk_open_remain_amount | filterPrice }}</span>
            <span v-else class="value">不限</span>
          </div>
        </div>
      </template>
    </button-dialog-select-staff>
  </div>
</template>

<script>
import ButtonDialogSelectStaff from '../ButtonDialogSelectStaff/index'
import apiStaff from '@/api/staff'
export default {
  name: 'ButtonDialogSelectGivingStaff',
  components: { ButtonDialogSelectStaff },
  props: {
    /**
     * v-model 选中的值
     */
    value: {
      type: String,
      default: ''
    },
    // 当前台位id
    deskId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      givingStat: null
    }
  },
  computed: {
    selectedStaffId: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getGivingStat(val)
        return
      }
      this.resetStat()
    }
  },

  methods: {
    /**
     * 获取当前选中员工的赠送统计
     * @param {string} id 员工id
     */
    async getGivingStat(id) {
      try {
        const { data } = await apiStaff.getGivingStat(this.deskId, id)
        this.givingStat = data
        console.log('获取当前选中员工的赠送统计成功', data)
      } catch (e) {
        this.resetStat()
        console.error('获取当前选中员工的赠送统计失败', e)
      }
    },

    /**
     * 重置赠送统计数据
     */
    resetStat() {
      this.givingStat = null
    }
  }
}
</script>

<style lang="scss" scoped>
  .stat-item {
    line-height: 22px;
    display: flex;
    justify-content: space-between;
  }

  .title-tip {
    border-left: 3px solid #ff0089;
    padding-left: 12px;
    margin-left: -15px;
    line-height: 14px;
    font-weight: bold;
  }

  .label {
    color: #999;
  }
</style>
