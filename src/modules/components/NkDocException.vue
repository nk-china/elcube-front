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
    <nk-card title="获取单据发生错误" v-if="exception">
        <div class="exception">
            <a-alert type="error">
            <ul slot="description">
                <li v-for="(line,index) in exception" v-html="line" :key="index"></li>
            </ul>
            </a-alert>
        </div>
    </nk-card>
</template>

<script>
export default {
    props:{
        exception:Array
    }
}
</script>

<style scoped lang="less">

.exception{
    word-break:break-all;
    ul{
        margin: 10px;
        padding: 0;
        li{
            list-style: none;

            ::v-deep {
                > span{
                    padding-left: 20px;
                }

                .t{
                    padding-left: 0;
                }

                span.highlight{
                    color: #aa2222;
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>