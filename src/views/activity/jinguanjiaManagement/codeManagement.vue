<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline class="pb10">
                <FormItem label="金管家等级">
                    <Select v-model="searchKey.level" class="s-86" clearable placeholder="全部">
                        <Option v-for="(item, i) in levelList" :key="'level' + i" :value="item.value">{{ item.name }}级</Option>
                    </Select>
                </FormItem>
                <FormItem label="锁定状态">
                    <Select v-model="searchKey.level_status" class="s-86" placeholder="全部" clearable>
                        <Option value="1">未锁定</Option>
                        <Option value="0">已锁定</Option>
                    </Select>
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
                    <Button type="primary" class="search" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
                <FormItem v-show="showBtn">
                    <Button
                        class="bb-color blue-bd w80x "
                        @click.prevent="
                            () => {
                                showBtn = !showBtn;
                            }
                        "
                        >编辑</Button
                    >
                </FormItem>
                <div class="ib" v-show="!showBtn">
                    <FormItem>
                        <Button class="w80x ml20 " @click.prevent="cancel">取消</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" class="blue-bd w80x " @click.prevent="statusSave">保存</Button>
                    </FormItem>
                </div>
            </Form>
        </div>
        <div class="v2-search bb">
            <ButtonGroup class="repay-button " style="margin-bottom:.3px !important">
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'shixun';
                        }
                    "
                    :class="currentBtn == 'shixun' ? 'active' : ''"
                    >视讯金管家</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'qipai';
                        }
                    "
                    :class="currentBtn == 'qipai' ? 'active' : ''"
                    >棋牌金管家</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'dianzi';
                        }
                    "
                    :class="currentBtn == 'dianzi' ? 'active' : ''"
                    >电子金管家</Button
                >
                <Button
                    class="fontColor"
                    @click="
                        () => {
                            currentBtn = 'caipiao';
                        }
                    "
                    :class="currentBtn == 'caipiao' ? 'active' : ''"
                    >彩票金管家</Button
                >
            </ButtonGroup>
        </div>
        <LiveCode class="mt20" ref="liveCode" @sendNewData="getLiveData" v-show="currentBtn == 'shixun'" :showBtn="showBtn" :newSearchKey="newSearchKey"></LiveCode>
        <OtherCode
            class="mt20"
            ref="otherCode"
            @sendNewData="getOtherData"
            v-show="currentBtn != 'shixun'"
            :type="currentBtn"
            :showBtn="showBtn"
            :newSearchKey="newSearchKey"
        ></OtherCode>
    </div>
