/* eslint-disable camelcase */
import axios from '@/libs/api.request'

export const login = ({ userName, password, token }) => {
  const data = {
    userName,
    password,
    token
  }
  return axios.request({
    url: '/adminLogin',
    data,
    method: 'post'
  })
}

export const logout = (data, noShowTip) => {
  return axios.request({
    url: '/adminLogout',
    method: 'get',
    data
  }, noShowTip)
}

// 修改管理员密码
export const adminResetPassword = data => {
  let postData = {
    url: 'adminResetPassword',
    method: 'post',
    data
  }
  return axios.request(postData)
}

export const packetLogin =(noShowTip)  => {
  let postData = {
    url: 'getEnv',
    method: 'get',
  }
  return axios.request(postData,noShowTip)
}

//广告报表重置密码
export const adResetPassword = (data,noShowTip) => {
  let postData = {
    url: 'adResetPassword',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
