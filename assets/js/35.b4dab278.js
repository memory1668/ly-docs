(window.webpackJsonp=window.webpackJsonp||[]).push([[35],{347:function(t,r,e){"use strict";e.r(r);e(32);var n={data:function(){return{panelFormOptions:{form:{title:"添加商品",attrs:{labelPosition:"left"},rows:[{col:{span:24},items:[{type:"input",label:"售价",prop:"price",defaultValue:"",attrs:{placeholder:"请输入售价"},rules:[{trigger:"blur",validator:function(t,r,e){return""===r?e(new Error("请输入售价")):isNaN(Number(r))?e(new Error("售价请输入正确的数值")):parseFloat(r)<0?e(new Error("售价应大于0")):void e()}}]}]}]},buttons:{align:"right"}}}}},o=e(1),l=Object(o.a)(n,(function(){var t=this.$createElement;return(this._self._c||t)("panel-form",{attrs:{options:this.panelFormOptions}})}),[],!1,null,null,null);r.default=l.exports}}]);