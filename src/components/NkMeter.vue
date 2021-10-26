<template>
    <a-card class="meter" :title="title" size="small" :bodyStyle="{'height':'calc(100% - 38px)'}">
        <slot name="default"></slot>
        <div v-if="isSetting" class="setting-container">
            <slot name="setting"></slot>
        </div>
        <a-button-group v-if="isSetting" slot="extra" size="small">
            <a-button @click="submitSetting()" type="primary">确定</a-button>
            <a-button @click="setSettingMode(false)">取消</a-button>
        </a-button-group>
        <a-dropdown v-else-if="editable" slot="extra" :trigger="['click']" placement="bottomRight">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()" style="color: #000c17">
                <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay" @click="menuClick">
                <a-menu-item key="@setting" v-if="enableSetting">
                    <a-icon type="edit" /> 设置
                </a-menu-item>
                <a-menu-divider v-if="enableSetting" />
                <a-menu-item key="@delete" >
                    <a-icon type="delete" /> 移除
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </a-card>
</template>

<script>
export default {
    props:{
        title:String,
        enableSetting:Boolean,
        editable:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return {
            isSetting:false
        }
    },
    methods: {
        menuClick(e){
            if(e.key==='@delete'){
                this.$parent.$emit("remove")
            }else if(e.key==='@setting'){
                this.setSettingMode(true);
            }
        },
        setSettingMode(f){
            this.isSetting = f;
        },
        submitSetting(){
            this.isSetting = false;
            this.$emit("setting-submit")
        }
    }
}
</script>

<style scoped lang="less">
    ::v-deep.meter.ant-card .ant-card-head .ant-card-head-title{
        font-size: 12px;
        padding: 10px 0;
    }
    .meter{
        height:100%;
        position: relative
    }
    .setting-container{
        position: absolute;
        z-index: 10;
        top: 48px;
        left:10px;
        right:10px;
        bottom:10px;
        background-color: #fff;
        opacity: 0.9;
        overflow: auto;
    }
</style>