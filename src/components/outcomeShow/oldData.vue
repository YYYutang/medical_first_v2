<template>
  <div>
    <div class="outcome">
        <div v-if="taskInfo!=null && taskInfo.principal!=null" style="margin-top:20px; margin-bottom: 0px;" class="center">
          <p style="margin-top:0px">
            <i class="el-icon-user"></i>创建人:
            <span>{{ taskInfo.principal }}</span>
             <i style="margin-left:20px" class="el-icon-user"></i>参与人员:
            <span>{{ taskInfo.participants }}</span>
            <i style="margin-left:20px" class="el-icon-folder-opened"></i>任务名称:
            <span>{{ taskInfo.taskName }}</span>
            <i style="margin-left:20px" class="el-icon-folder-opened"></i>任务类型:
            <span>{{ taskInfo.tasktype }}</span>
             <i style="margin-left:20px" class="el-icon-folder-opened"></i>备注:
            <span>{{taskInfo.tips}}</span>
          </p>
        </div>
      <div class="table">
        <p class="text">原始数据统计量:</p>
        <br />
        <div>
          <el-table
            :data="statis"
            height="450"
            style="width: auto"
            border
            :row-style="{ height: '33px', lineHeight: '10px', padding: '0px' }"
            :header-cell-style="{
              background: '#58AAFF',
              color: '#fff',
              lineHeight: '12px',
              padding: '0px',
              height: '34px',
              textAlign: 'center',
            }"
            stripe
          >
            <el-table-column
              v-for="(item, index) in statisColumn"
              :key="index"
              :label="item.label"
              :prop="item.name"
              width="150"
              align="center"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <br />
      <div class="table"  >
        <p class="text">原始数据:</p>
        <br />
        <el-radio-group v-model="dataCondition" @input="changeDataNow" >
          <el-radio :label="1">人口学</el-radio>
          <el-radio :label="2">生理指标</el-radio>
          <el-radio :label="3">行为学</el-radio>
          <el-radio :label="4">其他指标</el-radio>
          <el-radio :label="5">全部数据</el-radio>
        </el-radio-group>
        <br />
        <div class="table1" v-loading='changeDataLoading' element-loading-text="数据量较大，正在加载中...">
          <!-- <el-table
            :data="dataNow"
            border
            class="tableDown"
            :row-style="{ height: '33px', lineHeight: '10px', padding: '0px' }"
            :header-cell-style="{
              background: '#58AAFF',
              color: '#fff',
              lineHeight: '12px',
              padding: '0px',
              height: '34px',
              textAlign: 'center',
            }"
          >
            <el-table-column
              v-for="(item, index) in dataColumn"
              :key="index"
              :label="item"
              :prop="item"
              align="center"
              style="width: auto; min-width: 200px"
            >
            </el-table-column>
          </el-table> -->
          <el-table
            :data="dataNow"
            border
            class="tableDown"
            :row-style="{ height: '33px', lineHeight: '10px', padding: '0px' }"
            :header-cell-style="{
              background: '#58AAFF',
              color: '#fff',
              lineHeight: '12px',
              padding: '0px',
              height: '34px',
              textAlign: 'center',
            }"
          >
            <el-table-column
              v-for="(item, index) in dataColumn"
              :key="index"
              :label="item"
              :prop="item"
              align="center"
              style="width: auto; min-width: 200px"
            >
              <template slot-scope="{ row }">
                <div class="cell-content">{{ row[item] }}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <el-pagination
        background
        class="pagination"
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :total="allPage"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getRequest } from "@/utils/api";

