<template>
    <div class="cycle">
        <a-card title="创建">
            <nk-form :col="1" :edit="editMode">
                <nk-form-item term="beforeCreate">
                    <span>
                        <a-button type="link" size="small">NkFawDocCreateProcessor</a-button>
                        <a type="link">
                            <a-icon type="close" />
                        </a>
                    </span>
                    <a-dropdown :trigger="['click']" style="margin-left: 10px;">
                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <a-icon type="plus-square" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a href="javascript:;">1st menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">2nd menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">3rd menu item</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </nk-form-item>
                <nk-form-item term="beforeCardsCreate">
                    <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <a-icon type="plus-square" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a href="javascript:;">1st menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">2nd menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">3rd menu item</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </nk-form-item>
                <nk-form-item term="afterCardsCreated">
                    <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <a-icon type="plus-square" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a href="javascript:;">1st menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">2nd menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">3rd menu item</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </nk-form-item>
                <nk-form-item term="afterCreated">
                    <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            <a-icon type="plus-square" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item>
                                <a href="javascript:;">1st menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">2nd menu item</a>
                            </a-menu-item>
                            <a-menu-item>
                                <a href="javascript:;">3rd menu item</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </nk-form-item>
            </nk-form>
        </a-card>
        <a-card title="计算">
            <nk-form :col="1">
                <nk-form-item term="beforeCardsCalculate">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterCardsCalculated">
                    <a-select size="small"></a-select>
                </nk-form-item>
            </nk-form>
        </a-card>
        <a-card title="更新">
            <nk-form :col="1">
                <nk-form-item term="beforeUpdate">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="beforeCardsUpdate">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterCardsUpdated">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterFuncExecuted">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterUpdated">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterStateChanged">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterTransactionCommit">
                    <a-select size="small"></a-select>
                </nk-form-item>
            </nk-form>
        </a-card>
        <a-card title="复制">
            <nk-form :col="1">
                <nk-form-item term="afterCopied">
                    <a-select size="small"></a-select>
                </nk-form-item>
            </nk-form>
        </a-card>
        <a-card title="删除">
            <nk-form :col="1">
                <nk-form-item term="beforeDelete">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterDeleted">
                    <a-select size="small"></a-select>
                </nk-form-item>
                <nk-form-item term="afterTransactionCommit">
                    <a-select size="small"></a-select>
                </nk-form-item>
            </nk-form>
        </a-card>
    </div>
</template>

<script>
export default {
    props:{
        editMode:Boolean,
        docDef:Object
    },
}
</script>

<style scoped lang="scss">
    ::v-deep.cycle{
        .term{
            min-width: 200px;
        }
    }
</style>