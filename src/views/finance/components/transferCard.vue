<template>
    <div>
        <Tables
            editable
            ref="table"
            :columns="table.columns"
            :loading="$root.tableLoading"
            :value="table.data"
            :total="table.total"
            @on-edit="onEdit"
            @on-delete="onDelete"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
            @on-change-status="changeStatus"
            :draggable="true"
            @on-drag-drop="onDragDrop"
            :pageSizeOpts="table.pageSizeOpts"
            :more="table.more"
        ></Tables>
    </div>
</template>
<script>
import { companyBankCardSequence, companyBankCardListData, companyBankCardModifyStatusData, companyBankCardDelete } from '@/api/finance';
import { QRCodeModifyStatus } from '@/api/finance';
import Icons from '@/components/icons';
import Tables from '@/components/tables';
import {  getUserType } from '@/libs/util';
export default {
    props: ['id', 'classNameList','newStatus','newGroupId'],
    components: {
        Tables,
        Icons
    },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            searchkey: {
                 siteId: this.$root.nowSite.id
            },
            limit: 20,
            countPage: '',
            table: {
                total: 0,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
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
                        minWidth: 65,
                        tooltip: true
                    },
                    {
                        title: '持卡姓名',
                        key: 'cardName',
                        align: 'center',
                        minWidth: 55,
                        tooltip: true
                    },
                    {
                        title: '银行卡号',
                        key: 'cardNum',
                        align: 'center',
                        minWidth: 75,
                        tooltip: true
                    },
                     {
                        title: '开放分组',
                        key: 'group_name',
                        align: 'center',
                        minWidth: 110,
                        tooltip: true,
                        className: 'pl5 pr5'
                    },
                    // {
                    //     title: '银行归属地',
                    //     key: 'cardAddress',
                    //     minWidth: 60,
                    //     align: 'center',
                    //     tooltip: true
                    // },
                    // {
                    // 	title: "单笔下限",
                    // 	key: "min_amount",
                    // 	align: "center",
                    // 	minWidth: 60
                    // },
                    // {
                    // 	title: "单笔上限",
                    // 	key: "max_amount",
                    // 	align: "center",
                    // 	minWidth: 75
                    // },
                    // {
                    //     title: '单笔限额',
                    //     key: '',
                    //     minWidth: 130,
                    //     align: 'center',
                    //     tooltip: true,
                    //     render: (h, params) => {
                    //         const { min_amount, max_amount } = params.row;
                    //         return (
                    //             <div>
                    //                 <span>{min_amount}</span>-<span>{max_amount}</span>
                    //             </div>
                    //         );
                    //     }
                    // },
                    // {
                    // 	title: "常用金额",
                    // 	key: "quick_amount",
                    // 	align: "center",
                    // 	minWidth: 75,
                    // 	tooltip: true
                    // },
                    {
                        title: '开放等级',
                        key: 'levelAlias',
                        align: 'center',
                        minWidth: screen.width < 1600 ? 55 : 110,
                        tooltip: true,
                        className: screen.width < 1600 ? 'pr5 pl5' : 'pr20 pl20'
                    },
                    {
                        title: '开放终端',
                        key: 'terminal',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let arr = [];
                            params.row.terminal&&params.row.terminal.split(',').forEach(t => {
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
                        minWidth: 140,
                        render: (h, params) => {
                            return (
                                <span>
                                    {params.row.depositAmount}/{params.row.depositCount}笔
                                </span>
                            );
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'addTime',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => <span class="pl5 pr5">{this.$root.newUnixTime(params.row.addTime)}</span>
                    },
                    {
                        title: '创建人',
                        key: 'addUserName',
                        align: 'center',
                        minWidth: 65,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 25,
                        render: (h, params) => {
                            let color = params.row.status === 'yes' ? '' : '#FF2626FF';
                            return <span style={{ color }}>{params.row.status === 'yes' ? '正常' : '停用'}</span>;
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
                                                this.authInPage.indexOf('QRCodeUpdate') != -1 ||
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
                                            display: this.adminType == 'super' || this.authInPage.indexOf('QRCodeDelete') != -1 ? 'inline-block' : 'none'
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
                ]
            }
        };
    },
    mounted() {
                   
                 
             if(this.$route.params.group_id){
                  let  data;
                  if(this.$route.params.status=='no'){
                      data = {siteId: this.$root.nowSite.id,classId: this.id,status:'no', };
                  }else{
                      data = { siteId: this.$root.nowSite.id, classId: this.id, status:'yes',
                       group_id:this.$route.params.group_id,};
                  }
                   this.searchkey = data;
                   this.getData({ params: data });
             }else{
                
                 let  data;
                  if(this.newGroupId=='no'){
                     data = {siteId: this.$root.nowSite.id,classId: this.id, status:this.newStatus,};
                       for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                   
                  }else{
                      data = { siteId: this.$root.nowSite.id, classId: this.id, status:'yes', group_id:this.newGroupId,};
                      for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                  }
                
                   this.searchkey = data;
                  this.getData({ params: data });
                  if (data.classId){  this.getData({ params: data }); }
             }

      
          
        if(this.authInPage.indexOf('QRCodeDelete') == -1&&this.authInPage.indexOf('QRCodeUpdate') == -1
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
    watch: {
        id: {
            handler(val, oldVal) {
                this.$nextTick(() => {
                    let data
                     if(this.newGroupId=='no'){
                         data = {
                    siteId: this.$root.nowSite.id,
                    classId: this.id,
                     status:this.newStatus,
                   
                };
                }else{
                         data = {
                    siteId: this.$root.nowSite.id,
                    classId: this.id,
                     status:'yes',
                      group_id:this.newGroupId,
                };     
                }
                  for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                
                    this.getData({ params: data });
                });
            }
        },
        deep: true,
        immediate: true
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading();
            companyBankCardListData(data).then(res => {
                this.table.loading = false;
                const { data, total } = res.data;
                this.table.data = data;
                this.table.total = total;
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
        getQuery(params) {
            this.searchkey = {
                siteId: this.$root.nowSite.id,
                status: params.status,
                levelLabel: params.levelLabel,
                classId:params.classId,
                limit: this.limit,
                 group_id:params.group_id,
            };
            let data = { params: this.searchkey };
            this.getData(data);
        },
        // 修改支付宝扫码状态
        changeStatus(params) {
            let text, msg;
            const { id, status, className } = params.row;
            if (status === 'yes') {
                text = `您确定停用支付宝转账吗？`;
                msg = `停用支付宝转账成功`;
            }
            if (status === 'no') {
                text = `您确定启用支付宝转账吗？`;
                msg = `启用支付宝转账成功`;
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id,
                status: status === 'yes' ? 'no' : 'yes'
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    companyBankCardModifyStatusData(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            params.row.status = status === 'yes' ? 'no' : 'yes';
                            this.$Message.success({ content: msg });
                              this.table.data.splice(params.index, 1);
                            this.table.total--;
                        }
                    });
                }
            });
        },
        onEdit(params) {
            let className = this.classNameList.filter(t => t.id === this.id)[0].className;
            const { bankName, cardNum, cardName, cardAddress, terminal, levelAlias, status, id, addUserName, levelLabel, quick_amount, min_amount, max_amount ,group_id,group_name} = params.row;
            this.$router.push({
                name: 'bankCardEdit',
                params: { page: 'transferEdit' },
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
                    max_amount,
                    min_amount,
                    quick_amount,
                    inCard: 'transfer_bank',
                    className,
                    classId: this.id,
                    group_id,
                    group_name
                }
            });
        },
        onPageChange(page) {
            this.countPage = page;
            let data = {
                params: {
                    ...this.searchkey,
                    limit: this.pageSize,
                    siteId: this.$root.nowSite.id
                },
                query: { page }
            };
            this.getData(data);
        },
        onPageSizeChange(pageSize) {
            this.limit = pageSize;
            this.getData({
                params: {
                    ...this.searchkey,
                    limit: pageSize,
                    siteId: this.$root.nowSite.id ? this.$root.nowSite.id : this.$parent.$root.nowSite.id
                }
            });
            this.pageSize = pageSize;
        },
        onDragDrop(oldIndex, newIndex) {
            if (newIndex == oldIndex || oldIndex == '') return;
            const params = {
                current_id: this.$refs.table.insideTableData[oldIndex].id,
                neighbor_id: this.$refs.table.insideTableData[newIndex].id,
                siteId: this.$root.nowSite.id,
                direction: +oldIndex > +newIndex ? 'up' : 'down'
            };
            let page = this.countPage;
            companyBankCardSequence(params, true).then(res => {});
            this.$refs.table.insideTableData.splice(newIndex, 0, ...this.$refs.table.insideTableData.splice(oldIndex, 1));
        },

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


                            }
                    });
                }
            });
        }
    }
};
</script>