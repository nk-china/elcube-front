
import moment from "moment";
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import VXETablePluginAntd from 'vxe-table-plugin-antd'

import NkFormat from "../utils/NkFormat";

function isBlank(value){
  return value === undefined || value === null || (typeof value === 'string' && value.replace(/\s/g, '') === '');

}

function getValue(obj,property){
  property.split(".").forEach(i=>{
    obj = obj[i];
  })
  return obj;
}

function setValue(obj,property,value){
  const props = property.split(".");
  for(let i=0;i<props.length-1;i++){
    if(!obj[props[i]]){
      obj[props[i]]={};
    }
    obj=obj[props[i]];
  }
  obj[props[props.length-1]]=value;
}

export default {
  install(Vue){

    Vue.prototype.$XModal = VXETable.modal

    VXETable.use(VXETablePluginAntd)
    Vue.use(VXETable)

    VXETable.setup({
      table:{
        autoResize:true
      }
    })

    // 自定义全局的格式化处理函数
    VXETable.formats.mixin({
      // 自定义的格式化
      nkMillisecondFriendly ({ cellValue }) {
        return NkFormat.nkMillisecondFriendly(cellValue)
      },
      nkDatetimeFriendly ({ cellValue }) {
        return NkFormat.nkDatetimeFriendly(cellValue)
      },
      nkCurrency ({ cellValue }) {
        return NkFormat.nkCurrency(cellValue)
      },
      nkPercent ({ cellValue }) {
        return NkFormat.nkPercent(cellValue)
      },
      nkDatetime ({ cellValue },format) {
        return NkFormat.nkDatetime(cellValue,format)
      },
      nkDatetimeISO ({ cellValue },format) {
        return NkFormat.nkDatetimeISO(cellValue,format)
      },
      nkNull({cellValue},defaultValue){
        return cellValue || defaultValue;
      },
      nkFromList({cellValue},list,label,value){
        return NkFormat.nkFromList(cellValue,list,label,value)
      },
      // 格式化性别
      formatSex ({ cellValue }) {
        return cellValue ? (cellValue === '1' ? '男' : '女') : ''
      },
      // 格式化下拉选项
      formatSelect ({ cellValue }, list) {
        const item = list.find(item => item.value === cellValue)
        return item ? item.label : ''
      },
      // 格式化日期，默认 yyyy-MM-dd HH:mm:ss
      formatDate ({ cellValue }, format) {
        return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
      },
      // 格式金额，默认2位数
      formatAmount ({ cellValue }, digits) {
        return XEUtils.commafy(cellValue, { digits: digits || 2 })
      },
      // 格式化银行卡，默认每4位隔开
      formatBankcard ({ cellValue }) {
        return XEUtils.commafy(cellValue, { spaceNumber: 4, separator: ' ' })
      },
      // 四舍五入,默认两位数
      formatFixedNumber ({ cellValue }, digits) {
        return XEUtils.toNumber(cellValue).toFixed(digits || 2)
      },
      // 截取小数,默认两位数
      formatCutNumber ({ cellValue }, digits) {
        return XEUtils.toFixedString(cellValue, digits || 2)
      },
      // 截取小数,默认两位数
      formatPercent ({ cellValue }, digits) {
        if(cellValue){
          return Number(cellValue * 100).toFixed(digits || 2)  + '%'
          // return XEUtils.toFixedString(cellValue * 100, digits || 2) + '%'
        }
        return cellValue
      },
      docLink({cellValue,row} , docIdKey, linkName){
        return `<a href='#/apps/docs/detail/${row[docIdKey||'docId']}'>${cellValue||linkName||'查看'}</a>`;
      },
      // 转换 moment 类型为字符串
      toMomentString ({ cellValue }, format) {
        return cellValue ? cellValue.format(format) : ''
      }
    });

    // 创建一个简单输入框渲染
    VXETable.renderer.add('nkNumber', {
      // 可编辑激活模板
      renderEdit (h, renderOpts,renderParams) {
        const {row,column} = renderParams;
        let value = getValue(row,column.property);
        let props = Object.assign({value:renderOpts.props.percent?value*100:value},renderOpts.props);
        return [
          h('vxe-input',{
            props,
            on:{
              input:(e)=>{
                console.log(e)
                const value = Math.round(e.value*Math.pow(10,props.digits||0))/Math.pow(10,props.digits||0);
                setValue(row,column.property,props.percent?(value/100):value)
                if(renderOpts.events&&renderOpts.events.change){
                  renderOpts.events.change(renderParams);
                }
              },
              blur:(e)=>{
                renderOpts.events&&renderOpts.events.blur&&renderOpts.events.blur(renderParams,e)
              },
              "prev-number":(e)=>{
                renderOpts.events&&renderOpts.events.prevNumber&&renderOpts.events.prevNumber(renderParams,e)
              },
              "next-number":(e)=>{
                renderOpts.events&&renderOpts.events.nextNumber&&renderOpts.events.nextNumber(renderParams,e)
              }
            }
          })
        ]
      }
    })
    VXETable.renderer.add('nkDate', {
      // 可编辑激活模板
      renderEdit (h, renderOpts,renderParams) {

        const {row,column} = renderParams;
        let value = getValue(row,column.property);
        let props = Object.assign({
          value:!isBlank(value)?moment(value*1000).format('YYYY-MM-DD'):undefined,
          transfer:true
        },renderOpts.props);
        return [
          h('vxe-input',{
            props,
            on:{
              input:(e)=>{
                setValue(row,column.property,!isBlank(e.value)?moment(e.value,'YYYY-MM-DD').unix():undefined);
                if(renderOpts.events&&renderOpts.events.change){
                  renderOpts.events.change(renderParams,e);
                }
              }
            },
            blur:(e)=>{
              renderOpts.events&&renderOpts.events.blur&&renderOpts.events.blur(renderParams,e)
            }
          })
        ]
      }
    })
    VXETable.renderer.add('nkDateTime', {
      // 可编辑激活模板
      renderEdit (h, renderOpts,renderParams) {

        const {row,column} = renderParams;
        let value = getValue(row,column.property);
        let props = Object.assign({
          value:!isBlank(value)?moment(value*1000).format('YYYY-MM-DD HH:mm:ss'):undefined,
          transfer:true
        },renderOpts.props);
        return [
          h('vxe-input',{
            props,
            on:{
              input:(e)=>{
                setValue(row,column.property,!isBlank(e.value)?moment(e.value,'YYYY-MM-DD HH:mm:ss').unix():undefined);
                if(renderOpts.events&&renderOpts.events.change){
                  renderOpts.events.change(renderParams,e);
                }
              }
            },
            blur:(e)=>{
              renderOpts.events&&renderOpts.events.blur&&renderOpts.events.blur(renderParams,e)
            }
          })
        ]
      }
    })
  }
}
