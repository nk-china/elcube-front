<template>
    <nk-form ref="form" :col="2" :edit="editMode">
        <nk-form-item term="交易类型">
            {{doc.def && doc.def.docType}} | {{doc.def && doc.def.docName}}
        </nk-form-item>
        <nk-form-item term="交易伙伴">
            <router-link v-if="doc.partnerId" :to="`/apps/partners/detail/${doc.partnerId}`">{{doc.partnerName}}</router-link>
            <span v-else style="color: rgba(0, 0, 0, 0.45);">&lt;未选择&gt;</span>
        </nk-form-item>
        <nk-form-item term="交易编号">
            <span v-if="doc.docNumber">{{doc.docNumber}}</span>
            <span v-else style="color: rgba(0, 0, 0, 0.45);">&lt;未编号&gt;</span>
        </nk-form-item>
        <nk-form-item term="交易描述"
                      :validateFor="doc.docName"
                      :message="`请输入交易描述`"
                      required
                      len
                      :max="20"
                      :lenMessage="`交易描述1-20个字`">
            {{doc.docName}}
            <a-input v-model="doc.docName" slot="edit" allowClear ></a-input>
        </nk-form-item>
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