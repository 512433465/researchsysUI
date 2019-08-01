<template>
    <div class="login-wrap">
        <div class="ms-title">{{ systemName }}</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="userName">
                    <el-input v-model="ruleForm.userName" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item prop="password" :error="message.password">
                    <el-input type="password"  placeholder="密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import Config from 'Config';
    export default {
        data: function(){
            return {
                systemName:'',
                ruleForm: {
                    userName: '',
                    password: '',
                    type: '',
                    createTime:  ''

                },
                message : {
                    name: '',
                    password: ''
                },
                rules: {
                    userName: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            this.systemName = Config.SYSTEM_NAME;
            console.log(Config.SYSTEM_NAME)
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post(this.$config.SYSTEM_HOST + '/login',this.ruleForm).then((res) => {
                            if(res.data.success){
                                localStorage.setItem("token",res.data.data);
                                this.$router.push("/admin");
                            }else{
                                if(res.data.msg){
                                    this.$message({
                                        showClose: true,
                                        message: res.data.msg,
                                        type: 'error'
                                    });
                                }
                            }
                        })
                    }else{
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
