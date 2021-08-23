import Mock from 'mockjs'
import { doCustomTimes } from '@/libs/util'

export const borrowDataO = (req) => {
  let tableData = {
    data: []
  }
  doCustomTimes(3, () => {
    tableData.data.push(
      Mock.mock({
        account: '@natural(11111,99999)',
        name: '阿斯蒂',
        gameLimit: '0.00/等级0',
        lotteryLimit: '115.00/等级5',
        borrowAmount: '100000.00',
        borrow: '1000.00',
        'status|1': true,
        'return|1': true,
        remarks: '啊啊啊啊啊啊啊啊啊啊',
        updateTime: '@date 13:50',
        checkTime: '@date 14:00',
        checker: 'aaa',
        orderNum: '201903261562326954',
        overdraftAmount: '1000000.00',
        repaymentAmount: '1000000.00'
      })
    )
  })
  tableData.code = 200
  return tableData
}
// 还款管理 金管家抵扣
export const managementData = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(3, () => {
    tableData.data.push(Mock.mock({
      orderNum: '201903261598546521',
      account: '1111111',
      live: '1',
      gift: '100000000.00',
      remarks: '啊啊啊啊啊啊啊啊啊啊啊啊啊',
      updateTime: '@date 16:10'
    }))
  })
  tableData.code = 200
  return tableData
}
// 逾期统计
export const overDueStatic = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(3, () => {
    tableData.data.push(Mock.mock({
      account: '1111111',
      name: '啊啊',
      borrow: '1000.00',
      repay: '1000.00',
      balance: '10000.00',
      balanceBorrow: '100000.00',
      manaAmount: '100000.00',
      refundAmount: '1000.00',
      updateTime: '@date 17:13',
      overDate: '@date 17:15',
      update: '@date 17:20'
    }))
  })
  tableData.code = 200
  return tableData
}
// 等级管理
export const levelMan = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(6, () => {
    tableData.data.push(Mock.mock({
      level: '@natural(1,10)',
      code: '100000000.00',
      bonus: '100000000.00',
      monWage: '10000000.00',
      weekWage: '100000000.00',
      borrowLimit: '100000000.00',
      bonusUp: '10000000.00',
      monthUp: '100000000.00',
      weekUp: '1000000000.00',
      updateTime: '@datetime'
    }))
  })
  tableData.code = 200
  return tableData
}
// 打码管理
export const codeMana = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(6, () => {
    tableData.data.push(Mock.mock({
      account: '111111',
      level: '@natural(1,10)',
      code: '1000000000.00',
      bonus: '100000000.00',
      monWage: '10000000.00',
      weekWage: '100000000.00',
      borrowLimit: '10000000.00',
      'status|1': true,
      upAll: '100000000.00',
      monWageAll: '10000000000.00',
      weekWageAll: '1000000000.00',
      updateTime: '@datetime'
    }))
  })
  tableData.code = 200
  return tableData
}
// 日志列表
export const logList = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(6, () => {
    tableData.data.push(Mock.mock({
      account: '111111',
      checker: '系统自动抵扣',
      time: '@datetime',
      log: '会员从19-01-08 13:20借款到目前的19-03-08 13:20尚未完成还款，将原来的视讯金管家等级1降级为0，将原来的降级日期19-03-08更新为了19-05-08'
    }))
  })
  tableData.code = 200
  return tableData
}
// 活动黑名单
export const activityBlackList = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(7, () => {
    tableData.data.push(Mock.mock({
      type: '@natural(1,5)',
      account: '@string(6,12)',
      name: '真是令人头大',
      createdTime: '@datetime'
    }))
  })
  tableData.code = 200
  return tableData
}
// 轮播图列表
export const lunboMangerList = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(6, () => {
    tableData.data.push(Mock.mock({
      zhandian: '111',
      zhongduan: '222',
      tupian: '图片',
      shangxianshijian: '时间',
      xiaxianshijian: '下线时间',
      chuangjianshijian: '创建时间'
    }))
  })
  tableData.code = 200
  return tableData
}
// 编辑轮播图
export const lunboMangerEdit = req => {
  let tableData = {
    data: []
  }
  doCustomTimes(2, () => {
    tableData.data.push(Mock.mock({
      biaoti: '111',
      tiaozhuandizhi: '222',
      tupian: '图片',
      shangxianshijian: '时间',
      xiaxianshijian: '下线时间',
      chuangjianshijian: '创建时间'
    }))
  })
  tableData.code = 200
  return tableData
}
