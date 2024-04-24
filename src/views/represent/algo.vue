<template>
  <div v-loading="loading" element-loading-text="拼命运算中">
    <div class="step">
      <el-steps :active="active" align-center>
        <el-step title="任务信息"></el-step>
        <el-step title="选择数据"></el-step>
        <el-step title="特征选择"></el-step>
        <el-step title="方法选择"></el-step>
        <el-step title="结果展示"></el-step>
      </el-steps>
    </div>
    <el-container>
      <el-tabs id="modelList" v-model="model" tab-position="left" @tab-click="changeSelectMethod">
        <!-- tab-pane的name值必须与vuex里的算法名字一一对应 -->
        <!-- <el-tab-pane
          label="SF-DRMB"
          :disabled="moduleName !== 'disFactor'"
          name="SF_DRMB"
        >
          <div class="titleBox">SF-DRMB</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              SF-DRMB是一种因果特征选择算法，可用于挖掘疾病和危险因素之间存在的因果关系。
            </p>
          </div>
          <div class="paramBox">
            <el-form
              :model="SF_DRMB_form"
              class=""
              label-position="top"
              ref="SF_DRMB_ref"
            >
              <el-form-item prop="K_OR">
                <template slot="label">
                  <span class="paramTitle">K_OR</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_OR参数用于控制恢复假阴性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_OR"></el-input>
                <span class="valueRange">(取值范围为 0 - 1 )</span>
              </el-form-item>

              <el-form-item prop="K_and_PC">
                <template slot="label">
                  <span class="paramTitle">K_and_PC</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_and_pc参数用于控制剔除父子假阳性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_PC"></el-input>
                <span class="valueRange">(取值范围为 0.15 - 0.3 )</span>
              </el-form-item>

              <el-form-item prop="K_and_SP">
                <template slot="label">
                  <span class="paramTitle">K_and_SP</span>
                  <el-popover placement="right" trigger="hover">
                    <div>
                      K_and_sp参数用于控制剔除配偶假阳性特征数，值越大计算越复杂，计算时间更长，结果不一定更好
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline"
                    ></el-icon>
                  </el-popover>
                </template>
                <el-input v-model.trim="SF_DRMB_form.K_and_SP"></el-input>
                <span class="valueRange">(取值范围为 0.4 - 0.8 )</span>
              </el-form-item>
            </el-form>
   
          </div>
        </el-tab-pane> -->

        <el-tab-pane label="PCA" name="pca">
          <div class="titleBox">PCA</div>
          <div class="introBox">
            <p>模型说明：</p>
            <p>
              PCA(Principal Component
              Analysis)，即主成分分析方法，是一种使用最广泛的数据降维算法。
            </p>
            <p>
              主要用于对数据的降维，通过降维可以发现更便于人理解的特征，加快对样本有价值信息的处理速度
            </p>
          </div>

          <div class="paramBox"></div>
        </el-tab-pane>

        <el-tab-pane label="ICA" name="ICA" :disabled="true" >ICA</el-tab-pane>
        <el-tab-pane label="LDA" :disabled="true">LDA</el-tab-pane>
        <el-tab-pane
          label="factor analysis"
          :disabled="true"
          >因子分析</el-tab-pane
        >
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import { postRequest } from "@/api/user";
export default {
  name: "representAlgo",
  props: ["active"],
  computed: {},
  data() {
    return {
      model: "pca",
      loading: false,
      res: "",
    };
  },

  created() {
    this.$emit('send_method', 'pca');
  },

  methods: {
    changeSelectMethod(tab, event) {
      console.log(tab.name)
    // Emit an event to the parent, sending the name of the selected tab
    this.$emit('send_method', tab.name);
  }
  },
};
</script>

<style scoped>
#modelList {
  height: 60vh;
  width: 100%;
  margin-bottom: 5vh;
}

.titleBox {
  margin: 10px auto 10px auto;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.introBox {
  background-color: #e8f3ff;
  height: 8vh;
  width: 100%;
  overflow: auto;
}

.introBox p {
  margin-left: 15px;
}

.introBox p:first-child {
  font-size: 18px;
  font-weight: 600;
}

.introBox p:nth-child(2) {
  margin-left: 2em;
}
.introBox p:nth-child(3) {
  margin-left: 2em;
}
.paramBox .el-form {
  margin-top: 2vh;
  margin-left: 60vh;
}

.paramBox .el-form .el-input {
  width: 25vh;
  margin-top: -50px;
}

.paramTitle {
  font-size: 20px;
  font-weight: 600;
}

.valueRange {
  color: gray;
  margin-left: 10px;
}

.el-icon-warning-outline {
  margin-left: 10px;
  font-size: 20px;
}

.el-icon-warning-outline:hover {
  color: #368ce7;
}

.buttonBox {
  width: 35vh;
  margin-top: 70px;
  margin-right: auto;
  margin-left: auto;
}
</style>
