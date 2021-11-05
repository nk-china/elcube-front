<template>
    <div class="nk-application-logo">
        <a href="http://www.nkpro.cn" target="_blank">
            <img :src="img" alt=""/>
        </a>
    </div>
</template>

<script>

import img from '@/assets/nk.logo.png';

export default {
    data(){
        return {
            img
        }
    }
}
</script>

<style lang="less">
.nk-application-logo {
    user-select: none;
    margin: 16px;
    text-align: center;
    height: 48px;

    img{
        width: 50px;
        transition: 0.2s width;
    }
}
.ant-layout-sider-collapsed{
    .nk-application-logo{
        height: 30px;
        img{
            width: 30px;
        }
    }
}
</style>