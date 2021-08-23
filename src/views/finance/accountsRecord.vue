<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="催账类型">
                    <Select clearable class="s-86" v-model="searchKey.type" placeholder="全部">
                        <Option value="deposit">存款</Option>
                        <Option value="withdrawals">取款</Option>
                        <Option value="preferential">优惠</Option>
                    </Select>
                </FormItem>
                <FormItem label="催账状态">
                    <Select clearable class="s-86" v-model="searchKey.status" placeholder="全部">
                        <Option value="fail">失败</Option>
                        <Option value="success">成功</Option>
                        <Option value="wait">待审核</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>

                <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" class="s-195" v-model="searchKey.userName" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search ml10f mb5" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                editable
                ref="tables"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                :more="table.more"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import { emergencyLogListData } from '@/api/finance';
import tableMixins from '@/mixins/table';
export default {
    // name: "accountsRecord",
    mixins: [tableMixins],
    components: {
        Tables
    },
    data() {
        return {
            screen: screen.width,
            Time: [],
            title: '催账记录',
            searchKey: {
                status: 'wait'
            },
            table: {
                total: 0,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                columns: [
                    {
                        title: '订单号',
                        key: 'code',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true
                    },
                    {
                        title: '等级',
                        key: 'levelAlias',
                        align: 'center',
                        minWidth: 45
                    },
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '催账类型',
                        key: 'type',
                        align: 'center',
                        minWidth: 60,
                        render: (h, params) => {
                            const { type } = params.row;
                            return <span>{type === 'deposit' ? '存款' : type === 'withdrawals' ? '取款' : '优惠'}</span>;
                        }
                    },
                    {
                        title: '催账金额',
                        key: 'amount',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 35,
                        render: (h, params) => {
                            const { status } = params.row;
                            let color = status == 'success' ? '' : '#FF2626';
                            return <span style={{ color }}>{status === 'wait' ? '待审核' : status === 'success' ? '成功' : '失败'}</span>;
                        }
                    },
                    {
                        title: '催账时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return <span class="pr10 pl10">{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '审核时间',
                        key: 'updated_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            if (params.row.status == 'wait') {
                                return <span>-</span>;
                            }
                            if (params.row.status == 'success' || params.row.status == 'fail') {
                                return <span class="pr10 pr10">{this.$root.unixTime(params.row.updated_at)}</span>;
                            }
                        }
                    },
                    {
                        title: '审核者',
                        key: 'update_user',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    }
                ],
                data: []
            }
        };
    },
    created() {},
    methods: {
        getData(data) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            this.$root.startTableLoading();
            emergencyLogListData(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { total, data } = res.data;
                        this.table.total = total;
                        this.table.data = data;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        searchSubmit() {
            let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTime(startTime);
                params.endTime = endTime && this.$root.formatTime(endTime);
            } else {
                return false;
            }

            if (params.userName !== undefined && params.userName.includes('')) {
                params.userName = params.userName.trim();
            }
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.$refs.tables.setPage();
            this.getData({ params });
        }
    }
};
</script>
<style lang="less" scoped>
.ivu-form-item {
    &:nth-child(5) {
        margin-right: -5px;
    }
}
</style>


