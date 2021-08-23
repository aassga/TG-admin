<template>
<div>
<div class="v2-search">
    <Form ref="searchKey" inline>
        <FormItem label="标题">
            <Input v-model="searchKey.title" placeholder="输入标题关键字" :class="[screen < 1600 ? 'w140x' : '']" />
        </FormItem>
        <FormItem>
            <Select v-model="searchKey.typeTag">
                <Option value="send_username">发件人</Option>
                <Option value="to_username">收件人</Option>
            </Select>
        </FormItem>
        <FormItem>
            <Input
            :placeholder="searchKey.typeTag == 'send_username' ? '请输入发件人账号' : '请输入收件人账号'"
            :class="[screen < 1600 ? 'w140x' : '']"
            v-model="searchKey.send_username"
        />
        </FormItem>
        <FormItem label="开始时间">
            <DatePicker type="date" placeholder="开始" class="s-120" v-model="Time[0]"></DatePicker>
        </FormItem>
        <FormItem label="结束时间">
            <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
        </FormItem>
        <FormItem>
            <Button type="primary" class="search" :loading="$root.tableLoading" @click="searchSubmit">查询</Button>
        </FormItem>
    </Form>
</div>
<div class="v2-search bb mb10">
    <ButtonGroup class="repay-button1 fontColor" style="margin-bottom:.3px !important">
        <Button :class="activeName == t.val ? 'active' : ''" v-for="(t, i) in navList" @click.prevent="changName(t)" :key="i">{{ t.name }}</Button>
    </ButtonGroup>
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
        @on-delete="onDelete"
        @on-select="onSelectOne"
        @on-select-all="onSelectAll"
    ></Tables>
</div>
<div>
</div>
</div>
</template>
<script>
import Tables from '_c/tables';
    export default{
        name:'mailNew',
        components:{
            Tables,
        },
        data(){
            return{
                activeName:'inBox',
                screen: screen.width,
                Time:[],
                navList:[
                    {name:'收件箱',val:'inBox'},
                    {name:'发件箱',val:'outbox'},
                    {name:'群发件',val:'sendGroup'}
                ],
                searchKey:{
                    title:'',
                    typeTag:'',

                },
                table: {
                total: 0,
                more: true,
                page: true,
                loading: true,
                columns: [
                {
                        type: 'selection',
                        title: '全选',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '发件人',
                        key: 'send_username',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '收件人',
                        key: 'to_username',
                        align: 'center',
                        minWidth: 95,
                        tooltip: true
                    },
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center',
                        tooltip: true,
                        minWidth: 95
                    },
                    {
                        title: '内容',
                        key: 'content',
                        align: 'center',
                        tooltip: true,
                        className: 'pl10 pr10',
                        minWidth: 120
                    },
                    {
                        title: '发送时间',
                        key: 'send_time',
                        align: 'center',
                        minWidth: 160,
                        render: (h, params) => {
                            return <span class="pl20 pr20">{this.$root.unixTime(params.row.send_time)}</span>;
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        minWidth: 50,
                        render: (h, params) => {
                            return (
                                <div>
                                    <Icons type={params.row.status == 'yes' ? 'yidu' : 'weidu'} color={params.row.status == 'yes' ? '#B3B3B3' : '#57A3F3'} size="20" />
                                </div>
                            );
                        }
                    },
                ],
                data: []
            },


            }
        },
        methods:{
            changName(t){

            },
            searchSubmit(){

            },
            onPageSizeChange(){

            },
            onDelete(){

            },
            onSelectOne(){

            },
            onSelectAll(){

            },
            onPageChange(){

            }
        }
    }
</script>