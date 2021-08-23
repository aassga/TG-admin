
<template>
    <div>
        <div class="v2-search clearfix">
            <Form ref="searchKey" inline class="fl">
                <FormItem>
                    <Button type="primary" style="height:36px" @click="addMember">添加发放会员</Button>
                </FormItem>
                <FormItem label="状态">
                    <Select class="w100x" clearable v-model="searchKey.status" placeholder="全部">
                        <Option value="yes">已领取</Option>
                        <Option value="no">未领取</Option>
                    </Select>
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="开始日期" class="s-120" v-model="Time[0]"></DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="结束日期" class="s-120" v-model="Time[1]"></DatePicker>
                </FormItem>
                <FormItem label="会员账号" prop="userName">
                    <Input v-model="searchKey.userName" placeholder="请输入会员账号" />
                </FormItem>
                <FormItem>
                    <Button :loading="$root.tableLoading" type="primary" style="height:36px" class="w80x" @click="searchSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button :loading="$root.editBtnLoading" class="ivu-btn export" @click.prevent="exportExcel" type="primary">导出Excel</Button>
                </FormItem>
                <FormItem>
                    <div class="clearfix">
                        <Poptip trigger="hover" placement="bottom-end" class="ml5 fl">
                            <div slot="content">
                                <div>昨日有效投注,昨日会员输赢：默认当天显示昨日数据，当按照时间段查询时，</div>
                                <div>
                                    查询的数据开始日期和结束日期默认会向前推一天 如查询1月2号到1月3号数据，
                                </div>
                                <div>昨日有效投注和昨日会员输赢显示的为1月1号到1月2号数据。</div>
                            </div>
                            <Icons type="bangzhutishi" color="#E4E4E4" :size="26" />
                        </Poptip>
                    </div>
                </FormItem>
            </Form>
            <span class="fr font-bold ft18 ib mt5">
                当前站点：
                <span>{{ siteName }}</span>
            </span>
        </div>
        <div class="v2-table">
            <Tables
                ref="table"
                :loading="$root.tableLoading"
                :value="table.data"
                :columns="table.columns"
                :total="table.total"
                @on-page-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
                @on-sort-change="onSortChange"
            ></Tables>
        </div>
        <Modals title="添加发放会员" ref="addMember" :width="560">
            <div slot="content">
                <Tabs>
                    <TabPane label="单个添加" name="name1">
                        <Form :label-width="180" ref="formKeyOne" :model="formKeyOne" :rules="rules">
                            <FormItem label="站点名称" class="mt10" placeholder="请选择关键字搜索">
                                <Input class="w260x" v-model="$route.query.siteName" disabled />
                            </FormItem>
                            <FormItem label="会员账号" prop="userName">
                                <AutoSearch
                                    ref="autoSearch"
                                    style="width:260px"
                                    :siteId="$route.query.siteId"
                                    :placeholder="'输入会员账号，关键字搜索'"
                                    :clearable="false"
                                    :stage="'member'"
                                    v-model="formKeyOne.userName"
                                    @sendId="getId"
                                    @sendUserName="getUserName"
                                ></AutoSearch>
                            </FormItem>
                            <FormItem label="奖金金额" prop="amount">
                                <Input class="w260x" v-model="formKeyOne.amount" placeholder="请输入奖金金额" />
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="saveSubmit" class="ivu commonSubmit w260x">确认添加</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane label="批量添加" name="name2">
                        <Form :label-width="180" ref="formKey" :model="formKey" :rules="rules">
                            <FormItem label="站点名称" class="mt10" placeholder="请选择关键字搜索">
                                <Input class="w260x" v-model="$route.query.siteName" disabled />
                            </FormItem>
                            <FormItem label="奖金金额" prop="str">
                                <Input
                                    class="w260x"
                                    :rows="6"
                                    v-model="formKey.str"
                                    placeholder="格式为：账号，金额 例如：a12345,100 注意逗号为英文格式"
                                    type="textarea"
                                    :autosize="{ minRows: 4, maxRows: 8 }"
                                />
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="batchSubmit" class="ivu commonSubmit w260x">确认添加</Button>
                            </FormItem>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        </Modals>
    </div>
