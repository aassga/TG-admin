<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="会员账号">
          <Input v-model="searchKey.username" class="w120x" placeholder="请输入会员账号" clearable />
        </FormItem>
        <FormItem label="时间">
          <DatePicker type="datetime" placeholder="开始日期" format="yyyy-MM-dd HH:mm:ss" class="s-185" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem>
          <DatePicker type="datetime" placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss" class="s-185" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem label="类型">
          <Select v-model="searchKey.type" class="s-86">
            <Option value="ALL">全部</Option>
            <Option value="IN">转入</Option>
            <Option value="OUT">转出</Option>
            <Option value="FEE">利息</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="search"
            :loading="$root.tableLoading"
            @click.prevent="searchSubmit"
          >查询</Button>
        </FormItem>
      </Form>
    </div>
    <div class="mb20" style="overflow:hidden">
      <div class="w220x fl mr20 b h70" v-for="(t,i) in totalNum" :key="i" style="height:64px;">
        <div class="w35 fl h100 txt-a" style="lineHeight:70px;" >
          <span :style="{background:t.color}" class="ib bd50 h42 txt-a w42x">
          <Icons :type="t.icon" color="white" size="24" />
          </span>
        </div>
        <div class="w65 fr">
          <P class=" pt10 ">{{t.title}}</P>
          <span class=" ib pb10  w100 " style="color:#ff2626">{{t.num}}</span>
        </div>
      </div>
    </div>
    <!-- <Row v-if="spinShow" style="height:300px;line-height:300px">
      <Spin size="large" fix v-if="spinShow">
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div' + t"></div>
        </div>
      </Spin>
    </Row>-->
    <div class="v2-table">
      <Tables
        ref="tables"
        :value="table.data"
        :total="table.total"
        :columns="table.columns"
        :loading="$root.tableLoading"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Icons from "_c/icons";
import Tables from "_c/tables";
import { yuebaoDetail, indexStats } from "@/api/activity";
export default {
  name: "liuShui",
  components: {
    Tables,
    Icons
  },
  data() {
    return {
      totalNum: [],
      page: 1,
      spinShow: true,
      currentMode: [], //当前选中模式
      searchKey: {
        limit: 20,
        username: "",
        siteId: this.$root.nowSite.id,
        type: "ALL",
        startTime: this.$root.formatTimeX(),
        endTime: this.$root.formatnightTimeS()
      },
      Time: [this.$root.formatTimeX(), new Date()],
      table: {
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        loading: true,
        total: 0,
        columns: [
          {
            title: "会员账号",
            align: "center",
            key: "username"
          },
          {
            title: "类型",
            align: "center",
            key: "type",
            className: "pl20 pr20"
          },
          {
            title: "金额",
            align: "center",
            key: "amount"
          },
          {
            title: "时间",
            align: "center",
            key: "created_at",
            render: (h, params) => (
              <span>{this.$root.newUnixTime(params.row.created_at)}</span>
            )
          }
        ]
      }
    };
  },
  mounted() {
    this.getData();
    indexStats({ siteId: this.searchKey.siteId }).then(res => {
      if (res && res.code == 200) {
        this.totalNum = [
          { title: "存款总额",icon:'cunkuanzonge', color:'#91a3ff', num: res.data.total_balance },
          { title: "存款人数",icon:'cunkuanrenshu',color:'#d291ff', num: res.data.total_balance_count },
          { title: "今日转入",icon:'jinrizhuanru',color:'#ffad91', num: res.data.totay_amount_in },
          { title: "今日转出",icon:'jinrizhuanchu',color:'#82db9b', num: res.data.totay_amount_out },
          { title: "今日利息",icon:'jinrilixi',color:'#ff979e', num: res.data.totay_amount_fee }
        ];
      }
    });
  },
  methods: {
    searchSubmit() {
      this.page =1;
      this.getData();
      this.$refs.tables.setPage();
    },
    quxiao() {
      this.getData({
        siteId: this.$root.nowSite.id
      });
      this.isEdit = false;
    },
    delLevel() {
      //删除等级
      this.table.data.pop();
    },
    getData() {
      //获取列表数据
      let data = { ...this.searchKey };
      data.startTime = this.$root.formatTimeS(this.Time[0]);
      data.endTime = this.$root.formatnightTimeS(this.Time[1]);
      if (data.startTime == "Invalid date" || data.endTime == "Invalid date") {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }
      if (
        new Date(data.endTime).getTime() - new Date(data.startTime).getTime() <
        0
      ) {
        this.$Tip.info({ content: "结束时间必须大于开始时间" });
        return false;
      }
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      let reg = /^[0-9A-Za-z-_]{5,20}$/;
      if (data.username) data.username = this.$root.trimAll(data.username);
      if (data.username && !reg.test(data.username)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      data.page = this.page;
      this.$root.startTableLoading();
      yuebaoDetail(data)
        .then(res => {
          if (res && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.$root.endTableLoading();
          } else {
            this.$root.endTableLoading();
          }
        })
        .catch(error => this.$root.endTableLoading());
    },
    onPageChange(page) {
      this.page = page;
      this.getData();
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      this.getData();
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";

.footer {
  border-top: 0;
  line-height: 48px;
}
</style>


