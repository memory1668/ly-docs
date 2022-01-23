<template>
  <div>
    <el-button :disabled="disabled" @click="showDialog">{{ labelPlaceholder }}</el-button>

    <!--:style="{'background': 'url('+ bgUrl +') no-repeat','background-size': 'cover'}"-->
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="700px"
      custom-class="dialog-cls"
      top="9vh"
      @closed="closedDialog"
    >
      <div slot="title">
        <div class="dialog-title">选择台号</div>
      </div>
      <div class="mt-5">

        <!--<div class="flex filter-bar">-->
        <!--<div class=" fz-14 bold mt-10 mr-15 filter-name">查询日期</div>-->

        <!--<div>-->
        <!--<el-date-picker-->
        <!--v-model="filterDate"-->
        <!--type="date"-->
        <!--placeholder="查询日期，默认：今天"-->
        <!--:picker-options="pickerOptions"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--@change="changeDate($event)"-->
        <!--/>-->
        <!--</div>-->
        <!--</div>-->

        <div v-if="isToday" class="">

          <div v-for="(zone, index) in list" :key="index" class="zone-item">
            <div class="zone-name fz-15 bold mt-15 mb-15">{{ zone.name }} {{ zone.num_desk }} 台号</div>

            <div class="desk-box">
              <div
                v-for="(desk, deskIndex) in zone.desks"
                :key="deskIndex"
                :class="{'desk-item': true, 'bg-not-open': desk.service_status === 0, 'bg-opening': desk.service_status === 10, 'bg-reserve': desk.service_status === 20, 'bg-locked': desk.service_status === 30}"
                @click="selectDesk($event, desk, deskIndex, zone)"
              >
                <div class="desk-number-box">
                  <div class="desk-number">{{ desk.name }}</div>
                </div>
                <div class="desk-tip-box">
                  <div v-if="desk.service_status === 0 && !desk.reserve_info">可预订</div>
                  <div v-else-if="desk.service_status === 0 && !!desk.reserve_info">已预订</div>
                  <div v-else-if="desk.service_status === 20">已预定</div>
                  <div v-else-if="desk.service_status === 10">消费中</div>
                  <div v-else-if="desk.service_status === 30">已锁定</div>
                </div>

              </div>

            </div>
          </div>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import apiZone from '@/api/zone'
import apiDesk from '@/api/desk'

export default {
  name: 'ButtonDialogSelectZoneDesk',
  components: {},
  props: {
    /**
       * 是否显示
       */
    visible: {
      type: Boolean,
      default: false
    },

    /**
       * v-model 选中的值
       */
    value: {
      type: String,
      default: ''
    },

    /**
     * 是否不可点击
     */
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {

      filterDate: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime())
              picker.$emit('pick', date)
            }
          },
          {
            text: '明天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '后天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 2)
              picker.$emit('pick', date)
            }
          }
        ]
      },

      dialogVisible: false,

      // 按钮配置
      button: {},

      labelPlaceholder: '选择台号',
      list: [],
      // 选中项
      selectedDesk: {}
    }
  },

  computed: {
    /**
       * 判断查看日期是否今天
       */
    isToday() {
      if (!this.filterDate) {
        return true
      }
      if (new Date(this.filterDate).toDateString() === new Date().toDateString()) {
        return true
      }

      return false
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (!val) {
          this.selectedDesk = {}
          this.labelPlaceholder = '选择台号'
          return
        }

        this.getById(val)
      }
    },

    visible(val) {
      this.dialogVisible = val
    },

    dialogVisible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.listWithDesks()
        }
      }
    }
  },

  created() {
  },

  methods: {

    /**
       * 通过 ID 获取详情
       */
    getById(deskId) {
      apiDesk.getById(deskId).then(res => {
        this.selectedDesk = res.data
        if (res.data.zone) {
          this.labelPlaceholder = '已选：' + res.data.zone.name + ' - ' + res.data.name
        } else {
          this.labelPlaceholder = '已选：' + +res.data.name
        }
      }).catch(e => {
        console.log(e)
      })
    },

    /**
       * 选择台号
       */
    selectDesk(e, desk, index, zone) {
      console.log(e, desk, index)

      this.selectedDesk = desk
      this.labelPlaceholder = '已选：' + zone.name + ' - ' + desk.name
      this.$emit('input', desk.id)
      this.dialogVisible = false
    },

    /**
       * 加载台号列表
       */
    listWithDesks() {
      apiZone.listWithDesks().then(res => {
        this.list = res.data.list
      }).catch(e => {
        console.log(e)
      })
    },

    /**
       * 显示弹窗
       */
    showDialog() {
      this.dialogVisible = true
    },

    closedDialog() {
      this.dialogVisible = false
    },

    /**
       * 修改日期
       */
    changeDate(e) {
      console.log(e)
    }

  }
}
</script>
<style>
  .dialog-cls {
    background-color: #15002c;
    background: url("../../../../../assets/images/bg-platform.png");
  }
