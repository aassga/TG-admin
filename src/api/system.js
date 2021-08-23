import axios from '@/libs/api.request'

// 站点管理 列表
export const siteManagementList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'siteManagementList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 菜单列表
export const getMenuList = (data) => {
  let postData = {
    url: '/menuList',
    method: 'get',
    data
  }
  return axios.request(postData)
}
// 菜单排序
export const sortMenu = data => {
  let postData = {
    url: '/menuSort',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 菜单删除
export const deleteMenu = data => {
  let postData = {
    url: '/menuDel',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 菜单新增
export const addMenu = data => {
  let postData = {
    url: '/menuAdd',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 菜单编辑
export const updateMenu = data => {
  let postData = {
    url: '/menuUpdate',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 查询uri
export const searchUri = data => {
  let postData = {
    url: '/permissionSearchUri',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 角色列表
export const getPermissionList = data => {
  let postData = {
    url: '/permissionList',
    method: 'get',
    data
  }
  return axios.request(postData)
}
// 角色列表
export const getRoleList = () => {
  let postData = {
    url: '/roleList',
    method: 'get'
  }
  return axios.request(postData)
}
// 角色新增
export const roleAdd = data => {
  let postData = {
    url: '/roleAdd',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 角色编辑
export const roleUpdate = data => {
  let postData = {
    url: '/roleUpdate',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 角色删除
export const roleDel = data => {
  let postData = {
    url: '/roleDel',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 角色详情
export const roleDetail = data => {
  let postData = {
    url: '/roleDetail',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 管理员列表
export const getAdminList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/adminList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 管理员详情
export const adminDetail = data => {
  let postData = {
    url: '/adminDetail',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 管理员新增
export const adminAdd = data => {
  let postData = {
    url: '/adminAdd',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 管理员编辑
export const adminUpdate = data => {
  let postData = {
    url: '/adminUpdate',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 管理员删除
export const adminDelete = data => {
  let postData = {
    url: '/adminDelete',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 管理员状态
export const adminModifyStatus = (params, noShowTip) => {
  let postData = {
    url: '/adminModifyStatus',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 管理员日志列表
export const getAdminLogList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/adminLogList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 管理员日志分类
export const adminLogType = data => {
  let postData = {
    url: '/adminLogType',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 站点管理 列表 查看详情
export const siteManagementDetail = params => {
  let postData = {
    url: 'siteManagementDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 站点管理 列表 编辑
export const siteManagementUpdate = (data, noShowTip) => {
  let postData = {
    url: 'siteManagementUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 站点管理 列表 添加站点
export const siteManagementCreate = (data, noShowTip) => {
  let postData = {
    url: 'siteManagementCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 站点管理 获取服务器ID
export const siteManagementDbId = () => {
  let postData = {
    url: 'siteManagementDbId',
    method: 'get'
  }
  return axios.request(postData)
}
// 支付平台列表
export const paymentJigsawManagementList = (data) => {
  let postData = {
    url: 'paymentJigsawManagementList',
    method: 'post',
    params: data
  }
  return axios.request(postData)
}
//java 支付平台列表
export const getPlatformList = () => {
  let postData = {
    url: 'getPlatformList',
    method: 'get',
  }
  return axios.request(postData)
}
//支付平台详情
export const paymentJigsawManagementInfo = (data) => {
  let postData = {
    url: 'paymentJigsawManagementInfo',
    method: 'post',
    params: data
  }
  return axios.request(postData)
}
//编辑支付平台
export const paymentJigsawManagementUpd = (data, noShowTip) => {
  let postData = {
    url: 'paymentJigsawManagementUpd',
    method: 'post',
    params: data
  }
  return axios.request(postData, noShowTip)
}
//删除支付平台
export const paymentJigsawManagementDel = (data, noShowTip) => {
  let postData = {
    url: 'paymentJigsawManagementDel',
    method: 'post',
    params: data
  }
  return axios.request(postData, noShowTip)
}
//添加支付平台
export const paymentJigsawManagementAdd = (data, noShowTip) => {
  let postData = {
    url: 'paymentJigsawManagementAdd',
    method: 'post',
    params: data
  }
  return axios.request(postData, noShowTip)
}
// 系统预设 会员等级列表
export const systemMemberLevelList = () => {
  let postData = {
    url: 'systemMemberLevelList',
    method: 'get'
    // params
  }
  return axios.request(postData)
}
// 系统预设 会员返水等级配置
export const systemMemberRefundLevelList = () => {
  let postData = {
    url: 'systemMemberRefundLevelList',
    method: 'get'
    // params
  }
  return axios.request(postData)
}
// 系统预设 添加会员等级
export const systemMemberLevelAdd = (data, noShowTip) => {
  let postData = {
    url: 'systemMemberLevelAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 系统预设 编辑会员等级
export const systemMemberLevelUp = (data, noShowTip) => {
  let postData = {
    url: 'systemMemberLevelUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 系统预设 会员返水等级添加
export const systemMemberRefundLevelAdd = (data, noShowTip) => {
  let postData = {
    url: 'systemMemberRefundLevelAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 系统预设 会员返水等级编辑
export const systemMemberRefundLevelUp = (data, noShowTip) => {
  let postData = {
    url: 'systemMemberRefundLevelUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 系统预设 返水等级详情
export const systemMemberRefundLevelDetail = params => {
  let postData = {
    url: 'systemMemberRefundLevelDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 黑名单列表
export const blackList = params => {
  let postData = {
    url: 'blackList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 黑名单列表 添加黑名单
export const blackListCreate = (data, noShowTip) => {
  let postData = {
    url: 'blackListCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 黑名单列表 删除
export const blackListDelete = (params, noShowTip) => {
  let postData = {
    url: 'blackListDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 活动列表
// export const activityListData = params => {
//   let postData = {
//     url: '',
//     method: '',
//     params
//   }
//   return axios.request(postData)
// }
// 轮播图信息列表
export const getlunboManagement = params => {
  let postData = {
    url: '/slideList2',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 轮播信息添加
export const slideIns = (data, noShowTip) => {
  let postData = {
    url: 'slideIns2',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 轮播信息编辑
export const slideUpt = (data, noShowTi) => {
  let postData = {
    url: 'slideUpt2',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTi)
}
// 轮播信息删除
export const dellunboManagement = (params, noShowTip) => {
  let postData = {
    url: '/slideDel2',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 轮播信息详情
export const slideImgInfo = params => {
  let postData = {
    url: '/slideImgInfo2',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 轮播图信息编辑
export const slideImgInfoUpt = (data, noShowTip) => {
  let postData = {
    url: 'slideImgInfoUpt2',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// Logo列表
export const logoList = (params, noShowTip) => {
  let postData = {
    url: '/logoList',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
// Logo新增
export const addLogoHandler = (params, noShowTip) => {
  let postData = {
    url: '/addLogoHandler',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
// ------------信息中心----------

// ----------- 站内信
// 收件箱
export const inBox = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'inBox',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 发件箱
export const sendBox = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'outBox',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 回复消息
export const letterReply = (data, noShowTip) => {
  let postData = {
    url: 'letterReply',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 发送消息
export const letterSend = (data, noShowTip) => {
  let postData = {
    url: 'letterSend',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 删除消息
export const letterDel = (data, noShowTip) => {
  let postData = {
    url: 'letterDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 信息详情
export const letterDetail = params => {
  let postData = {
    url: '/letterDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 更新已读状态
export const letterUptRead = params => {
  let postData = {
    url: '/letterUptRead',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// -----------公告信息
// 公告列表
// export const noticeList = (data) => {
//   let postData = {
//     url: 'noticeList',
//     method: 'post',
//     data
//   }
//   return axios.request(postData)
// }

// 弹框列表
export const popupsList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'popupsList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 弹框详情
export const popupsDetail = params => {
  let postData = {
    url: 'popupsDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 删除弹框
export const popupsDel = (params, noShowTip) => {
  let postData = {
    url: '/popupsDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 公告状态更新
export const popupsStatusChange = (data, noShowTip) => {
  let postData = {
    url: 'popupsStatusChange',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 添加公告弹幕
export const popupsIns = (data, noShowTip) => {
  let postData = {
    url: 'popupsIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 编辑公告弹幕
export const popupsUpt = (data, noShowTip) => {
  let postData = {
    url: 'popupsUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 走马灯列表
export const lanternList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'lanternList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 走马灯详情
export const lanternDetail = params => {
  let postData = {
    url: 'lanternDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 删除走马灯
export const lanternDel = (params, noShowTip) => {
  let postData = {
    url: '/lanternDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 走马灯状态更新
export const lanternStatusChange = (data, noShowTip) => {
  let postData = {
    url: 'lanternStatusChange',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 添加走马灯
export const lanternIns = (data, noShowTip) => {
  let postData = {
    url: 'lanternIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 编辑走马灯
export const lanternUpt = (data, noShowTip) => {
  let postData = {
    url: 'lanternUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 文章列表
export const articleList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'articleList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 弹文章详情
export const articleDetail = params => {
  let postData = {
    url: 'articleDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 删除文章
export const articleDel = (params, noShowTip) => {
  let postData = {
    url: '/articleDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 文章状态更新
export const articleStatusChange = (data, noShowTip) => {
  let postData = {
    url: 'articleStatusChange',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 添加文章
export const articleIns = (data, noShowTip) => {
  let postData = {
    url: 'articleIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 编辑文章
export const articleUpt = (data, noShowTip) => {
  let postData = {
    url: 'articleUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// ---------------- 新权限
// 管理员列表
export const adminNewList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'adminNewList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 管理员密码修改
export const changePassWord = (data, noShowTip) => {
  let postData = {
    url: 'changePassWord',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 删除管理员
export const adminNewDelete = (data, noShowTip) => {
  let postData = {
    url: 'adminNewDelete',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 管理员详情
export const adminNewDetail = data => {
  let postData = {
    url: 'adminNewDetail',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 管理员复制
export const copyAdmin = (data, noShowTip) => {
  let postData = {
    url: 'copyAdmin',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 管理员新增
export const adminNewAdd = (data, noShowTip) => {
  let postData = {
    url: 'adminNewAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 管理员编辑
export const adminNewUpdate = (data, noShowTip) => {
  let postData = {
    url: 'adminNewUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 活动

// 活动列表
export const activityList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'activityList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 活动添加
export const activityIns = (data, noShowTip) => {
  let postData = {
    url: 'activityIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 活动编辑
export const activityUpt = (data, noShowTip) => {
  let postData = {
    url: 'activityUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 活动删除
export const activityDel = (params, noShowTip) => {
  let postData = {
    url: '/activityDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 活动详情
export const activityDetail = params => {
  let postData = {
    url: '/activityDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 活动状态设置
export const activityChangeStatus = (data, noShowTip) => {
  let postData = {
    url: 'activityChangeStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 活动排序
// export const activityDel = params => {
//   let postData = {
//     url: '/activityDel',
//     method: 'get',
//     params
//   }
//   return axios.request(postData)
// }
// 活动分类排序
export const activityCateBySort = (params, noShowTip) => {
  let postData = {
    url: 'activityCateBySort',
    methods: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 活动排序
export const activityBySort = (params, noShowTip) => {
  let postData = {
    url: '/activityBySort',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 活动分类列表
export const activityCateList = params => {
  let postData = {
    url: '/activityCateList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 活动分类添加
export const activityCateIns = (data, noShowTip) => {
  let postData = {
    url: 'activityCateIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 活动分类编辑
export const activityCateUpt = (data, noShowTip) => {
  let postData = {
    url: 'activityCateUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 活动分类删除
export const activityCateDel = (params, noShowTip) => {
  let postData = {
    url: '/activityCateDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// ----------游戏排序新------------
export const GameSortV4List = (data, noShowTip) => {
  let postData = {
    url: 'GameSortV4List',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// ----------游戏排序新------------
export const GameSortV4Up = (data, noShowTip) => {
  let postData = {
    url: 'GameSortV4Up',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
export const SynchronousGameSortV4Data = (data, noShowTip) => {
  let postData = {
    url: 'SynchronousGameSortV4Data',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//竞价排序
export const siteBiddingList = (data, noShowTip) => {
  let postData = {
    url: 'siteBiddingList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//竞价排序修改、
export const siteBiddingUp = (data, noShowTip) => {
  let postData = {
    url: 'siteBiddingUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 站点游戏排列列表
export const systemSiteGameUp = (data, noShowTip) => {
  let postData = {
    url: 'systemSiteGameUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 站点游戏修改排序
export const systemSiteGameList = (data) => {
  let postData = {
    url: 'systemSiteGameList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//电子游艺排序列表
export const systemSiteGameSlotList = (data, noShowTip) => {
  let postData = {
    url: 'systemSiteGameSlotList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//电子游戏修改排序
export const systemSiteGameSlotUp = (data, noShowTip) => {
  let postData = {
    url: 'systemSiteGameSlotUp',
    method: 'post',
    data,
  }
  return axios.request(postData, noShowTip)
}
//捕鱼棋牌游艺排序列表
export const systemSiteGameChessFishList = (data, noShowTip) => {
  let postData = {
    url: 'systemSiteGameChessFishList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//捕鱼棋牌游戏修改排序
export const systemSiteGameChessFishUp = (data, noShowTip) => {
  let postData = {
    url: 'systemSiteGameChessFishUp',
    method: 'post',
    data,
  }
  return axios.request(postData, noShowTip)
}
//手机彩票侧边栏
// /gameSortLotterySelect?siteId=1
export const gameSortLotterySelect = (params, noShowTip) => {
  let postData = {
    url: '/gameSortLotterySelect',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// ----------游戏管理（新）------------
// 游戏管理新-游戏列表（单站）
export const SiteGameControlList = data => {
  let postData = {
    url: 'SiteGameControlList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 游戏管理（新）-单站状态修改
export const SiteGameControlStatus = (params, noShowTip) => {
  let postData = {
    url: '/SiteGameControlStatus',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
// 游戏管理（新）-全站状态修改
export const AllSiteGameControlStatusUp = (params, noShowTip) => {
  let postData = {
    url: '/AllSiteGameControlStatusUp',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
export const AllSiteGameControlUp = (params, noShowTip) => {
  let postData = {
    url: '/AllSiteGameControlUp',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}

//游戏管理（新）描述修改
export const SiteGameControlTitle = (params, noShowTip) => {
  let postData = {
    url: '/SiteGameControlTitle',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
// 游戏管理新-游戏列表（全站）
export const AllSiteGameControlList = data => {
  let postData = {
    url: 'AllSiteGameControlList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 游戏管理新-排序类别
export const GameGroupList  = data => {
  let postData = {
    url: 'GameGroupList ',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//排序类别-修改
export const GameGroupEditor  = (data,noShowTip) => {
  let postData = {
    url: 'GameGroupEditor ',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//排序类别-新增分类
export const GameGroupAdd  = (data,noShowTip) => {
  let postData = {
    url: 'GameGroupAdd ',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//排序类别-删除分类
export const GameGroupDel  = (data,noShowTip) => {
  let postData = {
    url: 'GameGroupDel ',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
//排序分类-排序
export const GameGroupUpSort  = (data,noShowTip) => {
  let postData = {
    url: 'GameGroupUpSort',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}
// ----------游戏管理------------
// 游戏管理-游戏列表（单站）
export const gameConfigList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'gameConfigList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
// 游戏管理-新增游戏 (全站)
export const gameConfigAddGame = data => {
  let postData = {
    url: 'gameConfigAddGame',
    method: 'post',
    data
  }
  return axios.request(postData)
}
// 游戏管理-游戏分类列表 (全站)
export const gameConfigForMaintain = params => {
  let postData = {
    url: '/gameConfigForMaintain',
    method: 'get',
    params
  }
  return axios.request(postData)
}

// 游戏管理-游戏状态修改 【游戏维护】同用 (全站)
export const gameConfigUpGameStatus = (params, noShowTip) => {
  let postData = {
    url: '/gameConfigUpGameStatus',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
// 游戏管理-游戏删除 (全站)
export const gameConfigDelGame = params => {
  let postData = {
    url: '/gameConfigDelGame',
    method: 'post',
    data: params
  }
  return axios.request(postData)
}
// 游戏管理-游戏修改 (全站)
export const gameConfigUpGame = params => {
  let postData = {
    url: '/gameConfigUpGame',
    method: 'post',
    data: params
  }
  return axios.request(postData)
}
// 游戏管理-添加游戏黑名单 （单站）
export const gameConfigUpBlackGame = (params, noShowTip) => {
  let postData = {
    url: '/gameConfigUpBlackGame',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
// 游戏管理-游戏列表（全站）
export const gameConfigListAll = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: '/gameConfigListAll',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 游戏管理-添加游戏黑名单（全站）
export const gameConfigUpBlackGameAll = (params, noShowTip) => {
  let postData = {
    url: '/gameConfigUpBlackGameAll',
    method: 'post',
    data: params
  }
  return axios.request(postData, noShowTip)
}
// 游戏管理-全站返水设置
export const gameConfigRebatePointsUp = (data, noShowTip) => {
  let postData = {
    url: '/gameConfigRebatePointsUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 修改游戏描述
export const gameConfigTitleUp = (data, noShowTip) => {
  let postData = {
    url: '/gameConfigTitleUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 区域白名单
export const whiteList = params => {
  let postData = {
    url: 'whiteList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 区域白名单 删除
export const whiteListDelete = (params, noShowTip) => {
  let postData = {
    url: 'whiteListDelete',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 区域白名单  添加
export const whiteListCreate = (data, noShowTip) => {
  let postData = {
    url: 'whiteListCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 活动图设置 列表
export const activityImgConfigList = params => {
  let postData = {
    url: 'activityImgConfigList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 活动图设置 添加
export const activityImgConfigIns = (data, noShowTip) => {
  let postData = {
    url: 'activityImgConfigIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 活动图设置 更新
export const activityImgConfigUpt = (data, noShowTip) => {
  let postData = {
    url: 'activityImgConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 站点设置 主题列表
export const siteManagementTheme = () => {
  let postData = {
    url: 'siteManagementTheme',
    method: 'get'
  }
  return axios.request(postData)
}
// 佣金模式更新新增
export const commissionModeSave = (data, noShowTip) => {
  let postData = {
    url: 'commissionModeSave',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
// 拉取佣金模式下的详情数据
export const commissionModeInfo = (params) => {
  let postData = {
    url: 'commissionModeInfo',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 存款优惠支付下拉
export const preferentialPaymentClass = () => {
  let postData = {
    url: 'preferentialPaymentClass',
    method: 'get'
  }
  return axios.request(postData)
}

//注册信息
export const messageRegisterMessage = (data, noShowTip) => {
  let postData = {
    url: 'messageRegisterMessage',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//注册信息详情
export const messageRegisterInfo = (data, noShowTip) => {
  let postData = {
    url: 'messageRegisterInfo',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//自动出款配置
export const automaticWithdrawalList = data => {
  let postData = {
    url: 'automaticWithdrawalList',
    method: 'post',
    data
  }
  return axios.request(postData)
}

//切换状态
export const automaticWithdrawalUpdateStatus = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalUpdateStatus',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//删除
export const automaticWithdrawalDel = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//出款平台
export const automaticWithdrawalMerchantFileName = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalMerchantFileName',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//增加自动出款平台
export const automaticWithdrawalAdd = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//有且只有一个启用状态
export const automaticMerchantStatusExists = (data) => {
  let postData = {
    url: 'automaticMerchantStatusExists',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//详情
export const automaticWithdrawalInfo = (data) => {
  let postData = {
    url: 'automaticWithdrawalInfo',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//编辑
export const automaticWithdrawalUpd = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalUpd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//代理域名-添加(新)
export const agencyDomainCreate = (data, noShowTip) => {
  let postData = {
    url: 'agencyDomainCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//电子游艺图片配置

//电子游艺图片列表

// export const electronicImageConfigList = data => {
//   const { params, query } = data
//   let postData = {
//     url: 'electronicImageConfigList',
//     method: 'post',
//     data:params
//   }
//   if (query) postData.params = query
//   return axios.request(postData)
// }


//新增
export const electronicImageConfigAdd = (data, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//编辑
export const electronicImageConfigUpt = (data, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//删除
export const electronicImageConfigDel = (params, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
//详情
export const electronicImageConfigDetail = (params, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigDetail',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
// 全站维护列表
export const siteRepairConfigList = (params) => {
  let postData = {
    url: 'siteRepairConfigList',
    method: 'get',
    params
  }
  return axios.request(postData)
}
// 全站维护 更新
export const siteRepairConfigUpt = (data, noShowTip) => {
  let postData = {
    url: 'siteRepairConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//启动广告
export const advertisingImg = (data, noShowTip) => {
  let postData = {
    url: 'advertisingImg',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//添加广告图
export const AdvertisingImgConfigIns = (data, noShowTip) => {
  let postData = {
    url: 'AdvertisingImgConfigIns',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//编辑广告图
export const AdvertisingImgConfigUpt = (data, noShowTip) => {
  let postData = {
    url: 'AdvertisingImgConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//新游戏轮播
//列表
export const slideshowList = (data) => {
  let postData = {
    url: 'slideshowList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//游戏轮播添加
export const slideshowAdd = (data, noShowTip) => {
  let postData = {
    url: 'slideshowAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//新游戏轮播修改
export const slideshowUp = (data, noShowTip) => {
  let postData = {
    url: 'slideshowUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//新游戏轮播删除
export const slideshowDel = (data, noShowTip) => {
  let postData = {
    url: 'slideshowDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//新游戏轮播排序

export const slideshowSort = (data, noShowTip) => {
  let postData = {
    url: 'slideshowSort',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//游戏轮播
//平台下拉
export const gamePlatformType = (params) => {
  let postData = {
    url: 'gamePlatformType',
    method: 'get',
    params
  }
  return axios.request(postData)
}
//游戏轮播添加
export const gameAddLunbo = (data, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigAdd',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//游戏轮播列表
export const gameLunboList = (data) => {
  let postData = {
    url: 'electronicImageConfigList',
    method: 'post',
    data
  }
  return axios.request(postData)
}
//删除轮播图
export const deletGamelunbo = (params, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigDel',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
//改变状态
export const changeGameLunboStatus = (params, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigStatusUpt',
    method: 'get',
    params
  }
  return axios.request(postData, noShowTip)
}
//获取详情
export const getGameLunboDetail = (params) => {
  let postData = {
    url: 'electronicImageConfigDetail',
    method: 'get',
    params
  }
  return axios.request(postData)
}
//轮播图排序
export const updateLunboList = (data, noShowTip) => {
  let postData = {
    url: 'electronicImageConfigUpt',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//更新通知收件箱列表
export const adminMassageGetList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: "adminMassageGetList",
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//发件箱列表
export const adminMassageSendList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: "adminMassageSendList",
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

//增加更新通知
export const adminMassageAdd = (data, noShowTip) => {
  let postData = {
    url: "adminMassageAdd",
    method: 'post',
    data
  }

  return axios.request(postData, noShowTip)
}

//管理员账号查询
export const adminMassageAS = data => {
  let postData = {
    url: "adminMassageAS",
    method: 'post',
    data
  }
  return axios.request(postData)
}
//状态更新
export const adminMassageUp = (data, noShowTip) => {
  let postData = {
    url: "adminMassageUp",
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//站点列表
export const siteList = (data) => {
  let postData = {
    url: '/selectSite',
    method: 'get',
    data
  }
  return axios.request(postData)
}

//管理员列表
export const selectAdminList = (data) => {
  let postData = {
    url: '/selectAdmin',
    method: 'get',
    data
  }
  return axios.request(postData)
}

//站内公告
export const noticeSortUpdate = (data, noShowTip) => {
  let postData = {
    url: 'noticeSortUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//留存报表
export const getKeepReports = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'getKeepReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}
//留存报表
export const keepReports = (data,delayTip)=> {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'keepReports',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData,delayTip)
}

//快速彩统计-所有彩种
export const fastLotteryStatistical = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'fastLotteryStatistical',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}


//快速彩统计-全站
export const fastLotteryStatisticalById = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'fastLotteryStatisticalById',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}


//快速彩统计=单站
export const fastLotteryStatisticalBySiteid = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'fastLotteryStatisticalBySiteid',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}

// 支付平台列表

export const payChatJavaSiteList = (data) => {
  let postData = {
    url: '/payChatJavaSiteList',
    method: 'get',
    data
  }
  return axios.request(postData)
}

//支付列表配置
export const payChatJavaSite = (data, noShowTip) => {
  let postData = {
    url: 'payChatJavaSite',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

export const automaticWithdrawalPlatformSort = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalPlatformSort',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//全自动配置获取数据
export const automaticWithdrawalScheduleGet = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalScheduleGet',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//全自动配置提交
export const automaticWithdrawalSchedule = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalSchedule',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//全自动出款银行
export const automaticWithdrawalEnableBankList = (data, noShowTip) => {
  let postData = {
    url: 'automaticWithdrawalEnableBankList',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//额度修改
export const adminBalanceUpdate = (data, noShowTip) => {
  let postData = {
    url: 'adminBalanceUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}



export const PaymentClassLabelList = data => {
  const {
    params,
    query
  } = data
  let postData = {
    url: 'PaymentClassLabelList',
    method: 'post',
    data: params
  }
  if (query) postData.params = query
  return axios.request(postData)
}


export const PaymentClassLabelEdit = (data, noShowTip) => {
  let postData = {
    url: 'PaymentClassLabelEdit',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//优惠配置支付列表
export const PaymentClassLabelPreferentialConfigList = (data, noShowTip) => {
  const {params,query} = data
  let postData = {
    url: 'PaymentClassLabelPreferentialConfigList',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}

//优惠配置添加修改
export const PaymentClassLabelPreferentialConfigUp = (data, noShowTip) => {
  let postData = {
    url: 'PaymentClassLabelPreferentialConfigUp',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//优惠配置支付跳转

export const PaymentClassLabelPayJump = (data, noShowTip) => {
  
  let postData = {
    url: 'PaymentClassLabelPayJump',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// 域名層級列表
export const domainLevelList = (params) => {
  let postData = {
    url: '/domainLevelList',
    method: 'get',
    params
  }
  return axios.request(postData)
}

//新增
export const domainLevelCreate = (data, noShowTip) => {
  
  let postData = {
    url: 'domainLevelCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//编辑
export const domainLevelUpdate = (data, noShowTip) => {
  
  let postData = {
    url: 'domainLevelUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}


// 域名分组列表
export const domainGroupList = (params) => {
  let postData = {
    url: '/domainGroupList',
    method: 'get',
    params
  }
  return axios.request(postData)
}

//删除
export const domainGroupDelete = (params,noShowTip) => {
  let postData = {
    url: '/domainGroupDelete',
    method: 'get',
    params
  }
  return axios.request(postData,noShowTip)
}

//新增
export const domainGroupCreate = (data, noShowTip) => {
  
  let postData = {
    url: 'domainGroupCreate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}
//编辑
export const domainGroupUpdate = (data, noShowTip) => {
  
  let postData = {
    url: 'domainGroupUpdate',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}


//群发件
export const getMessageGroupList = (data, noShowTip) => {
  const {params,query} = data
  let postData = {
    url: 'getMessageGroupList',
    method: 'post',
    data:params
  }
  if (query) postData.params = query
  return axios.request(postData, noShowTip)
}

//删除
export const messageGroupDel = (data, noShowTip) => {
  
  let postData = {
    url: 'messageGroupDel',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

// messageGroupWithdraw 
export const messageGroupWithdraw = (data, noShowTip) => {
  
  let postData = {
    url: 'messageGroupWithdraw',
    method: 'post',
    data
  }
  return axios.request(postData, noShowTip)
}

//角色权限列表  
export const adminRolesList = (params,noShowTip) => {
  let postData = {
    url: '/adminRolesList',
    method: 'get',
    params
  }
  return axios.request(postData,noShowTip)
}


//编辑
export const adminRolesUpdate = (data,noShowTip) => {
  let postData = {
    url: '/adminRolesUpdate',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

//区域白名单

export const whiteListUp = (data,noShowTip) => {
  let postData = {
    url: '/whiteListUp',
    method: 'post',
    data
  }
  return axios.request(postData,noShowTip)
}

