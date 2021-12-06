<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <span class="nk-required-mark" />
</template>

<script>
export default {
    name: "NkRequiredMark"
}
</script>

<style scoped>
    .nk-required-mark{
    }
    .nk-required-mark:before{
        color: #f5222d;
        content: "*";
        line-height: 15px;
    }
</style>