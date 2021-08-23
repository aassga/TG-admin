<template>
    <Modals ref="outTheDetails" title="发放详情" width="1400">
        <div slot="content" class="lbList mb30 pl10 pr10">
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
                        <Button type="primary" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                    </FormItem>
                </Form>
            </div>
            <div class="v2-table">
                <Tables
                    ref="table"
                    :loading="$root.tableLoading"
                    :value="table.data"
                    :columns="table.columns"
                    :total="table.total"
                    :showSizer="false"
                    :pageFixShow="true"
                    :pageSizeOpts="table.pageSizeOpts"
                    @on-page-change="onPageChange"
                    @on-sort-change="onSortChange"
                ></Tables>
            </div>
        </div>
    </Modals>
</template>
<script>
import Modals from '_c/modals';
import Tables from '_c/tables';
import { activityHongyundangtouDataInfo } from '@/api/activity';
export default {
    components: {
        Modals,
        Tables
    },
    data() {
        return {
            currentBtn: 'all',
            btnList: [
                { name: '全部', value: 'all' },
                { name: '待发放', value: 'pending' },
                { name: '已领取', value: 'receive' },
                { name: '已失效', value: 'fail' },
                { name: '已取消', value: 'cancel' }
            ],
            page: 1,
            searchKey: {
                config_id: this.$route.query.id,
                siteId: this.$route.query.siteId,
                // sort:'smallToBig', //"bigToSmall=从大到小  smallToBig=从小到大",
                limit: 10,
                status: 'pending' //"description":"pending=待领取  cancel=取消 receive=已领取（发放金额）
                // sortName:'pay_money',//要排序的字段：pay_money,bet_money,negative_profit_money,negative_profit_gift,betting_gift,count_date
            },
            table: {
                total: 0,
                data: [],
                loading: true,
                pageSizeOpts: [10],
                columns: [
                    {
                        title: '会员',
                        key: 'userName',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '有效投注',
                        key: 'bet_money',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '会员输赢',
                        key: 'negative_profit_money',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '会员存款',
                        key: 'pay_money',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '投注红包',
                        key: 'betting_gift',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '负盈利红包',
                        key: 'negative_profit_gift',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '统计时段',
                        key: 'count_date',
                        align: 'center',
                        minWidth: 240
                    },
                    {
                        title: '领取时间',
                        key: 'gift_time',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 100,
                        render: (h, params) => <span>{this.$root.unixTime(params.row.gift_time)}</span>
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 45,
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
        //查看发放详情
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
        getData(val) {
            this.$refs.outTheDetails.show();
            this.$root.startTableLoading();
            if (val) {
                this.currentBtn = 'all';
            }
            if (this.currentBtn == 'all') {
                delete this.searchKey.status;
            } else {
                this.searchKey.status = this.currentBtn;
            }
            activityHongyundangtouDataInfo({ params: this.searchKey })
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        this.table.data = res.data.data;
                        this.table.total = res.data.total;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
            this.page == 1 ? '' : this.$refs.table.setPage();
        },
        changeBtn(btn) {
            delete this.searchKey.userName;
            delete this.searchKey.sortName;
            delete this.searchKey.sort;
            this.currentBtn = btn;
            this.getData();
        },
        changeTable(data) {
            this.$root.startTableLoading();
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
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
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
            this.searchKey.page = 1;
            this.changeTable({ params: this.searchKey });
            // this.page == 1 ? this.changeTable({ params: this.searchKey }) : this.changeTable({ params: this.searchKey, query: { page: this.page }})
        }
    }
};
</script>
<style lang="less" scoped>
.state {
    /deep/.ivu-form-item-label {
        font-size: 1rem !important;
        margin-right: 0;
    }
}
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
</style>

