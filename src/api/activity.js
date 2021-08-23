import axios from '@/libs/api.request'

// 优惠活动黑名单列表
export const blackListShow = (data,delayTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/blackListShow',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 活动类型下拉数据
export const preferentialList = data => {
  let postData = {
    url: '/preferentialList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 添加黑名单接口
export const addtoBlackList = (data, noShowTip) => {
  let postData = {
    url: '/addtoBlackList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 移除黑名单
export const removeBlackList = (data, noShowTip) => {
  let postData = {
    url: '/removeBlackList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 优惠活动白单列表
export const whiteListShow = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/whiteListShow',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 添加白名单接口
export const addtoWhiteList = (data, noShowTip) => {
  let postData = {
    url: '/addtoWhiteList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//优惠活动白名单编辑
export const whiteListEdit = (data, noShowTip) => {
  let postData = {
    url: '/whiteListEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 移除白名单
export const removeWhiteList = (data, noShowTip) => {
  let postData = {
    url: '/removeWhiteList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// ———————————————————金管家管理——————————————————
// 等级列表

export const jinGuanJiaLevelList = data => {
  let postData = {
    url: '/jinGuanJiaLevelList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 金管家打码等级列表
export const jinGuanJiaShow = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/jinGuanJiaShow',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 打码管理编辑
export const updateJinguanjiaLevel = (data, noShowTip) => {
  let postData = {
    url: '/updateJinguanjiaLevel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 日志列表
export const jinGuanJiaAndJiebeiLogsShow = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/jinGuanJiaAndJiebeiLogsShow',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}


//金管家模式
export const jinGuanJiaClassList = data => {
  let postData = {
    url: '/jinGuanJiaClassList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//金管家模式列表
export const jinGuanJiaLevelConfigList = data => {
  let postData = {
    url: '/jinGuanJiaLevelConfigList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//等级管理-邀请者奖励-列表
export const jinGuanJiaLeveInviteFriendsList = data => {
  let postData = {
    url: '/jinGuanJiaLeveInviteFriendsList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//金管家新建模式
export const jinGuanJiaClassCreate = (data, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaClassCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//金管家模式删除
export const jinGuanJiaModelDel = (data, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaModelDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//金管家编辑
export const jinGuanJiaLevelConfigEdit = (data, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaLevelConfigEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//金管家-等级管理-编辑
export const jinGuanJiaLeveInviteFriendsConfigEdit = (data, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaLeveInviteFriendsConfigEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//金管家状态修改
export const jinGuanJiaLevelConfigDisable = (data, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaLevelConfigDisable',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//金管家打码管理列表
export const jinGuanJiaBetList = (data, noShowTip) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/jinGuanJiaBetList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}
//金管家打码管理编辑
export const jinGuanJiaBetEdit = (data, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaBetEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//金管家领取记录
export const jinGuanJiaGiftMoneyRecord = (data) => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/jinGuanJiaGiftMoneyRecord',
    method: 'post',
    data
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// ------------------ 余额宝 --------------
//账户管理
export const yuebaoMemberList = (data) => {
  let postData = {
    url: '/yuebaoMemberList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//账户管理-移除
export const yuebaoMemberDel = (data,noShowTip) => {
  let postData = {
    url: '/yuebaoMemberDel',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//余额宝列表
export const yuebaoLevelList = (data,noShowTip) => {
  const {
    query,
    params
  } = data
  let postData = {
    url: '/yuebaoLevelList',
    method: 'get',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,noShowTip)
}

// 爭霸戰紀錄列表 
export const getZhengbasaiRecordList = (data,noShowTip) => {
  let postData = {
    url: '/activityZhengbasaiList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 爭霸戰 发放/一鍵发放  
export const sendZhengbasaiDonate = (data,noShowTip) => {
  let postData = {
    url: '/activityZhengbasaiDonate',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 爭霸戰 公開名單
export const sendZhengbasaiPublic = (data,noShowTip) => {
  let postData = {
    url: '/activityZhengbasaiPublic',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 爭霸戰 取消发放 
export const cancelZhengbasaiDonate = (data,noShowTip) => {
  let postData = {
    url: '/activityZhengbasaiCancel',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//爭霸戰設置 列表 
export const getzhengbasaiConfigList = (data,noShowTip) => {
  const {
    // query,
    params
  } = data
  let postData = {
    url: '/zhengbasaiConfigList',
    method: 'get',
    params
  }
  // if (query) postData.params = query
  // console.log('postData',postData)
  return axios.request(postData,noShowTip)
}
//爭霸戰設置 新增/编辑
export const zhengbasaiAddConfig = (data,noShowTip) => {
  let postData = {
    url: '/zhengbasaiAddConfig',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//爭霸戰設置 刪除
export const zhengbasaiDelConfig = (data,noShowTip) => {
  let postData = {
    url: '/zhengbasaiDelConfig',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//爭霸戰設置 期數
export const getzhengbasaiStageList = (data,noShowTip) => {
  const {
    params
  } = data
  let postData = {
    url: '/zhengbasaiStageList',
    method: 'get',
    params
  }
  return axios.request(postData,noShowTip)
}

//爭霸戰設置 預設列表
export const getZhengbasaiPrearrangedList = data => {
  let postData = {
    url: '/activityZhengbasaiPrearrangedList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//爭霸戰設置 新增列表
export const zhengbasaiAddPrearranged = data => {
  let postData = {
    url: '/activityZhengbasaiAddPrearranged',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//爭霸戰設置 編輯列表
export const zhengbasaiEditPrearranged = data => {
  let postData = {
    url: '/activityZhengbasaiEditPrearranged',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//爭霸戰設置 刪除列表
export const zhengbasaiDelPrearranged = data => {
  let postData = {
    url: '/activityZhengbasaiDelPrearranged',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//爭霸戰設置 獲取當前期數
export const getPresetZhengbasaiStageList = (data,noShowTip) => {
  const {
    params
  } = data
  let postData = {
    url: '/activityZhengbasaiStage',
    method: 'get',
    params
  }
  return axios.request(postData,noShowTip)
}

//爭霸戰設置 預設按鈕開啟
export const getPresetZhengbasaiPresetTheDayList = data => {
  let postData = {
    url: '/activityZhengbasaiPrearrangedStage',
    method: 'post',
    data
  }
  return axios.request(postData)
}


//余额宝编辑
export const yuebaoLevelEdit = (data,noShowTip) => {
  let postData = {
    url: '/yuebaoLevelEdit',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//流水记录
export const yuebaoDetail = data => {
  let postData = {
    url: '/yuebaoDetail',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//
export const indexStats = data => {
  let postData = {
    url: '/indexStats',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// ------------------ 借呗--------------
//借呗模式
export const jiebeiEduList = data => {
  let postData = {
    url: '/jiebeiEduList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//借呗模式-过滤详情
export const jiebeiFilterSetInfo = (data,noShowTip) => {
  let postData = {
    url: '/jiebeiFilterSetInfo',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//借呗模式-过滤提交
export const jiebeiFilterSet = data => {
  let postData = {
    url: '/jiebeiFilterSet',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//借呗下拉列表
export const jiebeiModelSelect = (data,noShowTip) => {
  let postData = {
    url: '/jiebeiModelSelect',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//借呗模式提交
export const jiebeiModelCreate = data => {
  let postData = {
    url: '/jiebeiModelCreate',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//借呗Tab页展示
export const jiebeiModelList = data => {
  let postData = {
    url: '/jiebeiModelList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//借呗额度编辑
export const jiebeiEduEdit = (data, noShowTip) => {
  let postData = {
    url: '/jiebeiEduEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//借呗Tag删除
export const jiebeiModelDel = (data, noShowTip) => {
  let postData = {
    url: '/jiebeiModelDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 借呗 借款列表
export const loanList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'loanList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 借呗 审核借款
export const checkLoan = (data, noShowTip) => {
  let postData = {
    url: 'checkLoan',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 借呗 还款列表
export const repaymentList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'repaymentList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 借呗 还款审核
export const checkRepayment = (data, noShowTip) => {
  let postData = {
    url: 'checkRepayment',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 借呗 撤销还款
export const cancelCheckRepayment = (data, noShowTip) => {
  let postData = {
    url: 'cancelCheckRepayment',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 借呗 借款撤销
export const cancelCheckLoan = (data, noShowTip) => {
  let postData = {
    url: 'cancelCheckLoan',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 浮动图列表
export const floatImgList = (data) => {
  let postData = {
    url: 'floatImgList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 浮动图状态切换
export const floatImgStatusChange = (data, noShowTip) => {
  let postData = {
    url: 'floatImgStatusChange',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 新增浮动图
export const floatImgAdd = (data, noShowTip) => {
  let postData = {
    url: 'floatImgAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 删除浮动图
export const floatImgDel = (params, noShowTip) => {
  let postData = {
    url: '/floatImgDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 编辑浮动图
export const floatImgEdit = (data, noShowTip) => {
  let postData = {
    url: 'floatImgEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 浮动图详情
export const floatImgDetail = params => {
  let postData = {
    url: '/floatImgDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 浮动图拖拽
export const floatImgDrag = (data, noShowTip) => {
  let postData = {
    url: 'floatImgDrag',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 优惠活动 参与游戏列表
export const gameList = (data, noShowTip) => {
  let postData = {
    url: '/getGameConfig',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 优惠活动 红包新增

export const hongYunAdd = (data, noShowTip) => {
  let postData = {
    url: '/activityHongyundangtouAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 红包活动列表
export const hongYunList = (data, noShowTip) => {
  let postData = {
    url: '/activityHongyundangtouConfigList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 红包活动删除
export const hongYunDel = (data, noShowTip) => {
  let postData = {
    url: '/activityHongyundangtouConfigDelete',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 红包活动详情
export const hongYunEdit = (data, noShowTip) => {
  let postData = {
    url: '/activityHongyundangtouConfigInfo',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 红包活动编辑
export const hongYunUp = (data, noShowTip) => {
  let postData = {
    url: '/activityHongyundangtouConfigUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 棋牌派红包列表
export const redSendList = (data,delayTip) => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'qipaiShouyeHongbaoList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}
// 棋牌派添加红包
export const AddRed = (data, noShowTip) => {
  let postData = {
    url: '/qipaiShouyeHongbaoAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 棋牌派取消红包
export const cancelRed = (data, noShowTip) => {
  let postData = {
    url: '/qipaiShouyeHongbaoCancel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 鸿运当头数据列表 当前
export const activityHongyundangtouList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'activityHongyundangtouList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 鸿运当头列表  历史详情
export const activityHongyundangtouDataInfo = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'activityHongyundangtouDataInfo',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 鸿运当头 修改状态
export const activityHongyundangtouUpdate = (data, noShowTip) => {
  let postData = {
    url: 'activityHongyundangtouUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 鸿运当头 下拉数据
export const activityHongyundangtouBetData = data => {
  let postData = {
    url: 'activityHongyundangtouBetData',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 红包活动结束
export const hongYunEnd = (data, noShowTip) => {
  let postData = {
    url: '/activityHongyundangtouConfigStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 红包活动发放金额
export const activityHongyundangtouGiveOutInfo = (data, noShowTip) => {
  let postData = {
    url: '/activityHongyundangtouGiveOutInfo',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 逾期统计
export const expiredTotal = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'expiredTotal',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 借还统计
export const loanRepaymentTotal = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'loanRepaymentTotal',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 借还统计-明细
export const loanRepaymentTotalDetails = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'loanRepaymentTotalDetails',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 存款优惠列表
export const depositPreferentialList = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'depositPreferentialList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 存款优惠一键发放
export const sendDepositPreferential = (data, noShowTip) => {
  let postData = {
    url: 'sendDepositPreferential',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 存款优惠 状态切换
export const changeDepositPreferentialStatus = (data, noShowTip) => {
  let postData = {
    url: 'changeDepositPreferentialStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//封禁列表
export const bannedCountBetAmountGameList = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'bannedCountBetAmountGameList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//获取游戏分列
export const bannedCountBetAmountGameSelectClass = data => {
  let postData = {
    url: 'bannedCountBetAmountGameSelectClass',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//删除
export const bannedCountBetAmountGameDel = (data, noShowTip) => {
  let postData = {
    url: 'bannedCountBetAmountGameDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//保存
export const bannedCountBetAmountGameAdd = data => {
  let postData = {
    url: 'bannedCountBetAmountGameAdd',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//活动综合各大活动类型列表
export const getActiveChessTaskList = data => {
  let postData = {
    url: 'activeChessTaskList',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//活动综合等级列表和活动时间和开关
export const getActiveChessTaskVipList = (data, noShowTip) => {
  let postData = {
    url: 'activeChessTaskVipList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动综合各大活动开始结束日期和开关的编辑
export const getActiveChessTaskDateAndSwitch = (data, noShowTip) => {
  let postData = {
    url: '/activeChessTaskDateAndSwitch',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动综合VIP范围新增
export const addActiveChessTaskLevelAdd = (data, noShowTip) => {
  let postData = {
    url: '/activeChessTaskLevelAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动综合VIP范围删除
export const delActiveChessTaskLevelDel = (data, noShowTip) => {
  let postData = {
    url: '/activeChessTaskLevelDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动综合列表
export const getActiveChessTaskConfigList = data => {
  let postData = {
    url: 'activeChessTaskConfigList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//活动综合活动配置删除
export const delActiveChessTaskConfigDel = (data, noShowTip) => {
  let postData = {
    url: 'activeChessTaskConfigDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动综合各大活动编辑配置
export const getActiveChessTaskConfigEdit = (data, noShowTip) => {
  let postData = {
    url: '/activeChessTaskConfigEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//活动综合每日游戏游戏分类下拉列表
export const getActiveChessTaskGameClassShow = data => {
  let postData = {
    url: 'activeChessTaskGameClassShow',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//活动综合每日游戏查询游戏
export const getActiveChessTaskGameQuery = data => {
  let postData = {
    url: 'activeChessTaskGameQuery',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//活动综合-定时任务-支付分类下拉
export const getActiveChessTaskPayClassShow = data => {
  let postData = {
    url: 'activeChessTaskPayClassShow',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//活动审核列表
export const activityApplyList = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'activityApplyList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//活动审核
export const activityApplyUp = (data, noShowTip) => {
  let postData = {
    url: '/activityApplyUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动记录
export const getActiveList = (data,delayTip) => {
  let postData = {
    url: '/getActiveList',
    method: 'post',
    data
  }
  return axios.request(postData,delayTip)
}
//活动记录下拉
export const whereList = (data, noShowTip) => {
  let postData = {
    url: '/whereList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动记录审核
export const ActiveZongHeShenhe = (data, noShowTip) => {
  let postData = {
    url: '/ActiveZongHeShenhe',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//活动记录-网銀編輯
export const getEditConfig = data => {
  let postData = {
    url: '/editConfig',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//网銀加贈列表
export const getActivityJiazengList = (data,delayTip) => {
  let postData = {
    url: '/activityJiazengList',
    method: 'post',
    data
  }
  return axios.request(postData,delayTip)
}
//网銀加贈發送/一鍵發送
export const ActivityJiazengDonate = data => {
  let postData = {
    url: '/activityJiazengDonate',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//网銀取消發送
export const ActivityJiazengCancel = data => {
  let postData = {
    url: '/activityJiazengCancel',
    method: 'post',
    data
  }
  return axios.request(postData)
}



//新年抢红包
export const redPacketList = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'redPacketList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//发放表资格表
export const redPacketCheckTable = data => {
  const {
    query,
    params
  } = data
  let postData = {
    url: 'redPacketCheckTable',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//设置金额
export const redPacketSetMoney = (data, noShowTip) => {
  let postData = {
    url: '/redPacketSetMoney',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//修改资格
export const redPacketUpStatus = (data, noShowTip) => {
  let postData = {
    url: '/redPacketUpStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//查询条件
export const redPacketGetSelect = (data, noShowTip) => {
  const {
    query,
    params
  } = data
  let postData = {
    url: '/redPacketGetSelect',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}

//红包配置添加条件红包
export const paiFaHongBaoConfig = (data, noShowTip) => {
  let postData = {
    url: '/paiFaHongBaoConfig',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//红包配置添加列表
export const redSetList = (data, noShowTip) => {
  const {
    query,
    params
  } = data
  let postData = {
    url: '/paiFaHongBaoConfigList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}

//获取红包下拉列表
export const paiFaHongBaoConfigCode = (data, noShowTip) => {
  let postData = {
    url: '/paiFaHongBaoConfigCode',
    method: 'post',
    data}

    return axios.request(postData, noShowTip)
  }

//红包配置删除
export const delRedSet = (data, noShowTip) => {
  let postData = {
    url: '/paiFaHongBaoConfigDe',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//红包状态修改
export const paiFaHongBaoConfigSta = (data, noShowTip) => {
  let postData = {
    url: '/paiFaHongBaoConfigSta',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//优惠活动编辑
export const blackListEdit = (data, noShowTip) => {
  let postData = {
    url: '/blackListEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//删除
export const jinGuanJiaLeveInviteFriendsDel = (data, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaLeveInviteFriendsDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//app 兑换码列表

export const appExchangeCodeList = (data, noShowTip) => {
  const {
    query,
    params
  } = data
  let postData = {
    url: '/appExchangeCodeList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}


//删除
export const appExchangeCodeDelete =(data,noShowTip)   => {
  let postData = {
    url: '/appExchangeCodeDelete',
    method: 'post',
    data
  }
  return axios.request (postData,noShowTip)
}

//新增
export const appExchangeCodeCreate = (data,noShowTip)  => {
  let postData = {
    url: '/appExchangeCodeCreate',
    method: 'post',
    data
  }
  return axios.request (postData,noShowTip)
}

//编辑
export const appExchangeCodeEdit = (data,noShowTip)  => {
  let postData = {
    url: '/appExchangeCodeEdit',
    method: 'post',
    data
  }
  return axios.request (postData,noShowTip)
}

//领取记录列表

export const appExchangeCodeReceivedRecord = (data, noShowTip) => {
  const {
    query,
    params
  } = data
  let postData = {
    url: '/appExchangeCodeReceivedRecord',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}
//应用列表
export const appExchangeCodeName = (params, noShowTip) => {
  let postData = {
    url: '/appExchangeCodeName',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
//appExchangeCodeStatus
export const appExchangeCodeStatus = (params, noShowTip) => {
  let postData = {
    url: '/appExchangeCodeStatus',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// jinGuanJiaLevelSelect
export const jinGuanJiaLevelSelect = (params, noShowTip) => {
  let postData = {
    url: '/jinGuanJiaLevelSelect',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}

// jinGuanJiaBetBatEdit

export const jinGuanJiaBetBatEdit = (data,noShowTip)  => {
  let postData = {
    url: '/jinGuanJiaBetBatEdit',
    method: 'post',
    data
  }
  return axios.request (postData,noShowTip)
}

