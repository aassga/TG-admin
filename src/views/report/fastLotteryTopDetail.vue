<template>
  <div>
    <Form ref="searchKey" class="v2-search" inline>
      <FormItem>
        <Button @click="comeBack">返回</Button>
      </FormItem>
      <FormItem>
        <span class="pr10">站点：</span>
        <span>{{$route.query.siteName}}</span>
      </FormItem>
      <FormItem label="开始日期">
        <DatePicker
          type="datetime"
          :class="screen < 1400 ? 's-175' : 's-185'"
          placeholder="开始日期"
          v-model="Time[0]"
          format="yyyy-MM-dd HH:mm:ss"
          @on-change="timeChange"
        ></DatePicker>
      </FormItem>
      <FormItem label="结束日期">
        <DatePicker
          type="datetime"
          :class="screen < 1400 ? 's-175' : 's-185'"
          placeholder="开始日期"
          v-model="Time[1]"
          format="yyyy-MM-dd HH:mm:ss"
          @on-change="timeChange"
        ></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="searchSubmit">查询</Button>
      </FormItem>
    </Form>
       <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        :pageSizeOpts="table.pageSizeOpts"
      >
        <div slot="footer">
          <div class="clearfix fontColor">
            <p class="fl ml20">
              <span>总计</span>
            </p>
            <p class="fl ml70">
              <span>投注金额</span>
              <span class="pl15 red-font">{{Number(statistics.betAmount).toFixed(2)}}</span>
            </p>
            <p class="fl ml70">
              <span>有效投注</span>
              <span class="pl15 red-font">{{Number(statistics.validBetAmount).toFixed(2)}}</span>
            </p>
            <p class="fl ml70">
              <span>会员输赢</span>
              <span class="pl15 red-font">{{Number(statistics.netAmount).toFixed(2)}}</span>
            </p>
          </div>
        </div>
      </Tables>
    </div>
  </div>
