<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <vxe-input size="mini" :transfer="transfer"
               @blur="blur"
               @focus="focus"
               v-model="nkValue"
               :type="nkType"
               :disabled="disabled"
               :digits="digits"
               :step="step"
               :max="nkMax"
               :min="nkMin"
               @prev-number="prevNumber"
               @next-number="nextNumber"
               @change="change"></vxe-input>
</template>

<script>
import moment from "moment";
export default {
name: "NkVxeInput",
    props:{
        disabled:Boolean,
        type:String,
        digits:String,
        step:String,
        max:Number,
        min:Number,
        value:{},
        transfer:Boolean
    },
    data(){
        return{
            changed:false
        }
    },
    computed:{
        nkType(){
            return this.type==='percent'?'float':this.type;
        },
        nkValue:{
            get(){
                if(this.type==='percent'){
                    let value = this.value && this.value / 0.01;
                    if(isNaN(value)){
                        return value;
                    }
                    return parseFloat(value.toFixed(15));
                }else if(this.type==='date'){
                    return this.value && this.value / 0.001;
                }
                return this.value;
            },
            set(newValue){
                if(this.type==='percent'){
                    newValue  = newValue * 0.01;
                    newValue  = parseFloat(newValue.toFixed(17))
                }else if(this.type==='date'){
                    newValue  = moment(newValue,'YYYY-MM-DD').valueOf()/1000;
                }else{
                    newValue  = newValue&&parseFloat(newValue);
                }
                this.changed = this.value!==newValue;
                this.$emit("input",newValue);
            }
        },
        nkMax(){
            if(this.type==='percent'){
                return this.max && this.max / 0.01;
            }else if(this.type==='date'){
                return this.max && this.max / 0.001;
            }
            return this.max;
        },
        nkMin(){
            if(this.type==='percent'){
                return this.min && this.min / 0.01;
            }else if(this.type==='date'){
                return this.min && this.min / 0.001;
            }
            return this.min;
        }
    },
    methods:{
        change(e){
            if(this.changed) {
                this.$emit("change", e);
            }
        },
        blur(e){
            this.$emit("blur",e);
        },
        focus(e){
            this.$emit("focus",e);
        },
        prevNumber(e){
            this.$emit("prev-number",e);
        },
        nextNumber(e){
            this.$emit("next-number",e);
        }
    }
}
</script>

<style scoped>
</style>