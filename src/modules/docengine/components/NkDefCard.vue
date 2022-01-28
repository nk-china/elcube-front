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
    <a-card size="default"
            :title="title || (cardComponent.card.cardName + '配置')"
            :extra="extra"
            :loading="loading"
            :hoverable="true"
            :headStyle="headStyle"
            :bodyStyle="bodyStyle"
            :bordered="true"
    >

        <slot slot="title" name="title"></slot>
        <slot slot="actions" name="actions"></slot>
        <slot slot="cover" name="cover"></slot>

        <div slot="extra">
            <slot name="extra"></slot>
            <a @click="showJson = !showJson" style="font-size: 12px">切换</a>
            <nk-help-link v-if="cardComponent.$docs" style="margin-left: 5px;" />
        </div>
        <codemirror v-if="showJson"
                    ref="codemirror2"
                    :options="codemirrorOptions"
                    :value="json"
                    @input="onCodeChange"
        ></codemirror>
        <slot v-else></slot>
        <span v-if="error" style="color: #aa2222">{{error}}</span>
    </a-card>
</template>

<script>

export default {
    props:{
        title:String,
        loading:{
            type:Boolean,
            default:false
        },
        extra:String,
        headStyle:Object,
        bodyStyle:Object,
        editMode:{
            type:Boolean,
            default:false
        },
        component:Object
    },
    data(){
        return {
            showJson : false,
            codemirrorOptions: {
                mode: "javascript",
                theme: "ambiance",
                lineWrapping: false,
                indentUnit: 4,
                tabSize: 4,
                lineNumbers: true,
                extraKeys: {
                    'Ctrl-.': 'autocomplete'
                }
            },
            error: undefined
        }
    },
    computed:{
        cardComponent(){
            return this.component || this.$parent;
        },
        json(){
            return (this.cardComponent.card && this.cardComponent.card.config && JSON.stringify(this.cardComponent.card.config,null,4)) || ''
        }
    },
    created(){
    },
    methods:{
        onCodeChange(v){
            try{
                this.cardComponent.card.config = JSON.parse(v);
                this.error = undefined
            }catch (e){
                this.error = e
            }
        }
    }
}
</script>

<style scoped lang="less">
::v-deep.vue-codemirror{
    width: 100%;
    height: 300px;

    .CodeMirror{
        height: 300px;
    }
    .CodeMirror-vscrollbar::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 6px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 5px;
    }
    .CodeMirror-vscrollbar::-webkit-scrollbar-thumb,
    .CodeMirror-hscrollbar::-webkit-scrollbar-thumb{
        /*滚动条里面小方块*/
        border-radius: 10px !important;
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        background   : #666 !important;
    }
    .CodeMirror-vscrollbar::-webkit-scrollbar-track,
    .CodeMirror-hscrollbar::-webkit-scrollbar-track{
        /*滚动条里面轨道*/
        box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
        border-radius: 10px !important;
        background   : #333 !important;
    }
}
</style>
