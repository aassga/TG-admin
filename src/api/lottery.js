import axios from '@/libs/api.request'
// 获取彩票分类列表及对应的数据
export const lotteryNameList = () => {
  let postData = {
    url: 'lotteryNameList',
    method: 'get'
  }
  return axios.request(postData)
}
// 根据跳转来的站点ID和彩票ID获取赔率
export const lotteryOddsSiteId = (data) => {
  const { siteId, lotteryId } = data
  let postData = {
    url: `lotteryOddsSiteidLid/${siteId}/${lotteryId}`,
    method: 'get'
  }
  return axios.request(postData)
}
// 修改赔率
export const lotteryUpdateOddsSiteidLid = ({ id, oddsInfo }, noShowTip) => {
  const data = { id, oddsInfo }
  let postData = {
    url: 'lotteryUpdateOddsSiteidLid',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 香港六合彩 时间设置  列表展示
export const lotteryLhcTimeList = (params) => {
  let postData = {
    url: 'lotteryLhcTimeList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 其他彩种 时间设置 列表展示
export const lotteryTimeList = (data) => {
  const { params, lid } = data
  let postData = {
    url: `lotteryTimeList/${lid}`,
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 香港六合彩 时间设置 添加期数
export const lotteryLhcTimeAdd = (data, noShowTip) => {
  let postData = {
    url: 'lotteryLhcTimeAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 香港六合彩 时间设置  修改开奖时间
export const lotteryLhcTimeUp = (data, noShowTip) => {
  let postData = {
    url: 'lotteryLhcTimeUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 香港六合彩 时间设置 设置开奖号码
export const lotteryLhcAddNum = (data, noShowTip) => {
  let postData = {
    url: 'lotteryLhcAddNum',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 其他彩种 时间设置 编辑时间
export const lotteryTimeOneUp = (data, noShowTip) => {
  let postData = {
    url: 'lotteryTimeOneUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 其他彩种 时间设置 批量修改
export const lotteryTimeUp = (data, noShowTip) => {
  let postData = {
    url: 'lotteryTimeUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 开奖管理 修改彩票的开奖结果 官方彩
export const lotteryUpNum = (data, noShowTip) => {
  let postData = {
    url: 'lotteryUpNum',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 开奖管理 修改彩票开奖结果 快速彩
export const lotteryUpNumFast = (data, noShowTip) => {
  let postData = {
    url: 'lotteryUpNumFast',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 开奖管理 混滚  快速彩
export const lotteryAgainPrizeFast = (data, noShowTip) => {
  let postData = {
    url: 'lotteryAgainPrizeFast',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 香港六合彩 设置某一条彩票为当前开奖期
export const lotteryLhcTimeSetUp = (data, noShowTip) => {
  let postData = {
    url: 'lotteryLhcTimeSetUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 香港六合彩 删除一条开奖记录
export const lotteryLhcTimeDel = (data, noShowTip) => {
  let postData = {
    url: 'lotteryLhcTimeDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 开奖管理，获取单彩票开奖记录 官方彩
export const lotteryOpenNumberList = (data) => {
  const { params, query } = data
  let postData = {
    url: 'lotteryOpenNumberList',
    method: 'post',
    data: params,
    query
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 开奖管理 单彩票开奖记录 快速彩
export const lotteryOpenNumberListFast = data => {
  const { params, query } = data
  let postData = {
    url: 'lotteryOpenNumberListFast',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 单条彩票结算
export const lotteryPayMoney = (data) => {
  let postData = {
    url: 'lotteryPayMoney',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 开奖管理 添加彩票开奖结果 官方彩
export const lotteryAddNum = (data, noShowTip) => {
  let postData = {
    url: 'lotteryAddNum',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 开奖管理 添加彩票开奖结果 快速彩
export const lotteryAddNumFast = (data, noShowTip) => {
  let postData = {
    url: 'lotteryAddNumFast',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 开奖管理 彩票重开号 官方彩
export const lotteryAgainPrize = (data, noShowTip) => {
  let postData = {
    url: 'lotteryAgainPrize',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 未开奖列表
export const lotteryNoNumLottery = data => {
  let postData = {
    url: 'lotteryNoNumLottery',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 未开奖列表 撤单
export const lotteryRevocation = (data, noShowTip) => {
  let postData = {
    url: 'lotteryRevocation',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 快速彩票 列表
export const fastLottery = data => {
  let postData = {
    url: 'fastLottery',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//单站（快速彩票列表）
export const fastLotteryBySite = data => {
  let postData = {
    url: 'fastLotteryBySite',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 快速彩票  配置更新
export const fastLotteryUpdate = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// //单站（快速彩票 配置更新）
export const fastLotteryUpdateBySite = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryUpdateBySite',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 快速彩票 详情
export const fastLotteryDetail = data => {
  const { params, query } = data
  let postData = {
    url: 'fastLotteryDetail',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 快速彩票 初始化
export const fastLotteryInit = data => {
  let postData = {
    url: 'fastLotteryInit',
    method: 'post',
    data
  }
  return axios.request(postData)
}

// 快速彩票 黑名单列表
export const fastLotteryBlackList = data => {
  const { params, query } = data
  let postData = {
    url: 'fastLotteryBlackList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 快速彩票 添加至黑名单
export const fastLotteryBlackListAdd = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryBlackListAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 快速彩票  移除黑名单
export const fastLotteryBlackListDel = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryBlackListDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 快速彩票 高杀率列表
export const fastKillList = data => {
  const { params, query } = data
  let postData = {
    url: 'fastKillList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 快速彩票 高杀率添加
export const fastKillAdd = (data, noShowTip) => {
  let postData = {
    url: 'fastKillAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 快速彩票  高杀率移除
export const fastKillRemove = (data, noShowTip) => {
  let postData = {
    url: 'fastKillRemove',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//快速彩票 快速彩奖池
export const fastLotteryPrizeList = (data,noShowTip) => {
  const { params, query } = data
  let postData = {
    url: 'fastLotteryPrizeList',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData,noShowTip)
}
// // 快速彩票 单站 列表
// export const fastLotteryBySite = data => {
//   let postData = {
//     url: 'fastLotteryBySite',
//     method: 'post',
//     data
//   }
//   return axios.request(postData)
// }
// 快速彩票 单站 开奖结果详情
export const fastLotteryDetailBySite = data => {
  const { params, query } = data
  let postData = {
    url: 'fastLotteryDetailBySite',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 快速彩票 单站 初始化
export const fastLotteryInitBySite = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryInitBySite',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// // 快速彩票 单站 配置更新
// export const fastLotteryUpdateBySite = (data, noShowTip) => {
//   let postData = {
//     url: 'fastLotteryUpdateBySite',
//     method: 'post', 
//     data
//   }
//   return axios.request(postData, noShowTip)
// }
// 快速彩票 全站 修改开奖
export const fastLotteryUpdateOpen = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryUpdateOpen',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 快速彩票 单站 修改开奖
export const fastLotteryUpdateOpenBySite = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryUpdateOpenBySite',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 快速彩票 单站 提前开奖
export const fastLotteryOpenInitBySite = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryOpenInitBySite',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 快速彩票 全站 提前开奖
export const fastLotteryOpenInit = data => {
  let postData = {
    url: 'fastLotteryOpenInit',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 游戏记录的单注撤单
export const lotteryRevocationUser = (data, noShowTip) => {
  let postData = {
    url: 'lotteryRevocationUser',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 预先配置列表
export const fastLotteryResConfigItems = params => {
  let postData = {
    url: 'fastLotteryResConfigItems',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 添加配置
export const fastLotteryResConfigIns = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryResConfigIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 删除配置
export const fastLotteryResConfigDel = (params, noShowTip) => {
  let postData = {
    url: 'fastLotteryResConfigDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 黑名单更新
export const fastLotteryBlackListUpdate = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryBlackListUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//奖池外层
export const fastLotteryPrizeSummary =(data,dealyTip)  => {
  const { params, query } = data
  let postData = {
    url: 'fastLotteryPrizeSummary',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,dealyTip)
}

//添加奖池
export const fastLotteryPrizeAdd = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryPrizeAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//批量添加
export const fastLotteryPrizeAddMany = (data, noShowTip) => {
  let postData = {
    url: 'fastLotteryPrizeAddMany',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}


export const fastLotteryPrizeSummarySelect = (params, noShowTip) => {
  let postData = {
    url: 'fastLotteryPrizeSummarySelect',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}

//预设开奖的下拉列表
export const lotteryPulicData = (data) => {
  let postData = {
    url: '/lotteryPulicData',
    method: 'get',
    data
  }
  return axios.request(postData)
}

// 单全站添加列表
export const fastLotteryBlackSiteList = (data,noShowTip) => {
  let postData = {
    url: '/fastLotteryBlackSiteList',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}