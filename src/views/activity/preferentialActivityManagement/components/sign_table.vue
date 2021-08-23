<template>
  <div>
    <div>
      <Tables
        ref="table"
        :value="table.data"
        :columns="table.columns1.length ? table.columns1 : table.columns"
        :page="false"
        :loading="$root.tableLoading"
      >
      </Tables>
      <div
        slot="more"
        class="mt30 iconColor ft14"
        v-if="chessList.includes(this.$root.nowSite.id)"
      >
        <div>
          *温馨提示：会员达到相应条件当日将获得相应签到礼金，每日每个用户只有一次签到机会，领取时间为当日晚22:00:00：00~24:00:00
        </div>
        <div class="mt20">
          <p>*活动规则：</p>
          <div class="mt5">
            <p>
              1.此活动功能是根据会员当日存款/打码/输赢统计，会员达到指定条件后领取相应签到礼金，所得礼金需一倍流水方可提款
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：管理员在后台配置3个条件，存款/输赢/打码，那么系统会按照当天会员达到3个条件中的最高档来派送礼金。
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：管理员在后台配置2个条件，输赢/打码，那么系统会按照当天会员达到2个条件中的最高档来派送礼金。
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：管理员在后台配置1个条件，打码，那么系统会按照当天会员达到打码量计算礼金。
            </p>
          </div>
          <div class="mt20">
            <p>2.后台派送礼金可按照百分比计算也可按照固定金额计算</p>
            <p>
              &nbsp;&nbsp;&nbsp;例：百分比计算，例如设置存款100-10000元，赠送比例1%，会员存款金额1000元，那么签到礼金将获得1000*1%=10元
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：按固定金额计算，例如打码100-10000元，奖金10元，会员达到100元以上就按10元派送
            </p>
          </div>
          <div class="mt20">
            <p>3.输赢计算方式输100元和赢100元是等同</p>
          </div>
          <div class="mt20">
            <p>4.存款/输赢/打码统计时间都按照北京时间计算</p>
          </div>
        </div>
      </div>
      <div slot="more" class="mt30 iconColor ft14" v-else>
        <div>
          *温馨提示：会员达到相应条件将获得相应签到礼金，每日每个用户只有一次签到机会
        </div>
        <div class="mt20">
          <p>*活动规则：</p>
          <div class="mt5">
            <p>
              1.此活动功能是根据会员前一日存款/打码/输赢统计，会员达到指定条件后领取相应签到礼金，所得礼金需一倍流水方可提款
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：管理员在后台配置3个条件，存款/输赢/打码，那么系统会按照当天会员达到3个条件中的最高档来派送礼金。
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：管理员在后台配置2个条件，输赢/打码，那么系统会按照当天会员达到2个条件中的最高档来派送礼金。
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：管理员在后台配置1个条件，打码，那么系统会按照当天会员达到打码量计算礼金。
            </p>
          </div>
          <div class="mt20">
            <p>2.后台派送礼金可按照百分比计算也可按照固定金额计算</p>
            <p>
              &nbsp;&nbsp;&nbsp;例：百分比计算，例如设置存款100-10000元，赠送比例1%，会员存款金额1000元，那么签到礼金将获得1000*1%=10元
            </p>
            <p>
              &nbsp;&nbsp;&nbsp;例：按固定金额计算，例如打码100-10000元，奖金10元，会员达到100元以上就按10元派送
            </p>
          </div>
          <div class="mt20">
            <p>3.输赢计算方式输100元和赢100元是等同</p>
          </div>
          <div class="mt20">
            <p>4.存款/输赢/打码统计时间都按照北京时间计算</p>
          </div>
          <div class="mt20">
            <p>5.未达到条件是指当天新会员注册领取的签到礼金。</p>
          </div>
        </div>
      </div>
    </div>
    <Modals
      ref="weekModal"
      :title="weekTitle"
      :width="730"
      @closeModal="closeModal"
    >
      <div slot="content" class="pt30">
        <Form
          class="clearfix"
          :label-width="200"
          ref="formKey"
          :model="formKey"
          :rules="rules"
        >
          <FormItem label="统计类型" prop="info_type">
            <Input
              class="w400x info_type"
              v-model="formKey.info_type"
              readonly
            />
          </FormItem>
          <FormItem label="打码倍数" prop="bet_beishu">
            <Input class="w400x info_type" v-model="formKey.bet_beishu" />
          </FormItem>
          <div
            class="clearfix"
            v-if="level_range && level_range.includes('bet')"
          >
            <FormItem
              class="ib fl"
              :label="isQipai ? '今日打码' : '昨日打码'"
              prop="bet_min"
            >
              <InputNumber
                class="w400x"
                v-model="formKey.bet_min"
                placeholder="请输最低打码金额"
                :min="0"
                :max="9999999999.0"
              />
            </FormItem>
            <FormItem class="ib fl" style="margin-left: -195px" prop="bet_max">
              <InputNumber
                class="w180x"
                v-model="formKey.bet_max"
                placeholder="上限金额"
                :min="0"
                :max="9999999999.0"
                style="display: none"
              />
            </FormItem>
          </div>
          <div
            class="clearfix"
            v-if="level_range && level_range.includes('shuying')"
          >
            <FormItem
              class="ib fl"
              :label="isQipai ? '今日输赢' : '昨日输赢'"
              prop="shuying_min"
            >
              <InputNumber
                class="w400x"
                v-model="formKey.shuying_min"
                placeholder="请输入最低输赢金额"
                :min="0"
                :max="9999999999.0"
              />
            </FormItem>
            <FormItem
              class="ib fl"
              style="margin-left: -195px"
              prop="shuying_max"
            >
              <InputNumber
                class="w180x"
                v-model="formKey.shuying_max"
                placeholder="上限金额"
                :min="0"
                :max="9999999999.0"
                style="display: none"
              />
            </FormItem>
          </div>
          <div
            class="clearfix"
            v-if="level_range && level_range.includes('pay')"
          >
            <FormItem
              class="ib fl"
              :label="isQipai ? '今日存款' : '昨日存款'"
              prop="pay_min"
            >
              <InputNumber
                class="w400x"
                v-model="formKey.pay_min"
                placeholder="请输入最低存款金额"
                :min="0"
                :max="9999999999.0"
              />
            </FormItem>
            <FormItem class="ib fl" style="margin-left: -195px" prop="pay_max">
              <InputNumber
                class="w180x"
                v-model="formKey.pay_max"
                placeholder="上限金额"
                :min="0"
                :max="9999999999.0"
                style="display: none"
              />
            </FormItem>
          </div>
          <div>
            <FormItem label="派发类型">
              <RadioGroup v-model="formKey.send_type">
                <Radio label="gift_money" class="mr40">固定金额</Radio>
                <Radio label="bili">按比例</Radio>
              </RadioGroup>
            </FormItem>
          </div>
          <div v-if="formKey.send_type == 'bili'">
            <FormItem label="奖金占比" prop="bili">
              <InputNumber
                class="w400x"
                v-model="formKey.bili"
                placeholder="请输入红包占比"
                :max="9999999999.0"
              /><span class="ml5">%</span>
            </FormItem>
          </div>
          <div v-if="formKey.send_type == 'gift_money'">
            <FormItem label="固定金额" prop="gift_money">
              <InputNumber
                class="w400x"
                v-model="formKey.gift_money"
                placeholder="请输入奖金金额"
                :max="9999999999.0"
              />
            </FormItem>
          </div>
          <div v-if="formKey.send_type == 'bili'">
            <FormItem label="奖金最高" prop="gift_money_max">
              <InputNumber
                class="w400x"
                v-model="formKey.gift_money_max"
                placeholder="请输奖金上限"
                :max="9999999999.0"
              />
            </FormItem>
          </div>
          <!-- <FormItem label="未达条件" prop="weidatiaojian">
                        <InputNumber class="w400x" v-model="formKey.weidatiaojian" placeholder="请输入奖金金额" :max="9999999999.0" />
                    </FormItem> -->

          <FormItem class="mt50 mb20">
            <Button
              type="primary"
              class="ivu addSave ml30"
              @click="submit"
              :loading="$root.tableLoading"
              style="width: 300px"
              >确认保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Tables from "_c/tables";
