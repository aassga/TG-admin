import axios from '@/libs/api.request'

export const borrowDataO = () => {
  return axios.request({
    url: 'get_mborrow_data_o',
    method: 'get'
  })
}
export const managementData = () => {
  return axios.request({
    url: 'get_management_data',
    method: 'get'
  })
}
export const overDueStatic = () => {
  return axios.request({
    url: 'get_over_due_static',
    method: 'get'
  })
}

export const levelMan = () => {
  return axios.request({
    url: 'get_level_man',
    method: 'get'
  })
}

export const codeMana = () => {
  return axios.request({
    url: 'get_code_man',
    method: 'get'
  })
}

export const logList = () => {
  return axios.request({
    url: 'get_log_list',
    method: 'get'
  })
}

export const activityBlackList = () => {
  return axios.request({
    url: 'get_activity_balck_list',
    method: 'get'
  })
}

export const lunboMangerList = () => {
  return axios.request({
    url: 'get_lunbo_manger',
    method: 'get'
  })
}

export const lunboMangerEdit = () => {
  return axios.request({
    url: 'get_lunbo_edit',
    method: 'get'
  })
}