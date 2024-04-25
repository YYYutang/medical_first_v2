<template>
  <div class="main">
    <!-- <div class="left_tree">
      <div class="tip_boarder">
        <span>点击病种筛选任务</span>
      </div>
      <el-tree
        ref="tree"
        :data="treeData"
        :show-checkbox="false"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="changeData"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span
            v-if="data.catLevel == 1"
            style="font-weight: bold; font-size: 15px; color: #252525"
            >{{ node.label }}</span
          >
          <span v-else>{{ node.label }}</span>
        </span>
      </el-tree>
      <el-dialog title="提示" :visible.sync="dialogDiseaseVisible" width="30%">
        <span>
          请输入新病种名称：<el-input
            placeholder="请输入内容"
            v-model="diseaseName"
            class="nameInput"
          ></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="() => append()">确 定</el-button>
        </span>
      </el-dialog>
    </div> -->
    <div class="tree">
      <div class="left_tree">
        <div class="tipInfo">
          <h3>任务所用数据集</h3>
          <span class="statistic"> 一级病种: {{ diseaseNum }} 个 </span>
          <span class="statistic"> 数据表: {{ datasetNum }} 个 </span>
        </div>
        <hr class="hr-dashed" />
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <div class="treeArea">
          <el-tree
            ref="tree"
            :data="treeData"
            :show-checkbox="false"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :highlight-current="true"
            @node-click="changeData"
            :filter-node-method="filterNode"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="left_span">
                <i
                  class="el-icon-document tree_icon"
                  v-if="data.isLeafs == 1 && data.uid != loginUserID"
                ></i>
                <i
                  class="el-icon-document tree_icon"
                  v-if="data.isLeafs == 1 && data.uid == loginUserID"
                  style="color: rgb(40, 207, 18)"
                ></i>
                <span
                  v-if="data.catLevel == 2"
                  style="font-weight: bold; font-size: 15px; color: #252525"
                  >{{ node.label }}</span
                >
                <span
                  v-else
                  :class="{
                    nodeLabel: node.label.length <= 15,
                    'scrolling-nodeLabel': node.label.length > 15,
                  }"
                  >{{ node.label }}
                  <span v-if="data.isLeafs == 1 && data.uid == loginUserID">
                    （我）</span
                  >
                </span>
              </span>
            </span>
          </el-tree>
       <!-- <el-tree
        ref="tree"
        :data="treeData"
        :show-checkbox="false"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="changeData"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span
            v-if="data.catLevel == 1"
            style="font-weight: bold; font-size: 15px; color: #252525"
            >{{ node.label }}</span
          >
          <span v-else>{{ node.label }}</span>
        </span>
      </el-tree> -->
        </div>
      </div>
    </div>

    <div class="right">
      <!--==========================     头部按钮     ==============================================================-->
      <div id="top_buttons">
        <div id="task_leader">
          <span>任务负责人：</span>
          <el-select
            v-model="leader"
            placeholder="请选择"
            @change="handleSelectChange"
          >
            <el-option
              v-for="item in leaderList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <div id="task_leader">
          <span>任务类型：</span>
          <el-select
            v-model="tasktype"
            placeholder="请选择"
            @change="handleSelectChange"
          >
            <el-option
              v-for="item in typeList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <el-button @click="clearFilter" style="margin-right: 20px"
          >清除</el-button
        >
        <!-- <el-button size="medium" type="primary" @click="creatTask()"
          >新建任务</el-button
        > -->
        <el-dropdown @command="handleCommand">
          <el-button type="primary">
            新建任务<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in taskItem"
              :key="item.id"
              :command="item"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <!--===============================    卡片组     ==============================================================-->
      <div
        class="cardGroup"
        v-loading="cardLoading"
        element-loading-text="任务数量较大，正在努力加载中..."
      >
        <el-card
          class="taskCard"
          v-for="item in taskList"
          :key="item.id"
          shadow="always"
        >
          <div class="cardInfo">
            <div><span class="ttl">任务名称：</span>{{ item.taskname }}</div>
            <div><span class="ttl">负责人：</span>{{ item.leader }}</div>
            <div><span class="ttl">所属疾病：</span>{{ item.disease }}</div>
            <div><span class="ttl">使用模型：</span>{{ item.model }}</div>
            <div><span class="ttl">数据表：</span>{{ item.dataset }}</div>
            <div><span class="ttl">任务类型：</span>{{ item.tasktype }}</div>
            <div><span class="ttl">创建时间：</span>{{ item.createtime }}</div>
          </div>
          <div class="editButton">
            <el-button
              size="mini"
              type="primary"
              @click="handleCheck(item)"
              style="margin-right: 20px"
              >查看</el-button
            >
            <el-popconfirm
              title="删除后无法恢复"
              icon="el-icon-warning"
              icon-color="red"
              @confirm="handleDelete(item)"
            >
              <el-button slot="reference" size="mini" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </div>
        </el-card>
      </div>
      <!-- <div class="cardGroupCloak" v-if="noTaskData">
        <span>暂无数据</span>
      </div> -->
      <el-empty
        :image-size="200"
        description="暂无相关任务"
        v-if="noTaskData"
      ></el-empty>
      <div class="block" style="text-align: center; margin-top: 20px">
        <!---一页9条数据-->
        <el-pagination
          layout="prev, pager, next"
          :total="taskTotal"
          :page-size="pageSize"
          :current-page.sync="currentPage"
          @current-change="filterTask"
        >
        </el-pagination>
      </div>
      <el-dialog
        :title="result.taskName"
        :visible.sync="resultDialogShow"
        v-if="resultDialogShow"
        width="32%"
        center
      >
        <div class="taskInfoBox principal">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">任务负责人：</span>
          <span>{{ result.leader }}</span>
        </div>
        <div
          class="taskInfoBox participants"
          v-if="result.participant !== null"
        >
          <span class="lineStyle">▍</span
          ><span class="featureTitle">参与人：</span>
          <span>{{ result.participant }}</span>
        </div>
        <div class="taskInfoBox disease">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">研究病种：</span>
          <span>{{ result.disease }}</span>
        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用数据：</span>
          <span>{{ result.dataset }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用算法：</span>
          <span>{{ result.model }}</span>
        </div>
        <div class="taskInfoBox algorithmValue">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">算法参数：</span>
          <span v-if="result.parameters != null && result.parametersv != null"
            >本算法没有参数</span
          >
          <div>
            <div v-for="(item, index) in result.parameters" :key="index">
              <span
                >{{ result.parameters[index] }}:{{
                  result.parametersv[index]
                }}</span
              >
            </div>
          </div>
        </div>
        <div class="taskInfoBox use_features">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用特征：</span>
          <span>{{ result.feature }}</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="resultDialogShow = false">关 闭</el-button>
          <el-button @click="getTaskDetail()">详细信息</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRequest } from "@/utils/api";
