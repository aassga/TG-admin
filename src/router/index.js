import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import iView from 'view-design'
import { getToken, setTitle } from '@/libs/util'
import store from '@/store'
import config from '@/config'
const { homeName } = config
Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    next({ name: LOGIN_PAGE_NAME })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    next()
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    next({ name: homeName })
  } else {
    next()
    // if (store.state.app.accessRoute.includes(to.name)) next()
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
