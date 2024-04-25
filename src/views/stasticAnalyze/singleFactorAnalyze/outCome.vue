<template>
  <div class="container">
    <div class="right_step">
      <div class="step"  v-if="Object.keys(this.taskInfoParam).length === 0">
        <el-steps :active="active" align-center>
          <el-step title="数据筛选"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <div class="result">
        <h3 style="text-align: center; font-size: 30px; margin-top:20px">分析报告</h3>
        <div v-if="taskInfo!=null && taskInfo.principal!=null" style="margin-top:10px; margin-bottom: 0px; text-align: center;">
          <p style="margin-top:0px">
            <i class="el-icon-user"></i>创建人:
            <span>{{ taskInfo.principal }}</span>
             <i style="margin-left:20px" class="el-icon-user"></i>参与人员:
            <span>{{ taskInfo.participants }}</span>
            <i style="margin-left:20px" class="el-icon-folder-opened"></i>任务名称:
            <span>{{ taskInfo.taskName }}</span>
            <i style="margin-left:20px" class="el-icon-folder-opened"></i>任务类型:
            <span>{{ taskInfo.tasktype }}</span>
             <i style="margin-left:20px" class="el-icon-folder-opened"></i>备注:
            <span>{{taskInfo.tips}}</span>
          </p>
        </div>
        <h3 style="font-size: 20px; margin-left:150px">统计结果</h3>
        <div>
        <el-table
        :data="tableData"
        :span-method="arraySpanMethod"
        border
        style="width: 80%; margin: 0 auto; margin-top: 20px">
        <el-table-column
            prop="variable"
            :label="featureName"
            width="180">
        </el-table-column>
        <el-table-column
            prop="frequent"
            label="总频数">
        </el-table-column>
        <el-table-column
            prop="validFrequent"
            sortable
            label="有效频数">
        </el-table-column>
            <el-table-column
            prop="missFrequent"
            sortable
            label="缺失值">
        </el-table-column>
        <el-table-column
            prop="wilconxon"
            sortable
            label="wilcoxon秩和检验">
        </el-table-column>
        <el-table-column
            prop="t_exame"
            sortable
            label="t检验">
        </el-table-column>
        <el-table-column
            prop="t_recorrect"
            sortable
            label="矫正t检验">
        </el-table-column>
        </el-table>
        </div>
        <h3 style="font-size: 20px; margin-left:150px; margin-top: 20px">统计结果说明</h3>
        <div style="width: 80%; margin: 0 auto; margin-top: 20px">
            <p>Wilcoxon秩和检验是一种用于比较两个相关配对样本或两组独立样本的非参数统计检验方法。它的主要目的是检查两组数据是否来自同一分布，特别是用于检验中位数是否相等。
                如果计算得到的p值小于或等于设定的显著性水平，通常为0.05，那么我们有足够的证据拒绝零假设。如果p值大于显著性水平，我们则没有足够的证据拒绝零假设。
            </p>
        </div>
        <div>
            <h3 style="font-size: 20px; margin-left:150px; margin-top: 20px">统计图表</h3>
            <div class="binChart">
                <div class="chart1" ref="myChart1"></div>
                <div class="chart2" ref="myChart2"></div>
            </div>
        </div>
      </div>
       
    </div>
     <div class="stepbutton">
          <el-button
            size="small"
            v-if="Object.keys(this.taskInfoParam).length != 0"
            @click="returnTask"
            >返回</el-button
          >
          <el-button
            v-if="Object.keys(this.taskInfoParam).length != 0"
            size="small"
            type="primary"
            @click="showOptions = true"
            >导出</el-button
          >
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
</template>

