<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <nk-search-item :label="config.name||config.label" :min="config.min" :max="config.max" :closeable="closeable" @close="close" >
        <a-select
            mode="multiple"
            placeholder="全部"
            v-model="value"
            :maxTagCount="5"
            :maxTagTextLength="10"
            :dropdownMatchSelectWidth="false"
            :default-open="config.defaulltOpen && !config.doNotOpen"
            :default-value="config.defaultValue"
            @change="change"
            @blur="blur"
            @focus="focus"
            @select="valueChanged=true"
            @deselect="valueChanged=true"
            allowClear>

            <template v-if="option">
                <a-select-option v-for="(item) in option.buckets" :key="item.key">
                    {{format(item.name||item.key)}}
                    <template v-if="typeof item.docCount!=='undefined'">({{item['docCount']}})</template>
                </a-select-option>
            </template>
        </a-select>
    </nk-search-item>
</template>

<script>
import NkFormat from "../../utils/NkFormat";
export default {
    props:{
        config: Object,
        option: Object,
        closeable: Boolean
    },
    data(){
        return {
            value: undefined,
            valueChanged:false,
            isFocus:false,
        }
    },
    methods:{
        setValue(values){
            this.value = values&&values[this.config.field]&&values[this.config.field].terms[this.config.field]
        },
        focus(){
            this.isFocus = true;
        },
        blur(e){
            this.isFocus = false;
            if(this.valueChanged){
                const terms = {};
                terms[this.config.field]=e;
                this.$emit("changed",{
                    field:this.config.field,
                    trigger:true,
                    condition:e&&e.length&&{terms}
                })
                this.valueChanged=false;
            }
        },
        change(e){
            const terms = {};
            terms[this.config.field]=e;
            this.$emit("changed",{
                field:this.config.field,
                trigger: !this.isFocus || e.length===0,
                condition:e&&e.length&&{terms}
            })
        },
        close(){
            this.$emit("close",this.config);
        },
        format(value){
            if(this.config.formatter){
                let name = this.config.formatter[0];
                let params = [value];
                for(let i=1;i<this.config.formatter.length;i++){
                    params.push(this.config.formatter[i])
                }
                let func = NkFormat[name];
                return func.apply(this,params);
            }
            return value;
        }
    }
}
</script>

<style scoped>

</style>
