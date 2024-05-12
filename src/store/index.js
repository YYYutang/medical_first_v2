import Vue from 'vue'
import Vuex from 'vuex'
import storage from '../utils/storage'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    toolBar : true,
    allTableData:[],
    allColumnData:[],
    selectedNode:[],
    selectedColumns:[],
    selectedAlgo:'',
  },
  getters: {
    getAllTableData(state){
      state.allTableData=storage.get("allTableData");
      return state.allTableData;
    },
    getAllColumnData(state){
      state.allTableData=storage.get("allColumnData");
      return state.allColumnData;
    },
    getSelectedNode(state){
      state.selectedNode=storage.get("selectedNode");
      return state.selectedNode;
    },
  },
  mutations: {
    changeToolBar(state) {
      state.toolBar = !state.toolBar
      state.toolBar = !state.toolBar
    },
    setAllTableData(state,allTableData){
      state.allTableData=allTableData
      
    },
    setAllColumnData(state,allColumnData){
      state.allColumnData=allColumnData;
      console.log(this.allColumnData)
    }
  },
  actions: {
  },
  modules: {
  }
})
