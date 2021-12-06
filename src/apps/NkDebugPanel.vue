<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <div>
        开发面板：
        <a-button-group>
<!--            <a-button type="default" @click="suspendDebugBy">-->
<!--                <a-icon type="border" :style="{color: '#aa2222','background-color':'#aa2222',height:'14px'}" />暂停-->
<!--            </a-button>-->
            <a-dropdown-button v-if="debugId" @click="suspendDebugBy" @visibleChange="loadDebugResources" :trigger="['click']">
                <a-icon type="border" :style="{color: '#aa2222','background-color':'#aa2222',height:'14px'}" />Exit
                <a-menu slot="overlay" @click="debugResourcesClick">
                    <a-menu-item v-if="debugResources && debugResources.length === 0">[ Empty ]</a-menu-item>
                    <template v-if="debugResources">
                        <a-menu-item v-for="i in debugResources" :key="i.docType||i.scriptName">
                            <template v-if="i.docType">
                                @{{i.docType}}
                            </template>
                            <template v-else>
                                #{{i.scriptName}}
                            </template>
                        </a-menu-item>
                    </template>
                </a-menu>
                <span slot="icon"><a-icon type="gold" /> Res</span>
            </a-dropdown-button>
            <a-button v-else type="default" @click="showModel">
                <a-icon type="play-square" /> Run
            </a-button>
            <a-button type="default" @click="reloadVueResources">
                <a-icon type="reload" /> Vue
            </a-button>
            <a-button type="default" @click="$message.info('按下F12打开开发者工具试一下')">
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

export default {
    name: "NkDebugPanel",
    data(){
       return {
           debugContextListVisible: false,
           debugContextList:undefined,
           debugContextDesc:undefined,
           debugResources:undefined
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
            this.$sfc.reloadVueResources().then((e)=>{
                this.$message.info(`Debug: 重新载入Vue组件${e.count}个`)
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
        loadDebugResources(state){
            if(state)
                this.$http.post(`/api/debug/resources`)
                    .then(res=>{
                        this.debugResources = res.data;
                    });
            else this.debugResources = undefined;
        },
        debugResourcesClick(e){
            const item = this.debugResources.find(i=>(i.docType||i.scriptName)===e.key);
            if(item){
                let path = undefined
                if(item.docType){
                    path = `/apps/def/doc/detail/${item.docType}/${item.version}`
                }else{
                    path = `/apps/def/component/detail/${item.scriptName}/${item.version}`
                }
                if(this.$route.fullPath!==path)
                    this.$router.push(path)
            }
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
