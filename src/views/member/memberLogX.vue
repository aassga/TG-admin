<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="操作事件">
                    <Select clearable v-model="searchKey.type" class="s-120" placeholder="全部">
                        <Option v-for="(val, key, index) in logTypeList" :key="'logType' + index" :value="key">{{ val }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem label="会员账号">
                    <Input v-model="searchKey.username" @keyup.enter.native="searchSubmit" placeholder="多个请以,逗号隔开" class="s-160" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button :loading="$root.editBtnLoading" class="export" @click.prevent="exportExcel" type="primary">导出Excel</Button>
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
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="sortChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Icons from '@/components/icons';
import tableMixins from '@/mixins/table';
import { memberLoginLogTest, memberLogType } from '@/api/member';
export default {
    name: 'memberLog',
    mixins: [tableMixins],
    components: { Tables, Icons },
    data() {
        return {
            screen: screen.width,
            logTypeList: {},
            Time: [],
            searchKey: {
                siteId: this.$root.nowSite.id,
                type: ''
            },
            table: {
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                total: 100,
                columns: [
                    {
                        title: '会员账号',
                        key: 'username',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true
                    },
                    {
                        title: 'IP',
                        key: 'ip',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '操作时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 160,
                        className: 'pl15 pr15',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '操作事件',
                        key: 'typeName',
                        align: 'center',
                        minWidth: 60,
                        tooltip: true
                        // render: (h, params) => <span style="color:red">{params.row.typeName ? params.row.typeName : '其他'}</span>
                    },
                    {
                        title: '操作日志',
                        key: 'content',
                        align: 'center',
                        tooltip: true,
                        minWidth: 480,
                        className: 'pr20 pl20'
                    }
                ],
                data: []
            }
        };
    },
    created() {
        memberLogType({ siteId: this.$root.nowSite.id }).then(res => {
            if (res != undefined && res.code == 200) {
                this.logTypeList = res.data;
            }
        });
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading();
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            memberLoginLogTest(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { data, total } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                        this.table.loading = false;
                    }
                    this.$root.endTableLoading();
                })
                .catch(err => {
                    this.$root.endTableLoading();
                });
        },
        searchSubmit() {
            let params = { ...this.searchKey };
            params.siteId = this.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeX(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.username) params.username = this.$root.trimAll(params.username);
            if (!this.$root.validateName(params.username)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            if (!params.userName) {
                delete params.userName;
            }
            this.getData({ params });
            this.$refs.tables.setPage();
        },
        //导出
        exportExcel() {
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            data.isExport = 1;
            let openr = window.open();
            memberLoginLogTest({ params: data }).then(res => {
                if (res != undefined && res.code == 200) {

                    let region = res.data.downloadUrl.split('.com')[1];
                    let openr1 = openr ? openr : window;
                    openr1.location.href = region;
                } else {
                    openr.close();
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
</style>
