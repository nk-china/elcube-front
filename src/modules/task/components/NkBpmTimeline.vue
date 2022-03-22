<template>
    <a-timeline>
        <span slot="pendingDot"><a-icon type="clock-circle-o" style="font-size: 12px;" /></span>
        <span v-if="task" slot="pending" style="padding-left: 16px;">
            {{task.name}} 流转中...
            <slot name="assignee"></slot>
        </span>
        <a-timeline-item v-for="t in histories" :key="t.id">
            <p style="margin: 5px 0 20px;padding: 2px 0 0 15px;">
                {{t.name}}
                <span style="color: #ccc;padding-left: 10px;">{{ t.createTime | nkDatetimeFriendly}} </span>
            </p>
            <a-comment v-for="item in t.comments" :key="item.id">
                <a-avatar slot="avatar" size="small" style="color: #f56a00; background-color: #fde3cf;margin-left: 10px;">
                    {{ item.user && item.user.length > 2 ? item.user.substring(0,1) : item.user }}
                </a-avatar>
                <span slot="author" style="line-height: 24px;">
                    {{item.user || '匿名'}}
                </span>
                <span slot="datetime" style="line-height: 24px;">{{ item.time | nkDatetimeFriendly}}</span>
                <p slot="content">{{item.taskName}}{{ item.comment }}</p>
            </a-comment>
        </a-timeline-item>
    </a-timeline>
</template>

<script>
export default {
    name: "NkBpmTimeline",
    props:{
        task: {},
        histories: {
            type:Array,
            default(){
                return [];
            }
        }
    }
}
</script>

<style scoped lang="less">
::v-deep .ant-comment-inner{
    padding: 2px;
    .ant-comment-content-detail{
    }
}
</style>