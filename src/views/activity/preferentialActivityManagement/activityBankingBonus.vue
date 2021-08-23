<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="状态">
          <Select class="s-80" v-model="searchKey.status" clearable placeholder="全部">
            <!-- <Option value="all">全部</Option> -->
            <Option value="no">未发放</Option>
            <Option value="yes">已发放</Option>
            <Option value="cancel">已取消</Option>
          </Select>
        </FormItem>
        <FormItem label="会员账号">
          <Input
            class="w190x"
            v-model="searchKey.userName"
            @keyup.enter.native="searchSubmit"
            placeholder="请输入会员账号"
          />
        </FormItem>
        <FormItem label="开始日期">
          <DatePicker
            type="date"
            class="s-140"
            placeholder="开始日期"
            v-model="Time[0]"
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            type="date"
            class="s-140"
            placeholder="结束日期"
            v-model="Time[1]"
          ></DatePicker>
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
        <FormItem>
          <Button
            type="primary"
            class="ivu-btn export"
            @click.prevent="exportExcel"
            :loading="$root.exportBtnLoading"
            >导出Excel</Button
          >
        </FormItem>
        <Button
          v-show="sendTip"
          class="fr"
          type="primary"
          style="height: 36px"
          @click.prevent="clickSend"
          >一键发放</Button
        >
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
        v-if="searchKey.type != 'count'"
        ref="first"
        :columns="table.columns"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
      <Tables
        v-else
        ref="count"
        :columns="table.columns2"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-page-change="onPageChange"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "_c/tables";
import {
  getActivityJiazengList,
  ActivityJiazengDonate,
  ActivityJiazengCancel,
} from "@/api/activity";

