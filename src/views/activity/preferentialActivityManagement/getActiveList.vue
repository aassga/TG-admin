<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
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
        <FormItem label="活动代号">
          <Select
            clearable
            v-model="searchKey.active_code"
            class="s-120"
            placeholder="全部"
            @on-change="changeCode"
          >
            <Option
              v-for="(item, key) in activityList"
              :key="key"
              :value="key"
              >{{ item}}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="活动名称">
          <Input   class="s-120" v-model="searchKey.active_title" placeholder="请输入活动名称"/>
        </FormItem>
        <FormItem label="领取状态">
          <Select
            clearable
            v-model="searchKey.status"
            class="s-120"
            placeholder="全部"
          >
            <Option v-for="(item, key) in statusList" :key="key" :value="key">{{
              statusList[key]
            }}</Option>
          </Select>
        </FormItem>
        <!-- <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" v-model="searchKey.userName" class="s-160" />
                </FormItem> -->
        <FormItem>
          <Select v-if="this.code=='C0001'" class="w90x" @on-change="changType" v-model="type">
            <Option value="userName">会员账号</Option>
            <Option value="received_ip">领取IP</Option>
          </Select>
          <span  v-if="this.code!='C0001'" class="ml5">会员账号</span>
        </FormItem>
        <FormItem>
          <Input
            placeholder="多个请以,逗号隔开"
            v-if="this.type == 'userName'||this.code!='C0001'"
            @keyup.enter.native="searchSubmit"
            v-model="searchKey.userName"
            class="s-160"
          />
          <Input
            placeholder="多个请以,逗号隔开"
            v-if="this.type == 'received_ip'&&this.code=='C0001'"
            @keyup.enter.native="searchSubmit"
            v-model="searchKey.received_ip"
            class="s-160"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="search"
            @click.prevent="searchSubmit"
            >查询</Button
          >
        </FormItem>
        <FormItem>
          <Button
            :loading="$root.editBtnLoading"
            class="ivu-btn export"
            @click.prevent="exportExcel"
            type="primary"
            >导出Excel</Button
          >
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="ivu cardNutton ml10"
            v-if="btnStatus"
            @click.prevent="audit('all', 'yes')"
            >批量审核通过</Button
          >
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            class="ivu cardNutton ml10"
            v-if="btnStatus"
            @click.prevent="audit('all', 'no')"
            >批量审核失败</Button
          >
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
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="onSortChange"
        :pageSizeOpts="table.pageSizeOpts"
       
        @on-select="onSelectOne"
        @on-select-cancel="onSelectCancel"
        @on-select-all="onSelectAll"
        @on-select-all-cancel="
          () => {
            this.btnStatus = false;
          }
        "
      >
        <div slot="more">
          <div class="h44">
            <span>
              已领取:
              <span class="ml5 bb-color"
                >{{ yesList.money }}/{{ yesList.renshu }}人</span
              >
            </span>
            <span class="pl10">
              未领取:
              <span class="ml5 bb-color"
                >{{ noList.money }}/{{ noList.renshu }}人</span
              >
            </span>
            <span class="pl10">
              已取消:
              <span class="ml5 bb-color"
                >{{ cancelList.money }}/{{ cancelList.renshu }}人</span
              >
            </span>
          </div>
        </div>
      </Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import tableMixins from "@/mixins/table";
