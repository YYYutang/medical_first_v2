<template>
  <div>
    <el-container class="con">
      <el-header class="header">
        <el-menu
          class="el-menu-demo"
          mode="horizontal"
          active-text-color="#ffd04b"
          background-color="#071135"
          @select="handleSelect"
        >
          <el-menu-item index="1" style="color: #5292d8; font-size: 20px"
            ><i class="el-icon-box"></i>人群队列数据特征表征软件</el-menu-item
          >
          <!--            <template slot="title">当前服务器：</template>-->
          <el-menu-item
            index="2"
            style="float: right; color: #fff; font-size: 14px"
            ><i class="el-icon-close"></i>退出登录</el-menu-item
          >
          <el-menu-item
            index="3"
            style="float: right; color: #fff; font-size: 14px"
            ><i class="el-icon-user"></i>欢迎你，{{ username }}</el-menu-item
          >
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="200px" class="side">
          <el-menu
            :default-active="activeMenu"
            router
            class="el-menu-vertical-demo"
            @open="handleOpen"
            background-color="#071135"
            text-color="#fff"
            active-text-color="#ffd04b"
            font-size="14px"
          >
            <template>
              <div v-for="item in visibleMenuItems" :key="item.name">
                <el-submenu
                  v-if="item.children && item.children.length"
                  :index="item.path"
                >
                  <template #title>
                    <i class="el-icon-menu"></i>
                    {{ item.name }}</template
                  >
                  <el-menu-item
                    v-for="subItem in item.children"
                    :key="subItem.name"
                    :index="subItem.path"
                  >
                    <i :class="subItem.icon"></i>
                    <router-link :to="subItem.path">{{
                      subItem.name
                    }}</router-link>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="item.path">
                  <template #title>
                    <router-link :to="item.path">
                      <i :class="item.icon"></i>
                      {{ item.name }}</router-link
                    >
                  </template>
                </el-menu-item>
              </div>
            </template>
            <div class="menu-footer">
              <el-menu-item index="/introduce"> 软件介绍</el-menu-item>
              <el-menu-item> 操作手册</el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <app-main></app-main>
        </el-main>
      </el-container>
      <el-footer>
        <h1>
          重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2023 All
          Rights Reserved
        </h1>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import AppMain from "@/components/AppMain";
import { postRequest, getRequest } from "@/utils/api";
export default {
  components: { AppMain },
  data() {
    return {
      activeMenu: "/introduce",
      dialogVisible: false,
      username: "",
      menuItems: [
        {
          name: "首页",
          path: "/dash",
          roles: ["0", "1"],
          icon: "el-icon-menu",
        },
        {
          name: "任务管理",
          path: "/taskManage",
         roles: ["0", "1"],
          icon: "el-icon-s-custom",
          children:[
            {
                name: "历史任务查看",
              path: "/taskManage",
          roles: ["0", "1"],
              icon: "el-icon-s-custom",
            },
             {
                name: "缺失值处理",
              path: "/completeMissing",
            roles: ["0", "1"],
              icon: "el-icon-s-custom",
            }, {
                name: "统计分析",
              path: "/stasticAnalyze",
         roles: ["0", "1"],
              icon: "el-icon-s-custom",
            }, {
                name: "特征表征",
              path: "/represent",
               roles: ["0", "1"],
              icon: "el-icon-s-custom",
            }, {
                name: "病人画像",
              path: "/visualization",
              roles: ["0", "1"],
              icon: "el-icon-s-custom",
            }
          ]
        },
        {
          name: "数据管理",
          path: "/dataManagePublic",
          roles: ["0","1"],
          icon: "el-icon-s-custom",
        },
        {
          name: "系统管理",
          path: "/manage",
          roles: ["0"],
          children: [
            {
              name: "用户管理",
              path: "/userManage",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "信息发布",
              path: "/inform",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "数据管理",
              path: "/dataManageManager",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "日志查看",
              path: "/operationManage",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "病种设置",
              path: "/illnessManage",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
          ],
        },
      ],
    };
  },
  computed: {
    visibleMenuItems() {
      const userRoles = sessionStorage.getItem("userrole");
      return this.menuItems.filter((item) => {
        const hasRole = item.roles.some((role) => userRoles.includes(role));
        if (hasRole && item.children) {
          // Filter children based on user roles
          item.children = item.children.filter((child) =>
            child.roles.some((role) => userRoles.includes(role))
          );
        }
        return hasRole;
      });
    },
  },
  created() {
    this.setMenuHighlight();
  },
  methods: {
    handleSelect(key) {
      if (key == 2) {
        postRequest("/user/logout").then((resp) => {
          if (resp.code == "200") {
            this.$router.replace("/");
          }
        });
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    getUserName() {
      console.log("in");
      getRequest("index/getUserInfo").then((resp) => {
        this.username = resp.data;
      });
    },
    setMenuHighlight() {
      // 如果有直接跳转，比如从一个外部链接或直接输入URL访问
      this.activeMenu = this.$route.path;
    },
  },
  watch: {
    // 监听路由变化来更新菜单高亮
    $route(newRoute) {
      this.activeMenu = newRoute.path;
    },
  },
  mounted() {
    this.getUserName();
  },
};
</script>

<style scoped>
a {
  color: inherit; /* 继承父元素颜色或指定颜色 */
  text-decoration: none; /* 去除下划线 */
}
.el-icon-mobile-phone {
  color: white;
}
.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  /*解决侧边栏凸起问题*/
  border-right: none;
  height: 100%;
}

.header {
  background-color: #071135;
  text-align: center;
  line-height: 60px;
}

.side {
  background-color: #071135;
  /* color: #333; */

  height: calc(100vh - 81px);
}

.main {
  height: calc(100vh - 81px);
}
.menu-footer {
  position: absolute;
  bottom: 0;
  margin-left: 40px;
}
.el-footer {
  height: 20px !important;
  font-size: 10px;
  background-color: #8e909794;
  color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .el-main {
    display: block;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
} */

.el-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
}
</style>
