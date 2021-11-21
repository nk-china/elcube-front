<template>
    <nk-card>
        <nk-form :col="def.col||1" :edit="editMode">

            <template v-for="(item) in def.items" >
                <nk-form-divider
                    v-if="item.control >= 0 && item.inputType==='divider'"
                    :key="item.key"
                    :title="item.name"></nk-form-divider>
                <nk-form-item v-else :title="item.name" :key="item.key">
                    <component :is="item.inputType"
                               :slot="editMode?'edit':'default'"
                               :editMode="editMode"
                               v-model="data[item.key]"
                               :input-options="item.inputOptions"
                    ></component>
                </nk-form-item>
            </template>

        </nk-form>
    </nk-card>
</template>

<script>
import Mixin from "./Mixin";
export default {
    mixins:[new Mixin({})],
    data(){
        return {
        }
    },
    created() {
    }
}
</script>

<style scoped>

</style>