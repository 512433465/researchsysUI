<template>
    <div>
        <div>
            <el-select  v-model="query.level" placeholder="项目级别"  @change="levelSelectChange(query.level)" style=" height: 36px;" size="small">
                <el-option
                    v-for="item in level"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name">
                </el-option>
            </el-select>
            <el-select  v-model="query.college" placeholder="所属科室"  @change="collegeSelectChange(query.college)" style=" height: 36px;" size="small">
                <el-option
                    v-for="item in college"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name">
                </el-option>
            </el-select>
            <el-select  v-model="query.subject" placeholder="研究方向"  @change="subjectSelectChange(query.subject)"style=" height: 36px;"  size="small">
                <el-option
                    v-for="item in subject"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name">
                </el-option>
            </el-select>
            <el-select  v-model="query.achievementType" placeholder="成果类型"  @change="achievementTypeSelectChange(query.achievementType)" style=" height: 36px;" size="small">
                <el-option
                    v-for="item in achievementType"
                    :key="item.code"
                    :label="item.name"
                    :value="item.name">
                </el-option>
            </el-select>
            <br/>
            <el-button size="small" type="primary" @click="handleQuery" v-auth code="account:project:list">刷新列表</el-button>
            <el-button size="small" type="primary" @click="showAdd" v-auth code="account:project:add">添加项目</el-button>
            <el-button size="small" type="primary" @click="showEdit"v-auth code="account:project:update">编辑项目</el-button>
            <el-button size="small" type="primary" @click="showDetails"v-auth code="account:project:detail">查看详情</el-button>
            <el-button size="small" type="primary" @click="showProjectApplication"v-auth code="account:project:application">项目申报</el-button>
            <el-button size="small" type="primary" @click="showUpdateApplication"v-auth code="account:project:updateApplication">申请变更</el-button>
            <el-button size="small" type="primary" @click="showConcludeAppliaction"v-auth code="account:project:conclude">申请结题</el-button>
            <el-button size="small" type="danger" @click="showDelete"v-auth code="account:project:delete">项目删除</el-button>
        </div>
        <br/>
        <el-table
            :data="tableData"
            stripe
            highlight-current-row
            @current-change="currentChange"
            style="width: 100%">
            <el-table-column
                prop="name"
                label="项目名">
            </el-table-column>
            <el-table-column
                prop="userName"
                label="负责人">
            </el-table-column>
            <el-table-column
                prop="level"
                label="项目级别">
            </el-table-column>
            <el-table-column
                prop="college"
                label="所属学院">
            </el-table-column>
            <el-table-column
                prop="subject"
                label="学科">
            </el-table-column>
            <el-table-column
                prop="achievementType"
                label="成果类型">
            </el-table-column>
            <el-table-column
                prop="statusString"
                label="项目状态">
            </el-table-column>
        </el-table>
        <el-pagination class="pagination"
                       layout="prev, pager, next"
                       :total="totalCount" @current-change="handleCurrentChange">
        </el-pagination>
        <br/>
        <el-dialog title="变更申请" :visible.sync="updateApplicationVisible" size="small" >
            <el-form :model="form" >
                <el-form-item label="项目名称" :error="errors.name">
                    <el-input v-model="form.projectName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="变更说明" :error="errors.name">
                    <el-input type="textarea"  :autosize="{ minRows: 5}" v-model="form.updateDescription" placeholder="大致描述你要变更的内容" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleUpdateApplication">申请</el-button>
                    <el-button @click="updateApplicationVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="结题申报" :visible.sync="concludeApplicationVisible" size="small" >
            <el-form :model="form" >
                <el-form-item label="项目名称" :error="errors.name">
                    <el-input v-model="form.projectName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="结题说明" :error="errors.name">
                    <el-input type="textarea"  :autosize="{ minRows: 5}" v-model="form.projectCompletion" placeholder="结题说明" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleConcludeApplication">结题</el-button>
                    <el-button @click="concludeApplicationVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="项目申报" :visible.sync="projectApplicationVisible" size="small" >
            <el-form :model="form" >
                <el-form-item label="项目名称" :error="errors.name">
                    <el-input v-model="form.projectName" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="申报说明" :error="errors.name">
                    <el-input type="textarea"  :autosize="{ minRows: 5}" v-model="form.projectDescription" placeholder="大致描述你项目的申报说明" ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleProjectApplication">申报</el-button>
                    <el-button @click="projectApplicationVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog title="添加项目" :visible.sync="addDialogVisible" width="90%">
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
                            <el-form-item>
                                <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                                <el-button @click="addDialogVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="成员" name="second">
                        <el-form :model="form.members" label-width="80px" class="demo-dynamic">
                            <el-form-item label-width="0px" v-for="(member,index) in form.members">
                                <el-row :gutter="10">
                                    <el-col :span="10">
                                        <el-input v-model="member.memberName" placeholder="成员名称"></el-input>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input v-model="member.phone" placeholder="成员电话"></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button @click.prevent="removeMember(member)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addmember()">新增成员</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="资金" name="third">
                        <el-form :model="form.funds" label-width="80px" class="demo-dynamic">
                            <el-form-item label-width="0px" v-for="(fund,index) in form.funds">
                                <el-row :gutter="10">
                                    <el-col :span="10">
                                        <el-input v-model="fund.subject"  placeholder="资金名目"></el-input>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input value="number" v-model="fund.number" placeholder="金额大小"><template slot="append">万元</template></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button @click.prevent="removeFund(fund)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addFund()">新增资金名目</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </el-dialog>
        <el-dialog title="编辑项目" :visible.sync="editDialogVisible" width="90%">
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
                            <el-form-item>
                                <el-button type="primary" @click="handleSubmit">立即创建</el-button>
                                <el-button @click="addDialogVisible = false">取消</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="成员" name="second">
                        <el-form :model="form.members" label-width="80px" class="demo-dynamic">
                            <el-form-item label-width="0px" v-for="(member,index) in form.members"
                                          :rules="{required: true, message: '成员不能为空', trigger: 'blur'}">
                                <el-row :gutter="10">
                                    <el-col :span="10">
                                        <el-input v-model="member.memberName"  placeholder="成员名称"></el-input>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input v-model="member.phone" placeholder="成员电话"></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button @click.prevent="removeMember(member)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addmember()">新增成员</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="资金" name="third">
                        <el-form :model="form.funds" label-width="80px" class="demo-dynamic">
                            <el-form-item label-width="0px" v-for="(fund,index) in form.funds">
                                <el-row :gutter="10">
                                    <el-col :span="10">
                                        <el-input v-model="fund.subject"  placeholder="资金名目"></el-input>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input value="number" v-model="fund.number" placeholder="金额大小"><template slot="append">万元</template></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button @click.prevent="removeFund(fund)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addFund()">新增资金名目</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </el-dialog>
        <el-dialog title="项目详情" :visible.sync="detailDialogVisible" width="90%">
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
                                    <el-col :span="10">
                                        <el-input v-model="member.memberName"  placeholder="成员名称"></el-input>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input v-model="member.phone" placeholder="成员电话"></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button @click.prevent="removeMember(member)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addmember()">新增成员</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="资金" name="third">
                        <el-form :model="form.funds" label-width="80px" class="demo-dynamic">
                            <el-form-item label-width="0px" v-for="(fund,index) in form.funds">
                                <el-row :gutter="10">
                                    <el-col :span="10">
                                        <el-input v-model="fund.subject"  placeholder="资金名目"></el-input>
                                    </el-col>
                                    <el-col :span="10">
                                        <el-input value="number" v-model="fund.number" placeholder="金额大小"><template slot="append">万元</template></el-input>
                                    </el-col>
                                    <el-col :span="2">
                                        <el-button @click.prevent="removeFund(fund)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="addFund()">新增资金名目</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </template>
        </el-dialog>
    </div>
