<template>
    <div>
        <div class="v2-search">
            <Form inline ref="searchKey">
                <FormItem>
                    <Button type="primary"
                        v-if="adminType == 'super' || authInPage.indexOf('sysUpgradeNotice') != -1"
                        class="ivu fffButton"
                        @click.prevent="
                            () => {
                                $router.push({ name: 'addUpMessage' });
                            }
                        "
                    >
                        <Icons type="fazhanneixin" class="mr5" size="14"></Icons>发送更新通知
                    </Button>
                </FormItem>
                <FormItem label="标题">
                    <Input class="w160x" v-model="searchKey.title" placeholder="输入标题关键字" />
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker type="date" class="w120x" v-model="Time[0]" placeholder="请选择日期"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker type="date" v-model="Time[1]" class="w120x" placeholder="请选择日期"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" :loading="$root.tableLoading" @click="searchSubmit">查询</Button>
                </FormItem>
            </Form>
            <div class="v2-search mt10">
                <div class="repay-button bb" style="height:38px">
                    <button @click="eMail('getEMail')" class="ft16 fontColor bbN" :class="showComponent == 'getEMail' ? 'ivu-btn active cs' : 'ivu-btn cs'">收件箱</button>
                    <Button
                        @click.prevent="eMail('sendEMail')"
                        class="ft16 fontColor bbN"
                        v-if="adminType == 'super' || authInPage.indexOf('sysUpgradeNotice') != -1"
                        :class="showComponent === 'sendEMail' ? 'ivu-btn active cs' : 'ivu-btn cs'"
                        >发件箱</Button
                    >
                </div>
            </div>
            <div class="v2-table">
                <Tables
                    ref="tables"
                    :page="table.page"
                    :loading="$root.tableLoading"
                    :value="table.data"
                    :columns="table.columns"
                    :total="table.total"
                    :showSizer="true"
                    @on-details="onDetails"
                    @on-page-change="onPageChange"
                    @on-page-size-change="onPageSizeChange"
                ></Tables>
            </div>
            <Modals ref="ModalsMessage" width="600" title="系统通知">
                <div slot="content" class="modal-overflow w480x">
                    <div class="w480x ml60">
                        <p class="txt-a ft16">{{ $root.trimHtml(title) }}</p>
                        <p class="pt20 txt-a ft14">{{ createdTime }}</p>
                        <div v-if="newImg" class="pt20 txt-a w300x h300 ma">
                            <img style="width:100%;heigth:100%" :src="newImg" />
                        </div>
                        <p class="mt20 ft14 mb20 breakWord" v-html="contentMessage"></p>
                    </div>
                </div>
            </Modals>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex';
