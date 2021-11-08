<template>
    <nk-card>
        <nk-form :col="1">
            <nk-form-item title="运行状态">
                {{data.state}}
            </nk-form-item>
            <nk-form-item title="条目数量">
                {{ data.records }}
            </nk-form-item>
            <nk-form-item title="程序类型">
                {{ def.programType }}
            </nk-form-item>
            <nk-form-item title="数据命令">
                {{ def.dataCommand }}
            </nk-form-item>
            <nk-form-item title="数据主键">
                {{ def.dataKey }}
            </nk-form-item>
            <nk-form-item title="数据映射">
                {{ def.dataMapping }}
            </nk-form-item>
        </nk-form>
    </nk-card>
</template>

<script>
import Mixin from "@/cards/Mixin";
export default {
    mixins:[Mixin({})]
}
</script>

<style scoped>

</style>