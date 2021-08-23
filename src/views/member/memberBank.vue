<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="状态">
                    <Select clearable v-model="searchKey.status" class="s-86" placeholder="全部">
                        <Option value="yes">正常</Option>
                        <Option value="no">停用</Option>
                    </Select>
                </FormItem>
                <FormItem label="银行卡号" v-if='!searchKey.bankId'>
                    <Input v-model="searchKey.cardNum" class="s-140" placeholder="请输入银行卡号" clearable/>
                </FormItem>
                <FormItem label="USDT地址" v-if='searchKey.bankId'>
                    <Input v-model="searchKey.cardNum" class="s-140" placeholder="请输入USDT地址" clearable/>
                </FormItem>
                <FormItem>
                    <Checkbox v-model="searchKey.isLike">
                        <span>模糊</span>
                    </Checkbox>
                </FormItem>
                <FormItem class="ml10f">
                    <Select v-model="searchKey.typeTag" class="s-100">
                        <Option value="userName">会员账号</Option>
                        <Option value="cardName">真实姓名</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input
                        v-model="searchKey.content"
                        :disabled="!searchKey.typeTag"
                        @keyup.enter.native="searchSubmit"
                        :placeholder="searchKey.typeTag == 'userName' ? '请输入会员账号' : '请输入真实姓名'"
                        class="s-140"
                    />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <!-- <div class="v2-search bb">
            <ButtonGroup class="repay-button1">
                <Button
                    :class="type == item.name ? 'active' : ''"
                    v-for="(item, i) in classList"
                    :value="item.id"
                    :key="i"
                    @click="changeType(item.name, item.bankId)"
                >
                    <span class="ml20 mr20">{{ item.name }}</span>
                </Button>
            </ButtonGroup>
        </div> -->
        <div>
            <Tabs type="card" @on-click="tabClick">
                <TabPane label="银行卡" name="银行卡"></TabPane>
                <TabPane label="USDT" name="USDT"></TabPane>
            </Tabs>
        </div>
        <div class="v2-table">
            <Tables
                ref="tables"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-change-status="onChangeStatus"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></Tables>
        </div>
        <!-- 编辑银行卡 -->
        <Modals ref="editCard" :title="searchKey.bankId?'编辑USDT':'编辑银行卡'" :width="760">
            <div slot="content" class="pt10">
                <Form ref="formKey" :model="formKey" :rules="rules" :label-width="260">
                    <FormItem label="会员账号">
                        <Input v-model="formKey.userName" class="w260x" disabled />
                    </FormItem>
                    <FormItem label="会员姓名">
                        <Input v-model="formKey.cardName" class="w260x" disabled />
                    </FormItem>
                    <div v-if='!searchKey.bankId'>
                        <FormItem label="银行名称" prop="bankName" >
                            <AutoComplete v-model="formKey.bankName" :data="bankList" class="w260x" element-id="autoSearch" :filter-method="filterMethod"></AutoComplete>
                        </FormItem>
                        <FormItem label="银行卡号" prop="cardNum">
                            <Input v-model="formKey.cardNum" class="w260x" />
                        </FormItem>
                        <FormItem label="银行归属地" prop="cardAddress">
                            <Input v-model="formKey.cardAddress" class="w260x" />
                        </FormItem>
                    </div>
                    <FormItem v-if='searchKey.bankId' label="USDT地址" prop="cardNum">
                        <Input v-model="formKey.cardNum" :maxlength="50" class="w260x" placeholder="请输入USDT地址" />
                    </FormItem>
                    <FormItem label="状态">
                        <Select class="w260x" v-model="formKey.status" :disabled="isDefault||searchKey.bankId=='1'">
                            <Option value="yes">正常</Option>
                            <Option value="no">停用</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="设为默认" class="h30">
                        <RadioGroup v-model="formKey.default">
                            <Radio label="yes">是</Radio>
                            <Radio label="no" class="ml10">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" class="ivu-btn submit h50" @click.prevent="editSubmit">确认保存</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
        <Modals ref="cardDetail" title="银行卡详情" :width="560">
            <div slot="content">
                <Form ref="cardDetail" :label-width="240">
                    <FormItem label="会员ID：">
                        <p class="w260x ti20">{{ cardDetail.uid }}</p>
                    </FormItem>
                    <FormItem label="会员账号：">
                        <p class="w260x ti20">{{ cardDetail.userName }}</p>
                    </FormItem>
                    <FormItem label="会员姓名：">
                        <p class="w260x ti20">{{ cardDetail.cardName }}</p>
                    </FormItem>
                    <FormItem label="银行名称：">
                        <p class="w260x ti20">{{ cardDetail.bankName }}</p>
                    </FormItem>
                    <FormItem label="银行卡号：">
                        <p class="w260x ti20">{{ cardDetail.cardNum }}</p>
                    </FormItem>
                    <FormItem label="银行归属地：">
                        <p class="w260x ti20">{{ cardDetail.cardAddress }}</p>
                    </FormItem>
                    <FormItem label="默认银行：">
                        <p class="w260x ti20">{{ cardDetail.default === 'yes' ? '是' : '否' }}</p>
                    </FormItem>
                    <FormItem label="银行卡状态：">
                        <p class="w260x ti20">{{ cardDetail.status === 'yes' ? '启用' : '停用' }}</p>
                    </FormItem>
                    <FormItem label="创建时间：">
                        <p class="w260x ti20">{{ $root.unixTime(cardDetail.created_at) }}</p>
                    </FormItem>
                    <FormItem label="更新时间：">
                        <p class="w260x ti20">{{ $root.unixTime(cardDetail.updated_at) }}</p>
                    </FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Modals from '@/components/modals';
