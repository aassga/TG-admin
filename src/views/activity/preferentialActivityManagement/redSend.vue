<template>
    <div>
        <div class="v2-search" style="margin-bottom:24px">
            <Form ref="searchKey" inline>
                <FormItem>
                    <Button
                        type="primary"
                        @click="
                            () => {
                                this.$refs.addReds.show();
                            }
                        "
                        >添加手工红包</Button
                    >
                </FormItem>
                <FormItem label="红包类型">
                    <Select v-model="searchKey.count_type" @on-change="changeRed">
                        <Option value="0">手工红包</Option>
                        <Option value="bet">按打码</Option>
                        <Option value="kuisun">按亏损</Option>
                        <Option value="yingli">按派彩</Option>
                        <Option value="chongzhi">按存款</Option>
                        <Option value="xianjin">按现金</Option>
                        <Option value="xianjinying">按现金赢</Option>
                        <Option value="xianjinshu">按现金输</Option>
                        <Option value="A0018">首页红包雨 </Option> 
                    </Select>
                </FormItem>
                <span style="margin-left:-10px" class="mr10 h36" v-if="selectType">-</span>
                <FormItem v-if="selectType">
                    <Select placeholder="全部" v-model="searchKey.code" clearable class="w90x">
                        <Option v-for="(t, i) in packList" :key="i" :value="t">{{ t }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="领取状态">
                    <Select v-model="searchKey.gift_money_receive" placeholder="全部" class="w80x" clearable>
                        <Option value="no">未领取</Option>
                        <Option value="yes">已领取</Option>
                        <Option value="cancel">已取消</Option>
                    </Select>
                </FormItem>
                <FormItem label="发放日期">
                    <DatePicker type="date" placeholder="开始日期" @on-clear="onClear" :class="screen == 1440 ? 's-130' : 's-120'" v-model="Time[0]"></DatePicker>-
                    <DatePicker type="date" placeholder="结束日期" @on-clear="onClear" :class="screen == 1440 ? 's-130' : 's-120'" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem label="会员帐号">
                    <Input placeholder="可依据首字母查询" class="s-140" v-model="searchKey.userName" @keyup.enter.native="searchSubmit" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button :loading="$root.exportBtnLoading" class="export" @click.prevent="exportExcel" type="primary">导出Excel</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="tables"
                :loading="$root.tableLoading"
                :columns="this.isCode ? table.columns : table1.columns"
                :value="table.data"
                :total="table.total"
                :stripe="false"
                :more="table.more"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="sortChange"
            >
                <div slot="more">
                    <div class="h44 ">
                        <span>
                            已领取:
                            <span class="ml5 bb-color">{{ yesList.money }}/{{ yesList.renshu }}人</span>
                        </span>
                        <span class="pl10">
                            未领取:
                            <span class="ml5 bb-color">{{ noList.money }}/{{ noList.renshu }}人</span>
                        </span>
                        <span class="pl10">
                            已取消:
                            <span class="ml5 bb-color">{{ cancelList.money }}/{{ cancelList.renshu }}人</span>
                        </span>
                    </div>
                </div>
            </Tables>
        </div>
        <Modals title="温馨提示" ref="failureTips" width="600" :mask-closable="false">
            <div slot="content" style="text-align:center">
                <div class="content w400x ib txt-a">
                    <p class="ft16 mb10 txt-l">
                        <Icon type="ios-alert" size="30" color="#2d8cf0" />
                        以下有<span class="red-font"> {{no_num}}</span>个账户不存在
                    </p>
                    <Input type="textarea" :autosize="{minRows: 5,maxRows: 10}" :placeholder="no_user"  class="w400x" readonly />
                    <Button class="btn mt30 ft20 mb20" type="primary"   @click.prevent="confirm">确认</Button>
                </div>
            </div>
        </Modals>
        <Modals ref="addReds" width="650" title="添加红包" @closeModal="closeModel">
            <div slot="content" class="content">
                <Form class="w400x" ref="formRules" :model="formRules" :rules="rules">
                    <FormItem label="派发对象" style="margin-left:12px">
                        <Select class="w300x txt-l" v-model="formRules.add_type" @on-change="memberaChange">
                            <Option value="some">指定会员</Option>
                            <Option value="all">全部会员</Option>
                        </Select>
                    </FormItem>
                      <FormItem label="派发方式" class="ml10"  >
             <Select class="w300x" v-model="formRules.send_type" placeholder="请选择派发方式">
              <Option value="1">红包雨</Option>
              <Option value="2">砸金蛋</Option>
            </Select>
          </FormItem>
                    <FormItem label="加款金额" prop="userName" v-if="formRules.add_type == 'some'">
                        <Input
                            placeholder="格式为*：帐号,金额 例如：a123,100 注意逗号为英文格式,一行一个，最多操作10000个用户"
                            v-model="formRules.userName"
                            type="textarea"
                            class="w300x"
                            :autosize="{ minRows: 5, maxRows: 10 }"
                        />
                    </FormItem>
                    <FormItem label="发放金额" class="money_min ib" prop="money_min" v-if="formRules.add_type == 'all'">
                        <InputNumber class="w130x" :min="0" :max="999999999" placeholder="请输入最小金额" v-model="formRules.money_min" />
                    </FormItem>
                    <FormItem class="ib" v-if="formRules.add_type == 'all'">
                        <span class="h36">-</span>
                    </FormItem>
                    <FormItem class="ib money_max" prop="money_max" v-if="formRules.add_type == 'all'">
                        <InputNumber class="w130x" :min="0" :max="999999999" placeholder="请输入最大金额" v-model="formRules.money_max" />
                    </FormItem>
                    <FormItem label="取款倍数" prop="multiple">
                        <InputNumber class="w300x" v-model="formRules.multiple" placeholder="请输入取款打码倍数" :min="1" :max="9999999999.0" />
                    </FormItem>
                    <FormItem label="奖金总额" style="margin-left:2px" prop="money_total" v-if="formRules.add_type == 'all'">
                        <InputNumber class="w300x" :min="0" :max="999999999" placeholder="请输入奖金总额上限" v-model="formRules.money_total" />
                    </FormItem>
                    <FormItem class="mt50">
                        <Button type="primary"  style="width:300px;margin-left:80px" class="ivu addSave "  @click="addRed" :disabled="disabledBtn" :loading="$root.editBtnLoading" >确认</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>

<script>
import Tables from '@/components/tables';
import Modals from '@/components/modals';
import { redSendList, AddRed, cancelRed, paiFaHongBaoConfigCode } from '@/api/activity';
export default {
    name: 'redSend',
    components: {
        Tables,
        Modals
    },
    data() {
        const validateName = (rule, val, cb) => {
            if (val === '') {
                cb(new Error('请输入加款金额！'));
            } else {
                cb();
            }
        };
        const money_min = (rule, val, cb) => {
            let reg = (reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*)|0)$/);
            if (!reg.test(this.formRules.money_min) || this.formRules.money_min == null) {
                cb('请输入最小金额!');
            } else {
                cb();
            }
        };
        const money_max = (rule, val, cb) => {
            let reg = (reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/);
            if (!reg.test(this.formRules.money_max) || this.formRules.money_max == null) {
                cb('请输入最大金额!');
            } else {
                cb();
            }
        };
        const money_total = (rule, val, cb) => {
            let reg = (reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/);
            if (!reg.test(this.formRules.money_total) || this.formRules.money_total == null) {
                cb('请输入奖金总额上限!');
            } else {
                cb();
            }
        };
        const multiple = (rule,val,cb) => {
            let reg = (reg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/);
            if (this.formRules.multiple == null || !reg.test(this.formRules.multiple)) {
                cb('打码倍数最低1倍,可保留2位小数!');
            }else{
                cb();
            }
        }
        return {
            disabledBtn: false,
            no_user:'',
            no_num:'',
            Time: [this.$root.startTime(1), this.$root.endTime(1)],
            isCode: true,
            selectType: false,
            packList: '',
            statusCount: '',
            yesList: '',
            noList: '',
            cancelList: '',
            screen: screen.width,
            searchKey: {
                count_type: '0',
                siteId: this.$root.nowSite.id,
                userName: '',
                gift_money_receive: '',
                code: '',
                startTime: this.$root.startTime(1),
                endTime: this.$root.endTime(1)
            },
            date: '',
            isCancel: true,
            rowsNum: 1,
            page: 1,
            pageSize: 20,
            table: {
                more: true,
                total: 0,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                columns: [
                    {
                        title: '会员帐号',
                        key: 'userName',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{params.row.userName}</span>;
                        }
                    },
                    {
                        title: '发放金额',
                        key: 'gift_money',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{params.row.gift_money}</span>;
                        }
                    },
                    {
                        title: '取款倍数',
                        key: 'multiple',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{Number(params.row.multiple).toFixed(2)}</span>;
                        }
                    },
                    {
                        title: '领取状态',
                        key: 'gift_money_receive',
                        align: 'center',
                        render: (h, params) => {
                            let receive = params.row.gift_money_receive;
                            let status = receive == 'yes' ? '已领取' : receive == 'no' ? '未领取' : '已取消';
                            let color = receive == 'yes' ? '#008000' : receive == 'cancel' ? '#ff0000' : '';
                            return <span style={{ color }}>{status}</span>;
                        }
                    },
                    {
                        title: '添加时间',
                        key: 'created_at',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '领取时间',
                        key: 'gift_money_receive_time',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.gift_money_receive_time)}</span>;
                        }
                    },
                    {
                        title: '添加人',
                        key: 'admin_user',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{params.row.admin_user}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.gift_money_receive == 'no') {
                                return (
                                    <span
                                        class="cs"
                                        style="color:#008000"
                                        onClick={() => {
                                            this.cancel(params);
                                        }}
                                    >
                                        取消红包
                                    </span>
                                );
                            } else {
                                return <span>-</span>;
                            }
                        }
                    }
                ]
            },
            table1: {
                more: true,
                total: 0,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                columns: [
                    {
                        title: '红包代号',
                        key: 'code',
                        align: 'center'
                    },
                    {
                        title: '会员帐号',
                        key: 'userName',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{params.row.userName}</span>;
                        }
                    },
                    {
                        title: '打码条件',
                        key: 'dama',
                        align: 'center',
                        render: (h, params) => {
                            const { count_min, count_max } = params.row;
                            return (
                                <span>
                                    {count_min}-{count_max}
                                </span>
                            );
                        }
                    },
                    {
                        title: '有效投注',
                        key: 'value',
                        align: 'center'
                    },
                    {
                        title: '红包占比',
                        key: 'zhanbi',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{Number(params.row.zhanbi).toFixed(1)}%</span>;
                        }
                    },
                    {
                        title: '发放金额',
                        key: 'gift_money',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{params.row.gift_money}</span>;
                        }
                    },
                    {
                        title: '领取状态',
                        key: 'gift_money_receive',
                        align: 'center',
                        render: (h, params) => {
                            let receive = params.row.gift_money_receive;
                            let status = receive == 'yes' ? '已领取' : receive == 'no' ? '未领取' : '已取消';
                            let color = receive == 'yes' ? '#008000' : receive == 'cancel' ? '#ff0000' : '';
                            return <span style={{ color }}>{status}</span>;
                        }
                    },
                    {
                        title: '生成时间',
                        key: 'created_at',
                        align: 'center',
                        sortable: 'custom',
                        render: (h, params) => {
                            return <span>{this.$root.newUnixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '领取时间',
                        key: 'gift_money_receive_time',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.newUnixTime(params.row.gift_money_receive_time)}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.gift_money_receive == 'no') {
                                return (
                                    <span
                                        class="cs"
                                        style="color:#008000"
                                        onClick={() => {
                                            this.cancel(params);
                                        }}
                                    >
                                        取消红包
                                    </span>
                                );
                            } else {
                                return <span>-</span>;
                            }
                        }
                    }
                ]
            },
            formRules: {
                userName: '',
                add_type: 'some',
                send_type:'',
                money_min: null,
                money_max: null,
                money_total: null,
                multiple:null
            },
            rules: {
                userName: [{ required: true, validator: validateName, trigger: 'blur' }],
                money_min: [
                    {
                        type: 'number',
                        required: true,
                        validator: money_min,
                        trigger: 'blur'
                    }
                ],
                money_max: [
                    {
                        type: 'number',
                        required: true,
                        validator: money_max,
                        trigger: 'blur'
                    }
                ],
                money_total: [
                    {
                        type: 'number',
                        required: true,
                        validator: money_total,
                        trigger: 'blur'
                    }
                ],
                multiple:[
                    {
                     type: 'number',
                        required: true,
                        validator: multiple,
                        trigger: 'blur'   
                    }
                ]
            }
        };
    },
    mounted() {
        for (let key in this.searchKey) {
            if (!this.searchKey[key]) delete this.searchKey[key];
        }
        let data = { ...this.searchKey };
        this.getData({ params: data });
        let params = { siteId: this.$root.nowSite.id };
        paiFaHongBaoConfigCode(params).then(res => {
            this.packList = res.data;
        });
    },
    methods: {
        memberaChange(val){
            this.$refs.formRules.resetFields();
            if(val == 'all'){
                this.formRules.money_min = null;
                this.formRules.money_max = null;
                this.formRules.money_total = null;
                this.formRules.multiple = null;
            }else{
                this.formRules.userName = '';
                this.formRules.multiple = null;
            }
           
           
        },
        confirm() {
            this.$refs.failureTips.hide();
        },
        changeRed(t) {
            this.selectType = t;
            if (t == 0) {
                this.searchKey.code = '';
                this.selectType = false;
            }
        },
        onClear() {
            this.date = '';
        },
        getData(data) {
            this.$root.startTableLoading();
            redSendList(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { data, total, statusCount } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                        const { yes, no, cancel } = statusCount;
                        this.yesList = yes;
                        this.noList = no;
                        this.cancelList = cancel;
                        console.log(this.yesList,this.noList,this.cancelList )
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => {
                    this.$root.endTableLoading();
                    this.table.data = [];
                });
        },
        searchSubmit() {
            this.isCode = this.selectType == '0' ? true : false;
            if (this.selectType == 'kuisun') {
                this.table1.columns.forEach(t => {
                    if (t.key == 'dama') t.title = '亏损条件';
                    if (t.key == 'value') t.title = '亏损金额';
                });
            }
            if (this.selectType == 'bet') {
                this.table1.columns.forEach(t => {
                    if (t.key == 'dama') t.title = '打码条件';
                    if (t.key == 'value') t.title = '有效投注';
                });
            }
            if (this.selectType == 'yingli') {
                this.table1.columns.forEach(t => {
                    if (t.key == 'dama') t.title = '派彩条件';
                    if (t.key == 'value') t.title = '派彩金额';
                });
            }
            if (this.selectType == 'chongzhi') {
                this.table1.columns.forEach(t => {
                    if (t.key == 'dama') t.title = '存款条件';
                    if (t.key == 'value') t.title = '存款金额';
                });
            }
            if (this.selectType == 'xianjin') {
                this.table1.columns.forEach(t => {
                    if (t.key == 'dama') t.title = '现金条件';
                    if (t.key == 'value') t.title = '现金金额';
                });
            }
            let { sortName, sort } = this.searchKey;
            if (sortName) delete this.searchKey.sortName;
            if (sort) delete this.searchKey.sort;
            this.table.columns.forEach(item => {
                if (item.sortable == 'custom') this.$set(item, 'sortType', '');
            });
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
            let data = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                data.startTime = startTime && this.$root.formatTime(startTime);
                data.endTime = endTime && this.$root.formatTime(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = data.startTime;
            this.searchKey.endTime = data.endTime;
            this.$refs.tables.setPage();
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
        },
        //添加红包
        addRed() {
            //  this.$refs.addReds.spinShow()
            this.$refs.formRules.validate(valid => {
                if (valid) {
                   if(!this.disabledBtn){


                  
                        if (this.formRules.money_max) {
                        this.formRules.money_min_max = this.formRules.money_min + '-' + this.formRules.money_max;
                        delete this.formRules.money_min;
                        delete this.formRules.money_max;
                    }
                    let data = {
                        ...this.formRules,
                        gift_money: 1,
                        siteId: this.$root.nowSite.id
                    };
                    for (let key in data) {
                        if (this.formRules.add_type == 'some') {
                            if (!data[key]) delete data[key];
                        } else {
                            if (!data[key] && key != 'money_min') delete data[key];
                        }
                    }
                    if (this.formRules.add_type == 'some' && !this.formRules.userName.includes(',')) {
                        this.$Tip.info({
                            content: '存入金额，名字与金额请以，英文逗号间隔'
                        });
                        this.$root.endEditLoading();
                        return false;
                    }
                
                  AddRed(data, true).then(res => {
                    this.$root.startEditLoading();
                        if (res != undefined && res.code == 200) {
                            const { bonusBlackList} = res.data;
                            let bonus, bonusDetail;
                            if (Array.isArray(bonusBlackList)) {
                                bonus = bonusBlackList.length;
                                bonusDetail = bonusBlackList.toString();
                              }
                            this.$refs.addReds.hide();
                            if(res.data.code==400&&this.formRules.add_type=='some'){
                                this.$refs.failureTips.show();
                                this.no_num=res.data.no_userName.length;
                                this.no_user=res.data.no_userName.join(',');
                            }
                            if (bonus==0) {
                                this.$Message.success('添加成功！');
                                let data = { ...this.searchKey };
                                this.getData({ params: data, query: { page: this.page } });
                                this.formRules.userName = '';
                                this.formRules.money_min = null;
                                this.formRules.money_max = null;
                                this.formRules.money_total = null;
                                this.formRules.multiple = null
                                this.formRules.add_type = 'some';
                                this.formRules.send_type=null;
                            } else if(bonus==undefined){
                          
                            }else {
                                    this.$Tip.showAddSub({
                                        show: true,
                                        bonus,
                                        bonusDetail
                                    });
                            }
                        }
                    });
                    this.disabledBtn = false;
							this.$root.startEditLoading();
							this.$emit("on-submit", params);
                    // .catch(err=>this.$refs.addReds.spinHide())
                }
                    }
               
               
                
            });
        },
        cancel(params) {
            this.$root.startTableLoading();
            let data = { siteId: this.$root.nowSite.id, ids: params.row.id };
            cancelRed(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        this.$Message.success('红包取消成功！');

                        let data = { ...this.searchKey };
                        this.getData({ params: data, query: { page: this.page } });
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        // separate(val) {
        //     let str = val.replace(/\s+/g, ',');
        //     str = str.substr(0, str.length - 1);
        //     let arr = str.split(',');
        //     let newStr = '';
        //     arr.forEach((item, index) => {
        //         if (index == 0 || index % 2 == 0) {
        //             newStr += item + ',';
        //         } else {
        //             newStr += item + '\n';
        //         }
        //     });
        //     this.formRules.userName = newStr;
        // },
        closeModel() {
            this.$refs.formRules.resetFields();
            this.formRules.userName = '';
            this.formRules.money_min = null;
            this.formRules.money_max = null;
            this.formRules.money_total = null;
            this.formRules.multiple = null;
            this.formRules.add_type = 'some';
            this.formRules.send_type=null;
        },
        //排序
        sortChange({ column, key, order }) {
            delete this.searchKey.sortName;
            delete this.searchKey.sort;
            let data = {
                sortName: key,
                sort: order,
                ...this.searchKey
            };
            this.searchKey.sortName = key;
            if (data.sort == 'normal') {
                this.table.columns.forEach(item => {
                    if (item.key == column.key) this.$set(item, 'sortType', 'asc');
                });
                this.searchKey.sort = 'asc';
                data.sort = 'asc';
            } else {
                this.table.columns.forEach(item => {
                    delete item.sortName;
                });
                this.searchKey.sort = order;
            }

            this.page == 1 ? '' : this.$refs.tables.setPage();
            this.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
        },
        //导出
        exportExcel() {
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            data.export = 'yes';
            let openr = window.open();
            redSendList({ params: data },true).then(res => {
                if (res != undefined && res.code == 200) {
                    let region = res.data.export_excel_url;
                    let openr1 = openr ? openr : window;
                    openr1.location.href = region;
                } else {
                    openr.close();
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../styles/button.less';
.content {
    text-align: center;
    form {
        margin: 40px auto;
    }
    .ivu-btn {
        width: 120px;
        height: 50px;
        font-size: 20px;
    }
}

/deep/.ivu-form-item-error-tip {
    width:200px;
    margin-left: 80px;
    text-align: left;
}
/deep/.ivu-input {
    height: 32px;
}
/deep/.money_min {
    width: 230px;
    .ivu-form-item-error-tip {
        left: 0%;
    }
}
/deep/.money_max {
    width: 160px;
    .ivu-form-item-error-tip {
        left: -45%;
    }
}
</style>