<template>
    <div>
        开发面板：
        <a-button-group>
            <a-button v-if="debugId && timeout" type="default" @click="stopDebug">
                <a-icon type="border" :style="{color: '#aa2222','background-color':'#aa2222',height:'14px'}" />
                {{timeout}} 停止
            </a-button>
            <a-button v-else type="default" @click="startDebug()">
                <a-icon type="play-square" />
            </a-button>
            <a-button type="default" @click="reloadVueResources">
                <a-icon type="reload" /> Vue
            </a-button>
            <a-button type="default">
                <a-icon type="number" /> Log
            </a-button>
        </a-button-group>
    </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {NkVueLoader} from "../../boot";

export default {
    name: "NkDebugPanel",
    computed:{
        ...mapState('Debug',[
            'debugId','timeout'
        ])
    },
    methods:{
        ...mapMutations('Debug',[
            'stopDebug', 'startDebug'
        ]),
        reloadVueResources(){
            NkVueLoader.reloadVueResources().then((e)=>{
                this.$message.info(`重新载入Vue组件${e[1]}个`)
            });
        }
    }

}
</script>

<style scoped>

</style>