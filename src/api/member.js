import axios from '@/libs/api.request'
// 获取会员查询列表
export const getMemberTableData = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'memberList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 获取会员等级列表
export const getMemberLevelData = params => {
  let postData = {
    url: 'memberLevelList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 修改会员状态
export const memberModifyStatus = (data, noShowTip,delayTip) => {
  let postData = {
    url: 'memberModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip,delayTip)
}
//套用层级
export const copyPaymentChannel = (data, noShowTip) => {
  let postData = {
    url: 'copyPaymentChannel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 跳转会员详情
export const memberDetail = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'memberDetail',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 编辑会员
export const memberUpdate = (data, noShowTip,delayTip) => {
  let postData = {
    url: 'memberUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip,delayTip)
}
// 会员查询 回收第三方余额
export const thirdBalanceRecycle = params => {
  let postData = {
    url: 'thirdBalanceRecycle',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 会员查询 刷新第三方余额
export const refreshThirdBalance = params => {
  let postData = {
    url: 'refreshThirdBalance',
    method: 'get',
    params: params
  }
  return axios.request(postData)
}
// 重置密码
export const memberResetPassword = (data, noShowTip) => {
  let postData = {
    url: 'memberResetPassword',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 会员加减款
export const memberBalanceHandle = (data, noShowTip) => {
  let postData = {
    url: 'memberBalanceHandle',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

export const getCommonLevelData = () => {}

// 返水等级列表
export const getMemberRefundLevelData = params => {
  let postData = {
    url: 'refundLevelList',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 返水等级详情
export const getrefundLevelDetailData = params => {
  let postData = {
    url: 'refundLevelDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 增加返水等级
export const refundLevelCreateData = (data, noShowTip) => {
  let postData = {
    url: '/refundLevelCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 编辑返水
export const refundLevelUpdateData = (data, noShowTip) => {
  let postData = {
    url: 'refundLevelUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 修改返水状态
export const refundLevelModifyStatus = (data, noShowTip) => {
  let postData = {
    url: '/refundLevelModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//业绩等级列表
export const performanceConfigList = (data, noShowTip) => {
  let postData = {
    url: '/performanceConfigList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//添加业绩等级
export const performanceConfigAdd = (data, noShowTip) => {
  let postData = {
    url: '/performanceConfigAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//编辑业绩等级
export const performanceConfigUpt = (data, noShowTip) => {
  let postData = {
    url: '/performanceConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//业绩等级状态切换
export const performanceConfigStatusUpt = (data, noShowTip) => {
  let postData = {
    url: '/performanceConfigStatusUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 银行卡管理列表
export const getbanklist = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'bankCardList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 显示银行卡号
export const getbankcode = params => {
  let postData = {
    url: 'bankCardDisplay',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 银行卡修改状态
export const bankCardModifyStatus = (data, noShowTip) => {
  let postData = {
    url: 'bankCardModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 银行卡删除
export const deletebank = (params, noShowTip) => {
  let postData = {
    url: 'bankCardDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 银行卡详情
export const getbankdetail = params => {
  let postData = {
    url: 'bankCardDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
export const bankCardUpdate = (data, noShowTip) => {
  let postData = {
    url: 'bankCardUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 会员修改状态
export const changMemberStatus = (data, noShowTip) => {
  let postData = {
    url: 'memberLevelModifyStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 会员等级详情
export const getmembershipdetail = params => {
  let postData = {
    url: 'memberLevelDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 会员等级创建
export const memberLevelCreate = (data, noShowTip) => {
  let postData = {
    url: 'memberLevelCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 会员等级编辑
export const memberLevelUpdate = (data, noShowTip) => {
  let postData = {
    url: 'memberLevelUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 批量修改会员等级
export const memberLevelModifyBatch = (data, noShowTip) => {
  let postData = {
    url: 'memberLevelModifyBatch',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 修改会员等级 查询会员列表
export const searchmemberList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'soonModifyMemberList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 会员等级-支付通道详情
export const payMentDetail = params => {
  let postData = {
    url: 'getBoundPaymentChannel',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 会员等级支付设置
export const paymentsetting = (data, noShowTip) => {
  let postData = {
    url: 'bindingPaymentChannel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 修改会员等级-批量修改
export const batchmembermodify = data => {
  let postData = {
    url: 'memberLevelModifyBatch',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 日志
// 会员操作日志
export const memberHandleLog =( data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/memberOperationLog',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

// 会员登录日志
export const memberLoginLog = (data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/memberLoginLog',
    method: 'post',
    data: params
  }
  if (query) postData.params = query

  return axios.request(postData,delayTip)
}
//会员登录日志-虚拟站
export const memberLoginLogTest = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/memberLoginLogTest',
    method: 'post',
    data: params
  }
  if (query) postData.params = query

  return axios.request(postData)
}
// 会员登录日志-历史登录
export const singleMemberHistory = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'singleMemberHistory',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 会员资金日志

export const memberFinanceLog = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/memberFinanceLog',
    method: 'post',
    data: params
  }
  if (query) postData.params = query

  return axios.request(postData)
}
// 在线会员 踢线
export const memberKickOffline = (params, noShowTip) => {
  let postData = {
    url: 'memberKickOffline',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 会员操作日志 下拉
export const memberLogType = params => {
  let postData = {
    url: 'memberLogType',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 工资等级列表
export const memberWageConfigList = data => {
  let postData = {
    url: 'memberWageConfigList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 工资状态更改
export const memberWageConfigStatusUpt = (data, noShowTip) => {
  let postData = {
    url: 'memberWageConfigStatusUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 添加工资等级
export const memberWageConfigAdd = (data, noShowTip) => {
  let postData = {
    url: 'memberWageConfigAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 编辑工资等级
export const memberWageConfigU = (data, noShowTip) => {
  let postData = {
    url: 'memberWageConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 分红等级列表
export const memberProfitConfigList = data => {
  let postData = {
    url: 'memberProfitConfigList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 分红等级状态更改
export const memberProfitConfigStatusUpt = (data, noShowTip) => {
  let postData = {
    url: 'memberProfitConfigStatusUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 添加分红
export const memberProfitConfigAdd = (data, noShowTip) => {
  let postData = {
    url: 'memberProfitConfigAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 编辑分红
export const memberProfitConfigUpt = (data, noShowTip) => {
  let postData = {
    url: 'memberProfitConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 导出
export const memberExport = (data,delayTip) => {
  console.log(delayTip)
  let postData = {
    url: 'memberExport',
    method: 'post',
    data
  }
  return axios.request(postData,delayTip)
}
// 会员资金日志下拉
export const memberBetLogType = data => {
  let postData = {
    url: 'memberBetLogType',
    method: 'get',
    params: data
  }
  return axios.request(postData)
}

//推广会员列表
export const memberListOfChat = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'memberListOfChat',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//绑定好友关系

export const bindingRelations = (data, noShowTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'bindingRelations',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}


//解绑好友关系

export const deleteRelations = (data, noShowTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'deleteRelations',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}

//管理员搜索昵称
export const searchAdminOtherName = params => {
  let postData = {
    url: 'searchAdminOtherName',
    method: 'get',
    params
  }
  return axios.request(postData)
}

//支付设置等级列表
export const memberLeveltoPayList = data => {
  let postData = {
    url: 'memberLeveltoPayList',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//支付设置绑定支付
export const memberLeveltoPayAdd = data => {
  let postData = {
    url: 'memberLeveltoPayAdd',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//会员筛选列表
export const memberFilter = (data,delayTip) => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'conditionalSearchMember',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 审核会员列表
export const getBannedGameReports = data => {
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
  return axios.request(postData)
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

//会员分组
export const getMemberGroupList = params => {
  let postData = {
    url: 'getMemberGroupList',
    method: 'get',
    params
  }
  return axios.request(postData)
}

//会员分组新增
export const createMemberGroup =(data,noShowTip)  => {
  let postData = {
    url: 'createMemberGroup',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//优惠等级
export const bonusLevelSummary = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'bonusLevelSummary',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//优惠等级详情

export const bonusLevelDetail = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'bonusLevelDetail',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//优惠等级下拉列表
export const bonusLevelSelectList = params => {
  let postData = {
    url: 'bonusLevelSelectList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
//优惠等级编辑
export const bonusLevelEdit =(data,noShowTip)  => {
  let postData = {
    url: 'bonusLevelEdit',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}