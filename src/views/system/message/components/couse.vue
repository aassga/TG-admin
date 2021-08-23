<template>
    <div>
        <Tables
            ref="tables"
            :page="table.page"
            :loading="$root.tableLoading"
            :value="table.data"
            :columns="table.columns"
            :total="table.total"
            :showSizer="true"
            :draggable="true"
            @on-details="onDetails"
            @on-edit="edit"
            @on-delete="del"
            @on-drag-drop="onDragDrop"
            @on-change-status="onChangeStatus"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
        ></Tables>
        <Modals ref="ModalsDetial" title="走马灯详情" width="800">
            <div slot="content" class="modal-overflow" :class="[screen < 1500 && screen > 1400 ? 'h400x' : '']" style="width:800px">
                <Form ref="formKey" :label-width="150">
                    <FormItem label="消息标题：">{{ poplist.title }}</FormItem>
                    <FormItem label="起止时间："
                        ><span>{{ $root.newUnixTime(poplist.publish_at) }}</span
                        >--<span>{{ $root.newUnixTime(poplist.offline_at) }}</span></FormItem
                    >
                    <FormItem label="文字内容：" :width="375">{{ poplist.description }}</FormItem>
                    <FormItem label="客户端：">{{ poplist.client_type }}</FormItem>
                    <FormItem label="状态：">{{ poplist.status == 'yes' ? '正常' : '停用' }}</FormItem>
                    <FormItem label="更新时间：">{{ $root.newUnixTime(poplist.updated_at) }}</FormItem>
                    <FormItem label="创建时间：">{{ $root.newUnixTime(poplist.created_at) }}</FormItem>
                    <FormItem label="操作人：">{{ poplist.who }}</FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import Icons from '@/components/icons';
