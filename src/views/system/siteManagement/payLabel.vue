<template>
  <div>
    <div class="v2-search">
        <Button type="primary" @click="()=>{$refs.discountModal.show()}">优惠配置</Button>
    </div>
    <div class="v2-table">
        <Tables
            :loading="$root.tableLoading"
            :value="table.data"
            :columns="table.columns"
            :total="table.total"
            :page="false"
            @on-edit="onEdit"
        ></Tables>
    </div>
    <Modals title="编辑支付标签" width='560' ref="labelModal">
        <div slot="content">
          <Form ref="labelInfo" :model='labelInfo' :rules='rules' style="width: 560px;" :label-width='180'>
            <FormItem label='支付方式'>
              <Input class="w260x" v-model="labelInfo.className" disabled/>
            
            </FormItem>
            <FormItem label='支付标签'>
                <Select class="w260x" v-model="labelInfo.label_id" @on-change="changeType" transfer clearable  placeholder="请选择支付标签" >
                    <Option v-for="(t,i) in labelList"   :key="i" :value="t.label_id">{{t.label_name}}</Option> 
                  </Select>
            </FormItem>
            <FormItem label='赠送比例' prop='content' v-if="labelInfo.label_id==1">
              <!-- <Input type="text" 
              @on-keyup="labelInfo.content=labelInfo.content.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')"
              v-model="labelInfo.content" maxlength="9" class="w260x" placeholder="请输入赠送比例"></Input>% -->
              <Input type="text" 
              @on-keyup="labelInfo.content=labelInfo.content.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
              v-model="labelInfo.content" maxlength="9" class="w260x" placeholder="请输入赠送比例"></Input>%
            </FormItem>
            <!-- <FormItem label='标签状态'>
              <Select class="w260x" v-model="labelInfo.status" transfer placeholder="请选择标签状态" >
                    <Option value="on">正常</Option>
                    <Option value="off">停用</Option>
                  </Select>
            </FormItem> -->
            <FormItem>
              <Button type='primary' class="ivu-btn submit" :loading="$root.editBtnLoading" @click.prevent="save">确认保存</Button>
            </FormItem>
          </Form>
        </div>
    </Modals>
    <Modals title="优惠配置" width='650' ref="discountModal">
        <div slot="content">
          <Form :model="discoutInfo" ref="discoutInfo" :rules="discoutRules" :label-width="220">
              <FormItem label="支付方式" prop="id">
                  <Select class="w260x" v-model="discoutInfo.id" clearable  multiple  >
                      <Option v-for="(t,i) in payList" :key="i" :value="t.id">{{t.name}}</Option>
                  </Select>
                  <Poptip
                  word-wrap
                  width="400"
                  transfer
                  trigger="hover"
                  content="     1.同一会员使用同一支付方式连续支付失败达到规定失败次数后，会根据此优惠配置发放优惠给会员，当会员满足要求时在客户端点击此选中的支付方式时会触发优惠，此优惠每天总共只会发放一次，按照统计类型进行发放  
        2.当按输赢/按打码/按存款 三个类型都选择且会员全部满足条件，则按照奖金金额最高的那个进行派送"
                  placement="right-start"
                  class="ml5 "
                >
                  <Icons   type="bangzhutishi" color="#E4E4E4" :size="24"/>
                </Poptip>
              </FormItem> 
              <FormItem label="统计类型" prop="statisticalType">
                <Select class="w260x" clearable multiple   v-model="discoutInfo.statisticalType" >
                    <Option value='1' >按输赢</Option>
                    <Option value='2' >按打码</Option>
                    <Option value='3' >按存款</Option>
                </Select>
              </FormItem>
             <span v-if="discoutInfo.statisticalType&&discoutInfo.statisticalType.includes('2')" >
                  <FormItem label="昨日打码" prop="yseterdayValidBetAmount"  >
                  <Input placeholder="最低打码金额" class="w260x"  v-model="discoutInfo.yseterdayValidBetAmount"/>
              </FormItem>
            </span>
            <span v-if="discoutInfo.statisticalType&&discoutInfo.statisticalType.includes('1')">
              <FormItem label="昨日输赢" prop="yseterdayNetAmount" > 
                <Input placeholder="最低输赢金额"  class="w260x"  v-model="discoutInfo.yseterdayNetAmount"/>
            </FormItem>
           </span>
           <span v-if="discoutInfo.statisticalType&&discoutInfo.statisticalType.includes('3')">
            <FormItem label="昨日存款" prop="yseterdayDepositAmount" >
                <Input placeholder="最低最低存款" class="w260x"  v-model="discoutInfo.yseterdayDepositAmount"/>
            </FormItem>
           </span>
              <FormItem>
                  <RadioGroup v-model="discoutInfo.distributingType">
                      <Radio label="1">按比例</Radio>
                      <Radio label="2">固定金额</Radio>
                  </RadioGroup>
              </FormItem>
              <FormItem label="奖金占比" prop="proportion" v-if="discoutInfo&&discoutInfo.distributingType==1" key="proportion">
                <Input  maxlength='10'  @on-keyup="discoutInfo.proportion=discoutInfo.proportion.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')" placeholder="请输入奖金占比" v-model="discoutInfo.proportion" class="w260x"/>%
            </FormItem>
              <FormItem label="奖金上限" prop="bonusMax" v-if="discoutInfo&&discoutInfo.distributingType==1" key="bonusMax">
                  <Input placeholder="请输入奖金上限" @on-keyup="discoutInfo.bonusMax=discoutInfo.bonusMax.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')" v-model="discoutInfo.bonusMax" class="w260x"/>
              </FormItem>
              <FormItem label="奖金金额" prop="bonusAmount" v-if="discoutInfo&&discoutInfo.distributingType==2" key="bonusAmount">
                <Input placeholder="请输入奖金金额"  @on-keyup="discoutInfo.bonusAmount=discoutInfo.bonusAmount.replace(/[^\d]/g, '').replace(/^0{1,}/g,'')" v-model="discoutInfo.bonusAmount" class="w260x"/>
            </FormItem>
              <FormItem>
                  <Button class="ivu-btn submit" @click="submit" :loading="$root.editBtnLoading" type="primary">确认保存</Button>
              </FormItem>
          </Form>
        </div>
    </Modals>  
    <Modals title="支付跳转" width="600" ref="alipayModal">
        <div slot="content">
            <div class="h60 f6Color">
                <Icons type="danchuangtishi" size="20" class=" ib ml20 mt8" style="color: #b3b3b3"/>
                <span style="width:528px" class="ib ml10 ">同一会员使用当前支付方式连续支付失败达到规定次数后，可按照以下先后顺序进行跳转
                    至其它支付方式，如跳转1无支付通道，则自动跳转至跳转2</span>
              </div>
            <Form class="mt20" ref="alipayInfo" :label-width=200 :model="alipayInfo" :rules="alipayRules">
                <FormItem label="当前支付">
                    <Input class="w260x "  v-model="alipayInfo.className" disabled/>
                </FormItem>
                <FormItem label="支付失败" prop="fail_num">
                    <Input v-model="alipayInfo.fail_num"  class="w260x"/>
                </FormItem>
                <FormItem label="跳转1" prop="jump1">
                    <Select class="w260x"  v-model="alipayInfo.jump1" clearable >
                        <Option  :disabled="t.id==alipayInfo.jump2||t.id==alipayInfo.jump3"  v-for="(t,i) in payList" :key="i+1" :value="t.id">{{t.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="跳转2">
                    <Select class="w260x" transfer  v-model="alipayInfo.jump2" clearable  >
                        <Option value='1' v-for="(t,i) in payList" :disabled="t.id==alipayInfo.jump1||t.id==alipayInfo.jump3" :key="i+2" :value="t.id">{{t.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="跳转3">
                    <Select class="w260x" transfer  v-model="alipayInfo.jump3" clearable >
                        <Option value='1' v-for="(t,i) in payList" :disabled="t.id==alipayInfo.jump1||t.id==alipayInfo.jump2" :key="i+3" :value="t.id">{{t.name}}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" class="ivu-btn submit " @click="alipaySubmit" :loading="$root.editBtnLoading">确认保存</Button>
                </FormItem>
            </Form>
        </div>
    </Modals>
  </div>

</template>
<script>
    import Modals from '_c/modals'
    import { PaymentClassLabelList, PaymentClassLabelEdit ,
        PaymentClassLabelPreferentialConfigList,
        PaymentClassLabelPreferentialConfigUp,
        PaymentClassLabelPayJump
    } from '@/api/system';
import Tables from '_c/tables';
import Icons from "_c/icons";
    export default{
    name:'payLabel',
    components: {
        Tables,
        Modals,
        Icons
    },
        data(){
            return{
                alipayInfo:{
                 siteId:this.$root.nowSite.id,
                 id:'',
                 fail_num:'',
                 jump1:'',
                 jump2:'',
                 jump3:'',
                 className:'',
                },
                configList:[],//配置详情
                payList:[],//支付方式列表
                showType:'',
                showName:'',
                labelList:[
                {label_name:"赠送",label_id:1},
                 {label_name:"推荐",label_id:2},
                 {label_name:"热门",label_id:3},
                ],
                labelInfo:{
                    siteId:this.$root.nowSite.id,
                    class_id:'',
                    label_id:'',
                    className:'',
                    status:'',
                    content:'',
                    label_name:''
                },
                discoutInfo:{//优惠配置
                    siteId:this.$root.nowSite.id,
                    siteName:this.$root.nowSite.siteName,
                    id:'',
                    idStr:'',
                    statisticalType:'',
                    yseterdayValidBetAmount:'1',
                    yseterdayNetAmount:'1',
                    yseterdayDepositAmount:'1',
                    distributingType:'1',
                    proportion:'',
                    bonusMax:'',
                    bonusAmount:''
                },
                alipayRules:{
                    fail_num:[
                        {required:true,message:'请输入支付失败次数',trigger: 'blur',pattern: /.+/}
                    ],
                    jump1:[
                        {required:true,message:'请选择支付跳转方式',trigger:'change',pattern:/.+/}
                    ]
                },
                discoutRules:{
                    id:[
                        {required:true,message:'请选择支付方式',trigger: 'change',pattern: /.+/}
                    ],
                    statisticalType:[
                    {required:true,message:'请选择统计类型',trigger: 'change',pattern: /.+/}
                    ],
                    yseterdayValidBetAmount:[
                    {required:true,message:'请输入最低打码金额',trigger: 'blur',pattern: /.+/}
                    ],
                    yseterdayNetAmount:[
                    {required:true,message:'请输入最低输赢金额',trigger: 'blur',pattern: /.+/}
                    ],
                    yseterdayDepositAmount:[
                    {required:true,message:'请输入最低存款金额',trigger: 'blur',pattern: /.+/}
                    ],
                    proportion:[
                    {required:true,message:'请输入奖金占比',trigger: 'blur',pattern: /.+/}
                    ],
                    bonusMax:[
                    {required:true,message:'请输入奖金上限',trigger: 'blur',pattern: /.+/}
                    ],
                    bonusAmount:[
                    {required:true,message:'请输入奖金金额',trigger:'blur',pattern:/.+/}
                    ]
                },
                rules: {
                    content: [
                       { required: true, message: '请输入赠送比例', trigger: 'blur',pattern: /.+/},
                        { required: true, message: '赠送比例最多保留2位小数', trigger: 'blur', pattern: /^(([0-9]\d*))(\.\d{1,2})?$/ }
                    ],
                },
                table: {
                    total: 0,
                data: [],
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                columns:[
                {
                        title: '支付方式',
                        key: 'className',
                        align: 'center',
                        minWidth: 65
                    },
                    {
                        title: '支付类型',
                        key: 'siteCode',
                        align: 'center',
                        minWidth: 55,
                        render: (h, params) => {
                            const { classType } = params.row;
                            let text =
                                classType == 'payment'
                                    ? '线上支付'
                                    : classType == 'qr_code'
                                    ? '扫码支付'
                                    : classType == 'bank'
                                    ? '网银转账'
                                    : classType == 'paymentServiceLink'
                                    ? 'VIP通道'
                                    : '转账支付';
                            return <span>{text}</span>;
                        }
                    }, 
                    {
                        title: '开放终端',
                        key: 'devices',
                        align: 'center',
                        minWidth: 55,
                        render: (h, params) => {
                            let arr = [];
                            params.row.devices.split(',').forEach(t => {
                                arr.push(t == 'android' ? 'Android' : t.toUpperCase());
                            });
                            return <span>{arr.join(',')}</span>;
                        }
                    },
                    {
                        title: '触发优惠',
                        key: 'trigger',
                        align: 'center',
                        render:(h,params)=>{
                            let  color=params.row.trigger=='yes'?'#ff2626':'';
                            return(<span style={{color}}>{params.row.trigger=='yes'?'是':'否'}</span>)
                        }
                    },
                    {
                        title: '支付标签',
                        key: 'content',
                        align: 'center',
                        minWidth: 55,
                        render:(h,params)=>{
                            const{label_name,label_id,content}=params.row;
                            console.log(label_id)
                            return(
                                <span>{label_id=='3'?'热门':label_id=='2'?'推荐':label_id=='1'?`赠送${content+'%'}`:'-'}</span>
                            )
                        }
                    }, 
                    {
                        title: '支付状态',
                        key: 'classStatus',
                        align: 'center',
                        minWidth: 55,
                        render:(h,params)=>{
                            let color = params.row.classStatus == 'yes' ? '' : '#FF0000';
                            return(
                                <span style={{ color }}>{params.row.classStatus=='yes'?'正常':'停用'}</span>
                            )
                        }
                    },
                    // {
                    //     title: '标签状态',
                    //     key: 'status',
                    //     align: 'center',
                    //     minWidth: 55,
                    //     render:(h,params)=>{
                    //         let color = params.row.status == 'on' ? '' : '#FF0000';
                    //         return(
                    //             <span style={{ color }}>{params.row.status=='on'?'正常':'停用'}</span>
                    //         )
                    //     }
                    // },

                    {
                        title:'操作',
                        align:'center',
                        render:(h,params)=>{
                            const {trigger}=params.row;
                            let color=trigger=='yes'?'#2D8CF0':'#c5c8ce';
                            return(
                                  // <a class="ib mr5"
                                // onClick={()=>{
                                //  this.changeStatus(params)
                                // }}
                                // >{params.row.status == 'on' ? '停用标签' : '启用标签'}
                                // </a>
                                <div>
                              
                             <span class="ib mr5" 
                             style={{
                               color
                             }}
                             onClick={()=>{
                                   if(trigger=='yes'){
                                    this.$refs.alipayInfo.resetFields();
                                    this.alipayLink(params)
                                   }
                                
                                }
                                } >支付跳转
                                </span>
                                <a class="ib mr5"
                                onClick={()=>{
                                    this.onEdit(params)
                                }}
                                >编辑</a> 
                                 </div>
                            )
                        }
                    }
                ]
            }
        }
    },
    created(){
        let data={siteId:this.$root.nowSite.id};
        this.getPayList({params:data})
    },
    mounted(){
        let data={siteId:this.$root.nowSite.id};
        this.getData({params:data});
       
     
     

    },
    methods:{
        alipaySubmit(){
          let data={...this.alipayInfo};
          data.jump1=String(data.jump1);
          data.jump2=String(data.jump2);
          data.jump3=String(data.jump3);
          this.$root.startEditLoading();
          this.$refs.alipayInfo.validate(valid=>{
              if(valid){
                PaymentClassLabelPayJump(data,true).then(res=>{
                    if(res!=undefined&&res.code==200){
                        this.$root.endEditLoading();
                        this.$Message.success({content:'修改支付跳转成功'})
                        this.$refs.alipayModal.hide();
                        let params={siteId:this.$root.nowSite.id}
                        this.getData({params})
                    }
                })
              }
          })
        },
        alipayLink(params){
            this.$refs.alipayInfo.resetFields();
            this.alipayInfo.id=params.row.tableid;
            this.alipayInfo.className=params.row.className;
            this.alipayInfo.fail_num=params.row.fail_num;
            this.alipayInfo.jump1=Number(params.row.jump1);
            this.alipayInfo.jump2=Number(params.row.jump2);
            this.alipayInfo.jump3=Number(params.row.jump3);  
            this.$refs.alipayModal.show();



        },
        submit(){
        this.$root.startEditLoading();
        let data={...this.discoutInfo};
        data.statisticalType=String(this.discoutInfo.statisticalType);
        data.idStr=String(this.discoutInfo.id);
        data.id=String(this.discoutInfo.id);
        for (let key in data){
            if(key=='id'){
                delete data[key];
            }
        }
         this.$refs.discoutInfo.validate(valid=>{
             if(valid){
                PaymentClassLabelPreferentialConfigUp(data,true).then(res=>{
                    if(res!=undefined&&res.code==200){
                        this.$root.endEditLoading();
                        this.$Message.success({content:'操作成功'});
                        let params={siteId:this.$root.nowSite.id}
                         this.getData({params:data});
                        this.$refs.discountModal.hide();
                    }
                }).catch(error=>{this.$refs.discountModal.spinHide()})
             }
         })
        },
        getPayList(data){
            PaymentClassLabelPreferentialConfigList(data).then(
                res=>{
                    if(res!=undefined&&res.code==200){
                        this.payList=res.data.select;
                        if(res.data.config){
                        this.configList=res.data.config;
                        this.$refs.discountModal.spinShow();
                        this.discoutInfo=this.configList;
                        console.log( this.discoutInfo)
                        this.discoutInfo.id=(this.configList.idStr.split(',')).map(Number);
                        console.log(this.configList)
                        this.discoutInfo.distributingType=String(this.configList.distributingType);
                        this.$refs.discountModal.spinHide();
                        } 
                    }
                }
            )

        },
        changeType(val,name){
            console.log(this.val)
            this.showType=val;

            this.showName=this.showType==1?this.showName='赠送':(this.showType==2?this.showName='推荐':'热门')
        },
        getData(data){
            this.$root.startTableLoading()
            PaymentClassLabelList(data).then(res=>{
                if(res!=undefined&&res.code==200){
                    this.table.data=res.data;
                    this.table.total=res.total;
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading())
        },
        changeStatus(params){
            const {status,className,id,}=params.row;

            let msg = status == 'on' ? `您确定停用【${className}】支付标签吗？` : `您确定启用【${className}】支付标签吗？`
      let tip = params.row.status == 'on' ? '停用成功' : '启用成功'
      let data = {class_id:id,
         siteId: this.$root.nowSite.id,
         class_name:className,
        status: status == 'on' ? 'off' : 'on' }
      this.$Tip.confirm({
        content: msg,
        onOk: () => {
            PaymentClassLabelEdit(data, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$Message.success(tip)
              this.table.data[params.index].status = data.status
            }
          })
        }
      })

        },
        onEdit(params){
            this.$refs.labelModal.show();
            this.labelInfo=params.row;
           
            // this.showType=params.row.label_name;    
            this.showName=params.row.label_name;

            this.labelInfo.content=params.row.content=='-'?params.row.content:Number(params.row.content); 
    },
    save(){
        this.$refs.labelModal.spinShow();  
            const {id,className,content,status,label_name,label_id}=this.labelInfo;
            this.showType=label_id;
            this.$refs.labelModal.spinHide();  
            const  data={
                class_id:id,
                label_name:this.showName,
                 class_name:className,
                 content,
                 status,
                label_id,
                siteId:this.$root.nowSite.id,
            }
            if(!data.label_name){
                for (let key in  data){
                    if(key=='label_id') delete data[key];
                    if(key=='label_name') delete data[key];
                }
            }
            if(!data.label_id){
                for (let key in data){
                    if(key=='label_name') delete data[key];
                }
            }
         this.$root.startEditLoading();
        if(this.showType=='1'){
            this.$refs.labelInfo.validate(valid => {
        if (valid) {
            PaymentClassLabelEdit(data,true).then(res=>{
                this.$refs.labelModal.spinHide();
                if(res!=undefined&&res.code==200){
                    this.$Message.success('编辑成功')
                this.getData({params:data})
                this.$refs.labelModal.hide();
                this.$root.endEditLoading();
                }
            }).catch(error => this.$refs.labelModal.spinHide())
        }}
        )
        }else{
            data.class_id=id;
            for(let key in data){
                if(key=='content') delete data[key]
            }
            PaymentClassLabelEdit(data,true).then(res=>{
                this.$refs.labelModal.spinHide();
                if(res!=undefined&&res.code==200){
                    this.$Message.success('编辑成功')
                this.getData({params:data})
                this.$refs.labelModal.hide()
                this.$root.endEditLoading();
                }
            }).catch(error => this.$refs.labelModal.spinHide())
        }
    
    }
        }}
</script>
<style lang="less" scoped>
    @import "../../../styles/button.less";
    </style>