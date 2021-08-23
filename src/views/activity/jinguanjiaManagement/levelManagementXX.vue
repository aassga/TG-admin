<template>
  <div>
    <div class="v2-search">
      <Button style="height:36px" type="primary" @click="selectMode">金管家模式</Button>
      <Button
        v-show="!isEdit && currentMode"
        class="fr"
        type="primary"
        style="height:36px"
        :loading="spinShow||$root.tableLoading"
        @click="
                    () => {
                        isEdit = !isEdit;
                    }
                "
      >编辑</Button>
      <div class="ib fr" v-show="isEdit">
        <Button
          class="mr20"
          @click="quxiao"
          style="height:36px"
          :loading="$root.tableLoading||spinShow"
        >取消</Button>
        <Button
          type="primary"
          style="height:36px"
          :loading="$root.tableLoading||spinShow"
          @click="submit"
        >保存</Button>
      </div>
    </div>
    <Row v-if="spinShow" style="height:300px;line-height:300px">
      <Spin size="large" fix v-if="spinShow">
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div' + t"></div>
        </div>
      </Spin>
    </Row>
    <div class="v2-search bb mt20 clearfix"  v-if="!spinShow&&modeBtns.length">
      <div class="fl">
        <span
          v-for="(item, i) in modeBtns"
          :key="i"
          class="modeBtns ib cs ft16"
          @click.stop="getType(item.class_name, item.id)"
          :class="currentModeId == item.id ? 'active' : ''"
        >
          {{item.class_name}}
          <Icon
            size="18"
             v-if="isEdit && currentModeId == item.id && item.class_name!='邀请者奖励'"
            class="close ml10"
            color="#888"
            @click.native="delTag(item.id)"
            type="md-close"
          />
        </span>
      </div>
      <div class="fr" v-show="currentModeId==0">
        <Poptip trigger="hover" placement="top-start" transfer width="900"  word-wrap>
          <div slot="content"  style="height: 500px;">
1.邀请者奖励，邀请者门槛适用于所有金管家类型，邀请者门槛也适用于所有奖励
2.列表中的好友礼金，好友周俸禄，好友月俸禄读取各金管家类型对应等级中的值
例：好友晋级礼金
如好友棋牌金管家1级晋级礼金为20，彩票金管家1级晋级礼金为40，当设置邀请者晋级礼金奖励占比为50%，邀请者达到存款和打码要求后，邀请者能得到的好友棋牌1级晋级礼金奖励为20*50%=10，能得到的彩票1级晋级礼金奖励为40*50%=20。
好友周俸禄，好友月俸禄也一样，读取好友各金管家对应等级的值

3.邀请者门槛：例，好友棋牌金管家好友1级晋级礼金为 20，
邀请者门槛：存款金额=好友礼金*5，打码量=存款*6
（1）邀请者要领取好友的晋级礼金的最低要求为：
存款金额=20*5=100，打码量=100*6=600
当邀请者存款200，则打码量要求=200*6=1200，才能获得好友的晋级礼金奖励
<span class="red-font">打码量要求根据邀请者的实际存款*倍数进行计算</span>
（2）邀请者晋级礼金奖励，周俸禄奖励，月俸禄奖励，分红奖励：邀请门槛存款金额,打码量和邀请人数要求共用，只要达到了存款金额，打码量，邀请人数要求，即可领取晋级礼金奖励，周俸禄奖励，月俸禄奖励，只是发放时间不同
如上方案列中邀请者存款200，则打码量要求=200*6=1200，达到了存款打码要求，当天即可发放邀请者晋级礼金，下次发周俸禄奖励时即可领取周俸禄奖励，下次发月俸禄奖励时即可领取月俸禄奖励，下次发放分红奖励时即可领取分红奖励（分红奖励：根据好友当月的现金利润占比进行计算，（现金利润=存款-取款）
<span class="red-font">（3）邀请人数说明：
a.当邀请者自身金管家等级 ≥ 5级时，按照列表中的邀请人数条件进行奖励发放
b.当邀请者自身金管家等级＜5级时，需至少邀请2人才可进行奖励发放
如列表中1~5级邀请人数条件均为1人，当邀请者自身为金管家0~4等级时，要拿到1~5级的邀请奖励需至少邀请2人才能得到奖励
当邀请者自身为金管家5级时，要拿到1~5级的邀请奖励只需邀请1人就能得到奖邀请励
c.邀请人数：邀请的每个会员必须有金管家等级才算有效的好友人数</span>

4.分红奖励：按照每个好友的现金利润占比进行计算（且在满足人数要求的情况下，对应人数好友必须同时大于等于当前等级才能领取当前等级分红奖励）
如 1等级邀请人数要求为3人，2等级人数要求也为3人，会员邀请了4个好友A,B,C,D， A在2等级，B在2等级 ,C在1等级,D在0等级，此时发放分红时，会员只能领取A,B,C,3个好友的的1等级分红，不能领取A,B2等级的分红，因为领取2等级分红需要有3个好友并且这3个好友都在2等级才能领取2等级分红，当A在2等级，B在2等级，C也晋升为2等级，D晋升为1等时，此时会员可领取A,B,C三个好友2等级的分红，可领取D的1等级分红，A,B,C,的1等级分红就不能再领了,只能领达到条件的最高级分红

