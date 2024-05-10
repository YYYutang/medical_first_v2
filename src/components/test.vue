<template>
  <div>
    <div v-show="toggle === true">
      <div class="test1"></div>
      <div class="test1"></div>
      <div class="test1"></div>
    </div>
    <div v-show="toggle === false">
      <div class="test2"></div>
      <div class="test2"></div>
      <div class="test2"></div>
    </div>
    <el-button @click="changeStatus">click</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toggle: true,
    };
  },
  methods: {
    changeStatus() {
      this.toggle = !this.toggle;
      this.getNode();
      this.getNode2();
    },
    getNode() {
      const nodelist = document.querySelectorAll(".test1");
      console.log("1", nodelist);
    },
    getNode2() {
      const nodelist2 = document.querySelectorAll(".test2");
      console.log("2", nodelist2);
    },
  },
  mounted() {
    this.getNode();
    this.getNode2();
  },
};
</script>

<style>
</style>