<template>
  <div class="container" >
    <div class="right_step">
      <div class="step">
        <el-steps :active="active" align-center>
          <el-step title="选择数据"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="方法选择" v-if="type==4"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <br><div class="yang">
      <div class="left_tree">
        <!-- <el-tree ref="tree"
          show-checkbox
          :check-strictly="true"  
          :data="treeData"
          :props="defaultProps"
          node-key="id"
          @node-click="handleNodeClick"
          @check-change="checkChange">
        </el-tree> -->
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
        @check="changeData"
        @check-change="handleCheckChange">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            &nbsp;
            <el-popconfirm
              confirm-button-text='新病种'
              cancel-button-text='数据集'
              title="请选择添加的文件"
              cancel-button-type="primary"
              @confirm="dialogDiseaseVisible=true"
              @cancel="dialogFormVisible=true">
              <el-button
                v-if="!data.isLeafs"
                icon="el-icon-folder-add"
                size="mini"
                type="text"
                slot="reference"
                @click="markNode(data)"
                >
              </el-button>
            </el-popconfirm>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="text"
              @click="() => remove(node, data)">
            </el-button>
          </span>
        </span>
      </el-tree>
      </div>
      <div class="right_table">
        <el-card class="right_table_topCard">
          <div class="describe_content">
            <h3>数据集名称</h3>
            <div class="content-container">
              <div class="details">
                <p style="margin-top:0.5%" class="p">
                  <i class="el-icon-user"></i>创建人: <span>张三</span>
                  <i class="el-icon-time"></i>创建时间: <span>2023.12.13</span>
                  <i class="el-icon-folder-opened"></i>所属类别: <span>糖尿病/一型糖尿病</span>
                </p>
                 <el-button type="success" round class="button">确定</el-button>
              </div>
            </div>
          </div>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="date" label="特征1" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征2" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征3" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征4" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征5" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征6" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征7" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征8" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征9" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征10" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征11" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征12" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征13" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征14" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征15" width="80">
            </el-table-column>
            <el-table-column prop="date" label="特征16" width="80">
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      </div>
    </div>
  </div>
</template>
<script>

import {postRequest, getRequest } from "@/utils/api.js"
/*数据集选择页面*/
export default {
  name: "datasetChoose",
  props: ['active','type'],
  data() {
    return {
      tableData: [
        {date: '2023.12.12'},
        {date: '2023.12.12'},
        {date: '2023.12.12'},
        {date: '2023.12.12'},
        {date: '2023.12.12'},
        {date: '2023.12.12'},
        {date: '2023.12.12'},
        {date: '2023.12.12'}
      ],
      treeData: [{
          id: 1,
          label: '糖尿病',
          isLeafs: false,
          children: [{
            id: 4,
            label: '一型糖尿病',
            isLeafs: false,
            children: [{
              id: 9,
              label: '数据集1',
              isLeafs: true
            }, {
              id: 10,
              label: '数据集2',
              isLeafs: true
            }]
          }]
        }, {
          id: 2,
          label: '肺病',
          children: [{
            id: 5,
            label: 'xxx肺病',
            isLeafs: false,
            children: [{
              id: 11,
              label: '数据集一',
              isLeafs: true
            },{
               id: 12,
               label: '数据集二',
               isLeafs: true
            }]
          }, {
            id: 6,
            label: 'yyy肺病',
            isLeafs: false
          }]
        }, {
          id: 3,
          label: '心脏病',
          isLeafs: false,
          children: [{
            id: 7,
            label: 'xxx心脏病',
            isLeafs: false
          }, {
            id: 8,
            label: 'yyy心脏病',
            isLeafs: false
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    };
  },
  created(){
    this.getCatgory();
  },
  methods: {
    getCatgory(){
      getRequest("/api/category",null).then((response)=>{
       this.treeData = response.data;
      })
    },
    handleNodeClick(item,node,self){ //自己定义的editCheckId，防止单选出现混乱
            this.editCheckId=item.id;
            this.$refs.tree.setCheckedKeys([item.id])
    },
      
    checkChange(item,node,self){
            if (node == true) {
               this.editCheckId=item.id;
               this.$refs.tree.setCheckedKeys([item.id])
            }else {
               if (this.editCheckId == item.id) {
                   this.$refs.tree.setCheckedKeys([item.id])
               }
            }
    },
  },
  mounted() {
  },
};
</script>
<style lang="less">
.container {
  display: flex;
  width: 100%;
  height: 100%;
  // background-color: red;
}

// .p{
//   background-color: red;
// }
.right_step {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
}
.right_step .step {
  display: block;
  width: 100%;
}
.yang{
  display: flex;
}

.left_tree {
  width: 250px;
  border-radius: 3px;
  border: 1px solid black;
}

.right_table {
  display: flex; 
  width: 1400px;
  border-top: 1px solid black;
  // margin-left: 20px;
  /* background-color: aqua; */
}

.right_table_topCard {
  padding: 0;
  /* height: auto; */
  width: 100%;
  // border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  // position: relative;
  // left: 1%;
}
// .describe_content {
//   // display: inline-block;
//   // width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// }

.content-container {
  display: flex;
  flex-direction: column;
}

.details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.describe_content span {
  margin: 10px;
}
 // 设置只有叶子节点有复选框
.el-tree-node {
  .is-leaf + .el-checkbox .el-checkbox__inner {
      display:inline-block;
  }
  .el-checkbox__input> .el-checkbox__inner {
      display:none;
  }
}
</style>