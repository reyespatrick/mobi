import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import Params from '../views/Params.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/detail/:pgcId',
    name: 'detail',
    component: Detail,
    props: true
  },
  {
    path: '/settings',
    name: 'settings',
    component: Params
  }
]

const router = new VueRouter({
  routes
})

export default router
