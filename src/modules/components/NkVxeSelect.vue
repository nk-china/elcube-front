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
    <vxe-select size="mini" v-model="nkValue" @change="change" :transfer="transfer">
        <slot></slot>
    </vxe-select>
</template>

<script>
export default {
    props:{
        type:String,
        value:{},
        transfer:Boolean
    },
    computed:{
        nkValue:{
            get(){
                if(this.type==='percent'){
                    return this.value * 100;
                }
                return this.value;
            },
            set(newValue){
                const input = this.type==='percent' ? newValue * 0.01 : newValue;
                this.$emit("input",input);
            }
        }
    },
    methods:{
        change(e){
            this.$emit("change",e);
        }
    }
}
</script>

<style scoped>

</style>