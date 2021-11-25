<template>
    <nk-card>
        <nk-form ref="form" :col="def.col" :edit="editMode">

            <template v-for="(item) in def.items" >
                <nk-form-divider
                    v-if="item.control >= 0 && (item.inputType==='divider'||item.inputType==='-'||item.inputType==='--')"
                    :key="item.key"
                    :title="item.name"></nk-form-divider>
                <nk-form-item  v-else-if="item.control >= 0"
                               :key="item.key"
                               :title="item.name"
                               :default-if-edit-lost="false"
                               :col="item.col"
                               :edit="editMode && item.control > 0"

                               :validate-for="data[item.key]"
                               :required="item.required"
                               :len="item.inputOptions&&((!!item.maxLength)||(!!item.minLength))"
                               :min="item.inputOptions&&(item.inputOptions.min||item.inputOptions.minLength)"
                               :max="item.inputOptions&&(item.inputOptions.max||item.inputOptions.maxLength)"
                               :pattern="item.inputOptions&&item.inputOptions.pattern"
                               :message="item.message||(item.name +'校验不通过')"
                >
                    <component ref="items"
                               :is="item.inputType"
                               :slot="editMode && item.control > 0?'edit':'default'"
                               :editMode="editMode && item.control > 0"
                               v-model="data[item.key]"
                               :input-options="item.inputOptions"
                               @change="itemChange($event,item)"
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
    methods:{
        nk$editModeChanged(editMode){
            this.$refs.items && this.$refs.items.forEach(c=>{
                c.nk$editModeChanged &&c.nk$editModeChanged(editMode);
            });
        },
        itemChange(triggerEvent,item){
            if(item.calcTrigger){
                this.nk$calc({
                    triggerKey:item.key,
                    triggerEvent
                });
            }
        },
        hasError(){
            return this.$refs.form.hasError();
        }
    }
}
</script>

<style scoped>

</style>