<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem v-for="(t, i) in btnList" :key="'btn' + i">
                    <Button class="fontColor" :class="btnName == t ? 'bd-bg' : 'bg-or'" @click="changeBtn(t)">
                        <span>{{ t }}</span>
                    </Button>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker :options="options" placeholder="开始日期" :class="screen < 1600 ? 'w120x' : 'w140x'" v-model="Time[0]" @on-change="startChange"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker :options="options" placeholder="结束日期" :class="screen < 1600 ? 'w120x' : 'w140x'" v-model="Time[1]" @on-change="startChange"></DatePicker>
                </FormItem>
                <FormItem label="代理账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" v-model="searchKey.userName" class="w140x" />
                </FormItem>
                <!-- <FormItem v-if="$root.modeName() != 'no'">
          <Checkbox v-model="searchKey.commissionAgency"><span>自身佣金</span></Checkbox>
        </FormItem>
        <FormItem class='com'>
          <Checkbox v-model="searchKey.transfer"><span>领取佣金</span></Checkbox>
				</FormItem>-->
                <FormItem>
                    <Button type="primary" class="search" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
                <FormItem class="ml5">
                    <Button type="primary" class="ivu-btn export" @click.prevent="exportExcel" :loading="$root.editBtnLoading">导出Excel</Button>
                    <!-- <Poptip trigger="hover" placement="bottom">
                        <div slot="content">
                            <p v-if="$root.modeName() != 'no'">自身佣金占比=自身佣金/代理佣金</p>
                            <p>佣金人数：指给当前代理带来佣金的下级人数(包含下下级)</p>
                        </div>
                        <Icons type="bangzhutishi" color="#E4E4E4" :size="26" class="ib ml5" style="verticalAlign: middle;paddingLeft: 8px;" />
                    </Poptip> -->
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :columns="$root.modeName()=='mode_e'?table.columnsModeE:table.columns"
                :value="table.data"
                :total="table.total"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="onSortChange"
            >
                <!-- <div slot="more">
                    <div class="h44 ">
                        <span class="pl20">总计：</span>
                        <span class="pl20" v-if="$root.modeName() == 'mode_c'">直推返佣 {{ this.$root.keepTwo(totalData.directCommission) }}</span>
                        <span class="pl20" v-if="$root.modeName() == 'mode_c'">级差返佣 {{ this.$root.keepTwo(totalData.rankCommission) }}</span>
                        <span class="pl20">总佣金 {{ this.$root.keepTwo(totalData.agency_commission) }}</span>
                        <span class="pl20">团队网站盈利 {{ this.$root.keepTwo(totalData.profit) }}</span>
                    </div>
                </div> -->
            </Tables>
        </div>
        <!-- 弹窗导出样式更改 -->
        <Modals :width="560" ref="exportPageModal" title="温馨提示" class="modalBox">
            <div slot="content" class="modal-overflow clearfix ft14 mt5 mt20f mb20" :style="exportPage.length > 5 ? 'height:370px' : ''">
                <div class="f6Color">
                    <Icons class="ml23 iconColor" type="danchuangtishi" size="18" />
                    <span class="pb10 pt10 ft14 ib ml10 f-color">当前查询结果共{{ table.total }}条，需要分批导出！</span>
                </div>
                <div
                    class="blue-font fl w50"
                    v-for="(t, i) in exportPage"
                    :style="{ color: t.status == 'yes' ? '#918b8b' : '' }"
                    :key="'export' + i"
                    @click="batchExport(t.index + 1)"
                >
                    <span class="ft14 mt20 ib bd b w210x pt10 pb10 txt-a ml35" v-if="exportPage && i < exportPage.length - 1"
                        >导出第{{ 10000 * t.index + 1 }} ~ {{ 10000 * (t.index + 1) }}条数据</span
                    >
                    <span class="ft14 ib mt20 bd b w210x pt10 pb10 txt-a ml35" v-if="exportPage && i == exportPage.length - 1"
                        >导出第{{ 10000 * t.index + 1 }}~ {{ table.total }}条数据</span
                    >
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '_c/tables';
import Icons from '_c/icons';
import Modals from '_c/modals';
import { commissionReports,modeECommissionReports } from '@/api/report';
import { checkDayBtn } from '@/libs/util';
export default {
    name: 'commissionReport',
    components: {
        Tables,
        Icons,
        Modals
    },
    data() {
        return {
            totalData: [],
            // exportLimit: '10000',
            screen: screen.width,
            btnList: ['今日', '昨天', '本月', '上月', '总数据'],
            btnName: '今日',
            searchKey: {
                startTime: this.$root.todayStartTime(),
                endTime: this.$root.todayEndTime(),
                siteId: this.$root.nowSite.id,
                // commissionAgency: false,
                // transfer: false,
                userName: ''
            },
            exportPage: [], //导出数据过大时的页数
            options: {
                disabledDate: date => date && date.valueOf() < new Date(this.$root.totalDataStartTime()).getTime()
            },
            Time: [this.$root.newstartTime(), new Date()],
            page: 1,
            table: {
                loading: true,
                total: 0,
                data: [],
                columns: [
                    {
                        title: '代理账号',
                        align: 'center',
                        key: 'userName',
                        minWidth: 75,
                        tooltip: true
                    },
                    {
                        title: '直推佣金',
                        key: 'directCommission',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.directCommission)}</span>
                    },
                    {
                        title: '级差佣金',
                        key: 'rankCommission',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.rankCommission)}</span>
                    },
                    {
                        title: '总佣金',
                        key: 'agency_commission',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span class="red-font">{this.$root.keepTwo(params.row.agency_commission)}</span>
                    },
                    {
                        title: '团队存款',
                        key: 'team_depositAmount',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.team_depositAmount)}</span>
                    },
                    {
                        title: '团队取款',
                        key: 'team_withdrawalsAmount',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.team_withdrawalsAmount)}</span>
                    },
                    {
                        title: '团队有效投注',
                        key: 'team_validBetAmount',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.team_validBetAmount)}</span>
                    },
                    {
                        title: '团队优惠',
                        key: 'team_giftBonusAmount',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.team_giftBonusAmount)}</span>
                    },
                    {
                        title: '团队网站盈利',
                        key: 'profit',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.profit > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.profit)}</span>;
                        }
                    },
                    {
                        title: '团队余额',
                        align: 'center',
                        key: 'team_balance',
                        // sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.team_balance)}</span>
                    },
                    {
                        // title: '佣金人数',
                        align: 'center',
                        key: 'commission_people_count',
                        sortable: 'custom',
                        renderHeader: (h, prams) => {
                            return (
                                <div class="popBox" style="display:inline-block;">
                                    <span>佣金人数</span>
                                    <Poptip trigger="hover" placement="left" transfer>
                                        <div slot="content">
                                            <p>佣金人数：指给当前代理带来佣金的下级人数(包含下下级)</p>
                                        </div>
                                        <Icons type="bangzhutishi" color="#E4E4E4" size="16" class="ib ml5" style="paddingLeft: 0px;vertical-align: middle;" />
                                    </Poptip>
                                </div>
                            );
                        },

                        render: (h, params) => <span>{params.row.commission_people_count}</span>
                    }
                ],
                columnsModeE: [
                    {
                        title: '代理账号',
                        align: 'center',
                        key: 'userName',
                        tooltip: true
                    },
                    {
                        title: '晋级礼金奖励',
                        align: 'center',
                        sortable: 'custom',
                        key: 'modeEInviteGift',
                    },
                    {
                        title: '周俸禄奖励',
                        align: 'center',
                        sortable: 'custom',
                        key: 'modeEInviteWeekGift',
                    },
                    {
                        title: '月俸禄奖励',
                        align: 'center',
                        sortable: 'custom',
                        key: 'modeEInviteMonthGift',
                    },
                    {
                        title: '分红奖励',
                        align: 'center',
                        sortable: 'custom',
                        key: 'modeEInviteFenhongGift',
                    },
                    {
                        title: '总佣金',
                        key: 'modeEInviteGiftAll',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span class="red-font">{this.$root.keepTwo(params.row.modeEInviteGiftAll)}</span>
                    },
                    {
                        title: '团队存款',
                        key: 'depositAmount',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.depositAmount)}</span>
                    },
                    {
                        title: '团队取款',
                        key: 'withdrawalsAmount',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.withdrawalsAmount)}</span>
                    },
                    {
                        title: '团队有效投注',
                        key: 'validBetAmount',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.validBetAmount)}</span>
                    },
                    {
                        title: '团队优惠',
                        key: 'agencyBonusAmount',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.agencyBonusAmount)}</span>
                    },
                    {
                        title: '团队网站盈利',
                        key: 'profit',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => {
                            let color = params.row.profit > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.profit)}</span>;
                        }
                    },
                    {
                        title: '团队余额',
                        align: 'center',
                        key: 'team_balance',
                        // sortable: 'custom',
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.team_balance)}</span>
                    },
                  
                ],
                
            }
        };
    },
    mounted() {
        console.log(this.$root.modeName())
      if(this.$route.params.from=='complex')this.btnName='今日';
        let arr = [];
        if (this.$root.modeName() == 'no') {
            this.table.columns.forEach(t => {
                if (t.key != 'self_commission' && t.key != 'team_commission' && t.key != 'commission_proportion') arr.push(t);
            });
            this.table.columns = arr;
        }
        if (this.$root.modeName() != 'mode_c') {
            arr = [];
            this.table.columns.forEach(t => {
                if (t.key != 'rankCommission' && t.key != 'directCommission') arr.push(t);
            });
            this.table.columns = arr;
        }
    },
    beforeRouteEnter(to, from, next) {
        next(v => {
            if (v.$route.query.from == 'complex') {
               v.btnList = ['今日', '昨天', '本月', '上月', '总数据'];
               v.btnName = '今日';
                const { startTime, endTime } = v.$route.query;
                v.searchKey.startTime = startTime;
                v.searchKey.endTime = endTime;
                let data = { ...v.searchKey };
                v.Time = [startTime, endTime];
                // v.btnName = checkDayBtn(v.Time, 'cn', v);
                v.getData({ params: data });
            // } else if (v.$root.modeName() == 'mode_c') {
            //     v.btnList = ['今日', '昨天', '本月', '上月', '总数据'];
            //     v.btnName = '今日';
            //     v.searchKey.startTime = v.$root.yesterdayStartTime();
            //     v.searchKey.endTime = v.$root.yesterdayEndTime();
            //     v.Time[0] = v.$root.yesterdayStartTime();
            //     v.Time[1] = v.$root.yesterdayEndTime();
            //     v.getData({ params: v.searchKey });
            } else {
                v.btnName = '今日';
                v.Time[0] = v.$root.todayStartTime();
                v.Time[1] = v.$root.todayEndTime();
                v.searchKey.startTime = v.$root.todayStartTime();
                v.searchKey.endTime = v.$root.todayEndTime();
                v.getData({ params: v.searchKey });
            }
        });
    },
    methods: {
        getData(data) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            let { commissionAgency, transfer, userName } = data.params;
            // data.params.commissionAgency = commissionAgency ? 1 : 0
            // data.params.transfer = transfer ? 1 : 0
            if (userName) data.params.userName = this.$root.trimAll(userName);
            if (userName) this.searchKey.userName = this.$root.trimAll(userName);
            if (userName && !this.$root.validateName(data.params.userName)) {
                this.$Tip.info({ content: '您所查询的用户名不正确，请重新输入' });
                return false;
            }
            this.$root.startTableLoading();
            console.log(data)
            // modeECommissionReports
            if(this.$root.modeName()=='mode_e'){
                modeECommissionReports(data).then(res=>{
                    if(res!=undefined&&res.code==200){
                        console.log(res.data)

                        const {data}=res.data;
                    this.table.data = data;
                    this.table.total = total;
                    this.totalData = total;
                    }
                }).catch(error=> this.$root.endTableLoading());
            }else{
                commissionReports(data).then(res => {
                if (res != undefined && res.code == 200) {
                    let { list, total } = res.data.data;
                    this.table.data = list;
                    this.table.total = res.data.total;
                    this.totalData = total;
                }
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
            }
          
        },
        searchSubmit() {
            this.$refs.table.setPage();
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
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
            // 同步查询和导出的数据 先放着
            this.searchKey = { ...data };
            this.getData({ params: data });
        },
        exportExcel() {
            this.exportPage = [];
            let data = {
                ...this.searchKey,
                startTime: this.$root.formatTimeS(this.Time[0]),
                endTime: this.$root.formatnightTimeS(this.Time[1])
            };
            // data.commissionAgency = this.searchKey.commissionAgency ? 1 : 0
            // data.transfer = this.searchKey.transfer ? 1 : 0
            if (data.userName) data.userName = this.$root.trimAll(data.userName);
            if (!data.userName) delete data.userName;
            if (data.userName && !this.$root.validateName(data.userName)) {
                this.$Tip.info({ content: '您所查询的用户名不正确，请重新输入' });
                return false;
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
            if (this.table.total > 150000) {
                let num = this.table.total % 10000 == 0 ? this.table.total / 10000 : Math.floor(this.table.total / 10000) + 1;
                for (let i = 0; i < num; i++) {
                    this.exportPage.push({ index: i, status: 'no' });
                }
                this.$refs.exportPageModal.show();
            } else {
                this.$root.startEditLoading();
                let openr = window.open();
                commissionReports({ params: data },true)
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
            }
        },
        //分批导出数据
        batchExport(index) {
            let data = { ...this.searchKey };
            if (data.userName) data.userName = this.$root.trimAll(data.userName);
            if (!data.userName) delete data.userName;
            if (data.userName && !this.$root.validateName(data.userName)) {
                this.$Tip.info({ content: '您所查询的用户名不正确，请重新输入' });
                return false;
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
            data.export_page = index;
            if (10000 + index > this.table.total) data.export_limit = this.table.total - (10000 * (index - 1) + 1);
            else data.export_limit = '10000';
            this.$root.startEditLoading();
            let openr = window.open();
            commissionReports({ params: data })
                .then(res => {
                    if (res.code == 200) {
                        this.exportPage[index - 1].status = 'yes';
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
        onSortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = { ...this.searchKey, sortKey: key, sortVal: order };
            this.searchKey.sortKey = key;
            if (data.sortVal == 'normal') {
                this.table.columns.forEach(element => {
                    if (element.key == column.key) this.$set(element, 'sortType', 'asc');
                });
                this.searchKey.sortVal = 'asc';
                data.sortVal = 'asc';
            } else {
                this.searchKey.sortVal = order;
                this.table.columns.forEach(item => delete item.sortType);
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
        },
        startChange(time, type) {
            this.btnName = checkDayBtn(this.Time, 'cn', this);
        },
        changeBtn(name) {
            if (this.page != 1) this.$refs.table.setPage();
            this.btnName = name;
            this.searchKey.startTime =
                name == '今日'
                    ? this.$root.todayStartTime()
                    : name == '昨天'
                    ? this.$root.yesterdayStartTime()
                    : name == '本月'
                    ? this.$root.monthDayStartTime()
                    : name == '上月'
                    ? this.$root.lastMonthDayStartTime()
                    : this.$root.totalDataStartTime();
            this.searchKey.endTime =
                name == '今日'
                    ? this.$root.todayEndTime()
                    : name == '昨天'
                    ? this.$root.yesterdayEndTime()
                    : name == '本月'
                    ? this.$root.monthDayEndTime()
                    : name == '上月'
                    ? this.$root.lastMonthDayEndTime()
                    : this.$root.totalDataEndTime();
            const { startTime, endTime } = this.searchKey;
            if (this.searchKey.sortKey) delete this.searchKey.sortKey;
            if (this.searchKey.sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            this.Time[0] = startTime;
            this.Time[1] = endTime;
            let data = { ...this.searchKey };
            this.getData({ params: data });
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey };
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };
            this.getData({ params: data });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.h44 {
    height: 44px;
    line-height: 44px;
    background: #f4faff;
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
/deep/.com {
    .ivu-checkbox-wrapper,
    .ivu-checkbox-default {
        margin-left: -10px;
    }
}
.ivu-table {
    color: #444;
}
.lh30 {
    height: 30px;
    line-height: 30px;
}
.modal-overflow {
    max-height: 680px;
}
.modalBox {
    position: relative;
}
.select {
    position: absolute;
    right: 20px;
    bottom: 0px;
}
/deep/.ivu-poptip {
    position: relative;
    left: 18px;
}

/deep/.popBox + .ivu-table-sort {
    position: relative;
    left: -22px;
}
</style>