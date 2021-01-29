<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="250px">
        <side-bar></side-bar>
      </el-aside>

      <el-container>
        <el-header
          style="
            background-color: #b3c0d1;
            text-align: right;
            line-height: 60px;
          "
        >
          <el-dropdown @command="command">
            <span class="el-dropdown-link">
              {{ username }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideBar from "@/components/SideBar";

export default {
  // data() {
  //   return {
  //     username: "",
  //   };
  // },

  // created() {
  //   let userinfo = JSON.parse(localStorage.getItem("userinfo"));
  //   console.log(userinfo);
  //   this.username = userinfo.username;
  // },

  components: {
    SideBar,
  },
  computed: {
    username() {
      return this.$store.state.userinfo.username;
    },
  },
  methods: {
    async command() {
      try {
        let confirm = await this.$confirm("您确定要登出吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        });
        if (confirm == "confirm") {
          localStorage.clear();
          this.$router.replace("/login");
        }
      } catch (error) {}
    },
  },
};
</script>

<style lang="">
.layout {
  height: 100%;
}
.layout .container {
  height: 100%;
}
</style>