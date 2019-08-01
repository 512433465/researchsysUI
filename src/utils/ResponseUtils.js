/**
 * Created by mocker on 2017/7/16.
 */
import { Message } from 'element-ui'
export default {
    isBadRequest:function (response) {
        if(response.status == 400){
            return true;
        }else{
            return false;
        }
    },
    getErrors:function (response) {
        var errors = {};
        for(var i = 0; i < response.data.errors.length; ++i){
            var error = response.data.errors[i];
            errors[error.field] = error.msg;
        }
        return errors;
    },
    handlerError:function (response) {
       if(!response.data.success){
           Message.error(response.data.msg);
           throw new Error(response.data.msg);
       }
    }
}
