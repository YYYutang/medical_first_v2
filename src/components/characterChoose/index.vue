<template>
  <div class="contain">
    <div class="step">
      <el-steps :active="active" align-center>
        <el-step title="任务信息"></el-step>
        <el-step title="选择数据"></el-step>
        <el-step title="特征选择"></el-step>
        <el-step title="方法选择" v-if="type == 4"></el-step>
        <el-step title="结果展示"></el-step>
      </el-steps>
    </div>
    <div class="mainCharacter">
      <div class="left_sidebar">
        <div class="tip_boarder">
          <span>请选择下面的特征类型</span>
        </div>
        <el-tree
          ref="tree"
          show-checkbox
          :check-strictly="true"
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
          @check="handleCheck"
        >
        </el-tree>
      </div>
      <div
        class="right"
        v-loading="add_character_loading"
        element-loading-text="数据量较大，拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.05)"
      >
        <div class="info">
          <el-alert
            title="特征下方进度条为特征完备度"
            type="info"
            center
            show-icon
          >
          </el-alert>
        </div>
        <br /><br v-if="curentAnalyzeStep == 0" />
        <h2 style="text-align: center" v-if="step == 1">
          选择需要缺失值补齐的特征
        </h2>
        <h2
          style="text-align: center; margin-top: -15px"
          v-if="step == 2"
          class="top"
        >
          选择一个需要描述性分析的特征
        </h2>
        <h2
          style="text-align: center; margin-top: -15px"
          v-if="step == 3"
          class="top"
        >
          选择任意个需要表征的特征
        </h2>
        <div class="selectClass" v-if="curentAnalyzeStep == 0">
          <!-- <h4>连续数字类型特征</h4> -->
          <p><strong>连续数字类型特征</strong></p>
          <div class="contain1">
            <div
              class="block"
              v-for="feat in featureData"
              :key="feat.id"
              v-if="feat.featureDataType == 1 && feat.missRate != 100"
            >
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChange(feat)"
                class="checkbox-font-size"
                ><span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                >
                <el-tooltip
                  effect="dark"
                  content="完备率过低不建议补齐"
                  placement="bottom"
                  v-if="feat.missRate > 60"
                >
                  <i
                    class="el-icon-warning-outline"
                    v-if="feat.missRate > 60"
                  ></i> </el-tooltip
              ></el-checkbox>
              <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (countVisibleFeatures(1) % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
          <!-- <h4>离散数字类型特征</h4> -->
          <p><strong>离散数字类型特征</strong></p>
          <div class="contain2">
            <div
              class="block"
              v-for="feat in featureData"
              :key="feat.id"
              v-if="feat.featureDataType == 2 && feat.missRate != 100"
            >
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChange(feat)"
                class="checkbox-font-size"
                ><span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                >
                <el-tooltip
                  effect="dark"
                  content="完备率过低不建议补齐"
                  placement="bottom"
                  v-if="feat.missRate > 60"
                  ><i
                    class="el-icon-warning-outline"
                    v-if="feat.missRate > 60"
                  ></i> </el-tooltip
              ></el-checkbox>
              <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (countVisibleFeatures(2) % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
        </div>
        <!--描述性分析的 特征选择-->
        <div class="selectClass" v-if="curentAnalyzeStep == 1">
          <!-- <h4>文本离散类型特征</h4> -->
          <p><strong>文本离散类型特征</strong></p>
          <div class="contain3">
            <div
              class="block"
              v-for="feat in featureData"
              :key="feat.id"
              v-if="feat.featureDataType == 3 && feat.missRate != 100"
            >
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChange(feat)"
                class="checkbox-font-size"
              >
                <span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                ></el-checkbox
              >
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :stroke-width="8"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (countVisibleFeatures(3) % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
          <!-- <h4>连续数字类型特征</h4> -->
          <p><strong>连续数字类型特征</strong></p>
          <div class="contain1">
            <div
              class="block"
              v-for="feat in featureData"
              :key="feat.id"
              v-if="feat.featureDataType == 1 && feat.missRate != 100"
            >
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChange(feat)"
                class="checkbox-font-size"
                ><span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                ></el-checkbox
              >
              <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (countVisibleFeatures(1) % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
          <!-- <h4>离散数字类型特征</h4> -->
          <p><strong>离散数字类型特征</strong></p>
          <div class="contain2">
            <div
              class="block"
              v-for="feat in featureData"
              :key="feat.id"
              v-if="feat.featureDataType == 2 && feat.missRate != 100"
            >
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChange(feat)"
                class="checkbox-font-size"
                ><span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                ></el-checkbox
              >
              <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (countVisibleFeatures(2) % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
        </div>
        <!--单因素分析的特征选择-->
        <div class="selectClassSingle" v-if="curentAnalyzeStep == 2">
          <!-- <h4 style="text-align: center; font-size: 24px">选择一个作为分组依据特征</h4> -->
          <p style="text-align: center">
            <strong>选择一个作为分组依据特征</strong>
          </p>
          <div class="contain4">
            <div
              class="block"
              v-for="(feat, index) in featureData"
              :key="index"
              v-if="
                feat != observeFeaure &&
                feat.discrete &&
                feat.missRate < 50 &&
                feat.rangeSize == 2
              "
            >
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChangeGroup(feat)"
                class="checkbox-font-size"
                ><span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                ></el-checkbox
              >
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (getGroupFeatLength() % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
          <p style="text-align: center">
            <strong>选择一个需要分析的特征</strong>
          </p>
          <div class="contain5">
            <div
              class="block"
              v-for="(feat, index) in featureData"
              :key="index"
              v-if="
                feat != groupFeature &&
                feat.missRate < 50 &&
                !feat.discrete &&
                feat.featureDataType != 3
              "
            >
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChangeObserve(feat)"
                class="checkbox-font-size"
                ><span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                ></el-checkbox
              >
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (getObserveFeatLength() % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
        </div>

        <div class="consistencyAnalyze" v-if="curentAnalyzeStep == 3">
          <!-- <h3 style="text-align: center; font-size: 24px">选择一个作为分组依据特征</h3> -->
          <p style="text-align: center">
            <strong>选择一个作为分组依据特征</strong>
          </p>
          <div class="contain6">
            <div
              class="block"
              v-for="(feat, index) in featureData"
              :key="index"
              v-if="feat.featureDataType != 3 && feat.missRate < 30"
            >
              <!--只显示数据类型为数值的字段-->
              <el-checkbox
                v-model="feat.cheack"
                @change="handleCheckboxChangeConsis(feat)"
                class="checkbox-font-size"
                ><span
                  style="font-family: 宋体, SimSun, serif; font-size: 14px"
                  >{{ feat.label }}</span
                ></el-checkbox
              >
              <el-progress
                :percentage="Math.round(100 - feat.missRate)"
                :format="format"
                :color="getProgressStatus(feat.missRate)"
                style="width: 100px"
              ></el-progress>
            </div>
            <div
              class="block invisible"
              v-for="n in (6 - (getConsistencyAnalyzeLength() % 6)) % 6"
              :key="n.id"
            ></div>
          </div>
        </div>
        <div class="consistencyAnalyze" v-if="curentAnalyzeStep == 4">
          <!-- <h3 style="text-align: center; font-size: 24px">选择一个作为分组依据特征</h3> -->
          <p style="text-align: center">
            <strong>选择多个特征进行表征</strong>
          </p>
          <div class="selectClass" v-if="curentAnalyzeStep == 4">
            <!-- <h4>连续数字类型特征</h4> -->
            <p><strong>连续数字类型特征</strong></p>
            <div class="contain1">
              <div
                class="block"
                v-for="feat in featureData"
                :key="feat.id"
                v-if="feat.featureDataType == 1 && feat.missRate != 100"
              >
                <el-checkbox
                  v-model="feat.cheack"
                  @change="handleCheckboxChangeRE(feat)"
                  class="checkbox-font-size"
                  ><span
                    style="font-family: 宋体, SimSun, serif; font-size: 14px"
                    >{{ feat.label }}</span
                  ></el-checkbox
                >
                <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
                <el-progress
                  :percentage="Math.round(100 - feat.missRate)"
                  :format="format"
                  :color="getProgressStatus(feat.missRate)"
                  style="width: 100px"
                ></el-progress>
              </div>
              <div
                class="block invisible"
                v-for="n in (6 - (countVisibleFeatures(1) % 6)) % 6"
                :key="n.id"
              ></div>
            </div>
            <!-- <h4>离散数字类型特征</h4> -->
            <p><strong>离散数字类型特征</strong></p>
            <div class="contain2">
              <div
                class="block"
                v-for="feat in featureData"
                :key="feat.id"
                v-if="feat.featureDataType == 2 && feat.missRate != 100"
              >
                <el-checkbox
                  v-model="feat.cheack"
                  @change="handleCheckboxChangeRE(feat)"
                  class="checkbox-font-size"
                  ><span
                    style="font-family: 宋体, SimSun, serif; font-size: 14px"
                    >{{ feat.label }}</span
                  ></el-checkbox
                >
                <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
                <el-progress
                  :percentage="Math.round(100 - feat.missRate)"
                  :format="format"
                  :color="getProgressStatus(feat.missRate)"
                  style="width: 100px"
                ></el-progress>
              </div>
              <div
                class="block invisible"
                v-for="n in (6 - (countVisibleFeatures(2) % 6)) % 6"
                :key="n.id"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getRequest, postRequest, getIndicators } from "@/api/user";
import { treeData } from "../tab/treeData";
/*特征选择页面*/
export default {
  name: "characterChoose",
  props: [
    "active",
    "type",
    "label",
    "step",
    "analyzeStep",
    "describeAna",
    "selectTreeNode",
    "featureDataFromParent",
    "observeFeatFromParent",
    "groupFeatFromParent",
    "curentAnalyzeStep",
  ],
  data() {
    return {
      defaultCheckedKeys: [],
      isDescribe: false,
      nodedata: {},
      selectedNode: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      options: [
        {
          value: "选项1",
          label: "全部特征",
        },
        {
          value: "选项2",
          label: "疾病标准特征",
          disabled: false,
        },
        {
          value: "选项3",
          label: "非疾病标准特征",
        },
      ],

      groupFeature: {},
      add_character_loading: false,
      observeFeaure: {},
      allFeatures: [],
      // curentAnalyzeStep: 1,
      checkedFeats: [],
      tableName: "",
      peopleFeatures: [],
      physiologicalFeatures: [],
      socialFeatures: [],
      checkAll_1: false,
      checkAll_2: false,
      checkAll_target: false,
      computeFeatures: [],
      knownFeatures: [],
      targetFeature: [],
      //用于存储左侧特征选择树值
      featureSelectTree: [],
      //特征选择数的备份，用于删除叶子节点
      filteredTree: [],
      featureData: [],
      //用于存储右侧特征条件选项
      feature_select_options: [
        { value: 0, label: "全部特征" },
        { value: 1, label: "疾病标准特征" },
        { value: 2, label: "非疾病标准特征" },
      ],
      //用于存储所有特征
      all_features: [],
      //用于存储已选的因变量（已选标签特征）
      checked_dependent_variables: [],
      //用于存储已选的因变量（已选危险因素）
      checked_independent_variables: [],
      //分页数据
      pageSize: 10,
      currentPage: 1,
      dataTotal: 10,
      value: "",
      templist: [],
    };
  },
  created() {
    this.isDescribe = this.describeAna == true ? true : false;
    this.groupFeature = {};
    this.observeFeaure = {};
    this.tableName = this.label;
    this.getIndicatorCategory();

    // 缺失值补齐和描述性分析选择记忆功能
    this.defaultCheckedKeys = [];
    this.defaultCheckedKeys = this.selectTreeNode;
    if (this.featureDataFromParent.length > 0) {
      this.checkedFeats = [];
      for (let i = 0; i < this.featureDataFromParent.length; i++) {
        if (this.featureDataFromParent[i].cheack)
          this.checkedFeats.push(this.featureDataFromParent[i]);
      }
      this.featureData = this.featureDataFromParent;
    }
    // 单因素分析选择记忆功能
    if (this.observeFeatFromParent != null) {
      console.log("分组依据2：", this.observeFeatFromParent);
      this.observeFeaure = this.observeFeatFromParent;
    }
    if (this.groupFeatFromParent != null)
      this.groupFeature = this.groupFeatFromParent;
  },
  methods: {
    open3(msg) {
      this.$message({
        message: msg,
        type: "warning",
      });
    },
    getConsistencyAnalyzeLength() {
      var len = this.featureData.length;
      for (let i = 0; i < this.featureData.length; i++) {
        if (
          this.featureData[i].featureDataType == 3 ||
          this.featureData[i].missRate >= 30
        )
          len -= 1;
      }
      console.log("len:", len);
      return len;
    },
    getProgressStatus(missingRate) {
      if (missingRate < 30) {
        return "#25bef5";
      } else if (missingRate < 70) {
        return "#e6a23c";
      } else {
        return "#ff0000";
      }
    },
    format(percentage) {
      return percentage === 100 ? "满" : `${percentage}%`;
    },

    getProgressColor(percentage) {
      if (percentage == 0 || percentage < 20) {
        return "#00cc66"; // 绿色
      } else if (percentage >= 20 && percentage < 50) {
        return "#3399ff"; // 蓝色
      } else if (percentage >= 50 && percentage < 80) {
        return "#ff6666"; // 红色
      } else {
        return "#cc0000"; // 深红色
      }
    },
    getGroupFeatLength() {
      let count = 0;
      for (let i = 0; i < this.featureData.length; i++) {
        if (
          this.featureData[i].discrete &&
          this.featureData[i].missRate < 50 &&
          this.featureData[i].rangeSize == 2
        )
          count += 1;
      }
      return count;
      // if(this.observeFeaure!={}) {
      //   return count-1;
      // }else {
      //   return count;
      //   }
    },
    getObserveFeatLength() {
      var len = this.featureData.length;
      for (let i = 0; i < this.featureData.length; i++) {
        if (
          this.featureData[i].missRate >= 50 ||
          this.featureData[i].discrete ||
          this.featureData[i].featureDataType == 3
        )
          len -= 1;
      }
      // if(this.groupFeature!={}) len=-1;
      return len;
    },
    handleCheckboxChangeGroup(feat) {
      this.$emit("sendFeatueData", this.featureData);
      if (feat.cheack) {
        // 其他都设置为非选中状态
        this.groupFeature = feat;
        // 发送给父组件
        this.$emit("send_group_feature", feat);
        for (let i = 0; i < this.featureData.length; i++) {
          if (
            this.featureData[i] != feat &&
            this.featureData[i] != this.observeFeaure
          )
            this.featureData[i].cheack = false;
        }
      } else {
        this.groupFeature = {};
        this.$emit("send_group_feature", this.groupFeature);
      }
    },
    handleCheckboxChangeObserve(feat) {
      this.$emit("sendFeatueData", this.featureData);
      if (feat.cheack) {
        // 发送给父组件
        this.observeFeaure = feat;
        this.$emit("send_observe_feature", feat);
        for (var i = 0; i < this.featureData.length; i++) {
          if (
            this.featureData[i] != this.groupFeature &&
            this.featureData[i] != feat
          )
            this.featureData[i].cheack = false;
        }
      } else {
        this.observeFeaure = {};
        this.$emit("send_observe_feature", this.observeFeaure);
      }
    },
    handleCheckboxChangeConsis(feat) {
      this.$emit("sendFeatueData", this.featureData);
      // 选中了其他就取消选中
      this.checkedFeats = [];
      if (feat.cheack) {
        this.checkedFeats.length = 0;
        this.checkedFeats.push(feat);
        for (let i = 0; i < this.featureData.length; i++) {
          if (this.featureData[i].cheack == true && this.featureData[i] != feat)
            this.featureData[i].cheack = false;
        }
      } else {
        this.checkedFeats.length = 0;
        // for(let i=0; i<this.featureData.length; i++) {
        //   this.featureData[i].cheack=false;
        // }
      }
      // 传递给父组件
      this.$emit("send_feat", this.checkedFeats);
    },
    countVisibleFeatures(val) {
      let len = this.featureData.filter(
        (feat) => feat.featureDataType == val && feat.missRate != 100
      ).length;

      return len;
    },
    handleCheckboxChange(feat) {
      // 发送给父组件
      this.$emit("sendFeatueData", this.featureData);
      if (this.isDescribe == false) {
        //  缺失值补齐
        if (this.checkedFeats.includes(feat)) {
          if (!feat.cheack) {
            // 非选中状态

            this.checkedFeats = this.checkedFeats.filter(
              (item) => item !== feat
            );
          }
        } else {
          // 不包含
          if (feat.cheack) {
            // 选中状态
            if (feat.missRate == 0 || feat.missRate == 100) {
              this.open3("该特征不可插补！");
              feat.cheack = false;
            } else {
              this.checkedFeats.push(feat);
            }
          }
        }
      } else {
        // 描述性分析  描述性分析只能选择一个复选框
        if (feat.cheack) {
          console.log("选中");
          this.checkedFeats = [feat];
          for (let i = 0; i < this.featureData.length; i++) {
            if (
              this.featureData[i] != feat &&
              this.featureData[i].cheack == true
            ) {
              this.featureData[i].cheack = false;
            }
          }
        } else {
          console.log("取消");
          this.checkedFeats = [];
          // for(let i=0; i<this.featureData.length; i++) {
          //   this.featureData[i].cheack=false;
          // }
        }
      }
      // 传递给父组件
      this.$emit("send_feat", this.checkedFeats);
    },
    handleCheckboxChangeRE(feat) {
      // 发送给父组件
      this.$emit("sendFeatueData", this.featureData);
      if (this.isDescribe == false) {
        //  缺失值补齐
        if (this.checkedFeats.includes(feat)) {
          if (!feat.cheack) {
            // 非选中状态

            this.checkedFeats = this.checkedFeats.filter(
              (item) => item !== feat
            );
          }
        } else {
          // 不包含
          if (feat.cheack) {
            // 选中状态

            this.checkedFeats.push(feat);
          }
        }
      }
      // 传递给父组件
      this.$emit("send_feat", this.checkedFeats);
    },
    getIndicatorsFromBackEnd(types) {
      if (types === "") {
        this.featureData = [];
      } else {
        this.add_character_loading = true;

        getIndicators("/api/getIndicators", types, this.tableName)
          .then((response) => {
            if (response.data) {
              this.featureData = response.data;
              console.log("特征信息位：", this.featureData);
              // 给父组件传递参数
              this.$emit("send_indicators", this.featureData);
            }
            this.add_character_loading = false;
          })
          .catch((error) => {
            this.add_character_loading = false;
          });
      }
    },
    handleCheck(data, node) {
      this.selectedNode.length = 0;
      this.defaultCheckedKeys = [];
      for (let i = 0; i < node.checkedNodes.length; i++) {
        this.selectedNode.push(node.checkedNodes[i].label);
        this.defaultCheckedKeys.push(node.checkedNodes[i].id);
      }
      console.log("selectedNodehandle", this.selectedNode);
      // 将选中的树节点传递给父节点
      this.$emit("sendTreeNode", this.defaultCheckedKeys);
      this.getIndicatorsFromBackEnd(this.selectedNode.join(","));
    },
    getIndicatorCategory() {
      getRequest("/api/indicatorCategory").then((response) => {
        this.treeData = response.data;
      });
    },
  },
  mounted() {
    console.log("selectedNode", this.selectedNode);
    //  this.getIndicatorsFromBackEnd(this.selectedNode.join(","));
  },
};
</script>
<style lang="less">
// .title{
//   margin-left: 0px;
//   margin-bottom: 0px;
//   font-size: 15px; /* 修改字体大小 */
// }
.mainCharacter {
  display: flex;
  width: 100%;
  border-top: 1px solid black;
  margin-top: 20px;
}
.top {
  font-size: 20px;
  margin-top: 0px;
}
.contain {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
}
.contain1 {
  display: flex;
  width: 100%;
  flex-direction: row; /* 按列排版 */
  // height: calc(29% - 20px);/* 每个容器宽度为父容器的1/3，减去间距 */
  height: auto;
  padding: 10px;
  flex-wrap: wrap; /* 每行换行 */
  border-radius: 3px;
  border-left: 2px solid #e6e6e6;
  border-right: 2px solid #e6e6e6;
  border-top: 2px solid #e6e6e6;
  border-bottom: 2px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  overflow-y: auto;
}
.contain2 {
  display: flex;
  width: 100%;
  flex-direction: row; /* 按列排版 */
  // height: calc(29% - 20px); /* 每个容器宽度为父容器的1/3，减去间距 */
  height: auto;
  padding: 10px;
  flex-wrap: wrap; /* 每行换行 */
  border-radius: 3px;
  border-left: 2px solid #e6e6e6;
  border-right: 2px solid #e6e6e6;
  border-top: 2px solid #e6e6e6;
  border-bottom: 2px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  overflow-y: auto;
}
.contain3 {
  display: flex;
  width: 100%;
  flex-direction: row; /* 按列排版 */
  // height: calc(39% - 20px);; /* 每个容器宽度为父容器的1/3，减去间距 */
  height: auto;
  padding: 10px;
  overflow-y: auto;
  flex-wrap: wrap; /* 每行换行 */
  border-radius: 3px;
  border-left: 2px solid #e6e6e6;
  border-right: 2px solid #e6e6e6;
  border-top: 2px solid #e6e6e6;
  border-bottom: 2px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  overflow-y: auto;
}

.contain4 {
  display: flex;
  width: 100%;
  flex-direction: row; /* 按列排版 */
  // height: calc(35% - 20px);; /* 每个容器宽度为父容器的1/3，减去间距 */
  height: auto;
  overflow-y: auto;
  flex-wrap: wrap; /* 每行换行 */
  padding: 20px;
  border-radius: 3px;
  border-left: 2px solid #e6e6e6;
  border-right: 2px solid #e6e6e6;
  border-top: 2px solid #e6e6e6;
  border-bottom: 2px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
.contain5 {
  display: flex;
  width: 100%;
  flex-direction: row; /* 按列排版 */
  // height: calc(35% - 20px);; /* 每个容器宽度为父容器的1/3，减去间距 */
  height: auto;
  // margin-top: 15px;
  margin-bottom: 5px;
  overflow-y: auto;
  flex-wrap: wrap; /* 每行换行 */
  border-radius: 3px;
  border-left: 2px solid #e6e6e6;
  border-right: 2px solid #e6e6e6;
  border-top: 2px solid #e6e6e6;
  border-bottom: 2px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 20px;
}

.contain6 {
  display: flex;
  width: 90%;
  flex-direction: row;
  margin-top: 30px;
  margin-bottom: 5px;
  // height: 70%;
  height: auto;
  overflow-y: auto;
  flex-wrap: wrap;
  border: 2px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 20px;
  overflow-y: auto;
}
.contain7 {
  display: flex;
  width: 90%;
  flex-direction: row;
  margin-top: 30px;
  margin-bottom: 5px;
  // height: 70%;
  height: auto;
  overflow-y: auto;
  flex-wrap: wrap;
  border: 2px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  padding: 20px;
  overflow-y: auto;
}
.step {
  width: 100%;
  text-align: center;
}
.left_sidebar {
  height: 85vh;
  width: 15%;
  padding: 5x;
  margin-top: 20px;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
.right {
  width: 85%;
  display: flex;
  flex-direction: column;
  // box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  height: 100%;
}

.info {
  margin: 0; /* 移除默认的外边距 */
  height: 30px;
  margin-left: 100px;
  margin-right: 100px;
  display: flex;
  // background-color: #cbc8c8;
}

.selectClass {
  margin-top: 0px;
  margin-left: 20px;
  width: 1300px;
}
.selectClassSingle {
  margin-top: 10px;
  margin-left: 20px;
  width: 1300px;
  height: 800px;
}
.consistencyAnalyze {
  margin-top: 10px;
  margin-left: 40px;
  width: 1300px;
  height: 800px;
}
.block {
  flex: 16.66%; /* 每个块占据1/6的行宽 */
  height: 50px;
  align-items: center;
}
.block2 {
  flex: 16.66%; /* 每个块占据1/6的行宽 */
  height: 70px;
  align-items: center;
}
.checkbox-font-size .el-checkbox__label {
  font-family: "宋体", SimSun; /* 设置字体为宋体 */
  font-size: 20px; /* 设置您希望的字体大小 */
  font-weight: bold; /* 加粗字体 */
}

.table {
  // display: flex;
  margin-top: 50px;
  width: 1400px;
}

.feature {
  display: block;
  height: auto;
  width: 1400px;
  margin-left: 20px;
}
.checkbox-font-size .el-checkbox__inner {
  border-color: #0066cc; /* 设置边框颜色 */
  border-width: 2px; /* 增加边框宽度 */
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

.progress-green {
  background-color: #00cc66; /* 绿色 */
}

.progress-blue {
  background-color: #3399ff; /* 蓝色 */
}

.progress-red {
  background-color: #ff6666; /* 红色 */
}

.progress-dark-red {
  background-color: #cc0000; /* 深红色 */
}
.add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>