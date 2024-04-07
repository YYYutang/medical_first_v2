<template>
  <div class="dm_container">
    <div class="left_tree">
      <el-button
        type="success"
        class="add_button"
        @click="dialogDiseaseVisible2 = true"
        >添加病种</el-button
      >
      <el-dialog title="提示" :visible.sync="dialogDiseaseVisible2" width="30%">
        <span>
          请输入新病种名称：<el-input
            placeholder="请输入内容"
            v-model="diseaseName"
            class="nameInput"
          ></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="addDisease()">确 定</el-button>
        </span>
      </el-dialog>
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
        @check-change="handleCheckChange"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <!--公共数据集confirm-->
            <el-popconfirm
              v-if="data.isCommon"
              confirm-button-text="添加新病种"
              cancel-button-text="上传数据集文件"
              title="请选择添加的文件"
              cancel-button-type="primary"
              @confirm="dialogDiseaseVisible = true"
              @cancel="dialogFormVisible = true"
            >
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
            <!--非公共数据集confirm-->
            <el-popconfirm
              v-else
              confirm-button-text="添加新病种"
              cancel-button-text="筛选数据集"
              title="请选择添加的文件"
              cancel-button-type="primary"
              @confirm="dialogDiseaseVisible = true"
              @cancel="openAddDataForm(data.path)"
            >
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
              @click="() => remove(node, data)"
            >
            </el-button>
             <!-- <el-popconfirm
              title="删除后无法恢复"
              icon="el-icon-warning"
              icon-color="red"
              @confirm="remove(node, data)"
            >
              <el-button slot="reference" size="mini" icon="el-icon-delete" class="no-border-icon"></el-button
              >
            </el-popconfirm> -->
          </span>
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
          <el-button type="primary" @click="() => append(0)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="新增数据集" :visible.sync="dialogDataVisible" width="60%">
      <div class="addDataClass">
        <i style="margin-left: 10px" class="el-icon-s-data"></i
        >&nbsp;&nbsp;&nbsp;数据集名称：<el-input
          v-model="addDataForm.dataName"
          placeholder="请输入数据集名称"
        ></el-input>
        <span class="addDataBaseInfo">
          <i class="el-icon-user-solid"></i>&nbsp;&nbsp;&nbsp;创建人：<el-input
            v-model="addDataForm.createUser"
            placeholder="请输入创建人姓名"
          ></el-input>
        </span>
        <span class="addDataBaseInfo">
          <i class="el-icon-time"></i>&nbsp;&nbsp;&nbsp;创建时间：<span>{{
            showDataForm.createTime
          }}</span>
        </span>
        <span class="addDataBaseInfo">
          <i class="el-icon-pie-chart"></i>&nbsp;&nbsp;&nbsp;所属类别：<span>{{
            showDataForm.classPath
          }}</span>
        </span>
      </div>
      <div class="addDataClass" style="margin-top: 20px">
        <div class="addDataTitle">
          <i class="el-icon-connection"></i>&nbsp;&nbsp;特征选择
        </div>
        <div style="margin-top: 20px">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            style="margin-right: 8px"
            @click="putToAddDataForm"
            >添加新条件</el-button
          >
          <el-button
            @click="chooseCharacter(addDataForm.characterList[0])"
            style="width: 130px; margin-right: 8px; margin-left: 0px"
            >{{ addDataForm.characterList[0].button }}</el-button
          >
          <span v-if="addDataForm.characterList[0].type === 'discrete'">
            <el-select
              :value="'='"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
              disabled
            >
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-select
              v-model="addDataForm.characterList[0].value"
              placeholder="请选择特征取值"
              style="width: 300px"
            >
              <el-option
                v-for="item in addDataForm.characterList[0].range"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </span>
          <span v-else>
            <el-select
              v-model="addDataForm.characterList[0].computeOpt"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
            >
              <el-option label=">" value=">"></el-option>
              <el-option label="<" value="<"></el-option>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-input
              v-model="addDataForm.characterList[0].value"
              placeholder="请输入特征取值"
              style="width: 300px"
            ></el-input>
            <el-button disabled style="width: 200px; background-color: #f5f7fa"
              >单位：{{ addDataForm.characterList[0].unit }}</el-button
            >
          </span>
        </div>
        <div
          style="margin-top: 20px"
          v-for="(characterItem, index) in addDataForm.characterList.slice(1)"
          :key="index"
        >
          <el-select
            v-model="characterItem.opt"
            slot="prepend"
            placeholder="条件选择"
            style="width: 130px; margin-right: 8px"
          >
            <el-option label="AND" value="0"></el-option>
            <el-option label="OR" value="1"></el-option>
            <el-option label="NOT" value="2"></el-option>
          </el-select>
          <el-button
            @click="chooseCharacter(characterItem)"
            style="width: 130px; margin-right: 8px"
            >{{ characterItem.button }}</el-button
          >
          <span v-if="characterItem.type === 'discrete'">
            <el-select
              :value="'='"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
              disabled
            >
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-select
              v-model="characterItem.value"
              placeholder="请选择特征取值"
              style="width: 300px"
            >
              <el-option
                v-for="item in characterItem.range"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </span>
          <span v-else>
            <el-select
              v-model="characterItem.computeOpt"
              slot="prepend"
              placeholder="运算符"
              style="width: 90px; margin-right: 8px"
            >
              <el-option label=">" value=">"></el-option>
              <el-option label="<" value="<"></el-option>
              <el-option label="=" value="="></el-option>
            </el-select>
            <el-input
              v-model="characterItem.value"
              placeholder="请输入特征取值"
              style="width: 300px"
            ></el-input>
            <el-button disabled style="width: 115px; background-color: #f5f7fa"
              >单位：{{ characterItem.unit }}</el-button
            >
          </span>
          <el-button
            type="primary"
            plain
            icon="el-icon-delete"
            style="margin-left: 10px"
            @click="deleteToAddDataForm(characterItem)"
            >删除</el-button
          >
        </div>
        <div
          style="
            margin-top: 20px;
            margin-bottom: 10px;
            display: flex;
            justify-content: center;
          "
        >
          <button class="cool-button" @click="submitCharacterCondition">
            筛选病例
          </button>
        </div>
        <!-- 显示筛选出来的表数据 -->
        <el-table
          :data="addTableData"
          stripe
          style="width: 100%"
          height="450"
          v-show="showAddTableData"
        >
          <el-table-column
            v-for="(value, key) in addTableData[0]"
            :key="key"
            :prop="key"
            :label="key"
            width="80"
          >
            <template slot-scope="{ row }">
              <div class="truncate-text">{{ row[key] }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cleanDataInput()">取 消</el-button>
        <el-button type="primary" @click="addTable()">新建表</el-button>
      </span>
      <el-dialog
        title="特征选择"
        :visible.sync="characterVisible"
        width="50%"
        append-to-body
      >
        <el-container>
          <el-aside width="180px">
            <el-menu default-active="1" class="el-menu-vertical-demo">
              <el-menu-item index="1" @click="exchangeCharacterList(0)">
                <span slot="title">人口学</span>
              </el-menu-item>
              <el-menu-item index="3" @click="exchangeCharacterList(2)">
                <span slot="title">生理指标</span>
              </el-menu-item>
              <el-menu-item index="4" @click="exchangeCharacterList(3)">
                <span slot="title">行为学</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main>
            <el-radio-group v-model="characterId">
              <el-radio
                v-for="optItem in characterOptList"
                :key="optItem.characterId"
                :label="optItem.characterId"
                border
                style="margin-bottom: 10px"
                >{{ optItem.chName }}</el-radio
              >
            </el-radio-group>
          </el-main>
        </el-container>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmCharacter()"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-dialog>
    <!--===============================     导入数据表单   ===================================================================-->
    <el-dialog
      v-loading="loading"
      :element-loading-text="loadText"
      id="importDataTable"
      title="导入数据表"
      :visible.sync="dialogFormVisible"
      width="40%"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="dialogForm.rules"
        label-width="110px"
      >
        <el-form-item label="选择数据表" prop="filesInfo">
          <el-upload
            action=""
            class="upload"
            ref="uploadRef"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="changeFile"
            :auto-upload="false"
            accept=".csv"
            :limit="1"
            :multiple="false"
            :file-list="dialogForm.filesInfo"
            :http-request="
              (data) => {
                upRequest(data);
              }
            "
          >
            <el-button slot="trigger" size="small" type="success"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item label="数据表名称" prop="tableName">
          <el-input
            v-model="dialogForm.tableName"
            placeholder="请输入数据表名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="涉及疾病" prop="dataDisease">
          <el-select
            v-model="dialogForm.dataDisease"
            filterable
            placeholder="请选择或搜索"
          >
            <el-option
              v-for="item in disOptions"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogFormVisible = false;
            resetForm('dialogFormRef');
          "
          >取消</el-button
        >
        <el-button @click="resetForm('dialogFormRef')">重置</el-button>
        <el-button type="primary" @click="uploadFile">下一步</el-button>
      </div>

      <el-dialog
        v-loading="loading2"
        :element-loading-text="loadText2"
        append-to-body
        title="请选择特征类型"
        :visible.sync="featuresVision"
      >
        <el-form class="featureLabel" label-width="auto">
          <el-form-item
            v-for="(name, index) in Object.keys(featuresMap)"
            :key="index"
            :label="name"
          >
            <el-select
              v-model="featuresMap[name]"
              placeholder="请选择特征类型"
              @change="changeLabel(name, featuresMap[name])"
            >
              <el-option
                label="诊断"
                value="diagnosis"
                key="diagnosis"
              ></el-option>
              <el-option label="检查" value="examine" key="examine"></el-option>
              <el-option
                label="病理"
                value="pathology"
                key="pathology"
              ></el-option>
              <el-option
                label="生命特征"
                value="vital_signs"
                key="vital_signs"
              ></el-option>
              <el-option label="标签" value="label" key="label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="compelete">完成上传</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <div class="right_table">
      <el-card class="right_table_topCard">
        <div class="describe_content">
          <!-- <h3>数据集名称：{{tableName}}</h3>
          <el-button style="margin-left: 200px;">导出</el-button> -->
          <div style="display: flex; align-items: center">
            <h3 style="margin-right: auto">数据集名称：{{ tableName }}</h3>
            <el-button type="primary" @click="openExportDialog()">导出</el-button>
          </div>
          <p style="margin-top: 0.5%">
            <i class="el-icon-user"></i>创建人:
            <span>{{ showDataForm.createUser }}</span>
            <i class="el-icon-time"></i>创建时间:
            <span>{{ showDataForm.createTime }}</span>
            <i class="el-icon-folder-opened"></i>所属类别:
            <span>{{ showDataForm.classPath }}</span>
          </p>
        </div>
        <div class="tableData" v-if="dataPre == true">
          <el-table
            :data="tableData"
            stripe
            style="width: auto"
            class="custom-table"
            v-if="dataPre == true"
            :header-cell-style="headerCellStyle"
            max-height="660"
          >
            <el-table-column
              type="index"
              width="50"
              label="id"
            ></el-table-column>
            <el-table-column
              v-for="(value, key) in tableData[0]"
              :key="key"
              :prop="key"
              :label="key"
              width="120px"
              :sortable="true"
            >
              <template slot-scope="{ row }">
                <div class="truncate-text">{{ row[key] }}</div>
              </template>
            </el-table-column>
          </el-table>
           <!-- 导出对话框 -->
          <el-dialog :visible="exportDialogVisible" @close="exportDialogVisible = false" width="60%">
            <div slot="title">选择导出字段</div>
            <div>
               <!-- 全选复选框 -->
              <!-- <el-checkbox v-model="isAllSelected" @change="selectAll">全选</el-checkbox> -->
               <el-button type="success" @click="toggleSelectAll">{{ isAllSelected ? '取消全选' : '全选' }}</el-button>
              <br><br>
              <table class="checkbox-table">
                <tbody>
                  <tr v-for="(row, rowIndex) in fieldRows" :key="rowIndex">
                    <td v-for="(field, colIndex) in row" :key="colIndex">
                      <el-checkbox v-model="selectedFields" :label="field">{{ field }}</el-checkbox>
                    </td>
                  </tr>
                </tbody>
            </table>
            </div>
            <div slot="footer">
              <el-button @click="exportData">提交</el-button>
              <el-button @click="exportDialogVisible = false">取消</el-button>
            </div>
          </el-dialog>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRequest, postRequest, saveParentDisease } from "@/api/user";
