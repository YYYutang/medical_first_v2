<template>
  <div class="container">
    <div class="right_step">
      <div class="step">
        <el-steps :active="active" align-center>
          <el-step title="选择数据"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="方法选择"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <div>
        <div v-if="taskInfo!=null && taskInfo.principal!=null" style="margin-top:10px; margin-bottom: 0px;">
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
            <span class="blue" style="color: gray">下表中蓝色显示的数据为原始数据，</span>
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
  </div>
</template>
<script>
import { postRequest } from "@/utils/api";

/*特征选择页面*/
export default ({
    name:'outcome',
    props:['active','missCompleteMehtod','label','newTaskInfo'],
    data(){
        return{
          taskInfo: null,
          taskInfoParam: {},
          tableData: []
        }
    },
    created(){
        // 加载任务管理传递的参数
      this.taskInfoParam = this.$route.params // 任务管理直接查看结果的参数
      this.taskInfo = this.newTaskInfo;
      if(this.taskInfo == null && (this.taskInfoParam!=null && this.taskInfoParam.taskInfo!=null)) this.taskInfo = this.taskInfoParam.taskInfo;
      this.fillData();
    },
    mounted(){
    },
    methods:{
      fillData(){
        let dataFillMethodVo = {};
        console.log("taskInfoParam",this.taskInfoParam)
        if(this.taskInfoParam!=={} && this.taskInfoParam!==null && this.taskInfoParam.label!=null){ // 判断是否是从任务管理直接调过来
          console.log("开始创建参数....")
          dataFillMethodVo = {
            missCompleteMethod: this.taskInfoParam.missCompleteMethods,
            tableName: this.taskInfoParam.label,
            newTaskInfo: this.newTaskInfo
          }
        }else{
          dataFillMethodVo = {
            missCompleteMethod: this.missCompleteMehtod,
            tableName: this.label,
            newTaskInfo: this.newTaskInfo
          };
        }
        console.log("传递给后端的参数：",dataFillMethodVo)
        postRequest("/api/fillData",dataFillMethodVo).then(response=>{
          this.tableData = response.data;
        }).catch(error=>{
          console.log(error);
        })
      }
    },

})
</script>
<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
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
    width:100%;
}

</style>