import Tables from '_c/tables';
import { borrowDataO } from '@/api/data';
import Modals from '@/components/modals';
import { getUserType } from '@/libs/util';
import { lanternList, lanternDetail, lanternDel, lanternStatusChange, noticeSortUpdate } from '@/api/system';
export default {
    name: 'couse',
    components: {
        Tables,
        Modals
    },
    data() {
        return {
            screen: screen.width,
            adminType: getUserType(),
            auhtInPage: JSON.parse(localStorage.authInPage),
            table: {
                loading: true,
                total: 0,
                more: true,
                page: true,
                formKey: {},
                columns: [
                    {
                        title: '排序',
                        align: 'center',
                        width: 60,
                        render: (h, params) => {
                            return h(Icons, {
                                props: {
                                    type: 'paixukongjian',
                                    color: '#dadada',
                                    size: 20
                                }
                            });
                        }
                    },
                    {
                        title: '消息标题',
                        key: 'title',
                        align: 'center',
                        minWidth: 110,
                        tooltip: true,
                        className: 'pr10 pl10'
                    },
                    {
                        title: '客户端',
                        key: 'client_type',
                        align: 'center',
                        minWidth: 120
                    },
                    {
                        title: '开始时间',
                        key: 'publish_at',
                        align: 'center',
                        minWidth: 130,
                        render: (h, params) => {
                            return <span class="pr10 pl10">{this.$root.newUnixTime(params.row.publish_at)}</span>;
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'offline_at',
                        align: 'center',
                        minWidth: 130,
                        render: (h, params) => {
                            return <span class="pr10 pl10">{this.$root.newUnixTime(params.row.offline_at)}</span>;
                        }
                    },
                    {
                        title: '操作人',
                        key: 'who',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 35,
                        render: (h, params) => {
                            let color = params.row.status === 'yes' ? '' : '#FF2626FF';
                            return <span style={{ color }}>{params.row.status === 'yes' ? '正常' : '停用'}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.auhtInPage.indexOf('lanternStatusChange') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onChangeStatus(params);
                                        }}
                                    >
                                        {params.row.status == 'yes' ? '停用' : '启用'}
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.auhtInPage.indexOf('lanternDetail') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onDetails(params);
                                        }}
                                    >
                                        详情
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.auhtInPage.indexOf('lanternUpt') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.edit(params);
                                        }}
                                    >
                                        编辑
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.auhtInPage.indexOf('lanternDel') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.del(params);
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
            },
            poplist: {
                title: '',
                publish_at: '',
                offline_at: '',
                description: '',
                client_type: '',
                status: '',
                updated_at: '',
                created_at: '',
                who: ''
            },
            pagesize: ''
        };
    },
    mounted() {
        const params = { siteId: this.$root.nowSite.id, type: 'lantern' };
        // params.startTime = this.$parent.Time[0] && this.$root.formatTimeS(this.$parent.Time[0])
        // params.endTime = this.$parent.Time[1] && this.$root.formatnightTimeS(this.$parent.Time[1]);
        for (let key in params) {
            if (!params[key]) delete params[key];
        }
        this.getcouseData({ params });
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        onDragDrop(oldIndex, newIndex) {
            if (oldIndex == newIndex || oldIndex == '') return;
            //拖拽排序
            let page = this.setPage;
            let newStatus = this.status ? 'yes' : 'no';
            const data = {
                siteId: this.$root.nowSite.id,
                current_id: this.$refs.tables.insideTableData[oldIndex].id,
                neighbor_id: this.$refs.tables.insideTableData[newIndex].id,
                direction: +oldIndex > +newIndex ? 'up' : 'down',
                type: 'lantern'
            };
            noticeSortUpdate(data, true).then(res => {
                if (res != undefined && res.code == 200) {
                    this.$Message.success({ content: '排序更新成功' });
                    this.$refs.tables.insideTableData.splice(newIndex, 0, ...this.$refs.tables.insideTableData.splice(oldIndex, 1));
                }
            });
        },
        getcouseData(data) {
            this.$root.startTableLoading(this);
            if (data.params.status == 'all') delete data.params.status;
            lanternList(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        let { data, total } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        // 编辑
        edit(params) {
            this.$router.push({
                name: 'couseDetial',
                params: { page: 'edit' },
                query: { id: params.row.id }
            });
        },
        //详情
        onDetails(params) {
            const data = { id: params.row.id, siteId: this.$root.nowSite.id };
            lanternDetail(data).then(res => {
                this.poplist = res.data;
                this.$refs.ModalsDetial.show();
            });
        },
        del(params) {
            const data = { id: params.row.id, siteId: this.$root.nowSite.id };
            this.$Tip.confirm({
                content: '您确定删除此走马灯吗？',
                onOk: () => {
                    lanternDel(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success(res.data);
                            this.table.data.splice(params.index, 1);
                        }
                    });
                }
            });
        },
        //改变状态
        onChangeStatus(params) {
            let text, msg;
            const { id, siteId, status } = params.row;
            if (status === 'yes') {
                text = `您确定停用吗？`;
                msg = `停用成功`;
            }
            if (status === 'no') {
                text = `您确定启用吗？`;
                msg = `启用成功`;
            }
            const data = {
                siteId,
                id,
                status: status == 'yes' ? 'no' : 'yes'
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    lanternStatusChange(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success(res.data);
                            params.row.status = status === 'yes' ? 'no' : 'yes';
                        }
                    });
                }
            });
        },
        onPageChange(page) {
            this.total = 0;
            let data = { ...this.$parent.searchKey };
            data.siteId = this.$root.nowSite.id;
            data.limit = this.pagesize;
            data.type = 'lantern';
            // if (this.$root.validateTime(this.$parent.Time)) {
            // const [startTime, endTime] = this.$root.validateTime(this.$parent.Time);
            // data.startTime = startTime && this.$root.formatTimeS(startTime);
            // data.endTime = endTime && this.$root.formatnightTimeS(endTime);
            // } else {
            //   return false;
            // }
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getcouseData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.pagesize = pageSize;
            this.searchKey = { ...this.$parent.searchKey };
            this.searchKey.limit = pageSize;
            this.searchKey.type = 'lantern';
            this.searchKey.siteId = this.$root.nowSite.id;
            //   if (this.$root.validateTime(this.$parent.Time)) {
            //   const [startTime, endTime] = this.$root.validateTime(this.$parent.Time);
            //   this.searchKey.startTime = startTime && this.$root.formatTimeS(startTime);
            //   this.searchKey.endTime = endTime && this.$root.formatnightTimeS(endTime);
            //   } else {
            //    return false;
            //  }
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
            this.getcouseData({ params: this.searchKey });
        }
    }
};
</script>

<style scoped lang="less">
/deep/.ivu-form-item-content {
    width: 270px;
}
/deep/.ivu-table-header {
    font-size: 1rem;
    font-weight: normal;
    .ivu-table-cell {
        font-weight: 549;
    }
}
/deep/.ivu-table {
    color: #444;
}
.modal-overflow {
    height: 600px;
    overflow: hidden;
    overflow-y: auto;
}
/deep/.ivu-form-item-content {
    width: 640px;
    text-align: justify;
    text-justify: inter-ideograph;
    padding-right: 70px;
}
</style>
