<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="业务类型" v-if="tabName == '资金日志'">
          <Select
            clearable
            v-model="searchKey.type"
            class="s-120"
            placeholder="全部"
          >
            <Option
              v-for="item in firstList"
              :key="item.value"
              :value="item.value"
              >{{ item.name }}</Option
            >
          </Select>
          <span v-show="searchKey.type" class="pl5 pr5">-</span>
          <Select
            clearable
            v-model="searchKey.subType"
            placeholder="全部"
            class="s-120"
            v-show="searchKey.type"
          >
            <Option
              v-for="(t, i) in secondList"
              :key="'second' + i"
              :value="t.value"
              v-if="!t.name.includes('hide')"
              >{{ t.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="操作事件" v-if="tabName == '操作日志'">
          <Select
            clearable
            v-model="searchKey.type"
            class="s-120"
            placeholder="全部"
          >
            <Option
              v-for="(val, key, index) in logTypeList"
              :key="'logType' + index"
              :value="key"
              >{{ val }}</Option
            >
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
          <FormItem>
                    <Select  v-if="tabName == '登录日志'" v-model="searchKey.typeTag" class="s-100">
                        <Option value="userName">会员账号</Option>
                        <Option value="agencyName">上级代理</Option>
                        <Option value="ip">登录IP</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input v-if="tabName == '登录日志'" placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" class="s-160" v-model="searchKey.content" clearable />
                </FormItem>
        <FormItem>
        <FormItem label="会员账号" v-if="tabName == '资金日志'||tabName == '操作日志'">
          <Input
            placeholder="多个请以,逗号隔开"
            @keyup.enter.native="searchSubmit"
            v-model="searchKey.userName"
            class="s-160"
          />
        </FormItem>
      
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="search"
            @click.prevent="searchSubmit"
            >查询</Button
          >
        </FormItem>
        <FormItem>
         <Button  v-if="tabName != '资金日志'" :loading="$root.editBtnLoading" class="export" @click.prevent="exportExcel" type="primary">导出Excel</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-search bb">
      <ButtonGroup class="repay-button1" style="margin-bottom: 0.3px">
        <Button
          @click.native="tabClick(t)"
          class="fontColor"
          v-for="(t, i) in btnList"
          :class="tabName == t ? 'active' : ''"
          :key="i"
          >{{ t }}</Button
        >
      </ButtonGroup>
    </div>
    <div class="v2-table">
      <Tables
        ref="tables"
        :columns="
          tabName == '资金日志'
            ? table.columns
            : tabName == '操作日志'
            ? table.columns1
            : table.columns2
        "
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
    </div>
    <Modals ref="Modals" title="历史登录">
      <div slot="content" class="modal ml10 mr10 mb20">
        <Tables
          ref="historyDataTable"
          :columns="historyTable.columns"
          :loading="historyTable.loading"
          :value="historyTable.data"
          :pageSizeOpts="historyTable.pageSizeOpts"
          :total="historyTable.total"
          @on-page-change="onHistoryPageChange"
          :show-sizer="false"
          :page-fix-show="true"
        >
        </Tables>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import Modals from "@/components/modals";
import {
  singleMemberHistory,
  memberFinanceLog,
  memberBetLogType,
  memberLogType,
  memberLoginLog,
  memberHandleLog,
} from "@/api/member";
export default {
  name: "memberFundsLog",
  components: { Tables, Icons, Modals },
  data() {
    return {
      btnList: ["资金日志", "操作日志", "登录日志"],
      logTypeList: {},
      tabName: "资金日志",
      allTypeList: [],
      firstList: [], //一级
      secondList: [], //二级
      Time: [this.$root.startTime(1), this.$root.endTime(1)],
      searchKey: {
        type: "",
        typeTag: 'userName',
        startTime: this.$root.startTime(1),
        endTime: this.$root.endTime(1),
        siteId: this.$root.nowSite.id,
      },
      table: {
        loading: true,
        total: 100,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "业务类型",
            key: "type",
            align: "center",
            minWidth: 60,
          },
          {
            title: "变更类型",
            key: "subType",
            align: "center",
            minWidth: 80,
            render: (h, params) => (
              <span>{this.$root.text(params.row.subType)}</span>
            ),
          },
          {
            title: "变更金额",
            key: "money",
            align: "center",
            minWidth: 60,
            render: (h, params) => (
              <span>{Number(params.row.money).toFixed(2)}</span>
            ),
          },
          {
            title: "变更前余额",
            key: "beforMoney",
            align: "center",
            minWidth: 75,
          },
          {
            title: "变更后余额",
            key: "afterMoney",
            align: "center",
            minWidth: 75,
          },
          {
            title: "变更时间",
            key: "created_at",
            align: "center",
            minWidth: 130,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.created_at)}</span>
            ),
          },
          {
            title: "审核者",
            key: "created_by",
            align: "center",
            minWidth: 95,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.text(params.row.created_by)}</span>
            ),
          },
          {
            title: "备注",
            key: "remarks",
            align: "center",
            minWidth: 250,
            tooltip: true,
            className: "pl20 pr20",
          },
        ],
        columns1: [
          {
            title: "会员账号",
            key: "username",
            align: "center",
            minWidth: 70,
            tooltip: true,
          },
          {
            title: "IP",
            key: "ip",
            align: "center",
            minWidth: 90,
          },
          {
            title: "域名",
            key: "domain",
            align: "center",
            minWidth: 90,
            render: (h, params) => {
              return <span>{this.$root.text(params.row.domain)}</span>;
            },
          },
          {
            title: "操作时间",
            key: "created_at",
            align: "center",
            minWidth: 160,
            className: "pl15 pr15",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.created_at)}</span>;
            },
          },
          {
            title: "操作事件",
            key: "typeName",
            align: "center",
            minWidth: 60,
            tooltip: true,
            // render: (h, params) => <span style="color:red">{params.row.typeName ? params.row.typeName : '其他'}</span>
          },
          {
            title: "操作日志",
            key: "content",
            align: "center",
            tooltip: true,
            minWidth: 480,
            className: "pr20 pl20",
          },
        ],
        columns2: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "上级代理",
            key: "agencyName",
            align: "center",
            minWidth: 95,
            tooltip: true,
            render: (h, params) => (
              <span>{this.$root.text(params.row.agencyName)}</span>
            ),
          },
          {
            title: "登录设备",
            key: "device",
            align: "center",
            minWidth: 60,
            render: (h, params) => {
              let { device } = params.row;
              return (
                <span>
                  {this.$root.text(
                    params.row.device == "ANDROID"
                      ? "Android"
                      : params.row.device
                  )}
                </span>
              );
            },
          },
          {
            title: "登录域名",
            key: "domain",
            align: "center",
            minWidth: 140,
          },
          {
            title: "登录IP",
            key: "ip",
            align: "center",
            minWidth: 90,
          },
          {
            title: "归属地",
            key: "location",
            align: "center",
            minWidth: 120,
          },
          {
            title: "登录时间",
            key: "created_at",
            align: "center",
            minWidth: 160,
            className: "pr15,pl15",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.created_at)}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 70,
            render: (h, params) => {
              return (
                <a
                  class="blue-font"
                  onClick={(e) => {
                    this.loginHistory(params);
                  }}
                >
                  历史登录
                </a>
              );
            },
          },
        ],
        data: [],
      },
      historyTable: {
        pageSizeOpts: [10],
        total: 0,
        loading: true,
        columns: [
          {
            title: "登录设备",
            key: "device",
            align: "center",
            render: (h, params) => {
              let { device } = params.row;
              return (
                <span>
                  {this.$root.text(
                    params.row.device == "android"
                      ? "Android"
                      : device.toUpperCase()
                  )}
                </span>
              );
            },
          },
          {
            title: "登录域名",
            key: "domain",
            align: "center",
          },
          {
            title: "登录IP",
            key: "ip",
            align: "center",
          },
          {
            title: "归属地",
            key: "location",
            align: "center",
          },
          {
            title: "登录时间",
            key: "created_at",
            align: "center",
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.created_at)}</span>
            ),
          },
        ],
        data: [],
      },
    };
  },
  watch: {
    "searchKey.type"(val) {
      if (val || val != undefined) {
        this.secondList = [];
        delete this.searchKey.subType;
        this.allTypeList.forEach((t) => {
          if (t.name_en == val) {
            for (let key in t.list) {
              if (this.$root.modeName() == "mode_c") {
                //if (key == 'directCommission' || key == 'rankCommission') {
                this.secondList.push({ name: t.list[key], value: key });
                // }
              } else {
                if (key != "directCommission" && key != "rankCommission") {
                  this.secondList.push({ name: t.list[key], value: key });
                }
              }
            }
          }
        });
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === "memberSearchFunds") vm.$store.commit("closeTag", from);
    });
  },
  mounted() {
    this.getAllList();
    let params={...this.searchKey}
    this.getData({ params }, "money");
    memberLogType({ siteId: this.$root.nowSite.id }).then((res) => {
      if (res != undefined && res.code == 200) {
        this.logTypeList = res.data;
        console.log(this.logTypeList);
      }
    });
  },
  methods: {
      loginHistory(params) {
            this.historyTable.loading = true;
            const data = {
                siteId: this.$root.nowSite.id,
                uid: params.row.uid,
                limit: 10
            };
            this.historyData = { ...data };
            singleMemberHistory({ params: data }).then(res => {
                const { data, total } = res.data;
                this.historyTable.data = data;
                this.historyTable.total = total;
                this.historyTable.loading = false;
            });
            //修正再次打开模态框时候页码不更新
            this.$refs.historyDataTable.setPage();
            this.$refs.Modals.show();
        },
    tabClick(t) {
      this.tabName = t;
      let params = { ...this.searchKey };
      if (this.tabName == "资金日志") {
        this.getData({ params }, "money");
      } else if (this.tabName == "操作日志") {
        this.getData({ params }, "handle");
      } else if (this.tabName == "登录日志") {
        this.getData({ params }, "login");
      }
    },
    // 资金日志下拉
    getAllList() {
      memberBetLogType({ siteId: this.$root.nowSite.id }).then((res) => {
        if (res != undefined && res.code == 200) {
          res.data.forEach((t) => {
            if (t.name_en == "commission") {
              for (let key in t.list) {
                if (key == "AgencyWage" || key == "AgencyShareOutBonus") {
                  if (this.$root.modeName() == "mode_c")
                    t.list[key] = t.list[key].includes("hide")
                      ? ""
                      : t.list[key] + ":hide";
                }
                // if (key == 'AgencyCommissionSelf') t.list[key] = this.$root.modeName() == 'mode_c' ? '自身返佣' : '自身返佣'
                // if (key == 'AgencyCommissionUp') t.list[key] = this.$root.modeName() == 'mode_c' ? '下级返佣' : '下级返佣'
              }
            }
          });
          this.allTypeList = res.data;
          this.allTypeList.forEach((t) => {
            this.firstList.push({ name: t.name_cn, value: t.name_en });
          });
        }
      });
    },
    getData(data, type) {
      let dataParams = data.params;
      for (let key in dataParams) {
        if (!dataParams[key]) delete dataParams[key];
      }
      if (type == "money") {
        this.$root.startTableLoading();
        if (!data.params.userName) delete data.params.userName;
        if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
        if (data.params.type == "all") delete data.params.type;
        data.params.startTime = this.$root.formatTimeS(dataParams.startTime);
        data.params.endTime = this.$root.formatnightTimeS(dataParams.endTime);
        memberFinanceLog(data)
          .then((res) => {
            if (res != undefined && res.code == 200) {
              const { data, total } = res.data;
              this.table.loading = false;
              this.table.data = data;
              this.table.total = total;
            }
            this.$root.endTableLoading();
          })
          .catch((err) => this.$root.endTableLoading());
      } else if (type == "handle") {
        this.$root.startTableLoading();
        memberHandleLog(data)
          .then((res) => {
            if (res != undefined && res.code == 200) {
              const { data, total } = res.data;
              this.table.data = data;
              this.table.total = total;
              this.table.loading = false;
            }
            this.$root.endTableLoading();
          })
          .catch((err) => {
            this.$root.endTableLoading();
          });
      } else if (type == "login") {
        this.$root.startTableLoading();
         if (!data.params.content) {
                delete data.params.typeTag;
            }
            if (!data.params.typeTag) {
                delete data.params.content;
            }
        memberLoginLog(data)
          .then((res) => {
            if (res != undefined && res.code == 200) {
              const { data, total } = res.data;
              this.table.data = data;
              this.table.total = total;
              this.table.loading = false;
            }
            this.$root.endTableLoading();
          })
          .catch((err) => this.$root.endTableLoading());
      }
    },
    searchSubmit() {
      let { type, subType } = this.searchKey;
      if (!type || type == undefined) delete this.searchKey.subType;
      let params = { ...this.searchKey };
      params.siteId = this.$root.nowSite.id;
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        this.searchKey.startTime = params.startTime =
          startTime && this.$root.formatTimeS(startTime);
        this.searchKey.endTime = params.endTime =
          endTime && this.$root.formatnightTimeS(endTime);
      } else {
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
      if (this.tabName == "资金日志") {
        this.getData({ params }, "money");
      } else if (this.tabName == "操作日志") {
        this.getData({ params }, "handle");
      } else {
          console.log(params.typeTag)
          console.log(params.content)
        if (!params.content) delete params.typeTag;
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.typeTag != 'ip' && !this.$root.validateName(params.content)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            if (params.typeTag == 'ip' && !this.$root.checkIp(params.content)) {
                this.$Tip.info({ content: '您所查询的ip不正确,请重新输入' });
                return false;
            }
        this.getData({ params }, "login");
      }

      this.$refs.tables.setPage();
    },
    onHistoryPageChange(page) {
      this.historyTable.loading = true;
      const data = { params: { ...this.historyData }, query: { page } };
      singleMemberHistory(data).then((res) => {
        const { data, total } = res.data;
        this.historyTable.data = data;
        this.historyTable.total = total;
        this.historyTable.loading = false;
      });
    },
    exportExcel() {
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      data.isExport = 1;
      let openr = window.open();
      if(this.tabName == "操作日志"){
                  memberHandleLog({ params: data }, true).then((res) => {
        if (res != undefined && res.code == 200) {
          console.log(res);
          let region = res.data.downloadUrl.split(".com")[1];
          let openr1 = openr ? openr : window;
          openr1.location.href = region;
        } else {
          openr.close();
        }
      });

      }
      if(this.tabName=='登录日志'){
           memberLoginLog({ params: data }, true).then((res) => {
        if (res != undefined && res.code == 200) {
          console.log(res);
          let region = res.data.downloadUrl.split(".com")[1];
          let openr1 = openr ? openr : window;
          openr1.location.href = region;
        } else {
          openr.close();
        }
      });
      }
     
    },
    onPageChange(page) {
      const params = {
        ...this.searchKey,
        limit: this.pageSize,
        siteId: this.$root.nowSite.id,
      };
      if (this.tabName == "资金日志") {
        this.getData({ params,query: { page }  }, "money");
      } else if (this.tabName == "操作日志") {
        this.getData({ params,query: { page } }, "handle");
      } else if (this.tabName == "登录日志") {
        this.getData({ params,query: { page } }, "login");
      }
    },
    onPageSizeChange(pageSize) {
      const params = {
        ...this.searchKey,
        limit: pageSize,
        siteId: this.$root.nowSite.id,
      };
      if (this.tabName == "资金日志") {
        this.getData({ params, }, "money",);
      } else if (this.tabName == "操作日志") {
        this.getData({ params }, "handle");
      } else if (this.tabName == "登录日志") {
        this.getData({ params }, "login");
      }
      this.pageSize = pageSize;
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
.activeClass {
  background-color: #2d8cf0;
  color: #fff;
}
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
</style>
