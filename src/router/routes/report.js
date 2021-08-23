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
    name: 'synthesize'
  },
  newChild: [],
  children:[
    {
      path: "synthesize",
      name: "synthesize",
      parentKey: "report",
      routeKey: "integration_data",
      meta: {
        title: '综合数据',
        icon: 'zongheshujufuwu'
      },
      component: () => import("@/views/report/parent"),
      redirect: {
        name: "complexReport"
      },
      newChild: [],
      children:[
        {
          path: 'complexReport',
          name: 'complexReport',
        
          parentKey: 'integration_data',
          routeKey: 'complexReport',
          meta: {
            title: '综合报表',
            icon: 'cebianlanzonghebaobiao',
            routeKey: 'complexReport',
          },
          component: () =>
            import('@/views/report/integration_data/complexReport')
        },
        {
          path: 'siteReport',
          name: 'siteReport',
          parentKey: 'integration_data',
          routeKey: 'siteReports',
          meta: {
            title: '站点报表',
            icon: 'zhandianbaobiao',
            routeKey: 'siteReport',
          },
          component: () =>
            import('@/views/report/integration_data/siteReport')
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
            import('@/views/report/integration_data/complexReportDetail')
        },
            {
      path: 'dailyCashReport',
      name: 'dailyCashReport',
      parentKey: 'integration_data',
      routeKey: 'dailyCashReport',
      meta: {
        title: '大数据',
        icon: 'dashuju1',
        routeKey: 'dailyCashReport',
      },
      component: () =>
        import('@/views/report/integration_data/dailyCashReport')
    },
    //    {
    //   path: 'totalReportChildren',
    //   name: 'totalReportChildren',
    //   parentKey: 'integration_data',
    //   meta: {
    //     title: '报表下级',
    //     hideInMenu: true
    //   },
    //   component: () =>
    //     import('@/views/report/totalReportChildren')
    // },
    // {
    //   path: 'totalReportGameChildren',
    //   name: 'totalReportGameChildren',
    //   parentKey: 'integration_data',
    //   meta: {
    //     title: '报表下级',
    //     hideInMenu: true
    //   },
    //   component: () =>
    //     import('@/views/report/totalReportGameChildren')
    // },
      ]

    },
    {
      path: "game",
      name: "game",
      parentKey: "report",
      routeKey: "game_data",
      meta: {
        title: '游戏数据',
        icon: 'youxishuju',
        
      },
      component: () => import("@/views/report/parent"),
      redirect: {
        name: "gameReport"
      },
      newChild: [],
      children:[
            {
      path: 'gameReport',
      name: 'gameReport',
      parentKey: 'game_data',
      routeKey: 'gameReport',
      meta: {
        title: '即时注单',
        icon: 'cebianlanyouxijilubaobiao',
        routeKey: 'gameReport'
      },
      component: () =>
        import('@/views/report/game_data/gameReport')
    },
        {
      path: 'platformReport',
      name: 'platformReport',
      parentKey: 'game_data',
      routeKey: 'platformReport',
      meta: {
        title: '平台报表',
        icon: 'cebianlanpingtaibaobiao',
        routeKey: 'platformReport'
      },
      component: () =>
        import('@/views/report/game_data/platformReport')
    },
    {
      path: 'platformReport/detail',
      name: 'platformReportDetail',
      parentKey: 'game_data',
      meta: {
        title: '平台报表详情',
        hideInMenu: true,
        activeKey: 'platformReport'
      },
      component: () =>
        import('@/views/report/game_data/platformReportDetail')
    },
       {
      path: 'lotteryReport',
      name: 'lotteryReport',
      parentKey: 'game_data',
      routeKey: 'lotteryReport',
      meta: {
        title: '彩票报表',
        icon: 'cebianlancaipiaobaobiao',
        routeKey: 'lotteryReport',
      },
      component: () =>
        import('@/views/report/game_data/lotteryReport')
    },
    {
      path: 'fightReport',
      name: 'fightReport',
      parentKey: 'game_data',
      routeKey: 'fightReport',
      meta: {
        title: '对打报表',
        icon: 'duidabaobiao',
        routeKey: 'fightReport',
      },
      component: () =>
        import('@/views/report/game_data/fightReport')
    },
    {
      path: 'lotteryReport/detail',
      name: 'lotteryReportDetail',
      parentKey: 'game_data',
      meta: {
        notCache: true,
        title: '彩票报表详情',
        hideInMenu: true,
        activeKey: 'lotteryReport'
      },
      component: () =>
        import('@/views/report/game_data/lotteryReportDetail')
    },
   
      ]

    },
    {
      path: "member",
      name: "member",
      parentKey: "report",
      routeKey: "member_data",
      meta: {
        title: '会员数据',
        icon: 'huiyuanshuju'
      },
      component: () => import("@/views/report/parent"),
      redirect: {
        name: "gameReport"
      },
      newChild: [],
      children:[
            {
      path: 'firstDepositReport',
      name: 'firstDepositReport',
      routeKey: 'firstDepositReport',
      parentKey: 'member_data',
      meta: {
        title: '首存报表',
        icon: 'cebianlanshoucunbaobiao',
        routeKey: 'firstDepositReport',
      },
      component: () =>
        import('@/views/report/member_data/firstDepositReport')
    },
     
    {
      path: 'memberReport',
      name: 'memberReport',
      parentKey: 'member_data',
      routeKey: 'memberReport',
      meta: {
        title: '会员报表',
        icon: 'huiyuanbaobiao',
        routeKey: 'memberReport',
      },
      component: () =>
        import('@/views/report/member_data/memberReport')
    },
        {
      path: 'agencyReport',
      name: 'agencyReport',
      parentKey: 'member_data',
      routeKey: 'agencyReport',
      meta: {
        title: '代理报表',
        icon: 'cebianlandailibaobiao',
        routeKey: 'agencyReport',
      },
      component: () =>
        import('@/views/report/member_data/agencyReport')
    },
        {
      path: 'reportsAgencyModeC',
      name: 'reportsAgencyModeC',
      parentKey: 'member_data',
      routeKey: 'reportsAgencyModeC',
      meta: {
        title: '业绩报表',
        hideInMenu: true,
        icon: 'yejibaobiao',
        routeKey: 'reportsAgencyModeC',
      },
      component: () =>
        import('@/views/report/member_data/reportsAgencyModeC')
    },
      {
      path: 'commissionReport',
      name: 'commissionReport',
      parentKey: 'member_data',
      routeKey: 'commissionReports',
      meta: {
        title: '佣金报表',
        icon: 'yongjin',
        routeKey: 'commissionReports',
      },
      component: () =>
        import('@/views/report/member_data/commissionReport')
    },
   
      ]

    },
    {
      path: "active",
      name: "active",
      parentKey: "report",
      routeKey: "activity_data",
      meta: {
        title: '活动数据',
        icon: 'huodongshuju',
      },
      component: () => import("@/views/report/parent"),
      redirect: {
        name: "activityReport"
      },
      newChild: [],
      children:[
     {
      path: 'activityReport',
      name: 'activityReport',
      parentKey: 'activity_data',
      routeKey: 'activityReport',
      meta: {
        title: '活动报表',
        icon: 'cebianlanhuiyuanbaobiao',
        routeKey: 'activityReport',
      },
      component: () =>
        import('@/views/report/activity_data/activityReport')
    },
        {
      path:'advReport',
      name:'advReport',
      parentKey: 'activity_data',
      routeKey: 'advReport',
      meta: {
        title: '广告报表',
        icon: 'guanggaobaobiao',
        routeKey: 'advReport',
      },
      component: () =>
        import('@/views/report/activity_data/advReport')
    },
     
  
   
      ]

    },
    {
      path: "other",
      name: "other",
      parentKey: "report",
      routeKey: "other_data",
      meta: {
        title: '其它数据',
        icon: 'qitashuju'
      },
      component: () => import("@/views/report/parent"),
      redirect: {
        name: "domainReport"
      },
      newChild: [],
      children:[
    {
      path: 'domainReport',
      name: 'domainReport',
      parentKey: 'other_data',
      routeKey: 'domainReport',
      meta: {
        title: '域名报表',
        icon: 'cebianlandailiyuming1',
        routeKey: 'domainReport',
      },
      component: () =>
        import('@/views/report/other_data/domainReport')
    },

        {
      path: 'retainedReport',
      name: 'retainedReport',
      routeKey: 'retainedReport',
      parentKey: 'other_data',
      meta: {
        title: '留存报表',
        icon: 'liucunbaobiao',
        routeKey: 'retainedReport'

      },
      component: () =>
        import('@/views/report/other_data/retainedReport')
    },
        {
      path: 'payReport',
      name: 'payReport',
     
      routeKey: 'paymentReports',
       parentKey: 'other_data',
      meta: {
        title: '支付报表',
        icon: 'chongzhi',
        routeKey: 'paymentReports'
      },
      component: () =>
        import('@/views/report/other_data/payReport')
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
        import('@/views/report/other_data/domainReportsDetailByDomain')
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
        import('@/views/report/other_data/domainReportsDetailByUser')
    },

  
   
      ]

    },
    {
      path: 'operationalReport',
      name: 'operationalReport',
      parentKey: "report",
      routeKey: 'operation_report_nav',
      meta: {
        title: '营运报表',
        icon: 'zongheshujufuwu'
      },
      component: () => import("@/views/report/parent"),
      redirect: {
        name: "operationDayReport"
      },
      newChild: [],
      children:[
        {
          path: 'operationDayReport',
          name: 'operationDayReport',
          parentKey: 'operation_report_nav',
          routeKey: 'operation_report_nav',
          meta: {
            title: '日報表',
            icon: 'zongheshujufuwu',
            routeKey: 'operation_report_nav',
            related: ['operationHourReport'],
          },
          component: () =>
            import('@/views/report/operational_data/operationDayReport')
        },
        {
          path:'operationHourReport',
          name:'operationHourReport',
          parentKey: 'operation_report_nav',
          routeKey: 'operation_report_nav',
          meta: {
            title: '小时报表',
            icon: 'zongheshujufuwu',
            routeKey: 'operation_report_nav',
            related: ['operationHourCompareReport'],
          },
          component: () =>
            import('@/views/report/operational_data/operationHourReport')
        },
        {
          path:'operationHourCompareReport',
          name:'operationHourCompareReport',
          parentKey: 'operation_report_nav',
          routeKey: 'operation_report_nav',
          meta: {
            title: '同期比较',
            icon: 'zongheshujufuwu',
            routeKey: 'operation_report_nav',
          },
          component: () =>
            import('@/views/report/operational_data/operationHourCompareReport')
        },
      ]
    }
  ]
  // children: [
  //   // {
  //   //   path: 'totalReport',
  //   //   name: 'totalReport',
  //   //   routeKey: 'totalReport',
  //   //   parentKey: 'report',
  //   //   meta: {
  //   //     title: '总报表',
  //   //     icon: 'cebianlanzongbaobiao'
  //   //   },
  //   //   component: () => import('@/views/report/totalReport')
  //   // },

 


  //   // {
  //   //   path: 'cpaReport',
  //   //   name: 'cpaReport',
  //   //   parentKey: 'report',
  //   //   routeKey: 'siteReports',
  //   //   meta: {
  //   //     title: 'CPA报表',
  //   //     icon: 'dashuju1'
  //   //   },
  //   //   component: () =>
  //   //     import('@/views/report/cpaReport')
  //   // },


  //   // {
  //   //   path: 'depositReport',
  //   //   name: 'depositReport',
  //   //   parentKey: 'report',
  //   //   routeKey: 'depositReport',
  //   //   meta: {
  //   //     title: '入款报表',
  //   //     icon: 'yongjin'
  //   //   },
  //   //   component: () =>
  //   //     import('@/views/report/depositReport')
  //   // },


  //   {
  //     path: 'biddingReports',
  //     name: 'biddingReports',
  //     parentKey: 'report',
  //     routeKey: 'biddingReports',
  //     meta: {
  //       title: '竞价统计',
  //       icon: 'jingjiatongji',
  //       hideInMenu:true,
  //     },
  //     component: () =>
  //       import('@/views/report/biddingReports')
  //   },
  // ]
}
export default report