import $ from 'jquery';
import config from 'Config';

const key = "region";
const mapKey = "regionMap";

export default {
    //获取行政区域的全部代码
    fullRegion:function (str) {
        //如果是省级
        if(str){
            if(str.lastIndexOf("0000") != -1){
                return [str];
            }else if(str.lastIndexOf("00")  != -1 ){
                return [str.substring(0,2) + "0000",str.substring(0,4) + "00"];
            }{
                return [str.substring(0,2) + "0000",str.substring(0,4) + "00",str];
            }
        }else{
            return [];
        }
    },
    //获取数据
    getRegionData:function(){
        var region = localStorage.getItem(key);
        if(region){
            region = JSON.parse(region);
        }else{
            $.ajax({
                url : config.SYSTEM_SERVER_HOST + "/dict_type/region/detail?lazy=true&list=true",
                cache : false,
                async : false,
                type : "get",
                dataType : 'json/xml/html',
                complete : function (result){
                    result = JSON.parse(result.responseText);
                    if(result.success){
                        region = result.data;
                        localStorage.setItem(key,JSON.stringify(region))
                    }else{
                        localStorage.removeItem(key);
                    }
                }
            });
        }
        return region;
    },
    getRegionMap:function () {
        var regionMap = localStorage.getItem(mapKey);
        if(regionMap){
            regionMap = JSON.parse(regionMap);
        }{
            regionMap = {};
            var data = this.getRegionData();
            for(var i = 0; i < data.length; ++i){
                var d = data[i];
                regionMap[d.code] = d.name;
            }
            localStorage.setItem(mapKey,JSON.stringify(regionMap))
        }
        return regionMap;
    },
    fullRegionName:function(str) {
        var map = this.getRegionMap();
        if(str){
            var fullName = "";
            var fullRegionCode = this.fullRegion(str);
            for(var i = 0; i < fullRegionCode.length; ++i){
                var region = fullRegionCode[i];
                fullName += map[region];
            }
            return fullName;
        }
    }
}
