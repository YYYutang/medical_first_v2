<template>
  <div>
    <div class="topBigDiv">
      <div class="left">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>快捷入口</span>
          </div>
          <div class="quickEntryBox">
            <div v-for="(item, index) in quickEntry" :key="index">
              <div class="singleBox" @click="quickLink(index)">
                <img
                  :src="item.img"
                  class="imgStyle"
                  style="border-radius: 15px"
                />
                <div
                  style="font-size: large; font-weight: bold; margin-top: 10px"
                >
                  {{ item.title }}
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <div class="right">
        <el-card class="card">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>总体数据统计</span>
          </div>
          <!--            画图容器-->
          <div>
            <el-row :gutter="30">
              <el-col :span="6" id="data_sta">
                <div class="text_style">
                  <el-progress
                    type="circle"
                    :percentage="100"
                    :format="text"
                  ></el-progress>
                  <el-statistic :value="dataAllNum">
                    <template slot="title">
                      <span style="font-size: 20px; font: bold">数据总量</span>
                    </template>
                    <template slot="suffix"> 条 </template>
                  </el-statistic>
                </div>
              </el-col>
              <el-col :span="6" id="data_sta">
                <div>
                  <el-progress
                    type="circle"
                    :percentage="100"
                    :format="text2"
                  ></el-progress>
                  <el-statistic :value="insAllNum">
                    <template slot="title">
                      <span style="font-size: 20px; font: bold">指标总量</span>
                    </template>
                    <template slot="formatter"> {{ insAllNum }}</template>
                    <template slot="suffix"> 个 </template>
                  </el-statistic>
                </div>
              </el-col>
              <el-col :span="6" id="data_sta">
                <div>
                  <el-progress
                    type="circle"
                    :percentage="effectiveall"
                  ></el-progress>
                  <el-statistic :value="effectiveall" :precision="2">
                    <template slot="title">
                      <span style="font-size: 20px; font: bold"
                        >总体有效率</span
                      >
                    </template>
                    <template slot="suffix">% </template>
                  </el-statistic>
                </div>
              </el-col>
              <el-col :span="6" id="data_sta">
                <div>
                  <el-progress
                    type="circle"
                    :percentage="missingAll"
                  ></el-progress>
                  <el-statistic
                    group-separator=","
                    :precision="2"
                    decimal-separator="."
                    :value="missingAll"
                  >
                    <template slot="title">
                      <span style="font-size: 20px; font: bold"
                        >总体缺失率</span
                      >
                    </template>
                    <template slot="suffix">% </template>
                  </el-statistic>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
    <div class="bottomBigDiv">
      <div class="left">
        <el-card style="height: 500px">
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>病种数据统计</span>
          </div>
          <div
            v-for="(item, index) in diseaseData"
            :key="index"
            style="margin-top: 10px"
          >
            <div style="text-align: center">
              <span>{{ item.name }}</span>
              <el-progress
                :text-inside="true"
                :stroke-width="28"
                :percentage="
                  parseFloat(((item.num * 100) / patientNum).toFixed(2))
                "
                style="margin-top: 10px"
              ></el-progress>
            </div>
          </div>
        </el-card>
      </div>
      <div class="mid">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>各类指标完备率</span>
          </div>
          <div class="selectOptions">
            选择表:
            <el-cascader
              size="mini"
              clearable
              v-model="selectTableName"
              :options="tableOptions"
            ></el-cascader>
            选择类型:
            <el-select
              class="selector"
              v-model="selectTypeValue"
              placeholder="请选择数据类型"
              size="mini"
              style="width: 150px"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-tooltip
              effect="dark"
              content="该选项没有数据"
              placement="bottom"
              v-if="showWarning"
            >
              <i
                class="el-icon-warning-outline"
                style="padding: 8px"
                v-if="showWarning"
              ></i>
            </el-tooltip>
          </div>
          <div id="indicators" style="width: 500px; height: 400px"></div>
        </el-card>
      </div>
      <div class="right">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="lineStyle">▍</span><span>近七天任务增长趋势</span>
          </div>
          <div id="increase" style="width: 500px; height: 400px"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getRequest, getIndicators } from "@/api/user";