import { getFetures } from "@/api/feature.js";
import { getCategory, addDisease, removeCate } from "@/api/category";
import { getTableDes, getTableData } from "@/api/tableDescribe.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { disOptions } from "@/components/tab/constData.js";
import { resetForm, debounce } from "@/components/mixins/mixin.js";
let id = 1000;

export default {
  mixins: [resetForm, debounce],
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    loginUserID() {
      return sessionStorage.getItem("userid");
    },

     fieldRows() {
      const rows = [];
      const itemsPerRow = 5; // 每行显示的复选框数量
      for (let i = 0; i < this.allFields.length; i += itemsPerRow) {
        rows.push(this.allFields.slice(i, i + itemsPerRow));
      }
      return rows;
    }
  },

  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
  },

  data() {
    return {
      exportDialogVisible: false, // 控制导出对话框的显示状态
      allFields: ['字段1', '字段2', '字段3','字段1', '字段2', '字段3','字段1', '字段2', '字段3','字段1', '字段2', '字段3','字段1', '字段2', '字段3','字段1', '字段2', '字段3'], // 所有可选择的字段列表
      selectedFields: [], // 用户选择的字段
      // 获取虚拟树形结构数据
      // treeData: JSON.parse(JSON.stringify(treeData)),
      tableName: "copd",
      treeData: [],
      dataPre: false,
      // 获取虚拟表格数据
      // tableData: JSON.parse(JSON.stringify(tableData)),
      tableData: [],
      fullData: "",
      showTooltip: false,
      hoverTimer: null,
      dialogDiseaseVisible: false,
      dialogDataVisible: false,
      characterVisible: false,
      showAddTableData: false,
      characterId: 1,
      showDataForm: {
        createUser: "",
        createTime: "",
        classPath: "",
      },
      addDataForm: {
        dataName: "",
        createUser: "",
        createTime: "",
        path: "",
        characterList: [
          {
            opt: "",
            characterId: -1,
            featureName: "",
            chName: "",
            type: "",
            unit: "",
            range: "",
            button: "点击选择特征",
            value: "",
            computeOpt: "",
          },
        ],
      },
      characterOptList: [],
      addTableData: [],
      input3: "",
      select: "",

      dialogDiseaseVisible2: false,

      nodeData: {},

      diseaseName: "",

      loading: false,
      loading2: false,
      getData_loading: false,
      loadText: "拼命加载中",
      loadText2: "拼命加载中",
      disease: "",
      creator: "",
      disOptions,
      featuresVision: false,
      DatadialogVisible: false,
      featuresMap: {},
      patientTable: [],
      dialogForm: {
        filesInfo: [],
        tableName: "",
        isOnly: true,
        dataDisease: "",
        featuresNum: 1,
        fields: [{ name: "", type: "" }],
        rules: {
          tableName: [
            {
              required: true,
              message: "数据表名称不能为空",
              trigger: "change",
            },
          ],
          dataDisease: [
            {
              required: true,
              message: "涉及疾病不能为空",
              trigger: "blur",
            },
          ],
          numFeatures: [
            { required: true, message: "特征个数不能为空", trigger: "blur" },
            { type: "integer", message: "特征个数需为整数", trigger: "blur" },
            { min: 1, message: "特征个数需>1", trigger: "blur" },
          ],
        },
      },
      dialogFormVisible: false,
      options: {
        method: "post",
        data: {},
        url: "/DataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    };
  },

  created() {
    // 检查重名的防抖函数
    this.checkTableName = this.debounce(() => {
      getRequest("/api/DataTable/inspection", {
        newname: this.dialogForm.tableName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.getCatgory();
    this.getTableDescribe("1005");
    this.getTableData("1005", "copd");
  },

  methods: {
     selectAll() {
      if (this.isAllSelected) {
        // 如果全选复选框被选中，则选择所有字段
        this.selectedFields = this.allFields.slice();
      } else {
        // 否则取消选择所有字段
        this.selectedFields = [];
      }
    },
      toggleSelectAll() {
      this.isAllSelected = !this.isAllSelected; // 切换全选状态
      if (this.isAllSelected) {
        // 如果全选按钮被选中，则选择所有字段
        this.selectedFields = this.allFields.slice();
      } else {
        // 否则取消选择所有字段
        this.selectedFields = [];
      }
    },
    openExportDialog() {
      this.exportDialogVisible = true; // 打开导出对话框
      // 根据表名获取字段信息
      getRequest("/api/filed/getAllFieldsByTableName",{tableName: this.tableName}).then(response=>{
        this.allFields = response.data;
      }).catch(error=>{
        this.open4("获取字段列表失败！")
      })
    },
     open4(msg) {
        this.$message.error(msg);
    },
     open2(msg) {
        this.$message({
          message: msg,
          type: 'success'
        });
    },
    exportData() {
      console.log('提交选择的字段：', this.selectedFields);
      this.exportDialogVisible = false; // 关闭导出对话框
      getRequest("/api/getTableDataByFields",{tableName: this.tableName, featureList: this.selectedFields.join(",")}).then(response=>{
        if(response.code!="200") this.open4("导出失败！")
        else {
          let blob = new Blob([response.data], { type: 'text/csv' });
          // 创建 Data URI
          const dataUri = window.URL.createObjectURL(blob);
          // 创建隐藏的 <a> 标签
          const link = document.createElement('a');
          link.href = dataUri;
          link.download = this.tableName+'_export.csv'; // 下载文件的名称
          // 将 <a> 标签添加到页面中并模拟点击
          document.body.appendChild(link);
          link.click();
          // 下载完成后移除 <a> 标签
          document.body.removeChild(link);

          this.open2("数据导出成功");
          }
      }).catch(error=>{
          this.open4("导出失败",error)
      })

    },
    headerCellStyle() {
      return {
        backgroundColor: "#f0f0f0",
        color: "#333",
        fontWeight: "bold",
        // 其他样式设置
      };
    },
    compelete() {
      // 判断多标签合理性
      let labelCount = 0;
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          if (this.featuresMap[key] == "label") {
            labelCount++;
          }
        }
      }
      if (labelCount < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请至少设置一个标签特征",
        });
        return false;
      }
      if (this.dialogForm.dataDisease != "多疾病" && labelCount > 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "只有多病种数据集能设置多个标签特征",
        });
        return false;
      }

      this.loadText2 = "正在添加字段类型";
      this.loading2 = true;
      let tableHeaders = [];
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          switch (this.featuresMap[key]) {
            case "diagnosis":
              tableHeaders.push({
                fieldName: key,
                isDiagnosis: "1",
              });
              break;
            case "examine":
              tableHeaders.push({
                fieldName: key,
                isExamine: "1",
              });
              break;
            case "pathology":
              tableHeaders.push({
                fieldName: key,
                isPathology: "1",
              });
              break;
            case "vital_signs":
              tableHeaders.push({
                fieldName: key,
                isVitalSigns: "1",
              });
              break;
            case "label":
              tableHeaders.push({
                fieldName: key,
                isLabel: "1",
              });
              break;
            default:
              break;
          }
        }
      }
      // let userId = sessionStorage.getItem("userid")-0;
      // 上传特征分类结果
      postRequest("/api/feature/insertFeature", {
        tableName: this.dialogForm.tableName,
        tableHeaders,
        // userId
      }).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
      });

      this.getCategory(); // 更新目录结构
    },
    changeLabel(name, label) {
      console.log("name: ");
      console.log(name);

      console.log("label:");
      console.log(label);

      this.featuresMap[name] = label;
    },
    confirmCharacter() {
      this.characterVisible = false;
      let index = this.addDataForm.characterList.indexOf(this.characterOptItem);
      let oldObj = this.addDataForm.characterList[index];
      for (let i = 0; i < this.characterOptList.length; i++) {
        let a = this.characterOptList[i];
        if (this.characterId == a.characterId) {
          oldObj.characterId = a.characterId;
          oldObj.featureName = a.featureName;
          oldObj.chName = a.chName;
          oldObj.type = a.type;
          oldObj.unit = a.unit;
          oldObj.range = a.range;
          oldObj.button = a.chName;
          oldObj.value = "";
          oldObj.opt = this.characterItem.opt;
        }
      }
      this.addDataForm.characterList[index] = oldObj;
      console.log(this.addDataForm.characterList);
      this.characterId = "";
    },

    // 数据表上传函数
    upRequest(data) {
      console.log("开始上传文件");
      const payload = new FormData();
      payload.append("file", data.file);
      payload.append("newName", this.dialogForm.tableName);
      payload.append("disease", this.dialogForm.dataDisease);
      payload.append("user", sessionStorage.getItem("username"));
      payload.append("uid", sessionStorage.getItem("userid") - 0);
      payload.append("parentId", this.nodeData.id);
      payload.append("parentType", this.nodeData.path);
      this.options = {
        method: "post",
        data: payload,
        url: "api/dataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      this.$axios(this.options).then((res) => {
        // 返回表头信息
        this.loading = false;
        console.log(res);
        if (res?.code == "200") {
          this.$message({
            showClose: true,
            type: "success",
            message: "解析成功",
          });
          console.log("返回数据为：");
          console.log(res);
          let featureList = res.data;
          // 把特征存为map的键
          for (const item of featureList) {
            this.$set(this.featuresMap, item, "diagnosis");
          }
          // this.featuresVision = true;
          this.dialogFormVisible = false;
          this.getCatgory();
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: "解析失败",
          });
        }
      });
    },
    getCatgory() {
      getCategory("/api/category").then((response) => {
        this.treeData = response.data;
      });
    },
    uploadFile() {
      console.log("开始上传文件");
      if (this.$refs["uploadRef"].uploadFiles.length < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择数据表",
        });
        return false;
      }
      this.checkTableName();
      if (!this.dialogForm.isOnly) {
        return false;
      }
      this.$refs["dialogFormRef"].validate((valid) => {
        if (valid) {
          this.loadText = "正在上传并解析文件";
          this.loading = true;
          this.$refs.uploadRef.submit();
        }
      });
    },
    getTableDescribe(id) {
      getTableDes("/api/tableDescribe", id)
        .then((response) => {
          this.showDataForm.createUser = response.data.createUser;
          this.showDataForm.createTime = response.data.createTime;
          this.showDataForm.classPath = response.data.classPath;
          this.tableData = [];
        })
        .catch((error) => {
          console.log("错误", error);
        });
    },
    getTableData(tableId, tableName) {
      this.tableName = tableName;
      this.dataPre = false;
      (this.tableData = []),
        getTableData("/api/getTableData", tableId, tableName)
          .then((response) => {
            // 获取表数据
            this.tableData = response.data;
            this.dataPre = true;
          })
          .catch((error) => {
            console.log(error);
          });
    },
    changeData(data) {
      if (data.isLeafs == 1) {
        (this.tableData = []),
          //获取描述信息
          this.getTableDescribe(data.id);
        //获取数据信息
        this.getTableData(data.id, data.label);
      }
    },
    append(isLeaf) {
      // 发送请求新增一个病种信息（目录结构）
      let catagoryNode = {
        label: this.diseaseName,
        catLevel: this.nodeData.catLevel + 1,
        parentId: this.nodeData.id,
        isLeafs: isLeaf,
        isCommon: this.nodeData.isCommon,
        path: this.nodeData.path + "/" + this.diseaseName,
        isDelete: 0,
        children: [],
      };

      let catagoryNodeJSON = JSON.stringify(catagoryNode);
      addDisease("/api/addDisease", catagoryNodeJSON)
        .then((response) => {
          if(response.code!=200){
            this.open3(response.msg)
          }else{
            this.getCatgory(); //刷新目录结构
            this.open2(response.msg)
          }
        })
        .catch((error) => {
          this.open4("新增疾病目录错误")
        });
      this.nodeData = {};
      this.cleanInput();
      this.dialogDiseaseVisible = false;
    },
    appendCommon() {
      const newChild = {
        id: id++,
        label: this.diseaseName,
        children: [],
        isLeafs: false,
        isCommon: true,
      };
      if (!this.nodeData.children) {
        this.$set(this.nodeData, "children", []);
      }
      this.nodeData.children.push(newChild);
      this.nodeData = {};
      this.cleanInput();
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
      removeCate("/api/category/remove", data)
        .then((response) => {
          // data就是要删除的目录信息
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    addDisease() {
      console.log("name:", this.diseaseName);
      let diseaseName = this.diseaseName;
      saveParentDisease("/api/addParentDisease", diseaseName)
        .then((response) => {
          if(response.code!=200){
            this.open3(response.msg)
          }else{
            this.getCatgory();
            this.open2(response.msg)
          }
          
        })
        .catch((error) => {});
      // const newNode = { id: id++, label: this.diseaseName, children: [] , isLeafs: false};
      // this.treeData.push(newNode);
      this.cleanInput();
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id]);
      }
    },

    markNode(data) {
      console.log(data);
      this.nodeData = data;
    },
    open3(msg) {
      this.$message({
        message: msg,
        type: "warning",
      });
    },

    cleanInput() {
      this.dialogDiseaseVisible = false;
      this.dialogDiseaseVisible2 = false;
      this.diseaseName = "";
    },
    cleanDataInput() {
      this.dialogDataVisible = false;
    },
    addTable() {
      // 创建表
      if (
        this.addDataForm.dataName == null ||
        this.addDataForm.dataName == ""
      ) {
        this.open3("请输入新建数据集名称！");
        return;
      }
      if (
        this.addDataForm.createUser == null ||
        this.addDataForm.createUser == ""
      ) {
        this.open3("请输入数据筛选操作员姓名！");
        return;
      }

      for (let i = 0; i < this.addDataForm.characterList.length; i++) {
        if (
          this.addDataForm.characterList[i].featureName == null ||
          this.addDataForm.characterList[i].featureName == ""
        ) {
          this.open3("请选择完整参与运算的特征！");
          return;
        }
        if (
          this.addDataForm.characterList[i].computeOpt == null ||
          this.addDataForm.characterList[i].computeOpt == ""
        ) {
          this.open3("请选择完整的运算符！");
          return;
        }
        if (
          i != 0 &&
          (this.addDataForm.characterList[i].opt == "" ||
            this.addDataForm.characterList[i].opt == null)
        ) {
          this.open3("请选择完整条件选择连接运算！");
          return;
        }
        if (
          this.addDataForm.characterList[i].value == null ||
          this.addDataForm.characterList[i].value == ""
        ) {
          this.open3("请输入完整条件的限定范围！");
          return;
        }
      }
      this.diseaseName = this.addDataForm.dataName;
      this.dialogDataVisible = false;
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/createTable",
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.$axios(this.options).then((res) => {
        console.log("数据:");
        console.log(res.data);
        this.getCatgory();
      });
      // this.append(1)
    },
    putToAddDataForm() {
      let number = -Math.floor(Math.random() * 100);
      let item = {
        opt: "",
        characterId: -1,
        featureName: "",
        chName: "",
        type: "",
        unit: "",
        range: "",
        removeIndex: number,
        button: "点击选择特征",
        value: "",
        computeOpt: "",
      };
      this.addDataForm.characterList.push(item);
    },
    deleteToAddDataForm(item) {
      let index = this.addDataForm.characterList.indexOf(item);
      if (index !== -1) {
        this.addDataForm.characterList.splice(index, 1);
      }
    },
    chooseCharacter(item) {
      this.exchangeCharacterList(0);
      this.characterVisible = true;
      this.characterOptItem = item;
    },
    submitCharacterCondition() {
      console.log("this.addDataForm.characterList");
      console.log(this.addDataForm.characterList);
      if (
        this.addDataForm.dataName == null ||
        this.addDataForm.dataName == ""
      ) {
        this.open3("请输入新建数据集名称！");
        return;
      }
      if (
        this.addDataForm.createUser == null ||
        this.addDataForm.createUser == ""
      ) {
        this.open3("请输入数据筛选操作员姓名！");
        return;
      }

      for (let i = 0; i < this.addDataForm.characterList.length; i++) {
        if (
          this.addDataForm.characterList[i].featureName == null ||
          this.addDataForm.characterList[i].featureName == ""
        ) {
          this.open3("请选择完整参与运算的特征！");
          return;
        }
        if (
          this.addDataForm.characterList[i].computeOpt == null ||
          this.addDataForm.characterList[i].computeOpt == ""
        ) {
          this.open3("请选择完整的运算符！");
          return;
        }
        if (
          i != 0 &&
          (this.addDataForm.characterList[i].opt == "" ||
            this.addDataForm.characterList[i].opt == null)
        ) {
          this.open3("请选择完整条件选择连接运算！");
          return;
        }
        if (
          this.addDataForm.characterList[i].value == null ||
          this.addDataForm.characterList[i].value == ""
        ) {
          this.open3("请输入完整条件的限定范围！");
          return;
        }
      }
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "api/filterTableData",
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("请求参数：" + JSON.stringify(filterConditions));
      this.$axios(this.options)
        .then((res) => {
          this.addTableData = res.data;
          console.log("数据:");
          console.log(this.addTableData);
          this.showAddTableData = true;
        })
        .catch((error) => {
          this.$message.error("获取数据失败");
          console.log("获取数据失败" + error);
        });
      let s = JSON.stringify(this.addDataForm.characterList, null, 2);
      console.log("this.addDataForm:");
      console.log(this.addDataForm);
      console.log(s);
    },
    getNowDateFormat() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    openAddDataForm(type) {
      this.addDataForm = {
        dataName: "",
        characterList: [
          {
            opt: "",
            characterId: -1,
            featureName: "",
            chName: "",
            type: "",
            unit: "",
            range: "",
            button: "点击选择特征",
            value: "",
            computeOpt: "",
          },
        ],
      };
      this.dialogDataVisible = true;
      this.showAddTableData = false;
      this.showDataForm.createUse = sessionStorage.getItem("username");
      this.showDataForm.createTime = this.getNowDateFormat();
      this.showDataForm.classPath = type;
    },
    exchangeCharacterList(index) {
      getFetures("/api/feature/getFeatures", index)
        .then((response) => {
          console.log("特征为：");
          console.log(response.data);
          this.characterOptList = response.data;
          console.log(this.characterList);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),
    getData(tablename) {
      this.DatadialogVisible = true;
      this.getData_loading = true;
      getRequest("/DataTable/getInfoByTableName", {
        tableName: tablename,
      }).then((res) => {
        this.patientTable = res.data;
        console.log("patientTable:" + res.data);
        this.getData_loading = false;
      });
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(row) {
      postRequest(`DataTable/delete/${row.id}`).then((res) => {
        this.SetDataList(res.reverse());
      });
    },
    clearFilter() {
      this.disease = "";
      this.creator = "";
    },
    importData() {
      this.dialogFormVisible = true;
    },

    handleSubmit() {
      console.log("文件上传中...");
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      //上传前的验证
      const isCSV =
        file.type === "text/csv" || file.type === "application/vnd.ms-excel";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isCSV) {
        this.$message.error("上传文件仅支持 CSV 格式");
      }
      // if (!isLt2M) {
      //     this.$message.error('上传文件大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
      return isCSV;
    },

    removeFileExtension(fileName) {
      // 寻找最后一个点号的位置
      const lastDotIndex = fileName.lastIndexOf(".");

      // 如果找到了点号并且不在文件名的开头或结尾
      if (
        lastDotIndex !== -1 &&
        lastDotIndex < fileName.length - 1 &&
        lastDotIndex > 0
      ) {
        // 返回删除了后缀的文件名部分
        return fileName.substring(0, lastDotIndex);
      } else {
        // 如果没有找到点号或者点号在文件名的开头或结尾，直接返回原文件名
        return fileName;
      }
    },

    changeFile() {
      console.log(this.$refs["uploadRef"].uploadFiles);
      if (this.dialogForm.tableName.length < 1) {
        this.dialogForm.tableName = this.removeFileExtension(
          this.$refs["uploadRef"].uploadFiles[0].name
        );
      }
    },
  },
};
</script>

