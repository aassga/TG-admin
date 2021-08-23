<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <Button :class="btnName == '本月' ? 'bd-bg':'bg-or'" @click="changeBtn('本月')">本月</Button>
        </FormItem>
        <FormItem>
          <Button :class="btnName == '上月' ? 'bd-bg':'bg-or'" @click="changeBtn('上月')">上月</Button>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker placeholder="开始日期" @on-change='startChange' class="s-120" v-model="Time[0]" key="user-startTime"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker placeholder="开始日期" @on-change='endChange' class="s-120" v-model="Time[1]" key="user-endTime"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type='primary' :loading="$root.tableLoading" class="ivu-btn search" @click="searchSubmit">查询</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click="exportExcel">导出Excel</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        :show-sizer='false'
        :page-size-opts="table.pageSizeOpts"
        @on-sort-change="sortChange"
        @on-page-change='onPageChange'
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables';
import { dayReport } from '@/api/report';
export default {
  name: "totalReport",
  components: {Tables},
  data() {
    return {
      page: 1,
      btnName: "本月",
      Time: [],
      searchKey: {
        siteId: this.$root.nowSite.id,
        limit: 40
      },
      startBtnList: [this.$root.monthDayStartTime(), this.$root.lastMonthDayStartTime()],
      endBtnList: [this.$root.monthDayEndTime(), this.$root.lastMonthDayEndTime()],
      table: {
        total: 0,
        data: [],
        pageSizeOpts: [40],
        loading: true,
        columns: [
          {
            title: '日期',
            key: 'data_date',
            align: 'center',
            minWidth:70,
            render: (h,params) => {
              let { data_date } = params.row
              if (data_date == '总计') {
                return <span>{data_date}</span>
              } else {
                return <span>{this.$moment.unix(data_date).format('YYYY-MM-DD')}</span>
              }
            }
          },
          {
            title: '有效投注',
            key: 'validBetAmount',
            align: 'center',
            sortable: 'custom',
            minWidth:75,
            render: (h, params) => <span>{parseInt(params.row.validBetAmount)}</span>
          },
          {
            title: '会员输赢',
            key: 'netAmount',
            align: "center",
            sortable: 'custom',
            minWidth:75,
            render:(h,params) => <span>{parseInt(params.row.netAmount)}</span>
          },
          {
            title: '注单数量',
            key: 'betCount',
            align: 'center',
            sortable: 'custom',
            minWidth:75,
          },
          {
            title: '投注人数',
            key: 'betUserCount',
            align: 'center',
            sortable: 'custom',
            minWidth:75,
          },
          {
            title: '返水金额',
            key: 'refandAmount',
            align: "center",
            sortable: 'custom',
            minWidth:75,
            render: (h, params) => <span>{parseInt(params.row.refandAmount)}</span>
          },
          {
            title: '活动礼金',
            key: 'giftBonusAmount',
            align: 'center',
            sortable: 'custom',
            minWidth:75,
            render: (h, params) => <span>{parseInt(params.row.giftBonusAmount)}</span>
          },
          {
            title: '活动人数',
            key: 'giftBonusUserCount',
            align: 'center',
            sortable: 'custom',
            minWidth:75,
          },
          {
            title: "代理佣金",
            key: "agencyBonusAmount",
            align: 'center',
            sortable: 'custom',
            minWidth:75,
            render: (h, params) => <span>{parseInt(params.row.agencyBonusAmount)}</span>
          },
          {
            title: '代理人数',
            key: 'agencyBonusUserCount',
            align: 'center',
            sortable: 'custom',
            minWidth:75,
          },
          {
            title: '网站盈利',
            key: "memberReport",
            align: 'center',
            sortable: 'custom',
            minWidth:85,
            render:(h,params) => <span class='red-font'>{parseInt(params.row.memberReport)}</span>
          },
          {
            title: '盈率',
            key: "memberReportRate",
            align: "center",
            sortable: 'custom',
            minWidth:55,
             render: (h, params) => {
                let { memberReportRate } = params.row;
                return <span class='red-font'>{parseInt(params.row.memberReportRate)}</span>
						}
          }
        ]
      }
    };
  },
  mounted() {
    // 获取默认显示的本月时间
    this.changeBtn('本月')
  },
  methods: {
    startChange(time, type) {
      let st = this.$root.formatTimeS(this.Time[0])
      let et = this.$root.formatnightTimeS(this.Time[1])
      if (st == this.$root.monthDayStartTime() && et == this.$root.monthDayEndTime()) this.btnName = '本月'
      if (st == this.$root.lastMonthDayStartTime() && et == this.$root.lastMonthDayEndTime()) this.btnName = '上月'
      if (this.startBtnList.indexOf(st) == -1) this.btnName = ''
    },
    endChange(time, type) {
      let st = this.$root.formatTimeS(this.Time[0])
      let et = this.$root.formatnightTimeS(this.Time[1])
      if (st == this.$root.monthDayStartTime() && et == this.$root.monthDayEndTime()) this.btnName = '本月'
      if (st == this.$root.lastMonthDayStartTime() && et == this.$root.lastMonthDayEndTime()) this.btnName = '上月'
      if (this.endBtnList.indexOf(et) == -1) this.btnName = ''
    },
    changeBtn(name) {
      this.btnName = name
       switch (name) {
        case "本月":
          this.searchKey.startTime = this.$root.monthDayStartTime()
          this.searchKey.endTime = this.$root.monthDayEndTime()
          break;
        case "上月":
          this.searchKey.startTime =  this.$root.lastMonthDayStartTime()
          this.searchKey.endTime = this.$root.lastMonthDayEndTime()
          break;
      }
      this.Time[0] = this.searchKey.startTime
      this.Time[1] = this.searchKey.endTime
      this.getData({params: this.searchKey})
    },
    getData(data) {
       this.$root.startTableLoading();
      dayReport(data).then(res => {
        if (res.data.data) {
          let { list, total } = res.data.data;
          list.length && list.push(this.createTotalData(total));
          this.table.data = list;
          this.table.total = res.data.total;
        } else {
          this.tabla.data = [];
          this.table.total = 0;
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    createTotalData(total) {
      const {
        data_date,validBetAmount,betCount,betUserCount,refandAmount,giftBonusAmount,giftBonusUserCount,
        agencyBonusAmount,agencyBonusUserCount,netAmount,netAmountRate,moneyReportRate,memberReport,memberReportRate
      } = total
      let item = {
        data_date: '总计',
        validBetAmount,betCount,betUserCount: '-',refandAmount,giftBonusAmount,giftBonusUserCount: '-',
        agencyBonusAmount,agencyBonusUserCount: '-',netAmount,netAmountRate,moneyReportRate,memberReport,memberReportRate
      }
      return item
    },
    sortChange({ column, key, order }) {
      delete this.searchKey.sortKey
      delete this.searchKey.sortVal
      let data = {
        sortKey:key,
        sortVal: order,
        ...this.searchKey
      }
      this.searchKey.sortKey = key
      if (data.sortVal == 'normal') {
        this.table.columns.forEach(item => {
          if (item.key == column.key) this.$set(item, 'sortType', 'asc')
        })
        this.searchKey.sortVal = 'asc'
        data.sortVal = 'asc'
      } else {
        this.table.columns.forEach(item => delete item.sortType)
        this.searchKey.sortVal = order
      }
      this.page == 1 ? '' : this.$refs.table.setPage()
      this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 }})
    },
    searchSubmit() {
      let { sortKey, sortVal } = this.searchKey
      if (sortKey) delete this.searchKey.sortKey
      if (sortVal) delete this.searchKey.sortVal
      this.table.columns.forEach(item => this.$set(item, 'sortType', ''))
      let data = { ...this.searchKey,startTime: this.$root.formatTimeS(this.Time[0]),endTime: this.$root.formatnightTimeS(this.Time[1])}
      this.searchKey.startTime = this.$root.formatTimeS(this.Time[0])
      this.searchKey.endTime = this.$root.formatnightTimeS(this.Time[1])
      for(let key in data) {
        if (!data[key]) delete data[key]
      }
      let { startTime, endTime } = data
      if (startTime == 'Invalid date' || endTime =='Invalid date') {
        this.$Tip.info({content: '请输入开始和结束时间！'})
        return false
      }
      if(new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        this.$Tip.info({ content: '结束时间必须大于开始时间'})
        return false
      }
      this.getData({ params: data })
    },
    exportExcel() {
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1])
      }
      for (let key in data) {
        if (!data[key]) delete data[key]
      }
      let { startTime, endTime } = data
      if (startTime == 'Invalid date' || endTime == 'Invalid date') {
        this.$Tip.info({ content: '请输入开始和结束时间' })
        return false
      }
      if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        this.$Tip.info({ content: '结束时间必须大于开始时间' })
        return false
      }
      data.isExport = 1
      this.$root.startEditLoading()
      let openr = window.open()
      dayReport({ params: data }).then(res => {
        if (res!= undefined && res.code == 200) {
          let region = res.data.downloadUrl
          let nowHost = region.split('.com')[1]
          let openr1 = openr ? openr : window
          openr1.location.href = nowHost
        } else {
          openr.close()
        }
        this.$root.endEditLoading()
      }).catch( error => this.$root.endEditLoading())
    },
    onPageChange(page) {
      this.page = page
      this.getData({ params: this.searchKey, query: { page }})
    },
    // onPageSizeChange(pageSize) {
    //   this.searchKey.limit = pageSize
    //   this.getData({ params: this.searchKey })
    // }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.bd-bg {
  height: 36px;
  background-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.bg-or {
  height: 36px;
  border: 1px solid #eaeaea;
  &:focus {
    box-shadow: 0 0 0 0;
  }
  &:hover {
    background: #f4f9ff;
    border: 1px solid #2d8cf0;
    color: #2d8cf0;
  }
}
</style>

