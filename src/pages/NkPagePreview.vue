<template>
    <transition name="slide-fade">
        <div class="preview" v-if="visable">
            <div class="background" @click="hide"></div>
            <div class="foreground">
                <component :is="component" :params="params" :preview="true">
                    <nk-doc-link :doc="params" type="primary" slot="buttons" @click="hide">进入详情</nk-doc-link>
                </component>
            </div>
        </div>
    </transition>
</template>

<script>
import NkPageTaskDetail from "./NkPageTaskDetail";
export default {
    components:{
        NkPageTaskDetail,
    },
    props:{
        params:Object,
        visable:{
            type:Boolean,
            default:false
        }
    },
    computed:{
        component(){
            switch (this.params.classify){
                case "TRANSACTION":
                    return "nk-page-doc-detail";
                case "PROJECT":
                    return "nk-page-doc-detail";
                case "PARTNER":
                case "PARTNER_T":
                    return "nk-page-partner-detail";
                case "bpmTask":
                    return "nk-page-task-detail";
            }
            return null;
        }
    },
    methods:{
        hide(){
            this.$emit("update:visable",false);
            this.$emit("close");
        }
    }
}
</script>

<style scoped lang="scss">
    .preview{
        position: fixed;
        z-index: 5;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .background{
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: #2b2b2b;
            opacity: 0.5;
        }
        .foreground{
            position: absolute;
            width: 55%;
            min-width: 840px;
            max-width: 1240px;
            height: 100%;
            right: 0;
            background-color: #f0f2f5;
            overflow-y: auto;
            overflow-x: hidden;

            &::-webkit-scrollbar{
            }
        }
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .3s ease;
    }
    .slide-fade-leave-active {
        transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
</style>