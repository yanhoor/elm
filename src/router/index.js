import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      meta: {
      	title: 'home'
      },
      component: (resolve) => require(['../App.vue'], resolve)
    },
    {
    	path: '*',
    	redirect: '/home'
    }
  ]
})
