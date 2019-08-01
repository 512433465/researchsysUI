<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="角色管理" name="roleManager">
                <v-role-manager></v-role-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vRoleManager from './RoleManager.vue';

    export default {
        components:{
            vRoleManager
        },
        data() {
            return {
                activeName: 'roleManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
