
<template>
  <div>
    <div class="v2-search">
      <Form ref="searchKey1" inline>
        <span class="red-font h36">*</span>
        <FormItem label="时间段一">
          <DatePicker
            type="date"
            placeholder="开始日期"
            :class="screen == 1440 ? 's-130' : 's-120'"
            v-model="Time1[0]"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <span>至</span>
        </FormItem>
        <FormItem>
          <DatePicker
            type="date"
            placeholder="结束日期"
            :class="screen == 1440 ? 's-130' : 's-120'"
            v-model="Time1[1]"
          ></DatePicker>
        </FormItem>
        <span class="red-font h36">*</span>
        <FormItem label="会员存款">
          <Select class="w50x" v-model="searchKey1.depositWith">
            <Option v-for="(t, i) in operator" :value="t.value" :key="i">{{
              t.name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <InputNumber
            :max="9999999999"
            :min="0"
            text="number"
            class="w110x"
            v-model="searchKey1.depositAmount"
          />
        </FormItem>
        <FormItem>
          <Select v-model="searchKey1.join">
            <Option value="and">并且</Option>
            <Option value="or">或者</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchKey1.betType">
            <Option value="amount">会员打码</Option>
            <Option value="multiple">会员倍数</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select class="w50x" v-model="searchKey1.betWith">
            <Option v-for="(t, i) in operator" :value="t.value" :key="i">{{
              t.name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <InputNumber
            :max="9999999999"
            :min="0"
            text="number"
            class="w110x"
            v-model="searchKey1.betAmount"
          />
          <span class="ml10" v-if="searchKey1.betType == 'amount'">元</span>
          <span class="ml10" v-if="searchKey1.betType == 'multiple'">倍</span>
        </FormItem>
        <FormItem>
          <Checkbox v-model="and" @on-change="checkChange">关联查询</Checkbox>
        </FormItem>
        <FormItem>
          <Button type="primary" class="search" @click.prevent="searchSubmit"
            >查询</Button
          >
        </FormItem>
        <FormItem>
          <Button class="export" @click.prevent="exportExcel" type="primary"
            >导出Excel</Button
          >
        </FormItem>
        <FormItem class="fr">
          <Poptip trigger="hover" placement="bottom-start" class="ml5 fl">
            <div slot="content" class="mb20">
              <div class="ft14">
                <div>示例：</div>
                <div>查询1月1日至1月15日，存款大于1000，打</div>
                <div>码大于2000的用户，在1月16日至1月30日</div>
                <div>就没再来过的名单，请依次操作：</div>
              </div>
              <div class="mt20 ft14">
                <div>时间段一选择1月1日至1月15日，</div>
                <div>会员存款≥1000，</div>
                <div>会员打码≥2000，</div>
                <div>勾选关联查询，</div>
                <div>时间段二选择1月16日至1月30日，</div>
                <div>会员存款等于0，</div>
                <div>会员打码等于0，</div>
                <div>执行查询。</div>
              </div>
            </div>
            <Icons type="bangzhutishi" color="#E4E4E4" :size="26" />
          </Poptip>
        </FormItem>
        <!-- <FormItem>
                    <Checkbox v-model="and">并且</Checkbox>
                </FormItem> -->
      </Form>
      <Form ref="searchKey2" inline class="mt20 mb20" v-show="and">
        <span class="red-font h36">*</span>
        <FormItem label="时间段二">
          <DatePicker
            type="date"
            placeholder="开始日期"
            :class="screen == 1440 ? 's-130' : 's-120'"
            v-model="Time2[0]"
          ></DatePicker>
        </FormItem>
        <FormItem>
          <span>至</span>
        </FormItem>
        <FormItem>
          <DatePicker
            type="date"
            placeholder="结束日期"
            :class="screen == 1440 ? 's-130' : 's-120'"
            v-model="Time2[1]"
          ></DatePicker>
        </FormItem>
        <span class="red-font h36">*</span>
        <FormItem label="会员存款">
          <Select class="w50x" v-model="searchKey2.depositWith">
            <Option v-for="(t, i) in operator" :value="t.value" :key="i">{{
              t.name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <InputNumber
            :max="9999999999"
            :min="0"
            text="number"
            class="w110x"
            v-model="searchKey2.depositAmount"
          />
        </FormItem>
        <FormItem>
          <Select v-model="searchKey2.join">
            <Option value="and">并且</Option>
            <Option value="or">或者</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchKey2.betType">
            <Option value="amount">会员打码</Option>
            <Option value="multiple">会员倍数</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select class="w50x" v-model="searchKey2.betWith">
            <Option v-for="(t, i) in operator" :value="t.value" :key="i">{{
              t.name
            }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <InputNumber
            :max="9999999999"
            :min="0"
            text="number"
            class="w110x"
            v-model="searchKey2.betAmount"
          />
          <span class="ml10" v-if="searchKey1.betType == 'amount'">元</span>
          <span class="ml10" v-if="searchKey1.betType == 'multiple'">倍</span>
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
        :stripe="false"
        :pageSizeOpts="table.pageSizeOpts"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="sortChange"
      ></Tables>
    </div>
  </div>
</template>
<script>
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import { memberFilter } from "@/api/member";
export default {
  name: "memberFilter",
  components: {
    Tables,
    Icons,
  },
  data() {
    return {
      screen: screen.width,
      and: false,
      operator: [
        { value: "eq", name: "=" },
        { value: "lt", name: "<" },
        { value: "ge", name: "≥" },
        { value: "le ", name: "≤" },
        { value: "gt", name: ">" },
      ],
      searchKey1: {
        depositWith: "eq",
        depositAmount: 0,
        join: "and",
        betType: "amount",
        betWith: "eq",
        betAmount: 0,
      },
      Time1: [
        this.$root.formatTime(new Date()),
        this.$root.formatTime(new Date()),
      ],
      searchKey2: {
        depositWith: "eq",
        depositAmount: 0,
        join: "and",
        betType: "amount",
        betWith: "eq",
        betAmount: 0,
      },
      Time2: [
        this.$root.formatTime(new Date()),
        this.$root.formatTime(new Date()),
      ],
      limit: 20,
      table: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        data: [],
        columns: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 110,
          },
          {
            title: "姓名",
            key: "realName",
            align: "center",
            minWidth: 110,
            render: (h, params) => {
              if (params.row.realName)
                return <span>{params.row.realName}</span>;
              else return <span>-</span>;
            },
          },
          {
            title: "注册时间",
            key: "created_at",
            align: "center",
            minWidth: 140,
            render: (h, params) => {
              let date = params.row.created_at;
              return <span>{date.substring(0, date.length - 3)}</span>;
            },
          },
          {
            title: "未登入/天",
            key: "lastTime",
            align: "center",
            sortable: "custom",
            minWidth: 110,
            render: (h, params) => {
              let newDate = new Date();
              let lastTime = new Date(params.row.lastTime).getTime();
              let leftTime = newDate - lastTime;
              let days = Math.ceil(leftTime / (24 * 60 * 60 * 1000));
              return <span>{days}</span>;
            },
          },
          {
            title: "存款总额",
            key: "allDepositAmount",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
          {
            title: "取款总额",
            key: "allWithdrawalsAmount",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
          {
            title: "现金利润",
            key: "moneyReport",
            align: "center",
            sortable: "custom",
            minWidth: 105,
            render: (h, params) => {
              let color = params.row.moneyReport > 0 ? "#ff0000" : "#008000";
              return <span style={{ color }}>{params.row.moneyReport}</span>;
            },
          },
          {
            title: "优惠总额",
            key: "bonusAmount",
            align: "center",
            sortable: "custom",
            minWidth: 110,
            render: (h, params) => {
              if (params.row.bonusAmount == 0) {
                return <span>{params.row.bonusAmount}</span>;
              } else {
                return (
                  <div>
                    <Poptip
                      trigger="hover"
                      placement="right-start"
                      width="208"
                      popper-class="top-wrap"
                      transfer
                    >
                      <span class="cs">{params.row.bonusAmount}</span>
                      <div class="tip-box" slot="content">
                        <div class="title">
                          <span>优惠类型</span>
                          <span>优惠金额</span>
                        </div>
                        <ul>
                          <li
                            style={{
                              display:
                                Number(params.row.giftBonusAmount) == 0
                                  ? "none"
                                  : "block",
                            }}
                          >
                            <span>活动优惠</span>
                            <span>{params.row.giftBonusAmount}</span>
                          </li>
                          <li
                            style={{
                              display:
                                Number(params.row.refandAmount) == 0
                                  ? "none"
                                  : "block",
                            }}
                          >
                            <span>返水优惠</span>
                            <span>{params.row.refandAmount}</span>
                          </li>
                        </ul>
                        <div
                          class="footer"
                          // style={{ display: Number(params.row.giftBonusAmount) == 0 || Number(params.row.refandAmount) == 0 ? 'none' : 'block' }}
                        >
                          <span>总计</span>
                          <span>{params.row.bonusAmount}</span>
                        </div>
                      </div>
                    </Poptip>
                  </div>
                );
              }
            },
          },
          {
            title: "棋牌打码",
            key: "betAmountByChess",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
          {
            title: "捕鱼打码",
            key: "betAmountByFish",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
          {
            title: "电子打码",
            key: "betAmountBySlot",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
          {
            title: "视讯打码",
            key: "betAmountByLive",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
          {
            title: "彩票打码",
            key: "betAmountByLottery",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
          {
            title: "体育打码",
            key: "betAmountBySport",
            align: "center",
            sortable: "custom",
            minWidth: 105,
          },
        ],
      },
      whereFirst: {},
      whereSecond: {},
    };
  },
  created() {
    if (this.Time1[0])
      this.whereFirst["whereFirst_startTime"] = this.$root.formatTime(this.Time1[0]);
    if (this.Time1[1])
      this.whereFirst["whereFirst_endTime"] = this.$root.formatTime(this.Time1[1]);
    for (let key in this.searchKey1) {
      this.whereFirst[`whereFirst_${key}`] = this.searchKey1[key];
    }
    if (this.Time2[0])
      this.whereSecond["whereSecond_startTime"] = this.$root.formatTime(this.Time2[0]);
    if (this.Time2[1])
      this.whereSecond["whereSecond_endTime"] = this.$root.formatTime(this.Time2[1]);
    for (let key in this.searchKey2) {
      this.whereSecond[`whereSecond_${key}`] = this.searchKey2[key];
    }
    let data = this.end
      ? {
          siteId: this.$root.nowSite.id,
          ...this.whereFirst,
          ...this.whereSecond,
        }
      : { siteId: this.$root.nowSite.id, ...this.whereFirst };
    this.getData({params: data });
  },
  methods: {
    checkChange(val) {
      this.end = val;
    },
    getData(data) {
      this.$root.startTableLoading();
      console.log(data)
      memberFilter(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.table.data = res.data.data;
            this.table.total = res.data.total;
            this.$root.endTableLoading();
          }
        })
        .catch((error) => {
          this.table.data = [];
          this.$root.endTableLoading();
        });
    },
    onPageChange(page) {
      this.page = page;

      let data = this.end
        ? {
            siteId: this.$root.nowSite.id,
            ...this.whereFirst,
            ...this.whereSecond,
          }
        : { siteId: this.$root.nowSite.id, ...this.whereFirst };
      this.getData({ params: data, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.limit = pageSize;
      let data = this.end
        ? {
            siteId: this.$root.nowSite.id,
            ...this.whereFirst,
            ...this.whereSecond,
          }
        : { siteId: this.$root.nowSite.id, ...this.whereFirst };
      this.getData({ params: data, query: { limit: pageSize } });
    },
    searchSubmit() {
      this.table.columns.forEach((item) => {
        if (item.sortable == "custom") this.$set(item, "sortType", "");
      });
      if (
        !this.Time1[0] ||
        !this.Time1[1] ||
        !this.Time2[0] ||
        !this.Time2[1]
      ) {
        this.$Message.warning("请选择时间段！");
        return false;
      }
      if (this.$root.validateTime(this.Time1)) {
        this.whereFirst["whereFirst_startTime"] = this.$root.formatTime(this.Time1[0]);
        this.whereFirst["whereFirst_endTime"] = this.$root.formatTime(this.Time1[1]);
        for (let key in this.searchKey1) {
          this.whereFirst[`whereFirst_${key}`] = this.searchKey1[key];
        }
      } else {
        return false;
      }
      if (this.$root.validateTime(this.Time2)) {
        this.whereSecond["whereSecond_startTime"] = this.$root.formatTime(this.Time2[0]);
        this.whereSecond["whereSecond_endTime"] = this.$root.formatTime(this.Time2[1]);
        for (let key in this.searchKey2) {
          this.whereSecond[`whereSecond_${key}`] = this.searchKey2[key];
        }
      } else {
        return false;
      }
      let data = this.end
        ? {
            siteId: this.$root.nowSite.id,
            ...this.whereFirst,
            ...this.whereSecond,
          }
        : { siteId: this.$root.nowSite.id, ...this.whereFirst };

      this.$refs.tables.setPage();
      this.getData({ params: data, query: { limit: this.limit } });
    },
    //排序
    sortChange({ column, key, order }) {
      let data = this.end
        ? {
            siteId: this.$root.nowSite.id,
            ...this.whereFirst,
            ...this.whereSecond,
            sortKey: key,
            sortVal: order,
          }
        : {
            siteId: this.$root.nowSite.id,
            ...this.whereFirst,
            sortKey: key,
            sortVal: order,
          };

      if (data.sortVal == "normal") {
        this.table.columns.forEach((item) => {
          if (item.key == column.key) this.$set(item, "sortType", "asc");
        });
        data.sortVal = "asc";
        data.sortVal = "asc";
      } else {
        this.table.columns.forEach((item) => {
          delete item.sortName;
        });
      }

      this.page == 1 ? "" : this.$refs.tables.setPage();
      this.page == 1
        ? this.getData({ params: data })
        : this.getData({ params: data, query: { page: 1 } });
    },
    //导出
    exportExcel() {
      let data = this.end
        ? {
            siteId: this.$root.nowSite.id,
            ...this.whereFirst,
            ...this.whereSecond,
          }
        : { siteId: this.$root.nowSite.id, ...this.whereFirst };

      data.isExport = 1;
      let openr = window.open();
      memberFilter({ params: data },true).then((res) => {
        if (res != undefined && res.code == 200) {
          let region = res.data.downloadUrl.split(".com")[1];
          let openr1 = openr ? openr : window;
          openr1.location.href = region;
        } else {
          openr.close();
        }
      });
    },
  },
};
</script>
<style lang="less"  scoped>
@import "../../styles/button.less";
</style>