import { getActiveList, whereList, ActiveZongHeShenhe } from "@/api/activity";
export default {
  name: "getActiveList",
  mixins: [tableMixins],
  components: { Tables },
  data() {
    return {
      type: "userName",
      code:'',
      activityList: [], //一级
      statusList: [], //二级
      Time: [this.$root.startTime(1), this.$root.endTime(1)],
      searchKey: {
        siteId: this.$root.nowSite.id,
        startTime:this.$root.startTime(),
        endTime:this.$root.endTime(),
        userName: "",
        limit: 20,
        status: "no",
        page: "1",
        active_code: "", //活动名称
      },
      table: {
        loading: true,
        total: 100,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            type: "selection",
            align: "center",
            title: "全选",
            width: 50,
          },
          {
            title: "活动代号",
            key: "active_code",
            width: 100,
            align: "center",
          },
          {
            title: "活动名称",
            key: "active_title",
            align: "center",
            minWidth: 100,
            tooltip: true,
          },
          {
            title: "会员账号",
            key: "userName",
            minWidth: 95,
            align: "center",
          },
          {
            title: "活动礼金",
            key: "gift_money",
            minWidth: 80,
            align: "center",
          },

          {
            title: "打码倍数",
            key: "withdraw_money_multiple",
            minWidth: 80,
            align: "center",
          },
          {
            title: "创建时间",
            key: "created_at",
            align: "center",
            minWidth: 120,
            sortable: "custom",
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.created_at)}</span>
            ),
          },
          {
            title: "领取时间",
            key: "gift_money_receive_time",
            align: "center",
            sortable: "custom",
            minWidth: 120,
            render: (h, params) => (
              <span>
                {this.$root.unixTime(params.row.gift_money_receive_time)}
              </span>
            ),
          },
          {
            title: "领取状态",
            key: "gift_money_receive",
            align: "center",
            minWidth: 60,
            render: (h, params) => {
              return (
                <span
                  style={{
                    color: params.row.gift_money_receive == "yes" ? "red" : "",
                  }}
                >
                  {params.row.gift_money_receive == "yes"
                    ? "已领取"
                    : params.row.gift_money_receive == "no"
                    ? "未领取"
                    : params.row.gift_money_receive == "cancel"
                    ? "取消"
                    : params.row.gift_money_receive == "expire"
                    ? "过期"
                    : params.row.gift_money_receive == "invalid"
                    ? "失效"
                    : "-"}
                </span>
              );
            },
          },
          {
               title: "备注",
               key: "remark",
               minWidth:120,
               align: "center",
               tooltip:true,
               render:(h,params)=>{
                 return(
                   <span>{this.$root.text(params.row.remark)}</span>
                 )
               }

          },
          {
            title: "操作",
            align: "center",
            width: 120,
            render: (h, params) => {
              if (params.row.requirement_status == "shenhezhong") {
                return (
                  <div>
                    <div>
                      <a
                        class="ib mr10"
                        onClick={() => {
                          this.audit(params, "yes");
                        }}
                      >
                        审核通过
                      </a>
                      <a
                        class="ib mr10"
                        onClick={() => {
                          this.audit(params, "no");
                        }}
                      >
                        审核失败
                      </a>
                    </div>
                  </div>
                );
              } else if (params.row.requirement_status == "yes") {
                return <span style="color:#888">审核通过</span>;
              } else if (params.row.requirement_status == "no") {
                return <span style="color:red">审核失败</span>;
              } else {
                return <span>-</span>;
              }
            },
          },
        ],
        data: [],
      },
      statusData: "",
      yesList: "",
      noList: "",
      cancelList: "",
      idList: "",
      btnStatus: false,
    };
  },
  created() {
    whereList().then((res) => {
      //获取下拉数据
      this.activityList = res.data.activeName;
      this.statusList = res.data.status;
      let arr = [];
      for (let key in this.activityList) {
        arr.push(key);
      }
      arr.sort((a, b) => {
        return a.substring(1, a.length) - b.substring(1, b.length);
      });
      let newActivityList = {};
      arr.forEach((item) => {
        newActivityList[item] = this.activityList[item];
      });
      this.activityList = newActivityList;
    });
  
  },
  methods: {
    changeCode(val){
       this.code=val;
       if(this.code==undefined){
          this.searchKey.received_ip = "";
          this.searchKey.userName = "";
       }
         if (this.type == "userName") {
        this.searchKey.received_ip = "";
      }
      if (this.type == "received_ip") {
        this.searchKey.userName = "";
      }
    },
    changType(val) {
      this.type = val;
      if (this.type == "userName") {
        this.searchKey.received_ip = "";
      }
      if (this.type == "received_ip") {
        this.searchKey.userName = "";
      }
    },
    onSelectAll(val) {
      this.btnStatus = true;
      let arr = [];
      let arrName = [];
      val.forEach((t) => {
        arr.push(t.id);
      });
      this.idList = arr.join(",");
    },
    onSelectCancel(val) {
      if (val && val.length == 0) this.btnStatus = false;
    },
    //多选
    onSelectOne(val) {
      this.btnStatus = true;
      let arr = [];
      let arrName = [];
      val.forEach((t) => {
        arr.push(t.id);
      });
      this.idList = arr.join(",");
    },
    audit(params, status) {
      let text, id;
      if (params == "all") {
        text =
          status == "yes"
            ? `您确定这${this.idList.split(",").length}项活动通过审核吗？`
            : `您确定这${this.idList.split(",").length}项活动审核失败吗？`;
        id = this.idList;
      } else {
        text =
          status == "yes"
            ? `您确定${params.row.active_title}通过审核吗？`
            : `您确定${params.row.active_title}审核失败吗？`;
        id = params.row.id;
      }

      this.$Tip.confirm({
        content: text,
        onOk: () => {
          let data = {
            siteId: this.$root.nowSite.id,
            id: id,
            status,
          };
          ActiveZongHeShenhe(data, true).then((res) => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(status == "yes" ? "审核通过" : "审核失败");
              this.getData();
            }
          });
        },
      });
    },
    getData() {
      this.$root.startTableLoading(this);
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      getActiveList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total, statusData } = res.data;
            data.forEach((t) => {
              if (t.requirement_status != "shenhezhong") {
                t._disabled = true;
              }
            });
            this.table.loading = false;
            this.table.data = data;
            this.table.total = total;
            const { yes, no, cancel } = statusData;
            this.yesList = yes;
            this.noList = no;
            this.cancelList = cancel;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    searchSubmit() {
      let params = { ...this.searchKey };
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeS(startTime);
        params.endTime = endTime && this.$root.formatnightTimeS(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = params.startTime;
      this.searchKey.endTime = params.endTime;

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
      this.table.columns.forEach((item) => {
        if (item.sortable == "custom") this.$set(item, "sortType", "");
      });
      this.searchKey.page = 1;
      this.getData();
      this.$refs.tables.setPage();
    },
    onPageChange(page) {
      this.searchKey.page = page;
      let data = { ...this.searchKey };
      this.getData(data);
    },
    onSortChange({ column, key, order }) {
      delete this.searchKey.sortName;
      delete this.searchKey.sort;
      let data = { sortName: key, sort: order, ...this.searchKey };
      this.searchKey.sortName = key;
      if (data.sort == "normal") {
        this.table.columns.forEach((t) => {
          if (t.key == column.key) this.$set(t, "sortType", "asc");
        });
        this.searchKey.sort = "asc";
        data.sort = "asc";
      } else {
        this.table.columns.forEach((t) => delete t.sortType);
        this.searchKey.sort = order;
      }
      this.searchKey.page = 1;
      this.getData();
      this.$refs.tables.setPage();
    },

    //导出
    exportExcel() {
      let data = { ...this.searchKey };
      const [startTime, endTime] = this.$root.validateTime(this.Time);
      data.startTime = startTime && this.$root.formatTimeS(startTime);
      data.endTime = endTime && this.$root.formatnightTimeS(endTime);
      for (let key in data) {
        if (!data[key] || key == "limit" || key == "page") delete data[key];
      }
      data.isExport = true;
      let openr = window.open();
      getActiveList(data,true)
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
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
</style>
