import Mock from 'mockjs';
import {vuetable} from './vuetable.js';
import {datasource} from './datasource.js';
import {userLogin} from './login.js';

let data = [].concat(vuetable,datasource,userLogin);

data.forEach(function(res){
    Mock.mock(res.path, res.data);
});

export default Mock;