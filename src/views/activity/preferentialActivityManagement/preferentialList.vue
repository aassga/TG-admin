<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem v-for="(t, i) in btnList" :key="'btn' + i">
                    <Button class="fontColor" :class="currentBtn == t ? 'bd-bg' : 'bg-or'" @click.prevent="changeBtn(t)">{{ t }}</Button>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker placeholder="开始日期" class="w120x" @on-change="startChange" v-model="Time[0]" :options="options3"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker placeholder="结束日期" class="w120x" @on-change="startChange" v-model="Time[1]" :options="options3"></DatePicker>
                </FormItem>
                <FormItem label="状态">
                    <Select class="s-80" placeholder="全部" v-model="searchKey.status" clearable>
                        <Option v-for="(t, i) in cList" :key="'btn' + i" :value="t.value">{{ t.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem style="margin-right:0;margin-top:-1px !important">
                    <Checkbox v-model="searchKey.isLike">
                        <span>模糊</span>
                    </Checkbox>
                </FormItem>
                <FormItem label="会员账号">
                    <Input class="w160x" :placeholder="searchKey.isLike ? '单个可模糊搜索' : '多个请以,逗号隔开'" v-model="searchKey.username" @keyup.enter.native="searchSubmit" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
                    <Poptip trigger="hover" placement="bottom">
                        <div slot="content">
                            <div>1.实际存款打码倍数=打码量/（其它存款+优惠存款）</div>
                            <div>
                                2.优惠存款打码倍数
                                <div class="pl10">（1）不勾选时：优惠存款打码倍数=打码量/优惠存款</div>
                                <div class="pl10">（2）勾选时：优惠存款打码倍数=打码量/（优惠存款+初始余额）</div>
                            </div>
                            <div>3.优惠金额=优惠存款*优惠比例</div>
                            <div>4.发放：一天统计一次，每天0点开始统计昨日数据，每晚1点后可手动进行发放，如没有手动发放，每天下午5点系统自动发放优惠</div>
                        </div>
                        <Icons type="bangzhutishi" :size="20" class="pl5" color="#E4E4E4"></Icons>
                    </Poptip>
                </FormItem>
                <FormItem v-show="isSend && (adminType == 'super' || authInPage.indexOf('sendDepositPreferential') != -1)">
                    <Button type="primary" @click.prevent="sendAll" :loading="$root.editBtnLoading">一键发放</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :value="table.data"
                :columns="isSend ? table.columns : table._columns"
                :total="table.total"
                :loading="$root.tableLoading"
                :rowClassName="selfRow"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-selection-change="onSelectionChange"
                @on-sort-change="onSortChange"
            />
        </div>
    </div>
</template>
<script>
import Tables from '_c/tables';
import Icons from '_c/icons';
import { checkDayBtn, getUserType } from '@/libs/util';
import { depositPreferentialList, sendDepositPreferential, changeDepositPreferentialStatus } from '@/api/activity';
import { mapActions } from 'vuex';
export default {
    name: 'preferentialList',
    components: {
        Tables,
        Icons
    },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            btnList: ['今天', '昨天', '本月', '上月'],
            currentBtn: '今天',
            isSend: false,
            page: 1,
            searchKey: {
                siteId: this.$root.nowSite.id,
                startTime: this.$root.todayStartTime(),
                endTime: this.$root.todayEndTime(),
                status: '',
                isLike: false,
                username: ''
            },
            cList: [
                { name: '正常', value: 'yes' },
                { name: '已取消', value: 'no' },
                { name: '已发放', value: 'issued' },
                { name: '已过期', value: 'expire' }
            ],
            options3: {
                disabledDate: date => {
                    return date && date.valueOf() > new Date(this.$root.yesterdayEndTime()).getTime();
                }
            },
            checkedArr: [],
            Time: [this.$root.todayStartTime(), this.$root.todayEndTime()],
            table: {
                data: [],
                _data: [],
                total: 0,
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '会员账号',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '初始余额',
                        align: 'center',
                        key: 'init_amount',
                        sortable: 'custom'
                    },
                    {
                        title: '其它存款',
                        key: 'other_deposit',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{`${params.row.other_deposit}/${params.row.other_deposit_count}笔`}</span>
                    },
                    {
                        title: '优惠存款',
                        key: 'preferential_deposit',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{`${params.row.preferential_deposit}/${params.row.prefer_deposit_count}笔`}</span>
                    },
                    {
                        title: '取款金额',
                        key: 'withdrawal_amount',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{`${params.row.withdrawal_amount}/${params.row.withdrawal_amount_count}笔`}</span>
                    },
                    {
                        title: '打码量',
                        key: 'code_amount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '实际存款打码',
                        key: 'real_code_multiples',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{params.row.real_code_multiples + '倍'}</span>
                    },
                    {
                        title: '优惠存款打码',
                        key: 'prefer_code_multiples',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{params.row.prefer_code_multiples + '倍'}</span>
                    },
                    {
                        title: '优惠比例',
                        key: 'prefer_proportion',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{params.row.prefer_proportion + '%'}</span>
                    },
                    {
                        title: '优惠金额',
                        key: 'prefer_amount',
                        align: 'center',
                        sortable: 'custom'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            const { status } = params.row;
                            let color = status == 'no' || status == 'expire' ? '#FF2626' : '';
                            let msg = status == 'yes' ? '正常' : status == 'no' ? '已取消' : status == 'issued' ? '已发放' : '已过期';
                            return <span style={{ color }}>{msg}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => (
                            <div>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display: params.row.status == 'yes' ? 'inline-block' : 'none'
                                    }}
                                    onClick={() => {
                                        let data = {
                                            id: params.row.id,
                                            siteId: this.$root.nowSite.id,
                                            status: 'no'
                                        };
                                        this.$Tip.confirm({
                                            content: '您确定取消此会员的优惠发放吗？',
                                            onOk: () => {
                                                changeDepositPreferentialStatus(data, true).then(res => {
                                                    if (res != undefined && res.code == 200) {
                                                        this.$Message.success('优惠发放取消成功');
                                                        this.table.data.forEach(t => {
                                                            if (t.id == params.row.id) {
                                                                t.status = 'no';
                                                                t._disabled = true;
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }}
                                >
                                    取消发放
                                </a>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display: params.row.status == 'no' ? 'inline-block' : 'none'
                                    }}
                                    onClick={() => {
                                        let data = {
                                            id: params.row.id,
                                            siteId: this.$root.nowSite.id,
                                            status: 'yes'
                                        };
                                        this.$Tip.info({
                                            content: '您确定恢复此会员的发放吗？',
                                            onOk: () => {
                                                changeDepositPreferentialStatus(data, true).then(res => {
                                                    if (res != undefined && res.code == 200) {
                                                        this.$Message.success('优惠发放恢复成功');
                                                        this.table.data.forEach(t => {
                                                            if (t.id == params.row.id) {
                                                                t.status = 'yes';
                                                                t._disabled = false;
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }}
                                >
                                    恢复发放
                                </a>
                            </div>
                        )
                    }
                ],
                _columns: [
                    {
                        align: 'center',
                        width: 70,
                        title: '已勾选',
                        render: (h, params) => <span>{params.row.check == 'yes' ? '√' : '-'}</span>
                    },
                    {
                        title: '会员账号',
                        key: 'username',
                        align: 'center'
                    },
                    {
                        title: '初始余额',
                        align: 'center',
                        sortable: 'custom',
                        key: 'init_amount'
                    },
                    {
                        title: '其它存款',
                        key: 'other_deposit',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{`${params.row.other_deposit}/${params.row.other_deposit_count}笔`}</span>
                    },
                    {
                        title: '优惠存款',
                        key: 'preferential_deposit',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{`${params.row.preferential_deposit}/${params.row.prefer_deposit_count}笔`}</span>
                    },
                    {
                        title: '取款金额',
                        key: 'withdrawal_amount',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{`${params.row.withdrawal_amount}/${params.row.withdrawal_amount_count}笔`}</span>
                    },
                    {
                        title: '打码量',
                        key: 'code_amount',
                        sortable: 'custom',
                        align: 'center'
                    },
                    {
                        title: '实际存款打码',
                        key: 'real_code_multiples',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{params.row.real_code_multiples + '倍'}</span>
                    },
                    {
                        title: '优惠存款打码',
                        key: 'prefer_code_multiples',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{params.row.check == 'yes' ? `${params.row.new_prefer_code_multiples}倍` : `${params.row.prefer_code_multiples}倍`}</span>
                    },
                    {
                        title: '优惠比例',
                        key: 'prefer_proportion',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => <span>{params.row.check == 'yes' ? `${params.row.new_prefer_proportion}%` : `${params.row.prefer_proportion}%`}</span>
                    },
                    {
                        title: '优惠金额',
                        key: 'prefer_amount',
                        sortable: 'custom',
                        align: 'center',
                        render: (h, params) => <span>{params.row.check == 'yes' ? params.row.new_prefer_amount : params.row.prefer_amount}</span>
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        render: (h, params) => {
                            const { status } = params.row;
                            let color = status == 'no' || status == 'expire' ? '#FF2626' : '';
                            let msg = status == 'yes' ? '正常' : status == 'no' ? '已取消' : status == 'issued' ? '已发放' : '已过期';
                            return <span style={{ color }}>{msg}</span>;
                        }
                    },
                    {
                        title: '发放日期',
                        key: 'send_time',
                        align: 'center',
                        render: (h, params) => <span>{this.$root.returnDayTime(params.row.send_time)}</span>
                    }
                ]
            }
        };
    },
    watch: {
        'table.data': {
            handler(val) {
                val.forEach((t, i) => {
                    let _data1 = this.table._data[i].prefer_code_multiples;
                    let _data2 = this.table._data[i].prefer_proportion;
                    let _data3 = this.table._data[i].prefer_amount;
                    if (t._checked) {
                        t.prefer_code_multiples = t.new_prefer_code_multiples;
                        t.prefer_proportion = t.new_prefer_proportion;
                        t.prefer_amount = t.new_prefer_amount;
                    } else {
                        t.prefer_code_multiples = _data1;
                        t.prefer_proportion = _data2;
                        t.prefer_amount = _data3;
                    }
                });
            },
            deep: true
        },
        isSend: {
            handler(val) {
                if (val) {
                    this.cList = [
                        { name: '正常', value: 'yes' },
                        { name: '已取消', value: 'no' }
                        // { name: "已发放", value: "issued" },
                        // { name: "已过期", value: "expire" }
                    ];
                } else {
                    this.cList = [
                        // { name: "已取消", value: "no" },
                        { name: '已发放', value: 'issued' },
                        { name: '已过期', value: 'expire' }
                    ];
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.changeBtn('今天');
    },
    methods: {
        ...mapActions(['getNewRoute']),
        onSortChange({ column, key, order }) {
            delete this.searchKey.key;
            delete this.searchKey.sort;
            let data = { ...this.searchKey, sort: order, key };
            this.searchKey.key = key;
            if (data.sort == 'normal') {
                if (this.currentBtn == '今天') {
                    this.table.columns.forEach(t => {
                        if (t.key == column.key) this.$set(t, 'sortType', 'asc');
                    });
                } else {
                    this.table._columns.forEach(t => {
                        if (t.key == column.key) this.$set(t, 'sortType', 'asc');
                    });
                }
                this.searchKey.sort = 'asc';
                data.sort = 'asc';
            } else {
                this.searchKey.sort = order;
                if (this.currentBtn == '今天') this.table.columns.forEach(t => delete t.sortType);
                else this.table._columns.forEach(t => delete t.sortType);
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
        },
        onSelectionChange(selection) {
            this.checkedArr = selection;
            let ids = [];
            selection.forEach(t => ids.push(t.id));
            this.table.data.forEach(t => {
                this.$set(t, '_checked', ids.includes(t.id));
            });
        },
        selfRow(row, index) {
            if (Number(row.real_code_multiples) >= 10) return 'red-row';
            else return '';
        },
        getData(postData) {
            this.$root.startTableLoading();
            postData.params.isLike = Number(postData.params.isLike);
            for (let key in postData.params) {
                if (!postData.params[key]) delete postData.params[key];
            }
            depositPreferentialList(postData)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let { data, total } = res.data;
                        this.table.data = data;
                        this.table.data.forEach(t => {
                            if (t.check == 'no' && t.status == 'yes') {
                                this.$set(t, '_disabled', false);
                                this.$set(t, '_checked', false);
                            }
                            if (t.check == 'no' && t.status == 'no') this.$set(t, '_disabled', true);
                        });
                        this.table._data = JSON.parse(JSON.stringify(this.table.data));
                        this.table.total = total;
                        // 开始时间在今天之后 并且状态为正常或已取消
                        let statusList = [];
                        this.table.data.forEach(t => statusList.push(t.status));
                        let { endTime } = postData.params;
                        if (this.currentBtn == '今天' && (statusList.includes('yes') || statusList.includes('no'))) this.isSend = true;
                        else this.isSend = false;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        startChange(time, type) {
            this.currentBtn = checkDayBtn(this.Time, 'cn', this);
            if (this.currentBtn == '今天') {
                this.table.columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
            } else {
                this.table._columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
            }
        },
        changeBtn(name) {
            if (this.page != 1) this.$refs.table.setPage();
            this.currentBtn = name;
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
            if (this.searchKey.key) delete this.searchKey.key;
            if (this.searchKey.sort) delete this.searchKey.sort;
            if (this.currentBtn == '今天') {
                this.table.columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
            } else {
                this.table._columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
            }
            this.Time[0] = startTime;
            this.Time[1] = endTime;
            let data = { ...this.searchKey };
            this.getData({ params: data });
        },
        sendAll() {
            this.$root.startEditLoading();
            let ids = [];
            this.checkedArr.forEach(t => {
                ids.push(t.uid);
            });
            let data = {
                siteId: this.$root.nowSite.id,
                uids: ids.join(',')
            };
            if (!data.uids || data.uids == undefined) delete data.uids;
            sendDepositPreferential(data, true)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        this.$Message.success('一键发放成功');
                        this.searchSubmit();
                        // this.getNewRoute(this)
                    }
                    this.$root.endEditLoading();
                })
                .catch(error => this.$root.endEditLoading());
        },
        searchSubmit() {
            this.$refs.table.setPage();
            let ids = [];
            this.checkedArr.forEach(t => ids.push(t.id));
            this.table.data.forEach(t => {
                this.$set(t, '_checked', ids.includes(t.id));
            });
            let { key, sort } = this.searchKey;
            if (key) delete this.searchKey.key;
            if (sort) delete this.searchKey.sort;
            if (this.currentBtn == '今天') {
                this.table.columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
            } else {
                this.table._columns.forEach(t => {
                    if (t.sortable == 'custom') this.$set(t, 'sortType', '');
                });
            }
            let data = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.Time;
                data.startTime = startTime && this.$root.formatTimeS(startTime);
                data.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else return false;
            if (!data.username) delete data.isLike;
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (data.username) data.username = this.$root.trimAll(data.username);
            if (data.isLike) {
                let reg = /^[a-zA-Z0-9-_]{1,20}$/;
                if (data.username && !reg.test(data.username)) {
                    this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                    return false;
                }
            } else {
                if (data.username && !this.$root.validateName(data.username)) {
                    this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                    return false;
                }
            }
            this.searchKey.startTime = data.startTime;
            this.searchKey.endTime = data.endTime;
            this.getData({ params: data });
        },
        onPageChange(page) {
            this.page = page;
            let params = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.Time;
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else return false;
            if (!params.username) delete params.isLike;
            if (params.username) params.username = this.$root.trimAll(params.username);
            if (params.username && !this.$root.validateName(params.username)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let params = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (!params.username) delete params.isLike;

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.username) params.username = this.$root.trimAll(params.username);
            if (params.username && !this.$root.validateName(params.username)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params });
        }
    }
};
</script>
<style lang="less" scoped>
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
/deep/.ivu-table .red-row td {
    background-color: #ffecf6 !important;
    color: #fff;
}
.ivu-checkbox-wrapper {
    margin-right: 0;
    span {
        margin-right: 0;
    }
}
</style>