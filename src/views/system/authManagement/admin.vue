<template>
	<div>
		<div class="v2-search">
			<Form inline ref="searchKey">
				<FormItem class="origin">
					<div class="v2-button" v-if="adminType=='super'||authInPage.indexOf('adminAdd') != -1" >
						<Button  @click="addAdmin">新增管理员</Button>
					</div>
				</FormItem>
				<FormItem v-if="(adminType == 'super')">
					<Checkbox v-model="searchKey.type">
						<span>只看超管</span>
					</Checkbox>
				</FormItem>
				<FormItem label="管理员账号">
					<Input
						class="s-160"
						placeholder="请输入管理员账号"
						v-model="searchKey.userName"
						@keyup.enter.native="searchSubmit"
					/>
				</FormItem>
				<FormItem>
					<Button class="search" type="primary" @click="searchSubmit" :loading="$root.tableLoading">查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				ref="tables"
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
				:pageSizeOpts="table.pageSizeOpts"
			></Tables>
		</div>
		<!-- 修改密码 -->
		<Modals title="修改密码" ref="changePwd" width="526">
			<div slot="content">
				<Form
					style="width:526px;"
					ref="changePwdInfo"
					:label-width="130"
					:model="changePwdInfo"
					:rules="changePwdInfoRules"
				>
					<FormItem label="管理员账号" prop="userName" required>
						<Input v-model="changePwdInfo.userName" class="w320x" disabled />
					</FormItem>
					<FormItem label="管理员密码" prop="password">
						<Input v-model="changePwdInfo.password" class="w320x" placeholder="请输入8-20位数字或字母" />
					</FormItem>
					<FormItem>
						<Button class="ml30 ivu-btn submit" type="primary" @click="saveChange">确认保存</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
		<!-- 复制权限 -->
		<Modals title="复制权限" ref="copyPermission" width="526">
			<div slot="content">
				<div class="copy-tip">
					<Icon type="ios-alert-outline" class="ib ml20" size="22" style="marginTop:-2px;" />
					<p class="ib ml10">复制成功将继承该管理员的所有权限</p>
				</div>
				<Form
					ref="copyPermissionInfo"
					style="width:526px;"
					:model="copyPermissionInfo"
					:rules="copyPermissionInfoRules"
					:label-width="140"
				>
					<FormItem label="当前管理员" prop="currentAdmin" required>
						<Input class="w320x" disabled v-model="copyPermissionInfo.currentAdmin" />
					</FormItem>
					<FormItem label="新增管理员" prop="userName">
						<Input class="w320x" v-model="copyPermissionInfo.userName" placeholder="请输入6-20位数字或字母" />
					</FormItem>
					<FormItem label="管理员密码" prop="password">
						<Input class="w320x" v-model="copyPermissionInfo.password" placeholder="请输入8-20位数字或字母" />
					</FormItem>
					<FormItem>
						<Button
							type="primary"
							class="ivu-btn newSubmit ft16"
							style="margin-left:-30px;"
							@click="copyAdminSubmit"
						>确认新增</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
		<Modals title="可用站点" ref="validSite" width="526">
			<div slot="content" class="siteBox">
				<ul class="clearfix b">
					<li v-for="(t,i) in siteIdList" :key="i" class="w20 fl ft14 bb txt-a br">{{t.siteName}}</li>
				</ul>
			</div>
		</Modals>
		<Modals title="信用额度" ref="limitModals" width="550">
			<div slot="content">
				<Form
					:label-width="120"
					ref="formKey"
					:model="formKey"
					:rules="formKey.handle=='加款'?addRules:reduceRules"
				>
					<FormItem label="管理员">
						<Input class="w320x" v-model="adminDetial.userName" disabled placeholder="请输入管理员账号" />
						<span class="red-font ml5">￥{{adminDetial.balance}}</span>
					</FormItem>
					<FormItem label="加减操作" >
						<RadioGroup  v-model="formKey.handle" @on-change="changeHandle">
							<Radio label="加款"></Radio>
							<Radio label="减款" class="ml10"></Radio>
						</RadioGroup>
					</FormItem>
					<FormItem :label="formKey.handle=='加款'?'加款金额':'减款金额'" prop="amount">
						<input-number
							class="w320x"
							v-model="formKey.amount"
							:max="10000000.00"
							:min="0"
							:max-length="11"
							:placeholder="formKey.handle=='加款'?'请输入加款金额':'请输入减款金额'"
						/>
					</FormItem>
					<FormItem>
						<Button
							type="primary"
              @click="saveSubmit"
              :loading="$root.editBtnLoading"
              disabledBtn
							class="ivu commonSubmit w160x ml65"
						>{{formKey.handle=='加款'?'确定加款':'确定减款'}}</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
	</div>
