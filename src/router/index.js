import Vue from 'vue'
import VueRouter from 'vue-router'
import Category from '../views/Category'
import Thread from '../views/Thread'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/category/1' },
  { path: '/category/:id', component: Category, name: 'Category' },
  { path: '/thread/:id', component: Thread, name: 'Thread' },
  { path: '/thread/:id/page/:page', component: Thread, name: 'Thread' }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  linkActiveClass: 'uk-active'
})

export default router
