<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="操作事件">
                    <!-- <LogSelect :class="[screen < 1600 ? 's-160' : 's-220']" @on-change="onLogTypeChange" /> -->
                    <Select clearable v-model="searchKey.name" class="s-120" placeholder="全部">
                        <Option v-for="item in firstList" :key="item.value" :value="item.value">{{ item.name }}</Option>
                    </Select>
                    <span v-show="searchKey.name" class="pl5 pr5">-</span>
                    <Select clearable v-model="searchKey.subType" placeholder="全部" class="s-120" v-show="searchKey.name">
                        <Option v-for="(t, i) in secondList" :key="'second' + i" :value="t.value" v-if="!t.name.includes('hide')">{{ t.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem label="管理员账号">
                    <Input placeholder="请输入管理员账号" :maxlength="20" v-model="searchKey.created_name" class="s-160" />
                </FormItem>
                <FormItem label="操作日志">
                    <Input v-model="searchKey.message" class="s-140" @keyup.enter.native="searchSubmit" placeholder="请输入关键字" />
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
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-details="onDetails"
            ></Tables>
        </div>
        <Modals ref="detailModal" title="日志详情" :width="750">
            <div slot="content" class="box">
                <p>
                    <span class="title">操作事件：</span>
                    <span>{{ detailsData.type_name }}</span>
                </p>
                <p>
                    <span class="title">操作日志：</span>
                    <span>{{ detailsData.message }}</span>
                </p>
                <!-- <p>
          <span class="title">path：</span>
          <span>{{detailsData.path}}</span>
        </p>
        <p>
          <span class="title">request：</span>
          <span>{{detailsData.request}}</span>
        </p>-->
                <p>
                    <span class="title">IP：</span>
                    <span>{{ detailsData.remote_addr }}</span>
                </p>
                <p>
                    <span class="title">操作人：</span>
                    <span>{{ detailsData.created_name }}</span>
                </p>
                <p>
                    <span class="title">操作时间：</span>
                    <span>{{ $root.unixTime(detailsData.created_at) }}</span>
                </p>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import tableMixins from '@/mixins/table';
import Icons from '@/components/icons';
import Modals from '@/components/modals';
import LogSelect from './components/log-select';
import { getAdminLogList } from '@/api/system';
import { adminLogType } from '@/api/common';
export default {
    name: 'adminLog',
    components: { Tables, Icons, Modals, LogSelect },
    data() {
        return {
            screen: screen.width,
            page: 1,
            detailsData: {},
            Time: [this.$root.startTime(1), this.$root.endTime(1)],
            searchKey: {
                startTime: this.$root.startTime(1),
                endTime: this.$root.endTime(1),
                siteId: this.$root.nowSite.id
            },
            table: {
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                columns: [
                    {
                        title: '管理员账号',
                        key: 'created_name',
                        align: 'center',
                        minWidth: 65
                    },
                    {
                        title: 'IP',
                        key: 'remote_addr',
                        align: 'center',
                        minWidth: 90
                    },
                    {
                        title: '操作事件',
                        key: 'type_name',
                        align: 'center',
                        minWidth: 100,
                        tooltip: true
                    },
                    {
                        title: '操作日志',
                        key: 'message',
                        align: 'center',
                        minWidth: 290,
                        tooltip: true,
                        className: 'pl10 pr10'
                    },
                    {
                        title: '操作时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                            return <span>{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    }
                    // {
                    //   title: "操作",
                    //   key: "handle",
                    //   align: "center",
                    //   options: ["details"]
                    // }
                ],
                data: []
            },
            allTypeList: [],
            firstList: [], //一级
            secondList: [] //二级
        };
    },
    watch: {
        'searchKey.name'(val) {
            if (val || val != undefined) {
                this.secondList = [];
                delete this.searchKey.subType;
                this.allTypeList.forEach(t => {
                    if (t.type == val) {
                        for (let key in t.subType) {
                            this.secondList.push({ name: t.subType[key], value: key });
                        }
                    }
                });
            }
        }
    },
    created() {
        this.getAdminLogType();
    },
    mounted() {
        this.getData({
            params: { ...this.searchKey, siteId: this.$root.nowSite.id }
        });
    },
    methods: {
        // onLogTypeChange(res) {
        //     this.searchKey.type_name = res;
        // },
        getData(data) {
            this.$root.startTableLoading(this);
            getAdminLogList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    const { data, total } = res.data;
                    this.table.data = data;
                    this.table.total = total;
                }
                this.$root.endTableLoading();
            }).catch(error=>this.$root.endTableLoading());
        },
        searchSubmit() {
            this.page == 1 ? '' : this.$refs.table.setPage();
            for (let key in this.searchKey) {
                if (key == 'subType' || key == 'name') {
                    this.searchKey.type_name = this.searchKey[key];
                }
            }
            let params = { ...this.searchKey };
            for (let t in params) {
                if (t == 'subType' || t == 'name') delete params[t];
            }
            params.siteId = this.$root.nowSite.id;
            // if (params.created_name && params.created_name.length < 5) {
            //   this.$Tip.info({ content: "管理员账号最小5个字符" });
            //   return false;
            // }
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTime(startTime);
                params.endTime = endTime && this.$root.formatTime(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;

            if (!params.startTime || !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间' });
                return false;
            }

            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (params.created_name) params.created_name = this.$root.trimAll(params.created_name);
            let reg = /^[0-9a-zA-Z-_]{5,20}$/;
            if (params.created_name && !reg.test(params.created_name)) {
                this.$Tip.info({ content: '您所查询的管理员账号不正确，请重新输入' });
                return false;
            }

            this.getData({ params });
        },
        onDetails(params) {
            this.$refs.detailModal.show();
            this.detailsData = {};
            setTimeout(() => {
                this.detailsData = params.row;
            }, 50);
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            let data = { ...this.searchKey, limit: pageSize };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        },
        //操作事件下拉
        getAdminLogType() {
            adminLogType().then(res => {
                this.allTypeList = res.data;
                this.allTypeList.forEach(t => {
                    this.firstList.push({ name: t.name, value: t.type });
                });
            });
        }
    }
};
</script>
<style lang="less" scoped>
.box {
    width: 100%;
    p {
        width: 60%;
        margin-top: 20px;
        margin-bottom: 20px;
        margin-left: 160px;
        span {
            padding-left: 30px;
        }
        span.title {
            display: inline-block;
            width: 90px;
            color: #c5c5c5;
        }
    }
}
</style>
