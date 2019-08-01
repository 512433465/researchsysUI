/**
 * Created by mocker on 2017/7/16.
 */
export default {
    isEmpty:function (str) {
        return str  == null || str.trim().length == 0 || str == '0' ?true : false;
    }
}
