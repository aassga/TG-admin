<template>
    <Modals title="请选择导出字段" width="1407" ref="searchKey" @closeModal="closeModel">
        <div slot="content">
            <div class="top">
                <Form ref="search" style="width: 1367px" class="clearfix ml20 mr20">
                    <FormItem class=" ib fl">
                        <Select v-model="topObj.timeType" style="width:90px;">
                            <Option value="data_date">存款时间</Option>
                            <Option value="created_at">注册时间</Option>
                        </Select>
                        <DatePicker type="date" placeholder="开始日期" class="w120x ml5" v-model="topObj.startTime"></DatePicker>
                        <DatePicker type="date" placeholder="结束日期" class="w120x ml5" v-model="topObj.endTime"></DatePicker>
                        <span class="ml20 mr10">客户端</span>
                        <Select placeholder="全部"  class="w120x mr20" v-model="topObj.lastDevice">
                            <Option value="pc">PC</Option>
                            <Option value="h5">H5</Option>
                            <Option value="android">Android</Option>
                            <Option value="ios">IOS</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="会员等级" class="w25 ib fl" v-show="currentChecked.includes('member.levelId')">
                        <InputNumber :min="0" class="w100x" placeholder="下限" v-model="topObj['member.levelId'].min" />
                        <span class="pl5 pr5">-</span>
                        <InputNumber :min="0" class="w100x" placeholder="上限" v-model="topObj['member.levelId'].max" />
                    </FormItem>
                    <FormItem label="代理等级" class="w25 ib fl" v-show="currentChecked.includes('member.levelId')">
                        <InputNumber :min="0" class="w100x" placeholder="下限" v-model="topObj['member.accountType'].min" />
                        <span class="pl5 pr5">-</span>
                        <InputNumber :min="0" class="w100x" placeholder="上限" v-model="topObj['member.accountType'].max" />
                    </FormItem>
                    <FormItem label="上级代理" class="w25 ib fl" v-show="currentChecked.includes('member.agencyName')">
                        <!-- <Input type="text" class="w60" placeholder="上级代理" v-model="topObj['member.agencyName']" /> -->
                        <AutoSearch
                            ref="autoSearch"
                            :clearable="false"
                            :siteId="$root.nowSite.id"
                            v-model="topObj['member.agencyName']"
                            :placeholder="'上级代理账号，默认查询'"
                            @changeShow="changeShow"
                            @sendSuperior="getSuperior(arguments)"
                        ></AutoSearch>
                    </FormItem>
                    <FormItem label="账号余额" class="w25 ib fl" v-show="currentChecked.includes('member.balance')">
                        <InputNumber :min="0" class="w100x" placeholder="下限" v-model="topObj['member.balance'].min" />
                        <span class="pl5 pr5">-</span>
                        <InputNumber :min="0" class="w100x" placeholder="上限" v-model="topObj['member.balance'].max" />
                    </FormItem>
                    <FormItem label="佣金余额" class="w25 ib fl" v-show="currentChecked.includes('agency.balance')">
                        <InputNumber :min="0" class="w100x" placeholder="下限" v-model="topObj['agency.balance'].min" />
                        <span class="pl5 pr5">-</span>
                        <InputNumber :min="0" class="w100x" placeholder="上限" v-model="topObj['agency.balance'].max" />
                    </FormItem>
                    <FormItem label="未登录/天" class="w25 ib fl" v-show="currentChecked.includes('member.notLoginDay')">
                        <InputNumber :min="0" class="w100x" placeholder="下限" v-model="topObj['member.notLoginDay'].min" />
                        <span class="pl5 pr5">-</span>
                        <InputNumber :min="0" class="w100x" placeholder="上限" v-model="topObj['member.notLoginDay'].max" />
                    </FormItem>
                    <FormItem label="存款总额" class="w25 ib fl" v-show="currentChecked.includes('report.depositAmount')">
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.depositAmount'].min = topObj['report.depositAmount'].min.replace(/[^\d]/g, '')"
                            v-model="topObj['report.depositAmount'].min"
                            placeholder="下限"
                        />
                        <span class="pl5 pr5">-</span>
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.depositAmount'].max = topObj['report.depositAmount'].max.replace(/[^\d]/g, '')"
                            v-model="topObj['report.depositAmount'].max"
                            placeholder="上限"
                        />
                    </FormItem>
                    <FormItem label="公司入款" class="w25 ib fl" v-show="currentChecked.includes('report.depositAmountOffline')">
                        <Input
                            type="text"
                            @on-keyup="topObj['report.depositAmountOffline'].min = topObj['report.depositAmountOffline'].min.replace(/[^\d]/g, '')"
                            class="w100x"
                            v-model="topObj['report.depositAmountOffline'].min"
                            placeholder="下限"
                        />
                        <span class="pl5 pr5">-</span>
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.depositAmountOffline'].max = topObj['report.depositAmountOffline'].max.replace(/[^\d]/g, '')"
                            v-model="topObj['report.depositAmountOffline'].max"
                            placeholder="上限"
                        />
                    </FormItem>
                    <FormItem label="在线支付" class="w25 ib fl" v-show="currentChecked.includes('report.depositAmountOnline')">
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.depositAmountOnline'].min = topObj['report.depositAmountOnline'].min.replace(/[^\d]/g, '')"
                            v-model="topObj['report.depositAmountOnline'].min"
                            placeholder="下限"
                        />
                        <span class="pl5 pr5">-</span>
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.depositAmountOnline'].max = topObj['report.depositAmountOnline'].max.replace(/[^\d]/g, '')"
                            v-model="topObj['report.depositAmountOnline'].max"
                            placeholder="上限"
                        />
                    </FormItem>
                    <FormItem label="最大单笔" type="text" class="w25 ib fl" v-show="currentChecked.includes('member.max_deposit')">
                        <Input
                            type="text"
                            @on-keyup="topObj['member.max_deposit'].min = topObj['member.max_deposit'].min.replace(/[^\d]/g, '')"
                            class="w100x"
                            v-model="topObj['member.max_deposit'].min"
                            placeholder="下限"
                        />
                        <span class="pl5 pr5">-</span>
                        <Input
                            type="text"
                            @on-keyup="topObj['member.max_deposit'].max = topObj['member.max_deposit'].max.replace(/[^\d]/g, '')"
                            class="w100x"
                            v-model="topObj['member.max_deposit'].max"
                            placeholder="上限"
                        />
                    </FormItem>
                    <FormItem label="取款总额" class="w25 ib fl" v-show="currentChecked.includes('report.withdrawalsAmount')">
                        <Input
                            type="text"
                            class="w100x"
                            @on-keyup="topObj['report.withdrawalsAmount'].min = topObj['report.withdrawalsAmount'].min.replace(/[^\d]/g, '')"
                            v-model="topObj['report.withdrawalsAmount'].min"
                            placeholder="下限"
                        />
                        <span class="pl5 pr5">-</span>
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.withdrawalsAmount'].max = topObj['report.withdrawalsAmount'].max.replace(/[^\d]/g, '')"
                            v-model="topObj['report.withdrawalsAmount'].max"
                            placeholder="上限"
                        />
                    </FormItem>
                    <FormItem label="有效投注" class="w25 ib fl" v-show="currentChecked.includes('report.validBetAmount')">
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.validBetAmount'].min = topObj['report.validBetAmount'].min.replace(/[^\d]/g, '')"
                            v-model="topObj['report.validBetAmount'].min"
                            placeholder="下限"
                        />
                        <span class="pl5 pr5">-</span>
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.validBetAmount'].max = topObj['report.validBetAmount'].max.replace(/[^\d]/g, '')"
                            v-model="topObj['report.validBetAmount'].max"
                            placeholder="上限"
                        />
                    </FormItem>
                    <FormItem label="会员输赢" class="w25 ib fl" v-show="currentChecked.includes('report.netAmount')">
                        <Input
                            class="w100x"
                            type="text"
                            @on-keyup="topObj['report.netAmount'].min = topObj['report.netAmount'].min.replace(/[^\d]/g, '')"
                            v-model="topObj['report.netAmount'].min"
                            placeholder="下限"
                        />
                        <span class="pl5 pr5">-</span>
                        <Input
                            type="text"
                            @on-keyup="topObj['report.netAmount'].max = topObj['report.netAmount'].max.replace(/[^\d]/g, '')"
                            class="w100x"
                            v-model="topObj['report.netAmount'].max"
                            placeholder="上限"
                        />
                    </FormItem>
                </Form>
            </div>
            <div class="bottom clearfix bb">
                <div class="f6Color h34 pl20">
                    <Checkbox :value="checkAll" :indeterminate="indeterminate" @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>
                <CheckboxGroup class="clearfix pl20 mb20" v-model="checkAllGroup" @on-change="checkAllGroupChange">
                    <Checkbox v-for="(t, i) in checkType" :key="'check' + i" :label="t.value" class="ib fl w16 mt20 ti20">{{ t.name }}</Checkbox>
                </CheckboxGroup>
            </div>
            <div class="mt20 mb20">
                <Button :loading="loading" type="primary" class="ivu-btn submit" style="marginLeft: 560px;" @click="submit">确定</Button>
            </div>
        </div>
    </Modals>
