<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <div class="v2-button mb5">
                    <Button
                        class="cardNutton"
                        @click="addBankCard"
                        v-if="showComponent == 'cardManagement' && (adminType == 'super' || authInPage.indexOf('companyBankCardCreate') != -1)"
                        >添加入款卡</Button
                    >
                    <Button class="cardNutton" @click="addBankCard" v-if="showComponent != 'cardManagement' && (adminType == 'super' || authInPage.indexOf('QRCodeCreate') != -1)"
                        >添加入款卡</Button
                    >
                </div>
                <!--  -->
               	<!-- <FormItem label="分组" v-if="selectList.length>1" >
					
					<Select v-model="searchKey.group_id"  placeholder="全部"  class="w86x"  @on-change="groupChange"  >
						<Option v-for="(t,i) in selectList"   :value="t.group_id" :key="i">{{t.group_name}}</Option>
					</Select>
				</FormItem> -->
                  <FormItem label="分组"  prop="group_id" v-show="this.$root.groupLenth()>1" >
						<GroupSelect
						class="aaa"
						placeholder="全部"
						ref="GroupSelect"
						clearable
						width="86"
						:levelType="'group'"
          
						@on-level-change="groupChange"
					/>
				</FormItem>
                <FormItem label="等级">
                    <LevelSelect placeholder="全部" ref="LevelSelect" clearable width="86" :levelType="'member'" @on-level-change="levelChange" />
                </FormItem>
                <FormItem label="状态">
                    <Select clearable class="s-86" v-model="searchKey.status" placeholder="全部">
                        <Option value="yes">正常</Option>
                        <Option value="no">停用</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" class="search" style="color:#fff" @click.prevent="searchSubmit" :loading="$root.tableLoading">查询</Button>
                </FormItem>
            </Form>
        </div>
        <!-- 样式更改统一 -->
        <div class="v2-search bb">
            <ButtonGroup class="repay-button1">
                <Button
                    :class="type == item.className ? 'active' : ''"
                    v-for="(item, i) in classNameList"
                    :value="item.id"
                    :key="i"
                    @click="changeType(item.className, item.id, item.classType)"
                >
                    <span class="ml20 mr20">{{ item.className }}</span>
                </Button>
            </ButtonGroup>
        </div>
        <div class="v2-table">
            <component :is="showComponent" ref="component"  :type="type" :searchSubmit="searchSubmit" :classNameList="alipyList" :id="showId"></component>
        </div>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import cardManagement from './components/cardManagement';
