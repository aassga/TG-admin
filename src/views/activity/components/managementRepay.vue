<template>
  <div class="v2-table">
    <Tables
      :loading="$root.tableLoading"
      :total="table.total"
      :value="table.data"
      :columns="table.columns"
      :pageSizeOpts='table.pageSizeOpts'
      @on-page-change='onPageChange'
      @on-page-size-change='onPageSizeChange'
    ></Tables>
  </div>
</template>
<script>
import Tables from "_c/tables";
import { repaymentList } from "@/api/activity";
export default {
  components: {Tables},
  data() {
    return {
      searchKey: {},
      table: {
        total: 0,
        loading: true,
        data: [],
        pageSizeOpts:[20,50,100,150],
        columns: [
          {
            title: '订单号',
            key: 'order_number',
            align: 'center',
            minWidth:95,
          },
          {
            title: '会员账号',
            key: 'userName',
            align: 'center',
            minWidth:95,
          },
          {
            title: '视讯等级',
            key: 'shixun_level',
            align: 'center',
            minWidth:55,
          },
          {
            title: '电子等级',
            key: 'dianzi_level',
            align: 'center',
            minWidth:55,
          },
          {
            title: '棋牌等级',
            key: 'qipai_level',
            align: 'center',
            minWidth:55,
          },
          {
            title: '彩票等级',
            key: 'caipiao_level',
            align: 'center',
            minWidth:55,
          },
          {
            title: '总晋级礼金',
            key: 'level_total_money',
            align: 'center',
            minWidth:65,
          },
          {
            title: '总月俸禄',
            key: 'month_total_money',
            align: 'center',
            minWidth:55,
          },
          {
            title: '总周俸禄',
            key: 'week_total_money',
            align: 'center',
            minWidth:55,
          },
          {
            title: '抵扣金额',
            key: 'return_amount',
            align: 'center',
            minWidth:55,
            render: (h,params) => <span class='red-font'>{params.row.return_amount}</span>
          },
          {
            title: '剩余欠款',
            key: 'undone_amount',
            align: 'center',
            minWidth:55,
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center',
            minWidth:screen.width>1600?420:120,
            className:'pr10 pl10',
            tooltip: true
          },
          {
            title: '更新时间',
            key: 'review_succes_date',
            align: 'center',
            minWidth:130,
            render: (h, params) => <span>{this.$root.unixTime(params.row.review_succes_date)}</span>
          }
        ]
      }
    };
  },
  methods: {
    getData(data) {
      this.searchKey = data.params
      this.$root.startTableLoading(this)
      repaymentList(data).then(res => {
        if (res != undefined && res.code == 200) {
          let { data,total } = res.data.data
          this.table.data = data
          this.table.total = total
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading())
    },
    onPageChange(page) {
      for(let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key]
      }
      // let data = {
      //   ...this.searchKey,
      //   startTime: this.$root.formatTimeS(this.Time[0]),
      //   endTime: this.$root.formatnightTime(this.Time[1])
      // }
      this.getData({ params: this.searchKey, query: { page }})
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize
      for(let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key]
      }
      //  let data = {
      //   ...this.searchKey,
      //   startTime: this.$root.formatTimeS(this.Time[0]),
      //   endTime: this.$root.formatnightTime(this.Time[1])
      // }
      this.getData({ params: this.searchKey })
    },
  }
};
</script>

