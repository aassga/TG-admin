<template>
    <div>
        <div class="v2-search">
            <Form ref="searchkey" inline>
                <FormItem label="开始日期">
                    <DatePicker class="s-140" type="date" v-model="Time[0]" placeholder="开始日期"></DatePicker>
                </FormItem>
                <FormItem label="结束日期">
                    <DatePicker class="s-140" type="date" v-model="Time[1]" placeholder="结束日期"></DatePicker>
                </FormItem>
                <FormItem label="会员账号">
                    <Input placeholder="多个请以,逗号隔开" @keyup.enter.native="searchSubmit" class="s-160" v-model="searchKey.userName" />
                </FormItem>
                <!-- <FormItem>
					<Poptip trigger="hover" content="多个请以,逗号隔开,仅支持同类型多个输入" placement="bottom-start" class="ml14f">
						<Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
					</Poptip>
				</FormItem>-->
                <FormItem>
                    <Button type="primary" class="search" @click.prevent="searchSubmit()" :loading="$root.tableLoading">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-search bb">
            <ButtonGroup class="repay-button" style="margin-bottom:.3px !important">
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'shixun';
                        }
                    "
                    :class="currentBtn == 'shixun' ? 'active' : ''"
                    >视讯</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'qipai';
                        }
                    "
                    :class="currentBtn == 'qipai' ? 'active' : ''"
                    >棋牌</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'dianzi';
                        }
                    "
                    :class="currentBtn == 'dianzi' ? 'active' : ''"
                    >电子</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'caipiao';
                        }
                    "
                    :class="currentBtn == 'caipiao' ? 'active' : ''"
                    >彩票</Button
                >
            </ButtonGroup>
        </div>
        <div class="v2-table">
            <Tables
                :loading="$root.tableLoading"
                :value="table.data"
                :columns="table.columns"
                :total="table.total"
                :pageSizeOpts="table.pageSizeOpts"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></Tables>
        </div>
    </div>
</template>
<script>
import tableMixins from '@/mixins/table';
import { jinGuanJiaAndJiebeiLogsShow } from '@/api/activity';
import Icons from '_c/icons';
import Tables from '_c/tables';
import { logList } from '@/api/data';
export default {
    name: 'logList',
    mixins: [tableMixins],
    components: {
        Icons,
        Tables
    },
    data() {
        return {
            newType: '',
            Time: [this.$root.startTime(), this.$root.formatnightTimeS()],
            searchKey: {
                startTime: this.$root.startTime(),
                endTime: this.$root.formatnightTimeS(),
                userName: '',
                active_type: ''
            },
            currentBtn: 'shixun',
            table: {
                total: 0,
                pageSize: 20,
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                loading: true,
                columns: [
                    {
                        title: '会员账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '审核人账号',
                        key: 'review_username',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '操作时间',
                        key: 'addtime',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => {
                            return <span class="pl10  pr10">{this.$root.unixTime(params.row.addtime)}</span>;
                        }
                    },
                    {
                        title: '操作日志',
                        key: 'content',
                        align: 'center',
                        minWidth: 360,
                        tooltip: true
                    }
                ]
            }
        };
    },
    watch: {
        currentBtn: {
            handler(val, oldVal) {
                this.newType = val;
                let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
                params.active_type = this.currentBtn;
                for (let key in params) {
                    if (!params[key]) delete params[key];
                }
                this.getData({ params });
            },
            immediate: true
        }
    },
    methods: {
        searchSubmit() {
            let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
            if (this.$root.validateTime(this.Time)) {
                const [startTime, endTime] = this.$root.validateTime(this.Time);
                params.startTime = startTime && this.$root.formatTimeS(startTime);
                params.endTime = endTime && this.$root.formatnightTimeS(endTime);
            } else {
                return false;
            }
            this.searchKey.startTime = params.startTime;
            this.searchKey.endTime = params.endTime;

            if (!params.startTime && !params.endTime) {
                this.$Tip.info({ content: '请输入开始和结束时间！' });
                return false;
            }
            if (params.userName) params.userName = this.$root.trimAll(params.userName);
            if (params.userName && !this.$root.validateName(params.userName)) {
                this.$Tip.info({ content: '您所查询的会员账号不正确，请重新输入' });
                return false;
            }
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            this.getData({ params });
        },
        //  监听currentBtn,给getData传参，掉不同接口,
        getData(data) {
            data.params.active_type = this.newType;
            let dataParams = data.params;
            for (let key in dataParams) {
                if (!dataParams[key]) delete dataParams[key];
            }
            this.$root.startTableLoading();
            jinGuanJiaAndJiebeiLogsShow(data)
                .then(res => {
                    this.table.data = res.data.data.data;
                    this.table.total = res.data.data.total;
                    this.$root.endTableLoading();
                })
                .catch(error => this.$root.endTableLoading());
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
/deep/.ivu-table-header {
    font-size: 1rem;
    font-weight: normal;
    .ivu-table-cell {
        font-weight: 549;
    }
}
/deep/.ivu-table {
    color: #444;
}
</style>

