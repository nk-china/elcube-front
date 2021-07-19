<template>
    <nk-card title="获取单据发生错误" v-if="exception">
        <div class="exception">
            <a-alert type="error">
            <ul slot="description">
                <li v-for="(line,index) in exception" v-html="line" :key="index"></li>
            </ul>
            </a-alert>
        </div>
    </nk-card>
</template>

<script>
export default {
    props:{
        exception:Array
    }
}
</script>

<style scoped lang="scss">

.exception{
    word-break:break-all;
    ul{
        margin: 10px;
        padding: 0;
        li{
            list-style: none;

            ::v-deep {
                > span{
                    padding-left: 20px;
                }

                .t{
                    padding-left: 0;
                }

                span.highlight{
                    color: #aa2222;
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>