/**
 * Created by mocker on 2017/7/22.
 */
import axios from 'axios';
import config from 'Config';
import responseUtils from 'utils/ResponseUtils';
export default {
    validate:function (authCode) {
        if(!authCode){
            return true;
        }
        var perCodes = localStorage.getItem("perCodes");
        if(perCodes==""){
            return false;
        }
        if(!perCodes){
            axios.get(this.$config.SYSTEM_HOST  + "/permission/per_codes").then((res) => {
                responseUtils.handlerError(res);
                perCodes = res.data.data;
                localStorage.setItem("perCodes",perCodes);
            });
        }
        var perCodes = perCodes.split(",");
        for(var i = 0; i < perCodes.length; ++i){
            var percode = perCodes[i];
            if(percode == authCode){
                return true;
            }
        }
        return false;
    }
}
