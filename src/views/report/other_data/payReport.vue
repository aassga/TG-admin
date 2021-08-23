<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
            <Button v-for="t in dayList" @click.prevent="changeBtn(t)" :class="activeBtn==t?'activeClass':''"  class="mr20" >{{t}}</Button>
             <FormItem label="开始日期">
                 <DatePicker placeholder="请输入开始日期"  @on-change="startChange" v-model="Time[0]"></DatePicker>
               </FormItem>
               <FormItem label="结束日期">
                <DatePicker placeholder="请输入结束日期"  @on-change="startChange" v-model="Time[1]"></DatePicker>
              </FormItem>
              <FormItem label="支付方式" v-if="tabName=='支付报表'">
                  <Select class="w120x" clearable v-model="searchKey.typeId">
                      <Option value="1" v-for="(t,i) in payList" :value="t.id" :key="i">{{t.className}}</Option>
                  </Select>
              </FormItem>
              <FormItem>
                  <Button type="primary" :loading="$root.tableLoading" @click="searchSubmit">查询</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" :loading="$root.exportBtnLoading" @click.prevent="exportExcel">导出EXCEL</Button>
              </FormItem>
            </Form>
        </div>
        <div>
            <!-- <Tabs type="card" @on-click="tabClick">
                <TabPane label="支付报表" name="支付报表"></TabPane>
                <TabPane label="支付重试" name="支付重试"></TabPane>
            </Tabs>  -->
            <div class="v2-search bb">
                <ButtonGroup class="repay-button1" style="margin-bottom:.3px">
                    <Button  @click.native="tabClick(t)"  class="fontColor" v-for=" t in btnList" :class="tabName==t ? 'active' : ''" >{{t}}</Button>
                </ButtonGroup>
            </div>
            <div class="v2-table">
                <Tables
                    ref="table"
                    :loading="$root.tableLoading"
                    :columns="tabName == '支付报表' ? table.columns : table._columns"
                    :value="table.data"
                    :total="table.total"
                    :page="tabName == '支付重试' ? false : true"
                    @on-page-change="onPageChange"
                    @on-page-size-change="onPageSizeChange"
                ></Tables>
            </div>
        </div>
    </div>
