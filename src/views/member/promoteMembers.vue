<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="状态">
                    <Select v-model="searchKey.status" clearable placeholder="全部">
                        <Option value="online">在线</Option>
                        <Option value="offline">离线</Option>
                    </Select>
                </FormItem>
                <FormItem label="账号类型">
                    <Select v-model="searchKey.accountType" clearable placeholder="全部">
                        <Option value="member_0">全部会员</Option>
                        <Option value="member_1">1级会员</Option>
                        <Option value="member_2">2级会员</Option>
                        <Option value="agency_0">全部代理</Option>
                        <Option value="agency_1">1级代理</Option>
                        <Option value="agency_2">2级代理</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Select v-model="searchKey.typeTag">
                        <Option value="userName">会员账号</Option>
                        <Option value="agencyName">上级代理</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Input v-model="searchKey.content" placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSunbmit" />
                </FormItem>
                <FormItem label="客户端">
                    <Select v-model="searchKey.lastDevice" clearable placeholder="全部">
                        <Option value="android">Android</Option>
                        <Option value="ios">IOS</Option>
                        <Option value="pc">PC</Option>
                        <Option value="h5">H5</Option>
                    </Select>
                </FormItem>
                <FormItem label="注册时间">
                    <DatePicker type="date" v-model="Time[0]" format="yyyy-MM-dd " placeholder="开始日期" class="s-120"></DatePicker>
                    <span class="ml5 mr5">-</span>
                    <DatePicker type="date" v-model="Time[1]" format="yyyy-MM-dd " placeholder="结束日期" class="s-120"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" @click="searchSunbmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="sendChat('allSendChat')" v-if="ids.length > 1">发起聊天</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="bindCustomer('allBindCustomer')" v-if="ids.length > 1 && expend_service_manage">绑定客服</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="unBindCustomer('allUnBindCustomer')" v-if="ids.length > 1 && expend_service_manage">解绑客服</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="tables"
                :loading="$root.tableLoading"
                :columns="table.columns"
                :value="table.data"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-selection-change="onSelectionChange"
            ></Tables>
        </div>
        <!-- 解绑客服 -->
        <Modals ref="unBindCustomer" width="560" title="解除绑定">
            <div slot="content">
                <Form>
                    <FormItem :label-width="60">
                        你确定解除会员
                        <Input v-if="newType == 'oneUnBindCustomer'" v-model="this.userName" class="w260x" disabled />
                        <Input v-if="newType == 'allUnBindCustomer'" v-model="this.names" class="w260x" disabled />与客服的推广绑定？
                    </FormItem>
                    <FormItem>
                        <Button class="ivu-btn send ft20 w260x" style="width:260px!important;margin-left:160px!important" type="primary" @click="unSave">确认保存</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
        <!-- 绑定客服 -->
        <Modals ref="bindCustomer" width="560" :rules="rules" :title="title">
            <div slot="content">
                <Form :label-width="180" ref="formKey">
                    <FormItem label="会员账号">
                        <Input v-if="this.newType == 'oneBindCustomer'" v-model="this.userName" class="w260x" disabled />
                        <Input v-if="this.newType == 'allBindCustomer'" v-model="this.names" class="w260x" disabled />
                        <!-- allBindCustomer -->
                    </FormItem>
                    <FormItem label="客服昵称">
                        <AutoSearch :transfer="true" :placeholder="'请输入客服昵称'" :clearable="false" :stage="'nickName'" @sendId="getId"></AutoSearch>
                    </FormItem>
                    <FormItem>
                        <Button class="ivu-btn send ft20 w260x" style="width:260px!important" type="primary" @click="save">确认保存</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import { mapState } from 'vuex';
