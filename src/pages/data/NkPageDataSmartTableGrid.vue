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
        :data="data"
        :loading="loading"
        @cell-click="$emit('vxeCellClick',$event)"
        @current-change="$emit('vxeCurrentChanged',$event)"
        @sort-change="$emit('vxeSortChanged',$event)"
        :sort-config="sortConfig"
    >
        <template #drill="e">
            <a v-if="e.row.$drillAble!==false" @click="$emit('nk-row-drill',e)">{{e.row[e.column.property]}} <i class="vxe-icon--caret-bottom"></i></a>
            <span v-else>{{e.row[e.column.property]}}</span>
        </template>
        <template #drillExpand="e">
            <nk-smart-table
                style="margin: 10px;"
                :show-header="false"
                :maxHeight="500"
                auto-resize
                resizable
                highlight-hover-row
                :highlight-current-row="false"
                show-header-overflow="tooltip"
                show-overflow="tooltip"
                size="mini"
                :border="border"
                :columns="columns"
                :data="e.row.$children"
                :loading="!e.row.$children"
                @cell-click="$emit('vxeCellClick',$event)"
                @current-change="$emit('vxeCurrentChanged',$event)"
                @sort-change="$emit('vxeSortChanged',$event)"
                @nk-row-drill="$emit('nk-row-drill',$event,e)"
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
        data:Array,
        loading:Boolean
    },
    methods:{
        clearSort(){
            this.$refs.grid.clearSort();
        }
    }
}
</script>

<style scoped>
.hide{
    display: none;
}
</style>