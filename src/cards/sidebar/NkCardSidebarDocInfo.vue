<template>
    <nk-card title="单据信息">
        <nk-form :col="1">
            <nk-form-item term="创建时间">{{doc.createdTime | nkDatetimeFriendly}}</nk-form-item>
            <nk-form-item term="更新时间">{{doc.updatedTime | nkDatetimeFriendly}}</nk-form-item>
            <nk-form-item term="单据版本">{{doc.defVersion}}</nk-form-item>
            <nk-form-item term="配置版本">{{doc.def.version}}</nk-form-item>
        </nk-form>
    </nk-card>
</template>

<script>
import Mixin from "./../Mixin";
export default {
    mixins:[new Mixin()],
}
</script>

<style scoped>

</style>