import Modals from "@/components/modals";
import {
  getActiveChessTaskVipList,
  addActiveChessTaskLevelAdd,
  getActiveChessTaskConfigList,
  getActiveChessTaskConfigEdit,
} from "@/api/activity";
export default {
  props: ["data", "index", "isEdit", "info_type", "level_range", "activeType"],
  components: {
    Tables,
    Modals,
  },
  data() {
    return {
      siteId: this.$root.nowSite.id,
      isQipai: false,
      week: "",
      weekId: "",
      table: {
        data: [],
        columns1: [],
        columns: [
          {
            title: "发放时间",
            key: "week",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let week = params.row.week;
              let weeks =
                week == 1
                  ? "星期一"
                  : week == 2
                  ? "星期二"
                  : week == 3
                  ? "星期三"
                  : week == 4
                  ? "星期四"
                  : week == 5
                  ? "星期五"
                  : week == 6
                  ? "星期六"
                  : "星期天";
              return <span>{weeks}</span>;
            },
          },
          {
            title: "打码倍数",
            key: "bet_beishu",
            align: "center",
            minWidth: 150,
            render: (h, params) => {
              if (params.row.bet_beishu && params.row.bet_beishu.length != 0) {
                return <span>{this.$root.keepTwo(params.row.bet_beishu)}</span>;
              } else {
                return <span>-</span>;
              }
            },
          },
          {
            title: "",
            key: "shuying",
            align: "center",
            minWidth: 150,
            renderHeader: (h, params) => {
              let title = this.isQipai ? "今日输赢" : "昨日输赢";
              return <span>{title}</span>;
            },
            render: (h, params) => {
              if (params.row.shuying && params.row.shuying.length != 0) {
                return <span>{this.$root.keepTwo(params.row.shuying[0])}</span>;
              } else {
                return <span>-</span>;
              }
            },
          },
          {
            title: "",
            key: "bet",
            align: "center",
            minWidth: 150,
            renderHeader: (h, params) => {
              let title = this.isQipai ? "今日打码" : "昨日打码";
              return <span>{title}</span>;
            },
            render: (h, params) => {
              if (params.row.bet && params.row.bet.length != 0) {
                return <span>{this.$root.keepTwo(params.row.bet[0])}</span>;
              } else {
                return <span>-</span>;
              }
            },
          },
          {
            title: "",
            key: "pay",
            align: "center",
            minWidth: 150,
            renderHeader: (h, params) => {
              let title = this.isQipai ? "今日存款" : "昨日存款";
              return <span>{title}</span>;
            },
            render: (h, params) => {
              if (params.row.pay && params.row.pay.length != 0) {
                return <span>{this.$root.keepTwo(params.row.pay[0])}</span>;
              } else {
                return <span>-</span>;
              }
            },
          },
          {
            title: "奖金上限",
            key: "gift_money_max",
            align: "center",
            minWidth: 80,
            render: (h, params) => {
              if (params.row.gift_money_max && params.row.send_type == "bili") {
                return (
                  <span>{this.$root.keepTwo(params.row.gift_money_max)}</span>
                );
              } else {
                return <span>-</span>;
              }
            },
          },
          {
            title: "奖金金额",
            key: "gift_money",
            align: "center",
            minWidth: 80,
            render: (h, params) => {
              if (params.row.gift_money || params.row.bili) {
                if (params.row.send_type == "bili")
                  return <span>{this.$root.keepTwo(params.row.bili)}%</span>;
                else
                  return (
                    <span>{this.$root.keepTwo(params.row.gift_money)}</span>
                  );
              } else {
                return <span>-</span>;
              }
            },
          },
          // {
          //     title: '未达条件',
          //     key: 'weidatiaojian',
          //     align: 'center',
          //     minWidth: 80,
          //     render: (h, params) => {
          //         if (params.row.weidatiaojian == '') {
          //             return <span>-</span>;
          //         } else {
          //             return <span>{this.$root.keepTwo(params.row.weidatiaojian)}</span>;
          //         }
          //     }
          // },
          {
            title: "操作",
            key: "action",
            align: "center",
            minWidth: 60,
            render: (h, params) => {
              return (
                <div>
                  <button
                    class={
                      this.isEdit ? "blue-font button" : "gray-font button"
                    }
                    disabled={!this.isEdit}
                    onClick={() => {
                      this.openWeek(params);
                    }}
                  >
                    编辑
                  </button>
                </div>
              );
            },
          },
        ],
      },
      dataList: [
        {
          week: 1,
          bet_beishu: null,
          shuying: [],
          bet: [],
          pay: [],
          send_type: "gift_money",
          gift_money: null,
          bili: null,
          gift_money_max: null,
          weidatiaojian: null,
        },
        {
          week: 2,
          bet_beishu: null,
          shuying: [],
          bet: [],
          pay: [],
          send_type: "gift_money",
          gift_money: null,
          bili: null,
          gift_money_max: null,
          weidatiaojian: null,
        },
        {
          week: 3,
          bet_beishu: null,
          shuying: [],
          bet: [],
          pay: [],
          send_type: "gift_money",
          gift_money: null,
          bili: null,
          gift_money_max: null,
          weidatiaojian: null,
        },
        {
          week: 4,
          bet_beishu: null,
          shuying: [],
          bet: [],
          pay: [],
          send_type: "gift_money",
          gift_money: null,
          bili: null,
          gift_money_max: null,
          weidatiaojian: null,
        },
        {
          week: 5,
          bet_beishu: null,
          shuying: [],
          bet: [],
          pay: [],
          send_type: "gift_money",
          gift_money: null,
          bili: null,
          gift_money_max: null,
          weidatiaojian: null,
        },
        {
          week: 6,
          bet_beishu: null,
          shuying: [],
          bet: [],
          pay: [],
          send_type: "gift_money",
          gift_money: null,
          bili: null,
          gift_money_max: null,
          weidatiaojian: null,
        },
        {
          week: 7,
          bet_beishu: null,
          shuying: [],
          bet: [],
          pay: [],
          send_type: "gift_money",
          gift_money: null,
          bili: null,
          gift_money_max: null,
          weidatiaojian: null,
        },
      ],
      formKey: {
        info_type: "",
        bet_beishu: null,
        shuying_min: null,
        shuying_max: 100000000,
        bet_min: null,
        bet_max: 100000000,
        pay_min: null,
        pay_max: 100000000,
        send_type: "bili",
        gift_money: null,
        bili: null,
        gift_money_max: null,
        weidatiaojian: null,
      },
      rules: {
        info_type: [
          {
            required: true,
            message: "请选择统计类型",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        bet_beishu: [
          {
            required: true,
            message: "请输入打倍数",
            trigger: "blur",
            pattern: /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/,
          },
        ],
        shuying_min: [
          {
            required: true,
            message: "请输入最低输赢金额",
            trigger: "blur",
            pattern: /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/,
          },
        ],
        // shuying_max: [
        //     {
        //         required: true,
        //         message: '请输入上限金额',
        //         trigger: 'blur',
        //         pattern: /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/
        //     }
        // ],
        bet_min: [
          {
            required: true,
            message: "请输入最低打码金额",
            trigger: "blur",
            pattern: /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/,
          },
        ],
        // bet_max: [
        //     {
        //         required: true,
        //         message: '请输入上限金额',
        //         trigger: 'blur',
        //         pattern: /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/
        //     }
        // ],
        pay_min: [
          {
            required: true,
            message: "请输入最低存款金额",
            trigger: "blur",
            pattern: /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/,
          },
        ],
        // pay_max: [
        //     {
        //         required: true,
        //         message: '请输入上限金额',
        //         trigger: 'blur',
        //         pattern: /^\+?((0|([1-9]+\d*))|((0\.\d+)|([1-9]+\d*\.\d+)))$/
        //     }
        // ],
        bili: [
          {
            required: true,
            message: "奖金占比不能为0可保留两位小数",
            trigger: "blur",
            pattern: /^(([0-9]+[\.]?[0-9]{1,2})|[1-9])$/,
          },
        ],
        gift_money_max: [
          {
            required: true,
            message: "奖金上限不能为0可保留两位小数",
            trigger: "blur",
            pattern: /^(([0-9]+[\.]?[0-9]{1,2})|[1-9])$/,
          },
        ],
        gift_money: [
          {
            required: true,
            message: "奖金金额不能为0可保留两位小数",
            trigger: "blur",
            pattern: /^(([0-9]+[\.]?[0-9]{1,2})|[1-9])$/,
          },
        ],
        // weidatiaojian: [
        //     {
        //         required: true,
        //         message: '请输入奖金金额',
        //         trigger: 'blur',
        //         pattern: /^(([0-9]+[\.]?[0-9]{1,2})|[1-9])$/
        //     }
        // ]
      },
      weekTitle: "",
      disabled: true,
      active_Type: "dailySignIn",
      params: {},
      level_id: "",
      id: "",
    };
  },
  computed: {
    ...mapState({
      chessList: (state) => state.info.chessList,
    }),
  },
  watch: {
    data: {
      deep: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.data = newVal;
          if (this.data.length && this.data[this.index].active_type) {
            let { active_type, id } = { ...this.data[this.index] };
            this.level_id = id;
            this.active_Type = active_type;
            this.params = {
              siteId: this.$root.nowSite.id,
              active_type: active_type,
              level_id: id,
            };
            this.getList(this.params);
          } else {
            this.table.data = [];
          }
        });
      },
    },
    info_type: {
      deep: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.info_type = newVal;
          this.formKey.info_type = newVal;
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
    level_range: {
      deep: true,
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.level_range = newVal;
          let keyArr = [
            "week",
            "bet_beishu",
            "gift_money_max",
            "gift_money",
            "weidatiaojian",
            "action",
          ];
          let arr = [];
          newVal.forEach((t, i) => {
            keyArr.splice(1, 0, t);
          });

          this.table.columns.forEach((t) => {
            for (let key in keyArr) {
              if (t.key == keyArr[key]) {
                arr.push(t);
              }
            }
          });
          this.table.columns1 = arr;
        });
      },
    },
  },
  created() {
    this.isQipai = this.chessList.includes(this.siteId) ? true : false;
  },
  mounted() {
    let { active_type, id } = { ...this.data[this.index] };
    this.level_id = id;
    if (!this.chessList.includes(this.siteId) && this.level_id == undefined) {
      let data = {
        siteId: this.$root.nowSite.id,
        level_range: "all",
        active_type: "dailySignIn",
      };
      addActiveChessTaskLevelAdd(data, true)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            let params = {
              siteId: this.$root.nowSite.id,
              active_type: "dailySignIn",
            };
            getActiveChessTaskVipList(params, true).then((res) => {
              if (res != undefined && res.code == 200) {
                this.level_id = res.data.activeChessTaskVipList[0].id;
                this.active_Type = "dailySignIn";
                this.table.data = this.dataList;
                this.params = {
                  siteId: this.siteId,
                  active_type: "dailySignIn",
                  level_id: this.level_id,
                };
                this.saveConfig();
              }
            });
          }
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
    } else {
      if (this.data.length) {
        if (this.data[this.index].active_type == "dailySignIn") {
          let { active_type, id } = { ...this.data[this.index] };
          this.level_id = id;
          this.active_Type = active_type;
          this.params = {
            siteId: this.siteId,
            active_type: this.activeType,
            level_id: id,
          };
          this.getList(this.params);
        }
      } else {
        this.table.data = [];
      }
    }
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
            
            if (newArr.length == 0) {
              this.table.data = this.dataList;
              this.saveConfig();
            } else {
              this.table.data =
                newArr &&
                newArr.filter((x, index, self) => self.indexOf(x) === index);
            }
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },
    saveConfig() {
      this.$root.startTableLoading();
      let newData = [];
      this.table.data.forEach((item) => {
        newData.push(item);
      });
      let params = {
        siteId: this.$root.nowSite.id,
        level_id: this.level_id,
        active_type: "dailySignIn",
        updateData: JSON.stringify(newData),
      };
      this.isActive = false;
      this.activeId = this.level_id;
      getActiveChessTaskConfigEdit(params, true)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.getList(this.params);
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },

    submit() {
      this.$refs.formKey.validate((valid) => {
        if (valid) {
          let arr = this.info_type.split("/");
          let newData = { ...this.formKey };
          newData.shuying = [
            this.formKey.shuying_min,
            this.formKey.shuying_max,
          ];
          console.log('newData',newData)
          newData.bet = [this.formKey.bet_min, this.formKey.bet_max];
          newData.pay = [this.formKey.pay_min, this.formKey.pay_max];
          newData.week = this.week;
          newData.id = this.weekId;
          for (let key in newData) {
            if (!newData[key] || key == "info_type") delete newData[key];
          }
          let params = {
            siteId: this.$root.nowSite.id,
            level_id: this.level_id,
            active_type: this.active_Type,
            updateData: JSON.stringify([newData]),
          };
          this.$root.startTableLoading();
          getActiveChessTaskConfigEdit(params, true)
            .then((res) => {
              if (res != undefined && res.code == 200) {
                this.$refs.weekModal.hide();
                this.$Message.success("保存成功！");
                this.getList(this.params);
                this.$root.endTableLoading();
              }
            })
            .catch((error) => this.$root.endTableLoading());
        }
      });
    },
    openWeek(params) {
      let week = params.row.week;
      let weeks =
        week == 1
          ? "星期一"
          : week == 2
          ? "星期二"
          : week == 3
          ? "星期三"
          : week == 4
          ? "星期四"
          : week == 5
          ? "星期五"
          : week == 6
          ? "星期六"
          : "星期天";
      this.weekTitle = "编辑" + weeks;
      this.week = week;
      this.weekId = params.row.id;
      this.$refs.weekModal.show();

      this.formKey.info_type = this.info_type;

      for (let key in params.row) {
      console.log('key',key)
        if (key == "shuying") {
          if (params.row[key].length) {
            this.formKey.shuying_min = params.row[key][0];
          } else {
            this.formKey.shuying_min = null;
          }
        }
        if (key == "bet") {
          if (params.row[key].length) {
            this.formKey.bet_min = params.row[key][0];
          } else {
            this.formKey.bet_min = null;
          }
        }
        if (key == "pay") {
          if (params.row[key].length) {
            this.formKey.pay_min = params.row[key][0];
          } else {
            this.formKey.pay_min = null;
          }
        }
        if (key == "send_type") this.formKey.send_type = params.row[key];

        if (key == "bet_beishu") {
          if (params.row[key]) this.formKey.bet_beishu = params.row[key];
          else this.formKey.bet_beishu = null;
        }
        if (key == "bili") {
          if (params.row[key]) this.formKey.bili = params.row[key];
          else this.formKey.bili = null;
        }
        if (key == "gift_money_max") {
          if (params.row[key]) this.formKey.gift_money_max = params.row[key];
          else this.formKey.gift_money_max = null;
        }
        if (key == "gift_money") {
          if (params.row[key]) this.formKey.gift_money = params.row[key];
          else this.formKey.gift_money = null;
        }
        if (key == "weidatiaojian") {
          if (params.row[key]) this.formKey.weidatiaojian = params.row[key];
          else this.formKey.weidatiaojian = null;
        }
      }
      this.formKey.shuying_min;

    },
    closeModal() {
      this.$refs.formKey.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../../styles/button.less";
.button {
  border: 0;
  background: transparent;
}
/deep/.info_type .ivu-input {
  cursor: default;
}
/deep/.ivu-form-item-error-tip {
  width: 200px;
}
</style>