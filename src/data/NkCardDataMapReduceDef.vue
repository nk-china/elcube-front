<template>
    <nk-def-card>
        <nk-form :col="1" :edit="editMode">
            <nk-form-item title="前置任务">
                {{def.preTask}}
                <a-input slot="edit" v-model="def.preTask" style="width:240px;"></a-input>
            </nk-form-item>
            <nk-form-item title="程序类型">
                {{def.programType}}
                <a-select slot="edit" v-model="def.programType" style="width:240px;">
                    <a-select-option key="sql">SQL Command</a-select-option>
                    <a-select-option key="service">Java Service</a-select-option>
                </a-select>
            </nk-form-item>
            <template v-if="def.programType==='sql'">
                <nk-form-item title="数据源">
                    {{def.dataSource}}
                    <a-select slot="edit" v-model="def.dataSource" style="width:240px;">
                        <a-select-option key="ts5">ts5</a-select-option>
                    </a-select>
                </nk-form-item>
                <nk-form-item title="数据命令">
                    {{def.dataCommand}}
                    <a-textarea slot="edit" v-model="def.dataCommand" :rows="5"></a-textarea>
                </nk-form-item>
            </template>
            <template v-else>
                <nk-form-item title="服务">
                    {{def.service}}
                    <a-select slot="edit" v-model="def.service" style="width:360px;">
                    </a-select>
                </nk-form-item>
            </template>
            <nk-form-item title="数据归集主键">
                {{def.dataKey}}
                <nk-sp-el-editor slot="edit" v-model="def.dataKey"></nk-sp-el-editor>
            </nk-form-item>
            <nk-form-item title="数据归集模版">
                {{def.dataMapping}}
                <nk-sp-el-template-editor slot="edit" v-model="def.dataMapping"></nk-sp-el-template-editor>
            </nk-form-item>
        </nk-form>
    </nk-def-card>
</template>

<script>
import MixinDef from "@/cards/MixinDef";
export default {
    mixins:[MixinDef({
        dataSource:undefined,
        dataCommand:undefined,
    })]
}
</script>

<style scoped>

</style>