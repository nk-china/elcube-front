<template>
    <a-spin :spinning="!!spinning">
        <a-alert v-if="error" type="error" :message="error.data" banner style="margin-bottom: 20px;border-radius: 4px;" />
        <a-form :form="form" @submit="submit">
            <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
                <a-input
                    v-decorator="[
                                  'username',
                                  { rules: [{ required: true, message: 'Please input your username!' }], initialValue: username },

                                ]"
                    :placeholder="$t('username')"

                    @blur="usernameBlur"
                    :disabled="usernameReadonly"
                >
                    <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
                <a-input
                    v-decorator="[
                                  'password',
                                  { rules: [{ required: true, message: 'Please input your Password!' }], initialValue: password },
                                ]"
                    type="password"
                    :placeholder="$t('password')"
                >
                    <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                </a-input>
            </a-form-item>
            <a-form-item v-if="retryTimes>0" :validate-status="verCodeError() ? 'error' : ''" :help="verCodeError() || ''" class="ver-code">
                <a-input
                    v-decorator="[
                                  'verCode',
                                  { rules: [{ required: true, message: 'Please input your Ver Code!' }] },
                                ]"
                    type="text"
                    :placeholder="$t('verCode')"
                >
                    <a-icon slot="prefix" type="safety-certificate" style="color:rgba(0,0,0,.25)" />
                    <img slot="addonAfter" :src="`/api/ver/code/${verKey}?${random}`" height="26" @click="random=new Date().getTime()">
                </a-input>
            </a-form-item>
            <a-button type="primary" html-type="submit" v-show="false"></a-button>
            <a-form-item v-if="$slots.actions">
                <slot name="actions"></slot>
            </a-form-item>
        </a-form>
    </a-spin>
</template>

<script>

import NkUtil from "../../utils/NkUtil";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
    props: {
        username:String,
        password:String,
        usernameReadonly:Boolean
    },
    data(){
        return{
            spinning:false,
            valid:false,
            error:undefined,
            verKey:undefined,
            hasErrors,
            form: this.$form.createForm(this, {name: 'horizontal_login'}),
            random:'',
            retryTimes:0,
            formError:undefined
        }
    },
    mounted() {
        this.usernameBlur();
    },
    methods:{
        defaultLogin(){
            this.spinning = true;
            this.$http.login("admin","96e79218965eb72c92a549dd5a330112")
                .then(()=>{
                    this.$router.push("/apps/default")
                }).catch((error)=>{
                this.error = error;
                this.spinning = false;
            });
        },
        // Only show error after a field is touched.
        userNameError() {
            const { getFieldError,isFieldTouched } = this.form;
            const error = isFieldTouched('username') && getFieldError('username');
            this.change({error});
            return error;
        },
        // Only show error after a field is touched.
        passwordError() {
            const { getFieldError,isFieldTouched } = this.form;
            const error = isFieldTouched('password') && getFieldError('password');
            this.change({error});
            return error;
        },
        // Only show error after a field is touched.
        verCodeError() {
            const { getFieldError,isFieldTouched } = this.form;
            const error =  isFieldTouched('verCode') && getFieldError('verCode');
            this.change({error});
            return error;
        },
        change(e){
            this.formError = e.error;
            this.$emit("change",Object.assign({
                error: undefined,
                username: this.form.getFieldValue("username"),
                password: this.form.getFieldValue("password"),
                verCode: this.form.getFieldValue("verCode"),
                logging:false
            },e));
        },
        usernameBlur(){
            // 检查是否需要验证码
            if(this.form.getFieldValue("username")&&this.form.getFieldValue("username").trim()){
                this.$http.instanceNone.get("/api/ver/has/"+this.form.getFieldValue("username"))
                    .then(res=>{
                        if(res.data){
                            if(res.data.count){
                                this.retryTimes = res.data.count;
                                this.verKey = this.verKey||NkUtil.uuid();
                                this.error = res.data.message && {data:res.data.message};
                            }else{
                                this.error = undefined;
                            }
                        }
                    });
            }
        },
        submit(e){
            e.preventDefault();
            this.login();
        },
        clear(){
            this.form.setFieldsValue({
                password:undefined,
                verCode:undefined,
            });
            this.retryTimes = 0;
            this.verKey = undefined;
            this.error = undefined;
        },
        login(username,password){
            if(username){
                this.form.setFieldsValue({username});
            }
            if(password){
                this.form.setFieldsValue({password});
            }
            this.spinning = true;
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.change({logging:true})
                    this.$http.login(values.username,values.password,this.verKey,values.verCode)
                        .then(()=>{
                            this.$emit("success");
                            this.change({logging:false})
                            this.spinning = false;
                            this.clear();
                        }).catch((error)=>{
                            this.form.setFieldsValue({
                                password:undefined,
                                verCode:undefined,
                            });

                            this.error = error;
                            this.spinning = false;

                            // 处理验证码
                            this.retryTimes++;
                            this.verKey = this.verKey||NkUtil.uuid();
                            this.random=new Date().getTime();

                            this.change({logging:false})
                        });
                }else
                    this.spinning = false;
            });
        },
    }
}
</script>

<style scoped>
::v-deep.ver-code .ant-input-group-addon{
    padding: 0;
}
::v-deep.ver-code .ant-input-group-addon img{
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
}
</style>


<i18n>
{
"zh_CN": {
"login": "登陆",
"username": "用户名",
"password": "密码",
"verCode": "验证码"
},
"en": {
"login": "Login",
"username": "Username",
"password": "Password",
"verCode": "VerCode"
}
}
</i18n>