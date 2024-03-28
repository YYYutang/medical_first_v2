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
           <h2><br><br>结果数据预览<br><br></h2>
        </div>
        <div class="fillDataShow">
           <el-table :data="tableData" style="width: 100%">
            <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" width="200px" align="center">
              <template slot-scope="scope">
                <!-- 自定义列模板 -->
                <span :style="{ color: scope.row[key].flag ? 'red' : 'black' }">{{ scope.row[key].value }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { postRequest } from "@/utils/api";

/*特征选择页面*/
export default ({
    name:'outcome',
    props:['active','missCompleteMehtod','label'],
    data(){
        return{
          tableData: [
            // {xuetang: '100', flag1: false, xueya: '90', flag2: false, smoke: '是', flag3: false, drink: '是', flag4: false},
            // {xuetang: '100', flag1: true, xueya: '91', flag2: false, smoke: '否', flag3: true, drink: '否', flag4: true},
            // {xuetang: '130', flag1: false, xueya: '92', flag2: true, smoke: '否', flag3: false, drink: '否', flag4: false},
            // {xuetang: '120', flag1: false, xueya: '93', flag2: false, smoke: '否', flag3: false, drink: '是', flag4: false}
          ]
        }
    },
    created(){
      console.log("参数有：",this.missCompleteMehtod)
      this.fillData();
    },
    methods:{
      fillData(){
        let dataFillMethodVo = {
          missCompleteMethod: this.missCompleteMehtod,
          tableName: this.label
        };
        postRequest("/api/fillData",dataFillMethodVo).then(response=>{
          this.tableData = response.data;
          console.log("返回数据：")
          console.log(this.tableData)
        }).catch(error=>{
          console.log(error);
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
  /* background-color: red; */
}

.right_step {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* background-color: red; */
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
.fillDataShow{
  height: 500px;
  overflow-y: auto;
  overflow-x: auto;
  margin: 0 auto;
}
</style>