<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="业务类型">
                    <Select clearable v-model="searchKey.type" class="s-120" placeholder="全部">
                        <Option v-for="item in firstList" :key="item.value" :value="item.value">{{ item.name }}</Option>
                    </Select>
                    <span v-show="searchKey.type" class="pl5 pr5">-</span>
                    <Select clearable v-model="searchKey.subType" placeholder="全部" class="s-120" v-show="searchKey.type">
                        <Option v-for="(t, i) in secondList" :key="'second' + i" :value="t.value" v-if="!t.name.includes('hide')">{{ t.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" v-model="searchKey.userName" class="s-160" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
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
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                :pageSizeOpts="table.pageSizeOpts"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import tableMixins from '@/mixins/table';
import Icons from '@/components/icons';
import { memberFinanceLog, memberBetLogType } from '@/api/member';
export default {
    name: 'memberFundsLog',
    mixins: [tableMixins],
    components: { Tables, Icons },
    data() {
        return {
            allTypeList: [],
            firstList: [], //一级
            secondList: [], //二级
            Time: [this.$root.startTime(1),this.$root.endTime(1)],
            searchKey: {
                type: '',
                startTime: this.$root.startTime(1),
                endTime: this.$root.endTime(1),
            },
            table: {
                loading: true,
                total: 100,
                pageSizeOpts: [20, 30, 40, 50],
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '业务类型',
                        key: 'type',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '变更类型',
                        key: 'subType',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => <span>{this.$root.text(params.row.subType)}</span>
                    },
                    {
                        title: '变更金额',
                        key: 'money',
                        align: 'center',
                        minWidth: 60,
                        render: (h, params) => <span>{Number(params.row.money).toFixed(2)}</span>
                    },
                    {
                        title: '变更前余额',
                        key: 'beforMoney',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '变更后余额',
                        key: 'afterMoney',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '变更时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 130,
                        render: (h, params) => <span>{this.$root.unixTime(params.row.created_at)}</span>
                    },
                    {
                        title: '审核者',
                        key: 'created_by',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true,
                        render: (h, params) => <span>{this.$root.text(params.row.created_by)}</span>
                    },
                    {
                        title: '备注',
                        key: 'remarks',
                        align: 'center',
                        minWidth: 250,
                        tooltip: true,
                        className: 'pl20 pr20'
                    }
                ],
                data: []
            }
        };
    },
    watch: {
        'searchKey.type'(val) {
            if (val || val != undefined) {
                this.secondList = [];
                delete this.searchKey.subType;
                this.allTypeList.forEach(t => {
                    if (t.name_en == val) {
                        for (let key in t.list) {
                            if (this.$root.modeName() == 'mode_c') {
                                //if (key == 'directCommission' || key == 'rankCommission') {
                                this.secondList.push({ name: t.list[key], value: key });
                                // }
                            } else {
                                if (key != 'directCommission' && key != 'rankCommission') {
                                    this.secondList.push({ name: t.list[key], value: key });
                                }
                            }
                        }
                    }
                });
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (from.name === 'memberSearchFunds') vm.$store.commit('closeTag', from);
        });
    },
    mounted() {
        this.getAllList();
    },
    methods: {
        // 资金日志下拉
        getAllList() {
            memberBetLogType({ siteId: this.$root.nowSite.id }).then(res => {
                if (res != undefined && res.code == 200) {
                    res.data.forEach(t => {
                        if (t.name_en == 'commission') {
                            for (let key in t.list) {
                                if (key == 'AgencyWage' || key == 'AgencyShareOutBonus') {
                                    if (this.$root.modeName() == 'mode_c') t.list[key] = t.list[key].includes('hide') ? '' : t.list[key] + ':hide';
                                }
                                // if (key == 'AgencyCommissionSelf') t.list[key] = this.$root.modeName() == 'mode_c' ? '自身返佣' : '自身返佣'
                                // if (key == 'AgencyCommissionUp') t.list[key] = this.$root.modeName() == 'mode_c' ? '下级返佣' : '下级返佣'
                            }
                        }
                    });
                    this.allTypeList = res.data;
                    this.allTypeList.forEach(t => {
                        this.firstList.push({ name: t.name_cn, value: t.name_en });
                    });
                }
            });
        },
        getData(data) {
            this.$root.startTableLoading(this);
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            if (!data.params.userName) delete data.params.userName;
            if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
            if (data.params.type == 'all') delete data.params.type;
            data.params.startTime= this.$root.formatTimeS(dataParams.startTime);
            data.params.endTime= this.$root.formatnightTimeS(dataParams.endTime);
            memberFinanceLog(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
                    this.table.loading = false;
                    this.table.data = data;
                    this.table.total = total;
                }
                this.$root.endTableLoading();
            }).catch(err=>this.$root.endTableLoading())
        },
        searchSubmit() {
            let { type, subType } = this.searchKey;
            if (!type || type == undefined) delete this.searchKey.subType;
            let params = { ...this.searchKey };
            params.siteId = this.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                this.searchKey.startTime=params.startTime = startTime && this.$root.formatTimeS(startTime);
                this.searchKey.endTime=params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
         
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params });
            this.$refs.tables.setPage();
        }
    }
};
</script>
<style lang="less" scoped>
</style>
