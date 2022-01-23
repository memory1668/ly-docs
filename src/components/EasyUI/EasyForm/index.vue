<template>
  <div>
    <div
      v-if="formattedOptions.title"
      class="form-title"
    >{{ formattedOptions.title }}
    </div>
    <el-form
      ref="dataForm"
      :model="formData"
      :label-width="formattedOptions.attrs.hasOwnProperty('labelWidth') ? formattedOptions.attrs.labelWidth: '90px'"
      v-bind="{...formattedOptions.attrs}"
    >

      <template v-for="(row,index) in formattedOptions.rows">
        <el-row
          :key="index"
          :gutter="row.gutter || 20"
          :type="row.type || null"
          :justify="row.justify || null"
          :class="{'sign-box': row.isSign}"
        >
          <template v-for="(item, itemIndex) in row.items">
            <el-col
              :key="index + '-' + itemIndex"
              :span="(item.col && item.col.span) ? item.col.span : ((row.col && row.col.span ) ? row.col.span : 24/row.items.length) "
            >
              <el-form-item
                v-if="item.hasOwnProperty('show') ? item.show : true"
                :prop="item.prop"
                :label="item.label"
                :label-width="item.hasOwnProperty('labelWidth') ? item.labelWidth : formattedOptions.attrs.hasOwnProperty('labelWidth') ? formattedOptions.attrs.labelWidth: '90px'"
                :rules="item.rules ? item.rules: []"
              >
                <span v-if="item.label" slot="label" class="custom-label">
                  <span>{{ item.label }}

                    <el-tooltip v-if="item.tip" class="item" effect="dark" :content=" item.tip.hasOwnProperty('label') ? item.tip.label : item.tip" placement="top">
                      <i class="el-icon-info" size="15px" />
                    </el-tooltip>
                  </span>
                </span>

                <!-- input 输入框-->
                <el-input
                  v-if="item.type === 'input'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                >
                  <template v-if="item.slots && item.slots.prepend" slot="prepend">
                    {{ item.slots.prepend }}
                  </template>
                  <template v-if="item.slots && item.slots.append" slot="append">
                    {{ item.slots.append }}
                  </template>
                </el-input>

                <!--radio & radio-button-->
                <el-radio-group
                  v-if="item.type === 'radio-group'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                >
                  <template v-if="item.mode === 'radio-button'">
                    <el-radio-button
                      v-for="(r, rIndex) in item.options"
                      :key="rIndex"
                      :label="r.attrs.value"
                      v-bind="r.attrs"
                      v-on="r.events"
                    >
                      {{ r.attrs.label }}
                    </el-radio-button>
                  </template>

                  <template v-else>
                    <el-radio
                      v-for="(r, rIndex) in item.options"
                      :key="rIndex"
                      :label="r.attrs.value"
                      v-bind="r.attrs"
                      v-on="r.events"
                    >
                      {{ r.attrs.label }}
                    </el-radio>
                  </template>
                </el-radio-group>

                <!-- checkbox & checkbox-button-->
                <el-checkbox-group
                  v-if="item.type === 'checkbox-group'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                >
                  <template v-if="item.mode === 'checkbox-button'">
                    <el-checkbox-button
                      v-for="(c, cIndex) in item.options"
                      :key="cIndex"
                      :label="c.attrs.value"
                      v-bind="c.attrs"
                      v-on="c.events"
                    >{{ c.attrs.label }}
                    </el-checkbox-button>
                  </template>

                  <template v-else>
                    <el-checkbox
                      v-for="(c, cIndex) in item.options"
                      :key="cIndex"
                      :label="c.attrs.value"
                      v-bind="c.attrs"
                      v-on="c.events"
                    >{{ c.attrs.label }}
                    </el-checkbox>
                  </template>
                </el-checkbox-group>

                <!--input-number-->
                <el-input-number
                  v-if="item.type === 'input-number'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--select-->
                <el-select
                  v-if="item.type === 'select'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                >
                  <template v-if="item.optionGroups && item.optionGroups.length > 0">
                    <el-option-group
                      v-for="(group, gIndex) in item.optionGroups"
                      :key="gIndex"
                      v-bind="group.attrs"
                    >
                      <el-option
                        v-for="(opt, oIndex) in group.options"
                        :key="'group.option.'+oIndex"
                        :label="opt.attrs.label"
                        :value="opt.attrs.value"
                        v-bind="opt.attrs"
                      />
                    </el-option-group>
                  </template>

                  <template v-if="item.options&& item.options.length > 0">
                    <el-option
                      v-for="(opt, oIndex) in item.options"
                      :key="'option.'+oIndex"
                      :label="opt.attrs.label"
                      :value="opt.attrs.value"
                      v-bind="opt.attrs"
                    />
                  </template>
                </el-select>

                <!--cascader-->
                <el-cascader
                  v-if="item.type === 'cascader'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--switch-->
                <el-switch
                  v-if="item.type === 'switch'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--slider-->
                <el-slider
                  v-if="item.type === 'slider'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--time-select-->
                <el-time-select
                  v-if="item.type === 'time-select'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--time-picker-->
                <el-time-picker
                  v-if="item.type === 'time-picker'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--date-picker-->
                <el-date-picker
                  v-if="item.type === 'date-picker'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--rate-->
                <el-rate
                  v-if="item.type === 'rate'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--color-picker-->
                <el-color-picker
                  v-if="item.type === 'color-picker'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--穿梭框-->
                <el-transfer
                  v-if="item.type === 'transfer'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

