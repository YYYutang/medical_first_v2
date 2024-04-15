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
        <div class="loginContainer">
          <div class="myForm">
            <el-form
              element-loading-text="正在登陆..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              ref="loginForm"
              :model="loginForm"
              :rules="rules"
              style="font-size: 30px"
            >
              <h3 class="loginTitle">软件登陆</h3>
              <el-form-item prop="username">
                <el-input
                  type="text"
                  auto-complete="false"
                  v-model="loginForm.username"
                  placeholder="请输入用户名"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  auto-complete="false"
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  type="text"
                  auto-complete="false"
                  v-model="loginForm.code"
                  placeholder="点击图片更换验证码"
                  style="width: 250px; margin-right: 5px"
                ></el-input>
                <img :src="captchaUrl" @click="updatecaptcha" />
              </el-form-item>
              <el-button
                type="primary"
                style="width: 100%; font-size: 20px"
                @click="submitlogin"
                >登录</el-button
              >
              <el-button
                style="
                  width: 100%;
                  margin-top: 20px;
                  margin-left: 0px;
                  font-size: 20px;
                "
                @click="register"
                >注册</el-button
              >
              <el-button
                type="danger"
                style="
                  width: 100%;
                  margin-top: 20px;
                  margin-left: 0px;
                  font-size: 20px;
                "
                @click="backToPlatform"
                >退出软件</el-button
              >
            </el-form>
          </div>
          <div class="notificationDiv">
            <div class="notification_title">通告栏</div>
            <div class="notification_container">
              <div v-for="(item, index) in notification" :key="item.id">
                <li
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    line-height: 50px;
                  "
  
                >
                  <span class="notification_content_title">{{
                    item.title
                  }}</span>
                  <span style="padding-right: 20px">{{
                    item.create_time
                  }}</span>
                </li>
                <el-divider></el-divider>
              </div>
            </div>
          </div>
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
      captchaUrl: "user/login",
      loginForm: {
        username: "",
        password: "",
        code: "",
      },
      loading: false,
      checked: true,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
      notification: [
        {
          id: "1",
          title: "我们将在4.18暂停服务",
          content: "敬请期待",
          create_time: "2024-04-15 22:21",
        },
        {
          id: "2",
          title: "我们将在4.22恢复服务",
          content: "敬请期待",
          create_time: "2024-04-15 22:38",
        },
        {
          id: "3",
          title: "11111111111111111111111111111111111111111111111",
          content: "敬请期待",
          create_time: "2024-04-15 22:38",
        },
      ],
    };
  },
  methods: {
    ...mapActions(["getTaskList", "getTreeData"]),
    updatecaptcha() {
      this.captchaUrl = "/captcha?time=" + new Date();
    },

    submitlogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          postRequest("user/login", this.loginForm).then((resp) => {
            if (resp) {
              this.loading = false;
              console.log(resp);
              if (resp.code == "200") {
                sessionStorage.setItem("username", resp.data.username);
                sessionStorage.setItem("userid", resp.data.uid);
                sessionStorage.setItem("userrole", resp.data.role);
                this.$router.push("/sideBar/SoftwareIntro");
                this.getTaskList();
                this.getTreeData();
                this.$message.success("登录成功");
              }
            } else {
              this.$message.error("用户不存在或者密码错误");
            }
          });
        } else {
          this.$message.error("请输入所有字段");
          return false;
        }
      });
    },
    register() {
      this.$router.push("/register");
    },
    backToPlatform() {
      window.location.href = "http://10.16.48.219:8000";
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
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  /* margin: 20px 10px; */
  margin-bottom: 150px;
  width: 900px;
  height: 550px;
  background: white;
  border: 1px solid #eaeaee;
  box-shadow: 0 0 25px #cac6c6;
  display: flex;
  align-items: center;
}
.myForm {
  flex: 0.45;
  padding-left: 30px;
  padding-right: 30px;
  border-right: 1px dashed #aaaaac;
}
.notificationDiv {
  flex: 0.55;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 550px;
}
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
  text-overflow: ellipsis;
  width: 260px;
  overflow: hidden;
  white-space: nowrap;
}
</style>
