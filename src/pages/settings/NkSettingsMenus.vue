<template>
    <nk-page-layout title="菜单配置" :spinning="spinning">
        <a-button-group slot="action">
            <a-button type="primary" @click="submit">保存</a-button>
            <a-button type="default" @click="reset">重置</a-button>
        </a-button-group>
        <a-card>
            <vxe-toolbar>
                <template v-slot:buttons>
                    <vxe-button size="mini" @click="xTableAddRow()">增加菜单</vxe-button>
                    <vxe-button size="mini" @click="$refs.xTable.setAllTreeExpand(true)">全部展开</vxe-button>
                    <vxe-button size="mini" @click="$refs.xTable.clearTreeExpand()">全部收起</vxe-button>
                </template>
            </vxe-toolbar>
            <vxe-grid
                highlight-hover-row
                auto-resize
                size="mini"
                row-key
                ref="xTable"
                :columns="columns"
                :data="menus"
                :edit-config="{trigger: 'click', mode: 'row', showIcon: true}"
                :edit-rules="xValidRules"
                :tree-config="{children: 'children'}"
                @cell-menu="xMenuEvent"
                :menu-config="tableMenu"
                @menu-click="xMenuClick"
            ></vxe-grid>
            <div style="font-size: 12px;color:#595959;padding-top: 10px;">
                <p>Tips:</p>
                <ul style="padding-left: 25px;">
                    <li>表格标题单击右键可增加一级菜单</li>
                    <li>一级菜单不需要设置子标题</li>
                    <li>二级菜单不需要设置图标</li>
                    <li>图标参考地址：
                        <a href="https://antdv.com/components/icon-cn/" target="_blank">https://antdv.com/components/icon-cn/</a></li>
                    <li>分割线请在URL中使用'-'来表示</li>
                </ul>
            </div>
        </a-card>

        <a-modal :visible="modalVisible"
                 @ok="modalSubmit"
                 @cancel="modalVisible = false">
            <label slot="title">
                菜单扩展选项
                <nk-help-link page="custom-query-options"/>
            </label>
            <a-textarea style="height: 300px;" v-model="menuOptions" placeholder="使用JSON来配置自定义搜索等高级选项"></a-textarea>
            <div v-if="menuHasError" style="color: #f5222d;">{{menuHasError}}</div>
        </a-modal>
    </nk-page-layout>
</template>

<script>

import Sortable from "sortablejs";
import XEUtils from "xe-utils";
import NkUtil from "@/utils/NkUtil";

