<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="应用名称">
          <Select
            clearable
            filterable
            placeholder="全部"
            class="w120x"
            clerable
            v-model="searchKey.app_name"
          >
            <Option :value="t" v-for="(t, i) in appUseList" :key="i">{{
              t
            }}</Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker
            type="date"
            placeholder="开始日期"
            class="s-120"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            type="date"
            placeholder="结束日期"
            class="s-120"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <FormItem label="会员账号">
          <Input
            v-model="searchKey.username"
            placeholder="请输入会员账号"
            class="w120x"
          />
        </FormItem>
        <FormItem label="代理账号">
          <Input
            v-model="searchKey.agencyName"
            placeholder="请输入代理账号"
            class="w120x"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="search"
            :loading="$root.tableLoading"
            @click.prevent="searchSubmit"
            >查询</Button
          >
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="tables"
        :columns="table.columns"
        :loading="table.loading"
        :value="table.data"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import {
  appExchangeCodeReceivedRecord,
  appExchangeCodeName,
} from "@/api/activity";
export default {
  components: { Tables },
  data() {
    return {
      appUseList: [],
      searchKey: {
        siteId: this.$root.nowSite.id,
        username: "",
        agencyName: "",
        app_name: "",
        startTime: "",
        endTime: "",
      },
      Time: [this.$root.startTime(), this.$root.midnight()],
      table: {
        pageSizeOpts: [20, 30, 40, 50],
        total: 0,
        loading: false,
        data: [],
        columns: [
          {
            title: "会员账号",
            key: "username",
            align: "center",
            tooltip: true,
          },
          {
            title: "上级代理",
            key: "agencyName",
            align: "center",
          },
          {
            title: "应用名称",
            key: "app_name",
            align: "center",
          },
          {
            title: "存款金额",
            key: "deposit_amount",
            align: "center",
          },
          {
            title: "兑换码",
            key: "code",
            align: "center",
          },
          {
             title: "类型",
             key: "type",
            align: "center",     
          },
          {
            title: "领取时间",
            key: "created_at",
            align: "center",
            render:(h,params)=>{
              return(
                <span>{this.$root.newUnixTime(params.row.created_at)}</span>
              )
            }
          },
        ],
      },
    };
  },
  mounted() {
     let data = { ...this.searchKey };
    for (let key in data) {
      if (!data[key]) delete data[key];
    }
  
    if(this.$route.query.userName){
      const {appName,userName}=this.$route.query;
      this.searchKey.agencyName=userName;
      this.searchKey.app_name=appName;
    }else{
     this.getUseList(data);
    }
   
   
    this.getData({ params: data });
  },
  methods: {
    getUseList(data) {
      appExchangeCodeName(data).then((res) => {
        this.appUseList = res.data;
      });
    },
    getData(data) {
      this.$root.startTableLoading();
      appExchangeCodeReceivedRecord(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total } = res.data;
            this.table.data =data;
            this.table.total = total;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    searchSubmit() {
      let data = { ...this.searchKey };

      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        data.startTime = startTime && this.$root.formatTime(startTime);
        data.endTime = endTime && this.$root.formatTime(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = data.startTime;
      this.searchKey.endTime = data.endTime;
      for (let key in data) {
        if (!data[key]) delete data[key];
      }

      if (data.username) data.username = this.$root.trimAll(data.username);
      if (!this.$root.validateName(data.username)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.getData({ params: data });
    },
    onPageChange(page) {
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      let data = { ...this.searchKey, limit: pageSize };
      for (let key in data) {
        if (!data[key]) delete data[key];
        this.getData({ params: data });
      }
    },
  },
};
</script>