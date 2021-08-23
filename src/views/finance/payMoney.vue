<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="统计日期">
                    <Select v-model="searchKey.date" class="w120x" @on-change="changeTime" filterable>
                        <Option v-for="(t, i) in newDateList" :key="i" :value="t">{{ t }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="状态">
                    <FormItem v-for="(t, i) in btnList" :key="i">
                        <Button class="fontColor w80x" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click.prevent="changeBtn(t)">
                            <span>{{ t }}</span>
                        </Button>
                    </FormItem>
                </FormItem>
                <FormItem label="打码倍数">
                    <Select class="w55x" v-model="searchKey.betTimesTpye">
                        <Option value="2">≤</Option>
                        <Option value="1">≥</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <div class="clearfix" style="white-space:nowrap;">
                        <Input
                            placeholder="整数倍"
                            v-model="searchKey.betTimes"
                            type="text"
                            @on-keyup="searchKey.betTimes = searchKey.betTimes.replace(/[^\d]/g, '')"
                            class="w64x fl"
                        />
                        <Poptip trigger="hover" placement="bottom" class="fl">
                            <div slot="content">该倍数为当日投注除以存款的整数倍</div>
                            <Icons class="fr ml5" type="bangzhutishi" size="26" color="#E4E4E4" />
                        </Poptip>
                    </div>
                </FormItem>
                <FormItem>
                    <Select class="w90x" v-model="searchKey.nameTpye">
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
import { agencyWage, agencyWageUp, agencyWageSend } from '@/api/finance';
export default {
    name: 'payMoney',
    components: {
        Icons,
        Tables
    },
    data() {
        return {
            pageSize: '',
            page: 1,
            newSwitch: 0,
            searchKey: {
                betTimesTpye: '2',
                betTimes: '',
                nameTpye: '2',
                userName: '',
                siteId: this.$root.nowSite.id,
                date: ''
            },
            newDateList: [],
            newState: 'all',
            Time: [],
            btnName: '全部',
            btnList: ['全部', '待发放', '风险', '已取消'],
            table: {
                loading: true,
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
                        title: '团队存款',
                        key: 'depositAmount',
                        align: 'center',
                        minWidth: 60,
                        tooltip: true,
                        sortable: 'custom'
                    },
                    {
                        title: '有效投注',
                        key: 'validBetAmount',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true,
                        sortable: 'custom'
                    },
                    {
                        title: '打码倍数',
                        key: 'times',
                        align: 'center',
                        tooltip: true,
                        minWidth: 95,
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.times <= 2)
                                return (
                                    <span>
                                        {params.row.times}倍<span class="ml5 red-font">风险</span>
                                    </span>
                                );
                            if (params.row.times > 2) {
                                return <span>{params.row.times}倍</span>;
                            }
                        }
                    },
                    {
                        title: '工资等级',
                        key: 'level',
                        align: 'center',
                        minWidth: 65,
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>第{params.row.level}阶</span>;
                        }
                    },
                    {
                        title: '发放金额',
                        key: 'money',
                        align: 'center',
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
                                    {params.row.state == '2' ? '已取消' : params.row.state == '1' ? '已发放' : '待发放'}
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
                                        class={params.row.state == '0' ? 'cs' : '' || params.row.state == '2' ? 'cs' : ''}
                                        style={{ color }}
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
            date: this.$root.yesterdayFullStartTime(this.Time[0])
        };
        this.getData({ params: data });
        this.searchKey.date = this.$root.yesterdayFullStartTime(this.Time[0]);
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
                        date: this.searchKey.date,
                        siteId: this.$root.nowSite.id
                    };
                    agencyWageSend(data, true).then(res => {
                        if (res.code == 200 && res.code != undefined) {
                            this.newSwitch = 0;
                            this.$Message.success('工资发放成功');
                            this.searchSubmit();
                        }
                    });
                }
            });
        },
        //修改状态
        onChangeStatus(params) {
            let text, msg;
            const { id, siteId, state, wageId } = params.row;
            if (state == '0') {
                text = `您确定取消此代理的工资发放吗？`;
                msg = `工资发放取消成功`;
            }
            if (state == '2') {
                text = `您确定恢复此代理的工资发放吗？`;
                msg = `工资发放恢复成功`;
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id: id,
                state: state ? 0 : 2
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    agencyWageUp(data, true).then(res => {
                        if (res.code != undefined && res.code == 200) {
                            this.$Message.success(msg);
                            if (this.btnName != '全部') {
                                this.table.data.splice(params.index, 1);
                                this.table.total--;
                            }

                            data.date = this.searchKey.date;
                            data.state = this.newState;
                            this.getData({ params: data });
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
        getData(data, type) {
            this.$root.startTableLoading();
            agencyWage(data).then(res => {
                if (res.code != undefined && res.code == 200) {
                    const { data, total, dateList } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                    this.newDateList = dateList;
                    this.newSwitch = res.data.sendSwititch;
                    this.$root.endTableLoading();
                }
            }).catch(err=>this.$root.endTableLoading())
        },
        changeBtn(t) {
            this.btnName = t;
            switch (t) {
                case '待发放':
                    this.newState = '0';
                    break;
                case '风险':
                    this.newState = '3';
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
                ...this.searchKey
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
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
            this.getData({ params: data, query: { page } });
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
            this.pageSize = pageSize;
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
