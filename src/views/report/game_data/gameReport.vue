<template>
    <div>
        <div class="v2-search clearfix" v-show="$route.name !== 'lotteryReportDetail'">
            <Form ref="searchKey" class="fl" inline>
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
                        :class="screen < 1400 ? 's-175' : 's-185'"
                        placeholder="开始日期"
                        v-model="Time[0]"
                        format="yyyy-MM-dd HH:mm:ss"
                        :options="options3"
                        @on-change="timeChange"
                    ></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker
                        type="datetime"
                        :class="screen < 1400 ? 's-175' : 's-185'"
                        placeholder="结束日期"
                        v-model="Time[1]"
                        format="yyyy-MM-dd HH:mm:ss"
                        :options="options3"
                        @on-change="timeChange"
                    ></DatePicker>
                </FormItem>
                <FormItem label="注单编号" v-if="searchKey.type == 'live_casino'">
                    <Input   @on-keyup="searchKey.billNo = searchKey.billNo.replace(/[\u4E00-\u9FA5]/g, '')" :class="[screen < 1960 && screen >= 1400 ? 's-90' : screen < 1400 ? 's-74' : 's-150']" v-model="searchKey.billNo" placeholder="注单编号" />
                </FormItem>
                <FormItem label="注单编号" v-if="searchKey.type != 'live_casino' && searchKey.type != 'lottery'">
                    <Input @on-keyup="searchKey.billNo = searchKey.billNo.replace(/[\u4E00-\u9FA5]/g, '')"  :class="[screen > 1960 ? 's-150' : 's-90']" v-model="searchKey.billNo" placeholder="注单编号" />
                </FormItem>
                <FormItem label="期数" v-if="searchKey.type == 'lottery'">
                    <Input
                        :class="[screen <= 1400 ? 's-74' : screen < 1500 && screen >= 1400 ? 's-90' : screen < 2000 && screen > 1500 ? 's-110' : 's-130']"
                        v-model="searchKey.issue"
                        placeholder="期数"
                    />
                </FormItem>
                <FormItem label="局号" v-if="searchKey.type == 'live_casino'">
                    <Input :class="[screen < 1690 ? 's-66' : 's-110']" v-model="searchKey.gameCode" placeholder="局号" :key="searchKey.type" />
                </FormItem>
                <FormItem v-if="searchKey.type == 'lottery'" label="状态">
                    <Select v-model="searchKey.status" class="w80x" placeholder="全部" clearable>
                        <Option value="yes">已结算</Option>
                        <Option value="no">未结算</Option>
                    </Select>
                </FormItem>
                <FormItem label="会员账号"  v-if="searchKey.type == 'live_casino'">
                    <Input
                        v-model="searchKey.userName"
                        placeholder="输入账号"
                        @keyup.enter.native="searchSubmit"
                        :class="[screen <= 1400 ? 's-74' : screen < 1500 && screen >= 1400 ? 's-90' : screen < 2000 && screen > 1500 ? 's-110' : 's-130']"
                    />
                </FormItem>
                <FormItem label="会员账号" v-if="searchKey.type !== 'live_casino'">
                    <Input
                        v-model="searchKey.userName"
                        placeholder="输入账号"
                        @keyup.enter.native="searchSubmit"
                        :class="[screen <= 1400 ? 's-74' : screen < 1500 && screen >= 1400 ? 's-90' : screen < 2000 && screen > 1500 ? 's-110' : 's-130']"
                    />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel">导出Excel</Button>
                </FormItem>

            </Form>
                <!-- <div  class="fl ml20"><Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button></div>
                <div  class="fl ml20"><Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel">导出Excel</Button></div> -->
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :columns="table.columns"
                :value="table.data"
                :total="table.total"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                :pageSizeOpts="table.pageSizeOpts"
            >
                <div slot="footer">
                    <div class="clearfix fontColor">
                        <p class="fl ml20">
                            <span>总计</span>
                        </p>
                        <p class="fl ml70">
                            <span>投注金额</span>
                            <span class="pl15 red-font">{{ Number(statistics.betAmount).toFixed(2) }}</span>
                        </p>
                        <p class="fl ml70">
                            <span>有效投注</span>
                            <span class="pl15 red-font">{{ Number(statistics.validBetAmount).toFixed(2) }}</span>
                        </p>
                        <p class="fl ml70">
                            <span>会员输赢</span>
                            <span class="pl15 red-font">{{ Number(statistics.netAmount).toFixed(2) }}</span>
                        </p>
                        <p class="fl ml70" v-show="searchKey.type == 'lottery'">
                            <span>撤单金额</span>
                            <span class="pl15 red-font">{{ statistics.revokeAmount ? Number(statistics.revokeAmount).toFixed(2) : '0.00' }}</span>
                        </p>
                        <p class="fl ml70" v-show="searchKey.type == 'lottery'">
                            <span>取消金额</span>
                            <span class="pl15 red-font">{{ statistics.cancelAmount ? Number(statistics.cancelAmount).toFixed(2) : '0.00' }}</span>
                        </p>
                    </div>
                </div>
            </Tables>
        </div>
        <!-- 下注内容弹窗 -->
        <Modals title="下注内容" width="500" ref="betInfoModal">
            <div slot="content" class="bb ab ml20 mr20 mb20">
                <div v-for="(t, i) in betInfoData" :key="'info' + i" class="pt10 pb10 b betInfo ti10">
                    <div class="ft16">{{ t.leaguename }}</div>
                    <div class="ft14 mt5 mb5">
                        <span>{{ t.hometeamname }}</span>
                        <span class="blue-font pl5 pr5">VS</span>
                        <span>{{ t.awayteamname }}</span>
                        <span class="pl5 green-font">{{ t.score }}</span>
                    </div>
                    <div class="ft14 green-font mt5 mb5">
                        <span>{{ t.bettypename }}</span>
                    </div>
                    <div class="red-font ft14">
                        <span>{{ t.betteamname }}</span>
                        <span class="pl5 pr5">{{ t.hdp }}</span>
                        <span>@{{ $root.keepTwo(t.odds) }}</span>
                    </div>
                </div>
            </div>
        </Modals>
        <!-- 真人视讯的下注内容 -->
        <Modals ref="numberModal" title="下注内容">
            <div slot="content" class="pl20 pr20 pb20">
                <span style="word-wrap:break-word;line-height:25px">{{ this.showNumber }}</span>
            </div>
        </Modals>
        <!-- 导出更改 -->
        <Modals :width="560" ref="exportPageModal" title="温馨提示" class="modalBox">
            <div slot="content" class="modal-overflow clearfix ft14 mt5 mt20f mb20" :style="exportPage.length > 5 ? 'height:370px' : ''">
                <div class="f6Color">
                    <Icons class="ml23 iconColor" type="danchuangtishi" size="18" />
                    <span class="pb10 pt10 ft14 ib ml10 f-color">当前查询结果共{{ table.total }}条，需要分批导出！</span>
                </div>
                <div
                    class="blue-font fl w50"
                    v-for="(t, i) in exportPage"
                    :style="{ color: t.status == 'yes' ? '#918b8b' : '' }"
                    :key="'export' + i"
                    @click="batchExport(t.index + 1)"
                >
                    <span class="ft14 mt20 ib bd b w210x pt10 pb10 txt-a ml35" v-if="exportPage && i < exportPage.length - 1"
                        >导出第{{ 10000 * t.index + 1 }} ~ {{ 10000 * (t.index + 1) }}条数据</span
                    >
                    <span class="ft14 ib mt20 bd b w210x pt10 pb10 txt-a ml35" v-if="exportPage && i == exportPage.length - 1"
                        >导出第{{ 10000 * t.index + 1 }}~ {{ table.total }}条数据</span
                    >
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import GameSelect from '@/components/game-select';
import Icons from '@/components/icons';
import Tables from '@/components/tables';
import Modals from '_c/modals';
import { getUserType } from '@/libs/util';
import { getgameRecordsDetailData } from '@/api/report';
import { lotteryRevocationUser } from '@/api/lottery';
import { mapState } from 'vuex';

