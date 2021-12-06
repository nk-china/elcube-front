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
    <div class="search-box">
        <div>
            <slot class="nk-search-box-item"></slot>
        </div>
        <div>
            <slot name="more"></slot>
        </div>
    </div>
</template>

<style scoped lang="less">
    .search-box{
        margin-bottom: 10px;
    }
    /*.search-box.expand .actions{*/
    /*    width: auto;*/
    /*}*/
    .search-box > div{
        display: flex;
        flex-wrap: wrap;

        //> *{
        //    margin-top: 5px;
        //}
    }
    ::v-deep.nk-search-box-item{
    }
</style>
