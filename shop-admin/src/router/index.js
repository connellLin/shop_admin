import Vue from "vue";
import Router from "vue-router";
import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import Role from "@/pages/Role";
import User from "@/pages/User";
import Category from "@/pages/Category";
import Specs from "@/pages/Specs/Specs";
import Goods from "@/pages/Goods";
import Member from "@/pages/Member";
import Banner from "@/pages/Banner";
import Seckill from "@/pages/Seckill";

// 懒加载
// let Layout = () => import("@/pages/Layout");
// let Login = () => import("@/pages/Login");
// let Index = () => import("@/pages/Index");

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "index",
          component: Index
        },
        {
          path: "menu",
          component: Menu
        },
        {
          path: "role",
          component: Role
        },
        {
          path: "user",
          component: User
        },
        {
          path: "category",
          component: Category
        },
        {
          path: "specs",
          component: Specs
        },
        {
          path: "goods",
          component: Goods
        },
        {
          path: "member",
          component: Member
        },
        {
          path: "banner",
          component: Banner
        },
        {
          path: "seckill",
          component: Seckill
        },
        {
          path: "*",
          redirect: "/index"
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  let userInfo = localStorage.getItem("userinfo")
    ? JSON.parse(localStorage.getItem("userinfo"))
    : false;

  if (userInfo) {
    if (to.path == "/login") {
      next(false);
    } else {
      next();
    }
  } else {
    if (to.path == "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
