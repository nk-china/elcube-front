<!--
	This file is part of EAsis.
	EAsis is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	EAsis is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <a-range-picker v-if="mode==='range'"
                    :default-value="value&&[value[0]&&moment(value[0], 'YYYY-MM-DD'),value[1]&&moment(value[1], 'YYYY-MM-DD')]"
                    format="YYYY-MM-DD"
                    @change="change"></a-range-picker>
    <a-date-picker  v-else
                    :default-value="singleValue&&moment(singleValue, 'YYYY-MM-DD')"
                    format="YYYY-MM-DD"
                    @change="changeSingle"></a-date-picker>
</template>

<script>
import moment from 'moment'
export default {
    props:{
        value: {},
        mode:{
            type:String,
            default:'range'
        }
    },
    watch:{
        mode(){
            if(this.mode==='range'){
                if(!this.value){
                    this.$emit("input",[undefined,undefined]);
                }else if(!(this.value instanceof Array)){
                    this.$emit("input",[undefined,undefined]);
                }
            }else{
                if(this.value instanceof Array){
                    this.$emit("input",undefined);
                }
            }
        }
    },
    computed:{
        singleValue(){
            if(typeof this.value === 'string'){
                return this.value;
            }
            return undefined;
        }
    },
    methods:{
        moment,
        change(value){
            this.$emit("input",value[0]&&value[1]&&[moment(value[0]).format('YYYY-MM-DD'),moment(value[1]).format('YYYY-MM-DD')]);
        },
        changeSingle(value){
            this.$emit("input",value&&moment(value).format('YYYY-MM-DD'));
        }
    }
}
</script>

<style scoped>

</style>