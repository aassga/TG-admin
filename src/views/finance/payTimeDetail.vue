<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <div :class="$route.query.from != 'complex' ? 'w140x h34 bd dayColor' : 'w240x h34 bd dayColor'" style="line-height:34px">
            <Icon type="ios-calendar-outline" :size="18" class="ml10 f-color" style="margin-top:-8px" />
            <span class="ml5" v-if="$route.query.from != 'complex'">{{$route.query.newTime}}</span>
						<span v-else class="pl5">{{`${$route.query.startTime}  ~  ${$route.query.endTime}`}}</span>
          </div>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        editable
        ref="table"
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        :pageSizeOpts="table.pageSizeOpts"
        @on-sort-change="sortChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import { accessAuditTotalDetail } from "@/api/finance";
import Icons from "@/components/icons";
import Tables from "@/components/tables";
export default {
  name: "payTimeDetail",
  components: {
    Tables,
    Icons
  },
  data() {
    return {
      searchKey: {
        siteId: this.$root.nowSite.id
      },
      Time: [this.$route.query.newTime, this.$route.query.newTime],
      page: "",
      pageSize: "",
      table: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        data: [],
        time: "",
        columns: [
          {
            title: "管理员账号",
            key: "admin_username",
            align: "center",
            render: (h, params) => {
              return <span>{this.$root.text(params.row.admin_username)}</span>;
            }
          },
          {
            title: "管理员别称",
            key: "admin_othername",
            align: "center",
            minWidth: 65,
            render: (h, params) => {
              return (
                <span>
                  {params.row.admin_othername
                    ? params.row.admin_othername
                    : "-"}
                </span>
              );
            }
          },
          {
            title: "存款审核金额",
            key: "deposit_audit_money",
            align: "center",
            minWidth: 55,
            sortable: "custom"
          },
          {
            title: "存款审核笔数",
            key: "deposit_audit_count",
            align: "center",
            minWidth: 55,
            sortable: "custom"
          },
          {
            title: "平均存款审核时间",
            key: "deposit_mean_time",
            align: "center",
            minWidth: 55,
            sortable: "custom",
            render: (h, params) => {
              return (
                <span
                  onClick={() => {
                    let newSearchKey = {
                      time: this.time,
                      userName: params.row.admin_username
                    };
                    this.$router.push({
                      name: "payCompany",
                      params: { newSearchKey }
                    });
                  }}
                  class="blue-font"
                >
                  {this.$root.hoursTime(params.row.deposit_mean_time)}
                </span>
              );
            }
          },
          {
            title: "取款审核金额",
            key: "withdw_audit_money",
            align: "center",
            minWidth: 55,
            sortable: "custom"
          },
          {
            title: "取款审核笔数",
            key: "withdw_audit_count",
            align: "center",
            minWidth: 55,
            sortable: "custom"
          },
          {
            title: "平均取款审核时间",
            key: "withdw_mean_time",
            align: "center",
            minWidth: 55,
            sortable: "custom",
            render: (h, params) => {
              return (
                <span
                  onClick={() => {
                    let timeSearchKey = {
                      time: this.time,
                      userName: params.row.admin_username
                    };
                    this.$router.push({
                      name: "withdrawalsOnline",
                      params: { timeSearchKey }
                    });
                  }}
                  class="blue-font"
                >
                  {this.$root.hoursTime(params.row.withdw_mean_time)}
                </span>
              );
            }
          }
        ]
      }
    };
  },
  // 跳转源不同 显示不同
  mounted() {
    let data = {};
    const { from, startTime, endTime } = this.$route.query;
    if (from == "complex") {
      this.time = [startTime, endTime];
      data = {
        startTime,
        endTime,
        siteId: this.$root.nowSite.id
      };
    } else {
      this.time = this.$route.query.newTime;
      data = {
        startTime: this.time,
        endTime: this.time,
        siteId: this.$root.nowSite.id
      };
    }
    this.getData({ params: data });
  },
  methods: {
    getData(data) {
      this.$root.startTableLoading();
      accessAuditTotalDetail(data).then(res => {
        this.table.total = res.data.total;
        this.table.data = res.data.data;
        this.$root.endTableLoading();
      });
    },
    sortChange({ column, key, order }) {
      delete this.searchKey.sortKey;
      delete this.searchKey.sortVal;
      const { from } = this.$route.query
      let data = {
        sortKey: key,
        sortVal: order,
        ...this.searchKey,
        startTime: from == 'complex' ? this.time[0] : this.time,
        endTime: from == 'complex' ? this.time[1] : this.time,
        siteId: this.$root.nowSite.id
      };
      this.searchKey.sortKey = key;
      if (data.sortVal == "normal") {
        this.table.columns.forEach(item => {
          if (item.key == column.key) this.$set(item, "sortType", "asc");
        });
        this.searchKey.sortVal = "asc";
        data.sortVal = "asc";
      } else {
        this.table.columns.forEach(item => {
          delete item.sortType;
        });
        this.searchKey.sortVal = order;
      }
      this.page == 1 ? "" : this.$refs.table.setPage();
      this.page == 1
        ? this.getData({ params: data })
        : this.getData({ params: data, query: { page: 1 } });
    },
    //导出的功能
    exportExcel() {},
    onPageSizeChange(pageSize) {
      const { from } = this.$route.query
      let params = {
        ...this.searchKey,
        limit: pageSize,
        startTime: from == 'complex' ? this.time[0] : this.time,
        endTime: from == 'complex' ? this.time[1] : this.time,
        siteId: this.$root.nowSite.id
      };
      this.getData({ params: params });
      this.pageSize = pageSize;
    },
    onPageChange(page) {
      const { from } = this.$route.query
      this.page = page;
      let params = {
        ...this.searchKey,
        startTime: from == 'complex' ? this.time[0] : this.time,
        endTime: from == 'complex' ? this.time[1] : this.time,
        siteId: this.$root.nowSite.id,
        limit: this.pageSize
      };
      this.getData({ params, query: { page } });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.ivu-input[disabled] {
  background-color: #fff !important;
  color: #808080 !important;
}
</style>
