<template>
  <div>
    <el-container class="outcontainer2">
      <taskInfo
        v-if="active == 1"
        :tasktype="5"
        :active="active"
        ref="taskInfo"
        :type="4"
        @send_taskInfo="getTaskInfo"
        :createTaskInfo="createTaskInfo"
      ></taskInfo>
      <datasetChoose
        v-if="active == 2"
        :active="active"
        :type="4"
        @send_data="handleDataFromChild"
        :showDataManageStep="(showDataManageStep = true)"
      ></datasetChoose>
      <characterChoose
        v-if="active == 3"
        :active="active"
        :step="4"
        :label="label"
        :type="4"
        :curentAnalyzeStep="4"
        @send_feat="getCheackedFeats"
        @sendTreeNode="getSelectTreeNode"
        :selectTreeNode="selectTreeNode"
        @sendFeatueData="getFeatureData"
        :featureDataFromParent="featureDataFromParent"
      ></characterChoose>
      <representAlgo
        v-if="active == 4"
        :active="active"
        @send_method="getRepreCompleteMethod"
      ></representAlgo>
      <el-tabs
        v-if="active == 5"
        v-model="activeName"
        @tab-click="handleClick"
        v-loading="loading"
      >
        <el-tab-pane label="原始数据统计分析" name="first"
          ><oldData
            v-if="oldShow"
            :dataAll="dataAll"
            :dataName="label"
            :statisData="statisData"
            :dataColumns="dataInOptions"
            :active="active"
            :newTaskInfo="newTaskInfo"
            :createTaskInfo="createTaskInfo"
            ref="childComponentRef1"
          >
          </oldData>
        </el-tab-pane>
        <el-tab-pane label="处理后数据统计分析" name="second"
          ><newData
            v-if="newShow"
            :dataChoose="dataChoose"
            :dataNew="dataNew"
            :dataNewColumns="dataNewColumns"
            :dataName="label"
            :columnName="checkedFeats"
            :chartDatay="chartDatay"
            :active="active"
            :newTaskInfo="newTaskInfo"
            :createTaskInfo="createTaskInfo"
            ref="childComponentRef2"
          ></newData>
        </el-tab-pane>
      </el-tabs>

      <br />
      <div class="stepbutton">
        <el-button
          size="small"
          v-if="active != 1 && Object.keys(this.newTaskInfo).length === 0"
          @click="stepBack(active)"
          >上一步</el-button
        >
        <el-button
          size="small"
          type="primary"
          v-if="active != 5 && Object.keys(this.newTaskInfo).length === 0"
          @click="stepNext(active)"
          >下一步</el-button
        >
        <el-button
          size="small"
          v-if="Object.keys(this.newTaskInfo).length != 0"
          @click="returnTask"
          >返回</el-button
        >
        <el-button
          size="small"
          type="primary"
          v-if="active == 5"
          @click="showOptions = true"
          >导出</el-button
        >
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
    </el-container>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/utils/api";
