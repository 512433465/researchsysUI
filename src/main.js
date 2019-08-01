import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import { Message } from 'element-ui'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
import Utils from 'utils/Install';
import "babel-polyfill";
import './mock/index.js';
import ConfigUtils from "./utils/ConfigUtils";
import ObjectUtils from "./utils/ObjectUtils";

Vue.use(ElementUI);
Vue.use(Utils);

axios.defaults.withCredentials=true;
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

// http request 拦截器
axios.interceptors.request.use(
    config => {
        return config;
    },
    err => {
        return Promise.reject(err);
    });

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status == 401) {
            router.push("/login");
        }
        if (error.response.status == 500) {
            if(error.response.statusText =='Internal Server Error'){
                Message.error("连接服务器错误!");
            }else{
                Message.error(error.response.statusText);
            }
        }
        if (error.response.status == 404) {
            Message.error("服务器接口不存在或者服务器挂掉了!");
        }
        if (error.response.status == 504) {
            Message.error("服务器挂掉了!");
        }
        if (error.response.status == 403) {
            Message.error(error.response.data.msg);
        }
        return Promise.reject(error.response)   // 返回接口返回的错误信息
    });