<!--                <product-sku-management-->
<!--                  v-if="item.type === 'product-sku-management'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;产品 SKU 编辑&ndash;&gt;-->
<!--                <product-sku-edit-->
<!--                  v-if="item.type === 'product-sku-edit'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;产品套装编辑&ndash;&gt;-->
<!--                <product-suit-config-->
<!--                  v-if="item.type === 'product-suit-config'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;产品库存和售价编辑&ndash;&gt;-->
<!--                <product-sku-inventory-price-->
<!--                  v-if="item.type === 'product-sku-inventory-price'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;upload&ndash;&gt;-->
                <upload-avatar
                  v-if="item.type === 'upload-avatar'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

<!--                &lt;!&ndash;上传文件&ndash;&gt;-->
<!--                <upload-file-->
<!--                  v-if="item.type === 'upload-file'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

                <!--上传图片-->
                <upload-image
                  v-if="item.type === 'upload-image'"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

<!--                &lt;!&ndash;上传多张图片&ndash;&gt;-->
<!--                <upload-images-->
<!--                  v-if="item.type === 'upload-images'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;富文本编辑器&ndash;&gt;-->
<!--                <rich-editor-->
<!--                  v-if="item.type === 'rich-editor'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

                <!--通过接口获取远程两级的分类-->
                <remote-group-select
                  v-if="item.type === 'remote-select' && item.attrs.hasOwnProperty('group')"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

                <!--通过接口获取远程一级分类-->
                <remote-select
                  v-if="item.type === 'remote-select' && !item.attrs.hasOwnProperty('group')"
                  :ref="item.prop"
                  v-model="formData[item.prop]"
                  v-bind="item.attrs"
                  v-on="item.events"
                />