5.发放方式：系统自动发放，需会员主动领取，只要达到要求，晋级礼金奖励当天可发放，每一等级只可领取一次，周俸禄奖励每周统计一次，每周一可领取一次，月俸禄奖励每月统计一次，每月一号可领取一次，分红奖励每月统计一次，每月2号下午15:00后领取一次

6.特殊情况：
晋级礼金奖励：如当邀请者一次直接达到4等级，那1，2，3，4等级的邀请晋级奖励会都发给邀请者
周俸禄奖励，月俸禄奖励，分红奖励：如当邀请者一次直接达到4等级的要求，那只会发放4等级邀请奖励给邀请者
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
    </div>
    <div v-if="!spinShow&&modeBtns.length == 0" class="txt-a" style="line-height:200px">
      <span class="else txt-a pl30 pr30 ib">
        <Icons type="danchuangtishi" color="red" :size="16" class="pl10"></Icons>请先创建金管家模式
      </span>
    </div>
    <div class="v2-table" v-if="modeBtns.length && !spinShow && currentModeId">
      <Tables
        ref="table"
        :value="currentModeId?table.data:table.data1"
        :columns="currentModeId?table.columns:table.columns1"
        :loading="$root.tableLoading"
        @on-delete="onDelete"
        :page="false"
      ></Tables>
      <footer
        class="txt-a footer c62Color cs"
        style="background: #f4faff;"
        v-if="isEdit && table.data.length < 100"
        @click="addLevel"
      >
        <Icons type="xinzeng" size="14" class="mr5"></Icons>添加等级
      </footer>
    </div>
    <InviteTable
      ref="invite"
      :isEdit="isEdit"
      :currentModeId="currentModeId"
      v-if="modeBtns.length && !spinShow && currentModeId== '0'"
    />
    <Modals title="金管家模式" ref="Modes" :width="600">
      <div slot="content" class="mb30 ml30 mr30">
        <Form :label-width="100" class="mt40">
          <FormItem label="模式类型">
            <Select class="w400x" multiple transfer v-model="currentMode">
              <Option
                :value="item"
                :disabled="modeName.includes(item)"
                v-for="item in modeList.filter(item=>!modeName.includes(item))"
                :key="item"
              >{{ item }}</Option>
            </Select>
          </FormItem>
        </Form>
        <Form :label-width="100" class="mt40">
          <FormItem label="领取类型">
            <Select class="w400x" transfer v-model="delivery_type">
              <Option value="system">系统自动派送</Option>
              <Option value="self">会员主动领取</Option>
            </Select>
          </FormItem>
        </Form>
        <div class="txt-a">
          <Button
            type="primary"
            class="jgj-btn"
            :loading="$root.tableLoading"
            @click="modeSubmit"
          >确认保存</Button>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Modals from "@/components/modals";
