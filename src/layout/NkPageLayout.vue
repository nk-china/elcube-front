<template>
    <a-spin class="nk-page-layout" :spinning="spinning">
        <div class="nk-page-layout-header" :class="!layoutConfig.helperVisible && showPageNav?'':'page-nav'">
            <nk-sticky :stickyTop="-50" v-if="showPageBar" :z-index="5">
                <div class="nk-page-layout-stick" :class="!layoutConfig.helperVisible && showPageNav?'':'page-nav'" style="padding-top: 60px;">
                    <div>
                        <span class="ant-page-header-heading-title">{{title}}</span>
                        <span class="ant-page-header-heading-sub-title">{{subTitle}}</span>
                    </div>
                    <slot name="action"></slot>
                </div>
            </nk-sticky>
            <slot name="top"></slot>
            <slot name="custom"></slot>
            <a-page-header
                v-if="!$slots.custom"
                :title="title"
                :breadcrumb="breadcrumbsData"
                :sub-title="subTitle"
                class="nk-page-layout-limit"
            >
                <slot v-if="!loading" name="title" slot="title"></slot>
                <slot v-if="!loading" name="tags" slot="tags"></slot>

                <slot v-if="!loading" name="footer" slot="footer"></slot>
                <slot v-if="!loading" name="avatar" slot="avatar"></slot>
                <slot v-if="!loading" name="backIcon" slot="backIcon"></slot>
                <slot v-if="!loading" name="action" slot="extra"></slot>
                <a-row v-if="!loading">
                    <a-col :span="18">
                        <slot name="content"></slot>
                    </a-col>
                    <a-col :span="6">
                        <slot name="extra"></slot>
                    </a-col>
                </a-row>
                <a-skeleton :loading="loading"></a-skeleton>
            </a-page-header>
        </div>
        <div style="position: relative;">
            <div class="nk-page-layout-content nk-page-layout-limit" :class="!layoutConfig.helperVisible && showPageNav?'':'page-nav'">
                <a-card v-if="loading" class="nk-page-layout-card">
                    <a-skeleton avatar />
                </a-card>
                <a-card v-if="loading" class="nk-page-layout-card">
                    <a-skeleton />
                </a-card>
                <a-card v-if="loading" class="nk-page-layout-card">
                    <a-skeleton />
                </a-card>
                <slot v-if="!loading"></slot>
            </div>
            <div class="content-nav" :class="!layoutConfig.helperVisible && showPageNav?'':'page-nav'">
                <slot name="nav" />
            </div>
        </div>
    </a-spin>
</template>

<script>
import NkSticky from "../components/NkSticky";
import {mapGetters} from "vuex";

export default {
    name: "NkPageLayout",
    components: {
        NkSticky
    },
    props: {
        'title': String,
        'subTitle': String,
        'loading': Boolean,
        'spinning':Boolean,
        breadcrumbs: Array,
        showPageNav: {
            type:Boolean,
            default:false
        },
        showPageBar: {
            type:Boolean,
            default:true
        },
    },
    created(){
    },
    computed:{
        ...mapGetters('User',[
            'user'
        ]),
        ...mapGetters('NkDoc',[
            'layoutConfig'
        ]),
        breadcrumbsData(){
            let routes = [];
            if(this.breadcrumbs){
                routes = this.breadcrumbs;
            }else{
                this.$route.matched.forEach(r=>{
                    let path = (r.components.default && (r.parent?r.path.substr(r.parent.path.length):r.path))||'';
                    routes.push({
                        path:path,
                        breadcrumbName:(r.meta && r.meta.title) || r.name
                    })
                });
            }
            return {
                props: {
                    routes
                }
            }
        }
    },
    data(){
        return {
        }
    },methods:{

        onStick(data) {
            console.log(data);
        },
    }
}
</script>

<style lang="scss" scoped>


.nk-page-layout{

    font-size: 12px;

    .ant-page-header{
        font-size: 13px;
    }

    .ant-statistic{
        .ant-statistic-title{
            font-size: 13px;
        }
        .ant-statistic-content{
            height: 32px;
            .ant-statistic-content-value{
                font-size: 18px;
            }
        }
    }

    .ant-form-item{
        margin-bottom: 12px;
        label{
            font-size: 12px;
        }
        .ant-form-item-label{
            line-height: 29.9999px;
        }
        .ant-form-item-control{
            line-height: 30px;
        }
    }

    .vxe-toolbar{
        height: 36px;
        padding-bottom: 8px;
    }

    .vxe-table--header{
        background: #fafafa ;
    }
    .vxe-row-has-error{
        color: crimson;
    }

    .nk-search-divider{
        font-size: 10px;
        font-weight: 400;
        color: #ccc;
        margin: 4px 0 10px;
    }

    .nk-search-box-more{
        width:120px;
        .ant-select-selection--multiple,
        .ant-select-selection--multiple:focus,
        .ant-select-selection--multiple:active{
            cursor: pointer !important;
            border: none !important;
        }
        .ant-select-selection__placeholder{
            display: block !important;
            color: rgba(0, 0, 0, 0.65);
        }
        .ant-select-selection__placeholder+ul{
            height: 0;
            overflow: hidden;
        }
    }

    &.mini{
        .ant-card{
            .ant-card-head{
                min-height: 24px;
                .ant-card-head-title{
                    font-size: 14px;
                    padding: 12px 0;
                }
            }
            .ant-card-body{
                padding: 16px;
            }
        }
    }
    ::v-deep .nk-page-layout-header{
        background-color: #ffffff;
        border-bottom: 1px solid #e8e8e8;
        //min-width: 800px;

        .ant-breadcrumb{
            margin: 4px 0;
        }
        .ant-page-header-heading{
            margin: 16px 0 8px;
        }

        .ant-page-header{
            padding: 16px 332px 16px 32px;
        }
    }
    .nk-page-layout-content{
        padding: 24px;
        //min-width: 800px;
        margin-right: 300px;
    }
    .nk-page-layout-limit{
    }

    .nk-page-layout-stick{
        display: flex;
        justify-content: space-between;
        height: 100px;
        background:white;
        border-bottom: 1px solid #e8e8e8;
        width: 100%;
        padding: 10px 332px 10px 32px;
        box-shadow:0 1px 4px rgba(0, 21, 41, 0.08);
    }
    .content-nav{
        position: absolute;
        top: 30px;
        right: 0;
        width: 300px;
    }


    .nk-page-layout-content.page-nav{
        margin-right: 0;
    }
    ::v-deep.nk-page-layout-header.page-nav .ant-page-header{
        padding-right: 32px;
    }
    .nk-page-layout-stick.page-nav{
        padding-right: 32px;
    }
    .content-nav.page-nav{
        display: none;
    }
}


@media screen and ( max-width: 1400px ){
    .nk-page-layout-content{
        margin-right: 0;
    }
    ::v-deep.nk-page-layout-header .ant-page-header{
        padding-right: 32px;
    }
    .nk-page-layout-stick{
        padding-right: 32px;
    }
    .content-nav{
        display: none;
    }
}
</style>
