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
    <a-card title="文档" class="doc">
        <a slot="extra" v-if="editMode" @click="mavonEdit = true" style="font-size: 12px;">编辑</a>
        <div @click="mavonEdit = editMode">
            <nk-empty v-if="!mavonEdit && !docDef.markdown" :data="docDef.markdown" style="margin: 40px 0;"></nk-empty>
            <mavon-editor v-else
                          v-model="docDef.markdown"
                          :subfield="false"
                          :toolbarsFlag="mavonEdit"
                          :defaultOpen="mavonEdit?'edit':'preview'"
                          :toolbars="markdownOption"
                          style="min-height: 360px;box-shadow:none;"
                          :style="mavonEdit?'':'box-shadow:none;'"
                          @click="mavonEdit=true"
            />
        </div>
    </a-card>
</template>

<script>

const markdownOption = {
    bold: true, // 粗体
    italic: true, // 斜体
    header: true, // 标题
    underline: true, // 下划线
    strikethrough: true, // 中划线
    mark: true, // 标记
    superscript: true, // 上角标
    subscript: true, // 下角标
    quote: true, // 引用
    ol: true, // 有序列表
    ul: true, // 无序列表
    link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    readmodel: false, // 沉浸式阅读
    htmlcode: true, // 展示html源码
    help: true, // 帮助
    undo: true, // 上一步
    redo: true, // 下一步
    trash: false, // 清空
    save: false, // 保存（触发events中的save事件）
    navigation: false, // 导航目录
    alignleft: true, // 左对齐
    aligncenter: true, // 居中
    alignright: true, // 右对齐
    subfield: true, // 单双栏模式
    preview: false, // 预览
};

export default {
    props:{
        editMode:Boolean,
        docDef:Object,
        docOptions:Object,
        card:Object
    },
    data(){
        return {
            markdownOption,
            mavonEdit:false,
        }
    },
    created() {
    },
    methods:{
    }
}
</script>

<style scoped>

</style>