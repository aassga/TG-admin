export default {
  state: {
    passStatus:false,
    game_report_live: [
      { name: '注单编号', class: 'ivu-table-column-center', minWidth: 160, key: 'billNo' },
      { name: '会员账号', class: 'ivu-table-column-center', minWidth: 60, key: 'userName' },
      { name: '游戏账号', class: 'ivu-table-column-center', minWidth: 95, key: 'playerName' },
      { name: '游戏平台', class: 'ivu-table-column-center', minWidth: 95, key: 'platform' },
      { name: '局号', class: 'ivu-table-column-center', minWidth: 95, key: 'gameCode' },
      { name: '投注金额', class: 'ivu-table-column-center', minWidth: 70, key: 'betAmount' },
      { name: '有效投注', class: 'ivu-table-column-center', minWidth: 80, key: 'validBetAmount' },
      { name: '会员输赢', class: 'ivu-table-column-center', minWidth: 70, key: 'netAmount' },
      { name: '游戏名称', class: 'ivu-table-column-center', minWidth: 75, key: 'gameName' },
      { name: '下注内容', class: 'ivu-table-column-center', minWidth: 75, key: 'betInfo' },
      { name: '下注时间', class: 'ivu-table-column-center', minWidth: 130, key: 'betTime' }
    ],
    game_report_slot: [
      { name: '注单编号', class: 'ivu-table-column-center', minWidth: 120, key: 'billNo' },
      { name: '会员账号', class: 'ivu-table-column-center', minWidth: 75, key: 'userName' },
      { name: '游戏账号', class: 'ivu-table-column-center', minWidth: 95, key: 'playerName' },
      { name: '游戏平台', class: 'ivu-table-column-center', minWidth: 60, key: 'platform' },
      { name: '投注金额', class: 'ivu-table-column-center', minWidth: 75, key: 'betAmount' },
      { name: '有效投注', class: 'ivu-table-column-center', minWidth: 75, key: 'validBetAmount' },
      { name: '会员输赢', class: 'ivu-table-column-center', minWidth: 75, key: 'netAmount' },
      { name: '游戏名称', class: 'ivu-table-column-center', minWidth: 75, key: 'gameName' },
      { name: '下注时间', class: 'ivu-table-column-center', minWidth: 130, key: 'betTime' }
    ],
    game_report_chess: [
      { name: '注单编号', class: 'ivu-table-column-center', minWidth: 120, key: 'billNo' },
      { name: '会员账号', class: 'ivu-table-column-center', minWidth: 75, key: 'userName' },
      { name: '游戏账号', class: 'ivu-table-column-center', minWidth: 95, key: 'playerName' },
      { name: '游戏平台', class: 'ivu-table-column-center', minWidth: 60, key: 'platform' },
      { name: '投注金额', class: 'ivu-table-column-center', minWidth: 75, key: 'betAmount' },
      { name: '有效投注', class: 'ivu-table-column-center', minWidth: 75, key: 'validBetAmount' },
      { name: '会员输赢', class: 'ivu-table-column-center', minWidth: 80, key: 'netAmount' },
      { name: '游戏名称', class: 'ivu-table-column-center', minWidth: 70, key: 'gameName' },
      { name: '抽水', class: 'ivu-table-column-center', minWidth: 70, key: 'revenue' },
      { name: '下注时间', class: 'ivu-table-column-center', minWidth: 130, key: 'betTime' }
    ],
    game_report_lottery: [
      { name: '注单编号', class: 'ivu-table-column-center', minWidth: 90, key: 'billNo' },
      { name: '会员账号', class: 'ivu-table-column-center', minWidth: 65, key: 'userName' },
      { name: '游戏平台', class: 'ivu-table-column-center', minWidth: 70, key: 'lotteryName' },
      { name: '期数', class: 'ivu-table-column-center', minWidth: 85, key: 'issue' },
      { name: '投注金额', class: 'ivu-table-column-center', minWidth: 75, key: 'betAmount' },
      { name: '有效投注', class: 'ivu-table-column-center', minWidth: 60, key: 'validBetAmount' },
      { name: '会员输赢', class: 'ivu-table-column-center', minWidth: 85, key: 'netAmount' },
      { name: '下注内容', class: 'ivu-table-column-center', minWidth: 115, key: 'betInfo' },
      { name: '赔率', class: 'ivu-table-column-center', minWidth: 80, key: 'odds' },
      { name: '开奖结果', class: 'ivu-table-column-center', minWidth: 90, key: 'result' },
      { name: '返点金额', class: 'ivu-table-column-center', minWidth: 60, key: 'fdAmount' },
      { name: '开奖状态', class: 'ivu-table-column-center', minWidth: 55, key: 'status' },
      { name: '下注时间/结算时间', class: 'ivu-table-column-center', minWidth: 120, key: 'betTime' },
      { name: '操作', class: 'ivu-table-column-center', minWidth: 30 }
    ],
    game_report_sport: [
      { name: '注单编号', class: 'ivu-table-column-center', minWidth: 155, key: 'billNo' },
      { name: '会员账号', class: 'ivu-table-column-center', minWidth: 75, key: 'userName' },
      { name: '游戏账号', class: 'ivu-table-column-center', minWidth: 110, key: 'playerName' },
      { name: '游戏平台', class: 'ivu-table-column-center', minWidth: 75, key: 'platform' },
      { name: '投注金额', class: 'ivu-table-column-center', minWidth: 65, key: 'betAmount' },
      { name: '有效投注', class: 'ivu-table-column-center', minWidth: 55, key: 'validBetAmount' },
      { name: '会员输赢', class: 'ivu-table-column-center', minWidth: 75, key: 'netAmount' },
      { name: '游戏名称', class: 'ivu-table-column-center', minWidth: 60, key: 'gameName' },
      { name: '下注内容', class: 'ivu-table-column-center', minWidth: 100 },
      { name: '状态', class: 'ivu-table-column-center', minWidth: 45, key: 'status' }
    ],
    domainLevelList: [
        {
            value: '0',
            label: '未分层',
            disabled: false,
        },
      {
          value: '1',
          label: '第一层',
          disabled: false,
      },
      {
          value: '2',
          label: '第二层',
          disabled: false,
      },
      {
          value: '3',
          label: '第三层',
          disabled: false,
      },
      {
          value: '4',
          label: '第四层',
          disabled: false,
      },
      {
          value: '5',
          label: '第五层',
          disabled: false,
      },
      {
          value: '6',
          label: '第六层',
          disabled: false,
      },
      {
          value: '7',
          label: '第七层',
          disabled: false,
      },
      {
          value: '8',
          label: '第八层',
          disabled: false,
      },
      {
          value: '9',
          label: '第九层',
          disabled: false,
      },
      {
          value: '10',
          label: '第十层',
          disabled: false,
      },
      {
          value: '11',
          label: '第十一层',
          disabled: false,
      },
      {
          value: '12',
          label: '第十二层',
          disabled: false,
      },
      {
          value: '13',
          label: '第十三层',
          disabled: false,
      },
      {
          value: '14',
          label: '第十四层',
          disabled: false,
      },
      {
          value: '15',
          label: '第十五层',
          disabled: false,
      },
      {
          value: '16',
          label: '第十六层',
          disabled: false,
      },
      {
          value: '17',
          label: '第十七层',
          disabled: false,
      },
      {
          value: '18',
          label: '第十八层',
          disabled: false,
      },
      {
          value: '19',
          label: '第十九层',
          disabled: false,
      },
      {
          value: '20',
          label: '第二十层',
          disabled: false,
      }
    ],
  },
  mutations:{

  }
}
