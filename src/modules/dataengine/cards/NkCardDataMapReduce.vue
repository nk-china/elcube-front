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
    <nk-card>
        <nk-form :col="1">
            <nk-form-item title="运行状态">
                {{data.state}}
            </nk-form-item>
            <nk-form-item title="条目数量">
                {{ data.records }}
            </nk-form-item>
            <nk-form-item title="程序类型">
                {{ def.programType }}
            </nk-form-item>
            <nk-form-item title="数据命令">
                {{ def.dataCommand }}
            </nk-form-item>
            <nk-form-item title="数据主键">
                {{ def.dataKey }}
            </nk-form-item>
            <nk-form-item title="数据映射">
                {{ def.dataMapping }}
            </nk-form-item>
        </nk-form>
    </nk-card>
</template>

<script>
import Mixin from "@/modules/docengine/cards/Mixin";
export default {
    mixins:[Mixin({})]
}
</script>

<style scoped>

</style>