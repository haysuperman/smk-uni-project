import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    state: false,
  },
  getters: {
    getState(state) {
      return state.state;
    },
  },
  mutations: {
    setState(state, isState) {
      state.state = isState;
    },
  },
});

export default store;
