<template>
    <div>
        <Tables ref="table" :value="table.data" :columns="table.columns" :page="false" :loading="$root.tableLoading"> </Tables>
        <div slot="footer" v-show="level_id">
            <footer class="txt-a footer c62Color cs" style="background: #f4faff;" v-if="isEdit && table.data.length < 100" @click.prevent="addConfig" @click="sendMsg">
                <Icons type="xinzeng" size="14" class="mr5"></Icons>添加
            </footer>
        </div>
        <div slot="more" class="mt30 iconColor ft14">
                <div>*温馨提示：达到每一条件均可领取一次，实时结算，实时可领（统计时间依据北京时间）</div>
                <div class="mt20">
                    <p>*活动规则：</p>
                    <p>用户<b>当日</b>游玩指定游戏达到条件后可领取相应礼金。</p>
                </div>
                <div class="mt20">
                    <p>参数说明：</p>
                    <p>游戏名称—设置活动对象；</p>
                    <p>有效投注—需完成打码的有效投注金额；</p>
                    <p>奖金金额—满足条件后，可领取的奖金金额；</p>
                </div>
            </div>
    </div>
</template>

<script>
import Tables from '_c/tables';
import Icons from '_c/icons';
import { getActiveChessTaskConfigList, delActiveChessTaskConfigDel, getActiveChessTaskGameClassShow, getActiveChessTaskGameQuery } from '@/api/activity';
export default {
    props: ['data', 'index', 'isEdit'],
    components: {
        Tables,
        Icons
    },
    data() {
        return {
            table: {
                data: [],
                columns: [
                    {
                        title: '游戏名称',
                        key: 'game_name',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, params.row.game_name),
                                    h(
                                        'Select',

                                        {
                                            class: 'w40 mr15 game-name',
                                            style: { display: this.isEdit ? 'inline-block' : 'none' },
                                            ref: 'gameRef',
                                            props: {
                                                placeholder: params.row.game_name ? params.row.game_name : '请输关键词',
                                                value: this.table.data[params.index].game_id, // 获取选择的下拉框的值
                                                transfer: true,
                                                labelInValue: true,
                                                filterable: true
                                            },
                                            on: {
                                                'on-query-change': e => {
                                                    const vm = this;
                                                    clearTimeout(vm.timer);
                                                    vm.timer = setTimeout(() => {
                                                        if (e) {
                                                            let id = this.active_type == 'dianzirenwu' ? 10001 : this.active_type == 'qipairenwu' ? 10004 : 10005;
                                                            let data = { siteId: this.$root.nowSite.id, name: e, game_class_id: id };
                                                            this.gameQuery(data);
                                                        }
                                                    }, 1000);
                                                },
                                                'on-change': e => {
                                                    if (e) {
                                                        this.table.data[params.index].game_id = e.value;
                                                        this.table.data[params.index].game_name = e.label;
                                                        if (this.active_type == 'dianzirenwu') {
                                                            this.table.data[params.index].game_class_id = 10001;
                                                            this.table.data[params.index].game_class_name = '电子游艺';
                                                        }
                                                        if (this.active_type == 'qipairenwu') {
                                                            this.table.data[params.index].game_class_id = 10004;
                                                            this.table.data[params.index].game_class_name = '棋牌游戏';
                                                        }
                                                        if (this.active_type == 'buyurenwu') {
                                                            this.table.data[params.index].game_class_id = 10005;
                                                            this.table.data[params.index].game_class_name = '电子游戏';
                                                        }
                                                        this.sendMsg();
                                                    }
                                                }
                                            }
                                        },
                                        this.queryList.map(item => {
                                            return h('Option', {
                                                props: {
                                                    value: item.id,
                                                    label: item.name
                                                }
                                            });
                                        })
                                    )
                                ]
                            );
                        }
                    },
                    {
                        title: '有效投注',
                        key: 'bet',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.bet).toFixed(2)),
                                    h('InputNumber', {
                                        class: 'w50',
                                        style: { display: this.isEdit ? 'inline-block' : 'none' },
                                        props: {
                                            value: Number(params.row.bet),
                                            min: 0,
                                            max: 9999999999
                                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                        },
                                        on: {
                                            'on-change': e => {
                                                if (!e) e = 0;
                                                this.table.data[params.index].bet = e;
                                                this.sendMsg();
                                            }
                                        }
                                    })
                                ]
                            );
                        }
                    },
                    {
                        title: '奖金金额',
                        key: 'gift_money',
                        align: 'center',
                        render: (h, params) => {
                            return (
                                'div',
                                [
                                    h('span', { style: { display: !this.isEdit ? 'inline-block' : 'none' } }, Number(params.row.gift_money).toFixed(2)),
                                    h('InputNumber', {
                                        class: 'w50',
                                        style: { display: this.isEdit ? 'inline-block' : 'none' },
                                        props: {
                                            value: Number(params.row.gift_money),
                                            min: 0,
                                            max: 9999999999
                                            // formatter:value =>this.table.data[params.index].bet_money= value =  /\d+(\.\d{1,2})?/g.exec(`${value}`)[0]
                                        },
                                        on: {
                                            'on-change': e => {
                                                if (!e) e = 0;
                                                this.table.data[params.index].gift_money = e;
                                            }
                                        }
                                    })
                                ]
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            if (params.row.id != undefined) {
                                return (
                                    <span
                                        class="blue-font"
                                        onClick={() => {
                                            this.onDelete(params);
                                        }}
                                    >
                                        删除
                                    </span>
                                );
                            } else {
                                return (
                                    <span
                                        class="blue-font"
                                        onClick={() => {
                                            this.delConfig(params);
                                        }}
                                    >
                                        删除
                                    </span>
                                );
                            }
                        }
                    }
                ]
            },
            obj: {},
            level_id: '',
            gameList: [],
            queryList: [],
            active_type: ''
        };
    },
    watch: {
        data: {
            deep: true,
            handler(newVal, oldVal) {
                this.$nextTick(() => {
                    this.data = newVal;
                    if (this.data.length&&this.data[this.index].active_type) {
                        let { active_type, id } = { ...this.data[this.index] };
                        this.level_id = id;
                        this.active_type = active_type;
                        let params = { siteId: this.$root.nowSite.id, active_type: active_type, level_id: id };
                        this.getList(params);
                        this.getGameList();
                    } else {
                        this.table.data = [];
                        this.level_id = null;
                    }
                });
            }
        }
    },

    mounted() {},
    methods: {
        getList(data) {
            let newArr = [];
            this.$root.startTableLoading();
            getActiveChessTaskConfigList(data)
                .then(res => {
                    if (res != undefined || res.code == 200 || res.code != 400) {
                        let arr = [];
                        arr = JSON.parse(JSON.stringify(res.data));
                        arr.forEach(key => {
                            for (let t in key) {
                                if (t == 'condition') {
                                    newArr.push(JSON.parse(key[t]));
                                }
                            }
                        });
                        if (newArr.length) {
                            this.table.data = newArr;
                        } else {
                            this.table.data = [];
                        }
                        this.$root.endTableLoading();
                    }
                })
                .catch(error => this.$root.endTableLoading());
        },
        addConfig() {
            this.obj = {
                game_name: '',
                bet: 0,
                gift_money: 0
            };
            this.table.data.push(this.obj);
        },
        sendMsg() {
            this.$emit('sendMsg', this.table.data);
        },
        onDelete(params) {
            let text = `您确定删除此条记录吗？`;
            let msg = `删除成功`;
            const data = {
                siteId: this.$root.nowSite.id,
                id: params.row.id,
                status: 'delete'
            };
            this.$Tip.confirm({
                content: text,
                onOk: () => {
                    this.$root.startTableLoading();
                    delActiveChessTaskConfigDel(data, true)
                        .then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success({ content: msg });
                                this.table.data.splice(params.index, 1);
                                this.$root.endTableLoading();
                            }
                        })
                        .catch(error => this.$root.endTableLoading());
                }
            });
        },
        //删除活动配置
        delConfig(params) {
            //取消
            this.table.data.splice(params.index, 1);
        },
        //每日游戏游戏下拉
        getGameList() {
            let data = { siteId: this.$root.nowSite.id };
            getActiveChessTaskGameClassShow(data).then(res => {
                if (res != undefined && res.code == 200) {
                    this.gameList = res.data;
                }
            });
        },
        //每日游戏游戏查询
        gameQuery(params) {
            getActiveChessTaskGameQuery(params).then(res => {
                if (res != undefined && res.code == 200) {
                    this.queryList = res.data;
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../../styles/button.less';
.footer {
    border: 1px solid #dcdcdc;
    border-top: 0;
    line-height: 48px;
}
</style>