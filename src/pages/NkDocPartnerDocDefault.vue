<template>
    <nk-card class="card" title="交易伙伴配置">
        <nk-edit-slot :edit-mode="editMode" :options="{style:{width:'100%'}}">
            {{def.refObjectTypeOptions}}
            <a-input type="textarea" slot="edit" v-model="def.refObjectTypeOptions"></a-input>
        </nk-edit-slot>
    </nk-card>
</template>

<script>
export default {
    props:{
        editMode:Boolean,
        def:Object
    },
    created() {
    },
    mounted() {
    }
}
</script>