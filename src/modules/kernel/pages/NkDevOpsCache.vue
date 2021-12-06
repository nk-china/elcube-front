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
    <nk-page-layout title="缓存管理" sub-title="管理Redis缓存">

        <nk-card class="card" title="缓存管理">

            <a-row type="flex" justify="center" :align="'middle'">
                <a-col :span="4"><a-button @click="reindex">清空缓存</a-button></a-col>
                <a-col :span="20">{{message}}</a-col>
            </a-row>

        </nk-card>
    </nk-page-layout>
</template>

<script>

    export default {
        data() {
            return {
                message:undefined
            }
        },
        created() {
        },
        methods: {
            reindex(){
                this.$http.post('/api/ops/cache/clear')
                    .then(()=>{
                        this.message = "缓存已清空";
                    })
            }
        }
    }
</script>

<style scoped lang="less">
</style>