<!--                &lt;!&ndash;通过搜索获取远程列表&ndash;&gt;-->
<!--                <remote-search-select-->
<!--                  v-if="item.type === 'remote-search-select' && !item.attrs.hasOwnProperty('group')"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择列表选择框&ndash;&gt;-->
<!--                <button-dialog-panel-list-select-->
<!--                  v-if="item.type === 'button-dialog-panel-list-select'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;用户选择框&ndash;&gt;-->
<!--                <button-dialog-select-user-->
<!--                  v-if="item.type === 'button-dialog-select-user'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;用户微信选择框&ndash;&gt;-->
<!--                <button-dialog-select-user-wechat-->
<!--                  v-if="item.type === 'button-dialog-select-user-wechat'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择腾讯地图&ndash;&gt;-->
<!--                <qq-map-select-->
<!--                  v-if="item.type === 'qq-map-select'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;带按钮的选择腾讯地图&ndash;&gt;-->
<!--                <button-dialog-qq-map-select-->
<!--                  v-if="item.type === 'button-dialog-qq-map-select'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;省市区&ndash;&gt;-->
<!--                <province-city-area-->
<!--                  v-if="item.type === 'province-city-area'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;合作方选择框&ndash;&gt;-->
<!--                <button-dialog-select-partner-->
<!--                  v-if="item.type === 'button-dialog-select-partner'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                <button-dialog-select-merchant-->
<!--                  v-if="item.type === 'button-dialog-select-merchant'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;产品选择框&ndash;&gt;-->
<!--                <button-dialog-select-product-->
<!--                  v-if="item.type === 'button-dialog-select-product'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择城市&ndash;&gt;-->
<!--                <remote-cascader-->
<!--                  v-if="item.type === 'remote-cascader'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择商品并展示出来&ndash;&gt;-->
<!--                <panel-select-product-sku-->
<!--                  v-if="item.type === 'panel-select-product-sku'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;梯队设置组件&ndash;&gt;-->
<!--                <multi-echelon-setting-->
<!--                  v-if="item.type === 'multi-echelon-setting'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择会员卡模板&ndash;&gt;-->
<!--                <button-dialog-select-member-card-template-->
<!--                  v-if="item.type === 'button-dialog-select-member-card-template'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择会员卡&ndash;&gt;-->
<!--                <button-dialog-select-member-card-->
<!--                  v-if="item.type === 'button-dialog-select-member-card'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;存取酒产品展示出来&ndash;&gt;-->
<!--                <panel-wine-save-select-product-sku-->
<!--                  v-if="item.type === 'panel-wine-save-select-product-sku'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择工作人员账号&ndash;&gt;-->
<!--                <button-dialog-select-staff-->
<!--                  v-if="item.type === 'button-dialog-select-staff'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择赠送人&ndash;&gt;-->
<!--                <button-dialog-select-giving-staff-->
<!--                  v-if="item.type === 'button-dialog-select-giving-staff'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择台位&ndash;&gt;-->
<!--                <button-dialog-select-desk-->
<!--                  v-if="item.type === 'button-dialog-select-desk'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择开台记录&ndash;&gt;-->
<!--                <button-dialog-select-desk-open-->
<!--                  v-if="item.type === 'button-dialog-select-desk-open'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择分区台号&ndash;&gt;-->
<!--                <button-dialog-select-reserve-zone-desk-->
<!--                  v-if="item.type === 'button-dialog-select-reserve-zone-desk'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择商品和套餐并展示出来&ndash;&gt;-->
<!--                <panel-select-product-sku-package-->
<!--                  v-if="item.type === 'panel-select-product-sku-package'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择打印机&ndash;&gt;-->
<!--                <panel-dialog-select-printer-->
<!--                  v-if="item.type === 'panel-dialog-select-printer'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择部门&ndash;&gt;-->
<!--                <button-dialog-select-department-->
<!--                  v-if="item.type === 'button-dialog-select-department'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择存酒卡&ndash;&gt;-->
<!--                <button-dialog-select-wine-card-->
<!--                  v-if="item.type === 'button-dialog-select-wine-card'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择打印机&ndash;&gt;-->
<!--                <button-dialog-select-printer-->
<!--                  v-if="item.type === 'button-dialog-select-printer'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;在线搜图和选图&ndash;&gt;-->
<!--                <button-dialog-select-search-image-->
<!--                  v-if="item.type === 'button-dialog-select-search-image'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择抖音号&ndash;&gt;-->
<!--                <button-dialog-select-douyin-account-->
<!--                  v-if="item.type === 'button-dialog-select-douyin-account'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择关键字&ndash;&gt;-->
<!--                <button-dialog-select-keyword-->
<!--                  v-if="item.type === 'button-dialog-select-keyword'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择权限&ndash;&gt;-->
<!--                <select-permission-->
<!--                  v-if="item.type === 'select-permission'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择手机端权限&ndash;&gt;-->
<!--                <select-mobile-permission-->
<!--                  v-if="item.type === 'select-mobile-permission'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;配置部门和开台费的面板&ndash;&gt;-->
<!--                <panel-config-desk-open-fee-scheme-->
<!--                  v-if="item.type === 'panel-config-desk-open-fee-scheme'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;多选台号的穿梭框&ndash;&gt;-->
<!--                <select-desks-transfer-->
<!--                  v-if="item.type === 'select-desks-transfer'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择订单商品&ndash;&gt;-->
<!--                <panel-select-order-product-sku-->
<!--                  v-if="item.type === 'panel-select-order-product-sku'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;配置短信参数&ndash;&gt;-->
<!--                <panel-config-sms-params-->
<!--                  v-if="item.type === 'panel-config-sms-params'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 仓库商品管理 &ndash;&gt;-->
<!--                <warehouse-product-sku-management-->
<!--                  v-if="item.type === 'warehouse-product-sku-management'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;仓库商品售价&进货价&ndash;&gt;-->
<!--                <warehouse-product-sku-price-->
<!--                  v-if="item.type === 'warehouse-product-sku-price'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;修改商品&ndash;&gt;-->
<!--                <warehouse-product-sku-edit-->
<!--                  v-if="item.type === 'warehouse-product-sku-edit'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;入库单表格&ndash;&gt;-->
<!--                <warehouse-product-sku-inbound-->
<!--                  v-if="item.type === 'warehouse-product-sku-inbound'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;选择仓库商品&ndash;&gt;-->
<!--                <warehouse-dialog-select-product-sku-->
<!--                  v-if="item.type === 'warehouse-dialog-select-product-sku'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 选择指定类型的仓库的商品&ndash;&gt;-->
<!--                <panel-select-warehouse-product-->
<!--                  v-if="item.type === 'panel-select-warehouse-product'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash;   从开台记录和订单中筛选手机号 &ndash;&gt;-->
<!--                <input-search-desk-open-phone-->
<!--                  v-if="item.type === 'input-search-desk-open-phone'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 配置限制时间范围 &ndash;&gt;-->
<!--                <panel-config-multi-time-range-->
<!--                  v-if="item.type === 'panel-config-multi-time-range'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 设置规格商品状态 &ndash;&gt;-->
<!--                <set-product-sku-status-->
<!--                  v-if="item.type === 'set-product-sku-status'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 侧边选择 &ndash;&gt;-->
<!--                <side-select-->
<!--                  v-if="item.type === 'side-select'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 新建短信激活任务-选择顾客 &ndash;&gt;-->
<!--&lt;!&ndash;                <button-dialog-select-sms-user&ndash;&gt;-->
<!--&lt;!&ndash;                  v-if="item.type === 'button-dialog-select-sms-user'"&ndash;&gt;-->
<!--&lt;!&ndash;                  :ref="item.prop"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-model="formData[item.prop]"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-bind="item.attrs"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-on="item.events"&ndash;&gt;-->
<!--&lt;!&ndash;                />&ndash;&gt;-->

