<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="项目管理" name="projectManager">
                <v-project-manager></v-project-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vProjectManager from './ProjectManager.vue';

    export default {
        components:{
            vProjectManager
        },
        data() {
            return {
                activeName: 'projectManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