import { filterTask, getTaskNumber } from "@/api/user";
import { getCategory } from "@/api/category";
import { state } from "@antv/g2plot/lib/adaptor/common";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";

export default {
  computed: {
    // ...mapState(["taskList","treeData"]),
    // ...mapGetters(["taskLeaderList", "taskDiseaseList"]),
    loginUserID() {
      return sessionStorage.getItem("userid");
    },
  },
  created() {
    this.getTaskAllList();
    this.getCatgory();
    this.filterTask(1);
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 9,
      taskTotal: 100,
      curTaskInfo: {},
      look: false,
      disease: null,
      leader: null,
      tasktype: null,
      resultDialogShow: false,
      result: {},
      taskList: [],
      treeData: [],
      treeData1: [],
      treeData2: [],
      treeData3: [],
      leaderList: [],
      typeList: [],
      dialogDiseaseVisible: false,
      diseaseName: "",
      diseaseNum: 0,
      datasetNum: 0,
      cardLoading: false,
      noTaskData: false,
      taskItem: [
        { id: 1, name: "缺失值补齐" },
        { id: 2, name: "描述性分析" },
        { id: 3, name: "单因素分析" },
        { id: 4, name: "一致性验证" },
        { id: 5, name: "疾病特征表征" },
        { id: 6, name: "病人画像" },
      ],
      filterText: "",
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree?.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleSelectChange() {
      this.filterTask();
    },
    // filterTree(data) {
    //   if (data.length < 1) return;
    //   console.log('filterTreedata',data)
    //   return data.filter((item) => {
    //     console.log('isleaf',item.isLeafs )
    //     if (item.isLeafs !== 1) {

    //       if (item.children && item.children.length > 0) {
    //         item.children = filterTree(item.children); // 递归过滤子节点
    //       }
    //       return true; // 保留当前节点
    //     }
    //     return false; // 移除当前节点
    //   });
    // },

    getCatgory() {
      getRequest("/api/disease/all").then((response) => {
        console.log(response);
        this.treeData = response.data;
        // 获取病种和数据集总数
        this.diseaseNum = response.data[0].children.length;
        getRequest("/api/getTableNumber").then((res) => {
          if (res.code == 200) this.datasetNum = res.data;
        });
      });
      // getCategory(`/api/category?uid=${this.loginUserID}`).then((response) => {
      //   // 如果是多疾病任务，只能选择公共数据集
      //     console.log('ingetCatgory',response.data.slice(0, 1))
      //   // this.treeData = this.filterTree(response.data);
      //   this.treeData1 = this.filterTree(response.data.slice(0, 1));
      //   this.treeData2 = this.filterTree(response.data.slice(1, 2));
      //   this.treeData3 = this.filterTree(response.data.slice(2, 3));
      //   console.log('treeData1',this.treeData1)
      //   // 获取病种和数据集总数
      //   this.diseaseNum =
      //     response.data[0].children.length + response.data[1].children.length;
      //   getRequest("/api/getTableNumber").then((res) => {
      //     if (res.code == 200) this.datasetNum = res.data;
      //   });
      //   if (
      //     this.treeData1.length +
      //       this.treeData2.length +
      //       this.treeData3.length <
      //     1
      //   ) {
      //     this.$message({
      //       showClose: true,
      //       type: "warning",
      //       message: "暂无可用数据",
      //     });
      //   }
      // });
    },
    handleCommand(task) {
      if (task.name === "缺失值补齐") {
        this.$router.push({ name: "completeMissing" });
      } else if (task.name === "描述性分析") {
        this.$router.push({ name: "describeAnalyze" });
      } else if (task.name === "一致性验证") {
        this.$router.push({ name: "consistencyAnalyze" });
      } else if (task.name === "单因素分析") {
        this.$router.push({ name: "singleAnalyze" });
      } else if (task.name === "疾病特征表征") {
        this.$router.push({ name: "represent" });
      } else if (task.name === "病人画像")
        this.$router.push({ name: "visualization" });
    },
    // createTask(task) {
    //   alert("sssds")

    // },
    filterTask(newPage) {
      this.cardLoading = false;
      getTaskNumber(
        "/Task/getTaskNumber",
        this.disease,
        this.tasktype,
        this.leader
      ).then((response) => {
        this.taskTotal = response.data;
      });
      filterTask(
        "/Task/filterTaskBypage",
        this.disease,
        this.tasktype,
        this.leader,
        this.currentPage,
        this.pageSize
      )
        .then((response) => {
          this.taskList = response.data;
        })
        .finally(() => {
          this.cardLoading = false;
        });
    },
    getTaskDetail() {
      // 判断任务类型然后给这些任务结果页面添加参数
      if (this.curTaskInfo.tasktype === "缺失值补齐") {
        let missCompleteMethods = []; // 缺失值补齐的参数
        let features = this.curTaskInfo.feature.split(","); // 哪些字段参与填充
        let missCompleteMehtod = this.curTaskInfo.model.split(","); // 字段填充方法
        for (let i = 0; i < features.length; i++) {
          missCompleteMethods.push({
            index: features[i],
            missCompleteMethod: missCompleteMehtod[i],
          });
        }
        let taskInfo = {
          taskName: this.curTaskInfo.taskname,
          principal: this.curTaskInfo.leader,
          participant: this.participant,
          tasktype: this.curTaskInfo.tasktype,
          tips: this.curTaskInfo.remark,
        };
        let paramData = {
          missCompleteMethods: missCompleteMethods,
          label: this.curTaskInfo.dataset,
          taskInfo: taskInfo,
        }; // 最终传递参数
        this.$router.push({ name: "missingoutcome", params: paramData });
      }

      if (this.curTaskInfo.tasktype === "单因素分析") {
        let features = this.curTaskInfo.feature.split(",");
        let taskInfo = {
          taskName: this.curTaskInfo.taskname,
          principal: this.curTaskInfo.leader,
          participant: this.participant,
          tasktype: this.curTaskInfo.tasktype,
          tips: this.curTaskInfo.remark,
        };
        let paramData = {
          features: features,
          label: this.curTaskInfo.dataset,
          taskInfo: taskInfo,
        };
        this.$router.push({ name: "singleOutcome", params: paramData });
      }

      if (this.curTaskInfo.tasktype === "描述性分析") {
        let taskInfo = {
          taskName: this.curTaskInfo.taskname,
          principal: this.curTaskInfo.leader,
          participant: this.participant,
          tasktype: this.curTaskInfo.tasktype,
          tips: this.curTaskInfo.remark,
        };
        let paramData = {
          label: this.curTaskInfo.dataset,
          feature: this.curTaskInfo.feature,
          taskInfo: taskInfo,
        };
        this.$router.push({ name: "describeOutcome", params: paramData });
      }

      if (this.curTaskInfo.tasktype === "一致性验证") {
        let taskInfo = {
          taskName: this.curTaskInfo.taskname,
          principal: this.curTaskInfo.leader,
          participant: this.participant,
          tasktype: this.curTaskInfo.tasktype,
          tips: this.curTaskInfo.remark,
        };
        let paramData = {
          label: this.curTaskInfo.dataset,
          featureName: this.curTaskInfo.feature,
          taskInfo: taskInfo,
        };
        this.$router.push({ name: "consistencyOutcome", params: paramData });
      }

      if (this.curTaskInfo.tasktype === "病人画像") {
        let taskInfo = {
          taskName: this.curTaskInfo.taskname,
          principal: this.curTaskInfo.leader,
          participant: this.participant,
          tasktype: this.curTaskInfo.tasktype,
          tips: this.curTaskInfo.remark,
        };
        let paramData = {
          label: this.curTaskInfo.dataset,
          select: this.curTaskInfo.result,
          taskInfo: taskInfo,
        };
        this.$router.push({ name: "visualization", params: paramData });
      }

      if (this.curTaskInfo.tasktype === "疾病特征表征") {
        let taskInfo = {
          taskName: this.curTaskInfo.taskname,
          principal: this.curTaskInfo.leader,
          participant: this.participant,
          tasktype: this.curTaskInfo.tasktype,
          tips: this.curTaskInfo.remark,
        };
        let paramData = {
          tableName: this.curTaskInfo.dataset,
          aiName: this.curTaskInfo.model,
          runParams: this.curTaskInfo.feature,
          taskInfo: taskInfo,
        };
        this.$router.push({ name: "represent", params: paramData });
      }
    },
    filterTask(newPage) {
      console.log("当前页为：", this.currentPage);
      getTaskNumber(
        "/Task/getTaskNumber",
        this.disease,
        this.tasktype,
        this.leader
      ).then((response) => {
        this.taskTotal = response.data;
        if (this.taskTotal === 0) {
          this.noTaskData = true;
          console.log("this.noTaskData", this.noTaskData);
        } else {
          this.noTaskData = false;
        }
      });
      filterTask(
        "/Task/filterTaskBypage",
        this.disease,
        this.tasktype,
        this.leader,
        this.currentPage,
        this.pageSize
      ).then((response) => {
        this.taskList = response.data;
      });
    },
    getTreeData() {
      getRequest("/api/disease/all").then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        } else {
          this.$message.error("获取树形结构数据失败");
        }
      });
    },

    getTaskAllList() {
      var that = this;
      getRequest("/Task/all")
        .then((res) => {
          console.log("所有任务：", that.taskList);
          for (let i = 0; i < res.data.length; i++) {
            this.typeList.push(res.data[i].tasktype);
          }
          this.typeList = [...new Set(this.typeList)];
        })
        .catch((err) => {
          console.log("任务列表获取错误，请联系管理员。");
          console.log(err);
        });
      getRequest("/Task/getLeaderList")
        .then((res) => {
          this.leaderList = res.data;
        })
        .catch((err) => {
          console.log("任务列表获取错误，请联系管理员。");
          console.log(err);
        });
    },
    handleCheck(row) {
      console.log("当前任务：", row);
      this.curTaskInfo = row;
      this.getTaskDetail();
      // getRequest(`Task/getOne/${row.id}`).then((res) => {
      //   if (res.code == 200) {
      //     this.result = res.data;
      //     console.log(JSON.stringify(this.result));
      //     if (
      //       this.result.parameters != null &&
      //       this.result.parametersv != null
      //     ) {
      //       this.result.parameters = this.result.parameters.split(",");
      //       this.result.parametersv = this.result.parametersv.split(",");
      //     }
      //     this.resultDialogShow = true;
      //   } else {
      //     this.$message.error("查看任务失败");
      //   }
      // });
    },
    handleDelete(row) {
      getRequest(`Task/delete/${row.id}`).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除任务成功");
          // this.SetTaskList(res.data);
          this.getTaskAllList();
        } else {
          this.$message.error("删除任务失败");
        }
      });
    },
    clearFilter() {
      this.disease = null;
      this.leader = null;
      this.tasktype = null;
      this.filterTask();
    },
    changeData(node) {
      console.log(node);
      this.disease = node.label;
      this.filterTask();
    },
  },
};
</script>
<style scoped>
.main {
  display: flex;
}

