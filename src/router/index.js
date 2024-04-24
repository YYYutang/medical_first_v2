import Vue from 'vue'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import represent from "@/views/represent/index.vue";
// import represent from "@/views/represent.vue";
import visualization from "@/views/visualization.vue";
import introduce from "@/views/introduce/introduce.vue"
import logIn from "@/views/User/Login.vue"
import register from "@/views/User/register.vue"
import forget from "@/views/User/forget.vue"
import unauthorized from "@/views/404.vue"
import operationManage from "@/views/manageAll/operationManage.vue"
import completeMissing from "@/views/completeMissing/index.vue"
import characterChoose from "@/components/characterChoose/index.vue"
import datasetChoose from "@/components/datasetChoose/index3.vue"
import missingalgo from "@/views/completeMissing/algo.vue"
import missingoutcome from "@/views/completeMissing/outcome.vue"
import stasticAnalyze from "@/views/stasticAnalyze/index.vue"
import describeAnalyze from "@/views/stasticAnalyze/describeAnalyze/index.vue"
import describeOutcome from "@/views/stasticAnalyze/describeAnalyze/outcome.vue"
import columnManage2 from "@/views/tableManage.vue"
import dataManagePublic from "@/views/dataManageNormal.vue"
import taskManage from "@/views/taskManage.vue"
import taskInfo from "@/components/TaskInfo.vue"
import consistencyAnalyze from "@/views/stasticAnalyze/consistencyAnalysis/index.vue"
import singleAnalyze from "@/views/stasticAnalyze/singleFactorAnalyze/index.vue"

import consistencyOutcome from "@/views/stasticAnalyze/consistencyAnalysis/outCome.vue"
import singleOutcome from "@/views/stasticAnalyze/singleFactorAnalyze/outCome.vue"
import userManage from "@/views/manageAll/userManage.vue"
import inform from "@/views/manageAll/inform.vue"
import dataManageManager from "@/views/manageAll/AdminDataManage.vue"
import illnessManage from "@/views/manageAll/illnessManage.vue"
import userCenter from "@/views/User/userCenter.vue"
import representAlgo from "@/views/represent/algo.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'logIn',
    component: logIn
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/forget',
    name: 'forget',
    component: forget
  },
  {
    path: '/first',
    redirect: '/introduce',
    name: 'first',
    component: SideBar,
    meta: { roles: ['1', '0'] }, // 只允许管理员和普通用户访问
    children: [{
      path: '/dash',
      name: 'dash',
      component: dash,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/represent',
      name: 'represent',
      component: represent,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/representAlgo',
      name: 'representAlgo',
      component: representAlgo,
      meta: { roles: ['1', '0'] },
    }, {
      path: '/visualization',
      name: 'visualization',
      component: visualization,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/dataManagePublic',
      name: 'dataManagePublic',
      component: dataManagePublic,
      meta: { roles: ['1', '0'] },
    },
    {
      path:'/manage',
      redirect: '/userManage',
      name: 'manage',
      meta: { roles: ['1', '0'] }, 
    },
    {
      path: '/userManage',
      name: 'userManage',
      component: userManage,
      meta: { roles: ['0'] },
    },
    {
      path: '/inform',
      name: 'inform',
      component: inform,
      meta: { roles: ['0'] },
    },
    {
      path: '/illnessManage',
      name: 'illnessManage',
      component: illnessManage,
      meta: { roles: ['0'] },
    },
    {
      path: '/dataManageManager',
      name: 'dataManageManager',
      component: dataManageManager,
      meta: { roles: ['0'] },
    },
    {
      path: '/taskManage',
      name: 'taskManage',
      component: taskManage,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/introduce',
      name: 'introduce',
      component: introduce,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/operationManage',
      name: 'operationManage',
      component: operationManage,
      meta: { roles: ['0'] },
    },
    {
      path: '/columnManage2',
      name: 'columnManage2',
      component: columnManage2,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/completeMissing',
      name: 'completeMissing',
      component: completeMissing,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/characterChoose',
      name: 'characterChoose',
      component: characterChoose,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/datasetChoose',
      name: 'datasetChoose',
      component: datasetChoose,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/missingalgo',
      name: 'missingalgo',
      component: missingalgo,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/missingoutcome',
      name: 'missingoutcome',
      component: missingoutcome,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/stasticAnalyze',
      name: 'stasticAnalyze',
      component: stasticAnalyze,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/describeAnalyze',
      name: 'describeAnalyze',
      component: describeAnalyze,
      meta: { roles: ['1', '0'] },
    },

    {
      path: '/describeOutcome',
      name: 'describeOutcome',
      component: describeOutcome,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/consistencyOutcome',
      name: 'consistencyOutcome',
      component: consistencyOutcome,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/singleOutcome',
      name: 'singleOutcome',
      component: singleOutcome,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/taskInfo',
      name: 'taskInfo',
      component: taskInfo,
      meta: { roles: ['1', '0'] },
    },

    {
      path: '/consistencyAnalyze',
      name: 'consistencyAnalyze',
      component: consistencyAnalyze,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/singleAnalyze',
      name: 'singleAnalyze',
      component: singleAnalyze,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: unauthorized,
      meta: { roles: ['1', '0'] },
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter,
      meta: { roles: ['1', '0'] },
    },

    ]
  },
]
const whiteList = ['/logIn', '/register', '/unauthorized','/forget']

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    // 如果在白名单中，则直接放行
    next()
  } else {
    const userRoles = sessionStorage.getItem('userrole'); // 从sessionStorage获取用户角色信息
    let record = to.matched[to.matched.length - 1]
    let isAuthorized = false; // 初始化权限标志为false

    if (record.meta.roles) {
     
      // 检查用户角色是否在路由允许的角色列表中
      if (record.meta.roles.includes(userRoles)) {
        isAuthorized = true; // 如果找到匹配的角色，设置权限标志为true
      }
    }
    if (isAuthorized) {
    
      next(); // 用户有权限，允许访问
    } else if (to.matched.some(record => record.meta.roles)) {
   
      next({ path: '/unauthorized' }); // 用户无权限，重定向到未授权页面
    } else {
     
      next(); // 如果没有定义roles元数据，允许所有用户访问
    }
  }
});

export default router
