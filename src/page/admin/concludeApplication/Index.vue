<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="结题管理" name="concludeApplicationManager">
                <v-conclude-application-manager></v-conclude-application-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vConcludeApplicationManager from './ConcludeApplicationManager.vue';

    export default {
        components:{
            vConcludeApplicationManager
        },
        data() {
            return {
                activeName: 'concludeApplicationManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
