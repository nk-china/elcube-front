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
    <div v-if="mode==='range'" class="range">
        <a-input-number :defaultValue="value&&value[0]" @change="change($event,0)"></a-input-number>
        <span>~</span>
        <a-input-number :defaultValue="value&&value[1]" @change="change($event,1)"></a-input-number>
    </div>
    <a-input-number v-else :defaultValue="singleValue" @change="changeSingle"></a-input-number>
</template>

<script>
export default {
    props:{
        value:{},
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
                    this.$emit("input",[this.value,undefined]);
                }
            }else{
                if(this.value instanceof Array){
                    this.$emit("input",this.value[0]);
                }
            }
        }
    },
    computed:{
        singleValue(){
            if(this.value){
                if(typeof this.value === 'number'){
                    return this.value;
                }
            }
            return undefined;
        }
    },
    methods:{
        change(value,index){
            if(index===0){
                this.$emit("input",[value,this.value&&this.value[1]]);
            }else{
                this.$emit("input",[this.value&&this.value[0],value]);
            }
        },
        changeSingle(value){
            this.$emit("input",value);
        }
    }
}
</script>

<style scoped lang="less">
    .range{
        display: flex;

        & > span{
            width: 5%;
            text-align: center;
            min-width: 20px;
            flex-shrink: 0;
        }

        & > .ant-input-number{
            width: 40%;
        }
    }
</style>