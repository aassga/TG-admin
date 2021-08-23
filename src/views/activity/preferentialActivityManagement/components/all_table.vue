<template>
  <div>
    <Tables
      ref="table"
      :value="table.data"
      :columns="table.columns"
      :page="false"
      :loading="$root.tableLoading"
    >
    </Tables>
    <div slot="footer" v-show="level_id">
      <footer
        class="txt-a footer c62Color cs"
        style="background: #f4faff"
        v-if="isEdit && table.data.length < 100"
        @click.prevent="addConfig"
        @click="sendMsg"
      >
        <Icons type="xinzeng" size="14" class="mr5"></Icons>添加
      </footer>
    </div>
    <div
      slot="more"
      class="mt30 iconColor ft14"
      v-show="active_type == 'shareRemuneration'"
    >
      <div>
        *温馨提示：达到每一条件均可领取一次，实时结算，实时可领（统计时间依据北京时间）
      </div>
      <div class="mt20">
        <p>*活动规则：</p>
        <p>用户<b>当日</b>分享好友达到<b>指定数量</b>时，可领取相应礼金。</p>
      </div>
      <div class="mt20">
        <p>参数说明：</p>
        <p>分享好友数—当日已满足分享条件的用户数；</p>
        <p>最低存款—被分享的用户需满足最低存款金额；</p>
        <p>打码倍数—被分享的用户需满足打码倍数；</p>
        <p>奖金金额—满足条件后，可领取的奖金金额；</p>
      </div>
    </div>
    <div
      slot="more"
      class="mt30 iconColor ft14"
      v-show="active_type == 'deficitRescue'"
    >
      <div>
        *温馨提示：达到每一条件均可领取一次，实时结算，实时可领（统计时间依据北京时间）
      </div>
      <div class="mt20">
        <p>*活动规则：</p>
        <p>统计用户<b>昨日累计亏损</b>金额，满足条件后可领取相应礼金。</p>
      </div>
      <div class="mt20">
        <p>参数说明：</p>
        <p>
          亏损金额—用户昨日截止24:00为止，达到的盈亏数字（例如，要求用户亏损100，则输入-100）；
        </p>
        <p>奖金金额—满足条件后，可领取的奖金金额；</p>
      </div>
    </div>
    <div
      slot="more"
      class="mt30 iconColor ft14"
      v-show="active_type == 'betGiftGiving'"
    >
      <div>
        *温馨提示：达到每一条件均可领取一次，实时结算，实时可领（统计时间依据北京时间）
      </div>
      <div class="mt20">
        <p>*活动规则：</p>
        <p>统计用户<b>当日累计有效投注</b>金额，满足条件后可领取相应礼金。</p>
      </div>
      <div class="mt20">
        <p>参数说明：</p>
        <p>有效投注—用户当日累计有效投注，需排除封禁列表游戏打码；</p>
        <p>奖金金额—满足条件后，可领取的奖金金额；</p>
      </div>
    </div>
  </div>
</template>