import Icons from '@/components/icons';
import Tables from '_c/tables';
import Modals from '_c/modals';
import { getUserType } from '@/libs/util';
import { adminMassageGetList, adminMassageSendList, adminMassageAdd, adminMassageAS, adminMassageUp } from '@/api/system';
export default {
    name: 'adminMassageSendList',
    components: {
        Icons,
        Tables,
        Modals
    },
    data() {
        return {
            flagStatus: '',
            createdTime: '',
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            newStatus: '',
            adminId: '',
            title: '',
            newImg: '',
            contentMessage: '',
            showComponent: 'getEMail',
            searchKey: {
                title: ''
                // startTime: this.$root.todayStartTime(),
                // endTime: this.$root.todayEndTime()
            },
            Time: [this.$root.todayStartTime(), this.$root.todayEndTime()],
            table: {
                total: 0,
                more: true,
                page: true,
                loading: true,
                columns: [],
                data: []
            },
            sendtable: {
                loading: true,
                sendcolumns: [
                    {
                        title: '发件人',
                        key: 'sendUserName',
                        align: 'center'
                    },
                    // {
                    //     title: '收件人',
                    //     key: 'getUserName',
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         return <span>{params.row.getUserName ? params.row.getUserName : '-'}</span>;
                    //     }
                    // },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        tooltip: true,
                        minWidth: screen.width < 1600 ? 65 : 120,
                        className: screen.width < 1600 ? 'pl5 pr5' : 'pl20 pr20'
                    },
                    {
                        title: '发送时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '操作',
                        key: '',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                <a
                                    onClick={() => {
                                        this.onDetails(params);
                                    }}
                                >
                                    详情
                                </a>
                            );
                        }
                    }
                ]
            },
            inBoxTable: {
                loading: true,
                inBoxColumns: [
                    {
                        title: '发件人',
                        key: 'sendUserName',
                        align: 'center'
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center',
                        tooltip: true
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        minWidth: screen.width < 1600 ? 65 : 120,
                        tooltip: true,
                        className: screen.width < 1600 ? 'pl5 pr5' : 'pl20 pr20'
                    },
                    {
                        title: '收取时间',
                        key: 'created_at',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    },
                    {
                        title: '状态',
                        key: 'state',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                <div>
                                    <Icons color={params.row.state == '0' ? '#57A3F3' : '#B3B3B3'} type={params.row.state == '0' ? 'weidu' : 'yidu'} />
                                </div>
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: '',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                <a
                                    onClick={() => {
                                        this.onDetails(params);
                                    }}
                                >
                                    详情
                                </a>
                            );
                        }
                    }
                ]
            }
        };
    },
    computed: {
        ...mapState({ flag: state => state.system.flag })
    },
    watch: {
        flag: {
            handler(val, oldVal) {
                this.flagStatus = val;
                let newData = this.table.data[0];
                if (val == false) {
                    for (let key in newData) {
                        if (key == 'state') {
                            newData[key] = 1;
                        }
                    }
                }
                console.log('newData',newData)
            }
        }
    },
    mounted() {
        const data = {
            startTime: this.searchKey.startTime,
            endTime: this.searchKey.endTime
        };
        this.searchSubmit();
    },
    methods: {
        eMail(name) {
            this.showComponent = name;
            this.searchSubmit();
        },

        searchSubmit() {
            let data = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                data.startTime = startTime && this.$root.formatTimeS(startTime);
                data.endTime = endTime && this.$root.formatnightTimeS(endTime);
            }
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.$refs.tables.setPage();
            this.showComponent == 'getEMail' ? this.getInboxData({ params: data }) : this.getOutboxData({ params: data });
        },
        //收件箱
        getInboxData(data) {
            this.$root.startTableLoading();
            this.table.columns = this.inBoxTable.inBoxColumns;
            adminMassageGetList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
                    let data2 = [];
                    data.forEach((t, i) => {
                        data2.push(Object.assign({}, t, { content2: t.content }));
                    });
                    data2.forEach(m => {
                        for (let key in m) {
                            if (key == 'content') m[key] = this.$root.trimPhtml(m[key]);
                            if (m.content == '') m.content = '-';
                        }
                    });
                    this.table.data = data2;
                    this.table.total = total;
                }
                // this.$nextTick(function() {
                //     this.table.current = 1;
                // });
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
        },
        //发件箱
        getOutboxData(data) {
            this.$root.startTableLoading();
            this.table.columns = this.sendtable.sendcolumns;
            adminMassageSendList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
                    let data2 = [];
                    data.forEach((t, i) => {
                        data2.push(Object.assign({}, t, { content2: t.content }));
                    });
                    data2.forEach(m => {
                        for (let key in m) {
                            if (key == 'content') m[key] = this.$root.trimPhtml(m[key]);
                            if (m.content == '') m.content = '-';
                        }
                    });
                    data.forEach(m => {
                        for (let key in m) {
                            if (key == 'content') {
                                m[key] = this.$root.trimPhtml(m[key]);
                            }
                        }
                    });
                    this.table.data = data2;
                    this.table.total = total;
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
        },
        onDetails(params) {
            const { content2, title, id, state, created_at } = params.row;
            const data = { id };
            this.$refs.ModalsMessage.show();
            if (state != 1) {
                this.$refs.ModalsMessage.spinShow();
                adminMassageUp(data, true)
                    .then(res => {
                        this.contentMessage = content2;
                        this.title = title;
                        this.createdTime = this.$root.unixTime(created_at);
                        this.newImg = this.$root.trimImg(this.contentMessage);
                        params.row.state = 1;
                        this.$refs.ModalsMessage.spinHide();
                    })
                    .catch(errr => {
                        this.$refs.ModalsMessage.spinHide();
                    });
            } else {
                this.contentMessage = content2;
                this.title = title;
                this.createdTime = this.$root.unixTime(created_at);
                this.newImg = this.$root.trimImg(this.contentMessage);
            }
        },
        onPageChange(page) {
            let data = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                data.startTime = startTime && this.$root.formatTimeS(startTime);
                data.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (this.showComponent == 'sendEMail') {
                this.getOutboxData({ params: data, query: { page } });
            } else {
                this.getInboxData({ params: data, query: { page } });
            }
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                data.startTime = startTime && this.$root.formatTimeS(startTime);
                data.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            if (this.showComponent == 'sendEMail') {
                this.getOutboxData({ params: data });
            } else {
                this.getInboxData({ params: data });
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../styles/button.less';
</style>