<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem>
                    <div class="v2-button">
                        <Button @click="onBlackName" v-if="adminType == 'super' || authInPage.indexOf('fastKillAdd') != -1">添加名单</Button>
                    </div>
                </FormItem>
                <FormItem label="站点名称">
                    <Select class="w140x" filterable placeholder="全部" clearable v-model="searchKey.siteName">
                        <Option v-for="(t, i) in postSite" :key="'site' + i" :value="t.siteName">{{ t.siteName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" v-model="searchKey.userName" clearable @keyup.enter.native="searchSubmit" class="w160x" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="ivu-btn search" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                editable
                :columns="table.columns"
                :loading="$root.tableLoading"
                :total="table.total"
                :value="table.data"
                :page-size-opts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></Tables>
        </div>
        <Modals ref="addBlackName" :title="title" :width="570">
            <div slot="content" class="v2-form-wrapper">
                <Form ref="addBlack" :label-width="160" :rules="rules" :model="addBlack" style="width:570px;">
                    <FormItem label="站点名称" prop="siteId">
                        <Select v-model="addBlack.siteId" class="w260x" placeholder="关键字查询" filterable clearable transfer>
                            <Option v-for="(t, i) in accessSite" :key="'site' + i" :value="t.id">{{ t.siteName }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="会员账号" class="mt20 mb30">
                        <AutoSearch
                            :disabled="!addBlack.siteId"
                            :siteId="addBlack.siteId"
                            @sendSuperior="getUsername"
                            ref="autoSearch"
                            :placeholder="'会员账号，默认查询'"
                            :stage="'all'"
                        ></AutoSearch>
                    </FormItem>
                    <FormItem class="mb40">
                        <Button class="ivu-btn submit bg  ft20 w260x" @click="save" style="width:260px" type="primary">确认添加</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Icons from '@/components/icons';
import Modals from '@/components/modals';
import AutoSearch from '_c/auto-search';
import { getUserType, getAccessFromLocal } from '@/libs/util';
import { fastKillList, fastKillAdd, fastKillRemove } from '@/api/lottery';
import { Tooltip } from 'view-design';
export default {
    name: 'fastLotteryBlack',
    components: {
        Tables,
        Modals,
        Icons,
        AutoSearch
    },
    data() {
        return {
            searchKey: {
                siteName: '',
                limit: 20
            },
            page: 1,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            userName: '',
            postSite: [],
            title: '添加名单',
            accessSite: getAccessFromLocal(),
            table: {
                loading: true,
                title: '高杀率名单',
                data: [],
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                columns: [
                    {
                        title: '站点名称',
                        key: 'siteName',
                        align: 'center',
                        minWidth: 80,
                        tooltip: true
                    },
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '姓名',
                        key: 'realName',
                        align: 'center',
                        minWidth: 60,
                        tooltip: true,
                        render: (h, params) => <span>{params.row.realName ? params.row.realName : '-'}</span>
                    },
                    {
                        title: '操作人',
                        key: 'adminName',
                        align: 'center',
                        minWidth: 75,
                        tooltip: true
                    },
                    {
                        title: '创建时间',
                        key: 'addTime',
                        align: 'center',
                        minWidth: 130,
                        render: (h, params) => <span>{this.$root.unixTime(params.row.addTime)}</span>
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 85,
                        render: (h, params) => {
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        onClick={() => {
                                            this.onRemove(params);
                                        }}
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('fastKillRemove') != -1 ? 'inline-block' : 'none'
                                        }}
                                    >
                                        移除
                                    </a>
                                </div>
                            );
                        }
                    }
                ]
            },
            addBlack: {
                siteId: '',
                userName: '',
                siteName: ''
            },
            rules: {
                userName: [{ required: true, message: '请输入会员账号', trigger: 'blur' }],
                siteId: [{ required: true, message: '请选择或输入站点' }]
            },
            timer: null // 定时请求数据的定时器
        };
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
    mounted() {
        // let data = { siteId: this.$root.nowSite.id };
        let data = {};
        this.getDataInterval(); //定时请求数据
        this.getData({ params: data }, true);
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        resetForm() {
            for (let key in this.addBlack) {
                delete this.addBlack[key];
            }
        },
        save() {
            this.$refs.addBlack.validate(valid => {
                if (valid) {
                    if (!this.addBlack.userName) {
                        this.$Message.error('请输入的会员账号');
                        return false;
                    }
                    this.accessSite.map(item => {
                        if (item.id == this.addBlack.siteId) {
                            this.addBlack.siteName = item.siteName;
                        }
                    });
                    this.$refs.addBlackName.spinShow();
                    fastKillAdd(this.addBlack, true)
                        .then(res => {
                            this.$refs.addBlackName.spinHide();
                            if (res != undefined && res.code == 200) {
                                this.$Message.success('添加名单成功');
                                this.getData({ params: this.searchKey }, true);
                                this.$refs.addBlackName.hide();
                                this.resetForm();
                            }
                        })
                        .catch(error => {
                            this.$refs.addBlackName.spinHide();
                        });
                }
            });
        },
        // 添加至名单列表
        onBlackName(params) {
            this.$nextTick(() => {
                this.$refs.autoSearch.removeDefault();
            });
            this.$refs.addBlack.resetFields();
            this.$refs.addBlackName.show();
        },
        // 查询
        searchSubmit() {
            let { userName } = this.searchKey;
            if (userName) this.searchKey.userName = this.$root.trimAll(userName);
            let data = { ...this.searchKey };
            if (!data.userName) {
                delete data.userName;
            } else {
                if (!this.$root.validateName(data.userName)) {
                    this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                    return false;
                }
            }
            this.$refs.table.setPage();
            this.getData({ params: data }, true);
        },
        onPageChange(page) {
            this.page = page;
            this.getData(
                {
                    params: this.searchKey,
                    query: { page }
                },
                true
            );
        },
        getData(data, flag) {
            for (let key in data.params) {
                if (!data.params[key]) delete data.params[key];
            }
            if (flag) this.$root.startTableLoading(this);
            fastKillList(data).then(res => {
                this.table.data = res.data.data;
                this.table.total = res.data.total;
                this.postSite = res.data.siteCollect;
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        //  移除黑名单
        onRemove(params) {
            const { id } = params.row;
            this.$Tip.confirm({
                content: '你确定将此会员移出名单吗?',
                onOk: () => {
                    let data = {
                        id
                    };
                    fastKillRemove(data, true).then(res => {
                        if (res != undefined && res.code == 200)
                            if (typeof res.data === 'string') {
                                this.$Message.config({
                                    top: 150
                                });
                                this.$Message.success('会员移出名单成功！');
                                this.table.data.splice(params.index, 1);
                                this.table.total--;
                            }
                    });
                }
            });
        },
        //通过自动查询，获取会员账号
        getUsername(value) {
            this.addBlack.userName = value;
        },
        getDataInterval() {
            // let { userName } = this.searchKey
            // if (userName) this.searchKey.userName = this.$root.trimAll(userName)
            // let data = { ...this.searchKey }
            // if (!data.userName) {
            //   delete data.userName;
            // } else {
            //   if (!this.$root.validateName(data.userName)) {
            //     this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入'})
            //     return false
            //   }
            // }
            clearInterval(this.timer);
            this.timer = null;
            this.timer = setInterval(() => {
                this.page == 1 ? this.getData({ params: this.searchKey }, false) : this.getData({ params: this.searchKey, query: { page: this.page } }, false);
            }, 5000);
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            this.getData({ params: this.searchKey }, true);
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
@import '../../styles/class.less';
.tjhmd {
    width: 260px;
    height: 50px;
}
.w260x {
    width: 260px;
    height: 30px;
}
/deep/.v2-button {
    margin-right: 0 !important;
}
/deep/.ivu-form-item-error-tip {
    top: 40px;
    left: -8px;
}
/deep/.ivu-select-selection {
    color: #444;
}
/deep/.ivu-input-icon-validate {
    display: none !important;
}
</style>

