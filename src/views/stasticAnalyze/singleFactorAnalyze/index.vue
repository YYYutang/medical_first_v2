<template>
  <div>
    <el-container>
      <div class="outcontainer3">
        <datasetChoose
          v-if="active == 1"
          :active="active"
          :type="3"
          @send_data="handleDataFromChild"
          class="single_datasetChoose"
          :showDataManageStep="(showDataManageStep = true)"
        ></datasetChoose>
        <characterChoose
          v-if="active == 2"
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
          v-if="active == 3"
          :active="active"
          :label="label"
          :groupFeat="groupFeat"
          :observeFeat="observeFeat"
          ref="childComponentRef"
        ></singleOutCome>
        <div class="stepbutton3">
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
import singleOutCome from "@/views/stasticAnalyze/singleFactorAnalyze/outCome.vue";
import html2canvas from "html2canvas";
/*描述性统计分析页面*/
export default {
  name: "outcome",
  props: [],
  components: {
    characterChoose,
    datasetChoose,
    singleOutCome,
  },
  data() {
    return {
      selectTreeNode: [],
      featureDataFromParent: [],
      observeFeatFromParent:{},
      groupFeatFromParent:{},
      label: "",
      active: 1,
      checkedFeats: [],
      groupFeat: {},
      observeFeat: {},
    };
  },
  methods: {
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
       if(active === 2) {
        // 将 this.selectTreeNode 传递给子组件 characterChoose
        this.$refs.characterChoose.selectTreeNode = this.selectTreeNode;
        this.$refs.characterChoose.observeFeatFromParent = this.observeFeatFromParent;
        this.$refs.characterChoose.groupFeatFromParent = this.groupFeatFromParent;
        this.$refs.characterChoose.featureDataFromParent = this.featureDataFromParent;
      }
    },
    stepNext(active) {
      if(this.active == 2 && (JSON.stringify(this.groupFeat)=='{}' || JSON.stringify(this.observeFeat)=='{}')){
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
}
.stepbutton3 {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
}

.stepbutton {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.single_datasetChoose {
  ::v-deep .right_table {
    width: 1350px;
    height: 620px;
  }
  ::v-deep .left_tree {
    width: 240px;
    height: 620px;
  }
}
</style>