import { getUserType } from '@/libs/util';
import Tables from '_c/tables';
import Icons from '@/components/icons';
import Modals from '@/components/modals';
import AutoSearch from '@/components/auto-search';
import { memberListOfChat, bindingRelations, searchAdminOtherName, deleteRelations } from '@/api/member';
export default {
    name: 'promoteMembers',
    components: {
        Tables,
        Icons,
        Modals,
        AutoSearch
    },
    data() {
        return {
            newType: '',
            title: '',
            data: '',
            nameLength: '',
            ids: [],
            names: [],
            expend_service_manage: false,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            aUid: '',
            userName: '',
            uid: '',
            pageSize: '',
            searchKey: {
                siteId: this.$root.nowSite.id,
                lastDevice: '',
                typeTag: 'userName',
                content: '',
                status: '',
                startTime: '',
                endTime: ''
            },
            Time: [],
            table: {
                data: [],
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                loading: true,
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        title: '全选'
                    },
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        width: screen.width > 1600 && screen.width < 2000 ? 200 : screen.width > 2000 ? 240 : '',
                        minWidth: screen.width < 1600 ? 130 : '',
                        render: (h, params) => {
                            let flag = true;
                            const { lastDevice } = params.row;
                            return (
                                <div>
                                    <span
                                        style={{
                                            width: screen.width < 1600 ? '100px' : screen.width < 2000 && screen.width > 1600 ? '120px' : '125px',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            display: 'inline-block'
                                        }}
                                        ondblclick={() => {
                                            if (this.adminType == 'super' || this.authInPage.indexOf('checkBetAmount') != -1) {
                                                this.uid = params.row.uid;
                                                this.$nextTick(() => {
                                                    this.$refs.codeDetail.getCodeDetail();
                                                });
                                            } else {
                                                this.$Tip.info({ content: '您尚未开通此权限' });
                                            }
                                        }}
                                    >
                                        {params.row.userName}
                                    </span>
                                    <Tooltip placement="right" title={params.row.userName.length > 9 ? params.row.userName : ''}>
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Icons
                                                class="ml10"
                                                type={lastDevice == 'pc' ? 'zu' : lastDevice == 'h5' ? 'zu6' : lastDevice == 'ios' ? 'zu5' : 'zu3'}
                                                color={params.row.online == 'off' ? '#B3B3B3' : '#57A3F3'}
                                                size="22"
                                            />
                                        </div>
                                        <div slot="content">
                                            {' '}
                                            {params.row.online === 'off'
                                                ? params.row.lastDevice == 'android'
                                                    ? 'Android'
                                                    : params.row.lastDevice.toUpperCase() + '离线'
                                                : params.row.lastDevice == 'android'
                                                ? 'Android'
                                                : params.row.lastDevice.toUpperCase() + '在线'}{' '}
                                        </div>
                                    </Tooltip>
                                </div>
                            );
                        }
                    },
                    {
                        title: '上级代理',
                        key: 'agencyName',
                        align: 'center'
                    },
                    {
                        title: '会员姓名',
                        key: 'realName',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.text(params.row.realName)}</span>;
                        }
                    },
                    {
                        title: '账号类型',
                        key: 'account_type',
                        align: 'center'
                    },
                    {
                        title: '绑定客服',
                        key: 'adminOtherName',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.text(params.row.adminOtherName)}</span>;
                        }
                    },
                    {
                        title: '直属人数',
                        key: 'descendentCount',
                        align: 'center'
                    },
                    {
                        title: '有效投注',
                        key: 'totalAmount',
                        align: 'center'
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '地址位置',
                        key: 'lastAddr',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '操作',
                        key: '',
                        align: 'center',
                        render: (h, params) => {
                            const { isBinding } = params.row;
                            return (
                                <div>
                                    <span
                                        class="blue-font ml10"
                                        onClick={() => {
                                            this.sendChat('oneSendChat', params);
                                        }}
                                    >
                                        发起聊天
                                    </span>
                                    <span
                                        style={{
                                            display: this.adminType == 'super' && isBinding == 'no' ? 'inline-block' : 'none'
                                        }}
                                        class="ml10 blue-font mr5"
                                        onClick={() => {
                                            this.bindCustomer('oneBindCustomer', params);
                                        }}
                                    >
                                        绑定客服
                                    </span>
                                    <span
                                        style={{ display: this.adminType == 'super' && isBinding == 'yes' ? 'inline-block' : 'none' }}
                                        class="blue-font ml10 mr5"
                                        onClick={() => {
                                            this.unBindCustomer('oneUnBindCustomer', params);
                                        }}
                                    >
                                        解除绑定
                                    </span>
                                </div>
                            );
                        }
                    }
                ]
            },
            rules: {}
        };
    },
    computed: {
        ...mapState({
            authMenu: state => state.user.authMenu
        })
    },
    methods: {
        searchSunbmit() {
            let data = { ...this.searchKey };
            if (data.content) data.content = this.$root.trimAll(data.content);
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                data.startTime = startTime && this.$root.formatTime(startTime);
                data.endTime = endTime && this.$root.formatTime(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = data.startTime;
            this.searchKey.endTime = data.endTime;
            const { startTime, endTime } = data;

            for (let key in data) {
                if (!data[key]) delete data[key];
            }

            if (data.typeTag == 'userName') {
                if (!this.$root.validateName(data.content)) {
                    this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                    return false;
                }
            }

            if (data.typeTag == 'agencyName') {
                if (!this.$root.validateName(data.content)) {
                    this.$Tip.info({ content: '您所查询的上级代理不正确，请重新输入' });
                    return false;
                }
            }

            if (!data.typeTag) {
                delete data.content;
            }
            this.getData({ params: data });
        },
        unBindCustomer(type, params) {
            this.newType = type;
            this.title = '解除绑定';
            if (type == 'allUnBindCustomer') {
            }
            if (type == 'oneUnBindCustomer') {
                const { userName, uid } = params.row;
                this.userName = userName;
                this.uid = uid;
            }
            this.$refs.unBindCustomer.show();
        },
        bindCustomer(type, params) {

            this.newType = type;
            this.title = '绑定客服';
            if (type == 'allBindCustomer') {
                this.$refs.bindCustomer.show();
            }
            if (type == 'oneBindCustomer') {
                const { userName, uid } = params.row;
                this.userName = userName;
                this.uid = uid;
                this.$refs.bindCustomer.show();
            }
        },
        getId(val) {
            this.aUid = val;
        },
        onSelectionChange(selection) {
            this.ids = [];
            selection.forEach(t => this.ids.push(t.uid));
            this.names = [];

            selection.forEach(t => this.names.push(t.userName));
            this.nameLength = this.names.length;
            this.names = String(this.names);
        },
        save() {
            const data = {
                siteId: this.$root.nowSite.id,
                fUid: this.uid || String(this.ids),
                aUid: this.aUid
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            bindingRelations({ params: data }, true).then(res => {
                if (res && res.code == 200) {
                    this.$refs.bindCustomer.hide();
                    this.$Message.success({ content: '绑定客服成功' });
                    this.getData({ params: data });
                }
            });
        },
        unSave() {
            const data = {
                siteId: this.$root.nowSite.id,
                fUid: this.uid || String(this.ids),
                aUid: this.aUid
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            deleteRelations({ params: data }, true).then(res => {
                if (res && res.code == 200) {
                    this.$refs.unBindCustomer.hide();
                    let msg = res.data;
                    this.$Message.success({ content: msg });
                    this.getData({ params: data });
                }
            });
        },
        sendChat(type, params) {
            if (type == 'oneSendChat') {
                const { uid } = params.row;
                this.uid = uid;
                const data = {
                    siteId: this.$root.nowSite.id,
                    fUid: this.uid
                };

                bindingRelations({ params: data }, true).then(res => {
                    if (res && res.code == 200) {
                        const { oriUsername, uid } = res.data;
                        let openr = window.open();
                        let newHost = `http://bet.n4933.com/pc/login.html?username=${oriUsername}&password=${uid}`;
                        openr.location.href = newHost;
                    }
                });
            }

            if (type == 'allSendChat') {
                const data = {
                    siteId: this.$root.nowSite.id,
                    fUid: String(this.ids)
                };
                bindingRelations({ params: data }, true).then(res => {
                    if (res && res.code == 200) {
                        const { oriUsername, uid } = res.data;
                        let openr = window.open();
                        let newHost = `http://bet.n4933.com/pc/login.html?username=${oriUsername}&password=${uid}`;
                        openr.location.href = newHost;
                    }
                });
            }
        },
        onPageChange(page) {
            let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            let data = {
                ...this.searchKey,
                limit: pageSize,
                siteId: this.$root.nowSite.id
            };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }

            this.getData({ params: data });
            this.pageSize = pageSize;
        },
        getData(data) {
            this.$root.startTableLoading();
            memberListOfChat(data)
                .then(res => {
                    if (res && res.code == 200) {
                        const { data, total } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        isService() {}
    },
    mounted() {
        //判断推广客服是否开启
        let authMenu = JSON.parse(this.authMenu);
        authMenu.forEach(t => {
            if (t.menu_name == '会员管理') {
                this.expend_service_manage = t.list.hasOwnProperty('expend_service_manage');
            }
        });

        let arr = [];
        if (this.adminType != 'super') {
            this.table.columns.forEach(t => {
                if (t.key != 'adminOtherName') arr.push(t);
            });
            this.table.columns = arr;
        }

        // this.Time = [this.$root.formatTimeS(this.Time[0]), this.$root.formatnightTimeS(this.Time[1])];
        // this.searchKey.startTime = this.Time[0];
        // this.searchKey.endTime = this.Time[1];

        // const { startTime, endTime } = this.searchKey;
        const data = {
            siteId: this.$root.nowSite.id,
            ...this.searchKey
        };

        for (let key in data) {
            if (!data[key]) delete data[key];
        }
        this.getData({ params: data });
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
</style>