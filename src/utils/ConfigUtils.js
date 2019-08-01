import axios from 'axios';
import config from 'Config';
import responseUtils from 'utils/ResponseUtils';
import $ from 'jquery';

const key = "config";


export default {
    getValue:function (name) {
        let value = "";
        $.ajax({
            url : config.ACCOUNT_HOST + "/config?name=" + name,
            cache : false,
            async : false,
            type : "get",
            dataType : 'json/xml/html',
            complete : function (result){
                result = JSON.parse(result.responseText);
                if(result.success){
                    value =  result.data.value;
                }
            }
        });
        return value;
    }
}
