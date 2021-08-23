<template>
    <div>
        <div class="v2-search">
            <Poptip trigger="hover" class="fr" placement="bottom-end">
                <div slot="content">
                    <p>自身业绩: 自身投注产生的业绩</p>
                    <p>直推业绩: 下级直属业绩之和</p>
                    <p>代理业绩: 除开自身业绩和直属业绩之外,其他下下级会员业绩之和</p>
                    <p>团队业绩: 除自身业绩之外的下级会员业绩之和</p>
                </div>
                <Icons type="bangzhutishi" color="#E4E4E4" :size="26" class="ib ml5" style="verticalAlign: middle;paddingLeft: 8px;" />
            </Poptip>
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
                <FormItem>
                    <Select class="w120x mr20" v-model="searchKey.nameType">
                        <Option value="0">会员账号</Option>
                        <Option value="1">上级代理</Option>
                    </Select>
                    <Input class="w135x" v-model="searchKey.name" placeholder="请输入查询账号" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" @click="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
                <FormItem class="ml5">
                    <Button type="primary" class="ivu-btn export" @click="exportExcel" :loading="$root.editBtnLoading">导出Excel</Button>
                </FormItem>
            </Form>
        </div>
        <Span class="spanBtn cs" style="margin-bottom:10px">
            <Span
                class="pl20 pr20 ib ft16"
                v-for="(item, key, i) in platform"
                :key="i"
                :class="current == item.name ? 'active' : ''"
                @click="setTable(item.name)"
                style="border-bottom:0"
            >
                {{ item.name }}
            </Span>
        </Span>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :columns="table.columns"
                :value="table.data"
                :total="table.total"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="onSortChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '_c/tables';