<style scoped>
.dm_container {
  display: flex;
}
#top_buttons > * {
  display: inline-block;
}
.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#DiseaseFilter {
  margin-right: 40px;
}
#creatorFilter {
  margin-right: 20px;
}
#top_right_buttons {
  float: right;
  margin-right: 100px;
}
#table {
  margin-top: 10px;
}

.featureLabel {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}

.featureLabel .el-form-item__label {
  color: #252525;
}

.left_tree {
  height: 780px;
  width: 15%;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  border-bottom: none;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.right_table {
  height: 780px;
  width: 85%;
  border: none;
  /* overflow-y: auto; */
}

.right_table_topCard {
  padding: 0;
  height: auto;
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  /* top: 2%; */
  left: 1%;
  /* overflow-y: auto; */
}

.describe_content {
  display: inline-block;
  width: 70%;
}

.describe_content span {
  margin: 10px;
}

.add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.nameInput {
  width: 70%;
}

.addDataClass {
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 16px;
}
.addDataClass .el-input {
  width: 160px;
}
.addDataClass .addDataBaseInfo {
  margin-left: 50px;
}
.addDataClass .addDataTitle {
  margin-top: 10px;
  margin-right: 15px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.cool-button {
  display: inline-block;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(to right, #26acdf, #3ee09a);
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 200px;
  letter-spacing: 1px;
  cursor: pointer;
}

.cool-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}

.cool-button:hover {
  background: linear-gradient(to right, #51bae2, #80e7bb);
}

.cool-button:hover::before {
  transform: scaleX(1);
}
.custom-table tr {
  background-color: #dcf3fc !important;
}
.tableData {
  width: 100%;
  /* height: 650px;
  overflow: auto; */
}
.no-border-icon .el-icon-delete {
  border: none !important; /* 移除图标的边框 */
}

.export-dialog {
  max-width: 100%; /* 设置对话框的最大宽度 */
}

.checkbox-table {
  width: 100%; /* 表格宽度100% */
  border-collapse: collapse; /* 合并边框 */
}

.checkbox-table td {
  border: 1px solid #ebeef5; /* 设置表格边框 */
  padding: 10px; /* 设置单元格内边距 */
}

</style>
