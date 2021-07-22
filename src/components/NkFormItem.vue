<template>
    <div class="nk-form-item" :style="style">
        <div class="term" :class="termClass">
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
            return this.edit && this.$parent.$props.edit && this.$slots.edit
        },
        termClass(){
            return [this.$parent.$props.edit?' edit':'',this.align]
        }
    },
    methods:{

        checkError(){

            if(this.$parent.$props.edit && this.$slots.edit){

                let validateForList = this.validateFor instanceof Array ? this.validateFor : [this.validateFor];

                for(let index in validateForList) {
                    if(validateForList.hasOwnProperty(index)){
                        let v = validateForList[index];
                        if ((this.required || this.len || this.max || this.min)
                            && (v === undefined || v === null || v === '')) {
                            return this.message;
                        }

                        if (this.len !== undefined && this.max !== undefined && v && v.length > this.max) {
                            return this.lenMessage || this.message;
                        }
                        if (this.len !== undefined && this.min !== undefined && v && v.length < this.min) {
                            return this.lenMessage || this.message;
                        }
                        if (this.len === undefined && this.max !== undefined && v && v > this.max) {
                            return this.lenMessage || this.message;
                        }
                        if (this.len === undefined && this.min !== undefined && v && v < this.min) {
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

            }
            return undefined;
        },
        hasError(){
            return (this.errorMsg = this.checkError());
        }
    }
}
</script>

<style scoped lang="scss">

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
        min-width: 120px;
        text-align: right;
        flex-shrink: 0;
        font-size: 12px;

        &:after {
            content: ':';
            margin: 0 8px 0 2px;
            position: relative;
            top: -0.5px;
        }
        &.left{
            text-align: left;
        }
    }
    .content{
        font-size: 12px;
        line-height: 22px;
        /*width: 100%;*/
        color: rgba(0,0,0,.65);
        display: table-cell;
        width: 100%;
        padding: 0 32px 8px 0;

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
