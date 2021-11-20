<template>
    <div class="search-box">
        <div>
            <slot class="nk-search-box-item"></slot>
        </div>
        <div>
            <slot name="more"></slot>
        </div>
    </div>
</template>

<style scoped lang="less">
    .search-box{
        margin-bottom: 10px;
    }
    /*.search-box.expand .actions{*/
    /*    width: auto;*/
    /*}*/
    .search-box > div{
        display: flex;
        flex-wrap: wrap;

        //> *{
        //    margin-top: 5px;
        //}
    }
    ::v-deep.nk-search-box-item{
    }
</style>
