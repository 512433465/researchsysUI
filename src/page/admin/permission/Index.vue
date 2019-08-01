<template>
    <div>
        <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane label="权限管理" name="permissionManager" >
                <v-permission-manager ></v-permission-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vPermissionManager from './PermissionManager.vue';
    import Config from 'Config';

    export default {
        components:{
            vPermissionManager
        },
        data() {
            return {
                activeName:'permissionManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
<style
