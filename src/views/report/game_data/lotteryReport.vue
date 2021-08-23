<template>
    <div>
        <div class="v2-search">
            <Form inline ref="searchKey">
                <FormItem label="彩票分类" v-show="tabName == '按游戏'">
                    <LotterySelect ref="LotterySelect" @clearSelect="clearSelect" class="s-100" @on-lottery-change="onLotteryChange"></LotterySelect>
                </FormItem>
                <FormItem label="时区">
                    <Select v-model="searchKey.timeType" class="s-120">
                        <Option value="cn">北京时间</Option>
                        <Option value="en">美东时间</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem>
                    <Select v-model="searchKey.selectType" class="s-120">
                        <Option value="0">会员账号</Option>
                        <Option value="1">上级代理</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input v-model="searchKey.userName" placeholder="多个请以,逗号隔开" class="s-140" @keyup.enter.native="searchSubmit" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel">导出Excel</Button>
                </FormItem>
            </Form>
        </div>
        <div>
            <Poptip trigger="hover" placement="bottom-end" class="fr mtf5" v-show="tabName == '按会员'">
                <div slot="content">
                    <p>彩票投注占比=彩票历史投注总额/历史投注总额</p>
                    <p>打码倍数=彩票投注历史总额/历史总存款</p>
                </div>
                <Icons type="bangzhutishi" color="#E4E4E4" :size="26" />
            </Poptip>
            <Tabs type="card" @on-click="tabClick">
                <TabPane label="按游戏" name="按游戏"></TabPane>
                <TabPane label="按会员" name="按会员"></TabPane>
            </Tabs>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :columns="tabName == '按游戏' ? table.columns : table._columns"
                :value="table.data"
                :total="table.total"
                :page="tabName == '按游戏' ? false : true"
                @on-sort-change="sortChange"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Icons from '@/components/icons';