export default {
  name: "oldData",
  props: ["dataAll", "dataName", "statisData", "dataColumns",'createTaskInfo'],
  data() {
    return {
      dataInfo: [],
      dataColumn: [],
      allPage: 0,
      currentPage: 1,
      pageSize: 10,
      dataNow: [],
      statisColumn: [],
      column: [],
      statis: [],
      dataCondition: '5',
      changeDataLoading:false,
       taskInfo: null,  // 展示任务信息
          taskInfoParam: {},
    };
  },
  methods: {
    dealdata() {
      this.dataColumn = Object.keys(this.dataAll.data[0]);
      this.allPage = this.dataAll.total * 10;
      this.dataNow = this.dataAll.data;
      this.column = Object.keys(this.statisData);
      let tempColumn = Object.keys(this.statisData[this.column[0]]);
      tempColumn.unshift("name");
      for (let i = 0; i < tempColumn.length; i++) {
        if (tempColumn[i] == "name") {
          let tempObj = {
            name: tempColumn[i],
            label: "指标名",
          };
          this.statisColumn.push(tempObj);
        }
        if (tempColumn[i] == "missingRate") {
          let tempObj = {
            name: tempColumn[i],
            label: "缺失率",
          };
          this.statisColumn.push(tempObj);
        }
        if (tempColumn[i] == "mean") {
          let tempObj = {
            name: tempColumn[i],
            label: "平均值",
          };
          this.statisColumn.push(tempObj);
        }
        if (tempColumn[i] == "variance") {
          let tempObj = {
            name: tempColumn[i],
            label: "方差",
          };
          this.statisColumn.push(tempObj);
        }
      }

      let index = 0;
      for (let key in this.statisData) {
        if (index < this.column.length - 1) {
          index++;
          let tempObj = {
            name: key,
            missingRate: this.statisData[key].missingRate.toFixed(2),
            mean: this.statisData[key].mean.toFixed(2),
            variance: this.statisData[key].variance.toFixed(2),
          };
          //    if(tempList[i].tableName==key){
          //   tempObj.desc=tempList[i].tableDesc;
          // }
          this.statis.push(tempObj);
        }
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      getRequest(
        "/feature/getInfoByTableName?tableName=" +
          this.dataName +
          "&page=" +
          val
      ).then((response) => {
        this.dataNow = response.data;
      });
    },
    changeDataNow(val) {
      let tempColumn = [];
      this.changeDataLoading=true;
      if (val == "1") {
        for (var i = 0; i < this.dataColumns.length; i++) {
          if (this.dataColumns[i].columnisR) {
            tempColumn.push(this.dataColumns[i].columnName);
          }
        }
        this.dataColumn = tempColumn;
      }
      if (val == "2") {
        for (var i = 0; i < this.dataColumns.length; i++) {
          if (this.dataColumns[i].columnisS) {
            tempColumn.push(this.dataColumns[i].columnName);
          }
        }
        this.dataColumn = tempColumn;
      }
      if (val == "3") {
        for (var i = 0; i < this.dataColumns.length; i++) {
          if (this.dataColumns[i].columnisX) {
            tempColumn.push(this.dataColumns[i].columnName);
          }
        }
        this.dataColumn = tempColumn;
      }
      if (val == "4") {
        for (var i = 0; i < this.dataColumns.length; i++) {
          if (this.dataColumns[i].columnisO) {
            tempColumn.push(this.dataColumns[i].columnName);
          }
        }
        this.dataColumn = tempColumn;
      }
      if (val == "5") {
        this.dataColumn = Object.keys(this.dataAll.data[0]);
      }
         this.changeDataLoading=false;
    },
  },
  created() {
    this.dealdata();
     this.taskInfoParam = this.$route.params // 任务管理直接查看结果的参数
      console.log("任务管理过来的传递信息：",this.taskInfoParam)
      this.taskInfo = this.createTaskInfo;
      if(this.taskInfo == null && (this.taskInfoParam!=null && this.taskInfoParam.taskInfo!=null)) this.taskInfo = this.taskInfoParam.taskInfo; //

  },
};
</script>
<style scoped>
.outcome{
    display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.table {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width:auto;
}
.table1 {
 width:1600px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-table {
  width: auto;
}
.pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.statable {
  width: auto;
}
.text {
  color: black;
  font-size: 20px;
  font-weight: bold;
}
.cell-content {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
