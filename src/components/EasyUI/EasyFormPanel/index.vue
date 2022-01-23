<template>
  <div>
    <!--单表单-->
    <easy-form
      v-if="!(panelOptions instanceof Array)"
      ref="easyForm"
      v-model="formData"
      :options="options"
    />

    <!--多表单-->
    <template v-else>
      <easy-form
        v-for="(opt,index) in panelOptions"
        :ref="'easyForm' + index"
        :key="index"
        v-model="formData[index]"
        :options="opt"
      />
    </template>

    <slot name="footer" />

    <div :class="[buttonAlign(), {'mt-22': !!$slots.footer}]">
      <!--取消按钮-->
      <el-button
        v-if="btnCancel.show"
        size="mini"
        :type="btnCancel.type || 'default'"
        :plain="btnCancel.hasOwnProperty('plain') ? btnCancel.plain : false"
        :round="btnCancel.hasOwnProperty('round') ? btnCancel.round : false"
        :icon="btnCancel.icon"
        @click="onClickCancel"
      >{{ btnCancel.text }}
      </el-button>

      <!--提交按钮-->
      <el-button
        v-if="btnSubmit.show"
        :loading="btnSubmit.isLoading"
        size="mini"
        :type="btnSubmit.type || 'primary'"
        :plain="btnSubmit.hasOwnProperty('plain') ? btnSubmit.plain : false"
        :round="btnSubmit.hasOwnProperty('round') ? btnSubmit.round : false"
        :icon="btnSubmit.icon || 'el-icon-check'"
        @click="onClickSubmit"
      >{{ btnSubmit.text }}
      </el-button>

      <!-- 自定义类型按钮 -->
      <el-button
        v-if="btnCustom.show"
        :loading="btnCustom.isLoading"
        size="mini"
        :type="btnCustom.type || 'warning'"
        :plain="btnCustom.hasOwnProperty('plain') ? btnCustom.plain : false"
        :round="btnCustom.hasOwnProperty('round') ? btnCustom.round : false"
        :icon="btnCustom.icon"
        @click="onClickCustom"
      >{{ btnCustom.text }}
      </el-button>
    </div>
  </div>
</template>

<script>
import EasyForm from '../EasyForm'

