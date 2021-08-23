/* eslint-disable space-before-function-paren */
/* eslint-disable camelcase */
import {
  login,
  logout,
  packetLogin
} from '@/api/user'
import {
  setToken,
  getToken,
  setAccessInLocal,
  getAccessFromLocal,
  setNowSiteInLocal,
  getNowSiteFromLocal,
  setUserName,
  setAdminId,
  setUserType
} from '@/libs/util'
import router from '@/router'

export default {
  state: {
    currentPremission: [],
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    siteClass:localStorage.getItem('siteClass') ? JSON.parse(localStorage.getItem('siteClass')) : null,
    loginType:null,
    token: getToken(),
    accessSite: getAccessFromLocal(),
    nowSite: getNowSiteFromLocal(),
    roleNames: null,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
    authMenu: localStorage['authMenu'] || '',
    authInPage: localStorage['authInPage'] || '',
    preferentialConfig: []
  },
  mutations: {
    setUserInfo(state, basic) {
      state.userInfo = basic
      setAdminId(basic.adminId)
      setUserName(basic.userName)
      setUserType(basic.type)
      localStorage.setItem('userInfo', JSON.stringify(basic))
    },
    setAccess(state, site) {
      state.accessSite = site
      setAccessInLocal(site)
    },
    setNowSite(state, site) {
      state.nowSite = site
      setNowSiteInLocal(site)
    },
    updateNowSite(state, site) {
      state.nowSite = site
      setNowSiteInLocal(site)
    },
    setRoleNames(state, name) {
      state.roleNames = name
    },
    setSiteClass(state, site_class){
      state.siteClass = site_class;
      localStorage.setItem('siteClass', JSON.stringify(site_class))
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setAuthMenu(state, authMenu) {
      localStorage['authMenu'] = state.authMenu = authMenu
    },
    setAuthInPage(state, authInPage) {
      localStorage['authInPage'] = state.authInPage = authInPage
    },
    setPreferentialConfig(state, data) {
      state.preferentialConfig = data
    }
  },
  actions: {
    // 登录
    handleLogin({ commit }, { userName, password, token }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password,
          token
        }).then(res => {
          if (res !== undefined && res.code === 200) {
            const { token, basic, site, roleNames, authMenu, authInPage,site_class } = res.data
            commit('setToken', token)
            commit('setUserInfo', basic)
            commit('setAccess', site)
            commit('setAuthMenu', authMenu)
            commit('setAuthInPage', authInPage)
            commit('setNowSite', site[0] || {})
            commit('setRoleNames', roleNames)
            commit('setSiteClass',site_class)
            packetLogin(true).then(res=>{
                if(res!=undefined&&res.code==200){
                  const {data}=res
                  localStorage.loginType=data
                }
              })
            resolve('success')

          } else resolve('error')
        }).catch(err => {
          reject(err)
        })

      })
    },
    // 退出登录
    handleLogOut(store) {
      return new Promise((resolve, reject) => {
        if (store.state.token) {
          store.state.token = ''
          logout(store.state.token, true).then(() => {
            store.state.token = ''
            store.commit('setToken', '')
            store.commit('setAccess', [])
            store.commit('setAuthMenu', '')
            store.commit('setAuthInPage', '')
            store.rootState.app.allMenu = {}
            setUserName('')
            localStorage.clear()
            sessionStorage.clear()
            router.push({ name: 'login' })
            resolve()
          }).catch(err => {
            store.state.token = ''
            store.commit('setToken', '')
            store.commit('setAccess', [])
            store.commit('setAuthMenu', '')
            store.commit('setAuthInPage', '')
            store.rootState.app.allMenu = {}
            setUserName('')
            localStorage.clear()
            sessionStorage.clear()
            router.push({ name: 'login' })
            reject(err)
          })
        } else {
          store.state.token = ''
          store.commit('setToken', '')
          store.commit('setAccess', [])
          store.commit('setAuthMenu', '')
          store.commit('setAuthInPage', '')
          store.rootState.app.allMenu = {}
          setUserName('')
          localStorage.clear()
          sessionStorage.clear()
          router.push({ name: 'login' })
        }
      })
    }
  }
}
