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
    <transition name="slide-fade">
        <div class="preview" v-if="value">
            <div class="background" @click="hide"></div>
            <div class="foreground">
                <nk-page-doc-detail :params="params" :preview="true">
                    <nk-doc-link :doc="params" type="primary" slot="buttons" @click="hide"><a-icon type="enter" /></nk-doc-link>
                </nk-page-doc-detail>
            </div>
        </div>
    </transition>
</template>

<script>
import NkPageDocDetail from "./NkPageDocDetail";
export default {
    components:{
        NkPageDocDetail
    },
    props:{
        params:Object,
        value:{
            type:Boolean,
            default:false
        }
    },
    mounted() {
    },
    methods:{
        hide(){
            this.$emit("input",false);
            this.$emit("close");
        }
    }
}
</script>

<style scoped lang="less">
    .preview{
        position: fixed;
        z-index: 11;
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
            width: 65%;
            min-width: 840px;
            max-width: 1440px;
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