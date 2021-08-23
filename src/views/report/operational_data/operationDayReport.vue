<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="站点名称">
                    <Select
                        v-if="accessSite.length > 1"
                        class="w100x"
                        v-model="searchKey.siteId"
                    >
                        <Option
                            v-for="(t, i) in accessSite"
                            :key="i"
                            :value="t.id"
                            >{{ t.siteName }}</Option
                        >
                    </Select>
                </FormItem>
                <FormItem v-for="(t, i) in btnList" :key="i">
                    <Button
                        class="fontColor"
                        :class="btnName == t ? 'bd-bg' : 'bg-or'"
                        @click="changeBtn(t)"
                    >
                        <span>{{ t }}</span>
                    </Button>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker
                        placeholder="开始日期"
                        @on-change="startChange"
                        class="s-120"
                        type="date"
                        v-model="Time[0]"
                        :options="startDateDisable"
                    ></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker
                        placeholder="结束日期"
                        type="date"
                        @on-change="startChange"
                        class="s-120"
                        v-model="Time[1]"
                    ></DatePicker>
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        :loading="$root.tableLoading"
                        class="ivu-btn search"
                        @click.prevent="searchSubmit"
                        >查询</Button
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
import { operationDayReport } from "@/api/report";
import { checkDayBtn, getTagNavListFromLocalstorage } from "@/libs/util";
import Tables from "_c/tables";
import { mapState } from "vuex";
export default {
    name: "operationDayReport",
    components: { Tables, Icons },
    data() {
        return {
            btnList: ["本月", "上月"],
            btnName: "本月",
            Time: [],
            searchKey: {
                siteId: this.$route.query.siteId*1 || this.$root.nowSite.id,
                limit: 31,
            },
            startDateDisable:{
                disabledDate: date => {
                    return date && date.valueOf() < new Date(this.$root.todayStartTime()).getTime() -30 * 24 * 60 * 60 * 1000 ;
                }
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
                        sortable: true,
                        sortMethod:(a, b, type)=> { 
                            return type === 'asc' ? (a*1 > b*1 ? 1 : -1) : (a*1 < b*1 ? 1 : -1);
                        },
                        render: (h, params) => {
                            return (
                                <a
                                    onClick={() => {
                                        this.goHourReport(
                                            params.row.data_date,
                                        );
                                    }}
                                >
                                    {this.$root.unixTimeMD(
                                        params.row.data_date,
                                        "/"
                                    )}
                                </a>
                            );
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
                        minWidth: 140,
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
                        minWidth: 140,
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
        tagNavList() {
            return this.$store.state.app.tagNavList
        }
    },
    mounted() {
        if (Object.keys(this.$route.query).length > 0) {
            if (this.checkMonth() === '無') {
                this.Time[0] = new Date(this.$route.query.startTime)
                this.Time[1] = new Date(this.$route.query.endTime)
                this.getData(this.$route.query)
            } else {
                this.changeBtn(this.checkMonth());    
            }
        } else {
            this.changeBtn("本月");
        }
    },
    methods: {
        startChange(time, type) {
            this.btnName = checkDayBtn(this.Time, "cn", this);
        },
        changeBtn(name) {
            this.btnName = name;

            if (name === '本月') {
                this.Time[0] = new Date(this.$root.monthDayStartTime())
                this.Time[1] = new Date(this.$root.monthDayEndTime())
            }

            if (name === '上月') {
                this.Time[0] = new Date(this.$root.lastMonthDayStartTime())
                this.Time[1] = new Date(this.$root.lastMonthDayEndTime())
            }

            this.table.columns.forEach((item) => {
                if (item.sortable == "normal") this.$set(item, "sortType", "");
            });
            
            this.searchSubmit()
        },
        searchSubmit() {
            let data = {
                ...this.searchKey,
                startTime: this.$root.formatTimeS(this.Time[0]),
                endTime: this.$root.formatnightTimeS(this.Time[1]),
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            let { startTime, endTime } = data;
            if (startTime == "Invalid date" || endTime == "Invalid date") {
                this.$Tip.info({ content: "请输入开始和结束时间！" });
                return false;
            }
            if (
                new Date(endTime).getTime() - new Date(startTime).getTime() < 0
            ) {
                this.$Tip.info({ content: "结束时间必须大于开始时间" });
                return false;
            }
            this.searchKey.startTime = data.startTime;
            this.searchKey.endTime = data.endTime;

            this.getData(this.searchKey)
        },
        getData(query) {
            let list = [...getTagNavListFromLocalstorage()]
            list = list.map((item) => {
                if (item.name === 'operationDayReport') {
                    item.query = {
                        ...this.searchKey
                    }
                }
                return item
            })
            this.$store.commit('setTagNavList', list)

            let data = { params: {...query} }
            this.$root.startTableLoading();
            operationDayReport(data)
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
        checkMonth() {
            let result = ''
            if (this.$route.query.startTime === this.$root.monthDayStartTime() && this.$route.query.endTime === this.$root.monthDayEndTime()) {
                result = '本月'
            } else if (this.$route.query.startTime === this.$root.lastMonthDayStartTime() && this.$route.query.endTime === this.$root.lastMonthDayEndTime()) {
                result = '上月'
            } else {
                result = '無'
            }
            return result
        },
        exportExcel() {
            let data = {
                ...this.searchKey,
                startTime: this.$root.formatTimeS(this.Time[0]),
                endTime: this.$root.formatnightTimeS(this.Time[1]),
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            let { startTime, endTime } = data;
            if (startTime == "Invalid date" || endTime == "Invalid date") {
                this.$Tip.info({ content: "请输入开始和结束时间！" });
                return false;
            }
            if (
                new Date(endTime).getTime() - new Date(startTime).getTime() <
                0
            ) {
                this.$Tip.info({ content: "结束时间必须大于开始时间" });
                return false;
            }
            this.searchKey.startTime = data.startTime;
            this.searchKey.endTime = data.endTime;
            data.isExport = 1;
            this.$root.startEditLoading();
            let openr = window.open();
            operationDayReport({ params: data })
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
        goHourReport(date) {
            let params = {
                ...this.searchKey,
            }
            params.dataDate = this.$root.unixTime(date)

            this.$router.push({ 
                name: 'operationHourReport', 
                query: { 
                    ...params
                }
            })
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
