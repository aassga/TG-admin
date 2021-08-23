<template>
    <div>
        <div class="v2-search">
            <Form inline ref="searchKey">
                <FormItem label="状态">
                    <Select class="s-86" placeholder="全部" v-model="searchKey.status" clearable>
                        <Option value="yes">正常</Option>
                        <Option value="no">停用</Option>
                    </Select>
                </FormItem>
                <FormItem label="冻结状态">
                    <Select class="s-86" placeholder="全部" v-model="searchKey.admin_status" clearable>
                        <Option value="0">正常</Option>
                        <Option value="1">冻结</Option>
                    </Select>
                </FormItem>
                <FormItem label="邀请码">
                    <Input placeholder="请输入邀请码" class="w160x" v-model="searchKey.agencyCode" />
                </FormItem>
                <FormItem label="代理账号">
                    <Input v-model="searchKey.userName" @keyup.enter.native="searchSubmit" placeholder="请输入代理账号" class="w160x" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                :page-size-opts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></Tables>
        </div>
        <Modals :width="1000" ref="oddsDetails" title="赔率详情">
            <div slot="content" class="odds ml20">
                <ButtonGroup class="status-button">
                    <Button
                        class="fontColor"
                        @click="
                            () => {
                                this.type = 'rebate';
                            }
                        "
                        :class="type == 'rebate' ? 'active' : ''"
                        style="width:120px;height:30px"
                        >彩票返点</Button
                    >
                    <Button
                        class="fontColor"
                        @click="
                            () => {
                                this.type = 'refund';
                            }
                        "
                        :class="type == 'refund' ? 'active' : ''"
                        style="width:120px;height:30px"
                        >返水信息</Button
                    >
                </ButtonGroup>
                <div class="mt20">
                    <Form ref="rebateInfo" style="width:960px;" v-show="type == 'rebate'">
                        <FormItem class="b" v-for="(t, i) in agencyRebate" :key="i">
                            <p class="f6f8-bg ti10">{{ t.name }}</p>
                            <div class="clearfix">
                                <div class="fl w20 p10" v-for="(item, index) in t.list" :key="index">
                                    <span>{{ item.name }}：{{ item.rebate }}%</span>
                                </div>
                            </div>
                        </FormItem>
                    </Form>
                    <Form ref="refundInfo" style="width:960px;" v-show="type == 'refund'">
                        <FormItem class="b" v-for="(t, i) in agencyRefund" :key="i">
                            <p class="f6f8-bg ti10">{{ t.name }}</p>
                            <div class="clearfix">
                                <div class="fl w20 p10" v-for="(item, index) in t.list" :key="index">
                                    <span>{{ item.name }}：{{ item.value }}%</span>
                                </div>
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import { agencyInviteCodeList, agencyInviteCodeDel, agencyInviteCodeModifyStatus, agencyInviteCodeDetail } from '@/api/agency';
import Tables from '_c/tables';
import Modals from '_c/modals';
import { getUserType } from '@/libs/util';
export default {
    name: 'agencyInviteCode',
    components: { Tables, Modals },
    data() {
        return {
            page: 1,
            agencyRebate: [], //点击赔率后对应的代理返水返点数据
            agencyRefund: {},
            type: 'rebate',
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            searchKey: {
                status: '',
                admin_status: '',
                userName: '',
                siteId: this.$root.nowSite.id
            },
            table: {
                loading: true,
                data: [],
                total: 0,
                pageSizeOpts: [20, 30, 40, 50],
                columns: [
                    {
                        title: '代理账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 85,
                        tooltip: true
                    },
                    {
                        title: '代理类型',
                        key: 'is_agency',
                        align: 'center',
                        minWidth: 55,
                        render: (h, params) => <span>{params.row.is_agency == 0 ? ' 会员' : '代理'}</span>
                    },
                    {
                        title: '邀请码',
                        key: 'agencyCode',
                        align: 'center',
                        minWidth: 60
                    },
                    {
                        title: '创建日期',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 110,
                        render: (h, params) => <span>{this.$root.newUnixTime(params.row.created_at)}</span>
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 35,
                        render: (h, params) => {
                            let { status } = params.row;
                            let color = status == 'yes' ? '' : 'red';
                            return <span style={{ color }}>{status == 'yes' ? '正常' : '停用'}</span>;
                        }
                    },
                    {
                        title: '冻结',
                        key: 'admin_status',
                        minWidth: 35,
                        align: 'center',
                        render: (h, params) => {
                            let { admin_status } = params.row;
                            let color = admin_status == 0 ? '' : 'red';
                            return <span style={{ color }}>{admin_status == 0 ? '正常' : '冻结'}</span>;
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => (
                            <div>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display: this.adminType == 'super' || this.authInPage.indexOf('agencyInviteCodeModifyStatus') != -1 ? 'inline-block' : 'none'
                                    }}
                                    onClick={() => {
                                        this.changeStatus(params, 'status');
                                    }}
                                >
                                    {params.row.status == 'yes' ? '停用' : '启用'}
                                </a>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display: this.adminType == 'super' || this.authInPage.indexOf('agencyInviteCodeModifyStatus') != -1 ? 'inline-block' : 'none'
                                    }}
                                    onClick={() => {
                                        this.changeStatus(params, 'admin_status');
                                    }}
                                >
                                    {params.row.admin_status == 0 ? '冻结' : '解冻'}
                                </a>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display:
                                            (this.adminType == 'super' || this.authInPage.indexOf('agencyInviteCodeDetail') != -1) && this.$root.checkCommission()
                                                ? 'inline-block'
                                                : 'none'
                                    }}
                                    onClick={() => {
                                        this.checkOdds(params);
                                    }}
                                >
                                    赔率
                                </a>
                                <a
                                    class="ib mr10"
                                    style={{
                                        display: this.adminType == 'super' || this.authInPage.indexOf('agencyInviteCodeUpdate') != -1 ? 'inline-block' : 'none'
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
                                        display: this.adminType == 'super' || this.authInPage.indexOf('agencyInviteCodeDel') != -1 ? 'inline-block' : 'none'
                                    }}
                                    onClick={() => {
                                        let data = {
                                            siteId: this.$root.nowSite.id,
                                            id: params.row.id
                                        };
                                        agencyInviteCodeDel(data, true).then(res => {
                                            if (res != undefined && res.code == 200) {
                                                this.$Message.success('删除成功');
                                                this.table.data.splice(params.index, 1);
                                                this.table.total--;
                                                if (this.table.data.length == 0) {
                                                    this.page--;
                                                    for (let key in this.searchKey) {
                                                        if (!this.searchKey[key]) delete this.searchKey[key];
                                                    }
                                                    let data = { ...this.searchKey };
                                                    this.getData({ params: data, query: { page: this.page } });
                                                }
                                            }
                                        });
                                    }}
                                >
                                    删除
                                </a>
                            </div>
                        )
                    }
                ]
            }
        };
    },
    mounted() {
        let data = { siteId: this.$root.nowSite.id };
        this.getData({ params: data });
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading();
            agencyInviteCodeList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    let { data, total } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
        },
        searchSubmit() {
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
            if (this.searchKey.userName) this.searchKey.userName = this.$root.trimAll(this.searchKey.userName);
            if (this.searchKey.agencyCode) this.searchKey.agencyCode = this.$root.trimAll(this.searchKey.agencyCode);
            if (this.searchKey.agencyCode && this.searchKey.agencyCode.length < 6) {
                this.$Tip.info({ content: '您所查询的邀请码不正确，请重新输入' });
                return false;
            }
            let data = { ...this.searchKey };
            if (data.userName && !this.$root.validateName(data.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params: data });
        },
        onPageChange(page) {
            this.page = page;
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
            let data = { ...this.searchKey };
            if (this.searchKey.userName) this.searchKey.userName = this.$root.trimAll(this.searchKey.userName);
            if (data.userName) data.userName = this.$root.trimAll(data.userName);
            if (data.userName && !this.$root.validateName(data.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
            let data = { ...this.searchKey };
            if (this.searchKey.userName) this.searchKey.userName = this.$root.trimAll(this.searchKey.userName);
            if (data.userName) data.userName = this.$root.trimAll(data.userName);
            if (data.userName && !this.$root.validateName(data.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确,请重新输入' });
                return false;
            }
            this.getData({ params: data });
        },
        // 查看赔率详情
        checkOdds(params) {
            let data = { siteId: this.$root.nowSite.id, id: params.row.id };
            this.$refs.oddsDetails.show();
            this.$refs.oddsDetails.spinShow();
            agencyInviteCodeDetail(data)
                .then(res => {
                    this.$refs.oddsDetails.spinHide();
                    if (res != undefined && res.code == 200) {
                        let { rebate, platform } = res.data;
                        this.agencyRebate = this.setRebateData(rebate);
                        this.agencyRefund = platform;
                    }
                })
                .catch(error => {
                    this.$refs.oddsDetails.spinHide();
                });
        },
        // 点击查看赔率数据 返点格式处理
        setRebateData(data) {
            let nameList = [];
            let arr = [];
            data.forEach(item => {
                arr.push(item.className);
            });
            nameList = Array.from(new Set(arr));
            arr = [];
            for (let i in nameList) {
                arr[i] = {};
                arr[i].name = nameList[i];
                arr[i].list = data.filter(item => item.className == arr[i].name);
            }
            return arr;
        },
        changeStatus(params, stage) {
            let data = {
                siteId: this.$root.nowSite.id,
                id: params.row.id,
                type: stage
            };
            let content = '';
            let message = '';
            if (stage == 'status') {
                data.content = params.row.status == 'yes' ? 'no' : 'yes';
                content = params.row.status == 'yes' ? '您确定停用此邀请码吗？' : '您确定启用此邀请码吗？';
                message = params.row.status == 'yes' ? '停用邀请码成功' : '启用邀请码成功';
            } else {
                data.content = params.row.admin_status == 0 ? 'yes' : 'no';
                content = params.row.admin_status == 0 ? '您确定冻结此邀请码吗？' : '您确定解冻此邀请码吗？';
                message = params.row.admin_status == 0 ? '冻结邀请码成功' : '解冻邀请码成功';
            }
            this.$Tip.confirm({
                content,
                onOk: () => {
                    agencyInviteCodeModifyStatus(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success(message);
                            if (stage == 'status') this.table.data[params.index].status = data.content;
                            if (stage != 'status') this.table.data[params.index].admin_status = data.content == 'yes' ? '1' : '0';
                        }
                    });
                }
            });
        },
        edit(params) {
            this.$router.push({
                name: 'editDomain',
                params: { page: 'edit', type: 'code' },
                query: { id: params.row.id, stage: 'code' }
            });
        }
    }
};
</script>
<style lang="less" scoped>
.odds {
    max-height: 800px;
    overflow-y: auto;
}
</style>


