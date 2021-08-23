import axios from '@/libs/api.request'

export const getTodayReport = () => {
  return axios.request({
    url: 'get_today_report',
    method: 'get'
  })
}

export const getSevenDaysReport = () => {
  return axios.request({
    url: 'get_seven_days_report',
    method: 'get'
  })
}

export const getSummaryReport = () => {
  return axios.request({
    url: 'get_summary_report',
    method: 'get'
  })
  // eslint-disable-next-line eol-last
}