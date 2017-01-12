import Vue from 'vue'
import VueRouter from 'vue-router'
import Category from '../views/Category'
import Thread from '../views/Thread'
import Search from '../views/Search'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/category/1' },
  { path: '/category/:id', component: Category, name: 'Category' },
  { path: '/thread/:id/page/:page', component: Thread, name: 'Thread' },
  { path: '/search', component: Search, name: 'Search' }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
  },
  linkActiveClass: 'uk-active'
})

export default router