</template>
<script>
import Tables from "_c/tables";
import { getgameRecordsDetailData } from "@/api/report";
import { getUserType } from "@/libs/util";
export default {
  components: {
    Tables
  },
  data() {
    return {
      screen: screen.width,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      Time: [],
      count: 0,
      statistics: {},
      table: {
        total: 0,
        data: [],
        loading: true,
        columns: [
          {
            title: "注单编号",
            key: "billNo",
            align: "center",
            minWidth: screen.width < 1600 ? 80 : 155,
            className: "pl5 pr5"
          },
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            tooltip: true,
            minWidth: 65
          },
          {
            title: "游戏平台",
            key: "lotteryName",
            align: "center",
            minWidth: 75,
            tooltip: true
          },
          {
            title: "期数",
            key: "issue",
            align: "center",
            minWidth: 85
            // render: (h, params) => <span>{this.$root.removeYear(params.row.issue)}</span>
          },
          {
            title: "投注金额",
            key: "betAmount",
            align: "center",
            minWidth: 75,
            render: (h, params) => (
              <span> {Number(params.row.betAmount).toFixed(2)} </span>
            )
          },
          {
            title: "有效投注",
            key: "validBetAmount",
            align: "center",
            minWidth: 60,
            render: (h, params) => (
              <span> {Number(params.row.validBetAmount).toFixed(2)} </span>
            )
          },
          {
            title: "会员输赢",
            key: "netAmount",
            align: "center",
            minWidth: 85,
            render: (h, params) => (
              <span class="red-font">
                {" "}
                {Number(params.row.netAmount).toFixed(2)}{" "}
              </span>
            )
          },
          {
            title: "下注内容",
            key: "betInfo",
            align: "center",
            tooltip: true,
            width: screen.width < 1690 ? 115 : 180,
            className: screen.width < 1690 ? "pl5 pr5" : "pr10 pl10",
            render: (h, params) => {
              let { playwayName, ball, betInfo } = params.row;
              if (
                (playwayName || ball || betInfo) &&
                playwayName.length + ball.length + betInfo.length >= 7 &&
                screen.width < 1690
              ) {
                return (
                  <Tooltip transfer>
                    <p style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">
                      {this.$root.text(playwayName) +
                        "/" +
                        this.$root.text(ball) +
                        "/" +
                        betInfo}
                    </p>
                    <div slot="content">
                      {this.$root.text(playwayName) +
                        "/" +
                        this.$root.text(ball) +
                        "/" +
                        betInfo}
                    </div>
                  </Tooltip>
                );
              } else if (
                (playwayName || ball || betInfo) &&
                playwayName.length + ball.length + betInfo.length > 14 &&
                screen.width >= 1690
              ) {
                return (
                  <Tooltip transfer>
                    <p style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">
                      {this.$root.text(playwayName) +
                        "/" +
                        this.$root.text(ball) +
                        "/" +
                        betInfo}
                    </p>
                    <div slot="content">
                      {this.$root.text(playwayName) +
                        "/" +
                        this.$root.text(ball) +
                        "/" +
                        betInfo}
                    </div>
                  </Tooltip>
                );
              } else {
                return (
                  <Tooltip transfer>
                    <p style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">
                      {this.$root.text(playwayName) +
                        "/" +
                        this.$root.text(ball) +
                        "/" +
                        betInfo}
                    </p>
                    <div slot="content">
                      {this.$root.text(playwayName) +
                        "/" +
                        this.$root.text(ball) +
                        "/" +
                        betInfo}
                    </div>
                  </Tooltip>
                );
              }
            }
          },
          {
            title: "赔率",
            key: "odds",
            align: "center",
            width: 80
          },
          {
            title: "开奖结果",
            key: "result",
            align: "center",
            minWidth: screen.width < 1600 ? 90 : 190,
            className: "pl10 pr10",
            tooltip: true,
            render: (h, params) => (
              <span> {params.row.result ? params.row.result : "-"} </span>
            )
          },
          {
            title: "返点金额",
            key: "fdAmount",
            align: "center",
            minWidth: 60,
            render: (h, params) => (
              <span> {Number(params.row.fdAmount).toFixed(2)} </span>
            )
          },
          {
            title: "开奖状态",
            key: "status",
            align: "center",
            minWidth: 55,
            render: (h, params) => {
              let { status } = params.row;
              let text =
                status === 0
                  ? "未结算"
                  : status === 1
                  ? "赢 "
                  : status === 2
                  ? "输"
                  : status === 3
                  ? "和"
                  : status === 4
                  ? "取消"
                  : "撤销";
              let color =
                status == 0 || status == 1
                  ? "#2D8CF0"
                  : status == 2
                  ? "red"
                  : "";
              return <span style={{ color }}> {text} </span>;
            }
          },
          {
            title: "下注时间/结算时间",
            key: "betTime",
            align: "center",
            minWidth: 120,
            render: (h, params) => (
              <div class="flex-colum">
                <div class="bb mt2">
                  {this.$root.unixTime(params.row.betTime)}
                </div>
                <div>{this.$root.unixTime(params.row.openTime)}</div>
              </div>
            )
          },

        ]
      }
    };
  },
  beforeDestroy() {
    this.count = 0;
  },
  created() {
    const { startTime, endTime, type, platform,userName, siteId} = this.$route.query;
    this.Time=[startTime, endTime];
    let data={startTime, endTime, platform,userName,siteId ,type:'lottery',status:"all"};
    this.getData({ params: data});
  },
  methods: {
    searchSubmit(){
       const { type, platform,userName, siteId} = this.$route.query;
        let data={startTime:this.Time[0],endTime:this.Time[1],siteId ,platform,userName,type:'lottery',status:"all"};
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        data.startTime = startTime && this.$root.formatTimeS(startTime);
        if (this.count == 0) data.endTime = endTime && this.$root.formatnightTimeS(endTime)
        else data.endTime = endTime && this.$root.formatTimeS(endTime);
        } else {
          return false;
        }
     this.getData({params:data});
    },
    //返回
    comeBack(){
      this.$router.push({name:"fastLotteryTop"})
    },
    onPageSizeChange(pageSize){
     const { startTime, endTime, type, platform,userName, siteId} = this.$route.query;
      let data={startTime, endTime, platform,userName,siteId ,type:'lottery',status:"all",limit:pageSize}
      if (this.$root.validateTime(this.Time)) {
        let [ startTime, endTime ]= this.Time
        data.startTime = startTime && this.$root.formatTimeS(startTime)
        data.endTime = endTime && this.$root.formatTimeS(endTime)
      } else return false
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });

    },
    onPageChange(page){
      this.page = page;
      const { startTime, endTime, type, platform,userName, siteId} = this.$route.query;
      let data={startTime, endTime, platform,userName,siteId ,type:'lottery',status:"all"};
       if (this.$root.validateTime(this.Time)) {
        let [ startTime, endTime ] = this.Time
        data.startTime = startTime && this.$root.formatTimeS(startTime)
        data.endTime = endTime && this.$root.formatTimeS(endTime)
      } else return false
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data, query: { page } });
    },
    timeChange(time, type) {
      this.count++;
    },
    getData(data) {
      for (let key in data.params) {
        if (!data.params[key]) delete data.params[key];
      }
      if (data.params.platformName) delete data.params.platformName;
      if (data.params.gameType) delete data.params.gameType;
      this.$root.startTableLoading();
      getgameRecordsDetailData(data)
        .then(res => {
          if (res != undefined && res.code == 200) {
            const { list, total } = res.data.data;
            this.statistics = total;
            this.table.data = list;

            this.table.total = res.data.total;
          }
          this.$root.endTableLoading();
        })
        .catch(error => this.$root.endTableLoading());
    }
  }
};
</script>
<style lang="less" scoped>
@media screen and (min-width: 960px) and (max-width: 1460px) {
  .ib {
    margin-right: 0;
  }
  /deep/.v2-search {
    .ivu-form-item {
      margin-right: 16px !important;
      .ivu-form-item-label {
        margin-right: 4px !important;
      }
    }
  }
}
</style>

