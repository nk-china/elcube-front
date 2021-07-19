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
            }
        },
        destroyed() {
            this.$nkSortableDestory();
        }
    }
}