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
            @on-drag-drop="onDragDrop"
            @on-details="onDetails"
            @on-edit="edit"
            @on-delete="del"
            @on-change-status="onChangeStatus"
            @on-page-change="onPageChange"
            @on-page-size-change="onPageSizeChange"
        ></Tables>
        <Modals ref="ModalsDetial" title="公告详情" width="800">
            <div slot="content" class="modal-overflow" :class="[screen < 1500 && screen > 1400 ? 'h400x' : '']" style="width:800px">
                <Form ref="formKey" :label-width="150">
                    <FormItem label="公告标题：">{{ poplist.title }}</FormItem>
                    <FormItem label="起止时间：">
                        <span>{{ $root.newUnixTime(poplist.publish_at) }}</span>
                        ——
                        <span>{{ $root.newUnixTime(poplist.offline_at) }}</span>
                    </FormItem>
                    <FormItem label="弹跳位置：">{{ poplist.bounce_location == '1' ? '登录前' : poplist.bounce_location == '2' ? '登录后' : '不限制' }}</FormItem>
                    <FormItem label="出现位置：">
                        {{
                            poplist.appears_location == '1'
                                ? '首页'
                                : poplist.appears_location == '2'
                                ? '游戏页'
                                : poplist.appears_location == '2,1'
                                ? '游戏页,首页'
                                : '首页,游戏页'
                        }}
                    </FormItem>
                    <FormItem label="编辑内容：" v-if="poplist.description">
                        <span v-html="poplist.description"></span>
                    </FormItem>
                    <FormItem label="PC：" v-if="poplist.pc_pic">
                        <view-img :imgSrc="poplist.pc_pic"></view-img>
                    </FormItem>
                    <FormItem label="手机端：" v-if="poplist.mob_pic">
                        <view-img :imgSrc="poplist.mob_pic"></view-img>
                    </FormItem>
                    <FormItem label="客户端：" v-if="poplist.desc_format_type == 'text'">{{ poplist.client_type }}</FormItem>
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
import { popupsList, popupsDetail, popupsDel, popupsStatusChange, noticeSortUpdate } from '@/api/system';
import Icons from '@/components/icons';
import Modals from '@/components/modals';
import ViewImg from '../../components/ViewImg';
import { getUserType } from '@/libs/util';
import Tables from '_c/tables';
export default {
    name: 'noticePop',
    components: {
        Tables,
        Modals,
        ViewImg,
        Icons
    },
    data() {
        return {
            screen: screen.width,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            table: {
                total: 0,
                more: true,
                page: true,
                loading: true,
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
                        title: '公告标题',
                        key: 'title',
                        align: 'center',
                        minWidth: 110,
                        tooltip: true,
                        className: 'pr10 pl10'
                    },
                    {
                        title: '弹跳位置',
                        key: 'bounce_location',
                        align: 'center',
                        minWidth: 65,
                        render: (h, params) => {
                            return <span>{params.row.bounce_location == 1 ? '登录前' : params.row.bounce_location == 2 ? '登录后' : '不限制'}</span>;
                        }
                    },
                    {
                        title: '出现位置',
                        key: 'appears_location',
                        align: 'center',
                        minWidth: 75,
                        render: (h, params) => {
                            return (
                                <span>
                                    {params.row.appears_location == '1'
                                        ? '首页'
                                        : params.row.appears_location == '2'
                                        ? '游戏页'
                                        : params.row.appears_location == '2,1'
                                        ? '游戏页,首页'
                                        : '首页,游戏页'}
                                </span>
                            );
                        }
                    },
                    {
                        title: '客户端',
                        key: 'client_type',
                        align: 'center',
                        minWidth: 130
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
                        minWidth: 90,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 35,
                        render: (h, params) => {
                            return <span class={params.row.status === 'yes' ? '' : 'red-font'}>{params.row.status === 'yes' ? '正常' : '停用'}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 150,
                        render: (h, params) => (
                            <div>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display: this.adminType == 'super' || this.authInPage.indexOf('popupsStatusChange') != -1 ? 'inline-block' : 'none'
                                    }}
                                    onClick={() => {
                                        this.onChangeStatus(params);
                                    }}
                                >
                                    {params.row.status == 'yes' ? '停用' : '正常'}
                                </a>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display: this.adminType == 'super' || this.authInPage.indexOf('popupsDetail') != -1 ? 'inline-block' : 'none'
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
                                        display: this.adminType == 'super' || this.authInPage.indexOf('popupsUpt') != -1 ? 'inline-block' : 'none'
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
                                        display: this.adminType == 'super' || this.authInPage.indexOf('popupsDel') != -1 ? 'inline-block' : 'none'
                                    }}
                                    onClick={() => {
                                        this.del(params);
                                    }}
                                >
                                    删除
                                </a>
                            </div>
                        )
                    }
                ],
                data: []
            },
            poplist: '',
            pagesize: ''
        };
    },
    mounted() {
        const params = { siteId: this.$root.nowSite.id, type: 'popups' };
        // params.startTime = this.$parent.Time[0] && this.$root.formatTimeS(this.$parent.Time[0])
        // params.endTime = this.$parent.Time[1] && this.$root.formatnightTimeS(this.$parent.Time[1]);
        for (let key in params) {
            if (!params[key]) delete params[key];
        }
        this.getData({ params });
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading(this);
            if (data.params.status == 'all') delete data.params.status;
            popupsList(data)
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
        //  编辑
        edit(params) {
            this.$router.push({
                name: 'noticeDetial',
                params: { page: 'edit' },
                query: { id: params.row.id }
            });
        },
        //详情
        onDetails(params) {
            const data = { id: params.row.id, siteId: this.$root.nowSite.id };
            popupsDetail(data).then(res => {
                this.poplist = res.data;
                this.$refs.ModalsDetial.show();
            });
        },
        del(params) {
            const data = { id: params.row.id, siteId: this.$root.nowSite.id };
            this.$Tip.confirm({
                content: '您确定删除此公告吗？',
                onOk: () => {
                    popupsDel(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success(res.data);
                            this.table.data.splice(params.index, 1);
                        }
                    });
                }
            });
        },
        //正常停用
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
                    popupsStatusChange(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success(res.data);
                            params.row.status = status === 'yes' ? 'no' : 'yes';
                        }
                    });
                }
            });
        },
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
                type: 'popups'
            };
            noticeSortUpdate(data, true).then(res => {
                if (res != undefined && res.code == 200) {
                    this.$Message.success({ content: '排序更新成功' });
                    this.$refs.tables.insideTableData.splice(newIndex, 0, ...this.$refs.tables.insideTableData.splice(oldIndex, 1));
                }
            });
        },
        onPageChange(page) {
            this.total = 0;
            let data = { ...this.$parent.searchKey };
            data.siteId = this.$root.nowSite.id;
            data.limit = this.pagesize;
            data.type = 'popups';
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
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.pagesize = pageSize;
            this.searchKey = { ...this.$parent.searchKey };
            this.searchKey.limit = pageSize;
            this.searchKey.type = 'popups';
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
            this.getData({ params: this.searchKey });
        }
    }
};
</script>
<style lang="less" scoped>
/deep/.ivu-table-header {
    font-size: 1rem !important;
    font-weight: normal !important;

    tr {
        font-size: 1rem;
        font-weight: 549 !important;
        .ivu-table-cell {
            span {
                font-weight: 549;
            }
        }
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
/deep/.ivu-form-item-content img {
    width: 100%;
    height: 100%;
    padding-right: 20px;
}

/deep/.ivu-form-item-content {
    text-align: justify;
    text-justify: inter-ideograph;
    padding-right: 70px;
}
</style>