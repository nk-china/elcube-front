<template>
    <nk-page-layout :title="title" class="layout">

        <div slot="action" style="margin: 0 10px;">
            <a-button-group>
                <a-button v-for="item in (data.refs||[])"
                          :key="item.id"
                          :type="data.activeDashboard && item.id === data.activeDashboard.id ? 'primary' : ''"
                          @click="load(item.id)"
                >
                    {{item.name}}
                </a-button>
                <a-dropdown >
                    <a-menu slot="overlay" @click="menuClick">
                        <a-menu-item key="2"> <a-icon type="plus" />添加卡片 </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item key="1"> <a-icon type="swap" />面板管理 </a-menu-item>
                        <a-menu-item key="3" disabled> <a-icon type="search" />查找共享的面板 </a-menu-item>
                    </a-menu>
                    <a-button>  <a-icon type="down" /> </a-button>
                </a-dropdown>
            </a-button-group>
        </div>

        <a-spin :active="true" :spinning="loading">
            <grid-layout
                :layout.sync="layoutFilter"
                :col-num="12"
                :row-height="30"
                :is-draggable="editable"
                :is-resizable="editable"
                :is-mirrored="false"
                :vertical-compact="true"
                :margin="[10, 10]"
                :use-css-transforms="true"
                @layout-updated="layoutUpdated"
                @layout-ready="layoutReady"
            >

                <grid-item v-for="(item,index) in layoutFilter"
                           :x="item.x"
                           :y="item.y"
                           :w="item.w"
                           :h="item.h"
                           :i="item.i"
                           :key="item.i"
                           dragAllowFrom=".ant-card-head-title"
                           @resized="itemResized(index,$event)">
                    <component v-if="item.component"
                               :is="item.componentLost?'nk-dashboard-lost':item.component"
                               :title="item.title"
                               :config="item.config||{}"
                               :editable="editable"
                               ref="items"
                               @remove="removeCard(item)"
                               @update="cardConfigUpdated(item,$event)"
                    ></component>
                    <a-card v-else :title="item.title" size="small" style="height:100%;" ref="items">
                        {{ item.i }}{{item.component}}
                    </a-card>
                </grid-item>
            </grid-layout>
        </a-spin>


        <a-modal v-model="modalDashboard.visible" title="面板管理" @ok="saveDashboardRefs">
            <div style="text-align: right;margin-bottom: 5px;">
                <a @click="modalDashboard.refs.push({name:'新面板'})" style="font-size: 12px">
                    新增
                </a>
            </div>
            <a-list bordered="" :data-source="modalDashboard.refs" size="small">
                <a-list-item slot="renderItem" slot-scope="item,index">
                    <a-input v-model="item.name" style="border: none" />
                    <a slot="actions" :disabled="index<=0"                            @click="dashboardMove(index,-1)">上移</a>
                    <a slot="actions" :disabled="index>=modalDashboard.refs.length-1" @click="dashboardMove(index, 1)">下移</a>
                    <a slot="actions" :disabled="modalDashboard.refs.length<=1"       @click="dashboardMove(index, 0)">移除</a>
                </a-list-item>
            </a-list>
            <template slot="footer">
                <a-button key="back" @click="saveDashboardRefs" type="primary">
                    保存
                </a-button>
            </template>
        </a-modal>
        <a-modal v-model="modalAvailableCards.visible" title="卡片" @ok="saveDashboardRefs">
            <a-list bordered="" :data-source="modalAvailableCards.cards" size="small">
                <a-list-item slot="renderItem" slot-scope="item">
                    {{item.name}}
                    <a slot="actions" @click="addCard(item.w,item.h,item.component,item.name)">添加</a>
                </a-list-item>
            </a-list>
            <template slot="footer">
                <a-button key="back" @click="modalAvailableCards.visible=false">
                    关闭
                </a-button>
            </template>
        </a-modal>
    </nk-page-layout>
</template>

<script>

//const defaultLayout = [{"x":0,"y":19,"w":8,"h":5,"i":"0","component":"nk-dashboard-bar1","title":"客户统计","moved":false},{"x":0,"y":24,"w":4,"h":6,"i":"1","component":"nk-dashboard-bar2","title":"坏账","moved":false},{"x":4,"y":0,"w":4,"h":6,"i":"2","component":"nk-dashboard-pie2","title":"订单概要","moved":false},{"x":8,"y":24,"w":4,"h":6,"i":"3","component":"nk-dashboard-scatter1","title":"逾期","moved":false},{"x":0,"y":11,"w":8,"h":8,"i":"4","component":"nk-dashboard-candlestick1","title":"任务","moved":false},{"x":4,"y":6,"w":4,"h":5,"i":"5","component":"nk-dashboard-radar1","moved":false},{"x":8,"y":14,"w":4,"h":10,"i":"6","component":"nk-dashboard-graph1","title":"计划","moved":false},{"x":0,"y":0,"w":4,"h":11,"i":"7","component":"nk-dashboard-gruge1","title":"今日关注","moved":false},{"x":4,"y":24,"w":4,"h":6,"i":"8","component":"nk-dashboard-bar3","title":"待跟进业务","moved":false},{"x":8,"y":5,"w":4,"h":9,"i":"9","component":"nk-dashboard-calendar1","title":"审批中","moved":false},{"x":8,"y":0,"w":4,"h":5,"i":"10","component":"nk-dashboard-simple1","title":"警告","moved":false}];
import { v4 as uuidv4 } from 'uuid';
import NkAdvancedSearchInput from "@/pages/components/NkAdvancedSearchInput";
import {mapGetters} from "vuex";

