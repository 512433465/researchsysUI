<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="申报管理" name="projectApplicationManager">
                <v-project-application-manager></v-project-application-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vProjectApplicationManager from './ProjectApplicationManager.vue';

    export default {
        components:{
            vProjectApplicationManager
        },
        data() {
            return {
                activeName: 'projectApplicationManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
