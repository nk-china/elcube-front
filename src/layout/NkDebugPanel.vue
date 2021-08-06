<template>
    <div>
        开发面板：
        <a-button-group>
            <a-button v-if="debugId" type="default" @click="suspendDebugBy">
                <a-icon type="border" :style="{color: '#aa2222','background-color':'#aa2222',height:'14px'}" />暂停
            </a-button>
            <a-button v-else type="default" @click="showModel">
                <a-icon type="play-square" />
            </a-button>
            <a-button type="default" @click="reloadVueResources">
                <a-icon type="reload" /> Vue
            </a-button>
            <a-button type="default">
                <a-icon type="number" /> Log
            </a-button>
        </a-button-group>

        <a-modal v-model="debugContextListVisible" title="开始调试">
            <a-input-group compact>
                <a-input placeholder="输入描述创建一个新的上下文" style="width: 80%" v-model="debugContextDesc"></a-input>
                <a-button type="primary" @click="startDebugNew()"  style="width: 20%">创建</a-button>
            </a-input-group>
            <a-divider></a-divider>
            <a-list item-layout="horizontal" :data-source="debugContextList"
                    :ok-button-props="{ props: { disabled: true } }"
                    :bordered="true">
                <a-list-item slot="renderItem" slot-scope="i">
                    {{i.contextDesc}} by {{i.createUser}}
                    <a slot="actions" @click="startDebugBy(i.id)" :disabled="!i.visible">选择</a>
                    <a slot="actions" @click="stopDebugBy(i)"  :disabled="!i.visible">结束</a>
                </a-list-item>
            </a-list>
            <template slot="footer">
                <a-button key="back" @click="debugContextListVisible=false">
                    关闭
                </a-button>
            </template>
        </a-modal>
    </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {NkVueLoader} from "../boot";

export default {
    name: "NkDebugPanel",
    data(){
       return {
           debugContextListVisible: false,
           debugContextList:undefined,
           debugContextDesc:undefined
       }
    },
    computed:{
        ...mapState('Debug',[
            'debugId'
        ])
    },
    methods:{
        ...mapMutations('Debug',[
            'suspendDebug', 'startDebug'
        ]),
        reloadVueResources(){
            NkVueLoader.reloadVueResources().then((e)=>{
                this.$message.info(`Debug: 重新载入Vue组件${e[1]}个`)
            });
        },
        showModel(){
            this.$http.get("/api/debug/contexts")
                .then((res)=>{
                    this.debugContextList = res.data || [];
                    this.debugContextListVisible = true;
                })
        },
        startDebugBy(debugId){
            this.startDebug(debugId);
            location.reload();
        },
        startDebugNew(){
            if(this.debugContextDesc){
                this.$http.post(`/api/debug/start`,`desc=${this.debugContextDesc}`)
                    .then((res)=>{
                        this.startDebug(res.data);
                        location.reload();
                    })
            }
        },
        suspendDebugBy(){
            this.suspendDebug();
            location.reload();
        },
        stopDebugBy(item){
            this.$http.post(`/api/debug/stop/${item.id}`)
                .then(()=>{
                    this.debugContextList.splice(this.debugContextList.indexOf(item),1);
                })
        }
    }

}
</script>

<style scoped>

</style>