<template>
    <div class="nk-static-layout">
        <div class="toolbar"></div>
        <div class="content"></div>
    </div>
</template>

<script>
export default {
name: "NkDefineLayout"
}
</script>

<style scoped lang="less">
    .nk-static-layout{
        height: calc(100vh - 120px);

        .toolbar{
            height: 40px;
            background: #fff;
            border-bottom: 1px solid #e8e8e8;
        }
        .content{
            height: calc(100vh - 160px);
        }
    }
</style>