</template>
<script>
	import AutoSearch from "_c/auto-search";
	import Tables from "_c/tables";
	import Icons from "@/components/icons";
	import Modals from "_c/modals";
	import { Tooltip } from "view-design";
	import {
		adminNewList,
		adminModifyStatus,
		adminNewDelete,
		adminNewDetail,
		copyAdmin,
		changePassWord,
		adminBalanceUpdate
	} from "@/api/system";
	import { getUserType } from "@/libs/util";
	export default {
		name: "admin",
		components: {
			Tables,
			Modals,
			Icons,
			AutoSearch
		},
		data() {
			return {
        		disabledBtn: false,
				adminDetial: {},
				formKey: {
					handle: "加款",
					amount: 1,
					balanceType: "balance"
				},
				addRules: {
					amount: [
						{
							required: true,
							message: "请输入加款金额",
							type: "number",
							trigger: "blur"
						}
					]
				},
				reduceRules: {
					amount: [
						{
							required: true,
              message: "请输入减款金额",
              type: "number",
							trigger: "blur"
						},
						{
							required: true,
							validator: (rule, val, cb) => {
                if(val<this.adminDetial.balance){
                  cb()
                }else{
                  cb(new RangeError('减款金额不能超过可用额度'))
                }
							},
							trigger: "blur"
						}
					]
				},
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				//修改密码信息
				changePwdInfo: {
					userName: "",
					adminId: null,
					password: ""
				},
				siteIdList: [], //点击行的站点总数
				// num: 0, //循环站点的行数
				changePwdInfoRules: {
					password: [
						{
							required: true,
							message: "请输入您的新密码",
							trigger: "blur"
						},
						{
							pattern: /^[A-Za-z0-9]{8,20}$/,
							message: "请输入8-20位数字或字母",
							trigger: "blur"
						}
					]
				},
				//复制权限信息
				copyPermissionInfo: {
					currentAdmin: "",
					userName: "",
					password: ""
				},
				copyPermissionInfoRules: {
					userName: [
						{
							required: true,
							message: "请输入管理员账号",
							trigger: "blur"
						},
						{
							pattern: /^[A-Za-z0-9]{6,20}$/,
							message: "请输入6-20位数字或字母",
							trigger: "blur"
						}
					],
					password: [
						{
							required: true,
							message: "请输入管理员密码",
							trigger: "blur"
						},
						{
							pattern: /^[A-Za-z0-9]{8,20}$/,
							message: "请输入8-20位数字或字母",
							trigger: "blur"
						}
					]
				},
				searchKey: {
					siteId: this.$root.nowSite.id
				},
				table: {
					loading: true,
					pageSizeOpts: [20, 30, 40, 50],
					data: [],
					total: 0,
					columns: [
						{
							title: "管理员账号",
							key: "userName",
							align: "center",
							width:
								screen.width > 1600 && screen.width < 2000
									? 200
									: screen.width > 2000
									? 240
									: "",
							minWidth: screen.width < 1600 ? 110 : "",
							render: (h, params) => {
								let flag = true;
								return (
									<Tooltip
										placement="right"
										title={
											params.row.userName.length > 9 ? params.row.userName : ""
										}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "space-around",
												alignItems: "center"
											}}
										>
											<span
												style={{
													width: screen.width < 1600 ? "100px" : "135px",
													cursor: "pointer",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap"
												}}
											>
												{params.row.userName}
											</span>

											<Icons
												type="huiyuanchaxunzaixian"
												color={
													params.row.onlineStatus !== "online"
														? "#B3B3B3"
														: "#57A3F3"
												}
												size="20"
											/>
										</div>
										<div slot="content">
											{params.row.onlineStatus !== "online" ? "离线" : "在线"}
										</div>
									</Tooltip>
								);
							}
						},
						{
							title: "管理员别称",
							key: "groupName",
							align: "center",
							minWidth: 80,
							tooltip: true,
							render: (h, params) => {
								let { otherName, type } = params.row;
								if (type != "super") {
									return <span>{this.$root.text(otherName)}</span>;
								} else {
									return <span>{otherName ? otherName : "超级管理员"}</span>;
								}
							}
						},
						{
							title: "管理员角色",
							key: "type",
							align: "center",
							minWidth: 100,
							render: (h, params) =>{
								const {type}=params.row;
								return(

									<span>{type=='super'?'超管':(type=='manager'?'管理':(type=='site'?'站长':(type=='rent'?'包网':'普管')))}</span>
								)
							}
						},
						{
							title: "可用站点",
							key: "siteId",
							align: "center",
							minWidth: 65,
							render: (h, params) => {
								let { siteId, type } = params.row;
								let showId = this.$root.nowSite.id;
							
								let flag = siteId.find(item => item.siteId == showId);
							
								return (
									<a
										onClick={() => {
											this.siteIdList = siteId;
											if (type != "super") this.$refs.validSite.show();
										}}
									>
									{
										type === "super"
									 		? "全部站点"
											: siteId.length == 0
											? "-"
											:flag==undefined?'-'
											: flag != "undefined"
											? (flag.siteName)	
								 		: siteId.slice(0, 1)[0].siteName}
									</a>
									// {type === "super"
									// 		? "全部站点"
									// 		: siteId.length == 0
									// 		? "-"
									//      :flag==undefined?'-'
									// 		: flag != "undefined"
									// 		? flag.siteName
									// 		: siteId.slice(0, 1)[0].siteName}

									// {
									// 	type === "super"
									//  		? "全部站点"
									// 		: siteId.length == 0
									// 		? "-"
									//        :flag==undefined?''
									// 		: flag != "undefined"
									// 		? (flag.siteName)
								 	// 	: siteId.slice(0, 1)[0].siteName}
								);
							}
						},
						{
							title: "信用额度",
							key: "balance",
							align: "center",
							minWidth: 100,
							render: (h, params) => (
								<span>{params.row.balance ? params.row.balance : "无限制"}</span>
							)
						},
						{
							title: "单笔限额",
							key: "balance",
							align: "center",
							minWidth: 100,
							render: (h, params) => (
								<span>
									{params.row.maxAddMoney ? params.row.maxAddMoney : "无限制"}
								</span>
							)
						},
						{
							title: "上次登录",
							key: "lastTime",
							align: "center",
							minWidth: 120,
							render: (h, params) => (
								<span>{this.$root.newUnixTime(params.row.lastTime)}</span>
							)
						},
						// {
						// 	title: "创建时间",
						// 	key: "time",
						// 	align: "center",
						// 	minWidth: 120,
						// 	render: (h, params) => (
						// 		<span>{this.$root.newUnixTime(params.row.time)}</span>
						// 	)
						// },
						{
							title: "创建人",
							key: "createUserName",
							align: "center",
							minWidth: 85,
							tooltip: true
						},
						{
							title: "状态",
							key: "status",
							align: "center",
							minWidth: 30,
							render: (h, params) => {
								let color = params.row.status === "yes" ? "" : "#FF0000";
								let text = params.row.status == "yes" ? "正常" : "停用";
								return <span style={{ color }}>{text}</span>;
							}
						},
						{
							title: "操作",
							align: "center",
							minWidth: 240,
							render: (h, params) => (
								
								<div>
									<a
										class="ib mr15"
										style={{
											display:
												this.adminType == "super" ||
												this.authInPage.indexOf("adminModifyStatus") != -1
													? "inline-block"
													: "none"
										}}
										onClick={() => {
											let postData = {
												id: params.row.id,
												status: params.row.status === "yes" ? "no" : "yes"
											};
											let text =
												params.row.status === "yes"
													? "您确定停用此管理员账号吗？"
													: "您确定启用此管理员账户吗？";
											let content =
												params.row.status === "yes"
													? "停用管理员账号成功"
													: "启用管理员账号成功";
											this.$Tip.confirm({
												content: text,
												onOk: () => {
													adminModifyStatus(postData, true).then(res => {
														if (res != undefined && res.code == 200)
															this.$Message.config({
																top: 50,
																duration: 1
															});
														this.$Message.success(content);
														this.table.data[params.index].status =
															this.table.data[params.index].status == "yes"
																? "no"
																: "yes";
													});
												}
											});
										}}
									>
										{params.row.status == "yes" ? "停用" : "启用"}
									</a>
									<a
										class="ib mr15"
										style={{
											display:
												this.adminType == "super" ||
												this.authInPage.indexOf("adminBalanceUpdate") != -1
													? "inline-block"
													: "none",
											color: params.row.balance == "0" ? "#918b8b" : "#2D8CF0"
										}}
										onClick={() => {
											if (params.row.balance != "0") {
												this.adminDetial = params.row;
                        this.$refs.limitModals.spinShow();
                        this.disabledBtn = false;
                        this.formKey.amount=0;
                        this.$refs.formKey.resetFields();
												this.$refs.limitModals.show(this.adminDetial);
												this.$refs.limitModals.spinHide();
											}
										}}
									>
										额度
									</a>
									<a
										class="ib mr15"
										style={{
											display:
												this.adminType == "super" ||
												this.authInPage.indexOf("adminUpdate") != -1
													? "inline-block"
													: "none",
											color: params.row.type === "super" ? "#918b8b" : "#2D8CF0"
										}}
										onClick={() => {
											
											if (params.row.type != "super") {
												this.$router.push({
													name: "adminEdit",
													query: { id: params.row.id, type: params.row.type },
													params: { page: "edit" }
												});
											}
										}}
									>
										编辑
									</a>
									<a
										class="ib mr15"
										style={{
											display:
												this.adminType == "super" ||
												this.authInPage.indexOf("changePassWord") != -1
													? "inline-block"
													: "none"
										}}
										onClick={() => {
											this.$refs.changePwdInfo.resetFields();
											this.changePwdInfo.userName = params.row.userName;
											this.changePwdInfo.adminId = params.row.id;
											this.$refs.changePwd.show();
										}}
									>
										修改密码
									</a>
									<a
										class="ib mr15"
										style={{
											display:
												this.adminType == "super" ||
												this.authInPage.indexOf("copyAdmin") != -1
													? "inline-block"
													: "none"
										}}
										onClick={() => {
											this.$refs.copyPermissionInfo.resetFields();
											this.copyPermissionInfo.currentAdmin = params.row.userName;
											this.copyPermissionInfo.adminId = params.row.id;
											this.$refs.copyPermission.show();
										}}
									>
										复制
									</a>
									<a
										class="ib"
										style={{
											display:
												this.adminType == "super" ||
												this.authInPage.indexOf("adminDelete") != -1
													? "inline-block"
													: "none"
										}}
										onClick={() => {
											this.$Message.config({
												top: 50,
												duration: 1
											});
											let data = { adminId: params.row.id };
											this.$Tip.confirm({
												content: "您确定删除此管理员账号吗？",
												onOk: () => {
													adminNewDelete(data, true).then(res => {
														if (res != undefined && res.code == 200) {
															this.$Message.success("删除管理员成功");
															this.table.data.splice(params.index, 1);
															this.table.total--;
														}
													});
												}
											});
										}}
									>
										删除
									</a>
								</div>
							)
						}
					]
				}
			};
		},
		mounted() {
			let data = { ...this.searchKey };
			this.searchKey.type ? (data.type = "super") : "";
			this.getData({ params: data });
		},
		methods: {
      changeHandle(val){
        this.formKey.amount=1;
      },
			saveSubmit() {
				this.$refs.formKey.validate(valid => {
					if (valid) {
            if(!this.disabledBtn){
               let data = { ...this.formKey, adminId: this.adminDetial.id };
						if (data.handle == "加款") {
								data.amount = `+${data.amount}`;
						} else {
								data.amount = `-${data.amount}`;
						}
						for (let key in data) {
							if (!data[key]) delete data[key];
							if (key == "handle") delete data[key];
            }
            	this.disabledBtn = true;

						adminBalanceUpdate(data,true).then(res => {
                	this.$root.startEditLoading();
							if (res != undefined && res.code == 200) {
                this.$refs.limitModals.hide();
                	let postData = { params: { ...this.searchKey } };
                if(this.formKey.handle=='加款'){
                   this.$Message.success({content:'加款成功'})
                }else{
                  this.$Message.success({content:'减款成功'})
                }

                this.getData(postData);
							}
						});
            }

					}
				});
			},
			getData(data) {
				for (let key in data.params) {
					if (!data.params[key]) delete data.params[key];
				}
				this.$root.startTableLoading(this);
				adminNewList(data)
					.then(res => {
						if (res != undefined && res.code == 200) {
							let { data, total } = res.data;
							this.table.data = data;
							this.table.total = total;
						}
						this.$root.endTableLoading();
					})
					.catch(error => this.$root.endTableLoading());
			},
			searchSubmit() {
				let postData = { params: { ...this.searchKey } };
				this.searchKey.type ? (postData.params.type = "super") : "";
				// if (postData.params.userName && postData.params.userName.length < 5) {
				//   this.$Tip.info({ content: "查询用户名须大于5字符" });
				//   return false;
				// }
				for (let key in postData.params) {
					if (!postData.params[key]) delete postData.params[key];
				}
				if (postData.params.userName)
					postData.params.userName = this.$root.trimAll(postData.params.userName);
				if (
					postData.params.userName &&
					!this.$root.validateName(postData.params.userName)
				) {
					this.$Tip.info({ content: "您所查询的管理员账号不正确，请重新输入" });
					return false;
				}
				this.getData(postData);
			},
			//修改密码
			saveChange() {
				this.$refs.changePwdInfo.validate(valid => {
					if (valid) {
						this.$refs.changePwd.spinShow();
						let { adminId, password } = this.changePwdInfo;
						let data = {
							adminId,
							new_password: password,
							new_password_confirmation: password
						};
						changePassWord(data, true)
							.then(res => {
								this.$refs.changePwd.spinHide();
								if (res != undefined && res.code == 200) {
									this.$Message.config({
										top: 50,
										duration: 1
									});
									this.$refs.changePwd.hide();
									this.$Message.success(res.data);
								}
							})
							.catch(error => {
								this.$refs.changePwd.spinHide();
							});
					}
				});
			},
			//复制权限
			copyAdminSubmit() {
				this.$Message.config({
					top: 50,
					duration: 1
				});
				this.$refs.copyPermissionInfo.validate(valid => {
					if (valid) {
						let data = { ...this.copyPermissionInfo };
						delete data.currentAdmin;
						this.$refs.copyPermission.spinShow();
						copyAdmin(data, true)
							.then(res => {
								this.$refs.copyPermission.spinHide();
								if (res != undefined && res.code == 200) {
									this.$refs.copyPermission.hide();
									let postData = { params: { ...this.searchKey } };
									this.searchKey.type ? (postData.params.type = "super") : "";
									for (let key in postData.params) {
										if (!postData.params[key]) delete postData.params[key];
									}
									this.$Message.success(res.data);
									this.getData(postData);
									this.$refs.tables.setPage();
								}
							})
							.catch(error => {
								this.$refs.copyPermission.spinHide();
							});
					}
				});
			},
			onPageChange(page) {
				let postData = {
					params: { ...this.searchKey },
					query: { page }
				};
				postData.params.type = postData.params.type ? "super" : "";
				if (postData.params.userName)
					postData.params.userName = this.$root.trimAll(postData.params.userName);
				for (let key in postData.params) {
					if (!postData.params[key]) delete postData.params[key];
				}
				if (
					postData.params.userName &&
					!this.$root.validateName(postData.params.userName)
				) {
					this.$Tip.info({ content: "您所查询的管理员账号不正确，请重新输入" });
					return false;
				}
				this.getData(postData);
			},
			onPageSizeChange(pageSize) {
				this.searchKey.limit = pageSize;
				let postData = {
					params: { ...this.searchKey }
				};
				postData.params.type = postData.params.type ? "super" : "";
				for (let key in postData.params) {
					if (!postData.params[key]) delete postData.params[key];
				}
				if (postData.params.userName)
					postData.params.userName = this.$root.trimAll(postData.params.userName);
				if (
					postData.params.userName &&
					!this.$root.validateName(postData.params.userName)
				) {
					this.$Tip.info({ content: "您所查询的管理员账号不正确，请重新输入" });
					return false;
				}
				this.getData(postData);
			},
			addAdmin() {
				this.$router.push({
					name: "adminEdit",
					params: { page: "add" }
				});
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../../styles/button.less";
	.v2-search {
		/deep/.ft14 {
			font-size: 0.875rem;
		}
	}
	/deep/.copy-tip {
		background-color: #f6f6f8;
		height: 36px;
		line-height: 36px;
		margin-bottom: 10px;
		margin-top: -10px;
		color: #666666;
	}
	.h50 {
		line-height: 50px;
	}
	.h40 {
		line-height: 40px;
	}
	.w33 {
		width: 33.333%;
	}
	.gr {
		background: #dcdcdc;
		height: 40px;
		line-height: 40px;
		width: 100%;
		text-align: center;
	}
	.bgSend .ivu-icon {
		vertical-align: top;
	}
	/deep/.origin {
		button {
			display: inline-block;
			width: 120px;
			background: #2d8cf0;
			border-color: #2d8cf0;
			color: #ffffff;
			height: 36px;
			line-height: normal;
		}
	}
	.siteBox {
		width: 500px;
		margin: 20px auto;
		h5 {
			background: #ebebeb;
			height: 40px;
			line-height: 40px;
			text-align: center;
			font-size: 0.875rem;
			color: #808080;
		}
		ul {
			li {
				height: 40px;
				line-height: 40px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				&:nth-child(5n) {
					border-right: 0;
				}
			}
		}
	}
	/deep/.v2-button {
		margin-right: 0 !important;
	}
</style>


