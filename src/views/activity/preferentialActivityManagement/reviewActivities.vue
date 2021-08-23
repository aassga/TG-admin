
<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey" inline>
        <FormItem label="会员账号">
          <Input
            placeholder="请输入会员账号"
            class="w140x"
            v-model="searchKey.user_name"
            clearable
          />
        </FormItem>
        <FormItem label="申请时间">
          <DatePicker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            class="s-180"
            v-model="Time[0]"
          ></DatePicker>
          <span class="ml5 mr5">-</span>

          <DatePicker
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            class="s-180"
            v-model="Time[1]"
          ></DatePicker>
        </FormItem>
        <FormItem label="活动名称">
          <Input
            placeholder="请输入活动名称"
            v-model="searchKey.active_apply_name"
            class="w140x"
            clearable
          />
        </FormItem>
        <FormItem label="状态">
          <Select v-model="searchKey.status" placeholder="全部" clearable>
            <Option value="0">待审核</Option>
            <Option value="1">通过</Option>
            <Option value="2">拒绝</Option>
          </Select>
        </FormItem>
        <FormItem label="审核人">
          <Input
            v-model="searchKey.admin_name"
            @keyup.enter.native="searchSubmit"
            placeholder="请输入审核人账号"
            class="w140x"
            clearable
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
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
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="sortChange"
      ></Tables>
    </div>
    <Modals
      :title="this.status == 1 ? '审核通过' : '审核未通过'"
      :width="620"
      ref="auditModal"
    >
      <div slot="content" style="width: 536px" class="ma">
        <Form ref="auditInfo" :rules="rules" :model="auditInfo">
          <FormItem prop="massage">
            <Input
              type="textarea"
              v-model="auditInfo.massage"
              :rows="6"
              class="h190 w536x"
              placeholder="请输入留言信息"
            />
          </FormItem>
          <FormItem>
            <Button
              class="ivu commonSubmit w120x ml100"
              @click.prevent="
                () => {
                  this.$refs.auditModal.hide();
                }
              "
              >取消</Button
            >
            <Button
              class="ivu commonSubmit w120x ml50"
              type="primary"
              @click.prevent="oKsubmit()"
              >确定</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
    <Modals title="详情信息" ref="modalDetial" width="480">
      <div slot="content">
        <Form :label-width="120">
          <FormItem label="用户姓名:">{{ detialInfo.name }}</FormItem>
          <FormItem label="手机号码:">{{ detialInfo.tel }}</FormItem>
          <FormItem label="收货地址:">{{ detialInfo.address }}</FormItem>
          <FormItem label="已中手机:">{{
            detialInfo.gift ? detialInfo.gift : "-"
          }}</FormItem>
        </Form>
      </div>
    </Modals>
    <Modals title="详情信息" ref="showDetial" width="480">
      <div slot="content">
        <Form :label-width="100">
          <FormItem>
            <span>{{ this.showMessage }}</span>
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>

