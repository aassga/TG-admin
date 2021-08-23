<template>
  <div>
    <div class="v2-search clearfix">
      <Form ref="searchKey" inline class="ib fl">
        <FormItem v-for="(t,i) in btnList" :key="i">
          <Button class="fontColor" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click="changeBtn(t)">
            <span >{{t}}</span></Button>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker placeholder="开始日期" @on-change='startChange' :options="options3" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker placeholder="结束日期" @on-change='startChange' :options="options3" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" :loading="$root.tableLoading" class="ivu-btn search" @click="searchSubmit">查询</Button>
        </FormItem>
      </Form>
      <div class="fr">
        <span class='font-bold ft16'>域名：</span>
        <span class="pr10">{{$route.query.domain}}</span>
      </div>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns='table.columns'
        :total="table.total"
        :value="table.data"
        :pageSizeOpts='table.pageSizeOpts'
        @on-sort-change="sortChange"
        @on-page-change='onPageChange'
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables';
import { domainReportsDetailByUser } from '@/api/report';
import { checkDayBtn } from '@/libs/util';
export default {
  name: 'domainReportsDetailByUser',
  components: {Tables},
  data() {
    return {
      page: 1,
      btnList: ['今天','昨天','本月','上月','总数据'],
      btnName: '',
      startBtnList: [this.$root.todayStartTime(), this.$root.yesterdayStartTime(), this.$root.monthDayStartTime(), this.$root.lastMonthDayStartTime(), this.$root.totalDataStartTime()],
      endBtnList: [this.$root.todayEndTime(), this.$root.yesterdayEndTime(), this.$root.monthDayEndTime(), this.$root.lastMonthDayEndTime(), this.$root.totalDataEndTime()],
      Time: [this.$root.newstartTime(), new Date()],
      searchKey: {
        siteId: this.$root.nowSite.id,
        startTime: this.$root.startTime(),
        endTime: this.$root.formatnightTimeS(),
        domain: this.$route.query.domain,
        type: this.$route.query.page
      },
      options3: {
        disabledDate: date => {
          return (
            date &&
            date.valueOf() < new Date(this.$root.totalDataStartTime()).getTime()
          );
        }
      },
      table: {
        loading: true,
        total: 0,
        data: [],
        pageSizeOpts: [20,30,40,50],
        columns: [
          {
            title: '会员账号',
            key: 'userName',
            align: 'center'
          },
          {
            title: '账号类型',
            key: 'agencyLevel',
            align: 'center'
          },
          {
            title: "姓名",
            key: 'realName',
            align: 'center',
            render: (h,params) => <span>{this.$root.text(params.row.realName)}</span>
          },
          {
            title: '余额',
            key: "balance",
            align: 'center',
            sortable: 'custom',
            render: (h,params) => <span>{this.$root.keepTwo(params.row.balance)}</span>
          },
          {
            title: '存款总额',
            align: 'center',
            key: 'depositAmount',
            sortable: 'custom',
            render: (h,params) => {
              let { depositAmount } = params.row
              return <span>{this.$root.keepTwo(depositAmount)}</span>
            }
          },
          {
            title: '存款笔数',
            align: 'center',
            key: 'depositCount',
            render: (h,params) => {
              let { depositCount } = params.row
              return <span>{depositCount}</span>
            }
          },
          {
            title: '取款总额',
            align: 'center',
            key: 'withdrawalsAmount',
            sortable: 'custom',
            render: (h,params) => {
              let { withdrawalsAmount} = params.row
              return <span>{withdrawalsAmount}</span>
            }
          },
          {
            title: '取款笔数',
            align: 'center',
            key: 'withdrawalsCount',
            render: (h,params) => {
              let { withdrawalsCount } = params.row
              return <span>{withdrawalsCount}</span>
            }
          },
          {
            title: '现金利润',
            key: 'profit',
            sortable: 'custom',
            align: 'center',
          	render: (h, params) => {
								let color =
									params.row.profit > 0 ? "#FF2626" : "rgb(35, 153, 97)";
								return (
									<span style={{ color }}>
										{params.row.profit}
									</span>
								);
							}
          },
          {
            title: '注册时间',
            key: 'created_at',
            align: 'center',
            render: (h,params) => {
              let { created_at } = params.row
              if (created_at > 0) {
                return <span>{this.$root.unixTime(created_at)}</span>
              } else {
                return <span>{created_at}</span>
              }
            }
          }
        ]
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let { startTime, endTime } = vm.$route.query
    vm.searchKey.startTime = startTime
    vm.searchKey.endTime = endTime
    vm.Time = [ startTime, endTime ]
    if (checkDayBtn(vm.Time, 'cn', vm)) vm.changeBtn(checkDayBtn(vm.Time, 'cn', vm))
    else vm.getData({ params: vm.searchKey })
    })
  },
  methods: {
    startChange(time, type) {
      this.btnName = checkDayBtn(this.Time, 'cn', this)
    },
    changeBtn(name) {
      if (this.page != 1) this.$refs.table.setPage()
      this.btnName = name;
      this.searchKey.startTime = name == '今天' ? this.$root.todayStartTime() : (name == '昨天' ? this.$root.yesterdayStartTime() : (name == '本月' ? this.$root.monthDayStartTime() : (name == '上月' ? this.$root.lastMonthDayStartTime() : this.$root.totalDataStartTime())))
      this.searchKey.endTime = name == '今天' ? this.$root.todayEndTime() : (name == '昨天' ? this.$root.yesterdayEndTime() : (name == '本月' ? this.$root.monthDayEndTime() : (name == '上月' ? this.$root.lastMonthDayEndTime() : this.$root.totalDataEndTime())))
      if (this.searchKey.sortKey) delete this.searchKey.sortKey
      if (this.searchKey.sortVal) delete this.searchKey.sortVal
      this.table.columns.forEach(item => {
        if (item.sortable == 'custom') this.$set(item, 'sortType', '')
      })
      this.Time[0] = this.searchKey.startTime
      this.Time[1] = this.searchKey.endTime
      this.getData({params: this.searchKey})
    },
    getData(data) {
      this.$root.startTableLoading()
      domainReportsDetailByUser(data).then(res => {
        if (res.data.data) {
          const { list, total } = res.data.data
          list.length && list.push(this.createData(total))
          this.table.data = list
          this.table.total = res.data.total
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading())
    },
    searchSubmit() {
      if (this.page != 1) this.$set.table.setPage()
      let { sortKey, sortVal } = this.searchKey
      if (sortKey) delete this.searchKey.sortKey
      if (sortVal) delete this.searchKey.sortVal
      this.table.columns.forEach(item => {
					if (item.sortable == 'custom') this.$set(item, "sortType", "")
				});
      let data = { ...this.searchKey,startTime: this.$root.formatTimeS(this.Time[0]),endTime: this.$root.formatnightTimeS(this.Time[1])}
      for(let key in data) {
        if (!data[key]) delete data[key]
      }
      let { startTime, endTime } = data
      if (startTime == 'Invalid date' || endTime =='Invalid date') {
        this.$Tip.info({content: '请输入开始和结束时间！'})
        return false
      }
      this.searchKey.startTime = data.startTime
      this.searchKey.endTime = data.endTime
      this.getData({ params: data })
    },
    createData(total) {
      const {userName,agencyLevel,realName,balance,depositAmount,depositCount,withdrawalsAmount,withdrawalsCount,profit,created_at,maxDeposit} = total
      let item = {
        userName: '总计',
        agencyLevel: '-',
        realName: '-',
        depositAmount,depositCount,
        withdrawalsAmount,withdrawalsCount,
        profit,
        balance,
        created_at: '-',
        maxDeposit: '-'
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
    onPageChange(page) {
      this.page = page
      this.getData({ params: this.searchKey, query: { page }})
    },
    onPageSizeChange(pageSize) {
      this.$refs.table.setPage()
      this.searchKey.limit = pageSize
      this.getData({ params: this.searchKey })
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
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

