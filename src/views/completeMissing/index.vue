<template>
  <div>
    <el-container class="outcontainer2">
        <datasetChoose v-if="active == 1" :active="active" :type="4" @send_data="handleDataFromChild" :showDataManageStep="showDataManageStep=true"></datasetChoose>
        <characterChoose v-if="active == 2" :active="active" :step="1" :label="label" :type="4" :curentAnalyzeStep="1" @send_feat="getCheackedFeats" @sendTreeNode="getSelectTreeNode" :selectTreeNode="selectTreeNode" @sendFeatueData="getFeatureData" :featureDataFromParent="featureDataFromParent"></characterChoose>
        <missingalgo ref="missingalgo" v-if="active == 3" :active="active" :checkedFeats="checkedFeats" :isback="isback" :label="label" @send_method="getMissCompleteMehtod" @send_table_a="getTableA" @send_table_b="getTableB" @send_table_c="getTableC" :tableData1FromParent="tableData1FromParent" :tableData2FromParent="tableData2FromParent" :tableData3FromParent="tableData3FromParent"></missingalgo>
        <missingoutcome v-if="active == 4" :active="active" :missCompleteMehtod="missCompleteMehtod" :label="label"></missingoutcome>
      <br><div class="stepbutton">
        <el-button size="small" v-if="active!=1" @click="stepBack(active)">上一步</el-button>
        <el-button size="small" type="primary" v-if="active!=4" @click="stepNext(active)"
          >下一步</el-button>
        <el-button size="small" type="primary" v-if="active==4" @click="exportFile()"
          >导出</el-button>
      </div>
      <!-- <el-dialog
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
    </el-dialog> -->
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
      isback: false,
      tableData1FromParent: [],
      tableData2FromParent: [],
      tableData3FromParent: [],
      featureDataFromParent: [],
      selectTreeNode:[],
      // dialogVisible: false,
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
    open3() {
        this.$message({
          message: '请选择要填充的指标！',
          type: 'warning'
        });
    },
    handleClose(){

    },
    getTableA(data){
      this.tableData1FromParent = data;
    },
    getTableB(data){
      this.tableData2FromParent = data;
    },
    getTableC(data){
      this.tableData3FromParent = data;
    },
    getFeatureData(data){
      this.featureDataFromParent = data;
    },
    getSelectTreeNode(data){
      console.log("选中的树节点：",data)
      this.selectTreeNode = data;
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
      postRequest("/api/exportFile",allParam).then(response=>{
        let blob = new Blob([response.data], { type: 'text/csv' });
        // 创建 Data URI
        const dataUri = window.URL.createObjectURL(blob);
        // 创建隐藏的 <a> 标签
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = 'exported_data.csv'; // 下载文件的名称
        // 将 <a> 标签添加到页面中并模拟点击
        document.body.appendChild(link);
        link.click();
        // 下载完成后移除 <a> 标签
        document.body.removeChild(link);
        this.open2();
      }).catch(err=>{
        console.log("导出错误",err)
        this.open4();
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
    },
    getCheackedFeats(data){
      console.log("获取到：",data)
      this.checkedFeats = data;
    },
    stepBack(active) {
      this.active--;
      if(this.active === 2) {
        // 将 this.selectTreeNode 传递给子组件 characterChoose
        this.$refs.characterChoose.selectTreeNode = this.selectTreeNode;
        this.$refs.characterChoose.featureDataFromParent = this.featureDataFromParent;
      }
      if(this.active == 3){
        console.log("开始回退")
        this.isback = true;
        this.$refs.missingalgo.tableData1FromParent = this.tableData1FromParent;
        this.$refs.missingalgo.tableData2FromParent = this.tableData2FromParent;
        this.$refs.missingalgo.tableData3FromParent = this.tableData3FromParent;
      }
    },
    stepNext(active) {
      if(this.active == 2 && (this.checkedFeats==null || this.checkedFeats.length==0)) {
        // 判断是否选择数据
          this.characterChooseVisiable = true;
          this.open3();
      }else{
         this.active++;
        if(this.active == 3) this.isback = false;
      }
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
