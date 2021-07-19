<template>
    <a-card :title="title" size="small" style="height:100%;" :bodyStyle="{'height':'calc(100% - 38px)'}">
        <slot></slot>
        <a-dropdown slot="extra" :trigger="['click']" placement="bottomRight">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()" style="color: #000c17">
                <a-icon type="ellipsis" />
            </a>
            <a-menu slot="overlay" @click="menuClick">
                <a-menu-item key="@setting" v-if="setting">
                    <a-icon type="edit" /> 设置
                </a-menu-item>
                <a-menu-divider v-if="setting" />
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
        setting:Function
    },
    methods: {
        menuClick(e){
            if(e.key==='@delete'){
                console.log(123)
                console.log(this.$parent.$emit("remove"))
            }else if(e.key==='@setting'){
                this.setting && this.setting();
            }
        }
    }
}
</script>

<style scoped>

</style>