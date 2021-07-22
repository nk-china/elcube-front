<template>
    <a-card title="业务流">
        <nk-form :col="1" :edit="editMode">
            <nk-form-item term="前序单据">
                <a-input size="small" style="width: 100px;"></a-input>
            </nk-form-item>
            <nk-form-item term="前序单据状态">
                <a-input size="small" style="width: 220px;"></a-input>
            </nk-form-item>
        </nk-form>
    </a-card>
</template>

<script>
export default {
    props:{
        editMode:Boolean,
        docDef:Object
    },
}
</script>

<style scoped lang="scss">
    ::v-deep{
    }
</style>