.left_tree {
  display: inline-block;
  height: 820px;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  overflow: auto;
  /* width: 250px; */
}
.treeArea {
  height: calc(820px - 93px); /* 93px是头部信息和按钮的高度 */
  overflow: auto;
}

.tipInfo {
  background-color: rgba(124, 124, 124, 0.1);
  height: 50px;
  text-align: center;
}

.tipInfo .statistic {
  font-size: 13px;
  color: #585858;
}

.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}
.right {
  display: flex;
  flex-direction: column;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  overflow: hidden;
}

.custom-tree-node .left_span {
  width: 15em;
  overflow: hidden;
}

.nodeLabel,
.scrolling-nodeLabel {
  display: inline-block;
  white-space: nowrap; /* 禁止文本换行 */
  box-sizing: border-box; /* 边框和内填充的宽度也包含在width内 */
}

.scrolling-nodeLabel:hover {
  position: relative;
  overflow: hidden;
  vertical-align: text-bottom;
  animation: scrollText 3s linear infinite; /* 动画持续时间和循环方式 */
}

@keyframes scrollText {
  0% {
    transform: translateX(0px);
  }
  12% {
    transform: translateX(0px);
  }
  75% {
    transform: translateX(calc(-100% + 15em));
  }
  100% {
    transform: translateX(calc(-100% + 15em));
  }
}

