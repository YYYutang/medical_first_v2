<template>
  <div>
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: calc(100vh - 150px);
      "
    >
      <el-card style="width: 40%">
        <!-- <el-form ref="form" :model="form" label-width="120px" style="width: 100%;font-size: 15px" :rules="rules">
       <el-form-item label="用户名:" prop="username" >
         <el-input @blur="checkRepetition" v-model="form.username"></el-input>
       </el-form-item>
       <el-form-item label="角色:" >
         <el-input v-model="form.role" disabled></el-input>
       </el-form-item>
       <el-form-item label="创建时间:">
         <el-input  v-model="form.createTime" disabled></el-input>
       </el-form-item>
       <el-form-item label="密保答案1:" prop="answer_1">
         <el-input v-model="form.answer_1"></el-input>
       </el-form-item>
       <el-form-item label="密保答案2:" prop="answer_2">
         <el-input v-model="form.answer_2"></el-input>
       </el-form-item>
       <el-form-item label="密保答案3:" prop="answer_3">
         <el-input v-model="form.answer_3"></el-input>
       </el-form-item>
       <el-form-item v-if="form.role === '普通用户'" label="剩余上传文件容量:">
         <el-input  v-model="form.uploadSize" disabled></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="primary" @click="submitForm">保存</el-button>
       </el-form-item>
     </el-form> -->
        <el-descriptions
          class="margin-top"
          title="用户个人信息"
          
          :column="3"
          border
        >
          <template slot="extra">
            <el-button type="primary" size="small">修改</el-button>
          </template>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户名
            </template>
            {{ userInfo.username }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              角色
            </template>
            {{ userInfo.role === 0 ? '管理员' : userInfo.role === 1 ? '普通用户' : '未知角色' }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              可使用容量
            </template>
            {{userInfo.uploadSize}}MB
          </el-descriptions-item>
                    <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              注册时间
            </template>
           {{userInfo.createTime}}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<script >
import { getRequest, postRequest } from "@/utils/api";

export default {
  name: "userCenter",
  data() {
    return {
      userInfo: {},
    };
  },
  created() {
    let uid = sessionStorage.getItem("userid");
    getRequest("user/queryInfoById?uid=" + uid).then((res) => {
      console.log("res", res);
      if (res.code === 200) {
        this.userInfo = res.data;
      }
      else{
        this.$message.error(`${res.msg}`)
      }
    });
  },
  methods: {},
};
</script>

<style scoped>
</style>