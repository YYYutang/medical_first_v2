<template>
  <div class="container">
    <div class="right_step">
      <div class="step">
        <el-steps :active="active" align-center v-if="Object.keys(this.taskInfoParam).length === 0">
          <el-step title="选择数据"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="方法选择"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <div class="right_content">
        <div v-if="taskInfo!=null && taskInfo.principal!=null" style="margin-top:20px; margin-bottom: 0px;" class="center">
          <p style="margin-top:0px">
            <i class="el-icon-user"></i>创建人:
            <span>{{ taskInfo.principal }}</span>
             <i style="margin-left:20px" class="el-icon-user"></i>参与人员:
            <span>{{ taskInfo.participants }}</span>
            <i style="margin-left:20px" class="el-icon-folder-opened"></i>任务名称:
            <span>{{ taskInfo.taskName }}</span>
            <i style="margin-left:20px" class="el-icon-folder-opened"></i>任务类型:
            <span>{{ taskInfo.tasktype }}</span>
             <i style="margin-left:20px" class="el-icon-folder-opened"></i>备注:
            <span>{{taskInfo.tips}}</span>
          </p>
        </div>
        <div class="center" style="margin-top:0px">
           <h2><br><br>结果数据预览<br><br></h2>
        </div>
        <div class="message">
            <span class="blue" style="color: gray">下表中黑色显示的数据为原始数据，</span>
            <span class="red"  style="color: gray">红色显示的数据为插补数据</span>
        </div>
        <div class="fillDataShow">
           <el-table :data="tableData" class="outcomeTable">
            <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" width="200px" align="center">
              <template slot-scope="scope">
                <!-- 自定义列模板 -->
                <span :style="{ color: scope.row[key].flag ? 'red' : 'black' }">{{ scope.row[key].value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
     <div class="stepbutton">
          <el-button
            size="small"
            v-if="Object.keys(this.taskInfoParam).length != 0"
            @click="returnTask"
            >返回</el-button
          >
          <el-button
            v-if="Object.keys(this.taskInfoParam).length != 0"
            size="small"
            type="primary"
            @click="exportxlsx"
            >导出</el-button
          >

        </div>
  </div>
</template>
<script>
import { postRequest } from "@/utils/api";
import * as XLSX from "xlsx";
/*特征选择页面*/
/**
 * 只需要判断两个参数 1、任务管理直接跳转查看结果 taskInfoParam  2、创建任务流程过来 createTaskInfo
 */
export default ({
    name:'outcome',
    props:['active','missCompleteMehtod','label','createTaskInfo'],
    data(){
        return{
          taskInfo: null,  // 展示任务信息
          taskInfoParam: {},
          tableData: [],
             showOptions: false,
                   filePath: "",
      fileName: "",
        }
    },
    created(){
        // 加载任务管理传递的参数
      this.taskInfoParam = this.$route.params // 任务管理直接查看结果的参数
      this.taskInfo = this.createTaskInfo;
      if(this.taskInfo == null && (this.taskInfoParam!=null && this.taskInfoParam.taskInfo!=null)) this.taskInfo = this.taskInfoParam.taskInfo; //
      this.fillData();
    },
    mounted(){
    },
    methods:{
      exportxlsx(){
        console.log(this.taskInfoParam)
              let dataFillMethodVo = {
        missCompleteMethod: this.taskInfoParam.missCompleteMethods,
        tableName: this.taskInfoParam.label,
      };
      let allParam = {
        dataFillMethodVo: dataFillMethodVo,
        path: this.filePath,
        fileName: this.fileName,
      };
      postRequest("/api/exportFile", allParam)
        .then((response) => {
          const csvData = response.data;
          // 将CSV数据解析为二维数组
          const csvArray = csvData.split("\n").map((row) => row.split(","));
          // 创建Workbook
          setTimeout(() => {
            const workbook = XLSX.utils.book_new();
            // 将数据填充到Worksheet中
            const worksheet = XLSX.utils.aoa_to_sheet(csvArray);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // 将Workbook保存为Excel文件
            XLSX.writeFile(workbook, `${ this.taskInfoParam.label}_export.xlsx`);

            this.open2("数据导出成功");
          }, 100); // 延迟执行100毫秒，可以根据需要调整延迟时间
          this.open2();
        })
        .catch((err) => {
          console.log("导出错误", err);
          this.open4();
        });
      },
        open2() {
      this.$message({
        message: "恭喜你，文件导出成功了哦",
        type: "success",
      });
    },
    open4() {
      this.$message.error("出错了哦，导出文件出错了哦");
    },
      fillData(){
        let dataFillMethodVo = {};
        console.log("taskInfoParam",this.taskInfoParam)
        if(this.taskInfoParam!=={} && this.taskInfoParam!==null && this.taskInfoParam.label!=null){ // 判断是从任务管理直接调过来
          console.log("开始创建参数....")
          dataFillMethodVo = {
            missCompleteMethod: this.taskInfoParam.missCompleteMethods,
            tableName: this.taskInfoParam.label,
            newTaskInfo: this.newTaskInfo
          }
        }else{  // 判断不是从任务管理直接调过来
          dataFillMethodVo = {
            missCompleteMethod: this.missCompleteMehtod,
            tableName: this.label,
            newTaskInfo: this.createTaskInfo
          };
        }
        console.log("传递给后端的参数：",dataFillMethodVo)
        postRequest("/api/fillData",dataFillMethodVo).then(response=>{
          this.tableData = response.data;
        }).catch(error=>{
          console.log(error);
        })
      },
  
       returnTask() {
      this.$router.push("/taskManage");
    },
    },

})
</script>
<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
   flex-direction: column;
  align-items: center; /* 垂直居中 */
  /* background-color: red; */
}

.right_step {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.right_step .step {
  display: block;
  width: 100%;
}
.center{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.fillDataShow{
  height: 600px;
  overflow-y: auto;
  overflow-x: auto;
  margin: 0 auto;
}

.message {
    margin-top: 0px;
    font-size: 15px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center; 
    
}
.outcomeTable{
      display: flex;
    flex-direction: column;
    align-items: center;
    width:auto;
}
.stepbutton {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
}
.right_content{
  display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>