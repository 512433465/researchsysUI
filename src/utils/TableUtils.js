/**
 * Created by mocker on 2017/7/16.
 */
import { Message } from 'element-ui'
export default {
    /**
     * 是否已经选择中了一条数据
     * @param response
     */
    isSelected:function (row) {
       if(!row){
           var msg = '请选中一条数据后操作!';
           Message.warning(msg);
           throw new Error(msg);
       }
    }
}
