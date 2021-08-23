<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="开始日期">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem>
                    <Select v-model="searchKey.typeTag" placeholder="全部" class="s-120">
                        <Option value="userName">会员账号</Option>
                        <Option value="agencyName">上级代理</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input placeholder="请输入查询账号" @keyup.enter.native="searchSubmit" class="s-140" v-model="searchKey.content" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel">导出Excel</Button>
                </FormItem>
            </Form>
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
                @on-sort-change="sortChange"
            >
            </Tables>
        </div>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Icons from '@/components/icons';
import tableMixins from '@/mixins/table';
import { getMemberReportData, getMemberReportsNext,bannedGameReportsMemberBonus } from '@/api/report';
export default {
    name: 'memberReport',
    mixins: [tableMixins],
    components: { Tables, Icons },
    data() {
        return {
            page: 1,
            searchKey: {
                startTime: this.$root.startTime(),
                endTime: this.$root.formatnightTimeS(),
                typeTag: 'userName'
            },
            Time: [this.$root.startTime(), this.$root.formatnightTimeS()],
            table: {
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '上级代理',
                        key: 'agencyName',
                        align: 'center',
                        minWidth: 90,
                        tooltip: true,
                        render: (h, params) => <span> {params.row.agencyName === '' ? '-' : params.row.agencyName} </span>
                    },
                    {
                        title: '投注金额',
                        key: 'betAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.betAmount)}</span>
                    },
                    {
                        title: '有效投注',
                        key: 'validBetAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100,
                        tooltip: true,
                        render: (h, params) => {
                            if (params.row.validBetAmount == 0) {
                                return <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>;
                            } else {
                                return (
                                    <div>
                                        <Poptip trigger="hover" placement="right-start" width="208" popper-class="top-wrap" transfer>
                                            <span
                                                class={{ cs: params.row.userName != '总计' }}
                                                onMouseenter={e => {
                                                    if (params.row.userName == '总计') {
                                                        return false;
                                                    } else {
                                                        this.memberReportsNext(params, 1);
                                                    }
                                                }}
                                            >
                                                {this.$root.keepTwo(params.row.validBetAmount)}
                                            </span>
                                            <div class="tip-box" slot="content" style={{ display: params.row.userName == '总计' || this.list.length == 0 ? 'none' : 'block' }}>
                                                <div class="title">
                                                    <span>游戏平台</span>
                                                    <span>有效投注</span>
                                                </div>
                                                <div>
                                                    <ul>
                                                        {this.list.map(item => (
                                                            <li>
                                                                <span>{item.title}</span>
                                                                <span style={{ color: item.validBetAmount > 0 ? '#ff2626' : '#239961' }}>{item.validBetAmount}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <div class="footer" style={{ display: this.data1.totalvalidBetAmount == 0 || this.list.length == 0 ? 'none' : 'block' }}>
                                                        <span>总计</span>
                                                        <span>{this.data1.totalvalidBetAmount}</span>
                                                    </div>
                                                    <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
                                                </div>
                                            </div>
                                        </Poptip>
                                    </div>
                                );
                            }
                        }
                    },
                    {
                        title: '会员输赢',
                        key: 'netAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => {
                            if (params.row.netAmount == 0) {
                                return <span>{this.$root.keepTwo(params.row.netAmount)}</span>;
                            } else {
                                return (
                                    <div>
                                        <Poptip trigger="hover" placement="right-start" width="208" popper-class="top-wrap" transfer>
                                            <span
                                                class={{ cs: params.row.userName != '总计' }}
                                                onMouseenter={e => {
                                                    if (params.row.userName == '总计') {
                                                        return false;
                                                    } else {
                                                        this.memberReportsNext(params, 1);
                                                    }
                                                }}
                                            >
                                                {this.$root.keepTwo(params.row.netAmount)}
                                            </span>
                                            <div class="tip-box" slot="content" style={{ display: params.row.userName == '总计' ? 'none' : 'block' }}>
                                                <div class="title">
                                                    <span>游戏平台</span>
                                                    <span>输赢金额</span>
                                                </div>
                                                <ul>
                                                    {this.list.map(item => (
                                                        <li>
                                                            <span>{item.title}</span>
                                                            <span style={{ color: item.netAmount > 0 ? '#ff2626' : '#239961' }}>{item.netAmount}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div class="footer" style={{ display: this.data1.totalnetAmount == 0 || this.list.length == 0 ? 'none' : 'block' }}>
                                                    <span>总计</span>
                                                    <span>{this.data1.totalnetAmount}</span>
                                                </div>
                                                <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
                                            </div>
                                        </Poptip>
                                    </div>
                                );
                            }
                        }
                    },
                    {
                        title: '优惠金额',
                        key: 'memberBonus',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => {
                            if (params.row.memberBonus == 0) {
                                return <span>{this.$root.keepTwo(params.row.memberBonus)}</span>;
                            } else {
                                return (
                                    <div>
                                        <Poptip trigger="hover" placement="right-start" width="208" popper-class="top-wrap" transfer>
                                            <span
                                                class={{ cs: params.row.userName != '总计' }}
                                                onMouseenter={e => {
                                                    if (params.row.userName == '总计') {
                                                        return false;
                                                    } else {
                                                        this.bannedGameReportsMemberBonus(params);
                                                    }
                                                }}
                                            >
                                                {this.$root.keepTwo(params.row.memberBonus)}
                                            </span>
                                            <div class="tip-box" slot="content" style={{ display: params.row.userName == '总计' || this.list.length == 0 ? 'none' : 'block' }}>
                                                <div class="title">
                                                    <span>优惠类型</span>
                                                    <span>优惠金额</span>
                                                </div>
                                                <ul>
                                                    {this.list.map(item => (
                                                        <li>
                                                            <span>{item.name}</span>
                                                            <span style={{ color: Number(item.money)> 0 ? '#ff2626' : '#239961' }}>{item.money}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div class="footer" style={{ display: this.yhTotal.money == 0 || this.list.length == 0 ? 'none' : 'block' }}>
                                                    <span>总计</span>
                                                    <span>{this.yhTotal.money}</span>
                                                </div>
                                                <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
                                            </div>
                                        </Poptip>
                                    </div>
                                );
                            }
                        }
                    },
                    {
                        title: '网站盈利',
                        minWidth: 100,
                        key: 'profit',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            let color = params.row.profit > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.profit)}</span>;
                        }
                    },
                    {
                        title: '盈率',
                        key: 'profitRate',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => {
                            let color = params.row.profitRate > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{params.row.profitRate}%</span>;
                        }
                    },
                    {
                        title: '总存款',
                        key: 'depositAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 120,
                        render: (h, params) => {
                            if (params.row.depositAmount == 0) {
                                return <span>{this.$root.keepTwo(params.row.depositAmount)}</span>;
                            } else {
                                return (
                                    <div>
                                        <Poptip trigger="hover" placement="right-start" width="208" popper-class="top-wrap" transfer>
                                            <span
                                                class={{ cs: params.row.userName != '总计' }}
                                                onMouseenter={e => {
                                                    if (params.row.userName == '总计') {
                                                        return false;
                                                    } else {
                                                        this.memberReportsNext(params, 3);
                                                    }
                                                }}
                                            >
                                                {this.$root.keepTwo(params.row.depositAmount)}
                                            </span>
                                            <div class="tip-box" slot="content" style={{ display: params.row.userName == '总计' || this.list.length == 0 ? 'none' : 'block' }}>
                                                <div class="title">
                                                    <span>存款类型</span>
                                                    <span>存款金额</span>
                                                </div>
                                                <ul>
                                                    {this.list.map(item => (
                                                        <li>
                                                            <span>{item.title}</span>
                                                            <span style={{ color: item.val > 0 ? '#ff2626' : '#239961' }}>{item.val}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div class="footer" style={{ display: this.data1.total == 0 || this.list.length == 0 ? 'none' : 'block' }}>
                                                    <span>总计</span>
                                                    <span>{this.data1.total}</span>
                                                </div>
                                                <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
                                            </div>
                                        </Poptip>
                                    </div>
                                );
                            }
                        }
                    },
                    {
                        title: '总取款',
                        key: 'withdrawalsAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100,
                        render: (h, params) => <span> {this.$root.keepTwo(params.row.withdrawalsAmount)} </span>
                    },
                    {
                        title: '现金利润',
                        key: 'cashProfit',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => <span> {this.$root.keepTwo(params.row.cashProfit)} </span>
                    },
                    {
                        title: '利润占比',
                        key: 'cashRate',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let color = params.row.cashRate > 0 ? '#FF2626' : 'rgb(35, 153, 97)';

                           return  <span style={{ color }}> {params.row.cashRate} %</span>
                        }
                    },
                    {
                        title: '打码倍数',
                        key: 'betMultiple',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => <span> {params.row.betMultiple} </span>
                    }
                ],
                data: []
            },
            data1: [],
            list: [],
            yhTotal:[],
            isSpin: true,
            transfer: true
        };
    },
    watch: {
        'searchKey.typeTag'(val, oldVal) {
            if (!val) this.searchKey.content = '';
        }
    },

    methods: {
        getData(data) {
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            this.$root.startTableLoading();
            if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
            getMemberReportData(data)
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
        onPageChange(page) {
            this.page = page;
            let params = { ...this.searchKey };
            params.siteId = this.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.content) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.content && !this.$root.validateName(params.content)) {
                this.$Tip.info({ content: `您所查询的${params.typeTag == 'userName' ? '会员' : '代理'}账号不正确，请重新输入` });
                return false;
            }
            this.getData({ params, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let params = { ...this.searchKey };
            params.siteId = this.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.content) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.content && !this.$root.validateName(params.content)) {
                this.$Tip.info({ content: `您所查询的${params.typeTag == 'userName' ? '会员' : '代理'}账号不正确，请重新输入` });
                return false;
            }
            this.getData({ params });
        },
        createTotalData(total) {
            const {
                betAmount,
                validBetAmount,
                netAmount,
                agencyRebateAmount,
                memberBonus,
                profit,
                profitRate,
                depositCount,
                depositAmount,
                cashProfit,
                withdrawalsCount,
                withdrawalsAmount,
                betMultiple,
                cashRate
            } = total;
            let item = {
                userName: '总计',
                agencyName: '-',
                betAmount,
                validBetAmount,
                netAmount,
                agencyRebateAmount,
                memberBonus,
                profit,
                profitRate,
                depositAmount,
                depositCount,
                cashProfit,
                withdrawalsCount,
                withdrawalsAmount,
                betMultiple,
                cashRate
            };
            return item;
        },
        searchSubmit() {
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            this.$refs.table.setPage();
            let params = { ...this.searchKey };
            params.siteId = this.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.content) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.content && !this.$root.validateName(params.content)) {
                this.$Tip.info({ content: `您所查询的${params.typeTag == 'userName' ? '会员' : '代理'}账号不正确，请重新输入` });
                return false;
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            this.getData({ params });
        },
        sortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = {
                sortKey: key,
                siteId: this.$root.nowSite.id,
                sortVal: order,
                ...this.searchKey
            };
            this.searchKey.sortKey = key;
            if (data.sortVal == 'normal') {
                this.table.columns.forEach(item => {
                    if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                });
                this.searchKey.sortVal = 'asc';
                data.sortVal = 'asc';
            } else {
                this.table.columns.forEach(item => delete item.sortType);
                this.searchKey.sortVal = order;
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
        },
        exportExcel() {
            let params = { ...this.searchKey };
            params.siteId = this.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.content) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.content && !this.$root.validateName(params.content)) {
                this.$Tip.info({ content: `您所查询的${params.typeTag == 'userName' ? '会员' : '代理'}账号不正确，请重新输入` });
                return false;
            }

            params.isExport = 1;
            this.$root.startEditLoading(this);
            let openr = window.open();
            getMemberReportData({ params },true).then(res => {
                if (res.code == 200) {
                    let region = res.data.downloadUrl;
                    let nowHost = region.split('.com')[1];
                    let openr1 = openr ? openr : window;
                    openr1.location.href = nowHost;
                } else {
                    openr.close();
                }
            });
        },
        //会员报表-查看单会员 有效投注-输赢。优惠  总存款列表
        memberReportsNext(params, type) {
            this.isSpin = true;
            var siteId = this.$root.nowSite.id;
            var uid = params.row.uid;
            var startTime = this.searchKey.startTime;
            var endTime = this.searchKey.endTime;
            let data = { siteId: siteId, startTime: startTime, endTime: endTime, uid: uid, type: type };
            this.$nextTick(function() {
                getMemberReportsNext(data)
                    .then(res => {
                        if (res != undefined && res.code == 200) {
                            this.isSpin = false;
                            this.data1 = res.data;
                            this.list = res.data.list.filter(item => item.val != 0);
                            this.data1 = res.data;
                            if (res.data.list != undefined) this.list = res.data.list.filter(item => item.val != 0);
                        }
                    })
                    .catch(error => {
                        this.data1 = [];
                        this.list = [];
                    });
            });
        },
        //总存款
           bannedGameReportsMemberBonus(params){
      let siteId = this.$root.nowSite.id;
      let uid = params.row.uid;
     let startTime = this.searchKey.startTime;
      let endTime = this.searchKey.endTime;
      let depositAmount = params.row.depositAmount*1;
      let data = {
        siteId:siteId,
        startTime: startTime,
        endTime: endTime,
        depositAmount:depositAmount,
        uid: uid
      }
      this.isSpin = true;
      bannedGameReportsMemberBonus(data).then(res=>{
        if(res!=undefined&&res.code==200){
          this.isSpin = false;
          this.yhTotal = res.data.total;
          this.list = res.data.list;
          if (res.data.list != undefined)
                this.list = res.data.list.filter(item => item.money != 0);
        }
      })
      .catch(error => {
            this.yhTotal = {};
            this.list = [];
          });
    },

    
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.mw104 {
    min-width: 104px;
}
.ivu-table {
    color: #444;
}
</style>


