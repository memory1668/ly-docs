---
sidebar: auto
---
# 使用示例 

## 基本使用 

### 基础表单
包括各种表单项，比如输入框、选择器、开关、单选框、多选框等。所有表单项

<demo-block>
<example-zh-form-basis-form slot="source"></example-zh-form-basis-form>
  通过配置生成表单，只传入一个`options`属性。`title`指定表单左上角标题；`type`指定表单项的类型，可以是element的表单组件，也可以是自定义组件；`label`指定表单项标签名；`prop`指定表单提交时的字段名；`defaultValue`指定表单项的初始值。

<<< @/docs/.vuepress/components/example/zh/form/basis-form.vue
</demo-block>

### 传入属性 
演示如何传入element表单组件的属性

<demo-block>
<example-zh-form-form-element-attrs slot="source"></example-zh-form-form-element-attrs>
  element的表单组件有很多属性，如输入框的placeholder属性可以设置输入框占位文本，可以通过表单项配置的`attrs`传入这些element表单组件属性。

<<< @/docs/.vuepress/components/example/zh/form/form-element-attrs.vue
</demo-block>

### 提交按钮 
设置提交按钮的样式和功能

<demo-block>
<example-zh-form-form-submit-button slot="source"></example-zh-form-form-submit-button>
  通过`buttons`配置表单底部的按钮，`align`指定按钮的对齐方式，默认值是`left`，可选值是`right`和`center`。按钮一共有3种类型, 确认按钮、取消按钮和自定义按钮，分别通过`buttons`中的`submit`、`cancel`和`custom`控制。

<<< @/docs/.vuepress/components/example/zh/form/form-submit-button.vue
</demo-block>

按钮confirm、cancel和custom的属性
|  参数   | 说明  | 类型 | 可选值 | 默认值
|  :----  | :----  | :----  | :----  | :---- |
| text  | 按钮文本 | string | - | - |
| show  | 是否显示按钮| boolean | - | false |
| type  | 类型 | string | primary / success / warning / danger / info / text | - |
| round  | 是否圆角按钮 | boolean | - | false |
| plain  | 是否朴素按钮 | boolean | - | false |
| icon  | 图标类名 | string | - | - |