export default {
    name: "NkDashboard",
    components:{
      NkAdvancedSearchInput,
    },
    data(){
        return {
            editable: true,
            title: undefined,
            loading: true,
            layout: [],
            layoutJsonStringify:undefined,
            resizeEvent:undefined,
            data:{},
            modalDashboard:{
                visible:false,
                refs:[]
            },
            modalAvailableCards:{
                visible:false,
                cards:[]
            }
        }
    },
    created(){
        this.load('');
        this.loading = false;

        const titles = document.getElementsByTagName("title");
        this.title = (titles && titles[0] && titles[0].getAttribute("title"))||'TS5统一开发平台';
    },
    computed:{
        ...mapGetters('User',[
            'user'
        ]),
        layoutFilter(){
            return this.layout.map(item=>{
                item.componentLost = !this.$options.components[item.component];
                return item;
            })
        }
    },
    mounted() {
        let self = this;
        let timeout = undefined;
        this.resizeEvent = ()=>{
            if(timeout) clearTimeout(timeout);
            timeout = setTimeout(self.resizeAll,100);
        };
        window.addEventListener("resize",this.resizeEvent);
    },
    destroyed() {
        window.removeEventListener("resize",this.resizeEvent);
    },
    methods:{
        $nkShow(){
            window.dispatchEvent(new Event('resize'));
        },
        load(id){
            this.loading = true;
            this.$http.get(`/api/dashboard/load?dashboardId=${id}`)
                .then(res=>{
                    this.data = res.data;
                    if(this.data.activeDashboard){
                        this.layoutJsonStringify = undefined;
                        this.layout = JSON.parse(this.data.activeDashboard.config||"[]");
                    }else{
                        this.data.activeDashboard = {name:"默认",config:[]};
                        this.data.refs.push(this.data.activeDashboard);
                        this.layout=[];
                        this.addCard(8,5,"nk-dashboard-hello","欢迎使用");
                    }
                    this.editable = this.data.activeDashboard.accountId === this.user.id;
                    this.loading = false;
                });
        },
        save(){
            if(this.data.activeDashboard){
                this.layoutJsonStringify = JSON.stringify(this.layout);
                this.data.activeDashboard.config = this.layoutJsonStringify;
                this.$http.postJSON("/api/dashboard/update",this.data.activeDashboard)
                    .then(()=>{})
            }
        },
        menuClick(e){
            if(e.key==="1"){
                this.$http.get(`/api/dashboard/load?dashboardId=`)
                    .then(res=>{
                        this.modalDashboard.refs = res.data.refs;
                        this.modalDashboard.visible=true;
                    });
            }
            if(e.key==="2"){
                this.$http.get("/api/dashboard/card/list")
                    .then((res)=>{
                        this.modalAvailableCards.cards = res.data;
                        this.modalAvailableCards.visible=true;
                    });
                //this.addCard(8,5,"nk-dashboard-bar1","客户统计123");
            }
        },
        addCard(w,h,component,title){
            let x = 0;
            let y = Math.max(Math.max.apply(null,this.layout.map(i=>i.y+i.h))+1,0);

            this.layout.push({
                "i":uuidv4(),
                x,
                y,
                w,
                h,
                component,
                title,
            });
        },
        removeCard(item){
            this.layout.splice(this.layout.indexOf(item),1);
        },
        cardConfigUpdated(item,config){
            this.$set(item,'config',config);
            this.save();
        },
        dashboardMove(i,direction){
            let target = this.modalDashboard.refs.splice(i,1);
            if(direction!==0)
                this.modalDashboard.refs.splice(i+direction,0,target[0]);
            i=0;
            this.modalDashboard.refs.forEach(i=>{
                i.orderBy = i++;
            });
        },
        saveDashboardRefs(){
            this.$http.postJSON("/api/dashboard/updateRefs",this.modalDashboard.refs)
                .then(()=>{
                    this.load("");
                    this.modalDashboard.visible=false;
                });
        },
        // 以下布局容器api
        layoutUpdated(e){
            if(this.layoutJsonStringify){
                if(this.layoutJsonStringify!==JSON.stringify(e))
                    this.save();
            }else{
                this.layoutJsonStringify = JSON.stringify(e);
            }
        },
        layoutReady(){
            this.$refs.items && this.$refs.items.forEach(component=>{
                component.ready&&component.ready();
                component.resized&&component.resized();
            })
        },
        itemResized(index){
            this.$nextTick(()=>{
                let component = this.$refs.items && this.$refs.items[index];
                component && component.resized&&component.resized();
            });
        },
        resizeAll(){
            this.$refs.items && this.$refs.items.forEach(component=>{
                if(component.resized){
                    setTimeout(component.resized,1);
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
    ::v-deep.nk-page-layout .nk-page-layout-content > .content{
        padding: 15px !important;
    }
</style>
