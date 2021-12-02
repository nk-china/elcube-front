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
<script>
export default {
    name: "NkEditSlot",
    abstract: true,
    props:{
        editMode:{
            type: Boolean,
            default: false
        },
        options:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    render(h) {
        let c = this.$slots[this.editMode?'edit':'default'];
        return !c||c.length>1?c:h('div',Object.assign({},this.options),c)
    }
}
</script>

<style scoped>
div{
    display: inline-block;
}
</style>
