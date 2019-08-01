<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="数据类型管理" name="dictTypeManager">
                <v-dict-type-manager></v-dict-type-manager>
            </el-tab-pane>
            <el-tab-pane label="数据明细管理" name="dictDetailManager">
                <v-dict-detail-manager></v-dict-detail-manager>
            </el-tab-pane>
        </el-tabs>
        <router-view></router-view>
    </div>
</template>
<script>
    import vDictTypeManager from './DictTypeManager.vue';
    import vDictDetailManager from './DictDetailManager.vue';


    export default {
        components:{
            vDictTypeManager,vDictDetailManager
        },
        data() {
            return {
                activeName: 'dictTypeManager'
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
            }
        }
    };
</script>
