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
      <div class="result">
        <h3 style="text-align: center; font-size: 30px; margin-top:20px">分析报告</h3>
        <h3 style="font-size: 30px; margin-top:20px; margin-left: 100px; margin-bottom: 20px">ICC</h3>
        <h3 style="font-size: 20px; margin-left:150px">统计结果</h3>
        <div>
        <el-table
        :data="tableData1"
        border
        style="width: 80%; margin: 0 auto; margin-top: 20px">
        <el-table-column
            prop="method"
            label="方法"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="type"
            align="center"
            label="类型">
        </el-table-column>
        <el-table-column
            prop="ICC"
            align="center"
            sortable
            label="ICC">
        </el-table-column>
            <el-table-column
            prop="F"
            align="center"
            sortable
            label="F">
        </el-table-column>
        <el-table-column
            prop="df1"
            sortable
            align="center"
            label="df1">
        </el-table-column>
        <el-table-column
            prop="df2"
            align="center"
            sortable
            label="df2">
        </el-table-column>
        <el-table-column
            prop="p"
            align="center"
            sortable
            label="p">
        </el-table-column>
        </el-table>
        </div>
        <h3 style="font-size: 20px; margin-left:150px; margin-top: 20px">统计结果说明</h3>
        <div style="width: 80%; margin: 0 auto; margin-top: 20px">
            <p>ICC的取值范围在0到1之间。接近1表示组间方差占总方差的比例较大，说明观测值之间的一致性较好；接近0表示个体内方差占主导地位，说明观测值之间的一致性较差。
                显著性水平的选择通常是0.05。如果p值小于显著性水平，我们可能会拒绝零假设，认为观测值之间的一致性是显著的。
            </p>
        </div>
        <div>
            <h3 style="font-size: 20px; margin-left:100px; margin-top: 30px">Bland-Altman</h3>
            <h3 style="font-size: 20px; margin-left:150px; margin-top: 30px">统计结果</h3>
            <el-table
                :data="tableData2"
                border
                style="width: 80%; margin: 0 auto; margin-top: 30px">
                <el-table-column
                    prop="valid_frequnt"
                    label="有效样本量"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="variableOneAvg"
                    align="center"
                    label="变量1均值">
                </el-table-column>
                <el-table-column
                    prop="variableSecondAvg"
                    align="center"
                    sortable
                    label="变量2均值">
                </el-table-column>
                    <el-table-column
                    prop="distanceAvg"
                    align="center"
                    sortable
                    label="差值均值">
                </el-table-column>
                <el-table-column
                    prop="standardDeviation"
                    sortable
                    align="center"
                    label="标准差">
                </el-table-column>
                <el-table-column
                    prop="95%CI"
                    align="center"
                    sortable
                    label="95%CI">
                </el-table-column>
                <el-table-column
                    prop="t"
                    align="center"
                    sortable
                    label="t">
                </el-table-column>
            </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { postRequest, getRequest } from '@/utils/api';
export default defineComponent({
  name: 'outcome2',
  props: ['active', 'label', 'checkedFeats'],
  data() {
    return {
         allData: [],

         tableData1: [
            {
                method: 'ICC1:one-way random-effects model',
                type: 'ICC1',
                ICC: '-0.972',
                F: '0.014',
                df1: 6481,
                df2: 6482,
                p: 1.00
            },
             {
                method: 'ICC2:two-way random-effects mode',
                type: 'ICC2',
                ICC: '0.004',
                F: '2.586',
                df1: 6481,
                df2: 6482,
                p: 0.000
            },
         ],
         tableData2: [{
          valid_frequnt: 713,
          variableOneAvg: 54,
          variableSecondAvg: 165,
          distanceAvg: -110,
          standardDeviation: 8.05,
          '95%CI': '-111.366~-110.215',
          t: -367.44
        }]
    };
  },
  created() {
    
  },
  methods: {
    
    getAllData(){
        postRequest("/api/singleFactorAnalyze",this.label, this.checkedFeats).then(response=>{ // 传递表名、分组列名、观察列名
            this.allData = response.data // TODO 分析数据
        })
    },
  }
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


.result {
    display: flex;
    height: 800px;
    width: 1500px;
    margin-right: 80px;
    flex-direction: column;
   overflow-y: auto;
}
.binChart {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 400px;
    width: 100%;
    /* background: skyblue; */
}
.chart1 {
    justify-content: center;
    align-items: center;
    width: 40%;
    height: 100%;
}
.chart2 {
    justify-content: center;
    align-items: center;
    width: 40%;
    height: 100%;
}
</style>
