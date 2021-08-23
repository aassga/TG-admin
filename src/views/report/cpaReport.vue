<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
            <FormItem><Button type="primary">新增渠道</Button></FormItem>
                <FormItem v-for="(t, i) in btnList" :key="i">
                    <Button class="fontColor" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click="changeBtn(t)">
                        <span>{{ t }}</span></Button
                    >
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker :options="options3" @on-change="startChange" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker :options="options3" @on-change="startChange" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem label="代理账号">
                    <Input placeholder="请输入代理账号" @keyup.enter.native="searchSubmit" class="s-140" v-model="searchKey.domain" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="ivu-btn search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel">导出Excel</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :columns="table.columns"
                :value="table.data"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-sort-change="sortChange"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '_c/tables';
import { domainReports } from '@/api/report';
import { checkDayBtn } from '@/libs/util';
export default {
    name: 'domainReport',
    components: { Tables },
    data() {
        return {
            screen: screen.width,
            page: 1,
            Time: [this.$root.todayStartTime(), this.$root.todayEndTime()],
            searchKey: {
                siteId: this.$root.nowSite.id,
                startTime: this.$root.startTime(),
                endTime: this.$root.formatnightTimeS()
            },
            options3: {
                disabledDate: date => {
                    return date && date.valueOf() < new Date(this.$root.totalDataStartTime()).getTime();
                }
            },
            btnList: ['本月', '上月', '总数据'],
            btnName: '今天',
            table: {
                total: 0,
                data: [],
                pageSizeOpts: [20, 30, 40, 50],
                loading: true,
                columns: [
                    {
                        title: '代理账号',
                        key: 'domain',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            const { domain } = params.row;
                            if (domain == '总计') {
                                return <span>{domain}</span>;
                            } else {
                                return (
                                    <span
                                        class="blue-font"
                                        onClick={() => {
                                            this.$router.push({
                                                name: 'domainReportsDetailByDomain',
                                                query: {
                                                    domain,
                                                    startTime: this.searchKey.startTime,
                                                    endTime: this.searchKey.endTime
                                                }
                                            });
                                        }}
                                    >
                                        {params.row.domain.split(':')[0]}
                                    </span>
                                );
                            }
                        }
                    },
                    {
                        title: '总安装数',
                        key: 'accessIpNum',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75
                    },
                    {
                        title: '批量安装',
                        key: 'registerNum',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => {
                            const { registerNum, domain } = params.row;
                            if (domain == '总计') {
                                return <span>{params.row.registerNum}</span>;
                            } else {
                                return (
                                    <span
                                        class="blue-font"
                                        onClick={() => {
                                            if (registerNum > 0) {
                                                this.$router.push({
                                                    name: 'domainReportsDetailByUser',
                                                    params: { page: 'register' },
                                                    query: {
                                                        domain,
                                                        page: 'register',
                                                        startTime: this.searchKey.startTime,
                                                        endTime: this.searchKey.endTime
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {params.row.registerNum}
                                    </span>
                                );
                            }
                        }
                    },
                    {
                        title: '安装单价',
                        key: 'loginIpNum',
                        align: 'center',
                        sortable: 'custom',
                        minWidth: 75,
                        render: (h, params) => {
                            const { domain, loginIpNum } = params.row;
                            if (domain == '总计') {
                                return <span>{params.row.loginIpNum}</span>;
                            } else {
                                return (
                                    <span
                                        class="blue-font"
                                        onClick={() => {
                                            if (loginIpNum > 0) {
                                                this.$router.push({
                                                    name: 'domainReportsDetailByUser',
                                                    params: { page: 'login' },
                                                    query: {
                                                        domain,
                                                        page: 'login',
                                                        startTime: this.searchKey.startTime,
                                                        endTime: this.searchKey.endTime
                                                    }
                                                });
                                            }
                                        }}
                                    >
                                        {params.row.loginIpNum}
                                    </span>
                                );
                            }
                        }
                    },
                    {
                        title: '总结算',
                        align: 'center',
                        key: 'isSSL',
                        minWidth: 55,
                        render: (h, params) => {
                            let color = params.row.isSSL == '是' || params.row.isSSL == '-' ? '' : 'red';
                            return <span style={{ color }}>{params.row.isSSL}</span>;
                        }
                    },
                    {
                        title: '注册数',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                      {
                        title: '充值数',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                         {
                        title: '充值数',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                  {
                        title: '存款金额',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                       {
                        title: '取款金额',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                                 {
                        title: '现金利润',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                                      {
                        title: '回收占比',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                                               {
                        title: '注册成本',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                                                   {
                        title: '充值成本',
                        align: 'center',
                        key: 'isSSL',
                        sortable: 'custom',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                             {
                        title: '扣量占比',
                        align: 'center',
                        key: 'isSSL',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span >{params.row.isSSL}</span>;
                        }
                    },
                                                 {
                        title: '操作',
                        align: 'center',
                        key: 'isSSL',
                        minWidth: 55,
                        render: (h, params) => {
                           return(
                              <div class="blue-font">
                                <span class="mr10 " >编辑</span>
                                  <span>删除</span>
                              </div>
                              
                           )
                        }
                    },
                ]
            }
        };
    },
    mounted() {
        this.getData({ params: this.searchKey });
    },
    methods: {
        startChange(time, type) {
            this.btnName = checkDayBtn(this.Time, 'cn', this);
        },
        // 改变选中的按钮
        changeBtn(name) {
            if (this.page != 1) this.$refs.table.setPage();
            this.btnName = name;
            this.searchKey.startTime =
                name == '今天'
                    ? this.$root.todayStartTime()
                    : name == '昨天'
                    ? this.$root.yesterdayStartTime()
                    : name == '本月'
                    ? this.$root.monthDayStartTime()
                    : name == '上月'
                    ? this.$root.lastMonthDayStartTime()
                    : this.$root.totalDataStartTime();
            this.searchKey.endTime =
                name == '今天'
                    ? this.$root.todayEndTime()
                    : name == '昨天'
                    ? this.$root.yesterdayEndTime()
                    : name == '本月'
                    ? this.$root.monthDayEndTime()
                    : name == '上月'
                    ? this.$root.lastMonthDayEndTime()
                    : this.$root.totalDataEndTime();
            if (this.searchKey.sortKey) delete this.searchKey.sortKey;
            if (this.searchKey.sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            this.Time[0] = this.searchKey.startTime;
            this.Time[1] = this.searchKey.endTime;
            this.getData({ params: this.searchKey });
        },
        getData(data) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            this.$root.startTableLoading();
            domainReports(data).then(res => {
                if (res.data.data) {
                    const { list, total } = res.data.data;
                    list.length && list.push(this.createTotalData(total));
                    this.table.data = list;
                    this.table.total = res.data.total;
                } else {
                    this.tabla.data = [];
                    this.table.total = 0;
                }
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        // 本页统计数据
        createTotalData(total) {
            const { domain, registerNum, accessIpNum, loginIpNum } = total;
            let item = {
                domain: '总计',
                registerNum,
                accessIpNum,
                loginIpNum,
                isSSL: '-'
            };
            return item;
        },
        // 排序
        sortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = {
                sortKey: key,
                sortVal: order,
                ...this.searchKey
            };
            this.searchKey.sortKey = key;
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
        searchSubmit() {
            if (this.page != 1) this.$refs.table.setPage();
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            if (this.searchKey.domain) this.searchKey.domain = this.$root.trimAll(this.searchKey.domain);
            let data = {
                ...this.searchKey,
                startTime: this.$root.formatTimeS(this.Time[0]),
                endTime: this.$root.formatnightTimeS(this.Time[1])
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            let { startTime, endTime } = data;
            if (startTime == 'Invalid date' || endTime == 'Invalid date') {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }
            if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
                this.$Tip.info({ content: '结束时间必须大于开始时间' });
                return false;
            }
            this.searchKey.startTime = data.startTime;
            this.searchKey.endTime = data.endTime;
            this.getData({ params: data });
        },
        exportExcel() {
            if (this.searchKey.domain) this.searchKey.domain = this.$root.trimAll(this.searchKey.domain);
            let data = {
                ...this.searchKey,
                startTime: this.$root.formatTimeS(this.Time[0]),
                endTime: this.$root.formatnightTimeS(this.Time[1])
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            let { startTime, endTime } = data;
            if (startTime == 'Invalid date' || endTime == 'Invalid date') {
                this.$Tip.info({ content: '请输入开始和结束时间' });
                return false;
            }
            if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
                this.$Tip.info({ content: '结束时间必须大于开始时间' });
                return false;
            }
            this.searchKey.startTime = data.startTime;
            this.searchKey.endTime = data.endTime;
            data.isExport = 1;
            this.$root.startEditLoading();
            let openr = window.open();
            domainReports({ params: data })
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let region = res.data.downloadUrl;
                        let nowHost = region.split('.com')[1];
                        let openr1 = openr ? openr : window;
                        openr1.location.href = nowHost;
                    } else {
                        openr.close();
                    }
                    this.$root.endEditLoading();
                })
                .catch(error => this.$root.endEditLoading());
        },
        onPageChange(page) {
            this.page = page;
            this.getData({ params: this.searchKey, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            this.getData({ params: this.searchKey });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
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


