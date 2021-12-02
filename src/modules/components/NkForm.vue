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
    <div class="nk-form">
        <div v-if="title" class="title">{{title}}</div>
        <div class="grid">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import NkFormItem from "./NkFormItem";
import NkFormDivider from "./NkFormDivider";
export default {
    name: 'NkDetailList',
    Item: [NkFormItem,NkFormDivider],
    props: {
        title: {
            type: String,
            required: false
        },
        col: {
            type: Number,
            required: false,
            default: 3
        },
        edit:{
            type: Boolean,
            default: false
        }
    },
    provide () {
        return {
            col: this.col > 4 ? 4 : this.col
        }
    },
    mounted(){
    },
    methods:{
        hasError(){
            let hasError = false;
            if(this.$slots.default){
                this.$slots.default.forEach(c=>{
                    c.componentInstance && c.componentInstance["hasError"] && c.componentInstance["hasError"]();
                })
                this.$slots.default.forEach(c=>{
                    hasError = hasError || (c.componentInstance && c.componentInstance["errorMsg"])
                })
            }
            return hasError;
        }
    }
}
</script>

<style lang="less" scoped>
::v-deep.nk-form{

    .title {
        font-size: 14px;
        color: rgba(0,0,0,.65);
        font-weight: normal;
        margin-bottom: 12px;
    }

    .grid{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .nk-form-item + .nk-form-divider{
            margin-top: 30px;
    }

}
</style>
