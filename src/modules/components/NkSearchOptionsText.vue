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
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-input ref="input" v-model="value" :placeholder="config.placeholder" @keydown="keydown" @change="change" allow-clear/>
    </nk-search-item>
</template>

<script>
export default {
    props:{
        config: Object,
        closeable: Boolean
    },
    data(){
        return {
            value: undefined
        }
    },
    methods:{
        setValue(values){
            this.value = values&&values[this.config.field]&&values[this.config.field].multi_match.query;
        },
        keydown(e){
            if(e.key==='Enter'){
                const multi_match = {
                    query:this.value,
                    fields:this.config.field instanceof Array ? this.config.field : [this.config.field],
                };
                this.$emit("changed",{
                    field:this.config.field,
                    trigger:true,
                    highlight:true,
                    condition:this.value&&{multi_match}
                })
                e.target.blur();
            }
        },
        change(){
            const multi_match = {
                query:this.value,
                fields:this.config.field instanceof Array ? this.config.field : [this.config.field],
            };
            this.$emit("changed",{
                field:this.config.field,
                trigger:false,
                highlight:true,
                condition:this.value&&{multi_match}
            })
        },
        close(){
            this.$emit("close",this.config);
        }
    }
}
</script>

<style scoped>

</style>
