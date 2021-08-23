<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem>
                    <Button :class="!disabled ? 'bb-color blue-bd mr20' : 'mr20'" v-show="!disabled" @click.prevent="batchOut"><span>移出白名单</span></Button>
                    <Button class="bb-color blue-bd" @click.prevent="showModals('addBlackList')">添加白名单</Button>
                </FormItem>
                <FormItem label="活动类型">
                    <Select v-model="searchKey.activety_name" class="s-120" clearable placeholder="全部">
                        <Option v-for="(t, i) in activityList" :key="i" :value="t.name">{{ t.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" class="s-160" v-model="searchKey.userNames" clearable />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary"
                    class="ivu-btn export"
                    @click.prevent="exportExcel"
                    :loading="$root.exportBtnLoading">导出Excel</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                :loading="$root.tableLoading"
                :total="table.total"
                :value="table.data"
                :columns="table.columns"
                @on-selection-change="onSelectionChange"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                :pageSizeOpts="table.pageSizeOpts"
            ></Tables>
        </div>
        <!-- 添加白名单 -->
        <Modals ref="addBlackList" title="添加活动白名单" width="585">
            <div slot="content" class="mb20">
                <div class="f6Color mt20 mb20">
                    <Icons type="bangzhutishi" class="ib mt5 mb5 ml40" size="24"></Icons>
                    <p class="ib ft16 ml10 mb5">添加到指定活动类型中的白名单会员不能参与相关活动</p>
                </div>
                <Form ref="addBlackInfo" :model="addBlackInfo" style="width:585px;" :rules="rules" :label-width="150">
                    <FormItem label="会员账号" class="mb20" prop="userNames">
                        <Input
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 5 }"
                            v-model="addBlackInfo.userNames"
                            placeholder="可批量添加，一行一个，如：          xxxx                                                   yyyy"
                            class="w260x"
                        />
                    </FormItem>
                    <FormItem label="活动类型" prop="activety_name">
                        <Select ref="select" v-model="addBlackInfo.activety_name" multiple class="w260x" transfer @on-change="onChange">
                            <Option v-for="(t, i) in activityList" :key="i" :value="t.name" :disabled="t.disabled">{{ t.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class="mb20">
                        <Button type="primary" :loading="$root.editBtnLoading" style="width:260px" class=" bg ft20  ivu-btn commonSubmit" @click.prevent="submit('add')">确认添加</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
        <Modals ref="editBlackList"  width="585" title="编辑活动白名单">
            <div slot="content">
                <Form ref="editBlackInfo"  :model="editBlackInfo" style="width:585px;" :rules="editRules" :label-width="150">
                    <FormItem label="会员账号">
                         <Input class="w260x" v-model="editBlackInfo.userName" disabled/>
                    </FormItem>
                    <FormItem label="活动类型" prop="activety_name" >
                        <Select  v-model="editBlackInfo.activety_name" multiple class="w260x" transfer @on-change="onChange">
                            <Option v-for="(t, i) in activityList" :key="i" :value="t.name" >{{ t.name }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem class="mb20">
                        <Button type="primary" :loading="$root.editBtnLoading" style="width:260px" class=" bg ft20  ivu-btn commonSubmit" @click.prevent="submit('edit')">确认添加</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import { preferentialList, whiteListShow, removeBlackList, addtoBlackList,blackListEdit } from '@/api/activity';
import Icons from '_c/icons';
import Modals from '_c/modals';
import Tables from '_c/tables';
import AutoSearch from '_c/auto-search';
export default {
    name: 'whiteList',
    components: {
        Icons,
        Tables,
        Modals,
        AutoSearch
    },
    data() {
        const validateUserNames = (rule, value, cb) => {
            if (!value || value == '') {
                cb('请输入会员账号');
            } else {
                let regVal = value.replace(/[\r\n]/g, ',').split(',');
                let flagArr = [];
                regVal.forEach(t => {
                    t = t.replace(/\s+/g, '');
                    flagArr.push(/^[a-zA-Z0-9-_]{5,20}$/.test(t));
                });
                if (flagArr.includes(false)) cb('会员账号中含有不正确会员账号');
                else cb();
            }
        };
        return {
            editBlackInfo:{
                userName:'',
                activety_name:'',
            },
            exportPage:[],
            selectShow: true,
            checkedArr: [],
            activityList: [], //优惠活动下拉列表
            disabled: true, //移除白名单的状态
            searchKey: {
                activety_name: '',
                limit: 20,
                userNames: '',
                siteId: this.$root.nowSite.id
            },
            table: {
                total: 0,
                data: [],
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                columns: [
                    {
                        type: 'selection',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '活动类型',
                        key: 'activety_name',
                        align: 'center',
                        tooltip: true,
                        minWidth: 60
                    },
                    {
                        title: '会员账号',
                        key: 'username',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true,
                        render: (h, params) => <span>{this.$root.text(params.row.username)}</span>
                    },
                    {
                        title: '姓名',
                        key: 'realName',
                        align: 'center',
                        tooltip: true,
                        minWidth: 50,
                        render: (h, params) => <span>{this.$root.text(params.row.realName)}</span>
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => <span class="pl20 pr20">{this.$root.unixTime(params.row.created_at)}</span>
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 50,
                        render: (h, params) => (
                            <div>
                                <a class="mr5" onClick={()=>{
                                    this.$refs.editBlackList.show();
                                    this.$refs.editBlackList.spinShow();
                                    this.editBlackInfo.userName=params.row.userName;
                                    this.editBlackInfo.activety_name=params.row.activety_name;
                                    this.editBlackInfo.id=params.row.id;
                                    this.$refs.editBlackList.spinHide();
                                }}>编辑</a>
                            <a
                                onClick={() => {
                                    this.$Tip.confirm({
                                        content: '您确定将此会员移出白名单吗？',
                                        onOk: () => {
                                            let data = { siteId: this.$root.nowSite.id, ids: params.row.id };
                                            removeBlackList(data, true).then(res => {
                                                if (res != undefined && res.code == 200) {
                                                    this.$Message.success(res.data);
                                                    this.table.data.splice(params.index, 1);
                                                    this.table.total--;
                                                }
                                            });
                                        }
                                    });
                                }}
                            >
                                移除
                            </a>
                           </div>
                           
                        )
                    }
                ]
            },
            addBlackInfo: {
                siteId: this.$root.nowSite.id,
                activety_name: '',
                userNames: ''
            },
            rules: {
                activety_name: [{ required: true, message: '请选择活动类型', trigger: 'change', pattern: /.+/ }],
                userNames: [{ validator: validateUserNames, required: true, trigger: 'blur' }]
            },
            editRules:{
                activety_name: [{ required: true, message: '请选择活动类型', trigger: 'change', pattern: /.+/ }],
            }
        };
    },
    created() {
        this.$nextTick(() => {
            preferentialList().then(res => {
                res.data.list.forEach(item => {
                    this.activityList.push({ name: item, disabled: false });
                });
            });
        }); 
    },
  
    mounted() {
        for (let k in this.searchKey) {
            if (!this.searchKey[k]) delete this.searchKey[k];
        }
        this.getData( this.searchKey);
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    watch: {
        'addBlackInfo.activety_name': {
            handler(val, oldVal) {
                if (val && val.indexOf('所有活动') != -1) {
                    val.forEach((item, index) => {
                        if (item != '所有活动') val.splice(index, 1);
                    });
                    this.activityList.forEach(item => {
                        if (item != '所有活动') item.disabled = true;
                    });
                } else if (val && val.indexOf('所有活动') == -1) {
                    this.selectShow = true;
                    //复位禁止
                    this.activityList.forEach(item => {
                        item.disabled = false;
                    });
                }
            },
            deep: true
        },
        checkedArr(val, oldVal) {
            if (val.length == 0) this.disabled = true;
        }
    },
    methods: {
        //下拉框选择全部关闭下拉框
        onChange(val) {
            if (val.length === 1 && val[0] === '所有活动') {
                this.$refs.select.visible = false;
            }
        },
        onOpenChange() {},
        getData(data) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            this.$root.startTableLoading(this);
            whiteListShow(data)
                .then(res => {
                    let { data, total } = res.data.data;
                    this.table.data = data;
                    this.table.total = total;
                    // 重置移出白名单，没办法和onselection管理起来就查询时移出有问题在改
                    this.disabled = true;
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        //查询
        searchSubmit() {
            let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (data.userNames) data.userNames = this.$root.trimAll(data.userNames);
            if (data.userNames && !this.$root.validateName(data.userNames)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params: data });
        },
        exportExcel(){
        this.exportPage = [];
        let data = {
            ...this.searchKey,
            limit:this.pageSize,
            export:'yes',
        };

        this.$root.startEditLoading();
        let openr=window.open();
        blackListShow({params:data}).then(res=>{
            if(res!=undefined&&res.code==200){
                let region=res.data.export_excel_url;
                let openr1 = openr ? openr : window;
                openr1.location.href = region;

            }else{
                openr.close();
            }   
            this.$root.endEditLoading();
        }).catch(error => this.$root.endEditLoading())
    },
        onSelectionChange(value) {
            this.checkedArr = value;
            if (value.length > 0) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        },
        showModals(name) {
            this.$refs.addBlackInfo.resetFields();
            this.addBlackInfo = {};
            this.addBlackInfo.siteId = this.$root.nowSite.id;
            this.$refs[name].show();
        },
        //add-添加白名单
        submit(stage) {
            this.$root.startEditLoading();
           if(stage=='add'){
            
            this.$refs.addBlackInfo.validate(valid => {
                if (valid) {
                  
                
                        this.addBlackInfo.userNames = this.addBlackInfo.userNames.replace(/ /g, '');
                        let data = JSON.parse(JSON.stringify(this.addBlackInfo));
                        data.activety_name = data.activety_name.join(',');
                        this.$refs.addBlackList.spinShow();
                        addtoBlackList(data, true)
                            .then(res => {
                                this.$refs.addBlackList.spinHide();
                                if (res != undefined && res.code == 200) {
                                    this.$Message.success(res.data);
                                    this.$refs.addBlackList.hide();
                                    this.searchSubmit();
                                }
                            })
                            .catch(error => {
                                this.$refs.addBlackList.spinHide();
                            });
            }
            });
            
        }

         if(stage=='edit'){
           this.$refs.editBlackInfo.validate(valid=>{
               if(valid){
                         let  data={...this.editBlackInfo,siteId:this.$root.nowSite.id,activety_name:String(this.editBlackInfo.activety_name) }  
                 blackListEdit(data,true).then(res=>{
                     if(res!=undefined&&res.code==200){
                         this.$Message.success(res.data);
                        this.$refs.editBlackList.hide();
                        this.searchSubmit();
                        this.$root.endEditLoading();
                     }
 
                 })
               }
           })
         }
        },
        batchOut() {
            if (!this.disabled) {
                let arr = [];
                this.checkedArr.forEach(item => arr.push(item.id));
                this.$Tip.confirm({
                    content: '您确定将所选会员移出白名单吗?',
                    onOk: () => {
                        let data = { siteId: this.$root.nowSite.id, ids: arr.join(',') };
                        removeBlackList(data, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success(res.data);
                                this.searchSubmit();
                            }
                        });
                    }
                });
            }
        },
        onPageChange(page) {
            let data = { params: this.searchKey, query: { page } };
            this.getData(data);
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            this.getData({ params: this.searchKey });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.mb0 {
    margin-bottom: 0;
}
.v2-search {
    .bb-color {
        background-color: #2d8cf0;
        color: #fff;
    }
    /deep/.ft14 {
        font-size: 0.875rem;
    }
}
</style>
