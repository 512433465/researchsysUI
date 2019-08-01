<template>
    <div>
        <div>
            <el-button size="small" type="primary" @click="handleQuery"v-auth code="account:application:list">刷新列表</el-button>
            <el-button size="small" type="primary" @click="showApplicationDetails"v-auth code="account:application:detail">查看申请</el-button>
            <el-button size="small" type="primary" @click="showProject" v-auth code="account:project:detail">查看项目</el-button>
            <el-button size="small" type="primary" @click="applyPass" v-auth code="account:application:pass">申请通过</el-button>
            <el-button size="small" type="danger" @click="applyNotPass" v-auth code="account:application:notpass">申请驳回</el-button>
        </div>
        <br/>
        <el-table
            :data="tableData"
            highlight-current-row
            @current-change="currentChange"
            style="width: 100%">
            <el-table-column
                prop="projectName"
                label="项目名称">
            </el-table-column>
            <el-table-column
                prop="applicant"
                label="申请人">
            </el-table-column>
            <el-table-column
                prop="status"
                label="状态">
            </el-table-column>
        </el-table>

        <el-pagination class="pagination"
                       layout="prev, pager, next"
                       :total="totalCount" @current-change="handleCurrentChange">
        </el-pagination>
        <br/>
        <el-dialog title="变更驳回" :visible.sync="updateApplicationNotPassVisible" size="small" >
            <el-form :model="form" >
                <el-form-item label="项目名称" :error="errors.name">
                    <el-input v-model="form.projectName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="驳回理由" :error="errors.name">
                    <el-input type="textarea"  :autosize="{ minRows: 5}" v-model="form.backInformation" placeholder="驳回理由" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleNotPass">驳回</el-button>
                    <el-button @click="updateApplicationNotPassVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="变更详情" :visible.sync="detailDialogVisible" size="small" >
            <el-form :model="form" >
                <el-form-item label="项目名称" >
                    <el-input v-model="form.projectName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="申请人" :error="errors.name">
                    <el-input v-model="form.applicant"  readonly="readonly" ></el-input>
                </el-form-item>
                <el-form-item label="申报说明" :error="errors.name">
                    <el-input type="textarea"  v-model="form.projectDescription"  readonly="readonly" ></el-input>
                </el-form-item>
                <el-form-item label="驳回理由" :error="errors.name">
                    <el-input type="textarea"  v-model="form.backInformation"  readonly="readonly" ></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="项目详情" :visible.sync="projectDialogVisible" width="90%">
            <template>
                <el-tabs v-model="activeName"  >
                    <el-tab-pane label="基础信息" name="first">
                        <el-form label-width="80px">
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item label="项目名称" :error="errors.name">
                                        <el-input v-model="form.name" placeholder="请输入项目名称" ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="负责人" :error="errors.userName">
                                        <el-input v-model="form.userName" placeholder="请输入负责人" ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item label="项目级别" :error="errors.level">
                                        <el-select  v-model="form.level"  placeholder="请选择项目级别"  style="width:100%; height: 36px;">
                                            <el-option
                                                v-for="item in level"
                                                :key="item.code"
                                                :label="item.name"
                                                :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="所属学院" :error="errors.college">
                                        <el-select  v-model="form.college"  placeholder="请选择所属学院"  style="width:100%; height: 36px;">
                                            <el-option
                                                v-for="item in college"
                                                :key="item.code"
                                                :label="item.name"
                                                :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item label="学科" :error="errors.subject">
                                        <el-select  v-model="form.subject"  placeholder="请选择学科"  style="width:100%; height: 36px;">
                                            <el-option
                                                v-for="item in subject"
                                                :key="item.code"
                                                :label="item.name"
                                                :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="结果类型" :error="errors.achievementType">
                                        <el-select  v-model="form.achievementType"  placeholder="请选择结果类型"   style="width:100%; height: 36px;">
                                            <el-option
                                                v-for="item in achievementType"
                                                :key="item.code"
                                                :label="item.name"
                                                :value="item.name">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="预期结果" :error="errors.expectedResult">
                                <el-input   type="textarea" autosize maxlength="200" 　placeholder="预期结果"  v-model="form.expectedResult" ></el-input>
                            </el-form-item>
                            <el-form-item label="立项目的" :error="errors.purpose">
                                <el-input   type="textarea" autosize maxlength="200"　placeholder="立项目的"  v-model="form.purpose" ></el-input>
                            </el-form-item>
                            <el-form-item label="现有条件" :error="errors.existingConditions">
                                <el-input   type="textarea" autosize maxlength="200"　placeholder="现有条件"  v-model="form.existingConditions" ></el-input>
                            </el-form-item>
                            <el-form-item label="方案分析" :error="errors.viableAnalysis">
                                <el-input   type="textarea" autosize maxlength="200"　placeholder="研究方案可行性分析"  v-model="form.viableAnalysis" ></el-input>
                            </el-form-item>
                            <el-form-item label="效益分析" :error="errors.economicAnalysis">
                                <el-input   type="textarea" autosize maxlength="200"　placeholder="社会效益经济效益分析"  v-model="form.economicAnalysis" ></el-input>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="成员" name="second">
                        <el-form :model="form.members" label-width="80px" class="demo-dynamic">
                            <el-form-item label-width="0px" v-for="(member,index) in form.members"
                                          :rules="{required: true, message: '成员不能为空', trigger: 'blur'}">
                                <el-row :gutter="10">
                                    <el-col :span="11">
                                        <el-input v-model="member.memberName"  placeholder="成员名称"></el-input>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-input v-model="member.phone" placeholder="成员电话"></el-input>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="资金" name="third">
                        <el-form :model="form.funds" label-width="80px" class="demo-dynamic">
                            <el-form-item label-width="0px" v-for="(fund,index) in form.funds">
                                <el-row :gutter="10">
                                    <el-col :span="11">
                                        <el-input v-model="fund.subject"  placeholder="资金名目"></el-input>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-input value="number" v-model="fund.number" placeholder="金额大小"><template slot="append">万元</template></el-input>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import Config from 'Config';
    import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
    export default {
        components: {
            ElButton,
            ElCol,
            ElDialog
        },
        data() {
            return {
                tableData: [],
                totalCount:0,
                query:{
                },
                form: {
                },
                level:{
                    code:'',
                    name:''
                },
                college:{
                    code:'',
                    name:''
                },
                achievementType:{
                    code:'',
                    name:''
                },
                subject:{
                    code:'',
                    name:''
                },
                errors:{
                },
                activeName: 'first',
                currentRow: null,
                detailDialogVisible: false,
                projectDialogVisible: false,
                updateApplicationNotPassVisible: false
            }
        },
        created () {
            this.handleQuery();
        },
        methods:{
            handleQuery() {
                this.$axios.get(this.$config.SYSTEM_HOST + "/project_application/query").then((res) => {
                    this.tableData = res.data.data.rows;
                    this.totalCount = res.data.data.totalCount;
                });
            },
            applyPass(){
                if(this.currentRow.status == '申报中') {
                    this.$axios.put(this.$config.SYSTEM_HOST + "/project_application/pass", this.currentRow).then((res) => {
                        this.handleQuery();
                    });
                }else {
                    this.$message('当前状态无法进行申报通过操作!');
                }
            },
            handleNotPass(){
                this.$axios.put(this.$config.SYSTEM_HOST + "/project_application/not_pass", this.form).then((res) => {
                    this.updateApplicationNotPassVisible = false;
                    this.handleQuery();
                });
            },
            applyNotPass(){
                if(this.currentRow.status == '申报中') {
                    //清空错误信息
                    this.$objectUtils.clear(this.errors);
                    //清空form
                    this.$objectUtils.clear(this.form);
                    //初始化一些信息
                    this.form.id = this.currentRow.id;
                    this.form.projectId = this.currentRow.projectId;
                    this.form.projectName = this.currentRow.projectName;
                    this.updateApplicationNotPassVisible = true;
                }else{
                    this.$message('当前状态无法进行申报驳回操作!');
                }
            },
            currentChange(currentRow, oldCurrentRow){
                this.currentRow = currentRow;
            },
            //展示详情
            showApplicationDetails(){
                this.$objectUtils.clear(this.errors);
                this.$objectUtils.clear(this.form);
                this.$axios.get(this.$config.SYSTEM_HOST + "/project_application?id=" + this.currentRow.id).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.form = res.data.data;
                    this.detailDialogVisible = true;
                });
            },
            //展示项目
            showProject(){
                this.$objectUtils.clear(this.errors);
                this.$objectUtils.clear(this.form);
                this.$axios.get(this.$config.SYSTEM_HOST + "/project?id=" + this.currentRow.projectId).then((res) => {
                    this.$responseUtils.handlerError(res);
                    this.form = res.data.data;
                    this.activeName= 'first',
                        this.projectDialogVisible = true;
                });
            },
            //翻页
            handleCurrentChange(page) {
                this.query.page = page;
                this.handleQuery();
            }
        }
    }
</script>

