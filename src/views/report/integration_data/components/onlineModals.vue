<template>
   <div>
    <Modals  ref="onlineModals" :title=onlineCount :width="1400">
        <div slot="content">
           <div>
            <Button v-for="(t,i) in  btnList"  @click.prevent="changeBtn(t)" :style="activeBtn==t?'background-color:#2d8cf0;color:#fff':''" class="ml20 mb20" :key="i">{{t}}</Button>
           </div>
           <div style="height:500px;overflow:auto">
                <Tables
                class="ml20 mr20 mb20"
                ref="table"
                :loading="$root.tableLoading"
                :columns="table.columns"
                :value="table.data"
                :total="table.total"
                :page="false"
                :page-size-opts="table.pageSizeOpts"
                ></Tables>
           </div>
           
        </div>
    </Modals>
   </div>
</template>
<script>
import Modals from '_c/modals';
import Tables from '_c/tables';
import { memberOnline } from '@/api/report';
    export default{
        components: { Modals,Tables },
        data(){
           return{
            btnList:['本月','上月'],
            activeBtn:'本月',
            onlineCount:'',
            terminalNew:'',
            table: {
                total: 0,
                data: [],
                terminal:'',
                pageSizeOpts: [10],
                loading: true,
                columns: [
                    {
                        title: '日期',
                        key: 'date',
                        align: 'center',
                        width:93
                    },
                    {
                        title: '01:00',
                        key: '1',
                        align: 'center'
                    },
                    {
                        title: '02:00',
                        key: '2',
                        align: 'center',
                    },
                    {
                        title: '03:00',
                        key: '3',
                        align: 'center',
                    },
                    {
                        title: '04:00',
                        key: '4',
                        align: 'center',
                    },
                    {
                        title: '05:00',
                        key: '5',
                        align: 'center',
                    },
                    {
                        title: '06:00',
                        key: '6',
                        align: 'center',
                    },
                    {
                        title: '07:00',
                        key: '7',
                        align: 'center'
                    },
                    {
                        title: '08:00',
                        key: '8',
                        align: 'center'
                    },
                    {
                        title: '09:00',
                        key: '9',
                        align: 'center'
                    },
                    {
                        title: '10:00',
                        key: '10',
                        align: 'center'
                    },
                    {
                        title: '11:00',
                        key: '11',
                        align: 'center'
                    },
                    {
                        title: '12:00',
                        key: '12',
                        align: 'center'
                    },
                    {
                        title: '13:00',
                        key: '13',
                        align: 'center'
                    },
                    {
                        title: '14:00',
                        key: '14',
                        align: 'center'
                    },
                    {
                        title: '15:00',
                        key: '15',
                        align: 'center'
                    },
                    {
                        title: '16:00',
                        key: '16',
                        align: 'center'
                    },
                    {
                        title: '17:00',
                        key: '17',
                        align: 'center'
                    },
                    {
                        title: '18:00',
                        key: '18',
                        align: 'center'
                    },
                    {
                        title: '19:00',
                        key: '19',
                        align: 'center'
                    },
                    {
                        title: '20:00',
                        key: '20',
                        align: 'center'
                    },
                    {
                        title: '21:00',
                        key: '21',
                        align: 'center'
                    },
                    {
                        title: '22:00',
                        key: '22',
                        align: 'center'
                    },
                    {
                        title: '23:00',
                        key: '23',
                        align: 'center'
                    },
                    {
                        title: '24:00',
                        key: '24',
                        align: 'center'
                    }
                ]
            },
           }
         
        },
        methods:{
            changeBtn(t){
                this.activeBtn=t;
                console.log(this.activeBtn)
                let data={
                device: this.terminalNew,
                siteId:this.$root.nowSite.id,
               }
                if(t=='本月'){
                   data.startTime=this.$root.monthStartTime();
                   data.endTime=this.$root.monthEndTime();
                }else{
                  data.startTime=this.$root.lastMonthStartTime();
                  data.endTime=this.$root.lastMonthEndTime();
                }
              
                this.getData(data)
            },
            showModals(terminal){   
               this.onlineCount="在线人数:"+(terminal=='pc'?'PC端':(terminal=='h5'?'H5端':(terminal=='android'?'Android端':(terminal=='ios'?'IOS端':'全部')))) ;
              this.terminalNew=terminal;
                this.changeBtn('本月')
                this.$refs.onlineModals.show();

            },
            getData(data){
                this.$refs.onlineModals.spinShow();
                memberOnline(data).then(res=>{
                   this.table.data=res.data;
                   this.$refs.onlineModals.spinHide();
                }).catch(error=>{this.$refs.onlineModals.spinHide()})
            }
        }
    }
</script>
<style lang="less" scoped>
</style>