</style>

<style lang="scss" scoped>
  .filter-bar {
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .desk-box {
    display: flex;
    flex-wrap: wrap;
  }

  .desk-item {
    position: relative;
    font-size: 12px;
    height: 80px;
    width: 100px;
    overflow: hidden;
    background-color: #f0f0f0;
    border-radius: 10px;
    cursor: pointer;

    padding: 15px;
    margin-bottom: 10px;
    margin-right: 10px;

    transition: all 0.1s;
    &:hover {
      transform: scale(1.15);
    }
  }

  .desk-number-box {

    .desk-number {
      font-size: 13px;
      text-align: center;
      color: white;
      font-weight: bold;
      padding: 2px 8px;
      margin-top: 5px;
    }
  }

  .bg-not-open {
    background-color: #210076;
    /*border: 1px solid #eee;*/
    background: -webkit-linear-gradient(135deg, #210076, #220064);
    background: -moz-linear-gradient(135deg, #210076, #220064);
    background: -o-linear-gradient(135deg, #210076, #220064);
    background: linear-gradient(135deg, #210076, #220064);;
    &:hover {
      background-color: #eee;
    }

    .desk-number {
      /*background-color: #999;*/
      color: #ddd;
    }

    .not-open {
      color: #999;
    }

    .desk-status {
      background-color: #999;
      color: white;
    }
  }

  .bg-opening {
    background-color: #ff0089;
    background: -webkit-linear-gradient(135deg, #ff0089, #f7185e);
    background: -moz-linear-gradient(135deg, #ff0089, #f7185e);
    background: -o-linear-gradient(135deg, #ff0089, #f7185e);
    background: linear-gradient(135deg, #ff0089, #f7185e);

    &:hover {
      background-color: #ff0089;
    }

    .desk-number {
      /*background-color: rgba(255, 255, 255, 0.3);*/
    }

    .consume {
      color: white;
    }

    .item-footer {
      color: white;
    }

    .desk-status {
      background-color: rgba(255, 255, 255, 0.3);
      color: white;
    }
  }

  .bg-reserve {
    background-color: #0071ff;
    &:hover {
      background-color: #0061cb;
    }

    .desk-number {
      /*background-color: rgba(255, 255, 255, 0.3);*/
    }

    .reserve {
      color: white;
    }

    .desk-status {
      background-color: rgba(255, 255, 255, 0.3);
      color: white;
    }
  }

  .bg-locked {
    /*background-color: rgba(55, 6, 25, 0.1);*/
    background-color: #370619;
    &:hover {
      background-color: #290513;
    }

    .desk-number {
      /*background-color: rgba(255, 255, 255, 0.3);*/
    }

    .locked {
      color: white;
    }

    .desk-status {
      background-color: rgba(255, 255, 255, 0.3);
      color: white;
    }
  }

  .zone-name {
    line-height: 1em;
    padding-left: 15px;
    border-left: 3px solid #ff0089;
    color: rgba(255, 255, 255, 0.80);
  }

  .desk-name {
    font-size: 13px;
    font-weight: bold;
    text-align: center;
  }

  .desk-tip-box {
    text-align: center;
    margin-top: 5px;
    color: white;
  }

  .dialog-title {
    color: rgba(255, 255, 255, 0.80);
  }

  .filter-name {
    color: rgba(255, 255, 255, 0.41);
  }
</style>