<script>
import { defineComponent } from 'vue';
import * as echarts from 'echarts';
import { postRequest, getRequest } from '@/utils/api';
import { getSingleAnalyze } from "@/api/user";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { tabSwitch } from '@/components/mixins/mixin';
export default defineComponent({
  name: 'outcome2',
  props: ['active', 'label', 'groupFeat', 'observeFeat','newTaskInfo','createTaskInfo'],
  data() {
    return {
         taskInfo:null,
         featureName: '',
         allData: [],
         binData1:[],
         binData2:[],
         tableData: [],
         taskInfoParam: {},
         showOptions:false,
    };
  },
  created() {
      this.taskInfoParam = this.$route.params
      console.log("taskInfoParam:",this.taskInfoParam)
      this.taskInfo = this.createTaskInfo;
      if(this.taskInfo == null && (this.taskInfoParam!=null && this.taskInfoParam.taskInfo!=null)) this.taskInfo = this.taskInfoParam.taskInfo;
      this.getAllData();
  },

  methods: {

    open3(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      });
    },
     returnTask() {
      this.$router.push("/taskManage");
    },
     async exportContent() {
      try {
        const divToCapture =
          document.querySelector(".right_step");
        const canvas = await html2canvas(divToCapture);
        const imageUrl = canvas.toDataURL();
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "image.png";
        link.click();
        this.showOptions = false;
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    },
    async downloadPDF() {
      try {
        const divToCapture =
         document.querySelector(".right_step");
        const canvas = await html2canvas(divToCapture);

        // 创建PDF对象
        const pdf = new jsPDF("p", "mm", "a4");
        const imgData = canvas.toDataURL("image/png");

        // 设置PDF页尺寸
        const imgWidth = 210; // A4尺寸，单位mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // 将Canvas图像添加到PDF
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

        // 下载PDF
        pdf.save("content.pdf");

        this.showOptions = false;
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    },
    
    getAllData(){
        let colNames = [];
        let label=null;
        if(this.taskInfoParam!=null && this.taskInfoParam.features!=null && this.taskInfoParam.label!=null){
           colNames.push(this.taskInfoParam.features[0]);
           colNames.push(this.taskInfoParam.features[1]);
           label = this.taskInfoParam.label;
           this.featureName = this.taskInfoParam.features[0]
        }else{
          colNames.push(this.groupFeat.featureName);
          colNames.push(this.observeFeat.featureName);
          label = this.label;
          this.featureName = this.groupFeat.featureName;
        }
        getSingleAnalyze("/api/singleFactorAnalyze",label,colNames.join(","),this.taskInfo).then(response=>{ // 传递表名、分组列名、观察列名
            // 分析表格数据
            this.tableData = response.data.discreteVos;
            console.log("response",response.data)
            this.tableData[0].wilconxon = "w值:"+response.data.wilcoxonW+"；  p值:"+response.data.wilcoxonP;
            this.tableData[0].t_exame = "t值:"+response.data.tt+"；  p值:"+response.data.tp;
            this.tableData[0].t_recorrect = "t值:"+response.data.correctTT+"；  p值:"+response.data.correctTP

            console.log("tableData1:",this.tableData)
            let total = {
              variable: 'total',
              frequent: this.tableData[0].frequent+this.tableData[1].frequent,
              validFrequent: this.tableData[0].validFrequent+this.tableData[1].validFrequent,
              missFrequent: this.tableData[0].missFrequent+this.tableData[1].missFrequent
            }
            this.tableData.push(total)
            console.log("tableData2:",this.tableData)
            if((response.data.notDiscrete.binData==null || response.data.notDiscrete.binData.length==0) || (response.data.notDiscrete2.binData==null || response.data.notDiscrete2.binData.length==0)){
              this.open3("数据异常，分析失败！");
              return;
            }

            // 饼状图数据
            for (const [key, value] of Object.entries(response.data.notDiscrete.binData)) {
              console.log("还没有初始化时：",this.binData1)
              this.binData1.push({ name: key, value: value });
            }
            console.log("binData1:", this.binData1)
            for (const [key, value] of Object.entries(response.data.notDiscrete2.binData)) {
              this.binData2.push({ name: key, value: value });
            }
            console.log("binData2:", this.binData2)

            this.$nextTick(() => {  //使用this.$nexTick方法进行渲染
              this.initMyChart1();
            })
            this.$nextTick(() => {  //使用this.$nexTick方法进行渲染
              this.initMyChart2();
            })

        })
    },


    // 柱状图1
    initMyChart1() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.myChart1);
      // 指定图表的配置项和数据
      const option = {
         title: {
            text: '分组1', // 设置标题文本
            left: 'center', // 标题水平居中
            top: 20, // 标题距离顶部的距离
           },
        tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
        }
      },
      grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
      },
      xAxis: [
        {
        type: 'category',
        data: this.binData1.map(item => item.name),
        axisTick: {
            alignWithLabel: true
        }
        }
      ],
      yAxis: [
        {
        type: 'value'
        }
      ],
      series: [
        {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: this.binData1.map(item => item.value)
        }
      ]
    };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
        // 柱状图
    initMyChart2() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.myChart2);
      // 指定图表的配置项和数据
      const option = {
        title: {
            text: '分组2', // 设置标题文本
            left: 'center', // 标题水平居中
            top: 20, // 标题距离顶部的距离
        },
        tooltip: {
        trigger: 'axis',
        axisPointer: {
        type: 'shadow'
        }
      },
      grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
      },
      xAxis: [
        {
        type: 'category',
        data: this.binData2.map(item => item.name),
        axisTick: {
            alignWithLabel: true
        }
        }
      ],
      yAxis: [
        {
        type: 'value'
        }
      ],
      series: [
        {
        name: 'Direct',
        type: 'bar',
        barWidth: '60%',
        data: this.binData2.map(item => item.value)
        }
      ]
    };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
     // 判断是否为最后三列
      if (columnIndex >= 4) {
        // 返回一个数组，表示当前单元格跨 3 行，1 列
        return [3, 1];
      }
    },
  }
});
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
}

.right_step {
  display: flex;
  width: 100%;
  height: 100%;
  margin-left: 100px;
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
    height: 900px;
    width: 1500px;
    /* margin-left: 200px; */
    flex-direction: column;
    /* background: skyblue; */
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
.stepbutton {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
}
</style>
