<template>
  <div>
    <div class="v2-search" v-show="$route.name!=='lotteryReportDetail'">
      <Form ref="searchKey" inline>
        <GameSelect
          ref="GameSelect"
          :platforname="platformessg"
          @on-game-change="onGameChange"
          @on-platform-change="onPlatformChange"
          :clearable="true"
          placeholder="全部"
          @clearData="clearData"
        ></GameSelect>
        <FormItem label="开始日期">
          <DatePicker
            type="datetime"
            :class="screen<1400?'s-175':'s-185'"
            placeholder="开始日期"
            v-model="Time[0]"
            format="yyyy-MM-dd HH:mm:ss"
            :options="options3"
            @on-change='timeChange'
          ></DatePicker>
        </FormItem>
        <FormItem label="结束日期">
          <DatePicker
            type="datetime"
            :class="screen<1400?'s-175':'s-185'"
            placeholder="结束日期"
            v-model="Time[1]"
            format="yyyy-MM-dd HH:mm:ss"
            :options="options3"
            @on-change='timeChange'
          ></DatePicker>
        </FormItem>
        <FormItem label="注单编号" v-if="searchKey.type == 'live_casino'">
          <Input :class="[screen<1960&&screen>=1400?'s-100':screen<1400?'s-74':'s-150']" v-model="searchKey.billNo" placeholder="注单编号"/>
        </FormItem>
        <FormItem label="注单编号" v-if="searchKey.type != 'live_casino' && searchKey.type != 'lottery'">
          <Input :class="[screen>1960?'s-150':'s-100']" v-model="searchKey.billNo" placeholder="注单编号"/>
        </FormItem>
        <FormItem label='期数' v-if="searchKey.type == 'lottery'">
          <Input :class="[screen<=1400?'s-74':screen<1500&&screen>=1400?'s-90':screen<2000&&screen>1500?'s-110':'s-130']" v-model="searchKey.issue" placeholder="期数"/>
        </FormItem>
        <FormItem label="局号" v-if="searchKey.type == 'live_casino'">
          <Input
            :class="[screen<1690?'s-66':'s-110']"
            v-model="searchKey.gameCode"
            placeholder="局号"
            :key="searchKey.type"
          />
        </FormItem>
        <FormItem v-if="searchKey.type == 'lottery'">
          <Select v-model="searchKey.status" class="w80x" placeholder='全部' clearable>
            <!-- <Option value="all">全部</Option> -->
            <Option value="yes">已结算</Option>
            <Option value="no">未结算</Option>
          </Select>
        </FormItem>
        <FormItem label="会员账号" v-if="searchKey.type == 'live_casino'">
          <Input v-model="searchKey.userName" placeholder="输入账号" :class="[screen<=1400?'s-74':screen<1500&&screen>=1400?'s-90':screen<2000&&screen>1500?'s-110':'s-130']"/>
        </FormItem>
         <FormItem label="会员账号" v-if="searchKey.type !== 'live_casino'">
          <Input v-model="searchKey.userName" placeholder="输入账号" :class="[screen<=1400?'s-74':screen<1500&&screen>=1400?'s-90':screen<2000&&screen>1500?'s-110':'s-130']"/>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.tableLoading"
            class="search"
            @click="searchSubmit"
          >查询</Button>
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            :loading="$root.editBtnLoading"
            class="ivu-btn export"
            @click="exportExcel"
          >导出Excel</Button>
        </FormItem>
      </Form>
    </div>
    <div class="v2-table">
      <div class="ivu-table ivu-table-default ivu-table-border" v-if="table.data.length == 0">
        <div class="ivu-table-header">
          <table cellspacing='0' cellpadding='0' border="0" style="width: 100%;minWidth: 1316px;">
            <tr>
              <th v-for="(t,i) in table.columns" :key="'table_Column' + i" :class="t.class" :style="{minWidth: t.minWidth, color: '#444444', fontWeight: 'normal!important', fontSize: '1rem', borderTop: '1px solid #dcdcdc!important'}">{{t.name}}</th>
            </tr>
          </table>
        </div>
        <div class="ivu-table-tip">
          <table cellspacing='0' cellpadding='0' border="0">
            <tr><td style="width: 100%;minWidth: 1316px;" class="bl"></td></tr>
          </table>
        </div>
      </div>
      <table v-else class="ivu-table ivu-table-default ivu-table-border" cellspacing='0' cellpadding='0' border="0" style="width: 100%;minWidth: 1316px;position: relative;">
        <tr>
          <th v-for="(t,i) in table.columns" :key="'table_column' + i" :class="t.class" :style="{minWidth: t.minWidth}">{{t.name}}</th>
        </tr>
        <Spin v-if="$root.tableLoading" fix>
          <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
            <div v-for="t in 8" :key="'div'+t"></div>
          </div>
        </Spin>
        <tr v-for="(t,i) in table.data" :key="'table_data_lottery' + i" v-if="columnsKey == 'lottery'">
          <td class="ivu-table-column-center bl">{{t.billNo}}</td>
          <td class="ivu-table-column-center">{{t.userName}}</td>
          <td class="ivu-table-column-center">{{t.lotteryName}}</td>
          <td class="ivu-table-column-center">{{t.issue}}</td>
          <td class="ivu-table-column-center">{{Number(t.betAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{Number(t.validBetAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center" :style="{color: t.netAmount > 0 ? '#FF2626' : '#239961'}">{{Number(t.netAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">
            <Tooltip transfer style="whiteSpace: normal;">
              <p style="textOverflow: ellipsis; whiteSpace: nowrap;overflow: hidden;">{{`${$root.text(t.playwayName)}/${$root.text(t.ball)}/${t.betInfo}`}}</p>
              <div slot="content">
                <span>{{$root.text(t.playwayName)}} / </span>
                <span>{{$root.text(t.ball)}} / </span>
                <span :style="{display: t.betInfo && t.betInfo.length > 16 ? 'block' : ''}">{{t.betInfo}}</span>
              </div>
            </Tooltip>
          </td>
          <td class="ivu-table-column-center">{{t.odds}}</td>
          <td class="ivu-table-column-center">{{$root.text(t.result)}}</td>
          <td class="ivu-table-column-center">{{Number(t.fdAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center" :style="{color: t.status == 0 || t.status == 1 ? '#2D8CF0' : t.status == 2 ? '#FF2626' : '#239961'}">
            {{t.status == 0 ? '未结算' : t.status == 1 ? '赢' : t.status == 2 ? '输' : t.status == 4 ? '已取消' : '已撤销'}}
          </td>
          <td class="ivu-table-column-center">
            <div class="flex-colum">
              <div class="bb mt2">{{$root.unixTime(t.betTime)}}</div>
              <div>{{$root.unixTime(t.openTime)}}</div>
            </div>
          </td>
          <td class="ivu-table-column-center">
            <a :style="{color: t.status == 0 || t.status == 1 || t.status == 2 ? '#2DBCF0' : '#918b8b', display: adminType == 'super' || authInPage.indexOf('lotteryRevocationUser') != -1 ? 'inline-block' : 'none'}"
            @click="revoc(t)">撤单</a>
          </td>
        </tr>
        <tr v-for="(t,i) in table.data" :key="'table_data_sport' + i" v-if="columnsKey == 'sport'">
          <td class="ivu-table-column-center bl">{{t.billNo}}</td>
          <td class="ivu-table-column-center">{{t.userName}}</td>
          <td class="ivu-table-column-center">{{t.playerName}}</td>
          <td class="ivu-table-column-center">{{t.platform}}</td>
          <td class="icu-table-column-center">{{Number(t.betAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{Number(t.validBetAmount).toFixed(2)}}</td>
          <td class="ivu-table-column center" :style="{color: t.netAmount > 0 ? '#FF2626' : '#239961'}">{{Number(t.netAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{t.gameName}}</td>
          <td class="ivu-table-column-center">
            <div class="ivu-table-cell" v-if="!t.betInfo">-</div>
            <div class="cs" v-else @click="showBetInfo(t.betInfo, t.score)">{{`${t.betInfo[0].leaguename}${t.betInfo[0].awayteamname}VS${t.betInfo[0].hometeamname}${t.betInfo[0].bettypename}`}}</div>
          </td>
          <td class="ivu-table-column-center">{{t.status == 0 ? '未结算' : t.status == 1 ? '已结算' : '无效'}}</td>
          <td class="ivu-table-column-center">{{$root.unixTime(t.betTime)}}</td>
        </tr>
        <tr v-if="columnsKey == 'live_casino'" v-for="(t,i) in table.data" :key="'table_data_live' + i">
          <td class="ivu-table-column-center bl">{{t.billNo}}</td>
          <td class="ivu-table-column-center">{{t.userName}}</td>
          <td class="ivu-table-column-center">{{t.playerName}}</td>
          <td class="ivu-table-column-center">{{t.platform}}</td>
          <td class="ivu-table-column-center">{{t.gameCode}}</td>
          <td class="ivu-table-column-center">{{Number(t.betAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{Number(t.validBetAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center" :style="{color: t.netAmount > 0 ? '#FF2626' : '#239961'}">{{Number(t.netAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{t.gameName}}</td>
          <td class="ivu-table-column-center">{{t.betInfo}}</td>
          <td class="ivu-table-column-center">{{$root.unixTime(t.betTime)}}</td>
        </tr>
        <tr v-if="columnsKey == 'chess'" v-for="(t,i) in table.data" :key="'table_data_chess' + i">
          <td class="ivu-table-column-center bl">{{t.billNo}}</td>
          <td class="ivu-table-column-center">{{t.userName}}</td>
          <td class="ivu-table-column-center">{{t.playerName}}</td>
          <td class="ivu-table-column-center">{{t.platform}}</td>
          <td class="ivu-table-column-center">{{Number(t.betAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{Number(t.validBetAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center" :style="{color: t.netAmount > 0 ? '#FF2626' : '#239961'}">{{Number(t.netAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{t.gameName}}</td>
          <td class="ivu-table-column-center">{{Number(t.revenue).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{$root.unixTime(t.betTime)}}</td>
        </tr>
        <tr v-if="columnsKey == 'slot'" v-for="(t,i) in table.data" :key="'table_data_slot' + i">
          <td class="ivu-table-column-center bl">{{t.billNo}}</td>
          <td class="ivu-table-column-center">{{t.userName}}</td>
          <td class="ivu-table-column-center">{{t.playerName}}</td>
          <td class="ivu-table-column-center">{{t.platform}}</td>
          <td class="ivu-table-column-center">{{Number(t.betAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{Number(t.validBetAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center" :style="{color: t.netAmount > 0 ? '#FF2626' : '#239961'}">{{Number(t.netAmount).toFixed(2)}}</td>
          <td class="ivu-table-column-center">{{t.gameName}}</td>
          <td class="ivu-table-column-center">{{$root.unixTime(t.betTime)}}</td>
        </tr>
      </table>
      <div class="ivu-table-footer bb bl br" style="width: 100%;minWidth: 1316px;" v-show="table.data.length > 0">
        <div class="clearfix fontColor">
          <p class="fl ml20"><span>总计</span></p>
          <p class="fl ml70"><span>投注金额</span><span class="pl15 red-font">{{statistics.betAmount ? Number(statistics.betAmount).toFixed(2) : '0.00'}}</span></p>
          <p class="fl ml70"><span>有效投注</span><span class="pl15 red-font">{{statistics.validBetAmount ? Number(statistics.validBetAmount).toFixed(2) : '0.00'}}</span></p>
          <p class="fl ml70"><span>会员输赢</span><span class="pl15 red-font">{{statistics.netAmount ? Number(statistics.netAmount).toFixed(2) : '0.00'}}</span></p>
          <p class="fl ml70"><span>撤单金额</span><span class="pl15 red-font">{{statistics.revokeAmount ? Number(statistics.revokeAmount).toFixed(2) : '0.00'}}</span></p>
          <p class="fl ml70"><span>取消金额</span><span class="pl15 red-font">{{statistics.cancelAmount ? Number(statistics.cancelAmount).toFixed(2) : '0.00'}}</span></p>
        </div>
      </div>
      <div class="ivu-page mt20" style="textAlign: right;width: 100%;minWidth: 1316px;" v-show="table.data.length > 0">
        <Page :total='table.total' show-sizer show-total :page-size-opts="[20, 30, 40, 50]" :page-size='searchKey.limit'
          @on-change='onPageChange' @on-page-size-change='onPageSizeChange' :current.sync="page"
        ></Page>
      </div>
    </div>
    <!-- 下注内容弹窗 -->
    <Modals title="下注内容" width="500" ref="betInfoModal">
      <div slot="content" class="bb ab ml20 mr20 mb20">
        <div v-for="(t,i) in betInfoData" :key="'info'+i" class="pt10 pb10 b betInfo ti10">
          <div class="ft16">{{t.leaguename}}</div>
          <div class="ft14 mt5 mb5">
            <span>{{t.hometeamname}}</span>
            <span class="blue-font pl5 pr5">VS</span>
            <span>{{t.awayteamname}}</span>
            <span class="pl5 green-font">{{t.score}}</span>
          </div>
          <div class="ft14 green-font mt5 mb5">
            <span>{{t.bettypename}}</span>
          </div>
          <div class="red-font ft14">
            <span>{{t.teambetname}}</span>
            <span class="pl5 pr5">{{t.hdp}}</span>
            <span>@{{$root.keepTwo(t.odds)}}</span>
          </div>
        </div>
      </div>
    </Modals>
    <!-- 导出更改 -->
    <Modals :width="560" ref="exportPageModal" title="温馨提示" class="modalBox">
			<div slot="content" class="modal-overflow clearfix ft14 mt5 mt20f mb20 " :style="exportPage.length>5?'height:370px':''" >
        <div class="f6Color">
        <Icons class="ml23 iconColor" type="danchuangtishi" size="18" />
				<span class="pb10 pt10 ft14 ib ml10 f-color " >当前查询结果共{{table.total}}条，需要分批导出！</span>
        </div>
					<div
						class=" blue-font fl w50 "
						v-for="(t,i) in exportPage"
						:style="{color: t.status == 'yes' ? '#918b8b' : ''}"
						:key="'export' + i"
						@click="batchExport((t.index)+1)"
					>
          <span class=" ft14 mt20 ib bd b  w210x pt10 pb10 txt-a ml35 " v-if="exportPage && i < (exportPage.length - 1)">导出第{{(10000*(t.index) + 1)}} ~ {{10000 * ((t.index)+1)}}条数据</span>
          <span class="ft14 ib mt20  bd b  w210x pt10 pb10 txt-a ml35 " v-if="exportPage && i == (exportPage.length - 1)">导出第{{(10000*(t.index) + 1)}}~ {{table.total}}条数据</span>
					</div>
			</div>
		</Modals>
  </div>
</template>
<script>
import GameSelect from "@/components/game-select";
import Icons from "@/components/icons";
import Tables from "@/components/tables";
import tableMixins from "@/mixins/table";
import Modals from "_c/modals";
import { getUserType } from "@/libs/util";
import { getgameRecordsDetailData } from "@/api/report";
import { lotteryRevocationUser } from "@/api/lottery";
import { mapState } from "vuex";
import { Tooltip } from 'view-design';
export default {
  components: {
    Icons,
    Tables,
    GameSelect,
    Modals
  },
  computed: {
    ...mapState({
      game_report_live: state => state.report.game_report_live,
      game_report_slot: state => state.report.game_report_slot,
      game_report_chess: state => state.report.game_report_chess,
      game_report_lottery: state => state.report.game_report_lottery,
      game_report_sport: state => state.report.game_report_sport
    })
  },
  data() {
    return {
      count: 0, // 部分用户切换游戏类型结束时间不对
      screen:screen.width,
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      betInfoData: [],
      page: 1,
      exportPage: [],//导出数据过大时的页数
      searchKey: {
        status: "",
        startTime: this.$root.startTime(),
        endTime: this.$root.midnight(),
        type: "live_casino",
        siteId: this.$root.nowSite.id,
        limit: 20
      },
      Time: [this.$root.startTime(), this.$root.midnight()],
      columnsKey: "live_casino",
      _key: 'live_casino',
      statistics: {},
      platformessg: { game: "live_casino:2", platform: "" },
      options3: {
        disabledDate: date => {
          return (
            date &&
            date.valueOf() < new Date(this.$root.totalDataStartTime()).getTime()
          );
        }
      },
      table: {
        total: 0,
        columns: [],
        data: [],
        pageSizeOpts: [20, 30, 40, 50]
      }
    };
  },
  created() {
    this.$nextTick(() => {
      this.$refs.GameSelect.init();
      if (this.$route.query.platform)
        this.$refs.GameSelect.onPlatformChange(this.$route.query.platform);
    });
    if (this.$route.query.startTime) {
      const {
        startTime,
        endTime,
        type,
        platform,
        gameType
      } = this.$route.query;
      this.searchKey = { ...this.searchKey, ...this.$route.query };
      this.Time = [startTime, endTime];
      this.platformessg.platform = platform;
      this.updateColumns(gameType);
      this.platformessg.game = gameType == 'getfish' ? 'getfish:0' : (gameType == 'chess' ? 'chess:1' : (gameType == 'live_casino' ? 'live_casino:2' : (gameType == 'sport' ? 'sport:3' : (gameType == 'slot' ? 'slot:4' : 'lottery:5'))))
    } else {
      this.platformessg.game = "live_casino:2";
      this.platformessg.platform = "";
      this.updateColumns("live_casino");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getData({ params: this.searchKey });
    });
    this.$Message.config({
      top: 50,
      duration: 1
    });
  },
  beforeDestroy() {
    this.count = 0;
  },
  methods: {
    timeChange(time, type) {
      this.count++;
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      let data = { ...this.searchKey };
      data.siteId = this.$root.nowSite.id;
      if (data.billNo) data.billNo = this.$root.trimAll(data.billNo);
      let reg2 = /^[0-9a-zA-Z-_]{6,}$/;
      if (data.billNo && !reg2.test(data.billNo)) {
        this.$Tip.info({ content: "注单编号不正确，请重新输入" });
        return false;
      }
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.gameCode) data.gameCode = this.$root.trimAll(data.gameCode);
      let reg = /^[0-9a-zA-Z,-]{5,}$/;
      if (data.gameCode && !reg.test(data.gameCode)) {
        this.$Tip.info({ content: "局号不正确，请重新输入" });
        return false;
      }
      if (data.issue) {
        data.issue = this.$root.trimAll(data.issue)
        if (data.issue && !/([0-9]*)/.test(data.issue)) {
          this.$Tip.info({ content: '期数不正确，请重新输入' })
          return false
        }
      }
      if (!data.startTime && !data.endTime) {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }

      if (!data.userName) delete data.isLike;

      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.userName) data.userName = this.$root.trimAll(data.userName);
      if (!this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.getData({ params: data });
    },
    revoc(params) {
      const { status, id, uid, lotteryId, issue } = params
      if (status == 0 || status == 1 || status == 2) {
        let data = { siteId: this.$root.nowSite.id, lid: lotteryId, uid, issue, id }
        this.$Tip.confirm({
          content: '您确定撤销此笔注单吗？撤销后将返还所有会员投注',
          onOk: () => {
            if (status == 0 || status == 1 || status == 2) {
              lotteryRevocationUser(data, true).then(res => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success('撤单成功')
                  this.getData({ params: { ...this.searchKey, siteId: this.$root.nowSite.id }, query: { page: this.page }})
                }
              })
            }
          }
        })
      }
    },
    //更新表头
    updateColumns(key) {
      this.table.columns = [];
      this.table.columns = key == 'live_casino' ? this.game_report_live : (key == 'slot' ? this.game_report_slot : (key == 'chess' ? this.game_report_chess : (key == 'lottery' ? this.game_report_lottery : (key == 'sport' ? this.game_report_sport : this.game_report_live))))
    },
    //切换游戏类型
    onGameChange(res) {
      this.searchKey.type = res;
      // this.columnsKey = res;
      this._key = res
      delete this.searchKey.issue
      delete this.searchKey.gameCode;
      delete this.searchKey.platform;
    },
    //切换游戏平台
    onPlatformChange(res) {
      this.searchKey.platform = res;
    },
    getData(data) {
      let dataParams = data.params;
      for (let key in dataParams) {
        if (!dataParams[key]) delete dataParams[key];
      }
      if (dataParams.type != 'lottery') delete data.params.issue
      if (data.params.platformName) delete data.params.platformName;
      if (data.params.gameType) delete data.params.gameType;
      if (!data.params.status || data.params.status == undefined) data.params.status = 'all'
      this.$root.startTableLoading();
      if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
      if (data.params.platform == "all") delete data.params.platform;
      // 暂时把更新列数据的方法放这儿  正式站的偶发性bug
      this.updateColumns(this._key);
      getgameRecordsDetailData(data).then(res => {
        if (res != undefined && res.code == 200) {
          const { list, total } = res.data.data;
          this.statistics = total;
          this.table.data = list;
          this.table.total = res.data.total;
          this.columnsKey = this._key
        }
        this.$root.endTableLoading()
      }).catch(error => this.$root.endTableLoading())
    },
    showBetInfo(data, score) {
      data.forEach(t => this.$set(t, 'score', score))
      this.$refs.betInfoModal.show();
      this.betInfoData = data;
    },
    clearData() {
      this.searchKey.type = "live_casino";
    },
    batchExport(index) {
      let params = { ...this.searchKey, isExport: 1, export_page: index }
      if (10000 * index > this.table.total) params.export_limit = this.table.total - ((10000 * (index - 1)) + 1)
      else params.export_limit = '10000'
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeS(startTime);
        if (this.count == 0) params.endTime = endTime && this.$root.formatnightTimeS(endTime)
        else params.endTime = endTime && this.$root.formatTimeS(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = params.startTime;
      this.searchKey.endTime = params.endTime;
      if (params.gameCode)
        params.gameCode = this.$root.trimAll(params.gameCode);
      let reg = /^[0-9a-zA-Z,-]{5,}$/;
      if (params.gameCode && !reg.test(params.gameCode)) {
        this.$Tip.info({ content: "局号不正确，请重新输入" });
        return false;
      }
      if (params.billNo) params.billNo = this.$root.trimAll(params.billNo);
      let reg2 = /^[0-9a-zA-Z-_]{6,}$/;
      if (params.billNo && !reg2.test(params.billNo)) {
        this.$Tip.info({ content: "注单编号不正确，请重新输入" });
        return false;
      }
      if (!params.startTime && !params.endTime) {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }
      if (params.issue) {
        params.issue = this.$root.trimAll(params.issue)
        if (params.issue && !/([0-9]*)/.test(params.issue)) {
          this.$Tip.info({ content: '期数不正确，请重新输入' })
          return false
        }
      }
      if (!params.userName) delete params.isLike;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);
      if (!this.$root.validateName(params.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.$root.startEditLoading();
       let openr = window.open();
      getgameRecordsDetailData({ params }).then(res => {
        if (res.code == 200) {
          this.exportPage[index-1].status = 'yes'
          let region = res.data.downloadUrl;
          let nowHost = region.split(".com")[1];
          let openr1 = openr ? openr : window;
          openr1.location.href = nowHost;
        } else {
          openr.close();
        }
        this.$root.endEditLoading()
      }).catch(error => this.$root.endEditLoading())
    },
    onPageChange(page) {
      this.page = page;
      let data = { ...this.searchKey };
      data.siteId = this.$root.nowSite.id;
      if (data.billNo) data.billNo = this.$root.trimAll(data.billNo);
      let reg2 = /^[0-9a-zA-Z-_]{6,}$/;
      if (data.billNo && !reg2.test(data.billNo)) {
        this.$Tip.info({ content: "注单编号不正确，请重新输入" });
        return false;
      }
      if (data.gameCode) data.gameCode = this.$root.trimAll(data.gameCode);
         let reg = /^[0-9a-zA-Z,-]{5,}$/;
      if (!data.startTime && !data.endTime) {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }
      if (data.issue) {
        data.issue = this.$root.trimAll(data.issue)
        if (data.issue && !/([0-9]*)/.test(data.issue)) {
          this.$Tip.info({ content: '期数不正确，请重新输入' })
          return false
        }
      }
      if (!data.userName) delete data.isLike;
      for (let key in data) {
        if (!data[key]) delete data[key];
      }
      if (data.userName) data.userName = this.$root.trimAll(data.userName);
      if (!this.$root.validateName(data.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.getData({ params: data, query: { page } });
    },
    searchSubmit() {
      let params = { ...this.searchKey };
      params.siteId = this.$root.nowSite.id;
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeS(startTime);
        if (this.count == 0) params.endTime = endTime && this.$root.formatnightTimeS(endTime)
        else params.endTime = endTime && this.$root.formatTimeS(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = params.startTime;
      this.searchKey.endTime = params.endTime;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      if (params.gameCode)
        params.gameCode = this.$root.trimAll(params.gameCode);
      let reg = /^[0-9a-zA-Z,-]{5,}$/;
      if (params.gameCode && !reg.test(params.gameCode)) {
        this.$Tip.info({ content: "局号不正确，请重新输入" });
        return false;
      }
      if (params.billNo) params.billNo = this.$root.trimAll(params.billNo);
      let reg2 = /^[0-9a-zA-Z-_]{6,}$/;
      if (params.billNo && !reg2.test(params.billNo)) {
        this.$Tip.info({ content: "注单编号不正确，请重新输入" });
        return false;
      }
      if (params.issue) {
        params.issue = this.$root.trimAll(params.issue)
        if (params.issue && !/^([0-9]*)$/.test(params.issue)) {
          this.$Tip.info({ content: '期数不正确，请重新输入' })
          return false
        }
      }
      if (!params.startTime && !params.endTime) {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }
      if (!params.userName) delete params.isLike;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);
      if (!this.$root.validateName(params.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }
      this.page = 1
      this.searchKey = { ...params }
      this.getData({ params });
    },
    exportExcel() {
      this.exportPage=[];
      let params = { ...this.searchKey, isExport: 1 }
      if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        params.startTime = startTime && this.$root.formatTimeS(startTime);
        if (this.count == 0) params.endTime = endTime && this.$root.formatnightTimeS(endTime)
        else params.endTime = endTime && this.$root.formatTimeS(endTime);
      } else {
        return false;
      }
      this.searchKey.startTime = params.startTime;
      this.searchKey.endTime = params.endTime;
      if (params.gameCode)
        params.gameCode = this.$root.trimAll(params.gameCode);
      let reg = /^[0-9a-zA-Z,-]{5,}$/;
      if (params.gameCode && !reg.test(params.gameCode)) {
        this.$Tip.info({ content: "局号不正确，请重新输入" });
        return false;
      }
      if (params.billNo) params.billNo = this.$root.trimAll(params.billNo);
      let reg2 = /^[0-9a-zA-Z-_]{6,}$/;
      if (params.billNo && !reg2.test(params.billNo)) {
        this.$Tip.info({ content: "注单编号不正确，请重新输入" });
        return false;
      }
      if (!params.startTime && !params.endTime) {
        this.$Tip.info({ content: "请输入开始和结束时间！" });
        return false;
      }
      if (params.issue) {
        params.issue = this.$root.trimAll(params.issue)
        if (params.issue && !/([0-9]*)/.test(params.issue)) {
          this.$Tip.info({ content: '期数不正确，请重新输入' })
          return false
        }
      }
      if (!params.userName) delete params.isLike;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      if (params.userName)
        params.userName = this.$root.trimAll(params.userName);
      if (!this.$root.validateName(params.userName)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }

      if (this.table.total > 150000) {
        let num = ((this.table.total) % 10000) == 0 ? (this.table.total) / 10 : Math.floor((this.table.total) / 10000) + 1
        for (let i = 0; i < num; i ++){
          this.exportPage.push({ index: i, status: 'no' })
        }
        this.$refs.exportPageModal.show()
      } else {
        this.$root.startEditLoading();
        let openr = window.open();
        getgameRecordsDetailData({ params }).then(res => {
          if (res != undefined && res.code == 200) {
          let region = res.data.downloadUrl;
          let nowHost = region.split(".com")[1];
          let openr1 = openr ? openr : window;
          openr1.location.href = nowHost;
        } else {
          openr.close();
        }
        this.$root.endEditLoading()
        }).catch(error => this.$root.endEditLoading())
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../styles/button.less";
/deep/.ivu-table {
  font-size: 0.875rem;
  .ivu-table-cell {
    text-overflow: unset;
  }
}
.ivu-form-item {
  &:nth-child(7) {
    margin-right: -5px;
  }
}
/deep/.text-overflow-ellipsis {
  white-space: pre-wrap;
  -webkit-line-clamp: 2;
}
.betInfo {
  &:nth-child(2n) {
    border-top: 0;
    border-bottom: 0;
  }
}
.ib {
  margin-right:20px;
}
/deep/.cs {
  width: 100px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/deep/.ivu-tooltip{
  width:100%;
}
.font-color{
  color:#333333;
}
/deep/.ivu-table {
  letter-spacing: 0 !important;
}
 /deep/.ivu-date-picker {
    margin-right:0;
 }
@media screen and (min-width:960px) and (max-width:1460px){
  .ib {margin-right:0 }
 /deep/.v2-search {
	 .ivu-form-item {
    margin-right: 16px !important;
		 .ivu-form-item-label {
			 margin-right: 4px !important;
     }
	 }
 }
}
.ab{
  max-height: 500px;
  overflow-y: auto;
}
.ivu-table{
  tr{
    th{
      &:nth-child(1) {
        border-left: 1px solid #dcdcdc;
      }
    }
  }
}
.ft-n{
  font-weight: normal!important;
  font-size: 1rem;
  color: #444444;
}
</style>