### 表单布局
表单使用element的[栅格布局](https://element.eleme.cn/#/zh-CN/component/layout)

<demo-block>
<example-zh-form-form-layout slot="source"></example-zh-form-form-layout>
  通过配置表单项占据的列数来控制每一行要显示的数量，一行显示不下会自动换行。

<<< @/docs/.vuepress/components/example/zh/form/form-layout.vue
</demo-block>

### 标签位置 
设置表单项标签的位置

<demo-block>
<example-zh-form-form-label-position slot="source"></example-zh-form-form-label-position>
  通过设置 `labelPosition` 属性可以改变标签的位置，默认值是`right`，可选值为 `top`、`left`

<<< @/docs/.vuepress/components/example/zh/form/form-label-position.vue
</demo-block>

### 标签宽度
设置表单项标签的宽度

<demo-block>
<example-zh-form-form-label-width slot="source"></example-zh-form-form-label-width>
  通过`labelWidth`属性可控制标签的宽度，如`90px`, 默认值是`90px`, 支持`auto`。可为所有的表单项设置相同的标签宽度，也可以为每一个表单项设置不同的标签宽度（优先级高）。

<<< @/docs/.vuepress/components/example/zh/form/form-label-width.vue
</demo-block>

### 表单提示 
说明表单项的作用或者注意事项。

<demo-block>
<example-zh-form-form-tip slot="source"></example-zh-form-form-tip>
   只需在表单项配置`tip`，值是提示的内容。

<<< @/docs/.vuepress/components/example/zh/form/form-tip.vue {23}
</demo-block>

### 表单校验 
在防止用户犯错的前提下，尽可能让用户更早地发现并纠正错误。

<demo-block>
<example-zh-form-form-validate slot="source"></example-zh-form-form-validate>
  通过`rules`传入表单项的校验规则，包括了常见的校验场景，如非空校验，长度校验，验证手机、email等。复杂的校验场景可以通过传入`validator`实现。

<<< @/docs/.vuepress/components/example/zh/form/form-validate.vue
</demo-block>

校验规则对象参数说明
|  参数   | 说明  | 类型 | 可选值 | 默认值
|  :----  | :----  | :----  | :----  | :---- |
| required  | 非空验证，设置为true时, 表单项前面会显示红色星号 | boolean | true/false | false |
| message  | 未通过校验的提示信息| string/html | - | - |
| type  | 数据格式 | string | string / number / 见下表 | - |
| pattern  | 正则表达式 | regexp | - | - |
| min/max  | 通常对数字大小范围做校验。对于字符串和数组类型，将根据长度进行比较 | number | - | - |
| len  | 长度验证 | number | - | - |
| enum  | 枚举值验证 | array | - | - |
| whitespace  | 验证是否只有空格(如果没有该配置，则全空格的输入值也是有效的） | boolean | true/false | false |
| transform  | 校验时先转换 | function | - | - |
| fields  | 深层嵌套规则，用于校验对象或数组，为对象属性或者数组项设置校验规则 | object | - | - |
| validator  | 自定义校验规则 | function | - | - |

所有支持校验的数据类型
|  类型   | 说明  |
|  :----  | :----  |
| string  | 字符串类型（默认值） |
| number  | 数字类型|
| boolean  | 布尔类型 |
| method  | 函数类型 |
| regexp  | 正则表达式 |
| integer  | 整型 |
| float  | 双精度浮点型数字 |
| array  | 数组类型 |
| object  | 对象类型 |
| enum  | 枚举值 |
| date  |  日期格式 |
| url  |  网址格式 |
| hex  |  16进制数字 |
| email  |  电子邮箱格式 |
| any  |  任意类型 |

需要注意的是使用fields校验对象或者数组时，顶层规则也要配置message才触发非空校验。
```js {7}
{
    type: 'panel-select-change-desk-zone-desk', label: '选择台号', prop: 'desk_config', defaultValue: null,
    attrs: { placeholder: '请选择台号', deskOpenId: this.desk ? this.desk.current_desk_open_id : '' },
    rules: [{
        type: 'object',
        required: true, 
        message: '请选择台号', 
        trigger: 'change',
        fields: {
          to_desk_id: { type: 'string', required: true, message: '请选择台号' }
        }
    }]
}
```
通过`require`、`type`等参数，可以很容易实现表单校验，一些复杂的场景或者自定义表单可以通过`validator`校验。

<demo-block>
<example-zh-form-form-validator slot="source"></example-zh-form-form-validator>
注意保证callback调用一次

<<< @/docs/.vuepress/components/example/zh/form/form-validator.vue
</demo-block>

::: warning
自定义表单组件修改组件值后不触发validator，原因未知。
:::

### 事件监听
单独监听表单项的事件。

<demo-block>
<example-zh-form-form-event slot="source"></example-zh-form-form-event>
   配置`events`监听表单项的事件，可监听多个事件。

<<< @/docs/.vuepress/components/example/zh/form/form-event.vue {27-31}
</demo-block>

### 表单依赖 
表单项的显示可以依赖其他表单项。

<demo-block>
<example-zh-form-form-depend slot="source"></example-zh-form-form-depend>
   配置`depends`数组控制当前表单项满足特定条件才显示。

<<< @/docs/.vuepress/components/example/zh/form/form-depend.vue {39-40}
</demo-block>

### 表单提交
指定表单提交的url等相关配置。

<demo-block>
<example-zh-form-form-submit slot="source"></example-zh-form-form-submit>
   `scene`中可指定提交表单时请求的url、方法以及请求成功/失败后的回调。通过`formatter`可以在请求前格式化要提交的数据。

<<< @/docs/.vuepress/components/example/zh/form/form-submit.vue 
</demo-block>

::: warning
PanelForm组件有个BUG, 有些情况`formatter`需要在`request`配置`data`属性才会生效，具体情况是`formatter`没有原路返回`data`。
:::

### 获取表单值 
有时候我们需要在自定义表单项中获取其它表单项的值。如下面的例子展示，当输入手机号是员工的手机号（这里输入888888是员工手机），存酒人身份默认选中员工存酒且不可修改，此时存酒人身份选择组件就需要知道输入的手机号。

<demo-block>
<example-zh-form-form-watch-form slot="source"></example-zh-form-form-watch-form>
   配置`watchForm`以及在自定义表单组件中添加`watchForm方法`。`formatter`可以进行表单值的转换

<<< @/docs/.vuepress/components/example/zh/form/form-watch-form.vue
</demo-block>

radio-select-wine-save-role.vue中的`watchForm`方法:
```vue
watchForm (form) {
   if (form.phone_number === this.phone) {
      return
   }
   this.phone = form.phone_number
   this.checkHasRelatedStaff()
}
```

### 多表单
当表单项过多时，可以拆分成多个表单

<demo-block>
<example-zh-form-multiple-form slot="source"></example-zh-form-multiple-form>
   配置form改用forms，传入多个表单配置组成的数组

<<< @/docs/.vuepress/components/example/zh/form/multiple-form.vue
</demo-block>

## 通用表单项

### Input输入框
通过鼠标或键盘输入字符

<demo-block>
<example-zh-form-form-item-form-item-input slot="source"></example-zh-form-form-item-form-item-input>

<<< @/docs/.vuepress/components/example/zh/form/form-item/form-item-input.vue
</demo-block>

### InputNumber 计数器
仅允许输入标准的数字值，可定义范围

<demo-block>
<example-zh-form-form-item-form-item-input-number slot="source"></example-zh-form-form-item-form-item-input-number>

<<< @/docs/.vuepress/components/example/zh/form/form-item/form-item-input-number.vue
</demo-block>

### Radio单选框
由于选项默认可见，不宜过多，若选项过多，建议使用 Select 选择器。

<demo-block>
<example-zh-form-form-item-form-item-radio slot="source"></example-zh-form-form-item-form-item-radio>

<<< @/docs/.vuepress/components/example/zh/form/form-item/form-item-radio.vue
</demo-block>

::: warning
`size`属性只对带边框或按钮形式的单选框有效
:::

### Checkbox 多选框
一组备选项中进行多选

<demo-block>
<example-zh-form-form-item-form-item-checkbox slot="source"></example-zh-form-form-item-form-item-checkbox>

<<< @/docs/.vuepress/components/example/zh/form/form-item/form-item-checkbox.vue
</demo-block>

### Select 选择器
当选项过多时，使用下拉菜单展示并选择内容。

<demo-block>
<example-zh-form-form-item-form-item-select slot="source"></example-zh-form-form-item-form-item-select>

<<< @/docs/.vuepress/components/example/zh/form/form-item/form-item-select.vue
</demo-block>

### RemoteSelect远程选择 
选项数据从接口获取，输入关键字进行查找。

<demo-block>
<example-zh-form-form-item-form-item-remote-select slot="source"></example-zh-form-form-item-form-item-remote-select>
   选项数据从接口返回，`dataField`指定返回数据的哪个字段作为选项列表，默认是`list`。`labelField`指定选项的标签字段，`valueField`指定选项的值字段。
   配置`group`可开启分组，配置和`option`一样，此时`option.dataField`指定的是list中的哪个字段作为选项列表。

<<< @/docs/.vuepress/components/example/zh/form/form-item/form-item-remote-select.vue
</demo-block>

::: warning
分页接口注意设置一个较大的pagesize值，以保证获取到所有的选项。
::: 

### RemoteSearchSelect远程搜索选择
组件只在1处用过，暂不清楚具体用法

### Cascader 级联选择器
当一个数据集合有清晰的层级结构时，可通过级联选择器逐级查看并选择。

<demo-block>
<example-zh-form-form-item-form-item-cascader slot="source"></example-zh-form-form-item-form-item-cascader>

<<< @/docs/.vuepress/components/example/zh/form/form-item/form-item-cascader.vue
</demo-block>

## 和对话框结合

### 基础用法
在基础表单外面包裹一层对话框，常用于添加，修改数据。

<demo-block>
  <example-zh-form-form-with-dialog slot="source"></example-zh-form-form-with-dialog>
  <<< @/docs/.vuepress/components/example/zh/form/form-with-dialog.vue
</demo-block>

### 关闭后销毁 
关闭对话框后销毁所有表单组件。

<demo-block>
<example-zh-form-form-with-dialog-destroy-on-close slot="source"></example-zh-form-form-with-dialog-destroy-on-close>
   关闭对话框后，默认会重置表单的值为配置的`defaultValue`，但有些自定义表单组件内部需要判断表单是否重置，从而重置组件内部的数据，监听`defaultValue`不好判断时，可以通过配置dialog的`destroyOnClose`为true让所有表单组件在关闭对话框后销毁。

<<< @/docs/.vuepress/components/example/zh/form/form-with-dialog-destroy-on-close.vue
</demo-block>
