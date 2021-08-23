import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import info from './module/info'
import report from './module/report'
import member from  './module/member'
import system from  './module/system'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    user,
    app,
    info,
    report,
    member,
    system
  }
})
