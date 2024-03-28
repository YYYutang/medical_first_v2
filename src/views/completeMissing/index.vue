<template>
  <div>
    <el-container class="outcontainer2">
        <datasetChoose v-if="active == 1" :active="active" :type="4" @send_data="handleDataFromChild" :showDataManageStep="showDataManageStep=true"></datasetChoose>
        <characterChoose v-if="active == 2" :active="active" :step="1" :label="label" :type="4" @send_feat="getCheackedFeats"></characterChoose>
        <missingalgo v-if="active == 3" :active="active" :checkedFeats="checkedFeats" :label="label" @send_method="getMissCompleteMehtod"></missingalgo>
        <missingoutcome v-if="active == 4" :active="active" :missCompleteMehtod="missCompleteMehtod" :label="label"></missingoutcome>
      <br><div class="stepbutton">
        <el-button size="small" v-if="active!=1" @click="stepBack(active)">上一步</el-button>
        <el-button size="small" type="primary" v-if="active!=4" @click="stepNext(active)"
          >下一步</el-button>
        <el-button size="small" type="primary" v-if="active==4" @click="dialogVisible = true"
          >导出</el-button>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
        <span>请输入文件夹路径</span>
        <el-input v-model="filePath" placeholder="请输入保存路径"></el-input>
        <span>请输入导出文件名称</span>
        <el-input v-model="fileName" placeholder="请输入文件名"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="exportFile()">确 定</el-button>
        </span>
    </el-dialog>
    </el-container>

  </div>
</template>
<script>
import { postRequest, getRequest } from "@/utils/api";
import characterChoose from "@/components/characterChoose/index.vue";
import datasetChoose from "@/components/datasetChoose/dataManage.vue";
import missingalgo from "@/views/completeMissing/algo.vue";
import missingoutcome from "@/views/completeMissing/outcome.vue";
/*缺失值补齐根页面*/
export default {
  components: {
    characterChoose,
    datasetChoose,
    missingalgo,
    missingoutcome,
  },
  data() {
    return {
      dialogVisible: false,
      filePath: '',
      fileName: '',
      active: 1,
      label: '',
      checkedFeats: [],
      missCompleteMehtod: [],
      folderPath: '',
      
      form:{
          imgSavePath:""
      },
    };
  },
  created(){
    
  },
  methods: {

    handleClose(){

    },
  
    changeState(){
      this.dialogVisible = true;
    },
    exportFile(){
      let dataFillMethodVo = {
        missCompleteMethod: this.missCompleteMehtod,
        tableName: this.label
      }
      let allParam = {
        dataFillMethodVo: dataFillMethodVo,
        path: this.filePath,
        fileName: this.fileName
      }
      console.log("文件上产信息为：")
      console.log(dataFillMethodVo)
      postRequest("/api/exportFile",allParam).then(response=>{
        this.open2()
        this.dialogVisible = false;
      }).catch(error=>{
        this.open2();
      })
    },
    open2() {
        this.$message({
          message: '恭喜你，文件导出成功了哦',
          type: 'success'
        });
      },
    open4() {
      this.$message.error('出错了哦，导出文件出错了哦');
    },
    getMissCompleteMehtod(data){
      // 获取子组件传递的数据 检查项+缺失值补齐算法名称
      this.missCompleteMehtod = data;
      console.log("获取到子组件传来的数据sdfdfdd：",this.missCompleteMehtod)
    },
    getCheackedFeats(data){
      this.checkedFeats = data;
    },
    stepBack(active) {
      this.active--;
    },
    stepNext(active) {
      // 第三步的时候 展示中文特征名称 有效值，缺失值，选着缺失值补齐算法
      this.active++;
    },
    handleDataFromChild(label){
      this.label = label;
    },
  },
};
</script>
<style scoped>
.outcontainer2 {
  display: flex;
  /* display: block; */
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.stepcontainer {
  display: flex;
  width: 100%;
  height: 100%;
}
.stepbutton {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;

}
</style>
