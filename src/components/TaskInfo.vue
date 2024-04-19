<template>

  <div id="mainBox">
    <div class="step">
      <el-steps :active="1" align-center>
        <el-step title="任务信息"></el-step>
        <el-step title="选择数据"></el-step>
        <el-step title="特征选择"></el-step>
        <el-step title="方法选择" v-if="type == 4"></el-step>
        <el-step title="结果展示"></el-step>
      </el-steps>
    </div>
    <el-form
      ref="taskInfoForm"
      :model="taskInfoForm"
      label-width="100px"
      class="form"
      label-position="top"
    >
      <el-form-item prop="taskName" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务名称</span>
        </template>
        <el-input v-model="taskInfoForm.taskName"></el-input>
      </el-form-item>
      <el-form-item prop="principal" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务负责人</span>
        </template>
        <el-input v-model="taskInfoForm.principal"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="principal" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>任务类型</span>
        </template>
        <el-select v-model="taskInfoForm.tasktype" placeholder="请选择" @change="handleSelectChange">
        <el-option
          v-for="item in typeList"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      </el-form-item> -->
      <el-form-item prop="participants" class="inputBox shortItem">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>参与人员</span>
        </template>
        <el-input v-model="taskInfoForm.participants"></el-input>
      </el-form-item>
      <el-form-item prop="tips">
        <template slot="label">
          <span class="lineStyle">▍</span>
          <span>备注</span>
        </template>
        <el-input type="textarea" :autosize="{ minRows: 10, maxRows: 10 }" maxlength="200" show-word-limit placeholder="请输入内容"
          v-model="taskInfoForm.tips"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm('taskInfoForm')" round>重置</el-button>
        <!-- <el-button type="primary" @click="next()" round>下一步</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { disOptions } from "@/components/tab/constData.js";
import { resetForm } from "@/components/mixins/mixin.js";
import vuex_mixin from "@/components/mixins/vuex_mixin";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
export default {
  name: "TaskInfo",
  mixins: [resetForm, vuex_mixin],
  props: ['active','createTaskInfo'],
  watch: {},
  computed: {},
  data() {
    return {
      // disOptions: disOptions,
      typeList: ["缺失值补齐","描述性分析","单因素分析","一致性验证","疾病特征表征","病人画像"],
      
      taskInfoForm: {
        taskName: "",
        principal: "",
        tasktype: "",
        participants: "",
        tips: ""
      },
    };
  },

  // TODO:初始化两遍，还可把数据放到localStorage里解决这个问题
  created() {
    
  },
  mounted(){
    console.log("当前任务信息",this.createTaskInfo)
    if(this.createTaskInfo!=null && this.createTaskInfo.taskName!=null) {
      console.log("开始复制",this.createTaskInfo)
      this.taskInfoForm = this.createTaskInfo
    }
  },

  methods: {
    ...mapMutations("disFactor",["ChangeStep","ChangeTaskInfo"]),
    // init() {
    //   //和vuex内数据同步
    //   this.taskInfoForm.taskName = this.m_taskName;
    //   this.taskInfoForm.principal = sessionStorage.getItem("username");
    //   this.taskInfoForm.participants = this.m_participants;
    //   this.tips = this.m_tips;
    // },
    extStep() {
      this.$emit('send_taskInfo', this.taskInfoForm);
    },

    next() {
      if (
        this.taskInfoForm.taskName.length < 1 ||
        this.taskInfoForm.principal.length < 1 || this.taskInfoForm.tasktype==""
      ) {
        this.$message("请填写任务名称和负责人和任务类型");
        return;
      }
      if(this.taskInfoForm.tasktype==="缺失值补齐"){
        this.$router.push({ name: 'completeMissing', params: this.taskInfoForm});
      } else if(this.taskInfoForm.tasktype==="描述性分析"){
        this.$router.push({ name: 'describeAnalyze', params: this.taskInfoForm});
      }else if(this.taskInfoForm.tasktype==="一致性验证"){
        this.$router.push({ name: 'consistencyAnalyze', params: this.taskInfoForm});
      }else if(this.taskInfoForm.tasktype==="单因素分析"){
        this.$router.push({ name: 'singleAnalyze', params: this.taskInfoForm});
      }else if(this.taskInfoForm.tasktype==="疾病特征表征"){
        this.$router.push({ name: 'represent', params: this.taskInfoForm});
      }else if(this.taskInfoForm.tasktype==="病人画像")
        this.$router.push({ name: 'visualization', params: this.taskInfoForm});
    },
  },
};
</script>

<style scoped>
/* #mainBox{
  overflow: auto;
} */
.form {
  width: 80vh;
  margin: auto;
  margin-top: 100px;
}
.form .inputBox {
  width: 25%;
}
.form .shortItem {
  display: inline-block;
  margin-right: 12vh;
}
.form .inputBox:last-child {
  width: 50%;
}

.lineStyle {
  color: rgb(100, 172, 231);
}

#disGroup {
  width: 70%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.disGroup-item {
  width: 180px;
  margin-bottom: 10px;
}
</style>
