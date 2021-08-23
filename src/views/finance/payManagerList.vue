<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <div class="v2-button mb5">
                    <Button @click="$router.push({ name: 'payAdd', params: { page: 'add' } })" v-if="adminType == 'super' || authInPage.indexOf('paymentChannelCreate') != -1"
                        >添加支付平台</Button
                    >
                </div>
            </Form>
        </div>
        <div class="v2-search bb">
            <ButtonGroup class="repay-button1" style="margin-bottom:.3px">
                <Button v-for="(t, i) in btnList" :class="status == t.val ? 'active' : ''" @click="changeBtn(t.val)" :key="i">{{ t.name }}</Button>
            </ButtonGroup>
        </div>
        <div class="v2-table">
            <Tables
                v-if="status"
                ref="tables"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                @on-edit="edit"
                @on-change-status="changeStatus"
                @on-page-change="onPageChange"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-size-change="onPageSizeChange"
                :draggable="true"
                @on-drag-drop="onDragDrop"
            ></Tables>

            <Tables
                v-else
                ref="tables"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                @on-edit="edit"
                @on-page-change="onPageChange"
                @on-change-status="changeStatus"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-size-change="onPageSizeChange"
                :draggable="true"
                @on-drag-drop="onDragDrop"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Icons from '@/components/icons';
