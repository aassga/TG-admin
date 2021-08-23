<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem>
                    <Button
                        :loading="$root.tableLoading"
                        class="ivu-btn search"
                        @click.prevent="goBack"
                        >返回上页</Button
                    >
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        :loading="$root.editBtnLoading"
                        class="ivu-btn export"
                        @click.prevent="exportExcel"
                        >导出Excel</Button
                    >
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :columns="table.columns"
                :value="table.data"
                :page="false"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Icons from "@/components/icons";
import { operationHourReport } from "@/api/report";
import Tables from "_c/tables";
import { mapState } from "vuex";
export default {
    name: "operationHourReport",
    components: { Tables, Icons },
    data() {
        return {
            countDownTimer: null,
            isFromHourCompare: false,
            isToDayReport: false,
            searchKey: {
                siteId: this.$route.query.siteId,
                limit: 31,
            },
            table: {
                loading: true,
                data: [],
                columns: [
                    {
                        title: "日期",
                        align: "center",
                        key: "data_date",
                        minWidth: 80,
                        render: (h, params) => {
                            return (
                                <span>
                                    {this.$root.unixTimeMD(
                                        params.row.data_date,
                                        "/"
                                    )}
                                </span>
                            );
                        },
                    },
                    {
                        title: "时间",
                        align: "center",
                        key: "data_hour",
                        minWidth: 60,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            let aN = a.substr(0, 2)*1; let bN = b.substr(0, 2)*1;
                            return type === 'asc' ? (aN > bN ? 1 : -1) : (aN < bN ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <a
                                    onClick={() => {
                                        this.goHourCompareReport(
                                            params.row.data_date,
                                            params.row.data_hour
                                        );
                                    }}
                                >
                                    {params.row.data_hour}
                                </a>
                            );
                        },
                    },
                    {
                        title: "IOS",
                        align: "center",
                        key: "online_ios",
                        minWidth: 60,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.online_ios}</span>;
                        },
                    },
                    {
                        title: "安卓",
                        align: "center",
                        key: "online_android",
                        minWidth: 60,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.online_android}</span>;
                        },
                    },
                    {
                        title: "H5",
                        align: "center",
                        key: "online_h5",
                        minWidth: 60,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.online_h5}</span>;
                        },
                    },
                    {
                        title: "PC",
                        align: "center",
                        key: "online_pc",
                        minWidth: 60,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.online_pc}</span>;
                        },
                    },
                    {
                        title: "在线人数",
                        align: "center",
                        key: "online_total",
                        minWidth: 100,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.online_total}</span>;
                        },
                    },
                    {
                        title: "存款人数",
                        align: "center",
                        key: "deposit_count",
                        minWidth: 100,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.deposit_count}</span>;
                        },
                    },
                    {
                        title: "在线支付",
                        align: "center",
                        key: "deposit_online_amount",
                        minWidth: 110,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.deposit_online_amount}</span>
                            );
                        },
                    },
                    {
                        title: "公司入款",
                        align: "center",
                        key: "deposit_offline_amount",
                        minWidth: 110,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.deposit_offline_amount}</span>
                            );
                        },
                    },
                    {
                        title: "当前总存款",
                        align: "center",
                        key: "deposit_amount",
                        minWidth: 110,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.deposit_amount}</span>;
                        },
                    },
                    {
                        title: "新增註册",
                        align: "center",
                        key: "register_count",
                        minWidth: 120,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.register_count}</span>;
                        },
                    },
                    {
                        title: "首存人数",
                        align: "center",
                        key: "first_deposit_count",
                        minWidth: 120,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.first_deposit_count}</span>
                            );
                        },
                    },
                    {
                        title: "首存金额",
                        align: "center",
                        key: "first_deposit_amount",
                        minWidth: 120,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.first_deposit_amount}</span>
                            );
                        },
                    },
                    {
                        title: "留存人数",
                        align: "center",
                        key: "retention_count",
                        minWidth: 110,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.retention_count}</span>;
                        },
                    },
                    {
                        title: "留存存款",
                        align: "center",
                        key: "retention_deposit_amount",
                        minWidth: 120,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>
                                    {params.row.retention_deposit_amount}
                                </span>
                            );
                        },
                    },
                    {
                        title: "当前盈亏",
                        align: "center",
                        key: "profit_amount",
                        minWidth: 110,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return <span>{params.row.profit_amount}</span>;
                        },
                    },
                    {
                        title: "人数",
                        align: "center",
                        key: "wechat_count",
                        minWidth: 70,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.wechat_count}</span>
                            );
                        },
                    },
                    {
                        title: "微信",
                        align: "center",
                        key: "wechat_amount",
                        minWidth: 80,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.wechat_amount}</span>
                            );
                        },
                    },
                    {
                        title: "人数",
                        align: "center",
                        key: "alipay_count",
                        minWidth: 70,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.alipay_count}</span>
                            );
                        },
                    },
                    {
                        title: "支付宝",
                        align: "center",
                        key: "alipay_amount",
                        minWidth: 80,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>{params.row.alipay_amount}</span>
                            );
                        },
                    },
                    {
                        title: "人数",
                        align: "center",
                        key: "memberBonusCount",
                        minWidth: 70,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>
                                    {params.row.unionpay_acount}
                                </span>
                            );
                        },
                    },
                    {
                        title: "银联",
                        align: "center",
                        key: "unionpay_amount",
                        minWidth: 80,
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <span>
                                    {params.row.unionpay_amount}
                                </span>
                            );
                        },
                    },
                ],
            },
        };
    },
    computed: {
        ...mapState({
            accessSite: (state) => state.user.accessSite,
        }),
        tagNavList () {
            return this.$store.state.app.tagNavList
        }
    },
    beforeRouteEnter: (to, from, next) => {
        let isFromHourCompare = from.name === 'operationHourCompareReport'
        next((vm) => {
            vm.isFromHourCompare = isFromHourCompare
            const params = { 
                params: {
                    ...vm.$route.query
                }
            };
            vm.getData(params);
        });
    },
    beforeRouteLeave (to, from, next) {
        this.isToDayReport = to.name === 'operationDayReport'
        next()
    },
    mounted() {
        const vm = this
        const now = new Date()
        const isToday = new Date(this.$route.query.dataDate).getDate() === now.getDate()
        if (isToday) {
            const fullHour = 60 * 60 * 1000
            const delayTime = 5 * 1000  // 延遲五秒更新
            const countTime = fullHour - (now.getMinutes() * 60 * 1000 + now.getSeconds() * 1000) + delayTime
            const params = { 
                params: {
                    ...this.$route.query
                }
            };
            this.countDownTimer = setTimeout(() => {  
                this.getData(params);
                this.countDown(fullHour)
            }, countTime)
        }
        
        window.onpopstate = function(event) {
            const operationHourCompareReportRoute = vm.tagNavList.filter(item => item.name === 'operationHourCompareReport')
            const operationHourReportRoute = vm.tagNavList.filter(item => item.name === 'operationHourReport')
            const operationDayRoute = vm.tagNavList.filter(item => item.name === 'operationDayReport')

            if (!vm.isFromHourCompare || vm.isToDayReport) {
                if (operationHourCompareReportRoute.length > 0) {
                    vm.$store.commit('closeTag', operationHourCompareReportRoute[0]);
                }
                vm.$store.commit('closeTag', operationHourReportRoute[0]);
                if (operationDayRoute.length > 0) {
                    vm.$router.replace({ name: operationDayRoute[0].name, query: operationDayRoute[0].query }).catch(() => {})
                } else {
                    vm.$router.push({ name: 'operationDayReport' })
                }
            } else {
                vm.$store.commit('closeTag', operationHourCompareReportRoute[0]);
            }
        }
    },
    beforeDestroy() {
        clearTimeout(this.countDownTimer)
        clearInterval(this.countDownTimer)
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading();
            operationHourReport(data)
                .then((res) => {
                    if (res.data.data) {
                        const { data } = res.data;
                        this.table.data = data;
                    } else {
                        this.tabla.data = [];
                    }
                    this.$root.endTableLoading();
                })
                .catch((error) => this.$root.endTableLoading());
        },
        exportExcel() {
            let data = {
                ...this.searchKey,
                dataDate: this.$route.query.dataDate,
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            data.isExport = 1;
            this.$root.startEditLoading();
            let openr = window.open();
            operationHourReport({ params: data })
                .then((res) => {
                    if (res != undefined && res.code == 200) {
                        let region = res.data.downloadUrl;
                        let nowHost = region.split(".com")[1];
                        let openr1 = openr ? openr : window;
                        openr1.location.href = nowHost;
                    } else {
                        openr.close();
                    }
                    this.$root.endEditLoading();
                })
                .catch((error) => this.$root.endEditLoading());
        },
        goBack() {
            const operationDayReportRoute = this.tagNavList.filter((item) => item.name === 'operationDayReport')[0]
            const operationHourReportRoute = this.tagNavList.filter(item => item.name === 'operationHourReport')[0]
            const operationHourCompareReportRoute = this.tagNavList.filter(item => item.name === 'operationHourCompareReport')
            this.$router.push({
                name: operationDayReportRoute.name,
                query: {
                    ...operationDayReportRoute.query
                }
            })
            this.$store.commit('closeTag', operationHourReportRoute);
            
            if (operationHourCompareReportRoute.length > 0) {
                this.$store.commit('closeTag', operationHourCompareReportRoute[0]);
            }
        },
        goHourCompareReport(date, time) {
            let params = {
                ...this.searchKey,
            };
            date = date + time.substr(0, 2) * 60 * 60;
            params.dataDate = this.$root.unixTime(date);
            this.$router.push({
                name: "operationHourCompareReport",
                query: {
                    ...params,
                },
            });
        },
        countDown(time) {
            const params = { 
                params: {
                    ...this.$route.query
                }
            };
            this.countDownTimer = setInterval(() => {
                this.getData(params);
            }, time);
        },
        queryString(object) {
            let result = []
            for (let key in object) {
                result.push(`${key}=${object[key]}`)
            }
            return result.join('&')
        },
    },
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
/deep/.ivu-table-column-center {
    height: 48px;
    line-height: 48px;
}
/deep/.v2-search .search {
    width: auto;
}
@media screen and (min-width: 960px) and (max-width: 1460px) {
    /deep/.ivu-table-header thead tr:nth-child(1) th {
        height: 37px !important;
        line-height: 37px !important;
        padding: 0;
        .ivu-table-cell span {
            font-size: 1rem;
        }
    }
}
@media screen and (min-width: 1660px) and (max-width: 2000px) {
    /deep/.ivu-table-header thead tr:nth-child(1) th {
        height: 37px !important;
        line-height: 37px !important;
        padding: 0;
        .ivu-table-cell span {
            font-size: 1rem;
        }
    }
    /deep/.ivu-table-tbody {
        tr {
            td {
                .ivu-table-cell {
                    font-size: 0.8rem !important;
                    color: #444 !important;
                    height: 44px !important;
                    line-height: 44px !important;
                }
            }
        }
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
.lhcColor {
    width: 10px;
    height: 10px;
    background: pink;
}
/deep/.ivu-badge-count {
    margin-top: -12px;
}
.demo-badge {
    width: 42px;
    height: 42px;
    background: #eee;
    border-radius: 6px;
    display: inline-block;
}

.test5 {
    height: 0;
    width: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-color: #ff9600 #3366ff transparent transparent;
    border-style: solid solid dashed dashed;
    border-width: 40px 40px 0 0;
}
</style>
