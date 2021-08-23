<template>
  <div>
    <!-- <div class="v2-search">
      <Form ref="searchkey" inline>
        <FormItem label='会员账号' v-if="$route.query.page != depositCount">
          <Input v-model="searchKey"/>
        </FormItem>
      </Form>
    </div> -->
    <div class="v2-table">
      <Tables
        ref="table"
        :columns='table.columns'
        :value='table.data'
        :total='table.total'
        :pageSizeOpts='table.pageSizeOpts'
        :loading='$root.tableLoading'
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change='sortChange'
      ></Tables>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Tables from '_c/tables';
import { multipleReportsByDepositAmount, multipleReportsByWithdrawalsCount, multipleReportsByDepositCount, multipleReportsByWithdrawalsAmount} from '@/api/report';
export default {
  name: 'complexReportDetail',
  computed: {
    ...mapState({
      withdrawalCount: state => state.info.withdrawalCount, // 取款笔数
      withdrawalDetailList: state => state.info.withdrawalDetailList, //取款详情
      depositCountList: state => state.info.depositCountList, // 存款笔数
      depositDetailList: state => state.info.depositDetailList // 存款详情
    })
  },
  components: {
    Tables
  },
  beforeRouteEnter(tom,from,next) {
    next(vm => {
      let { startTime, endTime, timeType, siteId } = vm.$route.query
      vm.searchKey = { startTime, endTime, timeType, siteId }
      vm.getData({params: vm.searchKey})
    })
  },
  data() {
    return {
      page: 1,
      searchKey: {},
      table: {
        data: [],
        total:0,
        laoding: true,
        pageSizeOpts: [20,30,40,50],
        columns: []
      }
    }
  },
  methods: {
    getData(data) {
      this.$root.startTableLoading()
      const { stage } = this.$route.query
      switch (stage) {
        case 'depositDetail':
          multipleReportsByDepositAmount(data).then(res => {
            if (res != undefined && res.code == 200) {
              let { data, total } = res.data
              this.table.data = data
              this.table.total = total
              this.table.columns = this.depositDetailList
            }
            this.$root.endTableLoading()
          }).catch(error=> this.$root.endTableLoading())
        break;
        case 'depositCount':
          multipleReportsByDepositCount(data).then(res => {
            if (res != undefined && res.code == 200) {
              let { data, total } = res.data
              this.table.data = data
              this.table.total = total
              this.table.columns = this.depositCountList
            }
            this.$root.endTableLoading()
          }).catch(error=> this.$root.endTableLoading())
        break;
        case 'withDetail':
          multipleReportsByWithdrawalsAmount(data).then(res => {
            if (res != undefined && res.code == 200) {
              let { data, total } = res.data
              this.table.data = data
              this.table.total = total
              this.table.columns = this.withdrawalDetailList
            }
            this.$root.endTableLoading()
          }).catch(error=> this.$root.endTableLoading())
        break;
        default:
          multipleReportsByWithdrawalsCount(data).then(res => {
            if (res != undefined && res.code == 200) {
              let { data, total } = res.data
              this.table.data = data
              this.table.total = total
              this.table.columns = this.withdrawalCount
            }
            this.$root.endTableLoading()
          }).catch(error=> this.$root.endTableLoading())
        break;
      }
    },
    onPageChange(page) {
      this.page = page
      this.getData({ params: this.searchKey, query: { page }})
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize
      this.getData({ params: this.searchKey})
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
  }
}
</script>
