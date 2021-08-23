var moment = require('moment')
export default {
  state: {
    lockData_pay: localStorage.lockData_pay ? JSON.parse(localStorage.lockData_pay) : {},
    lockData: localStorage.lockData ? JSON.parse(localStorage.lockData) : {},
    lockData_online: localStorage.lockData_online ? JSON.parse(localStorage.lockData_online) : {},
    lockData_income: localStorage.lockData_income ? JSON.parse(localStorage.lockData_income) :{},
    lockData_moneyWithdrawal:localStorage.lockData_moneyWithdrawal ? JSON.parse(localStorage.lockData_moneyWithdrawal) :{},
    // 彩票中的颜色
    sixLotteryColor: [{
      color: '#ed3e14',
      number: [1, 7, 23, 29, 45, 12, 18, 30, 34, 13, 19, 35, 2, 8, 24, 40, 46]
    },
    {
      color: '#47cb89',
      number: [5, 16, 21, 27, 32, 38, 43, 6, 11, 17, 22, 28, 33, 39, 44, 49]
    },
    {
      color: '#2d8cf0',
      number: [3, 9, 25, 41, 47, 10, 14, 36, 15, 31, 37, 4, 20, 26, 42, 48]
    }
    ],
    //棋牌站点的id
    chessList:[209,42,63,25,43,41,70,22,73,71,72,16,4,14,74,14,8,50,61,68,10,75,78,77,79,80,81,82,83,85,86],
    // 工资等级阶数
    wageLevelList: [
      { name: '第1阶', value: 1 },
      { name: '第2阶', value: 2 },
      { name: '第3阶', value: 3 },
      { name: '第4阶', value: 4 },
      { name: '第5阶', value: 5 },
      { name: '第6阶', value: 6 },
      { name: '第7阶', value: 7 },
      { name: '第8阶', value: 8 },
      { name: '第9阶', value: 9 },
      { name: '第10阶', value: 10 },
      { name: '第11阶', value: 11 },
      { name: '第12阶', value: 12 },
      { name: '第13阶', value: 13 },
      { name: '第14阶', value: 14 },
      { name: '第15阶', value: 15 },
      { name: '第16阶', value: 16 },
      { name: '第17阶', value: 17 },
      { name: '第18阶', value: 18 },
      { name: '第19阶', value: 19 },
      { name: '第20阶', value: 20 }
    ],
    // 会员查询的导出字段
    exportDataList: [
      { name: '注册时间', value: 'created_at' },
      { name: '登陆时间', value: 'lastTime' },
      { name: '会员账号', value: 'userName' },
      { name: '姓名', value: 'realName' },
      { name: '账号类型', value: 'account_type' },
      { name: '等级', value: 'levelAlias' },
      { name: '上级代理', value: 'agencyName' },
      { name: '账号余额', value: 'balance' },
      { name: '佣金余额', value: 'agency_balance' },
      { name: '未登陆/天', value: 'not_login_day' },
      { name: '存款总额', value: 'total_deposit_amount' },
      { name: '公司入款', value: 'offline_deposit_amount' },
      { name: '在线支付', value: 'online_deposit_amount' },
      { name: '最大单笔', value: 'max_deposit' },
      { name: '取款总额', value: 'withdrawals_amount' },
      { name: '现金利润', value: 'cash_profit' },
      { name: '有效投注', value: 'valid_bet_amount' },
      { name: '会员输赢', value: 'net_amount' }
    ],
    // 编辑权限弹框的小图标提示文字
    tipList: {
      member_list: '会员查询/在线会员：列表，详情，刷新第三方余额',
      member_edit: '会员查询/在线会员：状态修改，编辑，转回第三方余额，导出EXCEL',
      member_level_list:'会员等级列表，支付通道详情',
      // member_set_payment: '会员等级通道详情，支付设置',
      member_refund_edit: '修改状态，编辑，添加返水等级',
      member_bank_manage_edit: '控制银行卡和usdt的编辑，删除，修改状态功能',
      deposit_list: '在线支付列表，公司入款列表',
      third_payment_manage_edit: '修改状态，编辑，删除，支付修改，添加支付平台',
      income_card_manage_operation: '包含添加，编辑，删除中的所有权限',
      site_manage: '站点列表，详情，编辑',
      in_box_info: '收件箱列表，回复选中，回复，详情，删除，删除选中',
      out_box_info: '发件箱列表，发站内信，详情，删除，删除选中',
      agency_exception_domain: '域名分组，代理域名，异常域名，邀请码管理',
      admin_manage:'状态，编辑，修改密码，复制，删除，新增',
      admin_balance_update:'列表，额度'
    },
    // 游戏记录不同平台的数据
    // 电子记录
    slot: [{
      title: '注单编号',
      key: 'billNo',
      align: 'center',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '会员账号',
      key: 'userName',
      align: 'center',
      minWidth: 75
    },
    {
      title: '游戏账号',
      key: 'playerName',
      align: 'center',
      minWidth: 95
    },
    {
      title: '游戏平台',
      key: 'platform',
      align: 'center',
      minWidth: 60,
      tooltip: true
    },
    {
      title: '投注金额',
      key: 'betAmount',
      align: 'center',
      minWidth: 75,
      render: (h, params) => < span > {Number(params.row.betAmount).toFixed(2)} </span>
    },
    {
      title: '有效投注',
      key: 'validBetAmount',
      align: 'center',
      minWidth: 75,
      render: (h, params) => < span > {Number(params.row.validBetAmount).toFixed(2)} </span>
    },
    {
      title: '会员输赢',
      key: 'netAmount',
      align: 'center',
      minWidth: 75,
      //  render: (h, params) => < span class='red-font' > {Number(params.row.netAmount).toFixed(2)} </span>
      render: (h, params) => {
        let color =
        params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
        return (
          <span style={{ color }}>
            {Number(params.row.netAmount).toFixed(2)}
          </span>
        )
    }
    },
    {
      title: '游戏名称',
      key: 'gameName',
      align: 'center',
      minWidth: 75
    },
    {
      title: '下注时间',
      key: 'betTime',
      align: 'center',
      minWidth: 130,
      render: (h, params) => < span > {moment.unix(params.row.betTime).format('YYYY-MM-DD HH:mm:ss')} </span>
    }
    ],
    // 棋牌
    chess: [{
      title: '注单编号',
      key: 'billNo',
      align: 'center',
      tooltip: true,
      minWidth: 120
    },
    {
      title: '会员账号',
      key: 'userName',
      align: 'center',
      minWidth: 75
    },
    {
      title: '游戏账号',
      key: 'playerName',
      align: 'center',
      minWidth: 95
    },
    {
      title: '游戏平台',
      key: 'platform',
      align: 'center',
      minWidth: 60,
      tooltip: true
    },
    {
      title: '投注金额',
      key: 'betAmount',
      align: 'center',
      minWidth: 75,
      render: (h, params) => < span > {Number(params.row.betAmount).toFixed(2)} </span>
    },
    {
      title: '有效投注',
      key: 'validBetAmount',
      align: 'center',
      minWidth: 75,
      render: (h, params) => < span > {Number(params.row.validBetAmount).toFixed(2)} </span>
    },
    {
      title: '会员输赢',
      key: 'netAmount',
      align: 'center',
      minWidth: 80,
      // render: (h, params) => < span class='red-font' > {Number(params.row.netAmount).toFixed(2)} </span>
      render: (h, params) => {
        let color =
        params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
        return (
          <span style={{ color }}>
            {Number(params.row.netAmount).toFixed(2)}
          </span>
        )
    }
    },
    {
      title: '游戏名称',
      key: 'gameName',
      align: 'center',
      minWidth: 70,
      tooltip: true
    },
    {
      title: '抽水',
      key: 'revenue',
      align: 'center',
      width: 70,
      render: (h, params) => < span > {Number(params.row.revenue).toFixed(2)} </span>
    },
    {
      title: '下注时间',
      key: 'betTime',
      align: 'center',
      minWidth: 130,
      render: (h, params) => < span > {moment.unix(params.row.betTime).format('YYYY-MM-DD HH:mm:ss')} </span>
    }
    ],
    // 彩票
    lottery: [{
      title: '注单编号',
      key: 'billNo',
      align: 'center',
      tooltip:true,
      minWidth: 155
    },
    {
      title: '会员账号',
      key: 'userName',
      align: 'center'
    },
    {
      title: '游戏平台',
      key: 'lotteryName',
      align: 'center'
    },
    {
      title: '期数',
      key: 'issue',
      align: 'center',
      render: (h, params) => {
        let issue = String(params.row.issue)
        let year = new Date().getFullYear()
        if (Number(issue.substring(0, 4)) === Number(year)) {
          return <span>{issue.substring(4, issue.length)}</span>
        } else return <span>{params.row.issue}</span>
      }
    },
    {
      title: '投注金额',
      key: 'betAmount',
      align: 'center',
      render: (h, params) => < span > {Number(params.row.betAmount).toFixed(2)} </span>
    },
    {
      title: '有效投注',
      key: 'validBetAmount',
      align: 'center',
      render: (h, params) => < span > {Number(params.row.validBetAmount).toFixed(2)} </span>
    },
    {
      title: '会员输赢',
      key: 'netAmount',
      align: 'center',
      //  render: (h, params) => < span > {Number(params.row.netAmount).toFixed(2)} </span>
      render: (h, params) => {
        let color =
        params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
        return (
          <span style={{ color }}>
            {Number(params.row.netAmount).toFixed(2)}
          </span>
        )
    }
    },
    {
      title: '玩法',
      key: 'playwayName',
      align: 'center'
    },
    {
      title: '玩号',
      key: 'ball',
      align: 'center',
      render: (h, params) => < span > {params.row.ball ? params.row.ball : '-'} </span>
    },
    {
      title: '下注内容',
      key: 'betInfo',
      align: 'center',
      minWidth:75,
      tooltip: true
    },
    {
      title: '赔率',
      key: 'odds',
      align: 'center'
    },
    {
      title: '开奖结果',
      key: 'result',
      align: 'center',
      render: (h, params) => < span > {params.row.result ? params.row.result : '-'} </span>
    },
    {
      title: '返点值',
      key: 'rebate',
      align: 'center',
      render: (h, params) => < span > {Number(params.row.rebate).toFixed(2)} </span>
    },
    {
      title: '返点金额',
      key: 'fdAmount',
      align: 'center',
      render: (h, params) => < span > {Number(params.row.fdAmount).toFixed(2)} </span>
    },
    {
      title: '开奖状态',
      key: 'status',
      align: 'center',
      render: (h, params) => {
        let { status } = params.row
        let text = status === 0 ? '未结算' : (status === 1 ? '赢 ' : (status === 2 ? '输' : (status === 3 ? '和' : (status === 4 ? '取消' : '撤销'))))
        return <span > {text} </span>
      }
    },
    {
      title: '下注时间/结算时间',
      key: 'betTime',
      align: 'center',
      width: 150,
      render: (h, params) => {
        return (< div class='flex-colum' >
          <div class='bb mb5' > {moment.unix(params.row.betTime).format('YYYY-MM-DD HH:mm:ss')} </div>
          <div> {params.row.openTime ? moment.unix(params.row.openTime).format('YYYY-MM-DD HH:mm:ss') : '-'} </div>
        </div>
        )
      }
    }
    ],
    // 平台报表 会员
    gameReportByMember: [{
      title: '会员账号',
      key: 'userName',
      align: 'center'
    },
    {
      title: '上级代理',
      key: 'agencyName',
      align: 'center',
      render: (h, params) => {
        return (
          <span>{params.row.agencyName ? params.row.agencyName : '-'}</span>
        )
      }
    },
    {
      title: '注单数量',
      key: 'betCount',
      align: 'center',
      sortable: 'custom'
    },
    {
      title: '投注金额',
      key: 'betAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.betAmount).toFixed(2)} </span>
    },
    {
      title: '有效投注',
      key: 'validBetAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.validBetAmount).toFixed(2)} </span>
    },
    {
      title: '平台输赢',
      key: 'netAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => {
        let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
        return <span style={{ color }}>{Number(params.row.netAmount).toFixed(2)}</span>
      }
    },
    {
      title: '盈率',
      key: 'winRate',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => {
        let color = params.row.winRate > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
        return <span style={{ color }}>{Number(params.row.winRate).toFixed(2)}%</span>
      }
    }
    ],
    // 平台报表 按游戏
    gameReportByGame: [{
      title: '游戏类型',
      key: 'gameName',
      align: 'center',
      render: (h, params) => {
        let { gameName } = params.row
        params.row.gameName = gameName === '3分赛车' ? '快乐赛车' : gameName === '5分赛车' ? '幸运赛车' : gameName
        return <span>{params.row.gameName}</span>
      }
    },
    {
      title: '投注人数',
      key: 'betUserCount',
      align: 'center',
      sortable: 'custom'
    },
    {
      title: '注单数量',
      key: 'betCount',
      align: 'center',
      sortable: 'custom'
    },
    {
      title: '投注金额',
      key: 'betAmount',
      align: 'center',
      render: (h, params) => < span > {Number(params.row.betAmount).toFixed(2)} </span>
    },
    {
      title: '有效投注',
      key: 'validBetAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.validBetAmount).toFixed(2)} </span>
    },
    {
      title: '平台输赢',
      key: 'netAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => {
        let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
        return <span style={{ color }}>{Number(params.row.netAmount).toFixed(2)}</span>
      }
    },
    {
      title: '盈率',
      key: 'winRate',
      align: 'center',
      render: (h, params) => {
        let color = params.row.winRate > '0%' ? '#FF2626' :'rgb(35, 153, 97) ';
        return <span style={{ color }}>{params.row.winRate}</span>
      }
    }
    ],
    // 对应的银行卡图片
    bankImages: [
      { bankName: '包商银行', img: require('../../assets/images/包商银行.png') },
      { bankName: '中信银行', img: require('../../assets/images/中信银行.png') },
      { bankName: '中国银行', img: require('../../assets/images/中国银行.png') },
      { bankName: '交通银行', img: require('../../assets/images/交通银行.png') },
      { bankName: '光大银行', img: require('../../assets/images/光大银行.png') },
      { bankName: '兴业银行', img: require('../../assets/images/兴业银行.png') },
      { bankName: '农业银行', img: require('../../assets/images/农业银行.png') },
      { bankName: '北京银行', img: require('../../assets/images/北京银行.png') },
      { bankName: '华夏银行', img: require('../../assets/images/华夏银行.png') },
      { bankName: '工商银行', img: require('../../assets/images/工商银行.png') },
      { bankName: '建设银行', img: require('../../assets/images/建设银行.png') },
      { bankName: '招商银行', img: require('../../assets/images/招商银行.png') },
      { bankName: '民生银行', img: require('../../assets/images/民生银行.png') },
      { bankName: '江苏银行', img: require('../../assets/images/江苏银行.png') },
      { bankName: '浙商银行', img: require('../../assets/images/浙商银行.png') },
      { bankName: '浦发银行', img: require('../../assets/images/浦发银行.png') },
      { bankName: '邮政银行', img: require('../../assets/images/邮政银行.png') },
      { bankName: '默认银行', img: require('../../assets/images/默认.png') },
      { bankName: '上海银行', img: require('../../assets/images/上海银行.png') },
      { bankName: '东莞银行', img: require('../../assets/images/东莞.png') },
      { bankName: '广发银行', img: require('../../assets/images/广发.png') },
      { bankName: '平安银行', img: require('../../assets/images/平安.png') },
      { bankName: '徽商银行', img: require('../../assets/images/徽商.png') },
      { bankName: '成都银行', img: require('../../assets/images/成都银行.png') },
      { bankName: '农村信用社', img: require('../../assets/images/农村信用社.png') },
      { bankName: '哈尔滨银行', img: require('../../assets/images/哈尔滨.png') },
      { bankName: '广州农村商业银行', img: require('../../assets/images/广州农村商业银行.png') },
      { bankName: '北京农村商业银行', img: require('../../assets/images/北京农商.png') },
      { bankName: '福建农村信用社', img: require('../../assets/images/福建农村信用社.png') },
      { bankName: '浙江网商银行', img: require('../../assets/images/浙江网商银行.png') },
      { bankName: '吉林银行', img: require('../../assets/images/吉林银行.png') },

    ],
    bankList: ['包商银行', '中信银行', '中国银行', '交通银行', '光大银行', '兴业银行', '农业银行', '北京银行',
      '华夏银行', '工商银行', '建设银行', '招商银行', '民生银行', '江苏银行', '浙商银行', '浦发银行', '邮政银行',
      '上海银行', '东莞银行', '广发银行', '平安银行', '徽商银行','成都银行', '农村信用社', '哈尔滨银行', '广州农村商业银行',
      ,'北京农村商业银行','福建农村信用社','浙江网商银行','吉林银行',
    ],
    // 写死的会员等级数据
    memberLevelList: [
      { levelLabel: '1', levelName: 'VIP1' },
      { levelLabel: '2', levelName: 'VIP2' },
      { levelLabel: '3', levelName: 'VIP3' },
      { levelLabel: '4', levelName: 'VIP4' },
      { levelLabel: '5', levelName: 'VIP5' },
      { levelLabel: '6', levelName: 'VIP6' },
      { levelLabel: '7', levelName: 'VIP7' },
      { levelLabel: '8', levelName: 'VIP8' },
      { levelLabel: '9', levelName: 'VIP9' },
      { levelLabel: '10', levelName: 'VIP10' },
      { levelLabel: '11', levelName: 'VIP11' },
      { levelLabel: '12', levelName: 'VIP12' },
      { levelLabel: '13', levelName: 'VIP13' },
      { levelLabel: '14', levelName: 'VIP14' },
      { levelLabel: '15', levelName: 'VIP15' },
      { levelLabel: '16', levelName: 'VIP16' },
      { levelLabel: '17', levelName: 'VIP17' },
      { levelLabel: '18', levelName: 'VIP18' },
      { levelLabel: '19', levelName: 'VIP19' },
      { levelLabel: '20', levelName: 'VIP20' }
    ],
    // 写死的返水数据
    refundList: [
      { levelAlias: '等级一', levelLabel: '1', levelName: 'VIP1' },
      { levelAlias: '等级二', levelLabel: '2', levelName: 'VIP2' },
      { levelAlias: '等级三', levelLabel: '3', levelName: 'VIP3' },
      { levelAlias: '等级四', levelLabel: '4', levelName: 'VIP4' },
      { levelAlias: '等级五', levelLabel: '5', levelName: 'VIP5' },
      { levelAlias: '等级六', levelLabel: '6', levelName: 'VIP6' },
      { levelAlias: '等级七', levelLabel: '7', levelName: 'VIP7' },
      { levelAlias: '等级八', levelLabel: '8', levelName: 'VIP8' },
      { levelAlias: '等级九', levelLabel: '9', levelName: 'VIP9' },
      { levelAlias: '等级十', levelLabel: '10', levelName: 'VIP10' },
      { levelAlias: '等级十一', levelLabel: '11', levelName: 'VIP11' },
      { levelAlias: '等级十二', levelLabel: '12', levelName: 'VIP12' },
      { levelAlias: '等级十三', levelLabel: '13', levelName: 'VIP13' },
      { levelAlias: '等级十四', levelLabel: '14', levelName: 'VIP14' },
      { levelAlias: '等级十五', levelLabel: '15', levelName: 'VIP15' },
      { levelAlias: '等级十六', levelLabel: '16', levelName: 'VIP16' },
      { levelAlias: '等级十七', levelLabel: '17', levelName: 'VIP17' },
      { levelAlias: '等级十八', levelLabel: '18', levelName: 'VIP18' },
      { levelAlias: '等级十九', levelLabel: '19', levelName: 'VIP19' },
      { levelAlias: '等级二十', levelLabel: '20', levelName: 'VIP20' }
    ],
    // // 判断加减款路由的数组
    // handleTypeList: ['memberIncomeArtificialRemittance', 'memberIncomeActivitiesSend', 'memberIncomeRefundSend0', 'memberIncomeDepositFavorable', 'memberIncomeLineConversionError', 'memberIncomeOther',
    //   'memberOutArtificialTake', 'memberOutOther'
    // ],
    // 存款详情
    depositDetailList: [{
      title: '会员账号',
      key: 'userName',
      align: 'center'
    },
    {
      title: '等级',
      key: 'level',
      align: 'center'
    },
    {
      title: '在线支付',
      key: 'depositOnlineAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.depositOnlineAmount).toFixed(2)} </span>
    },
    {
      title: '公司入款',
      key: 'depositOfflineAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.depositOfflineAmount).toFixed(2)} </span>
    },
    {
      title: '存款总额',
      key: 'depositAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.depositAmount).toFixed(2)} </span>
    },
    {
      title: '取款总额',
      key: 'withdrawalsAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => <span> {Number(params.row.withdrawalsAmount).toFixed(2)} </span>
    }
    ],
    // 存款笔数
    depositCountList: [{
      title: '订单号',
      key: 'code',
      align: 'center'
    },
    {
      title: '会员账号',
      key: 'username',
      align: 'center'
    },
    {
      title: '等级',
      key: 'level',
      align: 'center'
    },
    {
      title: '存款金额',
      key: 'confirmAmount',
      align: 'center',
      render: (h, params) => < span > {Number(params.row.confirmAmount).toFixed(2)} </span>
      // sortable: 'custom'
    },
    {
      title: '存款类型',
      key: 'type',
      align: 'center'
    },
    {
      title: '支付方式',
      key: 'subType',
      align: 'center'
    },
    {
      title: '提交时间',
      key: 'time',
      align: 'center',
      render: (h, params) => <span > {moment.unix(params.row.time).format('YYYY-MM-DD HH:mm:ss')} </span>
    },
    {
      title: '审核者',
      key: 'updateUserName',
      align: 'center'
    }
    ],
    // 取款详情
    withdrawalDetailList: [{
      title: '会员账号',
      key: 'userName',
      align: 'center'
    },
    {
      title: '等级',
      key: 'level',
      align: 'center'
    },
    {
      title: '取款总额',
      key: 'withdrawalsAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.withdrawalsAmount).toFixed(2)} </span>
    },
    {
      title: '存款总额',
      key: 'depositAmount',
      align: 'center',
      sortable: 'custom',
      render: (h, params) => < span > {Number(params.row.depositAmount).toFixed(2)} </span>
    }
    ],
    // 取款笔数
    withdrawalCount: [{
      title: '订单号',
      key: 'code',
      align: 'center'
    },
    {
      title: '会员账号',
      key: 'username',
      align: 'center'
    },
    {
      title: '姓名',
      key: 'realName',
      align: 'center',
      render: (h, params) => < span > {params.row.realName ? params.row.realName : '-'} </span>
    },
    {
      title: '等级',
      key: 'level',
      align: 'center'
    },
    {
      title: '取款总额',
      key: 'amount',
      align: 'center'
      // sortable: 'custom'
    },
    {
      title: '提交时间',
      key: 'time',
      align: 'center',
      render: (h, params) => < span > {moment.unix(params.row.time).format('YYYY-MM-DD HH:mm:ss')} </span>
    },
    {
      title: '审核者',
      key: 'update_user',
      align: 'center'
    }
    ],
    // 最近7天时间的数组，为了做域名报表跳转的自动赋值
    startWeekDayList: [
      moment().startOf('days').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(2, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(3, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(4, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(5, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DD 00:00:00'),
      moment().subtract(7, 'days').startOf('day').format('YYYY-MM-DD 00:00:00')
    ],
    endWeekDayList: [
      moment().endOf('days').format('YYYY-MM-DD 23:59:59'),
      moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 23:59:59'),
      moment().subtract(2, 'days').endOf('day').format('YYYY-MM-DD 23:59:59'),
      moment().subtract(3, 'days').endOf('day').format('YYYY-MM-DD 23:59:59'),
      moment().subtract(4, 'days').endOf('day').format('YYYY-MM-DD 23:59:59'),
      moment().subtract(5, 'days').endOf('day').format('YYYY-MM-DD 23:59:59'),
      moment().subtract(6, 'days').endOf('day').format('YYYY-MM-DD 23:59:59'),
      moment().subtract(7, 'days').endOf('day').format('YYYY-MM-DD 23:59:59')
    ],
    payOnlineFresh: '0', // 在线支付 自动刷新（设置初始的属性值）
    payOnlineTimer: null, // 变量未指向任何对象（是已知存在，但是没有类型或是值）
    payCompanyFresh: '0', // 公司入款 自动刷新
    payCompanyTimer: null,
    withFresh: '0', // 线上取款 自动刷新
    withTimer: null,
    moneyWithdrawalFresh:'0',//货币取款初始值
    moneyWithdrawalTimer:null,
    virtualIncomeFresh:'0',
    virtualIncomeTimer:null,
    codeDetail: { uid: undefined, time: 1, title: 'mainCodeDetail' },
  },
  mutations: {
    setCodeDetail (state, item) {
      state.codeDetail = item
    },
    setLockData_Pay (state, data) {
      state.lockData_pay = data
      if (Object.values(data).length > 0) localStorage.lockData_pay = JSON.stringify(data)
      else localStorage.removeItem('lockData_pay')
    },
    setLockData_online (state, data) {
      state.lockData_online = data
      if (Object.values(data).length > 0) localStorage.lockData_online = JSON.stringify(data)
      else localStorage.removeItem('lockData_online')
    },
    setLockData_income (state, data) {
      state.lockData_income = data
      if (Object.values(data).length > 0) localStorage.lockData_income= JSON.stringify(data)
      else localStorage.removeItem('lockData_income')
    },
    setLockData_moneyWithdrawal(state,data){
      state.lockData_moneyWithdrawal=data
      if (Object.values(data).length > 0) localStorage.lockData_moneyWithdrawal= JSON.stringify(data)
      else localStorage.removeItem('lockData_moneyWithdrawal')
    },
    setLockData (state, data) {
      state.lockData = data
      if (Object.values(data).length > 0) localStorage.lockData = JSON.stringify(data)
      else localStorage.removeItem('lockData')
    },
    // 改变初始值的方法，传入state的参数或者额外的，用vuex的数组驱动进行改变
    // 在线支付
    setPayOnlineFresh (state, val) { // 传入了val
      // console.log(state,val)
      state.payOnlineFresh = val
    },
    setPayOnlineTimer (state) {
      clearInterval(state.payOnlineTimer)
      state.payOnlineTimer = null
    },
    // 公司入款
    setPayCompanyFresh (state, val) {
      state.payCompanyFresh = val
    },
    setPayCompanyTimer (state) {
      clearInterval(state.payCompanyTimer)
      state.payCompanyTimer = null
    },
    // 线上取款
    setWithFresh (state, val) {
      state.withFresh = val
    },
    setWithTimer (state) {
      clearInterval(state.withTimer)
      state.withTimer = null
    },
    //货币取款
    setMoneyWithdrawalFresh(state,val){ //刷新时间方法
      state.moneyWithdrawalFresh = val
    },
    setMoneyWithdrawalTimer(state){//清除时间的方法
      clearInterval(state.moneyWithdrawalTimer)
      state.moneyWithdrawalTimer = null
    },
    setVirtualIncomeFresh(state,val){
      state.virtualIncomeFresh=val
    },
    setVirtualIncome(state,val){
      clearInterval(state.virtualIncomeTimer)
      state.virtualIncomeTimer=null
    },
    // timer
    setNewOnlie (state, { time }) {
      state.payOnlineTimer = time
    },
    setnewPayCompany (state, { time }) {
      state.payCompanyTimer = time
    },
    setnewWithTimer (state, { time }) {
      state.withTimer = time
    },
    setNewMoneyWithdrawal(state,{time}){
      state.moneyWithdrawalTimer = time
    },
    setNewVirtualIncome(state,{time}){
      state.virtualIncomeTimer = time
    }
  },
  // 包含异步的操作，触发mutations的方法
  actions: {
    // 改变刷新时间
    changeFresh ({ commit }, { stage, val }) {
      // 触发mutations的方法
      if (stage === 'payOnline') {
        commit('setPayOnlineFresh', val)
      } else if (stage === 'payCompany') {
        commit('setPayCompanyFresh', val)
      }else if(stage === 'moneyWithdrawal'){
        commit('setMoneyWithdrawalFresh', val)
      }else if(stage=='virtualIncome'){
        commit('setVirtualIncomeFresh',val)
      } else {
        commit('setWithFresh', val)
      }
    },
    // 清除定时器
    clearTime ({ commit }, stage) {
      if (stage === 'payOnline') {
        commit('setPayOnlineTimer')
      } else if (stage === 'payCompany') {
        commit('setPayCompanyTimer')
      }else if(stage === 'moneyWithdrawal'){
        commit('setMoneyWithdrawalTimer')
      }else if(stage === 'virtualIncome'){
        commit('setVirtualIncome')

      } else {
        commit('setWithTimer')
      }
    },
    // 设置
    setTimer ({ commit }, { stage, time }) {
      if (stage === 'payOnline') {
        commit('setNewOnlie', { time })
      } else if (stage === 'payCompany') {
        commit('setnewPayCompany', { time })
      }else if(stage==='moneyWithdrawal'){
        commit('setNewMoneyWithdrawal',{time})
      }else if(stage==='virtualIncome'){
        commit('setNewVirtualIncome',{time})
      } else {
        commit('setnewWithTimer', { time })
      }
    }
  }

}
