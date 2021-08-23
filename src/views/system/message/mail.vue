<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <div class="v2-button">
                    <Button @click="delSelect('del')" v-show="!disabled">删除选中</Button>
                    <Button   @click="delSelect('withdraw')"v-if="!disabled" v-show="this.newName=='getGroupEMail'">撤回选中</Button>
                    <Button v-show="!disabled" v-if="showComponent == 'getEMail' && (adminType == 'super' || authInPage.indexOf('letterReply') != -1)" @click="replyselect"
                        >回复选中</Button
                    >
                    <Button @click="sendMessage()" v-if="adminType == 'super' || authInPage.indexOf('letterSend') != -1">
                        <Icons type="fazhanneixin" size="14"></Icons>发站内信
                    </Button>
                    <Button @click="registerMessage">注册信息</Button>
                </div>
                <FormItem label="标题">
                    <Input v-model="searchKey.title" placeholder="输入标题关键字" :class="[screen < 1600 ? 'w140x' : '']" />
                </FormItem>
                <FormItem label="发件人" v-show="showMail" key="a">
                    <Input v-model="searchKey.send_username" placeholder="输入发件人账号" :class="[screen < 1600 ? 'w140x' : '']" />
                </FormItem>
                <FormItem v-show="!showMail" key="b">
                    <Select v-model="searchKey.typeTag" @on-change="changePeo">
                        <Option value="send_username">发件人</Option>
                        <Option value="to_username">收件人</Option>
                    </Select>
                </FormItem>
                <FormItem v-show="!showMail"  key="c">
                    <Input
                        v-if="searchKey.typeTag=='to_username'"
                        placeholder='请输入收件人账号'
                        :class="[screen < 1600 ? 'w140x' : '']"
                        v-model="searchKey.to_username"
                    />
                    <Input
						v-if="searchKey.typeTag=='send_username'"
						v-model="searchKey.send_username"
						placeholder="输入发件人账号"
						:class="[screen<1600?'w140x':'']"
					/>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" :loading="$root.tableLoading" @click="searchSubmit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-search">
            <div class="repay-button bb" style="height:38px">
                <button
                    style="border-bottom:0"
                    :class="showComponent === 'getEMail' ? 'ivu-btn active cs' : 'ivu-btn cs'"
                    @click="changeItem('getEMail')"
                    v-if="adminType == 'super' || authInPage.indexOf('inBox') != -1"
                    class="ft16 fontColor"
                >
                    收件箱
                </button>
                <button
                    style="border-bottom:0"
                    :class="showComponent === 'sendEMail' ? 'ivu-btn active cs' : 'ivu-btn cs'"
                    @click="changeItem('sendEMail')"
                    v-if="adminType == 'super' || authInPage.indexOf('outBox') != -1"
                    class="ft16 fontColor"
                >
                    发件箱
                </button>
                <button style="border-bottom:0"
                :class="showComponent === 'getGroupEMail' ? 'ivu-btn active cs' : 'ivu-btn cs'"
                @click="changeItem('getGroupEMail')"
                class="ft16 fontColor">
                群发件</button>
               
            </div>
        
        </div>
        <Tables
            ref="tables"
            class="v2-table"
            :page="table.page"
            :loading="$root.tableLoading"
            :value="table.data"
            :columns="table.columns"
            :total="table.total"
            :showSizer="true"
            @on-details="onDetails"
            @on-reply="reply"
            @on-selection-change="onSelectionChange"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
        ></Tables>
        <Modals ref="Modals" title="收件箱回复" width="620">
            <div slot="content" class="modal-overflow" style="width:620px">
                <Form ref="sendInfor" :model="sendInfor" :label-width="180" :rules="rules">
                    <FormItem label="回复账号">
                        <Input class="w290x" v-model="sendInfor.account" disabled />
                    </FormItem>
                    <FormItem label="回复内容" prop="content">
                        <Input class="w290x" type="textarea" :rows="4" v-model="sendInfor.content" />
                    </FormItem>
                    <div class="mb30">
                        <Button class="send ft20" @click.prevent="send">发送</Button>
                    </div>
                </Form>
            </div>
        </Modals>
        <Modals ref="ModalsMessage" :title="titleMsg" width="480">
            <div slot="content" class="modal-overflow modal-scroll">
                <div style="width:400px">
                    <Form ref="formKey" :label-width="95">
                        <FormItem>
                            <div>{{ content }}</div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modals>
        <!-- 注册信息 -->
        <Modals title="注册信息" ref="registerMessage" width="800">
            <div slot="content">
                <Form :label-width="120" ref="registerFormKey" :model="registerFormKey" :rules="registerRules">
                    <FormItem label="信息标题" prop="title">
                        <Input class="w600x" placeholder="请输入标题" v-model="registerFormKey.title" />
                    </FormItem>
                    <FormItem label="信息内容" prop="content">
                        <Input type="textarea" :rows="4" placeholder="请输入内容" class="w600x" v-model="registerFormKey.content" />
                    </FormItem>
                    <Button class=" ivu-btn  submit mb50 ft18 ml270" :loading="$root.editBtnLoading" @click.prevent="save" type="primary">确认保存</Button>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '_c/tables';