<script>
import { activityApplyList, activityApplyUp } from "@/api/activity";
import Modals from "@/components/modals";
import Tables from "_c/tables";
import { Tooltip } from "view-design";
export default {
  name: "reviewActivities",
  components: {
    Tables,
    Modals,
  },
  data() {
    return {
      pageSize: "",
      showMessage: "",
      Time: [this.$root.startTime(), this.$root.midnight()],
      detialInfo: {},
      searchKey: {
        siteId: this.$root.nowSite.id,
        status: "3",
        sortVal: "asc",
      },
      auditInfo: {
        massage: "",
      },
      id: "",
      addTime: "",
      status: "",
      table: {
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        total: 0,
        loading: true,
        columns: [
          {
            align: "center",
            title: "会员账号",
            key: "userName",
          },
          {
            title: "申请时间",
            align: "center",
            key: "add_time",
            sortable: "custom",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.add_time)}</span>;
            },
          },
          {
            title: "活动名称",
            align: "center",
            key: "active_apply_name",
            tooltip: true,
          },
          {
            title: "活动分类",
            align: "center",
            key: "activity_cate_name",
            tooltip: true,
          },
          {
            title: "用户提交",
            align: "center",
            render: (h, params) => {
              const { jsonData } = params.row;
              let color = jsonData ? "#2d8cf0" : "";
              return (
                <span
                  style={{ color }}
                  class="iconfont"
                  onClick={() => {
                    this.detialInfo = JSON.parse(params.row.jsonData);
                    this.$refs.modalDetial.show();
                  }}
                >
                  {params.row.jsonData ? "详情" : "-"}
                </span>
              );
            },
          },
          {
            title: "状态",
            align: "center",
            key: "status",
            render: (h, params) => {
              const { status } = params.row;
              let color =
                status == "2" ? "#FF2626" : status == "1" ? "#239961" : "";
              return (
                <span style={{ color }}>
                  {status == "0" ? "待审核" : status == "1" ? "通过" : "拒绝"}
                </span>
              );
            },
          },
          {
            title: "审核人账号",
            align: "center",
            key: "admin_name",
            render: (h, params) => {
              return (
                <span>
                  {params.row.admin_name ? params.row.admin_name : "-"}
                </span>
              );
            },
          },
          {
            title: "操作时间",
            align: "center",
            key: "admin_time",
            render: (h, params) => {
              return <span>{this.$root.unixTime(params.row.admin_time)}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            key: "",
            render: (h, params) => {
              const { status } = params.row;
              if (status == "0" || status == "1")
                return (
                  <div>
                    <Button
                      class="white-font"
                      size="small"
                      style={{
                        backgroundColor: "#2d8cf0",
                        borderRadius: "6px",
                        cursor: "pointer",
                        lineHeight: "16px",
                        display: status == "0" ? "inline-block" : "none",
                      }}
                      onClick={() => {
                        const { id, status, add_time } = params.row;
                        this.addTime = this.$root.unixTime(add_time);
                        this.auditInfo.massage =
                          `您的申请于` + this.addTime + "通过审核。";
                        this.id = id;
                        this.status = "1";

                        this.$refs.auditModal.show(this.status);
                      }}
                    >
                      通过
                    </Button>
                    <Button
                      class="white-font"
                      size="small"
                      onClick={() => {
                        const { id, status, add_time } = params.row;
                        this.addTime = this.$root.unixTime(add_time);
                        this.auditInfo.massage =
                          `您的申请于` + this.addTime + "未通过审核。";
                        this.id = id;
                        this.status = "2";
                        this.$refs.auditModal.show(this.status);
                      }}
                      style={{
                        backgroundColor: "#2d8cf0",
                        borderRadius: "6px",
                        cursor: "pointer",
                        lineHeight: "16px",
                        marginLeft: "5px",
                        display: status == "0" ? "inline-block" : "none",
                      }}
                    >
                      拒绝
                    </Button>
                    <span
                      style={{
                        display: status == "1" ? "inline-block" : "none",
                      }}
                    >
                      -
                    </span>
                  </div>
                );
              if (status == "2")
                return (
                  <div>
                    <div
                      class="blue-font"
                      style={{
                        display: status == "2" ? "inline-block" : "none",
                      }}
                      onClick={() => {
                        this.showMessage = params.row.massage;
                        this.$refs.showDetial.show();
                      }}
                    >
                      查看
                    </div>
                  </div>
                );
            },
          },
        ],
      },
      rules: {
        massage: [
          {
            required: true,
            message: "请输入留言信息",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
      },
    };
  },
  methods: {
    sortChange({ column, key, order }) {
      delete this.searchKey.sortKey;
      delete this.searchKey.sortVal;
      let data = {
        ...this.searchKey,
        siteId: this.$root.nowSite.id,
        sortKey: key,
        sortVal: order,
      };
      this.searchKey.sortKey = key;
      if (data.sortVal == "normal") {
        this.table.columns.forEach((item) => {
          if (item.key == column.key) this.$set(item, "sortType", "asc");
        });
        this.searchKey.sortVal = "asc";
        data.sortVal = "asc";
      } else {
        this.table.columns.forEach((item) => {
          delete item.sortType;
        });
        this.searchKey.sortVal = order;
      }
      this.getData({ params: data });
    },
    oKsubmit() {
      this.$refs.auditInfo.validate((valid) => {
        if (valid) {
          const data = {
            siteId: this.$root.nowSite.id,
            id: this.id,
            status: this.status,
            massage: this.auditInfo.massage.replace(RegExp("\n", "g"), "<br>"),
          };
          activityApplyUp(data, true).then((res) => {
            if (res != undefined && res.code == 200) {
              this.$refs.auditModal.hide();
              let data = { ...this.searchKey };
              this.getData({ params: data });
            }
          });
        }
      });
    },
    searchSubmit() {
      let data = { ...this.searchKey };
      if (data.status == undefined) {
        data.status = "3";
      }
      if (data.user_name) data.user_name = this.$root.trimAll(data.user_name);
      if (data.admin_name)
        data.admin_name = this.$root.trimAll(data.admin_name);
      if (this.$root.effectTime(this.Time)) {
        const [startTime, endTime] = this.$root.effectTime(this.Time);
        data.startTime = startTime && this.$root.formatTimeS(startTime);
        data.endTime = endTime && this.$root.formatTimeS(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = data.startTime;
      this.searchKey.endTime = data.endTime;
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
    },
    getData(data) {
      this.$root.startTableLoading();
      activityApplyList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => this.$root.endTableLoading());
    },
    onPageChange(page) {
      let data = { ...this.searchKey, limit: this.pageSize };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.searchKey.limit = pageSize;
      let data = { ...this.searchKey };
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      this.getData({ params: data });
    },
  },
  mounted() {
    const { startTime, endTime } = this.searchKey;
    this.Time = [
      this.$root.formatTimeX(startTime),
      this.$root.formatnightTimeS(endTime),
    ];
    this.searchKey.startTime = this.Time[0];
    this.searchKey.endTime = this.Time[1];
    const data = { ...this.searchKey };
    this.getData({ params: data });
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
</style>