</template>

<style>
    .el-col {
        border-radius: 4px;
    }
</style>

<script>
    import Config from 'Config';
    import ElDialog from "../../../../node_modules/element-ui/packages/dialog/src/component.vue";
    import ElCol from "element-ui/packages/col/src/col";
    import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
    export default {
        components: {
            ElButton,
            ElCol,
            ElDialog},
        data() {
            return {
                tableData: [],
                totalCount:0,
                query : {
                },
                activeName: 'first',
                form: {
                },
                errors:{
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
                multipleSelection: [],
                projectApplicationVisible:false,
                addDialogVisible: false,
                editDialogVisible: false,
                detailDialogVisible:false,
                concludeApplicationVisible:false,
                updateApplicationVisible:false
            }
        },
        created () {
            this.handleQuery();
            this.initSelect();
        },
        methods: {
            currentChange(currentRow, oldCurrentRow) {
                this.currentRow = currentRow;
            },
            handleSelectedNode(node) {
                this.selectedNode = node.id;
            },
            handleCurrentChange(page) {
                this.query.page = page;
                this.handleQuery();
            },
            //打开申请变更
            showUpdateApplication(){
                if(this.currentRow != null){
                    //清空错误信息
                    this.$objectUtils.clear(this.errors);
                    //清空form
                    this.$objectUtils.clear(this.form);
                    //初始化一些信息
                    this.form.projectId = this.currentRow.id;
                    this.form.projectName = this.currentRow.name;
                    this.updateApplicationVisible = true;
                }else{
                    this.$message.error("请先选择一个项目!");
                }
            },
            //打开项目申请
            showProjectApplication(){
                if(this.currentRow != null) {
                    //清空错误信息
                    this.$objectUtils.clear(this.errors);
                    //清空form
                    this.$objectUtils.clear(this.form);
                    //初始化一些信息
                    this.form.projectId = this.currentRow.id;
                    this.form.projectName = this.currentRow.name;
                    this.projectApplicationVisible = true;
                }else{
                    this.$message.error("请先选择一个项目!");
                }
            },
            //打开结题申请
            showConcludeAppliaction(){
                if(this.currentRow != null) {
                    //清空错误信息
                    this.$objectUtils.clear(this.errors);
                    //清空form
                    this.$objectUtils.clear(this.form);
                    //初始化一些信息
                    this.form.projectId = this.currentRow.id;
                    this.form.projectName = this.currentRow.name;
                    this.concludeApplicationVisible = true;
                }else{
                    this.$message.error("请先选择一个项目!");
                }
            },

            //展示添加页面
            showAdd(){
                this.$objectUtils.clear(this.errors);
                this.$objectUtils.clear(this.form);
                this.form={

                    members: [{},{},{}],
                    funds:[{},{},{}]
                };
                this.activeName= 'first',
                this.addDialogVisible = true;
            },
            //展示详情
            showDetails(){
                if(this.currentRow != null) {
                    this.$objectUtils.clear(this.errors);
                    this.$objectUtils.clear(this.form);
                    this.$axios.get(this.$config.SYSTEM_HOST + "/project?id=" + this.currentRow.id).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.form = res.data.data;
                        this.activeName = 'first',
                            this.detailDialogVisible = true;
                    });
                }else{
                    this.$message.error("请先选择一个项目!");
                }
            },
            //展示修改页面
            showEdit() {
                if(this.currentRow != null) {
                    if (this.currentRow.canUpdate) {
                        console.log(this.currentRow);
                        this.$objectUtils.clear(this.errors);
                        this.$objectUtils.clear(this.form);
                        this.$axios.get(this.$config.SYSTEM_HOST + "/project?id=" + this.currentRow.id).then((res) => {
                            this.$responseUtils.handlerError(res);
                            this.form = res.data.data;
                            this.activeName = 'first',
                                this.editDialogVisible = true;
                        });
                    } else {
                        this.$message('该项目当前状态无法修改!');
                    }
                }else{
                    this.$message.error("请先选择一个项目!");
                }
            },
            //显示删除界面
            showDelete() {
                if(this.currentRow == null){
                    this.$message.error("请先选择你要删除的项目!");
                    return;
                }

                this.$confirm(<p>你确定要删除<span style="color: red;">{this.currentRow.name}</span>?</p>, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete(this.$config.SYSTEM_HOST + "/project?id=" + this.currentRow.id).then((res) => {
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
            //申请变更
            handleUpdateApplication(){
                this.$objectUtils.clear(this.errors);
                this.$axios.post(this.$config.SYSTEM_HOST +"/update_application",this.form).then((res) => {
                    if(res.data.success){
                        this.updateApplicationVisible = false;
                        this.updatePage();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((response) => {
                    if(this.$responseUtils.isBadRequest(response)){
                        this.errors = this.$responseUtils.getErrors(response);
                    }
                });
            },
            //项目申报
            handleProjectApplication(){
                this.$objectUtils.clear(this.errors);
                this.$axios.post(this.$config.SYSTEM_HOST +"/project_application",this.form).then((res) => {
                    if(res.data.success){
                        this.projectApplicationVisible = false;
                        this.updatePage();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((response) => {
                    if(this.$responseUtils.isBadRequest(response)){
                        this.errors = this.$responseUtils.getErrors(response);
                    }
                });
            },
            //结题申请
            handleConcludeApplication(){
                this.$objectUtils.clear(this.errors);
                this.$axios.post(this.$config.SYSTEM_HOST +"/conclude_application",this.form).then((res) => {
                    if(res.data.success){
                        this.concludeApplicationVisible = false;
                        this.updatePage();
                    }else{
                        this.$message.error(res.data.msg);
                    }
                }).catch((response) => {
                    if(this.$responseUtils.isBadRequest(response)){
                        this.errors = this.$responseUtils.getErrors(response);
                    }
                });
            },
            //添加和修改
            handleSubmit() {
                this.$objectUtils.clear(this.errors);
                if(this.form.id){
                    //修改
                    this.$axios.put(this.$config.SYSTEM_HOST +"/project",this.form).then((res) => {
                        if(res.data.success){
                            this.editDialogVisible = false;
                            this.updatePage();
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
                    this.$axios.post(this.$config.SYSTEM_HOST  +"/project",this.form).then((res) => {
                        this.$responseUtils.handlerError(res);
                        this.addDialogVisible = false;
                        this.updatePage();
                    }).catch((response) => {
                        if(this.$responseUtils.isBadRequest(response)){
                            //在这里处理验证错误
                            this.errors = this.$responseUtils.getErrors(response);
                        }
                    });
                }
            },
            //项目申报
            handleAudit(){
                this.$axios.put(this.$config.SYSTEM_HOST + "/project/project_audit?id="+this.currentRow.id ).then((res) => {
                this.updatePage();
                }).catch((response) => {
                    if(this.$responseUtils.isBadRequest(response)){
                        //在这里处理验证错误
                        this.errors = this.$responseUtils.getErrors(response);
                    }
                });
            },
            //刷新页面(有筛选条件)
            updatePage(){
                this.$axios.get(this.$config.SYSTEM_HOST + "/project/query" ).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.totalCount = res.data.data.totalCount;
                });
            },
            //刷新页面(去除筛选条件)
            handleQuery(){
                this.$objectUtils.clear(this.query);
                this.$axios.get(this.$config.SYSTEM_HOST + "/project/query" ).then((res) => {
                    this.tableData = res.data.data.rows;
                    this.totalCount = res.data.data.totalCount;
                });
            },
            //加载下拉框
            initSelect(){
                //项目等级
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_type/query?code=PROJECTLEVEL").then((res) => {
                    this.level = res.data.data.rows[0].dataDictDetails;
                });
                //所属科室
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_type/query?code=DEPART").then((res) => {
                    this.college = res.data.data.rows[0].dataDictDetails;
                });
                //研究方向
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_type/query?code=ACHIEVEMENTTYPE").then((res) => {
                    this.achievementType = res.data.data.rows[0].dataDictDetails;
                });
                //成果类型
                this.$axios.get(this.$config.SYSTEM_HOST + "/dict_type/query?code=PROJECTTYPE").then((res) => {
                    this.subject = res.data.data.rows[0].dataDictDetails;
                });
            },
            //等级选中事件
            levelSelectChange(selectedLevel){
                if(selectedLevel != '') {
                    this.query.level = selectedLevel;
                    this.$axios.get(this.$config.SYSTEM_HOST + "/project/query" + this.$queryUtils.generateGetParameter(this.query)).then((res) => {
                        this.tableData = res.data.data.rows;
                        this.totalCount = res.data.data.totalCount;
                    });
                }
            },
            //所属学院选中事件
            collegeSelectChange(selectedCollege){
                if(selectedCollege != '') {
                    this.query.college = selectedCollege;
                    this.$axios.get(this.$config.SYSTEM_HOST + "/project/query" + this.$queryUtils.generateGetParameter(this.query)).then((res) => {
                        this.tableData = res.data.data.rows;
                        this.totalCount = res.data.data.totalCount;
                    });
                }
            },
            //成果类型选中事件
            achievementTypeSelectChange(selectedAchievementType){
                if(selectedAchievementType != '') {
                    this.query.achievementType = selectedAchievementType;
                    this.$axios.get(this.$config.SYSTEM_HOST + "/project/query" + this.$queryUtils.generateGetParameter(this.query)).then((res) => {
                        this.tableData = res.data.data.rows;
                        this.totalCount = res.data.data.totalCount;
                    });
                }
            },
            //学科选中事件
            subjectSelectChange(selectedSubject){
                if(selectedSubject != '') {
                    this.query.subject = selectedSubject;
                    this.$axios.get(this.$config.SYSTEM_HOST + "/project/query" + this.$queryUtils.generateGetParameter(this.query)).then((res) => {
                        this.tableData = res.data.data.rows;
                        this.totalCount = res.data.data.totalCount;
                    });
                }
            },
            //成员动态表单
            removeMember(member) {
                var index = this.form.members.indexOf(member)
                if (index !== -1) {
                    this.form.members.splice(index, 1)
                }
            },
            addmember() {
                this.form.members.push({
                    memberName:'',
                    phone:'',
                });
            },
            //资金动态表单
            removeFund(fund) {
                var index = this.form.funds.indexOf(fund)
                if (index !== -1) {
                    this.form.funds.splice(index, 1)
                }
            },
            addFund() {
                this.form.funds.push({
                    subject:'',
                    number:'',
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

