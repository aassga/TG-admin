const finance = {
  path: '/finance',
  name: 'finance',
  meta: {
    title: '财务管理',
    hideInMenu: true,
    hideInTop: false
  },
  component: () => import('@/components/main'),
  redirect: {
    name: 'payOnline'
  },
  newChild: [],
  children: [{
      path: 'payOnline',
      name: 'payOnline',
      routeKey: 'payOnline',
      parentKey: 'finance',
      meta: {
        title: '在线支付',
        icon: 'cebianlanzaixianzhifu'
      },
      component: () => import('@/views/finance/payOnline')
    },
    {
      path: 'payCompany',
      name: 'payCompany',
      routeKey: 'payCompany',
      parentKey: 'finance',
      meta: {
        title: '公司入款',
        icon: 'cebianlangongsirukuan'
      },
      component: () => import('@/views/finance/payCompany')
    },
    {
      path: 'virtualIncome',
      name: 'virtualIncome',
      routeKey: 'virtualIncome',
      parentKey: 'finance',
      meta: {
        title: '货币入款',
        icon: 'huobishourusvg'
      },
      component: () => import('@/views/finance/virtualIncome')
    },
    {
      path: 'memberAudit',
      name: 'memberAudit',
      routeKey: 'memberAudit',
      parentKey: 'member',
      meta: {
        title: '审核会员',
        icon: 'cebianlanzaixianhuiyuan'
      },
      component: () => import('@/views/finance/memberAudit')
    },
    {
      path: 'memberAudit/detail',
      name: 'auditDetails',
      parentKey: 'member',
      meta: {
        title: '审核明细',
        // notCache: true,
        hideInMenu: true,
        activeKey: 'memberAudit'
      },
      component: () => import('@/views/finance/auditDetails')
    },
    // {
    //   path: 'payCompanyJava',
    //   name: 'payCompanyJava',
    //   routeKey: 'payCompany',
    //   parentKey: 'finance',
    //   meta: {
    //     title: 'java代付',
    //     icon: 'cebianlangongsirukuan'
    //   },
    //   component: () => import('@/views/finance/payCompanyJava')
    // },
    {
      path: 'withdrawalsOnline',
      name: 'withdrawalsOnline',
      routeKey: 'withdrawalsOnline',
      parentKey: 'finance',
      meta: {
        title: '线上取款',
        icon: 'cebianlanxianshangqukuan'
      },
      component: () => import('@/views/finance/withdrawalsOnline')
    },
   
    {
      path: 'moneyWithdrawal',
      name: 'moneyWithdrawal',
      routeKey: 'moneyWithdrawal',
      parentKey: 'finance',
      meta: {
        title: '货币取款',
        icon: 'cebianlanxianshangqukuan'
      },
      component: () => import('@/views/finance/moneyWithdrawal')
    },
    {
      path: 'auditOne',
      name: 'auditOne',
      routeKey: 'platformReportsBySingle',
      parentKey: 'finance',
      meta: {
        title: '审核注单',
        icon: 'shenhezhudan'
      },
      component: () => import('@/views/finance/auditOne')
    },
    {
      path: 'paymentManager',
      name: 'paymentManager',
      routeKey: 'paymentManager',
      parentKey: 'finance',
      meta: {
        title: '支付管理',
        icon: 'cebianlanzhifuguanli'
      },
      component: () => import('@/views/finance/paymentManager')
    },
    {
      path: 'paymentLog',
      name: 'paymentLog',
      routeKey: 'paymentLog',
      parentKey: 'finance',
      meta: {
        title: '支付日志',
        icon: 'cebianlanzhifuguanli',
        // hideInMenu: true,
      },
      component: () => import('@/views/finance/paymentLog')
    },
    // {
    //   path: 'payManagerList',
    //   name: 'payManagerList',
    //   routeKey: 'paymentManager',
    //   parentKey: 'finance',
    //   meta: {
    //     title: 'java支付管理',
    //     icon: 'cebianlanzhifuguanli'
    //   },
    //   component: () => import('@/views/finance/payManagerList')
    // },
    {
      path: 'accountsRecord',
      name: 'accountsRecord',
      routeKey: 'accountsRecord',
      parentKey: 'finance',
      meta: {
        title: '催帐记录',
        icon: 'cebianlancuizhangjilu',
        hideInMenu: true,
      },
      component: () => import('@/views/finance/accountsRecord')
    },
    // {
    //   path: 'preferentialRecord',
    //   name: 'preferentialRecord',
    //   parentKey: 'finance',
    //   meta: {
    //     title: '优惠记录',
    //     icon: 'cebianlanyouhuijilu'
    //   },
    //   component: () => import('@/views/finance/preferentialRecord')
    // },
    {
      path: 'financeSummary',
      name: 'financeSummary',
      parentKey: 'finance',
      routeKey: 'financeSummary',
      meta: {
        title: '存取总汇',
        icon: 'cebianlancunqukuanzonghui'
      },
      component: () => import('@/views/finance/financeSummary')
    },
    {
      path: 'systemInPaymentCard',
      name: 'systemInPaymentCard',
      routeKey: 'systemInPaymentCard',
      parentKey: 'finance',
      meta: {
        notCache: true,
        title: '入款卡管理',
        icon: 'cebianlanyinhangqia1'
      },
      component: () => import('@/views/finance/systemInPaymentCard')
    },
    {
      path: 'payTimeSum',
      name: 'accessAuditTotal',
      routeKey: 'accessAuditTotal',
      parentKey: 'finance',
      meta: {
        title: '存取时间统计',
        icon: 'cunqushijianbaobiao1'
      },
      component: () => import('@/views/finance/payTimeSum')
    },
    {
      path: 'payTimeDetail',
      name: 'payTimeDetail',
      parentKey: 'finance',
      meta: {
        title: '存取统计详情',
        hideInMenu: true,
        activeKey: 'accessAuditTotal'
      },
      component: () => import('@/views/finance/payTimeDetail')
    },
    {
      path: 'gamesTransfer',
      name: 'gamesTransfer',
      routeKey: 'gamesTransfer',
      parentKey: 'finance',
      meta: {
        title: '第三方转账记录',
        icon: 'cebianlandisanfangzhuanzhangjilu'
      },
      component: () => import('@/views/finance/gamesTransfer')
    },
    {
      path: 'paymentAdd',
      name: 'paymentAdd',
      parentKey: 'finance',
      meta: {
        title: '添加支付平台',
        hideInMenu: true,
        activeKey: 'paymentManager'
      },
      component: () => import('@/views/finance/paymentAdd')
    },
    // {
    //   path: 'payAdd/:page?',
    //   name: 'payAdd',
    //   parentKey: 'finance',
    //   meta: {
    //     title: 'java编辑支付平台',
    //     hideInMenu: true,
    //     activeKey: 'paymentManager'
    //   },
    //   component: () => import('@/views/finance/payAdd'),
    //   beforeEnter: (to, from, next) => {
    //     to.meta.title = to.params.page === 'edit' ? 'java编辑支付平台' : '添加支付平台'
    //     next()
    //   }
    // },
    {
      path: 'paymentGroups',
      name: 'paymentGroups',
      parentKey: 'finance',
      meta: {
        title: '支付方式',
        hideInMenu: true,
        activeKey: 'paymentManager'
      },
      component: () => import('@/views/finance/paymentGroups')
    },
    {
      path: 'paymentEdit',
      name: 'paymentEdit',
      parentKey: 'finance',
      meta: {
        title: '编辑支付平台',
        hideInMenu: true,
        activeKey: 'paymentManager'
      },
      component: () => import('@/views/finance/paymentEdit')
    },
    {
      path: 'addCard',
      name: 'addCard',
      parentKey: 'finance',
      meta: {
        title: '添加入款卡',
        hideInMenu: true,
        activeKey: 'systemInPaymentCard'
      },
      component: () => import('@/views/finance/addCard')
    },
    {
      path: 'bankCardEdit/:page?',
      name: 'bankCardEdit',
      parentKey: 'finance',
      meta: {
        notCache: true,
        title: '编辑入款卡',
        hideInMenu: true,
        activeKey: 'systemInPaymentCard'
      },
      component: () => import('@/views/finance/bankCardEdit'),
      beforeEnter: (to, from, next) => {
        to.meta.title = to.params.page === 'edit' || to.params.page == 'transferEdit' ? '编辑入款卡' : '添加入款卡'
        next()
      }
    },
    {
      path: 'payMoney',
      name: 'agencyWage',
      parentKey: 'finance',
      routeKey: 'agencyWage',
      meta: {
        title: '发放工资',
        icon: 'gongzidengji',
        hideInMenu: true,
      },
      component: () => import('@/views/finance/payMoney')
    },
    {
      path: 'dividend',
      name: 'agencyShareoutbonus',
      parentKey: 'finance',
      routeKey: 'agencyShareoutbonus',
      meta: {
        title: '发放分红',
        icon: 'fenhongdengji',
        hideInMenu: true, 
      },
      component: () => import('@/views/finance/dividend')
    },
    {
      path: 'getPaymentNameList',
      name: 'getPaymentNameList',
      parentKey: 'finance',
      routeKey: 'getPaymentNameList',
      meta: {
        title: '支付余额',
        icon: 'zhifuyue',
        hideInMenu: true,
      },
      component: () => import('@/views/finance/getPaymentNameList')
    },
  ]
}

export default finance