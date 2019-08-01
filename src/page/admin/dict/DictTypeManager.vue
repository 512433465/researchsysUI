<template>
    <div>
        <div>
            <el-button size="small" type="primary" @click="handleQuery" v-auth code="system:dictType:list">刷新列表</el-button>
            <el-button size="small" type="primary" @click="showAdd" v-auth code="system:dictType:add">添加类别</el-button>
            <el-button size="small" type="primary" @click="showEdit" v-auth code="system:dictType:update">编辑类别</el-button>
            <el-button size="small" type="danger"  @click="showDelete" v-auth code="system:dictType:delete">删除类别</el-button>
        </div>
        <br/>
        <el-table
            :data="tableData"
            stripe
            @current-change="currentChange"
            highlight-current-row
            style="width: 100%">
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                prop="code"
                label="代码">
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                       layout="prev, pager, next"
                       :total="totalCount" @current-change="handleCurrentChange">
        </el-pagination>
        <br/>
        <el-dialog title="添加字典类别" :visible.sync="addDialogVisible"  size="small">
            <el-form label-width="80px">
                <el-form-item label="名称" :error="errors.name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="代码" :error="errors.code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                    <el-button @click="addDialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑字典类别" :visible.sync="editDialogVisible" size="small">
            <el-form label-width="80px">
                <el-form-item label="名称" :error="errors.name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="代码" :error="errors.code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">保存编辑</el-button>
                    <el-button @click="editDialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import Config from 'Config';
    export default {
        data() {
            return {
                tableData: [],
                totalCount:0,
                query : {

                },
                form: {
                    id : '',
                    name: '',
                    code:'',
                },
                errors:{
                    name: '',
                    code: '',
                    parentId: '',
                    type:''
                },
                addDialogVisible: false,
                editDialogVisible: false
            }
        },
        created () {
            this.handleQuery();
        },
        methods:{
            currentChange(currentRow, oldCurrentRow){
                this.currentRow = currentRow;
            },
            //翻页
            handleCurrentChange(page) {
                this.query.page = page;
                this.handleQuery();
            },
            //展示添加页面
            showAdd(){
                this.$objectUtils.clear(this.form);
                this.addDialogVisible = true;
            },
            //展示修改页面
            showEdit() {
                this.$tableUtils.isSelected(this.currentRow);
                this.$objectUtils.clear(this.errors);
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_type?id=" + this.currentRow.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.form = res.data.data;
                });
                this.editDialogVisible = true;
            },
            //显示删除界面
            showDelete() {
                this.$tableUtils.isSelected(this.currentRow);
                this.$confirm(<p>你确定要删除<span style="color: red;">{this.currentRow.name}</span>?</p>, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(this.$config.SYSTEM_HOST + "/dict_type?id=" + this.currentRow.id).then((res) => {
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
            //添加和修改
            handleSubmit() {
                this.$objectUtils.clear(this.errors);
                if(this.form.id){
                    //修改
                    this.$axios.put(this.$config.SYSTEM_HOST + "/dict_type",this.form).then((res) => {
                        if(res.data.success){
                            this.editDialogVisible = false;
                            this.handleQuery();
                            DictDetailManager.handleQueryDictType();
                        }else{
                            this.$message.error(res.data.msg);
                        }
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }else{
                    //添加
                    this.$axios.post(this.$config.SYSTEM_HOST + "/dict_type/",this.form).then((res) => {
                        if(res.data.success){
                            this.addDialogVisible = false;
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
            //刷新页面
            handleQuery(){
                console.log("0");
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_type/query",this.query).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.totalCount = res.data.data.totalCount;
                });
            },
            //用户选择的话 就把对象存起来
            handleSelectionChange(val){
                this.multipleSelection = val;
            }
        }
    }
</script>