<script>
import Tables from "_c/tables";
import Icons from "_c/icons";
import {
  getActiveChessTaskConfigList,
  delActiveChessTaskConfigDel,
} from "@/api/activity";
export default {
  props: ["data", "index", "isEdit", "activeType"],
  components: {
    Tables,
    Icons,
  },
  data() {
    return {
      table: {
        data: [],
        columns: [],
        columns1: [
          {
            title: "分享好友数",
            key: "share_friends_count",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.share_friends_count)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.share_friends_count),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].share_friends_count = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "最低存款",
            key: "pay",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.pay).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.pay),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].pay = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "打码倍数",
            key: "pay",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.betMultiple).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.betMultiple),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].betMultiple = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "奖金金额",
            key: "gift_money",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.gift_money).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.gift_money),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].gift_money = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "操作",
            key: "gift_mone",
            align: "center",
            render: (h, params) => {
              if (params.row.id != undefined) {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.onDelete(params);
                    }}
                  >
                    删除
                  </span>
                );
              } else {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.delConfig(params);
                    }}
                  >
                    删除
                  </span>
                );
              }
            },
          },
        ],
        columns2: [
          {
            title: "亏损金额",
            key: "deficit_money",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.deficit_money).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.deficit_money),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].deficit_money = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },

          {
            title: "奖金金额",
            key: "gift_money",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.gift_money).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.gift_money),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].gift_money = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              if (params.row.id != undefined) {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.onDelete(params);
                    }}
                  >
                    删除
                  </span>
                );
              } else {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.delConfig(params);
                    }}
                  >
                    删除
                  </span>
                );
              }
            },
          },
        ],
        columns3: [
          {
            title: "有效投注",
            key: "bet",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.bet).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.bet),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].bet = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },

          {
            title: "奖金金额",
            key: "gift_money",
            align: "center",
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    Number(params.row.gift_money).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: Number(params.row.gift_money),
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].gift_money = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              if (params.row.id != undefined) {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.onDelete(params);
                    }}
                  >
                    删除
                  </span>
                );
              } else {
                return (
                  <span
                    class="blue-font"
                    onClick={() => {
                      this.delConfig(params);
                    }}
                  >
                    删除
                  </span>
                );
              }
            },
          },
        ],
      },
      obj: {},
      level_id: "",
      active_type: "shareRemuneration",
    };
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.data = newVal;
          if (this.data.length && this.data[this.index].active_type) {
            let { active_type, id } = { ...this.data[this.index] };
            this.level_id = id;
            this.table.columns =
              active_type == "shareRemuneration"
                ? this.table.columns1
                : active_type == "deficitRescue"
                ? this.table.columns2
                : this.table.columns3;
            let params = {
              siteId: this.$root.nowSite.id,
              active_type: active_type,
              level_id: id,
            };
            this.getList(params);
          } else {
            this.table.columns =
              this.activeType == "shareRemuneration"
                ? this.table.columns1
                : this.activeType == "deficitRescue"
                ? this.table.columns2
                : this.table.columns3;
            this.table.data = [];
            this.level_id = null;
          }
        });
      },
      deep: true,
    },
    activeType: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.activeType = newVal;
        });
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    getList(data) {
      let newArr = [];
      this.$root.startTableLoading();
      getActiveChessTaskConfigList(data)
        .then((res) => {
          if (res != undefined || res.code == 200 || res.code != 400) {
            let arr = [];
            arr = JSON.parse(JSON.stringify(res.data));
            arr.forEach((key) => {
              for (let t in key) {
                if (t == "condition") {
                  newArr.push(JSON.parse(key[t]));
                }
              }
            });
            if (newArr.length) {
              this.table.data = newArr;
            } else {
              this.table.data = [];
            }
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    addConfig() {
      if (this.activeType == "shareRemuneration") {
        this.obj = {
          share_friends_count: 0,
          pay: 0,
          betMultiple: 0,
          gift_money: 0,
        };
      }
      if (this.activeType == "deficitRescue") {
        this.obj = {
          deficit_money: 0,
          gift_money: 0,
        };
      }
      if (this.activeType == "betGiftGiving") {
        this.obj = {
          bet: 0,
          gift_money: 0,
        };
      }
      this.table.data.push(this.obj);
    },
    sendMsg() {
      this.$emit("sendMsg", this.table.data);
    },
    onDelete(params) {
      let text = `您确定删除此条记录吗？`;
      let msg = `删除成功`;
      const data = {
        siteId: this.$root.nowSite.id,
        id: params.row.id,
        status: "delete",
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          this.$root.startTableLoading();
          delActiveChessTaskConfigDel(data, true)
            .then((res) => {
              if (res != undefined && res.code == 200) {
                this.$Message.success({ content: msg });
                this.table.data.splice(params.index, 1);
                this.$root.endTableLoading();
              }
            })
            .catch((error) => this.$root.endTableLoading());
        },
      });
    },
    //删除活动配置
    delConfig(params) {
      //取消
      this.table.data.splice(params.index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../../styles/button.less";
.footer {
  border: 1px solid #dcdcdc;
  border-top: 0;
  line-height: 48px;
}
</style>