</template>
<script>
import Modals from '_c/modals';
import { rmRepeatItem } from '@/libs/util';
import { memberExport } from '@/api/member';
import AutoSearch from '@/components/auto-search';

export default {
    components: {
        Modals,
        AutoSearch
    },

    data() {
        return {
            loading: false,
            topObj: {
                timeType: 'data_date',
                startTime: '',
                endTime: '',
                lastDevice:'',
                'member.agencyName': '',
                'member.levelId': { min: null, max: null },
                'member.accountType': { min: null, max: null },
                'member.balance': { min: null, max: null },
                'agency.balance': { min: null, max: null },
                'member.notLoginDay': { min: null, max: null },
                'report.depositAmount': { min: '', max: '' },
                'report.depositAmountOffline': { min: '', max: '' },
                'report.depositAmountOnline': { min: '', max: '' },
                'member.max_deposit': { min: '', max: '' },
                'report.withdrawalsAmount': { min: '', max: '' },
                'report.validBetAmount': { min: '', max: '' },
                'report.netAmount': { min: '', max: '' }
            },
            indeterminate: false,
            checkAll: false,
            checkAllGroup: [],
            currentChecked: [], //做显示用
            postColumn: [], //传参用
            checkType: [
                { value: 'member.created_at', name: '注册时间', type: 'column' },
                { value: 'member.createIp', name: '注册IP', type: 'column' },
                { value: 'member.lastIp', name: '登录IP', type: 'column' },
                { value: 'member.lastTime', name: '登录时间', type: 'column' },
                { value: 'member.realName', name: '姓名', type: 'column' },
                { value: 'member.accountType', name: '账号类型', type: 'column' },
                { value: 'member.levelId', name: '等级', type: 'export' },
                { value: 'member.agencyName', name: '上级代理', type: 'export' }, //导出字段  后面是查询条件
                { value: 'member.balance', name: '账号余额', type: 'export' },
                { value: 'agency.balance', name: '佣金余额', type: 'export' },
                { value: 'member.notLoginDay', name: '未登录/天', type: 'export' },
                { value: 'report.depositAmount', name: '存款总额', type: 'export' },
                { value: 'report.depositAmountOffline', name: '公司入款', type: 'export' },
                { value: 'report.depositAmountOnline', name: '在线支付', type: 'export' },
                { value: 'member.max_deposit', name: '最大单笔', type: 'export' },
                { value: 'report.withdrawalsAmount', name: '取款总额', type: 'epxort' },
                { value: 'report.cashProfit', name: '现金利润', type: 'export' },
                { value: 'report.validBetAmount', name: '有效投注', type: 'export' },
                { value: 'report.netAmount', name: '会员输赢', type: 'export' }
            ],
            data: [],
            autoQuery: []
        };
    },
    methods: {
        createModal() {
            this.currentChecked = [];
            this.postColumn = [];
            this.checkAllGroup = [];
            this.topObj.startTime = '';
            this.topObj.endTime = '';
            this.checkAll = false;
            this.indeterminate = false;
            this.topObj.timeType = 'data_date';
            this.$refs.searchKey.show();
        },
        handleCheckAll() {
            this.checkAll = this.indeterminate ? false : !this.checkAll;
            this.indeterminate = false;
            if (this.checkAll) {
                this.checkType.forEach(t => {
                    this.checkAllGroup.push(t.value);
                    this.postColumn.push(t);
                });
            } else {
                this.checkAllGroup = [];
                this.postColumn = [];
            }
            this.currentChecked = this.checkAllGroup;
        },
        checkAllGroupChange(data) {
            this.postColumn = [];
            this.checkType.forEach(t => {
                if (data.includes(t.value)) this.postColumn.push(t);
            });
            this.currentChecked = data;
            if (data.length == this.checkType.length) {
                this.indeterminate = true;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        submit() {
            const reg = /^(([0-9]\d*))$/;
            const reg1 = /^([0-9]\d*|-[0-9]\d*)$/; //会员输赢可以是负数
            let reg2 = /^(([0-9]\d*))(\.\d{1,2})?$/; //除去上下限 可以输小数
            let flagArr = [];
            let _arr = [];
            let list = []; //做上下限的数组
            let list2 = []; //可以输入小数
            let obj = JSON.parse(JSON.stringify(this.topObj));
            if (this.currentChecked.includes('report.cashProfit')) obj['report.cashProfit'] = { min: 0, max: 0 };
            let { startTime, endTime } = obj;
            if (startTime) obj.startTime = this.$root.formatTime(startTime);
            if (endTime) obj.endTime = this.$root.formatTime(endTime);
            // for (let key in obj) {
            //   if (key != "timeType" && key != "startTime" && key != "endTime") {
            //     if (
            //       Object.keys(obj[key]).length == 2 &&
            //       Object.keys(obj[key])[0] == "min"
            //     ) {
            //       if (key != "report.cashProfit") {
            //         // if(!obj[key].min && !obj[key].max) obj[key] = { min: 0, max: 0 }
            //       }
            //     }
            //   }
            // }

            for (let key in obj) {
                if (key != 'timeType' && key != 'startTime' && key != 'endTime') {
                    if (key != 'report.cashProfit') {
                        list.push(obj[key]);
                        if (key == 'member.balance' || key == 'agency.balance' || key == 'member.notLoginDay' || key == 'member.levelId' || key == 'member.accountType') {
                            obj[key].min && flagArr.push(reg.test(obj[key].min));
                            obj[key].max && flagArr.push(reg.test(obj[key].max));
                        } else if (key == 'report.netAmount') {
                            obj[key].min && _arr.push(reg1.test(obj[key].min));
                            obj[key].max && _arr.push(reg1.test(obj[key].max));
                        } else {
                            obj[key].min && list2.push(reg2.test(obj[key].min));
                            obj[key].max && list2.push(reg2.test(obj[key].max));
                        }
                    }
                }
            }
            for (let key of flagArr) {
                if (!key) {
                    this.$Message.error('上下限值均为正整数');
                    return false;
                }
            }
            for (let key of _arr) {
                if (!key) {
                    this.$Message.error('会员输赢必须为整数');
                    return false;
                }
            }
            for (let key of list2) {
                if (!key) {
                    this.$Message.error('请输入正确的数值');
                    return false;
                }
            }

            for (let key of list) {
                if (+key.min > +key.max) {
                    this.$Tip.info({ content: '上限必须大于或等于下限' });
                    return false;
                }
            }
            let data = {
                siteId: this.$root.nowSite.id,
                export_condition: {},
                export_column: []
            };

            data.timeType = obj.timeType;
            data.startTime = obj.startTime;
            data.endTime = obj.endTime;
            data.lastDevice=obj.lastDevice;

            for (let key in data) {
                if (!data[key]) delete data[key];
            }

            data.isExport = 0;
            this.loading = true;
            if (this.postColumn.length > 0) {
                this.postColumn.forEach(item => {
                    if (item.value == 'member.levelId') this.postColumn.push({ value: 'member.accountType', name: '代理等级', type: 'export' });
                });
            }
            this.postColumn.length > 0 &&
                this.postColumn.forEach(t => {
                    if (t.type == 'column') data.export_column.push(t.value);
                    else {
                        data.export_column.push(t.value);
                        for (let key in obj) {
                            if (key == t.value) {
                                if (key == 'member.balance' || key == 'agency.balance' || key == 'member.notLoginDay' || key == 'member.levelId' || key == 'member.accountType') {
                                    if (obj[key].min == null) obj[key].min = '';
                                    if (obj[key].max == null) obj[key].max = '';
                                }
                                if (key == 'member.agencyName') {
                                    data.export_condition[key] = obj[key];
                                } else {
                                    data.export_condition[key] = `${obj[key].min}/${obj[key].max}`;
                                }
                            }
                        }
                    }
                });

            // for (let key in data.export_condition) {
            //     if (data.export_condition[key] == '/') {
            //         delete data.export_condition[key];
            //     }
            // }

            data.export_column = rmRepeatItem(data.export_column);
            if (data.export_column.length > 0) data.export_column = data.export_column.join(',');
            else delete data.export_column;
            if (Object.keys(data.export_condition).length > 0) data.export_condition = JSON.stringify(data.export_condition);
            else delete data.export_condition;
            memberExport(data,true)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        if (res.data.count == 0) {
                            this.$Tip.info({ content: '暂无可导出数据' });
                            this.loading = false;
                            return false;
                        } else {
                            // 去掉弹框
                            let _data = JSON.parse(JSON.stringify(data));
                            _data.isExport = 1;
                            let openr = window.open();
                            memberExport(_data,true).then(res => {
                                if (res != undefined && res.code == 200) {
                                    let region = res.data.downloadUrl;
                                    let nowHost = region.split('.com')[1];
                                    let openr1 = openr ? openr : window;
                                    openr1.location.href = nowHost;

                                    //导出清空input的值
                                    let arr = JSON.parse(_data.export_condition);
                                    for (let key in arr) {
                                        if (key == 'member.agencyName') {
                                            this.$refs.autoSearch.value = '';
                                        } else {
                                            if (
                                                key == 'member.levelId' ||
                                                key == 'member.accountType' ||
                                                key == 'member.balance' ||
                                                key == 'agency.balance' ||
                                                key == 'member.notLoginDay'
                                            ) {
                                                this.topObj[key].min = null;
                                                this.topObj[key].max = null;
                                            } else {
                                                this.topObj[key].min = '';
                                                this.topObj[key].max = '';
                                            }
                                        }
                                    }
                                } else openr.close();
                            });
                            // 当大于一千条的时候 需要分页导出
                            // if (res.data.count > 10000) {
                            //   this.$emit("exportData", {
                            //     postData: data,
                            //     count: res.data.count
                            //   });
                            // } else {
                            //   let _data = JSON.parse(JSON.stringify(data));
                            //   _data.isExport = 1;
                            //   let openr = window.open();
                            //   memberExport(_data).then(res => {
                            //     if (res != undefined && res.code == 200) {
                            //       let region = res.data.downloadUrl;
                            //       let nowHost = region.split(".com")[1];
                            //       let openr1 = openr ? openr : window;
                            //       openr1.location.href = nowHost;
                            //     } else openr.close();
                            //   });
                            // }
                            this.$refs.searchKey.hide();
                        }
                    }
                    this.loading = false;
                })
                .catch(error => (this.loading = false));
        },
        closeModel() {
            //关闭清空input的值

            for (let key in this.topObj) {
                if (key != 'timeType' && key != 'startTime' && key != 'endTime') {
                    if (key == 'member.agencyName') {
                        this.$refs.autoSearch.value = '';
                    } else {
                        if (key == 'member.levelId' || key == 'member.accountType' || key == 'member.balance' || key == 'agency.balance' || key == 'member.notLoginDay') {
                            this.topObj[key].min = null;
                            this.topObj[key].max = null;
                        } else {
                            this.topObj[key].min = '';
                            this.topObj[key].max = '';
                        }
                    }
                }
            }
        },
        //上级代理自动查询
        filterMethod(value, option) {
            return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
        },
        changeShow(flag) {
            this.rebateShow = flag;
        },
        // 获取上级代理账号
        getSuperior(value) {
            this.topObj['member.agencyName'] = value[0];
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.h34 {
    height: 34px;
    line-height: 34px;
}
.dlInput {
    width: 200px;
    height: 34px;
    opacity: 0.8;
    border-radius: 4px;
    border: solid 1px #e4e4e4;
    background-color: #ffffff;
    padding: 0 7px;
}
/deep/.ivu-auto-complete {
    width: 213px !important;
}
</style>
