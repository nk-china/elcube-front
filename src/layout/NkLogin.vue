<template>
    <div class="bg">
        <a-spin :spinning="spinning">
            <a-card title="登录" :bordered="false" style="width: 300px">
                <a-alert v-if="error" type="error" :message="error.data" banner />
                <a-form :form="form" @submit="handleSubmit">
                    <a-form-item :validate-status="userNameError() ? 'error' : ''" :help="userNameError() || ''">
                        <a-input
                            v-decorator="[
                                  'username',
                                  { rules: [{ required: true, message: 'Please input your username!' }] },
                                ]"
                            placeholder="Username"
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
                            placeholder="Password"
                        >
                            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-item>
                    <a-form-item>
                        <a-button ref="submit" type="primary" html-type="submit" :disabled="hasErrors(form.getFieldsError())">
                            Log in
                        </a-button>
                        <a-button v-if="false" style="margin-left: 10px;" type="default" @click="defaultLogin">
                            Default User
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-card>
        </a-spin>
    </div>
</template>

<script>

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
            hasErrors,
            form: this.$form.createForm(this, { name: 'horizontal_login' }),
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
        handleSubmit(e) {
            e.preventDefault();
            this.spinning = true;
            this.form.validateFields((err, values) => {
                if (!err) {
                    this.$http.login(values.username,values.password)
                        .then(()=>{
                            this.$router.push("/apps/default")
                        }).catch((error)=>{
                            this.error = error;
                            this.spinning = false;
                        });
                }
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
</style>
