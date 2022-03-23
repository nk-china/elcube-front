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
    <div class="nk-application-logo">
        <a href="http://elcube.cn" target="_blank">
            <img :src="logo" alt=""/>
            <span>ELCube</span>
        </a>
    </div>
</template>

<script>
import logo from '../../assets/elcube_logo_100x100.png'
export default {
    data(){
        return {
            logo
        }
    }
}
</script>

<style lang="less" scoped>
.nk-application-logo {
    user-select: none;
    padding: 16px;
    text-align: center;
    height: 80px;
    background-color: #001529;

    a{
        display: flex;
        justify-content: center;
    }

    img{
        width: 36px;
        height: 36px;
        transition: 0.2s width;
    }
    span{
        color: white;
        font-size: 26px;
        transition: 0.2s width;
        padding-left: 5px;
    }
}
.ant-layout-sider-collapsed{
    .nk-application-logo{
        height: 30px;
        img{
            width: 30px;
            height: 30px;
        }
        span{
            display: none;
        }
    }
}
</style>