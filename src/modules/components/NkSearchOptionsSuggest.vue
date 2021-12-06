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
    <nk-search-item :label="config.name" :closeable="closeable" @close="close">
        <a-auto-complete ref="input" :dataSource="suggestList" v-model="value" :placeholder="config.placeholder"
                         @keydown="keydown"
                         @search="search"
                         @select="onSelect"
                         @change="change(false)" allow-clear/>
    </nk-search-item>
</template>

<script>
export default {
    props:{
        config: Object,
        closeable: Boolean,
        suggest: Array
    },
    data(){
        return {
            value: undefined
        }
    },
    computed:{
        suggestList(){
            const field = (this.config.field[0]||this.config.field).split('.');
            return this.suggest && this.suggest.map(i=>{
                field.forEach(f=>{
                    i=i[f]
                })
                return i;
            });
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
        onSelect(){
            this.change(true);
        },
        search(e){
            if(e&&e.trim()){
                this.$emit("suggest",{
                    field: this.config.field[0]||this.config.field,
                    text: e
                });
            }
        },
        change(trigger){
            const multi_match = {
                query:this.value,
                fields:this.config.field instanceof Array ? this.config.field : [this.config.field],
            };
            this.$emit("changed",{
                field:this.config.field,
                trigger:trigger || !this.value,
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