<!--                &lt;!&ndash; 线下支付方式 &ndash;&gt;-->
<!--                <offline-pay-methods-->
<!--                  v-if="item.type === 'offline-pay-methods'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 线下充值金额输入 &ndash;&gt;-->
<!--                <offline-recharge-input-->
<!--                  v-if="item.type === 'offline-recharge-input'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 业绩类型选择酒水商品 &ndash;&gt;-->
<!--                <performance-dialog-select-product-package-->
<!--                  v-if="item.type === 'performance-dialog-select-product-package'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 提成方案自定义配置占比 &ndash;&gt;-->
<!--&lt;!&ndash;                <multi-echelon-commission-setting&ndash;&gt;-->
<!--&lt;!&ndash;                  v-if="item.type === 'multi-echelon-commission-setting'"&ndash;&gt;-->
<!--&lt;!&ndash;                  :ref="item.prop"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-model="formData[item.prop]"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-bind="item.attrs"&ndash;&gt;-->
<!--&lt;!&ndash;                  v-on="item.events"&ndash;&gt;-->
<!--&lt;!&ndash;                />&ndash;&gt;-->

<!--                &lt;!&ndash; 区间选择 &ndash;&gt;-->
<!--                <multi-ranges-setting-->
<!--                  v-if="item.type === 'multi-ranges-setting'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 评论回复输入框 &ndash;&gt;-->
<!--                <reply-area-->
<!--                  v-if="item.type === 'reply-area'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->

