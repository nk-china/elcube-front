<template>
    <span class="nk-required-mark" />
</template>

<script>
export default {
    name: "NkRequiredMark"
}
</script>

<style scoped>
    .nk-required-mark{
    }
    .nk-required-mark:before{
        color: #f5222d;
        content: "*";
        line-height: 15px;
    }
</style>