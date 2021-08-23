import {
  setTagNavListInLocalstorage,
  // getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  getToken
} from '@/libs/util'
import {
  getNavigateBar
} from '@/api/common'
import beforeClose from '@/router/before-close'
import router from '@/router'
import routers from '@/router/routes'
import config from '@/config'
const {
  homeName
} = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    rentType: localStorage.loginType,
    tagNavList: [],
    homeRoute: {},
    activeMenu: localStorage.activeMenu || 'member',
    allMenu: localStorage.allMenu ? JSON.parse(localStorage.allMenu) : {},
    addSubMoney: false,
    passwordStatus:false,
    refreshBalance: {
      count: 0
    },
    arr:[],
    menuItem: {
      name: '',
      count: 1
    },
    nowActive: '',
    depositPreferentialType: null, // 发放的类型
    preferentialConfig:null,
    singleLotteryArray: localStorage.singleSite ? JSON.parse(localStorage.singleSite) : [],
    showPreIds: localStorage.showPreIds ? JSON.parse(localStorage.showPreIds) : [],
    accessRoute: localStorage.accessRoute ? JSON.parse(localStorage.accessRoute) : []
  },
  mutations: {
    successDomainList(state,arr){
      state.arr=arr;
  },
    setAccessRoute(state, data) {
      state.accessRoute = data
      localStorage.accessRoute = JSON.stringify(data)
    },
    setDepositPreferentialType(state, val) {
      state.depositPreferentialType = val
    },
    setPreferentialConfig(state,val){
      // console.log(val)
      state.preferentialConfig=val;
    },
    setNowActive(state, nowActive) {
      state.nowActive = nowActive
    },
    refreshMoneyDone(state, refreshBalance) {
      state.refreshBalance = refreshBalance
    },
    // 修复加减款关闭样式错误显示
    refreshMenuItem(state, name) {
      if (name) state.menuItem.name = name
      else state.menuItem.count++
    },
    showAddSubMoney(state, status) {
      state.addSubMoney = status
    },
    //广告报表密码弹框
    showPasswordAdvModals(state,passwordStatus){
      state.passwordStatus=passwordStatus;
    },
    setAllMenu(state, menu) {
      state.allMenu = menu
      localStorage.allMenu = JSON.stringify(menu)
    },
    setActiveMenu(state, route) {
      if (typeof route === 'string') {
        state.activeMenu = route
        localStorage.activeMenu = route
      } else {
        const {
          path
        } = route
        let pathKey = path.split('/')[1]
        let excludeRoutes = ['home'] // 不再主路由的路由
        pathKey = excludeRoutes.includes(pathKey) ? 'member' : pathKey
        state.activeMenu = pathKey
        localStorage.activeMenu = pathKey
      }
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList(state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      let homeTagIndex = tagList.findIndex(item => item.name === homeName)
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag(state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      if (route.meta && route.meta.beforeCloseName && route.meta.beforeCloseName in beforeClose) {
        new Promise(beforeClose[route.meta.beforeCloseName]).then(close => {
          if (close) {
            closePage(state, route)
          }
        })
      } else {
        closePage(state, route)
      }
    },
    addTag(state, {
      route,
      type = 'unshift'
    }) {
      let router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setSingleLotteryArray(state, data) {
      state.singleLotteryArray = data
      localStorage.singleSite = JSON.stringify(data)
    },
    setAuthInPage(state, button) {
      state.authInPage = button
      localStorage.authInPage = JSON.stringify(button)
    },
    showPre(state, ids) {
      state.showPreIds = ids
      localStorage.showPreIds = JSON.stringify(ids)
    },
  },
  actions: {
    // 写的太麻烦了但是不想改组件,可以再简洁一点
    getNewRoute(store, that) {
      let accessSite = store.rootState.user.accessSite
      let siteId = store.rootState.user.accessSite && store.rootState.user.accessSite[0].id
      return new Promise((resolve, reject) => {
        let token = getToken()
        if (!token) return
        let routes = Object.values(routers)
        getNavigateBar({
          siteId
        }).then(res => {
          if (res !== undefined && res.code === 200 && !res.data.code) {
            // 没同步最新代码 过滤字段
            // 管理员给用户设置的空权限  前端
            if (res.data.button.length === 0) {

              that.$Spin.hide()
              that.$Tip.info({
                content: '您尚未配置任何权限,请联系超管'
              })
              localStorage.clear()
              that.$router.push({
                name: 'login'
              })
            } else {
              // let preRouteList = [] // 存款优惠的数组
              store.commit('setAuthInPage', res.data.button)
              let newRoutes = []
              let arr = []
              res.data.bar && res.data.bar.forEach(htjk => {
               
                // htjk.singleSiteIds && htjk.singleSiteIds.forEach(siteId => {
                //   arr.push(siteId)
                // })
                // store.commit('setSingleLotteryArray', arr)
                let target = routes.filter(item => item.meta.title === htjk.menu_name)[0] // 一级菜单及下属数据
                // 没有二级菜单不显示
                if (target.baseChildren) {
                  target.children = target.baseChildren
                }
                if (Object.keys(htjk).length < 2) {
                  if (htjk.menu_name === target.meta.title) {
                    target.meta.hideInTop = true
                  }
                } else {
                  if (htjk.menu_name === target.meta.title) {
                    target.meta.hideInTop = false
                  }
                }
                target.newChild = []
                target.children && target.children.forEach(v => {
                  v.newChild = []
                })
                // 普通二级菜单
                if (htjk.list) {
                  htjk.list.forEach(htKey => {
                    if (target.baseChildren) {
                      target.children = target.baseChildren
                    }
                    target.children && target.children.forEach(sideMenu => {
                      if (sideMenu.routeKey === htKey) { // 匹配上的可以显示的二级菜单
                        target.newChild.push(sideMenu)
                      }
                    })
                  })
                  // 活动管理和系统配置的三级菜单
                } else {
                  for (let key in htjk) {
                    if (key !== 'menu_name') { // 匹配特殊情况下的二级菜单
                      if (target.baseChildren) {
                        target.children = target.baseChildren
                      }
                      target.children && target.children.forEach(secondMenu => {
                        if (key === secondMenu.routeKey) {
                          target.newChild.push(secondMenu) // 有权限的二级菜单
                          htjk[key].forEach(htKey => { // htkey对应三级菜单的routekey,key对应二级菜单关键字
                            if (secondMenu.baseChildren) {
                              secondMenu.children = secondMenu.baseChildren
                            }
                            secondMenu.children && secondMenu.children.forEach(thirdMenu => {
                              if (htKey.length === 1 && thirdMenu.routeKey === htKey[0]) {
                                secondMenu.newChild.push(thirdMenu)
                              } else if (htKey.length > 1) {
                                htKey.forEach(y => {
                                  if (thirdMenu.routeKey === y) secondMenu.newChild.push(thirdMenu)
                                })
                              }
                            })
                          })
                        }
                      })
                    }
                  }
                }
                newRoutes.push(target)
              })
              newRoutes.forEach(item => {
                item.newChild.forEach(second => {
                  if (second.newChild) {
                    second.baseChildren = second.children
                    second.children = second.newChild
                  }
                })
                item.baseChildren = item.children
                item.children = item.newChild
              })
              let obj = {}

              newRoutes.forEach(item => {
                obj[item.name] = item
              })
              let local = JSON.parse(localStorage.nowSite)
              let modeName = accessSite.find(t => +(t.id) === +(local.id)).personal_commission_mode
              obj.member.children && obj.member.children.forEach(item => {
                if (modeName === 'mode_c') {
                  if (item.name === 'memberWageConfigList' || item.name === 'memberProfitConfigList') that.$set(item.meta, 'hideInMenu', true)
                }
                if (modeName == 'mode_c') {
                  if (that != undefined) {
                    if (item.name === 'performanceConfigList') that.$set(item.meta, 'hideInMenu', false)
                  }
                }
              });
          
              //竞价统计---mode_c，mode_d_a，mode_d_b 显示
              // obj.report.children && obj.report.children.forEach(item => {
              //   if (modeName == 'mode_c'||modeName=='mode_d_a'||modeName=='mode_d_b') {
              //     if ( item.name === 'biddingReports') that.$set(item.meta, 'hideInMenu', false)
              //   }
              // });

              obj.finance.children && obj.finance.children.forEach(item => {
                if (modeName === 'mode_c') {
                  if (item.name === 'agencyWage' || item.name === 'agencyShareoutbonus') that.$set(item.meta, 'hideInMenu', true)
                }
              })
              //竞价排序---mode_c，mode_d_a，mode_d_b 显示
              // obj.system.children && obj.system.children.forEach(item => {
              //   item.children && item.baseChildren.forEach(m => {
              //     console.log(modeName)
              //     if (modeName == "mode_c"||modeName=='mode_d_a'||modeName=='mode_d_b') {
              //       if (m.name == 'siteBiddingList') {
              //         that.$set(m.meta, 'hideInMenu', false)
              //       }
              //     }
              //   })
              // })
              //刷新
             
              obj.report.children && obj.report.children.forEach(item => {
                item.children && item.children.forEach(m => {
                  if (modeName == "mode_c") {
                    if (m.name == 'reportsAgencyModeC') {
                      that.$set(m.meta, 'hideInMenu', false)
                    }
                  }
                })
              })
              // obj.activity.children && obj.activity.children.forEach(item => {
              //   item.children && item.children.forEach(m => {
              //     if (modeName == "mode_c") {
              //       if (m.name == 'packList') {
              //         that.$set(m.meta, 'hideInMenu', false)
              //       }
              //     }
              //   })
              // })
      



              // obj.system.children&&obj.system.children.forEach(item=>{
              //   if(localStorage.rentType=='rent'){
              //      if(item.name=="lotterysManagement")that.$set(item.meta,'hideInMenu',true)
              //      if(item.name=="siteManagement"){
              //       item.newChild.forEach(t=>{
              //         if(t.name=="siteRepairConfigList"||t.name=="siteRepairConfigList"||t.name=="paymentJigsawManagementList"||t.name=='siteRepairConfigList'){
              //           that.$set(item.meta,'hideInMenu',true)
              //         }
              //       })
              //     }
              //     if(item.name=="gameManagement"){
              //         item.newChild.forEach(t=>{
              //         if(t.name=="gameMaintain"){
              //           that.$set(item.meta,'hideInMenu',true)
              //         }
              //         })
              //     }
              //     if(item.name=="message"){
              //       item.newChild.forEach(t=>{
              //         if(t.name=="adminMassageSendList"){
              //           that.$set(item.meta,'hideInMenu',true)
              //         }
              //       })
              //     }
              //   }
              // })

              obj.system.children && obj.system.children.forEach((item) => {
                if (item.path === 'lotterysManagement') {
                  accessSite.forEach(y => {
                    if (y.id === local.id && y.fastLotteryModel === 'single') {
                      item.children.forEach(nav => {
                        if (nav.name === 'setFastLottery') nav.meta.hideInMenu = false
                       
                      })
                    } else if (y.id === local.id && y.fastLotteryModel === 'multiple') {
                      item.children.forEach(nav => {
                        if (nav.name === 'setFastLottery') nav.meta.hideInMenu = true
                      })
                    }
                  })
                }
              })

              // obj.system.children && obj.system.children.forEach((item) => {
              //   if (item.path === 'lotterysManagement') {
              //     accessSite.forEach(y => {
              //       if (y.id === local.id && y.fastLotteryModel === 'single') {
              //         item.children.forEach(nav => {
              //           if (nav.name === 'singleFastLottery') nav.meta.hideInMenu = false
              //           if (nav.name === 'fastLottery') nav.meta.hideInMenu = true
              //         })
              //       } else if (y.id === local.id && y.fastLotteryModel === 'multiple') {
              //         item.children.forEach(nav => {
              //           if (nav.name === 'singleFastLottery') nav.meta.hideInMenu = true
              //           if (nav.name === 'fastLottery') nav.meta.hideInMenu = false
              //         })
              //       }
              //     })
              //   }
              // })
              let access = []
              for (let key in obj) {
                if (key=='report'||key === 'activity' || key === 'system') {
                  obj[key].newChild && obj[key].newChild.forEach(t => {
                    t.newChild && t.newChild.forEach(k => {
                      access.push(k.name)
                    })
                  })
                } else {
                  obj[key].newChild && obj[key].newChild.forEach(t => {
                    access.push(t.name)
                  })
                }
              }
              store.commit('setAccessRoute', access)
              // obj.activity.children && obj.activity.children.forEach(ya => {
              //   if (ya.path === 'discountActivity') {
              //     ya.newChild && ya.newChild.forEach(ng => {
              //       if (ng.name === 'preferentialList') {
              //         ng.meta.hideInMenu = !preRouteList.includes(local.id)
              //         if (ng.meta.hideInMenu) {
              //           let newTag = []
              //           getTagNavListFromLocalstorage().forEach(tag => {
              //             if (tag.name !== 'preferentialList') newTag.push(tag)
              //             else store.commit('closeTag', tag)
              //           })
              //           store.commit('setTagNavList', newTag)
              //         }
              //       }
              //     })
              //   }
              // })
              if (that) {
                that.$router.push({
                  name: that.$config.homeName
                })
                that.$Spin.hide()
              }
              store.commit('setAllMenu', obj)
            }
          } else if (res !== undefined && res.code === 200 && res.data.code === 400) { // 后台直接没配权限 数据库
            that.$Spin.hide()
            that.$Tip.info({
              content: res.data.message
            })
            localStorage.clear()
            that.$router.push({
              name: 'login'
            })
          }
          resolve()
        }).catch(error => {
          that.$Spin.hide()
          reject(error)
        })
      })
    }
  }
}