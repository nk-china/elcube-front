<template>
    <div class="bg">
        <a-spin :spinning="spinning">
            <a-card :title="$t('login')" :bordered="false" style="width: 300px">
                <a-alert v-if="error" type="error" :message="error.data" banner style="margin-bottom: 20px;border-radius: 4px;" />
                <a-form :form="form" @submit="handleSubmit">
                    <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
                        <a-input
                            v-decorator="[
                                  'username',
                                  { rules: [{ required: true, message: 'Please input your username!' }] },
                                ]"
                            :placeholder="$t('username')"
                            v-model="username"
                            @blur="usernameBlur"
                        >
                            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-item>
                    <a-form-item :validate-status="passwordError() ? 'error' : ''" :help="passwordError() || ''">
                        <a-input
                            v-decorator="[
                                  'password',
                                  { rules: [{ required: true, message: 'Please input your Password!' }] },
                                ]"
                            type="password"
                            :placeholder="$t('password')"
                            v-model="password"
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
                            v-model="password"
                        >
                            <a-icon slot="prefix" type="safety-certificate" style="color:rgba(0,0,0,.25)" />
                            <img slot="addonAfter" :src="`/api/ver/code/${verKey}?${random}`" height="26" @click="random=new Date().getTime()">
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-button ref="submit" type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
                            {{$t('login')}}
                        </a-button>
                        <a-button v-if="false" style="margin-left: 10px;" type="default" @click="defaultLogin">
                            Default User
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-card>
        </a-spin>
        <nk-error-modal />
    </div>
</template>

<script>

import NkUtil from "../utils/NkUtil";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
export default {
    name: "Login",
    data(){
        return{
            spinning:false,
            valid:false,
            error:undefined,
            username:undefined,
            password:undefined,
            verKey:undefined,
            verCode:undefined,
            hasErrors,
            form: this.$form.createForm(this, { name: 'horizontal_login' }),
            random:'',
            retryTimes:0,
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.form.validateFields();
        });
        const l = document.getElementById("startup-loading");if(l)l.remove();
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
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('username') && getFieldError('username');
        },
        // Only show error after a field is touched.
        passwordError() {
            const { getFieldError, isFieldTouched } = this.form;
            return isFieldTouched('password') && getFieldError('password');
        },
        // Only show error after a field is touched.
        verCodeError() {
            const { getFieldError } = this.form;
            return getFieldError('verCode');
        },
        usernameBlur(){
            // 检查是否需要验证码
            if(this.form.getFieldValue("username")&&this.form.getFieldValue("username").trim()){
                this.$http.instanceNone.get("/api/ver/has/"+this.form.getFieldValue("username"))
                    .then(res=>{
                        if(res.data){
                            this.retryTimes = res.data;
                            this.verKey = this.verKey||NkUtil.uuid();
                        }
                    });
            }
        },
        handleSubmit(e) {
            e.preventDefault();
            this.spinning = true;
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.$http.login(values.username,values.password,this.verKey,values.verCode)
                        .then(()=>{
                            this.$router.push("/apps/default")
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
                        });
                }else
                    this.spinning = false;
            });
        },
    }
}
</script>

<style scoped>
.bg{
    height: 100vh;
    background:#ECECEC;
    display: flex;
    justify-content: center;
    align-items: center;
}
::v-deep.ver-code .ant-input-group-addon{
    padding: 0;
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
