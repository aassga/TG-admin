<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem>
          <Button
            v-for="t in dayList"
            @click.prevent="changeBtn(t)"
            :class="activeBtn==t?'activeClass':''"
            :key="t"
            class="mr20"
          >{{t}}</Button>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker class="w120x" v-model="Time[0]" placeholder="开始日期" @on-change="startChange"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker class="w120x" v-model="Time[1]" placeholder="结束日期" @on-change="startChange"></DatePicker>
        </FormItem>
        <FormItem label="会员账号">
          <Input placeholder="多个请以，逗号隔开" v-model="searchKey.userName" />
        </FormItem>
        <FormItem>
          <Button type="primary"  class="ivu-btn search" :loading="$root.tableLoading" @click="searchSubmit">查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="tables"
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="onSortChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import { loanRepaymentTotalDetails } from "@/api/activity";
import { checkDayBtn } from "@/libs/util";
import { mapMutations,mapActions} from 'vuex';
export default {
  name: "loanRepaymentTotalDetails",
  components: {
    Tables
  },
  data() {
    return {
      searchKey: {
        siteId: this.$root.nowSite.id
      },
      page:1,
      activeBtn: "",
      dayList: ["本月", "上月", "总数据"],
      Time: [this.$route.query.startTime, this.$route.query.endTime],
      table: {
        pageSizeOpts: [20, 30, 40, 50],
        tatal: 0,
        loading: true,
        columns: [
          {
            title: "会员账号",
            align: "center",
            key: "userName",
            sortable: "custom"
          },
          {
            title: "总借款",
            align: "center",
            key: "borrow_amount",
            sortable: "custom"
          },
          {
            title: "总还款",
            align: "center",
            key: "zonghuankuan",
            sortable: "custom"
          },
          {
            title: "总欠款",
            align: "center",
            key: "zongqian",
            sortable: "custom",
            render: (h, params) => {
              return <span>{this.$root.keepTwo(params.row.zongqian)}</span>;
            }
          },
          // {
          //   title: "余额还款",
          //   align: "center",
          //   key: "yueRepaymentTotal",
          //   sortable: "custom"
          // },
          // {
          //   title: "金管家抵扣",
          //   align: "center",
          //   key: "jinguanjiaRepaymentTotal",
          //   sortable: "custom"
          // },
          // {
          //   title: "返水抵扣",
          //   align: "center",
          //   key: "fanshuiRepaymentTotal",
          //   sortable: "custom"
          // }
        ],
        data: []
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.Time[0] = to.query.startTime;
      vm.Time[1] = to.query.endTime;
    });
  },
  created() {
    let data = {
      ...this.searchKey,
      startTime: this.$root.formatTimeX(this.Time[0]),
      endTime: this.$root.formatnightTimeS(this.Time[1])
    };
    this.Time[0] = data.startTime;
    this.Time[1] = data.endTime;
    this.getData({ params: data });
  },
  methods: {
    ...mapMutations(['setActiveMenu','setTagNavList']),
    startChange(time, type) {
      this.activeBtn = checkDayBtn(this.Time, "cn", this);
    },
    changeBtn(name) {
      this.activeBtn = name;
      switch (name) {
        case "本月":
          this.searchKey.startTime = this.$root.monthDayStartTime();
          this.searchKey.endTime = this.$root.monthDayEndTime();
          break;
        case "上月":
          this.searchKey.startTime = this.$root.lastMonthDayStartTime();
          this.searchKey.endTime = this.$root.lastMonthDayEndTime();
          break;
        case "总数据":
          this.searchKey.startTime = this.$root.unixTime(
            new Date("2018-01-01").getTime() / 1000
          );
          this.searchKey.endTime = this.$root.todayEndTime();
          break;
      }
      let data = { ...this.searchKey };
      const { startTime, endTime } = this.searchKey;
      this.Time[0] = startTime;
      this.Time[1] = endTime;
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data })
    },
    getTryData(data) {
      this.$root.startTableLoading();
      loanRepaymentTotalDetails(data)
        .then(res => {
          if (res != undefined && res.code == 200) {
            const { data } = res.data;
            this.table.data = data;
          }
          this.$root.endTableLoading();
        })
        .catch(error => this.$root.endTableLoading());
    },
    onSortChange({ column, key, order }) {
      if (order == "desc") order = "bigToSmall";
      if (order == "asc") order = "smallToBig";
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeX(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
        sortName: key,
        sort: order
      };
      this.searchKey.sortName = key;
      if (data.sort == "normal") {
        this.table.columns.forEach(item => {
          if (item.key == column.key) this.$set(item, "sortType", "asc");
          this.searchKey.sort = "smallToBig";
          data.sort = "smallToBig";
        });
      } else {
        this.searchKey.sort = order;
        this.table.columns.forEach(item => {
          delete item.sortType;
        });
      }
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.page==1?'':this.$refs.tables.setPage();
      this.page == 1
        ? this.getData({ params: data })
        : this.getData({ params: data, query: { page: 1 } });
    },
    getData(data) {
      this.$root.startTableLoading();
      loanRepaymentTotalDetails(data)
        .then(res => {
          if (res.code == 200 && res.code != undefined) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
            this.$root.endTableLoading();
          }
        })
        .catch(error => this.$root.endEditLoading());
    },
    searchSubmit() {
      let params = { ...this.searchKey };
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeX(startTime);
        params.endTime = endTime && this.$root.formatnightTimeS(endTime);
      } else {
        return false;
      }
      const { startTime, endTime } = params;
      if (startTime == "" || endTime == "") {
        this.$Tip.info({ content: "请输入开始时间和结束时间！" });
        return false;
      }
      if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        this.$Tip.info({ content: "结束时间必须大于开始时间！" });
        return false;
      }
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);
      if (!this.$root.validateName(params.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.searchKey.startTime = params.startTime;
      this.searchKey.endTime = params.endTime;
      this.$refs.tables.setPage();
      for (let key in params) {
        if (!params[key]) delete data[params];
      }
      let list = JSON.parse(localStorage.tagNaveList);
      list.forEach(t => {
        if (t.name == "loanRepaymentTotalDetails") {
          t.query.startTime = this.$root.formatTimeX(this.Time[0]);
          t.query.endTime = this.$root.formatTimeX(this.Time[1]);
        }
      });
      this.setTagNavList(list);
      this.getData({ params: params });
    },
    onPageChange(page) {
      this.page=page;
      let params = {
        ...this.searchKey,
        limit: this.pageSize,
        startTime: this.$root.formatTimeX(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1])
      };
      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      this.getData({ params, query: { page } });
    },
    onPageSizeChange(pageSize) {
      let params = {
        ...this.searchKey,
        startTime: this.$root.formatTimeX(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
        limit: pageSize
      };
      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);

      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      this.pageSize = pageSize;
      this.getData({ params });
    }
  }
};
</script>
<style lang="less" scoped>
  @import "../../styles/button.less";
.activeClass {
  background-color: #2d8cf0;
  color: #fff;
}
</style>