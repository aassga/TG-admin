<template>
    <div>
        <Modals
            ref="showModals"
            title="添加游戏"
            :width="activeValue == 'returnJackpot' ? '500' : '1000'"
            :height="activeValue == 'returnJackpot' ? '200' : '500'"
            @closeModal="closeModeal"
        >
            <div slot="content" class="modal-overflow">
                <div>
                    <p class="f6Color">
                        <Icons type="danchuangtishi" color="#666666" class="ml15" :size="22"></Icons>
                        <span class="ml10 f-color ib ft14" style="line-height:25px">添加到列表中的游戏不能参与{{activeText}}活动打码</span>
                    </p>
                    <!-- 返水列表 -->
                    <div v-if="activeValue == 'returnJackpot'" class="mt20">
                        <Form :label-width="100">
                            <FormItem label="添加游戏">
                                <Select class="w310x" v-model="gameValue" multiple :max-tag-count="2" @on-change="onSelectChange" transfer>
                                    <!-- <Option @click.native="getTypeGame(t)" v-for="(t, i) in selectList" :key="i" :value="t.id">{{ t.name }}</Option> -->
                                    <Option v-for="(t, i) in selectList" :key="i" :value="t.id">{{ t.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" class="ma ivu submit ma ml20" style="margin-top:20px" @click.prevent="save">确认保存</Button>
                            </FormItem>
                        </Form>
                    </div>
                    <!-- 任务中心，返佣列表 -->
                    <div v-else>
                        <Form class="ft18 ml15 mt10" inline>
                            <FormItem>
                                <span class="ft18">游戏类型</span>
                            </FormItem>
                            <FormItem class="cc-color">可选择单个游戏或整个游戏分类进行添加</FormItem>
                            <FormItem label="游戏名称" class="fr gameName">
                                <AutoComplete
                                    placeholder="请输入关键字"
                                    v-model="formKey.name"
                                    :data="searchList"
                                    class="w140x"
                                    @on-select="onSearch"
                                    @on-change="seachChange"
                                    :filter-method="filterMethod"
                                ></AutoComplete>
                                <!-- <Input placeholder="请输入关键字" v-model="formKey.name" @on-change="onSearch(formKey.name)" class="w140x" /> -->
                                <span class="search-x" @click.prevent="clear" v-show="formKey.name != ''">X</span>
                            </FormItem>
                        </Form>
                        <Nav class="ib ml20">
                            <Tag @click.native="getType(t)" :class="type == t.id ? 'activeTag' : ''" v-for="(t, i) in newNav" :key="i" class="pl20 pr20 ib ft14 w160x cs tag">{{
                                t.name
                            }}</Tag>
                            <div v-for="(t, i) in this.dataList" :key="i">
                                <div v-if="type == m.id" v-for="(m, n) in t" :key="n" class="a">
                                    <Tabs ref="tabs" type="card" :animated="false" @on-click="getSecondId" class="mt20">
                                        <TabPane v-for="(t, i) in m.list" :key="i" :label="t.name" :name="t.id + ''">
                                            <div class="game-list">
                                                <checkbox
                                                    v-model="t.checked"
                                                    :indeterminate="t.indeterminate"
                                                    @on-change="val => checkAll(t, val)"
                                                    class="check-box"
                                                    style="margin-right:8px;"
                                                    >{{ secondId == t.id && t.list ? '全部游戏' : '全部分类' }}</checkbox
                                                >
                                                <checkbox
                                                    v-if="secondId == t.id"
                                                    v-for="(f, n) in t.list"
                                                    class="check-box"
                                                    :key="n"
                                                    v-model="f.checked"
                                                    @on-change="val => checkOne(t, f, val)"
                                                    >{{ f.name }}</checkbox
                                                >
                                            </div>
                                        </TabPane>
                                    </Tabs>
                                </div>
                            </div>
                            <div class="mb50">
                                <Button :disabled="disabled" type="primary" class="ma mt30 ivu submit mb20 mt50" @click.stop="save" style="margin-top:30px;margin-left:350px"
                                    >确认保存</Button
                                >
                            </div>
                        </Nav>
                    </div>
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import Modals from '_c/modals';
import Icons from '_c/icons';
import { bannedCountBetAmountGameList, bannedCountBetAmountGameSelectClass, bannedCountBetAmountGameAdd } from '@/api/activity';
import { rmRepeatItem } from '@/libs/util';
export default {
    name: 'addGame',
    props: {
        activeValue: '',
        activeName:'',
        searchKey: ''
    },
    components: {
        Modals,
        Icons
    },
    data() {
        return {
            gameValue: '',
            newList: [],
            searchList: [],
            len: 0,
            times: 0,
            isShow: false,
            checkboxLength: '',
            selesctName: {},
            typeId: '',
            selectList: [],
            disabled: true,
            arrId: [],
            showBtn: false,
            newId: [],
            newNav: [],
            dataList: [],
            val: false,
            type: '10000',
            secondId: '10000',
            gameId: '',
            formKey: {
                name: ''
            },
            activeText:'充值送彩金'
        };
    },
    methods: {
        onSelectChange(val) {
            this.gameId = val.join(',');
        },
        filterMethod(value, option) {
            return option.indexOf(value) !== -1;
        },

        clear() {
            this.formKey.name = '';
            const data = {
                siteId: this.$root.nowSite.id,
                type: this.activeValue
            };
            this.getNavList(data);
        },
        closeModeal() {
            this.formKey.name = '';
            this.gameValue = '';
        },
        seachChange(val) {
            if (val == '') {
                const data = {
                    siteId: this.$root.nowSite.id,
                    type: this.activeValue
                };
                this.getNavList(data);
            } else {
                if (val.length >= 2) {
                    const data = {
                        siteId: this.$root.nowSite.id,
                        type: this.activeValue,
                        name: val
                    };
                    this.getNavList(data);
                }
            }
        },
        onSearch(val) {
            if (val.length >= 2) {
                const data = {
                    siteId: this.$root.nowSite.id,
                    type: this.activeValue,
                    name: val
                };
                this.getNavList(data);
            }
        },

        // getTypeGame(t) {
        //     const { id, name } = t;
        //     this.gameId = id;
        // },
        save() {
            if (this.activeValue == 'returnJackpot') {
                const data = {
                    siteId: this.$root.nowSite.id,
                    type: this.activeValue,
                    id: this.gameId
                };
                bannedCountBetAmountGameAdd(data, true).then(res => {
                    if (res != undefined && res.code == 200) {
                        this.$refs.showModals.hide();
                        this.$Message.success({ content: '添加游戏成功' });
                        let data = {
                            siteId: this.$root.nowSite.id,
                            type: this.activeValue
                        };
                
                        this.$parent.getData({ params: data });
                        this.formKey.name = '';
                        this.gameValue = '';
                    }
                    if (res == undefined) {
                        this.newId = [];
                    }
                });
            } else {
                Array(this.dataList).forEach(t => {
                    for (let key in t) {
                        t[key].forEach(m => {
                            m.list.forEach(t => {
                                if (t.checked == true) {
                                    this.newId = t.id;
                                }
                                if (t.checked == false) {
                                    if (Array.isArray(t.list)) {
                                        t.list &&
                                            t.list.forEach(m => {
                                                if (m.checked == true) {
                                                    this.newId.push(m.id);
                                                }
                                            });
                                    } else {
                                        Array(t.list) &&
                                            Array(t.list).forEach(m => {
                                                for (let key in m) {
                                                    if (m[key].checked == true) {
                                                        this.newId.push(m[key].id);
                                                    }
                                                }
                                            });
                                    }
                                }
                            });
                        });
                    }
                });
                const data = {
                    type: this.activeValue,
                    siteId: this.$root.nowSite.id,
                    id: String(this.newId) || this.secondId
                };
                bannedCountBetAmountGameAdd(data, true).then(res => {
                    if (res != undefined && res.code == 200) {
                        this.$refs.showModals.hide();
                        this.$Message.success({ content: '添加游戏成功' });
                        this.newId = [];
                        let data = {
                            siteId: this.$root.nowSite.id,
                            type: this.activeValue
                        };
                        this.$parent.getData({ params: data });
                        this.formKey.name = '';
                    }
                    if (res == undefined) {
                        this.newId = [];
                    }
                });
            }
        },
        getData(data) {
            bannedCountBetAmountGameList(data);
        },
        checkAll(parent, val) {
      
            if (val == false) this.disabled = true;
            if (val == true) this.disabled = false;
            this.$set(parent, 'indeterminate', false);
            this.$set(parent, 'checked', val);
            if (parent.name != '全部分类') {
                if (Array.isArray(parent.list)) {
                    parent.list.forEach(item => {
                        this.$set(item, 'checked', val);
                    });
                } else {
                    Array(parent.list).forEach(item => {
                        this.$set(item, 'checked', val);
                    });
                }
            }
        },
        checkOne(parent, le, val) {
            let len = parent.list.length;
            if (val) {
                this.times++;
            } else {
                this.times--;
            }
            if (this.times > 0) {
                this.disabled = false;
            }

            if (this.times == len * -1) this.times = 0;
            if (this.times == 0) this.disabled = true;

            this.$set(le, 'checked', val);
            let count = 0;
            if (Array.isArray(parent.list)) {
                parent.list.forEach(item => {
                    if (item.checked) count++;
                });
            } else {
                Array(parent.list).forEach(item => {
                    if (item.checked) count++;
                });
            }

            if (count) {
                if (count <= parent.list.length) {
                    this.$set(parent, 'checked', false);
                    this.$set(parent, 'indeterminate', true);
                } else {
                    this.$set(parent, 'checked', true);
                    this.$set(parent, 'indeterminate', false);
                }
            } else {
                this.$set(parent, 'checked', false);
                this.$set(parent, 'indeterminate', false);
            }
        },
        changeAll(val) {
            this.arrId = [];
            this.newNav.forEach(t => {
                this.arrId.push(t.id);
            });
            val = val == true ? false : true;
        },
        getSecondId(i) {
            let t = {};
            for (let key in this.dataList) {
                let newArr = this.dataList[key][0].list;
                newArr.forEach(item => {
                    if (i == item.id + '') {
                        t.id = item.id;
                        t.name = item.name;
                        t.list = item.list;
                    }
                });
            }

            const { id, name } = t;
            this.secondId = id;
            Array(this.dataList).forEach(t => {
                for (let key in t) {
                    t[key].forEach(m => {
                        m.list.forEach(t => {
                            if (t.id == this.secondId) {
                                if (t.list != undefined) {
                                    this.checkboxLength = t.list.length;
                                } else {
                                    return false;
                                }
                            }
                        });
                    });
                }
            });
            Array(this.dataList).forEach(t => {
                for (let key in t) {
                    t[key].forEach(m => {
                        m.list.forEach(t => {
                            if (t.checked == true) {
                                t.checked = false;
                            }
                            if (t.checked == false) {
                                if (Array.isArray(t.list)) {
                                    t.list &&
                                        t.list.forEach(m => {
                                            if (m.checked == true) {
                                                m.checked = false;
                                            }
                                        });
                                } else {
                                    Array(t.list) &&
                                        Array(t.list).forEach(m => {
                                            for (let k in m) {
                                                if (m[k].checked == true) {
                                                    m[k].checked = false;
                                                }
                                            }
                                        });
                                }
                            }
                        });
                    });
                }
            });

            if (String(this.secondId).includes(',')) {
                this.newId = this.secondId;
            } else {
                this.newId = [];
            }
        },
        getType(t) {
            this.isShow = false;
            const { id, name } = t;
            this.type = id;
            this.secondId = this.type;
        },
        showModals() {
            this.$refs.showModals.show();
        },
        getNavList(data) {
            this.selesctName = data;
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            this.$refs.showModals.spinShow();
            bannedCountBetAmountGameSelectClass(data)
                .then(res => {
                    if (res != undefined && res.code == 200) {
                        const { data } = res;
                        if (this.selesctName.type == 'returnJackpot') {
                            this.selectList = data;
                        } else {
                            this.dataList = data;
                        }
                        this.newNav = [];

                        Array(this.dataList).forEach(t => {
                            for (let key in t) {
                                t[key].forEach(m => {
                                    this.newNav.push(m);
                                    m.list.unshift({
                                        id: m.id,
                                        name: '全部分类'
                                    });
                                });
                            }
                        });

                        //获取全部游戏
                        Array(this.dataList).forEach(t => {
                            for (let key in t) {
                                t[key].forEach(m => {
                                    m.list.forEach(f => {
                                        if (f.name != '全部分类') {
                                            f.list.forEach(k => {
                                       
                                                this.newList.push(k.name);
                                            });
                                        }
                                    });
                                });
                                this.searchList = rmRepeatItem(this.newList);
                            }
                        });

                        this.$refs.showModals.spinHide();
                    }
                })
                .catch(error => {
                    this.$refs.showModals.spinHide();
                });
        }
    },
    watch: {
        activeValue: {
            handler(val, oldVal) {
                this.activeValue = val;
            },
            deep: true
        },
        activeName: {
            handler(val, oldVal) {
                this.activeName = val;
                if(this.activeName == '任务中心'){
                    this.activeText = '充值送彩金';
                }else if(this.activeName == '返佣列表' || this.activeName == '返水列表') {
                    this.activeText =this.activeName.substring(0,2);
                }else{
                    this.activeText = this.activeName;
                } 
            },
            deep: true
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
.gameName {
    margin-right: 20px;
    /deep/.ivu-form-item-content {
        float: right;
    }
    position: relative;
}

.active {
    color: #eaeaea !important;
    background-color: #2d8cf0;
}
/deep/.ivu-form .ivu-form-item-label {
    font-size: 1rem;
}
.search-x {
    display: inline-block;
    width: 18px;
    height: 18px;
    line-height: 18px;
    color: #dcdcdc;
    text-align: center;
    position: absolute;
    top: 9px;
    right: 8px;
    cursor: pointer;
}
.game-list {
    width: 100%;
    height: 200px;
    overflow-y: auto;
    border: 1px solid #dcdcdc;
    background: #f6f6f8;
    padding: 10px 15px;
}
.check-box {
    width: 109px;
    height: 36px;
    box-sizing: border-box;
    line-height: 36px;
    border: solid 1px #e4e4e4;
    border-radius: 5px;
    background: #ffffff;
    margin: 0 10px 10px 10px;
    padding: 0 5px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/deep/.ivu-tabs {
    width: 960px;
}
/deep/.ivu-tabs-bar {
    border: 0;
}
/deep/.ivu-tabs-nav-scroll {
    width: 900px;
    margin-left: 17px;
}
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    width: 120px;
    margin-right: 20px;
    border-radius: 4px;
    border: 1px solid #dcdcdc;
    text-align: center;
}
/deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    background: #2d8cf0;
    color: #fff;
}
/deep/.ivu-form .ivu-form-item {
    margin-bottom: 10px;
}
/deep/.ivu-select-dropdown-list {
    width: 140px;
    height: 250px;
}
/deep/.ivu-select-dropdown-list li {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/deep/.ivu-select-multiple .ivu-tag {
    max-width: 45%;
}
</style>