import tableMixins from '@/mixins/table';
import Icons from '@/components/icons';
import { getUserType } from '@/libs/util';
import { inBox, letterDetail, letterDel, 
    sendBox, letterUptRead, letterReply, messageRegisterMessage, 
    messageRegisterInfo,getMessageGroupList,
    messageGroupDel,messageGroupWithdraw
} from '@/api/system';
import Modals from '@/components/modals';
export default {
    name: 'mail',
    components: {
        Tables,
        Modals,
        Icons
    },
    data() {
        return {
            newName: 'getEMail',
            adminType: getUserType(),
            showMail: true,
            disabled: true,//撤回，删除不显示
            screen: screen.width,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            registerFormKey: {},
            showComponent: 'getEMail',//getEMail  发件箱 sendEMail   群发件 getGroupEMail
            Time: [this.$root.startTime(), this.$root.formatnightTimeS()],
            content: '',
            titleMsg: '',
            selectStatus: [],
            searchKey: {
                typeTag: 'to_username', //发件人是send _username  //收件人 to_username
                send_username: '',
                to_username:'',
                title: '',
                siteId:this.$root.nowSite.id,
            },
            sendInfor: {
                title: '',
                content: '',
                account: '',
                siteId:this.$root.nowSite.id,
            },
            registerRules: {
                title: {
                    required: true,
                    message: '请输入标题',
                    trigger: 'blur',
                    pattern: /.+/
                },
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur',
                        pattern: /.+/
                    }
                ]
            },
            rules: {
                content: [
                    {
                        required: true,
                        message: '请输入回复内容',
                        trigger: 'blur',
                        pattern: /.+/
                    }
                ],
                title: [
                    {
                        required: true,
                        message: '请输入回复标题',
                        trigger: 'blur',
                        pattern: /.+/
                    }
                ]
            },
            table: {
                total: 0,
                more: true,
                page: true,
                loading: true,
                columns: [],
                data: []
            },
            sendtable: {
                loading: true,
                sendcolumns: [
                    {
                        type: 'selection',
                        title: '全选',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '发件人',
                        key: 'send_username',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '收件人',
                        key: 'to_username',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center',
                        tooltip: true,
                        minWidth: 95
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        tooltip: true,
                        className: 'pl10 pr10',
                        minWidth: 120
                    },
                    {
                        title: '发送时间',
                        key: 'send_time',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => {
                            return <span class="pl20 pr20">{this.$root.unixTime(params.row.send_time)}</span>;
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 50,
                        render: (h, params) => {
                            return (
                                <div>
                                    <Icons type={params.row.status == 'yes' ? 'yidu' : 'weidu'} color={params.row.status == 'yes' ? '#B3B3B3' : '#57A3F3'} size="20" />
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
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('letterDetail') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onDetails(params,'sendEMail');
                                        }}
                                    >
                                        详情
                                    </a>
                                    <a
                                        class="ib mr10 cs"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('letterDel') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onDel(params);
                                        }}
                                    >
                                        删除
                                    </a>
                                </div>
                            );
                        }
                    }
                ],
                getcolumns: [
                    {
                        type: 'selection',
                        title: '全选',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '发件人',
                        key: 'send_username',
                        align: 'center',
                        minWidth: 85
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center',
                        minWidth: 110,
                        tooltip: true
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        minWidth: 120,
                        className: 'pr10 pl10',
                        tooltip: true
                    },
                    {
                        title: '收取时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => {
                            return <span class="pl20 pr20">{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 40,
                        render: (h, params) => {
                            return (
                                <div>
                                    <Icons type={params.row.status == 'yes' ? 'yidu' : 'weidu'} color={params.row.status == 'yes' ? '#B3B3B3' : '#57A3F3'} size="20" />
                                </div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 80,
                        render: (h, params) => {
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('letterReply') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.reply(params);
                                        }}
                                    >
                                        回复
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('letterDetail') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onDetails(params,'getEMail');
                                        }}
                                    >
                                        详情
                                    </a>
                                    <a
                                        class="ib mr10 cs"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('letter_del') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onDel(params);
                                        }}
                                    >
                                        删除
                                    </a>
                                </div>
                            );
                        }
                    }
                ],
                getGroupColmns:[
                {
                        type: 'selection',
                        title: '全选',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '发件人',
                        key: 'send_username',
                        align: 'center',
                        minWidth: 95,
                    },
                    {
                        title: '收件对象',
                        key: 'group_type',
                        align: 'center',
                        minWidth: 95,
                    },
                    {
                        title: '收件人',
                        key: 'group_type_name',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '发件时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 95,
                        render:(h,params)=>{
                            return(
                                <span>{
                                    this.$root.unixTime(params.row.created_at)
                                }</span>
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'send_username',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('letterDetail') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onDetails(params,'getGroupEMail');
                                        }}
                                    >
                                        详情
                                    </a> 
                                  <span class="mr10 blue-font"
                                  style={{color:params.row.withdraw_message ==1 ? "#918b8b" : "#2D8CF0"}}
                                   onClick={() => {
                                      if(params.row.withdraw_message!=1)this.onWithdraw(params);
                                        }}  >撤回</span> 
                                 <span
                                        class="ib mr10 cs"
                                        style={{
                                            color:params.row.withdraw_message ==0 ? "#918b8b" : "#2D8CF0",
                                            display: this.adminType == 'super' || this.authInPage.indexOf('letterDel') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            if(params.row.withdraw_message!=0)
                                            this.onDel(params);
                                        }}
                                    >
                                        删除
                                </span> 
                                    </div>
                            )
                        }
                    },
                ],
                data: []
            }, 
        };
    },
    created() {
        this.searchSubmit();
    },
    watch: {
        selectStatus(val, oldVal) {
            if (val.length == 0) this.disabled = true;
        },
        '$root.nowSite': {
            handler(val, oldVal) {
                this.searchSubmit();
            }
        }
    },
    methods: {   
        save() {  //保存的接口
            this.$root.startEditLoading();
            const data = {
                siteId: this.$root.nowSite.id,
                title: this.registerFormKey.title,
                content: this.registerFormKey.content
            };
            this.$refs.registerFormKey.validate(valid => {
                if (valid) {
                    messageRegisterMessage(data, true).then(res => {
                        if (res.code != undefined && res.code == 200) {
                            this.$Message.success({ content: '注册信息保存成功!' });
                            this.$root.endEditLoading();
                            this.$refs.registerMessage.hide();
                            this.$refs.registerFormKey.resetFields();
                        }
                    }).catch(error=>this.$root.endEditLoading());
                }
            });
        },
        registerMessage() {
            this.$refs.registerMessage.show();
            let data = { siteId: this.$root.nowSite.id };
            messageRegisterInfo(data).then(res => {
                if (res.code != undefined && res.code == 200) {
                    this.registerFormKey = res.data;
                }
            });
        },
        sendMessage() {this.$router.push({name: 'sendMessage'})},
        changePeo(value){
            if (value=='to_username'){delete this.searchKey.send_username};
            if (value=='send_username'){delete this.searchKey.to_username};
        },
        searchSubmit() { //查询
            let params = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                this.searchKey.startTime= params.startTime = startTime && this.$root.formatTimeS(startTime);
                this.searchKey.endTime =params.endTime=endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }

            for (let key in params){
              if(key=='typeTag') delete params[key];
              if(!params[key]) delete params[key];
            }

            this.disabled = true;
            if (this.showComponent == 'sendEMail') {
                this.getSendData({ params });
            } else if(this.showComponent == 'getEMail') {
                params.send_username = this.searchKey.send_username;
                for (let key in params){if(!params[key]) delete params[key];}
                this.getData({ params });
            }else{
                this.getGroupEMail({params});
            }
            this.$nextTick(()=>{this.$refs.tables.setPage();})
        },
        changeItem(name) {
            this.newName =name;
            if (name == 'sendEMail') {this.showMail = false;}
            if (name == 'getGroupEMail') {this.showMail = false;}
            if(name=='getEMail'){this.showMail = true;}
            this.searchKey.to_username = '';
            this.searchKey.send_username = '';
            this.showComponent =name;
            this.searchSubmit();
        },
        onWithdraw(params){//撤回单个
            const { siteId, id }=params.row;
            this.$Tip.confirm({
                content:'您确定撤回此发件吗？',
                onOk:()=>{
                    messageGroupWithdraw({siteId,id:id.toString()},true).then(res=>{
                        if(res!=undefined&&res.code==200){
                            this.$Message.success({content:'撤回成功!'});
                            for (let key in this.searchKey){
                                if(!this.searchKey[key]) delete this.searchKey[key];
                            }
                            this.getGroupEMail({ params: this.searchKey });
                        }
                    })  
                }
            })    
        },
        onDel(params) { // 删除单个      
            const { siteId, id,withdraw_message} = params.row;
            if(this.showComponent=='getEMail'||this.showComponent=='sendEMail'){
                this.$Tip.confirm({
                content: this.showComponent == 'getEMail' ? '您确定删除此收件吗？' : '您确定删除此发件吗？',
                onOk: () => {
                    letterDel({ siteId, ids: id.toString() }, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success(res.data);
                            this.table.data.splice(params.index, 1);
                            this.table.total--;
                        }
                            });
                        }
                    });
            }

            if(withdraw_message==1){
            if(this.showComponent=='getGroupEMail'){
                    this.$Tip.confirm({
                    content:'您确定删除此发件吗？',
                    onOk:()=>{
                      messageGroupDel({ siteId, id: id.toString() }, true).then(res=>{
                        if (res != undefined && res.code == 200) {
                            this.$Message.success({content:"删除此发件成功!"});
                            this.table.data.splice(params.index, 1);
                            this.table.total--;
                        }
                      })
                    }
                })
            }
            }
        },
        delSelect(type) {// 删除多个
            if (this.selectStatus.length > 0) {
                const params = {siteId:this.$root.nowSite.id};
                let idArray = [];
                this.selectStatus.map(item => {idArray.push(item.id)});
                if (idArray.length > 1) params.ids = idArray.join(',');
                else params.ids = idArray[0];
                let postData = { siteId: this.$root.nowSite.id,limit: this.searchKey.limit?this.searchKey.limit:20 };
                if (this.$root.validateTime(this.Time)) {
                    const [startTime, endTime] = this.Time;
                    postData.startTime = startTime && this.$root.formatTimeS(startTime);
                    postData.endTime = endTime && this.$root.formatnightTimeS(endTime);
                }
                let data={id:params.ids,siteId:this.$root.nowSite.id}
                if(type=='del'){ //多选删除
                    if(this.showComponent=='getEMail'||this.showComponent =='sendEMail'){
                        this.$Tip.confirm({
                            content: this.showComponent == 'getEMail'? '您确定删除选中收件吗？' : '您确定删除选中发件吗？',
                            onOk:()=>{
                            letterDel(params, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success(res.data);
                                if (this.showComponent == 'getEMail') {
                                    this.getData({ params: postData });
                                } else {
                                    this.getSendData({ params: postData });
                                }
                                this.disabled = true;
                            }
                            });
                            }
                        })
                    }
                    if(this.showComponent=='getGroupEMail'){
                        let withdrawMessageList=[];
                        this.selectStatus.forEach(t=>{withdrawMessageList.push(t.withdraw_message)})
                        if(String(withdrawMessageList).includes('0')){
                            this.$Tip.success({content:'只能删除被撤回的内容'});
                             return false
                        } else{
                            messageGroupDel(data, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success({content:'删除成功'});
                                this.getGroupEMail({ params: postData });
                                this.disabled = true;
                            }
                           });
                        }
                        
                        }
                     
                    }
         
                
                if(type=='withdraw'){ //多选撤回
                    let withdrawList=[];
                    this.selectStatus.forEach(t=>{withdrawList.push(t.withdraw_message)})
                    if(String(withdrawList).includes('1')){
                        this.$Tip.success({content:'选中的内容包含已被撤回的内容!'});
                             return false
                    }else{
                        this.$Tip.confirm({
                        content:'您确定撤回选中的此发件吗？',
                        onOk:()=>{
                        messageGroupWithdraw(data,true).then(res=>{
                            if(res!=undefined&&res.code==200){
                                this.$Message.success({content:'撤回成功'});
                                this.getGroupEMail({ params: postData });
                                this.disabled = true;
                            }
                        })   
                        }
                    })
                    }
                }
            } else {
                this.$Message.success('请先选中');
            }
        },
        onDetails(params,type) {
             //收件箱 getEMail  发件箱 sendEMail   群发件 getGroupEMail
            const { siteId, id, status,title,content} = params.row;
            if(this.showComponent=='sendEMail'||this.showComponent=='getEMail'){
                letterDetail({ siteId, id }).then(res => {
                const {content,title}=res.data;
                this.content = content;
                this.titleMsg = title;
                if (status == 'no') {
                    letterUptRead({ siteId, id }).then(res => {
                    params.row.status = params.row.status == 'yes' ? 'no' : 'yes';
                    });
                }
               });
            }
            if(this.showComponent=='getGroupEMail'){
                this.content=content;
                this.titleMsg=title;
            }
            this.$refs.ModalsMessage.show();
        },
        onSelectionChange(res) {
            this.selectStatus = [];
            this.selectStatus = res;
            this.disabled = res.length > 0 ? false : true;
        },
        reply(params) {
            for (let  key in this.sendInfor) {this.sendInfor[key] = ''}
            const { siteId, id, status, title } = params.row;
            this.sendInfor.account = params.row.send_username;
            this.sendInfor.title = title;
            if (status == 'no') {
                letterUptRead({ siteId, id }).then(res => {
                    params.row.status = params.row.status == 'yes' ? 'no' : 'yes';
                });
            }
            this.$refs.Modals.show();
            this.sendInfor.replyIds = params.row.id.toString();
        },
        replyselect() {
            if (this.selectStatus.length > 0) {
                for (let  key in this.sendInfor) {
                    this.sendInfor[key] = '';
                }
                this.$refs.Modals.show();
                let selectId = [];
                let selectUserName = [];
                let selectTitle = [];
                this.selectStatus.map(item => {
                    selectUserName.push(item.send_username);
                    selectId.push(item.id);
                    selectTitle.push(item.title);
                });
                // 数组去重
                selectUserName = [...new Set(selectUserName)];
                this.sendInfor.account = selectUserName.toString();
                if (selectTitle.length > 1) this.sendInfor.title = selectTitle.join(',');
                if (selectId.length > 1) this.sendInfor.replyIds = selectId.join(',');
                else this.sendInfor.replyIds = selectId[0];
            } else {
                this.$Message.success('请先选中');
            }
        },
        send() {
            this.$refs.sendInfor.validate(valid => {
                if (valid) {
                    this.$refs.Modals.spinShow();
                    const params = { ...this.sendInfor };
                    params.siteId=this.$root.nowSite.id;
                    letterReply(params, true).then(res => {
                            this.$refs.Modals.spinHide();
                            if (res != undefined && res.code == 200) {
                                this.$Message.success(res.data);
                                this.$refs.Modals.hide();
                            }
                        }).catch(error => {this.$refs.Modals.spinHide();});
                }
            });
        },
        getData(data) {
            this.$root.startTableLoading();
            this.table.columns = this.sendtable.getcolumns;
            inBox(data).then(res => {
                if (res != undefined && res.code == 200) {
                    let { data, total } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
        },
        getSendData(data) {
            this.$root.startTableLoading();
            this.table.columns = this.sendtable.sendcolumns;
            sendBox(data).then(res => {
                if (res != undefined && res.code == 200) {
                    let { data, total } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
        },
        getGroupEMail(data){
            this.$root.startTableLoading();
            this.table.columns=this.sendtable.getGroupColmns;
            getMessageGroupList(data).then(res=>{
                if(res!=undefined&&res.code==200){
                    const {data,total}=res.data;
                    this.table.data=data;
                    this.table.total=total;
                    console.log(this.table.data)
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
         },
        onPageChange(page) {
            this.total = 0;
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            switch(this.showComponent){
                case "sendEMail":
                this.getSendData({ params: data,query:{page} });
                break;
                case "getEMail":
                this.getData({ params: data,query:{page} });
                break; 
                case 'getGroupEMail':
                this.getGroupEMail({params:data,query:{page}});
            }
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
             //收件箱 getEMail  发件箱 sendEMail   群发件 getGroupEMail
            switch(this.showComponent){
                case "sendEMail":
                this.getSendData({ params: this.searchKey });
                break;
                case "getEMail":
                this.getData({ params: this.searchKey });
                break; 
                case 'getGroupEMail':
                this.getGroupEMail({params:this.searchKey});
                
            }
        },
    }};
</script>
<style scoped lang="less">
@import '../../../styles/button.less';

/deep/textarea.ivu-input {
    max-height: 300px;
}
.mb30 {
    width: 400px;
    margin: 0 auto 30px;
    text-align: center;
    .send-close {
        margin-right: 20px;
        padding: 0;
        background: #fff;
        color: #666;
        &:hover {
            color: #2d8cf0;
            background: #f4f9ff;
        }
    }
    .send {
        margin-left: 20px;
    }
}
/deep/.ivu-btn > span {
    vertical-align: 0;
}

.repay-button {
    .ivu-btn {
        border-bottom: 1px solid #dcdcdc;
        border-radius: 0;
        &:hover {
            border-radius: 0;
            border-color: none;
        }
        &.active {
            border-bottom: 1px solid #dcdcdc;
        }
    }
}
.tab {
    padding-left: 10px;
    margin: 15px 0;
    width: 100%;
}
.modal-overflow {
    /deep/textarea.ivu-input {
        max-height: 400px;
    }
}

// /deep/.ivu-form-item-content{width:270px;}
/deep/.ivu-table-header {
    font-size: 1rem;
    font-weight: normal;
    .ivu-table-cell {
        font-weight: 549;
    }
}
/deep/.ivu-table {
    color: #444;
}

.modal-scroll {
    max-height: 500px;
    overflow-y: auto;
}
</style>