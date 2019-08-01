<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    export default {
        components:{
            vHead, vSidebar
        },
        created(){
            this.$axios.get(this.$config.SYSTEM_HOST + "/permission/per_code").then((res) => {
                localStorage.setItem("perCodes",res.data.data);
                this.$router.push("/index");
            });
        }
    }
</script>
