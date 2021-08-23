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
          <DatePicker v-model="Time[0]" placeholder="开始日期" @on-change="startChange"></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker v-model="Time[1]" placeholder="结束日期" @on-change="startChange"></DatePicker>
        </FormItem>
        <FormItem label="会员账号">
          <Input placeholder="多个请以，逗号隔开" v-model="searchKey.userName" />
        </FormItem>
        <FormItem>
          <Button type="primary" class="ivu-btn search" :loading="$root.tableLoading" @click="searchSubmit">查询</Button>
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
import { loanRepaymentTotal,loanRepaymentTotalDetails } from "@/api/activity";
import { checkDayBtn } from "@/libs/util";
import { mapMutations,mapActions} from 'vuex';
export default {
  name: "loanRepaymentTotal",
  components: {
    Tables
  },
  data() {
    return {
      searchKey: {
        siteId: this.$root.nowSite.id
      },
      activeBtn: "",
      dayList: ["本月", "上月","总数据"],
      Time: [],
      table: {
        pageSizeOpts: [20, 30, 40, 50],
        tatal: 0,
        loading: true,
        columns:[],
        data: []
      },
      columns: [
          {
            title: "更新时间",
            align: "center",
            key: "add_date",
            render: (h, params) => {
              if (params.row.add_date == "总计") {
                return <span>总计</span>;
              } else {
				return (<span 
					style="color:#2d8cf0"
					class="cs"
					onClick={() => {
						let list = JSON.parse(localStorage.tagNaveList)
								list.forEach(t=>{
									if(t.name=='loanRepaymentTotalDetails'){
										t.query.startTime = this.$root.formatTimeX(params.row.add_date);
										t.query.endTime = this.$root.formatTimeX(params.row.add_date);
									}
								})
							this.setTagNavList(list)
							this.$forceUpdate();
							this.$router.push({path:'/activity/borrow/loanRepaymentTotalDetails',
								query: {
									startTime: this.$root.formatTimeX(params.row.add_date),
									endTime: this.$root.formatnightTimeS(params.row.add_date)
								},});
								
								}
						}
					>{params.row.add_date}</span>)
              }
            }
          },
          {
            title: "会员账号",
            align: "center",
            key: "userName",
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
        ],
    };
  },
  created() {
    let data = {
      ...this.searchKey,
      startTime: this.$root.formatTimeX(this.Time[0]),
      endTime: this.$root.formatnightTimeS(this.Time[1])
    };
    this.Time[0] = data.startTime;
    this.Time[1] = data.endTime;
    this.changeBtn("本月");
  },
  methods: {
	...mapMutations(['setTagNavList']),
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
      this.getData({ params: data });
      
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
      this.getData({ params: data });
    },
    getData(data) {
      this.$root.startTableLoading();
      if(this.activeBtn=='总数据'){
        loanRepaymentTotalDetails(data).then(res => {
          if (res.code == 200 && res.code != undefined) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
            this.table.columns = this.columns.filter(t=>t.key!='add_date')
            this.$root.endTableLoading();
          }
        })
        .catch(error => this.$root.endEditLoading());
      }else{
        loanRepaymentTotal(data)
        .then(res => {
          if (res.code == 200 && res.code != undefined) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
            this.table.columns = this.columns.filter(t=>t.key!='userName')
            this.$root.endTableLoading();
          }
        })
        .catch(error => this.$root.endEditLoading());
      }
      
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
      this.getData({ params: params });
    },
    onPageChange(page) {
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