<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <div class="v2-button mb15" style="height:38px">
                    <Button @click="addMessage()" v-if="adminType == 'super' || authInPage.indexOf('popupsIns') != -1">
                        <Icons type="xinzeng" size="14" class="mr5" />新增公告
                    </Button>
                    <Button @click="addCouse()" v-if="adminType == 'super' || authInPage.indexOf('lanternIns') != -1">
                        <Icons type="xinzeng" size="14" class="mr5" />新增走马灯
                    </Button>
                </div>
                <FormItem label="状态">
                    <Select class="w110x" v-model="searchKey.status" clearable placeholder="全部">
                        <Option v-for="(item, index) in typeList" :value="item.value" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="标题">
                    <Input class="w135x" placeholder="关键字查询" v-model="searchKey.title" />
                </FormItem>
                <FormItem label="操作人">
                    <Input class="w135x" placeholder="请输入" @keyup.enter.native="searchSubmit" v-model="searchKey.who" />
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" :loading="$root.tableLoading" @click.prevent="searchSubmit">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="v2-search bb mb20">
            <ButtonGroup class="repay-button" style="margin-bottom:.3px !important">
                <Button
                    class="fontColor"
                    :class="showComponent == 'noticePop' ? 'ivu-btn cs active' : 'ivu-btn cs'"
                    @click="Pop('noticePop')"
                    v-if="adminType == 'super' || authInPage.indexOf('popupsList') != -1"
                >
                    <span>公告弹窗</span>
                </Button>
                <Button
                    class="fontColor"
                    :class="showComponent == 'couse' ? 'ivu-btn cs active' : 'ivu-btn cs'"
                    @click="Pop('couse')"
                    v-if="adminType == 'super' || authInPage.indexOf('lanternList') != -1"
                >
                    <span>走马灯</span>
                </Button>
            </ButtonGroup>
        </div>
        <div class="tab">
            <component :is="showComponent" ref="component"></component>
        </div>
    </div>
</template>
<script>
import noticePop from './components/noticePop.vue';
import couse from './components/couse.vue';
import Icons from '@/components/icons';
import { getUserType } from '@/libs/util';
export default {
    name: 'notice',
    components: {
        noticePop,
        couse,
        Icons
    },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            typeList: [
                // { value: "all", name: "请选择" },
                { value: 'yes', name: '正常' },
                { value: 'no', name: '停用' }
            ],
            showComponent: 'noticePop',
            searchKey: {
                status: "",
                title:'',
                who:'',
            }
        };
    },
    created() {
        if (this.$route.params.page == 'success') {
            this.showComponent = 'couse';
        }
    },
    methods: {
        searchSubmit() {
            let params = { ...this.searchKey };
            params.siteId = this.$root.nowSite.id;
            params.type = 'popups';
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            if (this.showComponent == 'noticePop') {
                this.$refs.component.getData({ params });
            } else {
                params.type = 'lantern';
                this.$refs.component.getcouseData({ params });
            }
        },
        Pop(val) {
            this.showComponent = val;
        },
        //新增信息
        addMessage() {
            this.$router.push({
                name: 'noticeDetial',
                params: { page: 'create' }
            });
        },
        //新增走马灯
        addCouse() {
            this.$router.push({
                name: 'couseDetial',
                params: { page: 'add' }
            });
        }
    }
};
</script>
<style lang="less" scoped >
@import '../../../styles/button.less';
</style>