export default {
  name: "activityBankingBonus",
  components: {
    Tables,
  },
  data() {
    return {
      searchKey: {
        siteId: this.$root.nowSite.id,
        type: "first",
        status: "no",
      },
      Time: [this.$root.yesterdayStartTime(), this.$root.yesterdayEndTime()],
      isShow: false,
      reward: false,
      sendTip: true,
      modeBtns: [
        { type: "first", name: "首次存款" },
        { type: "count", name: "累计存款天数" },
      ],
      table: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 50, 100, 150],
        data: [],
        columns: [
          {
            title: "会员账号",
            key: "username",
            align: "center",
            minWidth: 95,
          },
          {
            title: "首次存款",
            key: "first_deposit_amount",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "优惠比列",
            key: "bonus_rate",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "优惠金额",
            key: "bonus_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总存款",
            key: "deposit_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总取款",
            key: "withdrawals_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总輸贏",
            key: "net_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总打碼",
            key: "bet_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总打碼倍數",
            key: "bet_multiple",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth: 35,
            render: (h, params) => {
              let status =
                params.row.status == "no"
                  ? "未发放"
                  : params.row.status == "yes"
                  ? "已发放"
                  : "已取消";
              let color =
                params.row.status == "no"
                  ? "#FF2626"
                  : params.row.status == "yes"
                  ? "#2D8cF0"
                  : "#239961";
              return <span style={{ color }}>{status}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 90,
            render: (h, params) => {
              return (
                <div>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status == "no" ? "inline-block" : "none",
                      color: params.row.status !== "no" ? "red" : "",
                    }}
                    onClick={() => {
                      this.cancelStatus(params, "nosend");
                    }}
                  >
                    取消发放
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status == "no" ? "inline-block" : "none",
                    }}
                    onClick={() => {
                      this.changeStatus(params, "send");
                    }}
                  >
                    发放
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status == "cancel" ||
                        params.row.status == "yes"
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    －
                  </span>
                </div>
              );
            },
          },
        ],
        columns2: [
          {
            title: "会员账号",
            key: "username",
            align: "center",
            minWidth: 95,
          },
          {
            title: "累积存款天数",
            key: "day",
            align: "center",
            minWidth: 40,
          },
          {
            title: "达标首笔存款",
            key: "first_deposit_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "优惠比列",
            key: "bonus_rate",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "优惠金额",
            key: "bonus_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总存款",
            key: "deposit_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总取款",
            key: "withdrawals_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总輸贏",
            key: "net_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总打碼",
            key: "bet_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "总打碼倍數",
            key: "bet_multiple",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth: 35,
            render: (h, params) => {
              let status =
                params.row.status == "no"
                  ? "未发放"
                  : params.row.status == "yes"
                  ? "已发放"
                  : "已取消";
              let color =
                params.row.status == "no"
                  ? "#FF2626"
                  : params.row.status == "yes"
                  ? "#2D8cF0"
                  : "#239961";
              return <span style={{ color }}>{status}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 90,
            render: (h, params) => {
              return (
                <div>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status == "no" ? "inline-block" : "none",
                      color: params.row.status !== "no" ? "red" : "",
                    }}
                    onClick={() => {
                      this.cancelStatus(params, "nosend");
                    }}
                  >
                    取消发放
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status == "no" ? "inline-block" : "none",
                    }}
                    onClick={() => {
                      this.changeStatus(params, "send");
                    }}
                  >
                    发放
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status == "cancel" ||
                        params.row.status == "yes"
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    －
                  </span>
                </div>
              );
            },
          },
        ],
      },
    };
  },
  created() {
    let params = this.searchKey;
    this.getData(params);
  },
  methods: {
    //切換按鈕table
    changeType(item) {
      this.searchKey.type = item.type;
      let params = {
        siteId: this.$root.nowSite.id,
        status: this.searchKey.status == undefined ? 'all' : this.searchKey.status,
        type: this.searchKey.type,
      };
      (this.searchKey.type == "first") | (this.searchKey.type == "count")
        ? (this.reward = true)
        : (this.reward = false);
      this.getData(params);
    },
    //提取資料
    getData(params) {
      this.$root.startTableLoading();
      if (this.$root.validateTime(this.Time)) {
        const [start_time, end_time] = this.$root.validateTime(this.Time);
        params.start_time = start_time && this.$root.formatTime(start_time);
        params.end_time = end_time && this.$root.formatTime(end_time);
      } else {
        return false;
      }
      this.searchKey.start_time = params.start_time;
      this.searchKey.end_time = params.end_time;
      getActivityJiazengList(params)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
            this.table.data.forEach((res) => {
              this.created_at = this.$moment(res.created_at * 1000).format(
                "YYYY-MM-DD"
              );
              this.updated_at = this.$moment(res.updated_at * 1000).format(
                "YYYY-MM-DD"
              );
            });
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    //搜尋
    searchSubmit() {    
      let params = {
        siteId: this.$root.nowSite.id,
        status: this.searchKey.status == undefined ? 'all' : this.searchKey.status,
        username: this.searchKey.userName,
        type: this.searchKey.type,
      };

      this.sendTip =
        this.searchKey.status == "all" || this.searchKey.status == "no"
          ? true
          : false;
      // if (this.$root.validateTime(this.Time)) {
      //   const [start_time, end_time] = this.$root.validateTime(this.Time);
      //   params.start_time = start_time && this.$root.formatTime(start_time);
      //   params.end_time = end_time && this.$root.formatTime(end_time);
      // } else {
      //   return false;
      // }
      // this.searchKey.start_time = params.start_time;
      // this.searchKey.end_time = params.end_time;

      for (let key in params) {
        if (!params[key]) delete params[key];
      }

      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);
      if (!this.$root.validateName(params.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      delete params.sortName;
      delete params.sort;
      this.getData(params);
    },
    //換頁
    onPageChange(page) {
      this.page = page;
      let params = {
        siteId: this.$root.nowSite.id,
        type: this.searchKey.type,
        page: this.page,
        status: this.searchKey.status == undefined ? 'all' : this.searchKey.status,
      };
      this.getData(params);
    },
    //導出 excel
    exportExcel() {
      let data = {
        isExport: 1,
        siteId: this.$root.nowSite.id,
        status: this.searchKey.status == undefined ? 'all' : this.searchKey.status,
        username: this.searchKey.userName,
        type: this.searchKey.type,
      };
      const [startTime, endTime] = this.$root.validateTime(this.Time);
      data.startTime = startTime && this.$root.formatTimeS(startTime);
      data.endTime = endTime && this.$root.formatnightTimeS(endTime);
      for (let key in data) {
        if (!data[key] || key == "limit" || key == "page") delete data[key];
      }
      data.isExport = 1;
      let openr = window.open();
      getActivityJiazengList(data,true)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            let region = res.data.downloadUrl.split(".com")[1];
            let openr1 = openr ? openr : window;
            openr1.location.href = region;
          } else {
            openr.close();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    //一鍵發送
    clickSend() {
      let params = {
        siteId: this.$root.nowSite.id,
        username: this.searchKey.userName,
        type: this.searchKey.type,
        start_time:this.searchKey.start_time,
        end_time:this.searchKey.end_time,
      };
      let text = "您确定一键发放所选时间段内未发放优惠的会员吗？";
      let msg = "发放成功";
      if (this.table.data == 0) {
        this.$Tip.info({
          content: "当前无未发放优惠的会员!",
        });
      } else {
        this.$Tip.confirm({
          content: text,
          onOk: () => {
            ActivityJiazengDonate(params, true).then((res) => {
              if (res != undefined && res.code == 200) {
                this.$Message.success(msg);
                this.searchSubmit();
              }
            });
          },
        });
      }
    },
    //單一發送
    changeStatus(params, key) {
      let text, msg;
      const { send } = params.row;
      switch (key) {
        case "send":
          text = send === "yes" ? "" : "您确定发放此会员的优惠吗？";
          msg = send === "yes" ? "" : "发放成功";
          break;
      }
      const data = {
        siteId: this.$root.nowSite.id,
        uid: params.row.uid,
        type: this.searchKey.type,
        start_time:this.searchKey.start_time,
        end_time:this.searchKey.end_time,
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          // 不是代理升降级都可以调接口
          ActivityJiazengDonate(data, true).then((res) => {
            if (res != undefined && res.code == 200 && res.data.code != 400) {
              this.$Message.config({ top: 150, duration: 1 });
              this.$Message.success({ content: msg });
              this.searchSubmit(); //reload api
            } else if (
              res != undefined &&
              res.code == 200 &&
              res.data.code == 400
            ) {
              this.tip = res.data.message;
              this.$refs.autoSearch.removeDefault();
              this.$refs.removeMembers.show();
            }
          });
        },
      });
    },
    //取消發送
    cancelStatus(params, key) {
      let text, msg;
      const { nosend } = params.row;
      switch (key) {
        case "nosend":
          text = nosend === "yes" ? "" : "您确定取消此会员的优惠发放吗？";
          msg = nosend === "yes" ? "" : "取消成功";
          break;
      }
      const data = {
        siteId: this.$root.nowSite.id,
        id: params.row.id,
        type: this.searchKey.type,
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          // 不是代理升降级都可以调接口
          ActivityJiazengCancel(data, true).then((res) => {
            if (res != undefined && res.code == 200 && res.data.code != 400) {
              this.$Message.config({ top: 150, duration: 1 });
              this.$Message.success({ content: msg });
              this.searchSubmit(); //reload api
            } else if (
              res != undefined &&
              res.code == 200 &&
              res.data.code == 400
            ) {
              this.tip = res.data.message;
              this.$refs.autoSearch.removeDefault();
              this.$refs.removeMembers.show();
            }
          });
        },
      });
    },
  },
};
</script>


<style lang="less" scoped>
@import "../../../styles/button.less";
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
</style>


