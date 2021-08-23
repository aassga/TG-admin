<template>
    <div>
        <div class="v2-search">
            <Form ref="searchKey" inline>
                <FormItem>
                    <div class="v2-button">
                        <Button v-if="(adminType == 'super' || authInPage.indexOf('agencyDomainDel') != -1) && !disabledTwo" @click="batchDel">删除选中</Button>
                        <Button
                            v-if="(this.$root.modeName() == 'no' || adminType == 'super' || authInPage.indexOf('agencyDomainSubordinateUpdate') != -1) && !disabled"
                            @click="updateUnder"
                            >修改下级类型</Button
                        >
                        <!-- <Button
              @click="createDomain('single')"
              v-if="(adminType == 'super') || (authInPage.indexOf('agencyDomainAdd') != -1)"
            >添加单个域名</Button>
            <Button
              @click="createDomain('batch')"
              v-if="(adminType == 'super') || (authInPage.indexOf('agencyDomainAddBatch') != -1)"
            >批量添加大股东域名</Button> -->
                        <Button @click="createDomain">添加域名</Button>
                    </div>
                </FormItem>
                <FormItem label="域名分组">
                    <Select class="s-160" v-model="searchKey.group_id" placeholder="全部" clearable >
					    <Option v-for="(t,i) in domainSumList" :key="i" :value="t" >{{t}}</Option>
					</Select>
                </FormItem>
                <FormItem label="开放等级">
                    <Select class="s-160" v-model="searchKey.level_label" placeholder="全部" clearable >
					   <Option v-for="(t,i) in openLevelList" :key="i" :value="t.levelLabel" >{{t.levelAlias}}</Option>
					</Select>
                </FormItem>
                <FormItem label="域名">
                    <Input v-model="searchKey.typestr" placeholder="如xxx.com" class="s-160" clearable />
                </FormItem>
                <FormItem label="推广码">
                    <Input v-model="searchKey.invite_code" placeholder="关键字查询" class="s-160" clearable maxlength="8" />
                </FormItem>
                <FormItem label="代理账号">
                    <Input class="s-160" v-model="searchKey.uname" @keyup.enter.native="submit" placeholder="多个请以,逗号隔开" />
                </FormItem>
                <FormItem>
                    <Button @click="submit" class="search ml5 w80x ivu-btn-primary" :loading="$root.searchBtnLoading">查询</Button>
                </FormItem>
            </Form>
        </div>

        <div class="v2-table">
            <Tables
                ref="tables"
                editable
                :columns="table.columns"
                :loading="$root.tableLoading"
                :value="table.data"
                :total="table.total"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                :page-size-opts="table.pageSizeOpts"
                @on-sort-change="sortChange"
                @on-selection-change="onSelectionChange"
            ></Tables>
        </div>
        <Modals :width="1000" ref="oddsDetails" title="赔率详情">
            <div slot="content" class="odds ml20">
                <ButtonGroup class="status-button">
                    <Button
                        class="fontColor"
                        @click="
                            () => {
                                this.type = 'rebate';
                            }
                        "
                        :class="type == 'rebate' ? 'active' : ''"
                        style="width:120px;height:30px"
                        >彩票返点</Button
                    >
                    <Button
                        class="fontColor"
                        @click="
                            () => {
                                this.type = 'refund';
                            }
                        "
                        :class="type == 'refund' ? 'active' : ''"
                        style="width:120px;height:30px"
                        >返水信息</Button
                    >
                </ButtonGroup>
                <div class="mt20">
                    <Form ref="rebateInfo" style="width:960px;" v-show="type == 'rebate'">
                        <FormItem class="b" v-for="(t, i) in agencyRebate" :key="i">
                            <p class="f6f8-bg ti10">{{ t.name }}</p>
                            <div class="clearfix">
                                <div class="fl w20 p10" v-for="(item, index) in t.list" :key="index">
                                    <span>{{ item.name }}：{{ item.rebate }}%</span>
                                </div>
                            </div>
                        </FormItem>
                    </Form>
                    <Form ref="refundInfo" style="width:960px;" v-show="type == 'refund'">
                        <FormItem class="b" v-for="(t, i) in agencyRefund" :key="i">
                            <p class="f6f8-bg ti10">{{ t.name }}</p>
                            <div class="clearfix">
                                <div class="fl w20 p10" v-for="(item, index) in t.list" :key="index">
                                    <span>{{ item.name }}：{{ item.value }}%</span>
                                </div>
                            </div>
                        </FormItem>
                    </Form>
                </div>
            </div>
        </Modals>
        <Modals ref="updateModal" title="修改下级类型" width="520" @modalVisible="modalVisible">
            <div slot="content">
                <Form :model="updateInfo" :rules="updateRules" style="width: 520px;" ref="updateForm" :label-width="100">
                    <FormItem label="域名" prop="domain">
                        <Select class="w360x" v-model="updateInfo.domain" multiple transfer>
                            <Option v-for="(t, i) in checkedArr" :key="'checked' + i" :value="t.domain">{{ t.domain }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="下级类型" prop="is_agency">
                        <Select placeholde="请选择" class="w360x" v-model="updateInfo.is_agency" transfer>
                            <Option value="1">代理</Option>
                            <Option value="0">会员</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" class="w360x" @click.prevent="saveUpdate">确认保存</Button>
                    </FormItem>
                </Form>
            </div>
        </Modals>
    </div>
</template>
<script>
import Tables from '@/components/tables';
import Modals from '@/components/modals';
import tableMixins from '@/mixins/table';
import { getUserType } from '@/libs/util';
import { agencyDomainList, agencyDomanUpStatus, agencyDomainDel, agencyDomainDetails, agencyDomainSubordinateUpdate } from '@/api/agency';
import { domainGroupList } from "@/api/system";
import { sortInteraction } from '@/libs/util';
import { getMemberLevelData } from "@/api/member"

export default {
    name: 'agencyDomain',
    mixins: [tableMixins],
    components: {
        Tables,
        Modals
    },
    data() {
        return {
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            page: 1, //点击删除数据返回第一页，页码没变
            agencyRebate: [], //点击赔率后对应的代理返水返点数据
            agencyRefund: {},
            disabled: true,
            disabledTwo: true,
            checkedArr: [], //选中的列数据
            updateInfo: {
                domain: [],
                is_agency: ''
            },
            updateRules: {
                domain: [{ required: true, message: '请选择域名', pattern: /.+/ }],
                is_agency: [{ required: true, message: '请选择下级类型', pattern: /.+/ }]
            },
            type: 'rebate',
            domainSumList:[],
            openLevelList:[],
            searchKey: {
                status: 'all',
                coldstatus: 'all',
                isLike: '0',
                type: '1',
                typestr: '',
                invite_code: '',
                group_id:'',
                level_label:'',
                siteId: this.$root.nowSite.id
            },
            table: {
                total: 0,
                title: '代理域名',
                pageSizeOpts: [20, 30, 40, 50],
                data: [],
                columns: [
                    {
                        type: 'selection',
                        width: screen.width > 1600 ? 60 : '',
                        minWidth: screen.width < 1600 ? 35 : '',
                        align: 'center'
                    },
                    {
                        title: '代理账号',
                        key: 'userName',
                        align: 'center',
                        minWidth: 85,
                        tooltip: true
                    },
                    {
                        title: '代理类型',
                        key: 'agency_type',
                        align: 'center',
                        minWidth: 55,
                        render: (h, params) => {
                            return <span>{params.row.agency_type}</span>;
                        }
                    },
                    {
                        title: '下级类型',
                        key: 'is_agency',
                        align: 'center',
                        render: (h, params) => {
                            return <span>{params.row.is_agency == '1' ? '代理' : '会员'}</span>;
                        }
                    },
                    {
                        title: '域名',
                        key: 'domain',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => <span>{this.$root.text(params.row.domain)}</span>
                    },
                    {
                        title: '推广码',
                        key: 'invite_code',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => <span>{this.$root.text(params.row.invite_code)}</span>
                    },
                    {
                        title: '域名描述',
                        key: 'domain_description',
                        align: 'center'
                    },
                    {
                        title: '域名分组',
                        key: 'group_alias',
                        align: 'center',
                        render:(h,params)=>{
                            if(params.row.group_alias == ""){
                                return <span>-</span>
                            }else{
                                return <span>{params.row.group_alias}</span>
                            }
                        }
                    },
                    {
                        title: '开放等级',
                        key: 'levelAlias',
                        align: 'center',
                        render:(h,params)=>{
                            if(params.row.levelAlias == ""){
                                return <span>-</span>
                            }else{
                                return <div>
                                <Tooltip  max-width="210" placement="bottom" transfer>
                                    <span class="ib cs text-overflow-ellipsis">{params.row.levelAlias}</span>
                                    <div slot="content">{params.row.levelAlias}</div>
                                </Tooltip>
                            </div>
                            }
                        }
                    },
                    {
                        title: '是否证书',
                        key: 'domain_certificate',
                        align: 'center',
                        render: (h, params) => {
                            const { domain_certificate } = params.row;
                            let color = domain_certificate == '否' ? '#FF2626' : '';
                            return <span style={{ color }}>{params.row.domain_certificate}</span>;
                        }
                    },
                    {
                        title: '创建日期',
                        key: 'created_at',
                        align: 'center',
                        minWidth: 140,
                        render: (h, params) => <span class="pl10 pr10">{this.$root.newUnixTime(params.row.created_at)}</span>
                    },
                    {
                        title: '操作',
                        align: 'center',
                        minWidth: 120,
                        render: (h, params) => {
                            return (
                                <div>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display:
                                                (this.adminType == 'super' || this.authInPage.indexOf('agencyDomainDetails') != -1) && this.$root.checkCommission()
                                                    ? 'inline-block'
                                                    : 'none'
                                        }}
                                        onClick={() => {
                                            this.checkOdds(params);
                                        }}
                                    >
                                        赔率
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('agencyDomainUpdate') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.edit(params);
                                        }}
                                    >
                                        编辑
                                    </a>
                                    <a
                                        class="ib mr10"
                                        style={{
                                            display: this.adminType == 'super' || this.authInPage.indexOf('agencyDomainDel') != -1 ? 'inline-block' : 'none'
                                        }}
                                        onClick={() => {
                                            this.del(params);
                                        }}
                                    >
                                        删除
                                    </a>
                                </div>
                            );
                        }
                    }
                ]
            }
        };
    },
    watch: {
        checkedArr(val) {
            this.disabled = val.length > 0 && this.$root.modeName() == 'no' ? false : true;
            this.disabledTwo = val.length > 0 ? false : true;
        }
    },
    mounted() {
        let params={
				siteId:this.$root.nowSite.id,
				show_count:'yes',
			}
			this.getGroupList(params);
			let data={
				siteId:this.$root.nowSite.id,
				 purpose: "list"
			}
			this.getOpenLevel(data);
    },
    methods: {
        // 获取开放等级
			getOpenLevel(data){
				getMemberLevelData(data).then(res=>{
					if(res!=undefined && res.code == 200){
						this.openLevelList = res.data;
					}
				})
			},
        //域名分组列表
        getGroupList(params){
				domainGroupList(params).then(res=>{
					  if(res!=undefined&&res.code==200){
						let arr=[];
                      res.data.forEach(t=>{
                         arr.push(t.group_id) 
                      })
                     this.domainSumList=arr;
					  }
				})
			},
        updateUnder() {
            this.$refs.updateForm.resetFields();
            this.checkedArr.forEach(t => {
                this.updateInfo.domain.push(t.domain);
            });
            this.$refs.updateModal.show();
        },
        onSelectionChange(data) {
            this.checkedArr = data;
        },
        modalVisible(flag) {
            if (!flag) {
                this.checkedArr = [];
                this.submit();
            }
        },
        //批量修改下级
        saveUpdate() {
            this.$refs.updateForm.validate(valid => {
                if (valid) {
                    this.$refs.updateModal.spinShow();
                    let { domain, is_agency } = this.updateInfo;
                    let ids = [];
                    this.checkedArr.forEach(t => {
                        if (domain.includes(t.domain)) ids.push(t.id);
                    });
                    let data = {
                        siteId: this.$root.nowSite.id,
                        id: ids.length > 1 ? ids.join(',') : ids[0],
                        is_agency
                    };
                    agencyDomainSubordinateUpdate(data, true)
                        .then(res => {
                            this.$refs.updateModal.spinHide();
                            if (res != undefined && res.code == 200) {
                                this.$Message.success('修改下级类型成功');
                                this.$refs.updateModal.hide();
                                this.submit();
                            }
                        })
                        .catch(error => this.$ref.updateModal.spinHide());
                }
            });
        },
        batchDel() {
            let ids = [];
            this.checkedArr.forEach(t => {
                ids.push(t.id);
            });
            let data = {
                siteId: this.$root.nowSite.id,
                id: ids.join(',')
            };
            this.$Tip.confirm({
                content: '您确定删除选中域名吗？',
                onOk: () => {
                    agencyDomainDel(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            this.$Message.success('删除选中域名成功');
                            this.submit();
                            this.checkedArr = [];
                        }
                    });
                }
            });
        },
        // 查询
        submit() {
            this.$refs.tables.setPage();
            if (this.searchKey.uname) this.searchKey.uname = this.$root.trimAll(this.searchKey.uname);
            if (this.searchKey.typestr) this.searchKey.typestr = this.$root.trimAll(this.searchKey.typestr);
            let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
            for (let key in data) {
                if (!data[key]) delete data[key];
            }
            if (!data.typestr) data.typestr = ''; // 不传typestr会报错
            if (data.uname && !this.$root.validateName(data.uname)) {
                this.$Tip.info({ content: '您所查询的代理账号不正确，请重新输入' });
                return false;
            }
            if (data.invite_code && data.invite_code.length !== 8) {
                this.$Tip.info({ content: '您所查询的推广码不正确，请重新输入' });
                return false;
            }
            this.searchKey = { ...data };
            this.getData({ params: data });
        },
        getData(data) {
            this.$root.startTableLoading(this);
            if(data.params.level_label == '') delete data.params.level_label;
            if(data.params.group_id == '') delete data.params.group_id;
            if(data.params.invite_code == '') delete data.params.invite_code;
            data.params.isLike = Number(data.params.isLike);
            agencyDomainList(data).then(res => {
                const { total, data, run_model } = res.data;
                this.table.total = total;
                this.table.data = data;
                this.table.data.forEach(t => this.$set(t, '_checked', false));
                this.$root.endTableLoading();
            }).catch(error=> this.$root.endTableLoading());
        },
        onPageChange(page) {
            this.page = page;
            let data = { ...this.searchKey, siteId: this.$root.nowSite.id };
            this.getData({
                params: { ...data },
                query: { page }
            });
        },
        onPageSizeChange(pageSize) {
            this.searchKey.limit = pageSize;
            this.getData({ params: this.searchKey });
        },
        // 状态停启用
        statusChange(params) {
            const { status, id, agent_type } = params.row;
            let text = status === 'yes' ? '您确定停用此网址吗' : '您确定启用此网址吗';
            if (agent_type - 1 > 0) {
                this.$Tip.confirm({
                    content: text,
                    onOk: () => {
                        let data = {
                            siteId: this.$root.nowSite.id,
                            id,
                            status: status === 'yes' ? 'no' : 'yes'
                        };
                        agencyDomanUpStatus(data, true).then(res => {
                            if (res != undefined && res.code == 200)
                                if (typeof res.data === 'string') {
                                    this.$Message.config({
                                        top: 150
                                    });
                                    this.$Message.success('操作成功！');
                                    status === 'yes' ? (this.table.data[params.index].status = 'no') : (this.table.data[params.index].status = 'yes');
                                }
                        });
                    }
                });
            }
        },
        //  冻结与解冻
        frostChange(params) {
            const { agent_type, admin_status, id } = params.row;
            let text = admin_status === 1 ? '您确定解冻此网址吗' : '你确定冻结此网址吗';
            if (agent_type - 1 > 0) {
                this.$Tip.confirm({
                    content: text,
                    onOk: () => {
                        let data = {
                            siteId: this.$root.nowSite.id,
                            id,
                            coldstatus: admin_status === 1 ? 0 : 1
                        };
                        agencyDomanUpStatus(data, true).then(res => {
                            if (res != undefined && res.code == 200)
                                if (typeof res.data === 'string') {
                                    this.$Message.config({
                                        top: 150
                                    });
                                    this.$Message.success('操作成功！');
                                    admin_status === 0 ? (this.table.data[params.index].admin_status = 1) : (this.table.data[params.index].admin_status = 0);
                                }
                        });
                    }
                });
            }
        },
        // 编辑
        edit(params) {
            this.$router.push({
                name: 'editDomain',
                params: { page: 'edit', type: 'domain' },
                query: {
                    id: params.row.id,
                    stage: 'domain',
                    type: params.row.agent_type - 1 > 0 ? '代理' : '大股东'
                }
            });
        },
        // 删除网址
        del(params) {
            const { row, index } = params;
            this.$Tip.confirm({
                content: '您确定删除此网址吗',
                onOk: () => {
                    let data = {
                        siteId: this.$root.nowSite.id,
                        id: row.id
                    };
                    agencyDomainDel(data, true).then(res => {
                        if (res != undefined && res.code == 200) {
                            if (typeof res.data === 'string') {
                                if (this.table.data.length == 1) {
                                    //最后一页无数据 显示上一页
                                    this.page--;
                                }
                                this.getData({
                                    params: { ...this.searchKey, siteId: this.$root.nowSite.id },
                                    query: { page: this.page }
                                });
                                this.$Message.config({
                                    top: 150
                                });
                                this.$Message.success('删除成功！');
                            }
                        }
                    });
                }
            });
        },
        // 点击查看赔率数据 返点格式处理
        setRebateData(data) {
            let nameList = [];
            let arr = [];
            data.forEach(item => {
                arr.push(item.className);
            });
            nameList = Array.from(new Set(arr));
            arr = [];
            for (let i in nameList) {
                arr[i] = {};
                arr[i].name = nameList[i];
                arr[i].list = data.filter(item => item.className == arr[i].name);
            }
            return arr;
        },
        // 点击赔率出现的弹窗
        checkOdds(params) {
            let data = {
                siteId: this.$root.nowSite.id,
                id: params.row.id
            };
            this.$refs.oddsDetails.show();
            this.$refs.oddsDetails.spinShow();
            agencyDomainDetails(data).then(res => {
                let { rebate, platform } = res.data;
                this.agencyRebate = this.setRebateData(rebate);
                this.agencyRefund = platform;
                this.$refs.oddsDetails.spinHide();
            });
        },
        sortChange(obj) {
            sortInteraction(obj);
        },
        // 点击添加域名
        createDomain() {
            this.$router.push({
                name: 'addDomain',
                params: { page: 'add' }
            });
        },
        //获取行数据的详情
        getLotteryDetail(data) {
            agencyDomainDetails(data).then(res => {});
        }
    }
};
</script>
<style lang="less" scoped>
// @import "../../../styles/button.less";
.ivu-form-item {
    &:nth-child(4) {
        margin-right: -5px;
    }
}
// 赔率框高度
.odds {
    max-height: 800px;
    overflow-y: auto;
}
/deep/.v2-button {
    margin-right: 0 !important;
}
</style>



