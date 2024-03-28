<template>
  <div class="container">
    <div class="right_step">
      <div class="step">
        <el-steps :active="active" align-center>
          <el-step title="选择数据"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="方法选择"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <div>
        <div class="center">
           <h2><br><br>请为每个变量选择填充方法<br><br></h2>
        </div>

          <h3 class="tips">连续数字类型字段</h3><br><br>
         <el-table :data="tableData1" style="width: 100%"> 
          <el-table-column prop="index" label="指标" width="350"></el-table-column>
          <el-table-column prop="validNumber" label="有效值" width="350"></el-table-column>
          <el-table-column prop="missingQuantity" label="缺失量" width="350"></el-table-column>
          <el-table-column label="缺失值补齐方法" width="350">
             <template slot-scope="scope">
              <el-select v-model="scope.row.missCompleteMethod" @change="handleSelectChange(scope.row)">
              <!-- 这里设置下拉选项 -->
              <el-option label="最邻近插值" value="最邻近插值"></el-option>
              <el-option label="前向填充" value="前向填充"></el-option>
              <el-option label="均数替换" value="均数替换"></el-option>
              <el-option label="众数填充" value="众数填充"></el-option>
              <el-option label="回归分析替换" value="回归分析替换"></el-option>
              <el-option label="热卡填充" value="热卡填充"></el-option>
              <el-option label="中位数替换" value="中位数替换"></el-option>
              <!-- 可以根据需要添加更多选项 -->
            </el-select>
          </template>
          </el-table-column>
        </el-table><br>

        <h3 class="tips">离散数字类型字段</h3><br><br>
         <el-table :data="tableData2" style="width: 100%"> 
          <el-table-column prop="index" label="指标" width="350"></el-table-column>
          <el-table-column prop="validNumber" label="有效值" width="350"></el-table-column>
          <el-table-column prop="missingQuantity" label="缺失量" width="350"></el-table-column>
          <el-table-column label="缺失值补齐方法" width="350">
             <template slot-scope="scope">
              <el-select v-model="scope.row.missCompleteMethod" @change="handleSelectChange(scope.row)">
              <!-- 这里设置下拉选项 -->
              <el-option label="前向填充" value="前向填充"></el-option>
              <el-option label="众数填充" value="众数填充"></el-option>
              <el-option label="中位数替换" value="中位数替换"></el-option>
              <!-- 可以根据需要添加更多选项 -->
            </el-select>
          </template>
          </el-table-column>
        </el-table><br>

        <h3 class="tips">文本类型字段</h3><br><br>
         <el-table :data="tableData3" style="width: 100%"> 
          <el-table-column prop="index" label="指标" width="350"></el-table-column>
          <el-table-column prop="validNumber" label="有效值" width="350"></el-table-column>
          <el-table-column prop="missingQuantity" label="缺失量" width="350"></el-table-column>
          <el-table-column label="缺失值补齐方法" width="350">
             <template slot-scope="scope">
              <el-select v-model="scope.row.missCompleteMethod" @change="handleSelectChange(scope.row)">
              <!-- 这里设置下拉选项 -->
              <el-option label="前向填充" value="前向填充"></el-option>
              <el-option label="众数填充" value="众数填充"></el-option>
              <!-- 可以根据需要添加更多选项 -->
            </el-select>
          </template>
          </el-table-column>
        </el-table><br>


      </div>
    </div>
  </div>
</template>
<script>
/*算法选择页面*/
import { getIndicatorInfo } from "@/api/user.js"
import { tabSwitch } from "@/components/mixins/mixin";
import { postRequest } from "@/utils/api";
export default ({
    name:'missingalgo',
    props:['active', 'checkedFeats', 'label'],
    data() {
        return {
          tableData1: [],
          tableData2: [],
          tableData3: []
        }
    },
    created(){
      this.getCheckedIndicatorInfo();
      
    },
    methods:{
       filteredTableData(val) {
          return this.checkedFeats.filter(item => item.featureDataType === val);

        },
        sendDataToParent(){
          let tableData = [];
          for (let i = 0; i < this.tableData1.length; i++) {
              tableData.push(this.tableData1[i])
          }
          for (let i = 0; i < this.tableData2.length; i++) {
              tableData.push(this.tableData2[i])
          }
          for (let i = 0; i < this.tableData3.length; i++) {
              tableData.push(this.tableData3[i])
          }
          console.log("向父组件传值：",tableData)
          this.$emit("send_method",tableData) // 向父组件传值
        },
       handleSelectChange(row) {
        // 在这里处理下拉选项变化后的逻辑，例如：
        this.sendDataToParent();
      },
      getCheckedIndicatorInfo(){
        console.log("开始执行。。。。。。。。。。。。。。。。。")
        let indicatorsMissDataVos1 = {
          // checkedFeats: this.checkedFeats,
          checkedFeats: this.filteredTableData(1),
          tableName: this.tableName
        };
        postRequest("/api/getIndicatorsInfo",indicatorsMissDataVos1).then(response=>{
          this.tableData1 = response.data;
          this.sendDataToParent()
        })
        let indicatorsMissDataVos2 = {
          // checkedFeats: this.checkedFeats,
          checkedFeats: this.filteredTableData(2),
          tableName: this.tableName
        };
        postRequest("/api/getIndicatorsInfo",indicatorsMissDataVos2).then(response=>{
          this.tableData2 = response.data;
          this.sendDataToParent()
        })
        let indicatorsMissDataVos3 = {
          // checkedFeats: this.checkedFeats,
          checkedFeats: this.filteredTableData(3),
          tableName: this.tableName
        };
        postRequest("/api/getIndicatorsInfo",indicatorsMissDataVos3).then(response=>{
          this.tableData3 = response.data;
          console.log("3类data:",response.data)
          this.sendDataToParent()
        })
      }
    },
    mounted(){

    }

})
</script>
<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
}
.tips{
  color: blue;
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
}
.center{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>