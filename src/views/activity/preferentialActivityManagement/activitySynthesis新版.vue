<template>
  <div>
    <div class="h82 bd b">
      <span
        class="btn-left ib ft20 c3Color pr10 lh82 txt-a cs fl"
        @click="leftmove"
        >《
      </span>
      <div class="wrap-scroll pt25 pl30 ib" ref="box">
        <div
          class="nav v2-search clearfix"
          :style="{ transform: 'translateX(' + width + ')' }"
        >
          <Button
            class="btn mr20 mb20 activity-btn pl20 pr20 f-color"
            style="width:auto; padding:0 15px;"
            :class="{ cardNutton: i == isactive }"
            v-for="(item, i) in btnList"
            :key="i+'button'"
            @click="selectWay(item.value, i)"
            >{{ item.name }}</Button
          >
        </div>
      </div>
      <span
        class="btn-right ib ft20 c3Color pl10 lh82 txt-a cs fr"
        @click="rightmove"
      >
        》</span
      >
    </div>
    <div
      class="v2-search pt5 mt30 clearfix"
      v-if="activeType != 'zhuanpan' && activeType != 'A0025'"
    >
      <div class="vip-button fl" style="width: 40%" v-if="levelShow && activeType != 'wangyinjiazeng'">
        <Tabs
          ref="tabs"
          type="card"
          :closable="isEdit ? true : false"
          @on-click="vipQuery"
          :before-remove="delVip"
        >
          <TabPane
            v-for="(item, i) in vList"
            :key="item.level_range"
            :index="i"
            :name="item.id + ',' + i"
            :label="
              item.level_range == 'all' ? '全部用户' : 'VIP ' + item.level_range
            "
          >
          </TabPane>
          <span
            @click="
              () => {
                this.$refs.vipModal.show();
              }
            "
            v-show="isEdit"
            class="addfenlei ml20 ft20"
            size="small"
            slot="extra"
            @sendMsg="getTabeData"
            >+</span
          >
        </Tabs>
      </div>
      <div class="fr" style="width: 55%">
        <Form inline class="fr" ref="searchKey">
          <FormItem
            label="活动日期"
            v-if="activeType != 'dailySignIn' && activeType != 'zhouliufanpai'"
          >
            <DatePicker
              v-if="isEdit"
              type="datetime"
              v-model="searchKey.startTime"
              placeholder="开始日期"
              format="yyyy-MM-dd HH:mm:ss"
              class="s-180"
            ></DatePicker>
            <span v-else class="iconColor">{{ searchKey.startTime }}</span>
            <span class="ml10 mr10 iconColor">-</span>
            <DatePicker
              v-if="isEdit"
              type="datetime"
              v-model="searchKey.endTime"
              placeholder="结束日期"
              format="yyyy-MM-dd HH:mm:ss"
              class="s-180"
            ></DatePicker>
            <span v-else class="iconColor">{{ searchKey.endTime }}</span>
          </FormItem>
          <FormItem label="活动日期" v-if="activeType == 'zhouliufanpai'">
            <span
              class="ib b txt-a lh25 w150x ft14 iconColor"
              style="vertical-align: middle"
              >每周六 00:00-23:59</span
            >
          </FormItem>
          <FormItem
            v-if="
              activeType != 'dailySignIn' &&
              activeType != 'zhouliufanpai' &&
              activeType != 'wangyinjiazeng'
            "
          >
            <Checkbox
              v-model="isHot"
              :disabled="disable"
              @on-change="onHot"
              >是否热门</Checkbox
            >
          </FormItem>
          <!-- 每日签到统计类型 -->
          <FormItem  label="统计类型" > 
            <Select
             v-if="activeType == 'dailySignIn' && isEdit"
              class="w280x"
              v-model="searchKey.level_range"
              multiple
              @on-change="onChange"
              :disabled="disable"
            >
              <Option value="bet">按打码</Option>
              <Option value="shuying">按输赢</Option>
              <Option value="pay">按存款</Option>
            </Select>
              <Input :value="info_type" readonly   v-if="activeType == 'dailySignIn' && !isEdit" />
          </FormItem>
          <!-- ------------------- -->
          <FormItem>
            <Switch v-model="switchType" size="large" :disabled="disable">
              <span slot="open">开启</span>
              <span slot="close">停用</span>
            </Switch>
          </FormItem>
          <FormItem>
            <Button
              v-show="!isEdit"
              type="primary"
              class="bj-btn"
              @click.prevent="onEdit"
              >编辑</Button
            >
            <div
              v-show="isEdit"
              class="fr"
              v-if="
                activeType == 'dailySignIn' ||
                activeType == 'shareRemuneration' ||
                activeType == 'paymentSpree'||
                activeType == 'deficitRescue'||
                activeType == 'betGiftGiving'||
                activeType == 'meiriyouxi'||
                activeType == 'dingshirenwu'||
                activeType == 'qipairenwu'||
                activeType == 'dianzirenwu'||
                activeType == 'buyurenwu'||
                activeType == 'zhuanpan'||
                activeType == 'zhouliufanpai'
              "
            >
              <Button
                type="primary"
                class="bj-btn"
                @click.prevent="save"
                :loading="$root.tableLoading"
                >保存</Button
              >
            </div>
            <div
              v-show="isEdit"
              class="fr"
              v-if="activeType == 'wangyinjiazeng'"
            >
              <Button
                type="primary"
                class="bj-btn"
                @click.prevent="saveDeposit"
                :loading="$root.tableLoading"
                >保存</Button
              >
            </div>
            <div v-show="isEdit" class="fr mr20">
              <Button
                type="primary"
                class="bj-btn"
                @click.prevent="cancel"
                :loading="$root.tableLoading"
                >取消</Button
              >
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="v2-search pt5 mt30" v-if="activeType == 'zhuanpan'">
      <Carousel />
    </div>
    <div class="v2-table ">
      <signTable
        ref="signIn"
        v-if="activeType == 'dailySignIn' && isShow"
        :data="data"
        :info_type="info_type"
        :activeType="activeType"
        :isEdit="isEdit"
        :index="index"
        :level_range="searchKey.level_range"
      />
      <AllTable
        ref="share"
        v-if="
          (activeType == 'shareRemuneration' ||
            activeType == 'deficitRescue' ||
            activeType == 'betGiftGiving') &&
          isShow
        "
        :data="data"
        :isEdit="isEdit"
        :activeType="activeType"
        :index="index"
        @sendMsg="getTabeData"
      />
      <PaymentTable
        ref="payment"
        v-if="activeType == 'paymentSpree' && isShow"
        :data="data"
        :isEdit="isEdit"
        :index="index"
        @sendMsg="getTabeData"
      />
      <DailyTable
        ref="daily"
        v-if="activeType == 'meiriyouxi' && isShow"
        :data="data"
        :isEdit="isEdit"
        :index="index"
        @sendMsg="getTabeData"
      />
      <TimedTable
        ref="timed"
        v-if="activeType == 'dingshirenwu' && isShow"
        :data="data"
        :isEdit="isEdit"
        :index="index"
        @sendMsg="getTabeData"
      />
      <TaskTable
        ref="task"
        v-if="
          activeType == 'qipairenwu' ||
          activeType == 'dianzirenwu' ||
          (activeType == 'buyurenwu' && isShow)
        "
        :data="data"
        :isEdit="isEdit"
        :index="index"
        @sendMsg="getTabeData"
      />
      <saturdayFlop
        ref="flop"
        v-if="activeType == 'zhouliufanpai' && isShow"
        :data="data"
        :index="index"
        :isEdit="isEdit"
        @sendMsg="getTabeData"
      />
      <BonsTable
        ref="wangy"
        v-if="activeType == 'wangyinjiazeng' && isShow"
        :data="data"
        :index="index"
        :isEdit="isEdit"
        @sendMsg="getTabeData"
      />
      <AppCode ref="appCode" 
       :showTimeSwitch="showTimeSwitch"
       v-if="activeType=='A0025'"
       :data="data"
       />
    </div>
    <Modals  width="600"  ref="vipModal"  title="设定对象" @closeModal="closeModal">
      <div slot="content" class="vipLevel">
        <Form
          ref="vipSearch"
          :model="vipModal"
          style="width: 550px"
          class="mt50 txt-a"
          :rules="rules"
        >
          <FormItem label="设定对象" class="w430x ib ml60">
            <Select class="w345x" v-model="vipModal.setVal">
              <Option value="vip">选择VIP等级</Option>
              <Option value="all">选择全部</Option>
            </Select>
          </FormItem>
          <div class="ib" v-if="vipModal.setVal == 'vip'">
            <FormItem label="VIP等级范围" class="ib vipNum1" prop="vipNum1">
              <InputNumber
                class="w160x h36 ft14 iconColor"
                :min="0"
                :max="999"
                placeholder="请输入VIP等级数字"
                v-model="vipModal.vipNum1"
              />
            </FormItem>
            <span class="h36 ml5">-</span>
            <FormItem class="ib ml10 vipNum2" prop="vipNum2">
              <InputNumber
                class="w160x ft14 h36 iconColor"
                :min="0"
                :max="999"
                placeholder="请输入VIP等级数字"
                v-model="vipModal.vipNum2"
              />
            </FormItem>
          </div>
        </Form>
        <Button
          type="primary"
          class="submit mt20 mb30"
          :loading="$root.tableLoading"
          @click.prevent="addVip"
          >确定保存</Button
        >
      </div>
    </Modals>
  </div>
