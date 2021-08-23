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
    <div slot="more" class="mt30 iconColor ft14">
      <div>*温馨提示：上限金额为0表示无上限</div>
      <div class="mt20">
        <p>
          1.&nbsp;&nbsp;&nbsp;&nbsp;首次存款和累积存款每个会员达到要求均可领取一次。
        </p>
        <p>2.&nbsp;&nbsp;&nbsp;&nbsp;活动对象：全部会员。</p>
        <p>
          3.&nbsp;&nbsp;&nbsp;&nbsp;存款方式：包含USDT转账,网银转账, 微信转卡, 微信转账, 微信扫码, 支付宝转卡, 支付宝转账, 支付宝扫码, 财付通扫码。
        </p>
        <p>
          4.&nbsp;&nbsp;&nbsp;&nbsp;首次存款：会员首次使用以上任何一种支付方式存款，可赠送对应优惠比例，次日发送优惠，对不合格的会员可手动取消优惠。
        </p>
        <p>
          5.&nbsp;&nbsp;&nbsp;&nbsp;累积存款天数：会员活动期间内累积使用以上任何一种存款方式达到规定的天数，次日发送优惠，对不合格的会员可手动取消优惠，发放优惠时以达到要求的最后1天的首笔存款金额赠送优惠比例。
        </p>
        <p>6.&nbsp;&nbsp;&nbsp;&nbsp;存款金额累计统计时间依据北京时间。</p>
      </div>
    </div>
  </div>
</template>

<script>
import Tables from "_c/tables";
import {
  getActiveChessTaskConfigList,
  delActiveChessTaskConfigDel,
} from "@/api/activity";
export default {
  props: ["data", "index", "isEdit", "activeType"],
  components: {
    Tables,
  },
  data() {
    return {
      table: {
        data: [],
        columns: [
          {
            title: "会员类型",
            key: "member",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let member = "全部会员";
              return <span>{member}</span>;
            },
          },
          {
            title: "公司入款",
            key: "day",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              return (
                "div",
                [
                  h(
                    "span",
                    {
                      style: {
                        display:
                          !this.isEdit && params.row.bonusTpye == "1"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    "首次存款"
                  ),
                  h(
                    "span",
                    {
                      style: {
                        display:
                          this.isEdit && params.row.bonusTpye == "1"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    "首次存款"
                  ),
                  h(
                    "span",
                    {
                      style: {
                        display:
                          !this.isEdit && params.row.bonusTpye == "2"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    "累积存款"
                  ),
                  h(
                    "span",
                    {
                      class: "mr10",
                      style: {
                        display:
                          this.isEdit && params.row.bonusTpye == "2"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    "累积存款"
                  ),
                  h(
                    "span",
                    {
                      class: "ml10 mr10",
                      style: {
                        display:
                          !this.isEdit && params.row.bonusTpye == "2"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    Number(params.row.day)
                  ),
                  h("InputNumber", {
                    class: "w15",
                    style: {
                      display:
                        this.isEdit && params.row.bonusTpye == "2"
                          ? "inline-block"
                          : "none",
                    },
                    props: {
                      value: this.table.data[params.index].day,
                      min: 0,
                      max: 9999999999,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].day = e;
                        this.sendMsg();
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      style: {
                        display:
                          !this.isEdit && params.row.bonusTpye == "2"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    "天"
                  ),
                  h(
                    "span",
                    {
                      class: "ml10",
                      style: {
                        display:
                          this.isEdit && params.row.bonusTpye == "2"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    "天"
                  ),
                ]
              );
            },
          },
          {
            title: "优惠比例",
            key: "rate",
            align: "center",
            minWidth: 160,
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
                    Number(params.row.rate).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w20",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      value: this.table.data[params.index].rate,
                      min: 0,
                      max: 9999999999,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].rate = e;
                        this.sendMsg();
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      class: "ml10",
                      style: {
                        display: !this.isEdit ? "inline-block" : "none",
                      },
                    },
                    "%"
                  ),
                  h(
                    "span",
                    {
                      class: "ml10",
                      style: {
                        display: this.isEdit ? "inline-block" : "none",
                      },
                    },
                    "%"
                  ),
                ]
              );
            },
          },
          {
            title: "奖金上限",
            key: "max_amount",
            align: "center",
            minWidth: 100,
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
                    Number(params.row.max_amount).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w20",
                    style: {
                      display: this.isEdit ? "inline-block" : "none",
                    },
                    props: {
                      placeholder: "金额上限",
                      value: this.table.data[params.index].max_amount,
                      min: 0,
                      max: 9999999999,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].max_amount = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
        ],
      },
      obj: {},
      level_id: 0,
      active_type: "wangyinjiazeng",
    };
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.data = newVal;
          if (this.data.length && this.data[this.index].active_type) {
            let { active_type } = { ...this.data[this.index] };
            this.active_Type = active_type;
            this.params = {
              siteId: this.$root.nowSite.id,
              active_type: active_type,
              level_id: 0,
            };
            this.getList(this.params);
          } else {
            this.table.data = [];
          }
        });
      },
    },
    isEdit: {
      deep: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.isEdit = newVal;
        });
      },
    },
  },

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
              newArr.forEach((res) => {
                this.firstRate = res.first.rate;
                this.firstAmount = res.first.max_amount;
                this.countRate = res.count.rate;
                this.countDay = res.count.day;
                this.countAmount = res.count.max_amount;
              });

              this.table.data = [
                {
                  bonusTpye: 1,
                  rate: this.firstRate,
                  max_amount: this.firstAmount,
                },
                {
                  bonusTpye: 2,
                  day: this.countDay,
                  rate: this.countRate,
                  max_amount: this.countAmount,
                },
              ];
            } else if (newArr.length === 0){
              this.table.data = newArr;
              this.table.data = [
                {
                  bonusTpye: 1,
                  rate: '1',
                  max_amount: '0',
                },
                {
                  bonusTpye: 2,
                  day: '0',
                  rate: '1',
                  max_amount: '0',
                },
              ];
            } else{
              this.table.data = [];
            }
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    sendMsg() {
      this.$emit("sendMsg", this.table.data);
      console.log("data", this.table.data);
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