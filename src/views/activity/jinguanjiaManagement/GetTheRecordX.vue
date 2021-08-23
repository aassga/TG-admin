<template>
  <div v-if="selects.length">
    <div class="v2-search">
      <Form ref="searchKey" inline class="pb10">
        <FormItem label="金管家类型">
          <Select v-model="searchKey.classId" class="w120x">
            <Option
              v-for="(item, i) in selects"
              :key="'level' + i"
              :value="item.id"
              v-if="item.id != 0"
              >{{ item.class_name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="金管家等级">
          <Select
            v-model="searchKey.level"
            class="s-86"
            clearable
            placeholder="全部"
          >
            <Option
              v-for="(item, i) in levelList"
              :key="'level' + i"
              :value="item.value"
              >{{ item.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="领取状态">
          <Select
            v-model="searchKey.status"
            class="s-86"
            placeholder="全部"
            clearable
          >
            <Option value="no">未领取</Option>
            <Option value="yes">已领取</Option>
          </Select>
        </FormItem>
        <FormItem label="开始时间">
          <DatePicker
            type="date"
            placeholder="开始日期"
            class="s-120"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
          <DatePicker
            type="date"
            placeholder="结束日期"
            class="s-120"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <Select
          class="w110x mr20"
          v-if="searchKey.type == 'invite_gift'"
          v-model="searchKey.contentType"
        >
          <Option value="invite_userName">邀请账号</Option>
          <Option value="userName">好友账号</Option>
        </Select>
        <FormItem :label="searchKey.type == 'invite_gift' ? '' : '会员账号'">
          <Input
            placeholder="多个请以,逗号隔开"
            @keyup.enter.native="searchSubmit"
            class="s-160"
            clearable
            v-model="searchKey.userName"
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
    <div class="v2-search bb">
      <span
        v-for="item in modeBtns"
        class="modeBtns ib cs ft16"
        @click="changeType(item)"
        :class="searchKey.type == item.type ? 'active' : ''"
        :key="item.type"
        >{{ item.name }}</span
      >
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :value="table.data"
        :columns="table.columns"
        :total="table.total"
        :showSummary="false"
        :loading="$root.tableLoading"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        :class="reward ? 'table-box' : ''"
      >
      </Tables>
    </div>
  </div>
</template>
<script>
import { jinGuanJiaClassList, jinGuanJiaGiftMoneyRecord } from "@/api/activity";
import Tables from "_c/tables";
import Icons from "_c/icons";
export default {
  name: "GetTheRecord",
  components: {
    Icons,
    Tables,
  },
  data() {
    return {
      Time: [this.$root.startTime(1), this.$root.endTime(1)],
      totalList: [],
      selects: [], //模式导航按钮
      levelList: [], //等级列表
      modeBtns: [
        { type: "level_gift", name: "晋级礼金" },
        { type: "week_gift", name: "周俸禄" },
        { type: "month_gift", name: "月俸禄" },
        { type: "invite_gift", name: "邀请礼金" },
        { type: "invite_week_gift", name: "邀请周俸禄" },
        { type: "invite_month_gift", name: "邀请月俸禄" },
        { type: "invite_fenhong_gift", name: "邀请分红" },
      ],
      searchKey: {
        siteId: this.$root.nowSite.id,
        classId: "",
        status: "",
        level: "",
        userName: "",
        type: "level_gift",
        limit: 20,
        start_date: "",
        end_date: "",
        contentType: "invite_userName",
      },
      reward: false,
      table: {
        pageSizeOpts: [20, 30, 40, 50],
        total: 0,
        data: [],
        columns: [],
      },
      columns: [
        {
          title: "会员账号",
          key: "userName",
          align: "center",
          minWidth: 100,
          tooltip: true,
        },
        {
          title: "金管家等级",
          key: "level",
          align: "center",
          minWidth: 80,
        },
        {
          title: "累积打码",
          key: "bet_money",
          align: "center",
          minWidth: 100,
          className: "pl10 pr10",
          render: (h, params) => {
            return <span>{Number(params.row.bet_money).toFixed(2)}</span>;
          },
        },
        {
          title: "周俸禄",
          key: "gift_money",
          align: "center",
          minWidth: 100,
          className: "pl10 pr10",
          render: (h, params) => {
            return <span>{Number(params.row.gift_money).toFixed(2)}</span>;
          },
        },
        {
          title: "月俸禄",
          key: "gift_money",
          align: "center",
          minWidth: 100,
          className: "pl10 pr10",
          render: (h, params) => {
            return <span>{Number(params.row.gift_money).toFixed(2)}</span>;
          },
        },
        // {
        //   title: "当周存款",
        //   key: "payTotal",
        //   align: "center",
        //   minWidth: 100,
        //   className: "pl10 pr10",
        //   render: (h, params) => {
        //     return (
        //       <span>
        //         {Number(params.row.gift_money_requirement.payTotal).toFixed(2)}
        //       </span>
        //     );
        //   },
        // },
        {
          title: "当周打码",
          key: "betTotal",
          align: "center",
          minWidth: 100,
          className: "pl10 pr10",
          render: (h, params) => {
            return (
              <span>
                {Number(params.row.gift_money_requirement.betTotal).toFixed(2)}
              </span>
            );
          },
        },
        // {
        //   title: "当月存款",
        //   key: "payTotal",
        //   align: "center",
        //   className: "pl10 pr10",
        //   minWidth: 100,
        //   render: (h, params) => {
        //     return (
        //       <span>
        //         {Number(params.row.gift_money_requirement.payTotal).toFixed(2)}
        //       </span>
        //     );
        //   },
        // },
        {
          title: "当月打码",
          key: "betTotal",
          align: "center",
          className: "pl10 pr10",
          minWidth: 100,
          render: (h, params) => {
            return (
              <span>
                {Number(params.row.gift_money_requirement.betTotal).toFixed(2)}
              </span>
            );
          },
        },
        // {
        //   title: "存款次数",
        //   key: "payCount",
        //   align: "center",
        //   className: "pl10 pr10",
        //   minWidth: 100,
        //   render: (h, params) => {
        //     return <span>{params.row.gift_money_requirement.payCount}</span>;
        //   },
        // },
        {
          title: "状态",
          key: "gift_money_receive",
          align: "center",
          className: "pl10 pr10",
          minWidth: 80,
          render: (h, params) => {
            let color =
              params.row.userName == "总计"
                ? "#666"
                : params.row.gift_money_receive == "yes"
                ? "red"
                : "#4FC3F7";
            return (
              <span style={{ color }}>
                {params.row.gift_money_receive == "yes"
                  ? "已领取"
                  : params.row.userName == "总计"
                  ? "-"
                  : "未领取"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          key: "created_at",
          align: "center",
          className: "pl5 pr5",
          minWidth: 130,
          render: (h, params) => {
            return (
              <span>
                {params.row.userName == "总计"
                  ? "-"
                  : this.$root.newUnixTime(params.row.created_at)}
              </span>
            );
          },
        },
        {
          title: "领取时间",
          key: "gift_money_receive_time",
          align: "center",
          className: "pl5 pr5",
          minWidth: 130,
          render: (h, params) => {
            return (
              <span>
                {params.row.userName == "总计"
                  ? "-"
                  : this.$root.newUnixTime(params.row.gift_money_receive_time)}
              </span>
            );
          },
        },
      ],
      columns2: [
        {
          title: " ",
          align: "center",
          children: [
            {
              title: "邀请账号",
              key: "invite_userName",
              align: "center",
              minWidth: 100,
              tooltip: true,
            },
          ],
        },

        {
          title: "好友数据",
          key: "gift_money_requirement",
          align: "center",
          children: [
            {
              title: "好友账号",
              key: "userName",
              align: "center",
              tooltip: true,
              className: "pl10 pr10",
              minWidth: 100,
            },
            {
              title: "金管家等级",
              key: "level",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
            },
            {
              title: "累计打码",
              key: "bet_money",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
            },
            {
              title: "",
              key: "",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
              renderHeader: (h, params) => {
                let title =
                  this.searchKey.type == "invite_gift"
                    ? "晋级礼金"
                    : this.searchKey.type == "invite_week_gift"
                    ? "周俸禄"
                    : this.searchKey.type == "invite_month_gift"
                    ? "月俸禄"
                    : "现金利润";
                return <span>{title}</span>;
              },
              render: (h, params) => {
                if (this.searchKey.type == "invite_gift")
                  return <span>{params.row.invite_gift_money}</span>;
                if (this.searchKey.type == "invite_week_gift")
                  return <span>{params.row.invite_week_gift_money}</span>;
                if (this.searchKey.type == "invite_month_gift")
                  return <span>{params.row.invite_month_gift_money}</span>;
                if (this.searchKey.type == "invite_fenhong_gift")
                  return <span>{params.row.xianjinlirun}</span>;
              },
            },
            {
              title: "礼金占比",
              key: "invite_gift_money_percentage",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
              render: (h, params) => {
                return (
                  <span>
                    {params.row.invite_userName == "总计"
                      ? "-"
                      : params.row.gift_money_requirement
                          .invite_gift_money_percentage + "%"}
                  </span>
                );
              },
            },
          ],
        },
        {
          title: "邀请者晋级礼金奖励",
          key: "gift_money_requirement",
          align: "center",
          renderHeader: (h, params) => {
            let title =
              this.searchKey.type == "invite_gift"
                ? "邀请礼金"
                : this.searchKey.type == "invite_week_gift"
                ? "邀请周俸禄"
                : this.searchKey.type == "invite_month_gift"
                ? "邀请月俸禄"
                : "邀请分红";
            return <span>{title}</span>;
          },
          children: [
            {
              title: "奖励金额",
              key: "invite_gift_money",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
              render: (h, params) => {
                return (
                  <span>
                    {params.row.gift_money_requirement.invite_gift_money}
                  </span>
                );
              },
            },
            {
              title: "存款金额",
              key: "get_invite_gift_money_of_member_pay",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
              render: (h, params) => {
                return (
                  <span>
                    {Number(
                      params.row.gift_money_requirement
                        .get_invite_gift_money_of_member_pay
                    ).toFixed(2)}
                  </span>
                );
              },
            },
            {
              title: "打码量",
              key: "get_invite_gift_money_of_member_bet",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
              render: (h, params) => {
                return (
                  <span>
                    {Number(
                      params.row.gift_money_requirement
                        .get_invite_gift_money_of_member_bet
                    ).toFixed(2)}
                  </span>
                );
              },
            },
            {
              title: "邀请人数",
              key: "renshu",
              align: "center",
              className: "pl10 pr10",
              minWidth: 100,
              render: (h, params) => {
                return (
                  <span>
                    {Number(params.row.gift_money_requirement.renshu)}
                  </span>
                );
              },
            },
          ],
        },
        {
          title: " ",
          align: "center",
          children: [
            {
              title: "状态",
              key: "gift_money_receive",
              align: "center",
              className: "pl10 pr10",
              minWidth: 80,
              render: (h, params) => {
                let color =
                  params.row.invite_userName == "总计"
                    ? "#666"
                    : params.row.gift_money_receive == "yes"
                    ? "red"
                    : "#4FC3F7";
                return (
                  <span style={{ color }}>
                    {params.row.invite_userName == "总计"
                      ? "-"
                      : params.row.gift_money_receive == "yes"
                      ? "已领取"
                      : "未领取"}
                  </span>
                );
              },
            },
          ],
        },
        {
          title: " ",
          align: "center",
          children: [
            {
              title: "创建时间",
              key: "created_at",
              align: "center",
              className: "pl5 pr5",
              minWidth: 130,
              render: (h, params) => {
                return (
                  <span>
                    {params.row.invite_userName == "总计"
                      ? "-"
                      : this.$root.newUnixTime(params.row.created_at)}
                  </span>
                );
              },
            },
            {
              title: "领取时间",
              key: "gift_money_receive_time",
              align: "center",
              className: "pl5 pr5",
              minWidth: 130,
              render: (h, params) => {
                return (
                  <span>
                    {params.row.invite_userName == "总计"
                      ? "-"
                      : this.$root.newUnixTime(
                          params.row.gift_money_receive_time
                        )}
                  </span>
                );
              },
            },
          ],
        },
      ],
    };
  },

  created() {
    this.$nextTick(() => {
      for (let i = 0; i < 101; i++) {
        this.levelList.push({ name: i + `级`, value: i });
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      jinGuanJiaClassList({
        siteId: this.$root.nowSite.id,
        type: "classNameList",
      }).then((res) => {
        //获取当前模式
        if (res && res.code == 200) {
          this.selects = res.data;
          if (res.data.length == 0) {
            this.$Tip.info({ content: "当前站点未创建模式" });
            return;
          }
          this.searchKey.classId = this.selects[0].id;
          //this.searchKey.classId = 286;
          this.getData({ ...this.searchKey });
          // this.setColumns(this.searchKey.type);
        }
      });
    });
  },
  methods: {
    changeType(item) {
      this.searchKey.type = item.type;
      if (
        this.searchKey.type == "invite_gift" ||
        this.searchKey.type == "invite_week_gift" ||
        this.searchKey.type == "invite_month_gift" ||
        this.searchKey.type == "invite_fenhong_gift"
      ) {
        this.searchKey.contentType = "invite_userName";
        this.reward = true;
      } else {
        delete this.searchKey.contentType;
        this.reward = false;
      }
      let data = { ...this.searchKey };
      this.getData(data);
    },
    getData(data) {
      this.$root.startTableLoading();
      this.totalList = [];
      for (let key in data) {
        if (!data[key] && data[key] != "0") delete data[key];
      }
      if (!data.userName) {
        delete data.contentType;
      }
      if (data.type != "invite_gift") {
        delete data.contentType;
      }

      data.start_date = this.$root.formatTimeS(this.Time[0]);
      data.end_date = this.$root.formatnightTimeS(this.Time[1]);
      jinGuanJiaGiftMoneyRecord(data)
        .then((res) => {
          if (res && res.code == 200) {
            let list = res.data.data;
            list.length > 0 &&
              list.forEach((t) => {
                this.totalList.push({
                  betTotal: t.betTotal,
                  bet_money: t.bet_money,
                  gift_money: t.gift_money,
                  invite_gift_money: t.invite_gift_money,
                  invite_week_gift_money: t.invite_week_gift_money,
                  invite_week_gift_money: t.invite_week_gift_money,
                  xianjinlirun: t.xianjinlirun,
                  payCount: t.payCount,
                  payTotal: t.payTotal,
                  get_invite_gift_money_of_member_pay:
                    t.get_invite_gift_money_of_member_pay,
                  get_invite_gift_money_of_member_bet:
                    t.get_invite_gift_money_of_member_bet,
                  renshu: t.renshu,
                });
              });
            list.length && list.push(this.createTotalData(res.data.totalList));
            this.table.data = list;
            this.table.total = res.data.total;
            this.setColumns(this.searchKey.type);
            if (this.searchKey.type != "level_gift") {
              this.table.data.map((item) => {
                item.gift_money_requirement = JSON.parse(
                  item.gift_money_requirement
                );
              });
            }
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    createTotalData(total) {
      if (this.searchKey.type == "level_gift") {
        const { bet_money, gift_money } = total;
        let item = {
          userName: "总计",
          level: "-",
          bet_money,
          gift_money,
          gift_money_receive: "-",
          gift_money_receive_time: "-",
          invite_gift_money: "-",
        };
        return item;
      } else if (
        this.searchKey.type == "week_gift" ||
        this.searchKey.type == "month_gift"
      ) {
        const {
          bet_money,
          gift_money,
          betTotal,
          payTotal,
          payCount,
          invite_gift_money,
        } = total;
        let item = {
          userName: "总计",
          level: "-",
          bet_money,
          gift_money,
          gift_money_requirement: {
            payTotal,
            betTotal,
            payCount,
          },
          gift_money_receive: "-",
          gift_money_receive_time: "-",
        };
        item.gift_money_requirement = JSON.stringify(
          item.gift_money_requirement
        );
        return item;
      } else if (
        this.searchKey.type == "invite_gift" ||
        this.searchKey.type == "invite_week_gift" ||
        this.searchKey.type == "invite_month_gift" ||
        this.searchKey.type == "invite_fenhong_gift"
      ) {
        const {
          bet_money,
          gift_money,
          betTotal,
          payTotal,
          payCount,
          invite_gift_money,
          invite_week_gift_money,
          invite_month_gift_money,
          xianjinlirun,
          renshu,
          get_invite_gift_money_of_member_pay,
          get_invite_gift_money_of_member_bet,
        } = total;
        let item = {
          invite_userName: "总计",
          userName: "-",
          level: "-",
          bet_money,
          gift_money,
          invite_gift_money,
          invite_week_gift_money,
          invite_month_gift_money,
          xianjinlirun,
          gift_money_requirement: {
            payTotal,
            betTotal,
            payCount,
            month_gift_percentage: "-",
            invite_gift_money,
            get_invite_gift_money_of_member_pay,
            get_invite_gift_money_of_member_bet,
            renshu,
          },
          gift_money_receive: "-",
          gift_money_receive_time: "-",
        };
        item.gift_money_requirement = JSON.stringify(
          item.gift_money_requirement
        );
        return item;
      }
    },
    setColumns(val) {
      this.searchKey.type = val;
      if (val == "level_gift") {
        this.table.columns = this.columns.filter((item) => {
          // return item.title != '周俸禄' && item.title != '月俸禄' && item.title != '周俸禄达标情况' && item.title != '月俸禄达标情况';
          return (
            item.title != "周俸禄" &&
            item.title != "月俸禄" &&
            item.title != "当周打码" &&
            item.title != "当月打码" &&
            item.title != "当周存款" &&
            item.title != "当月存款" &&
            item.title != "存款次数"
          );
        });
      } else if (val == "week_gift") {
        this.table.columns = this.columns.filter((item) => {
          //return item.title != '晋级礼金' && item.title != '月俸禄' && item.title != '月俸禄达标情况';
          return (
            item.title != "晋级礼金" &&
            item.title != "月俸禄" &&
            item.title != "当月打码" &&
            item.title != "当月存款"
          );
        });
      } else if (val == "month_gift") {
        this.table.columns = this.columns.filter((item) => {
          //return item.title != '晋级礼金' && item.title != '周俸禄' && item.title != '周俸禄达标情况';
          return (
            item.title != "晋级礼金" &&
            item.title != "周俸禄" &&
            item.title != "当周打码" &&
            item.title != "当周存款"
          );
        });
      } else if (
        val == "invite_gift" ||
        val == "invite_week_gift" ||
        val == "invite_month_gift" ||
        val == "invite_fenhong_gift"
      ) {
        this.table.columns = this.columns2;
      }

      // this.getData(this.searchKey);
    },
    searchSubmit() {
      if (this.Time[0] == "") {
        this.$Tip.info({ content: "请选择开始日期" });
        return false;
      }
      if (this.Time[1] == "") {
        this.$Tip.info({ content: "请选择结束日期" });
        return false;
      }
      if (this.$root.validateTime(this.Time)) {
        let params = { ...this.searchKey };
        if (params.userName)
          params.userName = this.$root.trimAll(params.userName);
        if (params.userName && params.userName.length < 5) {
          this.$Tip.success({ content: "会员账号小于5个字符！" });
          return false;
        }
        this.getData(params);
      } else {
        return false;
      }
    },
    onPageChange(page) {
      let data = {
        ...this.searchKey,
        query: { page },
      };
      let dataParams = data.params;
      for (let key in dataParams) {
        if (!dataParams[key]) delete dataParams[key];
      }
      this.getData(data);
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = {
        ...this.searchKey,
        limit: pageSize,
      };
      this.getData(data);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.v2-search {
  .blue-bd {
    background: #2d8cf0;
    color: #fff;
  }
}
.modeBtns {
  border: 0;
  border-radius: 0;
  line-height: 36px;
  height: 36px;
  text-align: center;
  padding: 0 15px;
}
.active {
  border: 1px solid #2d8cf0;
  border-bottom: 0;
  color: #2d8cf0;
  box-sizing: border-box !important;
}
.table-box {
  /deep/.ivu-table-header thead tr:nth-child(1) th {
    height: 37px !important;
    line-height: 37px !important;
    padding: 0;
    .ivu-table-cell span {
      font-size: 1rem;
    }
  }
  /deep/.ivu-table-header thead tr:nth-child(2) th {
    height: 37px !important;
    line-height: 37px !important;
    padding: 0;
    .ivu-table-cell span {
      font-size: 0.9375rem;
    }
  }
}
</style>



