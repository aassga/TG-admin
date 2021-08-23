<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
        <!-- <FormItem label="状态">
					<Select clearable class="s-86" placeholder="全部" v-model="searchKey.status">
						<Option value="yes">正常</Option>
						<Option value="no">停用</Option>
					</Select>
				</FormItem> -->
        <FormItem label="支付平台">
					<Select clearable class="w135x" :filterable="true" v-model="searchKey.paymentName" placeholder="全部">
						<Option :value="t" v-for="(t,i) in payPlatform" :key='i'>{{t}}</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						class="search"
						style="color:#fff"
						@click.prevent="search()"
						:loading="$root.tableLoading"
					>查询</Button>
				</FormItem>
			</Form>
		</div>
    <div class="v2-table">
      <Tables
				ref="table"
				:value="table.data"
				:columns="table.columns"
				:loading="$root.tableLoading"
        :total="table.total"
        :showSummary="true"
        @summary-method="handleSummary"
        @on-page-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
        @on-sort-change="onSortChange"
			></Tables>
    </div>
    <Modals :title="title" width='560' ref="payRemainModal" :closeModal="closeModal">
      <div slot="content">
        <Form ref="performance" style="width: 560px;" :label-width='180' :model="modalData" :rules="rules">
          <FormItem label='支付平台'>
            <!-- <span class="w260x" style="line-height:34px">{{modalPlatform}}</span> -->
            <Input class="w260x" style="line-height:34px" v-model="modalPlatform" disabled/>
          </FormItem>
          <div v-if="title=='初始金额设置'">
            <FormItem label='初始金额' prop="initialAmount">
              <InputNumber
                :max="999999999"
                :min='0'
                :step="0.01"
                class="w260x"
                placeholder="请输入初始金额"
                :value="Number(modalData.initialAmount)||null"
                :formatter="value =>modalData.initialAmount= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.initialAmount=e=0}}"
              />
            </FormItem>
          </div>
          <div v-if="title=='掉单操作'">
            <FormItem label='掉单类型' prop="type">
              <Select class="w260x" v-model="modalData.type" >
                <Option value='1'>掉单</Option>
                <Option value='2'>冻结冲正</Option>
              </Select>
            </FormItem>
            <FormItem label='支付方式' v-if="modalData.type==1" prop="payId" key="payId">
              <Select class="w260x" v-model="modalData.payId">
                <Option :value='key' v-for="(t,key) of payPlatformList" :key="t.name">{{t.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label='掉单金额' prop="failureAmount"  key="failureAmount" v-if="modalData.type==1">
              <InputNumber
                :max="9999999999"
                :min='0'
                placeholder="请输入掉单金额"
                class="w260x"
                :value="Number(modalData.failureAmount)||null"
                :formatter="value =>modalData.failureAmount= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.failureAmount=e=0}}"
              />
              <!-- <span class="pl10 pr10">-</span>
              <FormItem prop="commission" class="ib mb0">
                <InputNumber
                  :max="999999"
                  :min='0'
                  class="w80x"
                  placeholder="手续费"
                  :value="Number(modalData.commission)||null"
                  :formatter="value =>modalData.commission= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]"
                  @on-change="(e)=>{if(!e){modalData.commission=e=0}}"
                />
              </FormItem> -->
            </FormItem>
            <FormItem label='冲正金额' key="frozenAmount" prop="frozenAmount" v-if="modalData.type==2">
              <InputNumber
                :max="9999999999"
                :min='0'
                class="w260x"
                placeholder="请输入冲正金额"
                :value="Number(modalData.frozenAmount)||null"
                :formatter="value =>modalData.frozenAmount= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.frozenAmount=e}}"
              />
            </FormItem>
          </div>
          <div v-if="title=='下发操作'">
            <FormItem label='可用余额' v-if="modalData.type=='4'">
              <Input
                disabled

                class="w260x"
                :value="Number(modalData.flexibilityAmount)||0"
              />
            </FormItem>
            <FormItem label='商户余额' v-if="modalData.type=='3'||modalData.type=='5'">
              <Input
                disabled
                class="w260x"
                :value="Number(modalData.businessAmount)||0"
              />
            </FormItem>
            <FormItem label='减款类型' prop='type'>
              <Select class="w260x" v-model="modalData.type" @on-change="clear">
                <Option value='4'>正常下发</Option>
                <Option value='3'>商户冻结</Option>
                <Option value='5'>商户手续费</Option>
              </Select>
            </FormItem>
            <FormItem label='减款金额' key="earningsAmount" prop='earningsAmount' v-if='modalData.type==4'>
              <InputNumber
                :max="9999999999"
                :min='0'
                class="w155x"
                placeholder="减款金额"
                :value="Number(modalData.earningsAmount)||null"
                :formatter="value =>modalData.earningsAmount= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.earningsAmount=e}}"
              />
              <span class="pl10 pr10">-</span>
              <FormItem  prop='commission' class="ib mb0" key="commission">
              <InputNumber
                :max="9999999999"
                :min='0'
                class="w80x"
                placeholder="手续费"
                :value="Number(modalData.commission )||null"
                :formatter="value =>modalData.commission = value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.commission=e}}"
              />
              </FormItem>
            </FormItem>
            <FormItem label='减款金额' prop='frozenAmount1'  key="frozenAmount1" v-if='modalData.type==3'>
              <InputNumber
                :max="9999999999"
                :min='0'
                class="w260x"
                placeholder="请输入减款金额"
                :value="Number(modalData.frozenAmount1)||null"
                :formatter="value =>modalData.frozenAmount1= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.frozenAmount1=e}}"
              />
            </FormItem>
            <FormItem label='手续费' prop='commission'  v-if='modalData.type==5'>
              <InputNumber
                :max="9999999999"
                :min='0'
                class="w260x"
                placeholder="请输入手续费"
                :value="Number(modalData.commission)||null"
                :formatter="value =>modalData.commission= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.commission=e}}"
              />
            </FormItem>
          </div>
          <div v-if="title=='报警设置'">
            <FormItem label='报警金额' prop="alertorAmount">
              <InputNumber
                :max="9999999999"
                :min='0'
                class="w260x"
                placeholder="报警金额"
                :value="Number(modalData.alertorAmount)||null"
                :formatter="value =>modalData.alertorAmount= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]"
                @on-change="(e)=>{if(!e){modalData.alertorAmount=e}}"
              />
            </FormItem>
            <FormItem label='报警时间'>
              <DatePicker type="date" placeholder="开始日期" format='yyyy-MM-dd HH:mm' class="w260x" :options='options' transfer v-model="modalData.Time"></DatePicker>
            </FormItem>
          </div>
          <FormItem label='备注信息' prop='content' v-if="title!='汇率设置'&&title!='报警设置'&&title!='初始金额设置'">
            <Input type="textarea" placeholder="请输入备注信息" :autosize="{minRows: 2,maxRows: 10}" v-model="modalData.content" class="w260x" />
          </FormItem>
          <FormItem>
            <Button type='primary' class="w260x  ivu-btn submit" style="color:white" @click.prevent="save" :loading="load">确认</Button>
          </FormItem>
        </Form>
      </div>
    </Modals>
	</div>
</template>
<script>
  import Tables from "@/components/tables";
  import Modals from '_c/modals';
  import { getUserType } from '@/libs/util'
  import {
    getSettlementList,depositSettlement,getPayList,getPaymentNameList
	} from "@/api/finance";
  // import { InputNumber } from 'view-design';
	export default {
		name: "systemInPaymentCard",
		components: {
			Tables,Modals
		},
		data() {
			return {
        load:false,
        isSpin:true,
        page:1,
        list:[],
        list1:[],
        total:0,
        options:{
          disabledDate: date => date && date.valueOf() < new Date(this.$root.todayStartTime()).getTime()
        },
        searchKey:{
          // paymentName:'',
          limit:20,
          // page:1,
          siteId:this.$root.nowSite.id
        },
        newKey:"",
        newName:"",
        newDate:[],
        exchange:'',
        transfer: true,
        payPlatformList:[],//支付通道
        payPlatform:[],
        modalPlatform:'',
        title:'',
        adminType: getUserType(),
        modalData:{
          type:'',//类型
          exchange:{},
          initialAmount:'',//初始余额
          earningsAmount:'',//下发金额
          failureAmount:'',//掉单金额
          commission:'',//掉单手续费
          frozenAmount:'',//冻结金额
          frozenAmount1:'',
          payId:'',//支付方式
          alertorAmount:'',//报警金额
          Time:'',
          content:'',
        },
        table: {
          loading: true,
          title: "",
          data: [],
          pageSizeOpts: [20,30,40,50],
          total: 0,
          columns: [
            {
              title: '支付平台',
              key: 'paymentName',
              align: 'center',
              minWidth: 80,
              tooltip: true
            },
            {
              title: '初始余额',
              key: 'initialAmount',
              align: 'center',
              minWidth: 80,
              tooltip: true,
              // render: (h, params) =>
							// 	h("div", [
							// 		h(
							// 			"span",
              //       { style: {display: params.row.show=='span' ? "inline-block" : "none"},
              //         on: {
              //           "dblclick": e => {
              //             params.row.show='inp';
              //           }
							// 			  }
              //       },
							// 			this.$root.keepTwo(params.row.initialAmount)
							// 		),
							// 		h("InputNumber", {
							// 			style: {display: params.row.show=='inp'? "inline-block" : "none"},
              //       class: "w80",
							// 			props: {
              //         autofocus:params.row.show=='inp'?true:false,
							// 				value: Number(params.row.initialAmount),
							// 				min: 0,
              //         max: 99999999,
							// 			},
							// 			on: {
              //         "on-change":e=>{
              //           if(!e) params.row.initialAmount=e=0;
              //           params.row.initialAmount=e
              //         },
							// 				"on-blur": e => {
              //           params.row.show='span';
              //           let data={
              //             type:7,
              //             id:params.row.id,
              //             siteId:this.$root.nowSite.id,
              //             initialAmount:parseInt(params.row.initialAmount)
              //           }
              //           depositSettlement(data,true).then(res=>{
              //             if(res&&res.code==200){
              //               // this.search();
              //               this.blur = false;
              //             }
              //           })
              //         },
							// 			}
							// 		})
							// 	])
            },
            {
              title: '存款金额',
              key: 'depositAmount',
              align: 'center',
              minWidth: 80,
              tooltip: true,
              sortable: 'custom',
              render:(h,params)=>{
                if (params.row.depositAmount == 0) {
                  return <span>{this.$root.keepTwo(params.row.depositAmount)}</span>;
                }else {
                  return (
                  <div>
                    <Poptip placement="right-start" width="312" popper-class="top-wrap" transfer>
                      <span
                        class={{ cs: params.row.paymentName != '总计' }}
                        style="color:#2d8cf0"
                        onClick={e => {
                          if (params.row.paymentName == '总计') {
                            return false;
                          } else {
                            this.getDetail(params, 1);
                          }
                        }}>
                        {this.$root.keepTwo(params.row.depositAmount)}
                      </span>
                      <div class="tip-box" slot="content" style={{ display: params.row.paymentName == '总计' || this.list.length == 0 ? 'none' : 'block' }}>
                        <div class="title">
                          <span style="border:0;border-right:1px solid #f2f2f2">支付方式</span>
                          <span style="border:0">存款金额</span>
                        </div>
                        <div>
                          <ul>
                            {this.list.map(item=>(
                              <li>
                                <span style="border:0;border-right:1px solid #f2f2f2;border-bottom:1px solid #f2f2f2">{item.id}</span>
                                <span style="border:0;border-bottom:1px solid #f2f2f2">{this.$root.keepTwo(item.amount)}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div class="footer" style={{ display: this.list.amount == 0 || this.list.length == 0 ? 'none' : 'block' }}>
                          <span style="border:0;border-right:1px solid #f2f2f2">总计</span>
                          <span style="border:0">{this.$root.keepTwo(this.total)}</span>
                        </div>
                        <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
                      </div>
                    </Poptip>
                  </div>
                  // <span onClick={()=>{this.serviceCharge(params)}} class="blue-font">{params.row.commission}</span>
                  )
                }
              }
            },
            {
              title: '掉单金额',
              key: 'failureAmount',
              align: 'center',
              minWidth: 80,
              tooltip: true,
              sortable: 'custom'
            },
            {
              title: '手续费',
              key: 'commission',
              align: 'center',
              minWidth: 80,
              sortable: 'custom',
              // render:(h,params)=>{
              //   if (params.row.commission == 0) {
              //     return <span>{this.$root.keepTwo(params.row.commission)}</span>;
              //   }else {
              //     return (
              //     <div>
              //       <Poptip placement="right-start" width="312" popper-class="top-wrap" transfer>
              //         <span
              //           class={{ cs: params.row.paymentName != '总计' }}
              //           style="color:#2d8cf0"
              //           onClick={e => {
              //             if (params.row.paymentName == '总计') {
              //               return false;
              //             } else {
              //               this.getDetail(params, 2);
              //             }
              //           }}>
              //           {this.$root.keepTwo(params.row.commission)}
              //         </span>
              //         <div class="tip-box" slot="content" style={{ display: params.row.paymentName == '总计' || this.list.length == 0 ? 'none' : 'block' }}>
              //           <div class="title">
              //             <span style="width:33%">支付方式</span>
              //             <span style="width:33%">汇率</span>
              //             <span style="width:34%">手续费</span>
              //           </div>
              //           <div>
              //             <ul>
              //               {this.list.map(item=>(
              //                 <li>
              //                   <span style="width:33%">{item.id}</span>
              //                   <span style="width:33%" >{this.$root.keepTwo(item.exchange)+'%'}</span>
              //                   <span style="width:34%">{this.$root.keepTwo(item.amount)}</span>
              //                 </li>
              //               ))}
              //             </ul>
              //           </div>
              //           <div class="footer" style={{ display: this.list.amount == 0 || this.list.length == 0 ? 'none' : 'block' }}>
              //             <span style="width:33%">总计</span>
              //             <span style="width:33%">-</span>
              //             <span style="width:34%">{this.$root.keepTwo(this.total)}</span>
              //           </div>
              //           <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
              //         </div>
              //       </Poptip>
              //     </div>
              //     // <span onClick={()=>{this.serviceCharge(params)}} class="blue-font">{params.row.commission}</span>
              //     )
              //   }
              // }
            },
            {
              title: '冻结金额',
              key: 'frozenAmount',
              align: 'center',
              minWidth: 80,
              tooltip: true,
              sortable: 'custom'
            },
            {
              title: '商户余额',
              key: 'businessAmount',
              align: 'center',
              minWidth: 80,
              tooltip: true,
              sortable: 'custom'
            },
            {
              title: '下发金额',
              key: 'earningsAmount',
              align: 'center',
              minWidth: 80,
              tooltip: true,
              sortable: 'custom',
              render:(h,params)=>{
                if (params.row.earningsAmount == 0) {
                  return <span>{this.$root.keepTwo(params.row.earningsAmount)}</span>;
                }else {
                  return (
                  <div>
                    <Poptip placement="right-start" width="312" popper-class="top-wrap" transfer>
                      <span
                        class={{ cs: params.row.paymentName != '总计' }}
                        style="color:#2d8cf0"
                        onClick={e => {
                          if (params.row.paymentName == '总计') {
                            return false;
                          } else {
                            this.getDetail(params, 3);
                          }
                        }}>
                        {this.$root.keepTwo(params.row.earningsAmount)}
                      </span>
                      <div class="tip-box" slot="content" style={{ display: params.row.paymentName == '总计' || this.list1.length == 0 ? 'none' : 'block' }}>
                        <div class="title">
                          <span style="border:0;border-right:1px solid #f2f2f2">下发类型</span>
                          <span style="border:0">金额</span>
                        </div>
                        <div>
                          <ul>
                            <li>
                              <span  style="border:0;border-right:1px solid #f2f2f2;border-bottom:1px solid #f2f2f2">正常下发</span>
                              <span style="border:0;border-bottom:1px solid #f2f2f2">{this.$root.keepTwo(this.list1.amount)}</span>
                            </li>
                            <li>
                              <span style="border:0;border-right:1px solid #f2f2f2">手续费</span>
                              <span style="border:0">{this.$root.keepTwo(this.list1.commission)}</span>
                            </li>
                          </ul>
                        </div>
                        <div class="footer" style={{ display: this.list1.amount == 0 || this.list1.length == 0 ? 'none' : 'block' }}>
                          <span style="border:0;border-right:1px solid #f2f2f2">总计</span>
                          <span style="border:0">{this.$root.keepTwo(this.list1.commission+this.list1.amount)}</span>
                        </div>
                        <Spin fix size="small" style={{ display: this.isSpin ? 'block' : 'none' }}></Spin>
                      </div>
                    </Poptip>
                  </div>
                  // <span onClick={()=>{this.serviceCharge(params)}} class="blue-font">{params.row.commission}</span>
                  )
                }


              }
            },
            {
              title: '可用余额',
              key: 'flexibilityAmount',
              align: 'center',
              minWidth: 80,
              tooltip: true,
              sortable: 'custom'
            },
            {
              title: '操作',
              align: 'center',
              minWidth: 150,
              render: (h, params) => {
                return (
                  <div>
                    <span class="pr10 blue-font"
                      onClick={() => {
												this.sendDown(params);
											}}
                    >下发</span>
                    <span class="pr10 blue-font"
                      onClick={() => {
												this.offSingle(params);
											}}
                    >掉单</span>
                    <span class="pr10 blue-font"
                      onClick={() => {
												this.alarmSet(params);
											}}
                    >报警</span>
                    <span class="pr10 blue-font"
                      onClick={() => {
												this.setMoney(params);
											}}
                    >初始</span>
                  </div>
                )
              }
            },
          ]
        },
        rules: {
          // exchange: [
          //   { required: true, message: "请输入汇率", trigger: "blur"},
          // ],
          type:[
            { required: true, message: "请选择掉单操作", trigger: "blur" },
          ],
          payId:[
            { required: true, message: "请选择支付方式", trigger: "change" },
          ],
          failureAmount: [
            { required: true,message: "请输入掉单金额",trigger: "blur"}
          ],
          frozenAmount:[
            { required: true, message: "请输入冲正金额", trigger: "blur" },
          ],
          content:[
            { required: true, message: "请输入备注信息", trigger: "blur"},
          ],
          initialAmount:[
            { required: true, message: "请输入初始金额", trigger: "blur" },
          ],
          earningsAmount:[
            { required: true, message: "请输入减款金额", trigger: "blur" },
          ],
          commission:[
            { required: true, message: "手续费", trigger: "blur" },
          ],
          frozenAmount1:[
            { required: true, message: "请输入减款金额", trigger: "blur" },
          ],
          alertorAmount:[
            { required: true, message: "请输入报警金额", trigger: "blur" },
          ],
          // businessAmount:[
          //   { required: true, message: "请输入商户金额", trigger: "blur" },
          // ],
         // Time:[{ required: true, message: '请选择时间', trigger: 'blur', pattern: /.+/ }],
        }
			};
    },
    mounted(){
      getPaymentNameList({siteId:this.$root.nowSite.id}).then(res=>{
        if(res&&res.code==200){
          this.payPlatform = res.data
        }
      })
      this.getData({params:{...this.searchKey}});
    },
		methods: {
      clear(val){
        this.$refs['performance'].resetFields();
        this.modalData.commission='';
        this.modalData.earningsAmount='';
        this.modalData.content='';
        this.modalData.type = val;
      },
      getData(data){
        for(let key in data){
          if(!data[key]) delete data[key]
        }
        this.$root.startTableLoading();
        getSettlementList(data).then(res=>{
          if(res&&res.code==200){
            this.table.data = res.data.data;
            // this.table.data.map(item=>{item.show='span'})
            this.table.total = res.data.total;
            this.$root.endTableLoading()
          }
        }).catch(error=>this.$root.endTableLoading())
      },
      getDetail(params,type){
        this.isSpin = true;
        if(type==1){
          if(params.row.depositPayment){
            this.list=[];
            this.total=0;
            let arr=params.row.depositPayment;
            arr.map(item=>{
              let newObj={
                id:item.name,
                amount:item.amount
              }
              this.list.push(newObj);
              this.total+=Number(item.amount);
            })

          }
        }
        if(type==2){ //手续费
          if(params.row.paymentParticulars){
            this.list=[];
            this.total=0;
            let obj=JSON.parse(params.row.paymentParticulars);
            for(let key in obj){
              let newObj={
                id:key,
                exchange:obj[key].exchange,
                amount:obj[key].amount
              }
              this.list.push(newObj)
              this.total+=newObj.amount;
            }
          }else{this.list=[]};
        }
        if(type==3){ //下发余额
          if(params.row.earningsCommission){
            this.list1=JSON.parse(params.row.earningsCommission);
          }else{this.list1=[]}
        }
        this.isSpin = false;
      },
      handleSummary(columns,data,callback){
      	const sums = {};
      	columns.forEach((column, index) => {
          const key = column.key;
          if (index === 0) {sums[key] = {key,value: '总计'};return;}
          const values = data.map(item => Number(item[key]));
            if (!values.every(value => isNaN(value))) {
              const v = values.reduce((prev, curr) => {
                const value = Number(curr);
                  if (!isNaN(value)) {
                    return prev + curr;
                  } else {
                    return prev;
                  }
              }, 0);
              sums[key] = {
                key,
                value: v.toFixed(2)
              };
            } else {
              sums[key] = {
                key,
                value: '-'
              };
            }
        })
        callback(sums)
        return sums
      },
      search(){
        delete this.searchKey.sort;
        delete this.searchKey.name;
        this.table.columns.forEach(item => {
					if (item.sortable == "custom") this.$set(item, "sortType", "");
        });
        this.$refs.table.setPage();
        this.getData({ params: {...this.searchKey}})
      },
      closeModal(){
        for(let key in this.modalData){
          this.modalData[key] = '';
        }
      },
      PayList(params,type){
        getPayList({id:params.row.id,siteId:this.$root.nowSite.id}).then(res=>{
          if(res&&res.code==200){
            if(res.data.limitAmount){
              this.payPlatformList = JSON.parse(res.data.limitAmount);
             for (let key  in    this.payPlatformList){
               if(key==this.newKey){
                 this.newName=this.payPlatformList[key].name;
               }
             }
            }else{
              this.payPlatformList=[];
            }
            if(type!='shouxufei'){
              this.setModel(params,type)
            }
          }
        })
      },
      save(){
        this.load=true;
        let data;
        let msg;
        if(this.title=='下发操作'){
          data={
            id:this.modalData.id,
            type:this.modalData.type,
            siteId:this.$root.nowSite.id,
            content: this.modalData.content,
            earningsAmount:this.modalData.earningsAmount,
          }
          if(data.type=='4') {
            data.commission = this.modalData.commission;

          }else if(data.type=='3'){
            delete data.earningsAmount
            data.frozenAmount = this.modalData.frozenAmount1;//冻结金额
          }else if(data.type=='5'){
            delete data.earningsAmount
            data.commission = this.modalData.commission;//商户冻结手续费
          }
          msg = "下发操作成功"
        }else if(this.title=='掉单操作'){
          data={
            id:this.modalData.id,
            type:this.modalData.type,
            siteId:this.$root.nowSite.id,
            content: this.modalData.content
          }
          if(data.type=='2'){
            data.frozenAmount = this.modalData.frozenAmount;
          }else if(data.type=='1'){
            data.failureAmount = this.modalData.failureAmount;
            data.payId = this.modalData.payId;
            // data.commission = this.modalData.commission;
          }
          msg = "掉单操作成功"
        }else if(this.title=='初始金额设置'){
          data={
            type:7,
            id:this.modalData.id,
            siteId:this.$root.nowSite.id,
            initialAmount:Number(this.modalData.initialAmount)
          }
          msg = "初始金额设置"
        }else if(this.title=='报警设置'){
          data= {
	          id:this.modalData.id,
            type:'6',
            alertorAmount:this.modalData.alertorAmount,
            alertorTime:this.$moment(this.modalData.Time).format("X"),
            siteId:this.$root.nowSite.id
          }
          msg = "报警设置成功"
        }
        this.$refs.performance.validate(valid => {
          if (valid) {
            data.page = this.searchKey.page;
            depositSettlement(data,true).then(res=>{
              if(res&&res.code==200){
                this.$Message.success(msg);
                this.$refs.payRemainModal.hide();
                this.getData({params: {...this.searchKey}});
                this.load=false
              }else{
                this.$root.endTableLoading();
                this.load=false
              }
            }).catch(this.$root.endTableLoading())
          }else{
            this.load=false;
            this.$root.endTableLoading();
          }
        })

      },
      setModel(params,type){
        this.$refs['performance'].resetFields();
        for(let key in this.modalData){
          if(key!='type'&&key!='exchange') this.modalData[key]='';
        }
        this.modalData.initialAmount=Number(params.row.initialAmount);
        if(type=='huilv'){
          for(let key in this.payPlatformList){
            this.modalData.exchange[key]=null;
          };
          if(params.row.exchange){
            for(let key in JSON.parse(params.row.exchange)){
              this.modalData.exchange[key]=JSON.parse(params.row.exchange)[key]*1;
            }
          }
        };
        this.modalData.alertorAmount = params.row.alertorAmount;
        this.modalData.Time =this.$root.newUnixTime(String(params.row.alertorTime));
        this.modalData.businessAmount = params.row.businessAmount;
        this.modalData.flexibilityAmount = params.row.flexibilityAmount;
        this.modalPlatform = params.row.paymentName;
        this.modalData.type=type=='diaodan'?'1':type=='xiafa'?'4':type=='baojin'?'6':type=='huilv'?'5':type=='chushi'?'7':''
        this.$refs.payRemainModal.show();
        this.modalData.id = params.row.id;
      },
      serviceCharge(params){
        this.$nextTick(()=>{
          this.PayList(params,'shouxufei');
        })
      },
      setMoney(params){
        params.row.show='inp';
        this.title = "初始金额设置";
        this.setModel(params,"chushi")
      },
      exchangeRate(params){
        this.title = '汇率设置';
        this.$nextTick(()=>{
          this.PayList(params,'huilv');
        })
      },
      offSingle(params){
        this.title = '掉单操作';
        this.PayList(params,'diaodan')
        if(params.row.exchange){
          this.exchange = JSON.parse(params.row.exchange);
        }
      },
      sendDown(params){ //下发
        this.title = '下发操作';
        this.setModel(params,'xiafa');
      },
      alarmSet(params){ //报警设置
        this.title = '报警设置'
        this.setModel(params,'baojin')
      },
      onPageSizeChange(pageSize) {
        this.searchKey.limit = pageSize;
        this.search();
      },
      onPageChange(page) {
        this.searchKey.page = page;
        this.getData({params:{...this.searchKey}});
      },
      onSortChange({ column, key, order }) {
        delete this.searchKey.name;
        delete this.searchKey.sort;
        let data = { name: key, sort: order, ...this.searchKey };
        this.searchKey.name = key;
        if (data.sort == 'normal') {
          this.table.columns.forEach(t => {
            if (t.key == column.key) this.$set(t, 'sortType', 'asc');
          });
          this.searchKey.sort = 'asc';
          data.sort = 'asc';
          } else {
            this.table.columns.forEach(t => delete t.sortType);
            this.searchKey.sort = order;
          }
        this.searchKey.page == 1 ? '' : this.$refs.table.setPage();
        this.searchKey.page == 1 ? this.getData({ params: data }) : this.getData({ params: data, query: { page: 1 } });
      }
    },
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	@import "../../styles/class.less";
  /deep/.fontC {
    color:#2d8cf0 !important;
  }
	/deep/.ivu-btn {
		color: #444;
  }
  /deep/.ivu-input-number-input[disabled] {
    background-color: #fff !important;
		color: #444 !important;
  }
  /deep/.ivu-input-disabled{
    background-color: #fff !important;
		color: #444 !important;
  }
  .br1 {
    border-right: 1px solid #dcdcdc !important;
  }
  .bl1 {
    border-left:1px solid #dcdcdc;
  }
  .bb1 {
    border-bottom: 1px solid #dcdcdc !important;
  }
  .bt1 {
    border-top:1px solid #dcdcdc
  }
  /deep/.ivu-table-with-summary .ivu-table-tbody tr:last-child td{
    border-bottom:1px solid #dcdcdc;
  }
  /deep/.ivu-table-summary{
    border-top:none;
  }

</style>


