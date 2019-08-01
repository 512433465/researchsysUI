<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <el-menu-item index="index">
                <span>主页</span>
            </el-menu-item>
            <el-menu-item :index="menu.index" v-auth :code="menu.code" v-for="menu in menus">
                <span>{{menu.name}}</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
    import Config from 'Config';

    export default {
        data () {
            return{
                menus:[
                    {
                        name:"用户管理",
                        index:"user",
                        code:"account:user:list"
                    },{
                        name:"项目管理",
                        index:"project",
                        code:"account:project:list"
                    },{
                        name:"申报管理",
                        index:"projectApplication",
                        code:"account:application:list"
                    },{
                        name:"变更管理",
                        index:"update",
                        code:"account:projectUpdate:list"
                    },{
                        name:"结题管理",
                        index:"concludeApplication",
                        code:"account:conclude:list"
                    },{
                        name:"角色管理",
                        index:"role",
                        code:"account:role:list"
                    },{
                        name:"权限管理",
                        index:"permission",
                        code:"account:permission:list"
                    },{
                        name:"数据字典",
                        index:"dict",
                        code:"system:dictType:list"
                    }
                ]
            }
        },
        created () {

        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 140px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
