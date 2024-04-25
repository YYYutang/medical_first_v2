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
import { getRequest } from "@/utils/api";
export default {
  name: "TaskInfo",
  mixins: [resetForm, vuex_mixin],
  props: ['active','createTaskInfo', 'tasktype','type'],
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
        tips: "",
      },
      username: ""
    };
  },

  // TODO:初始化两遍，还可把数据放到localStorage里解决这个问题
  created() {
    if (this.tasktype === 1) { // 描述性分析
    this.getUserName().then(() => {
      console.log("方法内：")
      this.taskInfoForm.taskName = this.username + "_描述性分析_" + this.getDatatime()
      this.taskInfoForm.principal = this.username
    });
  } else if (this.tasktype === 2) { // 单因素分析
    console.log("开始获取用户信息2")
    this.getUserName().then(() => {
      this.taskInfoForm.taskName = this.username + "_单因素分析_" + this.getDatatime()
      this.taskInfoForm.principal = this.username
    });
  } else if (this.tasktype === 3) { // 一致性验证
    console.log("开始获取用户信息3")
    this.getUserName().then(() => {
      this.taskInfoForm.taskName = this.username + "_一致性验证_" + this.getDatatime()
      this.taskInfoForm.principal = this.username
    });
  }
  else if(this.tasktype == 4){
    this.getUserName().then(() => {
      this.taskInfoForm.taskName = this.username + "_缺失值补齐_" + this.getDatatime()
      this.taskInfoForm.principal = this.username
    });
  }
  else if(this.tasktype == 5){
    this.getUserName().then(() => {
      this.taskInfoForm.taskName = this.username + "_特征表征_" + this.getDatatime()
      this.taskInfoForm.principal = this.username
    });
  }
  },
  
  mounted(){
    console.log("type:",this.type)
    if(this.createTaskInfo!=null && this.createTaskInfo.taskName!=null) {
      console.log("开始复制",this.createTaskInfo)
      this.taskInfoForm = this.createTaskInfo
    }
  },

  methods: {
    getDatatime(){
      // 创建一个 Date 对象，它将包含当前的日期和时间
      var currentDate = new Date();
      // 获取年份
      var year = currentDate.getFullYear();
      // 获取月份（注意：月份是从 0 开始的，所以需要加上 1）
      var month = currentDate.getMonth() + 1;
      month = month < 10 ? '0' + month : month; // 补零
      // 获取日期
      var date = currentDate.getDate();
      date = date < 10 ? '0' + date : date; // 补零
      // 获取小时
      var hours = currentDate.getHours();
      hours = hours < 10 ? '0' + hours : hours; // 补零
      // 获取分钟
      var minutes = currentDate.getMinutes();
      minutes = minutes < 10 ? '0' + minutes : minutes; // 补零
      // 获取秒数
      var seconds = currentDate.getSeconds();
      seconds = seconds < 10 ? '0' + seconds : seconds; // 补零
      // 组合成字符串
      var currentDateTimeString = year + "/" + month + "/" + date + " " + hours + ":" + minutes + ":" + seconds;
      return currentDateTimeString;
    },
    // getUserName() {
    //   getRequest("index/getUserInfo").then((resp) => {
    //     // alert("name:",resp.data)
    //     console.log("用户信息：", resp)
    //     this.username = resp.data;
    //     console.log("name:",this.username)
    //   });
    // },
    getUserName() {
    return new Promise((resolve, reject) => {
      getRequest("index/getUserInfo").then((resp) => {
        console.log("用户信息：", resp)
        this.username = resp.data;
        console.log("name:", this.username)
        resolve(); // 用户名获取成功后调用 resolve()
      }).catch((error) => {
        reject(error); // 获取用户名失败时调用 reject()
      });
    });
  },
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
