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
    <div class="nk-static-layout">
        <div class="toolbar"></div>
        <div class="content"></div>
    </div>
</template>

<script>
export default {
name: "NkDefineLayout"
}
</script>

<style scoped lang="less">
    .nk-static-layout{
        height: calc(100vh - 120px);

        .toolbar{
            height: 40px;
            background: #fff;
            border-bottom: 1px solid #e8e8e8;
        }
        .content{
            height: calc(100vh - 160px);
        }
    }
</style>