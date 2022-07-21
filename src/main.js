import Vue from "vue";
import App from "./App";

import store from "./store/store";
Vue.prototype.$store = store; //挂载再原型上，全局使用 例如这个，使用就是this.$store

Vue.config.productionTip = false;

App.mpType = "app";

const app = new Vue({
  store,
  render: (h) => h(App),
});
app.$mount();
