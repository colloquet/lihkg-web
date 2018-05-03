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
    { path: '/', redirect: '/topics/BW/1' },
    { path: '/index.html', redirect: '/topics/BW/1' },
    { path: '/topics/:catId', redirect: '/topics/:catId/1' },
    { path: '/view/:threadId', redirect: '/view/:threadId/1' },
    { path: '/:threadId', redirect: '/thread/:threadId/1' },
    { path: '/v/:threadId', redirect: '/view/:threadId/1' },
    { path: '/v/:threadId/page', redirect: '/view/:threadId/:page' },
    {
      path: '/topics/:catId/:page',
      name: 'CategoryView',
      component: CategoryView,
      props: true,
    },
    {
      path: '/view/:threadId/:page',
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
