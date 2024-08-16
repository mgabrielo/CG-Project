import { initialUser } from "@/core";
import { getUserDataById } from "@/core/getUserDataById";
import { User } from "@/types";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: initialUser as User,
    userId: "",
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getUserId(state) {
      return state.userId;
    },
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setUserId(state, payload: string) {
      state.userId = payload;
    },
  },
  actions: {
    async fetchUser({ commit }, payload: string) {
      if (payload !== null) {
        const result = await getUserDataById(payload);
        commit("setUser", result);
      } else {
        commit("setUser", initialUser);
      }
    },
  },
  modules: {},
});
