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
                <FormItem v-if="type=='银行卡管理'||type=='支付宝转卡'||type=='微信转卡'">
                    <Select class="s-110" v-model="searchKey.selectVal" @on-change="bankChange">
                        <Option value="bank_class">银行名称</Option>
                        <Option value="payee_name">持卡姓名</Option>
                        <Option value="bankId">银行卡号</Option>
                    </Select>
                </FormItem>
                <FormItem v-if="type=='微信转账'||type=='支付宝转账'">
                    <Select class="s-110" v-model="searchKey.selectVal" @on-change="accountChange">
                        <Option value="payee_name">收款姓名</Option>
                        <Option value="bankId">{{type=='微信转账'?'微信账号':'支付宝账号'}}</Option>
                    </Select>
                </FormItem>
                <FormItem :label="type=='支付宝扫码'||type=='微信扫码'?'收款姓名':''">
                    <Input placeholder="请输入内容" @keyup.enter.native="searchSubmit" v-model="searchKey.content" class="w140x" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-search bb">
            <ButtonGroup class="repay-button1">
                <Button
                    :class="type == item.className ? 'active' : ''"
                    v-for="(item, i) in classNameList"
                    :value="item.id"
                    :key="i"
                    @click="changeType(item.className, item.id, item.classType)"
                >
                    <span class="ml20 mr20">{{ item.className }}</span>
                </Button>
            </ButtonGroup>
        </div>
        <div class="v2-table">
            <Tables
            ref="table"
            editable
            :columns="table.columns"
            :loading="$root.tableLoading"
            :value="table.data"
            :total="table.total"
            :pageSizeOpts="table.pageSizeOpts"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
             ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '_c/tables';
