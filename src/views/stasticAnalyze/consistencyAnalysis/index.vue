<template>
  <div>
    <el-container >
        <div class="outcontainer">
          <taskInfo v-if="active==1" :active="active" ref="taskInfo" @send_taskInfo = "getTaskInfo" :createTaskInfo="createTaskInfo" :tasktype="3"></taskInfo>
          <datasetChoose v-if="active == 2" class="con_datasetChoose" :active='active' :type="3" @send_data="handleDataFromChild" :showDataManageStep="showDataManageStep=true"></datasetChoose>
          <characterChoose v-if="active == 3" :active='active' :analyzeStep="3" :type="2" :label="label" @send_feat="getCheackedFeats" :curentAnalyzeStep="3" 
          @sendTreeNode="getSelectTreeNode" :selectTreeNode="selectTreeNode" @sendFeatueData="getFeatureData" :featureDataFromParent="featureDataFromParent"></characterChoose>
          <conssitencyOutcome v-if="active == 4" :active='active' :label="label" :checkedFeats="checkedFeats" ref="childComponentRef" :newTaskInfo="newTaskInfo" :createTaskInfo="createTaskInfo"></conssitencyOutcome>
        <div class="stepbutton">
          <el-button size="small" v-if="active != 1" @click="stepBack(active)"
            >上一步</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="active != 4"
            @click="stepNext(active)"
            >下一步</el-button
          >
          <!-- <el-button
            size="small"
            type="primary"
            v-if="active == 4"
            @click="exportContent()"
            >导出</el-button
          > -->
             <el-button v-if="active == 4" size="small" type="primary" @click="showOptions = true">导出</el-button>
          <!-- 使用 el-dialog 组件作为弹出框 -->
          <el-dialog
            title="选项"
            :visible.sync="showOptions"
            width="30%"
            :close-on-click-modal="false"
          >
            <el-button @click="exportContent">导出为图片</el-button>
            <el-button @click="downloadPDF">导出为pdf</el-button>
          </el-dialog>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import characterChoose from "@/components/characterChoose/index.vue";
import datasetChoose from "@/components/datasetChoose/dataManage.vue";
import conssitencyOutcome from "@/views/stasticAnalyze/consistencyAnalysis/outCome.vue"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import taskInfo from "@/components/TaskInfo.vue"
/*描述性统计分析页面*/
export default {
  name: "outcome",
  prop: [],
  components: {
    characterChoose,
    datasetChoose,
    conssitencyOutcome,
    taskInfo
  },
  data() {
    return {
      showOptions: false,
      newTaskInfo: null,
      featureDataFromParent: [],
      selectTreeNode: [],
      label: '',
      active: 1,
      checkedFeats: [],
      createTaskInfo: null
    };
  },
  created(){
    this.newTaskInfo = this.$route.params;
  },
  methods: {
     getTaskInfo(data){
      this.createTaskInfo = data;
      this.createTaskInfo.tasktype="一致性验证"
      console.log("获取到任务信息",this.createTaskInfo)
    },
    open3() {
      this.$message({
        message: '请选择要处理的指标！',
        type: 'warning'
      });
    },
     getFeatureData(data){
      this.featureDataFromParent = data;
    },
    getSelectTreeNode(data){
      console.log("选中的树节点：",data)
      this.selectTreeNode = data;
    },
    async downloadPDF() {
      try {
          const divToCapture = this.$refs.childComponentRef.$el.querySelector(".result");
          const canvas = await html2canvas(divToCapture);

          // 创建PDF对象
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgData = canvas.toDataURL('image/png');

          // 设置PDF页尺寸
          const imgWidth = 210; // A4尺寸，单位mm
          const imgHeight = canvas.height * imgWidth / canvas.width;

          // 将Canvas图像添加到PDF
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

          // 下载PDF
          pdf.save("content.pdf");
          
          this.showOptions = false;
      } catch (error) {
          console.error("Error capturing image:", error);
      }
    },
    async exportContent() {
      try {
        const divToCapture =
          this.$refs.childComponentRef.$el.querySelector(".result");
        const canvas = await html2canvas(divToCapture);
        const imageUrl = canvas.toDataURL();
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "image.png";
        link.click();
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    },
    getCheackedFeats(data){
      this.checkedFeats = data;
      console.log("收到子组件传来的值")
      console.log(this.checkedFeats);
    },
    handleDataFromChild(label){
      console.log("收到参数:",label);
      this.label = label;
    },
    stepBack(active) {
      this.active--;
      if(active === 3) {
        // 将 this.selectTreeNode 传递给子组件 characterChoose
        this.$refs.characterChoose.selectTreeNode = this.selectTreeNode;
        this.$refs.characterChoose.featureDataFromParent = this.featureDataFromParent;
      }
    },
    stepNext(active) {
      if(active == 1){
        this.$refs.taskInfo.extStep(); // 假设子组件有一个名为 nextStep 的方法
        if (this.createTaskInfo.taskName.length < 1 || this.createTaskInfo.principal.length < 1) {
          this.$message("请填写任务名称和负责人");
          return;
        }
      }
      if(this.active == 3 && (this.checkedFeats==null || this.checkedFeats.length==0))
      {
        this.open3();
      }else{
        this.active++;
      }
    },
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped>
.outcontainer {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  /* align-items: center; */
}
.stepcontainer {
  display: flex;
  width: 100%;
  height: 100%;
}
.stepbutton {
  display: flex;;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
}
.con_datasetChoose {
  ::v-deep .right_table {
    width: 1350px;
    height:620px;
  }
  ::v-deep .left_tree {
    height: 620px;
  }
}
</style>