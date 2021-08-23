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
        <Modals ref="imgModal" title="图片预览" :width="500">
            <div slot="content">
                <div class="w200x h200 mt20  mb20 ma">
                    <img :src="imgBoxSrc" class="w100 h200" />
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import Modals from '@/components/modals';
import Tables from '@/components/tables';
import { getUserName } from '@/libs/util';
import Icons from '@/components/icons';
import { QRCodeList, QRCodeModifyStatus, QRCodeDelete, QRCodeUpdate, QRCodeSequence, paymentClassName } from '@/api/finance';
export default {
    props: ['id',"newStatus",'newGroupId'],
    name: 'sweepCode',
    components: {
        Tables,
        Modals
    },
    data() {
        return {
            searchkey: {
                siteId: this.$root.nowSite.id
            },
            limit: 20,
            countPage: '',
            imgBoxSrc: '',
            authInPage: JSON.parse(localStorage.authInPage),
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
                        title: '扫码类型',
                        key: 'className',
                        align: 'center',
                        minWidth: 65,
                        tooltip: true
                    },
                    {
                        title: '收款姓名',
                        key: 'payName',
                        align: 'center',
                        minWidth: 55,
                        tooltip: true
                    },
                    {
                        title: '二维码图片',
                        key: 'qr_code',
                        align: 'center',
                        minWidth: 65,
                        render: (h, params) => {
                            return (
                                <div>
                                    <div class="imgBox">
                                        <img class="w50x h50" src={params.row.src} />
                                        <div class="imgBoxCover">
                                            <Icon
                                                type="ios-eye-outline"
                                                onClick={() => {
                                                    this.imgBoxSrc = params.row.src;
                                                    this.$refs.imgModal.show(this.imgBoxSrc);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    },

                    // {
                    // 	title: "单笔下限",
                    // 	key: "min_amount",
                    // 	align: "center",
                    // 	minWidth:60,
                    // },
                    // {
                    // 	title: "单笔上限",
                    // 	key: "max_amount",
                    // 	align: "center",
                    // 	minWidth:75,
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
                     {
                        title: '开放分组',
                        key: 'group_name',
                        align: 'center',
                        
                        minWidth:50,
                        className: 'pl5 pr5'
                    },
                    {
                        title: '开放等级',
                        key: 'levelAlias',
                        align: 'center',
                        minWidth: screen.width < 1600 ? 65 : 120,
                        tooltip: true,
                        className: screen.width < 1600 ? 'pr5 pl5' : 'pr20 pl20'
                    },
                    // {
                    //   title:"常用金额",
                    //   key:"quick_amount",
                    //   align:"center",
                    //   minWidth:75,
                    //   render:(h,params)=>{
                    //     return(<span>{params.row.quick_amount?params.row.quick_amount:'-'}</span>)
                    //   }
                    // },

                    {
                        title: '开放终端',
                        key: 'devices',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let arr = [];
                            params.row.devices.split(',').forEach(t => {
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
                        key: 'created_at',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => <span class="pl5 pr5">{this.$root.newUnixTime(params.row.created_at)}</span>
                    },
                    {
                        title: '创建人',
                        key: 'created_user',
                        align: 'center',
                        minWidth: 75,
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
                                            display: this.adminType == 'super' || this.authInPage.indexOf('QRCodeModifyStatus') != -1 ? 'inline-block' : 'none'
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
                       for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                   this.getData({ params: data });
             }else{
                 let  data;
                  if(this.newGroupId=='no'){
                     data = {siteId: this.$root.nowSite.id,classId: this.id, status:this.newStatus,};
                  }else{
                      data = { siteId: this.$root.nowSite.id, classId: this.id, status:'yes', group_id:this.newGroupId,};
                  }
                    for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                     this.searchkey = data;
                  this.getData({ params: data });
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
                let data;
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
                   group_id:this.newGroupId,
                   status:'yes',
                };     
                } 
                  for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                this.getData({ params: data });
            }
        }
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading();
            QRCodeList(data).then(res => {
                this.table.loading = false;
                const { data, total } = res.data;
                this.table.data = data;
                this.table.total = total;
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
        changeStatus(params) {
            let text, msg;
            const { id, status, className } = params.row;
            if (status === 'yes') {
                text = `您确定停用${className}吗？`;
                msg = `停用${className}成功`;
            }
            if (status === 'no') {
                text = `您确定启用${className}吗？`;
                msg = `启用${className}成功`;
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id,
                status: status === 'yes' ? 'no' : 'yes'
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    QRCodeModifyStatus(data, true).then(res => {
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
        onDragDrop(oldIndex, newIndex) {
            if (oldIndex == newIndex || oldIndex == '') return;
            const params = {
                current_id: this.$refs.table.insideTableData[oldIndex].id,
                neighbor_id: this.$refs.table.insideTableData[newIndex].id,
                siteId: this.$root.nowSite.id,
                direction: +oldIndex > +newIndex ? 'up' : 'down',
                classId: this.id
            };
            QRCodeSequence(params, true).then(res => {
                // this.getData(this.bannerData);
                //不请求接口更改排序
                this.$refs.table.insideTableData.splice(newIndex, 0, ...this.$refs.table.insideTableData.splice(oldIndex, 1));
            });
        },
        onDelete(params) {
            let text = '您确定删除' + params.row.className + '吗？';
            let msg = `删除${params.row.className}成功`;
            const data = {
                siteId: this.$root.nowSite.id,
                id: params.row.id
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    QRCodeDelete(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                               if(this.newGroupId=='no'){
                                    data.status='no';
                                }else{
                                    data.status='yes';
                                      data.group_id=this.newGroupId;
                                }
                            this.$Message.success({ content: msg });
                            this.table.data.splice(params.index, 1);
                        }
                    });
                }
            });
        },
        onEdit(params) {
            const { payName, max_amount, min_amount, quick_amount, className, levelLabel, levelAlias, devices, qr_code, src, id, status,group_id,group_name} = params.row;
            this.$router.push({
                name: 'bankCardEdit',
                query: {
                    payName,
                    max_amount,
                    min_amount,
                    quick_amount,
                    className,
                    levelLabel,
                    levelAlias,
                    devices,
                    qr_code,
                    src,
                    id,
                    status,
                    terminal:params.row.devices,
                    inCard: 'code',
                    classId: this.id,
                    group_id,
                    group_name
                },
                params: { page: 'edit' }
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
/deep/.ivu-form-item-error-tip {
    width: 250px;
}

/deep/.ivu-form .ivu-form-item {
    margin-bottom: 20px;
}

/deep/.ivu-table-overflowX {
    overflow-x: hidden;
}
.input {
    width: 280px;
}

.w140 {
    width: 100px;
}
.payMoney {
    margin-left: -78px;
    height: 40px;
}

// /deep/.ivu-table-wrapper {
// 	overflow: visible;
// }
.clearfix {
    /deep/.ivu-form-item-content {
        height: 30px;
    }
}

// 二维码的样式
.upLoad {
    width: 200px;
    height: 200px;
    border: 1px solid #e4e4e4;
    border-radius: 5px;
}

.demo-upload-list {
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
    // line-height: 140px;

    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    // margin-right: 4px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 0.875rem;
    cursor: pointer;
    margin: 50px 5px;
}
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    /deep/.ivu-modal {
        top: 0;
    }
}
/deep/.ivu-table-cell {
    .imgBox {
        display: inline-block;
        width: 50px;
        height: 50px;
        text-align: center;
        line-height: 30px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    }
    .imgBoxCover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
    }
    .imgBox:hover .imgBoxCover {
        display: block;
    }
    .imgBoxCover i {
        margin-top: 10px;
        color: #fff;
        font-size: 1.875rem;
        cursor: pointer;
    }
}
</style>