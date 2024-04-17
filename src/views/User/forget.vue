<template>
  <div class="myMain">
    <div class="mainContainer">
      <div class="leftContainer">
        <div class="mainRight">
          <img
            src="http://www.cqupt.edu.cn/dfiles/13011/cqupt/img/favicon_128x128.ico"
            style="height: 100px; width: 100px"
          />
          <h1>人群队列数据特征表征工具软件</h1>
        </div>
        <div class="mainImg">
          <img
            class="gif"
            src="https://img.benmu-health.com/sanyi-health/gif.gif"
          />
          <img
            class="png"
            src="https://img.benmu-health.com/sanyi-health/main-pic-new.png"
          />
        </div>
      </div>
      <div class="rightContainer">
        <div class="forgetContainer">
          <div class="step">
            <el-steps :active="1" align-center>
              <el-step title="步骤1"></el-step>
              <el-step title="步骤2"></el-step>
              <el-step title="步骤3"></el-step>
            </el-steps>
          </div>
          <div v-if="active==1">
            <el-form  ref="forgetForm1"
                :model="forgetForm1"
                :rules="rules"
                style="font-size: 30px"
                label-width="120px">
             <el-form-item prop="username" label="用户名">
                  <el-input
                    type="text"
                    auto-complete="false"
                    v-model="forgetForm1.username"
                    placeholder="请输入用户名"
                  ></el-input>
                </el-form-item>
            </el-form>
          </div>
          <el-button style="margin-top: 12px" @click="next">下一步</el-button>
        </div>
      </div>
    </div>
    <div class="cooperation">
      <el-row class="text-coop">
        <el-col :span="24">合作单位：</el-col>
      </el-row>
      <el-row class="text-photo1" style="margin-top: 5px">
        <el-col :span="6">
          <img
            src="@/assets/cqupt.png"
            alt="重庆邮电大学"
            style="height: 45px"
          />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/sdu.png" alt="山东大学" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img
            src="@/assets/sanjun.jpg"
            alt="陆军军医大学"
            style="height: 45px"
          />
        </el-col>
        <el-col :span="7">
          <img
            src="@/assets/sfu.png"
            alt="山东第一医科大学"
            style="height: 45px"
          />
        </el-col>
      </el-row>
      <el-row class="text-photo1">
        <el-col :span="6">
          <img src="@/assets/lrjk.png" alt="联仁健康" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/hhrj.png" alt="互惠软件" style="height: 45px" />
        </el-col>
        <el-col :span="5">
          <img src="@/assets/ft.png" alt="富通" style="height: 45px" />
        </el-col>
        <el-col :span="7">
          <img
            src="@/assets/sdhl.png"
            alt="山东华链医疗科技有限公司"
            style="height: 45px"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { postRequest } from "@/utils/api";
import { mapActions } from "vuex";
export default {
  name: "Login",

  data() {
    return {
      loading: false,
      checked: true,
      active: 1,
      forgetForm1:[
        {username:''},
      ],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  mounted() {},
  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}
li {
  list-style-type: none; /* 去除列表项前的标记 */
  margin: 0; /* 去除列表项的默认外边距 */
  padding: 0; /* 去除列表项的默认内边距 */
}
.myMain {
  width: 100%;
  background: url("https://img.benmu-health.com/sanyi-health/bg1-new.png")
    no-repeat;
  background-size: 100% 100%;
}
.mainContainer {
  display: flex; /* 启用Flex布局 */
  height: 90vh;
}
.leftContainer {
  flex: 0.4; /* 左侧盒子的放大比例为1 */
  padding: 20px; /* 内边距 */
}
.rightContainer {
  flex: 0.6; /* 右侧盒子的放大比例为2 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 30px;
}
.forgetContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /* margin: 20px 10px; */
  margin-bottom: 150px;
  width: 500px;
  height: 550px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
}
/* .step{
  width:70%;
  display: flex;
} */

.loginTitle {
  margin: 0px auto 40px auto;
  text-align: center;
}

/* .loginDiv {
  position: absolute;
  right: 80px;
  margin-top: 40px;
} */

img.gif {
  position: absolute;
  top: 479px;
  left: 909px;
}

img.png {
  position: absolute;
  top: 315px;
  left: 612px;
}

.mainRight {
  position: absolute;
  top: 8px;
  left: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.mainRight h1 {
  display: block;
  color: white;
  font-size: 40px;
  letter-spacing: 4px;
  margin-top: -10px;
}
.mainImg {
  display: block;
  position: absolute;
  left: -480px;
  top: -200px;
}

.cooperation {
  background-color: white;
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 150px;
}
.cooperation .text-coop {
  margin-left: 20px;
  text-align: left;
  font-size: 20px;
  font-weight: 1000;
  color: black;
}
.cooperation img {
  margin-left: 10px;
}
.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}
.el-form-item__content {
  display: flex;
  align-items: center;
}
.notification_title {
  font-size: 30px;
  font-weight: bold;
  flex: 0.25;
  justify-content: center;
  align-items: center;
  display: flex;
}
.notification_container {
  flex: 0.75;
  width: 100%;
}
.collapse {
  overflow: auto;
  flex: 0.75;
  width: 100%;
}
.notification_content_title {
  padding-left: 20px;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  max-width: 250px;
}
@keyframes scroll {
  0% {
    transform: translateX(250px);
  }
  100% {
    transform: translateX(-100%);
  }
  200% {
    transform: translateX(250px);
  }
}

.scroll-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}

.scrolling {
  animation: scroll 10s linear infinite;
}

.notification_content_title:hover .scroll-text {
  animation-play-state: running;
}

.selectedNotificationTitle {
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
}
.selectedNotificationContent {
  font-size: 17px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