import Tables from '@/components/tables';
import LotterySelect from '@/components/lottery-select';
import tableMixins from '@/mixins/table';
import { getlotteryReportData, getplatformReportsDetailData } from '@/api/report';
export default {
    name: 'lotteryReport',
    components: {
        Tables,
        LotterySelect,
        Icons
    },
    data() {
        return {
            screen: screen.width,
            page: 1,
            downUrl: '',
            tabName: '按游戏',
            searchKey: {
                timeType: 'cn',
                startTime: this.$root.startTime(),
                endTime: this.$root.formatnightTimeS(),
                siteId: this.$root.nowSite.id,
                selectType: '0'
            },
            Time: [this.$root.newstartTime(), this.$root.formatnightTimeS()],
            table: {
                total: 10,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                //按会员
                _columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        render: (h, params) => (
                            <span
                                class={{ 'blue-font': params.row.userName != '总计' }}
                                onClick={() => {
                                    this.gotoDetail(params);
                                }}
                            >
                                {params.row.userName}
                            </span>
                        )
                    },
                    {
                        title: '注单数量',
                        key: 'betCount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '投注金额',
                        key: 'betAmount',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.betAmount)}</span>
                    },
                    {
                        title: '有效投注',
                        key: 'validBetAmount',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
                    },
                    {
                        title: '平台输赢',
                        key: 'netAmount',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.netAmount)}</span>;
                        }
                    },
                    {
                        title: '盈率',
                        key: 'winRate',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            console.log(params.row.winRate)
                            let color = params.row.winRate > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return (
                                // <span style={{ color }}>
                                //     {params.row.winRate && String(params.row.winRate).includes('%')
                                //         ? this.$root.keepTwo(params.row.winRate)
                                //         : `${this.$root.keepTwo(params.row.winRate)}%`}
                                // </span>
                                <span style={{color}}>{params.row.winRate}%</span>
                            );
                        }
                    },
                    {
                        title: '彩票投注占比',
                        key: 'betPercent',
                        align: 'center',
                        // sortable: "custom",
                        render: (h, params) => <span class="red-font">{params.row.betPercent ? `${this.$root.keepTwo(params.row.betPercent)}%` : '-'}</span>
                    },
                    {
                        title: '打码倍数',
                        key: 'dmPercent',
                        align: 'center',
                        // sortable: "custom",
                        render: (h, params) => <span class="red-font">{params.row.dmPercent ? `${this.$root.keepTwo(params.row.dmPercent)}` : '-'}</span>
                    }
                ],
                //按游戏
                columns: [
                    {
                        title: '彩票名称',
                        key: 'gameName',
                        align: 'center',
                        minWidth: 85,
                        render: (h, params) => {
                            let { gameName, platform } = params.row;
                            params.row.gameName = gameName == '3分赛车' ? '快乐赛车' : gameName == '5分赛车' ? '幸运赛车' : gameName;
                            return (
                                <span
                                    class={{ 'blue-font': gameName !== '总计' }}
                                    onClick={() => {
                                        this.goDetailPage(params);
                                    }}
                                >
                                    {params.row.gameName}
                                </span>
                            );
                        }
                    },
                    {
                        title: '投注人数',
                        key: 'betUser',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '注单数量',
                        key: 'betCount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '投注金额',
                        key: 'validBetAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
                    },
                    {
                        title: '有效投注',
                        key: 'betAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.betAmount)}</span>
                    },
                    {
                        title: '撤单金额',
                        key: 'cancelBetAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.cancelBetAmount)}</span>
                    },
                    {
                        title: '返点金额',
                        key: 'rebatePointsAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.rebatePointsAmount)}</span>
                    },
                    {
                        title: '平台输赢',
                        key: 'netAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100,
                        render: (h, params) => {
                            let color = params.row.netAmount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.netAmount)}</span>;
                        }
                    },
                    {
                        title: '盈率',
                        key: 'winRate',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => {
                            let color = params.row.winRate > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return (
                                // <span style={{ color }}>
                                //     {params.row.winRate && String(params.row.winRate).includes('%')
                                //         ? this.$root.keepTwo(params.row.winRate)
                                //         : `${this.$root.keepTwo(params.row.winRate)}%`}
                                // </span>
                                <span>{params.row.winRate}%</span>
                            );
                        }
                    }
                ]
            }
        };
    },
    created() {
        this.$nextTick(() => {
            this.$refs.LotterySelect.init();
            this.getData(this.searchKey);
        });
    },
    methods: {
        tabClick(name) {
            this.tabName = name;
            this.searchSubmit();
        },
        gotoDetail(params) {
            const { userName, platform } = params.row;
            let [startTime, endTime] = this.Time;
            if (this.searchKey.timeType == 'cn') {
                startTime = this.$root.formatTimeS(startTime);
                endTime = this.$root.formatnightTimeS(endTime);
            } else {
                startTime = this.$moment(startTime).format('YYYY-MM-DD 12:00:00');
                endTime = this.$moment(endTime)
                    .add(1, 'days')
                    .format('YYYY-MM-DD 11:59:59');
            }
            this.$router.push({
                name: 'gameReport',
                query: {
                    type: 'lottery',
                    userName,
                    startTime,
                    endTime,
                    platform,
                    gameType: 'lottery'
                }
            });
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey, platform: 'CT_LOTTERY' };
            this.getOtherData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey, platform: 'CT_LOTTERY' };
            this.getOtherData({ params: data });
        },
        sortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            this.tabName == '按游戏' && this.searchKey.limit ? delete this.searchKey.limit : '';
            let data = {
                sortKey: key,
                sortVal: order,
                siteId: this.$root.nowSite.id,
                ...this.searchKey
            };
            this.searchKey.sortKey = key;
            if (data.sortVal == 'normal') {
                if (this.tabName == '按游戏') {
                    this.table.columns.forEach(item => {
                        if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                    });
                } else {
                    this.table._columns.forEach(t => {
                        if (t.key == column.key) this.$set(t, 'sortType', 'asc');
                    });
                }
                this.searchKey.sortVal = 'asc';
                data.sortVal = 'asc';
            } else {
                this.searchKey.sortVal = order;
                this.table.columns.forEach(item => delete item.sortType);
            }
            this.tabName == '按会员' ? (data.platform = 'CT_LOTTERY') : '';
            if (this.tabName == '按会员') {
                this.page == 1 ? this.getOtherData({ params: data }) : this.getOtherData({ params: data, query: { page: this.page } });
            } else this.getData(data);
            // this.getData(data)
        },
        clearSelect() {
            delete this.searchKey.type;
        },
        goDetailPage(params) {
            const { platform } = params.row;
            const { timeType } = this.searchKey;
            let [startTime, endTime] = this.Time;
            startTime = this.$root.formatTimeS(startTime);
            endTime = this.$root.formatnightTimeS(endTime);
            this.$router.push({
                name: 'lotteryReportDetail',
                query: {
                    platform,
                    startTime,
                    endTime,
                    timeType,
                    userName: this.searchKey.userName
                }
            });
        },
        checkAll(res) {
            return res === 'ALL' ? Reflect.deleteProperty(this.searchKey, 'type') : false;
        },
        onLotteryChange(res) {
            if (this.checkAll(res.code)) return;
            this.searchKey.type = res.code;
        },
        //按游戏
        getData(data) {
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.$root.startTableLoading();
            if (data.isLike) data.isLike = Number(data.isLike);
            getlotteryReportData(data).then(res => {
                if (res != undefined && res.code == 200) {
                    let { list, total } = res.data;
                    list.length && list.push(this.createTotalData(total));
                    this.table.data = list;
                }
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        //按会员
        getOtherData(data) {
            if (data.params.type) delete data.params.type;
            if (data.params.userName) data.params.userName = this.$root.trimAll(data.params.userName);
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            this.$root.startTableLoading();
            getplatformReportsDetailData(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let { list, total } = res.data.data;
                        list.length && list.push(this.createTotalData(total));
                        this.table.data = list;
                        this.table.total = res.data.total;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        createTotalData(total) {
            const { userName, betUser, betCount, betAmount, validBetAmount, winAmount, cancelBetAmount, rebatePointsAmount, netAmount, winRate, betPercent, dmPercent } = total;
            let item = {
                userName: '总计',
                gameName: '总计',
                betUser,
                betCount,
                betAmount,
                validBetAmount,
                winAmount,
                cancelBetAmount,
                rebatePointsAmount,
                netAmount,
                winRate,
                betPercent,
                dmPercent
            };
            return item;
        },
        searchSubmit() {
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortVal;
            this.tabName == '按游戏' && this.searchKey.limit ? delete this.searchKey.limit : '';
            if (this.tabName == '按游戏') {
                this.table.columns.forEach(item => {
                    if (item.sortable == 'custom') this.$set(item, 'sortType', '');
                });
            } else {
                this.table._columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
            }
            this.$refs.table.setPage();
            let params = { ...this.searchKey };
            const { timeType } = params;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.Time;
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else return false;
            let { startTime, endTime } = params;
            this.searchKey.startTime = startTime;
            this.searchKey.endTime = endTime;
            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间' });
                return false;
            }
            if (!params.userName) delete params.isLike;
            if (params.userName) {
                params.userName = this.$root.trimAll(params.userName);
            } else {
                delete params.userName;
            }

            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.tabName == '按会员' ? (params.platform = 'CT_LOTTERY') : '';
            this.tabName == '按会员' ? this.getOtherData({ params }) : this.getData(params);
            // this.getData(params);
        },
        exportExcel() {
            this.tabName == '按游戏' && this.searchKey.limit ? delete this.searchKey.limit : '';
            let params = { ...this.searchKey };
            this.tabName == '按会员' ? (params.platform = 'CT_LOTTERY') : '';
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            let { startTime, endTime } = params;
            this.searchKey.startTime = startTime;
            this.searchKey.endTime = endTime;
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (params.userName && !this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间' });
                return false;
            }
            if (!params.userName) delete params.isLike;

            params.isExport = 1;
            this.$root.startEditLoading(this);
            let openr = window.open();
            if (this.tabName == '按游戏') {
                getlotteryReportData(params,true).then(res => {
                    if (res != undefined && res.data.downloadUrl) {
                        if (res.code == 200) {
                            let region = res.data.downloadUrl;
                            let nowHost = region.split('.com')[1];
                            let openr1 = openr ? openr : window;
                            openr1.location.href = nowHost;
                        } else {
                            openr.close();
                        }
                    }
                });
            } else {
                getplatformReportsDetailData({ params },true).then(res => {
                    if (res != undefined && res.code == 200) {
                        let region = res.data.downloadUrl;
                        let nowHost = region.split('.com')[1];
                        let openr1 = openr || window;
                        openr1.location.href = nowHost;
                    } else openr.close();
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.td,
.td2,
.td3 {
    display: inline-block;
    width: 10%;
    text-align: center;
    border-right: 1px solid #dcdcdc;
    font-size: 0.875rem;
}
/deep/.ivu-table {
    color: #444;
}
/deep/.ivu-tabs-tab {
    font-size: 1rem !important;
}
/deep/.ivu-tabs-nav-container {
    margin-bottom: 0 !important;
}
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
    height: 31px;
    overflow: inherit;
}
</style>


