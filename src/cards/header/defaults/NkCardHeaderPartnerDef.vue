<template>
    <a-card :title="`${card.cardName}配置`">
        <nk-edit-slot :edit-mode="editMode" :options="{style:{width:'100%'}}">
            {{def}}
            <a-input slot="edit" type="textarea" v-model="json"></a-input>
        </nk-edit-slot>
    </a-card>
</template>

<script>
import MixinDef from "../../MixinDef";
export default {
    mixins:[new MixinDef()],
    computed:{
        json:{
            get(){
                return JSON.stringify(this.def);
            },
            set(value){
                try{
                    this.def = JSON.parse(value);
                }catch (e){
                    console.warn(e)
                    // eslint-disable-line
                }
            }
        }
    },
    created() {
        console.log(this.def)
    }
}
</script>

<style scoped>

</style>