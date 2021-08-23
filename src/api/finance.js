import axios from '@/libs/api.request'
// 存取款审核-锁定
export const auditLock = (data) => {
  let postData = {
    url: 'auditLock',
    method: 'post',
    data
  }
  return axios.request(postData)
}



// 存取款审核-解锁
export const auditUnlock = (data) => {
  let postData = {
    url: 'auditUnlock',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 在线支付-列表
export const depositOnlineList = data => {
  const { params, query } = data
  let postData = {
    url: 'depositOnlineList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 公司入款-列表
export const depositOfflineList = (data,delayTip) => {
  const { params, query } = data
  let postData = {
    url: 'depositOfflineList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 货币入款-列表
export const depositVirtualList = (data,delayTip) => {
  const { params, query } = data
  let postData = {
    url: 'depositVirtualList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 存款审核
export const depositAuditData = (data, noShowTip) => {
  let postData = {
    url: 'depositAudit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// ------------线上取款-----------
// virtualSearchList
export const virtualSearchList = params => {
  let postData = {
    url: 'virtualSearchList',
    method: 'get',
    params
  }
  return axios.request(postData)
}

//货币取款
export const virtualWithdrawalsList = (data,delayTip) => {
  const { params, query } = data
  let postData = {
    url: 'virtualWithdrawalsList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

//货币取款审核
export const virtualWithdrawalsAudit = (data, noShowTip) => {
  let postData = {
    url: 'virtualWithdrawalsAudit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// virtualWithdrawalsDetail
export const virtualWithdrawalsDetail = params => {
  let postData = {
    url: 'virtualWithdrawalsDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 线上取款列表
export const withdrawalsListData =( data,delayTip) => {
  const { params, query } = data
  let postData = {
    url: 'withdrawalsList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

// 线上取款的详情
export const withdrawalsDetail = (params, noShowTip) => {
  let postData = {
    url: 'withdrawalsDetail',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}

// 线上取款的投注的信息
export const platformBetTotal = params => {
  let postData = {
    url: 'platformBetTotal',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 更新子訂單訂單狀態
export const withdrawalsSubEdit = (data, noShowTip) => {
  let postData = {
    url: 'withdrawalsSubEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 子訂單提交審核(補單)
export const withdrawalsSubAudit = (data, noShowTip, delayTip, no400ErrorTip) => {
  let postData = {
    url: 'withdrawalsSubAudit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip, delayTip, no400ErrorTip)
}

// 打码详情
export const checkBetAmount = params => {
  let postData = {
    url: 'checkBetAmount',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 提款审核
export const withdrawalsAudit = (data, noShowTip) => {
  let postData = {
    url: 'withdrawalsAudit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//可用自动出款平台列表
export const automaticWithdrawalEnableList = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalEnableList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 催账记录
export const emergencyLogListData = data => {
  const { params, query } = data
  let postData = {
    url: 'emergencyRecord',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 第三方游戏转账记录
export const transferLogListData = data => {
  const { params, query } = data
  let postData = {
    url: 'transferRecord',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// ----------入款卡管理 ----------

// 银行卡管理列表
export const companyBankCardListData = data => {
  const { params, query } = data
  let postData = {
    url: 'companyBankCardList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 银行卡排序
export const companyBankCardSequence = (data, noShowTip) => {
  let postData = {
    url: 'companyBankCardSequence',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 扫码排序
export const QRCodeSequence = (data, noShowTip) => {
  let postData = {
    url: 'QRCodeSequence',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 银行卡管理修改状态
export const companyBankCardModifyStatusData = (data,noShowTip) => {
  let postData = {
    url: 'companyBankCardModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 银行卡管理删除
export const companyBankCardDelete = (params, noShowTip) => {
  let postData = {
    url: 'companyBankCardDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}

// 添加银行卡
export const companyBankCardCreate = (data, noShowTip) => {
  let postData = {
    url: 'companyBankCardCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 编辑银行卡
export const companyBankCardUpdate = (data, noShowTip) => {
  let postData = {
    url: 'companyBankCardUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 扫码类型
export const paymentClassName = params => {
  let postData = {
    url: 'paymentClassName',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 扫码-添加
export const QRCodeCreate = (data, noShowTip) => {
  let postData = {
    url: 'QRCodeCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 扫码-列表
export const QRCodeList = data => {
  const { params, query } = data
  let postData = {
    url: 'QRCodeList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 扫码-修改状态
export const QRCodeModifyStatus = (data, noShowTip) => {
  let postData = {
    url: 'QRCodeModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 扫码—编辑
export const QRCodeUpdate = (data, noShowTip) => {
  let postData = {
    url: 'QRCodeUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 扫码-删除
export const QRCodeDelete = (params, noShowTip) => {
  let postData = {
    url: 'QRCodeDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 存取款总汇
export const financeSummaryData = (data, noShowTip,delayTip) => {
  const { params, query } = data
  let postData = {
    url: 'financeCollection',
    method: 'post',
    data: params
  }

  if (query) postData.params = query
  return axios.request(postData, noShowTip,delayTip)
}
// 存取款总汇 二级联动数据
export const financeType = (params) => {
  let postData = {
    url: 'financeType',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 支付管理排序
export const paymentChannelSequence = (data, noShowTip) => {
  let postData = {
    url: 'paymentChannelSequence',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 支付方式的排序
export const paymentClassSequence = (data) => {
  let postData = {
    url: 'paymentClassSequence',
    method: 'post',
    data
  }
  return axios.request(postData, true)
}

// 支付錯誤日誌
export const onlinePayErrorLog = (data) => {
  let postData = {
    url: 'onlinePayErrorLog',
    method: 'post',
    data
  }
  return axios.request(postData, true)
}

// 支付平台---列表
export const paymentManagerData = data => {
  const { params, query } = data
  let postData = {
    url: 'paymentChannelList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 支付平台---修改状态
export const changpaymentstatus = (data, noShowTip) => {
  let postData = {
    url: 'paymentChannelModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 支付平台---删除
export const deletepayment = (params, noShowTip) => {
  let postData = {
    url: 'paymentChannelDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 支付平台---创建
export const createpayment = (data, noShowTip) => {
  let postData = {
    url: 'paymentChannelCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 支付平台 - 只显示支付平台名字
export const getpaymentName = params => {
  let postData = {
    url: 'paymentName',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 支付方式 - 只返回ID与名字
export const getpaymentID = params => {
  let postData = {
    url: 'paymentClassName',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 支付平台-详情
export const getpaymentDetail = params => {
  let postData = {
    url: 'paymentChannelDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 支付方式  支付列表
export const paymentClassList = params => {
  let postData = {
    url: 'paymentClassList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 支付平台--编辑
export const updatepayment = (data, noShowTip) => {
  let postData = {
    url: 'paymentChannelUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 支付方式 状态停启用
export const paymentClassModifyStatus = (data, noShowTip) => {
  let postData = {
    url: 'paymentClassModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 支付方式 编辑
export const paymentClassUpdate = (data, noShowTip) => {
  let postData = {
    url: 'paymentClassUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 支付方式 添加
export const paymentClassCreate = (data, noShowTip) => {
  let postData = {
    url: 'paymentClassCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 支付方式 删除
export const paymentClassDelete = (params, noShowTip) => {
  let postData = {
    url: 'paymentClassDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}

//审核注单
export const platformReportsBySingle = data => {
  const { params, query } = data
  let postData = {
    url: 'platformReportsBySingle',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//支付统计数据
export const OnlinePayStatisticsList = data => {
  const { params, query } = data
  let postData = {
    url: 'OnlinePayStatisticsList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//支付统计选项数据
export const OnlinePayStatisticsPayTypeList = data => {
  let postData = {
    url: 'OnlinePayStatisticsPayTypeList',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//存取时间统计表
export const accessAuditTotalItems = data => {
  const { params, query } = data
  let postData = {
    url: 'accessAuditTotalItems',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// export const dayReport = data => {
//   const { params, query } = data
//   let postData = {
//     url: 'dayReport',
//     method: 'post',
//     data: params
//   }
//   if (query) postData.params = query
//   return axios.request(postData)
// }
//存取时间详情
export const accessAuditTotalDetail = data => {
  const { params, query } = data
  let postData = {
    url: 'accessAuditTotalDetail',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//工资列表
export const agencyWage = data => {
  const { params, query } = data
  let postData = {
    url: 'agencyWage',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//修改状态
export  const  agencyWageUp=(data,noShowTip)=>{
  let postData = {
    url: 'agencyWageUp',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//一键发放
export  const  agencyWageSend=(data,noShowTip)=>{
  let postData = {
    url: 'agencyWageSend',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//分红列表
export const agencyShareoutbonus = data => {
  const { params, query } = data
  let postData = {
    url: 'agencyShareoutbonus',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//分红修改状态
export  const  agencyShareoutbonusUp=(data,noShowTip)=>{
  let postData = {
    url: 'agencyShareoutbonusUp',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//分红一键发放
export  const  agencyShareoutbonusSend=(data,noShowTip)=>{
  let postData = {
    url: 'agencyShareoutbonusSend',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//线上取款刷新的余额
export  const  automaticWithdrawalMerchantBalance=(data,noShowTip)=>{
  let postData = {
    url: 'automaticWithdrawalMerchantBalance',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//支付余额列表
export const getSettlementList = data => {
  const { params, query } = data
  let postData = {
    url: 'getSettlementList',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//支付余额正常下发
export  const  depositSettlement=(data,noShowTip)=>{
  let postData = {
    url: 'depositSettlement',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//支付余额在线支付平台
export  const  getPayList=data=>{
  let postData = {
    url: 'getPayList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//支付余额支付平台
export  const  getPaymentNameList=data=>{
  let postData = {
    url: 'getPaymentNameList',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//添加支付
export  const  sitePlatformAdd=(data,noShowTip)=>{
  let postData = {
    url: 'sitePlatformAdd',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//java 支付列表

export  const  sitePlatformList=(data,noShowTip)=>{
  const { params, query } = data
  let postData = {
    url: 'sitePlatformList',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData,noShowTip)
}

export  const  sitePlatformUp=(data,noShowTip)=>{
  let postData = {
    url: 'sitePlatformUp',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//java代付
export const depositReplaceList = data => {
  const { params, query } = data
  let postData = {
    url: 'depositReplaceList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 审核会员列表
export const getBannedGameReports = (data,delayTip)=> {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'bannedGameReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 审核明细列表
export const getReviewDetail = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'reviewDetail',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 审核明细备注
export const memberRemarkUp = (data, noShowTip) => {
  let postData = {
    url: 'memberRemarkUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 添加虚拟货币
export const virtualCreate = (data, noShowTip) => {
  let postData = {
    url: 'virtualCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 编辑虚拟货币
export const virtualUpdate = (data, noShowTip) => {
  let postData = {
    url: 'virtualUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 虚拟货币列表
export const virtualListData = data => {
  const { params, query } = data
  let postData = {
    url: 'virtualList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 虚拟货币排序
export const virtualSequence = (data, noShowTip) => {
  let postData = {
    url: 'virtualSequence',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 虚拟货币修改状态
export const virtualModifyStatus = (data,noShowTip) => {
  let postData = {
    url: 'virtualModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 虚拟货币管理删除
export const virtualDelete = (params, noShowTip) => {
  let postData = {
    url: 'virtualDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}

// depositOnlineLimit
export const depositOnlineLimit = (params, noShowTip) => {
  let postData = {
    url: 'depositOnlineLimit',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}