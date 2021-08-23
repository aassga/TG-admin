const agency = {
  path: '/agency',
  name: 'agency',
  meta: {
    title: '代理管理',
    hideInMenu: true
  },
  component: () => import('@/components/main'),
  redirect: { name: 'agencySearch' },
  children: [
    {
      path: 'agencySearch',
      name: 'agencySearch',
      meta: {
        title: '代理查询',
        icon: 'cebianlanhuiyuanchaxun'
      },
      component: () => import('@/views/agency/agencySearch')
    },
    {
      path: 'agencyAdd/:page?',
      name: 'agencyAdd',
      meta: {
        title: '新增代理',
        icon: 'cebianlanxinzengdaili'
      },
      component: () => import('@/views/agency/agencyAdd')
    },
    {
      path: 'agencyLevel',
      name: 'agencyLevel',
      meta: {
        title: '代理等级',
        icon: 'cebianlandailidengji'
      },
      component: () => import('@/views/agency/agencyLevel')
    },
    {
      path: 'agencyDividend',
      name: 'agencyDividend',
      meta: {
        title: '代理分红结算',
        icon: 'cebianlandailifenhong'
      },
      component: () => import('@/views/agency/agencyDividend')
    },
    {
      path: 'domainAdd/:page?',
      name: 'domainAdd',
      meta: {
        title: '添加域名',
        hideInMenu: true,
        notCache: true
      },
      component: () => import('@/views/agency/domainAdd')
    },
    {
      path: 'domainEdit/:page?',
      name: 'domainEdit',
      meta: {
        title: '编辑域名',
        hideInMenu: true
      },
      component: () => import('@/views/agency/domainEdit')
    },
    {
      path: 'agencyLevelAdd',
      name: 'agencyLevelAdd',
      meta: {
        title: '添加代理等级',
        hideInMenu: true
      },
      component: () => import('@/views/agency/agencyLevelAdd')
    },
    {
      path: 'agencyUnderling',
      name: 'agencyUnderling',
      meta: {
        title: '下属会员',
        hideInMenu: true
      },
      component: () => import('@/views/agency/agencyUnderling')
    },
    {
      path: 'agencySubordinate',
      name: 'agencySubordinate',
      meta: {
        title: '下级代理',
        hideInMenu: true
      },
      component: () => import('@/views/agency/agencySubordinate')
    }
  ]
}

export default agency
