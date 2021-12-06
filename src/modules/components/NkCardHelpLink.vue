<!--
	This file is part of ELCard.
	ELCard is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCard is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCard.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <a v-if="page" class="helper-link" target="_blank" @click="doSetDocumentPage('nkdn://define'+page)">
        <a-icon type="question-circle"/>
        <slot v-if="false"></slot>
    </a>
    <a v-else-if="nkOptions" class="helper-link" target="_blank" @click="doSetDocumentPage('nkdn://user/'+nkOptions.docType+'/'+nkOptions.component+'/'+nkOptions.version)">
        <a-icon type="question-circle"/>
        <slot v-if="false"></slot>
    </a>
    <a v-else class="helper-link">
        <a-icon type="question-circle"/>
        <slot v-if="false"></slot>
    </a>
</template>

<script>
import { mapActions} from 'vuex';
export default {
    props:{
        page:String,
        nkOptions:Object,
        markdown:String
    },
    methods:{
        ...mapActions('NkDoc',[
            'doSetDocumentPage'
        ])
    }
}
</script>

<style scoped>
    a.helper-link{
        color: #595959;
    }
</style>
