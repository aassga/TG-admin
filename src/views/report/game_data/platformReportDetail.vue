<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem>
                    <span class="pr10">当前平台:</span>
                    <span style="fontWeight:bold">{{ $route.query.platformName }}</span>
                </FormItem>

                <FormItem label="时区">
                    <Select v-model="searchKey.timeType" class="s-120">
                        <Option v-for="item in timeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem >
                    <Select v-model="searchKey.selectType" class="s-120"  v-if="this.currentBtn=='按会员'">
                        <Option value="0">会员账号</Option>
                        <Option value="1" >上级代理</Option>
                    </Select>
                </FormItem>
                <FormItem :label="this.currentBtn=='按游戏'?'会员账号':''">
                    <Input v-model="searchKey.userName" placeholder="多个请以,逗号隔开" class="s-140" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.editBtnLoading" class="ivu-btn export" @click="exportExcel">导出Excel</Button>
                </FormItem>
            </Form>
        </div>
        <div class="mt20">
            <Tabs type="card" @on-click="tabClick" ref="tabs" >
                <TabPane label="按会员" name="按会员" :disabled="disabled"></TabPane>
                <TabPane label="按游戏" name="按游戏" :disabled="disabledGame"></TabPane>
            </Tabs>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                editable
                :columns="table.columns"
                :loading="$root.tableLoading"
                :total="table.total"
                :value="table.data"
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
import { getplatformReportsDetailData, reportsByGameName, getPlatformReportsSelect } from '@/api/report';
import { mapState } from 'vuex';
export default {
    components: {
        Tables
    },
    computed: {
        ...mapState({
            gameReportByMember: state => state.info.gameReportByMember,
            gameReportByGame: state => state.info.gameReportByGame
        })
    },
    data() {
        return {
           disabled:false,
           disabledGame:true,
            siteList: [],
            currentBtn: '按会员',
            page: 1,
            timeList: [
                { value: 'cn', name: '北京时间' },
                { value: 'en', name: '美东时间' }
            ],
            Time: [],
            siteid: 0,
            type: '',
            activeBtn: '',
            siteid: 0,
            searchKey: {
                timeType: this.$route.query.timeType,
                startTime: this.$route.query.startTime,
                endTime: this.$route.query.endTime,
                platform: this.$route.query.platform,
                userName: this.$route.query.userName,
                selectType: '0'
            },
            table: {
                loading: true,
                pageSizeOpts: [20],
                total: 100,
                data: [],
                columns: []
            }
        };
    },

    mounted() {
        const { siteId, siteName, startTime, endTime, timeType } = this.$route.query;
        delete this.searchKey.platformName;
        this.Time = [startTime, endTime];
        this.table.columns = this.gameReportByMember;
        this.$nextTick(() => {
            if (timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) this.tabClick('按会员');
                else return false;
            }
            if (timeType == 'en') {
                if (this.$root.validateTime(this.Time)) this.tabClick('按会员');
                else return false;
            }
        });
    },
    methods: {
        tabClick(name) {
            this.currentBtn = name;
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
            if (name == '按会员') {
              // this.disabledGame=true;
                this.table.columns = this.gameReportByMember;
                 delete data.platformName;
                 if(data.selectType=='1'){
                    this.searchKey.selectType='0'
                 }
                this.getData({ params: data });
            } else {
              //  this.disabled=true;
               if( data.selectType=='1'){
                   delete data.userName;
                   delete data.selectType;
                   this.searchKey.userName='';

               }
                this.table.columns = this.gameReportByGame;
                this.getDataByGame({ params: data });
            }
        },
        // 按会员
        getData(data) {
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            const { timeType } = dataParams;
            if (timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    data.params.startTime = startTime && this.$root.formatTimeS(startTime);
                    data.params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                } else return false;
            } else {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    data.params.startTime = startTime && this.$root.enTimeS(startTime);
                    data.params.endTime = endTime && this.$root.enNightTime(endTime);
                } else return false;
            }
            if (data.params.isLike) data.params.isLike = Number(data.params.isLike);
            this.$root.startTableLoading();
            getplatformReportsDetailData(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { list, total } = res.data.data;
                    list.length && list.push(this.createTotalData(total));
                    this.table.data = list;
                    this.table.total = res.data.total;
                    this.disabledGame=false;
                    this.disabled=true;
                     this.$forceUpdate()
                }
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        // 按游戏
        getDataByGame(data) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            const { timeType } = data.params;
            if (timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    data.params.startTime = startTime && this.$root.formatTimeS(startTime);
                    data.params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                } else return false;
            } else {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    data.params.startTime = startTime && this.$root.enTimeS(startTime);
                    data.params.endTime = endTime && this.$root.enNightTime(endTime);
                } else return false;
            }
            //data.params.siteId = this.$root.nowSite.id;
            this.$root.startTableLoading();
            reportsByGameName(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { list, total } = res.data.data;
                    list.length && list.push(this.createTotalDataByGame(total));
                    this.table.data = list;
                    this.table.total = res.data.total;
                    this.$forceUpdate();
                     this.disabledGame=true;
                    this.disabled=false;

                }
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        sortChange({ column, key, order }) {
            delete this.searchKey.sortKey;
            delete this.searchKey.sortVal;
            let data = {
                sortKey: key,
                sortVal: order,
                ...this.searchKey,
                siteId: this.$root.nowSite.id
            };
            this.searchKey.sortKey = key;
            if (data.sortVal == 'normal') {
                if (this.currentBtn == '按会员') {
                    this.gameReportByMember.forEach(item => {
                        if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                    });
                } else {
                    this.gameReportByGame.forEach(item => {
                        if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                    });
                }
                this.searchKey.sortVal = 'asc';
                data.sortVal = 'asc';
            } else {
                this.searchKey.sortVal = order;
                if (this.currentBtn == '按会员') {
                    this.gameReportByMember.forEach(item => delete item.sortType);
                } else {
                    this.gameReportByGame.forEach(item => delete item.sortType);
                }
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            if (this.currentBtn == '按会员') {
                this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
            } else {
                this.page == 1 ? this.getDataByGame({ params: data }) : this.getDataByGame({ params: data, query: { page: 1 } });
            }
        },
        onPageChange(page) {
            this.page = page;
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            let { timeType } = params;
            if (timeType == 'cn') {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.formatTimeS(startTime);
                    params.endTime = endTime && this.$root.formatnightTimeS(endTime);
                } else return false;
            } else {
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    params.startTime = startTime && this.$root.enTimeS(startTime);
                    params.endTime = endTime && this.$root.enNightTime(endTime);
                } else return false;
            }

            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.userName) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }

            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            if (this.currentBtn == '按会员') {
                this.getData({ params, query: { page } });
            } else {
                this.getDataByGame({ params, query: { page } });
            }
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.Time;
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.userName) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }

            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            if (this.currentBtn == '按会员') {
                this.page == 1 ? this.getData({ params }) : this.getData({ params, query: { page: 1 } });
            } else {
                this.page == 1 ? this.getDataByGame({ params }) : this.getDataByGame({ params, query: { page: 1 } });
            }
        },
        createTotalData(total) {
            const { betCount, betAmount, validBetAmount, netAmount, winRate } = total;
            let item = {
                userName: '总计',
                betCount,
                betAmount,
                validBetAmount,
                netAmount,
                winRate
            };
            return item;
        },
        createTotalDataByGame(total) {
            const { gameName, betCount, betUserCount, betAmount, validBetAmount, netAmount, winRate } = total;
            let item = {
                gameName: '总计',
                betCount,
                betUserCount: '-',
                betAmount,
                validBetAmount,
                netAmount,
                winRate
            };
            return item;
        },
        searchSubmit() {
            let { sortKey, sortVal } = this.searchKey;
            if (sortKey) delete this.searchKey.sortKey;
            if (sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            this.$refs.table.setPage();
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;

            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.Time;
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (params.userName && params.userName.length < 5) {
                this.$Tip.info({ content: '会员账号最小5个字符！' });
                return false;
            }

            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.userName) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }

            if (params.userName && !this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            if (this.currentBtn == '按会员') {
                this.getData({ params });
            } else {
               
                if(params.selectType=='1'){
                    params.selectType='0';
                }
                this.getDataByGame({ params });
            }
        },
        exportExcel() {
            this.$refs.table.setPage();
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.Time;
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (params.userName && !this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }

            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }

            if (!params.userName) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            params.isExport = 1;
            this.$root.startEditLoading();
            let openr = window.open();
            this.$root.startEditLoading(this);
            if (this.currentBtn == '按会员') {
                getplatformReportsDetailData({ params }).then(res => {
                    if (res != undefined && res.code == 200) {
                        let region = res.data.downloadUrl;
                        let nowHost = region.split('.com')[1];
                        let openr1 = openr ? openr : window;
                        openr1.location.href = nowHost;
                    } else {
                        openr.close();
                    }
                });
            } else {
                reportsByGameName({ params }).then(res => {
                    if (res != undefined && res.code == 200) {
                        let region = res.data.downloadUrl;
                        let nowHost = region.split('.com')[1];
                        let openr1 = openr ? openr : window;
                        openr1.location.href = nowHost;
                    } else {
                        openr.close();
                    }
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
.w10 {
    width: 12.5%;
}

/deep/.ivu-tabs {
    color: #444;
}
/deep/.ivu-tabs-tab {
    font-size: 1rem !important;
}
</style>
