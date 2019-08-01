/**
 * Created by mocker on 2017/7/22.
 */
import axios from 'axios';
import config from 'Config';
import $ from 'jquery';
import responseUtils from 'utils/ResponseUtils';
import regionUtils from 'utils/RegionUtils';

export default {
    getName:function (dictType,code) {
        if(dictType == "region"){
            return regionUtils.fullRegionName(code);
        }
        var key = "dict:" + dictType;
        var data = localStorage.getItem(key);
        if(!data){
            $.ajax({
                url : config.SYSTEM_SERVER_HOST + "/dict_type/" + dictType + "/detail?lazy=true&list=true",
                cache : false,
                async : false,
                type : "get",
                dataType : 'json/xml/html',
                complete : function (result){
                    result = JSON.parse(result.responseText);
                    if(result.success){
                        data = result.data;
                    }else{
                        localStorage.removeItem(key);
                    }
                }
            });
            if(data){
                localStorage.setItem(key,JSON.stringify(data));
                return this.search(dictType,code,data);
            }
        }else{
            return this.search(dictType,code,JSON.parse(data));
        }
    },
    search:function (dactType,code,data) {
        for(var i = 0; i < data.length; ++i){
            if(data[i].code == code){
                return data[i].name;
            }
        }
    }
}