#top_buttons {
  margin-left: 3%;
  margin-bottom: 20px;
}

#top_buttons > * {
  display: inline-block;
}
#task_disease {
  margin-right: 40px;
}
#task_leader {
  margin-right: 20px;
}
#table {
  margin-top: 10px;
}
.lineStyle {
  color: rgb(100, 172, 231);
}
.featureTitle {
  font-weight: 800;
}

.hr-dashed {
  border: 0;
  border-top: 1px dashed #899bbb;
}
.cardGroup {
  width: 100%;
  margin-left: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-row-gap: 40px;
  grid-column-gap: 60px;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto; /* 定义四行，高度根据内容自适应 */
  gap: 10px; /* 定义网格行和列之间的间隙 */
}

/* .cardInfo > div:nth-child(5), 第五个子元素（数据表） */
.cardInfo > div:nth-child(7) /* 第7个子元素（创建时间） */ {
  grid-column: 1 / span 2; /* 这两个元素跨越两列 */
}

.ttl {
  font-weight: 600;
  color: #071135;
}

.editButton {
  margin-left: 30%;
  margin-top: 5%;
}

.icon {
  justify-self: end;
}
.taskCard {
  width: 100%;
}
.add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
.treeArea {
  height: calc(820px - 93px); /* 93px是头部信息和按钮的高度 */
  overflow: auto;
}

.tip_boarder {
  width: auto;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e6e6e6;
  color: #535353;
  font-weight: bold;
}
/* .cardGroupCloak{
  width:auto;
  height:600px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e6e6e6;
  margin-left:20px;
  font-size: 30px;
  background: rgb(236, 235, 235);
} */
</style>
