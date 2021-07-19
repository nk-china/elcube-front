<template>
    <a-config-provider :locale="zh_CN">
        <router-view class="router-view"></router-view>
    </a-config-provider>
</template>
<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN';
export default {
    name: 'App',
    data() {
        return {
            zh_CN,
        };
    },
};
</script>
<style  lang="scss">
</style>
