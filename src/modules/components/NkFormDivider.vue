<template>
    <div class="nk-form-divider">
        <label v-if="term||title" class="l">
            <b>{{term||title}}</b>
        </label>
    </div>
</template>

<script>
export default {
    name: "NkFormDivider",
    props: {
        term: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: false
        },
    }
}
</script>

<style scoped lang="less">
div.nk-form-divider{
    position:relative;width: 100%;height:1px;background-color: rgba(0, 0, 0, 0.2);margin:20px 30px 25px 30px;

    label.l{
        position: absolute;top:-10px;left: 80px;background-color: #fff;padding: 0 10px;font-size: 12px;
    }
}

</style>
