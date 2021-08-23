<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <!-- <Button type="primary" @click="wageBracket">工资等级</Button>
         <Button type="primary" @click="profitGrade" class="ml10">分红等级</Button> -->
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem>
                    <Select v-model="searchKey.typeTag" class="s-100">
                        <Option value="userName">会员账号</Option>
                        <Option value="agencyName">上级代理</Option>
                        <Option value="ip">登录IP</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" class="s-160" v-model="searchKey.content" clearable />
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
            ></Tables>
        </div>
        <Modals ref="Modals" title="历史登录">
            <div slot="content" class="modal mb20">
                <Tables
                    ref="historyDataTable"
                    :columns="historyTable.columns"
                    :loading="historyTable.loading"
                    :value="historyTable.data"
                    :pageSizeOpts="historyTable.pageSizeOpts"
                    :total="historyTable.total"
                    @on-page-change="onHistoryPageChange"
                    :show-sizer="false"
                    :page-fix-show="true"
                >
                </Tables>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import tableMixins from '@/mixins/table';
import Icons from '@/components/icons';
import Modals from '@/components/modals';
import { memberLoginLog, singleMemberHistory } from '@/api/member';
export default {
    name: 'memberLoginLog',
    mixins: [tableMixins],
    components: { Tables, Icons, Modals },
    data() {
        return {
            Time: [this.$root.startTime(1), this.$root.endTime(1)],
            searchKey: {
                typeTag: 'userName',
                startTime: this.$root.startTime(1),
                endTime: this.$root.endTime(1),
                siteId:this.$root.nowSite.id,
            },
            table: {
                loading: true,
                total: 0,
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
                        title: '上级代理',
                        key: 'agencyName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true,
                        render: (h, params) => <span>{this.$root.text(params.row.agencyName)}</span>
                    },
                    {
                        title: '登录设备',
                        key: 'device',
                        align: 'center',
                        minWidth: 60,
                        render: (h, params) => {
                            let { device } = params.row;
                            return <span>{this.$root.text(params.row.device == 'ANDROID' ? 'Android' : params.row.device)}</span>;
                        }
                    },
                    {
                        title: '登录域名',
                        key: 'domain',
                        align: 'center',
                        minWidth: 140
                    },
                    {
                        title: '登录IP',
                        key: 'ip',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '归属地',
                        key: 'location',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '登录时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 160,
                        className: 'pr15,pl15',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 70,
                        render: (h, params) => {
                            return (
                                <a
                                    class="blue-font"
                                    onClick={e => {
                                        this.loginHistory(params);
                                    }}
                                >
                                    历史登录
                                </a>
                            );
                        }
                    }
                ],
                data: []
            },
            historyTable: {
                pageSizeOpts: [10],
                total: 0,
                loading: true,
                columns: [
                    {
                        title: '登录设备',
                        key: 'device',
                        align: 'center',
                        render: (h, params) => {
                            let { device } = params.row;
                            return <span>{this.$root.text(params.row.device == 'android' ? 'Android' : device.toUpperCase())}</span>;
                        }
                    },
                    {
                        title: '登录域名',
                        key: 'domain',
                        align: 'center'
                    },
                    {
                        title: '登录IP',
                        key: 'ip',
                        align: 'center'
                    },
                    {
                        title: '归属地',
                        key: 'location',
                        align: 'center'
                    },
                    {
                        title: '登录时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.unixTime(params.row.created_at)}</span>
                    }
                ],
                data: []
            }
        };
    },
    methods: {
        exportExcel() {
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            data.isExport = 1;
            let openr = window.open();
            memberLoginLog({ params: data },true).then(res => {
                if (res != undefined && res.code == 200) {

                    let region = res.data.downloadUrl.split('.com')[1];
                    let openr1 = openr ? openr : window;
                    openr1.location.href = region;
                } else {
                    openr.close();
                }
            });
        },
        profitGrade() {
            this.$router.push({ name: 'profitGrade' });
        },
        wageBracket() {
            this.$router.push({ name: 'wageBracket' });
        },
        getData(data) {
            this.$root.startTableLoading(this);
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            if (!data.params.content) {
                delete data.params.typeTag;
            }
            if (!data.params.typeTag) {
                delete data.params.content;
            }
            memberLoginLog(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                    this.table.loading = false;
                }
                this.$root.endTableLoading();
            }).catch(err=>this.$root.endTableLoading())
        },
        searchSubmit() {
            let params = { ...this.searchKey };
            params.siteId = this.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTime(startTime);
                params.endTime = endTime && this.$root.formatTime(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (!params.content) delete params.typeTag;
            if (params.content) params.content = this.$root.trimAll(params.content);
            if (params.typeTag != 'ip' && !this.$root.validateName(params.content)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            if (params.typeTag == 'ip' && !this.$root.checkIp(params.content)) {
                this.$Tip.info({ content: '您所查询的ip不正确,请重新输入' });
                return false;
            }
            this.getData({ params });
            this.$refs.tables.setPage();
        },
        loginHistory(params) {
            this.historyTable.loading = true;
            const data = {
                siteId: this.$root.nowSite.id,
                uid: params.row.uid,
                limit: 10
            };
            this.historyData = { ...data };
            singleMemberHistory({ params: data }).then(res => {
                const { data, total } = res.data;
                this.historyTable.data = data;
                this.historyTable.total = total;
                this.historyTable.loading = false;
            });
            //修正再次打开模态框时候页码不更新
            this.$refs.historyDataTable.setPage();
            this.$refs.Modals.show();
        },
        onHistoryPageChange(page) {
            this.historyTable.loading = true;
            const data = { params: { ...this.historyData }, query: { page } };
            singleMemberHistory(data).then(res => {
                const { data, total } = res.data;
                this.historyTable.data = data;
                this.historyTable.total = total;
                this.historyTable.loading = false;
            });
        }
    }
};
</script>
<style lang="less" scoped>
.ivu-form-item {
    &:nth-child(4) {
        margin-right: -5px;
    }
    &:nth-child(7) {
        margin-top: 1px !important;
    }
}
.modal {
    max-height: 800px;
    overflow-y: auto;
}

/deep/.ivu-table-header {
    tr {
        .ivu-table-cell {
            font-size: 1rem;
            font-weight: 549;
        }
    }
}
/deep/.ivu-page-total {
    font-size: 0.875rem;
}
</style>