import Icons from "_c/icons";
import Tables from "_c/tables";
import InviteTable from "../components/invite-table";
import {
  jinGuanJiaClassList,
  jinGuanJiaLevelConfigList,
  jinGuanJiaClassCreate,
  jinGuanJiaLevelConfigEdit,
  jinGuanJiaLevelConfigDisable,
  jinGuanJiaModelDel,
  jinGuanJiaLeveInviteFriendsList,
  jinGuanJiaLeveInviteFriendsConfigEdit
} from "@/api/activity";
export default {
  name: "levelManagement",
  components: {
    Modals,
    Tables,
    Icons,
    InviteTable
  },
  data() {
    return {
      newDataSum: [],
      capAmount: 0,
      className: "",
      spinShow: true,
      isEdit: false,
      change: false,
      modeList: [], //模式下拉列表
      modeBtns: [], //模式导航按钮
      modeName: [],
      currentModeId: "",
      delivery_type: "self", //派发类型：system=系统自动派送，self=自己领取
      currentMode: [], //当前选中模式
      table: {
        data: [],
        pageSizeOpts: [20, 30, 40, 50],
        loading: true,
        columns: [
          {
            title: "金管家门槛奖励",
            key: "level_gift_money_requirement",
            align: "center",
            className:'bb13',
            children: [
              {
                title: "等级",
                key: "level",
                align: "center",
                minWidth: 40
              },
              {
                title: "累计打码",
                key: "betTotal",
                align: "center",
                minWidth: 120,
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
                        params.row.level_gift_money_requirement.betTotal
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.level_gift_money_requirement.betTotal
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
                          ].level_gift_money_requirement.betTotal = e;
                        }
                      }
                    })
                  ])
              },
              {
                title: "晋级礼金",
                key: "levelMoney",
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
                        params.row.level_gift_money_requirement.levelMoney
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.level_gift_money_requirement.levelMoney
                        ),
                        min: 0,
                        max: 99999999
                        // formatter:value => this.table.data[params.index].level_gift_money_requirement.levelMoney= value=  /\d+(\.\d{1,2})?/g.exec(`${value||0}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].level_gift_money_requirement.levelMoney = e;

                          this.table.data[params.index].inputStatus = true;
                          if (
                            (this.table.data[params.index].inputStatus = true)
                          ) {
                            this.table.data[
                              params.index
                            ].invitation_reward.month_gift_limit =
                              (this.table.data[params.index]
                                .level_gift_money_requirement.levelMoney *
                                this.table.data[params.index].invitation_reward
                                  .month_gift_percentage) /
                              100;
                          } else {
                            this.table.data.forEach((m, index) => {
                              if (
                                params.row.invitation_reward.month_gift_limit !=
                                (m.level_gift_money_requirement.levelMoney *
                                  m.invitation_reward.month_gift_percentage) /
                                  100
                              ) {
                                this.table.data[
                                  index
                                ].invitation_reward.month_gift_limit =
                                  params.row.invitation_reward.month_gift_limit;
                              }
                            });
                          }
                        }
                      }
                    })
                  ])
              },
              {
                title: "周俸禄",
                key: "weekMoney",
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
                        params.row.level_gift_money_requirement.weekMoney
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.level_gift_money_requirement.weekMoney
                        ),
                        min: 0,
                        max: 99999999
                        // formatter:value =>this.table.data[params.index].level_gift_money_requirement.weekMoney= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].level_gift_money_requirement.weekMoney = e;
                        }
                      }
                    })
                  ])
              },
              {
                title: "月俸禄",
                key: "level_gift_money_requirement",
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
                        params.row.level_gift_money_requirement.monthMoney
                      ).toFixed(2)
                    ),
                    h("InputNumber", {
                      style: { display: this.isEdit ? "inline-block" : "none" },
                      class: "w80",
                      props: {
                        value: Number(
                          params.row.level_gift_money_requirement.monthMoney
                        ),
                        min: 0,
                        max: 99999999
                        //  formatter:value =>this.table.data[params.index].level_gift_money_requirement.monthMoney= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].level_gift_money_requirement.monthMoney = e;
                          // 	this.table.data[params.index].inputStatus = true;
                          // 	if (this.table.data[params.index].inputStatus== true) {
                          // 		this.table.data[	params.index	].invitation_reward.month_gift_limit =(this.table.data[params.index].level_gift_money_requirement.monthMoney *	this.table.data[params.index].invitation_reward	.month_gift_percentage) /100;
                          // } else {
                          // 		this.table.data.forEach((m, index) => {
                          // 			if (	params.row.invitation_reward.month_gift_limit !=	(m.level_gift_money_requirement.monthMoney *	m.invitation_reward.month_gift_percentage) /	100
                          // 			) {
                          // 				this.table.data[index].invitation_reward.month_gift_limit =	params.row.invitation_reward.month_gift_limit;
                          // 			}
                          // 		});
                          // }
                        }
                      }
                    })
                  ])
              }
            ]
          },
          {
            title: "领取周俸禄/月俸禄条件",
            key: "week_gift_money_requirement",
            align: "center",
            className:'bb13',
            children: [
              // {
              //   title: "当周存款",
              //   key: "payTotal",
              //   align: "center",
              //   minWidth: 110,
              //   render: (h, params) =>
              //     h("div", [
              //       h(
              //         "span",
              //         {
              //           style: {
              //             display: !this.isEdit ? "inline-block" : "none"
              //           }
              //         },
              //         "周俸禄x" +
              //           Number(params.row.week_gift_money_requirement.payTotal)
              //       ),
              //       h("div", [
              //         h(
              //           "span",
              //           {
              //             style: {
              //               display: this.isEdit ? "inline-block" : "none"
              //             }
              //           },
              //           "周俸禄x"
              //         ),
              //         h("InputNumber", {
              //           style: {
              //             display: this.isEdit ? "inline-block" : "none"
              //           },
              //           class: "w100 w40l",
              //           props: {
              //             value: Number(
              //               params.row.week_gift_money_requirement.payTotal
              //             ),
              //             min: 0,
              //             max: 99999999
              //             // formatter:value =>this.table.data[params.index].week_gift_money_requirement.payTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
              //           },
              //           on: {
              //             "on-change": e => {
              //               if (!e) e = 0;
              //               this.table.data[
              //                 params.index
              //               ].week_gift_money_requirement.payTotal = e;
              //             }
              //           }
              //         })
              //       ])
              //     ])
              // },
              {
                title: "当周打码",
                key: "betTotal",
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
                      "周俸禄x" +
                        Number(params.row.week_gift_money_requirement.betTotal)
                    ),
                    h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          }
                        },
                        "周俸禄x"
                      ),
                      h("InputNumber", {
                        style: {
                          display: this.isEdit ? "inline-block" : "none"
                        },
                        class: "w100 w40l",
                        props: {
                          value: Number(
                            params.row.week_gift_money_requirement.betTotal
                          ),
                          min: 0,
                          max: 99999999
                          //formatter:value =>this.table.data[params.index].week_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                        },
                        on: {
                          "on-change": e => {
                            if (!e) e = 0;
                            this.table.data[
                              params.index
                            ].week_gift_money_requirement.betTotal = e;
                          }
                        }
                      })
                    ])
                  ])
              },
                {
                title: "当月打码",
                key: "betTotal",
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
                      "月俸禄x" +
                        Number(params.row.month_gift_money_requirement.betTotal)
                    ),
                    h("div", [
                      h(
                        "span",
                        {
                          style: {
                            display: this.isEdit ? "inline-block" : "none"
                          }
                        },
                        "月俸禄x"
                      ),
                      h("InputNumber", {
                        style: {
                          display: this.isEdit ? "inline-block" : "none"
                        },
                        class: "w100 w40l",
                        props: {
                          value: Number(
                            params.row.month_gift_money_requirement.betTotal
                          ),
                          min: 0,
                          max: 99999999
                          // formatter:value =>this.table.data[params.index].month_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                        },
                        on: {
                          "on-change": e => {
                            if (!e) e = 0;
                            this.table.data[
                              params.index
                            ].month_gift_money_requirement.betTotal = e;
                          }
                        }
                      })
                    ])
                  ])
              },
              // {
              //   title: "存款次数",
              //   key: "payCount",
              //   align: "center",
              //   minWidth: 65,
              //   render: (h, params) =>
              //     h("div", [
              //       h(
              //         "span",
              //         {
              //           style: {
              //             display: !this.isEdit ? "inline-block" : "none"
              //           }
              //         },
              //         Number(params.row.week_gift_money_requirement.payCount)
              //       ),
              //       h("InputNumber", {
              //         style: { display: this.isEdit ? "inline-block" : "none" },
              //         class: "w80",
              //         props: {
              //           value: Number(
              //             params.row.week_gift_money_requirement.payCount
              //           ),
              //           min: 0,
              //           max: 99999999
              //           // formatter:value =>this.table.data[params.index].week_gift_money_requirement.payCount= value
              //         },
              //         on: {
              //           "on-change": e => {
              //             if (!e) e = 0;
              //             this.table.data[
              //               params.index
              //             ].week_gift_money_requirement.payCount = e;
              //           }
              //         }
              //       })
              //     ])
              // }
            ]
          },
          // {
          //   // title: "领取月俸禄条件",
          //   // key: "month_gift_money_requirement",
          //   // align: "center",
          //   // className:'bb13',
          //   children: [
          //     // {
          //     //   title: "当月存款",
          //     //   key: "payTotal",
          //     //   align: "center",
          //     //   minWidth: 110,
          //     //   render: (h, params) =>
          //     //     h("div", [
          //     //       h(
          //     //         "span",
          //     //         {
          //     //           style: {
          //     //             display: !this.isEdit ? "inline-block" : "none"
          //     //           }
          //     //         },
          //     //         "月俸禄x" +
          //     //           Number(params.row.month_gift_money_requirement.payTotal)
          //     //       ),
          //     //       h("div", [
          //     //         h(
          //     //           "span",
          //     //           {
          //     //             style: {
          //     //               display: this.isEdit ? "inline-block" : "none"
          //     //             }
          //     //           },
          //     //           "月俸禄x"
          //     //         ),
          //     //         h("InputNumber", {
          //     //           style: {
          //     //             display: this.isEdit ? "inline-block" : "none"
          //     //           },
          //     //           class: "w100 w40l",
          //     //           props: {
          //     //             value: Number(
          //     //               params.row.month_gift_money_requirement.payTotal
          //     //             ),
          //     //             min: 0,
          //     //             max: 99999999
          //     //             //  formatter:value =>this.table.data[params.index].month_gift_money_requirement.payTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
          //     //           },
          //     //           on: {
          //     //             "on-change": e => {
          //     //               if (!e) e = 0;
          //     //               this.table.data[
          //     //                 params.index
          //     //               ].month_gift_money_requirement.payTotal = e;
          //     //             }
          //     //           }
          //     //         })
          //     //       ])
          //     //     ])
          //     // },
          //     // {
          //     //   title: "当月打码",
          //     //   key: "betTotal",
          //     //   align: "center",
          //     //   minWidth: 110,
          //     //   render: (h, params) =>
          //     //     h("div", [
          //     //       h(
          //     //         "span",
          //     //         {
          //     //           style: {
          //     //             display: !this.isEdit ? "inline-block" : "none"
          //     //           }
          //     //         },
          //     //         "月存款x" +
          //     //           Number(params.row.month_gift_money_requirement.betTotal)
          //     //       ),
          //     //       h("div", [
          //     //         h(
          //     //           "span",
          //     //           {
          //     //             style: {
          //     //               display: this.isEdit ? "inline-block" : "none"
          //     //             }
          //     //           },
          //     //           "月存款x"
          //     //         ),
          //     //         h("InputNumber", {
          //     //           style: {
          //     //             display: this.isEdit ? "inline-block" : "none"
          //     //           },
          //     //           class: "w100 w40l",
          //     //           props: {
          //     //             value: Number(
          //     //               params.row.month_gift_money_requirement.betTotal
          //     //             ),
          //     //             min: 0,
          //     //             max: 99999999
          //     //             // formatter:value =>this.table.data[params.index].month_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
          //     //           },
          //     //           on: {
          //     //             "on-change": e => {
          //     //               if (!e) e = 0;
          //     //               this.table.data[
          //     //                 params.index
          //     //               ].month_gift_money_requirement.betTotal = e;
          //     //             }
          //     //           }
          //     //         })
          //     //       ])
          //     //     ])
          //     // },
          //     // {
          //     //   title: "存款次数",
          //     //   key: "payCount",
          //     //   align: "center",
          //     //   minWidth: 60,
          //     //   render: (h, params) =>
          //     //     h("div", [
          //     //       h(
          //     //         "span",
          //     //         {
          //     //           style: {
          //     //             display: !this.isEdit ? "inline-block" : "none"
          //     //           }
          //     //         },
          //     //         Number(params.row.month_gift_money_requirement.payCount)
          //     //       ),
          //     //       h("InputNumber", {
          //     //         style: { display: this.isEdit ? "inline-block" : "none" },
          //     //         class: "w80",
          //     //         props: {
          //     //           value: Number(
          //     //             params.row.month_gift_money_requirement.payCount
          //     //           ),
          //     //           min: 0,
          //     //           max: 99999999
          //     //           // formatter:value =>this.table.data[params.index].month_gift_money_requirement.payCount= value
          //     //         },
          //     //         on: {
          //     //           "on-change": e => {
          //     //             if (!e) e = 0;
          //     //             this.table.data[
          //     //               params.index
          //     //             ].month_gift_money_requirement.payCount = e;
          //     //           }
          //     //         }
          //     //       })
          //     //     ])
          //     // }
          //   ]
          // },
          // {
          //   title: "邀请者奖励",
          //   key: "invitation_reward",
          //   align: "center",
          //   children: [
          //     {
          //       title: "礼金占比",
          //       key: "month_gift_percentage",
          //       align: "center",
          //       minWidth: 80,
          //       render: (h, params) =>
          //         h("div", [
          //           h(
          //             "span",
          //             {
          //               style: {
          //                 display: !this.isEdit ? "inline-block" : "none"
          //               }
          //             },

          //             Number(params.row.invitation_reward.month_gift_percentage)
          //           ),
          //           h("InputNumber", {
          //             style: { display: this.isEdit ? "inline-block" : "none" },
          //             class: "w70",
          //             props: {
          //               value: Number(
          //                 params.row.invitation_reward.month_gift_percentage
          //               ),
          //               min: 0,
          //               max: 99999999
          //               //  formatter:value =>this.table.data[params.index].invitation_reward.month_gift_percentage= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
          //             },
          //             on: {
          //               "on-change": e => {
          //                 if (!e) e = 0;
          //                 this.table.data[
          //                   params.index
          //                 ].invitation_reward.month_gift_percentage = e;
          //                 this.table.data[params.index].inputStatus = true;
          //                 if (
          //                   this.table.data[params.index].inputStatus == true
          //                 ) {
          //                   this.table.data[
          //                     params.index
          //                   ].invitation_reward.month_gift_limit =
          //                     (this.table.data[params.index]
          //                       .level_gift_money_requirement.levelMoney *
          //                       this.table.data[params.index].invitation_reward
          //                         .month_gift_percentage) /
          //                     100;
          //                 } else {
          //                   this.table.data.forEach((m, index) => {
          //                     if (
          //                       params.row.invitation_reward.month_gift_limit !=
          //                       (m.level_gift_money_requirement.levelMoney *
          //                         m.invitation_reward.month_gift_percentage) /
          //                         100
          //                     ) {
          //                       this.table.data[
          //                         index
          //                       ].invitation_reward.month_gift_limit =
          //                         params.row.invitation_reward.month_gift_limit;
          //                     }
          //                   });
          //                 }
          //               }
          //             }
          //           }),
          //           "%"
          //         ])
          //     },
          //     {
          //       title: "上限金额",
          //       key: "month_gift_limit",
          //       align: "center",
          //       minWidth: 90,
          //       render: (h, params) =>
          //         h("div", [
          //           h(
          //             "span",
          //             {
          //               style: {
          //                 display: !this.isEdit ? "inline-block" : "none"
          //               }
          //             },
          //             Number(
          //               params.row.invitation_reward.month_gift_limit
          //             ).toFixed(2)
          //           ),
          //           h("InputNumber", {
          //             style: { display: this.isEdit ? "inline-block" : "none" },
          //             class: "w80",
          //             props: {
          //               value:
          //                 this.isEdit &&
          //                 this.table.data[params.index].inputStatus == true
          //                   ? Number(
          //                       (this.table.data[params.index]
          //                         .level_gift_money_requirement.levelMoney *
          //                         this.table.data[params.index]
          //                           .invitation_reward.month_gift_percentage) /
          //                         100
          //                     )
          //                   : Number(
          //                       this.table.data[params.index].invitation_reward
          //                         .month_gift_limit
          //                     ),
          //               min: 0,
          //               max: 99999999
          //               // formatter:value =>this.table.data[params.index].invitation_reward.month_gift_limit= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
          //             },
          //             on: {
          //               "on-change": e => {
          //                 this.$nextTick(function() {
          //                   if (!e) e = 0;
          //                   this.table.data[
          //                     params.index
          //                   ].invitation_reward.month_gift_limit = e;
          //                 });
          //               }
          //             }
          //           })
          //         ])
          //     },
          //     {
          //       title: "存款金额",
          //       key: "payTotal",
          //       align: "center",
          //       minWidth: 90,
          //       render: (h, params) =>
          //         h("div", [
          //           h(
          //             "span",
          //             {
          //               style: {
          //                 display: !this.isEdit ? "inline-block" : "none"
          //               }
          //             },
          //             "礼金x" + Number(params.row.invitation_reward.payTotal)
          //           ),
          //           h("div", [
          //             h(
          //               "span",
          //               {
          //                 style: {
          //                   display: this.isEdit ? "inline-block" : "none"
          //                 }
          //               },
          //               "礼金x"
          //             ),
          //             h("InputNumber", {
          //               style: {
          //                 display: this.isEdit ? "inline-block" : "none"
          //               },
          //               class: "w40l",
          //               props: {
          //                 value: Number(params.row.invitation_reward.payTotal),
          //                 min: 0,
          //                 max: 99999999
          //                 // formatter:value =>this.table.data[params.index].invitation_reward.payTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
          //               },
          //               on: {
          //                 "on-change": e => {
          //                   this.$nextTick(function() {
          //                     if (!e) e = 0;
          //                     this.table.data[
          //                       params.index
          //                     ].invitation_reward.payTotal = e;
          //                   });
          //                 }
          //               }
          //             })
          //           ])
          //         ])
          //     },
          //     {
          //       //title: "打码量",
          //       key: "betTotal",
          //       align: "center",
          //       minWidth: 90,
          //       renderHeader: (h, params) => {
          //         return (
          //           <div>
          //             <span>打码量</span>
          //             <Poptip trigger="hover" placement="top-end" transfer>
          //               <div slot="content">
          //                 <p>邀请者打码量不区分游戏类型</p>
          //                 <p>会员晋级,周俸禄,月俸禄打码需区分游戏类型</p>
          //               </div>
          //               <Icons
          //                 type="bangzhutishi"
          //                 color="#E4E4E4"
          //                 size="16"
          //                 class="ib ml5"
          //                 style="paddingLeft: 0px;"
          //               />
          //             </Poptip>
          //           </div>
          //         );
          //       },
          //       render: (h, params) =>
          //         h("div", [
          //           h(
          //             "span",
          //             {
          //               style: {
          //                 display: !this.isEdit ? "inline-block" : "none"
          //               }
          //             },
          //             "存款x" + Number(params.row.invitation_reward.betTotal)
          //           ),
          //           h("div", [
          //             h(
          //               "span",
          //               {
          //                 style: {
          //                   display: this.isEdit ? "inline-block" : "none"
          //                 }
          //               },
          //               "存款x"
          //             ),
          //             h("InputNumber", {
          //               style: {
          //                 display: this.isEdit ? "inline-block" : "none"
          //               },
          //               class: "w40l",
          //               props: {
          //                 value: Number(params.row.invitation_reward.betTotal),
          //                 min: 0,
          //                 max: 99999999
          //                 // formatter:value =>this.table.data[params.index].invitation_reward.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
          //               },
          //               on: {
          //                 "on-change": e => {
          //                   this.$nextTick(function() {
          //                     if (!e) e = 0;
          //                     this.table.data[
          //                       params.index
          //                     ].invitation_reward.betTotal = e;
          //                   });
          //                 }
          //               }
          //             })
          //           ])
          //         ])
          //     }
          //   ]
          // },
          {
            title: "  ",
            align: "center",
            className:'bb13',
            children: [
              {
                title: "操作",
                align: "center",
                minWidth: 90,
                render: (h, params) => {
                  let color = params.row.status == "yes" ? "#2D8cF0" : "red";
                  if (this.isEdit) {
                    //let color1 = params.row.status?'#2D8cF0':'red'
                    return (
                      <span
                        class="pl5  pr5"
                        class={params.row.status ? "" : "cs"}
                        onClick={() => {
                          this.cancel(params);
                        }}
                        style="color:#2D8cF0"
                      >
                        {params.row.status ? "删除" : "删除"}
                      </span>
                    );
                  } else {
                    return (
                      <div>
                        <span
                          class="pl5  pr5 cs"
                          style={{ color }}
                          onClick={() => {
                            this.setStatus(params);
                          }}
                        >
                          {params.row.status == "yes" ? "正常" : "停用"}
                        </span>
                        <span
                          class="blue-font ml5 mr10"
                          onClick={() => {
                            this.onDelete(params);
                          }}
                        >
                          删除
                        </span>
                      </div>
                    );
                  }
                }
              }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    this.getSeletList();
  },
  methods: {
    delTag(id) {
      let text = `您确定删除此条记录吗？`;
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          let data = {
            siteId: this.$root.nowSite.id,
            id
          };
          jinGuanJiaModelDel(data, true).then(res => {
            this.spinShow = true;
            if (res && res.code == 200) {
              this.getSeletList();
              this.$Message.success("删除成功");
            }
          });
        }
      });
    },
    getType(className, id) {
      if (this.currentModeId == id) return;
      this.className = className;
      this.currentModeId = id;
      if (this.currentModeId == "0") {
        return;
      } else {
        this.getData(
          {
            siteId: this.$root.nowSite.id,
            classId: this.currentModeId
          },
          "getType"
        );
      }
    },
    selectMode() {
      //模式选择
      this.currentMode = [];
      this.$refs.Modes.show();
    },
    onDelete(params) {
      let text = `您确定删除【等级${params.row.level}】吗？`;
      let msg = `删除${params.row.level}成功`;
      const data = {
        siteId: this.$root.nowSite.id,
        id: params.row.id,
        status: "delete"
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          jinGuanJiaLevelConfigDisable(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success({ content: msg });
              this.table.data.splice(params.index, 1);
            }
          });
        }
      });
    },
    quxiao() {
      this.getData({
        siteId: this.$root.nowSite.id,
        classId: this.currentModeId
      });
      this.isEdit = false;
    },
    addLevel() {
      //添加等级
      let obj = {
        level: this.table.data.length + 1,
        level_gift_money_requirement: {
          betTotal: 0,
          levelMoney: 0,
          weekMoney: 0,
          monthMoney: 0
        },
        week_gift_money_requirement: { payTotal: 0, betTotal: 0, payCount: 0 },
        month_gift_money_requirement: { payTotal: 0, betTotal: 0, payCount: 0 },
        invitation_reward: {
          month_gift_percentage: 0,
          month_gift_limit: 0,
          payTotal: 0,
          betTotal: 0
        }
      };
      this.table.data.push(obj);
    },
    setStatus(params) {
      //修改状态
      let msg = `您确定${params.row.status == "yes" ? "停用" : "启用"}${
        this.className
      }【等级${params.row.level}】吗？`;
      this.$Tip.confirm({
        content: msg,
        onOk: () => {
          let data = {
            siteId: this.$root.nowSite.id,
            id: params.row.id,
            status: params.row.status == "yes" ? "no" : "yes"
          };
          jinGuanJiaLevelConfigDisable(data, true).then(res => {
            if (res && res.code == 200) {
              this.$Message.success(
                `${params.row.status == "yes" ? "停用" : "启用"}成功`
              );
              this.getData({
                siteId: this.$root.nowSite.id,
                classId: this.currentModeId
              });
            }
          });
        }
      });
    },
    getSeletList() {
      //获取模式下拉列表
      let data = {
        siteId: this.$root.nowSite.id,
        type: "select"
      };
      jinGuanJiaClassList(data).then(res => {
        if (res && res.code == 200) {
          this.modeList = res.data.list;
          this.currentMode = res.data.current.toString();
          if (this.currentMode && this.modeList.length) {
            this.getModeBtn();
          } else {
            this.currentModeId = "";
            this.modeName = [];
            this.spinShow = false;
          }
        }
      });
    },
    modeSubmit() {
      if (!this.currentMode.length) {
        this.$Message.error("请选择模式");
        return;
      }
      //选择模式列表提交
      let data = {
        siteId: this.$root.nowSite.id,
        delivery_type: this.delivery_type,
        class_name: this.currentMode.toString()
      };
      jinGuanJiaClassCreate(data, true).then(res => {
        if (res && res.code == 200) this.getModeBtn();
      });
      this.$refs.Modes.hide();
    },
    getModeBtn() {
      let data = {
        siteId: this.$root.nowSite.id,
        type: "classNameList"
      };
      jinGuanJiaClassList(data).then(res => {
        if (res && res.code) {
          this.modeBtns = res.data;
          this.modeName = [];
          this.modeBtns.map(t => {
            if (t.class_name.includes("/")) {
              let arr = t.class_name.split("/");
              arr.forEach(m => {
                this.modeName.push(m.replace("金管家", ""));
              });
            } else {
              this.modeName.push(t.class_name.replace("金管家", ""));
            }
          });
          this.currentModeId = this.modeBtns[0].id;
          this.className = this.modeBtns[0].class_name;
          this.getData({
            siteId: this.$root.nowSite.id,
            classId: this.currentModeId
          });
        }
      });
    },
    cancel(params) {
      //取消
      this.table.data.splice(params.index, 1);
      this.table.data.map((item, i) => {
        item.level = i + 1;
      });
    },
    getData(data, type) {
      //获取列表数据
      this.$root.startTableLoading();
      jinGuanJiaLevelConfigList(data)
        .then(res => {
          if (res && res.code == 200) {
            this.table.data = res.data;
            this.table.data.map(item => {
              item.level_gift_money_requirement = JSON.parse(
                item.level_gift_money_requirement
              );
              item.week_gift_money_requirement = JSON.parse(
                item.week_gift_money_requirement
              );
              item.month_gift_money_requirement = JSON.parse(
                item.month_gift_money_requirement
              );
              item.invitation_reward = JSON.parse(item.invitation_reward);
            });
            this.$root.endTableLoading();
            if (type != "getType") this.isEdit = false;
            this.spinShow = false;
          }
        })
        .catch(error => this.$root.endTableLoading());
    },
    // getTabeData(val){
    //   this.table.data = val;
    // },
    submit() {
      this.$root.startTableLoading();
      let newDate = [];
      this.table.data.forEach(k => {
        for (let key in k) {
          if (
            key == "initRowIndex" ||
            key == "siteId" ||
            key == "class_id" ||
            key == "id"
          ) {
            delete k[key];
          }
        }
      });
      if (this.currentModeId) {
        this.table.data.map(item => {
          let obj = {
            level: item.level,
            level_gift_money_requirement: JSON.stringify(
              item.level_gift_money_requirement
            ),
            week_gift_money_requirement: JSON.stringify(
              item.week_gift_money_requirement
            ),
            month_gift_money_requirement: JSON.stringify(
              item.month_gift_money_requirement
            ),
            invitation_reward: JSON.stringify(item.invitation_reward)
          };
          newDate.push(obj);
        });
        let data = {
          siteId: this.$root.nowSite.id,
          classId: this.currentModeId,
          updateData: JSON.stringify(newDate)
        };
        jinGuanJiaLevelConfigEdit(data, true)
          .then(res => {
            if (res && res.code == 200) this.$Message.success("更新成功");
            this.getData({
              siteId: this.$root.nowSite.id,
              classId: this.currentModeId
            });
          })
          .catch(error => this.$root.endTableLoading());
      } else {
        this.table.data = this.$refs.invite.table.data;
        this.table.data.map(item => {
          let obj = {
            level: item.level,
            level_gift_money_requirement: JSON.stringify(
              item.level_gift_money_requirement
            ),
            week_gift_money_requirement: JSON.stringify(
              item.week_gift_money_requirement
            ),
            month_gift_money_requirement: JSON.stringify(
              item.month_gift_money_requirement
            ),
            fenhong_gift_money_requirement: JSON.stringify(
              item.fenhong_gift_money_requirement
            ),
            gift_money_requirement: JSON.stringify(item.gift_money_requirement)
          };
          newDate.push(obj);
        });
        let data = {
          siteId: this.$root.nowSite.id,
          classId: this.currentModeId,
          updateData: JSON.stringify(newDate)
        };
        jinGuanJiaLeveInviteFriendsConfigEdit(data, true)
          .then(res => {
            if (res && res.code == 200) {
              this.isEdit = false;
              this.$Message.success("更新成功");
            }
            this.getData1({
              siteId: this.$root.nowSite.id,
              classId: this.currentModeId
            });
          })
          .catch(error => this.$root.endTableLoading());
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
.modeBtns {
  border: 0;
  border-radius: 0;
  line-height: 36px;
  height: 36px;
  text-align: center;
  padding: 0 15px;
}
/deep/.bb13{
    border-bottom: 1.3px solid #dcdcdc !important;
}
.active {
  border: 1px solid #2d8cf0;
  border-bottom: 0;
  color: #2d8cf0;
  box-sizing: border-box !important;
}
.footer {
  border: 1px solid #dcdcdc;
  border-top: 0;
  line-height: 48px;
}
.else {
  line-height: 40px;
  height: 40px;
  background: rgba(137, 180, 226, 0.1);
  border-radius: 5px;
}
//头部样式
/deep/.ivu-table-header thead tr:nth-child(1) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 1rem;
    }
}
/deep/.ivu-table-header thead tr:nth-child(2) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 0.9375rem;
    }
}
.close:hover {
  color: #444 !important;
}
//添加等级样式调整
/deep/.ivu-row {
  margin-top: 0px !important;
}
.text p{
  white-space:pre-wrap
}
</style>


