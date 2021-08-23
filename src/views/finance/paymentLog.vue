<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="开始日期">
                    <DatePicker
                        type="date"
                        placeholder="开始日期"
                        :class="screen == 1440 ? 's-130' : 's-120'"
                        v-model="searchKey.startTime"
                    ></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker
                        type="date"
                        placeholder="开始日期"
                        :class="screen == 1440 ? 's-130' : 's-120'"
                        v-model="searchKey.endTime"
                    ></DatePicker>
                </FormItem>
                <FormItem label="支付平台">
                    <Input v-model="searchKey.payName" @keyup.enter.native="searchSubmit" placeholder="请输入支付平台" class="s-160" />
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
import tableMixins from '@/mixins/table';
import { onlinePayErrorLog } from '@/api/finance'
export default {
    name: 'paymentLog',
    mixins: [tableMixins],
    components: { Tables },
    data() {
        return {
            Time: [],
            screen: screen.width,
            searchKey: {
                siteId: this.$root.nowSite.id,
                isExport: 0,
            },
            table: {
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                total: 100,
                columns: [
                    {
                        title: '支付方式',
                        key: 'pay_type',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true
                    },
                    {
                        title: '支付平台',
                        key: 'pay_name',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '错误信息',
                        key: 'return_content',
                        align: 'center',
                        minWidth: 160,
                    },
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 160,
                    },
                    {
                        title: '支付时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => {
                            return <span class="pl20 pr20">{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                ],
                data: []
            }
        };
    },
    created() {
        this.searchKey.startTime = this.$moment().format('YYYY-MM-DD');
        this.searchKey.endTime = this.$moment().format('YYYY-MM-DD');
    },
    methods: {
        onPageChange(page) {
            this.searchKey.page = page;
            this.searchSubmit();
        },
        onPageSizeChange(size) {
            this.searchKey.limit = size;
            // this.searchSubmit();
        },
        getData(data) {   
            this.$root.startTableLoading();
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            dataParams.startTime = this.$moment().format('YYYY-MM-DD')
            dataParams.endTime = this.$moment().format('YYYY-MM-DD')

            onlinePayErrorLog(dataParams)
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
                    console.log(err);
                    this.$root.endTableLoading();
                });
        },
        searchSubmit() {
            const params = { ...this.searchKey };
            onlinePayErrorLog(params)
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
                    console.log(err);
                    this.$root.endTableLoading();
                });
            this.$refs.tables.setPage();
        },
        //导出
        exportExcel() {
            const params = { ...this.searchKey };
            params.isExport = 1;
            let openr = window.open();
            onlinePayErrorLog(params).then(res => {
                if (res.data.downloadUrl != undefined && res.code == 200) {
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