import paymentRadio from './components/payment-radio-group';
import Modals from '@/components/modals';
import tableMixins from '@/mixins/table';
import Sortable from 'sortablejs';
import { getUserType } from '@/libs/util';
import { sitePlatformList, changpaymentstatus, deletepayment, updatepayment, sitePlatformUp } from '@/api/finance';
export default {
    // name: "payManagerList",
    components: {
        Tables,
        Modals,
        Icons,
        paymentRadio
    },
    data() {
        return {
            btnList: [
                { name: '正常', val: '0' },
                { name: '停用', val: '1' }
            ],
            rentType: localStorage.loginType,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            searchKey: {
                status: 0,
                limit: 20,
                siteId: this.$root.nowSite.id
            },
            pageSize: '',
            status: 0,
            table: {
                loading: true,
                total: 0,
                pageSizeOpts: [20, 30, 40, 50],
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
                        title: '商户编号',
                        key: 'agentcode',
                        align: 'center',
                        minWidth: 120,
                        tooltip: true,
                        className: 'pl10 pr10'
                    },
                    {
                        title: '支付平台',
                        key: 'platformname',
                        align: 'center',
                        minWidth: 70,
                        tooltip: true,
                        className: 'pr5 pl5'
                    },
                    {
                        title: '支付方式',
                        key: 'platformnickname',
                        align: 'center',
                        minWidth: 85
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        width: 80,
                        render: (h, params) => {
                            return <span class={params.row.status == '0' ? '' : 'red-font'}>{params.row.status == '0' ? '正常' : '停用'}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 165,
                        render: (h, params) => {
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('paymentChannelModifyStatus') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.changeStatus(params);
                                        }}
                                    >
                                        {params.row.status == '0' ? '停用' : '启用'}
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('thirdPaymentChannelUpdate') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.edit(params);
                                        }}
                                    >
                                        编辑
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
    created() {
        let data = { ...this.searchKey };
        this.getData({ params: data });
    },
    methods: {
        changeBtn(val) {
            if (val == 0) {
                this.status = 0;
                const params = {
                    ...this.searchKey,
                    status: val,
                    classId: this.searchKey.typeId
                };
                this.getData({ params });
            } else {
                this.status = 1;
                const params = {
                    ...this.searchKey,
                    status: val,
                    classId: this.searchKey.typeId
                };
                this.getData({ params });
            }
        },
        getData(data) {
            this.$root.startTableLoading();
            sitePlatformList(data).then(res => {
                const { data, total } = res.data;
                this.table.data = data;
                this.table.total = total;
                this.$root.endTableLoading();
            });
        },
        changeStatus(params) {
            let text, msg;
            const { status, id, platformname, siteId, sitedevices, platformnickname, agentcode, agentSignKey, agentDecryptKey } = params.row;
            if (status == '0') {
                text = `您确定停用${platformname}吗？`;
                msg = `停用${platformname}成功`;
            }
            if (status == '1') {
                text = `您确定启用${platformname}吗？`;
                msg = `启用${platformname}成功`;
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id,
                status: status == '0' ? '1' : '0',
                sitedevices,
                platformnickname,
                agentcode,
                agentSignKey,
                agentDecryptKey
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    sitePlatformUp(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            if (typeof res.data === 'string') {
                                this.$Message.config({
                                    top: 150
                                });
                                this.$Message.success({ content: msg });
                                params.row.status = status == '0' ? '1' : '0';
                                this.table.data.splice(params.index, 1);
                                data.status = data.status == '1' ? '0' : '1';
                                this.getData({ params: data });
                                this.table.total--;
                                if (this.table.data.length < 1) {
                                    this.getData({ params: data });
                                }
                            }
                        }
                    });
                }
            });
        },
        //编辑
        edit(params) {
            sitedevices;
            const { id, agentSignKey, agentDecryptKey, agentcode, status, sitedevices, platformnickname } = params.row;
            this.$router.push({
                name: 'payAdd',
                params: { page: 'edit' },
                query: {
                    id,
                    agentSignKey,
                    agentDecryptKey,
                    agentcode,
                    status,
                    platformnickname,
                    sitedevices
                }
            });
        },
        onDragDrop(oldIndex, newIndex) {
            if (oldIndex == newIndex || oldIndex == '') return;
            //拖拽排序
            let page = this.setPage;
            let newStatus = this.status ? 'yes' : 'no';
            const params = {
                current_id: this.$refs.tables.insideTableData[oldIndex].id,
                neighbor_id: this.$refs.tables.insideTableData[newIndex].id,
                siteId: this.$root.nowSite.id,
                direction: +oldIndex > +newIndex ? 'up' : 'down'
            };
            paymentChannelSequence(params, true).then(res => {});
            //更改不请求数据
            this.$refs.tables.insideTableData.splice(newIndex, 0, ...this.$refs.tables.insideTableData.splice(oldIndex, 1));
        },
        //点击分页
        onPageChange(page) {
            this.setPage = page;
            const params = {
                ...this.searchKey,
                status: this.status == '0' ? '0' : '1'
            };
            this.getData({ params: params, query: { page } });
        },
        onPageSizeChange(pageSize) {
            const params = {
                ...this.searchKey,
                status: this.status == '0' ? '0' : '1',
                limit: pageSize
            };
            this.getData({ params: params });
            this.pageSize = pageSize;
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
@import '../../styles/class.less';
.box {
    border: 1px solid #eaeaea;
    > span {
        box-sizing: border-box;
        display: inline-block;
        width: 33.33%;
        height: 100px;
        text-align: center;
        border-right: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        padding: 25px;
        &:nth-of-type(3n) {
            border-right: 0;
        }
        &:nth-last-of-type(1) {
            width: 100%;
            border-right: 0;
        }
        &:nth-last-of-type(1) {
            border-bottom: 0;
        }
        > p {
            &:nth-child(1) {
                font-size: 1.125rem;
                color: #666666;
            }
            &:nth-child(2) {
                font-size: 0.875rem;
                color: #c3c3c3;
            }
        }
    }
}
/deep/.ivu-btn > span {
    vertical-align: 0;
}
/deep/.ivu-table-tbody {
    color: #444;
}
//表格内td调整样式
/deep/.ivu-table td {
    padding: 10px 10px;
    color: #444;
}
.btngroup {
    margin-bottom: 30px;

    /deep/.zcBtn {
        span {
            vertical-align: 0;
        }
    }
}

.status-button {
    button {
        padding: 0 20px;
        height: 36px;
        line-height: 34px;
        font-size: 1rem;
    }
}
</style>