import Icons from '@/components/icons';
import tableMixins from '@/mixins/table';
import { getUserType } from '@/libs/util';
import { AutoComplete } from 'view-design';
import { getbanklist, getbankdetail, changbankstatus, deletebank, getbankcode, bankCardUpdate, bankCardModifyStatus } from '@/api/member';
export default {
    name: 'memberBank',
    mixins: [tableMixins],
    components: { Tables, Icons, Modals, AutoComplete },
    data() {
        const validate = (rule, value, callback) => {
            let reg = /(^(\d{9,30})$)|\*+/;
            let reg1 = /[A-Za-z0-9]$/;
       
            if(!this.searchKey.bankId){  //银行卡
                if(this.formKey.cardNum=='') {
                    callback(new Error("请输入银行卡号"))
                }else if(!reg.test(this.formKey.cardNum)){
                    callback(new Error("请输入正确的银行卡号"))
                }else{
                    callback()
                }
            }else{
                if(this.formKey.cardNum=='') {
                    callback(new Error("请输入USDT地址"))
                }else if(!reg1.test(this.formKey.cardNum)){
                    callback(new Error("请输入正确的USDT地址"))
                }else{
                    callback()
                }
            }
        };
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            Time: [],
            searchKey: {
                status: 'all',
                typeTag: 'userName',
                isLike: false,
                siteId: this.$root.nowSite.id,
                bankId:0
            },
            index: '',
            formKey: {
                id: '',
                userName: '',
                cardName: '',
                bankName: '',
                cardNum: '',
                cardAddress: '',
                status: '',
                default: ''
            },
            isDefault: false, // 编辑的是否为默认银行
            cardDetail: {},
            type:'银行卡',
            classList:[
                {name:'银行卡',bankId:0},
                {name:'USDT',bankId:1}
            ],
            rules: {
                bankName: [
                    { required: true, message: '请选择或输入银行名称', trigger: 'change', pattern: /.+/ },
                    { pattern: /^[\u2E80-\u9FFF]+$/, trigger: 'change', message: '请输入正确的银行名称' }
                ],
                cardNum: [
                    { required: true,validator: validate, trigger: 'blur' },
                    // { required: true, pattern: /(^(\d{9,30})$)|\*+/, message: '请输入正确的银行卡卡号', trigger: 'blur' }
                ],
                cardAddress: [
                    {
                        required: true,
                        message: '请输入银行归属地',
                        trigger: 'blur'
                    }
                ],
                // USDTNum: [
                //     {
                //         required: true,
                //         message: '请输入USDT地址',
                //         trigger: 'blur'
                //     },
                //     {
                //         required: true,
                //         message: '请输入正确的USDT地址',
                //         pattern:  /[A-Za-z0-9]$/,
                //         trigger: 'blur'
                //     }
                // ]
            },
            bankList: [
                '工商银行',
                '农业银行',
                '建设银行',
                '招商银行',
                '中国银行',
                '浦发银行',
                '中信银行',
                '交通银行',
                '民生银行',
                '兴业银行',
                '邮政银行',
                '光大银行',
                '华夏银行',
                '浙商银行',
                '包商银行',
                '北京银行',
                '上海银行',
                ' 东莞银行',
                '广发银行 ',
                '平安银行',
                '徽商银行',
                '江苏银行',
                '农村信用社',
                '哈尔滨银行',
                '深圳发展银行',
                '广州农村商业银行'
            ],
            table: {
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                total: 100,
                columns: [],
                data: []
            },
            columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '姓名',
                        key: 'cardName',
                        align: 'center',
                        minWidth: 45,
                        tooltip: true,
                        className: 'pr5 pl5'
                    },
                    {
                        title: '银行名称',
                        key: 'bankName',
                        align: 'center',
                        tooltip: true,
                        minWidth: 55,
                        render:(h,params)=><span>{this.$root.text(params.row.bankName)}</span>
                    },
                    {
                        title: '银行卡号',
                        key: 'cardNum',
                        align: 'center',
                        minWidth: 150
                    },
                    {
                        title: 'USDT地址',
                        key: 'cardNum',
                        align: 'center',
                        tooltip: true,
                        minWidth: 55
                    },
                    {
                        title: '归属地',
                        key: 'cardAddress',
                        align: 'center',
                        minWidth: 180,
                        tooltip: true,
                        render:(h,params)=><span>{this.$root.text(params.row.cardAddress)}</span>
                    },
                    {
                        title: '默认银行',
                        key: 'default',
                        align: 'center',
                        minWidth: 50,
                        render: (h, params) => {
                            let color = params.row.default == 'yes' ? '' : '#ff2626';
                            return <span style={{ color: color }}>{params.row.default === 'no' ? '否' : '是'}</span>;
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 40,
                        render: (h, params) => {
                            let color = params.row.status == 'yes' ? '#444' : '#FF2626';
                            return <span style={{ color: color }}> {params.row.status === 'yes' ? '正常' : '停用'} </span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                            let color = params.row.default == 'no' ? '' : '#918b8b';
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('bankCardUpdate') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onEdit(params);
                                        }}
                                    >
                                        编辑
                                    </a>
                                    <a
                                        class="ib mr10"
                                        onClick={() => {
                                            if (params.row.default == 'no') this.onChangeStatus(params);
                                        }}
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('bankCardModifyStatus') != -1 ? 'inline-block' : 'none',
                                            color
                                        }}
                                    >
                                        {params.row.status == 'yes' ? '停用' : '启用'}
                                    </a>
                                    <a
                                        class="ib mr10"
                                        onClick={() => {
                                            this.deleteBank(params);
                                        }}
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('bankCardDelete') != -1 ? 'inline-block' : 'none'
                                        }}
                                    >
                                        删除
                                    </a>
                                </div>
                            );
                        }
                    }
                ],
        };
    },
    mounted(){
        if(this.authInPage.indexOf('bankCardUpdate') == -1&&
        this.authInPage.indexOf('bankCardModifyStatus') == -1&&
        this.authInPage.indexOf('bankCardDelete')==-1
         ){
            let arr=[];
            this.columns.forEach(t=>{
                if(t.title!='操作'){arr.push(t)}
            })
            this.columns=arr;
            
        }
        this.setColumns(this.columns)
    },
    methods: {
        tabClick(name){
            delete this.searchKey.cardNum
            this.type = name;
            this.searchKey.bankId = name=='银行卡'?0:1;
            this.setColumns(this.columns)
            let data={params:this.searchKey}
            this.getData(data)
        },
        setColumns(columns){
            if(!this.searchKey.bankId){
                this.table.columns = this.columns.filter(t=>{
                    if(t.title == '默认地址') t.title = '默认银行'
                    if(t.title == '会员姓名') t.title = '姓名'
                    return t.title != 'USDT地址'
                })
            }else {
                this.table.columns = columns.filter(t=>{
                    if(t.title == '默认银行') t.title = '默认地址'
                    if(t.title == '姓名') t.title = '会员姓名'
                    return t.title != '银行名称'&&t.title !='归属地'&&t.title!='银行卡号'
                })
            }
        },
        // changeType(name,id){
        //     delete this.searchKey.cardNum
        //     this.type = name;
        //     this.searchKey.bankId = id;
        //     this.setColumns(this.columns)
        //     let data={params:this.searchKey}
        //     this.getData(data)
        // },
        getData(data) {
            this.$root.startTableLoading();
            if (data.params.isLike) data.params.isLike = Number(data.params.isLike);

            if (data.params.status == 'all') delete data.params.status;
            getbanklist(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                }
                this.$root.endTableLoading();
            }).catch(err=>this.$root.endTableLoading())
        },
        //提交查询
        searchSubmit() {
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;

            if (params.cardNum) {
                params.cardNum = params.cardNum.replace(/\s/g, '');
                if (!/^\d{1,}$/.test(params.cardNum)&&!this.searchKey.bankId) {
                    this.$Tip.info({ content: '银行卡号只能是数字，请重新输入' });
                    return false;
                }
                if (!/[A-Za-z0-9]$/.test(params.cardNum)&&this.searchKey.bankId) {
                    this.$Tip.info({ content: 'USDT地址只能输入数字和字母，请重新输入' });
                    return false;
                }
            }
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            params.isLike = Number(this.searchKey.isLike);
            params.content = params.content && this.$root.trimAll(params.content);
            this.searchKey.content = this.searchKey.content && this.$root.trimAll(this.searchKey.content);
            if (!params.content) {
                delete params.content;
            } else {
                if (params.typeTag == 'userName') {
                    let reg = /^[0-9a-zA-Z-_]+$/;
                    if (!reg.test(params.content)) {
                        this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                        return false;
                    }
                } else {
                    let reg = /^[\u4e00-\u9fa5_-a-zA-Z0-9]+$/;
                    if (!reg.test(params.content)) {
                        this.$Tip.info({ content: '您所查询真实姓名不正确，请重新输入' });
                        return false;
                    }
                }
            }

            if (!params.status) params.status = 'all';

            this.getData({ params });
            this.$refs.tables.setPage();
        },
        //删除银行卡
        deleteBank(params) {
            let a = this.searchKey.bankId?`【${params.row.userName}】USDT地址`:params.row.bankName
            let text = '您确定删除' + a + '吗?';
            let msg = '删除' + a + '成功';
            const data = {
                siteId: this.$root.nowSite.id,
                id: params.row.id
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    deletebank(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            if (typeof res.data === 'string') {
                                this.$Message.config({
                                    top: 150
                                });
                                this.$Message.success({ content: msg });
                            }
                        }
                        this.table.data.splice(params.index, 1);
                    });
                }
            });
        },
        // 搜索补全项
        filterMethod(value, option) {
            return option.indexOf(value) != -1;
        },
        //改变银行卡的状态
        onChangeStatus(params) {
            let text, msg;
            let { status, id, bankName,userName } = params.row;
            if (status === 'yes') {
                if(!this.searchKey.bankId){
                    text = '您确定停用' + bankName + '吗？';
                    msg = '停用' + bankName + '成功';
                }else{
                    text = '您确定停用【' + userName + '】USDT地址吗？';
                    msg = '停用【' + userName + '】USDT地址成功';
                }
                
            }
            if (status === 'no') {
                if(!this.searchKey.bankId){
                    text = '您确定启用' + bankName + '吗？';
                    msg = '启用' + bankName + '成功';
                }else{
                    text = '您确定启用【' + userName + '】USDT地址吗？';
                    msg = '启用【' + userName + '】USDT地址成功';
                }
                
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id,
                status: params.row.status == 'yes' ? 'no' : 'yes'
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    bankCardModifyStatus(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            if (typeof res.data === 'string') {
                                this.$Message.config({
                                    top: 150
                                });
                                this.$Message.success({ content: msg });
                            }
                        }
                        params.row.status = status == 'yes' ? 'no' : 'yes';
                    });
                }
            });
        },
        //编辑银行卡
        onEdit(params) {
            this.$refs.formKey.resetFields();
            for (let key in this.formKey) {
                this.formKey[key] = params.row[key];
            }
            this.isDefault = params.row.default == 'no' ? false : true;
            this.index = params.index;
            this.$refs.editCard.show();
        },
        editSubmit() {
            let params = { ...this.formKey };
            params.siteId = this.$root.nowSite.id;
            if (params.cardNum.includes('*')) delete params.cardNum;
            else params.cardNum = params.cardNum.replace(/\s+/g, '');
            params.bankName = this.$root.trimAll(params.bankName);
            this.$refs.formKey.validate(valid => {
                if (valid) {
                    params.status = params.default == 'yes' ? 'yes' : params.status;
                    this.$refs.editCard.spinShow();
                    if(this.searchKey.bankId) {
                        delete params.bankName;
                        delete params.cardAddress;
                        delete params.userName
                    }
                    bankCardUpdate(params, true)
                        .then(res => {
                            this.$refs.editCard.spinHide();
                            if (res != undefined && res.code == 200) {
                                for (let key in params) {
                                    this.table.data[this.index][key] = params[key];
                                }
                                this.$refs.editCard.hide();
                                if (typeof res.data === 'string') {
                                    this.$Message.config({
                                        top: 150
                                    });
                                    this.$Message.success({ content: '修改银行卡成功' });
                                    let postData={...this.searchKey};
                                    for (let key in postData){
                                        if(!postData[key]) delete postData[key]
                                    }
                                    if (this.mixinPage == 1) this.getData({ params: postData});
                                    else this.getData({ params: postData, query: { page: this.mixinPage } });
                                }
                            }
                        })
                        .catch(() => {
                            this.$refs.editCard.spinHide();
                        });
                }
            });
        },
        onDetails(params) {
            const data = {
                siteId: this.$root.nowSite.id,
                id: params.row.id
            };
            getbankdetail(data).then(res => {
                this.cardDetail = res.data;
                this.$refs.cardDetail.show();
            });
        },
        //格式化银行卡号传入字符串
        formateCardNum(str) {
            if (str) {
                if (str.indexOf('*') === -1) {
                    let cardNum = '';
                    let index = -1;
                    for (let val of str) {
                        index++;
                        cardNum += val;
                        if (index !== 0 && index % 3 === 0) {
                            cardNum += ' ';
                            index = -1;
                        }
                    }
                    return cardNum;
                } else {
                    return str;
                }
            } else {
                return str;
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
.ivu-form-item {
    &:nth-child(2) {
        margin-right: -5px;
    }
}
/deep/.ivu-select-dropdown,
.ivu-auto-complete {
    top: 35px !important;
 
}
/deep/.ivu-select-dropdown-list{
      max-height: 200px !important;
}
/deep/.ivu-form-item-content {
    line-height: height 30px !important;
}

// 修改了设为默认一行
/deep/.ivu-form-item {
    .ivu-form-item-label {
        height: 30px;
    }

    .ivu-form-item-content {
        .ivu-radio-group {
            vertical-align: 0;
            height: 30px;
        }
    }
}
.ivu-form-item-label {
    padding: 0 12px 0 12px;
}

.ivu-form-item-content {
    line-height: 0;
}
/deep/.ivu-tabs-tab {
    font-size: 1rem !important;
}
/deep/.ivu-tabs-nav-container {
    margin-bottom: 0 !important;
}
// /deep/.ivu-tabs-bar {
//     margin-bottom:0 ;
// }
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
    height: 31px;
    overflow: inherit;
}
</style>
