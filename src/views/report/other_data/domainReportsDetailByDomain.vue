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
          <Button type='primary' :loading="$root.tableLoading" class="ivu-btn search" @click="searchSubmit">查询</Button>
        </FormItem>
      </Form>
      <div class="fr">
        <span class='font-bold ft16 pr10'>域名：</span>
        <span class="pr10">{{$route.query.domain}}</span>
      </div>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
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
import { domainReportsDetailByDomain } from '@/api/report';
import { checkDayBtn } from '@/libs/util';
export default {
  // name: 'domainReportsDetailByDomain',
  components: {Tables},
  data() {
    return{
      page: 1,
      btnList: ['最近7天','本月','上月'],
      btnName: '',
      Time: [this.$root.fromNow(7),this.$root.startTime()],
      searchKey: {
        startTime: this.$root.weekDayStartTime(),
        endTime: this.$root.weekDayEndTime(),
        siteId: this.$root.nowSite.id,
        domain: this.$route.query.domain
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
            title: '日期',
            key: 'data_date',
            align: 'center',
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
            title: "访问人数",
            key: "accessIpNum",
            align: 'center',
            sortable: 'custom'
          },
          {
            title: '注册人数',
            key: "registerNum",
            align: 'center',
            sortable: 'custom'
          },
          {
            title: "登录人数",
            key: "loginIpNum",
            align: 'center',
            sortable: 'custom'
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
      vm.Time = [startTime, endTime]
      if (checkDayBtn(vm.Time, 'cn', vm)) {
        if (checkDayBtn(vm.Time, 'cn', vm) == '总数据' || checkDayBtn(vm.Time, 'cn', vm) == '今天' || checkDayBtn(vm.Time, 'cn', vm) == '昨天') {
          vm.getData({ params: vm.searchKey})
          vm.btnName = ''
        }
        else vm.changeBtn(checkDayBtn(vm.Time, 'cn', vm))
      }
      else vm.getData({ params: vm.searchKey })
      })
  },
  methods: {
    startChange(time, type) {
      this.btnName = checkDayBtn(this.Time, 'cn', this) == '今天' ? '本月' : checkDayBtn(this.Time, 'cn', this)
    },
    changeBtn(name) {
      if (this.page != 1) this.$refs.table.setPage()
      this.btnName = name
      this.searchKey.startTime = name == '最近7天' ? this.$root.weekDayStartTime() : (name == '本月' ? this.$root.monthDayStartTime() : this.$root.lastMonthDayStartTime())
      this.searchKey.endTime = name == '最近7天' ? this.$root.weekDayEndTime() : (name == '本月' ? this.$root.monthDayEndTime() : this.$root.lastMonthDayEndTime())
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
      domainReportsDetailByDomain(data).then(res => {
        if (res.data.data) {
          const { list, total } = res.data.data
          list.length && list.push(this.createTotalData(total))
          this.table.data = list
          this.table.total = res.data.total
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading())
    },
    createTotalData(total) {
      const { data_date, accessIpNum, registerNum, loginIpNum, domain } = total
      let item = {
        data_date: '总计',
        accessIpNum,
        registerNum,
        loginIpNum,
        domain
      }
      return item
    },
    searchSubmit() {
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
      if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        this.$Tip.info({ content: '结束时间必须大于开始时间'})
        return false
      }
      this.searchKey.startTime = data.startTime
      this.searchKey.endTime = data.endTime
      this.getData({ params: data })
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
