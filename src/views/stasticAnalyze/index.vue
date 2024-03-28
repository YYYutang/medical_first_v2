<template>
  <div>
    <el-header>
      <div class="tabs">
        <el-tabs type="border-card">
          <el-tab-pane label="描述性分析"><describeAnalyze style="width: 100%"></describeAnalyze></el-tab-pane>
          <el-tab-pane label="单因素分析"><single-factor-analyze style="width: 100%"></single-factor-analyze></el-tab-pane>
          <el-tab-pane label="一致性验证"><consistency-analyze style="width: 100%"></consistency-analyze></el-tab-pane>
          <!-- <el-tab-pane label="一致性验证">一致性验证</el-tab-pane>
          <el-tab-pane label="显著性分析">显著性分析</el-tab-pane> -->
        </el-tabs>
      </div>
    </el-header>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/utils/api";
import describeAnalyze from "@/views/stasticAnalyze/describeAnalyze/index.vue"
import singleFactorAnalyze from "@/views/stasticAnalyze/singleFactorAnalyze/index.vue"
import consistencyAnalyze from "@/views/stasticAnalyze/consistencyAnalysis/index.vue"
/*统计分析根页面*/
export default {
  components: {
    describeAnalyze,
    singleFactorAnalyze,
    consistencyAnalyze
  },
  data() {
    return {
      active: 1,
    };
  },
  methods: {
    stepBack(active) {
      this.active--;
    },
    stepNext(active) {
      this.active++;
    },
  },
  mounted() {},
};
</script>
<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tabs{
  width: 100%;
  height: 100%;
  /* display: flex; */
}

</style>
