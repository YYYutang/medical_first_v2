<template>
  <div>
    <el-container>
      <div class="outcontainer3">
         <taskInfo v-if="active==1" :active="active" ref="taskInfo" @send_taskInfo = "getTaskInfo" :createTaskInfo="createTaskInfo" :tasktype="2"></taskInfo>
        <datasetChoose
          v-if="active == 2"
          :active="active"
          :type="3"
          @send_data="handleDataFromChild"
          class="single_datasetChoose"
          :showDataManageStep="(showDataManageStep = true)"
        ></datasetChoose>
        <characterChoose
          v-if="active == 3"
          :active="active"
          :type="2"
          :label="label"
          @send_feat="getCheackedFeats"
          :analyzeStep="2"
          :curentAnalyzeStep="2"
          @send_observe_feature="getObserveFeat"
          @send_group_feature="getGroupFeat"
          @sendTreeNode="getSelectTreeNode" :selectTreeNode="selectTreeNode" :observeFeatFromParent="observeFeatFromParent" :groupFeatFromParent="groupFeatFromParent"
          @sendFeatueData="getFeatureData" :featureDataFromParent="featureDataFromParent"
        ></characterChoose>
        <singleOutCome
          v-if="active == 4"
          :active="active"
          :label="label"
          :groupFeat="groupFeat"
          :observeFeat="observeFeat"
          ref="childComponentRef"
          :newTaskInfo = "newTaskInfo"
          :createTaskInfo="createTaskInfo"
        ></singleOutCome>
        <div class="stepbutton3">
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
import singleOutCome from "@/views/stasticAnalyze/singleFactorAnalyze/outCome.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import taskInfo from "@/components/TaskInfo.vue"
/*描述性统计分析页面*/
export default {
  name: "outcome",
  props: [],
  components: {
    characterChoose,
    datasetChoose,
    singleOutCome,
    taskInfo
  },
  data() {
    return {
      showOptions: false,
      newTaskInfo: null,
      selectTreeNode: [],
      featureDataFromParent: [],
      observeFeatFromParent:{},
      groupFeatFromParent:{},
      label: "",
      active: 1,
      checkedFeats: [],
      groupFeat: {},
      observeFeat: {},
      createTaskInfo: null
    };
  },
  created(){
    this.newTaskInfo = this.$route.params
  },
  methods: {
    getTaskInfo(data){
      this.createTaskInfo = data;
      this.createTaskInfo.tasktype="单因素分析"
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
    getGroupFeat(feat) {
      this.groupFeat = feat;
      this.groupFeatFromParent = feat;
    },
    getObserveFeat(feat) {
      this.observeFeat = feat;
      this.observeFeatFromParent = feat;
    },
    getCheackedFeats(data) {
      this.checkedFeats = data;
    },
    handleDataFromChild(label) {
      this.label = label;
    },
    stepBack(active) {
      this.active--;
       if(active === 3) {
        // 将 this.selectTreeNode 传递给子组件 characterChoose
        this.$refs.characterChoose.selectTreeNode = this.selectTreeNode;
        this.$refs.characterChoose.observeFeatFromParent = this.observeFeatFromParent;
        this.$refs.characterChoose.groupFeatFromParent = this.groupFeatFromParent;
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
      if(this.active == 3 && (JSON.stringify(this.groupFeat)=='{}' || JSON.stringify(this.observeFeat)=='{}')){
        this.open3()
      }else{
        this.active++;
      }
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.outcontainer3 {
  width: 100%;
  display: flex;
  height: auto;
  flex-direction: column;
  min-height: 100vh;
}
.stepbutton3 {
    justify-content: center;
    align-items: center;
    display: flex;
}

.stepbutton {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.single_datasetChoose {

  ::v-deep .left_tree {
    width: 240px;
    height: 620px;
  }
}
</style>