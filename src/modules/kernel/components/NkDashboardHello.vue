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
    <nk-dashboard-card :title="title||'欢迎使用ELCube'">
        <a-menu-item slot="menu" key="0">
            <a-icon type="edit" /> 编辑
        </a-menu-item>
        <div style="width: 100%;height:100%;display: flex;">
            <img :src="joinchat" style="max-height:100%;max-width: 100%;">
            <div style="overflow: auto;margin-left: 10px;">
                <h2>关于 ELCube</h2>
                <p>ELCube（逻辑魔方），解决企业变更曲线与软件跟曲线不匹配的问题。
                    我们致力于开发一套快速、灵活的企业级平台模型，让企业更从容，让技术人员走出困境。
                    用业务建模的方式解决复杂业务问题，而不是用技术堆砌的方式绑定企业。
                    更多介绍<a href="http://docs.elcube.cn" target="_blank">请点击这里</a>
                </p>
            </div>
        </div>
    </nk-dashboard-card>
</template>

<script>

import joinchat from '../../../assets/joinchat.png'

export default {
    props:{
        title:String,
        config:Object,
    },
    data(){
        return {
            joinchat
        }
    },
    mounted() {
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
