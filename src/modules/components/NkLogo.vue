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
    <div class="nk-application-logo">
        <a href="http://www.nkpro.cn" target="_blank">
            <img :src="logo" alt=""/>
        </a>
    </div>
</template>

<script>
import logo from '../../assets/elcard.logo.w.png'
export default {
    data(){
        return {
            logo
        }
    }
}
</script>

<style lang="less">
.nk-application-logo {
    user-select: none;
    margin: 16px;
    text-align: center;
    height: 48px;

    img{
        width: 94px;
        transition: 0.2s width;
    }
}
.ant-layout-sider-collapsed{
    .nk-application-logo{
        height: 30px;
        img{
            width: 30px;
        }
    }
}
</style>