<template>
    <Modals ref="showDetail" title="发放详情" :width="screen < 1690 ? 1350 : 1500">
        <div slot="content">
            <div class="v2-search">
                <Form inline>
                    <FormItem label="状态" class="ml20">
                        <Button v-for="t in btnList" :key="'btn' + t.value" @click.prevent="changeBtn(t.value)" :class="currentBtn == t.value ? 'bd-bg mr10' : 'bg-or mr10'">{{
                            t.name
                        }}</Button>
                    </FormItem>
                    <FormItem label="会员账号">
                        <Input class="w140x" v-model="searchKey.userName" placeholder="多个请以,逗号隔开" />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" :loading="table.loading" @click.prevent="searchSubmit">查询</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="v2-table ml20 mr20 mb20">
                <Tables
                    ref="table"
                    :value="table.data"
                    :columns="table.columns"
                    :loading="table.loading"
                    :total="table.total"
                    :showSizer="false"
                    :pageFixShow="true"
                    :pageSizeOpts="table.pageSizeOpts"
                    @on-page-change="onPageChange"
                    @on-sort-change="onSortChange"
                ></Tables>
            </div>
            <Modals ref="betDetail" width="400" title="投注详情">
                <div slot="content" class="modal">
                    <div class="mb20">
                        <span :class="checkBetting.sort == 'smallToBig' ? 'act ft14 pl30 cs' : 'des ft14 pl30 cs'" @click="changeSort('smallToBig')">正序</span>
                        <span :class="checkBetting.sort == 'bigToSmall' ? 'act ft14 pl30 cs' : 'des ft14 pl30 cs'" @click="changeSort('bigToSmall')">倒序</span>
                    </div>
                    <ul v-if="bettingData.length" class="mb20">
                        <li v-for="(t, i) in bettingData" :key="'betting' + i" class="txt-a">
                            <span class="pr20 ft16">{{ t.gameZhName }}</span>
                            <span class="pr20 ft16">{{ checkBetting.show_type == 'netAmount' ? t.netAmount : t.validBetAmount }}</span>
                        </li>
                    </ul>
                    <div v-else class="ft16 txt-a mt20 mb20">
                        暂无数据
                    </div>
                </div>
            </Modals>
        </div>
    </Modals>
