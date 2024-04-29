<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-input v-model="username" placeholder="请输入用户名" style="width: 200px"></el-input>
      <el-button style="margin-left: 20px" type="primary" @click="load">查询</el-button>
      <el-button @click="clean" >清空条件</el-button>
    </div>
    <div   v-loading="table_loading"
            element-loading-text="数据量较大，拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.05)">
      <el-table
          :header-cell-style="{ backgroundColor: '#e8e5e5', color: 'black', fontWeight: 'bold'}"
          :data="tableData"
          stripe
      >
          style="width: 100%">
        <el-table-column
            prop="id"
            label="id">
        </el-table-column>
        <el-table-column
            prop="uid"
            label="uid">
        </el-table-column>
        <el-table-column
            prop="username"
            label="操作人">
        </el-table-column>
        <el-table-column
            prop="opTime"
            label="操作时间">
        </el-table-column>
        <el-table-column
            prop="opType"
            label="操作类型">
        </el-table-column>
      </el-table>
    </div>
    <div style="text-align: center;margin-top: 20px">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export  default {
  name: "logManage",
  data() {
    return {
      tableData: [],
      pageNum:1,
      pageSize:10,
      total: 0,
      username:"",
      table_loading:false,
    }
  },
  created() {
    this.load()
  },
  methods:{
    load(){
      this.table_loading = true;
      getRequest(`userlog/getLogByPage?pageNum=${this.pageNum}&pageSize=${this.pageSize}&username=${this.username}`)
          .then(res =>{
            this.tableData = res.data.list
            this.total = res.data.total
            this.table_loading = false;
          })
    },
    handleCurrentChange(pageNum){
      this.pageNum = pageNum
      this.load()
    },
    handleSizeChange(pageSize){
      this.pageSize = pageSize
      this.load()
    },
    clean(){
      this.username = ""
      this.load()
    }
  }
}
</script>
<style scoped>

</style>