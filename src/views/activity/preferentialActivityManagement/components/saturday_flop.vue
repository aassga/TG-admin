<template>
  <div class="mb30">
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
    <div slot="more" class="mt30 iconColor ft14">
      <div>
        *温馨提示：每周六当天只可领取1次，存款金额累计计算（统计时间依据北京时间）
      </div>
      <div class="mt20">
        <p>*活动规则：</p>
        <p>
          1.&nbsp;&nbsp;&nbsp;&nbsp;每周六当天只可领取1次，按照领取时达到的最高等级存款打码进行领取（最高等级有效打码按照用户的实际存款乘以倍数进行计算）。
        </p>
        <p>
          2.&nbsp;&nbsp;&nbsp;&nbsp;领取时间：每周六00:00-23:59,如超过领取红包时间红包次数将清零，视为放弃。
        </p>
        <p>3.&nbsp;&nbsp;&nbsp;&nbsp;所获得的红包1倍打码即可申请提款。</p>
        <p>
          4.&nbsp;&nbsp;&nbsp;&nbsp;存在对打行为系统将会取消红包资格及其它活动。
        </p>
        <p>5.&nbsp;&nbsp;&nbsp;&nbsp;存在优惠黑名单的玩家不能参与此活动</p>
        <p>
          6.&nbsp;&nbsp;&nbsp;&nbsp;系统统计存款时间为周六00:00-23:59，如有任何异议按照我司查询为准
        </p>
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
        columns: [
          {
            title: "存款金额",
            key: "depositAmount",
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
                    Number(params.row.depositAmount).toFixed(2) + " +"
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      placeholder: "存款金额",
                      value: this.table.data[params.index].depositAmount,
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].depositAmount = e;
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
            key: "multiple",
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
                    "x " + Number(params.row.multiple).toFixed(2)
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: { display: this.isEdit ? "inline-block" : "none" },
                    props: {
                      placeholder: "打码倍数",
                      value: this.table.data[params.index].multiple,
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].multiple = e;
                        this.sendMsg();
                      },
                    },
                  }),
                ]
              );
            },
          },
          // {
          //     title: '翻牌次数',
          //     key: 'cardNumber',
          //     align: 'center',
          //     minWidth:100,
          //     render: (h, params) => {
          //         return (
          //             'div',
          //             [
          //                 h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.cardNumber)+' +'),
          //                 h('InputNumber', {
          //                     class: 'w50',
          //                     style: { display: this.isEdit ? 'inline-block' : 'none' },
          //                     props: {
          //                         placeholder:'翻牌次数',
          //                         value: this.table.data[params.index].cardNumber,
          //                         min: 0,
          //                         max: 9999999999
          //                         // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
          //                     },
          //                     on: {
          //                         'on-change': e => {
          //                             if (!e) e = 0;
          //                             this.table.data[params.index].cardNumber = e;
          //                             this.sendMsg();
          //                         }
          //                     }
          //                 })
          //             ]
          //         );
          //     }
          // },
          {
            title: "奖金上限",
            key: "bonusMax",
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
                          !this.isEdit && params.row.bonusTpye == "2"
                            ? "inline-block"
                            : "none",
                      },
                    },
                    Number(params.row.bonusMax).toFixed(2)
                  ),
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
                    "-"
                  ),
                  h("InputNumber", {
                    class: "w50",
                    style: {
                      display:
                        this.isEdit && params.row.bonusTpye == "2"
                          ? "inline-block"
                          : "none",
                    },
                    props: {
                      placeholder: "金额上限",
                      value: this.table.data[params.index].bonusMax,
                      min: 0,
                      max: 9999999999,
                      // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = 0;
                        this.table.data[params.index].bonusMax = e;
                        this.sendMsg();
                      },
                    },
                  }),
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
                    "-"
                  ),
                ]
              );
            },
          },
          {
            title: "奖金金额",
            key: "game_name",
            align: "center",
            minWidth: 160,
            render: (h, params) => {
              return (
                "div",
                [
                  h("div", { class: "ib" }, [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none",
                        },
                      },
                      Number(
                        params.row.bonusTpye == "1"
                          ? params.row.fixedAmount
                          : params.row.proportion
                      ).toFixed(2)
                    ),
                    h(
                      "span",
                      {
                        style: {
                          class: "ml10",
                          display:
                            !this.isEdit && params.row.bonusTpye == "2"
                              ? "inline-block"
                              : "none",
                        },
                      },
                      "%"
                    ),
                  ]),
                  h(
                    "div",
                    {
                      class: "w250x lh48 ib txt-l",
                      style: { display: this.isEdit ? "inline-block" : "none" },
                    },

                    [
                      h(
                        "Select",
                        {
                          class: "w100x mr10 ib",
                          style: {
                            display: this.isEdit ? "inline-block" : "none",
                          },
                          props: {
                            value: this.table.data[params.index].bonusTpye,
                            disabled: this.isEdit ? false : true,
                            transfer: true,
                          },
                          on: {
                            "on-change": (val) => {
                              this.table.data[params.index].bonusTpye = val;
                              this.sendMsg();
                            },
                          },
                        },
                        [
                          h(
                            "Option",
                            {
                              props: {
                                value: "1",
                              },
                            },
                            "固定金额"
                          ),
                          h(
                            "Option",
                            {
                              props: {
                                value: "2",
                              },
                            },
                            "按比例"
                          ),
                        ]
                      ),
                      h("div", { class: "ib" }, [
                        h("InputNumber", {
                          class: "w100x",
                          style: {
                            display:
                              this.isEdit && params.row.bonusTpye == "1"
                                ? "inline-block"
                                : "none",
                          },
                          props: {
                            placeholder: "请输入",
                            value: this.table.data[params.index].fixedAmount,
                            min: 0,
                            max: 9999999999,
                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": (e) => {
                              if (!e) e = 0;
                              this.table.data[params.index].fixedAmount = e;
                              this.sendMsg();
                            },
                          },
                        }),
                        h("InputNumber", {
                          class: "w100x",
                          style: {
                            display:
                              this.isEdit && params.row.bonusTpye == "2"
                                ? "inline-block"
                                : "none",
                          },
                          props: {
                            placeholder: "请输入",
                            value: this.table.data[params.index].proportion,
                            min: 0,
                            max: 9999999999,
                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": (e) => {
                              if (!e) e = 0;
                              this.table.data[params.index].proportion = e;
                              this.sendMsg();
                            },
                          },
                        }),
                      ]),
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
                        "%"
                      ),
                    ]
                  ),
                ]
              );
            },
          },
          {
            title: "操作",
            key: "gift_mone",
            align: "center",
            minWidth: 80,
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
      level_id: 101,
      active_type: "zhouliufanpai",
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
              level_id: 101,
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

            } else {
              this.table.data = [];
            }
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    addConfig() {
      this.obj = {
        depositAmount: 0,
        multiple: 0,
        bonusMax: 0,
        bonusTpye: "1",
        fixedAmount: 0,
        proportion: 0,
      };
      this.table.data.push(this.obj);
    },
    sendMsg() {
      this.$emit("sendMsg", this.table.data);
      // console.log('data',this.table.data)
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