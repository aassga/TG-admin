<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem>
                    <Button :class="!disabled ? 'bb-color blue-bd mr20' : 'mr20'" v-show="!disabled" @click.prevent="batchOut"><span>移出黑名单</span></Button>
                    <Button class="bb-color blue-bd" @click.prevent="showModals('addBlackList')">添加黑名单</Button>
                </FormItem>
                <!-- <FormItem label="活动类型">
                    <Select  filterable v-model="searchKey.activety_name" class="s-120" clearable placeholder="全部">
                        <Option v-for="(t, i) in activityList" :key="i" :value="t.name">{{ t.name }}</Option>
                    </Select>
                </FormItem> -->
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
        <!-- 添加黑名单 -->
        <Modals ref="addBlackList" title="添加活动黑名单" width="820">
            <div slot="content" class="mb20">
                <!-- <div class="f6Color mt20 mb20">
                    <Icons type="bangzhutishi" class="ib mt5 mb5 ml40" size="24"></Icons>
                    <p class="ib ft16 ml10 mb5">添加到指定活动类型中的黑名单会员不能参与相关活动</p>
                </div> -->
                <Form ref="addBlackInfo" :model="addBlackInfo" style="width:700px;" :rules="rules" :label-width="180">
                    <FormItem label="会员账号" prop="userNames">
                        <Input
                            type="textarea"
                            :autosize="{ minRows: 3, maxRows: 5 }"
                            v-model="addBlackInfo.userNames"
                            placeholder="可批量添加，一行一个"
                         
                        />
                    </FormItem>
                    <FormItem  class="clearfix" v-if="selectData.length>0">
                        <div style="margin-left:-75px;float: left;">
                            <span class="red-font"> {{selectData.length>0?'*':''}}</span> 
                             <span class="mr2"> {{selectData.length>0?'活动类型':''}}</span>
                        </div>
                        
                        <div class="b"   v-if="selectData.length>0"   :style="selectData.length>18?'height:185px;overflow-y:auto':''">
                            <span style="border-radius:5px;height:30px;line-height:30px;"   v-for=" (item, index) in selectData" :key="index" 
                            class=" ml5 ib b pl5 pr5 mr10 mt3 mb3"> {{item.name}}
                            <Icon type="ios-close" size="16" @click.stop="deleteItem(item)"  />
                        </span>
                        </div>
                    </FormItem>
                    
                    <!-- <FormItem class="clearfix" >
                        <div style="margin-left:-75px;" class="fl">
                            <span class="red-font"> {{selectData.length>0?'':'*'}}</span> 
                             <span class="mr2"> {{selectData.length>0?'':'活动类型'}}</span>
                        </div>   
                       <Input  :disabled="disabledInput" v-model="addBlackInfo.activety_name" @input="search($event)"   placeholder="请输入内容"/>
                       <div v-if="searchData.length>0" class="b mt5">
                            <checkbox  class=" ml5"  @on-change="val =>checkOne (t, val)" v-model="t.checked"    v-for="(t, index) in searchData" :key="index" >
                                <span >{{t.name}}</span> 
                            </checkbox>
                        </div>
                      <div v-else class="b mt5 tab-control-item" style="height:260px;overflow-y: auto;" >
                        <checkbox    class=" ml5" :indeterminate="indeterminate"  :value="checkAll"  @click.prevent.native="handleCheckAll">
                         <span>所有活动</span>
                        </checkbox>
 
                         <checkbox  class="ml5"  :disabled="disabledNew"   @on-change="val =>checkOne (t, val)" v-model="t.checked"    v-for="(t, index) in newArr" :key="index" >
                            <span >{{t.name}}</span> 
                        </checkbox>
                      </div>
                    </FormItem> -->
                    <FormItem class="mb20">
                        <Button type="primary" :loading="$root.editBtnLoading"  style="width:520px" class=" bg ft20  ivu-btn commonSubmit" @click.prevent="submit('add')">确认添加</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
        <Modals ref="editBlackList"  title="编辑活动黑名单" width="820">
            <div slot="content">
                <Form ref="editBlackInfo"  :model="editBlackInfo" style="width:700px;"  :label-width="180">
                    <FormItem label="会员账号">
                         <Input  v-model="editBlackInfo.userName" disabled/>
                    </FormItem>
                    <!-- <FormItem  class="clearfix"  >
                        <div style="margin-left:-75px;float: left;">
                            <span class="red-font"> {{selectData.length>0?'*':''}}</span> 
                             <span class="mr2"> {{selectData.length>0?'活动类型':''}}</span>
                        </div>
                        
                        <div class="b"   v-if="selectData.length>0"   :style="selectData.length>20?'height:175px;overflow-y:auto':''">
                            <span style="border-radius:5px;"   v-for=" (item, index) in selectData" :key="index" 
                            class=" ml5 ib b pl5 pr5 mr10 mt3 mb3"> {{item.name}}
                            <Icon type="ios-close" size="20" @click.stop="deleteItem(item)" />
                        </span>
                        </div>
                    </FormItem> -->
                    
                    <!-- <FormItem class="clearfix" >
                        <div style="margin-left:-75px;" class="fl">
                            <span class="red-font"> {{selectData.length>0?'':'*'}}</span> 
                             <span class="mr2"> {{selectData.length>0?'':'活动类型'}}</span>
                        </div>   
                       <Input  :disabled="disabledInput" v-model="addBlackInfo.activety_name" @input="search($event)"   placeholder="请输入内容"/>
                       <div v-if="searchData.length>0" class="b mt5">
                            <checkbox  class=" ml5"   @on-change="val =>checkOne (t, val)" v-model="t.checked"    v-for="(t, index) in searchData" :key="index" >
                                <span >{{t.name}}</span> 
                            </checkbox>
                        </div>
                      <div v-else class="b mt5 tab-control-item" style="height:260px;overflow-y: auto;" >
                        <checkbox    class=" ml5" :indeterminate="indeterminate"  :value="checkAll"  @click.prevent.native="handleCheckAll">
                         <span>所有活动</span>
                        </checkbox>
 
                         <checkbox  class="ml5"  :disabled="disabledNew"   @on-change="val =>checkOne (t, val)" v-model="t.checked"    v-for="(t, index) in newArr" :key="index" >
                            <span >{{t.name}}</span> 
                        </checkbox>
                      </div>
                    </FormItem> -->
                    <FormItem class="mb20" >
                        <Button type="primary" :loading="$root.editBtnLoading" style="width:520px" class=" bg ft20  ivu-btn commonSubmit" @click.prevent="submit('edit')">确认添加</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import { preferentialList, blackListShow, removeBlackList, addtoBlackList,blackListEdit } from '@/api/activity';
