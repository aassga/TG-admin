<template>
    <div>
        <div class="v2-search" style="margin-bottom:24px">
            <Form inline>
                <FormItem v-for="(t, i) in btnList" :key="i">
                    <Button class="ivu-btn commonButton ft16" @click.prevent="chart(t)" :class="btnName == t.name ? 'bd-bg' : 'bg-or'">{{ t.name }}</Button>
                </FormItem>
                <Button class="ml20 ivu-btn redPackButton" style="border-radius:30px;">
                    <Icons class="pl10" type="dengji"></Icons>
                    <span class="pr10 pl5" @click.prevent="levelTableShow()">等级对照表</span>
                </Button>
                <div class="fr ft16">
                    <span class="ml10">
                        活动总额：
                        <span class="ml5 green-font">{{ totalData.all_gift_money }}</span>
                    </span>
                    <span class="ml10">
                        活动余额：
                        <span class="ml5 red-font">{{ totalData.last_gift_money }}</span>
                    </span>
                    <span class="ml10">
                        剩余天数：
                        <span class="ml5">{{ totalData.last_day }}</span>
                    </span>
                </div>
            </Form>
        </div>
        <div class="v2-search">
            <Form inline ref="searchKey">
                <FormItem v-if="checkedArr.length > 0">
                    <Button type="primary" v-if="checkedArr.length > 0 || this.btnName == '资格表'" @click.prevent="cancelStatys('allCancel', 'no')">取消资格</Button>
                </FormItem>
                <FormItem v-if="checkedArr.length > 0">
                    <Button type="primary" v-if="checkedArr.length > 0 || this.btnName == '资格表'" @click.prevent="cancelStatys('allCancel', 'yes')">添加资格</Button>
                </FormItem>
                <FormItem label="发放日期">
                    <!-- clearable -->
                    <Select @on-change="changeDate" v-model="searchKey.date">
                        <Option v-for="(t, i) in this.redPacketList" :disabled="t > todayDate" :key="i" :value="t">{{ t }}</Option>
                    </Select>
                </FormItem>

                <FormItem label="活动等级" class="hddj">
                    <Select
                        class="s-90"
                        @on-change="
                            val => {
                                this.level = val;
                            }
                        "
                        v-model="searchKey.level"
                        placeholder="全部"
                        clearable
                    >
                        <Option v-for="(t, i) in this.gradeList" :key="i + 1" :value="t.value">{{ t.name }}级</Option>
                    </Select>
                </FormItem>

                <FormItem label="资格状态" v-if="btnName == '资格表'">
                    <Select class="s-90" v-model="searchKey.requirement_status" placeholder="全部" clearable>
                        <Option value="yes">已获取</Option>
                        <Option value="no">未获取</Option>
                    </Select>
                </FormItem>
                <FormItem label="会员账号">
                    <Input placeholder="可依首字母查询" v-model="searchKey.userName" class="w120x" clearable />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                editable
                ref="table"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                :more="table.more"
                @on-selection-change="onSelectionChange"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="sortChange"
                :pageSizeOpts="table.pageSizeOpts"
            >
                <div class="clearfix v2-footer" slot="more" v-if="btnName == '发放表'">
                    <span class="ml20">
                        本日发放：
                        <span class="ml10">{{ totalData.gift_money }}/{{ totalData.gift_money_user }}人</span>
                    </span>
                    <span class="ml20">
                        设置金额：
                        <span class="ml10">
                            <span class="red-font">{{ totalData.setting_gift_money }}</span>
                            /{{ totalData.setting_gift_money_user }}人
                        </span>
                    </span>
                    <span class="ml20">
                        已领取：
                        <span class="ml10">
                            <span class="green-font">{{ totalData.gift_money_receive_yes }}</span>
                            /{{ totalData.gift_money_receive_yes_user }}人
                        </span>
                    </span>
                    <span class="ml20">
                        未领取：
                        <span class="ml10">
                            <span class="green-font">{{ totalData.gift_money_receive_no }}</span>
                            /{{ totalData.gift_money_receive_mo_user }}人
                        </span>
                    </span>
                </div>
                <div class="clearfix v2-footer" slot="more" v-else>
                    <span class="ml20">
                        本日计划：
                        <span class="ml10">{{ totalData.today_lian && Number(totalData.today_lian).toFixed(2) }}</span>
                    </span>
                    <span class="ml20">
                        达标人数：
                        <span class="ml10">{{ totalData.standard_user }}人</span>
                    </span>
                    <span class="ml20">
                        已获资格：
                        <span class="ml10">{{ totalData.requirement_status_yes }}人</span>
                    </span>
                </div>
            </Tables>
        </div>
        <Modals title="设置金额" ref="setAmount" :width="600">
            <div slot="content">
                <Form ref="formKey" :label-width="20" class="ft14 ml65" :model="formKey" :rules="rules">
                    <FormItem class="mt5 mr10 iconColor">
                        会员账号：
                        <span style="color:black">{{ setData.userName }}</span>
                    </FormItem>
                    <FormItem class="mt5 mr10 iconColor">
                        历史存款：
                        <span style="color:black">{{ setData.pay_money }}</span>
                    </FormItem>
                    <FormItem class="mt5 mr10 iconColor">
                        历史打码：
                        <span style="color:black">{{ setData.bet_money }}</span>
                    </FormItem>
                    <FormItem class="mt5 mr10 iconColor">
                        昨日打码：
                        <span style="color:black">{{ setData.yesterday_bet_money }}</span>
                    </FormItem>
                    <FormItem class="mt5 mr20 iconColor">
                        活动等级:
                        <span style="color:black">{{ setData.level }}</span>
                        <span class="ml10">(单人最低:{{ setData.min }} 单人最高：{{ setData.max }})</span>
                    </FormItem>
                    <FormItem class="mt5 mr10 iconColor" prop="money">
                        <span class="red-font ml10f">*</span>
                        发放金额：
                        <Input class="w100x" v-model="formKey.money" />
                        <span class="ml10">(可输入任意金额调整)</span>
                    </FormItem>
                    <FormItem class="mt20 mb20 ml50">
                        <Button type="primary" class="ivu submit" @click.prevent="save">确定</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
        <Modals title="等级对照表" ref="levelChat" :width="897">
            <div slot="content" class="modal-overflow ml40 mr40">
                <div class="v2-footer mb10 ft14" style="height:51px;line-height:51px">
                    <span class="ml20 mr10">日期：{{ this.searchKey.date }}</span>
                    <span class="ml10 mr10">
                        本日计划：
                        {{ totalLevelData.today_plan && Number(totalLevelData.today_plan).toFixed(2) }}
                    </span>
                    <span class="ml10 mr10" v-if="btnName == '发放表'">发放人数：{{ totalLevelData.send_user }}</span>
                    <span class="ml10 mr10" v-if="btnName == '资格表'">达标人数：{{ totalLevelData.send_user }}</span>
                    <span class="ml10 mr10">活动余额：{{ totalLevelData.last_gift_money }}</span>
                    <span class="ml10 mr10">剩余天数：{{ totalLevelData.last_day }}</span>
                </div>
                <div class="v2-table" style="height:500px;overflow-y: auto;">
                    <Tables
                        editable
                        ref="tables"
                        :showSizer="false"
                        :page="false"
                        :columns="tableData.columns"
                        :loading="$root.tableLoading"
                        :value="tableData.data"
                        :total="tableData.total"
                    ></Tables>
                </div>
                <P class="ft14 red-font">注：存款条件，打码条件是用会员从2019年8月1日至当前日期存款和打码总量进行匹配</P>
                <div class="mt10 mb20 txt-a">
                    <Button class="ivu dayButton ft19" type="primary" :disabled="reduceType" @click="reduceY()"> <Icons class="pr10" type="zuofanye" />前一天 </Button>
                    <Button class="ivu dayButton ml40 ft19" @click="addT()" type="primary" :disabled="disabled">
                        后一天
                        <Icons class="pl10" type="youfanye" />
                    </Button>
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Icons from '@/components/icons';
import Modals from '@/components/modals';
import { redPacketList, redPacketGetSelect, redPacketSetMoney, redPacketCheckTable, redPacketUpStatus } from '@/api/activity';
export default {
    name: 'redPacket',
    components: {
        Tables,
        Icons,
        Modals
    },
    data() {
        return {
            changeNumber: 1,
            itemName: '',
            gitMax: '',
            gitMin: '',
            reduceType: false,
            message: '1',
            yesList: [],
            formKey: { money: '' },
            setData: {},
            checkedArr: [],
            disabled: false,
            totalLevelData: [],
            btnName: '发放表',
            btnList: [
                { name: '发放表', val: '1' },
                { name: '资格表', val: '2' }
            ],
            page: '1',
            pageSize: '',
            todayDate: '',
            redPacketList: [],
            searchKey: {
                siteId: this.$root.nowSite.id,
                date: this.$root.formatTime(new Date()),
                level: 'all',
                sort: 'default',
                sortval: 'desc',
                table: '1',
                data_type: '1',
                active_type: 'red_packet',
                requirement_status: 'all'
            },
            totalData: {},
            gradeList: [],
            rules: {
                money: [
                    {
                        required: true,
                        message: '请输入奖金金额',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^(0|[1-9]\d*)(\.\d{1,2})?/,
                        message: '只支持数字',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        validator: (rule, val, cb) => {
                            if (+this.gitMin <= val && +val <= this.gitMax) {
                                cb();
                            } else {
                                cb(new RangeError('须大于单人最低小于单人最高'));
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            tableData: {
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                columns: [
                    {
                        title: '等级',
                        align: 'center',
                        key: 'level'
                    },
                    {
                        title: '存款条件',
                        align: 'center',
                        key: 'pay_money'
                    },
                    {
                        title: '打码条件',
                        align: 'center',
                        key: 'bet_money'
                    },
                    {
                        title: '发放人数',
                        align: 'center',
                        key: 'accord_count'
                    },
                    {
                        title: '发放总额',
                        align: 'center',
                        key: 'gift_money_total'
                    },
                    {
                        title: '单人均值',
                        align: 'center',
                        key: 'gift_money_average'
                    },
                    {
                        title: '单人最低',
                        align: 'center',
                        key: 'gift_money_min',
                        render: (h, params) => {
                            return <span>{params.row.gift_money_min}</span>;
                        }
                    },
                    {
                        title: '单人最高',
                        align: 'center',
                        key: 'gift_money_max',
                        render: (h, params) => {
                            return <span>{params.row.gift_money_max}</span>;
                        }
                    }
                ]
            },
            table: {
                more: true,
                total: 0,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                columns: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '会员账号',
                        align: 'center',
                        key: 'userName'
                    },
                    {
                        title: '历史存款',
                        align: 'center',
                        key: 'pay_money',
                        sortable: 'custom'
                    },
                    {
                        title: '历史打码',
                        align: 'center',
                        key: 'bet_money'
                    },
                    {
                        title: '昨日打码',
                        align: 'center',
                        key: 'yesterday_bet_money',
                        sortable: 'custom'
                    },
                    {
                        title: '活动等级',
                        align: 'center',
                        key: 'level',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{+params.row.level + `级`}</span>;
                        }
                    },
                    {
                        title: '发放金额',
                        align: 'center',
                        key: 'gift_money',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{params.row.gift_money == '0.00' ? '-' : params.row.gift_money}</span>;
                        }
                    },
                    {
                        title: '领取状态',
                        align: 'center',
                        key: 'requirement_status',
                        sortable: 'custom',
                        render: (h, params) => {
                            const { requirement_status, gift_money_receive } = params.row;
                            // requirement_status 资格状态
                            // gift_money_receive 领取状态
                            let color = requirement_status == 'yes' ? '#239961' : '';
                            let newColor = gift_money_receive == 'yes' ? '#239961' : '';
                            if (this.btnName == '发放表')
                                return <span style={{ newColor }}>{gift_money_receive == 'yes' ? '已领取' : gift_money_receive == 'no' ? '未领取' : '已失效'}</span>;
                            else {
                                return <span style={{ color }}>{requirement_status == 'yes' ? '已获取' : '未获取'}</span>;
                            }
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        key: 'date_time',
                        render: (h, params) => {
                            const { requirement_status, gift_money_receive } = params.row;
                            let color = requirement_status == 'yes' ? '#2d8cf0' : '#ff2626';
                            if (this.btnName == '发放表') {
                                if (gift_money_receive == 'no')
                                    return (
                                        <span
                                            class="blue-font"
                                            onClick={() => {
                                                this.setAmount(params);
                                            }}
                                        >
                                            设置金额
                                        </span>
                                    );
                                else {
                                    return <span>-</span>;
                                }
                            } else {
                                //资格表
                                if (requirement_status == 'yes' && gift_money_receive == 'yes') {
                                    return <span>-</span>;
                                } else {
                                    return (
                                        <span
                                            style={{ color }}
                                            class="cs"
                                            onClick={() => {
                                                this.cancelStatys('oneCancel', params);
                                            }}
                                        >
                                            {requirement_status == 'yes' ? '取消资格' : '添加资格'}
                                        </span>
                                    );
                                }
                            }
                        }
                    }
                ]
            }
        };
    },
    methods: {
        onSelectionChange(selection) {
            this.yesList = [];
            this.changeNumber = 2;
            if (this.page != 1) {
                this.yesList = [];
            }
            this.checkedArr = selection;
            this.checkedArr.forEach(t => {
                if (t.requirement_status == 'yes') {
                    this.yesList.push(t.id);
                } else {
                    this.yesList.push(t.id);
                }
            });
        },
        cancelStatys(type, params) {
            this.changeNumber = 1;
            let text, msg;
            //单个
            if (type == 'oneCancel') {
                const { id, requirement_status } = params.row;
                if (requirement_status === 'yes') {
                    text = `您确定取消用户的发放资格？`;
                    msg = '取消成功';
                }
                if (requirement_status == 'no') {
                    text = `您确定为用户添加发放资格？`;
                    msg = '发放成功';
                }
                const data = {
                    id,
                    status: requirement_status == 'yes' ? 'no' : 'yes',
                    siteId: this.$root.nowSite.id
                };
                this.dataSum = data;
            }
            //批量
            if (type == 'allCancel') {
                if (params === 'no') {
                    text = `您确定取消用户的发放资格？`;
                    msg = '取消成功';
                }
                if (params == 'yes') {
                    text = `您确定为用户添加发放资格？`;
                    msg = '发放成功';
                }
                const data = {
                    status: params,
                    siteId: this.$root.nowSite.id,
                    id: String(this.yesList)
                };
                this.dataSum = data;
            }
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    redPacketUpStatus(this.dataSum, true).then(res => {
                        if (type == 'oneCancel') {
                            this.table.data[params.index].requirement_status = this.table.data[params.index].requirement_status === 'yes' ? 'no' : 'yes';
                            this.$Message.success({ content: msg });
                            this.table.data &&
                                this.table.data.forEach(t => {
                                    if (t.gift_money_receive == 'no') {
                                        this.$set(t, '_disabled', false);
                                    }
                                    if (t.gift_money_receive == 'yes') {
                                        this.$set(t, '_disabled', true);
                                    }
                                });
                        } else {
                            let newData = { ...this.searchKey };
                            if (!newData.level) {
                                newData.level = 'all';
                            }
                            this.getData({ params: newData, query: { page: this.page } });
                        }
                    });
                }
            });
        },

        reduceY() {
            this.disabled = false;
            this.message--;
            const data = {
                ...this.searchKey,
                date: this.$root.yesterdayFullStartTime(this.message)
            };
            if (this.redPacketList[0] < this.$root.yesterdayFullStartTime(this.message) && this.$root.yesterdayFullStartTime(this.message) < this.todayDate) {
                this.reduceType = false;
            } else {
                this.reduceType = true;
            }
            for (let key in data) {
                if (!data[key]) delete data[key];
            }

            this.searchKey.date = data.date;
            this.getLevelChat({ params: data });
        },
        addT() {
            this.message++;
            const data = {
                ...this.searchKey,
                date: this.$root.yesterdayFullStartTime(this.message)
            };
            if (this.$root.yesterdayFullStartTime(this.message) < this.todayDate) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.searchKey.date = data.date;
            this.getLevelChat({ params: data });
        },
        levelTableShow() {
            this.$refs.levelChat.show();
            let newData = { ...this.searchKey };
            for (let key in newData) {
                if (!newData[key]) delete newData[key];
            }

            if (this.btnName == '发放表') {
                newData.data_type = '1';
            } else {
                newData.data_type = '2';
            }
            this.getLevelChat({ params: newData });
            this.disabled = true;
        },
        save() {
            const data = {
                ...this.formKey,
                id: this.setData.id,
                money: this.formKey.money,
                siteId: this.$root.nowSite.id
            };

            this.$refs.formKey.validate(valid => {
                if (valid) {
                    redPacketSetMoney(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success({ content: '设置成功' });
                            let newData = { ...this.searchKey };
                            this.getData({ params: newData });
                            this.$refs.setAmount.hide();
                        }
                    });
                }
            });
        },
        getLevelChat(data) {
            this.$root.startTableLoading();
            redPacketCheckTable(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { list, total } = res.data;
                        this.totalLevelData = total;
                        this.tableData.data = list;
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        setAmount(params) {
            const { id, level } = params.row;
            this.setData = params.row;
            this.gitMax = this.setData.max;
            this.gitMin = this.setData.min;
            this.formKey.money = params.row.gift_money;
            this.$refs.setAmount.spinShow();
            this.$refs.setAmount.show();
            this.$refs.setAmount.spinHide();
        },
        changeDate(val) {
            this.date = val;
        },
        //切换
        chart(type) {
            this.checkedArr = [];
            const { name, val } = type;
            this.btnName = name;
            this.searchKey.table = val;
            let data = { ...this.searchKey };
            if (!data.level) data.level = 'all';

            let arr = [];
            let sendArr = [];

            if (name == '资格表') {
                data.data_type = '2';
                this.table.columns.forEach(t => {
                    if (t.key != 'gift_money') arr.push(t);
                    if (t.title == '领取状态') t.title = '资格状态';
                });
                let selection = { type: 'selection', align: 'center' };
                if (JSON.stringify(this.table.columns).indexOf('selection') == -1) {
                    if (this.changeNumber == 1) arr.unshift(selection);
                }
                this.table.columns = arr;
                this.getData({ params: data });
            } else {
                data.data_type = '2';
                this.table.columns.forEach(t => {
                    if (t.title == '资格状态') t.title = '领取状态';
                    if (t.type != 'selection') sendArr.push(t);
                    this.table.data.forEach(m => {
                        if (m.key == t.key) {
                            this.itemName = { title: '发放金额', key: 'gift_money', align: 'center' };
                        }
                    });
                });
                sendArr.splice(6, 0, this.itemName);
                this.table.columns = sendArr;
                this.getData({ params: data });
            }
        },
        searchSubmit() {
            let data = { ...this.searchKey };
            if (!data.level) data.level = 'all';
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.$refs.table.setPage();
            this.getData({ params: data });
        },
        onPageSizeChange(pageSize) {
            let data = { ...this.searchKey, limit: pageSize };
            if (!data.level) data.level = 'all';
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        },
        sortChange({ column, key, order }) {
            delete this.searchKey.sort;
            delete this.searchKey.sortval;
            let data = {
                sort: key,
                sortval: order,
                ...this.searchKey
            };
            if (!data.level) data.level = 'all';
            this.searchKey.sort = key;
            if (data.sortval == 'normal') {
                this.table.columns.forEach(item => {
                    if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                });
                this.searchKey.sortval = 'asc';
                data.sortval = 'asc';
            } else {
                this.table.columns.forEach(item => {
                    delete item.sortType;
                });
                this.searchKey.sortval = order;
            }
            this.page == 1 ? '' : this.$refs.table.setPage();
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey };
            if (!data.level) data.level = 'all';
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data, query: { page } });
        },
        getData(data) {
            this.$root.startTableLoading();
            redPacketList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { list, total } = res.data.data;
                    this.totalData = total;
                    this.table.total = res.data.total;
                    this.tableData.data.forEach(t => {
                        list &&
                            list.forEach(m => {
                                if (t.level == m.level) {
                                    m.max = t.gift_money_max;
                                    m.min = t.gift_money_min;
                                }
                            });
                    });
                    this.table.data = list;
                    if (this.btnName == '资格表') {
                        this.table.data.forEach(v => {
                            if (v.gift_money_receive == 'no') {
                                this.$set(v, '_disabled', false);
                                this.$set(v, '_checked', false);
                            }
                            if (v.gift_money_receive == 'yes') this.$set(v, '_disabled', true);
                        });
                    }
                    this.$root.endTableLoading();
                }
            });
        },
        //时间选择列表
        getSelectList(data) {
            redPacketGetSelect(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { red_packet, red_packet_rain } = res.data;
                    this.redPacketList = red_packet.data;
                }
            });
        }
    },
    created() {
        let newData = { ...this.searchKey };
        for (let key in newData) {
            if (!newData[key]) delete newData[key];
        }

        if (this.btnName == '发放表') {
            newData.data_type = '1';
        } else {
            newData.data_type = '2';
        }
        this.getLevelChat({ params: newData });
        let params = { siteId: this.$root.nowSite.id };
        this.getSelectList({ params });
        for (let i = 1; i < 13; i++) {
            this.gradeList.push({ name: i, value: i });
        }
        const data = { ...this.searchKey };
        this.getData({ params: data });
        if (this.btnName == '发放表') {
            let sendArr = [];
            this.table.columns.forEach(t => {
                if (t.type != 'selection') sendArr.push(t);
            });
            this.table.columns = sendArr;
        }
        this.todayDate = this.$root.formatTime(new Date());
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
</style>