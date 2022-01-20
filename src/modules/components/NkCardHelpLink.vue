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
    <a v-if="doc" class="helper-link" target="_blank" @click="openDocHelper">
        <a-icon type="question-circle"/>
        <slot v-if="false"></slot>
    </a>
    <a v-else-if="markdown" class="helper-link" target="_blank" @click="setMarkdown({markdown})">
        <a-icon type="question-circle"/>
        <slot v-if="false"></slot>
    </a>
    <a v-else-if="url" class="helper-link" target="_blank" :href="url">
        <a-icon type="question-circle"/>
        <slot v-if="false"></slot>
    </a>
</template>

<script>
import { mapMutations} from 'vuex';
export default {
    props:{
        doc:Object,
        component:Object,
        markdown:String,
        url:String
    },
    methods:{
        ...mapMutations('NkDoc',[
            'setMarkdown'
        ]),
        openDocHelper(){
            if(this.doc && this.doc.def.cards){
                let docName = '# '+this.doc.def.docName+'\n';
                let docBody = (this.doc.def.markdown||'');
                let items   = this.doc.def.cards.filter(card=>card.markdown).map(card=>{
                    return  '## '+card.cardName+ '\n' + (card.markdown||'')+ '\n';
                }).join('\n');

                let defaults= docBody || items ? '' : '`文档待完善`';
                let markdown = docName + docBody + '\n' + items + defaults;

                this.setMarkdown({markdown})
            }
        }
    }
}
</script>

<style scoped>
    a.helper-link{
        color: #595959;
    }
</style>
