<template>
    <div>
        <div class="header">
            <div class="logo">{{ systemName }}</div>
            <div class="user-info">
                <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" src="../../../static/img/img.jpeg">
                    {{user.nickname}}
                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="loginout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog title="个人信息" :visible.sync="infoDialogVisible"  size="tiny">
            <el-form label-width="80px">
                <el-form-item label="用户名" :error="errors.userName">
                    {{form.userName}}
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">立即修改</el-button>
                    <el-button @click="infoDialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="showPasswordDogVis" size="tiny" ref="changePassworForm">
            <el-form label-width="80px">
                <el-form-item label="旧密码" :error="errors.oldPassword">
                    <el-input v-model="form.oldPassword" type="password" ></el-input>
                </el-form-item>
                <el-form-item label="新密码" :error="errors.password" >
                    <el-input v-model="form.password" type="password" ></el-input>
                </el-form-item>
                <el-form-item label="再次输入" :error="errors.retryPassword">
                    <el-input v-model="form.retryPassword" type="password" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handlePassword('changePassworForm')">修改密码</el-button>
                    <el-button @click="showPasswordDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: '',
                systemName : '',
                infoDialogVisible:false,
                form:{
                    nickname:'',
                    password:'',
                    retryPassword:'',
                    oldPassword:''
                },
                errors:{
                    nickname:'',
                    password:'',
                    retryPassword:'',
                    oldPassword:''
                },
                user:{},
                showPasswordDogVis:false,
            }
        },
        created() {
            this.systemName = this.$config.SYSTEM_NAME;
            this.$axios.get(this.$config.SYSTEM_HOST + "/user/current_user").then((res) => {
                this.$responseUtils.handlerError(res);
                this.user = res.data.data;
            });
        },
        methods:{
            handleCommand(command) {
                if(command == 'loginout'){
                    localStorage.removeItem('perCodes');
                    localStorage.removeItem("token");
                    this.$axios.get(this.$config.SYSTEM_HOST + "/loginOut").then((res) => {
                        this.$responseUtils.handlerError(res);
                    });
                    this.$router.push('/login');
                }else if(command == 'userInfo'){
                    this.form = {};
                    this.$axios.get(this.$config.SYSTEM_HOST + "/user/current_user").then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.form = res.data.data;
                        this.infoDialogVisible = true
                    });
                }else if(command == "changePassword"){
                    this.$objectUtils.clear(this.form);
                    this.$objectUtils.clear(this.errors);
                    this.showPasswordDogVis = true;
                }
            },
            handleSubmit(){
                this.$axios.put(this.$config.ACCOUNT_HOST + "/member/user_info",{
                    nickname:this.form.nickname
                }).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.infoDialogVisible = false;
                    this.user.nickname = this.form.nickname;
                }).catch((response) => {
                    if(this.$responseUtils.isBadRequest(response)){
                        this.errors = this.$responseUtils.getErrors(response);
                    }
                });
            },
            handlePassword(formName){
                this.$objectUtils.clear(this.errors);
                if(this.form.password === this.form.retryPassword) {
                    this.$axios.put(this.$config.SYSTEM_HOST + "/user/password", {
                        password: this.form.password,
                        oldPassword: this.form.oldPassword
                    }).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.showPasswordDogVis = false;
                    }).catch((response) => {
                        if (this.$responseUtils.isBadRequest(response)) {
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }else{
                    this.errors.password = "两次输入的密码不一致";
                }
            }
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 70px;
        font-size: 22px;
        line-height: 70px;
        color: #fff;
    }
    .header .logo{
        float: left;
        width:250px;
        text-align: center;
    }
    .user-info {
        float: right;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }
    .user-info .el-dropdown-link{
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }
    .user-info .user-logo{
        position: absolute;
        left:0;
        top:15px;
        width:40px;
        height:40px;
        border-radius: 50%;
    }
    .el-dropdown-menu__item{
        text-align: center;
    }
</style>
