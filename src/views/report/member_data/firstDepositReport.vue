<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline @submit.native.prevent>
                <FormItem label="">
                    <Select style="width:100px" v-model="searchKey.timeType">
                        <Option  value="deposit">全部注册</Option>
                        <Option  value="register">注册时段</Option>
                    </Select>
                </FormItem>
                <FormItem label="存款类型">
                    <Select style="width:100px" v-model="searchKey.type">
                        <Option v-for="item in scList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem>
                    <FormItem>
                        <Select v-model="searchKey.typeTag" class="s-120">
                            <Option value="userName">会员账号</Option>
                            <Option value="agencyName">代理账号</Option>
                        </Select>
                    </FormItem>
                    <Input v-model="searchKey.content" @keyup.enter.native="searchSubmit" placeholder="请输入查询账号" class="s-140" />
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
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="sortChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import { getfirstReportData } from '@/api/report';
export default {
    name: 'firstDepositReport',
    components: {
        Tables
    },
    data() {
        return {
            page: 1,
            scList: [{ value: 'firstTime', name: '一存' }, { value: 'secondTime', name: '二存' }, { value: 'thirdTime', name: '三存' }],
            searchKey: {
                timeType: 'deposit',
                startTime: this.$root.startTime(),
                endTime: this.$root.formatnightTimeS(),
                typeTag: 'userName',
                siteId: this.$root.nowSite.id,
                type: 'firstTime'
            },
            Time: [this.$root.startTime(), this.$root.formatnightTimeS()],
            table: {
                data: [],
                total: 0,
                columns: [
                    {
                        title: '会员账号',
                        key: 'username',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '账号类型',
                        key: 'agencyLevel',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '上级代理',
                        key: 'agencyName',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => {
                            if (params.row.agencyLevel == '大股东') return <span>-</span>;
                            else return <span>{params.row.agencyName}</span>;
                        }
                    },
                    {
                        title: '一存金额',
                        key: 'firstAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.firstAmount)}</span>
                    },
                    {
                        title: '一存时间',
                        key: 'firstTime',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => <span class="pr10 pl10">{params.row.firstTime > 0 ? this.$root.newUnixTime(params.row.firstTime) : '-'}</span>
                    },
                    {
                        title: '二存金额',
                        key: 'secondAmount',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.secondAmount)}</span>
                    },
                    {
                        title: '二存时间',
                        key: 'secondTime',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => <span class="pr10 pl10">{params.row.secondTime > 0 ? this.$root.newUnixTime(params.row.secondTime) : '-'}</span>
                    },
                    {
                        title: '三存金额',
                        key: 'thirdAmount',
                        sortable: 'custom',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.thirdAmount)}</span>
                    },
                    {
                        title: '三存时间',
                        key: 'thirdTime',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => <span class="pr10 pl10">{params.row.thirdTime > 0 ? this.$root.newUnixTime(params.row.thirdTime) : '-'}</span>
                    },
                    {
                        title: '首日存款',
                        key: 'firstDayDeposit',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => {
                            if (params.row.username == '总计') return <span>{this.$root.keepTwo(params.row.firstDayDeposit)}</span>;
                            else return <span class="red-font">{this.$root.keepTwo(params.row.firstDayDeposit)}</span>;
                        }
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            if (params.row.username == '总计') return <span>-</span>;
                            else return <span class="pr10 pl10">{this.$root.newUnixTime(params.row.created_at)}</span>;
                        }
                    }
                ]
            }
        };
    },
    watch: {
        'searchKey.typeTag'(val, oldVal) {
            if (!val) this.searchKey.content = '';
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (vm.$route.params.from == 'complex') {
                const { startTime, endTime, type } = vm.$route.query;
                vm.Time = [startTime, endTime];
                vm.searchKey.type = type;
                let params = {
                    startTime,
                    endTime,
                    typeTag: 'userName',
                    siteId: vm.$root.nowSite.id,
                    type
                };
                vm.getData({ params });
            } else {
                vm.getData({ params: vm.searchKey });
            }
        });
    },
    methods: {
        getData(data) {
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            this.$root.startTableLoading();
            if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
            getfirstReportData(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { data, total } = res.data;
                        data.list.length && data.list.push(this.createTotalData(data.total));
                        this.table.data = data.list;
                        this.table.total = total;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        createTotalData(total) {
            const { firstAmount, secondAmount, thirdAmount, firstDayDeposit } = total;
            let item = {
                username: '总计',
                agencyLevel: '-',
                agencyName: '-',
                firstAmount,
                firstTime: '-',
                secondAmount,
                secondTime: '-',
                thirdAmount,
                thirdTime: '-',
                firstDayDeposit,
                addTime: '-'
            };
            return item;
        },
        sortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = {
                sortKey: key,
                sortVal: order,
                ...this.searchKey
            };
            this.searchKey.sortKey = key;
            data.siteId = this.$root.nowSite.id;
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
        onPageChange(page) {
            this.page = page;
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }

            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (!params.startTime && !params.endTime) {
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
            params.siteId = this.$root.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }

            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (!params.startTime && !params.endTime) {
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
        searchSubmit() {
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortKey;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            this.$refs.table.setPage();
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }

            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (!params.startTime && !params.endTime) {
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
        exportExcel() {
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.Time;
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else return false;
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            if (this.Time.length < 2) {
                this.$Tip.info({ content: '请输入开始和结束时间' });
                return false;
            }
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.content && !this.$root.validateName(params.content)) {
                this.$Tip.info({ content: `您所查询的${params.typeTag == 'userName' ? '会员' : '代理'}账号不正确，请重新输入` });
                return false;
            }
            params.isExport = 1;
            this.$root.startEditLoading();
            let openr = window.open();
            getfirstReportData({ params },true)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let region = res.data.downloadUrl;
                        let newHost = region.split('.com')[1];
                        let openr1 = openr ? openr : window;
                        openr1.location.href = newHost;
                    } else openr.close();
                    this.$root.endEditLoading();
                })
                .catch(error => this.$root.endEditLoading());
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.ivu-form-item {
    &:nth-child(3) {
        margin-right: -5px;
    }
}
</style>
