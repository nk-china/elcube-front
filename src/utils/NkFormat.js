/*
 * 	This file is part of EAsis.
 *	EAsis is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	EAsis is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
 */
import moment from "moment";
import numeral from "numeral";

// load a locale
numeral.register('locale', 'zh', {
  delimiters: {
    thousands: ',',
    decimal: '.'
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  // ordinal : function (number) {
  //   return number === 1 ? 'er' : 'ème';
  // },
  currency: {
    symbol: '¥'
  }
});

// switch between locales
numeral.locale('zh');

export default {
  nkMillisecondFriendly(value) {
    return this.nkDatetimeFriendly(Math.floor(value?value/1000:value));
  },
  nkDatetimeFriendly(value) {
    if(!value)return '';

    if(typeof value==='number'){
      value = moment(value * 1000);
    }else{
      value = moment(value);
    }
    let now = moment();
    now.hour(23);
    now.second(59);
    now.minutes(59);
    now.millisecond(999);

    let diff = value.diff(now,'days')
    if(diff===0){
      return value.format('今天 HH:mm')
    }
    if(diff===-1){
      return value.format('昨天 HH:mm')
    }
    if(value.isSame(now,'year')){
      return value.format('M/D HH:mm')
    }
    return value.format('Y/M/D HH:mm')
  },
  nkDatetime(value,format){
    value = typeof value === 'number' ? moment(value * 1000):value;
    value = typeof value === 'string' ? moment(value):value;
    return value?value.format(format||'Y/M/D'):'';
  },
  nkDatetimeISO(value,format){
    return value||value===0?moment(value).format(format||'Y/M/D HH:mm:ss'):'';
  },
  nkCurrency(value){
    return value||value===0?numeral(value).format('$ 0,0.00'):'';
  },
  nkPercent(value,format){
    return value||value===0?numeral(value).format(format||'%0.00'):'';
  },
  nkNumber(value,format){
    return value||value===0?numeral(value).format(format||'0.00'):'';
  },
  nkFromList(value,list,listLabel,listValue){
    if(!list) return '';

    listLabel = listLabel||'label';
    listValue = listValue||'value';

    if(typeof value==='object'&&value[0]){
      return value.map(v=>{
        const item = list.find(i => i[listValue]===v)
        return item ? item[listLabel] : v;
      }).join(', ');
    }else{
      const item = list.find(i => i[listValue]===value)
      return item ? item[listLabel] : value;
    }
  }
}
