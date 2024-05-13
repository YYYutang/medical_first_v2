<template>
  <div class="container">
    <div class="right_step">
      <div class="step">
        <el-steps
          :active="active"
          align-center
          v-if="Object.keys(this.taskInfoParam).length === 0"
        >
          <el-step title="数据筛选"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <div class="result">
        <h3 style="text-align: center; font-size: 30px; margin-top: 20px">
          分析报告
        </h3>
        <div
          v-if="taskInfo != null && taskInfo.principal != null"
          style="margin-top: 10px; margin-bottom: 0px; text-align: center"
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
        <h3
          style="
            font-size: 30px;
            margin-top: 20px;
            margin-left: 100px;
            margin-bottom: 20px;
          "
        >
          ICC
        </h3>
        <div style="width: 80%; margin: 0 auto; margin-bottom: 20px">
          <p>
            ICC（Intraclass Correlation
            Coefficient，组内相关系数）是一种用于衡量一致性或重复性的统计指标。在统计学中，ICC通常用于评估不同评价者（观察者）对同一目标的测量结果之间的一致性或一致性。<br /><br />
            ICC1是Intraclass Correlation
            Coefficient（组内相关系数）的一种计算方法，也称为one-way
            random-effects
            mode（单因素随机效应模型）。它用于评估单个观察者在不同时间或条件下对同一目标进行测量的一致性或可靠性。<br /><br />
            ICC2是一种Intraclass Correlation
            Coefficient（组内相关系数）的计算方法，也称为two-way random-effects
            mode（双因素随机效应模型）。它用于评估多个观察者对同一目标进行测量的一致性或可靠性。
          </p>
        </div>
        <h3 style="font-size: 20px; margin-left: 150px">统计结果</h3>
        <div>
          <el-table
            :data="tableData1"
            border
            style="width: 80%; margin: 0 auto; margin-top: 20px"
          >
            <el-table-column
              prop="method"
              label="方法"
              align="center"
              width="180"
            >
            </el-table-column>
            <el-table-column prop="type" align="center" label="类型">
            </el-table-column>
            <el-table-column prop="icc" align="center" sortable label="ICC">
            </el-table-column>
            <el-table-column prop="f" align="center" sortable label="F">
            </el-table-column>
            <el-table-column prop="df1" sortable align="center" label="df1">
            </el-table-column>
            <el-table-column prop="df2" align="center" sortable label="df2">
            </el-table-column>
            <el-table-column prop="p" align="center" sortable label="p">
            </el-table-column>
          </el-table>
        </div>
        <h3 style="font-size: 20px; margin-left: 150px; margin-top: 20px">
          统计结果说明
        </h3>
        <div style="width: 80%; margin: 0 auto; margin-top: 20px">
          <p>
            ICC的取值范围在0到1之间。接近1表示组间方差占总方差的比例较大，说明观测值之间的一致性较好；接近0表示个体内方差占主导地位，说明观测值之间的一致性较差。
            显著性水平的选择通常是0.05。如果p值小于显著性水平，我们可能会拒绝零假设，认为观测值之间的一致性是显著的。
          </p>
        </div>
        <!-- <div>
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
        </div> -->
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
        :close-on-click-modal="true"
        :modal-append-to-body="false"
      >
        <el-button @click="exportContent">导出为图片</el-button>
        <el-button @click="downloadPDF">导出为pdf</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { postRequest, getRequest } from "@/utils/api";
import { singleFactorAnalyze } from "@/api/user";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
export default defineComponent({
  name: "outcome2",
  props: ["active", "label", "checkedFeats", "newTaskInfo", "createTaskInfo"],
  data() {
    return {
      allData: [],
      showOptions: false,
      tableData1: [
        {
          method: "ICC1:one-way random-effects model",
          type: "ICC1",
          icc: "0",
          f: "0",
          df1: 0,
          df2: 0,
          p: 0,
        },
        {
          method: "ICC2:two-way random-effects mode",
          type: "ICC2",
          icc: "0",
          f: "0",
          df1: 0,
          df2: 0,
          p: 0,
        },
      ],
      tableData2: [
        {
          valid_frequnt: 713,
          variableOneAvg: 54,
          variableSecondAvg: 165,
          distanceAvg: -110,
          standardDeviation: 8.05,
          "95%CI": "-111.366~-110.215",
          t: -367.44,
        },
      ],
      taskInfoParam: {},
      taskInfo: null,
    };
  },
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
    this.getAllData();
  },
  methods: {
    open3(mesg) {
      this.$message({
        message: mesg,
        type: "warning",
      });
    },
    returnTask() {
      this.$router.push("/taskManage");
    },
    getAllData() {
      let tableName = null;
      let featureName = null;
      if (
        this.taskInfoParam != null &&
        this.taskInfoParam.featureName != null &&
        this.taskInfoParam.label != null
      ) {
        // 判断是否是直接从任务管理查看任务结果
        tableName = this.taskInfoParam.label;
        featureName = this.taskInfoParam.featureName;
      } else {
        tableName = this.label;
        featureName = this.checkedFeats[0].featureName;
      }
      singleFactorAnalyze(
        "/api/consistencyAnalyze",
        tableName,
        featureName,
        this.taskInfo
      ).then((response) => {
        // 传递表名、分组列名、观察列名
        console.log("返回数据：", response);
        if (response.code == 500) {
          this.open3(response.msg);
        } else {
          this.tableData1 = response.data.iccanalyzeResult;
        }
      });
    },
    async exportContent() {
      try {
        const divToCapture = document.querySelector(".right_step");
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
        const divToCapture = document.querySelector(".right_step");
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
});
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  height: auto;
  flex-direction: column;
  align-items: center;
}
.stepbutton {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
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
  height: auto;
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