</template>
<script>
	import Tables from "_c/tables";
	import Icons from "_c/icons";
	import AutoSearch from "@/components/auto-search";
	import { fastLotteryTop } from "@/api/report";
	import {
		fastLotteryPrizeList,
		fastLotteryBlackListAdd,
		fastLotteryPrizeAdd,
		fastLotteryPrizeAddMany
	} from "@/api/lottery";
	import { mapState } from "vuex";
	import Modals from "_c/modals";
	export default {
		name: "fastLotteryTop",
		components: {
			Tables,
			Modals,
			Icons,
			AutoSearch
		},
		computed: {
			...mapState({
				siteList: state => state.user.accessSite
			})
		},
		data() {
			const validatePassTwo = (rule, value, callback) => {
				if (
					this.$refs.autoSearch.value === "" ||
					this.$refs.autoSearch.value === undefined
				) {
					callback(new Error("请输入或选择会员账号"));
				} else {
					callback();
				}
			};
			return {
        labelTitle:'单个添加',
				item: "",
				name: "",
				id: "",
				formKey: {
				  siteId: "",
          str: "",


        },
        formKeyOne:{
             siteId: "",
             userName:'',
              amount:'',
        },
				page: 1,
				siteName: "",
				headerLotteryName: [],
				Time: [this.$root.newstartTime(), new Date()],
				searchKey: {
					siteId: this.$root.nowSite.id,
					userName: "",
					status: "",
					limit: 20
				},
				rules: {
					siteId: [
						{
							required: true,
							message: "请选择站点名称",
							trigger: "change",
							pattern: /.+/
						}
					],
					amount: [
						{
							required: true,
							message: "请输入奖金金额",
							trigger: "blur",
							pattern: /.+/
						},
						{
							pattern: /^(0|[1-9]\d*)(\.\d{1,2})?/,
							message: "只支持数字",
							trigger: "blur"
						}
					],
					str: [
						{
							required: true,
							message: "请输入奖金金额",
							trigger: "blur",
							pattern: /.+/
						}
					],
					userName: [
						{
							required: true,
							validator: validatePassTwo,
							trigger: "blur"
						}
					]
				},
				table: {
					data: [],
					loading: true,
					total: 0,
					columns: [
						{
							title: "会员账号",
							key: "userName",
							align: "center",
							render: (h, params) => {
								const { userName } = params.row;
								if (userName == "总计") {
									return <span>总计</span>;
								} else {
									return <span>{params.row.userName}</span>;
								}
							}
						},
						{
							title: "昨日有效投注",
							key: "validBetAmount",
							align: "center",
							sortable: "custom"
						},
						{
							title: "昨日会员输赢",
							key: "netAmount",
							align: "center",
							sortable: "custom",
							render: (h, params) => {
								let color =
									params.row.netAmount > 0 ? "#FF2626" : "rgb(35, 153, 97)";
								return (
									<span style={{ color }}>
										{this.$root.keepTwo(params.row.netAmount)}
									</span>
								);
							}
						},
						{
							title: "发放金额",
							key: "prize",
							align: "center",
							sortable: "custom"
						},
						{
							title: "领取状态",
							key: "status",
							align: "center",
							render: (h, params) => {
								let color = params.row.status == "no" ? "#FF2626" : "";
								return (
									<span style={{ color }}>
										{params.row.userName == "总计"
											? "-"
											: params.row.status == "yes"
											? "已领取"
											: "未领取"}
									</span>
								);
							}
						},
						{
							title: "领取时间",
							key: "getTime",
							align: "center",
							render: (h, params) => (
								<span>
									{params.row.userName == "总计"
										? "-"
										: params.row.getTime == "0"
										? "-"
										: this.$root.formatTimeS(params.row.getTime * 1000)}
								</span>
							)
						},
						{
							title: "发放时间",
							key: "addTime",
							align: "center",
							render: (h, params) => (
								<span>
									{params.row.userName == "总计"
										? "-"
										: this.$root.formatTimeS(params.row.addTime * 1000)}
								</span>
							)
						},
						{
							title: "操作人",
							key: "created_by",
							align: "center",
							render: (h, params) => (
								<span>
									{params.row.userName == "总计" ? "-" : params.row.created_by}
								</span>
							)
						}
					]
				}
			};
		},
		mounted() {
			const { siteId, siteName, startTime, endTime } = this.$route.query;
			this.searchKey.startTime = startTime;
			this.searchKey.endTime = endTime;
			this.searchKey.siteId = siteId;
			this.siteName = siteName;
			this.Time = [startTime, endTime];
			this.getData({ params: this.searchKey });
		},
		methods: {
			exportExcel() {
				let data = { ...this.searchKey };
				data.isExport = 1;
				let openr = window.open();
				fastLotteryPrizeList({ params: data }).then(res => {
					if (res != undefined && res.code == 200) {
						let region = res.data.downloadUrl;
						let nowHost = region.split(".com")[1];
						let openr1 = openr ? openr : window;
						openr1.location.href = nowHost;
					} else {
						openr.close();
					}
				});
			},
			saveSubmit() {
				let data = { ...this.formKeyOne, userName: `${this.name}` + `#${this.id}` };
        data.siteId = this.$route.query.siteId;
        this.formKeyOne.userName=this.name
				this.$refs.formKeyOne.validate(valid => {
					if (valid) {
						this.$refs.addMember.spinShow();
						fastLotteryPrizeAdd(data, true)
							.then(res => {
								if (res != undefined && res.code == 200) {
                  this.$refs.formKeyOne.resetFields();
                  this.$refs.addMember.hide()
                  this.$refs.addMember.spinHide();
									this.getData({ params: this.searchKey });
								}
							})
							.catch(error => {
								this.$refs.addMember.spinHide();
							});
					}
				});
			},
			batchSubmit() {
				let data = { ...this.formKey, siteId: this.$root.nowSite.id };
				data.str = data.str.replace(/(\r\n|\n|\r)/gm, "|");
				this.$refs.formKey.validate(valid => {
					if (valid) {
						if (!this.formKey.str.includes(",")) {
							this.$Tip.info({
								content: "奖池金额，账号与金额请以，英文逗号间隔"
							});
							return false;
						}
            let itemList=[]
						data.str.split("|").forEach(t => {
              this.item = t.split(",")[1];
              itemList.push(this.item)
            });
            itemList=String(itemList)
            let reg = /^\d+(,\d+)*$/;
            if(!reg.test(itemList)){
                this.$Tip.info({
								content: "请检查奖池金额是否正确"
							});
							return false;
            }

						fastLotteryPrizeAddMany(data).then(res => {
							if (res && res.code == 200) {
								const {
									allusercount,
									okusercount,
									errorusercount,
									erroruser
								} = res.data;
								let erroruserDetial;
								if (Array.isArray(erroruser)) {
									erroruserDetial = erroruser.toString();
								}
								this.$refs.addMember.hide();
								if (errorusercount == 0) {
									this.$refs.addMember.spinHide();
									this.$Message.success({ content: "发放会员添加成功" });
								} else {
									this.$Tip.showAddSub({
										show: true,
										erroruserDetial,
										errorusercount,
										okusercount
									});
								}
								this.getData({ params: this.searchKey });
							}
						}).catch(error => {
								this.$refs.addMember.spinHide();
							});
					}
				});
			},
			getUserName(name) {
				this.name = name;
			},
			getId(id) {
				this.id = id;
			},
			addMember() {
				this.$refs.autoSearch.value = "";
				this.formKey = {};
        this.$refs.addMember.show();
        this.$refs.formKeyOne.resetFields();
        this.$refs.formKey.resetFields();


			},
			getData(data) {
				if (!data.siteId) data.siteId = this.$root.nowSite.id;
				this.$root.startTableLoading();
				data.params.startTime = this.$root.formatTimeS(this.Time[0]);
				data.params.endTime = this.$root.formatnightTimeS(this.Time[1]);
				for (let key in data.params) {
					if (!data.params[key]) delete data.params[key];
				}
				fastLotteryPrizeList(data, true)
					.then(res => {
						if (res != undefined && res.code == 200) {
							// this.siteList = res.data.siteCollect;
							this.table.data = res.data.data.list;
							this.table.total = res.data.total;
							let list = res.data.data.list;
							list.length > 0 &&
								list.forEach(t => {
									this.headerLotteryName.push({
										lotteryName: t.lotteryName,
										lastCountTime: t.lastCountTime,
										netAmount: t.netAmount
									});
								});
							list.length && list.push(this.createTotalData(res.data.data.extra));
							this.table.data = list;
							this.$root.endTableLoading();
						}
					})
					.catch(error => {
						this.$root.endTableLoading();
					});
			},
			createTotalData(total) {
				const { validBetAmount, netAmount, prize } = total;
				let item = {
					userName: "总计",
					validBetAmount,
					netAmount,
					prize,
					status: "-"
				};
				return item;
			},
			searchSubmit() {
				if (!this.searchKey.siteId) {
					this.searchKey.siteId = this.$root.nowSite.id;
        }
       	let data = { ...this.searchKey };
				if (this.$root.validateTime(this.Time)) {
					const [startTime, endTime] = this.$root.validateTime(this.Time);
					data.startTime = startTime && this.$root.formatTimeS(startTime);
					data.endTime = endTime && this.$root.formatnightTimeS(endTime);
				} else {
					return false;
				}
        this.$refs.table.setPage();
        this.searchKey.startTime = data.startTime;
        this.searchKey.endTime = data.endTime;
        	const { startTime, endTime } = data;
				if (startTime == "" || endTime == "") {
					this.$Tip.info({ content: "请输入开始和结束时间" });
					return false;
				}
				if (
					this.searchKey.userName &&
					!this.$root.validateName(this.searchKey.userName)
				) {
					this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
					return false;
				}
				this.table.columns.forEach(item => {
					if (item.sortable == "custom") this.$set(item, "sortType", "");
				});
				delete this.searchKey.sort;
        delete this.searchKey.field;

				this.getData({ params: data });
			},
			onPageChange(page) {
				this.page = page;
				let data = { ...this.searchKey };
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				data.page = page;
				if (data.userName && !this.$root.validateName(data.userName)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
					return false;
				}
				this.getData({ params: this.searchKey, query: { page } });
			},
			onPageSizeChange(pageSize) {
				this.searchKey.limit = pageSize;
				let data = { ...this.searchKey };
				for (let key in data) {
					if (!data[key]) delete data[key];
				}
				if (data.userName && !this.$root.validateName(data.userName)) {
					this.$Tip.info({ content: "您所查询的会员账号不正确,请重新输入" });
					return false;
				}
				this.getData({ params: data });
			},
			onSortChange({ column, key, order }) {
				delete this.searchKey.field;
				delete this.searchKey.sort;
				let data = { field: key, sort: order, ...this.searchKey };
				this.searchKey.field = key;
				if (data.sort == "normal") {
					this.table.columns.forEach(t => {
						if (t.key == column.key) this.$set(t, "sortType", "asc");
					});
					this.searchKey.sort = "asc";
					data.sort = "asc";
				} else {
					this.table.columns.forEach(t => delete t.sortType);
					this.searchKey.sort = order;
				}
				this.page == 1 ? "" : this.$refs.table.setPage();
				this.page == 1
					? this.getData({ params: data })
					: this.getData({ params: data, query: { page: 1 } });
			}
		}
	};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';

.activeBtn {
    height: 36px;
    background-color: #2d8cf0;
    color: #ffffff;
    box-shadow: 0;
    &:focus {
        box-shadow: 0 0 0 0;
    }
}
.destoryBtn {
    height: 36px;
    border: 1px solid #eaeaea;
    &:focus {
        box-shadow: 0 0 0 0;
    }
    &:hover {
        background: #f4f9ff;
        border: 1px solid #2d8cf0;
        color: #2d8cf0;
    }
}
/deep/.ivu-input[disabled] {
    background-color: #fff !important;
    color: #444 !important;
}

/deep/.ivu-tabs-bar {
    margin-left: 20px;
    .ivu-tabs-tab {
        margin-bottom: 10px;
    }
}

/deep/.ivu-tabs-tab {
    font-size: 1rem /* 16/16 */;
    color: #444;
}
</style>