</template>
<script>
import LiveCode from '../components/live-code';
import OtherCode from '../components/other-code';
import { updateJinguanjiaLevel } from '@/api/activity';
import Icons from '_c/icons';
export default {
    name: 'codeManagement',
    components: {
        LiveCode,
        Icons,
        OtherCode
    },
    data() {
        return {
            levelList: [], //等级列表
            newLiveData: [], //视讯改变状态之后的数据
            newOtherData: [], //其他平台改变之后的数据
            currentBtn: 'shixun', //默认加载视讯页面
            searchKey: {
                active_type: '',
                userName: '',
                level: ''
            },
            showBtn: true, //搜索栏按钮的编辑按钮
            newSearchKey: '' //传参的值
        };
    },
    //监听currentBtn的值，点击不同分类，展示的不同块
    watch: {
        currentBtn: {
            handler(val, oldVal) {
                if (this.currentBtn == 'shixun') {
                    let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
                    for (let key in params) {
                        if (!params[key]) delete params[key];
                    }
                    params.active_type = 'shixun';
                    this.$refs.liveCode.getData({ params });
                } else {
                    let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
                    for (let key in params) {
                        if (!params[key]) delete params[key];
                    }
                    params.active_type = this.currentBtn;
                    this.$refs.otherCode.getData({ params });
                }
            }
        }
    },
    created() {
        this.$nextTick(() => {
            for (let i = 0; i < 51; i++) {
                this.levelList.push({ name: i, value: i });
            }
        });
    },
    mounted() {
        // 首次进入页面默认查询

        let data = { siteId: this.$root.nowSite.id, active_type: 'shixun' };
        this.$refs.liveCode.getData({ params: data });
    },
    methods: {
        searchSubmit() {
            this.newSearchKey = this.searchKey;
            if (this.currentBtn == 'shixun') {
                let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
                for (let key in params) {
                    if (!params[key]) delete params[key];
                }
                if (params.userName) params.userName = this.$root.trimAll(params.userName);
                if (params.userName && params.userName.length < 5) {
                    this.$Tip.success({ content: '会员账号小于5个字符！' });
                    return false;
                }
                params.active_type = 'shixun';
                this.$refs.liveCode.getData({ params });
            } else {
                let params = { ...this.searchKey, siteId: this.$root.nowSite.id };
                for (let key in params) {
                    if (!params[key]) delete params[key];
                }
                if (params.userName) params.userName = this.$root.trimAll(params.userName);
                if (params.userName && params.userName.length < 5) {
                    this.$Tip.success({ content: '会员账号小于5个字符！' });
                    return false;
                }
                params.active_type = this.currentBtn;
                this.$refs.otherCode.getData({ params });
            }
        },
        // 保存编辑结果
        statusSave() {
            this.showBtn = !this.showBtn;
            if (this.currentBtn == 'shixun') {
                //等于视讯的情况
                this.$refs.liveCode.setNewData(this.newLiveData);

                let arr = [];
                this.newLiveData.forEach(el => {
                    let { id, bet_money, level_money, every_week_reward, every_month_reward, jiebei_amount, level_status } = el;
                    let obj = {
                        id,
                        bet_money,
                        level_money,
                        every_week_reward,
                        every_month_reward,
                        jiebei_amount,
                        level_status
                    };
                    arr.push(obj);
                });
                this.$refs.otherCode.setNewData(this.newOtherData);
                const data = {
                    siteId: this.$root.nowSite.id,
                    updateData: JSON.stringify(arr),
                    active_type: this.currentBtn
                };
                updateJinguanjiaLevel(data, true).then(res => {
                    if (res.data.code == undefined) {
                        this.$Message.success({ content: '编辑成功' });
                    }

                    if (res.data.code == 400) {
                        this.$Message.success({ content: '编辑失败' });
                    }
                    this.$refs.liveCode.getData({ params: data });
                });
            } else {
                //其他三类的情况
                let arr = [];
                this.newOtherData.forEach(el => {
                    //解构每一项的键和值，
                    let { id, bet_money, level_money, every_week_reward, every_month_reward, jiebei_amount, level_status } = el;
                    //把需要改变的值组合成一个新的对象
                    let obj = {
                        id,
                        bet_money,
                        level_money,
                        every_week_reward,
                        every_month_reward,
                        jiebei_amount,
                        level_status
                    };
                    //再把对象组合成一个新的数组
                    arr.push(obj);
                });
                this.$refs.otherCode.setNewData(this.newOtherData);
                const data = {
                    siteId: this.$root.nowSite.id,
                    updateData: JSON.stringify(arr),
                    active_type: this.currentBtn
                };
                updateJinguanjiaLevel(data, true).then(res => {
                    if (res.data.code == undefined) {
                        this.$Message.success({ content: '编辑成功' });
                    }

                    if (res.data.code == 400) {
                        this.$Message.success({ content: '编辑失败' });
                    }
                    this.$refs.otherCode.getData({ params: data });
                });
            }
        },
        // //取消编辑
        cancel() {
            const data = {
                siteId: this.$root.nowSite.id,
                active_type: this.currentBtn
            };
            this.showBtn = !this.showBtn;
            if (this.currentBtn == 'shixun') {
                this.$refs.liveCode.getData({ params: data });
            } else {
                this.$refs.otherCode.getData({ params: data });
            }
        },
        getLiveData(val) {
            this.newLiveData = val;
        },
        getOtherData(data) {
            this.newOtherData = data;
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
@import '../../../styles/class.less';
/deep/.v2-search {
    .blue-bd {
        background: #2d8cf0;
        color: #fff;
    }
}
</style>



