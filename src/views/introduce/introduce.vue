<template>
  <div>
    <div class="container">
      <div style="font-size: 50px">人群队列数据特征表征软件</div>
      <div class="size-icon">
        <div class="icon" @click="linktoDash">
          <svg-icon icon-file-name="首页" />
          <h3 style="font-size: 30px">大屏展示</h3>
        </div>
        <div class="icon" @click="linktoDataManage">
          <svg-icon icon-file-name="数据管理" />
          <h3 style="font-size: 30px">数据管理</h3>
        </div>
        <div class="icon" @click="linktoComplete">
          <svg-icon icon-file-name="缺失值" />
          <h3 style="font-size: 30px">缺失值处理</h3>
        </div>
        <div class="icon" @click="linktoStatis">
          <svg-icon icon-file-name="统计分析" />
          <h3 style="font-size: 30px">统计分析</h3>
        </div>
        <div class="icon" @click="linktoReperesent">
          <svg-icon icon-file-name="特征" style="" />
          <h3 style="font-size: 30px">特征表征</h3>
        </div>
        <div class="icon" @click="linktoVisualization">
          <svg-icon icon-file-name="画像" />
          <h3 style="font-size: 30px">病人画像</h3>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
   
    import { getRequest, postRequest } from "@/api/user";
   
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-flow: column;
}
.size-icon {
  font-size: 80px;
  display: grid;

  grid-template-columns: repeat(3, 300px);
  grid-template-rows: repeat(2, 300px);
  gap: 5px;
  justify-items: center;
  align-items: center;
}
.icon {
  display: grid;
  place-items: center;
  text-align: center;
}
.icon svg-icon {
  max-width: 100%;
  vertical-align: middle;
}
.icon h3 {
  margin-top: 10px;
}
</style>