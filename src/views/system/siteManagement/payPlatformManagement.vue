<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
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
import { getPlatformList,paymentJigsawManagementList, paymentJigsawManagementDel } from '@/api/system';
import { getUserType, getAccessFromLocal } from '@/libs/util';
import { customSiteItems } from '@/api/common';
import { mapMutations } from 'vuex';
import { Tooltip, Content } from 'view-design';
export default {
    name: 'payPlatformManagement',
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
                        title: '支付平台',
                        key: 'platformname',
                        align: 'center',
                        minWidth: 65,
                        className: 'pl10 pr10',
                        tooltip: true
                    },
                    {
                        title: '支付方式',
                        key: 'orderchannels',
                        align: 'center',
                        minWidth: 55,
                        className: 'pl10 pr10',
                        render:(h,params)=>{
                          const {orderchannels}=params.row;
                          return(<span>{orderchannels==0?'微信':(orderchannels=='1'?'支付宝':(orderchannels=='2'?'网银':'云闪付'))}</span>)
                        }
                    },
                    {
                        title: '范围金额',
                        key: 'amountextratype',
                        align: 'center',
                        minWidth: 85,
                        tooltip: true
                    },
                    {
                        title: '固定金额',
                        key: 'amountextra',
                        align: 'center',
                        minWidth: 80,
                        className: 'pl10 pr10',
                        tooltip: true,
                    },
                    {
                       title: '终端',
                       key:'devices',
                       align:'center',
                       minWidth: 80,
                    },
                    {
                        title: '创建日期',
                        key: 'createtime',
                        align: 'center',
                        minWidth: 100,
                        render: (h, params) => <span>{this.$root.newUnixTime(params.row.createtime)}</span>
                    },
                ]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData(vm.searchKey);
        });
    },
    methods: {
        ...mapMutations(['setAccess']),
        getData(data) {
            this.table.loading = true;
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            getPlatformList(data).then(res => {
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
            this.getData(data);
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData(data);
        },
        submit() {
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            delete data.page;
            this.getData(data);
        },
        del(params) {
            //删除平台
            this.$Tip.confirm({
                content: `您确定要删除${params.row.platform_name}吗？`,
                onOk: () => {
                    let data = { id: params.row.id };
                    paymentJigsawManagementDel(data, true).then(res => {
                        if (res && res.code == 200) {
                            this.$Message.success(`删除${params.row.platform_name}成功`);
                            this.getData(this.searchKey);
                        }
                    });
                }
            });
        },
        // 新增,编辑站点
        addPay() {
            this.$router.push({
                name: 'addPay',
                params: { page: 'create' }
            });
        },
        onEdit(params) {
            this.$router.push({
                name: 'addPay',
                params: { page: 'edit' },
                query: { id: params.row.id }
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
