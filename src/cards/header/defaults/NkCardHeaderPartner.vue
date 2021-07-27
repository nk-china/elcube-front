<template>
    <nk-form ref="form" size="small" :col="2" :edit="editMode" >
        <nk-form-item v-if="doc" term="交易类型" :col="2">
            {{doc && doc.docType}} | {{doc.def && doc.def.docName}}
        </nk-form-item>
        <nk-form-item term="名称"
                      :validateFor="doc.partnerName"
                      :required="true"
                      message="请输入交易伙伴名称">
            {{data.partnerName}}
            <a-input v-if="$route.params.mode==='create'" slot="edit" size="small" v-model="data.partnerName" allowClear style="max-width: 180px;"></a-input>
        </nk-form-item>
        <nk-form-item term="类型"
                      :validateFor="data.partnerType"
                      :required="true"
                      message="请选择类型">
            {{data.partnerType | nkFromList(def.partnerTypes)}}
            <a-select v-if="$route.params.mode==='create'" slot="edit" size="small"
                      v-model="data.partnerType"
                      style="min-width:120px;"
                      placeholder="请选择类型"
                      :options="def.partnerTypes"
            >
            </a-select>
        </nk-form-item>
<!--        <nk-form-item term="角色">-->
<!--            <span v-if="!doc.refObject.roles || !doc.refObject.roles.length">暂无角色</span>-->
<!--            <a-tag v-for="role in doc.refObject.roles"-->
<!--                   :key="role.docType"-->
<!--                   :color="-->
<!--                                    role.docType === (doc.definedRefObject && doc.definedRefObject.partnerRole) ||-->
<!--                                    role.docType === doc.docType-->
<!--                                    ?'blue':''-->
<!--                                "-->
<!--                   @click="switchRole(role)"-->
<!--            >-->
<!--                {{role.docName}}-->
<!--            </a-tag>-->
<!--        </nk-form-item>-->
        <nk-form-item term="创建时间">{{doc.createdTime | nkDatetimeFriendly}}</nk-form-item>
        <nk-form-item term="更新时间">{{doc.updatedTime | nkDatetimeFriendly}}</nk-form-item>
        <nk-form-item term="备注" :col="2">
            {{doc.docDesc||'暂无内容'}}
            <a-textarea v-model="doc.docDesc" slot="edit" :auto-size="{ minRows: 3, maxRows: 10 }"></a-textarea>
        </nk-form-item>
    </nk-form>
</template>

<script>
import Mixin from "../../Mixin";
export default {
    mixins:[new Mixin()],
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