<!--                &lt;!&ndash; 选择优惠券模板面板 &ndash;&gt;-->
<!--                <panel-select-voucher-template-->
<!--                  v-if="item.type === 'panel-select-voucher-template'"-->
<!--                  :ref="item.prop"-->
<!--                  v-model="formData[item.prop]"-->
<!--                  v-bind="item.attrs"-->
<!--                  v-on="item.events"-->
<!--                />-->
                <template v-for="(componentName, componentIndex) in componentNames">
                  <component
                    :is="componentName"
                    v-if="item.type === componentName"
                    :key="componentIndex"
                    :ref="item.prop"
                    v-model="formData[item.prop]"
                    v-bind="item.attrs"
                    v-on="item.events"
                  />
                </template>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </template>

    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
import UploadAvatar from './components/UploadAvatar'
import UploadImage from './components/UploadImage/index'
// import UploadImages from './components/UploadImages/index'
// import RichEditor from './components/RichEditor/index'
import RemoteGroupSelect from './components/RemoteGroupSelect/index'
import RemoteSelect from './components/RemoteSelect/index'
// import ProvinceCityArea from './components/ProvinceCityArea/index'
// import UploadFile from './components/UploadFile/index'
// import RemoteSearchSelect from './components/RemoteSearchSelect/index'
// import RemoteCascader from './components/RemoteCascader'
// import QqMapSelect from './components/QQMapSelect/index'
// import ButtonDialogQqMapSelect from './components/ButtonDialogQQMapSelect/index'
// import OfflinePayMethods from '@/components/EasyUI/EasyForm/bizs/OfflinePayMethods'
// import MultiEchelonCommissionSetting from '@/views/system/scheme-commission/component/multiEchelonCommissionSetting/index'

