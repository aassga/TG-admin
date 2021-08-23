<template>
  <div>
    <div class="pt10 pb10 f6Color mb20">
      <span class="pl10">当前平台：</span>
      <span class="pl5" style="fontWeight:bold">{{$route.query.platformName}}</span>
    </div>
    <div class="mt10">
      <Tabs type='card' @on-click='tabClick'>
        <TabPane label='按会员' name='按会员'></TabPane>
        <TabPane label='按游戏' name='按游戏'></TabPane>
      </Tabs>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        editable
        :columns="table.columns"
        :loading="$root.tableLoading"
        :total="table.total"
        :value="table.data"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="sortChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from '_c/tables';
import { mapState } from 'vuex';
import { platformReportsDetailBySingle } from '@/api/report';
export default {
  name: 'platformReportsDetailBySingle',
  components: { Tables },
  data() {
    return {
      searchKey: {},
      page: 1,
      currentBtn: '按会员',
      table: {
        data: [],
        loading: true,
        total: 0,
        pageSizeOpts: [20, 30, 40, 50],
        columns: []
      }
    }
  },
  computed: {
    ...mapState({
      gameReportByGame: state => state.info.gameReportByGame,
      gameReportByMember: state => state.info.gameReportByMember
    })
  },
  mounted() {
    const { startTime, endTime, timeType, userName, type, platform } = this.$route.query
    this.searchKey = {
      startTime, endTime, timeType, userName, type, siteId: this.$root.nowSite.id, platform
    }
    let data = {
      startTime, endTime, timeType, userName, type, siteId: this.$root.nowSite.id, platform
    }
    this.getData({ params: data})
  },
  watch: {
    currentBtn: {
      handler(val,oldVal) {
        if (val == '按会员') {
          this.table.columns = this.gameReportByMember
        } else {
          this.table.columns = this.gameReportByGame
        }
      },
      immediate: true
    }
  },
  methods: {
    tabClick(name) {
      this.currentBtn = name
    },
    getData(data) {
      this.$root.startTableLoading()
      platformReportsDetailBySingle(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { list, total } = res.data.data
        list.length && list.push(this.createTotalData(total))
        this.table.data = list
        this.table.total = res.data.total
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading())
    },
    createTotalData(total) {
      const { betCount, betAmount, validBetAmount, netAmount, winRate } = total;
      let item = {
        userName: "总计",
        betCount,
        betAmount,
        validBetAmount,
        netAmount,
        winRate
      };
      return item;
    },
    sortChange({ column, key, order }) {
      delete this.searchKey.sortKey
      delete this.searchKey.sortVal
      let data = {
        sortKey:key,
        sortVal: order,
        ...this.searchKey,
        siteId: this.$root.nowSite.id
      }
      if (data.sortVal == 'normal') {
        delete data.sortKey
        delete data.sortVal
      } else {
        this.searchKey.sortKey = key
        this.searchKey.sortVal = order
      }
      this.page == 1 ? '' : this.$refs.table.setPage()
      this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 }})
    },
    onPageChange(page) {},
    onPageSizeChange(pageSize){}
  }
}
</script>

