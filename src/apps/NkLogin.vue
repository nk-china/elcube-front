<!--
	This file is part of ELCube.
	ELCube is free software: you can redistribute it and/or modify
	it under the terms of the GNU Affero General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.
	ELCube is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU Affero General Public License for more details.
	You should have received a copy of the GNU Affero General Public License
	along with ELCube.  If not, see <https://www.gnu.org/licenses/>.
-->
<template>
    <div class="bg">
        <a-card :title="$t('login')" :bordered="false" style="width: 300px;padding-bottom: 10px;">
            <nk-login-form @change="changed" ref="form" @success="success">
            </nk-login-form>
            <a-button ref="submit" type="primary" :disabled="!!loginInfo.error" @click="login">
                {{$t('login')}}
            </a-button>
            <a-button style="margin-left: 10px;" type="default" @click="defaultLogin">
                Default User
            </a-button>
        </a-card>
        <nk-error-modal />
    </div>
</template>

<script>

export default {
    name: "Login",
    data(){
        return{
            loginInfo: {}
        }
    },
    mounted() {
        const l = document.getElementById("startup-loading");
        if(l)l.remove();
    },
    methods:{
        defaultLogin(){
            this.$refs.form.login("admin","96e79218965eb72c92a549dd5a330112");
        },
        changed(e){
            this.loginInfo = e;
        },
        success(){
            this.$router.push("/apps/default")
        },
        login(){
            this.$refs.form.login();
        }
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

<i18n>
{
    "zh_CN": {
        "login": "登陆"
    },
    "en": {
        "login": "Login"
    }
}
</i18n>