import Icons from '_c/icons';
import { paymentClassName } from '@/api/finance';
import { checkDayBtn } from '@/libs/util';
import { reportBankAccountList } from '@/api/report';
export default {
    name: 'depositReport',
    components: {
        Tables,
        Icons
    },
    data() {
        return {
            totalData: [],
            screen: screen.width,
            btnList: ['今日', '昨天'],
            btnName: '今日',
            searchKey: {
                siteId: this.$root.nowSite.id,
                selectVal:'bank_class',
                content:''
            },
            Time: [this.$root.newstartTime(), new Date()],
            options:{
                disabledDate:date =>{
                return date && date.valueOf() > Date.now() || date.valueOf() < new Date(this.$root.twomonth());
                }
            },
            classNameList: [],
            alipyList: [],
            type: '银行卡管理',
            showId:0,
            showComponent: 'cardManagement',
            countPage:'',
            pageSize:20,
            limit: 20,
            table: {
                total: 0,
                pageSize: 20,
                pageSizeOpts: [20, 30, 40, 50],
                columns:[],
                columns1: [
                    {
                        title: '',
                        key: 'bank_class',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true,
                        renderHeader:(h,params)=>{
                            let title;
                            if(this.type=='银行卡管理'||this.type=='支付宝转卡'||this.type=='微信转卡') title = '银行名称';
                            if(this.type=='支付宝转账'||this.type=='微信转账') title = '转账类型';
                            return <span>{title}</span>
                        }
                    },
                    {
                        title: '',
                        key: 'payee_name',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true,
                        renderHeader:(h,params)=>{
                            let title;
                            if(this.type=='银行卡管理'||this.type=='支付宝转卡'||this.type=='微信转卡') title = '持卡姓名';
                            if(this.type=='支付宝扫码'||this.type=='微信扫码'||this.type=='支付宝转账'||this.type=='微信转账') title = '收款姓名';
                            return <span>{title}</span>
                        }
                    },
                    {
                        title: '',
                        key: 'bankId',
                        align: 'center',
                        minWidth: 160,
                        renderHeader:(h,params)=>{
                            let title;
                            if(this.type=='银行卡管理'||this.type=='支付宝转卡'||this.type=='微信转卡') title = '银行卡号';
                            if(this.type=='支付宝转账') title = '支付宝账号';
                            if(this.type=='微信转账') title = '微信账号';
                            return <span>{title}</span>
                        }
                    },
                    {
                        title: '存款金额',
                        key: '',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                    {params.row.deposit_amount}/{params.row.deposit_count}笔
                                </div>
                            );
                        }
                    },
                     {
                        title: '存款总额',
                        key: '',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                    {params.row.deposit_amount_total}/{params.row.deposit_count_total}笔
                                </div>
                            );
                        }
                    },
                    {
                        title: '最大单笔',
                        key: 'depositAmount',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                   {params.row.deposit_amount_max}
                                </div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return (
                                <span class="cs blue"
                                onClick={() => {
                                    const {bankId,depositId} = params.row;
                                    this.$router.push({
                                    name: "payCompany",
                                    query: {
                                    bankId,
                                    depositId,
                                    startTime: this.$root.formatTimeX(this.Time[0] ),
                                    endTime: this.$root.formatnightTimeS(this.Time[1]),
                                    },
                                    params: { from: "depositReport" }
                                });
                                }}
                                >详情</span>
                            );
                        }
                    }
                ],
                columns2: [
                    {
                        title: '扫码类型',
                        key: 'bank_class',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true,
                    },
                    {
                        title: '收款姓名',
                        key: 'payee_name',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true,
                    },
                    {
                        title: '存款金额',
                        key: '',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                    {params.row.deposit_amount}/{params.row.deposit_count}笔
                                </div>
                            );
                        }
                    },
                     {
                        title: '存款总额',
                        key: '',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                    {params.row.deposit_amount_total}/{params.row.deposit_count_total}笔
                                </div>
                            );
                        }
                    },
                    {
                        title: '最大单笔',
                        key: 'depositAmount',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                   {params.row.deposit_amount_max}
                                </div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            return (
                                <span class="cs blue"
                                onClick={() => {
                                    const {bankId,depositId} = params.row;
                                    this.$router.push({
                                    name: "payCompany",
                                    query: {
                                    bankId,
                                    depositId,
                                    startTime: this.$root.formatTimeX(this.Time[0] ),
                                    endTime: this.$root.formatnightTimeS(this.Time[1]),
                                    },
                                    params: { from: "depositReport" }
                                });
                                }}
                                >详情</span>
                            );
                        }
                    }
                ],
                data: []
            },
            id:0
        };
    },
    created() {
        paymentClassName({ classType: 'qr_code' }).then(res => {
            if (res != undefined && res.code == 200) {
                this.classNameList = res.data;
                this.alipyList = res.data;
                paymentClassName({ classType: 'transfer_bank' }).then(res => {
                    this.bankTypeList = res.data;
                    let newbank = {};
                    newbank['id'] = '0';
                    newbank['className'] = '银行卡管理';
                    this.classNameList.unshift(newbank);
                    this.bankTypeList.forEach(t => {
                        this.classNameList.push(t);
                    });
                });
                paymentClassName({ classType: 'transfer_account' }).then(res => {
                    this.bankTypeList = res.data;
                    let newbank = {};
                    this.bankTypeList.forEach(t => {
                        this.classNameList.push(t);
                    });
                });
            }
        });

    },
    mounted() {
        this.table.columns = this.table.columns1;
        let data = {
            siteId: this.$root.nowSite.id,
            pay_class_id:this.id,
            startTime:this.$root.formatTimeX(this.Time[0]),
            endTime:this.$root.formatnightTimeS(this.Time[1])
        };
        this.getData({ params: data });
    },
    methods: {
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
                    : this.$root.totalDataStartTime();
            this.searchKey.endTime =
                name == '今日'
                    ? this.$root.todayEndTime()
                    : name == '昨天'
                    ? this.$root.yesterdayEndTime()
                    : this.$root.totalDataEndTime();
            const { startTime, endTime } = this.searchKey;
           
            this.Time[0] = startTime;
            this.Time[1] = endTime;
            if(this.searchKey.content){
                if(this.searchKey.selectVal == 'bankId') this.searchKey.bankId=this.searchKey.content;
                if(this.searchKey.selectVal == 'bank_class') this.searchKey.bank_class=this.searchKey.content;
                if(this.searchKey.selectVal == 'payee_name') this.searchKey.payee_name=this.searchKey.content;
            }else{
                if(this.searchKey.selectVal == 'bankId') delete this.searchKey.bankId;
                if(this.searchKey.selectVal == 'bank_class') delete this.searchKey.bank_class;
                if(this.searchKey.selectVal == 'payee_name') delete this.searchKey.payee_name;
            }
            let data = {
                params:{
                    ...this.searchKey,
                    limit:this.limit
                }
            };
            for(let key in data.params){
                if(!data.params[key] || key == 'selectVal') delete data.params[key];
            }
            data.params.pay_class_id = this.id;
            this.getData(data);
        },
        bankChange(val){ 
            this.searchKey.content = '';
            delete this.searchKey.bankId;
            delete this.searchKey.bank_class;
            delete this.searchKey.payee_name;
                   },
        accountChange(val){
            this.searchKey.content = '';
            delete this.searchKey.bankId;
            delete this.searchKey.bank_class;
            delete this.searchKey.payee_name;
        },
        changeType(name, id, classType) {
            delete this.searchKey.bankId;
            delete this.searchKey.bank_class;
            delete this.searchKey.payee_name;

            this.searchKey.content = '';
            this.id = id;
            this.type = name;
            this.table.columns = this.type=='支付宝扫码' || this.type=='微信扫码'? this.table.columns2:this.table.columns1
            if(this.type == '支付宝转账' || this.type == '微信转账') this.searchKey.selectVal = 'payee_name';
            if(this.type == '支付宝扫码' || this.type == '微信扫码') this.searchKey.selectVal = 'payee_name';
            let data = {
            siteId: this.$root.nowSite.id,
            pay_class_id:this.id,
            startTime:this.$root.formatTimeX(this.Time[0]),
            endTime:this.$root.formatnightTimeS(this.Time[1])
        };
        this.getData({ params: data });
            
        },
        getData(data) {
            this.$root.startTableLoading();
            reportBankAccountList(data).then(res => {
                this.table.data = res.data.data;
                this.table.total = res.data.total;
                this.$root.endTableLoading();
            });
        },
        //点击分页
        onPageChange(page) {
            this.countPage = page;
            if(this.searchKey.content){
                if(this.searchKey.selectVal == 'bankId') this.searchKey.bankId=this.searchKey.content;
                if(this.searchKey.selectVal == 'bank_class') this.searchKey.bank_class=this.searchKey.content;
                if(this.searchKey.selectVal == 'payee_name') this.searchKey.payee_name=this.searchKey.content;
            }else{
                if(this.searchKey.selectVal == 'bankId') delete this.searchKey.bankId;
                if(this.searchKey.selectVal == 'bank_class') delete this.searchKey.bank_class;
                if(this.searchKey.selectVal == 'payee_name') delete this.searchKey.payee_name;
            }
            let data = {
                ...this.searchKey,
                startTime:this.$root.formatTimeX(this.Time[0]),
                endTime:this.$root.formatnightTimeS(this.Time[1]),
                limit:this.limit
            }
            for(let key in data){
                if(!data[key] || key == 'selectVal' ||key=='content') delete data[key];
            }
            data.pay_class_id = this.id;
            this.getData({params:data,query: { page }});
        },
        onPageSizeChange(pageSize) {
            this.limit = pageSize;
            if(this.searchKey.content){
                if(this.searchKey.selectVal == 'bankId') this.searchKey.bankId=this.searchKey.content;
                if(this.searchKey.selectVal == 'bank_class') this.searchKey.bank_class=this.searchKey.content;
                if(this.searchKey.selectVal == 'payee_name') this.searchKey.payee_name=this.searchKey.content;
            }else{
                if(this.searchKey.selectVal == 'bankId') delete this.searchKey.bankId;
                if(this.searchKey.selectVal == 'bank_class') delete this.searchKey.bank_class;
                if(this.searchKey.selectVal == 'payee_name') delete this.searchKey.payee_name;
            }
            let data = {
                ...this.searchKey,
                startTime:this.$root.formatTimeX(this.Time[0]),
                endTime:this.$root.formatnightTimeS(this.Time[1]),
                limit:this.limit
            }
            for(let key in data){
                if(!data[key] || key == 'selectVal' ||key=='content') delete data[key];
            }
            data.pay_class_id = this.id;
            this.getData({params:data});
            this.pageSize = pageSize;
        },
        //查询
        searchSubmit() {
            if(new Date(this.Time[0]).getTime()<new Date(this.$root.twomonth()).getTime()){
               this.$Tip.info({content:"最多可查询2个月数据"})
                return false; 
            }
            if(new Date(this.Time[1]).getTime()-new Date(this.Time[0]).getTime()>604800000){
                this.$Tip.info({content:"查询日期不能大于七天"})
                return false;
            }
            
            if(this.searchKey.content){
                if(this.searchKey.selectVal == 'bankId') this.searchKey.bankId=this.searchKey.content;
                if(this.searchKey.selectVal == 'bank_class') this.searchKey.bank_class=this.searchKey.content;
                if(this.searchKey.selectVal == 'payee_name') this.searchKey.payee_name=this.searchKey.content;
            }else{
                if(this.searchKey.selectVal == 'bankId') delete this.searchKey.bankId;
                if(this.searchKey.selectVal == 'bank_class') delete this.searchKey.bank_class;
                if(this.searchKey.selectVal == 'payee_name') delete this.searchKey.payee_name;
            }
         
            let data = {...this.searchKey};

            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                data.startTime = startTime && this.$root.formatTimeX(startTime);
                data.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if(this.Time[0] == '' && this.Time[1] == ''){
                this.$Tip.info({ content: '请输入开始和结束时间' });
                return false;
            }
             for(let key in data){
                 if(!data[key] || key == 'selectVal' ||key=='content') delete data[key];
            }
           
            // 对应组件的页码 
            this.$refs.table.setPage();
            data.siteId = this.$root.nowSite.id;
            data.pay_class_id = this.id;
            this.getData({ params: data});
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
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