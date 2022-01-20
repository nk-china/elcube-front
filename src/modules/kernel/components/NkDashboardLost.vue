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
    <nk-dashboard-card :title="title">
        <div style="color: darkred;font-size: 18px;">组件缺失</div>
    </nk-dashboard-card>
</template>

<script>

export default {
    props:{
        title:String,
        config:Object,
    },
    data(){
        return {
        }
    },
    mounted() {
        this.$nextTick(()=>{

        })
    },
    methods:{
        ready(){
        },
        resized(){
        },
        updateDef(){
            this.$emit('update',{});
        }
    }
}
</script>

<style scoped>

</style>