</template>
<script>
    import {paymentClassList} from "@/api/finance";
    import { checkDayBtn } from '@/libs/util';
    import {paymentReports,paymentRetryReports} from "@/api/report";
    import Tables from "@/components/tables";

    export default{
        name:"payReport",
        components:{
            Tables
        },
        data(){
            return{
                searchKey:{
                    siteId:this.$root.nowSite.id,
                    typeId:'',
                    
                    startTime: this.$root.todayStartTime(),
                    endTime: this.$root.todayEndTime(),
                },
                btnList:['支付报表','支付重试'],
                btnName:'',
                tabName:'支付报表',
                Time:[this.$root.todayStartTime(),this.$root.todayEndTime()],
                dayList:['今日','昨日','本月','上月'],
                activeBtn:'今日',
                payList:[],
                page: 1,
                table: {
                total: 10,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                //按会员
                columns: [
                    {
                        title: '支付方式',
                        key: 'typeName',
                        align: 'center',
                    },
                    {
                        title: '支付平台',
                        key: 'paymentName',
                        align: 'center',
                        tooltip:true,
                    },
                    {
                        title: '请求笔数',
                        key: '',
                        align: 'center',
                        children:[
                        {
                        title: '总计',
                        key: 'requestCount',
                        align: 'center',
                        },
                        {
                        title: '成功',
                        key: 'requestCountBySuccess',
                        align: 'center',
                        },
                        {
                        title: '失败',
                        key: 'requestCountByFail',
                        align: 'center',
                        },
                        {
                        title: '成功率',
                        key: 'requestCountByRate',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <span class="red-font">{params.row.requestCountByRate}%</span>
                            )
                        }
                        },
                        ]
                    },
                    {
                        title: '支付笔数',
                        key: '',
                        align: 'center',
                        children:[
                        {
                        title: '总计',
                        key: 'paymentCount',
                        align: 'center',
                        },
                        {
                        title: '成功',
                        key: 'paymentCountBySuccess',
                        align: 'center',
                        },
                        {
                        title: '失败',
                        key: 'paymentCountByFail',
                        align: 'center',
                        },
                        {
                        title: '成功率',
                        key: 'paymentCountByRate',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <span class="red-font">{params.row.paymentCountByRate}%</span>
                            )
                        }
                        },
                        ]
                    },
                    {
                        title: '支付成功金额',
                        key: 'successAmount',
                        align: 'center',
                    }
                
                ],
                _columns:[
                    {
                        title: '支付方式',
                        key: 'typeName',
                        align: 'center',
                    }, 
                    {
                        title: '请求/支付次数',
                        key: '',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                <p class="bb pt10 pb10 fh">第一次</p>   
                                <p class="pt10 pb10 bb fh">第二次</p>
                                <p class="bb pt10 pb10 fh">第三次</p>   
                                <p class="pt10 pb10 fh">总计</p>       
                                </div>
                            )
                        }
                    },
                    {
                        title: '请求总计',
                        key: 'requestCount',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                <p class="bb pt10 pb10 fh">{params.row.requestCount1}</p>   
                                <p class="pt10 pb10 bb fh">{params.row.requestCount2}</p>
                                <p class="bb pt10 pb10 fh">{params.row.requestCount3}</p>   
                                <p class="pt10 pb10 fh">{params.row.requestCount}</p>       
                                </div>
                            )
                        }
                    }, 
                    {
                        title: '请求成功',
                        key: 'requestCountBySuccess',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                <p class="bb pt10 pb10 fh">{params.row.requestCountBySuccess1}</p>   
                                <p class="pt10 pb10 bb fh">{params.row.requestCountBySuccess2}</p>
                                <p class="bb pt10 pb10 fh">{params.row.requestCountBySuccess3}</p>   
                                <p class="pt10 pb10 fh">{params.row.requestCountBySuccess}</p>       
                                </div>
                            )
                        }
                    },
                    {
                        title: '请求失败',
                        key: 'requestCountByFail',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                <p class="bb pt10 pb10 fh">{params.row.requestCountByFail1}</p>   
                                <p class="pt10 pb10 bb fh">{params.row.requestCountByFail2}</p>
                                <p class="bb pt10 pb10 fh">{params.row.requestCountByFail3}</p>   
                                <p class="pt10 pb10 fh">{params.row.requestCountByFail}</p>       
                                </div>
                            )
                        }
                    }, 
                    {
                        title: '请求成功率',
                        key: 'requestCountByRate',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div class="red-font">
                                <p class="bb pt10 pb10 fh">{params.row.requestCountByRate1}%</p>   
                                <p class="pt10 pb10 bb fh">{params.row.requestCountByRate2}%</p>
                                <p class="bb pt10 pb10 fh">{params.row.requestCountByRate3}%</p>   
                                <p class="pt10 pb10 fh">{params.row.requestCountByRate}%</p>       
                                </div>
                            )
                        }
                    }, 
                    {
                        title: '支付总计',
                        key: 'paymentCount',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                <p class="bb pt10 pb10 fh">{params.row.paymentCount1}</p>   
                                <p class="pt10 pb10 bb fh">{params.row.paymentCount2}</p>
                                <p class="bb pt10 pb10 fh">{params.row.paymentCount3}</p>   
                                <p class="pt10 pb10 fh">{params.row.paymentCount}</p>       
                                </div>
                            )
                        }
                    }, 
                    {
                        title: '支付成功',
                        key: 'paymentCountBySuccess',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                <p class="bb pt10 pb10 fh">{params.row.paymentCountBySuccess1}</p>   
                                <p class="pt10 pb10 bb fh">{params.row.paymentCountBySuccess2}</p>
                                <p class="bb pt10 pb10 fh">{params.row.paymentCountBySuccess3}</p>   
                                <p class="pt10 pb10 fh">{params.row.paymentCountBySuccess}</p>       
                                </div>
                            )
                        }
                    }, 
                    {
                        title: '支付失败',
                        key: 'paymentCountByFail',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div>
                                <p class="bb pt10 pb10 fh">{params.row.paymentCountByFail1}</p>   
                                <p class="pt10 pb10 bb fh">{params.row.paymentCountByFail2}</p>
                                <p class="bb pt10 pb10 fh">{params.row.paymentCountByFail3}</p>   
                                <p class="pt10 pb10 fh">{params.row.paymentCountByFail}</p>       
                                </div>
                            )
                        }
                    }, 
                    {
                        title: '支付成功率',
                        key: 'paymentCountByRate',
                        align: 'center',
                        render:(h,params)=>{
                            return(
                                <div class="red-font">
                                <p class="bb pt10 pb10 fh">{params.row.paymentCountByRate1}%</p>   
                                <p class="pt10 pb10 bb fh">{params.row.paymentCountByRate2}%</p>
                                <p class="bb pt10 pb10 fh">{params.row.paymentCountByRate3}%</p>   
                                <p class="pt10 pb10 fh">{params.row.paymentCountByRate}%</p>       
                                </div>
                            )
                        }
                    }, 
                ]
            }
        }},
        mounted(){
             this.getPayList();
             this.changeBtn('今日');
        },
        methods:{
            startChange(time, type) {
                this.activeBtn = checkDayBtn(this.Time, 'cn', this);
                if(this.activeBtn=='今天') this.activeBtn = '今日';
                if(this.activeBtn=='昨天') this.activeBtn = '昨日'
            },
            exportExcel() {
            
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            data.isExport = 1;
            let openr = window.open();
            if(this.tabName=='支付报表'){
                paymentReports({ params: data },true).then(res => {
                if (res != undefined && res.code == 200) {
                    let region = res.data.downloadUrl.split('.com')[1];
                    let openr1 = openr ? openr : window;
                    openr1.location.href = region;
                } else {
                    openr.close();
                }
            });
            }else{
                paymentRetryReports({ params: data },true).then(res => {
                if (res != undefined && res.code == 200) {
                    let region = res.data.downloadUrl.split('.com')[1];
                    let openr1 = openr ? openr : window;
                    openr1.location.href = region;
                } else {
                    openr.close();
                }
            });
            }
          
        },
            changeBtn(name){
                if (this.page != 1) this.$refs.table.setPage();
                this.activeBtn=name;
                switch (name) {
                    case "今日":
						this.searchKey.startTime = this.$root.todayStartTime();
						this.searchKey.endTime =this.$root.todayEndTime();
                        break;
                    case "昨日":
                    this.searchKey.startTime = this.$root.yesterdayStartTime();
                    this.searchKey.endTime = this.$root.yesterdayEndTime();
                    break;
					case "本月":
						this.searchKey.startTime = this.$root.monthDayStartTime();
						this.searchKey.endTime = this.$root.monthDayEndTime();
						break;
					case "上月":
						this.searchKey.startTime = this.$root.lastMonthDayStartTime();
						this.searchKey.endTime = this.$root.lastMonthDayEndTime();
						break;
                }
                let data={...this.searchKey};
                const { startTime, endTime } = this.searchKey; 
                this.Time[0] = startTime;
                 this.Time[1] = endTime;
                for (let key in  data){
                    if(!data[key]) delete data[key];
                }
               
                if(this.tabName=='支付报表'){
                  
                this.getData({params:data});
                }else{
                 
                  this.getTryData({params:data});

                }
               
              

            },
        
            getPayList(){
                let data={siteId:this.$root.nowSiteId}
                paymentClassList(data).then(res=>{
                       this.payList=res.data;
                })
            },
            getData(data){
                this.$root.startTableLoading();
                paymentReports(data).then(res=>{
                    if(res!=undefined&&res.code==200){  
                    const{data,total}=res.data;
                    this.table.data=data;
                    this.table.total=total;
                    }
                    this.$root.endTableLoading();
                }).catch(error=> this.$root.endTableLoading());  
            },
            getTryData(data){
                this.$root.startTableLoading();
                paymentRetryReports(data).then(res=>{
                    if(res!=undefined&&res.code==200){
                        const {data}=res.data;
                        this.table.data=data;

                    }
                    this.$root.endTableLoading();

                }).catch(error=> this.$root.endTableLoading()); 
            },
            searchSubmit(){
                if (this.page != 1) this.$refs.table.setPage();
                let data={
                    ...this.searchKey,
                    startTime: this.$root.formatTimeS(this.Time[0]),
                    endTime: this.$root.formatnightTimeS(this.Time[1])
                    };
                console.log(data,this.Time)
                for (let key in  data){
                    if(!data[key]) delete data[key];
                }
                this.getData({params:data});
            },
            onPageChange(page){
                this.page=page;
                let data={...this.searchKey};
                for (let key in  data){
                    if(!data[key]) delete data[key];
                }
                this.getData({ params: data, query: { page } });
            },
            onPageSizeChange(pageSize){
                this.searchKey.limit = pageSize;
                let data = { ...this.searchKey };
                for (let key in  data){
                    if(!data[key]) delete data[key];
                }
                this.getData({ params: data });
            },
            tabClick(name){
                this.tabName=name;
                let data = { ...this.searchKey };
                for (let key in  data){
                    if(!data[key]) delete data[key];
                }
                if(name=='支付报表'){
                    
                    this.getData({ params: data });
                }else{
                    for (let key in data){
                      if(key=='typeId') delete data[key]
                    }
                    this.getTryData({params:data});
                }

            }
        }
    }
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.activeClass{
    background-color: #2d8cf0;
    color: #fff;
}
/deep/.ivu-table-header thead tr:nth-child(1) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 1rem;
    }
}
/deep/.ivu-table-header thead tr:nth-child(2) th{
    height:37px!important;
    line-height:37px!important;
    padding:0;
    .ivu-table-cell span{
      font-size: 0.9375rem;
    }
} 
</style>