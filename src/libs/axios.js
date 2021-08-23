/* eslint-disable space-before-function-paren */
/* eslint-disable no-undef */
import axios from 'axios'
import {
  getToken,
  isTokenExpired,
  getClientIp
} from '@/libs/util'
import router from '@/router'
import vm from '../main'
import store from '@/store'
import qs from 'qs'
getClientIp(function (ip) {})
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.timeout = 48000
class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      }
    }

    return config
  }
  
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      var ip = window.localStorage.getItem('Client-IP-Addrs')
      config.headers.common['Client-IP-Addrs'] = ip;
      // delayTip
    
      if(config.url.includes('memberExport')) axios.defaults.timeout=60000;
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: new Date().getTime()
        }
      }
      if (router.currentRoute.name !== 'login') {
        setHeaders(config)
      } else {
        // 针对导航接口特殊处理
        if (config.url.includes('getNavigateBar')) setHeaders(config)
      }

      function setHeaders(config) {
        if (isTokenExpired() || !getToken()) {
          vm.$Tip.info({
            content: '异常下线，请重新登录'
          })
          store.dispatch('handleLogOut')
          setTimeout(() => {
            router.push({
              name: 'login'
            })
          }, 500)
          return false
        }
        config.headers.Authorization = getToken()
        config.transformRequest = [function (data) {
          // 解决post请求的问题，用qs进行转换
          return qs.stringify(data)
        }]
      }
      return config
    }, error => {
      //console.log(error)
      if (error.response) {
        // console.log('error.response',error.response)
      } else if (error.request) {
        //console.log('error.request',error.request)
        if (error.request.readyState == 4 && error.request.status == 0) {
          //console.log(77777)
          //我在这里重新请求
        }
      } else {
        //console.log('Error', error.message);
      }
      // console.log(error.config)
      return Promise.reject(error)
    })
    // 响应拦截

    instance.interceptors.response.use(res => {
    
      res.headers.async = false;
      vm.endEditLoading()
      // res = res.data ? res.data : res
      const config = res.config
      res = res.data
      if (res.code === 200) {
     
        if (typeof res.data === 'string' && !instance.noShowTip) {
          // 全局的添加/修改/删除的提示，页面不需要做提示
          // 僅限活動綜合-网銀加贈判斷
          if(res.sign !== 'Tg\Http\V2\Controllers\Preferential\WangYinJiaZengController'){
            // vm.$Message.success(res.data)
          } else {
            vm.$Tip.success({
              content: res.data
            })
          }
        }
        return res
      } else if (res.code === 300) {
        vm.$Tip.info({
          content: res.message
        })
        store.dispatch('handleLogOut')
        // } else if (res.code === 304) {
        //   vm.$Tip.error({ content: res.message })
        //   store.dispatch('handleLogOut')
      } else if (res.code === 400) {
        // errorCode
        // 3001: '订单(自动出款)处理中, 当前订单已被锁定xxx秒 剩余xxx秒'
        // console.log(!instance.noShowTip)
        if (res.errorCode === 3001) {
          return Promise.resolve(res)
        }
        if (!instance.no400ErrorTip) {
          vm.$Tip.info({
            content: res.message
          })
        }
        return res
      } else if (res.code === 401) {
        vm.$Tip.info({
          content: res.message
        })
        setTimeout(() => {
          router.push({
            name: 'error_401'
          })
        }, 500)
      } else if (res.code === 404) {
        vm.$Tip.info({
          content: res.message
        })
        // setTimeout(() => {
        //   router.push({ name: 'error_404' })
        // }, 500)
      } else if (res.code === 500) {
        // console.log(22)
        vm.$Tip.info({
          content: '网络异常'
        })
        // setTimeout(() => {
        //   router.push({ name: 'error_500' })
        // }, 500)
      } else if (res.code === 5003 && !config.url.includes('/adminLogout')) {
        if (typeof res.message === 'string' && !instance.noShowTip) {
          vm.$Tip.info({
            content: res.message
          })
          store.dispatch('handleLogOut')
        }
      } else if (res.code === 5002 && !config.url.includes('/adminLogout')) {
        store.dispatch('handleLogOut')
      }
    }, error => {
      if (error.request.requestURL.indexOf('/remind') <= -1) {
        vm.$Tip.info({
          content: '网络异常，请稍后重试'
        })
      }
      vm.endTableLoading()
      vm.endEditLoading()
      return Promise.reject(error)
    })
  }
  request(options, noShowTip,delayTip, no400ErrorTip = false) {
   
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    instance.noShowTip = noShowTip
    instance.delayTip=delayTip
    instance.no400ErrorTip = no400ErrorTip
    return instance(options)
  }
}
export default HttpRequest