export default {

    data(){
        return {
            spinning: true,
            sortable: undefined,
            modalVisible:false,
            menu:{},
            menuOptions:'',
            menuHasError:undefined,
            tableMenu: {
                header:{
                    options: [
                        [
                            { code: 'add', name: '增加菜单', prefixIcon: 'fa fa-copy', visible: true, disabled: false }
                        ]
                    ]
                },
                body: {
                    options: [
                        [
                            { code: 'add', name: '增加子菜单', prefixIcon: 'fa fa-copy', visible: true, disabled: false },
                            { code: 'edit',name: '编辑扩展', visible: true, disabled: false },
                            { code: 'del', name: '移除',    visible: true, disabled: false }
                        ]
                    ]
                },
                visibleMethod({rowIndex,options}){
                    options[0][0].disabled=rowIndex===-1;
                    return true;
                }
            },
            columns:[
                { title: 'KEY',  field: 'menuId',            width:"15%", editRender:{name:'$input'},treeNode: true},
                { title: '菜单',  field: 'title',             width:"10%", editRender:{name:'$input'} },
                { title: '子标题', field: 'subTitle',         width:"15%", editRender:{name:'$input'} },
                { title: '图标',  field: 'icon',              width:"10%", editRender:{name:'$input'} },
                { title: '路径',  field: 'url',               width:"25%", editRender:{name:'$input'} },
                { title: '权限',  field: 'authorityOptions',  width:"15%", editRender:{name:'$input'} },
                { title: '#',                                width:"10%",
                    slots:{
                        default: ({row}, h) => {
                            return [
                                h(  'span',{
                                    class:{"drag-btn":true},
                                    style:{"margin-right":"10px"}
                                },[h('i',{class:{'vxe-icon--menu':true}})]),
                                h('a', {
                                    style:{"color":"#606266"},
                                    on: {
                                        click: ()=>{this.showModal(row);}
                                    }
                                },[h('i',{class:{'vxe-icon--edit-outline':true}})]),
                            ]
                        }
                    }
                },
            ],
            xValidRules:{
                menuId: [
                    { required: true, message: 'KEY必须填写' },
                    { validator({$table,row}){
                        let error = undefined;
                        $table.data.forEach(menu=>{
                            if(menu!==row && menu.menuId === row.menuId){
                                error = new Error('KEY 重复');
                            }
                            if(menu.children){
                                menu.children.forEach(menu=> {
                                    if (menu !== row && menu.menuId === row.menuId) {
                                        error = new Error('KEY 重复');
                                    }
                                });
                            }
                        });
                        return error;
                    }}
                ],
                title: [
                    { required: true, message: '标题必须填写' }
                ],
                url: [
                    { required: true, message: 'URL必须填写' }
                ],
                age: [
                    { pattern: '^[0-9]{0,3}$', message: '格式不正确' }
                ]
            },
            menus:[]
        }
    },
    created() {
        this.$nextTick(()=>{
            const xTable = this.$refs.xTable;
            this.sortable = Sortable.create(xTable.$el.querySelector('.body--wrapper>.vxe-table--body tbody'), {
                handle: '.drag-btn',
                onEnd: ({ item, oldIndex }) => {
                    const options = { children: 'children' }
                    const targetTrElem = item
                    const wrapperElem = targetTrElem.parentNode
                    const prevTrElem = targetTrElem.previousElementSibling
                    const tableTreeData = this.menus
                    const selfRow = xTable.getRowNode(targetTrElem).item
                    const selfNode = XEUtils.findTree(tableTreeData, row => row === selfRow, options)

                    //const wrapperRow = xTable.getRowNode(wrapperElem).item
                    if (prevTrElem) {
                        // 移动到节点
                        const prevRow = xTable.getRowNode(prevTrElem).item
                        const prevNode = XEUtils.findTree(tableTreeData, row => row === prevRow, options)
                        if (XEUtils.findTree(selfRow[options.children], row => prevRow === row, options)) {
                            // 错误的移动
                            const oldTrElem = wrapperElem.children[oldIndex]
                            wrapperElem.insertBefore(targetTrElem, oldTrElem)
                            return this.$XModal.message({ message: '不允许自己给自己拖动！', status: 'error' })
                        }
                        const currRow = selfNode.items.splice(selfNode.index, 1)[0]
                        if (xTable.isTreeExpandByRow(prevRow)) {
                            // 移动到当前的子节点
                            prevRow[options.children].splice(0, 0, currRow)
                        } else {
                            // 移动到相邻节点
                            prevNode.items.splice(prevNode.index + (selfNode.index < prevNode.index && selfNode.parent === prevNode.parent ? 0 : 1), 0, currRow)
                        }
                    } else {
                        // 移动到第一行
                        const currRow = selfNode.items.splice(selfNode.index, 1)[0]
                        tableTreeData.unshift(currRow)
                    }
                    // 如果变动了树层级，需要刷新数据
                    xTable.syncData();
                    console.log(tableTreeData)
                }
            })
        });
        this.reset();
    },
    methods:{
        xMenuEvent({ row }){
            this.$refs.xTable.setCurrentRow(row);
        },
        xMenuClick({menu,row}){
            switch (menu.code) {
                case 'add': this.xTableAddRow(row);break;
                case 'edit':this.showModal(row);break;
                case 'del': this.xTableDelRow(row);break;
                default:    this.$XModal.message({ message: `点击了 "${menu.name}"`, status: 'info' })
            }
        },
        xTableAddRow(row){
            let item = {};
            if(row){
                if(!row.children)
                    row.children=[];
                row.children.push(item);
            }else{
                this.menus.push(item);
            }
            this.$refs.xTable.syncData().then(()=>{
                this.$refs.xTable.setActiveRow(item);
            })
        },
        xTableDelRow(row){
            let index = this.menus.indexOf(row);
            if(index>-1){
                this.menus.splice(index,1);
                this.$refs.xTable.syncData()
            }else{
                this.menus.forEach((menu)=>{
                    if(menu.children){
                        index = menu.children.indexOf(row);
                        if(index>-1) {
                            menu.children.splice(index, 1);
                            this.$refs.xTable.syncData()
                        }
                    }
                })
            }
        },
        showModal(menu){
            this.menuHasError = undefined;
            this.menu = menu;
            if(this.menu.menuOptionsLoad){
                this.menuOptions = this.menu.menuOptions;
                this.modalVisible = true;
            }else{
                this.spinning = true;
                this.$http.get(`/api/webapp/menu/${menu.menuId}`).then(res=>{
                    this.menu.menuOptionsLoad=true;
                    this.menu.menuOptions=res.data.menuOptions;
                    this.menuOptions = this.menu.menuOptions;
                    this.modalVisible = true;
                    this.spinning = false;
                });
            }
        },
        modalSubmit(){
            if(!this.menuOptions.startsWith('{')){
                this.menuHasError = 'JSON 格式不合法';
                return;
            }
            try{
                NkUtil.parseJSON(this.menuOptions);
                this.menu.menuOptions=this.menuOptions;
                this.modalVisible = false;
            }catch (e){
                this.menuHasError = e.message;
            }
        },
        submit(){
            this.$refs.xTable.validate(true).then(()=>{
                this.spinning = true;
                this.$http.postJSON('/api/settings/menu/save',this.menus)
                    .then(()=>{
                        this.spinning = false;
                        this.$confirm({
                            title: '菜单已经生效，是否立即刷新界面？',
                            onOk() {
                                location.reload();
                            }
                        });
                    });
            }).catch(()=>{});
        },
        reset(){
            this.spinning = true;
            this.$http.get('/api/settings/menu/menus').then(res=>{
                this.menus = res.data;
                this.spinning = false;
            });
        }
    },
    destroyed() {
        if (this.sortable) {
            this.sortable.destroy()
        }
    }
}
</script>

<style scoped>

</style>
