<template>
  <div>
    <el-container >
        <div class="outcontainer">
          <datasetChoose v-if="active == 1" class="con_datasetChoose" :active='active' :type="3" @send_data="handleDataFromChild" :showDataManageStep="showDataManageStep=true"></datasetChoose>
          <characterChoose v-if="active == 2" :active='active' :analyzeStep="3" :type="2" :label="label" @send_feat="getCheackedFeats" :curentAnalyzeStep="3" 
          @sendTreeNode="getSelectTreeNode" :selectTreeNode="selectTreeNode" @sendFeatueData="getFeatureData" :featureDataFromParent="featureDataFromParent"></characterChoose>
          <conssitencyOutcome v-if="active == 3" :active='active' :label="label" :checkedFeats="checkedFeats" ref="childComponentRef"></conssitencyOutcome>
        <div class="stepbutton">
          <el-button size="small" v-if="active != 1" @click="stepBack(active)"
            >上一步</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="active != 3"
            @click="stepNext(active)"
            >下一步</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="active == 3"
            @click="exportContent()"
            >导出</el-button
          >
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
/*描述性统计分析页面*/
export default {
  name: "outcome",
  prop: [],
  components: {
    characterChoose,
    datasetChoose,
    conssitencyOutcome,
  },
  data() {
    return {
      featureDataFromParent: [],
      selectTreeNode: [],
      label: '',
      active: 1,
      checkedFeats: [],
    };
  },
  methods: {
     getFeatureData(data){
      this.featureDataFromParent = data;
    },
    getSelectTreeNode(data){
      console.log("选中的树节点：",data)
      this.selectTreeNode = data;
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
      if(active === 2) {
        // 将 this.selectTreeNode 传递给子组件 characterChoose
        this.$refs.characterChoose.selectTreeNode = this.selectTreeNode;
        this.$refs.characterChoose.featureDataFromParent = this.featureDataFromParent;
      }
    },
    stepNext(active) {
      this.active++;
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