<template>
    <div>
        <div>
            <el-button size="small" type="primary" @click="handleQuery" v-auth code="account:permission:list">刷新列表</el-button>
            <el-button size="small" type="primary" @click="showAdd" v-auth code="account:permission:add">添加权限</el-button>
            <el-button size="small" type="primary" @click="showEdit" v-auth code="account:permission:update">编辑权限</el-button>
            <el-button size="small" type="danger"  @click="showDelete" v-auth code="account:permission:delete">删除权限</el-button>
        </div>
        <br/>
        <el-tree
            :data="permissions"
            :props="defaultProps"
            highlight-current
            nodeKey="id"
            ref="tree"
            @node-click="handleSelectedNode"
        ></el-tree>
        <br/>
        <el-dialog title="添加权限" :visible.sync="addDogVis" size="small">
            <el-form label-width="80px">
                <el-form-item label="权限名称" :error="errors.name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="权限代码" :error="errors.code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                    <el-button @click="addDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑权限" :visible.sync="editDogVis" size="small">
            <el-form label-width="80px">
                <el-form-item label="权限名称" :error="errors.name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="权限代码" :error="errors.code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">保存编辑</el-button>
                    <el-button @click="editDogVis = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                permissions: [],
                totalCount:'',
                query : {

                },
                title:'',
                form: {
                    id : '',
                    name: '',
                    code: '',
                    parentId: '',
                    type:'',
                    systemId:''
                },
                errors:{
                    name: '',
                    code: '',
                    parentId: '',
                    type:''
                },
                editDogVis: false,
                addDogVis: false,
                currentRow:null,
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                selectedNode: null
            }
        },
        created () {
            this.handleQuery();
        },
        methods:{
            handleSelectedNode(node){
                this.selectedNode = node;
            },
            handleCurrentChange(page) {
                this.query.page = page;
                this.handleQuery();
            },
            showAdd() {
                this.$objectUtils.clear(this.errors);
                this.clearForm();
                this.addDogVis = true;
            },
            showEdit() {
                this.$objectUtils.clear(this.errors);
                this.clearForm();
                if(this.selectedNode){
                    //查询选中的这条权限数据
                    this.$axios.get(this.$config.SYSTEM_HOST + "/permission?id=" + this.selectedNode.id).then((res) => {
                        this.form = res.data.data;
                        this.editDogVis = true;
                    });
                }else{
                    this.$message.error("请先选择你要编辑的节点!");
                }

            },
            showDelete() {
                if(!this.selectedNode){
                    this.$message.error("请先选择你要删除的节点!");
                    return;
                }
                this.$confirm(<p>你确定要删除<span style="color: red;">{this.selectedNode.text}</span>?</p>, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(this.$config.SYSTEM_HOST + "/permission?id=" + this.selectedNode.id).then((res) => {
                        if(res.data.success){
                            this.$message('删除成功!');
                        }else{
                            this.$message.error(res.data.msg);
                        }
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
                    this.$axios.put(this.$config.SYSTEM_HOST + "/permission",{
                        'id':this.form.id,
                        'name':this.form.name,
                        'code':this.form.code,
                        'parentId':this.form.parentId,
                        "systemId":this.systemId
                    }).then((res) => {
                        if(res.data.success){
                            this.editDogVis = false;
                            this.handleQuery();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }else{
                    this.$axios.post(this.$config.SYSTEM_HOST + "/permission",{
                        'parentId':this.selectedNode.id,
                        'name':this.form.name,
                        'code':this.form.code
                    }).then((res) => {
                        if(res.data.success){
                            this.addDogVis = false;
                            this.handleQuery();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }
            },
            handleQuery(){
                this.$axios.get(this.$config.SYSTEM_HOST + "/permission/tree/").then((res) => {
                    this.permissions = res.data.data;
                });
                this.selectedNode = '';
            },
            clearForm(){
                this.form = {};
            }
        }
    }
</script>

