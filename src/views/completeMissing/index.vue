<template>
  <div>
    <el-container class="outcontainer2">
      <taskInfo
        v-if="active == 1"
        :tasktype="4"
        :type="4"
        :active="active"
        ref="taskInfo"
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
        :step="1"
        :label="label"
        :type="4"
        :curentAnalyzeStep="1"
        @send_feat="getCheackedFeats"
        @sendTreeNode="getSelectTreeNode"
        :selectTreeNode="selectTreeNode"
        @sendFeatueData="getFeatureData"
        :featureDataFromParent="featureDataFromParent"
      ></characterChoose>
      <missingalgo
        ref="missingalgo"
        v-if="active == 4"
        :active="active"
        :checkedFeats="checkedFeats"
        :isback="isback"
        :label="label"
        @send_method="getMissCompleteMehtod"
        @send_table_a="getTableA"
        @send_table_b="getTableB"
        @send_table_c="getTableC"
        :tableData1FromParent="tableData1FromParent"
        :tableData2FromParent="tableData2FromParent"
        :tableData3FromParent="tableData3FromParent"
      ></missingalgo>
      <missingoutcome
        v-if="active == 5"
        :active="active"
        :missCompleteMehtod="missCompleteMehtod"
        :label="label"
        :newTaskInfo="newTaskInfo"
        :createTaskInfo="createTaskInfo"
      ></missingoutcome>

      <br />
      <div class="stepbutton">
        <el-button size="small" v-if="active != 1" @click="stepBack(active)"
          >上一步</el-button
        >
        <el-button
          size="small"
          type="primary"
          v-if="active != 5"
          @click="stepNext(active)"
          >下一步</el-button
        >
        <el-button
          size="small"
          type="primary"
          v-if="active == 5"
          @click="exportFile()"
          >导出</el-button
        >
      </div>
    </el-container>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/utils/api";
import characterChoose from "@/components/characterChoose/index.vue";
import datasetChoose from "@/components/datasetChoose/dataManage.vue";
import missingalgo from "@/views/completeMissing/algo.vue";
import missingoutcome from "@/views/completeMissing/outcome.vue";
import taskInfo from "@/components/TaskInfo.vue";
import * as XLSX from "xlsx";
/*缺失值补齐根页面*/
export default {
  components: {
    characterChoose,
    datasetChoose,
    missingalgo,
    missingoutcome,
    taskInfo,
  },
  data() {
    return {
      isback: false,
      newTaskInfo: null,
      tableData1FromParent: [],
      tableData2FromParent: [],
      tableData3FromParent: [],
      featureDataFromParent: [],
      selectTreeNode: [],
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
  },
  methods: {
    getTaskInfo(data) {
      this.createTaskInfo = data;
      this.createTaskInfo.tasktype = "缺失值补齐";
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
    // exportFile(){
    //   let dataFillMethodVo = {
    //     missCompleteMethod: this.missCompleteMehtod,
    //     tableName: this.label
    //   }
    //   let allParam = {
    //     dataFillMethodVo: dataFillMethodVo,
    //     path: this.filePath,
    //     fileName: this.fileName
    //   }
    //   postRequest("/api/exportFile",allParam).then(response=>{
    //     let blob = new Blob([response.data], { type: 'text/csv' });
    //     // 创建 Data URI
    //     const dataUri = window.URL.createObjectURL(blob);
    //     // 创建隐藏的 <a> 标签
    //     const link = document.createElement('a');
    //     link.href = dataUri;
    //     link.download = 'exported_data.csv'; // 下载文件的名称
    //     // 将 <a> 标签添加到页面中并模拟点击
    //     document.body.appendChild(link);
    //     link.click();
    //     // 下载完成后移除 <a> 标签
    //     document.body.removeChild(link);
    //     this.open2();
    //   }).catch(err=>{
    //     console.log("导出错误",err)
    //     this.open4();
    //   })
    // },
    exportFile() {
      let dataFillMethodVo = {
        missCompleteMethod: this.missCompleteMehtod,
        tableName: this.label,
      };
      let allParam = {
        dataFillMethodVo: dataFillMethodVo,
        path: this.filePath,
        fileName: this.fileName,
      };
      postRequest("/api/exportFile", allParam)
        .then((response) => {
          // let blob = new Blob([response.data], { type: 'text/csv' });
          // // 创建 Data URI
          // const dataUri = window.URL.createObjectURL(blob);
          // // 创建隐藏的 <a> 标签
          // const link = document.createElement('a');
          // link.href = dataUri;
          // link.download = 'exported_data.csv'; // 下载文件的名称
          // // 将 <a> 标签添加到页面中并模拟点击
          // document.body.appendChild(link);
          // link.click();
          // // 下载完成后移除 <a> 标签
          // document.body.removeChild(link);
          const csvData = response.data;
          // 将CSV数据解析为二维数组
          const csvArray = csvData.split("\n").map((row) => row.split(","));
          // 创建Workbook
          setTimeout(() => {
            const workbook = XLSX.utils.book_new();
            // 将数据填充到Worksheet中
            const worksheet = XLSX.utils.aoa_to_sheet(csvArray);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

            // 将Workbook保存为Excel文件
            XLSX.writeFile(workbook, `${this.tableName}_export.xlsx`);

            this.open2("数据导出成功");
          }, 100); // 延迟执行100毫秒，可以根据需要调整延迟时间
          this.open2();
        })
        .catch((err) => {
          console.log("导出错误", err);
          this.open4();
        });
    },

    open2() {
      this.$message({
        message: "恭喜你，文件导出成功了哦",
        type: "success",
      });
    },
    open4() {
      this.$message.error("出错了哦，导出文件出错了哦");
    },
    getMissCompleteMehtod(data) {
      // 获取子组件传递的数据 检查项+缺失值补齐算法名称
      this.missCompleteMehtod = data;
    },
    getCheackedFeats(data) {
      console.log("获取到：", data);
      this.checkedFeats = data;
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
    stepNext(active) {
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
      let flag1 = false;
      let flag2 = false;
      for (let i = 0; i < this.checkedFeats.length; i++) {
        if (this.checkedFeats[i].missRate == 100) flag1 = true;
        if (this.checkedFeats[i].missRate == 0) flag2 = true;
      }

      if (
        this.active == 3 &&
        (this.checkedFeats == null || this.checkedFeats.length == 0)
      ) {
        // 判断是否选择数据
        this.characterChooseVisiable = true;
        this.open3("请选择要填充的指标！");
        return;
      } else if (this.active == 3 && flag1 == true) {
        this.open3("存在缺失率高达100%的特征，无法补齐，请重新选择！");
        return;
      } else if (this.active == 3 && flag2 == true) {
        this.open3("存在已经没有缺失的特征，不需要补齐，请重新选择！");
        return;
      } else {
        this.active++;
        if (this.active == 4) this.isback = false;
        return;
      }
    },
    handleDataFromChild(label) {
      this.label = label;
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
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 10px;
}
</style>
