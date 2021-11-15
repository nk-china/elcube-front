<template>
    <a-card class="meter" :title="title" size="small" :bodyStyle="{'height':bodyHeight}">

        <slot v-if="!settingMode" name="default"></slot>
        <div v-else style="display: flex;justify-content: center;align-items: center;height: 100%;">
            <a-button @click="openSetting" type="link">设置图表选项</a-button>
        </div>

        <a-modal title="设置" v-model="settingVisible" @ok="submitSetting">
            <slot name="setting"></slot>
        </a-modal>

        <template v-if="editable">
            <a-dropdown v-if="mode==='dashboard'" slot="extra" :trigger="['click']" placement="bottomRight">
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
            <a-button v-else slot="extra" @click="openSetting" type="link">设置</a-button>
        </template>
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
    inject:{
        mode:{
            default:'setting'
        },
        bodyHeight:{
            default: 'calc(100% - 38px)'
        }
    },
    data(){
        return {
            settingVisible:false,
            settingMode:false
        }
    },
    mounted() {
    },
    methods: {
        menuClick(e){
            if(e.key==='@delete'){
                this.$parent.$emit("remove")
            }else if(e.key==='@setting'){
                this.openSetting();
            }
        },
        openSetting(){
            this.settingVisible = true;
        },
        setSettingMode(f){
            this.settingMode = f;
            if(this.mode!=='dashboard'){
                this.settingVisible = f;
            }
        },
        submitSetting(){
            this.settingMode = false;
            this.settingVisible = false;
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