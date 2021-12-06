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
    <a-empty v-if="visible" :image="simpleImage" style="margin: 5px;" />
</template>

<script>
import { Empty } from 'ant-design-vue';
export default {
    props:{
        data: {}
    },
    beforeCreate() {
        this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
    },
    computed:{
        visible(){
            return !this.data || this.data.length === 0;
        }
    }
}
</script>

<style scoped>

</style>