import Icons from '_c/icons';
import Modals from '_c/modals';
import Tables from '_c/tables';
import AutoSearch from '_c/auto-search';
export default {
    name: 'activityBlackList',
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
            disabledInput:false,
            indeterminate:false,
            checkAll: false,
            disabledNew:false,
            newArr:[],
            selectData:[],
            searchData:[],
            editBlackInfo:{
                userName:'',
            },
            exportPage:[],
            selectShow: true,
            checkedArr: [],
            activityList: [], //优惠活动下拉列表
            disabled: true, //移除黑名单的状态
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
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true,
                        render: (h, params) => <span>{this.$root.text(params.row.userName)}</span>
                    },
                  
                    {
                        title: '姓名',
                        key: 'realName',
                        align: 'center',
                        tooltip: true,
                        minWidth: 50,
                        render: (h, params) => <span>{this.$root.text(params.row.realName)}</span>
                    },
                    //   {
                    //     title: '活动类型',
                    //     key: 'activety_name',
                    //     align: 'center',
                    //     tooltip: true,
                    //     minWidth: 60
                    // },
                  
                       {
                        title: '创建时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => <span class="pl20 pr20">{this.$root.unixTime(params.row.created_at)}</span>
                    },
                      {
                        title: '备注',
                        key: 'remark',
                        align: 'center',
                        minWidth: 160,
                        tooltip: true,
                        render: (h, params) => <span class="pl20 pr20">{this.$root.text(params.row.remark)}</span>
                    },
                    // {
                    //     title: '操作',
                    //     align: 'center',
                    //     minWidth: 50,
                    //     render: (h, params) => (
                    //         <div>
                    //             <a class="mr5" onClick={()=>{
                    //                 this.searchData=[];
                    //                 this.selectData=[]
                    //                 this.newArr.forEach(t=>{ this.$set(t,'checked',false)}) 
                    //                 this.disabledInput=false;
                    //                 this.$refs.editBlackList.show();
                    //                 this.$refs.editBlackList.spinShow();
                    //                 this.editBlackInfo.userName=params.row.userName;
                                    
                    //                 if(params.row.activety_name=='所有活动'){
                    //                     this.checkAll=true;
                    //                     this.indeterminate=false;
                    //                     this.newArr.forEach(t=>{
                    //                         this.$set(t,'checked',true)
                    //                     })
                    //                     this.disabledNew=true;
                    //                     this.selectData=[{name:'所有活动'}]
                    //                 }else{  
                    //                     this.checkAll=false;
                    //                     this.indeterminate=true
                    //                     this.newArr.forEach(t=>{
                    //                         if(params.row.activety_name.includes(t.name)){
                    //                             this.$set(t,'checked',true)
                    //                             this.selectData.push(t)
                    //                         }
                    //                     })
                    //                 }
                    //                 this.editBlackInfo.activety_name=params.row.activety_name&&params.row.activety_name.split(',');
                    //                 this.editBlackInfo.id=params.row.id;
                    //                 this.$refs.editBlackList.spinHide();
                    //             }}>编辑</a>
                    //         <a
                    //             onClick={() => {
                    //                 this.$Tip.confirm({
                    //                     content: '您确定将此会员移出黑名单吗？',
                    //                     onOk: () => {
                    //                         let data = { siteId: this.$root.nowSite.id, ids: params.row.id };
                    //                         removeBlackList(data, true).then(res => {
                    //                             if (res != undefined && res.code == 200) {
                    //                                 this.$Message.success(res.data);
                    //                                 this.table.data.splice(params.index, 1);
                    //                                 this.table.total--;
                    //                             }
                    //                         });
                    //                     }
                    //                 });
                    //             }}
                    //         >
                    //             移除
                    //         </a>
                    //        </div>
                           
                    //     )
                    // }
                ]
            },
            addBlackInfo: {
                siteId: this.$root.nowSite.id,
                activety_name: '',
                userNames: ''
            },
            rules: {   
                userNames: [{ validator: validateUserNames, required: true, trigger: 'blur' }]
            },
        };
    },
    created() {
        this.$nextTick(() => {
            preferentialList().then(res => {
                res.data.list.forEach(item => {
                    if(item!='所有活动'){
                        this.newArr.push({ name: item, disabled: false });
                        this.activityList.push({ name: item, disabled: false });
                    }
                });
            });
        }); 
    },
  
    mounted() {
        for (let k in this.searchKey) {
            if (!this.searchKey[k]) delete this.searchKey[k];
        }
        this.getData({ params: this.searchKey });
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    watch: {
        checkedArr(val, oldVal) {
            if (val.length == 0) this.disabled = true;
        }
    },
    methods: {
        handleCheckAll(){
            if (this.indeterminate) {
                this.checkAll = false;
                this.selectData=[];
            } else {
                this.checkAll = !this.checkAll;
                // this.checkAll //true  全选
                if(this.checkAll){
                    this.disabledNew=true;
                    this.disabledInput=true;
                    this.selectData=[{name:'所有活动'}]
                }else{

                    this.disabledNew=false;
                    this.disabledInput=false;
                    this.selectData=[];
                }

            }
            this.indeterminate = false;
            if (this.checkAll) {
                this.newArr.forEach(t=>{
                    this.$set(t,'checked',true)
                })
                } else {
                    this.newArr.forEach(t=>{
                    this.$set(t,'checked',false)
                })
                }
 
        },
        checkOne(t){ 
            if(this.selectData.includes(t)){
                if(t.checked==false){
                 this.selectData.splice(this.selectData.indexOf(t),1);
               }

            }else{
                //添加
                if(t.name=='所有活动'){
                    if(t.checked==true){
                    this.disabledInput=true;
                    this.selectData=[{name:'所有活动',checked:true}]; 
                    }else{
                       this.disabledInput=false;
                       this.selectData=[{name:'所有活动',checked:false}]; 
                    }
                }else{
                    this.selectData.push(t);
                }
                this.selectData = this.selectData.filter((x, index,self)=>self.indexOf(x)===index) 
            }
            let len = this.newArr.length;
            let count = 0;
            if(this.newArr){
                this.newArr.forEach(t=>{
                    if(t.checked) count++;
                })
            }
           

            if (count) {
                if (count <this.newArr.length) {
                    this.indeterminate=true;
                    this.checkAll=false;
                } else {
                    this.$set(this.newArr, 'checked', true);
                    this.indeterminate = false;
                    this.checkAll=true;
                }
            } else { 
                this.$set(this.newArr, 'checked', false);
            }


        },
        deleteItem(t){ 
            const {name}=t;
            if(JSON.stringify(this.selectData).includes(name)){
                 //删除
                 if(name=="所有活动"){
                    this.selectData.forEach(f=>{
                        this.$set(f,'checked',false)
                    })                       
                    this.searchData.forEach(t=>{
                        this.$set(t,'checked',false)
                    })
                    this.newArr.forEach(t=>{
                        this.$set(t,'checked',false)
                    })
                    
                    this.selectData=[];
                    this.disabledNew=false;
                    this.disabledInput=false;
                    this.checkAll=false;
                    this.indeterminate=false;

                 }
                 if(name!="所有活动"){
                    this.selectData.forEach(f=>{
                     if(name==f.name){
                        this.$set(f,'checked',false)
                     }
                    })
                    this.selectData.splice(this.selectData.indexOf(t),1);
                    if(this.selectData.length==0){this.indeterminate=false;}
                 }
               
               
            }
        },
        search(event){

         let search = event;
            if (search) {
            if(search.includes('所')){
                this.searchData=[{name:'所有活动',checked:false}]

            }else{
                this.searchData = this.newArr.filter(function(product) {  

                // 每一项数据
                return Object.keys(product).some(function(key) {
                // 每一项数据的参数名
                return (

                    String(product[key])
                    // toLowerCase() 方法用于把字符串转换为小写。
                    .toLowerCase()
                    // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
                    .indexOf(search) > -1
                );
                });
                });
            }
              
      }else{
          if(JSON.stringify(this.selectData).includes('所有活动')){
            this.checkAll=true;
          }
         this.searchData.length=0
      }  },
        getData(data) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            this.$root.startTableLoading(this);
            blackListShow(data)
                .then(res => {
                    let { data, total } = res.data.data;
                    this.table.data = data;
                    this.table.total = total;
                    // 重置移出黑名单，没办法和onselection管理起来就查询时移出有问题在改
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
        blackListShow({params:data},true).then(res=>{
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
            this.checkAll=false;
            this.disabledNew=false;
            this.indeterminate=false;
            this.newArr.forEach(t=>{
                    this.$set(t,'checked',false)
                })
            this.selectData=[];
            this.searchData=[]
            this.$refs.addBlackInfo.resetFields();
            this.addBlackInfo = {};
            this.addBlackInfo.siteId = this.$root.nowSite.id;
            this.$refs[name].show();
        },
        //add-添加黑名单
        submit(stage) {
           
           if(stage=='add'){
            
            this.$refs.addBlackInfo.validate(valid => {
                if (valid) {
                       this.$root.startEditLoading();
                        this.addBlackInfo.userNames = this.addBlackInfo.userNames.replace(/ /g, '');
                        let data = JSON.parse(JSON.stringify(this.addBlackInfo));
                        if(this.checkAll){
                          data.activety_name='所有活动'
                        }else{
                        let c=[];
                        this.newArr.filter(item=>item.checked==true).forEach(t=>{
                            c.push(t.name)
                        })

                        data.activety_name=String(c);
                        }
                    
                        for (let key in  data){
                            if(!data[key]) delete data[key]
                        }
                    //     if(!data.activety_name){
                    //     this.$Message.error({content:'请选择活动类型'})
                    //     return false
                    //    }
                        this.$refs.addBlackList.spinShow();
                        addtoBlackList(data, true)
                            .then(res => {
                                this.$refs.addBlackList.spinHide();
                                if (res != undefined && res.code == 200) {
                                    const {in_whitelist,not_exists,already_exists_user_activety_list}=res.data;
                                    let userNameContent,userNameCount,whiteListContent,noWhiteListContent,activetyName,whiteCount,noWhiteCount;
                                    if(already_exists_user_activety_list&&already_exists_user_activety_list.length>0){
                                         //userName 具体的账户/个数   activety_name具体的类型
                                      const {userName,activety_name}=already_exists_user_activety_list[0];
                                      activetyName=activety_name;
                                      userNameCount=userName.length
                                      userNameContent=userName.toString()
                                    }
                                    if(in_whitelist){
                                       whiteListContent=in_whitelist.toString()
                                        whiteCount=in_whitelist.length;
                                    }
                                    if(not_exists){
                                        noWhiteListContent=not_exists.toString()
                                        noWhiteCount=not_exists.length;
                                    }
                              
                                   
                                    if(in_whitelist==0&&not_exists==0&&userNameCount==0){
                                       this.$Message.success({content:'添加黑名单成功'})
                                    }else{
                                      
                                        if(whiteCount>0){
                                            this.$Tip.showAddSub({
                                                show:true,
                                                whiteListContent,
                                                whiteCount,
                                            })
                                        }
                                        if(userNameCount>0){
                                            this.$Tip.showAddSub({
                                                show:true,
                                                activetyName,
                                                userNameCount,
                                                userNameContent,
                                            })
                                        }
                                        if(noWhiteCount>0){
                                            this.$Tip.showAddSub({
                                                show:true,
                                                noWhiteCount,
                                                noWhiteListContent,
                                            })

                                        }
                                    }
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
             let  data={...this.editBlackInfo,siteId:this.$root.nowSite.id} 
             if(this.checkAll){
                data.activety_name='所有活动'
               }else{
                    let c=[];
                    this.newArr.filter(item=>item.checked==true).forEach(t=>{
                            c.push(t.name)
                     })

                     data.activety_name=String(c);
               }
            // if(!data.activety_name){this.$Message.error({content:'请选择活动类型'});return  false;}
                 blackListEdit(data,true).then(res=>{
                     if(res!=undefined&&res.code==200){
 
                        const {in_whitelist,not_exists,already_exists_user_activety_list}=res.data;
                                    let userNameContent,userNameCount,whiteListContent,noWhiteListContent,activetyName,whiteCount,noWhiteCount;
                                    if(already_exists_user_activety_list&&already_exists_user_activety_list.length>0){
                                         //userName 具体的账户/个数   activety_name具体的类型
                                      const {userName,activety_name}=already_exists_user_activety_list[0];
                                      activetyName=activety_name;
                                      userNameCount=userName.length
                                      userNameContent=userName.toString()
                                    }
                                    if(in_whitelist){
                                       whiteListContent=in_whitelist.toString()
                                        whiteCount=in_whitelist.length;
                                    }
                                    if(not_exists){
                                        noWhiteListContent=not_exists.toString()
                                        noWhiteCount=not_exists.length;
                                    }
                              
                                    if((in_whitelist==0&&not_exists==0&&userNameCount==0)||(in_whitelist==undefined&&not_exists==undefined&&userNameCount==undefined)){
                                       this.$Message.success({content:'编辑黑名单成功'})
                                    }else{
                                      
                                        if(whiteCount>0){
                                            this.$Tip.showAddSub({
                                                show:true,
                                                whiteListContent,
                                                whiteCount,
                                            })
                                        }
                                        if(userNameCount>0){
                                            this.$Tip.showAddSub({
                                                show:true,
                                                activetyName,
                                                userNameCount,
                                                userNameContent,
                                            })
                                        }
                                        if(noWhiteCount>0){
                                            this.$Tip.showAddSub({
                                                show:true,
                                                noWhiteCount,
                                                noWhiteListContent,
                                            })

                                        }
                                    }
                                    this.$refs.editBlackList.hide();
                                    this.searchSubmit();
                                      this.$root.endEditLoading();
                     }
 
                 })
         }
         this.disabledInput=false;
        },
        batchOut() {
            if (!this.disabled) {
                let arr = [];
                this.checkedArr.forEach(item => arr.push(item.id));
                this.$Tip.confirm({
                    content: '您确定将所选会员移出黑名单吗?',
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
.box{
display: inline-block;
text-align: center; 
}

.bgColor{color:#2d8cf0;}

/deep/.ivu-table-column-center{
    padding-left:20px;
    padding-right: 20px;

}
</style>
