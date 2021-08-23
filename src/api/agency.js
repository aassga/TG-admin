import axios from '@/libs/api.request'

// 获取代理等级列表
export const getAgencyLevelData = params => {
  let postData = {
    url: 'agencyLevelList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 可查询input框的数据来源
export const agencyGetName = data => {
  let postData = {
    url: 'agencyGetName',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 新增代理 获取代理的返点，返水设置
export const agencyRebatePlatform = data => {
  let postData = {
    url: 'agencyRebatePlatform',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 新增代理
export const agencyAdd = (data, noShowTip) => {
  let postData = {
    url: 'agencyAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理域名列表
export const agencyDomainList = data => {
  const { params, query } = data
  let postData = {
    url: 'agencyDomainList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 代理域名 改变状态
export const agencyDomanUpStatus = (data, noShowTip) => {
  let postData = {
    url: 'agencyDomainUpStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理域名 删除
export const agencyDomainDel = (data, noShowTip) => {
  let postData = {
    url: 'agencyDomainDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理域名 编辑
export const agencyDomainUpdate = (data, noShowTip) => {
  let postData = {
    url: 'agencyDomainUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理域名 代理添加单个域名
export const agencyDomainAdd = (data, noShowTip) => {
  let postData = {
    url: 'agencyDomainAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理域名 大股东批量添加域名
export const agencyDomainAddBatch = (data, noShowTip) => {
  let postData = {
    url: 'agencyDomainAddBatch',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理查询 列表
export const agencyList = data => {
  const { params, query } = data
  let postData = {
    url: 'agencyList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 代理域名 详情
export const agencyDomainDetails = data => {
  let postData = {
    url: 'agencyDomainDetails',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 异常域名
export const badDomainList = data => {
  const { params, query } = data
  let postData = {
    url: 'badDomainList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 异常域名编辑
export const updateBadDomain = (data, noShowTip) => {
  let postData = {
    url: 'updateBadDomain',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 邀请码管理列表
export const agencyInviteCodeList = data => {
  const { params, query } = data
  let postData = {
    url: 'agencyInviteCodeList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 代理邀请码 详情
export const agencyInviteCodeDetail = params => {
  let postData = {
    url: 'agencyInviteCodeDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 代理邀请码 编辑
export const agencyInviteCodeUpdate = (data, noShowTip) => {
  let postData = {
    url: 'agencyInviteCodeUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理邀请码 删除
export const agencyInviteCodeDel = (params, noShowTip) => {
  let postData = {
    url: 'agencyInviteCodeDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 代理邀请码修改状态
export const agencyInviteCodeModifyStatus = (data, noShowTip) => {
  let postData = {
    url: 'agencyInviteCodeModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 代理域名 批量修改下级
export const agencyDomainSubordinateUpdate = (data, noShowTip) => {
  let postData = {
    url: 'agencyDomainSubordinateUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
