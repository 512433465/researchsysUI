<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="userManager">
                <v-user-manager></v-user-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vUserManager from './UserManager.vue';

    export default {
        components:{
            vUserManager
        },
        data() {
            return {
                activeName: 'userManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
