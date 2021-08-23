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
            <p>温馨提示：可以设置金管家在指定的日期可以获取N倍打码，可以快速提高会员金管家等级，</p>
            <p>如在活动期间内彩票金管家设置打码倍数为2倍，会员实际有效打码1000，但可获得2000的有效打码。</p>
        </div>
      </div>
     </div>
</div>   
</template>
<script>
import Tables from "_c/tables";
import { jinGuanJiaLevelSelect } from '@/api/activity';
 export default{
     components:{
    Tables
    },
     props:['isEdit'],
     data(){

         return{
          
              table: {
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                total: 100,
                columns: [],
                data: [],
            columns: [
                    {
                        title: '金管家类型',
                        key: 'name',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '可获得打码倍数',
                        key: 'code',
                        align: 'center',
                        minWidth: 45,
                        tooltip: true,
                        className: 'pr5 pl5',
                        render:(h,params)=>{
                             const {multiple}=params.row;
                             if(this.isEdit==false){
                                 return(<span >{multiple}</span>)
                             }else{

                    return h('div',[
                        h('InputNumber',{
                             props:{
                                        min: 1,
                                        value:Number(multiple),
                                        formatter:value => `${value}`.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'),
                                    },
                                     style:{
                                     
                                        width: "25%",
                                    },
                                    on:{
                                        'on-change':(event)=>{
                                       
                                            if(event==null){
                                                    this.table.data[params.index].multiple ='';
                                               
                                            }else{
                                                 this.table.data[params.index].multiple =event;
                                              
                                            }
                                        }
                                    }

                        })
                    ])

                             }
                        }
                    },      
              
          ]
            },
          
         
         }
     },
         watch:{
      isEdit:{
        deep:true,
        handler(newVal,oldVal){
        console.log(111)
         this.isEdit=newVal; 
        }
      }

    },
     mounted(){
 let data={siteId:this.$root.nowSite.id}
    this.getData(data);
     },
     methods:{
         getData(data){
          
            this.$root.startTableLoading();
            jinGuanJiaLevelSelect(data).then(res=>{
                if(res!=undefined&&res.code==200){
                    this.table.data=res.data;
                    this.$root.endTableLoading();
                }
            }).catch((error) => this.$root.endTableLoading());
         },
     }
 }


</script>
