<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="统计日期">
                    <span>{{ $root.text(showTime[0]) }}</span>
                    <span class="pl10 pr10">至</span>
                    <span>{{ $root.text(showTime[1]) }}</span>
                </FormItem>
                <FormItem label="状态">
                    <Button v-for="(t, i) in btnList" :key="'btn' + i" type="primary" @click.prevent="changeBtn(t)" :class="currentBtn == t.name ? 'bd-bg mr10' : 'bg-or mr10'">{{
                        t.name
                    }}</Button>
                </FormItem>
                <FormItem label="会员账号">
                    <Input v-model="userName" class="w160x" placeholder="多个请以,逗号隔开" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="w80x" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :value="table.data"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :total="table.total"
                :more="true"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="onSortChange"
            >
                <div slot="more">
                    <div class="h44">
                        <span class="pl20">总计：</span>
                        <span class="pl20">投注红包总额：{{ allData.betting_gift_total }}</span>
                        <span class="pl20">负盈利红包总额：{{ allData.negative_profit_gift_total }}</span>
                    </div>
                </div>
            </Tables>
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
</template>
<script>
import Tables from '_c/tables';
import Modals from '_c/modals';
import { getUserType } from '@/libs/util';
import { activityHongyundangtouList, activityHongyundangtouUpdate, activityHongyundangtouBetData } from '@/api/activity';
export default {
    components: {
        Tables,
        Modals
    },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            bettingData: [],
            checkBetting: {},
            showTime: [],
            btnList: [
                { name: '全部', value: 'all' },
                { name: '已领取', value: 'receive' },
                { name: '待发放', value: 'pending' },
                { name: '已取消', value: 'cancel' }
            ],
            currentBtn: '全部',
            userName: '', //会员账号
            page: 1,
            table: {
                data: [],
                loading: true,
                total: 0,
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
                            <span
                                class="cs"
                                style={{
                                    color: this.adminType == 'super' || this.authInPage.indexOf('activityHongyundangtouBetData') != -1 ? '#2D8CF0' : ''
                                }}
                                onClick={() => {
                                    if (this.adminType == 'super' || this.authInPage.indexOf('activityHongyundangtouBetData') != -1) {
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
                                    }
                                }}
                            >
                                {params.row.bet_money}
                            </span>
                        )
                    },
                    {
                        title: '会员盈利',
                        key: 'negative_profit_money',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => (
                            <span
                                class="cs"
                                style={{
                                    color: this.adminType == 'super' || this.authInPage.indexOf('activityHongyundangtouBetData') != -1 ? '#2D8CF0' : ''
                                }}
                                onClick={() => {
                                    if (this.adminType == 'super' || this.authInPage.indexOf('activityHongyundangtouBetData') != -1) {
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
                                    }
                                }}
                            >
                                {params.row.negative_profit_money}
                            </span>
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
                        title: '会员状态',
                        key: 'online_status',
                        align: 'center',
                        render: (h, parmas) => (
                            <span style={{ color: parmas.row.online_status == 'yes' ? '#239961' : '' }}>{parmas.row.online_status == 'yes' ? '彩票在线' : '离线'}</span>
                        )
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, parmas) => {
                            const { status } = parmas.row;
                            let text = status == 'cancel' ? '已取消' : status == 'receive' ? '已领取' : status == 'pending' ? '待发放' : '已失效';
                            let color = status == 'cancel' ? '' : status == 'receive' ? '#ff2626' : status == 'pending' ? '#239961' : '';
                            return <span style={{ color }}>{text}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => (
                            <a
                                style={{
                                    display: this.adminType == 'super' || this.authInPage.indexOf('activityHongyundangtouUpdate') != -1 ? 'inline-block' : 'none'
                                }}
                                onClick={() => {
                                    let { status, id, userName } = params.row;
                                    let data = {
                                        id,
                                        siteId: this.$root.nowSite.id,
                                        status: status == 'cancel' ? 'pending' : status == 'pending' ? 'cancel' : ''
                                    };
                                    let text = status == 'cancel' ? `您确定恢复会员${userName}的发放吗?` : status == 'pending' ? `您确定取消会员${userName}的发放吗？` : '';
                                    let msg = status == 'cancel' ? '恢复成功' : status == 'pending' ? '取消成功' : '';
                                    this.$Tip.confirm({
                                        content: text,
                                        onOk: () => {
                                            activityHongyundangtouUpdate(data, true).then(res => {
                                                if (res != undefined && res.code == 200) {
                                                    this.$Message.success(msg);
                                                    let data = { ...this.searchKey, userName: this.userName };
                                                    for (let key in data) {
                                                        if (!data[key]) delete data[key];
                                                    }
                                                    this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: this.page } });
                                                }
                                            });
                                        }
                                    });
                                }}
                            >
                                {params.row.status == 'cancel' ? '恢复发放' : params.row.status == 'pending' ? '取消发放' : '-'}
                            </a>
                        )
                    }
                ]
            },
            allData: {
                betting_gift_total: 0,
                negative_profit_gift_total: 0
            },
            searchKey: {
                siteId: this.$root.nowSite.id,
                show_type: 'current',
                status: 'all'
            }
        };
    },
    mounted() {
        this.searchSubmit();
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        changeBtn(t) {
            this.currentBtn = t.name;
            this.searchKey.status = t.value;
            this.searchSubmit();
            // let data = { ...this.searchKey, userName: this.userName }
            // this.getData({ params: data })
        },
        getData(data) {
            this.$root.startTableLoading();
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            if (data.params && data.params.status == 'all') delete data.params.status;
            activityHongyundangtouList(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let { data, total, negative_profit_gift_total, betting_gift_total, current_count_date } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                        this.showTime = current_count_date.includes(',') && current_count_date.split(',');
                        this.allData = { negative_profit_gift_total, betting_gift_total };
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey, userName: this.userName };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pagesize) {
            this.searchKey.limit = pagesize;
            let data = { ...this.searchKey, userName: this.userName };
            this.getData({ params: data });
        },
        searchSubmit() {
            let { sortName, sort } = this.searchKey;
            if (sortName) delete this.searchKey.sortName;
            if (sort) delete this.searchKey.sort;
            this.table.columns.forEach(t => {
                if (t.sortable == 'custom') this.$set(t, 'sortType', '');
            });
            this.userName = this.userName && this.$root.trimAll(this.userName);
            if (this.userName && !this.$root.validateName(this.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            let data = { ...this.searchKey, userName: this.userName };
            this.$refs.table.setPage();
            this.getData({ params: data });
        },
        onSortChange({ column, key, order }) {
            delete this.searchKey.sortName;
            delete this.searchKey.sort;
            let data = { ...this.searchKey, userName: this.userName, sortName: key, sort: order };
            this.searchKey.sortName = key;
            if (data.sort == 'normal') {
                this.table.columns.forEach(t => {
                    if (t.key == column.key) this.$set(t, 'sortType', 'asc');
                });
                this.searchKey.sort = 'smallToBig';
                data.sort = 'smallToBig';
            } else {
                this.searchKey.sort = order == 'asc' ? 'smallToBig' : 'bigToSmall';
                data.sort = order == 'asc' ? 'smallToBig' : 'bigToSmall';
                this.table.columns.forEach(t => delete t.sortType);
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
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
.h44 {
    height: 44px;
    line-height: 44px;
    background: #f4faff;
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
