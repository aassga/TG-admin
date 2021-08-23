<template>
    <div>
        <div class="v2-search clearfix">
            <Form ref="searchKey" class="fl" inline>
                <FormItem label="业务类型">
                    <Button class="w160x ib ft14" :class="{ cdColor: arr1.length == 0 }" @click="openSelect">{{ selectText }}</Button>
                </FormItem>

                <FormItem label="开始日期">
                    <DatePicker type="datetime" placeholder="开始日期" v-model="Time[0]" class="s-185" format="yyyy-MM-dd HH:mm:ss"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker type="datetime" placeholder="结束日期" class="s-185" format="yyyy-MM-dd HH:mm:ss" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem label="会员账号">
                    <Input placeholder="请输入会员账号" class="s-195" @keyup.enter.native="searchSubmit" v-model="searchKey.userName" @on-change="checkUserName" :maxlength="20" />
                    <!-- <Button type="primary" class="search mb5" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button> -->
                </FormItem>
                <!-- <FormItem>
                    <Button type="primary" class="ivu-btn export mb5" @click.prevent="exportExcel">导出Excel</Button>
                </FormItem> -->
            </Form>
            <div class="fl">
              <Button type="primary" class="search mb5" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
               <Button type="primary" class="ivu-btn export ml20 mb5" @click.prevent="exportExcel">导出Excel</Button>
            </div>
        </div>
        <Modals ref="dataActive" title="选择导出业务类型" width="840" @closeModal="closeModal">
            <div slot="content">
                <Form ref="detail">
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminate1" :value="depositCheckAll" @click.prevent.native="exportCheckAll1">存款</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="detail.deposit" @on-change="onDeposit">
                            <Checkbox v-for="(item, index) in depositList" :key="index" :label="item.value">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminate2" :value="withdrawalCheckAll" @click.prevent.native="exportCheckAll2">取款</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="detail.withdrawal" @on-change="onWithdrawal">
                            <Checkbox v-for="(item, index) in withdrawalList" :key="index" :label="item.value">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminate3" :value="bonusCheckAll" @click.prevent.native="exportCheckAll3">优惠</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="detail.preferential" @on-change="onPreferential">
                            <Checkbox v-for="(item, index) in bonusList" :key="index" :label="item.value" class="pre">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminate4" :value="commissionCheckAll" @click.prevent.native="exportCheckAll4">佣金</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="detail.commission" @on-change="onCommission">
                            <Checkbox v-for="(item, index) in commissionList" :key="index" v-if="!item.name.includes('hide')" :label="item.value" class="pre">{{
                                item.name
                            }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminate5" :value="otherCheckAll" @click.prevent.native="exportCheckAll5">其他</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="detail.other" @on-change="onOther">
                            <Checkbox v-for="(item, index) in otherList" :key="index" :label="item.value">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem style="margin-left:90px;">
                        <div style="margin-left:55px" class="reset cs" @click.prevent="exportNew">
                            <span class="resetFont">重置</span>
                        </div>
                        <a>
                            <Button type="primary" class="ft20 ivu-btn export-ok ml70" @click.prevent="sumbit">确认</Button>
                        </a>
                    </FormItem>
                </Form>
            </div>
        </Modals>
        <!-- 查询业务类型选择框 -->
        <Modals ref="queryBox" title="选择业务类型" width="840" @closeModal="closeSelect">
            <div slot="content">
                <Form ref="details">
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminates1" :value="depositCheckAlls" @click.prevent.native="selectCheckAll1">存款</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="details.deposit" @on-change="onDeposits">
                            <Checkbox v-for="(item, index) in depositList" :key="index" :label="item.value">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminates2" :value="withdrawalCheckAlls" @click.prevent.native="selectCheckAll2">取款</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="details.withdrawal" @on-change="onWithdrawals">
                            <Checkbox v-for="(item, index) in withdrawalList" :key="index" :label="item.value">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminates3" :value="bonusCheckAlls" @click.prevent.native="selectCheckAll3">优惠</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="details.preferential" @on-change="onPreferentials">
                            <Checkbox v-for="(item, index) in bonusList" :key="index" :label="item.value" class="pre">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminates4" :value="commissionCheckAlls" @click.prevent.native="selectCheckAll4">佣金</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="details.commission" @on-change="onCommissions">
                            <Checkbox v-for="(item, index) in commissionList" :key="index" v-if="!item.name.includes('hide')" :label="item.value" class="pre">{{
                                item.name
                            }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="f6Color ft15">
                        <CheckboxGroup>
                            <Checkbox :indeterminate="indeterminates5" :value="otherCheckAlls" @click.prevent.native="selectCheckAll5">其他</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem class="ml30">
                        <CheckboxGroup v-model="details.other" @on-change="onOthers">
                            <Checkbox v-for="(item, index) in otherList" :key="index" :label="item.value">{{ item.name }}</Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem style="margin-left:90px;">
                        <div style="margin-left:55px" class="reset cs" @click="rest">
                            <span class="resetFont">重置</span>
                        </div>
                        <a>
                            <Button type="primary" class="ft20 ivu-btn export-ok ml70" @click="addType">确认</Button>
                        </a>
                    </FormItem>
                </Form>
            </div>
        </Modals>
        <!-- 导出样式更改 -->
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
                    @click="batchExportIndex(t.index + 1)"
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
        <div class="v2-table">
            <Tables
                ref="tables"
                editable
                :columns="table.columns"
                :loading="$root.tableLoading"
                :pageSizeOpts="table.pageSizeOpts"
                :value="table.data"
                :total="table.total"
                :showSizer="true"
                @on-page-size-change="onPageSizeChange"
                @on-page-change="onPageChange"
                :more="table.more"
            ></Tables>
        </div>
        <summaryDataShow ref="sum" v-show="table.data?flag:isShow"></summaryDataShow>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Modals from '@/components/modals';
import Icons from '@/components/icons';
import SiteSelect from './components/site-select';
import summaryDataShow from './components/summaryDataShow';
import { financeSummaryData, financeType } from '@/api/finance';
import { isEmptyObject } from '@/libs/util';
export default {
    name: 'financeSummary',
    components: {
        Tables,
        Modals,
        summaryDataShow,
        Icons,
        SiteSelect
    },
    data() {
        return {
            isShow:true,
            indeterminates1: false, //选择框多选状态
            indeterminates2: false, //选择框多选状态
            indeterminates3: false, //选择框多选状态
            indeterminates4: false, //选择框多选状态
            indeterminates5: false, //选择框多选状态
            depositCheckAlls: false, //选择框全选状态
            withdrawalCheckAlls: false, //选择框全选状态
            bonusCheckAlls: false, //选择框全选状态
            commissionCheckAlls: false, //选择框全选状态
            otherCheckAlls: false, //选择框全选状态
            depositCounts: [], //查询存款
            withdrawalCounts: [], //查询取款
            bonusCounts: [], //查询优惠
            commissionCounts: [], //查询佣金
            otherCounts: [], //查询其他
            isRest: false,
            selectText: '请选择业务类型',
            indeterminate1: false, //导出框多选状态
            indeterminate2: false, //导出框多选状态
            indeterminate3: false, //导出框多选状态
            indeterminate4: false, //导出框多选状态
            indeterminate5: false, //导出框多选状态
            depositCheckAll: false, //导出框全选状态
            withdrawalCheckAll: false, //导出框全选状态
            bonusCheckAll: false, //导出框全选状态
            commissionCheckAll: false, //导出框全选状态
            otherCheckAll: false, //导出框全选状态
            newVal: '',
            subTypeList: [],
            exportPage: [],
            index: 0,
            screen: screen.width,
            arr1: [],
            type: [],
            depositList: [], //存款列表
            withdrawalList: [], //取款列表
            bonusList: [], //优惠列表
            commissionList: [], //佣金列表
            otherList: [], //其他列表
            deposit: '', //存款
            withdrawal: '', //取款
            bonus: '', //优惠
            other: '', //其他
            depositCount: [], //存款
            withdrawalCount: [], //取款
            bonusCount: [], //优惠
            commissionCount: [], //佣金
            otherCount: [], //其他
            flag: false,
            limit: 20,
            pageSizeOpts: [20, 30, 40, 50],
            tableData: {}, // 下方表格的统计数据
            listData: {},
            typeList: [], //业务类型下拉框
            searchKey: {
                type: '',
                userName: '',
                subType: '',
                siteId: this.$root.nowSite.id
            },
            Time: [this.$root.startTime(), this.$root.midnight()],
            pageSize: 20,
            height: 286,
            totaldata: null,
            table: {
                total: 0,
                loading: true,
                data: [],
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '业务类型',
                        key: 'type',
                        align: 'center',
                        minWidth: 60,
                        tooltip: true
                    },
                    {
                        title: '变更类型',
                        key: 'subType',
                        align: 'center',
                        minWidth: 80,
                        tooltip: true
                    },
                    {
                        title: '变更金额',
                        key: 'money',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.money)}</span>
                    },
                    {
                        title: '变更前余额',
                        key: 'beforMoney',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.beforMoney)}</span>
                    },
                    {
                        title: '变更后余额',
                        key: 'afterMoney',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => <span>{this.$root.keepTwo(params.row.afterMoney)}</span>
                    },
                    {
                        title: '提交时间',
                        key: 'order_created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return <span class="pr5 pl5">{this.$root.unixTime(params.row.order_created_at)}</span>;
                        }
                    },
                    {
                        title: '变更时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return <span class="pr5 pl5">{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '审核者',
                        key: 'created_by',
                        align: 'center',
                        minWidth: 75,
                        tooltip: true,
                        render: (h, params) => {
                            const { created_by } = params.row;
                            if (created_by) return <span>{created_by}</span>;
                            else {
                                return <span>-</span>;
                            }
                        }
                    },
                    {
                        title: '备注',
                        key: 'remarks',
                        align: 'center',
                        minWidth: screen.width < 1600 ? 240 : 360,
                        tooltip: true,
                        className: 'pl20 pr20'
                    }
                ]
            },
            detail: {},
            details: {}
        };
    },
    created() {
        this.$nextTick(() => {
            let data={siteId:this.$root.nowSite.id}
            financeType(data).then(res => {
                res.data.forEach(t => {
                    if (t.name_en == 'commission') {
                        for (let key in t.list) {
                            if (key == 'AgencyWage' || key == 'AgencyShareOutBonus') {
                                if (this.$root.modeName() == 'mode_c') t.list[key] = t.list[key].includes('hide') ? '' : t.list[key] + ':hide';
                            }
                            if (key == 'AgencyCommissionSelf') t.list[key] = this.$root.modeName() == 'mode_c' ? '直推返佣' : '自身返佣';
                            if (key == 'AgencyCommissionUp') t.list[key] = this.$root.modeName() == 'mode_c' ? '级差返佣' : '下级返佣';
                        }
                    }
                });
                this.typeList = res.data;
                this.typeList.forEach(t => {
                    for (let key in t.list) {
                        switch (t.name_cn) {
                            default:
                                '存款';
                                this.depositList.push({ type: 'deposit', value: key, name: t.list[key] });
                                break;
                            case '取款':
                                this.withdrawalList.push({ type: 'withdrawals', value: key, name: t.list[key] });
                                break;
                            case '优惠':
                                this.bonusList.push({ type: 'bonus', value: key, name: t.list[key] });
                                break;
                            case '佣金':
                                this.commissionList.push({ type: 'commission', value: key, name: t.list[key] });
                                break;
                            case '其它':
                                this.otherList.push({ type: 'other', value: key, name: t.list[key] });
                                break;
                        }
                    }
                });
                //this.subTypeList=this.subTypeList.concat(this.depositList,this.withdrawalList,this.bonusList,this.commissionList,this.otherList)
            });
        });
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const { userName, newSearchKey } = vm.$route.params;
            // 刷新状态
            if (newSearchKey == undefined) {
                vm.searchSubmit();
            } else {
                //线上取款(会员帐号)-->到存取总汇
                const { startTime, endTime } = newSearchKey;
                vm.Time = [vm.$root.formatTimeX(startTime), vm.$root.formatnightTimeS(endTime)];
                let data = {
                    ...vm.searchKey,
                    userName,
                    startTime: vm.$root.formatTimeX(startTime),
                    endTime: vm.$root.formatnightTimeS(endTime),
                    purpose: 'statistical'
                };
                vm.searchKey.startTime = vm.$root.formatTimeX(startTime);
                vm.searchKey.endTime = vm.$root.formatnightTimeS(endTime);
                vm.searchKey.userName = userName;
                vm.getData({ params: vm.searchKey });
                //下方表格的数据
                vm.$nextTick(() => {
                    vm.$refs.sum.initData({ params: data });
                });
            }
        });
    },
    watch: {
        'searchKey.type'(val, oldVal) {
            this.newVal = val; //大分类不存在，查所有
        }
    },
    methods: {
        //打开业务类型选择框
        openSelect() {
            this.$refs.queryBox.show();
        },
        //添加业务类型
        addType() {
            this.type = [];
            this.arr1 = [];
            this.searchKey.type = '';
            this.searchKey.subType = '';

            if (this.depositCounts.length > 0) {
                this.type.push('deposit');
                this.arr1.push(...this.depositCounts);
            }
            if (this.withdrawalCounts.length > 0) {
                this.type.push('withdrawals');
                this.arr1.push(...this.withdrawalCounts);
            }
            if (this.commissionCounts.length > 0) {
                this.type.push('commission');
                this.arr1.push(...this.commissionCounts);
            }
            if (this.bonusCounts.length > 0) {
                this.type.push('bonus');
                this.arr1.push(...this.bonusCounts);
            }
            if (this.otherCounts.length > 0) {
                this.type.push('other');
                this.arr1.push(...this.otherCounts);
            }
            if (this.arr1.length < 1) {
                this.searchKey.type = '';
                (this.searchKey.subType = ''), (this.selectText = '请选择业务类型');
                this.$refs.queryBox.hide();
                return false;
            } else {
                this.searchKey.type = String(this.type);
                (this.searchKey.subType = String(this.arr1)), (this.selectText = '已选择' + this.arr1.length + '项业务类型');
                this.$refs.queryBox.hide();
            }
        },
        //查询业务类型重置
        rest() {
            this.details = [];
            this.indeterminates1 = false;
            this.indeterminates2 = false;
            this.indeterminates3 = false;
            this.indeterminates4 = false;
            this.indeterminates5 = false;
            this.depositCheckAlls = false;
            this.withdrawalCheckAlls = false;
            this.bonusCheckAlls = false;
            this.commissionCheckAlls = false;
            this.otherCheckAlls = false;

            this.depositCounts = [];
            this.withdrawalCounts = [];
            this.bonusCounts = [];
            this.commissionCounts = [];
            this.otherCounts = [];
        },
        //获取选中的下标,value
        getIndex(i, name) {
            if (this.searchKey.type) this.index = i;
        },
        //导出
        batchExportIndex(index) {
            this.$root.startEditLoading();
            let params = { ...this.searchKey };
            if (this.$root.effectTime(this.Time)) {
                const [startTime, endTime] = this.$root.effectTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatTimeS(endTime);
            } else {
                return false;
            }
            let { startTime, endTime } = params;
            this.searchKey.startTime = startTime;
            this.searchKey.endTime = endTime;
            const data = {
                type: String(this.type),
                subType: String(this.arr1),
                purpose: 'export',
                siteId: this.$root.nowSite.id,
                startTime: this.searchKey.startTime,
                endTime: this.searchKey.endTime,
                isExport: 1,
                export_page: index,
                export_limit: '10000'
            };

            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            let openr = window.open();
            financeSummaryData({ params: data }, true)
                .then(res => {
                    if (res.code == 200 && res.code != undefined) {
                        this.exportPage[index - 1].status = 'yes';
                        let origin = window.location.origin;
                        let region = res.data;
                        let nowHost = `${origin}${region}`;
                        let openr1 = openr ? openr : window;
                        openr1.location.href = nowHost;
                        this.$refs.exportPageModal.hide();
                    } else {
                        openr.close();
                    }
                    this.$root.endEditLoading();
                })
                .catch(error => this.$root.endTableLoading);
        },
        //导出按钮
        exportExcel() {
            this.detail = [];
            this.exportPage = [];
            this.$refs.dataActive.show();
        },
        //导出框重置功能
        exportNew() {
            this.detail = [];
            //重置全选状态
            this.indeterminate1 = false;
            this.indeterminate2 = false;
            this.indeterminate3 = false;
            this.indeterminate4 = false;
            this.indeterminate5 = false;
            this.depositCheckAll = false;
            this.withdrawalCheckAll = false;
            this.bonusCheckAll = false;
            this.commissionCheckAll = false;
            this.otherCheckAll = false;

            this.exportPage = [];
            this.depositCount = [];
            this.withdrawalCount = [];
            this.bonusCount = [];
            this.commissionCount = [];
            this.otherCount = [];
        },
        //导出框存款 depositCount
        onDeposit(val) {
            this.depositCount = val;
            if (val.length === this.depositList.length) {
                this.indeterminate1 = false;
                this.depositCheckAll = true;
            } else if (val.length > 0) {
                this.indeterminate1 = true;
                this.depositCheckAll = false;
            } else {
                this.indeterminate1 = false;
                this.depositCheckAll = false;
            }
        },
        //导出框取款  withdrawalCount
        onWithdrawal(val) {
            this.withdrawalCount = val;
            if (val.length === this.withdrawalList.length) {
                this.indeterminate2 = false;
                this.withdrawalCheckAll = true;
            } else if (val.length > 0) {
                this.indeterminate2 = true;
                this.withdrawalCheckAll = false;
            } else {
                this.indeterminate2 = false;
                this.withdrawalCheckAll = false;
            }
        },
        // 导出框优惠 bonusCount
        onPreferential(val) {
            this.bonusCount = val;
            if (val.length === this.bonusList.length) {
                this.indeterminate3 = false;
                this.bonusCheckAll = true;
            } else if (val.length > 0) {
                this.indeterminate3 = true;
                this.bonusCheckAll = false;
            } else {
                this.indeterminate3 = false;
                this.bonusCheckAll = false;
            }
        },
        //导出框佣金  commission
        onCommission(val) {
            this.commissionCount = val;
            if (val.length === this.commissionList.length) {
                this.indeterminate4 = false;
                this.commissionCheckAll = true;
            } else if (val.length > 0) {
                this.indeterminate4 = true;
                this.commissionCheckAll = false;
            } else {
                this.indeterminate4 = false;
                this.commissionCheckAll = false;
            }
        },
        // 导出框其他 otherCount
        onOther(val) {
            this.otherCount = val;
            if (val.length === this.otherList.length) {
                this.indeterminate5 = false;
                this.otherCheckAll = true;
            } else if (val.length > 0) {
                this.indeterminate5 = true;
                this.otherCheckAll = false;
            } else {
                this.indeterminate5 = false;
                this.otherCheckAll = false;
            }
        },
        //确认导出
        sumbit() {
            this.type = [];
            this.arr1 = [];

            if (this.depositCount.length > 0) {
                this.type.push('deposit');
                this.arr1.push(...this.depositCount);
            }
            if (this.withdrawalCount.length > 0) {
                this.type.push('withdrawals');
                this.arr1.push(...this.withdrawalCount);
            }
            if (this.commissionCount.length > 0) {
                this.type.push('commission');
                this.arr1.push(...this.commissionCount);
            }
            if (this.bonusCount.length > 0) {
                this.type.push('bonus');
                this.arr1.push(...this.bonusCount);
            }
            if (this.otherCount.length > 0) {
                this.type.push('other');
                this.arr1.push(...this.otherCount);
            }
            if (this.arr1.length < 1) {
                this.$Message.success('请选择导出类型');
                return false;
            } else {
                const data = {
                    type: String(this.type),
                    subType: String(this.arr1),
                    siteId: this.$root.nowSite.id,
                    startTime: this.searchKey.startTime,
                    endTime: this.searchKey.endTime,
                    userName: this.searchKey.userName
                };

                for (let key in data) {
                    if (!data[key]) delete data[key];
                }

                financeSummaryData({ params: data })
                    .then(res => {
                        this.table.total = res.data.total;
                        if (this.table.total > 150000) {
                            let num = this.table.total % 10000 == 0 ? this.table.total / 10000 : Math.floor(this.table.total / 10000) + 1;
                            for (let i = 0; i < num; i++) {
                                this.exportPage.push({ index: i, status: 'no' });
                            }
                            this.$refs.exportPageModal.show();
                            this.$refs.dataActive.hide();
                        } else {
                            this.$refs.dataActive.hide();
                            let params = { ...this.searchKey };
                            if (this.$root.effectTime(this.Time)) {
                                const [startTime, endTime] = this.$root.effectTime(this.Time);
                                params.startTime = startTime && this.$root.formatTimeS(startTime);
                                params.endTime = endTime && this.$root.formatTimeS(endTime);
                            } else {
                                return false;
                            }
                            let { startTime, endTime } = params;
                            this.searchKey.startTime = startTime;
                            this.searchKey.endTime = endTime;
                            const data = {
                                type: String(this.type),
                                subType: String(this.arr1),
                                purpose: 'export',
                                siteId: this.$root.nowSite.id,
                                startTime: this.searchKey.startTime,
                                endTime: this.searchKey.endTime,
                                isExport: 1,
                                userName: this.searchKey.userName
                            };
                            for (let key in data) {
                                if (!data[key]) delete data[key];
                            }
                            //let openr = window.open();
                            financeSummaryData({ params: data }, true,true)
                                .then(res => {
                                    //重置全选状态
                                    this.indeterminate1 = false;
                                    this.indeterminate2 = false;
                                    this.indeterminate3 = false;
                                    this.indeterminate4 = false;
                                    this.indeterminate5 = false;
                                    this.depositCheckAll = false;
                                    this.withdrawalCheckAll = false;
                                    this.bonusCheckAll = false;
                                    this.commissionCheckAll = false;
                                    this.otherCheckAll = false;

                                    if (res.code == 200 && res.code != undefined) {
                                        let openr = window.open();
                                        let origin = window.location.origin;
                                        let region = res.data;
                                        let nowHost = `${origin}${region}`;
                                        let openr1 = openr ? openr : window;
                                        openr1.location.href = nowHost;
                                    } else {
                                        let openr = window.open();
                                        openr.close();
                                    }

                                    //解决跳转拦截的问题
                                })
                                .catch(error => this.$root.endTableLoading);
                            this.$refs.dataActive.hide();
                            this.type = [];
                            this.arr1 = [];
                            this.depositCount = [];
                            this.withdrawalCount = [];
                            this.bonusCount = [];
                            this.commissionCount = [];
                            this.otherCount = [];
                        }
                    })
                    .catch(error => this.$root.endTableLoading);
            }
        },
        // 提交查询
        searchSubmit() {
            let data = { ...this.searchKey };
            if (this.$root.effectTime(this.Time)) {
                const [startTime, endTime] = this.$root.effectTime(this.Time);
                data.startTime = startTime && this.$root.formatTimeS(startTime);
                data.endTime = endTime && this.$root.formatTimeS(endTime);
            } else {
                return false;
            }
            const { startTime, endTime } = data;
            this.searchKey.startTime = startTime;
            this.searchKey.endTime = endTime;
            if (new Date(this.Time[1]).getTime() - new Date(this.Time[0]).getTime() > 259200000 && !data.userName) {
                this.$Tip.info({ content: '查询大于3天的记录，会员账号必填' });
                return false;
            }
            //不支持多账号查询
            const reg = /[0-9a-zA-Z_-]{5,20}/;
            if (data.userName && data.userName.includes(',')) {
                this.$Tip.info({
                    content: '不支持多会员账号查询，请以单个会员账号查询'
                });
                return false;
            }
            if (data.userName) data.userName = this.$root.trimAll(data.userName);
            if (data.userName && data.userName.length < 5) {
                this.$Tip.info({ content: '会员账号最小长度为5个字符' });
                return false;
            }
            if (data.userName && data.userName.length > 20) {
                this.$Tip.info({ content: '会员账号最大长度为20个字符' });
                return false;
            }
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            //更新列表数据
            if (this.newVal != undefined) {
                let newData = { ...this.searchKey };
                for (let key in newData) {
                    if (!newData[key]) delete newData[key];
                }
                this.getData({ params: newData });
                // 更新表格统计数据
                let postData = { ...data };
                for (let key in postData) {
                    if (!postData[key]) delete postData[key];
                }
                postData.purpose = 'statistical';
                this.$nextTick(() => {
                    this.$refs.sum.initData({ params: postData });
                    this.$refs.tables.setPage();
                });
            } else {
                let data = { ...this.searchKey };
                for (let key in data) {
                    if (key == 'subType') delete data[key];
                    if (!data[key]) delete data[key];
                }
                this.getData({ params: data });
                let postData = { ...data };
                postData.purpose = 'statistical';
                this.$refs.sum.initData({ params: postData });
            }
        },
        // 获取表格数据
        getData(data) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            this.$root.startTableLoading();
            financeSummaryData(data)
                .then(res => {
                    if (res.code == 200 && res.code != undefined) {
                        this.isShow = res.data.length == 0 ? false : true;
                        if ((res.data.data && res.data.data.length > 0) || res.data.length == 0) {
                            const { data, total } = res.data;
                            this.table.data = data;
                            this.table.total = total;
                            this.$root.endTableLoading();
                        }
                        if (res.data.code == 400) {
                            let msg = res.data.message;
                            this.$Tip.info({ content: msg });
                        }
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading);
        },
        // 验证会员账号为指定格式
        checkUserName() {
            let reg = /^([0-9a-zA-Z-_])*$/;
            if (!reg.test(this.searchKey.userName)) {
                this.$nextTick(() => {
                    this.searchKey.userName = this.searchKey.userName.slice(0, -1);
                    this.checkUserName();
                });
            }
        },
        onPageChange(page) {
            let data = { ...this.searchKey, limit: this.pageSize };

            //不支持多账号查询
            const reg = /[0-9a-zA-Z_-]{5,20}/;
            if (data.userName && data.userName.includes(',')) {
                this.$Tip.info({
                    content: '不支持多会员账号查询，请以单个会员账号查询'
                });
                return false;
            }
            if (data.userName) data.userName = this.$root.trimAll(data.userName);
            if (data.userName && data.userName.length < 5) {
                this.$Tip.info({ content: '会员账号最小长度为5个字符' });
                return false;
            }
            if (data.userName && data.userName.length > 20) {
                this.$Tip.info({ content: '会员账号最大长度为20个字符' });
                return false;
            }
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (this.newVal != undefined) {
                this.getData({ params: data, query: { page } });
                // 更新表格统计数据
                let postData = { ...data };
                postData.purpose = 'statistical';
                this.$refs.sum.initData({ params: postData, query: { page } });
            } else {
                for (let key in data) {
                    if (key == 'subType') delete data[key];
                    if (!data[key]) delete data[key];
                }
                this.getData({ params: data, query: { page } });
                let postData = { ...data };
                postData.purpose = 'statistical';
                this.$refs.sum.initData({ params: postData, query: { page } });
            }
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };

            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (this.newVal != undefined) {
                this.getData({ params: data });
                let postData = { ...data };
                postData.purpose = 'statistical';
                this.pageSize = pageSize;
                this.$refs.sum.initData({ params: postData });
            } else {
                for (let key in data) {
                    if (key == 'subType') delete data[key];
                    if (!data[key]) delete data[key];
                }
                this.getData({ params: data });
                let postData = { ...data };
                postData.purpose = 'statistical';
                this.$refs.sum.initData({ params: postData });
            }
        },
        //导出框全选
        exportCheckAll1() {
            if (this.indeterminate1) {
                this.depositCheckAll = false;
            } else {
                this.depositCheckAll = !this.depositCheckAll;
            }
            this.indeterminate1 = false;

            if (this.depositCheckAll) {
                let depositArr = [];
                this.depositList.forEach(item => {
                    depositArr.push(item.value);
                });
                this.detail.deposit = depositArr;
                this.depositCount = depositArr;
            } else {
                this.detail.deposit = [];
                this.depositCount = [];
            }
        },
        exportCheckAll2() {
            if (this.indeterminate2) {
                this.withdrawalCheckAll = false;
            } else {
                this.withdrawalCheckAll = !this.withdrawalCheckAll;
            }
            this.indeterminate2 = false;

            if (this.withdrawalCheckAll) {
                let withdrawalArr = [];
                this.withdrawalList.forEach(item => {
                    withdrawalArr.push(item.value);
                });
                this.detail.withdrawal = withdrawalArr;
                this.withdrawalCount = withdrawalArr;
            } else {
                this.detail.withdrawal = [];
                this.withdrawalCount = [];
            }
        },
        exportCheckAll3() {
            if (this.indeterminate3) {
                this.bonusCheckAll = false;
            } else {
                this.bonusCheckAll = !this.bonusCheckAll;
            }
            this.indeterminate3 = false;
            if (this.bonusCheckAll) {
                let preferentialArr = [];
                this.bonusList.forEach(item => {
                    preferentialArr.push(item.value);
                });
                this.detail.preferential = preferentialArr;
                this.bonusCount = preferentialArr;
            } else {
                this.detail.preferential = [];
                this.bonusCount = [];
            }
        },
        exportCheckAll4() {
            if (this.indeterminate4) {
                this.commissionCheckAll = false;
            } else {
                this.commissionCheckAll = !this.commissionCheckAll;
            }
            this.indeterminate4 = false;
            if (this.commissionCheckAll) {
                let commissionArr = [];
                this.commissionList.forEach(item => {
                    commissionArr.push(item.value);
                });
                this.detail.commission = commissionArr;
                this.commissionCount = commissionArr;
            } else {
                this.detail.commission = [];
                this.commissionCount = [];
            }
        },
        exportCheckAll5() {
            if (this.indeterminate5) {
                this.otherCheckAll = false;
            } else {
                this.otherCheckAll = !this.otherCheckAll;
            }
            this.indeterminate5 = false;
            if (this.otherCheckAll) {
                let otherArr = [];
                this.otherList.forEach(item => {
                    otherArr.push(item.value);
                });
                this.detail.other = otherArr;
                this.otherCount = otherArr;
            } else {
                this.detail.other = [];
                this.otherCount = [];
            }
        },
        //导出框关闭
        closeModal() {
            this.indeterminate1 = false;
            this.indeterminate2 = false;
            this.indeterminate3 = false;
            this.indeterminate4 = false;
            this.indeterminate5 = false;
            this.depositCheckAll = false;
            this.withdrawalCheckAll = false;
            this.bonusCheckAll = false;
            this.commissionCheckAll = false;
            this.otherCheckAll = false;

            this.depositCount = [];
            this.withdrawalCount = [];
            this.bonusCount = [];
            this.commissionCount = [];
            this.otherCount = [];
        },

        //选择框存款 depositCount
        onDeposits(val) {
            this.depositCounts = val;
            if (val.length === this.depositList.length) {
                this.indeterminates1 = false;
                this.depositCheckAlls = true;
            } else if (val.length > 0) {
                this.indeterminates1 = true;
                this.depositCheckAlls = false;
            } else {
                this.indeterminates1 = false;
                this.depositCheckAlls = false;
            }
        },
        //选择框取款  withdrawalCount
        onWithdrawals(val) {
            this.withdrawalCounts = val;
            if (val.length === this.withdrawalList.length) {
                this.indeterminates2 = false;
                this.withdrawalCheckAlls = true;
            } else if (val.length > 0) {
                this.indeterminates2 = true;
                this.withdrawalCheckAlls = false;
            } else {
                this.indeterminates2 = false;
                this.withdrawalCheckAlls = false;
            }
        },
        // 选择框优惠 bonusCount
        onPreferentials(val) {
            this.bonusCounts = val;
            if (val.length === this.bonusList.length) {
                this.indeterminates3 = false;
                this.bonusCheckAlls = true;
            } else if (val.length > 0) {
                this.indeterminates3 = true;
                this.bonusCheckAlls = false;
            } else {
                this.indeterminates3 = false;
                this.bonusCheckAlls = false;
            }
        },
        //选择框佣金  commission
        onCommissions(val) {
            this.commissionCounts = val;
            if (val.length === this.commissionList.length) {
                this.indeterminates4 = false;
                this.commissionCheckAlls = true;
            } else if (val.length > 0) {
                this.indeterminates4 = true;
                this.commissionCheckAlls = false;
            } else {
                this.indeterminates4 = false;
                this.commissionCheckAlls = false;
            }
        },
        // 选择框其他 otherCount
        onOthers(val) {
            this.otherCounts = val;
            if (val.length === this.otherList.length) {
                this.indeterminates5 = false;
                this.otherCheckAlls = true;
            } else if (val.length > 0) {
                this.indeterminates5 = true;
                this.otherCheckAlls = false;
            } else {
                this.indeterminates5 = false;
                this.otherCheckAlls = false;
            }
        },
        //选择框全选
        selectCheckAll1() {
            if (this.indeterminates1) {
                this.depositCheckAlls = false;
            } else {
                this.depositCheckAlls = !this.depositCheckAlls;
            }
            this.indeterminates1 = false;

            if (this.depositCheckAlls) {
                let depositArr = [];
                this.depositList.forEach(item => {
                    depositArr.push(item.value);
                });
                this.details.deposit = depositArr;
                this.depositCounts = depositArr;
            } else {
                this.details.deposit = [];
                this.depositCounts = [];
            }
        },
        selectCheckAll2() {
            if (this.indeterminates2) {
                this.withdrawalCheckAlls = false;
            } else {
                this.withdrawalCheckAlls = !this.withdrawalCheckAlls;
            }
            this.indeterminates2 = false;

            if (this.withdrawalCheckAlls) {
                let withdrawalArr = [];
                this.withdrawalList.forEach(item => {
                    withdrawalArr.push(item.value);
                });
                this.details.withdrawal = withdrawalArr;
                this.withdrawalCounts = withdrawalArr;
            } else {
                this.details.withdrawal = [];
                this.withdrawalCounts = [];
            }
        },
        selectCheckAll3() {
            if (this.indeterminates3) {
                this.bonusCheckAlls = false;
            } else {
                this.bonusCheckAlls = !this.bonusCheckAlls;
            }
            this.indeterminates3 = false;
            if (this.bonusCheckAlls) {
                let preferentialArr = [];
                this.bonusList.forEach(item => {
                    preferentialArr.push(item.value);
                });
                this.details.preferential = preferentialArr;
                this.bonusCounts = preferentialArr;
            } else {
                this.details.preferential = [];
                this.bonusCounts = [];
            }
        },
        selectCheckAll4() {
            if (this.indeterminates4) {
                this.commissionCheckAlls = false;
            } else {
                this.commissionCheckAlls = !this.commissionCheckAlls;
            }
            this.indeterminates4 = false;
            if (this.commissionCheckAlls) {
                let commissionArr = [];
                this.commissionList.forEach(item => {
                    commissionArr.push(item.value);
                });
                this.details.commission = commissionArr;
                this.commissionCounts = commissionArr;
            } else {
                this.details.commission = [];
                this.commissionCounts = [];
            }
        },
        selectCheckAll5() {
            if (this.indeterminates5) {
                this.otherCheckAlls = false;
            } else {
                this.otherCheckAlls = !this.otherCheckAlls;
            }
            this.indeterminates5 = false;
            if (this.otherCheckAlls) {
                let otherArr = [];
                this.otherList.forEach(item => {
                    otherArr.push(item.value);
                });
                this.details.other = otherArr;
                this.otherCounts = otherArr;
            } else {
                this.details.other = [];
                this.otherCounts = [];
            }
        },

        //选择框关闭
        closeSelect() {
            this.indeterminates1 = false;
            this.indeterminates2 = false;
            this.indeterminates3 = false;
            this.indeterminates4 = false;
            this.indeterminates5 = false;
            this.depositCheckAlls = false;
            this.withdrawalCheckAlls = false;
            this.bonusCheckAlls = false;
            this.commissionCheckAlls = false;
            this.otherCheckAlls = false;

            this.details = [];
            this.depositCounts = [];
            this.withdrawalCounts = [];
            this.bonusCounts = [];
            this.commissionCounts = [];
            this.otherCounts = [];
            this.arr1 = [];
            this.searchKey.type = '';
            this.searchKey.subType = '';
            this.selectText = '请选择业务类型';
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
@import '../../styles/class.less';
/deep/.ivu-btn {
    outline: none;
}
.ivu-btn {
    &.close {
        background: #fff;
        &:hover {
            background: #f4f9ff;
            border: 1px solid #2d8cf0;
            color: #2d8cf0;
        }
    }
}
.ivu-input-wrapper {
    vertical-align: 0;
}
/deep/.ivu-form-item {
    .ivu-form-item-label {
        font-size: 0.875rem;
    }
    .ivu-form-item-content {
        .ivu-checkbox-group {
            margin-left: 50px;
            .ivu-checkbox-wrapper {
                margin-right: 20px;
                width: 130px;
                .ivu-checkbox {
                    /deep/.ivu-checkbox-inner {
                        width: 18px !important;
                        height: 18px !important;
                        margin-right: 3px;
                    }
                }
                .ivu-checkbox-checked .ivu-checkbox-inner:after {
                    width: 7px;
                    height: 10px;
                    position: absolute;
                    top: 2px;
                    left: 5px;
                }
            }
        }
    }
}
.new-table {
    margin-top: 20px;
    height: 205px;
    border: 1px solid #dcdcdc;
    box-sizing: border-box;
}
.other {
    display: inline-block;
    height: 25%;
    width: 16.66%;
    border-bottom: 1px solid #dcdcdc;
    border-right: 1px solid #dcdcdc;
    &:nth-child(6n) {
        border-right: 0;
    }
}

.reset {
    width: 240px;
    height: 50px;
    font-size: 1.125rem /* 18/16 */;
    border: 1px solid #dcdcdc;
    text-align: center;
    border-radius: 5px;
    float: left;
    line-height: 50px;
}

.reset:hover {
    border: 1px solid #2d8cf0;
    color: #2d8cf0;
}
/deep/.ivu-checkbox-inner {
    width: 20px !important;
    height: 20px !important;
    box-sizing: border-box !important;
}
/deep/.v2-search .ivu-select .ivu-select-selection {
    height: 100% !important;
}
/deep/.v2-search .ivu-form-item .ivu-form-item-content {
    height: 100% !important;
}
/deep/.ivu-select-multiple .ivu-select-selection {
    padding: 0 0 0 4px;
}
/deep/.ivu-select-multiple .ivu-tag {
    max-width: 55%;
}
/deep/.ivu-form .ivu-form-item {
    margin-bottom: 20px;
}
</style>