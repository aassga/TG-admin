<template>
    <div>
       <Modals ref="fightModals" width="920" title="对打详情">
           <div slot="content">
            <!-- style="height:500px;overflow:auto" -->
            <div >
            <Tables
            class="ml20 mr20 mb20"
            ref="table"
            :height="table.data.length > 4 ? '568' : ''"
            :loading="$root.tableLoading"
            :columns="table.columns"
            :value="table.data"
            :total="table.total"
            :pageSizeOpts="table.pageSizeOpts"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
            ></Tables>
            </div>
           </div>
           
       </Modals>
    </div>
</template>
<script>
 import Modals from '_c/modals';
 import Tables from '_c/tables'; 
 import {getReportMutualDetails} from "@/api/report";   
  export default{
    components:{
      Tables,
      Modals
    },
      data(){
         return{
             page:1,
             arrayLength:0,
             twoArrayLength:0,
             detialData:[],
             table:{
                total: 0,   
                terminal:'',
                pageSizeOpts: [20, 30, 40, 50],
                loading: true,
                columns:[
                     {
                        title: '对打站点',
                        key: 'siteName',
                        width:'105',
                        align: 'center',
                        render:(h,params)=>{
                            const {siteName1,siteName0}=params.row;
                            let neWbetContent;
                             params.row.list0.forEach(t=>{
                                neWbetContent=t;
                             })
                             let  twobetContent;
                             params.row.list1.forEach(t=>{
                                twobetContent=t;
                             })
                          
                             const array =neWbetContent.betContent&&neWbetContent.betContent.split("+");
                             const twoArray=twobetContent.betContent&&twobetContent.betContent.split("+");
                             params.row.newIndex=array.length;
                             if(params.row.newIndex>=2)
                            return(
                                <div>
                                 <p class="bb"  style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}>{siteName0}</p>
                                 <p  style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}>{siteName1}</p>
                                </div>
                            )
                            else{
                                return(
                                    <div>
                                 <p class="h40x bb lh40">{siteName0}</p>
                                 <p   class="h40x  lh40">{siteName1}</p>
                                </div>
                                )
                                
                            }
                         
                        }
                    },
                    {
                        title: '对打会员',
                        key: 'userName',
                        align: 'center',
                        render:(h,params)=>{    
                            const {userName0,userName1}=params.row;
                            if(params.row.newIndex>=2)
                            return(
                                <div>
                                 <p class="bb " style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}>{userName0}</p>
                                 <p  style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}>{userName1}</p>
                                </div>
                            )
                            else{
                                return(
                                    <div>
                                 <p class="bb"  style="height:41px;line-height:41px" >{userName0}</p>
                                 <p   style="height:41px;line-height:41px">{userName1}</p>
                                </div>
                                )
                                
                            }
                        }
                   
                    },
                    {
                        title: '游戏平台',
                        key: 'gamingPlatform',
                        align: 'center',
                       
                    },
                    {
                        title: '游戏类型',
                        key: 'gameType',
                        align: 'center',
                     
                    },
                    {
                        title: '期数/局号',
                        key: 'issueBureau',
                        width:'120',
                        tooltip:true,
                        align: 'center',
                        render:(h,params)=>{
                            let issueBureauNew=params.row.issueBureau;
                            return(
                                <span class="ml5 mr5">{issueBureauNew=issueBureauNew==''?'-':issueBureauNew}</span>
                            )
                        }
                      
                    },{
                        title: '下注内容',
                        key: 'betContent',
                        minWidth:120,
                        align: 'center',
                        render:(h,params)=>{
        
                             let neWbetContent;
                             params.row.list0.forEach(t=>{
                                neWbetContent=t;
                             })
                             let  twobetContent;
                             params.row.list1.forEach(t=>{
                                twobetContent=t;
                             })
                          
                             const array =neWbetContent.betContent&&neWbetContent.betContent.split("+");
                             const twoArray=twobetContent.betContent&&twobetContent.betContent.split("+");
                             params.row.newIndex=array.length;
                             this.arrayLength=array.length;
                             this.twoArrayLength=twoArray.length;
                             const br = <br></br>;
                             if (array.length < 2&&twoArray.length<2) {
                                return (
                                    <div>
                                        <p style="height:42px;line-height:42px;" class="bb">{array}</p>
                                        <p class="bb moreBox" style="height:42px;line-height:42px">{twoArray}</p>
                                    </div>
                                ) 
                              }
                              let result = null;
                              let result2=null;

                            for (let i=0; i< array.length; i++) {
                                if (i ==0 ){
                                    result = array[i];
                                } else {
                                    result = <span>{result}{ br }{array[i]}</span>
                                }
                            }
                            for (let i=0; i< twoArray.length; i++) {
                                if (i ==0 ){
                                    result2 = twoArray[i];
                                } else {
                                    result2 = <span>{result2}{ br }{twoArray[i]}</span>
                                }
                            }
                            return <div class="bb" >
                                <div   class="bb">{result}</div>
                             
                                <div >{result2}</div>
                                 </div>


    }
                   
                    },
                    {
                        title: '下注金额',
                        key: 'validBetAmount',
                        align: 'center',
                        render:(h,params)=>{
                           if(params.row.newIndex<=2)
                            return(
                                <div >
                                    <ul class="bb " style={{height:`42+"px"`,lineHeight:42+'px'}}  >
                                    {
                                        params.row.list0.map(t=>(
                                            <li   >
                                                {t.validBetAmount?t.validBetAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                 <ul class="bb "  >
                                    {
                                        params.row.list1.map(t=>(
                                            <li style={{height:`42+"px"`,lineHeight:42+'px'}}    >
                                                {t.validBetAmount?t.validBetAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                </div>
                             
                            )
                            else{
                               return(
                                <div  >
                                    <ul class="bb " style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}  >
                                    {
                                        params.row.list0.map(t=>(
                                            <li   >
                                                {t.validBetAmount?t.validBetAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                 <ul class="bb "  >
                                    {
                                        params.row.list1.map(t=>(
                                            <li style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}    >
                                                {t.validBetAmount?t.validBetAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                </div>
                               )
                            }
                        }
                       
                    },{
                        title: '输赢',
                        key: 'netAmount',
                        align: 'center',
                        render:(h,params)=>{
                            if(params.row.newIndex<=2)
                            return(
                                <div >
                                    <ul class="bb " style={{height:`42+"px"`,lineHeight:42+'px'}}  >
                                    {
                                        params.row.list0.map(t=>(
                                            <li  >
                                                {t.netAmount?t.netAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                 <ul class="bb "  >
                                    {
                                        params.row.list1.map(t=>(
                                            <li style={{height:`42+"px"`,lineHeight:42+'px'}}    >
                                                {t.netAmount?t.netAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                </div>
                             
                            )
                            else{
                               return(
                                <div >
                                    <ul class="bb " style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}  >
                                    {
                                        params.row.list0.map(t=>(
                                            <li   >
                                                {t.netAmount?t.netAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                 <ul class="bb "  >
                                    {
                                        params.row.list1.map(t=>(
                                            <li style={{height:`21*(params.row.newIndex)+"px"`,lineHeight:21*(params.row.newIndex)+'px'}}    >
                                                {t.netAmount?t.netAmount:'0'}
                                            </li>
                                        ))  
                                    }
                                
                             
                                 </ul>
                                </div>
                               )
                            }
                        }
                     
                    }
                ],
                data: [],
             }
         }
      },
      methods:{
          show(detialData){
            this.detialData=detialData;  
             this.$refs.fightModals.show();
             this.getData(detialData)  
          },
          getData(detialData){
            this.$refs.fightModals.spinShow();
            getReportMutualDetails(detialData).then(res=>{
                if(res!=undefined&&res.code==200){
                    this.$refs.fightModals.spinHide();
                    const {data,total}=res.data;
                    if(data.length>0){
                     
                    let obj={};
                    let  tableData=[];
                    data.forEach((item,index)=>{
                       
                        let newData=[];
                        item.map((m,index)=>{
                            obj=m;
                            // obj['betContent'+index]=m['betContent'];
                            // delete obj['betContent']
                            // obj['netAmount'+index]=m['netAmount'];
                            // delete obj['netAmount']
                            obj['siteName'+index]=m['siteName'];
                            delete obj['siteName']
                            obj['userName'+index]=m['userName'];
                            delete obj['userName']
                            // obj['validBetAmount'+index]=m['validBetAmount'];
                            // delete obj['validBetAmount']
                            obj['list'+index]=m['list'];
                            delete obj['list']
                            // console.log(m.list)
                            newData.push(obj)
                            
                            let newObj=Object.assign(...newData) 
                            tableData.push(newObj);      
                        }) 
                    })
                 
                    // console.log(newData)
                    // let newObj=Object.assign(...newData) 
                    // tableData.push(newObj);
                   
                //    let a=   tableData.filter(()=>{(item,index,self)=>{
                //         return self.indexOf(item) == index;
                //     }})
                    let  arr2 = tableData.filter((x, index,self)=>self.indexOf(x)===index)  
                    // console.log(arr2)
                  
                    this.table.data=arr2;
                    this.table.total=total;
                    }else{
                        this.table.data=[];
                        this.table.total=total;
                    }
                }
            }).catch(error=>{this.$refs.fightModals.spinHide();})
          },
          onPageChange(page){
              this.page=page;
              let data={...this.detialData,page};
              for (let key in data){
             if(!data[key]) delete data[key];
              }
              this.getData(data);
          },
          onPageSizeChange(pageSize){
          
            let data={...this.detialData,limit:pageSize};
              for (let key in data){
             if(!data[key]) delete data[key];
              }
              this.getData(data);
          }
      },
  }
</script>
<style lang="less" scoped>
  
   /deep/.ivu-table-body{
    /deep/.ivu-table-column-center:nth-child(6){
    border-bottom: 1px solid #fff!important;
   }
   /deep/.ivu-table-column-center:nth-child(7){
    border-bottom: 1px solid #fff!important;
   }
   /deep/.ivu-table-column-center:nth-child(8){
    border-bottom: 1px solid #fff!important;
   }
   }
  

</style>