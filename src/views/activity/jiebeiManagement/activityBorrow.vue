<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="借款状态">
          <Select class="s-86" v-model="searchKey.status">
            <Option value="0">待审核</Option>
            <Option value="1">成功</Option>
            <Option value="2">失败</Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker
            type="date"
            placeholder="开始日期"
            class="s-140"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            type="date"
            placeholder="结束日期"
            class="s-140"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Select v-model="searchKey.typeTag" class="s-120">
            <Option value="userName">会员账号</Option>
            <Option value="reslName">真实姓名</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input
            v-if="searchKey.typeTag == 'userName'"
            @keyup.enter.native="searchSubmit"
            placeholder="请输入会员账号"
            class="s-140"
            v-model="searchKey.userName"
          />
          <Input
            v-else
            placeholder="请输入真实姓名"
            class="s-140"
            v-model="searchKey.zh_name"
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
        :loading="$root.tableLoading"
        :columns="this.searchKey.status != 0 ? table.columns : table.columns1"
        :value="table.data"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></Tables>
    </div>
    <!--借款审核-->
    <Modals ref="review" title="借款审核" :width="900">
      <div slot="content">
        <p class="ft14 ml301 mt20">
          <span class="pr10">会员账号：</span>
          <span>{{ reviewInfo.userName }}</span>
        </p>
        <p class="ft14 ml301 mt20">
          <span class="pr10">可借总额：</span>
          <span>{{ reviewInfo.total_amount }}</span>
        </p>
        <p class="ft14 ml301 mt20">
          <span class="pr10">借款金额：</span>
          <span class="red-font">{{ reviewInfo.borrow_amount }}</span>
        </p>
        <p class="ft14 ml301 mt20">
          <span class="pr10">操作类型：</span>
          <RadioGroup v-model="reviewInfo.type">
            <Radio label="success">通过</Radio>
            <Radio label="fail" class="ml5">拒绝</Radio>
          </RadioGroup>
        </p>
        <p class="ft14 ml301 mt20">
          <span class="pr10">备注信息：</span>
          <Input
            type="textarea"
            v-model="reviewInfo.remark"
            placeholder="此栏位仅供管理者记录其他咨询，会员无法检视"
            :rows="4"
            class="b w260x mt10 mb20"
          />
        </p>
        <Tables
          class="ml20 mr20"
          :columns="modeTable.columns"
          :value="modeTable.data"
          :page="false"
        ></Tables>
        <Button
          type="primary"
          class="w260x ml301 h50x ft20 mb20"
          @click="borrowCheck"
          >确定</Button
        >
      </div>
    </Modals>
  </div>