import Icons from '_c/icons';
import Modals from '_c/modals';
import { reportsAgencyModeC } from '@/api/report';
import { checkDayBtn } from '@/libs/util';
export default {
    name: 'reportsAgencyModeC',
    components: {
        Tables,
        Icons,
        Modals
    },
    data() {
        return {
            current: '全部',
            screen: screen.width,
            // btnList: ["今天", "昨天", "本月", "上月", "总数据"],
            btnList: ['今天', '昨天', '本月', '上月'],
            platform: [
                { type: 'all', name: '全部' },
                { type: 'liveColumns', name: '真人视讯' },
                { type: 'chessColumns', name: '棋牌游戏' },
                { type: 'sportColumns', name: '体育赛事' },
                { type: 'slotColumns', name: '电子游艺' },
                { type: 'lotteryColumns', name: '彩票游戏' },
                { type: 'fishColumns', name: '捕鱼游戏' }
            ],
            btnName: '今天',
            searchKey: {
                startTime: this.$root.startTime(),
                endTime: this.$root.formatnightTimeS(),
                siteId: this.$root.nowSite.id,
                nameType: '0',
                name: '',
                page: '1'
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
                        title: '会员账号',
                        align: 'center',
                        key: 'userName',
                        minWidth: 75
                    },
                    {
                        title: '账号类型',
                        key: 'nameType',
                        align: 'center'
                    },
                    {
                        title: '上级代理',
                        key: 'agencyName',
                        align: 'center',
                        render: (h, params) => <span> {params.row.agencyName === '' ? '-' : params.row.agencyName} </span>
                    },
                    {
                        title: '自身业绩',
                        key: 'ResultsSelfAll',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '直推业绩',
                        key: 'ResultsFirstAll',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '代理业绩',
                        key: 'ResultsAgencyAll',
                        sortable: 'custom',
                        align: 'center'
                    },
                    {
                        title: '团队业绩',
                        key: 'ResultsTeamAll',
                        sortable: 'custom',
                        align: 'center'
                    }
                ],
                commissionColumns: []
            },
            all: ['userName', 'nameType', 'agencyName', 'ResultsSelfAll', 'ResultsFirstAll', 'ResultsAgencyAll', 'ResultsTeamAll'],
            liveColumns: ['userName', 'nameType', 'agencyName', 'LiveResultsSelf', 'LiveResultsSelfFirst', 'LiveResultsAgency', 'LiveResultsTeam'],
            chessColumns: ['userName', 'nameType', 'agencyName', 'ChessResultsSelf', 'ChessResultsSelfFirst', 'ChessResultsAgency', 'ChessResultsTeam'],
            sportColumns: ['userName', 'nameType', 'agencyName', 'SportResultsSelf', 'SportResultsSelfFirst', 'SportResultsAgency', 'SportResultsTeam'],
            slotColumns: ['userName', 'nameType', 'agencyName', 'SlotResultsSelf', 'SlotResultsSelfFirst', 'SlotResultsAgency', 'SlotResultsTeam'],
            lotteryColumns: ['userName', 'nameType', 'agencyName', 'LotteryResultsSelf', 'LotteryResultsSelfFirst', 'LotteryResultsAgency', 'LotteryResultsTeam'],
            fishColumns: ['userName', 'nameType', 'agencyName', 'FishResultsSelf', 'FishResultsSelfFirst', 'FishResultsAgency', 'FishResultsTeam']
        };
    },
    mounted() {
        this.getData(this.searchKey);
    },
    methods: {
        setTable(name) {
            this.current = name;
            if (name == '全部') {
                this.table.columns.map((item, i) => {
                    item.key = this.all[i];
                });
            }
            if (name == '真人视讯') {
                this.table.columns.map((item, i) => {
                    item.key = this.liveColumns[i];
                });
            }
            if (name == '棋牌游戏') {
                this.table.columns.map((item, i) => {
                    item.key = this.chessColumns[i];
                });
            }
            if (name == '体育赛事') {
                this.table.columns.map((item, i) => {
                    item.key = this.sportColumns[i];
                });
            }
            if (name == '电子游艺') {
                this.table.columns.map((item, i) => {
                    item.key = this.slotColumns[i];
                });
            }
            if (name == '彩票游戏') {
                this.table.columns.map((item, i) => {
                    item.key = this.lotteryColumns[i];
                });
            }
            if (name == '捕鱼游戏') {
                this.table.columns.map((item, i) => {
                    item.key = this.fishColumns[i];
                });
            }
        },
        getData(data) {
            let { name } = data;
            if (name) data.name = this.$root.trimAll(name);
            if (name) this.searchKey.name = this.$root.trimAll(name);
            if (name && !this.$root.validateName(data.name)) {
                this.$Tip.info({ content: '您所查询的用户名不正确，请重新输入' });
                return false;
            }
            this.$root.startTableLoading();
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            // console.log(data)
            reportsAgencyModeC(data).then(res => {
                if (res != undefined && res.code == 200) {
                    // console.log(res)
                    let { list, total } = res.data.data;
                    list.length && list.push(this.createTotalData(total));
                    this.table.data = list;
                    this.table.total = res.data.total;
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
        },
        createTotalData(total) {
            const {
                ResultsSelfAll,
                ResultsFirstAll,
                ResultsAgencyAll,
                ResultsTeamAll,
                LiveResultsSelf,
                LiveResultsSelfFirst,
                LiveResultsAgency,
                LiveResultsTeam,
                ChessResultsSelf,
                ChessResultsSelfFirst,
                ChessResultsAgency,
                ChessResultsTeam,
                SportResultsSelf,
                SportResultsSelfFirst,
                SportResultsAgency,
                SportResultsTeam,
                SlotResultsSelf,
                SlotResultsSelfFirst,
                SlotResultsAgency,
                SlotResultsTeam,
                LotteryResultsSelf,
                LotteryResultsSelfFirst,
                LotteryResultsAgency,
                LotteryResultsTeam,
                FishResultsSelf,
                FishResultsSelfFirst,
                FishResultsAgency,
                FishResultsTeam
            } = total;
            let item = {
                userName: '总计',
                nameType: '-',
                agencyName: '-',
                ResultsSelfAll,
                ResultsFirstAll,
                ResultsAgencyAll,
                ResultsTeamAll,
                LiveResultsSelf,
                LiveResultsSelfFirst,
                LiveResultsAgency,
                LiveResultsTeam,
                ChessResultsSelf,
                ChessResultsSelfFirst,
                ChessResultsAgency,
                ChessResultsTeam,
                SportResultsSelf,
                SportResultsSelfFirst,
                SportResultsAgency,
                SportResultsTeam,
                SlotResultsSelf,
                SlotResultsSelfFirst,
                SlotResultsAgency,
                SlotResultsTeam,
                LotteryResultsSelf,
                LotteryResultsSelfFirst,
                LotteryResultsAgency,
                LotteryResultsTeam,
                FishResultsSelf,
                FishResultsSelfFirst,
                FishResultsAgency,
                FishResultsTeam
            };
            return item;
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
            this.getData(data);
        },
        exportExcel() {
            this.exportPage = [];
            let data = {
                ...this.searchKey,
                startTime: this.$root.formatTimeS(this.Time[0]),
                endTime: this.$root.formatnightTimeS(this.Time[1])
            };
            if (data.name) data.name = this.$root.trimAll(data.name);
            if (!data.name) delete data.name;
            if (data.name && !this.$root.validateName(data.name)) {
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
                //   console.log(data)
                delete data.page;
                reportsAgencyModeC(data)
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
        // //分批导出数据
        // batchExport(index) {
        // 	let data = { ...this.searchKey };
        // 	if (data.name) data.name = this.$root.trimAll(data.name);
        // 	if (!data.name) delete data.name;
        // 	if (data.name && !this.$root.validateName(data.name)) {
        // 		this.$Tip.info({ content: "您所查询的用户名不正确，请重新输入" });
        // 		return false;
        // 	}
        // 	let { startTime, endTime } = data;
        // 	if (startTime == "Invalid date" || endTime == "Invalid date") {
        // 		this.$Tip.info({ content: "请输入开始和结束时间" });
        // 		return false;
        // 	}
        // 	if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
        // 		this.$Tip.info({ content: "结束时间必须大于开始时间" });
        // 		return false;
        // 	}
        // 	this.searchKey.startTime = data.startTime;
        // 	this.searchKey.endTime = data.endTime;
        // 	data.isExport = 1;
        // 	data.export_page = index;
        // 	if (10000 + index > this.table.total)
        // 		data.export_limit = this.table.total - (10000 * (index - 1) + 1);
        // 	else data.export_limit = "10000";
        // 	this.$root.startEditLoading();
        //   let openr = window.open();

        // 	reportsAgencyModeC({ params: data })
        // 		.then(res => {
        // 			if (res.code == 200) {
        // 				this.exportPage[index - 1].status = "yes";
        // 				let region = res.data.downloadUrl;
        // 				let nowHost = region.split(".com")[1];
        // 				let openr1 = openr ? openr : window;
        // 				openr1.location.href = nowHost;
        // 			} else {
        // 				openr.close();
        // 			}
        // 			this.$root.endEditLoading();
        // 		})
        // 		.catch(error => this.$root.endEditLoading());
        // },
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
            this.page == 1 ? this.getData(data) : this.getData({ params: data, query: { page: 1 } });
        },
        startChange(time, type) {
            this.btnName = checkDayBtn(this.Time, 'cn', this);
        },
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
            const { startTime, endTime } = this.searchKey;
            if (this.searchKey.sortKey) delete this.searchKey.sortKey;
            if (this.searchKey.sortVal) delete this.searchKey.sortVal;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            this.Time[0] = startTime;
            this.Time[1] = endTime;
            let data = { ...this.searchKey };
            this.getData(data);
        },
        onPageChange(page) {
            this.searchKey.page = page;
            let data = { ...this.searchKey };
            this.getData(data);
            // this.getData();
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };
            this.getData(data);
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
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
.spanBtn {
    line-height: 36px;
    margin-bottom: 10px;
    display: block;
    border-bottom: 1px solid #dcdcdc;
}
.active {
    border: 1px solid #2d8cf0;
    border-bottom: 0 !important;
    color: #2d8cf0 !important;
    box-sizing: border-box;
}
</style>
