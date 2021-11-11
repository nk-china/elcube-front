<template>
    <vxe-grid
        ref="grid"
        auto-resize
        resizable
        :show-header="showHeader"
        highlight-hover-row
        :highlight-current-row="false"
        show-header-overflow="tooltip"
        show-overflow="tooltip"
        size="mini"
        :max-height="maxHeight"
        :border="border"
        :columns="columns"
        :data="list"
        :loading="loading"
        @cell-click="$emit('vxeCellClick',$event)"
        @current-change="$emit('vxeCurrentChanged',$event)"
        @sort-change="$emit('vxeSortChanged',$event)"
        :sort-config="sortConfig"
        :expand-config="{accordion:false}"
        @toggle-row-expand="rowExpand"
    >
        <template #drill="e">
            <template v-if="data.$$drillable">
                <a @click="drill($event,e)">
                    {{e.row[e.column.property]}}
                </a>
                <span @click="drill($event,e)" style="cursor: pointer">
                    <i v-if="e.row.$$drilled===e.column.property && !e.row.$$data" class="vxe-icon--refresh roll"></i>
                    <i v-else-if="$refs.grid.isExpandByRow(e.row)" class="vxe-icon--arrow-bottom"></i>
                    <i v-else class="vxe-icon--arrow-right"></i>
                </span>
            </template>
            <span v-else>{{e.row[e.column.property]}}</span>
        </template>
        <template #drillExpand="e">
            <nk-smart-table
                style="margin: 10px;"
                :show-header="false"
                :maxHeight="500-e.row.$$step*60"
                auto-resize
                resizable
                highlight-hover-row
                :highlight-current-row="false"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                size="mini"
                :border="border"
                :columns="columns"
                :data="e.row.$$data"
                :expandOnly="expandOnly"
                @cell-click="$emit('vxeCellClick',$event)"
                @current-change="$emit('vxeCurrentChanged',$event)"
                @sort-change="$emit('vxeSortChanged',$event)"
                @nk-row-drill="drillInner($event,e)"
                :sort-config="sortConfig"
            ></nk-smart-table>
        </template>
    </vxe-grid>
</template>

<script>
export default {
    name: "NkSmartTable",
    props:{
        showHeader:{
            type:Boolean,
            default:true,
        },
        maxHeight:Number,
        border:String,
        sortConfig:Object,
        columns:Array,
        data:Object,
        loading:Boolean,
        expandOnly:Boolean,
    },
    data(){
        return {
            drilled:undefined
        }
    },
    computed:{
        list(){
            if(this.expandOnly&&this.drilled&&this.drilled.$$data)
                return [this.drilled];
            return this.data&&this.data.list;
        }
    },
    methods:{
        clear(){
            this.drilled = undefined;
            this.$refs.grid.clearSort();
        },
        drill(e,event,parent){
            e.preventDefault();

            let drilled = event.row.$$drilled;

            if(!drilled || drilled !== event.column.property){
                this.$set(event.row,'$$drilled',event.column.property);
                this.drilled = event.row;
                this.$emit('nk-row-drill',event, parent);
            }else{
                this.$set(event.row,'$$drilled',undefined);
                this.drilled = undefined;
                event.row.$$data = undefined;
                event.$table.setRowExpand([event.row], false);
            }
        },
        drillInner($event,parent){
            this.$emit('nk-row-drill',$event,parent);
        },
        rowExpand(e){
            console.log(e)
        }
    }
}
</script>

<style scoped>
</style>