</template>
<script>
import Modals from '_c/modals';
import Tables from '_c/tables';
import { getUserType } from '@/libs/util';
import { activityHongyundangtouDataInfo, activityHongyundangtouBetData } from '@/api/activity';
export default {
    components: {
        Modals,
        Tables
    },
    props: {
        detailData: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            bettingData: [],
            checkBetting: {},
            page: 1,
            screen: screen.width,
            btnList: [
                { name: '全部', value: 'all' },
                { name: '待发放', value: 'pending' },
                { name: '已领取', value: 'receive' },
                { name: '已失效', value: 'fail' },
                { name: '已取消', value: 'cancel' }
            ],
            currentBtn: 'all',
            searchKey: {
                siteId: this.$root.nowSite.id,
                userName: '',
                status: 'all',
                count_date: '',
                limit: 10
            },
            table: {
                total: 0,
                data: [],
                pageSizeOpts: [10],
                loading: true,
                columns: [
                    {
                        title: '会员',
                        key: 'userName',
                        align: 'center'
                    },
                    {
                        title: '有效投注',
                        key: 'bet_money',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => (
                            <a
                                style={{
                                    color: this.adminType == 'super' || this.authInPage.indexOf('activityHongyundangtouBetData') != -1 ? '#2D8CF0' : ''
                                }}
                                onClick={() => {
                                    this.$refs.betDetail.show();
                                    this.$refs.betDetail.spinShow();
                                    let { config_id, count_date, uid } = params.row;
                                    this.checkBetting = {
                                        siteId: this.$root.nowSite.id,
                                        config_id,
                                        count_date,
                                        uid,
                                        sort: 'bigToSmall',
                                        show_type: 'validBetAmount'
                                    };
                                    activityHongyundangtouBetData(this.checkBetting)
                                        .then(res => {
                                            if (res != undefined && res.code == 200) {
                                                this.bettingData = res.data;
                                            }
                                            this.$refs.betDetail.spinHide();
                                        })
                                        .catch(error => {
                                            this.$refs.betDetail.spinHide();
                                        });
                                }}
                            >
                                {params.row.bet_money}
                            </a>
                        )
                    },
                    {
                        title: '会员输赢',
                        key: 'negative_profit_money',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => (
                            <a
                                style={{
                                    color: this.adminType == 'super' || this.authInPage.indexOf('activityHongyundangtouBetData') != -1 ? '#2D8CF0' : ''
                                }}
                                onClick={() => {
                                    this.$refs.betDetail.show();
                                    this.$refs.betDetail.spinShow();
                                    let { config_id, count_date, uid } = params.row;
                                    this.checkBetting = {
                                        siteId: this.$root.nowSite.id,
                                        config_id,
                                        count_date,
                                        uid,
                                        sort: 'bigToSmall',
                                        show_type: 'netAmount'
                                    };
                                    activityHongyundangtouBetData(this.checkBetting)
                                        .then(res => {
                                            if (res != undefined && res.code == 200) {
                                                this.bettingData = res.data;
                                            }
                                            this.$refs.betDetail.spinHide();
                                        })
                                        .catch(error => {
                                            this.$refs.betDetail.spinHide();
                                        });
                                }}
                            >
                                {params.row.negative_profit_money}
                            </a>
                        )
                    },
                    {
                        title: '会员存款',
                        key: 'pay_money',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '投注红包',
                        key: 'betting_gift',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '负盈利红包',
                        key: 'negative_profit_gift',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '统计时段',
                        key: 'count_date',
                        align: 'center'
                    },
                    {
                        title: '领取时间',
                        key: 'gift_time',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{this.$root.unixTime(params.row.gift_time)}</span>
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            const { status } = params.row;
                            let text = status == 'cancel' ? '已取消' : status == 'receive' ? '已领取' : status == 'pending' ? '待发放' : '已失效';
                            let color = status == 'cancel' ? '' : status == 'receive' ? '#ff2626' : status == 'pending' ? '#239961' : '';
                            return <span style={{ color }}>{text}</span>;
                        }
                    }
                ]
            }
        };
    },
    methods: {
        getData() {
            this.$nextTick(() => {
                this.$refs.showDetail.show();
                this.currentBtn = 'all';
                this.searchKey = {
                    siteId: this.$root.nowSite.id,
                    userName: '',
                    status: 'all',
                    count_date: this.detailData.count_date,
                    limit: 10
                };
                if (this.searchKey.sortName) delete this.searchKey.sortName;
                if (this.searchKey.sort) delete this.searchKey.sort;
                this.table.columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
                this.$refs.table.setPage();
                this.changeTable({ params: this.searchKey });
            });
        },
        changeTable(data) {
            let params = data.params;
            if (params.status == 'all') delete params.status;
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.userName && !this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.table.loading = true;
            activityHongyundangtouDataInfo(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let { total, data } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                    }
                    this.table.loading = false;
                })
                .catch(error => (this.table.loading = false));
        },
        changeBtn(t) {
            this.currentBtn = t;
            this.searchKey.status = t;
            this.searchSubmit();
            // this.changeTable({ params: this.searchKey })
        },
        searchSubmit() {
            this.searchKey.userName = this.searchKey.userName && this.$root.trimAll(this.searchKey.userName);
            let { sortName, sort } = this.searchKey;
            if (sortName) delete this.searchKey.sortName;
            if (sort) delete this.searchKey.sort;
            this.table.columns.forEach(t => {
                if (t.sortable == 'custom') this.$set(t, 'sortType', '');
            });
            this.$refs.table.setPage();
            this.changeTable({ params: this.searchKey });
        },
        onPageChange(page) {
            this.page = page;
            this.changeTable({ params: this.searchKey, query: { page } });
        },
        onPageSizeChange(pageSzie) {
            this.searchKey.limit = pageSzie;
            this.changeTable({ params: this.searchKey });
        },
        onSortChange({ column, key, order }) {
            delete this.searchKey.sortName;
            delete this.searchKey.sort;
            this.searchKey.sortName = key;
            if (order == 'normal') {
                this.table.columns.forEach(t => {
                    if (t.key == column.key) this.$set(t, 'sortType', 'asc');
                });
                this.searchKey.sort = 'smallToBig';
            } else {
                this.searchKey.sort = order == 'asc' ? 'smallToBig' : 'bigToSmall';
                this.table.columns.forEach(t => delete t.sortType);
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            this.page == 1 ? this.changeTable({ params: this.searchKey }) : this.changeTable({ params: this.searchKey, query: { page: this.page } });
        },
        changeSort(type) {
            this.$refs.betDetail.spinShow();
            this.checkBetting.sort = type;
            activityHongyundangtouBetData(this.checkBetting)
                .then(res => {
                    if (res != undefined && res.code == 200) this.bettingData = res.data;
                    this.$refs.betDetail.spinHide();
                })
                .catch(error => {
                    this.$refs.betDetail.spinHide();
                });
        }
    }
};
</script>
<style lang="less" scoped>
.bd-bg {
    height: 36px;
    background-color: #2d8cf0;
    color: #ffffff;
    box-shadow: 0;
    &:focus {
        box-shadow: 0 0 0 0;
    }
}
.bg-or {
    height: 36px;
    background: #ffffff;
    border: 1px solid #eaeaea;
    color: #666666;
    &:focus {
        box-shadow: 0 0 0 0;
    }
    &:hover {
        background: #f4f9ff;
        border: 1px solid #2d8cf0;
        color: #2d8cf0;
    }
}
.act {
    color: #2d8cf0;
}
.des {
    color: #666666;
}
.modal {
    max-height: 500px;
    overflow-y: scroll;
}
</style>


