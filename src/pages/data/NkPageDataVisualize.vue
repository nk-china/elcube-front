<template>
    <nk-page-layout title="数据可视化" class="layout" :spinning="spinning">

        <div slot="action" style="margin: 0 10px;">
            <a-button-group>
                <a-button type="primary" @click="doPlay()"><a-icon type="play-circle" /></a-button>
                <a-button @click="customPlay.visible=true">自定义放映</a-button>
                <a-button disabled>生成报告</a-button>
            </a-button-group>
        </div>

        <div ref="container" class="container" @mousedown="containerMousedown" @mousemove="containerMousemove" @mouseup="containerMouseup" @mouseleave="containerMouseup">
            <div class="box">

                <div v-for="(dataV,index) in dataVList" :key="index" class="item" ref="items" :class="dataV.selected?'selected':''" @click="itemClick(dataV)">
                    <div class="border">
                        <img v-if="dataV.thumbnail" :src="dataV.thumbnail" width="200" />
                        <div v-else class="blank">空白面板</div>
                    </div>
                    {{dataV.name}}
                </div>

                <div class="item add" @click="createOpen">
                <span role="button" tabindex="0" class="ant-upload">
                    <div>
                        <a-icon type="plus" class="icon" />
                        <div class="text">创建</div>
                    </div>
                </span>
                </div>
            </div>
            <div v-if="dragBoxStyle" class="drag-box" :style="dragBoxStyle"></div>
        </div>

        <a-modal v-model="createModal.visible" title="创建数据视图" centered @ok="createSubmit" :confirm-loading="createModal.confirmLoading" :maskClosable="false">
            <nk-form :col="1">
                <nk-form-item title="描述">
                    <a-input v-model="createModal.dataView.name"></a-input>
                </nk-form-item>
                <nk-form-item title="宽">
                    <a-input-number v-model="createModal.dataView.width"></a-input-number>
                </nk-form-item>
                <nk-form-item title="高">
                    <a-input-number v-model="createModal.dataView.height"></a-input-number>
                </nk-form-item>
            </nk-form>
        </a-modal>

        <div v-if="slides">
            <transition v-for="(dv,index) in slides" :key="index" name="slide-fade">
                <nk-data-v :data-view="dv" v-show="index===slideIndex"></nk-data-v>
            </transition>
        </div>

        <a-modal v-model="customPlay.visible" centered title="自定义放映" @ok="doCustomPlay" :width="320">
            <a-form  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                <a-form-item label="放映间隔">
                    <a-input-number v-model="customPlay.interval" placeholder="切换间隔（秒）" :min="3" style="width: 160px;"></a-input-number>
                </a-form-item>
            </a-form>
        </a-modal>
    </nk-page-layout>
</template>

<script>

import CanvasUtil from "@/utils/CanvasUtil";
import NkDataV from "@/pages/data/NkDataV";
import DomUtils from "@/utils/DomUtils";

