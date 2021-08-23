<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="站点名称"
          ><Button
            v-if="accessSite.length > 1"
            :class="{ cdColor: ids.length == 0 }"
            @click="onAll()"
            class="w160x ib"
            style="font-size: 0.875rem"
            >{{ selectText }}</Button
          ></FormItem
        >
        <FormItem v-for="(t, i) in btnList" :key="i">
          <Button
            @click="changeBtn(t)"
            class="fontColor"
            :class="btnName == t ? 'bd-bg' : 'bg-or'"
          >
            <span>{{ t }}</span>
          </Button>
        </FormItem>
        <FormItem label="统计类型">
          <Select v-model="searchKey.dataType" @on-change="changeDataType">
            <Option value="site">按站点</Option>
            <Option value="date">按日期</Option>
          </Select>
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker
            placeholder="开始日期"
            @on-change="startChange"
            class="s-120"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            placeholder="结束日期"
            @on-change="startChange"
            class="s-120"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="ivu-btn search"
            @click.prevent="searchSubmit"
            >查询</Button
          >
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.editBtnLoading"
            class="ivu-btn export"
            @click.prevent="exportExcel"
            >导出Excel</Button
          >
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        @on-sort-change="sortChange"
        @on-page-change="onPageChange"
        :showSizer="false"
        :page="false"
      ></Tables>
    </div>
    <Modals
      width="900"
      ref="siteSearch"
      title="请选择站点"
      @closeModal="closeModal"
    >
      <div slot="content">
        <SiteSearch ref="searchWord" @getChicked="getChicked"></SiteSearch>
        <Button
          :loading="$root.editBtnLoading"
          @click="onReset"
          style="margin-left: 13%"
          class="mb20 ivu commonSubmit w240x"
          >重置</Button
        >
        <Button
          type="primary"
          :loading="$root.editBtnLoading"
          @click="save"
          class="mb20 ivu commonSubmit w240x"
          style="margin-left: 14%"
          >确认保存</Button
        >
      </div>
    </Modals>
  </div>