export default {
    name: 'gameReport',
    components: {
        Icons,
        Tables,
        GameSelect,
        Modals
    },
    computed: {
        ...mapState({
            // liveData: state => state.info.live,
            chessData: state => state.info.chess,
            slotData: state => state.info.slot
        })
    },
    data() {
        return {
            newLotteryData: [],
            rentType: localStorage.loginType,
            showNumber: [],
            count: 0, // 部分用户切换游戏类型结束时间不对
            screen: screen.width,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            betInfoData: [],
            page: 1,
            exportPage: [], //导出数据过大时的页数
            searchKey: {
                status: '',
                startTime: this.$root.startTime(),
                endTime: this.$root.midnight(),
                type: 'live_casino',
                siteId: this.$root.nowSite.id
            },
            Time: [this.$root.startTime(), this.$root.midnight()],
            columnsKey: 'live_casino',
            statistics: {},
            platformessg: { game: 'live_casino:2', platform: '' },
            options3: {
                disabledDate: date => {
                    return date && date.valueOf() < new Date(this.$root.totalDataStartTime()).getTime();
                }
            },
            table: {
                total: 0,
                columns: [],
                data: [],
                pageSizeOpts: [20, 30, 40, 50]
            },
            // 真人视讯
            liveData: [
                {
                    title: '注单编号',
                    key: 'billNo',
                    align: 'center',
                    tooltip: true,
                    minWidth: 160
                },
                {
                    title: '会员账号',
                    key: 'userName',
                    align: 'center',
                    tooltip: true,
                    minWidth: 60
                },
                {
                    title: '游戏账号',
                    key: 'playerName',
                    align: 'center',
                    minWidth: 95,
                    tooltip: true
                },
                {
                    title: '游戏平台',
                    key: 'platform',
                    align: 'center',
                    minWidth: 95,
                    tooltip: true
                },
                {
                    title: '局号',
                    key: 'gameCode',
                    align: 'center',
                    minWidth: 95,
                    tooltip: true
                },
                {
                    title: '期数',
                    key: 'gameCode',
                    align: 'center',
                    minWidth: 85
                },
                {
                    title: '投注金额',
                    key: 'betAmount',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => <span> {Number(params.row.betAmount).toFixed(2)} </span>
                },
                {
                    title: '有效投注',
                    key: 'validBetAmount',
                    align: 'center',
                    minWidth: 80,
                    render: (h, params) => <span> {Number(params.row.validBetAmount).toFixed(2)} </span>
                },
                {
                    title: '会员输赢',
                    key: 'netAmount',
                    align: 'center',
                    minWidth: 70,
                    render: (h, params) => {
                        let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                        return <span style={{ color }}>{Number(params.row.netAmount).toFixed(2)}</span>;
                    }
                },
                {
                    title: '游戏名称',
                    key: 'gameName',
                    align: 'center',
                    minWidth: 75,
                    tooltip: true
                },
                {
                    title: '下注内容',
                    key: 'betInfo',
                    align: 'center',
                    tooltip: true,
                    minWidth: 130,
                    render: (h, params) => {
                        let { betInfo } = params.row;
                        return (
                            <p
                                class="ml10 mr10 cs"
                                style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;"
                                onClick={() => {
                                    this.showNumber = params.row.betInfo;
                                    if (this.showNumber.length > 12) {
                                        this.$refs.numberModal.show(this.showNumber);
                                    }
                                }}
                            >
                                {params.row.betInfo}
                            </p>
                        );
                    }
                },
                {
                    title: '下注时间',
                    key: 'betTime',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => <span> {this.$moment.unix(params.row.betTime).format('YYYY-MM-DD HH:mm:ss')} </span>
                }
            ],
            // 体育
            sportData: [
                {
                    title: '注单编号',
                    key: 'billNo',
                    align: 'center',
                    minWidth: 155,
                    tooltip: true,
                    render: (h, params) => <span class="font-color">{params.row.billNo}</span>
                },
                {
                    title: '会员账号',
                    key: 'userName',
                    align: 'center',
                    minWidth: 75,
                    tooltip: true,
                    render: (h, params) => <span class="font-color">{params.row.userName}</span>
                },
                {
                    title: '游戏账号',
                    key: 'playerName',
                    align: 'center',
                    minWidth: 110,
                    tooltip: true
                },
                {
                    title: '游戏平台',
                    key: 'platform',
                    align: 'center',
                    minWidth: 75,
                    tooltip: true
                },
                {
                    title: '投注金额',
                    key: 'betAmount',
                    align: 'center',
                    minWidth: 65,
                    render: (h, params) => <span>{this.$root.keepTwo(params.row.betAmount)}</span>
                },
                {
                    title: '有效投注',
                    key: 'validBetAmount',
                    align: 'center',
                    minWidth: 55,
                    render: (h, params) => <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
                },
                {
                    title: '会员输赢',
                    key: 'netAmount',
                    align: 'center',
                    minWidth: 75,
                    render: (h, params) => {
                        let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                        return <span style={{ color }}>{Number(params.row.netAmount).toFixed(2)}</span>;
                    }
                },
                {
                    title: '游戏名称',
                    key: 'gameName',
                    align: 'center',
                    minWidth: 60,
                    tooltip: true
                },
                {
                    title: '下注内容',
                    align: 'center',
                    tooltip: true,
                    minWidth: screen.width < 2000 ? 100 : 420,
                    render: (h, params) => {
                        let { betInfo } = params.row;
                        if (!betInfo) {
                            return <span>-</span>;
                        } else {
                            let { leaguename, awayteamname, bettypename, hometeamname } = betInfo[0];
                            if (screen.width < 2000) {
                                return (
                                    <div
                                        class="cs"
                                        onClick={() => {
                                            this.showBetInfo(betInfo, params.row.score);
                                        }}
                                    >{`${leaguename}${awayteamname}VS${hometeamname}${bettypename}`}</div>
                                );
                            } else {
                                return (
                                    <div
                                        class="cs"
                                        onClick={() => {
                                            this.showBetInfo(betInfo, params.row.score);
                                        }}
                                    >{`${leaguename}${awayteamname}VS${hometeamname}${bettypename}`}</div>
                                );
                            }
                        }
                    }
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    minWidth: 45,
                    render: (h, params) => {
                        const { status } = params.row;
                        let text = status == 0 ? '未开奖' : status == 1 ? '赢' : status == 2 ? '输' : status == 3 ? '和' : status == 4 ? '取消' : '撤销';
                        return <span>{text}</span>;
                    }
                },
                {
                    title: '下注时间',
                    key: 'betTime',
                    align: 'center',
                    minWidth: 130,
                    render: (h, params) => <span>{this.$root.unixTime(params.row.betTime)}</span>
                }
            ],
            lotteryData: [
                {
                    title: '注单编号',
                    key: 'billNo',
                    align: 'center',
                    tooltip: true,
                    minWidth: screen.width < 1600 ? 80 : 155,
                    className: 'pl5 pr5'
                },
                {
                    title: '会员账号',
                    key: 'userName',
                    align: 'center',
                    tooltip: true,
                    minWidth: 65
                },
                {
                    title: '游戏平台',
                    key: 'lotteryName',
                    align: 'center',
                    minWidth: 75,
                    tooltip: true
                },
                {
                    title: '期数',
                    key: 'issue',
                    align: 'center',
                    minWidth: 85
                },
                {
                    title: '投注金额',
                    key: 'betAmount',
                    align: 'center',
                    minWidth: 75,
                    render: (h, params) => <span> {Number(params.row.betAmount).toFixed(2)} </span>
                },
                {
                    title: '有效投注',
                    key: 'validBetAmount',
                    align: 'center',
                    minWidth: 60,
                    render: (h, params) => <span> {Number(params.row.validBetAmount).toFixed(2)} </span>
                },
                {
                    title: '会员输赢',
                    key: 'netAmount',
                    align: 'center',
                    minWidth: 85,
                    render: (h, params) => {
                        let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                        return <span style={{ color }}>{Number(params.row.netAmount).toFixed(2)}</span>;
                    }
                },
                {
                    title: '下注内容',
                    key: 'betInfo',
                    align: 'center',
                    tooltip: true,
                    width: screen.width < 1690 ? 115 : 180,
                    className: screen.width < 1690 ? 'pl5 pr5' : 'pr10 pl10',
                    render: (h, params) => {
                        let { playwayName, ball, betInfo } = params.row;
                        // if((playwayName || ball || betInfo) && (playwayName.length+ball.length+betInfo.length)>=7&&screen.width<1690){
                        return (
                            <Tooltip transfer style={{ whiteSpace: 'normal' }}>
                                <p style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">
                                    {this.$root.text(playwayName) + '/' + this.$root.text(ball) + '/' + betInfo}
                                </p>
                                <div slot="content">
                                    <span>{this.$root.text(playwayName)} / </span>
                                    <span>{this.$root.text(ball)} / </span>
                                    <span
                                        style={{
                                            display: betInfo && betInfo.length > 16 ? 'block' : ''
                                        }}
                                    >
                                        {betInfo}
                                    </span>
                                </div>
                            </Tooltip>
                        );
                        // } else if((playwayName || ball || betInfo) && (playwayName.length+ball.length+betInfo.length)>14&&screen.width>=1690){
                        //   return (
                        //     <Tooltip transfer style={{whiteSpace: 'normal'}}>
                        //       <p style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">
                        //         {this.$root.text(playwayName) +
                        //           "/" +
                        //           this.$root.text(ball) +
                        //           "/" +
                        //           betInfo}
                        //       </p>
                        //       <div slot="content">
                        //         <span>{this.$root.text(playwayName)} / </span>
                        //         <span>{this.$root.text(ball)} / </span>
                        //         <span style={{wordWrap: 'break-bord'}}>{betInfo}</span>
                        //       </div>
                        //     </Tooltip>
                        //   );
                        // }else{
                        // return (
                        //   <Tooltip transfer style={{whiteSpace: 'normal'}}>
                        //       <p style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">
                        //         {this.$root.text(playwayName) +
                        //           "/" +
                        //           this.$root.text(ball) +
                        //           "/" +
                        //           betInfo}
                        //       </p>
                        //       <div slot="content">
                        //         <span>{this.$root.text(playwayName)} / </span>
                        //         <span>{this.$root.text(ball)} / </span>
                        //         <span style={{wordWrap: 'break-bord'}}>{betInfo}</span>
                        //       </div>
                        //   </Tooltip>
                        //   );
                        // }
                    }
                },
                {
                    title: '赔率',
                    key: 'odds',
                    align: 'center',
                    width: 80
                },
                {
                    title: '开奖结果',
                    key: 'result',
                    align: 'center',
                    minWidth: screen.width < 1600 ? 90 : 190,
                    className: 'pl10 pr10',
                    tooltip: true,
                    render: (h, params) => <span> {params.row.result ? params.row.result : '-'} </span>
                },
                {
                    title: '返点金额',
                    key: 'fdAmount',
                    align: 'center',
                    minWidth: 60,
                    render: (h, params) => <span> {Number(params.row.fdAmount).toFixed(2)} </span>
                },
                {
                    title: '开奖状态',
                    key: 'status',
                    align: 'center',
                    minWidth: 55,
                    render: (h, params) => {
                        let { status } = params.row;
                        let text = status === 0 ? '未结算' : status === 1 ? '赢 ' : status === 2 ? '输' : status === 3 ? '和' : status === 4 ? '已取消' : '已撤销';
                        let color = status == 0 || status == 1 ? '#2D8CF0' : status == 2 ? 'red' : status == '3' ? 'rgb(35, 153, 97)' : '';
                        return <span style={{ color }}> {text} </span>;
                    }
                },
                {
                    title: '下注时间/结算时间',
                    key: 'betTime',
                    align: 'center',
                    minWidth: 120,
                    render: (h, params) => (
                        <div class="flex-colum">
                            <div class="bb mt2">{this.$root.unixTime(params.row.betTime)}</div>
                            <div>{this.$root.unixTime(params.row.openTime)}</div>
                        </div>
                    )
                },
                {
                    title: '操作',
                    align: 'center',
                    minWidth: 30,
                    render: (h, params) => {
                        let { status, id, uid, lotteryId, issue } = params.row;
                        let color = status == 0 || status == 1 || status == 2 ? '#2D8CF0' : '#918b8b';
                        let display = this.adminType == 'super' || this.authInPage.indexOf('lotteryRevocationUser') != -1 ? 'inline-block' : 'none';
                        return (
                            <a
                                style={{ color, display }}
                                onClick={() => {
                                    if (status == 0 || status == 1 || status == 2) {
                                        this.$Tip.confirm({
                                            content: '您确定撤销此笔注单吗？撤销后将返还投注金额!',
                                            onOk: () => {
                                                if (status == 0 || status == 1 || status == 2) {
                                                    let data = {
                                                        siteId: this.$root.nowSite.id,
                                                        lid: lotteryId,
                                                        uid,
                                                        issue,
                                                        id
                                                    };
                                                    lotteryRevocationUser(data, true).then(res => {
                                                        if (res != undefined && res.code == 200) {
                                                            this.$Message.success('撤单成功');
                                                            this.getData({
                                                                params: {
                                                                    ...this.searchKey,
                                                                    siteId: this.$root.nowSite.id
                                                                },
                                                                query: { page: this.page }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }
                                }}
                            >
                                撤单
                            </a>
                        );
                    }
                }
            ]
        };
    },
    created() {
        this.$nextTick(() => {
            this.$refs.GameSelect.init();
            if (this.$route.query.platform) this.$refs.GameSelect.onPlatformChange(this.$route.query.platform);
        });
        if (this.$route.query.startTime) {
            const { startTime, endTime, type, platform, gameType } = this.$route.query;
            this.searchKey = { ...this.searchKey, ...this.$route.query };
            this.Time = [startTime, endTime];
            this.platformessg.platform = platform;
            this.updateColumns(gameType);
            this.platformessg.game =
                gameType == 'getfish'
                    ? 'getfish:0'
                    : gameType == 'chess'
                    ? 'chess:1'
                    : gameType == 'live_casino'
                    ? 'live_casino:2'
                    : gameType == 'sport'
                    ? 'sport:3'
                    : gameType == 'slot'
                    ? 'slot:4'
                    : 'lottery:5';
        } else {
            this.platformessg.game = 'live_casino:2';
            this.platformessg.platform = '';
            this.updateColumns('live_casino');
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
            this.getData({ params: data });
        },
        //更新表头
        updateColumns(key) {
            this.table.columns = [];

            if (this.rentType == 'rent') {
                this.lotteryData.forEach(t => {
                    if (t.title == '操作') {
                        this.lotteryData.pop();
                    }
                });
            }

            this.table.columns =
                key == 'live_casino'
                    ? this.liveData
                    : key == 'slot'
                    ? this.slotData
                    : key == 'chess'
                    ? this.chessData
                    : key == 'lottery'
                    ? this.lotteryData
                    : key == 'sport'
                    ? this.sportData
                    : this.liveData;
            
        },
        //切换游戏类型
        onGameChange(res) {
         
            this.searchKey.type = res;
            this.columnsKey = res;
            delete this.searchKey.issue;
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
            if (data.params.platformName) delete data.params.platformName;
            if (data.params.gameType) delete data.params.gameType;
            if (!data.params.status || data.params.status == undefined) data.params.status = 'all';
            this.$root.startTableLoading();
            if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
            if (data.params.platform == 'all') delete data.params.platform;
            // 暂时把更新列数据的方法放这儿  正式站的偶发性bug
            this.updateColumns(this.columnsKey);
       
            getgameRecordsDetailData(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { list, total } = res.data.data;

                        this.statistics = total;
                        this.table.data = list;
                        this.table.total = res.data.total;
                        //特殊处理mt棋牌展示另外单号
                        if( this.searchKey.type=='chess'&&this.searchKey.platform=='MT_CHESS'){
                            this.table.data.forEach(t=>{
                                t.billNo=t.chairid
                        })   
                        }
                        if (data.params.type == 'live_casino' && data.params.platform == 'VR_LOTTERY') {
                            this.table.columns = this.table.columns.filter(item => item.title != '局号');
                        }
                        if (data.params.type == 'live_casino' && data.params.platform != 'VR_LOTTERY') {
                            this.table.columns = this.table.columns.filter(item => item.title != '期数');
                        }
                    }
                    this.$root.endTableLoading();
                    return false
                })
                .catch(error => this.$root.endTableLoading());
        },
        showBetInfo(data, score) {
            data.forEach(t => this.$set(t, 'score', score));
            this.$refs.betInfoModal.show();
            this.betInfoData = data;
        },
        clearData() {
            this.searchKey.type = 'live_casino';
        },
        batchExport(index) {
            let params = { ...this.searchKey, isExport: 1, export_page: index };
            if (10000 * index > this.table.total) params.export_limit = this.table.total - (10000 * (index - 1) + 1);
            else params.export_limit = '10000';
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                if (this.count == 0) params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                else params.endTime = endTime && this.$root.formatTimeS(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (params.gameCode) params.gameCode = this.$root.trimAll(params.gameCode);
            let reg = /^[0-9a-zA-Z,-]{5,}$/;
            if (params.gameCode && !reg.test(params.gameCode)) {
                this.$Tip.info({ content: '局号不正确，请重新输入' });
                return false;
            }
            if (params.billNo) params.billNo = this.$root.trimAll(params.billNo);
            // let reg2=/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{30,}$/
            // if (params.billNo && !reg2.test(params.billNo)) {
            //     this.$Tip.info({ content: '注单编号不正确，请重新输入' });
            //     return false;
            // }
            if (!params.startTime && !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }
            if (params.issue) {
                params.issue = this.$root.trimAll(params.issue);
                if (params.issue && !/([0-9]*)/.test(params.issue)) {
                    this.$Tip.info({ content: '期数不正确，请重新输入' });
                    return false;
                }
            }
            if (!params.userName) delete params.isLike;
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.$root.startEditLoading();
            let openr = window.open();
            getgameRecordsDetailData({ params })
                .then(res => {
                    if (res.code == 200) {
                        this.exportPage[index - 1].status = 'yes';
                        let region = res.data.downloadUrl;
                        let nowHost = region.split('.com')[1];
                        let openr1 = openr ? openr : window;
                        openr1.location.href = nowHost;
                    } else {
                        openr.close();
                    }
                    this.$root.endEditLoading();
                })
                .catch(error => this.$root.endEditLoading());
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey };
            data.siteId = this.$root.nowSite.id;
            if (data.billNo) data.billNo = this.$root.trimAll(data.billNo);
            // let reg2=/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{30,}$/
            // if (data.billNo && !reg2.test(data.billNo)) {
            //     this.$Tip.info({ content: '注单编号不正确，请重新输入' });
            //     return false;
            // }
            if (data.gameCode) data.gameCode = this.$root.trimAll(data.gameCode);
            let reg = /^[0-9a-zA-Z,-]{5,}$/;
            if (!data.startTime && !data.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }
            if (!data.userName) delete data.isLike;
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (data.issue) {
                data.issue = this.$root.trimAll(data.issue);
                if (data.issue && !/([0-9]*)/.test(data.issue)) {
                    this.$Tip.info({ content: '期数不正确，请重新输入' });
                    return false;
                }
            }
            if (data.userName) data.userName = this.$root.trimAll(data.userName);
            if (!this.$root.validateName(data.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params: data, query: { page } });
        },
        searchSubmit() {
            this.$nextTick(() => {
                this.$refs.table.setPage();
                this.page = 1;
            });
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                if (this.count == 0) params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                else params.endTime = endTime && this.$root.formatTimeS(endTime);
            } else {
                return false;
            }
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (params.gameCode) params.gameCode = this.$root.trimAll(params.gameCode);
            let reg = /^[0-9a-zA-Z,-]{5,}$/;
            if (params.gameCode && !reg.test(params.gameCode)) {
                this.$Tip.info({ content: '局号不正确，请重新输入' });
                return false;
            }
            if (params.billNo) params.billNo = this.$root.trimAll(params.billNo);
         
        //    let reg2=/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{30,}$/
        //     if (params.billNo && !reg2.test(params.billNo)) {
        //         this.$Tip.info({ content: '注单编号不正确，请重新输入' });
        //         return false;
        //     }
            if (!params.startTime && !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }
            if (params.issue) {
                params.issue = this.$root.trimAll(params.issue);
                if (params.issue && !/([0-9]*)/.test(params.issue)) {
                    this.$Tip.info({ content: '期数不正确，请重新输入' });
                    return false;
                }
            }
            if (!params.userName) delete params.isLike;
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            // if (!this.$root.checkSevenTime(this.Time)) {
            //     this.$Tip.info({ content: '最多只能查询7天！' });
            //     return false;
            // }  
            this.searchKey = { ...params };
            this.getData({ params });
        },
        exportExcel() {
            this.exportPage = [];
            let params = { ...this.searchKey, isExport: 1 };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                if (this.count == 0) params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                else params.endTime = endTime && this.$root.formatTimeS(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (params.gameCode) params.gameCode = this.$root.trimAll(params.gameCode);
            let reg = /^[0-9a-zA-Z,-]{5,}$/;
            if (params.gameCode && !reg.test(params.gameCode)) {
                this.$Tip.info({ content: '局号不正确，请重新输入' });
                return false;
            }
            if (params.billNo) params.billNo = this.$root.trimAll(params.billNo);
            // let reg2=/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[~!@#$%^&*])[\da-zA-Z~!@#$%^&*]{30,}$/
            // if (params.billNo && !reg2.test(params.billNo)) {
            //     this.$Tip.info({ content: '注单编号不正确，请重新输入' });
            //     return false;
            // }
            if (params.issue) {
                params.issue = this.$root.trimAll(params.issue);
                if (params.issue && !/([0-9]*)/.test(params.issue)) {
                    this.$Tip.info({ content: '期数不正确，请重新输入' });
                    return false;
                }
            }
            if (!params.startTime && !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }
            if (!params.userName) delete params.isLike;
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }

            if (this.table.total > 150000) {
                let num = this.table.total % 10000 == 0 ? this.table.total / 10 : Math.floor(this.table.total / 10000) + 1;
                for (let i = 0; i < num; i++) {
                    this.exportPage.push({ index: i, status: 'no' });
                }
                this.$refs.exportPageModal.show();
            } else {
                this.$root.startEditLoading();
                let openr = window.open();
                getgameRecordsDetailData({ params },true)
                    .then(res => {
                        if (res != undefined && res.code == 200) {
                            let region = res.data.downloadUrl;
                            let nowHost = region.split('.com')[1];
                            let openr1 = openr ? openr : window;
                            openr1.location.href = nowHost;
                        } else {
                            openr.close();
                        }
                        this.$root.endEditLoading();
                    })
                    .catch(error => this.$root.endEditLoading());
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
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
    margin-right: 20px;
}
/deep/.cs {
    width: 100px;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
/deep/.ivu-tooltip {
    width: 100%;
}
.font-color {
    color: #333333;
}

/deep/.ivu-table {
    letter-spacing: 0 !important;
}
/deep/.ivu-date-picker {
    margin-right: 0;
}

@media screen and (min-width: 960px) and (max-width: 1460px) {
    .ib {
        margin-right: 0;
    }
    /deep/.v2-search {
        .ivu-form-item {
            margin-right: 16px !important;
            .ivu-form-item-label {
                margin-right: 4px !important;
            }
        }
    }
}
.ab {
    max-height: 500px;
    overflow-y: auto;
}
</style>


