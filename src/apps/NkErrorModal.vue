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
    <a-modal :visible="errorVisible"
             centered
             :closable="false"
    >
        <span slot="title" class="title" style="display: flex;align-items: center;font-size: 16px;">
            <a-icon type="close-circle" class="nk-error-color" style="font-size: 22px;margin-right: 15px;"/>
            系统错误
        </span>
        <div v-for="(error,index) in errors" :key="index" class="line">
            {{error}}
        </div>
        <div slot="footer">
            <a-button type="primary" @click="doClearError">确定</a-button>
        </div>
    </a-modal>
</template>

<script>
import {mapState,mapMutations} from 'vuex';
export default {
    computed:{
        ...mapState('UI',['errors','errorVisible'])
    },
    methods:{
        ...mapMutations('UI',['doClearError'])
    }
}
</script>

<style scoped lang="less">
.line + .line{
    margin-top: 15px;
}
::v-deep .ant-modal-header{
    border: none;
}
::v-deep .ant-modal-content{
    padding: 16px 18px;
}
::v-deep .ant-modal-body{
    padding: 12px 24px;
}
::v-deep .ant-modal-footer{
    border: none;
}
</style>