</template>
<script>
import { loanList, checkLoan, cancelCheckLoan } from "@/api/activity";
import Tables from "_c/tables";
import Icons from "_c/icons";
import Modals from "_c/modals";
export default {
  name: "activityBorrow",
  components: {
    Icons,
    Tables,
    Modals,
  },
  data() {
    return {
      //借款审核信息
      reviewInfo: {},
      searchKey: {
        siteId: this.$root.nowSite.id,
        startTime: this.$root.yesterdayStartTime(),
        endTime: this.$root.formatnightTimeS(),
        typeTag: "userName",
        status: "0",
      },
      Time: [this.$root.yesterdayStartTime(), new Date()],
      modeTable: {
        data: [],
        columns: [
          {
            title: "存款总额",
            key: "totalPay",
            align: "center",
            minWidth: 65,
            tooltip: true,
          },
          {
            title: "取款总额",
            key: "withdrawTotal",
            align: "center",
            minWidth: 65,
            tooltip: true,
          },
          {
            title: "有效投注",
            key: "totalBet",
            align: "center",
            minWidth: 65,
            tooltip: true,
          },
          {
            title: "会员输赢",
            key: "netAmountTotal",
            align: "center",
            minWidth: 65,
            tooltip: true,
          },
          {
            title: "优惠金额",
            key: "totalDiscount",
            align: "center",
            minWidth: 65,
            tooltip: true,
          },
          {
            title: "优惠占比",
            key: "youhui",
            align: "center",
            minWidth: 65,
            render: (h, params) => <span>{params.row.youhui + "%"}</span>,
          },
          {
            title: "现金利润",
            key: "cashProfit",
            tooltip: true,
            align: "center",
            minWidth: 65,
          },

          // {
          //     title: '现金占比',
          //     key: 'xianjin',
          //     align: 'center',
          //     minWidth: 60,
          //     render:(h,params)=><span>{params.row.xianjin+'%'}</span>
          // },
          {
            title: "利润占比",
            key: "xianjin",
            align: "center",
            minWidth: 60,
            render: (h, params) => <span>{params.row.xianjin + "%"}</span>,
          },
          {
            title: "投注倍数",
            key: "beishu",
            align: "center",
            minWidth: 50,
          },
        ],
      },
      table: {
        total: 0,
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        loading: true,
        columns: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "姓名",
            key: "zh_name",
            align: "center",
            tooltip: true,
            minWidth: 45,
          },
          {
            title: "可借总额",
            key: "total_amount",
            align: "center",
            minWidth: 80,
            renderHeader: (h, params) => {
              return (
                <div>
                  <span>可借总额</span>
                  <div
                    style={{
                      display:
                        this.$root.modeName() != "mode_c" &&
                        this.$root.modeName() != "mode_d_a" &&
                        this.$root.modeName() != "mode_d_b"
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    <Poptip
                      trigger="hover"
                      transfer
                      content="视讯可借额度与电子，棋牌，彩票三者中最高金管家等级的可借额度之和"
                    >
                      <Icons type="bangzhutishi" class="ml5" color="#b3b3b3" />
                    </Poptip>
                  </div>
                </div>
              );
            },
          },
          {
            title: "借款金额",
            key: "borrow_amount",
            align: "center",
            minWidth: 60,
            render: (h, params) => (
              <span class="red-font">{params.row.borrow_amount}</span>
            ),
          },
          {
            title: "已还金额",
            key: "repayment",
            align: "center",
            minWidth: 60,
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth: 45,
            render: (h, params) => {
              let color =
                params.row.status == 0
                  ? "#E2930E"
                  : params.row.status == 1
                  ? "#118C1E"
                  : "#FF0000";
              let text =
                params.row.status == 0
                  ? "待审核"
                  : params.row.status == 1
                  ? "成功"
                  : "失败";
              return <span style={{ color }}>{text}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 45,
            render: (h, params) => {
              if (params.row.status == 0) {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      let {
                        userName,
                        total_amount,
                        borrow_amount,
                        id,
                      } = params.row;
                      this.reviewInfo = {
                        userName,
                        total_amount,
                        borrow_amount,
                        type: "success",
                        id,
                      };
                      this.modalsShow("review", params.row.memberInfo);
                    }}
                  >
                    审核
                  </span>
                );
              } else {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.$Tip.confirm({
                        content: "您确定撤销审核吗？撤销后可重新进行审核！",
                        onOk: () => {
                          this.$Message.config({
                            top: 50,
                            duration: 1,
                          });
                          let data = {
                            siteId: this.$root.nowSite.id,
                            id: params.row.id,
                          };
                          cancelCheckLoan(data, true).then((res) => {
                            if (res != undefined && res.code == 200) {
                              this.$Message.success("撤销审核成功");
                              this.getData({ params: this.searchKey });
                            } else {
                              this.$Message.error("撤销审核失败");
                            }
                          });
                        },
                      });
                    }}
                  >
                    撤销
                  </span>
                );
              }
            },
          },
          {
            title: "备注",
            key: "remark",
            align: "center",
            tooltip: true,
            minWidth: 50,
            render: (h, params) => (
              <span>{this.$root.text(params.row.remark)}</span>
            ),
          },
          {
            title: "提交时间",
            key: "add_date",
            align: "center",
            minWidth: 125,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.add_date)}</span>
            ),
          },
          {
            title: "审核时间",
            key: "review_date",
            align: "center",
            minWidth: 125,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.review_date)}</span>
            ),
          },
          {
            title: "审核者",
            key: "review_username",
            align: "center",
            tooltip: true,
            minWidth: 75,
            render: (h, params) => (
              <span>{this.$root.text(params.row.review_username)}</span>
            ),
          },
        ],
        columns1: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "姓名",
            key: "zh_name",
            align: "center",
            tooltip: true,
            minWidth: 45,
          },
          {
            title: "可借总额",
            key: "total_amount",
            align: "center",
            minWidth: 80,
            renderHeader: (h, params) => {
              return (
                <div>
                  <span>可借总额</span>
                  <div
                    style={{
                      display:
                        this.$root.modeName() != "mode_c" &&
                        this.$root.modeName() != "mode_d_a" &&
                        this.$root.modeName() != "mode_d_b"
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    <Poptip
                      trigger="hover"
                      transfer
                      content="视讯可借额度与电子，棋牌，彩票三者中最高金管家等级的可借额度之和"
                    >
                      <Icons type="bangzhutishi" class="ml5" color="#b3b3b3" />
                    </Poptip>
                  </div>
                </div>
              );
            },
          },
          {
            title: "借款金额",
            key: "borrow_amount",
            align: "center",
            minWidth: 60,
            render: (h, params) => (
              <span class="red-font">{params.row.borrow_amount}</span>
            ),
          },
          {
            title: "已还金额",
            key: "repayment",
            align: "center",
            minWidth: 60,
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth: 45,
            render: (h, params) => {
              let color =
                params.row.status == 0
                  ? "#E2930E"
                  : params.row.status == 1
                  ? "#118C1E"
                  : "#FF0000";
              let text =
                params.row.status == 0
                  ? "待审核"
                  : params.row.status == 1
                  ? "成功"
                  : "失败";
              return <span style={{ color }}>{text}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 45,
            render: (h, params) => {
              if (params.row.status == 0) {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      let {
                        userName,
                        total_amount,
                        borrow_amount,
                        id,
                      } = params.row;
                      this.reviewInfo = {
                        userName,
                        total_amount,
                        borrow_amount,
                        type: "success",
                        id,
                      };
                      this.modalsShow("review", params.row.memberInfo);
                    }}
                  >
                    审核
                  </span>
                );
              } else {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.$Tip.confirm({
                        content: "您确定撤销审核吗？撤销后可重新进行审核！",
                        onOk: () => {
                          this.$Message.config({
                            top: 50,
                            duration: 1,
                          });
                          let data = {
                            siteId: this.$root.nowSite.id,
                            id: params.row.id,
                          };
                          cancelCheckLoan(data, true).then((res) => {
                            if (res != undefined && res.code == 200) {
                              this.$Message.success("撤销审核成功");
                              this.getData({ params: this.searchKey });
                            } else {
                              this.$Message.error("撤销审核失败");
                            }
                          });
                        },
                      });
                    }}
                  >
                    撤销
                  </span>
                );
              }
            },
          },
          {
            title: "提交时间",
            key: "add_date",
            align: "center",
            minWidth: 125,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.add_date)}</span>
            ),
          },
          {
            title: "审核时间",
            key: "review_date",
            align: "center",
            minWidth: 125,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.review_date)}</span>
            ),
          },
          {
            title: "审核者",
            key: "review_username",
            align: "center",
            tooltip: true,
            minWidth: 75,
            render: (h, params) => (
              <span>{this.$root.text(params.row.review_username)}</span>
            ),
          },
        ],
      },
    };
  },
  mounted() {
    let data = { ...this.searchKey };
    this.getData({ params: data });
  },
  methods: {
    getData(data) {
      this.$root.startTableLoading(this);
      loanList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            let { data, total } = res.data.data;
            this.table.data = data;
            this.table.total = total;
            this.table.data.map((t) => {
              t.new_amount_json = JSON.parse(t.new_amount_json);
            });
            if (res.data.newAmountShow) {
              let columnsTitles = [];
              res.data.newAmountShow.forEach((t) => {
                if (t.name == "捕鱼可借额度") {
                  t.name = "捕鱼可借";
                } else if (t.name == "彩票可借额度") {
                  t.name = "彩票可借";
                } else if (t.name == "电子可借额度") {
                  t.name = "电子可借";
                } else if (t.name == "棋牌可借额度") {
                  t.name = "棋牌可借";
                } else if (t.name == "视讯可借额度") {
                  t.name = "视讯可借";
                } else if (t.name == "电子/视讯可借额度") {
                  t.name = "电子/视讯可借";
                }
                let obj = {
                  title: t.name,
                  key: "new_amount_json",
                  align: "center",
                  minWidth: 75,
                  render: (h, params) => (
                    <span>
                      {params.row.new_amount_json[t.key][0] +
                        "/等级" +
                        params.row.new_amount_json[t.key][1]}
                    </span>
                  ),
                  //render: (h, params) => <span>{params.row.new_amount_json[t.key]?params.row.new_amount_json[t.key]:'-'}</span>
                };
                this.table.columns.map((t) => {
                  columnsTitles.push(t.title);
                });
                if (!columnsTitles.includes(obj.title))
                  this.table.columns.splice(2, 0, obj);
              });
            }
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    searchSubmit() {
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
      };
      this.searchKey.startTime = data.startTime;
      this.searchKey.endTime = data.endTime;
      if (data.typeTag == "userName") {
        if (data.zh_name) delete data.zh_name;
        let reg = /^[0-9a-zA-Z_-]{5,20}$/;
        if (data.userName) data.userName = this.$root.trimAll(data.userName);
        if (data.userName && !reg.test(data.userName)) {
          this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
          return false;
        }
      }
      let { startTime, endTime } = data;
      if (startTime == "Invalid date" || endTime == "Invalid date") {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }
      if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        this.$Tip.info({ content: "结束时间必须大于开始时间" });
        return false;
      }
      if (data.startTime == "Invalid date") delete data.startTime;
      if (data.endTime == "Invalid date") delete data.endTime;
      if (data.typeTag == "reslName") {
        if (data.userName) delete data.userName;
        if (data.zh_name) data.zh_name = this.$root.trimAll(data.zh_name);
      }
      delete data.typeTag;
      this.getData({ params: data });
    },
    onPageChange(page) {
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
      };
      if (data.typeTag == "userName") {
        if (data.zh_name) delete data.zh_name;
        let reg = /^[0-9a-zA-Z_-]{5,20}$/;
        if (data.userName) data.userName = this.$root.trimAll(data.userName);
        if (data.userName && !reg.test(data.userName)) {
          this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
          return false;
        }
      }
      if (data.startTime == "Invalid date") delete data.startTime;
      if (data.endTime == "Invalid date") delete data.endTime;
      if (data.typeTag == "reslName") {
        if (data.userName) delete data.userName;
        if (data.zh_name) data.zh_name = this.$root.trimAll(data.zh_name);
      }
      delete data.typeTag;
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
      };
      if (data.typeTag == "userName") {
        if (data.zh_name) delete data.zh_name;
        let reg = /^[0-9a-zA-Z_-]{5,20}$/;
        if (data.userName) data.userName = this.$root.trimAll(data.userName);
        if (data.userName && !reg.test(data.userName)) {
          this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
          return false;
        }
      }
      if (data.startTime == "Invalid date") delete data.startTime;
      if (data.endTime == "Invalid date") delete data.endTime;
      if (data.typeTag == "reslName") {
        if (data.userName) delete data.userName;
        if (data.zh_name) data.zh_name = this.$root.trimAll(data.zh_name);
      }
      delete data.typeTag;
      this.getData({ params: data });
    },
    //弹框出现
    modalsShow(name, data) {
      if (data != "[]") {
        this.modeTable.data = [JSON.parse(data)];
      } else {
        this.modeTable.data = [
          {
            totalPay: "0.00",
            totalBet: "0.00",
            withdrawTotal: "0.00",
            netAmountTotal: "0.00",
            cashProfit: "0.00",
            totalDiscount: "0.00",
            xianjin: "0.00",
            youhui: "0.00",
            beishu: "0.00",
            cashRate: "0.00",
          },
        ];
      }

      this.$refs[name].show();
    },
    //借款审核
    borrowCheck() {
      this.$refs.review.spinShow();
      this.$Message.config({
        top: 50,
        duration: 1,
      });
      let { id, type, remark } = this.reviewInfo;
      let data = {
        id,
        siteId: this.$root.nowSite.id,
        status: type == "success" ? 1 : 2,
        remark,
      };
      checkLoan(data, true)
        .then((res) => {
          this.$refs.review.spinHide();
          if (res != undefined && res.code == 200) {
            this.$refs.review.hide();
            this.$Message.success("借款审核成功");
            this.getData({ params: this.searchKey });
          } else {
            this.$Message.error("借款审核失败");
          }
          this.searchSubmit();
        })
        .catch((error) => {
          this.$refs.review.spinHide();
        });
    },
  },
};
</script>
<style lang="less" scoped>
.b {
  display: block;
}
/deep/.ivu-table {
  letter-spacing: 0 !important;
}
</style>