import sweepCode from './components/sweepCode';
import transferCard from './components/transferCard';
import transferAccount from './components/transferAccount';
import virtualCurrency from './components/virtualCurrency';
import { paymentClassName } from '@/api/finance';
import { getUserType } from '@/libs/util';
import LevelSelect from '@/components/level-select';
// import {getMemberGroupList } from "@/api/member";
import GroupSelect from "@/components/group-select";
export default {
    name: 'systemInPaymentCard',
    components: {
        LevelSelect,
        Tables,
        cardManagement,
        sweepCode,
        transferCard,
        transferAccount,
        virtualCurrency,
        GroupSelect
    },
    data() {
        return {
            selectList:[],
            bankTypeList: [],
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            showComponent: 'cardManagement',
            showId: '',
            className: '',
            alipyList: [],
            classNameList: [],
            type: '银行卡管理',
            searchKey: {
                group_id:'',
            }
        };
    },
    created() {
        // this.getGroupList();
        paymentClassName({ classType: 'virtual' }).then(res => {
            if (res != undefined && res.code == 200) {
                this.classNameList = res.data;
                this.alipyList = res.data;
                paymentClassName({ classType: 'qr_code' }).then(res => {
                    this.bankTypeList = res.data;
                    let newbank = {};
                    this.bankTypeList.forEach(t => {
                        this.classNameList.push(t);
                    });
                });
                paymentClassName({ classType: 'transfer_bank' }).then(res => {
                    this.bankTypeList = res.data;
                    this.bankTypeList.forEach(t => {
                        this.classNameList.push(t);
                    });
                });
                paymentClassName({ classType: 'transfer_account' }).then(res => {
                    this.bankTypeList = res.data;
                    let newbank = {};
                    newbank['id'] = '0';
                    newbank['className'] = '银行卡管理';
                    this.classNameList.unshift(newbank);
                    this.bankTypeList.forEach(t => {
                        this.classNameList.push(t);
                    });
                });
                
            }
            const { className, classId, inCard } = this.$route.params;
            this.type = className;
            if (this.type == undefined) {
                this.type = '银行卡管理';
            } else {
                this.type = className;
            }
            if (classId) {
                this.showId = classId;
            }
        });
    },
    watch: {
        '$root.nowSite': {
            handler(val, oldVal) {
                this.$nextTick(() => {
                    this.$refs.LevelSelect.init(val.id);
                    this.$refs.GroupSelect.init(val.id);
                });
            },
            deep: true,
            immediate: true
        },
        '$route.params': {
            handler(val, oldVal) {
                this.$nextTick(() => {
                    if (val.inCard == undefined || val == null) return;
                    this.backChangeType(val);
                });
            },
            deep: true,
            immediate: true
        }
    },
    methods: {

    //     	      getGroupList(){
    //   getMemberGroupList({siteId:this.$root.nowSite.id}).then(res=>{
    //     if(res!=undefined&&res.code==200){
    //        this.selectList=res.data;
          
    //     }
    //   })
    // },
        groupChange(res){
                this.searchKey.group_id = res.group_id;
		},
        levelChange(res) {
            this.searchKey.levelLabel = res.levelLabel;
        },
        addBankCard() {
            //新增入款卡
            this.$router.push({
                name: 'bankCardEdit',
                params: { page: 'create', classId: this.showId }
            });
        },
        changeType(name, id, classType) {
            //根据对应的导航展示对应的表格
            this.showId = id;
            this.type = name;
            if (classType == 'qr_code') {
                this.showComponent = 'sweepCode';
            } else if (classType == 'transfer_bank') {
                this.showComponent = 'transferCard';
            } else if(classType == 'transfer_account'){
                this.showComponent = 'transferAccount';
            }else if(classType == 'virtual'){
                this.showComponent = 'virtualCurrency';
            }else {
                this.showComponent = 'cardManagement';
            }
        },
        backChangeType(data) {
            //添加银行卡跳转回来显示对应的表格
            this.showId = data.classId;
            this.type = data.className;
            if (data.inCard == 'card') {
                this.showComponent = 'cardManagement';
            } else if (data.inCard == 'transfer_bank') {
                this.showComponent = 'transferCard';
            } else if(data.inCard == 'transfer_account'){
                this.showComponent = 'transferAccount';
            }else if(data.inCard == 'virtual'){
                this.showComponent = 'virtualCurrency';
            }else {
                this.showComponent = 'sweepCode';
            }
        },
        //查询
        searchSubmit() {
            let params = { ...this.searchKey };
            for (let key in params) {
                if (!params[key]) delete params[key];
            }
            // 对应组件的页码
            this.$refs.component.$refs.table.setPage();
            params.siteId = this.$root.nowSite.id;
            params.classId = this.showId;
            console.log(params)
            if (this.showComponent == 'cardManagement') {
                delete params.classId;
                this.$refs.component.getQuery(params);
            }
            if (this.showComponent == 'sweepCode') {
                this.$refs.component.getQuery(params);
            }
            if (this.showComponent == 'transferCard') {
                this.$refs.component.getQuery(params );
            }
            if (this.showComponent == 'transferAccount') {
                this.$refs.component.getQuery(params );
            }
            if (this.showComponent == 'virtualCurrency') {
                this.$refs.component.getQuery(params );
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
@import '../../styles/class.less';
.status-button {
    border-color: #e4e4e4;
    background-color: #f6f6f8;
}
.minw {
    min-width: 1100px;
}
/deep/.ivu-btn {
    color: #444;
}
/deep/.repay-button1 {
    height: 37px;
}
</style>


