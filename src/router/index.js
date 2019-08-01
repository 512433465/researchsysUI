import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: resolve => require(['page/admin/Login.vue'], resolve)
        },
        {
            path: '/admin',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path: '/index',
                    component: resolve => require(['../components/page/Readme.vue'], resolve)
                },
                {
                    path:'/project',
                    component: resolve => require(['page/admin/project/Index.vue'], resolve)
                },
                {
                    path:'/projectApplication',
                    component: resolve => require(['page/admin/projectApplication/Index.vue'], resolve)
                },
                {
                    path:'/update',
                    component: resolve => require(['page/admin/update/Index.vue'], resolve)
                },
                {
                    path:'/concludeApplication',
                    component: resolve => require(['page/admin/concludeApplication/Index.vue'], resolve)
                },
                {
                    path: '/user',
                    component: resolve => require(['page/admin/user/Index.vue'], resolve)
                },
                {
                    path: '/role',
                    component: resolve => require(['page/admin/role/Index.vue'], resolve)
                },
                {
                    path: '/permission',
                    component: resolve => require(['page/admin/permission/Index.vue'], resolve)
                },
                {
                    path: '/dict',
                    component: resolve => require(['page/admin/dict/Index.vue'], resolve)
                }
            ]
        }
    ]
})