</template>
<script>
import {
  getActiveChessTaskList,
  getActiveChessTaskVipList,
  getActiveChessTaskDateAndSwitch,
  addActiveChessTaskLevelAdd,
  delActiveChessTaskLevelDel,
  getActiveChessTaskConfigList,
  getActiveChessTaskConfigEdit,
  getEditConfig
} from "@/api/activity";
import Tables from "_c/tables";

import Modals from "@/components/modals";
import { rmRepeatItem } from "@/libs/util";
import signTable from "./components/sign_table";
import AllTable from "./components/all_table";
import PaymentTable from "./components/payment_table";
import DailyTable from "./components/daily_table";
import TimedTable from "./components/timed_table";
import TaskTable from "./components/task_table";
import BonsTable from "./components/bons_table";
import Carousel from "./components/carousel";
import saturdayFlop from "./components/saturday_flop";
import AppCode from "./components/appCode";
import { mapState } from "vuex";
export default {
  components: {
    Tables,
    Modals,
    signTable,
    AllTable,
    PaymentTable,
    DailyTable,
    TimedTable,
    TaskTable,
    Carousel,
    BonsTable,
    saturdayFlop,
    AppCode, //app兑换码
  },
  name: "activitySynthesis",
  data() {
    const vipNum1 = (rule, val, cb) => {
      let reg = (reg = /^\+?[0-9]\d*$/);
      if (!reg.test(this.vipModal.vipNum1) || this.vipModal.vipNum1 == null) {
        cb("请输入VIP等级!");
      } else {
        cb();
      }
    };
    const vipNum2 = (rule, val, cb) => {
      let reg = (reg = /^\+?[0-9]\d*$/);
      if (!reg.test(this.vipModal.vipNum2) || this.vipModal.vipNum2 == null) {
        cb("请输入VIP等级!");
      } else {
        cb();
      }
    };
    return {
      //状态  dailySignIn（每日签到）shareRemuneration（分享领工资） paymentSpree（充值礼包）
      // deficitRescue（亏损救援金） // betGiftGiving（有玩就有礼）  meiriyouxi（每日任务） dingshirenwu（定时任务）
      // qipairenwu （棋牌任务） dianzirenwu（电子任务） buyurenwu（捕鱼任务）zhuanpan（转盘）A0025（app兑换码） wangyinjiazeng（公司入款加赠）
       isHot: false,//是否热门
       showTimeSwitch: [],//导航展示右侧
        switchType: false,//开启停用
      levelShow: false,
      index1: 0,
      len: 0,
      selectLen: "",//滑动移动位置
      width: "",
      open: "",
      isShow: false,
      data: [],
      info_type: "",
      screen: screen.width,
      disable: true,
      isActive: true,
      activeId: null,
      btnList: [],
      vList: [],
      searchKey: {
        startTime: "",
        endTime: "",
        level_range: [],
        siteId: this.$root.nowSite.id,
      },
     
      isactive: false,
      isEdit: false,
      activeType: "dailySignIn",
      level_id: null,
      vipModal: {
        setVal: "",
        vipNum1: null,
        vipNum2: null,
      },
      rules: {
        vipNum1: [
          {
            type: "number",
            required: true,
            validator: vipNum1,
            trigger: "blur",
          },
        ],
        vipNum2: [
          {
            type: "number",
            required: true,
            validator: vipNum2,
            trigger: "blur",
          },
        ],
      },
      game_id: "",
      activeTime: true,
      isGame: true,
      isTime: true,
      task: true,
      infoType: true,
      table: {
        data: [],
      },
      index: 0,
      level_range: "",
    };
  },
  computed: {
    ...mapState({
      chessList: (state) => state.info.chessList,
    }),
  },
  created() {
    let params = { siteId: this.$root.nowSite.id, active_type: "dailySignIn" };
    this.getData(params);

    let data1 = { siteId: this.$root.nowSite.id };
    this.getBtn(data1);
    this.table.columns = this.table.columns1;
  },
  methods: {
        getBtn(params) { //获取滑动菜单
      getActiveChessTaskList(params, true).then((res) => {
        if (res != undefined && res.code == 200) {
          if (this.chessList.includes(this.$root.nowSite.id)) {//棋牌站展示对应的
            res.data&&res.data.forEach(t=>{ if(t.value!='zhouliufanpai') this.btnList.push(t) })
            this.levelShow = true;
          }
           if(!this.chessList.includes(this.$root.nowSite.id)){//除综合站都不展示等级
            this.btnList = [ { name: "每日签到", value: "dailySignIn" },{ name: "周六红包", value: "zhouliufanpai" },];
            this.levelShow = false;
          }
          let num = ((this.$refs.box.offsetWidth - 30) / 140).toFixed(1);
          this.selectLen = this.btnList.length - num;
        }
      });
    },
    onChange(val) {//统计类型
      this.searchKey.level_range = val;
      let typeText = [];
      val.forEach((t) => {
        if (t == "bet") { typeText.push("按打码");}
        if (t == "shuying") {typeText.push("按输赢");}
        if (t == "pay") { typeText.push("按存款"); }
      });
      this.info_type = typeText.join("/");
    },

    onHot(val) {
      this.isHot = val;
    },



    selectWay(way, index) {//点击对应菜单
      console.log(way)
      this.isEdit = false;
      this.isActive = true;
      this.isactive = index;
      this.activeType = way;
      // this.vipModal.setVal = this.activeType == "dailySignIn" ? "all" : "vip"; //每日签到vip等级到默认只有全部
      this.index = 0;
      let params = { active_type: way,siteId:this.$root.nowSite.id };
      this.getData(params);
    },
    getData(data, type) {
      this.$nextTick(function () {
        getActiveChessTaskVipList(data, true).then((res) => {
          if (res != undefined && res.code == 200) {
            this.isShow = true;
            console.log(res.data)
            this.showTimeSwitch = res.data.activeChessTaskDateAndSwitch;//导航右侧展示
            console.log(this.showTimeSwitch)
            console.log(this.$root.unixTime(this.showTimeSwitch.start_time))
            console.log(this.$root.unixTime(this.showTimeSwitch.end_time))
            if (this.showTimeSwitch) {//导航右侧有值
              console.log(11111)
              console.log(this.activeType)
              console.log(this.showTimeSwitch.dailySignInCountType)
              const{dailySignInCountType,start_time,end_time,status,is_hot}=this.showTimeSwitch;//统计类型
              console.log(dailySignInCountType)
              if ( this.activeType == "dailySignIn" &&dailySignInCountType.length ) {//每日签到
                let typeText = [];
                Array(dailySignInCountType[0].level_range)&&Array(dailySignInCountType[0].level_range).forEach((t) => {
                  if (t == "bet") { typeText.push("按打码");}
                  if (t == "shuying") { typeText.push("按输赢");}
                  if (t == "pay") { typeText.push("按存款");}
                });
            
                this.info_type = typeText.join("/");
                console.log(this.info_type)
                this.searchKey.level_range = this.showTimeSwitch.dailySignInCountType[0].level_range.split(
                  ","
                );
                console.log(this.searchKey.level_range)
                this.switchType = this.showTimeSwitch.status == "open" ? true : false;
              } else {//其他
                this.searchKey.startTime = this.$root.unixTime(start_time);
                this.searchKey.endTime = this.$root.unixTime(end_time);
                this.switchType = status == "open" ? true : false;
                this.isHot = is_hot == "hot" ? true : false;
              }
            } else {
              this.startTime = "";
              this.endTime = "";
              this.switchType = false;
            }
           
            this.vList = res.data.activeChessTaskVipList;
            console.log(this.vList)
      
         
            if (this.vList != null && this.vList.length != 0) {
              console.log(22222)
              this.data = res.data.activeChessTaskVipList;
              this.activeType = this.vList[this.index].active_type;
        
              if (this.isActive) {
           
                if(this.$refs.tabs!=undefined){

                  this.$refs.tabs.activeKey = this.vList[this.index].id + "," + this.index;
               
                  this.level_id = this.vList[this.index].id;
                }
              } else {
                this.$refs.tabs.activeKey = this.activeId + "," + this.index;
             
                this.level_id = this.activeId;
              }
              if (type == "add") {
                this.$refs.tabs.activeKey =
                  this.vList[this.vList.length - 1].id +
                  "," +
                  (this.vList.length - 1);
                this.level_id = this.vList[this.vList.length - 1].id;
            
              }
            } else if (this.activeType == "wangyinjiazeng") {
              this.data = [{ id: 0, active_type: "wangyinjiazeng" }];
              this.level_id = null;
              this.table.data = [];
            } else {
              if (this.activeType == "zhouliufanpai") {
                this.data = [{ id: 101, active_type: "zhouliufanpai" }];
              } else {
                this.data = [];
                this.level_id = null;
                this.table.data = [];
              }
            }
          }
        });
      });
    },

    onEdit() {
      this.isEdit = !this.isEdit;
      this.disable = false;
      this.level_id = this.activeType == "zhouliufanpai" ? 101 : this.level_id;
      this.level_id = this.activeType == "wangyinjiazeng" ? 0 : this.level_id;
      let params = {
        siteId: this.$root.nowSite.id,
        active_type: this.activeType,
        level_id: this.level_id,
      };
      if (this.level_id) this.geshowTimeSwitch(params);
    },
    geshowTimeSwitch(data) {
      let newArr = [];
      getActiveChessTaskConfigList(data).then((res) => {
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
            // console.log('newArr'.newArr)
          } else {
            this.table.data = [];
          }
        }
      });
    },
    //编辑日期和开关
    saveDate() {
      if (
        this.level_id == null &&
        this.activeType != "zhouliufanpai" &&
        this.activeType != "wangyinjiazeng" &&
        this.levelShow
      ) {
        this.$Message.warning("请添加VIP等级！");
        return;
      }
      if (
        this.activeType != "dailySignIn" &&
        this.activeType != "zhouliufanpai" &&
        this.activeType != "wangyinjiazeng"
      ) {
        this.activeTime = true;
        if (this.searchKey.startTime == "") {
          this.$Message.warning("活动日期不能为空！");
          return;
        }
        if (this.searchKey.endTime == "") {
          this.$Message.warning("活动日期不能为空！");
          return;
        }
        if (
          this.$root.formatTimeS(this.searchKey.endTime) <=
          this.$root.formatTimeS(this.searchKey.startTime)
        ) {
          this.$Message.warning("结束日期必须大于活动开始日期！");
          this.activeTime = false;
          return;
        }
      }
      if (this.activeType == "dailySignIn") {
        this.infoType = true;
        for (let key in this.searchKey) {
          if (!this.searchKey[key]) delete this.searchKey[key];
        }
        if (this.searchKey.level_range == "") {
          this.$Message.warning("请选择统计类型！");
          this.infoType = false;
          return;
        }
      }
      if (
        this.activeType == "meiriyouxi" ||
        this.activeType == "qipairenwu" ||
        this.activeType == "dianzirenwu" ||
        this.activeType == "buyurenwu"
      ) {
        this.isGame = true;
        this.table.data.forEach((item) => {
          for (let key in item) {
            if (
              key == "game_name" ||
              key == "game_id" ||
              key == "game_class_id"
            ) {
              if (item[key] == "") {
                this.isGame = false;
              }
            }
          }
        });
        if (!this.isGame) {
          this.$Message.warning("请选择游戏名称！");
          return;
        }
      }

      if (this.activeType == "paymentSpree") {
        this.isTime = true;
        this.table.data.forEach((item) => {
          for (let key in item) {
            if (key == "time") {
              if (item[key] == "") {
                this.isTime = false;
              }
            }
          }
        });
        if (!this.isTime) {
          this.$Message.warning("请选择时间范围！");
          return;
        }
      }

      if (this.activeType == "dingshirenwu") {
        this.task = true;
        this.table.data.forEach((item) => {
          let reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/;
          for (let key in item) {
            if (key == "time_range") {
              if (!item[key][0]) {
                this.$Message.warning("请选择开始时间！");
                this.task = false;
                return;
              }
              if (!item[key][1]) {
                this.$Message.warning("请选择结束时间！");
                this.task = false;
                return;
              }
              if (item[key][1] <= item[key][0]) {
                this.$Message.warning("结束时间必须大于开始时间！");
                this.task = false;
                return;
              }
            }
            if (key == "pay_name") {
              if (!item[key]) {
                this.$Message.warning("请选择支付渠道！");
                this.task = false;
                return;
              }
            }
            if (key == "count_type") {
              if (!item[key]) {
                this.$Message.warning("请选择充值类型！");
                this.task = false;
                return;
              }
            }
            if (key == "pay_money") {
              if (!reg.test(item[key])) {
                this.$Message.warning("金额输入不符合规则！");
                this.task = false;
                return;
              }
            }
            if (key == "gift_money") {
              if (!reg.test(item[key])) {
                this.$Message.warning("金额输入不符合规则！");
                this.task = false;
                return;
              }
            }
          }
        });
        if (!this.task) {
          return;
        }
      }
      let data = {};
      if (
        this.activeType != "dailySignIn" &&
        this.activeType != "zhouliufanpai"
      ) {
        this.start_time = this.$root.formatTimeS(this.searchKey.startTime);
        this.end_time = this.$root.formatTimeS(this.searchKey.endTime);
        this.searchKey.startTime = this.$root.formatTimeS(
          this.searchKey.startTime
        );
        this.searchKey.endTime = this.$root.formatTimeS(this.searchKey.endTime);
        for (let key in this.searchKey) {
          if (key == "level_range") delete this.searchKey[key];
        }
        data = { ...this.searchKey };
        data.active_type = this.activeType;
        data.status = this.switchType ? "open" : "off";
        data.is_hot = this.isHot ? "hot" : "no_hot";
      }
      if (this.activeType == "dailySignIn") {
        data.siteId = this.$root.nowSite.id;
        data.active_type = "dailySignInCountType";
        data.status = this.switchType ? "open" : "off";
        data.count_type = this.searchKey.level_range.join(",");
      }
      if (this.activeType == "zhouliufanpai") {
        data.siteId = this.$root.nowSite.id;
        data.active_type = "zhouliufanpai";
        data.status = this.switchType ? "open" : "off";
      }
      this.$root.startTableLoading();
      getActiveChessTaskDateAndSwitch(data, true)
        .then((res) => {
          if (res && res.code == 200) {
            this.isEdit = false;
            this.disable = true;
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },

    //vip列表
    vipQuery(str) {
      this.isActive = true;
      this.level_id = str.split(",")[0];
      this.index = str.split(",")[1];
      let params = {
        siteId: this.$root.nowSite.id,
        active_type: this.activeType,
      };
      this.getData(params);
    },

    //vip范围新增
    addVip() {
      if (this.level_id) this.index = this.vList.length;
      if (this.level_range == "all") this.index = 0;
      if (this.vipModal.setVal == "vip") {
        this.$refs.vipSearch.validate((valid) => {
          if (valid) {
            if (this.level_range == "all") this.index = 0;
            let data = {
              siteId: this.$root.nowSite.id,
              active_type: this.activeType,
            };
            let level_range =
              this.vipModal.vipNum1 + "-" + this.vipModal.vipNum2;
            data.level_range = level_range;
            this.$root.startTableLoading();
            addActiveChessTaskLevelAdd(data, true)
              .then((res) => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success("添加成功！");
                  this.vipModal.vipNum1 = null;
                  this.vipModal.vipNum2 = null;
                  this.vip;
                  this.vipModal.setVal = "vip";
                  this.getData(data, "add");
                  this.$refs.vipModal.hide();
                  this.$refs.vipSearch.resetFields();
                  this.$root.endTableLoading();
                }
              })
              .catch((error) => {
                this.$root.endTableLoading();
              });
          }
        });
      } else {
        this.index = 0;
        this.level_range = "all";
        let data = {
          level_range: "all",
          siteId: this.$root.nowSite.id,
          active_type: this.activeType,
        };
        if (this.level_id == null) {
          this.addAll(data);
        } else {
          let text = "您正在将对象设为全部用户，确定后将清除多余设置！";
          this.$Tip.confirm({
            content: text,
            onOk: () => {
              this.addAll(data);
            },
          });
        }
      }
    },
    addAll(data) {
      addActiveChessTaskLevelAdd(data, true).then((res) => {
        if (res != undefined && res.code == 200) {
          this.$Message.success("添加成功！");
          this.vipModal.setVal = "vip";
          this.getData(data);
          this.isActive = true;
          this.$refs.vipModal.hide();
        }
      });
    },
    closeModal() {
      this.vipModal.vipNum1 = null;
      this.vipModal.vipNum2 = null;
      this.vipModal.setVal = "vip";
      this.$refs.vipSearch.resetFields();
    },
    //vip范围删除
    delVip(id) {
      this.index = 0;
      let params = { siteId: this.$root.nowSite.id };
      params.id = this.vList[id].id;
      return new Promise(() => {
        this.$Tip.confirm({
          content: "您确定删除此条记录吗？",
          onOk: () => {
            this.$root.startTableLoading();
            delActiveChessTaskLevelDel(params, true)
              .then((res) => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success("删除成功！");
                  let data = {
                    siteId: this.$root.nowSite.id,
                    active_type: this.activeType,
                  };
                  this.getData(data);
                  this.$refs.signIn.table.data = [];
                  this.$refs.share.table.data = [];
                  this.$refs.payment.table.data = [];
                  this.$refs.daily.table.data = [];
                  this.$refs.timed.table.data = [];
                  this.$refs.task.table.data = [];
                  this.$refs.flop.table.data = [];
                  this.$root.endTableLoading();
                }
              })
              .catch((error) => this.$root.endTableLoading());
          },
        });
      });
    },

    //删除活动配置
    delConfig(params) {
      //取消
      this.table.data.splice(params.index, 1);
    },
    getTabeData(val) {
      this.table.data = val;
      // console.log('val',this.table.data)
    },

    //编辑活动配置
    saveConfig() {
      if (
        this.activeType == "dailySignIn" &&
        this.level_id != null &&
        this.info_type != ""
      ) {
        this.$Message.success("修改成功");
        return;
      }
      if (this.activeType != "zhouliufanpai") {
        if (
          this.searchKey.startTime == "" ||
          this.searchKey.endTime == "" ||
          !this.activeTime ||
          this.level_id == null ||
          !this.isGame ||
          !this.isTime ||
          !this.task ||
          !this.infoType
        ) {
          return;
        }
      }

      this.$root.startTableLoading();
      let newData = [];
      this.table.data.forEach((item) => {
        newData.push(item);
      });
      // console.log('newData',newData)
      let params = {
        siteId: this.$root.nowSite.id,
        level_id: this.activeType == "zhouliufanpai" ? 101 : this.level_id, //周六翻牌level_id为101
        level_id: this.activeType == "wangyinjiazeng" ? 0 : this.level_id, //网銀家贈level_id为0
        active_type: this.activeType,
        updateData: JSON.stringify(newData),
      };
      this.isActive = false;
      this.activeId = this.level_id;

      getActiveChessTaskConfigEdit(params, true)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.$Message.success("修改成功！");
            this.isEdit = false;
            let data = {
              siteId: this.$root.nowSite.id,
              active_type: this.activeType,
            };
            this.getData(data);
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },

    //保存
    save() {
      this.saveDate();
      this.saveConfig();
      this.startTime = this.$root.formatTimeS(this.searchKey.startTime);
      this.endTime = this.$root.formatTimeS(this.searchKey.endTime);
    },

    saveDeposit() {
      this.saveDate();
      this.saveDepositConfig();
      this.startTime = this.$root.formatTimeS(this.searchKey.startTime);
      this.endTime = this.$root.formatTimeS(this.searchKey.endTime);
    },

    saveDepositConfig() {
      this.$root.startTableLoading();
      let obj={
        first: {
          rate: this.table.data[0].rate,
          max_amount: this.table.data[0].max_amount,
        },
        count:{
          day: this.table.data[1].day,
          rate: this.table.data[1].rate,
          max_amount: this.table.data[1].max_amount,
        },
      }
      let params = {
        siteId: this.$root.nowSite.id,
        active_type: this.activeType,
        config:JSON.stringify(obj),
      };
      this.isActive = false;
      // this.activeId = this.level_id;

      getEditConfig(params, true)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.$Message.success("修改成功！");
            this.isEdit = false;
            let data = {
              siteId: this.$root.nowSite.id,
              active_type: this.activeType,
            };
            this.getData(data);
          }
        })
        .catch((error) => this.$root.endTableLoading());
    },

    //取消
    cancel() {
      this.startTime = this.$root.formatTimeS(this.searchKey.startTime);
      this.endTime = this.$root.formatTimeS(this.searchKey.endTime);
      this.isEdit = false;
      this.disable = true;
      let params = {
        siteId: this.$root.nowSite.id,
        active_type: this.activeType,
      };
      this.getData(params);
    },
    //左右移动
    leftmove() {
      if (this.index1 < 0) {
        if (Math.abs(this.index1) > 5) {
          this.index1 += 5;
          this.width = this.index1 * 140 + "px";
        } else {
          this.index1 += Math.abs(this.index1);
          this.width = this.index1 * 140 + "px";
        }
      }
    },
    rightmove() {
      if (this.index1 + this.selectLen > 0) {
        if (this.index1 + this.selectLen > 5) {
          this.index1 -= 5;
          this.width = this.index1 * 140 + "px";
        } else {
          this.index1 -= this.index1 + this.selectLen;
          this.width = this.index1 * 140 + "px";
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
@import "../../../styles/class.less";

.btn {
  width: 120px;
  height: 36px;
  line-height: 36px;
}
.bj-btn {
  width: 80px;
  height: 36px;
  line-height: 36px;
}
.qx-btn {
  width: 80px;
  height: 36px;
  border-radius: 5px;
}
.modeBtns {
  width: 110px;
  border: 0;
  border-radius: 0;
  line-height: 36px;
  height: 36px;
  padding-left: 18px;
  box-sizing: border-box !important;
}
.active {
  border: 1px solid #2d8cf0;
  border-bottom: 0;
  color: #2d8cf0;
  box-sizing: border-box !important;
}
.addfenlei {
  display: inline-block;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 20px;
  border-radius: 5px;
  border: solid 1px #e4e4e4;
  background-color: #f6f6f8;
  font-weight: bold;
  color: #ccc;
  cursor: pointer;
}
.footer {
  border: 1px solid #dcdcdc;
  border-top: 0;
  line-height: 48px;
}
.vipLevel {
  text-align: center;
}

/deep/.ivu-form-item-label {
  color: #808080;
}
/deep/.ivu-input-wrapper .ivu-input {
  color: #666;
}
/deep/.ivu-icon-ios-close {
  font-size: 20px;
  font-weight: bold;
  color: #ccc;
}
/deep/.ivu-input-number-input {
  font-size: 0.875rem;
}
/deep/.ivu-input-number-input::placeholder {
  font-size: 0.875rem;
  color: #808080;
}
/deep/.ivu-row {
  margin-top: 0 !important;
}
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
  padding-left: 10px;
  padding-right: 10px;
  background: none;
}
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
  border: 1px solid #2d8cf0;
  border-bottom: 0;
}
/deep/.ivu-tabs-nav-scroll {
  width: 92%;
  // margin-left: 1.6vw;
}
/deep/.vipNum1 {
  width: 270px;
  .ivu-form-item-error-tip {
    left: 20%;
  }
}
/deep/.vipNum2 {
  width: 140px;
  .ivu-form-item-error-tip {
    left: -34%;
  }
}
/deep/.ivu-input {
  height: 32px;
}
/deep/.game-name input::-webkit-input-placeholder {
  color: #666;
}
/deep/.game-name .ivu-select-placeholder {
  color: #666;
}
/deep/.ivu-select-dropdown {
  text-align: left;
}
/deep/ .ivu-select-single .ivu-select-selection {
  height: 36px;
  text-align: left;
}
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-wrap {
  padding-left: 40px;
}
.wrap-scroll {
  width: 94%;
  margin: 0 auto;
  overflow: hidden;
  white-space: nowrap;
}
.nav {
  -webkit-transition: -webkit-transform 0.5s ease-in-out;
  transition: -webkit-transform 0.5s ease-in-out;
  transition: transform 0.5s ease-in-out;
  transition: transform 0.5s ease-in-out, -webkit-transform 0.5s ease-in-out;
}
.btn-left {
  border-right: 1px solid #dcdcdc;
}
.btn-right {
  border-left: 1px solid #dcdcdc;
}
</style>



