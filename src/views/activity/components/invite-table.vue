<template>
  <div class="v2-table">
    <Tables
      ref="table"
      :value="table.data"
      :columns="table.columns"
      :loading="$root.tableLoading"
      :page="false"
    ></Tables>
    <footer
      class="txt-a footer c62Color cs"
      style="background: #f4faff;"
      v-if="isEdit && table.data.length < 100"
      @click.prevent="addLevel"
    >
      <Icons type="xinzeng" size="14" class="mr5"></Icons>添加等级
    </footer>
  </div>
</template>
<script>
import Icons from "_c/icons";
import Tables from "_c/tables";
import {
  jinGuanJiaLeveInviteFriendsList,
  jinGuanJiaLeveInviteFriendsConfigEdit,
  jinGuanJiaLeveInviteFriendsDel
} from "@/api/activity";
export default {
  name: "levelManagement",
  props: ["currentModeId", "isEdit"],
  components: {
    Tables,
    Icons
  },
  data() {
    return {
      table: {
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        loading: true,
        columns: [
          {
            title: "邀请者奖励",
            key: "",
            align: "center",
            children: [
              {
                title: "好友等级",
                key: "level",
                align: "center",
                minWidth: 40,
                render: (h, params) => {
                  return <span>{params.row.level}</span>;
                }
              },
              {
                title: "晋级礼金奖励",
                key: "level_gift_money_requirement",
                align: "center",
                minWidth: 100,
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      "好友礼金x" +
                        Number(params.row.level_gift_money_requirement.bili)
                    ),
                    h(
                      "div",
                      {
                        style: {
                          display: "inline-block"
                        }
                      },
                      [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "好友礼金x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.level_gift_money_requirement.bili
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].level_gift_money_requirement.bili = e;
                            }
                          }
                        }),
                        "%"
                      ]
                    )
                  ])
              },
              {
                title: "上限金额",
                key: "level_gift_money_requirement",
                align: "center",
                minWidth: 100,
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      Number(
                        params.row.level_gift_money_requirement.money_max
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.level_gift_money_requirement.money_max
                        ),
                        min: 0,
                        max: 9999999999
                        //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].level_gift_money_requirement.money_max = e;
                        }
                      }
                    })
                  ])
              },
              {
                title: "周俸禄奖励",
                key: "week_gift_money_requirement",
                align: "center",
                minWidth: 100,
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      "好友周俸禄x" +
                        Number(params.row.week_gift_money_requirement.bili)
                    ),
                    h(
                      "div",
                      {
                        style: {
                          display: "inline-block"
                        }
                      },
                      [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "好友周俸禄x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.week_gift_money_requirement.bili
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].week_gift_money_requirement.bili = e;
                            }
                          }
                        }),
                        "%"
                      ]
                    )
                  ])
              },
              {
                title: "上限金额",
                key: "week_gift_money_requirement",
                align: "center",
                minWidth: 100,
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      Number(
                        params.row.week_gift_money_requirement.money_max
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.week_gift_money_requirement.money_max
                        ),
                        min: 0,
                        max: 9999999999
                        //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].week_gift_money_requirement.money_max = e;
                        }
                      }
                    })
                  ])
              },
              {
                title: "月俸禄奖励",
                key: "month_gift_money_requirement",
                align: "center",
                minWidth: 110,
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      "好友月俸禄x" +
                        Number(params.row.month_gift_money_requirement.bili)
                    ),
                    h(
                      "div",
                      {
                        style: {
                          display: "inline-block"
                        }
                      },
                      [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "好友月俸禄x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.month_gift_money_requirement.bili
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].month_gift_money_requirement.bili = e;
                            }
                          }
                        }),
                        "%"
                      ]
                    )
                  ])
              },
              {
                title: "上限金额",
                key: "month_gift_money_requirement",
                align: "center",
                minWidth: 90,
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      Number(
                        params.row.month_gift_money_requirement.money_max
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.month_gift_money_requirement.money_max
                        ),
                        min: 0,
                        max: 9999999999
                        //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].month_gift_money_requirement.money_max = e;
                        }
                      }
                    })
                  ])
              },
              {
                title: "",
                key: "fenhong_gift_money_requirement",
                align: "center",
                minWidth: 100,
                renderHeader: (h, params) => {
                  return (
                    <div>
                      <span>分红奖励</span>
                      <Poptip trigger="hover" placement="top-end" transfer>
                        <div slot="content">
                          <p>分红奖励：根据好友当月的现金利润占比进行计算</p>
                          <p>现金利润=存款-取款</p>
                        </div>
                        <Icons
                          type="bangzhutishi"
                          color="#E4E4E4"
                          size="16"
                          class="ib ml5"
                          style="paddingLeft: 0px;"
                        />
                      </Poptip>
                    </div>
                  );
                },
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      "现金利润x" +
                        Number(params.row.fenhong_gift_money_requirement.bili)
                    ),
                    h(
                      "div",
                      {
                        style: {
                          display: "inline-block"
                        }
                      },
                      [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "现金利润x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.fenhong_gift_money_requirement.bili
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].fenhong_gift_money_requirement.bili = e;
                            }
                          }
                        }),
                        "%"
                      ]
                    )
                  ])
              },
              {
                title: "上限金额",
                key: "fenhong_gift_money_requirement",
                align: "center",
                minWidth: 100,
                render: (h, params) =>
                  h("div", [
                    h(
                      "span",
                      {
                        style: {
                          display: !this.isEdit ? "inline-block" : "none"
                        }
                      },
                      Number(
                        params.row.fenhong_gift_money_requirement.money_max
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.fenhong_gift_money_requirement.money_max
                        ),
                        min: 0,
                        max: 9999999999
                        //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].fenhong_gift_money_requirement.money_max = e;
                        }
                      }
                    })
                  ])
              }
            ]
          },
          {
            title: "邀请者门槛",
            key: "gift_money_requirement",
            align: "center",
            children: [
              {
                title: "存款金额",
                key: "pay_beishu",
                align: "center",
                minWidth: 100,
                render: (h, params) => {
                  if (params.row.gift_money_requirement.pay_beishu == "0") {
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: !this.isEdit ? "inline-block" : "none"
                          }
                        },
                        "-"
                      ),
                      h("div", [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "好友礼金x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.gift_money_requirement.pay_beishu
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].gift_money_requirement.pay_beishu = e;
                            }
                          }
                        })
                      ])
                    ]);
                  } else {
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: !this.isEdit ? "inline-block" : "none"
                          }
                        },
                        "好友礼金x" +
                          Number(params.row.gift_money_requirement.pay_beishu)
                      ),
                      h("div", [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "好友礼金x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.gift_money_requirement.pay_beishu
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].gift_money_requirement.pay_beishu = e;
                            }
                          }
                        })
                      ])
                    ]);
                  }
                }
              },
              {
                title: "打码量",
                key: "bet_beishu",
                align: "center",
                minWidth: 100,
                renderHeader: (h, params) => {
                  return (
                    <div>
                      <span>打码量</span>
                      <Poptip trigger="hover" placement="top-end" transfer>
                        <div slot="content">
                          <p>邀请者打码量不区分游戏类型</p>
                        </div>
                        <Icons
                          type="bangzhutishi"
                          color="#E4E4E4"
                          size="16"
                          class="ib ml5"
                          style="paddingLeft: 0px;"
                        />
                      </Poptip>
                    </div>
                  );
                },
                render: (h, params) => {
                  if (params.row.gift_money_requirement.bet_beishu == "0") {
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: !this.isEdit ? "inline-block" : "none"
                          }
                        },
                        "-"
                      ),
                      h("div", [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "存款x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.gift_money_requirement.bet_beishu
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].gift_money_requirement.bet_beishu = e;
                            }
                          }
                        })
                      ])
                    ]);
                  } else {
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: !this.isEdit ? "inline-block" : "none"
                          }
                        },
                        "存款x" +
                          Number(params.row.gift_money_requirement.bet_beishu)
                      ),
                      h("div", [
                        h(
                          "span",
                          {
                            style: {
                              display: this.isEdit ? "inline-block" : "none"
                            }
                          },
                          "存款x"
                        ),
                        h("InputNumber", {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          },
                          class: "w30 ml5",
                          props: {
                            value: Number(
                              params.row.gift_money_requirement.bet_beishu
                            ),
                            min: 0,
                            max: 9999999999
                            //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                          },
                          on: {
                            "on-change": e => {
                              if (!e) e = 0;
                              this.table.data[
                                params.index
                              ].gift_money_requirement.bet_beishu = e;
                            }
                          }
                        })
                      ])
                    ]);
                  }
                }
              },
              {
                title: "邀请人数",
                key: "haoyou_renshu",
                align: "center",
                minWidth: 100,
                render: (h, params) => {
                  if (params.row.gift_money_requirement.haoyou_renshu == "0") {
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: !this.isEdit ? "inline-block" : "none"
                          }
                        },
                        "-"
                      ),
                      h("InputNumber", {
                        style: {
                          display: this.isEdit ? "inline-block" : "none"
                        },
                        class: "w80",
                        props: {
                          value: Number(
                            params.row.gift_money_requirement.haoyou_renshu
                          ),
                          min: 0,
                          max: 9999999999
                          //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                        },
                        on: {
                          "on-change": e => {
                            if (!e) e = 0;
                            this.table.data[
                              params.index
                            ].gift_money_requirement.haoyou_renshu = e;
                          }
                        }
                      })
                    ]);
                  } else {
                    return h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: !this.isEdit ? "inline-block" : "none"
                          }
                        },
                        Number(
                          params.row.gift_money_requirement.haoyou_renshu
                        )
                      ),
                      h("InputNumber", {
                        style: {
                          display: this.isEdit ? "inline-block" : "none"
                        },
                        class: "w80",
                        props: {
                          value: Number(
                            params.row.gift_money_requirement.haoyou_renshu
                          ),
                          min: 0,
                          max: 9999999999
                          //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                        },
                        on: {
                          "on-change": e => {
                            if (!e) e = 0;
                            this.table.data[
                              params.index
                            ].gift_money_requirement.haoyou_renshu = e;
                          }
                        }
                      })
                    ]);
                  }
                }
              },
            ]
          },{
            title:"操作",
            align:'center',
            minWidth: 90,
            render:(h,params)=>{
              return(
                <a class="cs"
                onClick={()=>{
                  this.onDelete(params);
                }}
                >删除</a>
               
              )
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.getData({
      siteId: this.$root.nowSite.id,
      classId: 0
    });
  },
  methods: {
    onDelete(params) {
      let text = `您确定删除【等级${params.row.level}】吗？`;
      let msg = `删除等级${params.row.level}成功`;
      const data = {
        id: params.row.id,
        siteId:this.$root.nowSite.id,
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          jinGuanJiaLeveInviteFriendsDel(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success({ content: msg });
              this.table.data.splice(params.index, 1);
            }
          });
        }
      });
    },
    addLevel() {
      //添加等级
      let obj = {
        level: this.table.data.length + 1,
        level_gift_money_requirement: { bili: 0, money_max: 0 },
        week_gift_money_requirement: { bili: 0, money_max: 0 },
        month_gift_money_requirement: { bili: 0, money_max: 0 },
        fenhong_gift_money_requirement: { bili: 0, money_max: 0 },
        gift_money_requirement: {
          pay_beishu: 0,
          bet_beishu: 0,
          haoyou_renshu: 0
        }
      };
      this.table.data.push(obj);
    },
    getData(data) {
      this.$root.startTableLoading();
      jinGuanJiaLeveInviteFriendsList(data)
        .then(res => {
          if (res && res.code == 200) {
            this.table.data = res.data;
            this.table.data.map(item => {
              item.fenhong_gift_money_requirement = JSON.parse(
                item.fenhong_gift_money_requirement
              );
              item.gift_money_requirement = JSON.parse(
                item.gift_money_requirement
              );
              item.level_gift_money_requirement = JSON.parse(
                item.level_gift_money_requirement
              );
              item.month_gift_money_requirement = JSON.parse(
                item.month_gift_money_requirement
              );
              item.week_gift_money_requirement = JSON.parse(
                item.week_gift_money_requirement
              );
            });
            this.$root.endTableLoading();

            this.spinShow = false;
          }
        })
        .catch(error => this.$root.endTableLoading());
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
.footer {
  border: 1px solid #dcdcdc;
  border-top: 0;
  line-height: 48px;
}
</style>


