const activity = {
  path: "/activity",
  name: "activity",
  meta: {
    title: "活动管理",
    hideInMenu: true,
    hideInTop: false
  },
  component: () => import("@/components/main"),
  redirect: {
    name: "borrow"
  },
  newChild: [],
  children: [{
      path: "borrow",
      name: "borrow",
      parentKey: "activity",
      routeKey: "jiebeiManagement",
      meta: {
        title: "借呗",
        icon: "jiebei"
      },
      component: () => import("@/views/activity/parent"),
      redirect: {
        name: "activityBorrow"
      },
      newChild: [],
      children: [{
          path: "activityBorrow",
          name: "activityBorrow",
          parentKey: "jiebeiManagement",
          routeKey: "loanList",
          meta: {
            title: "借款管理",
            icon: "jiekuanguanli",
            routeKey: "loanList"
          },
          component: () =>
            import("@/views/activity/jiebeiManagement/activityBorrow")
        },
        {
          path: 'overdueSum',
          name: 'overdueSum',
          parentKey: 'jiebeiManagement',
          routeKey: 'expiredTotal',
          meta: {
            title: '逾期统计',
            icon: 'yuqitongji1',
            routeKey: 'expiredTotal'
          },
          component: () =>
            import('@/views/activity/overdueSum')
        },
        {
          path: 'loanRepaymentTotal',
          name: 'loanRepaymentTotal',
          parentKey: 'jiebeiManagement',
          routeKey: 'loanRepaymentTotal',
          meta: {
            title: '借还统计',
            icon: 'jiehuankuantongji1',
            routeKey: 'loanRepaymentTotal'
          },
          component: () =>
            import('@/views/activity/loanRepaymentTotal')
        },
        {
          path: 'loanRepaymentTotalDetails',
          name: 'loanRepaymentTotalDetails',
          parentKey: 'jiebeiManagement',
          routeKey: 'loanRepaymentTotal',
          meta: {
            title: '借还明细',
            icon: 'yuqitongji1',
            hideInMenu:true,
            routeKey: 'loanRepaymentTotal'
          },
          component: () =>
            import('@/views/activity/loanRepaymentTotalDetails')
        },
        {
          path: "jiebeiEduList",
          name: "jiebeiEduList",
          parentKey: "jiebeiManagement",
          routeKey: "jiebeiEduList",
          meta: {
            title: "借呗模式",
            icon: "jiebeimoshi",
            routeKey: "jiebeiEduList"
          },
          component: () =>
            import("@/views/activity/jiebeiManagement/jiebeiEduList")
        },
        {
          path: "activityRepay",
          name: "activityRepay",
          parentKey: "jiebeiManagement",
          routeKey: "repaymentList",
          meta: {
            title: "还款管理",
            icon: "huankuanguanli",
            routeKey: "repaymentList"
          },
          component: () =>
            import("@/views/activity/jiebeiManagement/activityRepay")
        }
      ]
    },
    {
      path: "housekeeper",
      name: "housekeeper",
      parentKey: "activity",
      routeKey: "jinguanjiaManagement",
      meta: {
        title: "金管家",
        icon: "jinguanjia"
      },
      component: () => import("@/views/activity/parent"),
      redirect: {
        name: "levelManagement"
      },
      newChild: [],
      children: [
        {
          path: "levelManagementX",
          name: "levelManagement",
          parentKey: "jinguanjiaManagement",
          routeKey: "jinGuanJiaLevelList",
          meta: {
            title: "等级管理",
            icon: "dengjiguanli",
            routeKey: "jinGuanJiaLevelList"
          },
          component: () =>
            import("@/views/activity/jinguanjiaManagement/levelManagementX")
        },
        {
          path: "levelManagementXX",
          name: "levelManagement",
          parentKey: "jinguanjiaManagement",
          routeKey: "jinGuanJiaLevelList",
          meta: {
            title: "等级管理",
            icon: "dengjiguanli",
            routeKey: "jinGuanJiaLevelList",
            hideInMenu:true
          },
          component: () =>
            import("@/views/activity/jinguanjiaManagement/levelManagementXX")
        },
        {
          path: "codeManagementX",
          name: "codeManagement",
          parentKey: "jinguanjiaManagement",
          routeKey: "jinGuanJiaShow",
          meta: {
            title: "打码管理",
            icon: "saomaguanli",
            routeKey: "jinGuanJiaShow",
          },
          component: () =>
            import("@/views/activity/jinguanjiaManagement/codeManagementX")
        },
        {
          path: "codeManagementXX",
          name: "codeManagement",
          parentKey: "jinguanjiaManagement",
          routeKey: "jinGuanJiaShow",
          meta: {
            title: "打码管理",
            icon: "saomaguanli",
            routeKey: "jinGuanJiaShow",
            hideInMenu:true
          },
          component: () =>
            import("@/views/activity/jinguanjiaManagement/codeManagementXX")
        },
        {
          path: "GetTheRecord",
          name: "GetTheRecord",
          parentKey: "jinguanjiaManagement",
          routeKey: "jinGuanJiaShow",
          meta: {
            title: "领取记录",
            icon: "lingqujilu1",
            routeKey: "jinGuanJiaShow"
          },

          component: () =>
              import("@/views/activity/jinguanjiaManagement/GetTheRecord")
        },
        {
          path: "GetTheRecordX",
          name: "GetTheRecord",
          parentKey: "jinguanjiaManagement",
          routeKey: "GetTheRecordX",
          meta: {
            title: "领取记录",
            icon: "lingqujilu1",
            hideInMenu: true,
            routeKey: "jinGuanJiaShow"
          },

          component: () =>
              import("@/views/activity/jinguanjiaManagement/GetTheRecordX")
        },
        {
          path: "logList",
          name: "logList",
          parentKey: "jinguanjiaManagement",
          routeKey: "jinGuanJiaAndJiebeiLogsShow",
          meta: {
            title: "日志列表",
            icon: "rizhiliebiao",
            routeKey: "jinGuanJiaAndJiebeiLogsShow"
          },
          component: () =>
            import("@/views/activity/jinguanjiaManagement/logList")
        }
      ]
    },
    {
      path: "yuEBao",
      name: "yuEBao",
      parentKey: "activity",
      routeKey: "yuebaoManagement",
      meta: {
        title: "余额宝",
        icon: "yuebao"
      },
      component: () => import("@/views/activity/parent"),
      redirect: {
        name: "yuebaoLevelList"
      },
      newChild: [],
      children: [
        {
          path: "yuebaoMemberList",
          name: "yuebaoMemberList",
          parentKey: "yuebaoManagement",
          routeKey: "yuEBao",
          meta: {
            title: "账户管理",
            icon: "liushuijilu",
            routeKey: "yuebaoMemberList"
          },
          component: () =>
            import("@/views/activity/yuebaoManagement/yuebaoMemberList")
        },
        {
          path: "yuebaoLevelList",
          name: "yuebaoLevelList",
          parentKey: "yuebaoManagement",
          routeKey: "yuEBao",
          meta: {
            title: "等级管理",
            icon: "dengjiguanli1",
            routeKey: "yuEBao"
          },
          component: () =>
            import("@/views/activity/yuebaoManagement/yuebaoLevelList")
        },
        {
          path: "liuShui",
          name: "liuShui",
          parentKey: "yuebaoManagement",
          routeKey: "liuShui",
          meta: {
            title: "流水记录",
            icon: "liushuijilu",
            routeKey: "yuEBao"
          },
          component: () =>
            import("@/views/activity/yuebaoManagement/liuShui")
        }
      ],
    },
    {
      path: "officialCompile",
      name: "officialCompile",
      parentKey: "activity",
      routeKey: "officialCompile",
      meta: {
        title: "文案编修",
        icon: "bianji1"
      },
      component: () => import("@/views/activity/parent"),
      newChild: [],
      children: [{
          path: "activeList",
          parentKey: "officialCompile",
          routeKey: "activityList",
          name: "activeList",
          meta: {
            title: "活动列表",
            icon: "huodongliebiao-huodong",
            routeKey: "activityList"
          },
          component: () => import("@/views/activity/officialCompile/activeList")
        },
        {
          path: "advertisingImg",
          parentKey: "officialCompile",
          routeKey: "advertisingImg",
          name: "advertisingImg",
          meta: {
            title: "启动图管理",
            icon: "huodongliebiao-huodong",
            routeKey: "advertisingImg"
          },
          component: () => import("@/views/activity/officialCompile/advertisingImg")
        },
        {
          path: "advertisingImgEdit",
          parentKey: "officialCompile",
          routeKey: "advertisingImgEdit",
          name: "advertisingImgEdit",
          meta: {
            title: "启动图编辑",
            icon: "huodongliebiao-huodong",
            routeKey: "advertisingImgEdit"
          },
          component: () => import("@/views/activity/officialCompile/advertisingImgEdit")
        },
        {
          path: "addActivities:page",
          name: "addActivities",
          parentKey: "officialCompile",
          meta: {
            title: "新增活动",
            hideInMenu: true,
            activeKey: "activityList",
            icon: "bianji1"
          },
          component: () =>
            import("@/views/activity/officialCompile/addActivities"),
          beforeEnter: (to, from, next) => {
            to.meta.title = to.params.page === "edit" ? "编辑活动" : "新增活动";
            next();
          }
        },
        {
          path: "lunboManagement",
          name: "lunboBanner",
          parentKey: "officialCompile",
          routeKey: "lunboManagement",
          meta: {
            title: "轮播图列表",
            icon: "lunbotu",
            routeKey: "lunboManagement"
          },
          component: () => import("@/views/system/lunboManagement/lunboBanner")
        },
        {
          path: "lunboEdit/:page?",
          name: "lunboEdit",
          parentKey: "officialCompile",
          routeKey: "lunboManagement",
          meta: {
            title: "编辑轮播图",
            hideInMenu: true,
            activeKey: "lunboManagement",
            icon: "bianji1"
          },
          component: () => import("@/views/system/lunboManagement/lunboEdit")
        },
        {
          path: "logoManagement",
          name: "logoManagement",
          parentKey: "officialCompile",
          routeKey: "logoManagement",
          meta: {
            title: "Logo管理",
            icon: "LOGOguanli",
            routeKey: "logo"
          },
          component: () =>
            import("@/views/system/logoManagement/logoManagement")
        },
        {
          path: "activityImgConfigList",
          name: "activityImgConfigList",
          parentKey: "officialCompile",
          routeKey: "activityImgConfigList",
          meta: {
            title: "尺寸设置",
            icon: "chicunshezhi",
            routeKey: "activityImgConfigList"
          },
          component: () =>
            import("@/views/system/siteManagement/activityImgConfigList")
        },
        {
          path: "floatImgList",
          parentKey: "officialCompile",
          routeKey: "floatImgList",
          name: "floatImgList",
          meta: {
            title: "浮动图管理",
            icon: "huodongtushezhi",
            routeKey: "floatImgList"
          },
          component: () =>
            import("@/views/activity/officialCompile/floatingFigure")
        },
        {
          path: "addFuDong:page",
          name: "addFuDong",
          parentKey: "officialCompile",
          meta: {
            title: "新增浮动图",
            hideInMenu: true,
            activeKey: "floatImgList",
            icon: "bianji1"
          },
          component: () => import("@/views/activity/officialCompile/addFuDong"),
          beforeEnter: (to, from, next) => {
            to.meta.title =
              to.params.page === "edit" ? "编辑浮动图" : "新增浮动图";
            next();
          }
        }
      ]
    },
    {
      path: "preferentialActivityManagement",
      name: "preferentialActivityManagement", 
      parentKey: "activity",
      routeKey: "preferentialActivityManagement",
      meta: {
        title: "优惠活动",
        icon: "youhuihuodong"
      },
      component: () => import("@/views/activity/parent"),
      redirect: {
        name: "preferentialList"
      },
      newChild: [],
      children: [
        // {
        //   path: "preferentialList",
        //   name: "preferentialList",
        //   parentKey: "preferentialActivityManagement",
        //   routeKey: "depositPreferentialList",
        //   meta: {
        //     title: "存款优惠",
        //     icon: "cunkuanyouhui",
        //     routeKey: "depositPreferentialList"
        //   },
        //   component: () =>
        //     import(
        //       "@/views/activity/preferentialActivityManagement/preferentialList"
        //     )
        // },
        {
          path: "competition",
          name: "competition",
          parentKey: "preferentialActivityManagement",
          routeKey: "competition",
          meta: {
            title: "争霸赛",
            icon: "shenhe",
            routeKey: "competition",
          },
          component: () =>
         
            import(
              "@/views/activity/preferentialActivityManagement/competition"
            )
            ,
            beforeEnter: (to, from, next) => {
             
              // console.log(window.location)
              console.log(window.location.hostname)
              next()
            }
        },
        {
          path: "reviewActivities",
          name: "reviewActivities",
          parentKey: "preferentialActivityManagement",
          routeKey: "reviewActivities",
          meta: {
            title: "活动审核",
            hideInMenu: true, 
            icon: "shenhe",
            routeKey: "reviewActivities"
          },
          component: () =>
            import(
              "@/views/activity/preferentialActivityManagement/reviewActivities"
            )
        },
        
        {
          path: "activitySynthesis",
          name: "activitySynthesis",
          parentKey: "preferentialActivityManagement",
          routeKey: "activitySynthesis",
          meta: {
            title: "活动综合",
            icon: "huodongzonghe",
            // hideInMenu: true,
            routeKey: "activitySynthesis"
          },
          component: () =>
            import(
              "@/views/activity/preferentialActivityManagement/activitySynthesis"
            )
        },
        
        {
          path: "activityBankingBonus",
          name: "activityBankingBonus",
          parentKey: "preferentialActivityManagement",
          routeKey: "activityBankingBonus",
          meta: {
            title: "公司入款加赠",
            icon: "huodongzonghe",
            // hideInMenu: true,
            routeKey: "activityBankingBonus"
          },  
          component: () =>
            import(
              "@/views/activity/preferentialActivityManagement/activityBankingBonus"
            )
        },
         {
          path: "recordCode",
          name: "recordCode",
          parentKey: "preferentialActivityManagement",
          routeKey: "recordCode",
          meta: {
            title: "兑换码记录",
            icon: "duihuanma1",
            routeKey: "recordCode"
          },
          component: () =>
            import("@/views/activity/preferentialActivityManagement/recordCode")
        },
        {
          path: "getActiveList",
          name: "getActiveList",
          parentKey: "preferentialActivityManagement",
          routeKey: "getActiveList",
          meta: {
            title: "活动记录",
            icon: "huodongjilu",
            // hideInMenu: true,
            routeKey: "getActiveList"
          },
          component: () =>
            import(
              "@/views/activity/preferentialActivityManagement/getActiveList"
            )
        },
        // {
        //   path: "redPacket",
        //   name: "redPacket",
        //   parentKey: "preferentialActivityManagement",
        //   routeKey: "redPacket",
        //   meta: {
        //     title: "抢红包",
        //     icon: "qianghongbao",
        //     routeKey: "redPacket"
        //   },
        //   component: () =>
        //     import(
        //       "@/views/activity/preferentialActivityManagement/redPacket"
        //     )
        // },
        // {
        //   path: "redRain",
        //   name: "redRain",
        //   parentKey: "preferentialActivityManagement",
        //   routeKey: "redRain",
        //   meta: {
        //     title: "红包雨",
        //     icon: "zu8",
        //     routeKey: "redRain"
        //   },
        //   component: () =>
        //     import(
        //       "@/views/activity/preferentialActivityManagement/redRain"
        //     )
        // },
        {
          path: "redSend",
          name: "redSend",
          parentKey: "preferentialActivityManagement",
          routeKey: "redSend",
          meta: {
            title: "红包记录",
            icon: "hongbaojilu",
            routeKey: "redSend"
          },
          component: () =>
            import(
              "@/views/activity/preferentialActivityManagement/redSend"
            )
        },
        {
          path: "redSet",
          name: "redSet",
          parentKey: "preferentialActivityManagement",
          routeKey: "redSet",
          meta: {
            title: "红包配置",
            icon: "zu8",
            routeKey: "redSet",
          },
          component: () =>
            import(
              "@/views/activity/preferentialActivityManagement/redSet"
            )
        }

      ]
    },
    {
      path: "blackList",
      name: "blackList",
      uri: "api/v2/activityBlackList",
      parentKey: "activity",
      routeKey: "blackListManagement",
      meta: {
        title: "活动名单",
        icon: "huodongheimingdan"
      },
      component: () => import("@/views/activity/parent"),
      redirect: {
        name: "activityBlackList"
      },
      newChild: [],
      children: [{
          path: "activityBlackList",
          name: "activityBlackList",
          routeKey: "blackListShow",
          parentKey: "blackListManagement",
          uri: "api/v2/activity/black/activityBlackList",
          meta: {
            title: "活动黑名单",
            icon: "huodongheimingdan1",
            routeKey: "blackListManagement"
          },
          component: () =>
            import("@/views/activity/blackListManagement/activityBlackList")
        },
        {
          path: "packList",
          name: "packList",
          routeKey: "packList",
          parentKey: "blackListManagement",
          meta: {
            title: "封禁列表",
            // hideInMenu: true,
            icon: "fengjin__",
            routeKey: "packList"
          },
          component: () =>
            import("@/views/activity/blackListManagement/packList")
        },
        {
          path: "activeWhiteList",
          name: "activeWhiteList",
          routeKey: "blackListShow",
          parentKey: "blackListManagement",
          uri: "api/v2/activity/black/activityWhiteList",
          meta: {
            title: "活动白名单",
            icon: "huodongbaimingdan",
            routeKey: "blackListManagement"
          },
          component: () =>
            import("@/views/activity/blackListManagement/activeWhiteList")
        },
      ]
    },
    // {
    //   path: 'gradeList',
    //   name: 'gradeList',
    //   parentKey: 'activity',
    //   // routeKey:'packListManagement',
    //   meta: {
    //     title: 'VIP等级管理',
    //     icon: 'fengjin__'
    //   },
    //   component: () =>
    //     import('@/views/activity/parent'),
    //   newChild: [],
    //   children: [{
    //     path: 'gradeList',
    //     name: 'gradeList',
    //     routeKey: 'gradeList',
    //     //  parentKey: 'packListManagement',
    //     uri: 'api/v2/activity/black/activityBlackList',
    //     meta: {
    //       title: 'VIP等级管理',
    //       icon: 'fengjin__',
    //       routeKey: 'gradeList'
    //     },
    //     component: () =>
    //       import('@/views/activity/gradeList')
    //   }]
    // },
  ]
};
export default activity;