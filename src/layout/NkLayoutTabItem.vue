<template>
    <div role="tab"
         aria-disabled="false"
         class=" ant-tabs-tab nk-nav-tab"
         :class="active?'ant-tabs-tab-active':''"
         :draggable="tab.draggable"

         @dragstart="dragstart"
         @dragover="dragover"
         @dragend="dragend">
        <div>
            <a-tooltip v-if="tab.name.length>=10" :title="tab.name">
                <span @click="click">{{tab.name}}</span>
            </a-tooltip>
            <span v-else @click="click" style="margin: 0 -16px;padding: 0 16px;">{{tab.name}}</span>
            <a-popconfirm
                v-if="tab.confirm && closeable"
                placement="top"
                :title="tab.confirm"
                ok-text="Yes"
                cancel-text="No"
                @confirm="close"
            >
                <a-icon type="close" class="ant-tabs-close-x"></a-icon>
            </a-popconfirm>
            <a-icon v-if="!tab.confirm && closeable" type="close" @click="close" class="ant-tabs-close-x"></a-icon>
        </div>
    </div>
</template>

<script>

export default {
    name: "NkTabItem",
    props:{
        tab: Object,
        active: Boolean,
        closeable: {
            type: Boolean,
            default: true
        }
    },
    data(){
        return {
            path: undefined
        }
    },
    created(){
        this.path = this.tab.path;
    },
    methods:{
        click(){
            this.$emit("click",this.tab);
        },
        close(){
            this.$emit("close",this.tab);
        },
        dragstart(e){
            e.tab = this.tab;
            this.$emit('dragstart',e);
        },
        dragover(e){
            this.$emit('dragover',e);
        },
        dragend(e){
            e.tab = this.tab;
            this.$emit("dragend",e);
        }
    }
}
</script>

<style scoped lang="less">
.ant-tabs-tab{
    max-width: 200px;
    flex-shrink: 1;

    > div {
        display: flex;
        align-items: center;
        > span{
            display: inline-block;
            max-width: 156px;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
}
</style>
