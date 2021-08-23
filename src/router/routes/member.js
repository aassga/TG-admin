const member = {
  path: '/member',
  name: 'member',
  meta: {
    title: '会员管理',
    hideInMenu: true,
    hideInTop: false
  },
  component: () => import('@/components/main'),
  redirect: {
    name: 'memberSearch'
  },
  newChild: [],
  children: [{
      path: 'memberSearch',
      name: 'memberSearch',
      routeKey: 'memberSearch',
      parentKey: 'member',
      meta: {
        title: '会员查询',
        icon: 'cebianlanhuiyuanchaxun'
      },
      component: () => import('@/views/member/memberSearch')
    },
    // {
    //   path: 'promoteMembers',
    //   name: 'promoteMembers',
    //   routeKey: 'promoteMembers',
    //   parentKey: 'member',
    //   meta: {
    //     title: '推广会员',
    //     icon: 'tuiguang'
    //   },
    //   component: () => import('@/views/member/promoteMembers')
    // },
    {
      path: 'memberSearchFunds',
      name: 'memberSearchFunds',
      routeKey: 'memberSearchFunds',
      activeKey: 'memberSearchFunds',
      parentKey: 'member',
      meta: {
        title: '加款减款',
        icon: 'cebianlanjiajiankuan'
      },
      component: () => import('@/views/member/memberSearch')
    },
    {
      path: 'memberSearch/detail',
      name: 'memberDetails',
      parentKey: 'member',
      meta: {
        title: '会员详情',
        notCache: true,
        hideInMenu: true,
        activeKey: 'memberSearch'
      },
      beforeEnter: (to, from, next) => {
        to.meta.activeKey = from.name === 'memberSearch' ? 'memberSearch' : 'memberOnline'
        next()
      },
      component: () => import('@/views/member/memberDetails')
    },
    {
      path: 'memberSearch/:page?',
      name: 'memberEdit',
      parentKey: 'member',
      activeKey: 'memberSearch',
      meta: {
        title: '编辑会员',
        hideInMenu: true,
        activeKey: 'memberSearch'
      },
      component: () => import('@/views/member/memberEdit'),
      beforeEnter: (to, from, next) => {
        to.meta.title = to.params.page === 'edit' ? '编辑会员' : '添加会员'
        to.meta.activeKey = from.name === 'memberSearch' ? 'memberSearch' : 'memberOnline'
        next()
      }
    },
    {
      path: 'memberAdd/:page?',
      name: 'memberAdd',
      routeKey: 'memberAdd',
      parentKey: 'member',
      meta: {
        title: '新增会员',
        icon: 'xinzenghuiyuan'
      },
      component: () => import('@/views/member/memberAdd')
    },
    {
      path: 'memberOnline',
      name: 'memberOnline',
      routeKey: 'memberOnline',
      parentKey: 'member',
      meta: {
        title: '在线会员',
        icon: 'cebianlanzaixianhuiyuan'
      },
      component: () => import('@/views/member/memberOnline')
    },
    {
      path: 'memberLevel',
      name: 'memberLevel',
      routeKey: 'memberLevel',
      parentKey: 'member',
      meta: {
        title: '会员等级',
        icon: 'cebianlanhuiyuandengji'
      },
      component: () => import('@/views/member/memberLevel')
    },
    {
      path: 'paymentSet',
      name: 'paymentSet',
      routeKey: 'paymentSet',
      parentKey: 'member',
      meta: {
        notCache: true,
        title: '支付设置',
        icon: 'cebianlanhuiyuandengji'
      },
      component: () => import('@/views/member/paymentSet')
    },
    {
      path: 'memberRefund',
      name: 'memberRefund',
      routeKey: 'memberRefund',
      parentKey: 'member',
      meta: {
        notCache: true,
        title: '返水等级',
        icon: 'cebianlanfanshui'
      },
      component: () => import('@/views/member/memberRefund')
    },
    {
      path: 'preferentialLevel',
      name: 'preferentialLevel',
      routeKey: 'preferentialLevel',
      parentKey: 'member',
      meta: {
        title: '优惠等级',
        icon: 'youhuidengji'

      },
      component: () => import('@/views/member/preferentialLevel')
    },
    {
      path: 'preferentialLevelDetial',
      name: 'preferentialLevelDetial',
      routeKey: 'preferentialLevelDetial',
      parentKey: 'member',
      meta: {
        title: '优惠等级详情',
        icon: 'cebianlanfanshui',
        hideInMenu: true,
      },
      component: () => import('@/views/member/preferentialLevelDetial')
    },
    {
      path: 'memberRefund/detail',
      name: 'memberRefundDetails',
      parentKey: 'member',
      meta: {
        title: '返水详情',
        hideInMenu: true,
        activeKey: 'memberRefund'
      },
      component: () => import('@/views/member/memberRefundDetails')
    },
    {
      path: 'memberRefund/:page?',
      name: 'memberRefundEdit',
      parentKey: 'member',
      meta: {
        title: '编辑返水等级',
        hideInMenu: true,
        activeKey: 'memberRefund'
      },
      component: () => import('@/views/member/memberRefundEdit'),
      beforeEnter: (to, from, next) => {
        to.meta.title = to.params.page === 'edit' ? '编辑返水等级' : '添加返水等级'
        next()
      }
    },
    {
      path: 'performanceConfigList',
      name: 'performanceConfigList',
      routeKey: 'performanceConfigList',
      parentKey: 'member',
      meta: {
        title: '业绩等级',
        hideInMenu: true,
        icon: 'zhongfuwangge'
      },
      component: () => import('@/views/member/performanceConfigList')
    },
    {
      path: 'memberFilter',
      name: 'memberFilter',
      parentKey: 'member',
      routeKey: 'memberFilter',
      meta: {
        title: '会员筛选',
        icon: 'huiyuanshaixuan'
      },
      component: () => import('@/views/member/memberFilter')
    },
    // {
    //   path: 'memberLog',
    //   name: 'memberLog',
    //   routeKey: 'memberLog',
    //   parentKey: 'member',
    //   meta: {
    //     title: '会员操作日志',
    //     icon: 'cebianlancaozuorizhi'
    //   },
    //   component: () => import('@/views/member/memberLog')
    // },
    {
      path: 'memberLogSum',
      name: 'memberLogSum',
      routeKey: 'memberLog',
      parentKey: 'member',
      meta: {
        title: '会员日志',
        icon: 'cebianlancaozuorizhi'
      },
      component: () => import('@/views/member/memberLogSum')
    },
    // {
    //   path: 'memberLoginLog',
    //   name: 'memberLoginLog',
    //   routeKey: 'memberLoginLog',   
    //   parentKey: 'member',
    //   meta: {
    //     title: '会员登录日志',
    //     icon: 'cebianlandenglurizhi'
    //   },
    //   component: () => import('@/views/member/memberLoginLog')
    // },
    // {
    //   path: 'memberFundsLog',
    //   name: 'memberFundsLog',
    //   routeKey: 'memberFundsLog',
    //   parentKey: 'member',
    //   meta: {
    //     title: '会员资金日志',
    //     icon: 'cebianlanzijinrizhi'
    //   },
    //   component: () => import('@/views/member/memberFundsLog')
    // },
    {
      path: 'memberBank',
      name: 'memberBank',
      routeKey: 'memberBank',
      parentKey: 'member',
      meta: {
        title: '出款卡管理',
        icon: 'cebianlanyinhangqia'
      },
      component: () => import('@/views/member/memberBank')
    },
    {
      path: 'memberWageConfigList',
      name: 'memberWageConfigList',
      parentKey: 'member',
      routeKey: 'memberWageConfig',
      meta: {
        title: '工资等级',
        icon: 'gongzidengji',
        hideInMenu: true,
      },
      component: () => import('@/views/member/memberWageConfigList')
    },
    {
      path: 'memberProfitConfigList',
      name: 'memberProfitConfigList',
      parentKey: 'member',
      routeKey: 'memberProfitConfig',
      meta: {
        title: '分红等级',
        icon: 'fenhongdengji',
        hideInMenu: true,
      },
      component: () => import('@/views/member/memberProfitConfigList')
    },

  ]
}

export default member