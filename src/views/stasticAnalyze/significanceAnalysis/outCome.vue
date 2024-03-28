<template>
  <div class="container">
    <div class="right_step">
      <div class="step">
        <el-steps :active="active" align-center>
          <el-step title="数据筛选"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'outcome2',
  props: ['active', 'label', 'groupFeat', 'observeFeat'],
  data() {
    return {};
  },
  created() {
    console.log("active:", this.active);
  },
  methods: {}
});
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
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
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}
</style>
