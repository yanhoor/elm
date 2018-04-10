import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      meta: {
      	title: 'home'
      },
      component: (resolve) => require(['../views/home.vue'], resolve)
    },
    {
      path: '/restaurant',
      meta: {
      	title: 'restaurant'
      },
      component: (resolve) => require(['../views/restaurant.vue'], resolve)
    },
    {
      path: '/login',
      meta: {
      	title: 'login'
      },
      component: (resolve) => require(['../views/login.vue'], resolve)
    },
    {
    	path: '*',
    	redirect: '/home'
    }
  ]
})
