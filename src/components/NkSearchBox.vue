<template>
    <div class="search-box">
        <div>
            <slot></slot>
        </div>
        <div>
            <slot name="more"></slot>
        </div>
    </div>
</template>

<style scoped>
    .search-box{
        margin-bottom: 10px;
    }
    /*.search-box.expand .actions{*/
    /*    width: auto;*/
    /*}*/
    .search-box > div{
        display: flex;
        flex-wrap: wrap;
    }
</style>
