<!--
 * @Author: your name
 * @Date: 2020-05-03 18:05:04
 * @LastEditTime: 2020-05-03 18:31:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tgweb_admin_h5_v2\src\views\finance\components\historyModals.vue
 -->
<template >
    <Modals title="历史登入" ref="historyModal" width="800">
        <div slot="content" class=" mb20 ml10 mr10">
          <Tables
            :value="table.data"
            :columns="table.columns"
            :pageFixShow="true"
            :page-size-opts="table.pageSizeOpts"
            :show-sizer="false"
            :pageFix="10"
            :total="table.total"
            :loading="$root.tableLoading"
            @on-page-change="onPageChange"
          >
          </Tables>
        </div>
      </Modals>
</template>
<script>
import Modals from "_c/modals";
import { memberDetail } from '@/api/member';
import Tables from "_c/tables";
import { checkBetAmount } from "@/api/finance";
    export default{
        name:"historyModals",
        props:["uid"],
        components: {
            Modals,
            Tables
        },
        data(){
            return{
                basicInfo:'',
                table: {
                    total: 0,
                pageSizeOpts: [10],
                columns: [
                    {
                        title: '登录设备',
                        key: 'device',
                        align: 'center',
                        render: (h, params) => {
                            let { device } = params.row;
                            return <span>{this.$root.text(device == 'pc' ? 'PC' : device == 'h5' ? 'H5' : device == 'android' ? 'Android' : 'IOS')}</span>;
                        }
                    },
                    {
                        title: '登录域名',
                        key: 'domain',
                        align: 'center'
                    },
                    {
                        title: '登录IP',
                        key: 'ip',
                        align: 'center'
                    },
                    {
                        title: '归属地',
                        key: 'location',
                        align: 'center'
                    },
                    {
                        title: '登录时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    }
                ],
                data: []
      }
     
            }
        },

        methods:{
            getShow(){
                let data={
          siteId:this.$root.nowSite.id,
          uid:this.uid,
          limit:10
          }
    this.getHistory({params:data});
                this.$refs.historyModal.show();
            },
            getHistory(data){
            // this.$root.startTableLoading();
            this.$refs.historyModal.spinShow();
          memberDetail(data).then(res=>{
        if(res!=undefined&&res.code==200){
            this.$refs.historyModal.spinHide();
            const {basic}=res.data;
            this.basicInfo=basic;
            const{login_history}=this.basicInfo;
            this.table.data=login_history.data;
            this.table.total=login_history.total;
        }
      }).catch(error=>this.$refs.historyModal.spinHide());
    },
    onPageChange(page){
        let data={
            siteId: this.$route.query.siteId,
            uid:this.uid,
            limit:10
        }
    
        this.getHistory({params:data,query:{page}})
    },
    
        }
    }
</script>