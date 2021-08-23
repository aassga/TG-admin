<template>
    <div>
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
import Icons from '@/components/icons';
import { getUserType } from '@/libs/util';
import { virtualSequence, virtualListData, virtualDelete,virtualModifyStatus } from '@/api/finance';
export default {
    name:'virtaulCurrency',
    props: ['title', 'id','newStatus','newGroupId'],
    components: {Modals, Tables, Icons },
    data() {
        return {
            imgBoxSrc:'',
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
                        title: '备注名称',
                        key: 'pay_name',
                        align: 'center',
                        minWidth: 55,
                        tooltip: true
                    },
                    {
                        title: '收款地址',
                        key: 'address',
                        align: 'center',
                        minWidth: 65,
                        tooltip: true,
                        render:(h,params) => {
                            let len = params.row.address.length;
                            return <Tooltip placement="bottom" max-width="500">
                                        <span>{'...'+params.row.address.substring(len-6)}</span>
                                        <div slot="content">
                                            {params.row.address}
                                        </div>
                                    </Tooltip>
                        }
                    },
                    {
                        title: '二维码图片',
                        key: 'qr_code',
                        align: 'center',
                        minWidth: 65,
                        render: (h, params) => {
                            let src = params.row.src;
                            return (
                                <div>
                                    <div style={{display:src?'none':'inline-block'}}>-</div>
                                    <div class="imgBox" style={{display:src?'inline-block':'none'}}>
                                        <img class="w50x h50" src={src} />
                                        <div class="imgBoxCover">
                                            <Icon
                                                type="ios-eye-outline"
                                                onClick={() => {
                                                    this.imgBoxSrc = src;
                                                    this.$refs.imgModal.show(this.imgBoxSrc);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    },
                    {
                        title: '存款汇率',
                        key: 'deposit_rate',
                        align: 'center',
                        minWidth: 50,
                        tooltip: true,
                        className: 'pl5 pr5'
                    },
                        {
                        title: '开放分组',
                        key: 'group_name',
                        align: 'center',
                        minWidth: 100,
                        tooltip: true,
                        className: 'pl5 pr5'
                    },
                    {
                        title: '开放等级',
                        key: 'levelAlias',
                        align: 'center',
                        minWidth: screen.width < 1600 ? 120 : 130,
                        tooltip: true,
                        className: screen.width < 1600 ? 'pl10 pr10' : 'pl20 pr20'
                    },
                    {
                        title: '开放终端',
                        key: 'device',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => {
                            let arr = [];
                            params.row.device.split(',').forEach(t => {
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
                                    {params.row.today_deposit_amount}/{params.row.today_deposit_count}笔
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
                                    {params.row.deposit_amount}/{params.row.deposit_count}笔
                                </div>
                            );
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'addTime',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => <span class="ml5 mr5">{this.$root.newUnixTime(params.row.created_at)}</span>
                    },
                    {
                        title: '创建人',
                        key: 'updated_by',
                        align: 'center',
                        minWidth: 65,
                        tooltip: true,
                        render:(h,params)=>{
                            return <span>{params.row.created_by}</span>
                        }              
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 20,
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
                    status:'yes',
                    group_id:this.newGroupId,
                };     
                }
                  for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                this.getData({ params: data });
            }
        }
    },
    mounted() {
             //填加过来的
            if(this.$route.params.group_id){
                 let  data;
                  if(this.$route.params.status=='no'){
                      data = {siteId: this.$root.nowSite.id,classId: this.id,status:'no', };
                  }else{
                      data = { siteId: this.$root.nowSite.id, classId: this.id, status:'yes',
                       group_id:this.$route.params.group_id,};
                  }
                    for (let key  in  data){
                          if(!data[key]) delete data[key];
                      }
                     this.searchkey = data;
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
    methods: {
        //拖拽排序
        onDragDrop(oldIndex, newIndex) {
            if (oldIndex == newIndex || oldIndex == '') return;
            const params = {
                current_id: this.$refs.table.insideTableData[oldIndex].id,
                neighbor_id: this.$refs.table.insideTableData[newIndex].id,
                siteId: this.$root.nowSite.id,
                direction: +oldIndex > +newIndex ? 'up' : 'down',
                classId:this.id
            };
            let page = this.countPage;
            virtualSequence(params, true).then(res => {});
            // 更改
            this.$refs.table.insideTableData.splice(newIndex, 0, ...this.$refs.table.insideTableData.splice(oldIndex, 1));
        },
        getQuery(params) {
            console.log(params)
            this.searchkey = {
                siteId: this.$root.nowSite.id,
                status: params.status,
                levelLabel: params.levelLabel,
                limit: this.limit,
                classId:this.id,
                 group_id:params.group_id,
            };
            let data = { params: this.searchkey };
            this.getData(data);
        },
        getData(data) {
            this.$root.startTableLoading();
            virtualListData(data).then(res => {
                const { data, total } = res.data;
                this.table.data = data;
                this.table.total = total;
                this.$root.endTableLoading();
            });
        },
        // 修改状态
        changeStatus(params) {
            let text, msg;
            const { className, id, status } = params.row;
            if (status === 'yes') {
                text = `您确定停用此${className}吗？`;
                msg = `停用${className}成功`;
            }
            if (status === 'no') {
                text = `您确定启用此${className}吗？`;
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
                    let origin = this.table.data[params.index].status;
                    virtualModifyStatus(data, true).then(res => {
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
            let text = `您确定删除${params.row.className}吗？`;
            let msg = `删除${params.row.className}成功`;
            const data = {
                id: params.row.id,
                classId:this.id,
                siteId: this.$root.nowSite.id
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    virtualDelete(data, true).then(res => {
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
             const {address,pay_name,className,classType,device, levelAlias, status, id,src, levelLabel,group_id,group_name,quick_amount} = params.row;
            this.$router.push({
                name: 'bankCardEdit',
                params: { page: 'edit' },
                //传编辑的参数
                query: {
                    address,
                    pay_name,
                    className,
                    classType,
                    device, 
                    levelAlias, 
                    status, 
                    id,
                    src, 
                    quick_amount,
                    levelLabel,
                    inCard: 'virtual',
                    group_id,group_name
                }
            });
        },
        //点击分页
        onPageChange(page) {
            this.countPage = page;
            let data = {
                params: {
                    ...this.searchkey,
                    limit: this.pageSize
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
