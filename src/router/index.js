import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      meta: {
      	title: 'home',
        //keepAlive: true,
      },
      component: (resolve) => require(['../views/home.vue'], resolve)
    },
    {
      path: '/list',
      meta: {
      	title: 'list',
        //keepAlive: true,
      },
      component: (resolve) => require(['../views/list.vue'], resolve)
    },
    {
      path: '/restaurant/:id',
      meta: {
        title: 'restaurant',
        //keepAlive: true,
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
      path: '/profile/',
      meta: {
        title: 'profile'
      },
      component: (resolve) => require(['../views/profile.vue'], resolve)
    },
    {
      path: '/profile/:type',
      meta: {
        title: 'profile'
      },
      component: (resolve) => require(['../views/profile.vue'], resolve)
    },
    {
      path: '/checkout',
      meta: {
        title: 'checkout'
      },
      component: (resolve) => require(['../views/checkout.vue'], resolve)
    },
    {
      path: '/test',
      meta: {
        title: 'test'
      },
      component: (resolve) => require(['../views/test.vue'], resolve)
    },
    {
    	path: '*',
    	redirect: '/home'
    }
  ]
})
