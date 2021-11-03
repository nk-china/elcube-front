<template>
    <nk-page-layout title="数据可视化" class="layout">

        <div slot="action" style="margin: 0 10px;">
            <a-button-group>
                <a-button type="primary">轮播</a-button>
                <a-button>生成报告</a-button>
            </a-button-group>
        </div>

        <div ref="container" class="container">

            <div v-for="(canvas,index) in dataVList" :key="index" class="item">
                <img :src="canvas.thumbnail" width="200" />
            </div>

            <div class="item add" style="user-select: none;float: none;" @click="doHtml2canvas">
                <span role="button" tabindex="0" class="ant-upload">
                    <div>
                        <a-icon type="plus" class="icon" />
                        <div class="text">创建</div>
                    </div>
                </span>
            </div>
        </div>

    </nk-page-layout>
</template>

<script>

import html2canvas from "html2canvas";

export default {
    data(){
        return {
            dataVList:[]
        }
    },
    created(){
    },
    mounted() {
    },
    methods:{
        doHtml2canvas(){
            let self = this;
            html2canvas(document.body).then(function(canvas) {

                const dw = 800,dh = 600;
                const target = document.createElement("canvas");
                target.setAttribute('width', dw.toString());
                target.setAttribute('height',dh.toString());

                let sx = 0,sy = 0,sw,sh;
                if(canvas.width*dh>canvas.height*dw){
                    sx = canvas.width - canvas.height;
                    sw = canvas.height * dw/dh;
                    sh = canvas.height;
                }else{
                    sy = canvas.height - canvas.width;
                    sw = canvas.width;
                    sw = canvas.width * dh/dw;
                }

                const ctx=target.getContext("2d");
                ctx.drawImage(canvas,sx,sy,sw, sh,0,0,dw,dh);


                self.dataVList.push({
                    thumbnail:target.toDataURL("image/png")
                });
            });
        }
    }
}
</script>

<style scoped lang="scss">
    .container{
        width: 848px;
        margin: 40px auto;
        display: flex;
        flex-wrap: wrap;

        & > .item{
            width: 202px;
            height: 152px;
            margin: 10px 5px 0;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            transition: border-color 0.3s ease;
            overflow: hidden;

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
</style>
