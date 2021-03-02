// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";

// 样式重置
import "normalize.css";

// 引入element-ui
import ElementUI from "element-ui";
// 引入UI的样式
import "element-ui/lib/theme-chalk/index.css";

// 基础样式
import "@/assets/css/reset.css";

Vue.use(ElementUI);

Vue.directive("title", {
  inserted: function(el, binding) {
    document.title = el.dataset.title;
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
