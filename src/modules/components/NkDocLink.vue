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
    <a v-if="type==='a'" @click="click">
        <slot v-if="$slots.default"></slot>
        <template v-else>{{doc.docName}}</template>
    </a>
    <a-button v-else :type="type" @click="click">
        <slot v-if="$slots.default"></slot>
        <template v-else>{{doc.docName}}</template>
    </a-button>
</template>

<script>
export default {
    props:{
        type:{
            type:String,
            default:"a"
        },
        doc:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    methods:{
        click(e){
            this.$router.push(`/apps/docs/detail/${this.doc.docId}`);
            this.$emit("click",e);
            e.stopPropagation();
        }
    }
}
</script>

<style scoped>

</style>