/*
 * 	This file is part of ELCube.
 *	ELCube is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *	ELCube is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *	You should have received a copy of the GNU Affero General Public License
 *	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
 */
import Sortable from "sortablejs";

export default ()=>{
    return {
        data(){
            return {
                nk$Sortable:[],
                nk$SortableVxeTable:[],
            }
        },
        methods:{
            $nkSortable(el,onEnd,selector){
                if(!selector){
                    selector = ".body--wrapper>.vxe-table--body tbody";
                }
                this.nk$Sortable.push(
                    Sortable.create(el.querySelector(selector), {
                        handle: '.drag-btn',
                        onEnd
                    })
                );
            },
            $nkSortableVxeTable(expand){
                if(expand){
                    this.$nextTick(()=>{
                        for(let key in this.$refs){
                            const vxeTable = this.$refs[key];
                            if(vxeTable.$options._componentTag==='vxe-table'||vxeTable.$options._componentTag==='vxe-grid'){
                                this.nk$SortableVxeTable.push(
                                    Sortable.create(vxeTable.$el.querySelector(".body--wrapper>.vxe-table--body tbody"), {
                                        handle: '.drag-btn',
                                        onEnd:({newIndex,oldIndex})=>{
                                            vxeTable.data.splice(newIndex, 0, vxeTable.data.splice(oldIndex, 1)[0]);
                                        }
                                    })
                                );
                            }
                        }
                    });
                }else{
                    this.$nkSortableDestory();
                }
            },
            $nkSortableDestory(){
                this.nk$Sortable.forEach(sortable=>sortable.destroy());
                this.nk$Sortable = [];
                this.nk$SortableVxeTable.forEach(sortable=>sortable.destroy());
                this.nk$SortableVxeTable = [];
            },
            $nkSortableRemove(arr,i){
                arr.splice(i-1,1);
            }
        },
        destroyed() {
            this.$nkSortableDestory();
        }
    }
}