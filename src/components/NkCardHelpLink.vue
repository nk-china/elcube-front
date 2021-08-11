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
