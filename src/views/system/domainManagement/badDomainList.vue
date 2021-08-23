<template>
    <div>
        <div class="v2-search">
            <Form inline>
                <FormItem label="状态">
                    <Select v-model="searchKey.status" placeholder="全部" class="w100x" clearable>
                        <Option value="no">未处理</Option>
                        <Option value="pollution">污染</Option>
                        <Option value="wall">被墙</Option>
                    </Select>
                </FormItem>
                <FormItem label="域名">
                    <Input v-model="searchKey.domain" @keyup.enter.native="searchSubmit" class="w160x" placeholder="请输入域名" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                :loading="$root.tableLoading"
                :columns="table.columns"
                :value="table.data"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import Tables from '_c/tables';
import { badDomainList, updateBadDomain } from '@/api/agency';
import { getUserType } from '@/libs/util';
export default {
    name: 'badDomainList',
    components: { Tables },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            searchKey: {
                siteId: this.$root.nowSite.id,
                domain: '',
                limit: '',
                status: ''
            },
            table: {
                loading: true,
                data: [],
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                columns: [
                    {
                        title: '域名',
                        key: 'domain',
                        align: 'center',
                        minWidth: 110
                    },
                    {
                        title: '异常地区',
                        key: 'city',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => <span>{this.$root.text(params.row.city)}</span>
                    },
                    {
                        title: '警报时间',
                        key: 'addTime',
                        align: 'center',
                        minWidth: 130,
                        render: (h, params) => <span>{this.$root.unixTime(params.row.addTime)}</span>
                    },
                    {
                        title: '更新时间',
                        key: '',
                        align: 'center',
                        minWidth: 130,
                        render: (h, params) => <span>{params.row.updated_at ? this.$root.unixTime(params.row.updated_at) : '-'}</span>
                    },
                    {
                        title: '操作者',
                        key: 'updateAdmin',
                        align: 'center',
                        minWidth: 75,
                        tooltip: true,
                        render: (h, params) => <span>{this.$root.text(params.row.updateAdmin)}</span>
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 45,
                        render: (h, params) => {
                            let { status } = params.row;
                            return (
                                <span style={{ color: status == 'no' ? 'red' : '' }}>
                                    {status == 'no' ? '未处理' : status == 'wall' ? '被墙' : status == 'pollution' ? '污染' : '解析异常'}
                                </span>
                            );
                        }
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => (
                            <div>
                                <a
                                    style={{
                                        display: params.row.status !== 'no' ? 'inline-block' : 'none'
                                    }}
                                >
                                    -
                                </a>
                                <div
                                    style={{
                                        display: params.row.status == 'no' && (this.adminType == 'super' || this.authInPage.indexOf('updateBadDomain') != -1) ? 'block' : 'none'
                                    }}
                                >
                                    <a
                                        class="ib mr5"
                                        onClick={() => {
                                            this.updateStatus('pollution', '污染', params);
                                        }}
                                    >
                                        污染
                                    </a>
                                    <a
                                        class="ib mr5"
                                        onClick={() => {
                                            this.updateStatus('wall', '被墙', params);
                                        }}
                                    >
                                        被墙
                                    </a>
                                    <a
                                        class="ib mr5"
                                        onClick={() => {
                                            this.updateStatus('dnsErr', '解析异常', params);
                                        }}
                                    >
                                        解析异常
                                    </a>
                                </div>
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
            badDomainList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
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
            this.getData({ params: this.searchKey });
        },
        onPageChange(page) {
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
            this.getData({ params: this.searchKey, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            for (let key in this.searchKey) {
                if (!this.searchKey[key]) delete this.searchKey[key];
            }
            this.getData({ params: this.searchKey });
        },
        updateStatus(type, name, params) {
            this.$Tip.confirm({
                content: `您确定此域名已被${name}吗？`,
                onOk: () => {
                    let data = {
                        id: params.row.id,
                        status: type
                    };
                    updateBadDomain(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success('域名状态更改成功');
                            this.searchSubmit();
                        }
                    });
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
</style>


