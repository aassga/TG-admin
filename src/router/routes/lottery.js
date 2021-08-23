const lottery = {
  path: '/lottery',
  name: 'lottery',
  meta: {
    title: '彩票管理',
    hideInMenu: true,
    hideInTop: false
  },
  component: () => import('@/components/main'),
  redirect: { name: 'fastLottery' },
  newChild: [],
  children: [
    {
      path: 'fastLottery',
      name: 'fastLottery',
      uri: 'api/v2/lotteryOpenNumberListFast',
      routeKey: 'fastLottery',
      parentKey: 'lottery',
      meta: {
        title: '快速彩票',
        icon: 'cebianlankuaisucaipiao',
        hideInMenu: false
      },
      component: () => import('@/views/lottery/fastLottery')
    },
    {
      path: 'singleFastLottery',
      name: 'singleFastLottery',
      uri: 'api/v2/companyBankCardModifyStatus',
      routeKey: 'singleFastLottery',
      parentKey: 'lottery',
      meta: {
        title: '单站快速彩票',
        icon: 'cebianlankuaisucaipiao',
        hideInMenu: false
      },
      component: () => import('@/views/lottery/singleFastLottery')
    },
    {
      path: 'fastLotteryBlack',
      name: 'fastLotteryBlack',
      uri: 'api/v1/file/aiCheck',
      routeKey: 'fastLotteryBlack',
      parentKey: 'lottery',
      meta: {
        title: '快速彩票黑名单',
        icon: 'cebianlankuaisucaiheimingdan'
      },
      component: () =>
        import('@/views/lottery/fastLotteryBlack')
    },
    {
      path: 'oddSet',
      name: 'oddSet',
      uri: 'api/v2/systemMemberLevelListDefault',
      parentKey: 'lottery',
      routeKey: 'oddSet',
      meta: {
        title: '赔率设置',
        icon: 'peishuaishezhi'
      },
      component: () => import('@/views/lottery/oddSet')
    },
    {
      path: 'timeSet',
      name: 'timeSet',
      uri: 'api/v2/lotteryTimeList/{lid}',
      routeKey: 'timeSet',
      parentKey: 'lottery',
      meta: {
        title: '时间设置',
        icon: 'shijianshezhi'
      },
      component: () => import('@/views/lottery/timeSet')
    },
    {
      path: 'lotteryManagement',
      name: 'lotteryManagement',
      uri: 'api/v2/systemMemberLevelList',
      routeKey: 'lotteryManagement',
      parentKey: 'lottery',
      meta: {
        title: '官方彩开奖管理',
        icon: 'cebianlankaijiangguanli'
      },
      component: () => import('@/views/lottery/lotteryManagement')
    },
    {
      path: 'otherLotteryManagement',
      name: 'otherLotteryManagement',
      uri: 'api/fastLottery/openData',
      routeKey: 'otherLotteryManagement',
      parentKey: 'lottery',
      meta: {
        title: '快速彩开奖管理',
        icon: 'cebianlancaipiaobaobiao'
      },
      component: () =>
        import('@/views/lottery/otherLotteryManagement')
    },
    {
      path: 'noPrizeList',
      name: 'noPrizeList',
      uri: 'api/lottery/openLottery',
      parentKey: 'lottery',
      routeKey: 'noPrizeList',
      meta: {
        title: '未开奖列表',
        icon: 'cebianlandangqiankaijiangqi'
      },
      component: () => import('@/views/lottery/noPrizeList')
    },
    {
      path: 'oddsSetting',
      name: 'oddsSetting',
      parentKey: 'lottery',
      meta: {
        title: '赔率设置',
        hideInMenu: true
      },
      component: () => import('@/views/lottery/oddsSetting')
    },
    {
      path: 'oddsSetting1',
      name: 'oddsSetting1',
      parentKey: 'lottery',
      meta: {
        title: '赔率设置',
        hideInMenu: true
      },
      component: () => import('@/views/lottery/oddsSetting1')
    },
    {
      path: 'markTimeSetting',
      name: 'markTimeSetting',
      parentKey: 'lottery',
      meta: {
        title: '时间设置',
        hideInMenu: true
      },
      component: () => import('@/views/lottery/markTimeSetting')
    },
    {
      path: 'timesSettingAno',
      name: 'timesSettingAno',
      parentKey: 'lottery',
      meta: {
        title: '时间设置',
        hideInMenu: true
      },
      component: () => import('@/views/lottery/timeSettingAno')
    },
    {
      path: 'fastLotteryDetails',
      name: 'fastLotteryDetails',
      parentKey: 'lottery',
      meta: {
        title: '彩票详情',
        hideInMenu: true,
        notCache: true
      },
      component: () => import('@/views/lottery/fastLotteryDetails')
    }
  ]
}

export default lottery
