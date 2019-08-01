export default {
    generateGetParameter:function (obj) {
        var str = "";
        if(obj != null){
            str += "?";
            for(var attr in obj){
               var value =  obj[attr];
               str = str + attr + "=" + value + "&";
            }
            str = str.substr(0,str.length - 1);
        }
        return str;
    }

}
