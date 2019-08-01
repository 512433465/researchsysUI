<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="变更管理" name="updateManager">
                <v-update-manager></v-update-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vUpdateManager from './UpdateManager.vue';

    export default {
        components:{
            vUpdateManager
        },
        data() {
            return {
                activeName: 'updateManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
