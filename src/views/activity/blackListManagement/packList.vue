<template>
    <div>
        <div class="v2-search bb mb10">
            <ButtonGroup class="repay-button1 fontColor" style="margin-bottom:.3px !important">
                <Button :class="activeValue == t.value ? 'active' : ''" v-for="(t, i) in navList" @click.prevent="changName(t)" :key="i">{{ t.name }}</Button>
            </ButtonGroup>
        </div>
        <div class="v2-search">
            <Form inline ref="searchKey">
                <FormItem>
                    <Button type="primary" class="ivu cardNutton" @click.prevent="addGame">添加游戏</Button>
                    <Button type="primary" class="ivu cardNutton ml10" v-if="btnStatus" @click.prevent="onDelete('allDelete')">批量移除</Button>
                </FormItem>
                <FormItem label="游戏名称">
                    <Input v-model="searchKey.gameName" class="w140x" placeholder="请输入游戏名称" />
                </FormItem>
                <FormItem label="游戏类型">
                    <Select clearable class="w140x" placeholder="全部" v-model="searchKey.gameType">
                        <Option v-for="(t, i) in gameClassList" :key="i" :value="t.value" @click.native="selectName(t.name, t.value)">{{ t.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" :loading="$root.tableLoading" @click.prevent="searchSubmit" class="pl20 pr20">查询</Button>
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
                @on-delete="onDelete"
                @on-select="onSelectOne"
                @on-select-cancel="onSelectCancel"
                @on-select-all="onSelectAll"
                @on-select-all-cancel="
                    () => {
                        this.btnStatus = false;
                    }
                "
            ></Tables>
        </div>
        <AddGame ref="showModals" :activeValue="activeValue" :activeName="activeName" @clickSearchKey="searchKey"></AddGame>
    </div>
</template>
<script>
import Tables from '_c/tables';
import AddGame from '../components/addPackList.vue';
import { bannedCountBetAmountGameList, bannedCountBetAmountGameSelectClass, bannedCountBetAmountGameDel, bannedCountBetAmountGameAdd } from '@/api/activity';
import { Form } from 'view-design';
import { rmRepeatItem } from '@/libs/util';
export default {
    name: 'packList',
    components: {
        Tables,
        AddGame
    },
    data() {
        return {
            id: '',
            msg: '',
            text: '',
            game_name: '',
            btnStatus: false,
            idList: [],
            searchKey: {
                siteId: this.$root.nowSite.id,
                gameName: '',
                gameType: '',
                gameClass: '',
                type: 'task'
            },
            selectInfo: {
                siteId: this.$root.nowSite.id,
                type: 'bannedListAndgameClass'
            },
            gameClassList: [],
            activeName: '任务中心',
            activeValue: 'task',
            navList: [],
            table: {
                data: [],
                pageSizeOpts: [20, 30, 40, 50],
                total: 0,
                loading: true,
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        title: '全选',
                        width: 60
                    },
                    {
                        title: '游戏类型',
                        key: 'platform',
                        align: 'center'
                    },
                    {
                        title: '游戏分类',
                        key: 'game_class_name',
                        align: 'center'
                    },
                    {
                        title: '游戏名称',
                        key: 'game_name',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: '',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                <div>
                                    <span
                                        class="blue-font"
                                        onClick={() => {
                                            this.onDelete('delete', params);
                                        }}
                                    >
                                        移除
                                    </span>
                                </div>
                            );
                        }
                    }
                ]
            }
        };
    },
    methods: {
        searchSubmit() {
            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        },
        changName(val) {
            const { name, value } = val;
            this.activeValue = value;
            this.activeName = name;
            this.searchKey.type = value;

            this.searchKey.gameName = '';
            this.searchKey.gameType = '';

            this.btnStatus = false;

            let data = { ...this.searchKey };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }

            this.getData({ params: data });
        },
        addGame() {
            const data = {
                siteId: this.$root.nowSite.id,
                type: this.activeValue
            };
            this.$refs.showModals.showModals();
            this.$refs.showModals.getNavList(data);
        },
        onSelectAll(val) {
            val && val.length > 0 ? (this.btnStatus = true) : (this.btnStatus = false);
            val &&
                val.forEach(t => {
                    this.idList.push(t.id);
                });
        },
        onSelectOne(val) {
            val && val.length > 0 ? (this.btnStatus = true) : (this.btnStatus = false);
            let newArr = [];
            val &&
                val.forEach(t => {
                    newArr.push(t.id);
                });
            this.idList = rmRepeatItem(newArr);
        },
        onSelectCancel(val) {
            if (val.length === 0) this.btnStatus = false;
        },
        onDelete(type, params) {
            if (params) {
                const { game_name, id } = params.row;
                this.id = id;
                this.game_name = game_name;
            }
            if (type == 'allDelete') {
                this.text = '您确定删除此条记录吗？';
                this.msg = '删除成功';
            }
            if (type == 'delete') {
                this.text = '您确定移除' + this.game_name + '吗?';
                this.msg = `移除${this.game_name}成功`;
            }
            const data = {
                siteId: this.$root.nowSite.id,
                id: this.id || String(this.idList)
            };
            this.$Tip.confirm({
                content: this.text,
                onOk: () => {
                    bannedCountBetAmountGameDel(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            if (type == 'delete') {
                                this.table.data.splice(params.index, 1);
                                data.type = this.searchKey.type;
                                this.getData({ params: data });
                            }
                            if (type == 'allDelete') {
                                data.type = this.searchKey.type;
                                this.getData({ params: data });
                            }
                            this.$Message.success({ content: this.msg });
                            this.btnStatus = false;
                            this.searchKey.gameName = '';
                            this.searchKey.gameType = '';
                            this.idList = [];
                        }
                    });
                }
            });
        },
        selectName(name, value) {
            this.searchKey.gameClass = value;
        },
        getData(data) {
            this.$root.startTableLoading();
            bannedCountBetAmountGameList(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { data, total } = res.data;
                        this.table.data = data;
                        this.table.total = total;
                        this.$refs.tables.currentpage = res.data.current_page;
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        getSelectList(selectData) {
            bannedCountBetAmountGameSelectClass(selectData).then(res => {
                const { bannedLis, gameClass } = res.data;
                this.navList = bannedLis;
                this.gameClassList = gameClass;
            });
        },
        onPageChange(page) {
            let data = { ...this.searchKey, limit: this.pageSize };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data, query: { page } });
        },
        onPageSizeChange(pageSize) {
            this.pageSize = pageSize;
            let data = { ...this.searchKey, limit: pageSize };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.getData({ params: data });
        }
    },
    created() {
        let data = { ...this.searchKey };
        for (let key in data) {
            if (!data[key]) delete data[key];
        }
        this.getData({ params: data });
        let selectData = { ...this.selectInfo };
        this.getSelectList(selectData);
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
</style>