export default {
  name: 'EasyFormPanel',
  components: { EasyForm },
  props: {
    /**
       * v-model 配置参数
       */
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },

    /**
       * 表单内容配置
       * 具体配置参考：EasyForm 配置
       */
    options: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    },

    /**
       * 按钮配置
       */
    buttons: {
      type: Object,
      default: () => {
        return {
          // 按钮位置
          align: 'left', // right || center

          // 提交按钮
          submit: {
            show: true,
            text: '提交',
            confirm: { title: '', content: '' },
            clickMethod: (formData) => {
            }
          },

          // 取消按钮
          cancel: {
            show: true,
            text: '取消',
            confirm: { title: '', content: '' },
            clickMethod: (formData) => {
            }
          }
        }
      }
    }
  },
  data () {
    return {
      /**
       * 表单数据
       */
      formData: {},

      panelOptions: {},

      /**
         * 提交按钮配置
         */
      btnSubmit: {
        show: true,
        text: '提交'
      },

      /**
         * 取消按钮配置
         */
      btnCancel: {
        show: true,
        text: '取消'
      },
      /**
       * 自定义类型按钮
       */
      btnCustom: {
        show: false,
        text: '自定义'
      }
    }
  },
  /**
   * 监听值变更
   */
  watch: {

    options: {
      immediate: true,
      handler (val) {
        // 重置配置
        this.panelOptions = val

        this.initButtons()
      }
    },

    buttons: {
      immediate: true,
      handler (val) {
        this.initButtons()
      }
    },

    /**
     * 监听表单值参数是否变更
     */
    formData: {
      immediate: true,
      deep: true,
      handler (val) {
        console.log('formData change: ', val)
        // emit input 事件，实现组件 v-model 指令
        this.$emit('input', val)

        this.$nextTick(() => {
          // 将值变更传递给监听表单值的组件
          setTimeout(() => {
            this.invokeWatchForm()
          }, 50)
        })
      }
    }
  },
  created () {
  },
  methods: {

    /**
     * 调用那些有配置监听表单值的组件中的 watchForm 方法
     * 调用的前提：1. 配置中 watchForm 属性为 true；2：组件中 methods 方法中有 watchForm 方法
     */
    invokeWatchForm () {
      if (!(this.panelOptions instanceof Array)) { // 单表单
        this._dealItemFormOptionInvokeWatchForm(this.panelOptions, Object.assign({}, this.formData), false)
      } else { // 多表单
        // 1.1 汇总表单的属性
        let tmpFormData = {}
        for (let i = 0; i < this.panelOptions.length; i++) {
          tmpFormData = { ...tmpFormData, ...Object.assign({}, this.formData[i]) }
        }

        // // 分别判断各表单中有监听的字段
        this.panelOptions.forEach((itemFormOption, formIndex) => {
          this._dealItemFormOptionInvokeWatchForm(itemFormOption, tmpFormData, true, formIndex)
        })
      }
    },

    /**
     * 处理一个表单配置的 watchForm 调用
     */
    _dealItemFormOptionInvokeWatchForm (formOption, val, isMultiForm, formIndex) {
      formOption.rows.forEach(row => {
        row.items.forEach(item => {
          // 1.1 有在配置中配置要监听
          if (!item.hasOwnProperty('watchForm') || !item.watchForm.enable) {
            return
          }

          // 2.1 获取实例
          //     区分单表单和多表单的情况
          let nodeItem = null
          if (!isMultiForm) {
            nodeItem = this.$refs['easyForm'].$refs[item.prop]
          } else {
            nodeItem = this.$refs['easyForm' + formIndex][0].$refs[item.prop]
          }
          if (!nodeItem) {
            return
          }

          console.log('[', item.prop, ']', '--> invoke watch form: ', formOption, val)
          // 判断是否有配置 watchForm 方法
          if (nodeItem instanceof Array && nodeItem.length > 0 && nodeItem[0].hasOwnProperty('watchForm')) {
            nodeItem[0].watchForm(item.watchForm.hasOwnProperty('formatter') ? item.watchForm.formatter(val) : val)
          } else if ((nodeItem instanceof Array) && nodeItem.hasOwnProperty('watchForm')) {
            nodeItem.watchForm(item.watchForm.hasOwnProperty('formatter') ? item.watchForm.formatter(val) : val)
          }
        })
      })
    },

    /**
       * 初始化配置按钮
       */
    initButtons () {
      if (this.buttons.hasOwnProperty('submit')) {
        this.btnSubmit = { ...this.buttons.submit }
      }

      if (this.buttons.hasOwnProperty('cancel')) {
        this.btnCancel = { ...this.buttons.cancel }
      }

      if (this.buttons.hasOwnProperty('custom')) {
        this.btnCustom = { ...this.buttons.custom }
      }
    },

    /**
       * 按钮位置 left||center||right
       * @returns {string}
       */
    buttonAlign () {
      if (!this.buttons.hasOwnProperty('align')) {
        return 'text-left'
      }

      return 'text-' + this.buttons.align
    },

    /**
     * 验证表单
     * callback(boolean, Object)
     * e.g: callback(validResult, formData)
     */
    validate (callback) {
      let validateCounter = 0
      let validateGatherResult = true
      let emitData = {}

      // 1.1 多表单的情况，需要判断多个表单的验证结果
      if (this.options instanceof Array) {
        for (let i = 0; i < this.panelOptions.length; i++) {
          this.$refs['easyForm' + i][0].validate(({ valid, data }) => {
            emitData = { ...emitData, ...data }
            validateCounter++

            !valid && (validateGatherResult = valid)
            if (validateCounter < this.options.length) {
              return
            }

            console.log('multi form data: ', emitData)

            // 执行验证的回调
            if (!validateGatherResult) {
              callback(false, emitData)
              return
            }

            // 执行验证通过的 callback
            callback(true, emitData)
          })
        }
      } else { // 2.1 单表单的情况
        this.$refs['easyForm'].validate(({ valid, data }) => {
          emitData = { ...emitData, ...data }
          if (!valid) {
            callback(false, emitData)
            return
          }

          // 执行验证通过的 callback
          callback(true, emitData)
        })
      }
    },

    /**
     * 清除表单验证的结果信息
     */
    clearValidate () {
      if (this.options instanceof Array) {
        for (let i = 0; i < this.options.length; i++) {
          this.$refs['easyForm' + i][0].clearValidate()
        }
      } else {
        this.$refs['easyForm'].clearValidate()
      }
    },

    /**
     * 设置表单的值
     */
    resetFormData (data) {
      if (this.options instanceof Array) {
        for (let i = 0; i < this.options.length; i++) {
          this.$refs['easyForm' + i][0].resetFormData(data)
        }
      } else {
        this.$refs['easyForm'].resetFormData(data)
      }
    },

    /**
     * 重置表单
     */
    resetForm () {
      if (this.options instanceof Array) {
        for (let i = 0; i < this.options.length; i++) {
          this.$refs['easyForm' + i].resetForm()
        }
      } else {
        this.$refs['easyForm'].resetForm()
      }
    },

    /**
       * 点击提交
       */
    onClickSubmit () {
      this.validate((isValid, data) => {
        if (!isValid) {
          console.log('EasyFormPanel validation failed: ', isValid)
          return
        }

        this.dealClickMethod(data)
      })
    },

    /**
     * 指定点击事件
     */
    dealClickMethod (data) {
      // 如果未配置 submit 按钮的 clickMethod 方法，则取消操作
      if (!this.btnSubmit || !this.btnSubmit.hasOwnProperty('clickMethod')) {
        return
      }

      if (this.btnSubmit.hasOwnProperty('confirm')) {
        this.$confirm(this.btnSubmit.confirm.content ? this.btnSubmit.confirm.content : '确定执行该操作?',
          this.btnSubmit.confirm.title ? this.btnSubmit.confirm.title : '操作确认', {
            confirmButtonText: this.btnSubmit.confirm.confirmButtonText ? this.btnSubmit.confirm.confirmButtonText : '确定',
            cancelButtonText: this.btnSubmit.confirm.cancelButtonText ? this.btnSubmit.confirm.cancelButtonText : '取消',
            type: 'warning'
          }).then(() => {
          this.btnSubmit.clickMethod(data)
        }).catch((e) => {
          console.log(e)
        })
      } else {
        this.btnSubmit.clickMethod(data)
      }
    },

    /**
       * 点击取消
       */
    onClickCancel () {
      if (!this.btnCancel || !this.btnCancel.hasOwnProperty('clickMethod')) {
        return
      }

      if (this.btnCancel.hasOwnProperty('confirm')) {
        this.$confirm(this.btnCancel.confirm.content ? this.btnCancel.confirm.content : '确定执行该操作?',
          this.btnCancel.confirm.title ? this.btnCancel.confirm.title : '操作确认', {
            confirmButtonText: this.btnCancel.confirm.confirmButtonText ? this.btnCancel.confirm.confirmButtonText : '确定',
            cancelButtonText: this.btnCancel.confirm.cancelButtonText ? this.btnCancel.confirm.cancelButtonText : '取消',
            type: 'warning'
          }).then(() => {
          this.btnCancel.clickMethod(this.formData)
        }).catch((e) => {
          console.log(e)
        })
      } else {
        this.btnCancel.clickMethod(this.formData)
      }
    },

    /**
     * 点击自定义按钮
     */
    onClickCustom () {
      if (!this.btnCustom || !this.btnCustom.hasOwnProperty('clickMethod')) {
        return
      }

      // 是否配置了需要校验表单数值
      if (this.btnCustom.valid) {
        this.validate((isValid, data) => {
          if (!isValid) {
            console.log('EasyFormPanel validation failed: ', isValid)
            return
          }

          this.dealClickCustomMethod(data)
        })
        return
      }

      this.dealClickCustomMethod(this.formData)
    },

    /**
     * 自定义按钮点击之后事件
     */
    dealClickCustomMethod (data) {
      if (this.btnCustom.hasOwnProperty('confirm')) {
        this.$confirm(this.btnCustom.confirm.content ? this.btnCustom.confirm.content : '确定执行该操作?',
          this.btnCustom.confirm.title ? this.btnCustom.confirm.title : '操作确认', {
            confirmButtonText: this.btnCustom.confirm.confirmButtonText ? this.btnCustom.confirm.confirmButtonText : '确定',
            cancelButtonText: this.btnCustom.confirm.cancelButtonText ? this.btnCustom.confirm.cancelButtonText : '取消',
            type: 'warning'
          }).then(() => {
          this.btnCustom.clickMethod(this.formData)
        }).catch((e) => {
          console.log(e)
        })
      } else {
        this.btnCustom.clickMethod(this.formData)
      }
    }
  }
}
</script>
