/**
 * Created by mocker on 2017/7/18.
 */
import Config from 'Config';
import ObjectUtils from 'utils/ObjectUtils.js';
import ResponseUtils from 'utils/ResponseUtils';
import TableUtils from 'utils/TableUtils';
import AuthUtils from 'utils/AuthUtils';
import StringUtils from 'utils/StringUtils';
import QueryUtils from 'utils/QueryUtils';
import DictUtils from 'utils/DictUtils';
import RegionUtils from 'utils/RegionUtils';


import axios from 'axios';
import ConfigUtils from "./ConfigUtils";

export default{
    install(Vue,options)
    {
        Vue.prototype.$objectUtils = ObjectUtils;
        Vue.prototype.$responseUtils = ResponseUtils;
        Vue.prototype.$config = Config;
        Vue.prototype.$tableUtils = TableUtils;
        Vue.prototype.$stringUtils = StringUtils;
        Vue.prototype.$authUtils = AuthUtils;
        Vue.prototype.$queryUtils = QueryUtils;
        Vue.prototype.$configUtils = ConfigUtils;
        Vue.prototype.$regionUtils = RegionUtils;
        Vue.directive("auth",{
            update(el,binding,vnode){
                if(!AuthUtils.validate(vnode.data.attrs.code)){
                    el.style.display = 'none';
                }
            },
        });
        Vue.directive("dict",{
            inserted(el,binding){
                var name = DictUtils.getName(binding.value,el.getAttribute("code"));
                el.innerHTML = name;
            },
            update(el,binding){
                var code = el.getAttribute("code");
                var name = DictUtils.getName(binding.value,code);
                if(name){
                    el.innerHTML = name;
                }else{
                    el.innerHTML = code;
                }
            }
        });

    }
}
