<template>
    <nk-card>
        <nk-form :col="def.col">
            <nk-form-item v-for="item in def.items"  :title="item.name" :key="item.key">
                <component :is="item.inputType" v-model="value"></component>
                <component :is="item.inputType" v-model="value" slot="edit" edit="editMode"></component>
            </nk-form-item>
        </nk-form>
    </nk-card>
</template>

<script>
import Mixin from "./Mixin";
export default {
    mixins:[new Mixin({})],
    data(){
        return {
            value:12334222
        }
    },
    created() {
        console.log(this.def)
    }
}
</script>

<style scoped>

</style>