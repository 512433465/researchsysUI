<template>
    <div>
        <div>
            <el-select  v-model="query.typeId"  @change="selectChange(query.typeId)"  size="small">
                <el-option
                    v-for="item in dictTypeData"
                    :key="item.value"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <span></span>
            <el-button size="small" type="primary" @click="this.handleQuery"  v-auth code="system:dictDetail:list">刷新列表</el-button>
            <el-button size="small" type="primary" @click="showAdd"v-auth code="system:dictDetail:add" >添加明细</el-button>
            <el-button size="small" type="primary" @click="showEdit"v-auth code="system:dictDetail:update">编辑明细</el-button>
            <el-button size="small" type="danger"  @click="showDelete"v-auth code="system:dictDetail:delete">删除明细</el-button>
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
        <el-dialog title="添加字典明细" :visible.sync="addDialogVisible"  size="small">
            <el-form label-width="80px">
                <el-form-item label="明细名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="明细值">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="字典类别">
                    <el-select  v-model="form.typeId" filterable placeholder="请选择字典类型" size="small">
                        <el-option
                            v-for="item in dictTypeData"
                            :key="item.value"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                    <el-button @click="addDialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="编辑字典明细" :visible.sync="editDialogVisible" size="small">
            <el-form label-width="80px">
                <el-form-item label="明细名称">
                    <el-input v-model="updateform.name"></el-input>
                </el-form-item>
                <el-form-item label="明细值">
                    <el-input v-model="updateform.code"></el-input>
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
                tableData:[],
                dictTypeData: [],
                totalCount:0,
                query : {},
                form: {},
                errors:{},
                updateform:{},
                currentTypeId:'',
                addDialogVisible: false,
                multipleSelection: [],
                editDialogVisible: false
            }
        },
        created () {
            this.flushDictType();
            this.setFrist();
            this.handleQuery();
        },
        methods:{
            currentChange(currentRow, oldCurrentRow){
                this.currentRow = currentRow;
            },
            //翻页事件
            handleCurrentChange(page) {
                this.query.page = page;
                this.handleQuery();
            },
            //显示删除界面
            showDelete() {
                this.$tableUtils.isSelected(this.currentRow);
                this.$objectUtils.clear(this.errors);
                this.$confirm(<p>你确定要删除<span style="color: red;">{this.currentRow.name}</span>?</p>, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(this.$config.SYSTEM_HOST + "/dict_detail?id=" + this.currentRow.id).then((res) => {
                        if(res.data.success){
                            this.$message('删除成功!');
                        }else{
                            this.$message.error(res.data.msg);
                        }
                        this.flush();
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //展示修改页面
            showEdit() {
                this.$objectUtils.clear(this.errors);
                this.$objectUtils.clear(this.errors);
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_detail?id=" + this.currentRow.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.updateform = res.data.data;
                });
                this.editDialogVisible = true;
            },
            //展示添加页面
            showAdd(){
                this.$objectUtils.clear(this.errors);
                this.$objectUtils.clear(this.updateform);
                this.updateform.typeId = this.form.typeId;
                this.addDialogVisible = true;
            },
            //修改和添加
            handleSubmit() {
                //this.$message.error("请先选择数据字典类型!");
                if(this.updateform.id){
                    this.$axios.put(this.$config.SYSTEM_HOST + "/dict_detail/" ,this.form).then((res) => {
                        if(res.data.success){
                            this.editDialogVisible = false;
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
                    this.$axios.post(this.$config.SYSTEM_HOST + "/dict_detail/",this.form).then((res) => {
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
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_detail/query"+ this.$queryUtils.generateGetParameter(this.query)).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.totalCount = res.data.data.totalCount;
                });

            },
            // 刷新下拉框
            flushDictType(){
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_type/query").then((res) => {
                    this.dictTypeData = res.data.data.rows;
                });
            },
            setFrist(){
                console.log(this.dictTypeData);
            },
            // 下拉框的选择发生改变
            selectChange(typeId){
                this.query.typeId = typeId;
                this.handleQuery();
            }
        }
    }
</script>

