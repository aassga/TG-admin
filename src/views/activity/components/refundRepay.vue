<template>
  <div class="v2-table">
    <Tables
      :loading="$root.tableLoading"
      :total="table.total"
      :value="table.data"
      :columns="table.columns"
      :pageSizeOpts="table.pageSizeOpts"
      @on-page-change="onPageChange"
      @on-page-size-change="onPageSizeChange"
    ></Tables>
  </div>
</template>
<script>
import Tables from "_c/tables";
import { repaymentList } from "@/api/activity";
export default {
  components: { Tables },
  data() {
    return {
      searchKey: {},
      table: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 50, 100, 150],
        data: [],
        columns: [
          {
            title: "订单号",
            key: "order_number",
            align: "center",
            minWidth:95,
          },
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth:95,
            tooltip:true,
          },
          {
            title: "抵扣金额",
            key: "return_amount",
            align: "center",
            minWidth:50,
            render: (h, params) => (
              <span class="red-font">{params.row.return_amount}</span>
            )
          },
          {
            title: "剩余欠款",
            key: "undone_amount",
            align: "center",
            minWidth:50,
          },
          {
            title: "备注",
            key: "remark",
            align: "center",
            tooltip: true,
            minWidth:260,
          },
          {
            title: "更新时间",
            key: "review_succes_date",
            align: "center",
            minWidth:130,
            render: (h, params) => <span>{this.$root.unixTime(params.row.review_succes_date)}</span>
          }
        ]
      }
    };
  },
  methods: {
    getData(data) {
      this.searchKey = data.params;
      this.$root.startTableLoading(this);
      repaymentList(data).then(res => {
        if (res != undefined && res.code == 200) {
          let { data, total } = res.data.data;
          this.table.data = data;
          this.table.total = total;
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    onPageChange(page) {
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      // let data = {
      //   ...this.searchKey,
      //   startTime: this.$root.formatTimeS(this.Time[0]),
      //   endTime: this.$root.formatnightTime(this.Time[1])
      // }
      this.getData({ params: this.searchKey, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      //  let data = {
      //   ...this.searchKey,
      //   startTime: this.$root.formatTimeS(this.Time[0]),
      //   endTime: this.$root.formatnightTime(this.Time[1])
      // }
      this.getData({ params: this.searchKey });
    }
  }
};
</script>

