<!--
	This file is part of EAsis.
	EAsis is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	EAsis is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with EAsis.  If not, see <https://www.gnu.org/licenses/>.
-->
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
