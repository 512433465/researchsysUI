<template>
    <div class="project-view">
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
    </div>
</template>
<script>


</script>