import storage from "@/utils/storage";
export default {
  name: "index",
  data() {
    return {
      tableOptions: [],
      typeOptions: [
        {
          label: "人口学指标",
          value: 0,
        },
        {
          label: "生理学指标",
          value: 1,
        },
        {
          label: "社会学指标",
          value: 2,
        },
        {
          label: "其他",
          value: 3,
        },
      ],
      mychart: {},
      mychart2: {},
      tableData2: [],
      showWarning: false,
      dataAllNum: 2,
      insAllNum: 0,
      missingAll: 0,
      effectiveall: 0,
      line: null,
      patientNum: 200,
      xdata: [],
      ydata: [],
      labelData: [],
      missingData: [],
      selectTableName: "冠心病纳排",
      selectTypeValue: 3,
      quickEntry: [
        {
          title: "数据管理",
          img: require("../../assets/dataManage.png"),
          router: "/dataManagePublic",
        },
        {
          title: "任务管理",
          img: require("../../assets/other.png"),
          router: "/taskManage",
        },
        {
          title: "统计分析",
          img: require("../../assets/tongji.png"),
          router: "/stasticAnalyze",
        },
        {
          title: "缺失值处理",
          img: require("../../assets/queshizhi.png"),
          router: "/completeMissing",
        },
        {
          title: "特征表征",
          img: require("../../assets/mutipile.png"),
          router: "/represent",
        },
        {
          title: "病人画像",
          img: require("../../assets/feiai.png"),
          router: "/visualization",
        },
      ],
      diseaseData: [],
    };
  },
  computed: {
    selectedLabel() {
      // 使用 find() 方法查找数组中符合条件的第一个元素
      const selectedOption = this.typeOptions.find(
        (option) => option.value === this.selectTypeValue
      );
      // 如果找到相应的选项，则返回其 label；如果没有找到，则返回 undefined 或一个默认值
      return selectedOption ? selectedOption.label : "未找到";
    },
    selectedTableNameConverted() {
      if (Array.isArray(this.selectTableName)) {
        const lastValue = this.selectTableName[this.selectTableName.length - 1];
        return this.findLabelByValue(this.tableOptions, lastValue);
      } else {
        return "冠心病纳排";
      }
    },
  },
  methods: {
    findLabelByValue(data, value) {
      for (let item of data) {
        if (item.value === value) {
          return item.label;
        }
        if (item.children && item.children.length) {
          let foundLabel = this.findLabelByValue(item.children, value);
          if (foundLabel) {
            return foundLabel;
          }
        }
      }
      return null;
    },
    quickLink(index) {
      this.$router.replace(this.quickEntry[index].router);
    },
    init() {
      getRequest(`/api/sysManage/selectDiseasesTableInfo`).then((res) => {
        if (res.code == 200) {
          this.tableOptions = res.data;
        } else {
          console.log("res", res.data);
        }
      });
    },
    triggerRequest() {
      console.log(this.selectTableName, "selectTableName");
      if (this.selectTableName !== "" && this.selectTypeValue !== null) {
        this.getIndicatorsFromBackEnd(
          this.selectedLabel,
          this.selectedTableNameConverted
        );
        // 这里可以放置你的 HTTP 请求逻辑
        // 例如: axios.post('/api/endpoint', { selector1: this.selector1, selector2: this.selector2 })
      }
    },
    chart1() {
      var chartDom = document.getElementById("increase");
      this.mychart = this.$echarts.init(chartDom);

      var option;
      option = {
        xAxis: {
          type: "category",
          data: this.xdata,
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis",
        },
        series: [
          {
            data: this.ydata,
            type: "line",
            showBackground: true,
            color: " #75AAF2",
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      };

      option && this.mychart.setOption(option);
    },
    getIndicatorsFromBackEnd(types, tableName) {
      getIndicators("/api/getIndicators", types, tableName)
        .then((response) => {
          if (response.data) {
            this.labelData = response.data.map((item) => item.label);
            this.missingData = response.data.map((item) => item.missRate);
              this.showWarning = false;
          } else {
            this.showWarning = true;
          }
        })
        .catch((error) => {});
    },
    getAllData() {
      getRequest("/index/getAllData").then((response) => {
        if (response) {
          storage.set("allTableData", JSON.stringify(response.data));
          this.$store.commit("setAllTableData", storage.get("allTableData"));
        } else {
          console.log(response.status);
        }
        var tempList = JSON.parse(this.$store.getters.getAllTableData);
        for (let i = 0; i < tempList.length; i++) {
          const obj = {
            tableName: tempList[i].tableName,
            tableOrigin: tempList[i].tableOrigin,
            tableSize: tempList[i].tableSize,
            tableDate: tempList[i].startTime,
          };
          this.tableData2.push(obj);
        }
      });
    },
    getStatis() {
      getRequest("/index/getStatisticaldData").then((response) => {
        this.dataAllNum = response.data["数据总量"];
        this.insAllNum = response.data["指标总量"];
        let tempMiss = response.data["总体缺失率"];
        this.missingAll = parseFloat(parseFloat(tempMiss * 100).toFixed(2));
        let tempAll = response.data["总体有效率"];
        this.effectiveall = parseFloat(parseFloat(tempAll * 100).toFixed(2));
      });
    },
    getIncrease() {
      getRequest("/Task/staticTaskTrend").then((response) => {
        this.xdata = Object.keys(response.data).sort();
        for (let i in this.xdata) {
          this.ydata.push(response.data[this.xdata[i]]);
        }
        this.chart1();
      });
    },
    text(percentage) {
      return `${this.dataAllNum}`;
    },
    text2(percentage) {
      return `${this.insAllNum}`;
    },
    getStaticDisease() {
      getRequest("/api/getStaticDisease").then((response) => {
        for (let item of response.data) {
          this.patientNum += item.num;
        }
        this.diseaseData = response.data;
      });
    },

    drawIndicators() {
      var chartDom = document.getElementById("indicators");
      this.mychart2 = this.$echarts.init(chartDom);
      let option2 = {
        title: {
          text:
            this.selectedTableNameConverted +
            "表的" +
            this.selectedLabel +
            "字段",
          left: "center",
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          bottom: 90,
        },
        dataZoom: [
          {
            type: "inside",
          },
          {
            type: "slider",
          },
        ],
        xAxis: {
          data: this.labelData,
          silent: false,
          splitLine: {
            show: false,
          },
          splitArea: {
            show: false,
          },
        },
        yAxis: {
          splitArea: {
            show: false,
          },
        },
        series: [
          {
            type: "bar",
            data: this.missingData,
            // Set `large` for large data amount
            large: true,
          },
        ],
      };
      option2 && this.mychart2.setOption(option2);
    },
  },
  mounted() {
    this.getStatis();
    this.init();
    this.getAllData();
    this.getIncrease();
    this.getStaticDisease();
    this.getIndicatorsFromBackEnd("其他", "冠心病纳排");
  },
  watch: {
    selectTableName(oldVal, newVal) {
      this.triggerRequest();
    },
    selectTypeValue(oldVal, newVal) {
      this.triggerRequest();
    },
    missingData(oldVal, newVal) {
      this.drawIndicators();
    },
  },
};
</script>

<style scoped>
.topBigDiv {
  box-sizing: border-box;
  height: 30vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topBigDiv .left {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}
.topBigDiv .right {
  box-sizing: border-box;
  width: 49%;
  height: 100%;
}
.topBigDiv .left .quickEntryBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 20px;
}
.topBigDiv .left .quickEntryBox .singleBox {
  /*border: 1px red solid;*/
  /*box-sizing: border-box;*/
  width: 90px;
  height: 90px;
  border-radius: 20%;
  text-align: center;
}
.topBigDiv .left .quickEntryBox .imgStyle {
  width: 90%;
  height: 90%;
}
.bottomBigDiv {
  box-sizing: border-box;
  height: 55vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.bottomBigDiv .left {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}
.bottomBigDiv .mid {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}
.bottomBigDiv .right {
  box-sizing: border-box;
  height: 100%;
  width: 33%;
}
.clearfix {
  font-size: 1em;
  font: bold;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.lineStyle {
  color: rgb(100, 172, 231);
  font-weight: 40;
}
.card {
  padding: 0;
  height: 100%;
}
.like {
  cursor: pointer;
  font-size: 20px;
  display: inline-block;
}
#data_sta {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.selectOptions {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 5px;
}
.selector {
  height: 30px;
}
</style>
