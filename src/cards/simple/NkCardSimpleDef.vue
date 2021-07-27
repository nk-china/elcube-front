<template>
    <a-card :title="`${card.cardName}配置`">
        <nk-form :col="1" :edit="editMode">
            <nk-form-item title="字段">
                {{def.field}}
                <a-input v-model="def.field" slot="edit" />
            </nk-form-item>
        </nk-form>
    </a-card>
</template>

<script>
import MixinDef from "./../MixinDef";
export default {
    mixins:[new MixinDef({field:"test"})],
    created() {
    }
}
</script>

<style scoped>

</style>