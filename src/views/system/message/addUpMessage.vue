<template>
	<div>
		<Form ref="formKey" :model="formKey" :rules="rules">
			<FormItem>
				<span class="ml30 pr3">收件人</span>
				<ButtonGroup class="ml10">
					<Button
						class="w120x f6Color"
						style="height:40px"
						:class="showBtn==t.value?'active':''"
						v-for="(t,index) in messageList "
						:key="index"
						:value="t.value"
						:label="t.label"
						:defult="t.label"
						@click.prevent="activeBtn(t)"
					>{{t.label}}</Button>
				</ButtonGroup>
			</FormItem>
			<FormItem label="指定管理" prop="id" v-if="showBtn=='assignAdmin'">
				<Select class="w360x ml5" v-model="formKey.id" filterable :max-tag-count="5" transfer multiple>
					<Option
						v-for="(m,i) in  adminList"
						:value="m.id"
						:key="i"
					>{{m.userName}}</Option>
				</Select>
			</FormItem>
			<FormItem label="站点名称" prop="type" v-if="showBtn=='assignSite'">
				<Select
					class="w360x ml5"
					:max-tag-count="5"
					transfer
					v-model="formKey.type"
					filterable
					multiple
				>
					<Option
						v-for="(t,i) in  siteList"
						:key="i"
						:value="t.id"
					>{{t.siteName}}</Option>
				</Select>
			</FormItem>
			<FormItem label="更新标题" prop="title">
				<Input :maxlength="20" placeholder="请输入标题(20字以内)" v-model="formKey.title" class="w360x ml5" />
			</FormItem>

			<FormItem label="更新内容" prop="content" class="ue">
				<UE
					class="ml85"
					v-model="formKey.content"
					:defaultMsg="defaultMsg1"
					:config="config"
					:id="ue1"
					ref="ue1"
				></UE>
			</FormItem>
			<FormItem>
				<Button type="primary" @click.prevent="sendSubmit" class="ivu send ft20 ml85">发送</Button>
			</FormItem>
		</Form>
	</div>
</template>
<script>
	import UE from "_c/UE";
	import {
		siteList,
		adminMassageAS,
		adminMassageAdd,
		selectAdminList
	} from "@/api/system";
	export default {
		name: "addUpMessage",
		components: {
			UE
		},
		data() {
			return {
				formKey: {
					title: "",
					content: "",
					id: [],
					type: [],
					typeVal: ""
				},
				userName: "",
				adminList: [],
				siteList: [],
				defaultMsg1: "",
				ue1: "ue1",
				userId: "",
				userList: [],
				siteId: "",
				config: {
					initialFrameWidth: 900,
					initialFrameHeight: 350
				},
				showBtn: "allAdmin",
				adminId: "",
				messageList: [
					{ value: "allAdmin", label: "全部管理员" },
					{ value: "assignAdmin", label: "指定管理员" },
					{ value: "assignSite", label: "指定站点" }
				],
				rules: {
					title: {
						required: true,
						message: "请填写标题",
						trigger: "blur",
						pattern: /.+/
					},
					content: [
						{
							required: true,
							validator: (rule, val, cb) => {
								val = this.$refs.ue1.getUEContent();
								if (val == "") {
									cb(new RangeError("请填写内容"));
								} else {
									cb();
								}
							},
							trigger: "change"
						}
					],
					type: {
						required: true,
						message: "请选择站点名称",
						trigger: "change",
						pattern: /.+/
					},
					id: {
						required: true,
						message: "请选择指定管理员名称",
						trigger: "change",
						pattern: /.+/
					}
				}
			};
		},
		methods: {
			getUserList() {
				selectAdminList().then(res => {
					this.adminList = res.data;
				});
			},
			getList() {
				siteList().then(res => {
					this.siteList = res.data;
				});
			},
			activeBtn(t) {
				const { label, value } = t;
				this.showBtn = value;
				this.$refs.formKey.resetFields();
			},
			sendSubmit() {
				this.$refs.formKey.validate(valid => {
					if (valid) {
						let data = { ...this.formKey };
						data.content = this.$refs.ue1.getUEContent();
						if (this.showBtn == "allAdmin") {
							data.type = 0;
						} else if (this.showBtn == "assignAdmin") {
							data.type = 2;
							data.typeVal = String(data.id);
						} else {
							data.typeVal = String(data.type);
							data.type = 1;
						}
						for (let key in data) {
							if (key.includes("id")) {
								delete data[key];
							}
						}
						adminMassageAdd(data, true).then(res => {
							if (res != undefined && res.code == 200) {
								this.$Message.success({ content: "发送信息成功" });
								this.$router.push({ name: "adminMassageSendList" });
							}
						});
					}
				});
			}
		},
		mounted() {
			this.getList();
			this.getUserList();
		}
	};
</script>
<style scoped lang="less" scoped>
	@import "../../../styles/button.less";
	/deep/.ml10 .active {
		border: 1px solid #dcdcdc;
		border-top: 1px solid #2d8cf0 !important;
		outline: none !important;
		color: #2d8cf0 !important;
	}
	/deep/.ivu-form-item-error-tip {
		margin-left: 450px;
		top: 0px;
	}
	.ue {
		/deep/.ivu-form-item-error-tip {
			margin-left: 990px;
		}
	}
	/deep/.ivu-select-dropdown-list {
		height: 100px;
		overflow-y: hidden;
	}

	/deep/.ivu-btn,ivu-btn-default{
		height: 32px;
		line-height: 32px;
		span{
			height: 32px;
			margin-top:-10px;
		line-height: 32px;
		}

	}
</style>