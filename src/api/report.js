import axios from '@/libs/api.request'
// 平台报表
export const getplatformReportData = (data,delayTip)=> {
  let postData = {
    url: '/platformReports',
    method: 'post',
    data
  }
  return axios.request(postData,delayTip)
}

// 平台报表详情
export const getplatformReportsDetailData = (data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/platformReportsDetail',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

// 平台报表详情 按游戏
export const reportsByGameName = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'reportsByGameName',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//平台报表查询条件
export const getPlatformReportsSelect = data => {
  let postData = {
    url: '/platformReportsSelect',
    method: 'get',
    data
  }
  return axios.request(postData)
}

// 首存报表
export const getfirstReportData = (data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/firstDepositReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

// 彩票报表
export const getlotteryReportData = (data,delayTip) => {
  let postData = {
    url: '/lotteryReports',
    method: 'post',
    data
  }
  return axios.request(postData,delayTip)
}

// 彩票详情
export const getlotteryReportDetailData = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/lotteryReportsDetail',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 代理报表
export const getAgencyReportData =(data,delayTip)  => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/agencyReports',
    // url: '/agencyReportsV1',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 业绩报表
// export const reportsAgencyModeC = data => {
//   const { params, query } = data
//   let postData = {
//     url: '/reportsAgencyModeC',
//     method: 'post',
//     data: params
//   }
//   if (query) postData.params = query
//   return axios.request(postData)
// }
// 业绩报表
export const reportsAgencyModeC = data => {
  let postData = {
    url: '/reportsAgencyModeC',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// export const getAgencyReportData1 = data => {
//   const { params, query } = data
//   let postData = {
//     url: '/agencyReportsV1',
//     method: 'post',
//     data: params
//   }
//   if (query) postData.params = query
//   return axios.request(postData)
// }
// 会员报表
export const getMemberReportData = (data,delayTip )=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/memberReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

// 游戏记录
export const getgameRecordsDetailData = (data,delayTip)=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/gameRecordsDetail',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 综合报表
export const getmultipleReports = data => {
  let postData = {
    url: '/multipleReports',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 域名报表 列表数据
export const domainReports = (data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'domainReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 域名报表 按域名
export const domainReportsDetailByDomain = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'domainReportsDetailByDomain',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 域名报表 按人数
export const domainReportsDetailByUser = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'domainReportsDetailByUser',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 现金报表
export const dayReport = (data,delayTip)=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'dayReport',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 综合报表 存款详情 金额/人数
export const multipleReportsByDepositAmount = (data) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'multipleReportsByDepositAmount',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//综合报表留存
export const multipleReportsByKeep = (data) => {
  let postData = {
    url: 'multipleReportsByKeep',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 综合报表 取款详情 笔数
export const multipleReportsByWithdrawalsCount = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'multipleReportsByWithdrawalsCount',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 综合报表 存款详情 笔数
export const multipleReportsByDepositCount = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'multipleReportsByDepositCount',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 综合报表 取款详情 金额
export const multipleReportsByWithdrawalsAmount = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'multipleReportsByWithdrawalsAmount',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 游戏报表
export const platformReportsBySingle = data => {
  let postData = {
    url: 'platformReportsBySingle',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 游戏报表 详情
export const platformReportsDetailBySingle = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'platformReportsDetailBySingle',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 快速彩排行
export const fastLotteryTop = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'fastLotteryTop',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//会员报表-查看单会员 有效投注-输赢。优惠  总存款列表
export const getMemberReportsNext = data => {
  let postData = {
    url: '/memberReportsNext',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//审核会员优惠金额列表
export const bannedGameReportsMemberBonus= data => {
  let postData = {
    url: '/bannedGameReportsMemberBonus',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//风险用户详情
export const getMultipleReportsByRiskUser = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'multipleReportsByRiskUser',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//流失用户详情
export const getMultipleReportsByLossUser = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'multipleReportsByLossUser',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//竞价报表
export const biddingReports = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'biddingReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//竞价排序编辑，新增
biddingAffiliatedUser
export const biddingAffiliatedUser = data => {
  let postData = {
    url: 'biddingAffiliatedUser',
    method: 'post',
    data
  }
  return axios.request(postData,true)
}
//活动报表
export const getActivityReports = (data ,delayTip)=> {
  let postData = {
    url: 'activityReports',
    method: 'post',
    data
  }
  return axios.request(postData,delayTip)
}

//支付报表

export const paymentReports = (data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'paymentReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

//支付重试
export const paymentRetryReports = (data,delayTip)=> {
  const {params,query} = data
  let postData = {
    url: 'paymentRetryReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

// 在线会员
export const memberOnline = data => {
  let postData = {
    url: 'memberOnline',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//对打报表
export const getReportMutual = data => {
  const {params,query} = data
  let postData = {
    url: 'getReportMutual',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//对打报表详情
export const getReportMutualDetails = data => {
  let postData = {
    url: 'getReportMutualDetails',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//dayReportByDepositType
export const dayReportByDepositType = data => {
  let postData = {
    url: 'dayReportByDepositType',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 佣金报表
export const commissionReports = (data ,delayTip)=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'commissionReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

export const modeECommissionReports = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'modeECommissionReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//入款报表
export const reportBankAccountList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'reportBankAccountList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//站点报表
export const getReportSite =(data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'getReportSite',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

//广告报表-总报表
export const adReportList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'adReportList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// adDetailList
export const adDetailList =(data,delayTip)  => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'adDetailList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

//明细报表
export const adDetailSimpleList = data => {
  let postData = {
    url: 'adDetailSimpleList',
    method: 'post',
    data
  }
  return axios.request(postData)
}


//新增广告
// adDetailCreate
export const adDetailCreate = data => {
  let postData = {
    url: 'adDetailCreate',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//编辑广告
export const adDetailEdit =(data,noShowTip)  => {
  let postData = {
    url: 'adDetailEdit',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}


//删除报表

export const adDetailDelete = (data,noShowTip) => {
  let postData = {
    url: 'adDetailDelete',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}



//广告黑名单添加
export const adBlacklistCreate = data => {
  let postData = {
    url: 'adBlacklistCreate',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//黑名单列表
export const adBlacklistList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'adBlacklistList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//黑名单移除
export const adBlacklistDelete = (data,noShowTip) => {
  let postData = {
    url: 'adBlacklistDelete',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

export const adBlacklistEdit = (data,noShowTip) => {
  let postData = {
    url: 'adBlacklistEdit',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//总报表删除
export const adReportDelete = (data,noShowTip) => {
  let postData = {
    url: 'adReportDelete',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

// 倒计时
export const adReportCountdown = params => {
  let postData = {
    url: '/adReportCountdown',
    method: 'get',
    params
  }
  return axios.request(postData)
}
//广告报表延展密码

export const adVerifyPassword = (data,noShowTip) => {
  let postData = {
    url: 'adVerifyPassword',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//月报表


export const adReportMonthlyList =(data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'adReportMonthlyList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

//广告报表密码是否已经设置
export const adAssertSetPassword = params => {
  let postData = {
    url: '/adAssertSetPassword',
    method: 'get',
    params
  }
  return axios.request(postData)
}
//期末表
export const adReportLastList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'adReportLastList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 营运报表
// --日報表
export const operationDayReport = (data,delayTip)=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'operationDayReport',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// --小时报表
export const operationHourReport = (data,delayTip)=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'operationHourReport',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// --同期比较
export const operationHourCompareReport = (data,delayTip)=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'operationHourCompareReport',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}