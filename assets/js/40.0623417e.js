(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{352:function(a,t,n){"use strict";n.r(t);var o={data:function(){return{tableData:{column:[{prop:"id",label:"ID"},{prop:"name",label:"姓名"},{prop:"amount1",label:"数值1",sortable:!0},{prop:"amount2",label:"数值2",sortable:!0},{prop:"amount3",label:"数值3",sortable:!0}],data:[{id:"12987122",name:"王小虎",amount1:"234",amount2:"3",amount3:10},{id:"12987123",name:"王小虎",amount1:"165",amount2:"4",amount3:12},{id:"12987124",name:"王小虎",amount1:"324",amount2:"1",amount3:9},{id:"12987125",name:"王小虎",amount1:"621",amount2:"2",amount3:17},{id:"12987126",name:"王小虎",amount1:"539",amount2:"4",amount3:15}]}}},methods:{arraySpanMethod:function(a){a.row,a.column;var t=a.rowIndex,n=a.columnIndex;if(t%2==0){if(0===n)return[1,2];if(1===n)return[0,0]}},objectSpanMethod:function(a){a.row,a.column;var t=a.rowIndex;if(0===a.columnIndex)return t%2==0?{rowspan:2,colspan:1}:{rowspan:0,colspan:0}}}},e=n(1),l=Object(e.a)(o,(function(){var a=this.$createElement,t=this._self._c||a;return t("div",[t("lb-table",{attrs:{column:this.tableData.column,data:this.tableData.data,"span-method":this.arraySpanMethod,border:""}}),this._v(" "),t("lb-table",{staticStyle:{"margin-top":"20px"},attrs:{column:this.tableData.column,data:this.tableData.data,"span-method":this.objectSpanMethod,border:""}})],1)}),[],!1,null,null,null);t.default=l.exports}}]);