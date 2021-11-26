<template>
    <div class="nk-form-item" :style="style">
        <div class="term" :class="termClass" :style="{'min-width':width+'px'}">
            <nk-required-mark v-if="editMode && required" />
            {{term || title}}
            <slot name="term"></slot>
        </div>
        <div class="content" :class="termClass+(errorMsg?' has-error':'')">
            <slot v-if="!editMode"></slot>
            <slot v-if="editMode" name="edit"></slot>
            <div v-if="errorMsg" class="ant-form-explain">{{errorMsg}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "NkFormItem",
    props: {
        term: {
            type: String,
            required: false
        },
        width: {
            type: Number,
            default: 120
        },
        title: {
            type: String,
            required: false
        },
        align: {
            type: String,
            default: ""
        },
        edit:{
            type:Boolean,
            default: true
        },
        // 在编辑模式下，如果edit插槽不存在，那么切换到default插槽
        defaultIfEditLost:{
            type:Boolean,
            default: true
        },
        col: {
            type: Number,
            default: 1
        },
        validateFor: {
        },
        required: Boolean,
        enum: Array,
        len: Boolean,
        min: Number,
        max: Number,
        pattern: String,
        validator: Function,
        message: {
            type: String,
            default: '校验不通过'
        },
        enumMessage: String,
        lenMessage: String,
        patternMessage: String,
        validatorMessage: String,
    },
    created(){
    },
    data(){
        return {
            errorMsg:undefined
        }
    },
    computed:{
        style(){
            return {
                width: (100.00 / this.$parent.$props.col * this.col)+'%'
            }
        },
        editMode(){
            if(!this.edit)
                return false;

            if(!this.$parent.$props.edit)
                return false;

            // 如果 edit 插槽存在
            if(this.$slots.edit)
                return true;

            // 如果 edit 不存在
            return !this.defaultIfEditLost;


        },
        termClass(){
            return [
                this.$parent.$props.edit?' edit':'',
                this.align,
                this.term || this.title ? ' hasContent':''
            ]
        }
    },
    methods:{

        checkError(){

            if(this.$parent.$props.edit && this.$slots.edit){
                
                let v = this.validateFor;

                if(this.required || v){

                    if(typeof v === 'string'){
                        v = v.trim();
                    }

                    if ((this.required || this.len || typeof this.max === 'number' || typeof this.min === 'number')
                        && (v === undefined || v === null || v === '' || v.length===0 )) {
                        console.debug(v)
                        return this.message;
                    }

                    if ( this.len && typeof this.max === 'number' && v && v.length > this.max) {
                        console.debug(this.max)
                        return this.lenMessage || this.message;
                    }
                    if ( this.len && typeof this.min === 'number' && v && v.length < this.min) {
                        console.debug(this.min)
                        return this.lenMessage || this.message;
                    }
                    if (!this.len && typeof this.max === 'number' && v && v > this.max) {
                        console.debug(this.max)
                        return this.lenMessage || this.message;
                    }
                    if (!this.len && typeof this.min === 'number' && v && v < this.min) {
                        console.debug(this.min)
                        return this.lenMessage || this.message;
                    }

                    if (this.pattern && !new RegExp(this.pattern).test(v)) {
                        return this.patternMessage || this.message;
                    }
                    if (this.validator && this.validator(v)) {
                        return this.validatorMessage || this.message;
                    }
                }

            }
            return undefined;
        },
        hasError(){
            return (this.errorMsg = this.checkError());
        }
    }
}
</script>

<style scoped lang="less">

::v-deep.nk-form-item{
    display: flex;
    align-items: center;
    justify-content: center;

    .term {
        line-height: 22px;
        padding-bottom: 8px;
        padding-right: 8px;
        color: rgba(0,0,0,.85);
        white-space: nowrap;
        display: table-cell;
        text-align: right;
        flex-shrink: 0;
        font-size: 12px;

        &.left{
            text-align: left;
        }

        &.hasContent:after {
            content: ':';
            margin: 0 8px 0 2px;
            position: relative;
            top: -0.5px;
        }
    }
    .content{
        font-size: 12px;
        line-height: 22px;
        /*width: 100%;*/
        color: rgba(0,0,0,.65);
        //display: flex;
        //flex-wrap: wrap;
        width: 100%;
        padding: 0 32px 8px 0;

        & > {
            word-break:break-all;
        }

        .ant-select {
            width: 90%;
        }
    }
    .edit{
        line-height: 32px;
    }
    .ant-form-explain{
        margin-top: 1px;
    }
}

</style>
