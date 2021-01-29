import Vue from "vue";
import Vuex from "vuex";
import specs from "./modules/specs";
import { http } from "@/utils/http";
import router from "@/router";
import { Message } from "element-ui";

Vue.use(Vuex);

let store = new Vuex.Store({
  strict: true,
  modules: {
    specs
  },
  state: {
    userinfo: localStorage.getItem("userinfo")
      ? JSON.parse(localStorage.getItem("userinfo"))
      : {}
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userinfo = payload;
    }
  },
  actions: {
    login({ commit }, ruleForm) {
      http.post("/userlogin", ruleForm).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          commit("setUserInfo", res.data.list);
          localStorage.setItem("userinfo", JSON.stringify(res.data.list));
          router.replace("/index");
        } else {
          Message.error(res.data.msg);
        }
      });
    }
  }
});

export default store;
