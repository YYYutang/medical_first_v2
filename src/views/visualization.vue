<template>
  <div class="main">
    <el-header>
      <h3 v-if="head1">任务设置</h3>
      <h3 v-if="head2">疾病画像</h3>
      <el-divider></el-divider>
    </el-header>
    <el-container id="maintest">
      <div id="step" v-show="showStep">
        <el-steps :active="active" align-center>
          <el-step title="任务信息"></el-step>
          <el-step title="选择数据集"></el-step>
          <el-step title="选择一条数据"></el-step>
        </el-steps>
      </div>

      <div id="stepcontain" v-show="showStep">
        <taskInfo
          v-show="taskInfoForm.isShow"
          :tasktype="6"
          :active="active"
          ref="taskInfo"
          :type="5"
          @send_taskInfo="getTaskInfo"
          :createTaskInfo="createTaskInfo"
        ></taskInfo>
        <div class="button1" v-show="taskInfoForm.isShow">
          <el-button type="primary" size="small" @click="submitForm(active)"
            >下一步</el-button
          >
        </div>
        <datasetChoose
          :showDataManageStep="(showDataManageStep = false)"
          @send_data="getTableName"
          v-show="dataSelectForm.isShow"
          class="visual_datasetChoose"
        ></datasetChoose>
        <div class="button1" v-show="dataSelectForm.isShow">
          <el-button type="primary" size="small" @click="stepBack(active)"
            >上一步</el-button
          >
          <el-button type="primary" size="small" @click="submitForm(active)"
            >下一步</el-button
          >
        </div>
        <!--======================================     选择一条数据     ======================================================-->
        <el-form
          class="form"
          :model="oneSelectForm.formData"
          :rules="oneSelectForm.rules"
          v-show="oneSelectForm.isShow"
          ref="oneSelectForm"
          label-position="top"
          v-loading="dataLoading"
          element-loading-text="数据量较大，正在努力加载中..."
        >
          <el-form-item prop="selectedData">
            <div class="selectTitle">
              <h3>提示：请选择一个病人</h3>
              <div>
                <el-input
                  placeholder="请输入要检索的病人信息"
                  v-model="searchPatient"
                  class="patitentInput"
                >
                </el-input>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="searchPatientInfo"
                ></el-button>
              </div>
            </div>
            <div class="table" v-if="dataPre">
              <el-table
                :data="tableData"
                v-model="oneSelectForm.formData.selectedData"
                highlight-current-row
                @current-change="handleCurrentChange"
                :current-row-key="tableData.patien_id"
                style="width: auto"
                border
                row-height="34"
                :row-style="{
                  height: '34px',
                  lineHeight: '10px',
                  padding: '0px',
                }"
                :header-cell-style="{
                  backgroundColor: '#e8e5e5',
                  color: 'black',
                  fontWeight: 'bold',
                }"
              >
                <el-table-column
                  v-for="(item, index) in dataColumn"
                  :key="index"
                  :label="item"
                  :prop="item"
                  width="150"
                  sortable
                >
                  <template slot-scope="{ row }">
                    <div
                      :class="{ 'row-selected': row === selectedRow }"
                      class="truncate-text"
                    >
                      {{ row[item] }}
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <br />
            <el-pagination
              background
              class="pagination"
              layout="prev, pager, next"
              :current-page="currentPage"
              :page-size="pageSize"
              @current-change="handleCurrentClick"
              :total="allPage"
            >
            </el-pagination>
          </el-form-item>

          <br />
          <div class="button1">
            <div class="flexButton">
              <el-button size="small" @click="stepBack(active)"
                >上一步</el-button
              >
              <el-button type="primary" size="small" @click="submitForm(active)"
                >完成</el-button
              >
            </div>
          </div>
        </el-form>
      </div>

      <div v-show="showChart" ref="exportContent">
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
        <div class="patientContent">
          <el-descriptions
            class="patientDescription"
            title="病人信息"
            :column="3"
          >
            <el-descriptions-item label="姓名">{{
              this.selectedRow?.name || "无"
            }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{
              this.selectedRow?.sexname || "无"
            }}</el-descriptions-item>
            <el-descriptions-item label="年龄">{{
              this.selectedRow?.age || "无"
            }}</el-descriptions-item>
            <el-descriptions-item label="正常指标个数">
              <el-tag size="small">{{
                8 - nullCount - liverAbnormal - kidneyAbnormal
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="异常指标个数">
              <el-tag size="small">{{ kidneyAbnormal + liverAbnormal }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="空指标个数">
              <el-tag size="small">{{ nullCount }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div
          id="chart"
          class="charts"
          style="width: 700px; height: 600px; margin-left: 100px"
        ></div>
        <div
          id="barChart"
          class="charts"
          style="width: 700px; height: 600px"
        ></div>
      </div>
      <div class="button1" v-if="showButton">
        <el-button
          type="primary"
          size="small"
          @click="stepBack(active)"
          v-if="Object.keys(taskInfoParm) == 0"
          >上一步</el-button
        >
        <el-button type="primary" size="small" @click="returnTask" v-else
          >返回</el-button
        >
        <el-button type="primary" size="small" @click="exportData"
          >导 出</el-button
        >
      </div>
    </el-container>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/utils/api";
import { addVisliazationTask } from "@/api/user";
import datasetChoose from "@/components/datasetChoose/dataManage.vue";
import * as echarts from "echarts";
import html2canvas from "html2canvas";
import server from "@/utils/request";
import taskInfo from "@/components/TaskInfo.vue";
export default {
  components: {
    datasetChoose,
    taskInfo,
  },
  data() {
    return {
      taskInfo: null,
      taskInfoParm: null,
      is_select: false,
      selectedRow: null,
      dataPre: false,
      showForm: true,
      showChart: false,
      showStep: true,
      outComeData: [],
      currentPage: 1,
      pageSize: 10,
      allPage: 0,
      dataColumn: [],
      dataOptions: [],
      healthDataLow: [3.2, 3.2, 50, 100],
      healthDataHigh: [7.1, 7.0, 90, 170],
      patientData: [],
      formArray: ["taskInfoForm", "dataSelectForm", "oneSelectForm", "outcome"],
      active: 0,
      currentRow: null,
      tableData: [],
      baryData: [],
      barTitle: "肾脏指标与健康人对比情况",
      kidneyPatient: [],
      liverPatient: [],
      kidneyAbnormal: 0,
      liverAbnormal: 0,
      nullCount: 0,
      showButton: false,
      kidneyFormalData: [
        // { name: "BUN", min: 3.2, max: 7.1, nameCH: "血尿素氮" },
        // { name: "BU", min: 3.2, max: 7.0, nameCH: "血尿素" },
        // { name: "SCR", min: 50, max: 90, nameCH: "血肌酐" },
        // { name: "UCR", min: 100, max: 170, nameCH: "尿肌酐" },
        { name: "MONO_num", min: 3.2, max: 7.1, nameCH: "血尿素氮" },
        { name: "EO_num", min: 3.2, max: 7.0, nameCH: "血尿素" },
        { name: "BASO_num", min: 50, max: 90, nameCH: "血肌酐" },
        { name: "NEUT_per", min: 100, max: 170, nameCH: "尿肌酐" },
      ],
      liverFormalData: [
        // { name: "ALT", min: 0, max: 40, nameCH: "谷丙转氨酶" },
        // { name: "AST", min: 0, max: 35, nameCH: "谷草转氨酶" },
        // { name: "GGT", min: 10, max: 45, nameCH: "谷氨酰胺转移酶" },
        // { name: "ALP", min: 45, max: 125, nameCH: "碱性磷酸酶" },
        { name: "LYMPH_per", min: 0, max: 40, nameCH: "谷丙转氨酶" },
        { name: "MONO_per", min: 0, max: 35, nameCH: "谷草转氨酶" },
        { name: "EO_per", min: 10, max: 45, nameCH: "谷氨酰胺转移酶" },
        { name: "BASO_per", min: 45, max: 125, nameCH: "碱性磷酸酶" },
      ],
      value1: [],
      value2: [],
      searchPatient: "",
      head1: true,
      head2: false,
      createTaskInfo: null,
      taskInfoForm: {
        isShow: true,
        formData: {
          selectedData: "",
        },
        rules: {
          selectedData: [
            { required: true, message: "请选择数据表", trigger: "blur" },
          ],
        },
      },
      //数据选择-----------------------------------------------------------------------------------------------
      dataSelectForm: {
        isShow: false,
        formData: {
          selectedData: "",
        },
        rules: {
          selectedData: [
            { required: true, message: "请选择数据表", trigger: "blur" },
          ],
        },
      },
      //选择属性列-----------------------------------------------------------------------------------------------
      oneSelectForm: {
        isShow: false,
        formData: {
          selectedData: [],
        },
        rules: {
          selectedData: [
            { required: true, message: "请选择属性列", trigger: "blur" },
          ],
        },
      },

      //数据处理-----------------------------------------------------------------------------------------------
      algoForm: {
        isShow: false,
        formData: {
          algoName: "",
          params: [],
        },
        rules: {
          algoName: [
            { required: true, message: "请选择一个算法模型", trigger: "blur" },
          ],
        },
      },
      dataLoading: false,
      patientAllData: [],
      totalAll: 0,
    };
  },
  // created() {
  //   this.taskInfoParm = this.$route.params
  //   if(this.taskInfoParm.label!=null && this.taskInfoParm.select!=null) this.taskInfo = this.taskInfoParm.taskInfo;
  //   else this.taskInfo = this.taskInfoParm;
  //   console.log("taskInfo",this.taskInfo)
  //   if(this.taskInfoParm != null && (this.taskInfoParm.label!=null && this.taskInfoParm.select!=null)){ // 判断是否是直接从任务管理跳转过来
  //       console.log("直接从任务管理跳转过来")
  //       this.is_select = true;
  //       this.selectedRow = {};
  //       this.submitForm(1);
  //   }else{
  //     this.getAllData();
  //   }
  // },
  mounted() {
    this.taskInfoParm = this.$route.params;
    if (this.taskInfoParm.label != null && this.taskInfoParm.select != null)
      this.taskInfo = this.taskInfoParm.taskInfo;
    else this.taskInfo = this.taskInfoParm;
    console.log("taskInfo", this.taskInfo);
    if (
      this.taskInfoParm != null &&
      this.taskInfoParm.label != null &&
      this.taskInfoParm.select != null
    ) {
      // 判断是否是直接从任务管理跳转过来
      this.is_select = true;
      this.showButton = false;
      this.selectedRow = {};
      this.submitForm(2);
    } else {
      this.getAllData();
    }
  },
  methods: {
    async exportData() {
      try {
        const divToCapture = this.$refs.exportContent;
        const canvas = await html2canvas(divToCapture);
        const imageUrl = canvas.toDataURL();
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "image.png";
        link.click();
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    },
    getTableName(tableName) {
      console.log("gettablename", tableName);
      this.dataSelectForm.formData.selectedData = tableName;
    },
    onSubmitDM() {
      this.showForm = !this.showForm;
      this.showChart = !this.showChart;
    },
    drawChart() {
      var option;
      let myChart = echarts.init(document.getElementById("chart"));
      let barChart = echarts.init(document.getElementById("barChart"));
      const that = this;

      $.get("./pic.svg", function (svg) {
        echarts.registerMap("organ_diagram", { svg: svg });
        option = {
          title: {
            text: "请点击图中器官切换查看指标（目前仅有肾与肝）", // 这里是你的标题文本
            left: "center", // 标题的水平位置
            top: "top",
          },
          tooltip: {
            trigger: "item",
            formatter: function (args) {
              if (args.name == "kidney") {
                return (
                  args.name + "处的危险指标数：" + that.kidneyAbnormal + "个"
                );
              }
              if (args.name == "liver") {
                return (
                  args.name + "处的危险指标数：" + that.liverAbnormal + "个"
                );
              }
            },
          },
          geo: {
            left: 10,
            right: "50%",
            map: "organ_diagram",
            selectedMode: "multiple",
            tooltip: {
              trigger: "item",
              formatter: function (args) {
                if (args.name == "kidney") {
                  return (
                    args.name + "处的危险指标数：" + that.kidneyAbnormal + "个"
                  );
                }
                if (args.name == "liver") {
                  return (
                    args.name + "处的危险指标数：" + that.liverAbnormal + "个"
                  );
                }
              },
            },
            emphasis: {
              focus: "self",
              itemStyle: {
                color: null,
              },
              label: {
                position: "bottom",
                distance: 0,
                textBorderColor: "#fff",
                textBorderWidth: 2,
              },
            },

            blur: {},
            select: {
              itemStyle: {
                color: "#b50205",
              },
              label: {
                show: true,
                textBorderColor: "#fff",
                textBorderWidth: 2,
              },
            },
          },
          grid: {
            left: "60%",
            top: "20%",
            bottom: "20%",
          },
        };
        myChart.setOption(option);
        if (that.kidneyAbnormal > 0) {
          myChart.dispatchAction({
            type: "highlight",
            geoIndex: 0,
            name: "kidney",
          });
        }
        if (that.liverAbnormal > 0) {
          myChart.dispatchAction({
            type: "highlight",
            geoIndex: 0,
            name: "liver",
          });
        }
        myChart.on("click", function (event) {
          if (event.name == "kidney") {
            that.patientData = that.kidneyPatient;
            let nameArr = that.kidneyFormalData.map((item) => {
              return item.nameCH;
            });
            that.baryData = nameArr;
            let minArr = that.kidneyFormalData.map((item) => {
              return item.min;
            });
            that.healthDataLow = minArr;
            let maxArr = that.kidneyFormalData.map((item) => {
              return item.max;
            });
            that.healthDataHigh = maxArr;
            that.barTitle = "肾脏指标与健康人对比情况";
          }
          if (event.name == "liver") {
            let select = that.oneSelectForm.formData.selectedData;

            that.patientData = that.liverPatient;
            let nameArr = that.liverFormalData.map((item) => {
              return item.nameCH;
            });
            that.baryData = nameArr;
            let minArr = that.liverFormalData.map((item) => {
              return item.min;
            });
            that.healthDataLow = minArr;
            let maxArr = that.liverFormalData.map((item) => {
              return item.max;
            });
            that.healthDataHigh = maxArr;
            that.barTitle = "肝脏指标与健康人对比情况";
          }
          that.drawChart();
        });
        myChart.on("mouseover", function (event) {
          myChart.dispatchAction({
            type: "highlight",
            geoIndex: 0,
            name: event.name,
          });
        });
        myChart.on("mouseout", function (event) {
          myChart.dispatchAction({
            type: "downplay",
            geoIndex: 0,
            name: event.name,
          });
        });
      });
      var barOption = {
        title: {
          text: this.barTitle,
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
       
          formatter: function (params) {
            var tar = params[0];
            var tar1 = params[1];
            var tar2 = params[2];
            return (
              tar.seriesName +
              " : " +
              tar.value +
              "<br/>" +
              tar1.seriesName +
              ":" +
              tar1.value +
              "-" +
              tar2.value
            );
          },
        },
        legend: { left: "right", data: name },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: this.baryData,
          
        },
        yAxis: {
         type: "value",
          boundaryGap: [0, 0.01],
        },
        series: [
          {
            name: "患者",
            type: "bar",
            data: this.patientData,
          },

          {
            name: "健康人",
            type: "bar",
            stack: "Total",
            emphasis: {
              focus: "self",
            },
            itemStyle: {
              borderColor: "transparent",
              color: "transparent",
            },
            emphasis: {
              itemStyle: {
                borderColor: "transparent",
                color: "transparent",
              },
            },
            data: this.healthDataLow,
          },
          {
            name: "健康人",
            type: "bar",
            stack: "Total",
            emphasis: {
              focus: "self",
            },
            data: this.healthDataHigh,
          },
        ],
         dataZoom: [
        {
          show: true,
          start: 0,
          end: 40
        },
        {
          type: 'inside',
          start: 0,
          end: 50
        },
        {
          show: true,
          yAxisIndex: 0,
          filterMode: 'empty',
          width: 30,
          height: '80%',
          showDataShadow: false,
          left: '93%'
        }
      ],
      };
      option && myChart.setOption(option);
      barOption && barChart.setOption(barOption);
    },
    open3(msg) {
      this.$message({
        message: msg,
        type: "warning",
      });
    },
    getTaskInfo(data) {
      this.createTaskInfo = data;
      this.createTaskInfo.tasktype = "特征表征";
    },
    returnTask() {
      this.$router.push("/taskManage");
    },
    submitForm(stepIndex) {
      console.log("stepIndex", stepIndex);
      if (stepIndex == 1 && !this.dataSelectForm.formData.selectedData) {
        this.open3("请选择一个数据表！");
        return;
      }
      if (
        (stepIndex == 2 && this.is_select == false) ||
        (stepIndex == 2 && this.selectedRow == null)
      ) {
        this.open3("请选择一个病人！");
        return;
      }
      if (stepIndex < 2) {
        let formName = this.formArray[stepIndex];
        this[formName].isShow = false;
        let nextFormName = this.formArray[++this.active];
        this[nextFormName].isShow = true;
      }
      if (stepIndex == 1) {
        let tableName = this.dataSelectForm.formData.selectedData;
        this.dataLoading = true;

        getRequest(
          "/feature/getInfoByTableName?tableName=" + tableName + "&page=" + 1
        )
          .then((response) => {
            this.dataColumn = Object.keys(response.data[0]);
            this.allPage = response.total * 10;
            this.totalAll = response.total * 10;
            this.tableData = response.data;
            this.patientAllData = response.data;
            this.dataPre = true;
          })
          .finally(() => {
            this.dataLoading = false;
          });
      } else if (stepIndex == 2) {
        let tableName = this.dataSelectForm.formData.selectedData;
        let select = this.oneSelectForm.formData.selectedData;
        if (
          this.taskInfoParm != null &&
          this.taskInfoParm.label != null &&
          this.taskInfoParm.select != null
        ) {
          //// 直接从任务管理跳转拿过来
          tableName = this.taskInfoParm.label;
          select = this.taskInfoParm.select;
        } else {
          // 创建任务过来的 或者正常流程过来
          addVisliazationTask(
            "/Task/visualization",
            tableName,
            select,
            this.taskInfo
          )
            .then((response) => {
              if (response.code != 200) {
                this.open4("任务创建失败");
                return;
              }
            })
            .catch((error) => {
              this.open4("任务创建失败！");
              return;
            });
        }
        this.showChart = !this.showChart;
        this.showStep = !this.showStep;
        this.head1 = !this.head1;
        this.head2 = !this.head2;
        this.tableisShow = !this.tableisShow;
        this.showButton = !this.showButton;
        this.active++;
        const temp1 = [0, 0, 0, 0];
        if (typeof select == "string") select = JSON.parse(select);
        console.log("select[MONO_num]", select.MONO_num);
        temp1[0] = select["MONO_num"];
        temp1[1] = select["EO_num"];
        temp1[2] = select["BASO_num"];
        temp1[3] = select["NEUT_per"];
        this.kidneyPatient = temp1; // 肾脏数据
        this.patientData = temp1;
        this.liverPatient[0] = select["LYMPH_per"];
        this.liverPatient[1] = select["MONO_per"];
        this.liverPatient[2] = select["EO_per"];
        this.liverPatient[3] = select["BASO_per"];
        let nameArr = this.kidneyFormalData.map((item) => {
          return item.nameCH;
        });
        this.baryData = nameArr;
        var count = 0;
        var count1 = 0;
        var count2 = 0;
        for (let j in select) {
          for (var i = 0; i < this.kidneyFormalData.length; i++) {
            if (this.kidneyFormalData[i].name == j) {
              if (!select[j]) {
                count2++;
              } else if (
                select[j] < this.kidneyFormalData[i].min ||
                select[j] > this.kidneyFormalData[i].max
              ) {
                count++;
              }
            }
          }
          for (var i = 0; i < this.liverFormalData.length; i++) {
            if (this.liverFormalData[i].name == j) {
              if (!select[j]) {
                count2++;
              } else if (
                select[j] < this.liverFormalData[i].min ||
                select[j] > this.liverFormalData[i].max
              ) {
                count1++;
              }
            }
          }
        }
        this.kidneyAbnormal = count;
        this.liverAbnormal = count1;
        this.nullCount = count2;
        // 任务创建直接过来画图出问题
        this.drawChart();
      }
    },
    resetForm(stepIndex) {
      let formName = this.formArray[stepIndex];
      this.$refs[formName].resetFields();
    },
    stepBack(stepIndex) {
      // alert("stepIndex:"+stepIndex)
      if (this.active - 1 >= 0) {
        if (this.active == 1) {
          this.tableData = [];
        }
        let formName = this.formArray[stepIndex];

        if (formName == "outcome") {
          console.log("in");
          this.showChart = !this.showChart;
          this.showStep = !this.showStep;
          this.head1 = !this.head1;
          this.head2 = !this.head2;
          this.tableisShow = !this.tableisShow;
          this.showButton = !this.showButton;
        } else {
          this[formName].isShow = false;
        }
        this.active--;
        let preFormName = this.formArray[--stepIndex];
        this[preFormName].isShow = true;
      }
    },

    clearSample() {
      this.featureExtractForm.formData.sample = "";
    },
    getAllData() {
      var tempList = JSON.parse(this.$store.getters.getAllTableData);
      for (let i = 0; i < tempList.length; i++) {
        const obj = {
          tableName: tempList[i].tableName,
        };
        this.dataOptions.push(obj);
      }
    },
    outputParams(value) {
      this.algoForm.formData.params = value;
    },
    setCurrent(row) {
      this.$refs.oneSelectForm.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.selectedRow = val;
      console.log("selectedRow", this.selectedRow);
      this.oneSelectForm.formData.selectedData = this.currentRow;
      this.is_select = true;
    },
    handleCurrentClick(val) {
      this.currentPage = val;
      if (this.searchPatient != "") {
        getRequest(
          "/api/getDiseasesInfo?tableName=" +
            this.dataSelectForm.formData.selectedData +
            "&value=" +
            this.searchPatient +
            "&page=" +
            val
        ).then((res) => {
          this.tableData = res.data;
        });
      } else {
        getRequest(
          "/feature/getInfoByTableName?tableName=" +
            this.dataSelectForm.formData.selectedData +
            "&page=" +
            val
        ).then((response) => {
          this.tableData = response.data;
        });
      }
    },
    searchPatientInfo() {
      getRequest(
        "/api/getDiseasesInfo?tableName=" +
          this.dataSelectForm.formData.selectedData +
          "&value=" +
          this.searchPatient +
          "&page=" +
          1
      ).then((res) => {
        console.log(res);
        this.tableData = res.data.data;
        this.allPage = res.data.total;
      });
    },
  },
  watch: {
    searchPatient(newVal, oldVal) {
      if (newVal === "") {
        this.tableData = this.patientAllData;
        this.allPage = this.totalAll;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.selectTitle {
  display: flex;
  justify-content: space-between;
  width: 100%;
  line-height: 40px;
}
.patitentInput {
  width: 200px;
}
.el-form {
  /deep/.el-form-item__content {
    line-height: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.el-form-item {
  width: 60%;
  margin: 0 auto;
  margin-top: 30px;
}
#maintest {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 40px;
  // height: 100%;
}
#step {
  height: 100%;
  margin-top: 130px;
}
#stepcontain {
  width: 100%;
  height: 100%;
  left: 15%;
}

.table {
  width: 1100px;
  justify-content: center;
  align-items: center;
}
.charts {
  margin-top: 40px;
  float: left;
}
.chooseBar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}
#step[data-v-b6bb290c] {
  height: 100%;
  margin-top: 0px;
}
.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
// .el-container.is-vertical, .el-drawer, .el-empty, .el-result {
//     -webkit-box-orient: vertical;
//     overflow-y: hidden;
// }
.visual_datasetChoose {
  ::v-deep .left_tree {
    height: 630px;
  }
}
.button1 {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  width: 90%;
  background: rgb(255, 255, 255);
  position: fixed;
  bottom: 23px;
  z-index: 1;
}
/deep/ .el-table__body tr.current-row > td.el-table__cell {
  background-color: #157df0;
  color: #fff;
}
.patientDescription {
  width: 80%;
}
.patientContent {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}
</style>
