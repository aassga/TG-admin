const report = {
  path: '/report',
  name: 'report',
  meta: {
    title: '报表管理',
    hideInMenu: true,
    hideInTop: false
  },
  component: () =>
    import('@/components/main'),
  redirect: {
    name: 'complexReport'
  },
  newChild: [],
  children: [{
      path: 'complexReport',
      name: 'complexReport',
      routeKey: 'complexReport',
      parentKey: 'report',
      meta: {
        title: '综合报表',
        icon: 'cebianlanzonghebaobiao'
      },
      component: () =>
        import('@/views/report/complexReport')
    },
    {
      path: 'complexReportDetail',
      name: 'complexReportDetail',
      meta: {
        title: '存款详情',
        hideInMenu: true,
        activeKey: 'complexReport'
      },
      beforeEnter: (to, from, next) => {
        switch (to.params.stage) {
          case 'depositDetail':
            to.meta.title = '存款详情'
            break
          case 'depositCount':
            to.meta.title = '存款笔数'
            break
          case 'withDetail':
            to.meta.title = '取款详情'
            break
          default:
            to.meta.title = '取款笔数'
            break
        }
        next()
      },
      component: () =>
        import('@/views/report/complexReportDetail')
    },
    {
      path: 'totalReportChildren',
      name: 'totalReportChildren',
      parentKey: 'report',
      meta: {
        title: '报表下级',
        hideInMenu: true
      },
      component: () =>
        import('@/views/report/totalReportChildren')
    },
    {
      path: 'totalReportGameChildren',
      name: 'totalReportGameChildren',
      parentKey: 'report',
      meta: {
        title: '报表下级',
        hideInMenu: true
      },
      component: () =>
        import('@/views/report/totalReportGameChildren')
    },
    {
      path: 'gameReport',
      name: 'gameReport',
      parentKey: 'report',
      routeKey: 'gameReport',
      meta: {
        title: '即时注单',
        icon: 'cebianlanyouxijilubaobiao'
      },
      component: () =>
        import('@/views/report/gameReport')
    },
    {
      path: 'firstDepositReport',
      name: 'firstDepositReport',
      routeKey: 'firstDepositReport',
      parentKey: 'report',
      meta: {
        title: '首存报表',
        icon: 'cebianlanshoucunbaobiao'
      },
      component: () =>
        import('@/views/report/firstDepositReport')
    },
    {
      path: 'platformReport',
      name: 'platformReport',
      parentKey: 'report',
      routeKey: 'platformReport',
      meta: {
        title: '平台报表',
        icon: 'cebianlanpingtaibaobiao'
      },
      component: () =>
        import('@/views/report/platformReport')
    },
    {
      path: 'platformReport/detail',
      name: 'platformReportDetail',
      parentKey: 'report',
      meta: {
        title: '平台报表详情',
        hideInMenu: true,
        activeKey: 'platformReport'
      },
      component: () =>
        import('@/views/report/platformReportDetail')
    },
    {
      path: 'lotteryReport',
      name: 'lotteryReport',
      parentKey: 'report',
      routeKey: 'lotteryReport',
      meta: {
        title: '彩票报表',
        icon: 'cebianlancaipiaobaobiao'
      },
      component: () =>
        import('@/views/report/lotteryReport')
    },
    {
      path: 'fightReport',
      name: 'fightReport',
      parentKey: 'report',
      routeKey: 'fightReport',
      meta: {
        title: '对打报表',
        icon: 'duidabaobiao'
      },
      component: () =>
        import('@/views/report/fightReport')
    },
    {
      path: 'lotteryReport/detail',
      name: 'lotteryReportDetail',
      parentKey: 'report',
      meta: {
        notCache: true,
        title: '彩票报表详情',
        hideInMenu: true,
        activeKey: 'lotteryReport'
      },
      component: () =>
        import('@/views/report/lotteryReportDetail')
    },
    {
      path: 'memberReport',
      name: 'memberReport',
      parentKey: 'report',
      routeKey: 'memberReport',
      meta: {
        title: '会员报表',
        icon: 'huiyuanbaobiao'
      },
      component: () =>
        import('@/views/report/memberReport')
    },
    {
      path: 'activityReport',
      name: 'activityReport',
      parentKey: 'report',
      routeKey: 'activityReport',
      meta: {
        title: '活动报表',
        icon: 'cebianlanhuiyuanbaobiao'
      },
      component: () =>
        import('@/views/report/activityReport')
    },
    {
      path: 'agencyReport',
      name: 'agencyReport',
      parentKey: 'report',
      routeKey: 'agencyReport',
      meta: {
        title: '代理报表',
        icon: 'cebianlandailibaobiao'
      },
      component: () =>
        import('@/views/report/agencyReport')
    },
    {
      path: 'reportsAgencyModeC',
      name: 'reportsAgencyModeC',
      parentKey: 'report',
      routeKey: 'reportsAgencyModeC',
      meta: {
        title: '业绩报表',
        hideInMenu: true,
        icon: 'yejibaobiao'
      },
      component: () =>
        import('@/views/report/reportsAgencyModeC')
    },
    // {
    //   path: 'totalReport',
    //   name: 'totalReport',
    //   routeKey: 'totalReport',
    //   parentKey: 'report',
    //   meta: {
    //     title: '总报表',
    //     icon: 'cebianlanzongbaobiao'
    //   },
    //   component: () => import('@/views/report/totalReport')
    // },
    {
      path: 'domainReport',
      name: 'domainReport',
      parentKey: 'report',
      routeKey: 'domainReport',
      meta: {
        title: '域名报表',
        icon: 'cebianlandailiyuming1'
      },
      component: () =>
        import('@/views/report/domainReport')
    },
    {
      path: 'domainReportsDetailByDomain',
      name: 'domainReportsDetailByDomain',
      parentKey: 'report',
      meta: {
        title: '域名人数报表',
        hideInMenu: true,
        activeKey: 'domainReports'
      },
      component: () =>
        import('@/views/report/domainReportsDetailByDomain')
    },
    {
      path: 'domainReportsDetailByUser',
      name: 'domainReportsDetailByUser',
      parentKey: 'report',
      meta: {
        title: '注册人数详情',
        hideInMenu: true,
        activeKey: 'domainReports'
      },
      beforeEnter: (to, from, next) => {
        to.meta.title = to.params.page === 'register' ? '注册人数详情' : '登录人数详情'
        next()
      },
      component: () =>
        import('@/views/report/domainReportsDetailByUser')
    },
    {
      path: 'payReport',
      name: 'payReport',
      parentKey: 'report',
      routeKey: 'paymentReports',
      meta: {
        title: '支付报表',
        icon: 'chongzhi'
      },
      component: () =>
        import('@/views/report/payReport')
    },


    {
      path: 'siteReport',
      name: 'siteReport',
      parentKey: 'report',
      routeKey: 'siteReports',
      meta: {
        title: '站点报表',
        icon: 'zhandianbaobiao'
      },
      component: () =>
        import('@/views/report/siteReport')
    },
    // {
    //   path: 'cpaReport',
    //   name: 'cpaReport',
    //   parentKey: 'report',
    //   routeKey: 'siteReports',
    //   meta: {
    //     title: 'CPA报表',
    //     icon: 'dashuju1'
    //   },
    //   component: () =>
    //     import('@/views/report/cpaReport')
    // },
    {
      path: 'dailyCashReport',
      name: 'dailyCashReport',
      parentKey: 'report',
      routeKey: 'dailyCashReport',
      meta: {
        title: '大数据',
        icon: 'dashuju1'
      },
      component: () =>
        import('@/views/report/dailyCashReport')
    },
    {
      path: 'commissionReport',
      name: 'commissionReport',
      parentKey: 'report',
      routeKey: 'commissionReports',
      meta: {
        title: '佣金报表',
        icon: 'yongjin'
      },
      component: () =>
        import('@/views/report/commissionReport')
    },
    // {
    //   path: 'depositReport',
    //   name: 'depositReport',
    //   parentKey: 'report',
    //   routeKey: 'depositReport',
    //   meta: {
    //     title: '入款报表',
    //     icon: 'yongjin'
    //   },
    //   component: () =>
    //     import('@/views/report/depositReport')
    // },
    {
      path: 'retainedReport',
      name: 'retainedReport',
      routeKey: 'retainedReport',
      parentKey: 'report',
      meta: {
        title: '留存报表',
        icon: 'liucunbaobiao',
        routeKey: 'retainedReport'

      },
      component: () =>
        import('@/views/report/retainedReport')
    },
    {
      path:'advReport',
      name:'advReport',
      parentKey: 'report',
      routeKey: 'advReport',
      meta: {
        title: '广告报表',
        icon: 'guanggaobaobiao'
      },
      component: () =>
        import('@/views/report/advReport')
    },
    {
      path: 'biddingReports',
      name: 'biddingReports',
      parentKey: 'report',
      routeKey: 'biddingReports',
      meta: {
        title: '竞价统计',
        icon: 'jingjiatongji',
        hideInMenu:true,
      },
      component: () =>
        import('@/views/report/biddingReports')
    },
  ]
}
export default report