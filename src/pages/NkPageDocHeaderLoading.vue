<template>
    <a-page-header title="业务详情"
                   :breadcrumb="breadcrumbs"
                   :sub-title="doc.docName"
    >
    </a-page-header>
</template>

<script>
export default {
    props:{
        loading:Boolean,

        user:Object,
        doc:Object,
        preview:Boolean,

        breadcrumbs:Object,

        history:Object,
        histories:Array,

        docState:String,
        availableStatus:Array,

        editMode:Boolean,
        docEditable:Boolean,
        statusEditable:Boolean,

        bpmTask:Object,
        docTypes:{
            type:Array,
            default(){
                return []
            }
        }
    },
    data(){
        return {
        }
    }
}
</script>

<style scoped>

</style>