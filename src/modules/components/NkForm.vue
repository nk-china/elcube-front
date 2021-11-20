<template>
    <div class="nk-form">
        <div v-if="title" class="title">{{title}}</div>
        <div class="grid">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import NkFormItem from "./NkFormItem";
import NkFormDivider from "./NkFormDivider";
export default {
    name: 'NkDetailList',
    Item: [NkFormItem,NkFormDivider],
    props: {
        title: {
            type: String,
            required: false
        },
        col: {
            type: Number,
            required: false,
            default: 3
        },
        edit:{
            type: Boolean,
            default: false
        }
    },
    provide () {
        return {
            col: this.col > 4 ? 4 : this.col
        }
    },
    mounted(){
    },
    methods:{
        hasError(){
            let hasError = false;
            if(this.$slots.default){
                this.$slots.default.forEach(c=>{
                    c.componentInstance && c.componentInstance["hasError"] && c.componentInstance["hasError"]();
                })
                this.$slots.default.forEach(c=>{
                    hasError = hasError || (c.componentInstance && c.componentInstance["errorMsg"])
                })
            }
            return hasError;
        }
    }
}
</script>

<style lang="less" scoped>
::v-deep.nk-form{

    .title {
        font-size: 14px;
        color: rgba(0,0,0,.65);
        font-weight: normal;
        margin-bottom: 12px;
    }

    .grid{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .nk-form-item + .nk-form-divider{
            margin-top: 30px;
    }

}
</style>
