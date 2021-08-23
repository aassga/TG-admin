<template>
    <div class="cmg-v2-table" v-if="adminType == 'super' || authInPage.indexOf('companyBankCardList') != -1">
        <Tables
            ref="table"
            editable
            :columns="table.columns"
            :loading="$root.tableLoading"
            :value="table.data"
            :total="table.total"
            :draggable="true"
            @on-delete="onDelete"
            @on-edit="onEdit"
            :pageSizeOpts="table.pageSizeOpts"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
            @on-change-status="changeStatus"
            @on-drag-drop="onDragDrop"
            :more="table.more"
        ></Tables>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Icons from '@/components/icons';
import { getUserType } from '@/libs/util';
import {getMemberGroupList} from '@/api/member';
import { companyBankCardSequence, companyBankCardListData, companyBankCardModifyStatusData, companyBankCardDelete } from '@/api/finance';
export default {
    props: ['title', 'id','newStatus','newGroupId'],
    components: { Tables, Icons },
    data() {
        return {
            selectLength:'',
            selectList:[],
            classId: '1',
            countPage: '',
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            searchkey: {
                siteId: this.$root.nowSite.id
            },
            limit: 20,
            table: {
                total: 0,
                title: '入款卡管理',
                pageSize: 20,
                pageSizeOpts: [20, 30, 40, 50],
                columns: [
                    {
                        title: '排序',
                        key: 'sort',
                        align: 'center',
                        render: (h, params) => <Icons type="paixukongjian" color="#dadada" size="20" />,
                        width: 60
                    },
                    {
                        title: '银行名称',
                        key: 'bankName',
                        align: 'center',
                        minWidth: 55,
                        tooltip: true
                    },
                    {
                        title: '持卡姓名',
                        key: 'cardName',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true
                    },
                    {
                        title: '银行卡号',
                        key: 'cardNum',
                        align: 'center',
                        minWidth: 155
                    },
                    {
                        title: '开户网点',
                        key: 'cardAddress',
                        align: 'center',
                        minWidth: 110,
                        tooltip: true,
                        className: 'pl5 pr5',
                        render:(h,params)=>{
                            const {cardAddress}=params.row;
                          
                            return(
                            
                                <span > {cardAddress?cardAddress:'-'}</span>
                               
                              
                            )
                        }
                    },
                     {
                        title: '开放分组',
                        key: 'group_name',
                        align: 'center',
                        minWidth: 110,
                        tooltip: true,
                        className: 'pl5 pr5'
                    },
                    {
                        title: '开放等级',
                        key: 'levelAlias',
                        align: 'center',
                        minWidth: screen.width < 1600 ? 85 : 120,
                        tooltip: true,
                        className: screen.width < 1600 ? 'pl5 pr5' : 'pl20 pr20'
                    },
                    //  {
                    //   title: "开放等级",
                    //   key: "levelAlias",
                    //   align: "center",
                    //   minWidth:screen.width<1600?65:120,
                    //   tooltip: true,
                    //   className:screen.width<1600?'pl5 pr5':'pl20 pr20',
                    //   // width:screen.width<1460?160:'',
                    //   render: (h, params) => {
                    //     if (params.row.levelAlias.length > 10) {
                    //     }
                    //     if(screen.width>1460){
                    //       return (
                    //       <Tooltip max-width="200" placement="right-start">
                    //         <div style="margin-left:1.25rem;margin-right:1.25rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:9.375rem;">
                    //           <span class=" ib">{params.row.levelAlias}</span>
                    //         </div>
                    //         <div slot="content">
                    //           <span>{params.row.levelAlias}</span>
                    //         </div>
                    //       </Tooltip>
                    //       );
                    //     }else{
                    //       return (
                    //       <Tooltip max-width="200" placement="right-start">
                    //         <div style="margin-left:1.25rem;margin-right:1.25rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:6.875rem;">
                    //           <span class=" ib">{params.row.levelAlias}</span>
                    //         </div>
                    //         <div slot="content">
                    //           <span>{params.row.levelAlias}</span>
                    //         </div>
                    //       </Tooltip>
                    //     );
                    //     }

                    //     if (params.row.levelAlias.length < 10) {
                    //       <Tooltip max-width="155">
                    //         <div>
                    //           <span>{params.row.levelAlias}</span>
                    //         </div>
                    //         <div slot="content">
                    //           <span>{params.row.levelAlias}</span>
                    //         </div>
                    //       </Tooltip>;
                    //     }
                    //   }
                    // },
                    {
                        title: '开放终端',
                        key: 'terminal',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let arr = [];
                            params.row.terminal.split(',').forEach(t => {
                                arr.push(t == 'android' ? 'Android' : t.toUpperCase());
                            });
                            return <span>{arr.join(',')}</span>;
                        }
                    },
                    {
                        title: '今日存款',
                        key: 'depositAmount',
                        align: 'center',
                        minWidth: 100,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                    {params.row.todayDepositAmount}/{params.row.todayDepositCount}笔
                                </div>
                            );
                        }
                    },
                    {
                        title: '存款总额',
                        key: 'depositAmount',
                        align: 'center',
                        minWidth: 130,
                        tooltip: true,
                        render: (h, params) => {
                            return (
                                <div>
                                    {params.row.depositAmount}/{params.row.depositCount}笔
                                </div>
                            );
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'addTime',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => <span class="ml5 mr5">{this.$root.newUnixTime(params.row.addTime)}</span>
                    },
                    {
                        title: '创建人',
                        key: 'addUserName',
                        align: 'center',
                        minWidth: 75,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 30,
                        render: (h, params) => {
                            const { status } = params.row;
                            return (
                                <span
                                    style={{
                                        color: status === 'yes' ? '' : '#ff2626'
                                    }}
                                >
                                    {status === 'yes' ? '正常' : '停用'}
                                </span>
                            );
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 96,
                        render: (h, params) => {
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('companyBankCardModifyStatus') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.changeStatus(params);
                                        }}
                                    >
                                        {params.row.status == 'yes' ? '停用' : '启用'}
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display:
                                                this.adminType == 'super' ||
                                                this.authInPage.indexOf('companyBankCardUpdate') != -1 ||
                                                this.authInPage.indexOf('incomeCardManageOpenLevel') != -1
                                                    ? 'inline-block'
                                                    : 'none'
                                        }}
                                        onClick={() => {
                                            this.onEdit(params);
                                        }}
                                    >
                                        编辑
                                    </a>
                                    <a
                                        class="ib"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('companyBankCardDelete') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onDelete(params);
                                        }}
                                    >
                                        删除
                                    </a>
                                </div>
                            );
                        }
                    }
                ],
                data: []
            }
        };
    },
    mounted() {
     
       if(this.$route.params.group_id){
             let  data;
           if(this.$route.params.status=='no'){
                      data = {siteId: this.$root.nowSite.id,status:'no', };
                  }else{
                      data = { siteId: this.$root.nowSite.id, status:'yes',
                       group_id:this.$route.params.group_id,};
                  }

                    for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                   this.getData({ params: data });


       }else{

           getMemberGroupList({siteId:this.$root.nowSite.id}).then(res=>{
          if(res!=undefined&&res.code==200){
             this.selectList=res.data;
             this.selectLength=this.selectList.length;
          
             this.searchkey.status=this.newStatus;
      
             if(this.newGroupId==''||this.newGroupId===undefined){//未获取到值
          
             let data={
                  siteId: this.$root.nowSite.id,
                  group_id:this.selectLength,
                  status:'yes',
             }
                   this.getData({ params: data });
             }else{
                 let data;
             if(this.newGroupId=='no'){
                      data = {
                 siteId: this.$root.nowSite.id,
                  status:this.newStatus, 
                  };
         
             }else{
                 data = {
                 siteId: this.$root.nowSite.id,
                 group_id:this.newGroupId||this.newGroupId,
                 status:'yes', 
             };
           
             }
               for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
             this.searchkey=data;
           
     if (this.id) {
         this.classId = this.id;
         this.getData({ params: data });
     }else{
         this.getData({ params: data });
     } 
             }
          }
        })
       }

        if(this.authInPage.indexOf('companyBankCardDelete') == -1&&this.authInPage.indexOf('companyBankCardUpdate') == -1
        &&this.authInPage.indexOf('incomeCardManageOpenLevel') == -1&&this.authInPage.indexOf('companyBankCardModifyStatus') == -1
        ){
            let arr=[]
            this.table.columns.forEach(t=>{
                if(t.title!='操作'){
                  arr.push(t)
                }
            })
            this.table.columns=arr;
        }
      if(this.$root.groupLenth()<2){
        let newArr = [];
       this.table.columns.forEach(t=>{

         if(t.key != 'group_name')newArr.push(t);
          this.table.columns = newArr;
			 })
           }
    },
    methods: {
  
        //拖拽排序
        onDragDrop(oldIndex, newIndex) {
            if (oldIndex == newIndex || oldIndex == '') return;
            const params = {
                current_id: this.$refs.table.insideTableData[oldIndex].id,
                neighbor_id: this.$refs.table.insideTableData[newIndex].id,
                siteId: this.$root.nowSite.id,
                direction: +oldIndex > +newIndex ? 'up' : 'down'
            };
            let page = this.countPage;
            companyBankCardSequence(params, true).then(res => {});
            // 更改
            this.$refs.table.insideTableData.splice(newIndex, 0, ...this.$refs.table.insideTableData.splice(oldIndex, 1));
        },
        getQuery(params) {
            this.searchkey = {
                siteId: this.$root.nowSite.id,
                status: params.status,
                levelLabel: params.levelLabel,
                limit: this.limit,
                group_id:params.group_id,
                status:params.status
            };
         
            let data = { params: this.searchkey };
            this.getData(data);
        },
        getData(data) {
            this.$root.startTableLoading();
            companyBankCardListData(data).then(res => {
                const { data, total } = res.data;
                this.table.data = data;
                this.table.total = total;
                this.pageUrl = res.data.last_page_url;
                this.table.data.forEach(item => {
                    if (item.status == 'enabled') {
                        item.status = 'yes';
                    } else {
                        item.status = 'no';
                    }
                });
                this.$root.endTableLoading();
            });
        },
        // 修改状态
        changeStatus(params) {
            let text, msg;
            const { bankName, id, status } = params.row;
            if (status === 'yes') {
                text = `您确定停用${bankName}吗？`;
                msg = `停用成功${bankName}`;
            }
            if (status === 'no') {
                text = `您确定启用${bankName}吗？`;
                msg = `启用成功${bankName}`;
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id,
                status: status === 'yes' ? 'no' : 'yes'
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    let origin = this.table.data[params.index].status;
                    companyBankCardModifyStatusData(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.config({
                                top: 150
                            });
                            this.$Message.success({ content: msg });
                            this.table.data[params.index].status = this.table.data[params.index].status === 'yes' ? 'no' : 'yes';
                            this.table.data.splice(params.index, 1);
                            this.table.total--;
                        }
                    });
                }
            });
        },
        // 银行卡管理删除
        onDelete(params) {
            let text = `您确定删除${params.row.bankName}吗？`;
            let msg = `删除${params.row.bankName}成功`;
            const data = {
                id: params.row.id,
                siteId: this.$root.nowSite.id
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    companyBankCardDelete(data, true).then(res => {
                        if (res != undefined && res.code == 200)
                            if (typeof res.data === 'string') {
                                this.$Message.config({
                                    top: 150
                                });
                                this.$Message.success({ content: msg });
                                this.table.data.splice(params.index, 1);
                                let page = this.countPage;                
                                if(this.newGroupId=='no'){
                                    data.status='no';
                                }else{
                                    data.status='yes';
                                    data.group_id=this.newGroupId;
                                }
                                this.getData({ params: data, query: { page } });
                                if (this.table.data.length < 1) {
                                    this.getData({ params: data });
                                }
                            }
                    });
                }
            });
        },
        onEdit(params) {
            const {customize,bankName, cardNum, 
            cardName, cardAddress, terminal, levelAlias, status, id, addUserName, 
            levelLabel,group_id,group_name,quick_amount} = params.row;
            this.$router.push({
                name: 'bankCardEdit',
                params: { page: 'edit' },
                //传编辑的参数
                query: {
                    bankName,
                    cardNum,
                    cardName,
                    cardAddress,
                    terminal,
                    levelAlias,
                    status,
                    id,
                    addUserName,
                    levelLabel,
                    group_id,
                    group_name,
                    customize,
                    quick_amount,
                    inCard: 'card'
                }
            });
        },
        //点击分页
        onPageChange(page) {
            this.countPage = page;
            let data = {  ...this.searchkey,limit: this.pageSize,};
                  if(this.newGroupId=='no'){
                 data.status='no';
                }else{
                 data.status='yes';
                 data.group_id=this.newGroupId;
             } 
             
           
            this.getData( {params:data,query:{ page }});
        },
        onPageSizeChange(pageSize) {
            let data ={...this.searchkey,  limit: pageSize,siteId: this.$root.nowSite.id ? this.$root.nowSite.id : this.$parent.$root.nowSite.id};
             if(this.newGroupId=='no'){
                 data.status='no';
                }else{
                 data.status='yes';
                 data.group_id=this.newGroupId;
             }
            this.limit = pageSize;
            this.getData({ params: data});
            this.pageSize = pageSize;
        }
    }
};
</script>

<style lang="less" scoped>
.cmg-v2-table {
    /deep/thead {
        th {
            .ivu-table-cell {
                span {
                    font-size: 1rem;
                    font-weight: normal;
                }
            }
        }
    }
}

/deep/.ivu-table-wrapper {
    overflow: visible;
}
</style>