import characterChoose from "@/components/characterChoose/index.vue";
import datasetChoose from "@/components/datasetChoose/dataManage.vue";
import representAlgo from "@/views/represent/algo.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import taskInfo from "@/components/TaskInfo.vue";
import oldData from "@/components/outcomeShow/oldData.vue";
import newData from "@/components/outcomeShow/newData.vue";
/*缺失值补齐根页面*/
export default {
  components: {
    characterChoose,
    datasetChoose,
    representAlgo,
    taskInfo,
    oldData,
    newData,
  },
  data() {
    return {
      isback: false,
      loading: false,
      showOptions: false,
      newTaskInfo: null,
      tableData1FromParent: [],
      tableData2FromParent: [],
      tableData3FromParent: [],
      featureDataFromParent: [],
      dataInOptions: [],
      dataNewColumns: [],
      dataNew: [],
      dataAll: [],
      chartDatay: [],
      statisData: [],
      selectTreeNode: [],
      dataChoose: [],
      columnSelect: [],
      oldShow: false,
      newShow: false,
      activeName: "first",
      // dialogVisible: false,
      filePath: "",
      fileName: "",
      active: 1,
      label: "",
      checkedFeats: [],
      missCompleteMehtod: [],
      folderPath: "",
      createTaskInfo: null,
      form: {
        imgSavePath: "",
      },
    };
  },

  created() {
    this.newTaskInfo = this.$route.params;
    console.log("新建任务参数：", this.newTaskInfo);
    if (Object.keys(this.newTaskInfo).length !== 0) {
      this.active = 4;
      this.stepNext(4);
    }
  },
  methods: {
    returnTask() {
      this.$router.push("/taskManage");
    },
    getTaskInfo(data) {
      this.createTaskInfo = data;
      this.createTaskInfo.tasktype = "特征表征";
      console.log("获取到任务信息", this.createTaskInfo);
    },
    open3(msg) {
      this.$message({
        message: msg,
        type: "warning",
      });
    },
    handleClose() {},
    getTableA(data) {
      this.tableData1FromParent = data;
    },
    getTableB(data) {
      this.tableData2FromParent = data;
    },
    getTableC(data) {
      this.tableData3FromParent = data;
    },
    getFeatureData(data) {
      this.featureDataFromParent = data;
    },

    getSelectTreeNode(data) {
      console.log("选中的树节点：", data);
      this.selectTreeNode = data;
    },
    changeState() {
      this.dialogVisible = true;
    },
    getRepreCompleteMethod(data) {
      this.representMethod = data;
    },

    getCheackedFeats(data) {
      this.checkedFeats = data.map((item) => {
        return item.featureName;
      });
    },
    stepBack(active) {
      this.active--;
      if (this.active === 2) {
        // 将 this.selectTreeNode 传递给子组件 characterChoose
        this.$refs.characterChoose.selectTreeNode = this.selectTreeNode;
        this.$refs.characterChoose.featureDataFromParent =
          this.featureDataFromParent;
      }
      if (this.active == 4) {
        console.log("开始回退");
        this.isback = true;
        this.$refs.missingalgo.tableData1FromParent = this.tableData1FromParent;
        this.$refs.missingalgo.tableData2FromParent = this.tableData2FromParent;
        this.$refs.missingalgo.tableData3FromParent = this.tableData3FromParent;
      }
    },
    handleClick(tab, event) {
      if (tab.$options.propsData.name == "first") {
        this.oldShow = true;
      } else if (tab.$options.propsData.name == "second") {
        this.newShow = true;
      }
    },
    async stepNext(active) {
      if (active == 1) {
        this.$refs.taskInfo.extStep(); // 假设子组件有一个名为 nextStep 的方法
        if (
          this.createTaskInfo.taskName.length < 1 ||
          this.createTaskInfo.principal.length < 1
        ) {
          this.$message("请填写任务名称和负责人");
          return;
        }
      }
      if (
        this.active == 3 &&
        (this.checkedFeats == null || this.checkedFeats.length == 0)
      ) {
        // 判断是否选择数据
        this.characterChooseVisiable = true;
        this.open3("请选择要表征的指标！");
        return;
      } else {
        this.active++;
        console.log(this.active);
        if (Object.keys(this.newTaskInfo).length === 0) {
          this.columnSelect = this.checkedFeats;
          console.log(" this.columnSelect", this.columnSelect);
          if (this.active == 5) {
            this.loading = true;
            const params = {
              tableName: this.label, //模型选择的数据表表名
              runParams: this.columnSelect, //模型选择的属性列（数组）
              aiName: this.representMethod,
            };
            await this.getAllfilled(this.label);
            await this.getStasticData(this.label);
            await this.getDataChoose(1, this.label, params.runParams);
            await this.getFirstPageData(this.label);
            await this.getOutcome(params);
            this.loading = false;
          }
        } else if (Object.keys(this.newTaskInfo).length !== 0) {
          console.log("taskin");
          this.loading = true;
          const params = {
            tableName: this.newTaskInfo.tableName, //模型选择的数据表表名
            runParams: this.newTaskInfo.runParams.split(","), //模型选择的属性列（数组）
            aiName: "pca",
          };
          await this.getAllfilled(params.tableName);
          await this.getStasticData(params.tableName);
          await this.getDataChoose(1, params.tableName, params.runParams);
          await this.getFirstPageData(params.tableName);
          await this.getOutcome(params);
          this.loading = false;
        }
        return;
      }
    },
    handleDataFromChild(label) {
      this.label = label;
    },
    async exportContent() {
      try {
        let ref;
        if (this.oldShow) {
          ref = "childComponentRef1";
        }
        if (this.newShow) {
          ref = "childComponentRef2";
        }
        console.log(this.$refs[ref]);
        const divToCapture = this.$refs[ref].$el.querySelector(".outcome");
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
        let selectName;
        if (this.oldShow) {
          selectName = "oldData";
        }
        if (this.newShow) {
          selectName = "newData";
        }
        const divToCapture =
          this.$refs.childComponentRef.$el.querySelector(".outcome");
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
    async getStasticData(tableName) {
      const response = await getRequest(
        "/feature/getStatisticaldData/" + tableName
      );
      this.statisData = response.data;
    },
    setColumnFlag(column, flagName) {
      // 直接赋值布尔表达式的结果
      return column[flagName] === true;
    },
    async getFirstPageData(tableName) {
      const response = await getRequest(
        "/feature/getInfoByTableName?tableName=" + tableName + "&page=" + 1
      );
      this.dataAll = response;
    },
    async getAllfilled(tableName) {
      const response = await getRequest("/feature/getAllFiled/" + tableName);
      let data = response.data;
      let columnNametemp = Object.keys(data);
      for (let i = 0; i < columnNametemp.length; i++) {
        const column = data[columnNametemp[i]];
        if (column != null) {
          const obj = {
            columnName: column.featureName,
            columnisR: this.setColumnFlag(column, "population"), // 人口学
            columnisX: this.setColumnFlag(column, "society"), // 社会学
            columnisS: this.setColumnFlag(column, "physiology"), // 生理指标
          };
          // 用逻辑非运算符简化判断其他
          obj.columnisO = !obj.columnisR && !obj.columnisX && !obj.columnisS;
          this.dataInOptions.push(obj);
        }
      }
    },
    async getOutcome(params) {
      try {
        const response = await postRequest("feature/runAi", params);
        console.log("response", response);
        this.dataNewColumns = [];
        this.dataNew = [];
        this.chartDatay = [];
        for (let i in response.data[0]) {
          var num = parseInt(i) + 1;

          this.dataNewColumns.push("主成分" + num);
          this.dataNew["主成分" + num] = response.data[0][i];
        }
        for (let i in response.data[1]) {
          this.chartDatay.push(response.data[1][i]);
        }
        console.log("fuchartdatay", this.chartDatay);
        this.oldShow = true;
      } catch (error) {
        this.active--;
      }
    },
    async getDataChoose(page, tableName, params) {
      const response = await getRequest(
        "/feature/getInfoBySelectedFiled?page=" +
          page +
          "&tableName=" +
          tableName +
          "&params=" +
          params
      );
      this.dataChoose = response;
    },
  },
};
</script>
<style scoped>
.outcontainer2 {
  display: flex;
  /* display: block; */
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.stepcontainer {
  display: flex;
  width: 100%;
  height: 100%;
}
.stepbutton {
  display: flex;
  width: 90%;
  background: rgb(255, 255, 255);
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: fixed;
  bottom: 23px;
}
</style>
