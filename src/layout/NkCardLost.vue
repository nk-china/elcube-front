<template>
    <a-card class="card" :title="componentOptions.componentDesc||'<组件缺失>'">
        <a-alert type="error" :message="`组件${componentOptions.componentLost||''}没有找到，请检查`"></a-alert>
    </a-card>
</template>

<script>
export default {
    name: "NkComponentLosed",
    props:{
        componentOptions:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    mounted() {
        // const key = `open${Date.now()}`;
        // this.$notification.error({
        //   message: '错误',
        //   description:
        //     `组件${this.componentOptions.componentLost||''}没有找到，请检查`,
        //   duration: 10,
        //   style:{
        //     width:'450px',
        //     marginLeft: `${335 - 400}px`,
        //   },
        //   placement: 'topRight',
        //   btn: h => {
        //     return h(
        //       'a-button',
        //       {
        //         props: {
        //           type: 'primary',
        //         },
        //         on: {
        //           click: () => this.$notification.close(key),
        //         },
        //       },
        //       '我知道了',
        //     );
        //   },
        //   key
        // });
    }
}
</script>

<style scoped>

</style>
