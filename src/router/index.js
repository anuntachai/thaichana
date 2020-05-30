import Vue from "vue";
import VueRouter from "vue-router";
//import store from "@/store";
import Register from "@/views/Register.vue";
import Scan from "@/views/Scan.vue";
import Shops from "@/views/Shops.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Shops,
  //   meta: { requiresAuth: true }
  // },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/scan",
    name: "Scan",
    component: Scan,
    meta: { requiresAuth: true }
  },
  {
    path: "/shops",
    name: "Shops",
    component: Shops,
    alias: "/",
    meta: { requiresAuth: true }
  },
  {
    path: "/test",
    name: "Test",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Test.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// router.beforeEach((to, from, next) => {
//   console.log(to);
//   if (to.meta.requiresAuth && !store.getters.isAuth) {
//     // redirect to register page if not authenticated in and trying to access a restricted page
//     console.log("Need register!!!!");
//     next("/register");
//   } else {
//     console.log("No need register!!!");
//     next();
//   }
// });

export default router;
