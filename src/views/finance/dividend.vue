<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="统计月份">
                    <Select v-model="searchKey.date" class="w120x" @on-change="changeTime" filterable>
                        <Option v-for="(t, i) in newDateList" :key="i" :value="t">{{ t }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <FormItem v-for="(t, i) in btnList" :key="i">
                        <Button class="fontColor w80x" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click.prevent="changeBtn(t)">
                            <span>{{ t }}</span>
                        </Button>
                    </FormItem>
                </FormItem>
                <FormItem label="累计负利">
                    <Select class="w55x" v-model="searchKey.betTimesTpye">
                        <Option value="2">≤</Option>
                        <Option value="1">≥</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <div class="clearfix">
                        <!-- <Input  v-model="searchKey.betTimes" class="w64x fl" /> -->
                        <InputNumber
                            :value="Number(searchKey.betTimes) || null"
                            class="w140x"
                            :max="9999999999"
                            :min="-9999999999"
                            @on-change="
                                value => {
                                    searchKey.betTimes = value;
                                }
                            "
                        />
                    </div>
                </FormItem>
                <FormItem>
                    <Select class="w105x" v-model="searchKey.nameTpye">
                        <Option value="1">大股东线</Option>
                        <Option value="2">代理账号</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input class="w112x" v-model="searchKey.userName" @keyup.enter.native="searchSubmit" placeholder="多个请以,逗号隔开" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click.prevent="oneSend" v-if="newSwitch">一键发放</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="tables"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-change-status="onChangeStatus"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="sortChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Icons from '@/components/icons';
import Tables from '@/components/tables';
import { agencyShareoutbonus, agencyShareoutbonusUp, agencyShareoutbonusSend } from '@/api/finance';
export default {
    name: 'dividend',
    components: {
        Icons,
        Tables
    },
    data() {
        return {
            page: 1,
            newSwitch: 0,
            newDateList: [],
            searchKey: {
                betTimesTpye: '2',
                betTimes: '',
                nameTpye: '2',
                userName: '',
                siteId: this.$root.nowSite.id,
                date: ''
            },
            newState: 'all',
            Time: [],
            btnName: '全部',
            btnList: ['全部', '待发放', '已取消'],
            table: {
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                columns: [
                    {
                        title: '代理账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 45
                    },
                    {
                        title: '大股东',
                        key: 'shareholders',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '累计负利',
                        key: 'beforeProfit',
                        align: 'center',
                        minWidth: 60,
                        sortable: 'custom',
                        tooltip: true,
                        render: (h, params) => {
                            let color = params.row.beforeProfit != 0 ? '#239961' : '';
                            return <span style={{ color }}>{params.row.beforeProfit}</span>;
                        }
                    },
                    {
                        title: '网站盈利',
                        key: 'nowProfit',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 95,
                        tooltip: true,
                        render: (h, params) => {
                            return <span class="red-font">{params.row.nowProfit}</span>;
                        }
                    },
                    {
                        title: '分红业绩',
                        key: 'profit',
                        align: 'center',
                        tooltip: true,
                        sortable: 'custom',
                        minWidth: 95
                    },
                    {
                        title: '发放等级',
                        key: 'level',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 65,
                        render: (h, params) => {
                            // return(<span>第{params.row.level}阶({Math.floor(params.row.proportion)/100}%)</span>)
                            return (
                                <span>
                                    第{params.row.level}阶({params.row.proportion}%)
                                </span>
                            );
                        }
                    },
                    {
                        title: '发放金额',
                        key: 'money',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 200,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'state',
                        align: 'center',
                        minWidth: 45,
                        render: (h, params) => {
                            return (
                                <span
                                    class={{
                                        'red-font': params.row.state == '2'
                                    }}
                                >
                                    {params.row.state == '2'
                                        ? '已取消'
                                        : params.row.state == '1' && params.row.userState == '1'
                                        ? '已领取'
                                        : params.row.state == '1' && params.row.userState == '0'
                                        ? '已发放'
                                        : '待发放'}
                                </span>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: '',
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.state == '1' ? '#918b8b' : '#2D8CF0';
                            return (
                                <div>
                                    <span
                                        style={{ color }}
                                        class={params.row.state == '0' ? 'cs' : '' || params.row.state == '2' ? 'cs' : ''}
                                        onClick={() => {
                                            if (params.row.state == '2' || params.row.state == '0') this.onChangeStatus(params);
                                        }}
                                    >
                                        {params.row.state == '0' ? '取消发放' : '恢复发放'}
                                    </span>
                                </div>
                            );
                        }
                    }
                ],
                data: []
            }
        };
    },
    mounted() {
        let data = {
            siteId: this.$root.nowSite.id,
            state: this.newState,
            date: this.$root.lastMonthDayFullStartTime(this.Time[0])
        };
        this.getData({ params: data });
        this.searchKey.date = this.$root.lastMonthDayFullStartTime(this.Time[0]);
    },
    methods: {
        sortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = {
                ...this.searchKey,
                siteId: this.$root.nowSite.id,
                sortKey: key,
                sortVal: order,
                state: this.newState
            };
            this.searchKey.sortKey = key;
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (data.sortVal == 'normal') {
                this.table.columns.forEach(item => {
                    if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                    this.searchKey.sortVal = 'asc';
                    data.sortVal = 'asc';
                });
            } else {
                this.table.columns.forEach(item => {
                    delete item.sortType;
                });
                this.searchKey.sortVal = order;
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
        },
        changeTime(val) {
            let data = { ...this.searchKey, state: this.newState };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        },
        //一键发放
        oneSend() {
            this.$Tip.confirm({
                content: '您确定要一键发放吗？',
                onOk: () => {
                    const data = {
                        ...this.searchKey,
                        siteId: this.$root.nowSite.id
                    };
                    agencyShareoutbonusSend(data, true).then(res => {
                        if (res.code == 200) {
                            this.$Message.success('分红发放成功');
                        }
                        this.searchSubmit();
                        this.newSwitch = 0;
                    });
                }
            });
        },
        //修改状态
        onChangeStatus(params) {
            let text, msg;
            const { id, siteId, state, shareoutbonusId } = params.row;
            if (state == '0') {
                text = `您确定取消此代理的分红发放吗？`;
                msg = `分红发放取消成功`;
            }
            if (state == '2') {
                text = `您确定恢复此代理的分红发放吗？`;
                msg = `分红发放恢复成功`;
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id: id,
                state: state ? 0 : 2
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    agencyShareoutbonusUp(data, true).then(res => {
                        if (res.code != undefined && res.code == 200) {
                            this.$Message.success(msg);
                            params.row.state = state == 2 ? 0 : 2;
                            this.searchSubmit();
                        }
                    });
                }
            });
        },
        searchSubmit() {
            let data = {
                ...this.searchKey,
                state: this.newState
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (!this.$root.validateName(data.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params: data });
            this.$refs.tables.setPage();
        },
        getData(data) {
            this.$root.startTableLoading();
            agencyShareoutbonus(data).then(res => {
                if (res.code != undefined && res.code == 200) {
                    const { data, total, dateList } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                    this.newDateList = dateList;
                    this.newSwitch = res.data.sendSwititch;
                    this.$root.endTableLoading();
                }
            });
        },
        changeBtn(t) {
            this.btnName = t;
            switch (t) {
                case '待发放':
                    this.newState = '0';
                    break;
                case '已取消':
                    this.newState = '2';
                    break;
                case '全部':
                    this.newState = 'all';
                    break;
            }
            let data = {
                siteId: this.$root.nowSite.id,
                state: this.newState,
                date: this.$root.lastMonthDayFullStartTime(this.Time[0])
            };
            this.getData({ params: data });
        },
        onPageChange(page) {
            this.page = page;
            let data = {
                ...this.searchKey,
                limit: this.pageSize,
                siteId: this.$root.nowSite.id,
                state: this.newState
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        },
        onPageSizeChange(pageSize) {
            let data = {
                siteId: this.$root.nowSite.id,
                state: this.newState,
                ...this.searchKey,
                limit: pageSize
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
//按钮集合的button的样式
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
    border: 1px solid #eaeaea;
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
