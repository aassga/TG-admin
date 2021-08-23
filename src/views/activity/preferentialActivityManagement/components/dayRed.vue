<template>
<div>
    <div class="v2-table mt20 box">
        <Tables
        ref="table"
        :loading="$root.tableLoading"
        :columns="table.columns"
        :value="table.data"
        :total="table.total"
         :showSizer="false"
        :page="false"
      ></Tables>
       <div slot="more" class="mt30 iconColor ft14">
        <div>
           温馨提示：系统自动发放，每天发放一次，需会员主动领取红包（统计时间依据北京时间）
        </div>
        <div class="mt20">
          <p>活动规则：</p>
          <p>1.会员在统计时段内有存款/打码/亏损/现金赢/现金输，均可领取红包，红包金额平均发放。</p>
          <p>2. 所获得的红包1倍打码即可申请提款。</p>
          <p>3. 存在对打行为系统将会取消红包资格及其它活动。</p>
          <p>4. 存在优惠黑名单的玩家不能参与此活动。</p>
        </div>
      </div>
    </div>
</div>
</template>
<script>
// activeType != 'A0025'
// D0002
import Tables from "_c/tables";
import {getActiveChessTaskConfigList,getActiveChessTaskConfigEdit} from "@/api/activity";
import { DatePicker } from 'view-design';
export default{
    components:{
    Tables
    },
    props:['isEdit'],
    data(){
        return{
          copyData:[],
          searchKey:{
        siteId: this.$root.nowSite.id,
        level_id:'0',
        active_type:'D0002'
          },
          time_type:0,
            table:{
                  total: 10,
        loading: true,
        pageSizeOpts: [20, 30, 40, 50],
        data: [],
        defaultData:[
          {"type":"deposit","count":{"start_type":0,"end_type":1,"start_time":"00:00:00","end_time":"23:59:59"},"send":{"start_time":"17:00:00"},"percent":"0","level_1":"0","status":"on"},
        {"type":"bet","count":{"start_type":0,"end_type":1,"start_time":"00:00:00","end_time":"23:59:59"},"send":{"start_time":"17:00:00"},"percent":"0","level_1":"0","status":"on"},
        {"type":"loss","count":{"start_type":0,"end_type":1,"start_time":"00:00:00","end_time":"23:59:59"},"send":{"start_time":"17:00:00"},"percent":"0","level_1":"0","status":"on"},
        {"type":"win","count":{"start_type":0,"end_type":1,"start_time":"00:00:00","end_time":"23:59:59"},"send":{"start_time":"17:00:00"},"percent":"0","level_1":"0","status":"on"},
        {"type":"lose","count":{"start_type":0,"end_type":1,"start_time":"00:00:00","end_time":"23:59:59"},"send":{"start_time":"17:00:00"},"percent":"0","level_1":"0","status":"on"}],
        columns:[
            {
            title: "红包类型",
            key: "type",
            width:'80',
            className: "backBox",
            align: "center",
            tooltip: true,
            render:(h,params)=>{
               
                const {type}=params.row;
                let newType=type=='deposit'?'按存款':(type=='bet'?'按打码':(type=='loss'?'按亏损':(type=='win'?"按现金赢":'按现金输')))
                return(
                    <span>{newType}</span>
                )
            }
          },
          {
            title: "统计时段",
             minWidth:170,
            key: "",
            align: "center",
            tooltip: true,
            //  className: "pl5 pr5",
            render:(h,params)=>{
           
              const {count}=params.row;
        
                if(this.isEdit==false){
              return(
               <span>{count.start_type=='1'?'今日':'昨日'}{count.start_time}-{count.end_type=='1'?'今日':'昨日'}{count.end_time}</span>
              )
                }else{
               
                  return     h("div", [
                    	h(
										"Select",
										{
											style: {
											
												width: "65px",
												marginRight: "5px",
									
											},
											props: {
												value: params.row.count.start_type,
                        transfer:true,
											},
											on: {
												"on-change": val => {
                        
                          this.table.data[params.index].count.start_type=val;
												}
											}
										},
										[
											h("Option", {
												props: {
													value: 0,
													label:'昨日'
												}
											}),
											h("Option", {
												props: {
													value: 1,
													label: '今日'
												}
											})
										]
									),
                    h("TimePicker", {
                     	style: {
											
												width: "100px",
											
									
											},
                      props: {
                       value: params.row.count.start_time,
                         transfer:true,
                        //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].count.start_time = e;
                        }
                      }
                    }),
                    h('span',{style:{
                        marginLeft:'2px',
                      	marginRight: "2px",
                    }},'-'),
                    	h(
										"Select",
										{
											style: {
											
												width: "65px",
												// margin: "5px auto",
									
											},
											props: {
												value: params.row.count.end_type,
                          transfer:true,
											},
											on: {
												"on-change": e => {
                        
                          this.table.data[params.index].count.end_type=e;
												}
											}
										},
										[
											h("Option", {
												props: {
													value: 0,
													label:'昨日'
												}
											}),
											h("Option", {
												props: {
													value: 1,
													label: '今日'
												}
											})
										]
									),
                    h("TimePicker", {
                     	style: {
											
												width: "100px",
												marginLeft: "5px",
									
											},
                      props: {
                       value: params.row.count.end_time,
                         transfer:true,
                        //formatter:value =>this.table.data[params.index].level_gift_money_requirement.betTotal= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                      },
                      on: {
                        "on-change": e => {
                          if (!e) e = 0;
                          this.table.data[
                            params.index
                          ].count.end_time = e;
                        }
                      }
                    }),
                  ])
                }
            }
          },
            {
            title: "派发时间",
            width:125,
            key: "send_time",
            align: "center",
           className: "pl5 pr5",
            tooltip: true,
            render:(h,params)=>{
                const {send}=params.row;
                if(this.isEdit==false){
                    return(
                        <span>{send.start_time=='-'?send.start_time:'每日'+send.start_time}</span>
                    )
                }else{
             
                    return h('TimePicker', {
               style:'width:100px',
                props: {
                   value: params.row.send.start_time,
                  format: 'HH:mm:ss',
                  
                  placeholder: '请选择派发时间',
                  type: 'time',
                   transfer:true,
                  confirm: true
                },
                on: {
                  'on-change':e=>{
                     this.table.data[params.index].send.start_time= e;
                  }
                }
              })

                    

                }
            }
          },
            {
            title: "红包总占比",        
            key: "percent",
            align: "center",
            tooltip: true,
            render:(h,params)=>{
          
                const {percent}=params.row;
            
                if(this.isEdit==false){
                 return(<span >发放总金额X{percent}%</span>)
                }else{
                      return(<div >发放总金额<Input type="text" class='w45x ml5 mr5'
                        onInput={(e) => {
                      
                      if (e) {
                         this.table.data[params.index].percent = e;
                        // this.$set(params.row, "percent", e);
                      } else {
                        this.table.data[params.index].percent = e;
                        // this.$set(params.row, "percent", "");
                      }
                    }}
                      value={percent=='0'?'0':percent}/>%</div>)
                }
               
            }
          },
             {
            title: "新会员层占比",        
            key: "level_1",
            align: "center",
            tooltip: true,
            render:(h,params)=>{
               
                const {level_1}=params.row;
               
                if(this.isEdit==false){
                 return(<span >红包占比X{level_1}%</span>)
                }else{
                      return(<div >红包占比<Input type="text" class='w45x ml5 mr5'
                        onInput={(e) => {
                      
                      if (e) {
                         this.table.data[params.index].level_1 = e;
                      } else {
                        this.table.data[params.index].level_1 = e;
                      }
                    }}
                      value={level_1=='0'?'0':level_1}/>%</div>)
                }
               
            }
          },
             {
            title: "观察层占比",        
            key: "level_2",
            align: "center",
            tooltip: true,
            render:(h,params)=>{
             
                const {level_2}=params.row;
             
                if(this.isEdit==false){
                 return(<span >红包占比X{level_2}%</span>)
                }else{
                      return(<div >红包占比<Input type="text" class='w45x ml5 mr5'
                        onInput={(e) => {
                      
                      if (e) {
                         this.table.data[params.index].level_2 = e;
                      } else {
                        this.table.data[params.index].level_2 = e;
                      }
                    }}
                      value={level_2=='0'?'0':level_2}/>%</div>)
                }
               
            }
          },
               {
            title: "正常层占比",        
            key: "level_3",
            align: "center",
            tooltip: true,
            render:(h,params)=>{
              
                const {level_3}=params.row;
             
                if(this.isEdit==false){
                 return(<span >红包占比X{level_3}%</span>)
                }else{
                      return(<div >红包占比<Input type="text" class='w45x ml5 mr5'
                        onInput={(e) => {
                      
                      if (e) {
                         this.table.data[params.index].level_3 = e;
                      } else {
                        this.table.data[params.index].level_3 = e;
                      }
                    }}
                      value={level_3=='0'?'0':level_3}/>%</div>)
                }
               
            }
          },
                {
            title: "黑名单层占比",        
            key: "level_4",
            align: "center",
            tooltip: true,
            render:(h,params)=>{
              
                const {level_4}=params.row;
              
                if(this.isEdit==false){
                 return(<span >红包占比X{level_4}%</span>)
                }else{
                      return(<div >红包占比<Input type="text" class='w45x ml5 mr5'
                        onInput={(e) => {
                      
                      if (e) {
                         this.table.data[params.index].level_4 = e;
                      } else {
                        this.table.data[params.index].level_4 = e;
                      }
                    }}
                      value={level_4=='0'?'0':level_4}/>%</div>)
                }
               
            }
          },
              {
            title: "操作",
            width:'75',
            key: "status",
            align: "center",
            render:(h,params)=>{
                 let color = params.row.status == 'on' ? '#2d8cf0' : '#FF2626';
              return(
                <a 
                style={{ color: color }}
                onClick={()=>{
                  this.onChangeStatus(params)
                }}
                >{params.row.status === 'on' ? '正常' : '停用'}</a>
              )
            }

          },

        ]

            }

        }
    },
    watch:{
      isEdit:{
        deep:true,
        handler(newVal,oldVal){
      
         this.isEdit=newVal;
        }
      }

    },
    mounted(){
    let data={...this.searchKey}
    this.getData(data);
    },
    methods:{
      onChangeStatus(params){
        
          let text, msg,newType;
        
          const {status,id,index,type}=params.row;
     
          
         if(status=='on'){
          newType=type=='deposit'?'按存款':(type=='bet'?'打码':(type=='loss'?'亏损':(type=='win'?"现金赢":'现金输')));
        
            text='您确定停用【'+`${newType}`+'】吗?';
             msg = '停用' +`${newType}`+ '成功';
          }
          if(status=='off'){
             newType=type=='deposit'?'按存款':(type=='bet'?'打码':(type=='loss'?'亏损':(type=='win'?"现金赢":'现金输')));
            text='您确定启用【'+`${newType}`+'】吗?';
             msg = '启用' +`${newType}`+ '成功';
          }
          let newData = [];
          this.table.data.map(item=>{
            let obj={
                type:item.type,
                count:item.count,
                send:item.send,
                percent:item.percent,
                
                level_1:item.level_1,
                level_2:item.level_2,
                level_3:item.level_3,
                level_4:item.level_4,
                status:item.status,
            }
            newData.push(obj);
          })
        

          
           newData.forEach((t,index)=>{
          
             if(params.index==index){
                 t.status= status == 'on' ? 'off' : 'on';

             }
            
           })
           this.copyData=newData;
        
         
        
          const data={
            updateData:JSON.stringify(newData),
              siteId: this.$root.nowSite.id,
              status: params.row.status,
              level_id:'0',
              active_type:'D0002',
          }
          this.$Tip.confirm({
            content:text,
            onOk:()=>{
              getActiveChessTaskConfigEdit(data,true).then(res=>{
                if(res!=undefined&&res.code==200){
                   this.$Message.config({ top: 150 });
                   this.$Message.success({ content: msg });
                }
                  params.row.status = status == 'on' ? 'off' : 'on';
              })
            }
          })
            this.$emit('copyData',this.copyData,true)  
       
      },
        getData(data){
            this.$root.startTableLoading();
              getActiveChessTaskConfigList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
           
            const { data, total } = res;
         
           if(data.length>0){
            let parseData=JSON.parse(data[0].condition);
            let copyData=[];
            for (let m in parseData){
              if(m!='id'){
                copyData.push(parseData[m])

              }
            
            }
              this.table.data=copyData;


           }else{
              this.table.data =this.table.defaultData;
             
            this.table.total = total;
           }
            this.$root.endTableLoading();
          }
        })
        .catch((error) => this.$root.endTableLoading());

        },
        
    }
}
</script>
