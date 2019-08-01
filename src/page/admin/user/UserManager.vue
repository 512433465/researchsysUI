<template>
    <div>
        <div>
            <el-button size="small" type="primary"  @click="handleQuery"v-auth code="account:user:list">刷新列表</el-button>
            <el-button size="small" type="primary"  @click="showAdd()" v-auth code="account:user:add">添加用户</el-button>
            <el-button size="small" type="primary"  @click="showEdit()"v-auth code="account:user:update">编辑用户</el-button>
            <el-button size="small" type="primary" @click="showPassword()"  v-auth code="account:user:password">修改密码</el-button>
            <el-button size="small" type="primary"  @click="showEditRoles()" v-auth code="account:user:role" >分配角色</el-button>
            <!--<el-button size="small" type="primary"  @click="showEditPermissions()">分配权限</el-button>-->
            <el-button size="small" type="danger"  @click="showDelete()"  v-auth code="account:user:delete">删除用户</el-button>
        </div>
        <br/>
        <el-table
            :data="tableData"
            highlight-current-row
            @current-change="currentChange"
            style="width: 100%">
            <el-table-column
                prop="userName"
                label="用户名">
            </el-table-column>
            <el-table-column
                prop="type"
                label="用户类型">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
                <template scope="scope">
                    <template v-if="auth.accountUserStatus == true">
                        <el-switch
                            v-model="scope.row.status"
                            on-text="禁用"
                            off-text="启用"
                            on-value="1"
                            off-value="0"
                            on-color="#13ce66"
                            off-color="#ff4949" @change="handleStatus(scope.row)" ></el-switch>
                    </template>
                    <template v-if="auth.accountUserStatus == false">
                        <el-tag
                            :type="scope.row.status == 1 ? 'success' : 'danger'"
                            close-transition>{{scope.row.status == 1 ? '启用' : '禁用'}}</el-tag>
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                       layout="prev, pager, next"
                       :total="totalCount" @current-change="handleCurrentChange">
        </el-pagination>
        <br/>
        <el-dialog title="查看用户" :visible.sync="showUserDogVis"  size="small">
            <el-form label-width="80px">
                <el-form-item label="用户名">
                    {{form.userName}}
                </el-form-item>
                <el-form-item label="状态">
                    {{form.status == '1' ? '启用':'禁用'}}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showUserDogVis = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加用户" :visible.sync="addDogVis"  size="small">
            <el-form label-width="80px">
                <el-form-item label="用户名" :error="errors.userName">
                    <el-input v-model="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="密码" :error="errors.password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">立即创建</el-button>
                    <el-button @click="addDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑用户" :visible.sync="editDogVis" size="small">
            <el-form label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.userName" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSave">保存编辑</el-button>
                    <el-button @click="editDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="修改密码" :visible.sync="showPasswordDogVis" size="small" ref="changePassworForm">
            <el-form label-width="80px">
                <el-form-item label="新密码" :error="errors.password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="再次输入" :error="errors.password2">
                    <el-input v-model="form.password2" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handlePassword">修改密码</el-button>
                    <el-button @click="showPasswordDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="分配角色" :visible.sync="roleDogVis">
            <el-checkbox-group v-model="selectRoles" >
                <el-checkbox :label="role.id" v-for="role in roles">{{ role.name }}</el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSaveRoles">立即分配</el-button>
                <el-button @click="roleDogVis = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="分配权限" :visible.sync="permissionsDogVis" size="full">
            <el-tabs v-model="activeName" :activeName="activeName">
                <p style="font-size: 14px;">红色标记的权限表示此权限在用户已经分配的角色中已经包含了这些权限,即便权限被红色标记了你也可以分配给用户。</p>
                <br/>
                <el-tab-pane :label="system.name" :name="system.id" v-for="system in systems">
                    <el-tree
                        :data="system.permissions"
                        show-checkbox
                        highlight-current
                        ref="tree"
                        nodeKey="id"
                        :default-checked-keys="selectedPermissions"
                        @check-change="nodeChange"
                        :render-content="renderContent"
                        :props="defaultProps">
                    </el-tree>
                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSavePermissions">立即分配</el-button>
                <el-button @click="permissionsDogVis = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                value1:'',
                tableData: [],
                totalCount:0,
                query : {

                },
                dict:{
                    "region":"region"
                },
                selectRegion:'',
                regionData:[],
                form: {
                    id : '',
                    userName: '',
                    password:'',
                    password2:'',
                    type:[],
                    region:''
                },
                errors: {
                    name: '',
                    password:'',
                    password2:'',
                    region:''
                },
                addDogVis: false,
                editDogVis: false,
                roleDogVis: false,
                permissionsDogVis: false,
                showUserDogVis:false,
                showPasswordDogVis:false,
                currentRow:null,
                roles: [],
                selectRoles:[],
                currentUser:'',
                selectedPermissions:[],//当前权限树选中的节点
                hidePermission:[],//用户权限 只包含隐藏角色权限
                notHideRolePermission:[],//用户权限 不包含隐藏角色权限
                systems:[],
                activeName:'',
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                auth:{
                    accountUserStatus:false
                },
                props: {
                    label:'mergername',
                    value: 'shortCode',
                    children: 'childs'
                },
                defaultProps:{
                    label:'text',
                    children:'children',
                    disabled:''
                }
            }
        },
        created () {
            this.auth.accountUserStatus = true;
            this.handleQuery();
        },
        methods:{
            remoteMethod:function (query) {
                if(query){
                    this.$axios.get(this.$config.SYSTEM_SERVER_HOST + "/region?mergerName=" + query + "&pageSize=100").then((res) => {
                        this.regionData = res.data.data.rows;
                    });
                }
            },
            showUser(){
                this.$tableUtils.isSelected(this.currentRow);
                this.$axios.get(this.$config.ACCOUNT_HOST + "/admin/users/" + this.currentRow.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.form = res.data.data;
                    this.showUserDogVis = true;
                });
            },
            showPassword(){
                this.$objectUtils.clear(this.form);
                this.$tableUtils.isSelected(this.currentRow);
                this.showPasswordDogVis = true;
            },
            handleStatus(row){
                var msg = '';
                if(row.status == '1'){
                    msg = <p>此操作会将<span style="color: red;">{row.name}</span>启用,你确定?</p>;
                }else{
                    msg = <p>此操作会将<span style="color: red;">{row.name}</span>禁用,你确定?</p>;
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.put(this.$config.SYSTEM_HOST + "/user/status",{
                        'id':row.id,
                        'status':row.status
                    }).then((res) => {
                        if(!res.data.success){
                            this.$message.error(res.data.msg);
                            if(row.status == '1'){
                                row.status = '0';
                            }else if(row.status == '0'){
                                row.status = '1'
                            }
                        }
                        this.$responseUtils.handlerError(res);
                    });
                }).catch(() => {
                    if(row.status == '1'){
                        row.status = '0';
                    }else if(row.status == '0'){
                        row.status = '1'
                    }
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
            },
            renderContent(h, { node, data, store }) {
                if(this.notHideRolePermission && this.notHideRolePermission.length > 0){
                    for(var i = 0; i < this.notHideRolePermission.length; i++) {
                        console.log(node);
                        if(this.notHideRolePermission[i] == data.id) {
                            return (
                                <span>
                                <span>
                                <span style="color:#FF4949">{node.label}</span>
                            </span>
                            </span>
                        );
                        }
                    }
                }
                return (
                    <span>
                    <span>
                    <span>{node.label}</span>
                </span>
                </span>
                 );
            },
            nodeChange(obj,isChecked,isChildChecked){
                if(isChecked){
                    this.selectedPermissions.push(obj.id);
                }else{
                    for(var i = 0; i < this.selectedPermissions.length; i++) {
                        if(this.selectedPermissions[i] == obj.id) {
                            this.selectedPermissions.splice(i, 1);
                            break;
                        }
                    }
                }
            },
            showEditPermissions(index,row){
                this.$tableUtils.isSelected(this.currentRow);
                this.form.id = this.currentRow.id;
                //查询出系统
                this.selectedPermissions = [];
                this.systems = [];
                //查询出用户权限 非隐藏角色权限
                this.$axios.get(this.$config.ACCOUNT_HOST + "/admin/users/"+this.form.id+"/assignment_permission").then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.systems = res.data.data.systems;
                    this.notHideRolePermission = res.data.data.notHideRolePermission;
                    this.selectedPermissions = res.data.data.hideRolePermission;
                    if(this.systems){
                        this.activeName = this.systems[0].id;
                    }
                    this.permissionsDogVis = true;
                });
            },
            handlePassword(){
                this.$objectUtils.clear(this.errors);
                if(this.$stringUtils.isEmpty(this.form.password)){
                    this.errors.password = "密码不能为空";
                    return;
                }
                if(this.$stringUtils.isEmpty(this.form.password2)){
                    this.errors.password2 = "不能为空";
                    return;
                }
                if(this.form.password === this.form.password2){
                    this.$axios.put(this.$config.SYSTEM_HOST + "/user/password",{
                        userName:this.currentRow.userName,
                        password:this.form.password
                    }).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.showPasswordDogVis = false;
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }else{
                    this.errors.password = "两次输入的密码不一致";
                }
            },
            currentChange(currentRow, oldCurrentRow){
                this.currentRow = currentRow;
            },
            handleSavePermissions () {
                this.$axios.put(this.$config.ACCOUNT_HOST + "/admin/users/permission?userId="+this.form.id,this.selectedPermissions).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.permissionsDogVis = false;
                });
            },
            handleCurrentChange(page) {
                this.query.page = page;
                this.handleQuery();
            },
            handleRolesChange(value, direction, movedKeys) {
                this.role.value = value;
            },
            handleSaveRoles(){
                this.$axios.put(this.$config.SYSTEM_HOST + "/user/assignment_role?id="+ this.currentRow.id  , this.selectRoles).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.roleDogVis = false;
                });
            },
            showEditRoles(){
                this.selectRoles = [];
                this.$tableUtils.isSelected(this.currentRow);
                this.$axios.get(this.$config.SYSTEM_HOST + "/user/to_assignment_role?id="+this.currentRow.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.roles = res.data.data.roles;
                    this.selectRoles = res.data.data.userRoleIds;
                    this.roleDogVis = true;
                });
            },
            showEdit() {
                this.$tableUtils.isSelected(this.currentRow);
                this.$objectUtils.clear(this.errors);
                this.$axios.get(this.$config.SYSTEM_HOST + "/user?id=" + this.currentRow.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.form = res.data.data;
                    this.editDogVis = true;
                });
            },
            showDelete() {
                this.$tableUtils.isSelected(this.currentRow);
                this.$confirm(<p>你确定要删除<span style="color: red;">{this.currentRow.userName}</span>?</p>, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(this.$config.SYSTEM_HOST + "/user?userName=" + this.currentRow.userName).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.$message('删除成功!');
                        this.handleQuery();
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSave() {
                if(this.form.id){
                    this.$objectUtils.clear(this.errors);
                    this.$axios.put(this.$config.ACCOUNT_HOST + "/user",this.form).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.editDogVis = false;
                        this.handleQuery();
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }else{
                    this.$objectUtils.clear(this.errors);
                    this.$axios.post(this.$config.SYSTEM_HOST + "/user",{
                        userName:this.form.userName,
                        password:this.form.password,
                    }).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.addDogVis = false;
                        this.handleQuery();
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }
            },
            showAdd(){
                this.addDogVis = true;
                this.selectOptions = [];
                this.$objectUtils.clear(this.form);
                this.$objectUtils.clear(this.errors);
            },
            handleQuery(){
                this.$axios.get(this.$config.SYSTEM_HOST + "/user" + this.$queryUtils.generateGetParameter(this.query),).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.tableData = res.data.data;
                    this.totalCount = res.data.data.totalCount;
                });

            }
        }
    }
</script>