</template>
<script>
import SiteSearch from "@/components/site-search";
import { mapState } from "vuex";
import Icons from "@/components/icons";
import { getReportSite, dayReportByDepositType } from "@/api/report";
import { checkDayBtn } from "@/libs/util";
import Tables from "_c/tables";
import { Tooltip } from "view-design";
import Modals from "@/components/modals";
export default {
  name: "dailyCashReport",
  components: { Tables, Icons, SiteSearch, Modals },
  data() {
    return {
      siteType: "", //站点时间，站点名称
      selectText: "全部",
      newList: [],
      ids: [],
      screen: screen.width,
      page: 1,
      btnList: ["今日", "昨日", "本月", "上月"],
      btnName: "今日",
      Time: [],
      list: [],
      depositedTotal: [],
      isSpin: true,
      searchKey: {
        siteId: this.$root.nowSite.id,
        dataType: "site",
      },
      table: {
        loading: true,
        data: [],
        pageSizeOpts: [40],
        total: 0,
        columns: [
          {
            title: "站点名称",
            align: "center",
            key: "siteName",
            minWidth: 110,
            render: (h, params) => {
              return (
                <span
                  class={{
                    "blue-font":
                      params.row.siteName !== "总计" && this.siteType != "date",
                  }}
                  onClick={() => {
                    if (params.row.siteName != "总计") {
                      let newStartTime = this.searchKey.startTime;
                      let newEndTime = this.searchKey.endTime;
                      let newId = params.row.siteId;
                      let newBtName = this.btnName;
                      if (this.siteType != "date") {
                        this.$router.push({
                          name: "dailyCashReport",
                          params: {
                            newStartTime,
                            newEndTime,
                            newId,
                            newBtName,
                          },
                        });
                      }
                    }
                  }}
                >
                  {params.row.siteName
                    ? params.row.siteName
                    : params.row.data_date
                    ? params.row.data_date
                    : "-"}
                </span>
              );
            },
          },
          {
            title: "存款金额",
            align: "center",
            key: "",
            minWidth: 100,
            children: [
              {
                title: "金额",
                align: "center",
                key: "depositAmount",
                sortable: "custom",
                minWidth: 110,
                render: (h, params) => {
                  let {
                    depositAmount,
                    depositCount,
                    depositUserCount,
                    data_date,
                    siteName,
                  } = params.row;

                  if (depositAmount == 0) {
                    return (
                      <span>{depositAmount == 0 ? "-" : depositAmount}</span>
                    );
                  } else {
                    return (
                      <div>
                        <div
                          style={{
                            display:
                              this.siteType == "date" ? "inline-block" : "none",
                          }}
                          class="red-font"
                        >
                          {depositAmount}
                        </div>
                        <div
                          style={{
                            display:
                              this.siteType == "date" ? "none" : "inline-block",
                          }}
                        >
                          <Poptip
                            trigger="hover"
                            placement="right"
                            width="440"
                            popper-class="top-wrap"
                            transfer
                          >
                            <span
                              class="red-font"
                              onMouseenter={(e) => {
                                if (params.row.siteName == "总计") {
                                  return false;
                                } else {
                                  this.depositedSum(params, "depositAmount");
                                }
                              }}
                            >
                              {depositAmount}
                            </span>
                            <div
                              class="tip-box"
                              slot="content"
                              style={{
                                display:
                                  params.row.siteName == "总计" ||
                                  this.list.length == 0
                                    ? "none"
                                    : "block",
                              }}
                            >
                              <div class="title">
                                <span style="width:25%">存款类型</span>
                                <span style="width:25%">存款金额</span>
                                <span style="width:25%">人数</span>
                                <span style="width:25%">笔数</span>
                              </div>
                              <ul>
                                {this.list.map((item) => (
                                  <li>
                                    <span style="width:25%">
                                      {item.depositClassName}
                                    </span>
                                    <span style="width:25%">
                                      {Number(item.depositAmount).toFixed(2)}
                                    </span>
                                    <span style="width:25%">
                                      {item.depositUserCount}
                                    </span>
                                    <span style="width:25%">
                                      {item.depositCount}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div
                                class="footer"
                                style={{
                                  display:
                                    this.depositedTotal == 0 ||
                                    this.list.length == 0
                                      ? "none"
                                      : "block",
                                }}
                              >
                                <span style="width:25%">
                                  {this.depositedTotal.depositClassName}{" "}
                                </span>
                                <span style="width:25%">
                                  {this.depositedTotal.depositAmount}
                                </span>
                                <span style="width:25%">
                                  {this.depositedTotal.depositUserCount}
                                </span>
                                <span style="width:25%">
                                  {this.depositedTotal.depositCount}
                                </span>
                              </div>
                              <Spin
                                fix
                                size="small"
                                style={{
                                  display: this.isSpin ? "block" : "none",
                                }}
                              ></Spin>
                            </div>
                          </Poptip>
                        </div>
                      </div>
                    );
                  }
                },
              },
              {
                title: "人数",
                align: "center",
                key: "depositUserCount",
                minWidth: 60,
                render: (h, params) => {
                  const { data_date } = params.row;

                  if (data_date == "总计")
                    return <span>{params.row.depositUserCount}</span>;
                  else {
                    return <span>{params.row.depositUserCount}</span>;
                  }
                },
              },
            ],
          },
          {
            title: "在线支付",
            align: "center",
            key: "",
            minWidth: 100,
            children: [
              {
                title: "金额",
                align: "center",
                key: "depositAmountOnline",
                sortable: "custom",
                minWidth: 110,
              },
              {
                title: "人数",
                align: "center",
                key: "depositUserOnline",
                minWidth: 60,
              },
            ],
          },
          {
            title: "公司入款",
            align: "center",
            key: "",
            minWidth: 100,
            children: [
              {
                title: "金额",
                align: "center",
                key: "depositAmountOffline",
                sortable: "custom",
                minWidth: 120,
              },
              {
                title: "人数",
                align: "center",
                key: "depositUserOffline",
                minWidth: 60,
                render: (h, params) => {
                  const { data_date } = params.row;
                  if (data_date == "总计")
                    return <span>{params.row.depositUserOffline}</span>;
                  else return <span>{params.row.depositUserOffline}</span>;
                },
              },
            ],
          },

          {
            title: "取款金额",
            align: "center",
            key: "withdrawalsAmount",
            minWidth: 100,
            children: [
              {
                title: "金额",
                align: "center",
                key: "withdrawalsAmount",
                sortable: "custom",
                minWidth: 110,
                render: (h, params) => {
                  const { data_date } = params.row;
                  if (data_date == "总计")
                    return (
                      <span>{Math.floor(params.row.withdrawalsAmount)}</span>
                    );
                  else
                    return (
                      <span>{Math.floor(params.row.withdrawalsAmount)}</span>
                    );
                },
              },
              {
                title: "人数",
                align: "center",
                key: "withdrawalsUserCount",
                minWidth: 60,
                render: (h, params) => {
                  const { data_date } = params.row;
                  if (data_date == "总计")
                    return <span>{params.row.withdrawalsUserCount}</span>;
                  else return <span>{params.row.withdrawalsUserCount}</span>;
                },
              },
            ],
          },
          {
            title: "有效投注",
            align: "center",
            key: "",
            minWidth: 100,
            children: [
              {
                title: "金额",
                key: "validBetAmount",
                align: "center",
                sortable: "custom",
                minWidth: 110,
                render: (h, params) => {
                  //let color = params.row.memberReport > 0 ? ' #FF2626 ' : 'rgb(35, 153, 97)';
                  return <span>{params.row.validBetAmount}</span>;
                },
              },
              {
                title: "倍数",
                align: "center",
                key: "betMultiple",
                sortable: "custom",
                minWidth: 110,
                render: (h, params) => {
                  return <span>{params.row.betMultiple}</span>;
                },
              },
            ],
          },
          {
            title: "优惠金额",
            align: "center",
            key: "",
            minWidth: 100,
            children: [
              {
                title: "金额",
                align: "center",
                key: "giftBonusAmount",
                sortable: "custom",
                minWidth: 120,
              },
              {
                title: "人数",
                align: "center",
                key: "giftBonusUserCount",
                minWidth: 60,
                render: (h, params) => {
                  const { data_date } = params.row;
                  if (data_date == "总计")
                    return <span>{params.row.giftBonusUserCount}</span>;
                  else return <span>{params.row.giftBonusUserCount}</span>;
                },
              },
            ],
          },
          {
            title: "损益报表",
            align: "center",
            key: "",
            minWidth: 100,
            children: [
              {
                title: "网站盈利",
                key: "memberReport",
                align: "center",
                sortable: "custom",
                minWidth: 110,
                render: (h, params) => {
                  return <span>{params.row.memberReport}</span>;
                },
              },
              {
                title: "现金利润",
                align: "center",
                key: "moneyReport",
                sortable: "custom",
                minWidth: 110,
                render: (h, params) => {
                  let color =
                    params.row.moneyReport > 0
                      ? "#FF2626 "
                      : "rgb(35, 153, 97)";
                  return (
                    <div>
                      <div style={{ color }}>
                        {Math.floor(params.row.moneyReport)}
                      </div>
                    </div>
                  );
                },
              },
              {
                title: "占比",
                align: "center",
                key: "cashRatio",
                sortable: "custom",
                minWidth: 60,
                render: (h, params) => {
                  const { data_date, cashRatio } = params.row;
                  return <div>{cashRatio}%</div>;
                },
              },
            ],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      accessSite: (state) => state.user.accessSite,
    }),
  },
  mounted() {
    // 获取默认显示的本月时间
    this.changeBtn("今日");
  },
  methods: {
    changeDataType(val) {
      this.siteType = val;
    },
    closeModal() {
      this.$refs.searchWord.searchWord = "";
    },
    onReset() {
      this.ids = [];
      this.selectText = "全部";
      this.newList.forEach((t) => {
        // t.checked=false;
        this.$set(t, "checked", false);
        t.indeterminate = false;
        t.list.forEach((m) => {
          this.$set(m, "checked", false);
        });
      });
    },
    onAll() {
      this.$refs.siteSearch.show();
      this.$refs.searchWord.allSiteListNew = this.$refs.searchWord.newData;
    },
    depositedSum(params, type) {
      const { siteId } = params.row;
      this.isSpin = true;
      let data = {
        siteId: siteId,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
      };
      dayReportByDepositType(data).then((res) => {
        if (res != undefined && res.code == 200) {
          this.isSpin = false;
          const { total, list } = res.data;
          this.list = list;
          this.depositedTotal = total;
        }
      });
    },
    getChicked(data, type) {
      this.$forceUpdate();
      this.ids = [];
      this.newList = data;
      if (type == "all") {
        this.newList.forEach((t) => {
          if (t.checked == true) {
            t.list.forEach((m) => {
              if (m.checked == true) {
                this.ids.push(m.id);
                this.ids = this.ids.filter(
                  (x, index, self) => self.indexOf(x) === index
                );
              }
            });
          }
        });
      }
      if (type == "one") {
        this.newList.forEach((t) => {
          t.list.forEach((m) => {
            if (m.checked == true) {
              this.ids.push(m.id);
              this.ids = this.ids.filter(
                (x, index, self) => self.indexOf(x) === index
              );
            }
          });
        });
      }
    },
    save() {
      this.$refs.siteSearch.hide();

      if (this.ids.length < 1) {
        this.selectText = "全部";
      } else {
        this.selectText = "已选择" + this.ids.length + "个站点";
      }
      this.$refs.searchWord.searchWord = "";
    },
    startChange(time, type) {
      this.btnName = checkDayBtn(this.Time, "cn", this);
    },
    changeBtn(name) {
      if (this.page != 1) this.$refs.table.setPage();
      this.btnName = name;
      switch (name) {
        case "今日":
          this.searchKey.startTime = this.$root.todayStartTime();
          this.searchKey.endTime = this.$root.todayEndTime();
          break;
        case "昨日":
          this.searchKey.startTime = this.$root.yesterdayStartTime();
          this.searchKey.endTime = this.$root.yesterdayEndTime();
          break;
        case "本月":
          this.searchKey.startTime = this.$root.monthDayStartTime();
          this.searchKey.endTime = this.$root.monthDayEndTime();
          break;
        case "上月":
          this.searchKey.startTime = this.$root.lastMonthDayStartTime();
          this.searchKey.endTime = this.$root.lastMonthDayEndTime();
          break;
      }
      if (this.searchKey.sortKey) delete this.searchKey.sortKey;
      if (this.searchKey.sortVal) delete this.searchKey.sortVal;
      this.table.columns.forEach((item) => {
        if (item.sortable == "custom" || item.sortable == undefined)
          this.$set(item, "sortType", "");
      });
      this.Time[0] = this.searchKey.startTime;
      this.Time[1] = this.searchKey.endTime;
      let data = { ...this.searchKey, siteIds: String(this.ids) };

      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
    },
    getData(data) {
      this.$root.startTableLoading();
      getReportSite(data)
        .then((res) => {
          if (res.code == 200) {
            this.table.data = res.data;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    exportExcel() {
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
        siteIds: String(this.ids),
      };
      for (let key in data) {
        if (!data[key]) delete data[key];
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
      this.searchKey.startTime = data.startTime;
      this.searchKey.endTime = data.endTime;
      data.isExport = 1;
      this.$root.startEditLoading();
      let openr = window.open();
      getReportSite({ params: data },true)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            let region = res.data.downloadUrl;
            let nowHost = region.split(".com")[1];
            let openr1 = openr ? openr : window;
            openr1.location.href = nowHost;
          } else {
            openr.close();
          }
          this.$root.endEditLoading();
        })
        .catch((error) => this.$root.endEditLoading());
    },
    createTotalData(total) {
      const {
        registerUserCount,
        firstDepositUserCount,
        betUserCount,
        giftBonusUserCount,
        agencyBonusUserCount,
        refandAmountUserCount,
        betCount,
        validBetAmount,
        betMultiple,
        refandAmount,
        giftBonusAmount,
        agencyBonusAmount,
        memberReport,
        depositNewAmount,
        depositAmountOnline,
        firstDepositAmount,
        newDepositUserCount,
        memberBonusUserCount,
        depositCountOnline,
        withdrawalUserCount,
        depositAmountOffline,
        depositCountOffline,
        depositAmount,
        depositCount,
        withdrawalsAmount,
        cashRatio,
        withdrawalsCount,
        moneyReport,
        moneyReportRate,
        depositUserOnline,
        depositUserOffline,
        depositUserCount,
        withdrawalsUserCount,
        memberBonusAmount,
      } = total;
      let item = {
        data_date: "总计",
        registerUserCount,
        agencyBonusUserCount,
        betCount,
        validBetAmount,
        refandAmount,
        giftBonusAmount,
        agencyBonusAmount,
        memberReport,
        depositNewAmount,
        firstDepositUserCount,
        firstDepositAmount,
        newDepositUserCount,
        memberBonusUserCount,
        depositUserCount,
        depositCountOnline,
        betUserCount,
        betMultiple,
        withdrawalUserCount,
        depositAmountOnline,
        depositCountOffline,
        depositAmountOffline,
        depositCount,
        depositAmount,
        withdrawalsCount,
        withdrawalsAmount,
        cashRatio,
        moneyReport,
        moneyReportRate,
        memberBonusAmount,
      };
      return item;
    },
    searchSubmit() {
      if (this.page != 1) this.$refs.table.setPage();
      let { sortKey, sortVal } = this.searchKey;
      if (sortKey) delete this.searchKey.sortKey;
      if (sortVal) delete this.searchKey.sortVal;
      this.table.columns.forEach((item) => {
        if (item.sortable == "custom") this.$set(item, "sortType", "");
      });
      let data = {
        ...this.searchKey,
        startTime: this.$root.formatTimeS(this.Time[0]),
        endTime: this.$root.formatnightTimeS(this.Time[1]),
      };
      if (this.siteType == "date") {
        this.table.columns.forEach((t) => {
          if (t.key == "siteName") {
            t.title = "站点日期";
          }
        });
      } else {
        this.table.columns.forEach((t) => {
          if (t.key == "siteName") {
            t.title = "站点名称";
          }
        });
      }

      this.searchKey.startTime = data.startTime;
      this.searchKey.endTime = data.endTime;

      data.siteIds = String(this.ids);
      for (let key in data) {
        if (!data[key]) delete data[key];
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
      this.searchKey.startTime = data.startTime;
      this.searchKey.endTime = data.endTime;
      this.getData({ params: data });
    },
    sortChange({ column, key, order }) {
      delete this.searchKey.sortKey;
      delete this.searchKey.sortVal;
      let data = {
        sortKey: key,
        sortVal: order,
        ...this.searchKey,
      };
      this.searchKey.sortKey = key;

      if (data.sortVal == "normal") {
        this.table.columns.forEach((item) => {
          if (item.key == column.key) this.$set(item, "sortType", "asc");
        });
        this.searchKey.sortVal = "asc";
        data.sortVal = "asc";
      } else {
        this.table.columns.forEach((item) => delete item.sortType);
        this.searchKey.sortVal = order;
      }
      this.page == 1 ? "" : this.$refs.table.setPage();
      this.page == 1
        ? this.getData({ params: data })
        : this.getData({ params: data, query: { page: 1 } });
    },
    onPageChange(page) {
      this.page = page;
      this.getData({ params: this.searchKey, query: { page } });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ivu-form-item-content .ivu-btn .ivu-btn-default span {
  font-size: 0.875rem;
}
/deep/.ivu-form-item {
  .ivu-form-item-label {
    font-size: 0.875rem;
  }
  .ivu-form-item-content {
    .ivu-checkbox-group {
      margin-left: 50px;
      .ivu-checkbox-wrapper {
        margin-right: 20px;
        width: 130px;
        .ivu-checkbox {
          /deep/.ivu-checkbox-inner {
            width: 18px !important;
            height: 18px !important;
            margin-right: 3px;
          }
        }
        .ivu-checkbox-checked .ivu-checkbox-inner:after {
          width: 7px;
          height: 10px;
          position: absolute;
          top: 2px;
          left: 5px;
        }
      }
    }
  }
}
@import "../../../styles/button.less";

@media screen and (min-width: 960px) and (max-width: 1460px) {
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
@media screen and (min-width: 1660px) and (max-width: 2000px) {
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
  /deep/.ivu-table-tbody {
    tr {
      td {
        .ivu-table-cell {
          font-size: 0.8rem !important;
          color: #444 !important;
          height: 44px !important;
          line-height: 44px !important;
        }
      }
    }
  }
}

.bd-bg {
  height: 36px;
  background-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.bg-or {
  height: 36px;
  border: 1px solid #eaeaea;
  &:focus {
    box-shadow: 0 0 0 0;
  }
  &:hover {
    background: #f4f9ff;
    border: 1px solid #2d8cf0;
    color: #2d8cf0;
  }
}
.lhcColor {
  width: 10px;
  height: 10px;
  background: pink;
}
/deep/.ivu-badge-count {
  margin-top: -12px;
}
.demo-badge {
  width: 42px;
  height: 42px;
  background: #eee;
  border-radius: 6px;
  display: inline-block;
}

.test5 {
  height: 0;
  width: 0;
  overflow: hidden;
  font-size: 0;
  line-height: 0;
  border-color: #ff9600 #3366ff transparent transparent;
  border-style: solid solid dashed dashed;
  border-width: 40px 40px 0 0;
}
</style>

