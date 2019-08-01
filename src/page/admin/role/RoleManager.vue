<template>
    <div>
        <div>
            <el-button size="small" type="primary" @click="handleQuery" v-auth code="account:role:list">刷新列表</el-button>
            <el-button size="small" type="primary" @click="showAdd" v-auth code="account:role:add">添加角色</el-button>
            <el-button size="small" type="primary" @click="showEdit" v-auth code="account:role:update">编辑角色</el-button>
            <el-button size="small" type="primary" @click="showEditPermissions" v-auth code="account:role:permission">分配权限</el-button>
            <el-button size="small" type="danger" @click="showDelete" v-auth code="account:role:delete">删除角色</el-button>
        </div>
        <br/>
        <el-table
            :data="tableData"
            highlight-current-row
            @current-change="currentChange"
            style="width: 100%">
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                       layout="prev, pager, next"
                       :total="totalCount" @current-change="handleCurrentChange">
        </el-pagination>
        <br/>
        <el-dialog title="添加角色" :visible.sync="addDogVis"  size="small">
            <el-form label-width="80px">
                <el-form-item label="名称" :error="errors.name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                    <el-button @click="addDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑角色" :visible.sync="editDogVis" size="small">
            <el-form label-width="80px">
                <el-form-item label="名称" :error="errors.name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">保存编辑</el-button>
                    <el-button @click="editDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="分配权限" :visible.sync="permissionsDogVis" >
            <el-tree
                :data="this.permissionTree"
                show-checkbox
                node-key="id"
                :default-checked-keys="selectedPermissions"
                @check-change="nodeChange"
                :props="defaultProps">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSavePermissions">确 定</el-button>
                <el-button @click="permissionsDogVis = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                tableData: [],
                totalCount:0,
                query : {

                },
                currentNodeKey:'',
                form: {
                    id : '',
                    name: ''
                },
                errors:{
                    name: ''
                },
                addDogVis: false,
                editDogVis: false,
                permissionsDogVis: false,
                currentRow:null,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                selectedPermissions:[],
                permissionTree:{},
                systems:[],
                activeName:''
            }
        },
        created () {
            this.handleQuery();
        },
        methods:{
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
            currentChange(currentRow, oldCurrentRow){
                this.currentRow = currentRow;
            },
            handleSelectedNode(node){
                this.selectedNode = node.id;
            },
            handleSavePermissions () {
                this.$axios.put(this.$config.SYSTEM_HOST + "/role/assignment?id=" + this.form.id ,this.selectedPermissions).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.permissionsDogVis = false;
                });
            },
            handleCurrentChange(page) {
                this.query.page = page;
                this.handleQuery();
            },
            showEdit() {
                this.$tableUtils.isSelected(this.currentRow);
                this.$objectUtils.clear(this.errors);
                this.$axios.get(this.$config.SYSTEM_HOST + "/role?id=" + this.currentRow.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.form = res.data.data;
                    this.editDogVis = true;
                });
            },
            showEditPermissions(){
                this.$tableUtils.isSelected(this.currentRow);
                this.form.id = this.currentRow.id;
                this.$axios.get(this.$config.SYSTEM_HOST + "/role/to_assignment?id="+this.form.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.permissionTree = res.data.data.permissionTree;
                    this.selectedPermissions = res.data.data.rolePermissionIds;
                    this.permissionsDogVis = true;
                });
            },
            showDelete() {
                this.$tableUtils.isSelected(this.currentRow);
                this.$confirm(<p>你确定要删除<span style="color: red;">{this.currentRow.name}</span>?</p>, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(this.$config.SYSTEM_HOST + "/role?id=" + this.currentRow.id).then((res) => {
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
            handleSubmit() {
                this.$objectUtils.clear(this.errors);
                if(this.form.id){
                    this.$axios.put(this.$config.SYSTEM_HOST + "/role",this.form).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.editDogVis = false;
                        this.handleQuery();
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }else{
                    this.$axios.post(this.$config.SYSTEM_HOST + "/role",this.form).then((res) => {
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
                this.addDogVis=true;
                this.form={};
                this.$objectUtils.clear(this.errors);
            },
            handleQuery(){
                this.$axios.get(this.$config.SYSTEM_HOST + "/role/query").then((res) => {
                    this.tableData = res.data.data.rows;
                    this.totalCount = res.data.data.totalCount;
                });
            }
        }
    }
</script>
<style>
    .dialog-footer{
    }
</style>

