const system = {
  path: '/system',
  name: 'system',
  meta: {
    title: '系统管理',
    hideInMenu: true,
    hideInTop: false
  },
  component: () => import('@/components/main'),
  redirect: {
    name: 'authManagement'
  },
  newChild: [],
  children: [{
      path: 'domainManagement',
      name: 'domainManagement',
      parentKey: 'system',
      routeKey: 'domain',
      meta: {
        title: '域名管理',
        icon: 'yumingguanli',
        hideInMenu: false,
      },
      component: () =>
        import('@/views/system/parent'),
      redirect: {
        name: 'domainGroup'
      },
      newChild: [],
      children: [
        {
          path: 'domainGroup',
          name: 'domainGroup',
          routeKey: 'domainGroup',
          parentKey: 'domain',
          meta: {
            title: '域名分组',
            icon: 'yumingfenzu',
            routeKey: 'domainGroup'
          },
          component: () =>
            import('@/views/system/domainManagement/domainGroup')
        },
        {
          path: 'agencyDomain',
          name: 'agencyDomain',
          routeKey: 'agencyDomain',
          parentKey: 'domain',
          meta: {
            title: '代理域名',
            icon: 'cebianlandailiyuming1',
            routeKey: 'agencyDomain'
          },
          component: () =>
            import('@/views/system/domainManagement/agencyDomain')
        },

        {
          path: 'addDomain/:page?',
          name: 'addDomain',
          parentKey: 'domain',
          meta: {
            title: '添加域名',
            hideInMenu: true,
            activeKey: 'agencyDomain',
            icon: 'yumingguanli'
          },
          component: () => import('@/views/system/domainManagement/domainAdd')
        },
        {
          path: 'editDomain/:page?',
          name: 'editDomain',
          parentKey: 'domain',
          meta: {
            title: '编辑域名',
            hideInMenu: true,
            activeKey: 'agencyDomain',
            icon: 'yumingguanli'
          },
          component: () => import('@/views/system/domainManagement/domainEdit'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.type === 'code' ? '编辑邀请码' : '编辑域名'
            to.meta.activeKey = to.params.type === 'code' ? 'agencyInviteCode' : 'agencyDomain'
            next()
          }
        },
        {
          path: 'badDomainList',
          name: 'badDomainList',
          parentKey: 'domain',
          routeKey: 'exceptionDomain',
          meta: {
            title: '异常域名',
            icon: 'lujing',
            routeKey: 'exceptionDomain'
          },
          component: () => import('@/views/system/domainManagement/badDomainList')
        },
        {
          path: 'agencyInviteCode',
          name: 'agencyInviteCode',
          parentKey: 'domain',
          routeKey: 'agencyInviteCode',
          meta: {
            title: '邀请码管理',
            icon: 'yaoqingma_huaban',
            routeKey: 'agencyInviteCode'
          },
          component: () => import('@/views/system/domainManagement/agencyInviteCode')
        }
      ]
    },
    {
      path: 'authManagement',
      name: 'authManagement',
      routeKey: 'authManagement',
      parentKey: 'system',
      meta: {
        title: '权限管理',
        icon: 'quanxian'
      },
      component: () =>
        import('@/views/system/parent'),
      redirect: {
        name: 'menu'
      },
      newChild: [],
      children: [
        {
          path: 'adminRolesList',
          name: 'adminRolesList',
          parentKey: 'authManagement',
          routeKey: 'adminRolesList',
          meta: {
            title: '角色赋权',
            icon: 'jiaosefuquan',
            routeKey: 'adminRolesList'
          },
          component: () =>
            import('@/views/system/authManagement/adminRolesList')
        },
        {
          path: 'admin',
          name: 'admin',
          parentKey: 'authManagement',
          routeKey: 'admin',
          meta: {
            title: '管理员列表',
            icon: 'guanliyuanliebiao',
            routeKey: 'admin'
          },
          component: () =>
            import('@/views/system/authManagement/admin')
        },
        {
          path: 'admin/:page?',
          parentKey: 'authManagement',
          name: 'adminEdit',
          meta: {
            title: '编辑管理员',
            hideInMenu: true,
            activeKey: 'admin',
            icon: 'quanxian'
          },
          component: () =>
            import('@/views/system/authManagement/adminEdit'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === 'edit' ? '编辑管理员' : '添加管理员'
            next()
          }
        },
        {
          path: 'adminLog',
          name: 'adminLog',
          routeKey: 'adminLog',
          parentKey: 'authManagement',
          meta: {
            title: '管理员日志',
            icon: 'guanliyuanrizhi',
            routeKey: 'adminLog'
          },
          component: () =>
            import('@/views/system/authManagement/adminLog')
        }
      ]
    },
    {
      path: 'siteManagement',
      name: 'siteManagement',
      routeKey: 'siteManagement',
      parentKey: 'system',
      meta: {
        title: '站点管理',
        icon: 'zhandianguanli'
      },
      component: () =>
        import('@/views/system/parent'),
      redirect: {
        name: 'siteList'
      },
      newChild: [],
      children: [
       
        {
          path: 'siteList',
          name: 'siteList',
          parentKey: 'siteManagement',
          routeKey: 'siteList',
          meta: {
            title: '站点列表',
            icon: 'zhandianguanliliebiao',
            routeKey: 'siteList',
            hideInMenu: false,
          },
          component: () =>
            import('@/views/system/siteManagement/siteList')
        },
        {
          path: 'siteDetail',
          parentKey: 'siteManagement',
          name: 'siteDetail',
          meta: {
            title: '站点详情',
            hideInMenu: true,
            notCache: true,
            activeKey: 'siteList',
            icon: 'zhandianguanli'
          },
          component: () =>
            import('@/views/system/siteManagement/siteDetail')
        },
        {
          path: 'siteAdd',
          name: 'siteAdd',
          parentKey: 'siteManagement',
          meta: {
            title: '新增站点',
            hideInMenu: true,
            activeKey: 'siteList',
            icon: 'zhandianguanli'
          },
          component: () =>
            import('@/views/system/siteManagement/siteAdd'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.query.page === 'edit' ? '编辑站点' : '新增站点'
            next()
          }
        },
        {
          path: 'siteRepairConfigList',
          name: 'siteRepairConfigList',
          parentKey: 'siteManagement',
          routeKey: 'siteRepairConfigList',
          meta: {
            title: '全站维护',
            icon: 'quanzhanweihu1',
            routeKey: 'siteRepairConfigList',
            hideInMenu: false,
          },
          component: () => import('@/views/system/siteManagement/siteRepairConfigList')
        },
        {
          path: 'payLabel',
          name: 'payLabel',
          parentKey: 'siteManagement',
          routeKey: 'payLabel',
          meta: {
            title: '支付优惠',
            icon: 'zhifuyouhui1',
            routeKey: 'payLabel',
            hideInMenu: false,
          },
          component: () =>
            import('@/views/system/siteManagement/payLabel')
        },
        {
          path: 'sysPreRefundDetail',
          parentKey: 'siteManagement',
          name: 'sysPreRefundDetail',
          meta: {
            title: '系统预设详情',
            hideInMenu: true,
            activeKey: 'sysPreset',
            icon: 'zhandianguanli'
          },
          component: () =>
            import('@/views/system/siteManagement/sysPreRefundDetail')
        },
        {
          path: 'sysPreRefundEdit',
          name: 'sysPreRefundEdit',
          parentKey: 'siteManagement',
          meta: {
            title: '编辑返水等级',
            hideInMenu: true,
            icon: 'zhandianguanli',
            activeKey: 'sysPreset'
          },
          component: () =>
            import('@/views/system/siteManagement/sysPreRefundEdit'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === 'edit' ? '编辑返水等级' : '添加返水等级'
            next()
          }
        },
        {
          path: 'siteBlackList',
          name: 'siteBlackList',
          parentKey: 'system',
          routeKey: 'siteBlackList',
          meta: {
            title: '区域黑名单',
            icon: 'heimingdan',
            routeKey: 'siteBlackList',
            hideInMenu: false,
          },
          component: () =>
            import('@/views/system/siteManagement/siteBlackList')
        },
        {
          path: 'paymentJigsawManagementList',
          name: 'paymentJigsawManagementList',
          routeKey: 'paymentJigsawManagementList',
          parentKey: 'system',
          meta: {
            title: '支付平台管理',
            icon: 'zhifupingtaiguanli',
            hideInMenu: false,
            routeKey: 'paymentJigsawManagementList'
          },
          component: () =>
            import('@/views/system/siteManagement/paymentJigsawManagementList')
        },
        {
          path: 'payChatJavaSiteList',
          name: 'payChatJavaSiteList',
          routeKey: 'payChatJavaSiteList',
          parentKey: 'system',
          meta: {
            title: '银商系统额度',
            icon: 'yinshangxitongedu',
            hideInMenu: false,
            routeKey: 'payChatJavaSiteList'
          },
          component: () =>
            import('@/views/system/siteManagement/payChatJavaSiteList')
        },
        {
          path: 'payPlatformManagement',
          name: 'payPlatformManagement',
          routeKey: 'paymentJigsawManagementList',
          parentKey: 'system',
          meta: {
            title: 'java支付平台管理',
            icon: 'xitongyushe',
            hideInMenu: false,
            routeKey: 'paymentJigsawManagementList'
          },
          component: () =>
            import('@/views/system/siteManagement/payPlatformManagement')
        },
        {
          path: 'payPlatformManager',
          name: 'payPlatformManager',
          routeKey: 'paymentJigsawManagementList',
          parentKey: 'system',
          meta: {
            title: 'java支付',
            icon: 'xitongyushe',
            hideInMenu: false,
            routeKey: 'paymentJigsawManagementList'
          },
          component: () =>
            import('@/views/system/siteManagement/payPlatformManager')
        },
        {
          path: 'addPay/:page?',
          name: 'addPay',
          routeKey: 'addPay',
          parentKey: 'system',
          meta: {
            title: '添加支付平台',
            icon: 'xitongyushe',
            routeKey: 'addPay'
          },
          component: () =>
            import('@/views/system/siteManagement/addPay'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === 'edit' ? '编辑支付平台' : '新增支付平台'
            next()
          }
        },
        {
          path: 'addPayJava/:page?',
          name: 'addPayJava',
          routeKey: 'addPayJava',
          parentKey: 'system',
          meta: {
            title: '添加支付平台',
            icon: 'xitongyushe',
            routeKey: 'addPay'
          },
          component: () =>
            import('@/views/system/siteManagement/addPayJava'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === 'edit' ? '编辑Java支付平台' : '新增支付平台'
            next()
          }
        },
        {
          path: 'sysPreset',
          name: 'sysPreset',
          routeKey: 'sysPreset',
          parentKey: 'siteManagement',
          meta: {
            title: '系统预设',
            icon: 'xitongyushe',
            routeKey: 'sysPreset',
            hideInMenu: false,
          },
          component: () =>
            import('@/views/system/siteManagement/sysPreset')
        },
        {
          path: 'automationFund',
          name: 'automationFund',
          routeKey: 'automaticWithdrawal',
          parentKey: 'system',
          meta: {
            title: '自动出款配置',
            icon: 'zidongchukuan',
            routeKey: 'automaticWithdrawal',
            hideInMenu: false,
          },
          component: () =>
            import('@/views/system/siteManagement/automationFund')
        },
        {
          path: 'whiteList',
          name: 'whiteList',
          parentKey: 'system',
          routeKey: 'whiteList',
          meta: {
            title: '区域白名单',
            icon: 'baimingdan',
            routeKey: 'whiteList',
            hideInMenu: false,
          },
          component: () => import('@/views/system/siteManagement/whiteList')
        }
      ]
    },
    {
      path: ' gameManagement',
      name: 'gameManagement',
      routeKey: 'gameManagement',
      meta: {
        title: '游戏管理',
        icon: 'youxiguanli'
      },
      component: () =>
        import('@/views/system/parent'),
      redirect: {
        name: 'gameSort'
      },
      newChild: [],
      children: [{
          path: 'gameSort',
          name: 'gameSort',
          uri: 'api/v2/gameSequence',
          routeKey: 'gameSort',
          meta: {
            title: '游戏排序(旧)',
            icon: 'youxipaixu',
            routeKey: 'gameManagement'
          },
          component: () => import('@/views/system/gameManagement/gameSort')
        },
        {
          path: 'gameManage',
          name: 'gameManage',
          routeKey: 'gameManage',
          meta: {
            title: '游戏管理',
            icon: 'youxiguanlihuise',
            routeKey: 'gameManage'
          },
          component: () => import('@/views/system/gameManagement/gameManage')
        },
        {
          path: 'sortType',
          name: 'sortType',
          routeKey: 'gameManage',
          meta: {
            title: '排序类别(v4)',
            icon: 'youxiguanlihuise',
            routeKey: 'gameManage'
          },
          component: () => import('@/views/system/gameManagement/sortType')
        },
        {
          path: 'gameManageX',
          name: 'gameManageX',
          routeKey: 'gameManage',
          meta: {
            title: '游戏管理(v4)',
            icon: 'youxiguanlihuise',
            routeKey: 'gameManage'
          },
          component: () => import('@/views/system/gameManagement/gameManageX')
        },
        {
          path: 'gameMaintain',
          name: 'gameMaintain',
          routeKey: 'gameMaintain',
          meta: {
            title: '游戏维护',
            icon: 'youxiweihu',
            routeKey: 'gameMaintain'
          },
          component: () => import('@/views/system/gameManagement/gameMaintain')
        },
        {
          path: 'electronic',
          name: 'electronic',
          routeKey: 'systemSiteGameSlotList',
          meta: {
            title: '游戏排序(新)',
            icon: 'dianziyouyi',
            routeKey: 'systemSiteGameSlotList'
          },
          component: () => import('@/views/system/gameManagement/electronic')
        },
        {
          path: 'electronicX',
          name: 'electronicX',
          routeKey: 'systemSiteGameSlotList',
          meta: {
            title: '游戏排序(v4)',
            icon: 'dianziyouyi',
            routeKey: 'systemSiteGameSlotList'
          },
          component: () => import('@/views/system/gameManagement/electronicX')
        },
        {
          path: 'sync',
          name: 'sync',
          routeKey: 'systemSiteGameSlotList',
          meta: {
            title: '同步站点(v4)',
            icon: 'dianziyouyi',
            routeKey: 'systemSiteGameSlotList'
          },
          component: () => import('@/views/system/gameManagement/sync')
        },
        {
          path: 'gameList',
          name: 'gameList',
          meta: {
            title: '游戏列表',
            hideInMenu: true,
            activeKey: 'gameManage',
            icon: 'youxiguanli'
          },
          component: () => import('@/views/system/gameManagement/gameList')
        },
        {
          path: 'gameListX',
          name: 'gameListX',
          meta: {
            title: '游戏列表(v4)',
            hideInMenu: true,
            activeKey: 'gameManageX',
            icon: 'youxiguanli'
          },
          component: () => import('@/views/system/gameManagement/gameListX')
        },
        {
          path: 'gameBanner',
          name: 'gameBanner',
          routeKey: 'electronicImageConfig',
          meta: {
            title: '游戏轮播',
            routeKey: 'electronicImageConfig',
            icon: 'shangchuantupian'
          },
          component: () => import('@/views/system/gameManagement/gameBanner')
        },
        {
          path: 'siteBiddingList',
          name: 'siteBiddingList',
          routeKey: 'siteBiddingList',
          meta: {
            title: '竞价排序',
            routeKey: 'siteBiddingList',
            icon: 'shangchuantupian',
            // hideInMenu:true
          },
          component: () => import('@/views/system/gameManagement/siteBiddingList')
        },
      ]
    },
    {
      path: 'message',
      name: 'message',
      parentKey: 'system',
      routeKey: 'message',
      meta: {
        title: '信息中心',
        icon: 'xinxizhongxin'
      },
      component: () =>
        import('@/views/system/parent'),
      redirect: {
        name: 'mail'
      },
      newChild: [],
      children: [
        {
          path: 'mail',
          name: 'mail',
          parentKey: 'message',
          routeKey: 'mail',
          meta: {
            title: '站内信',
            icon: 'zhanneixin',
            routeKey: 'mail'
          },
          component: () =>
            import('@/views/system/message/mail')
        },
        // {
        //   path: 'mailNew',
        //   name: 'mailNew',
        //   parentKey: 'message',
        //   routeKey: 'mail',
        //   meta: {
        //     title: '新站内信',
        //     icon: 'zhanneixin',
        //     routeKey: 'mail'
        //   },
        //   component: () =>
        //     import('@/views/system/message/mailNew')
        // },
        {
          path: 'sendMessage',
          name: 'sendMessage',
          parentKey: 'message',
          meta: {
            title: '发信',
            hideInMenu: true,
            activeKey: 'mail',
            icon: 'xinxizhongxin'
          },
          component: () =>
            import('@/views/system/message/sendMessage')
        },
        {
          path: 'notice',
          name: 'notice',
          parentKey: 'message',
          routeKey: 'notice',
          meta: {
            title: '站内公告',
            icon: 'zhanneigonggao',
            routeKey: 'notice'
          },
          component: () =>
            import('@/views/system/message/notice')
        },
        {
          path: 'notice/:page?',
          parentKey: 'message',
          name: 'noticeDetial',
          meta: {
            notCache: true,
            title: '公告弹框详情',
            hideInMenu: true,
            activeKey: 'notice',
            icon: 'xinxizhongxin'
          },
          component: () =>
            import('@/views/system/message/noticeDetial'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === 'edit' ? '编辑公告' : '新增公告'
            next()
          }
        },
        {
          path: 'notice/:page?',
          name: 'couseDetial',
          parentKey: 'message ',
          meta: {
            notCache: true,
            title: '详情',
            hideInMenu: true,
            activeKey: 'notice',
            icon: 'xinxizhongxin'
          },
          component: () =>
            import('@/views/system/message/couseDetial'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === 'edit' ? '编辑走马灯' : '新增走马灯'
            next()
          }
        },
        {
          path: 'siteArtciles',
          name: 'siteArtciles',
          parentKey: 'message',
          routeKey: 'siteArtciles',
          meta: {
            title: '站点文章',
            icon: 'zhanneiwenzhang',
            routeKey: 'siteArtciles'
          },
          component: () =>
            import('@/views/system/message/siteArtciles')
        },
        {
          path: 'siteArtciles/:page?',
          name: 'addArtciles',
          parentKey: 'message',
          meta: {
            notCache: true,
            hideInMenu: true,
            activeKey: 'siteArtciles',
            icon: 'xinxizhongxin'
          },
          component: () =>
            import('@/views/system/message/addArtciles'),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === 'edit' ? '编辑文章' : '新增文章'
            next()
          }
        },
        {
          path: 'adminMassageSendList',
          name: 'adminMassageSendList',
          parentKey: 'message',
          routeKey: 'adminMassageGetList',
          meta: {
            title: '系统更新',
            icon: 'cebianlancaipiaoshezhi',
            routeKey: 'adminMassageGetList',
            hideInMenu: false,
            // activeKey: 'upMessage'
          },
          component: () => import('@/views/system/message/adminMassageSendList')
        },
        {
          path: 'addUpMessage',
          name: 'addUpMessage',
          parentKey: 'message',
          meta: {
            title: '发送更新通知',
            hideInMenu: true,
            icon: 'cebianlancaipiaoshezhi',
            activeKey: 'addUpMessage'
          },
          component: () => import('@/views/system/message/addUpMessage')
        }
      ]
    },
    {
      path: 'lotterysManagement',
      name: 'lotterysManagement',
      parentKey: 'system',
      routeKey: 'lotterysManagement',
      meta: {
        title: '彩票管理',
        icon: 'cebianlancaipiaoshezhi',
        hideInMenu: false,
      },
      component: () => import('@/views/system/parent'),
      redirect: {
        name: 'fastLottery'
      },
      newChild: [],
      children: [

        {
          path: 'fastLottery',
          name: 'fastLottery',
          routeKey: 'fastLottery',
          parentKey: 'lottery',
          meta: {
            title: '快速彩票',
            icon: 'kuaisucaipiao',
            routeKey: 'fastLottery'
          },
          component: () => import('@/views/lottery/fastLottery'),

        },
        {
          path: 'setFastLottery',
          name: 'setFastLottery',
          routeKey: 'setFastLottery',
          parentKey: 'lottery',
          meta: {
            title: '预设开奖',
            icon: 'cebianlankuaisucaipiao',
            routeKey: 'setFastLottery'
          },
          component: () => import('@/views/lottery/setFastLottery'),

        },
        {
          path: 'fastLotteryAll',
          name: 'fastLotteryAll',
          parentKey: 'lottery',
          meta: {
            title: '快速赛车全站站点',
            hideInMenu: true,
            activeKey: 'fastLottery',
            icon: 'cebianlancaipiaoshezhi'
          },
          component: () => import('@/views/lottery/fastLotteryAll'),
          beforeEnter: (to, from, next) => {
            to.meta.title = `${to.query.lotteryName}`
            next()
          }
        },
        {
          path: 'siteLottery',
          name: 'siteLottery',
          parentKey: 'lottery',
          meta: {
            title: '快速彩票',
            hideInMenu: false,
            activeKey: 'fastLottery',
            icon: 'cebianlancaipiaoshezhi'
          },
          component: () => import('@/views/lottery/siteLottery'),
        },
        {
          path: 'singleFastLottery',
          name: 'singleFastLottery',
          routeKey: 'singleFastLottery',
          parentKey: 'lottery',
          meta: {
            title: '单站快速彩票',
            icon: 'cebianlankuaisucaipiao',
            hideInMenu: false,
            routeKey: 'singleFastLottery'
          },
          component: () => import('@/views/lottery/singleFastLottery'),

        },

        {
          path: 'fastLotteryBlack',
          name: 'fastLotteryBlack',
          routeKey: 'fastLotteryBlack',
          parentKey: 'lottery',
          meta: {
            title: '全站黑名单',
            icon: 'cebianlankuaisucaiheimingdan',
            routeKey: 'fastLotteryBlack'
          },
          component: () =>
            import('@/views/lottery/fastLotteryBlack')
        },
        {
          path: 'fastLotteryBlackSingle',
          name: 'fastLotteryBlackSingle',
          routeKey: 'fastLotteryBlackSingle',
          parentKey: 'lottery',
          meta: {
            title: '单站黑名单',
            icon: 'cebianlankuaisucaiheimingdan',
            routeKey: 'fastLotteryBlackSingle'
          },
          component: () =>
            import('@/views/lottery/fastLotteryBlackSingle')
        },
        {
          path: 'fastKillList',
          name: 'fastKillList',
          routeKey: 'fastKillList',
          parentKey: 'lottery',
          meta: {
            title: '高杀率名单',
            icon: 'gaoshashuaimingdan',
            routeKey: 'fastKillList'
          },
          component: () =>
            import('@/views/lottery/fastKillList')
        },
        // {
        //   path: 'fastLotteryTop',
        //   name: 'fastLotteryTop',
        //   parentKey: 'lottery',
        //   routeKey: 'fastLotteryTop',
        //   meta: {
        //     title: '快速彩排行',
        //     icon: 'kuaisucaipaihang',
        //     routeKey: 'fastLotteryTop'
        //   },
        //   component: () => import('@/views/report/fastLotteryTop')
        // },
        // {
        //   path: 'fastLotteryTopDetail',
        //   name: 'fastLotteryTopDetail',
        //   parentKey: 'lottery',
        //   meta: {
        //     title: '快速彩排行详情',
        //     hideInMenu: true,
        //     icon: 'cebianlancaipiaoshezhi',
        //     activeKey: 'fastLotteryTop'
        //   },
        //   component: () => import('@/views/report/fastLotteryTopDetail')
        // },
        {
          path: 'fastLotteryPrizeList',
          name: 'fastLotteryPrizeList',
          parentKey: 'lottery',
          routeKey: 'fastLotteryPrizeList',
          meta: {
            title: '奖池记录',
            icon: 'cebianlankuaisucaiheimingdan',
            routeKey: 'fastLotteryPrizeList'
          },
          component: () =>
            import('@/views/lottery/fastLotteryPrizeList')
        },
        {
          path: 'fastLotteryPrizeListDetials',
          name: 'fastLotteryPrizeListDetials',
          parentKey: 'lottery',
          meta: {
            title: '奖池详情',
            hideInMenu: true,
            icon: 'cebianlankuaisucaiheimingdan',
            activeKey: 'fastLotteryPrizeList'
          },
          component: () =>
            import('@/views/lottery/fastLotteryPrizeListDetials')
        },
        {
          path: 'oddSet',
          name: 'oddSet',
          parentKey: 'lottery',
          routeKey: 'oddSet',
          meta: {
            title: '赔率设置',
            icon: 'peishuaishezhi',
            routeKey: 'oddSet'
          },
          component: () => import('@/views/lottery/oddSet')
        },
        {
          path: 'timeSet',
          name: 'timeSet',
          routeKey: 'timeSet',
          parentKey: 'lottery',
          meta: {
            title: '时间设置',
            icon: 'shijianshezhi',
            routeKey: 'timeSet'
          },
          component: () => import('@/views/lottery/timeSet')
        },
        {
          path: 'lotteryManagement',
          name: 'lotteryManagement',
          routeKey: 'lotteryManagement',
          parentKey: 'lottery',
          meta: {
            title: '官方彩开奖',
            icon: 'cebianlankaijiangguanli',
            routeKey: 'lotteryManagement'
          },
          component: () => import('@/views/lottery/lotteryManagement')
        },
        {
          path: 'otherLotteryManagement',
          name: 'otherLotteryManagement',
          routeKey: 'otherLotteryManagement',
          parentKey: 'lottery',
          meta: {
            title: '快速彩开奖',
            icon: 'cebianlancaipiaobaobiao',
            routeKey: 'otherLotteryManagement'
          },
          component: () =>
            import('@/views/lottery/otherLotteryManagement')
        },
        {
          path: 'oddsSetting',
          name: 'oddsSetting',
          parentKey: 'lottery',
          meta: {
            title: '彩票赔率设置',
            hideInMenu: true,
            activeKey: 'oddSet',
            icon: 'cebianlancaipiaoshezhi'
          },
          component: () => import('@/views/lottery/oddsSetting')
        },
        {
          path: 'oddsSetting1',
          name: 'oddsSetting1',
          parentKey: 'lottery',
          meta: {
            title: '彩票赔率设置',
            hideInMenu: true,
            activeKey: 'oddSet',
            icon: 'cebianlancaipiaoshezhi'
          },
          component: () => import('@/views/lottery/oddsSetting1')
        },
        {
          path: 'markTimeSetting',
          name: 'markTimeSetting',
          parentKey: 'lottery',
          meta: {
            title: '彩票时间设置',
            hideInMenu: true,
            activeKey: 'timeSet',
            icon: 'cebianlancaipiaoshezhi'
          },
          component: () => import('@/views/lottery/markTimeSetting')
        },
        {
          path: 'timesSettingAno',
          name: 'timesSettingAno',
          parentKey: 'lottery',
          meta: {
            title: '彩票时间设置',
            hideInMenu: true,
            activeKey: 'timeSet',
            icon: 'cebianlancaipiaoshezhi'
          },
          component: () => import('@/views/lottery/timeSettingAno')
        },
        // {
        //   path: 'fastLotteryD',
        //   name: 'fastLotteryD',
        //   parentKey: 'lottery',
        //   meta: {
        //     title: '彩票详情',
        //     hideInMenu: true,
        //     notCache: true,
        //     icon: 'cebianlancaipiaoshezhi'
        //   },
        //   component: () => import('@/views/lottery/fastLotteryD'),
        //   beforeEnter: (to, from, next) => {
        //     to.meta.activeKey = from.meta.routeKey
        //     to.meta.title = from.name === 'fastLottery' ? '快彩预设期数' : '快彩预设期数'
        //     next()
        //   }
        // },
        {
          path: 'fastLotteryDetails',
          name: 'fastLotteryDetails',
          parentKey: 'lottery',
          meta: {
            title: '彩票详情',
            hideInMenu: true,
            notCache: true,
            icon: 'cebianlancaipiaoshezhi'
          },
          component: () => import('@/views/lottery/fastLotteryDetails'),
          beforeEnter: (to, from, next) => {
            to.meta.activeKey = from.meta.routeKey
            to.meta.title = from.name === 'fastLottery' ? '快彩预设期数' : '快彩预设期数'
            next()
          }
        },
        {
          path: 'fastLotteryTop',
          name: 'fastLotteryTop',
          parentKey: 'lottery',
          routeKey: 'fastLotteryTop',
          meta: {
            title: '快速彩排行',
            icon: 'kuaisucaipaihang',
            routeKey: 'fastLotteryTop'
          },
          component: () => import('@/views/report/fastLotteryTop')
        },
        {
          path: 'fastLotteryTopDetail',
          name: 'fastLotteryTopDetail',
          parentKey: 'lottery',
          meta: {
            title: '快速彩排行详情',
            hideInMenu: true,
            icon: 'cebianlancaipiaoshezhi',
            activeKey: 'fastLotteryTop'
          },
          component: () => import('@/views/report/fastLotteryTopDetail')
        },
        {
          path: 'fastLotterySum',
          name: 'fastLotterySum',

          parentKey: 'lottery',
          routeKey: 'fastLotterySum',
          meta: {
            title: '快彩统计',
            icon: 'kuaicaitongji',
            routeKey: 'fastLotterySum',
            // hideInMenu: true,

          },
          component: () => import('@/views/lottery/fastLotterySum')
        },
        {
          path: 'fastLotterySumDetials',
          name: 'fastLotterySumDetials',
          parentKey: 'lottery',
          meta: {
            title: '快速赛车站点',
            hideInMenu: true,
            icon: 'cebianlankuaisucaipiao',
            routeKey: 'fastLotterySumDetials',
            activeKey: 'fastLotterySum'
          },
          component: () => import('@/views/lottery/fastLotterySumDetials'),
        },
        {
          path: 'fastLotterySumDetialsSecond',
          name: 'fastLotterySumDetialsSecond',
          parentKey: 'lottery',
          meta: {
            title: '单站快速彩票2',
            icon: 'cebianlankuaisucaipiao',
            hideInMenu: true,
            routeKey: 'fastLotterySumDetialsSecond',
            activeKey: 'fastLotterySum'
          },
          component: () => import('@/views/lottery/fastLotterySumDetialsSecond'),
          beforeEnter: (to, from, next) => {
            to.meta.title = `${to.query.siteName}` + "快彩"
            next()
          }
        },
      ]
    }
  ]
}
export default system