export default {
  name: 'EasyForm',
  components: {
    // OfflinePayMethods,
    UploadAvatar,
    UploadImage,
    // UploadImages,
    // RichEditor,
    RemoteGroupSelect,
    RemoteSelect
    // ProvinceCityArea,
    // UploadFile,
    // RemoteSearchSelect,
    // RemoteCascader: RemoteCascader,
    // QqMapSelect,
    // ButtonDialogQqMapSelect,
    // OfflineRechargeInput: () => import('./bizs/OfflineRechargeInput'),
    // MultiRangesSetting: () => import('./bizs/MultiRangesSetting'),
    // ButtonDialogPanelListSelect: () => import('../ButtonDialogPanelListSelect'),
    // ButtonDialogSelectUser: () => import('./bizs/ButtonDialogSelectUser'),
    // ButtonDialogSelectUserWechat: () => import('./bizs/ButtonDialogSelectUserWechat'),
    // ButtonDialogSelectPartner: () => import('./bizs/ButtonDialogSelectPartner'),
    // ButtonDialogSelectMerchant: () => import('./bizs/ButtonDialogSelectMerchant'),
    // ButtonDialogSelectProduct: () => import('./bizs/ButtonDialogSelectProduct'),
    // ProductSkuManagement: () => import('./bizs/ProductSkuManagement'),
    // ProductSkuEdit: () => import('./bizs/ProductSkuEdit'),
    // ProductSuitConfig: () => import('./bizs/ProductSuitConfig'),
    // ProductSkuInventoryPrice: () => import('./bizs/ProductSkuInventoryPrice'),
    // PanelSelectProductSku: () => import('./bizs/PanelSelectProductSku'),
    // PanelSelectOrderProductSku: () => import('./bizs/PanelSelectOrderProductSku'),
    // MultiEchelonSetting: () => import('./bizs/MultiEchelonSetting'),
    // ButtonDialogSelectMemberCardTemplate: () => import('./bizs/ButtonDialogSelectMemberCardTemplate'),
    // ButtonDialogSelectMemberCard: () => import('./bizs/ButtonDialogSelectMemberCard'),
    // PanelWineSaveSelectProductSku: () => import('./bizs/PanelWineSaveSelectProductSku'),
    // ButtonDialogSelectStaff: () => import('./bizs/ButtonDialogSelectStaff'),
    // ButtonDialogSelectGivingStaff: () => import('./bizs/ButtonDialogSelectGivingStaff'),
    // ButtonDialogSelectDesk: () => import('./bizs/ButtonDialogSelectDesk'),
    // ButtonDialogSelectDeskOpen: () => import('./bizs/ButtonDialogSelectDeskOpen'),
    // ButtonDialogSelectReserveZoneDesk: () => import('./bizs/ButtonDialogSelectReserveZoneDesk'),
    // PanelSelectProductSkuPackage: () => import('./bizs/PanelSelectProductSkuPackage'),
    // PanelDialogSelectPrinter: () => import('./bizs/PanelDialogSelectPrinter'),
    // ButtonDialogSelectDepartment: () => import('./bizs/ButtonDialogSelectDepartment'),
    // ButtonDialogSelectWineCard: () => import('./bizs/ButtonDialogSelectWineCard'),
    // ButtonDialogSelectPrinter: () => import('./bizs/ButtonDialogSelectPrinter'),
    // ButtonDialogSelectDouyinAccount: () => import('./bizs/ButtonDialogSelectDouyinAccount'),
    // ButtonDialogSelectKeyword: () => import('./bizs/ButtonDialogSelectKeyword'),
    // ButtonDialogSelectSearchImage: () => import('./components/ButtonDialogSelectSearchImage'),
    // SelectPermission: () => import('./bizs/SelectPermission'),
    // SelectMobilePermission: () => import('./bizs/SelectMobilePermission'),
    // PanelConfigDeskOpenFeeScheme: () => import('./bizs/PanelConfigDeskOpenFeeScheme'),
    // SelectDesksTransfer: () => import('./bizs/SelectDesksTransfer'),
    // PanelConfigSmsParams: () => import('./bizs/PanelConfigSmsParams'),
    // PanelConfigMultiTimeRange: () => import('./bizs/PanelConfigMultiTimeRange'),
    // SetProductSkuStatus: () => import('./bizs/SetProductSkuStatus'),
    // ReplyArea: () => import('./components/ReplyArea'),
    // PanelSelectVoucherTemplate: () => import('./bizs/PanelSelectVoucherTemplate'),
    //
    // // 仓库管理
    // WarehouseProductSkuManagement: () => import('./bizs/WarehouseManage/WarehouseProductSkuManagement'),
    // WarehouseProductSkuPrice: () => import('./bizs/WarehouseManage/WarehouseProductSkuPrice'),
    // WarehouseProductSkuEdit: () => import('./bizs/WarehouseManage/WarehouseProductSkuEdit'),
    // WarehouseProductSkuInbound: () => import('./bizs/WarehouseManage/WarehouseProductSkuInbound'),
    // WarehouseDialogSelectProductSku: () => import('./bizs/WarehouseManage/WarehouseDialogSelectProductSku'),
    // PanelSelectWarehouseProduct: () => import('./bizs/PanelSelectWarehouseProduct'),
    // SideSelect: () => import('./bizs/SideSelect'),
    //
    // InputSearchDeskOpenPhone: () => import('./bizs/InputSearchDeskOpenPhone'),
    //
    // // 业绩类型选择商品
    // PerformanceDialogSelectProductPackage: () => import('./bizs/Performance/PerformanceDialogSelectProductPackage')

    // 短信营销选择顾客
    // ButtonDialogSelectSmsUser: () => import('@/views/marketing/sms/components/ButtonDialogSelectSmsUser')
  },
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
       * form 配置
       */
    options: {
      type: Object,
      default: () => {
        return {
          title: 'Group Title',
          form: {
            labelPosition: 'right'
          },
          rows: [
            {
              gutter: 15,
              col: { span: 6 },
              items: [{}]
            }
          ]

        }
      }
    }
  },
  data () {
    return {
      formattedOptions: {
        title: '',
        form: {},
        rows: []
      },

      formData: {},

      /**
         * 表单默认值
         */
      defaultFormData: {},

      componentNames: []
    }
  },

  /**
     * 监听值变更
     */
  watch: {
    /**
       * 监听表单值参数是否变更
       */
    formData: {
      handler (val) {
        // emit input 事件，实现组件 v-model 指令
        this.$emit('input', val)

        // 判断表单元素的依赖，显示 or 隐藏
        this.judgeItemShows()
      },

      deep: true
    },
    /*
            * 监听父组件传递的form 配置是否变更
            * */
    options: {
      handler (val) {
        // 重置表单
        this.initValue()
        // console.log('监听父组件传递的form 配置是否变更', val)
      },
      deep: true
    }
  },

  created () {
    this.initValue()
    this.autoImport()
  },

  methods: {
    /**
     * 自动引入自定义组件
     */
    autoImport () {
      this._importComponents(require.context('./bizs-auto-import', true, /index.vue/))
    },

    /**
     * 引入组件
     * @param requireComponents
     * @private
     */
    _importComponents (requireComponents) {
      requireComponents.keys().forEach(fileName => {
        // 加载组件
        const reqCom = requireComponents(fileName)
        // 截取路径作为组件名，例如 ./ButtonDialogQqMapSelect/index.vue，截取 ButtonDialogQqMapSelect
        const reqComName = fileName.split('/').splice(-2)[0]
        // 保存组件名
        this.componentNames.push(reqComName)
        // 全局组件挂载
        Vue.component(reqComName, reqCom.default || reqCom)
      })
    },

    /**
       * 参数验证
       */
    validate (callback) {
      this.$nextTick(() => {
        if (!this.$refs['dataForm'] || !this.$refs['dataForm'].hasOwnProperty('validate')) {
          return
        }

        this.$refs['dataForm'].validate((valid) => {
          console.log('Easy form validate callback: ', valid, this.formData)
          callback && (typeof callback === 'function') && (callback({ valid: valid, data: this.formData }))
        })
      })
    },

    /**
       * 清除参数验证结果
       */
    clearValidate () {
      this.$nextTick(() => {
        if (!this.$refs['dataForm'] || !this.$refs['dataForm'].hasOwnProperty('validate')) {
          return
        }
        this.$refs['dataForm'].clearValidate()
      })
    },

    /**
       * 重置表单值
       */
    resetFormData (data) {
      this.$nextTick(() => {
        const tmpDefaultFormData = JSON.parse(JSON.stringify(this.defaultFormData))
        if (data) {
          this.formData = { ...tmpDefaultFormData }
          // this.formData = { ...tmpDefaultFormData, ...data }

          console.log('--> 默认值：', tmpDefaultFormData)
          // 设置重置的值
          this.options.rows.forEach((row, index) => {
            row.items.forEach((item) => {
              data.hasOwnProperty(item.prop) && (this.formData[item.prop] = data[item.prop])
            })
          })
        } else {
          this.formData = { ...tmpDefaultFormData }
        }
        console.log('resetFormData: ', data, this.defaultFormData, this.formData)

        // 特殊情况：设置富文本编辑器的输入框的值
        this.setRichEditorContent()
      })
    },

    /**
       * 根据表单的值，调用富文本编辑器的 setContent 设置输入框的值
       * 备注：特殊情况
       * 当值发生变更时，设置富文本编辑器的输入框中的值
       * 由于 Tinymce 编辑器组件 setContent()，光标会重置到最左侧
       * 目前没有太好的解决方案，所以选择：初始化 rich-editor 时，重置对应的值
       */
    setRichEditorContent () {
      this.options.rows.forEach((row, index) => {
        row.items.forEach((item) => {
          if (item.type !== 'rich-editor') {
            return
          }

          this.$nextTick(() => {
            if (this.$refs.hasOwnProperty(item.prop) &&
                this.$refs[item.prop] instanceof Array &&
                this.$refs[item.prop].length > 0) {
              this.$refs[item.prop][0].setContent(this.formData[item.prop])
            }
          })
        })
      })
    },

    /**
       * 重置表单的值
       */
    resetForm () {
      this.$nextTick(() => {
        this.initValue()
      })
    },

    /**
       * 初始化默认值
       */
    initValue () {
      // 1.1 设置默认值
      this.options.rows.forEach((row, index) => {
        row.items.forEach((item) => {
          // 1.1 如果指定了默认值，则直接使用默认值
          if (item.hasOwnProperty('defaultValue')) {
            item.value = item.defaultValue
            this.$set(this.formData, item.prop, item.value)
            return
          }

          // 2.1 未指定默认值，根据组件类型配置默认值
          switch (item.type) {
            case 'input':
            case 'radio-group':
            case 'time-select':
            case 'color-picker':
            case 'dialog-select-list':
              item.value = ''
              break

            case 'time-picker':
              if (item.attrs && item.attrs.isRange) {
                item.value = []
              } else {
                item.value = ''
              }
              break
            case 'date-picker':
              if (item.attrs && item.attrs.type === 'daterange') {
                item.value = []
              } else {
                item.value = ''
              }
              break

            case 'cascader':
            case 'checkbox-group':
            case 'upload-images':
            case 'province-city-area':
            case 'remote-cascader':
              item.value = []
              break

            case 'slider':
            case 'input-number':
            case 'rate':
              item.value = 0
              break

            case 'select':
              if (item.attrs && item.attrs.multiple) {
                item.value = []
              } else {
                item.value = ''
              }
              break

            case 'remote-select':
              if (item.attrs && item.attrs.multiple) {
                item.value = []
              } else {
                item.value = ''
              }
              break

            case 'remote-search-select':
              if (item.attrs && item.attrs.multiple) {
                item.value = []
              } else {
                item.value = ''
              }
              break

            case 'qq-map-select':
            case 'button-dialog-qq-map-select':
              item.value = {}
              break

            default:
              console.log('Unknown from type: ', item.type, ', set default value ""')
              item.value = ''
          }

          this.$set(this.formData, item.prop, item.value)
        })
      })

      this.formattedOptions = { ...this.options }
      // console.log('formattedOptions:', this.formattedOptions, this.formData)
      this.defaultFormData = JSON.parse(JSON.stringify(this.formData))

      // 2.1 判断每个元素是否显示
      this.judgeItemShows()
    },

    /**
       * 当值变更时，判断每个元素是否有依赖的元素需要更新为显示或者隐藏
       */
    judgeItemShows () {
      this.formattedOptions.rows.forEach((row, index) => {
        row.items.forEach((item, itemIndex) => {
          // 1. 如果没指定依赖的元素，则元素默认显示
          if (!item.hasOwnProperty('depends')) {
            item.show = true
            return
          }

          // 2.1 判断依赖的元素的值是否如 depends 中所配置
          let isShow = true
          for (let i = 0; i < item.depends.length; i++) {
            const dep = item.depends[i]
            if (!dep.hasOwnProperty('prop') || !dep.hasOwnProperty('value')) {
              continue
            }

            if (this.formData.hasOwnProperty(dep.prop) && typeof dep.value === 'function') {
              isShow = dep.value(this.formData[dep.prop])
              break
            }

            if (!this.formData.hasOwnProperty(dep.prop) || this.formData[dep.prop] !== dep.value) {
              isShow = false
              break
            }
          }

          item.show = isShow
          this.$set(this.formattedOptions, `rows[${index}]items[${itemIndex}].show`, isShow)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  // 标记框
  .sign-box {
    // padding: 10px 0 0;
    margin: 0 0 22px 0 !important;
    background-color: #f9f9f9;
    box-sizing: border-box;
    // .el-col {
    //   padding-left: 0px !important;
    // }
    .el-form-item {
      margin: 10px 0;
    }
  }

  .form-title {
    margin-bottom: 20px;
    font-size: 14px;
    margin-top: 10px;

    padding-left: 10px;
    border-left: 3px solid $color-theme;
    line-height: 1em;
  }

  .custom-label {
    display: inline-block;
    line-height: 1.6em;
  }

  .field-tip {
    display: inline-block;
    font-weight: normal;
    font-size: 13px;
    line-height: 1.6em;
    color: #999;
  }
</style>
