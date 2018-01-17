import Vue from 'vue'
import Router from 'vue-router'
import CategoryView from '@/views/CategoryView'
import ThreadView from '@/views/ThreadView'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  linkActiveClass: 'is-active',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (from.name === 'ThreadView' && to.name === 'ThreadView') {
      return false
    }

    return { x: 0, y: 0 }
  },
  routes: [
    { path: '/', redirect: '/category/1' },
    { path: '/thread/:threadId', redirect: '/thread/:threadId/page/1' },
    { path: '/:threadId', redirect: '/thread/:threadId/page/1' },
    { path: '/t/:threadId', redirect: '/thread/:threadId/page/1' },
    { path: '/t/:threadId/page', redirect: '/thread/:threadId/page/:page' },
    {
      path: '/category/:catId',
      name: 'CategoryView',
      component: CategoryView,
      props: true,
    },
    {
      path: '/thread/:threadId/page/:page',
      name: 'ThreadView',
      component: ThreadView,
      props: true,
    },
  ],
})

router.afterEach((to) => {
  if (window.ga) {
    window.ga('set', 'page', to.fullPath)
    window.ga('send', 'pageview')
  }
})

export default router
