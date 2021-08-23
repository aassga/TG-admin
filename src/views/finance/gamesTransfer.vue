<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem label="转入平台">
                    <!-- <Select clearable class="s-100" v-model="searchKey.platformIn">
            <Option v-for="(item,i) in this.platformList" :key="i" :value="item.name">{{item.title}}</Option>
          </Select>-->
                    <Select clearable class="s-120" v-model="searchKey.platformIn" placeholder="全部">
                        <Option v-for="(val, key, index) in platformList" :key="index" :value="key">{{ val }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="状态">
                    <Select clearable class="s-86" v-model="searchKey.status" placeholder="全部">
                        <Option v-for="(item, index) in statusList" :key="index" :value="item.value">{{ item.title }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始日期">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <!--<FormItem>
          <Checkbox v-model="searchKey.isLike">
            <span class="pl5">模糊</span>
          </Checkbox>
        </FormItem>-->
                <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" class="s-195" v-model="searchKey.userName" />
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" class="search ml10f mb5" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-table">
            <Tables
                editable
                ref="tables"
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                :more="table.more"
            ></Tables>
        </div>
    </div>
</template>
<script>
import vuex from '@/store';
import { mapState } from 'vuex';
import tableMixins from '@/mixins/table';
import { transferLogListData } from '@/api/finance';
import { platformCodeListData } from '@/api/common';
import Tables from '@/components/tables';
export default {
    name: 'gamesTransfer',
    mixins: [tableMixins],
    components: {
        Tables
    },
    data() {
        return {
            platformList: [],
            statusList: [
                { title: '成功', value: 'success' }, 
                { title: '失败', value: 'fail' },
                {title:'转帐中',value:'wait'},
                {title:'失败，已退回钱包',value:"rollback"}, 
                { title: '无效', value: 'cancel' }],
            searchKey: {
                startTime: this.$root.startTime(1),
                endTime: this.$root.endTime(1)
            },
            Time: [this.$root.startTime(1), this.$root.endTime(1)],
            table: {
                total: 0,
                loading: true,
                pageSizeOpts: [20, 30, 40, 50],
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '转出平台',
                        key: 'platformOut',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '转入平台',
                        key: 'platformIn',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '变更金额',
                        key: 'money',
                        align: 'center',
                        minWidth: 75
                    },
                    {
                        title: '变更前余额',
                        key: 'beforMoney',
                        align: 'center',
                        minWidth: 170,
                        tooltip: true
                    },
                    {
                        title: '变更后余额',
                        key: 'afterMoney',
                        align: 'center',
                        minWidth: 170,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 35,
                        render: (h, params) => {
                            let color = params.row.status == 'success'||params.row.status == 'wait' ? '' : '#FF2626FF';
                            return <span style={{ color }}>{params.row.status == 'success' ? '成功':(params.row.status == 'cancel' ? '无效':(params.row.status == 'wait' ? '转帐中':(params.row.status=='fail'?'失败':'失败，已退回钱包')))}</span>
                        }
                    },
                    {
                        title: '变更时间',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return <span class="pl10 pr10">{this.$root.unixTime(params.row.created_at)}</span>;
                        }
                    }
                ],
                data: []
            }
        };
    },
    created() {
        this.getPlatform();
    },
    methods: {
        getData(data) {
            this.$root.startTableLoading();
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            transferLogListData(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { data, total } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        // 转入平台
        getPlatform() {
            this.$root.startTableLoading();
            let data = this.$root.nowSite.id;
            platformCodeListData(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        this.platformList = res.data;
                    }
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        },
        searchSubmit() {
            let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
            let isLike = params.isLike ? '1' : '0';
            params.isLike = isLike;
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTime(startTime);
                params.endTime = endTime && this.$root.formatTime(endTime);
            } else {
                return false;
            }
            if (!params.startTime) {
                delete params.startTime;
            }
            if (!params.endTime) {
                delete params.endTime;
            }
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (!this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            // if(params.userName !== undefined &&params.userName.includes("")){
            //   params.userName = params.userName.trim();
            //   if (params.userName && params.userName.length < 5) {
            //     this.$Tip.info({ content: "会员账号最小5个字符！" });
            //     return false;
            //   }
            //   if (params.userName && params.userName.length >20) {
            //     this.$Tip.info({ content: "会员账号最大小于20个字符！" });
            //     return false;
            //   }
            //   const reg = /[0-9a-zA-Z_]{5,20}/;
            //   if(reg.test(params.userName)){

            //   }
            //   else{
            //     this.$Tip.info({ content: "用户名由5-20位的数字·字母·下划线组成！" });
            //     return false;
            //   }
            // }

            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;
            this.$refs.tables.setPage();
            this.getData({ params });
        }
    }
};
</script>
<style lang="less" scoped>
.ivu-form-item {
    &:nth-child(5) {
        margin-right: -5px;
    }
}
</style>


