<template>
  <div class="container" ref="outcomeRef">
    <div class="right_step"   >
      <div class="step">
        <el-steps :active="active" align-center  v-if="Object.keys(this.taskInfoParam).length === 0">
          <el-step title="数据筛选"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <div class="outcome" v-if="discrete == true">
        <h2 class="title">分析报告</h2>

        <div
          v-if="taskInfo != null && taskInfo.principal != null"
          style="margin-top: 10px; margin-bottom: 10px"
        >
          <p style="margin-top: 0px">
            <i class="el-icon-user"></i>创建人:
            <span>{{ taskInfo.principal }}</span>
            <i style="margin-left: 20px" class="el-icon-user"></i>参与人员:
            <span>{{ taskInfo.participants }}</span>
            <i style="margin-left: 20px" class="el-icon-folder-opened"></i
            >任务名称:
            <span>{{ taskInfo.taskName }}</span>
            <i style="margin-left: 20px" class="el-icon-folder-opened"></i
            >任务类型:
            <span>{{ taskInfo.tasktype }}</span>
            <i style="margin-left: 20px" class="el-icon-folder-opened"></i>备注:
            <span>{{ taskInfo.tips }}</span>
          </p>
        </div>

        <h3 class="result">统计结果</h3>
        <h4 style="text-align: center">定性数据 描述性统计</h4>
        <div class="table">
          <el-table
            stripe
            :data="tableData"
            :span-method="mergeColumns"
            border
            style="width: 100%"
            class="custom-table-center"
          >
            <el-table-column prop="variable" label="变量" width="180">
            </el-table-column>
            <el-table-column prop="frequent" label="频数"> </el-table-column>
            <el-table-column prop="amount" label="占比（%）"> </el-table-column>
            <el-table-column prop="totalAmount" label="累计占比">
            </el-table-column>
          </el-table>
        </div>
        <h3 style="margin-top: 30px">统计图表</h3>
        <div ref="chart" style="width: 600px; height: 400px"></div>
      </div>
      <div class="outcome" v-else>
        <h2 class="title">分析报告</h2>
        <div
          v-if="taskInfo != null && taskInfo.principal != null"
          style="margin-top: 10px; margin-bottom: 10px"
        >
          <p style="margin-top: 0px">
            <i class="el-icon-user"></i>创建人:
            <span>{{ taskInfo.principal }}</span>
            <i style="margin-left: 20px" class="el-icon-user"></i>参与人员:
            <span>{{ taskInfo.participants }}</span>
            <i style="margin-left: 20px" class="el-icon-folder-opened"></i
            >任务名称:
            <span>{{ taskInfo.taskName }}</span>
            <i style="margin-left: 20px" class="el-icon-folder-opened"></i
            >任务类型:
            <span>{{ taskInfo.tasktype }}</span>
            <i style="margin-left: 20px" class="el-icon-folder-opened"></i>备注:
            <span>{{ taskInfo.tips }}</span>
          </p>
        </div>
        <h3 class="result">统计结果</h3>
        <h4 style="text-align: center">定性数据 描述性统计分析</h4>
        <el-table class="table2" :data="tableData2" border style="width: auto">
          <el-table-column prop="total" label="总量" width="180">
          </el-table-column>
          <el-table-column prop="average" label="平均值" width="180">
          </el-table-column>
          <el-table-column prop="middle" label="中位数" width="180">
          </el-table-column>
          <el-table-column prop="min" label="最小值" width="180">
          </el-table-column>
          <el-table-column prop="max" label="最大值" width="180">
          </el-table-column>
          <el-table-column prop="mode" label="众数" width="180">
          </el-table-column>
        </el-table>
        <h3 style="margin-top: 30px">统计图表</h3>
        <div class="message" style="margin-top: 10px">
          <p>
            下表统计的是选择特征在整个数据集中的数值取值分布情况。每组是一段取值范围，图的x坐标显示的就是每一组的取值范围，y轴坐标显示的就是统计每个取值范围出现的次数
          </p>
        </div>
        <div
          ref="binChart"
          style="width: 620px; height: 400px"
          class="bin"
        ></div>
       
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
                     :close-on-click-modal="true"
            :modal-append-to-body="false"
          >
            <el-button @click="exportContent">导出为图片</el-button>
            <el-button @click="downloadPDF">导出为pdf</el-button>
          </el-dialog>
        </div>
    </div>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/utils/api";
