<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <div class="v2-button mb0">
                    <Button @click="addPay" v-if="adminType == 'super' || authInPage.indexOf('paymentJigsawManagementAdd') != -1">添加支付平台</Button>
                </div>
                <FormItem label="支付平台">
                    <Input class="s-140" placeholder="请输入关键字" @keyup.enter.native="submit" v-model="searchKey.platform_name" clearable />
                </FormItem>
                <Button type="primary" :loading="table.loading" style="height:36px" @click.prevent="submit">查询</Button>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                :value="table.data"
                :columns="table.columns"
                :total="table.total"
                :loading="table.loading"
                @on-page-change="onPageChange"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-size-change="onPageSizeChange"
                @on-edit="onEdit"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '_c/tables';
import { payChatJavaSiteList, paymentJigsawManagementDel } from '@/api/system';
import { getUserType, getAccessFromLocal } from '@/libs/util';
import { customSiteItems } from '@/api/common';
import { mapMutations } from 'vuex';
import { Tooltip, Content } from 'view-design';
export default {
    name: 'siteList',
    components: {
        Tables
    },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            accessSite: getAccessFromLocal(),
            searchKey: {
                limit: 20,
                page: 1,
                platform_name: ''
            },
            table: {
                total: 0,
                data: [],
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                columns: [
                    {
                        title: '当前站点',
                        key: 'siteName',
                        align: 'center',
                        minWidth: 65,
                        className: 'pl10 pr10',
                        tooltip: true
                    },
                    {
                        title: '正常金额',
                        key: 'nowMoney',
                        align: 'center',
                        minWidth: 55,
                        className: 'pl10 pr10',
                        tooltip: true
                    },
                    {
                        title: '最大金额',
                        key: 'maxMoney',
                        align: 'center',
                        minWidth: 85,
                        tooltip: true
                    },
                    {
                        title: '网银代码',
                        key: 'bankCode',
                        align: 'center',
                        minWidth: 80,
                        className: 'pl10 pr10',
                        tooltip: true,
                        render: (h, params) => {
                            if (params.row.bankCode) {
                                return (
                                    <Tooltip transfer>
                                        <span class="tool ib">{params.row.bankCode ? params.row.bankCode : '-'}</span>
                                        <div slot="content" style="white-space:normal">
                                            {params.row.bankCode}
                                        </div>
                                    </Tooltip>
                                );
                            } else {
                                return <span>-</span>;
                            }
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => <span>{this.$root.newUnixTime(params.row.created_at)}</span>
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 65,
                        render: (h, params) => {
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('paymentJigsawManagementUpd') != -1 ? 'inlinr-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.onEdit(params);
                                        }}
                                    >
                                        编辑
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
      this.getData();
    },
    methods: {
        ...mapMutations(['setAccess']),
        getData() {
            this.table.loading = true;
            payChatJavaSiteList().then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res;
                    this.table.data = data;
                    this.table.total = total;
                    this.table.loading = false;
                }
                this.$forceUpdate();
            });
        },
        onPageChange(page) {
            this.searchKey.page = page;
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            // this.getData(data);
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            // this.getData(data);
        },
        submit() {
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            delete data.page;
            // this.getData(data);
        },
        // 新增,编辑站点
        addPay() {
            this.$router.push({
                name: 'addPayJava',
                params: { page: 'create' }
            });
        },
        onEdit(params) {
          console.log(params)
          const {id,maxMoney,state,siteId}=params.row;
            this.$router.push({
                name: 'addPayJava',
                params: { page: 'edit' },
                query: { id, maxMoney,state,siteId}
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
@import '../../../styles/class.less';
</style>
<style lang="less" scoped>
/deep/.ivu-tooltip {
    width: 100%;
    .ivu-tooltip-rel {
        width: 100%;
        .tool {
            width: 100% !important;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
</style>
