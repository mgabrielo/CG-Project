import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FormView from "@/views/FormView.vue";
import { getUserDataById } from "@/core/getUserDataById";
import store from "@/store/index";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:userId",
    name: "form",
    component: FormView,
    beforeEnter: async (to, from, next) => {
      // TODO load the user data from getUserDataById and store it with VueX
      const userId = to.params.userId;
      if (userId !== undefined) {
        try {
          const result = await getUserDataById(userId);
          store.commit("setUser", result);
          next();
        } catch (error) {
          console.error("Failed to load user data:", error);
          next(false);
        }
      } else {
        next(); // proceed if there's no userId
      }
    },
  },
  {
    path: "/",
    component: FormView,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