import { requestFormData } from "@/api/user.js";
import * as echarts from "echarts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { tableData } from "@/components/tab/TableData";
import { h } from "vue";
import { tabSwitch } from "@/components/mixins/mixin";
/*特征选择页面*/
export default {
  name: "outcome",
  props: ["active", "label", "checkedFeats", "newTaskInfo", "createTaskInfo"],
  data() {
    return {
      taskInfo: {
        taskName: "",
        principal: "",
        tasktype: "",
        participants: "",
        tips: "",
        pieName: "",
      },
      discrete: true,
      tableData: [],
      showOptions: false,
 
      pieData: [
        { value: 1048, name: "男" },
        { value: 735, name: "女" },
      ],
      tableData2: [
        {
          total: 100,
          average: 72.45,
          middle: 70.0,
          mode: 75.0,
          min: 50.0,
          max: 90.0,
        },
      ],
      binData: [
        { name: "A", value: 100 },
        { name: "B", value: 200 },
        { name: "C", value: 150 },
        { name: "D", value: 300 },
        { name: "E", value: 180 },
      ],
      taskInfoParam: {},
    };
  },
  mounted() {},

  created() {
    this.taskInfoParam = this.$route.params;
    console.log("taskInfoParam:", this.taskInfoParam);
    this.taskInfo = this.createTaskInfo;
    if (
      this.taskInfo == null &&
      this.taskInfoParam != null &&
      this.taskInfoParam.taskInfo != null
    )
      this.taskInfo = this.taskInfoParam.taskInfo;
    this.requestFormData();
  },
  methods: {
    returnTask() {
      this.$router.push("/taskManage");
    },
    requestFormData() {
   
      let featureName = null;
      let label = null;
      if (
        this.taskInfoParam != null &&
        this.taskInfoParam.feature != null &&
        this.taskInfoParam.label != null
      ) {
        // 判断是否是直接从任务管理跳转
        console.log("直接从任务管理跳转过来的");
        featureName = this.taskInfoParam.feature;
        label = this.taskInfoParam.label;
      } else {
        featureName = this.checkedFeats[0].featureName;
        label = this.label;
      }
      console.log("featureName:", featureName);
      console.log("label:", label);
      console.log("taskInfo", this.taskInfo);
      requestFormData(
        "/api/tableDesAnalyze",
        featureName,
        label,
        this.taskInfo
      ).then((response) => {
        this.discrete = response.data.discrete;
        if (response.data.discrete == true) {
          // 离散
          let data = [];
          let pieD = [];
          let head = { variable: featureName + "(文本变量)" };
          this.pieName = featureName + "(文本变量)";
          data.push(head);
          console.log("featureName:", featureName);
          if (featureName === "sexcode") {
            let vos = response.data.discreteVos;
            for (let i = 0; i < vos.length; i++) {
              let temp = {
                variable: vos[i].variable === "1" ? "男" : "女",
                frequent: vos[i].frequent,
                amount: vos[i].amount,
                totalAmount: vos[i].totalAmount,
              };
              let tempPi = {
                name: vos[i].variable === "1" ? "男" : "女",
                value: vos[i].frequent,
              };
              pieD.push(tempPi);
              data.push(temp);
            }
            this.tableData = data;
            this.pieData = pieD;
          } else {
            let vos = response.data.discreteVos;
            for (let i = 0; i < vos.length; i++) {
              console.log("当前离散值：", vos[i]);
              let temp = {
                variable: vos[i].variable,
                frequent: vos[i].frequent,
                amount: vos[i].amount,
                totalAmount: vos[i].totalAmount,
              };
              let tempPi = {
                name: vos[i].variable,
                value: vos[i].frequent,
              };
              pieD.push(tempPi);
              data.push(temp);
            }
            this.tableData = data;
            this.pieData = pieD;
          }
          console.log("piedfdfd: ", this.pieData);
          this.$nextTick(() => {
            //使用this.$nexTick方法进行渲染
            this.initPieChart();
          });
        } else {
          let tableData = {
            total: response.data.notDiscrete.total,
            average: response.data.notDiscrete.average,
            middle: response.data.notDiscrete.middle,
            min: response.data.notDiscrete.min,
            max: response.data.notDiscrete.max,
            mode: response.data.notDiscrete.mode,
          };
          console.log("tableData", tableData);
          this.tableData2.length = 0;
          this.tableData2.push(tableData);
          this.binData.length = 0;

          const binDataMap = response.data.notDiscrete.binData;

          const binDataArray = [];

          for (const [key, value] of Object.entries(binDataMap)) {
            binDataArray.push({ name: key, value: value });
          }
          this.binData = binDataArray;
          this.$nextTick(() => {
            //使用this.$nexTick方法进行渲染
            this.initBinChart();
          });
          console.log("binData", binDataArray);
      
        }
      });
    },
    mergeColumns({ row, column, rowIndex, columnIndex }) {
      // 如果是第二行，并且列索引不为0（即非第一列）
      if (rowIndex === 0 && columnIndex !== 0) {
        if (columnIndex === 1) {
          // 第二行的第二列：设置 rowspan 为 1，colspan 为剩余列数
          return [1, 4 - columnIndex]; // 假设总共有3列，调整这个数字以匹配您的列总数
        } else {
          // 第二行的其他列：隐藏这些列
          return [0, 0];
        }
      }
    },

    // 饼状图
    initPieChart() {
      // 基于准备好的dom，初始化echarts实例
      const pieChart = echarts.init(this.$refs.chart);

      // 指定图表的配置项和数据
      const option = {
        title: {
          // text: '文本变量',
          text: this.pieName,
          left: "center",
          top: "40px",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "horizontal", // 水平排列图例
          left: "center", // 水平居中
          bottom: "30px", // 放在底部
        },
        series: [
          {
            // name: '访问来源',
            type: "pie",
            radius: "50%",
            data: this.pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      pieChart.setOption(option);
    },

    // 柱状图
    initBinChart() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(this.$refs.binChart);
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: "数据分布情况",
        },
        tooltip: {},
        xAxis: {
          name: "取值范围",
          data: this.binData.map((item) => item.name),
        },
        axisLine: {
          lineStyle: {
            color: "#999", // 刻度线颜色
            width: 1, // 刻度线粗细
          },
        },
        yAxis: {},
        series: [
          {
            name: "频数",
            type: "bar",
            data: this.binData.map((item) => item.value),
            barWidth: "50%", // 柱子宽度
            barGap: "100%", // 柱子之间的间隔
            barCategoryGap: "50%", // 柱子组之间的间隔
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    async exportContent() {
      try {
        const divToCapture =
          document.querySelector(".outcome");
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
         document.querySelector(".outcome");
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
  },
  mounted() {
    // this.initPieChart()
  },
};
</script>
<style scoped>
table {
  width: 100%;
  margin-right: 100px;
  margin-top: 20px;
  /* background: ; */
}
.table2 {
  /* margin-right: 400px; */
  margin-top: 20px;
  width: 100%;
  background: red;
}
.outcome {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.outcome2 {
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
td {
  padding: 8px;
}
b {
  display: block;
}
.container {
  display: flex;
  width: 100%;
  height: 100%;
  /* background-color: aqua; */
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
  /* background-color: aqua; */
}

.title {
  text-align: center;
  margin-bottom: 20px;
}
.result {
  margin-top: 5px;
  margin-bottom: 10px;
  margin-right: 600px;
}

.pie {
  margin-left: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: column;
  /* background-color: skyblue; */
}

.bin {
  /* margin-right: 200px; */
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  flex-direction: column;
  /* background-color: skyblue; */
}

.message {
  width: 50%;
}
.stepbutton {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
}
</style>