export default {
    provide(){
        return {
            mode: 'dashboard'
        };
    },
    components: {NkDataV},
    data(){
        return {
            spinning:true,
            dataVList:[],
            cmdKeydown:false,
            containerDragBox:undefined,
            createModal:{visible:false,confirmLoading:false,dataView:{width:1024,height:768}},

            slides:[],
            slideIndex:1,
            slideInteval:undefined,

            customPlay:{
                visible:false,
                interval:10
            }
        }
    },
    computed:{
        dragBoxStyle(){
            if(this.containerDragBox && this.containerDragBox.ex){
                return {
                    left:   (Math.min(this.containerDragBox.sx,this.containerDragBox.ex)   - this.$refs.container.getBoundingClientRect().left)+'px',
                    top:    (Math.min(this.containerDragBox.sy,this.containerDragBox.ey)   - this.$refs.container.getBoundingClientRect().top)+'px',
                    width:  (Math.abs(this.containerDragBox.sx-this.containerDragBox.ex))+'px',
                    height: (Math.abs(this.containerDragBox.sy-this.containerDragBox.ey))+'px',
                };
            }
            return null;
        }
    },
    created(){
        document.addEventListener("keydown",this.containerKeydown);
        document.addEventListener("keyup",this.containerKeyup);
        this.nk$show();
    },
    destroyed() {
        document.removeEventListener("keydown",this.containerKeydown);
        document.removeEventListener("keyup",this.containerKeyup);
        clearInterval(this.slideInteval);
    },
    mounted() {
    },
    methods:{
        doCustomPlay(){
            this.customPlay.visible = false;
            this.doPlay(this.customPlay.interval)
        },
        doPlay(interval){
            console.log(interval)
            let selected = this.dataVList.filter(i=>i.selected);
            selected = selected.length?selected:this.dataVList;

            if(selected.length){
                this.spinning = true;
                this.$http.postJSON('/api/dataView/mload',selected.map(i=>i.id))
                    .then(res=> {
                        this.slides = res.data;
                        const self = this;
                        DomUtils.requestFullScreen(undefined,()=>{
                            self.slides = undefined;
                            clearInterval(self.slideInteval);
                        });
                        this.slideInteval = setInterval(()=>{
                            this.slideIndex = this.slideIndex < this.slides.length - 1 ? this.slideIndex + 1 : 0;
                        },(interval||10)*1000);
                    }).finally(()=>{
                        this.spinning = false;
                    });
            }
        },
        nk$show(){
            this.$http.postJSON('/api/dataView/all')
                .then(res=> {
                    this.dataVList = res.data;
                }).finally(()=>{
                    this.spinning = false;
                });
        },
        createOpen(){
            this.createModal.visible = true;
        },
        createSubmit(){
            this.createModal.confirmLoading = true;
            this.$http.postJSON('/api/dataView/update',this.createModal.dataView)
                .then(res=>{
                    this.dataVList.push(res.data);
                    this.createModal.dataView ={width:1024,height:768};
                    this.createModal.visible = false;
                }).finally(()=>{
                    this.createModal.confirmLoading = false;
                });
        },
        itemClick(dataV){
            if(this.cmdKeydown){
                this.$set(dataV,'selected',true);
            }else{
                this.$router.push('/apps/data/visualize/view/'+dataV.id)
            }
        },
        containerKeydown(e){
            if(e.key==='Control'||e.key==='Meta'){
                this.cmdKeydown=true;
                e.preventDefault();
            }
        },
        containerKeyup(e){
            if(e.key==='Control'||e.key==='Meta'){
                this.cmdKeydown=false;
            }
        },
        containerMousedown(e){
            if(this.cmdKeydown){
                return;
            }
            this.$set(this,"containerDragBox",{
                sx: e.clientX,
                sy: e.clientY,
                ex: undefined,
                ey: undefined,
            });
        },
        containerMousemove(e){
            if(this.cmdKeydown){
                return;
            }
            if(this.containerDragBox){
                this.containerDragBox.ex=e.clientX;
                this.containerDragBox.ey=e.clientY;
            }
        },
        containerMouseup(){
            if(this.cmdKeydown){
                return;
            }
            if(this.containerDragBox){
                this.$refs.items && this.$refs.items.forEach(item=>{
                    let rect = item.getBoundingClientRect();
                    let selected = (
                        rect.left  >= Math.min(this.containerDragBox.sx,this.containerDragBox.ex)&&
                        rect.right <= Math.max(this.containerDragBox.sx,this.containerDragBox.ex)&&
                        rect.top   >= Math.min(this.containerDragBox.sy,this.containerDragBox.ey)&&
                        rect.bottom<= Math.max(this.containerDragBox.sy,this.containerDragBox.ey)
                    );
                    this.$set(this.dataVList[this.$refs.items.indexOf(item)],'selected',selected);
                })

                this.containerDragBox = undefined;
            }
        },
        doHtml2canvas(){
            let self = this;

            CanvasUtil.html2canvas(this.$refs.container).then(function(canvas) {
                self.dataVList.push({
                    thumbnail:canvas.toDataURL("image/png"),
                    selected:false,
                });
                self.dataVList.push({
                    thumbnail:CanvasUtil.scale(canvas,400,300).toDataURL("image/png"),
                    selected:false,
                });
            });
        }
    }
}
</script>

<style scoped lang="scss">

    .slide-fade-enter-active {transition: all .5s ease;}
    .slide-fade-leave-active {transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);}
    .slide-fade-enter, .slide-fade-leave-to{transform: translateX(5px);opacity: 0;}

    .drag-box{
        position: absolute;
        z-index: 1;
        border: 1px dashed #ff4d4f;
    }
    .container{
        position: relative;
        padding: 40px 0 100px;
        width: 100%;
        min-height: calc(100vh - 230px);

        .box{
            width: 848px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;

            & > .item{
                width: 202px;
                height: 188px;
                margin: 10px 5px 0;
                cursor: pointer;
                text-align: center;
                font-size: 16px;
                line-height: 36px;

                .border{
                    width: 202px;
                    height: 152px;
                    border: 1px solid #d9d9d9;
                    border-radius: 6px;
                    user-select: none;
                    transition: border-color 0.3s ease;
                    overflow: hidden;
                }

                &.selected,
                &:hover{
                    .border {
                        border-color: #1890ff;
                    }
                }

                .blank{
                    background-color: white;
                    width: 100%;
                    margin-top: 25px;
                    text-align: center;
                    line-height: 100px;
                    font-size: 24px;
                }
            }
            & > .add{
                text-align: center;
                background-color: #fafafa;
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                height: 152px;

                .icon{
                    font-size: 48px;
                    margin-top: 38px;
                }
                .text{
                    font-size: 20px;
                    margin-top: 10px;
                }

                &:hover{
                    border-color: #1890ff;
                }
            }
        }
    }
</style>
