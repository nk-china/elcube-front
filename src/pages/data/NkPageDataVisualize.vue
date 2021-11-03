<template>
    <nk-page-layout title="数据可视化" class="layout">

        <div slot="action" style="margin: 0 10px;">
            <a-button-group>
                <a-button type="primary">轮播</a-button>
                <a-button>生成报告</a-button>
            </a-button-group>
        </div>

        <div ref="container" class="container" @mousedown="containerMousedown" @mousemove="containerMousemove" @mouseup="containerMouseup" @mouseleave="containerMouseup">
            <div class="box">

                <div v-for="(dataV,index) in dataVList" :key="index" class="item" ref="items" :class="dataV.selected?'selected':''" @click="itemClick(dataV)">
                    <img :src="dataV.thumbnail" width="200" />
                </div>

                <div class="item add" @click="doHtml2canvas">
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


    </nk-page-layout>
</template>

<script>

import CanvasUtil from "@/utils/CanvasUtil";

export default {
    data(){
        return {
            dataVList:[],
            cmdKeydown:false,
            containerDragBox:undefined
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
    },
    destroyed() {
        document.removeEventListener("keydown",this.containerKeydown);
        document.removeEventListener("keyup",this.containerKeyup);
    },
    mounted() {
    },
    methods:{
        itemClick(dataV){
            if(this.cmdKeydown){
                dataV.selected = true;
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
                height: 152px;
                margin: 10px 5px 0;
                border: 1px solid #d9d9d9;
                border-radius: 6px;
                cursor: pointer;
                user-select: none;
                transition: border-color 0.3s ease;
                overflow: hidden;

                &.selected,
                &:hover{
                    border-color: #1890ff;
                }
            }
            & > .add{
                text-align: center;
                background-color: #fafafa;
                border: 1px dashed #d9d9d9;

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
