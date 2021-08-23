<template>
	<div>
		<div class="v2-search">
			<Form inline ref="searchKey">
				<FormItem>
					<Button type="primary" @click.prevent="addImg('add')">
						<Icons type="xinzeng" size="14" class="mr5" />新增图片
					</Button>
          <!-- <Button type="primary" class="ml10" @click="()=>{$router.push({name:'gameBanner'})}">游戏轮播</Button> -->
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				:page="false"
				:showSizer="false"
				ref="tables"
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				:pageSizeOpts="table.pageSizeOpts"
				@on-delete="onDelete"
			></Tables>
		</div>
		<Modals ref="addImg" :title="title" :width="690" :height="450">
			<div slot="content" class="ft22" v-if="showDatas">
				<Form :label-width="90" ref="Form" :model="formKey" :rules="rules">
					<FormItem class="ml20f" label="上传位置" prop="position">
						<Select
							v-if="title.includes('新增')"
							class="w260x"
							@on-change="changePostion"
							v-model="formKey.position"
						>
							<Option v-for="(t,i)  in newUplist" :key="i+10" :value="t.value">{{t.name}}</Option>
						</Select>
						<Input
							v-else
							v-model="formKey.position"
							:key="formKey.position"
							class="w260x"
							:disabled="title.includes('编辑')"
						/>
					</FormItem>
					<FormItem label="标题" class="ml20f" prop="title">
						<Input class="w475x" placeholder="请输入标题" v-model="formKey.title" />
					</FormItem>

					<div class="clearfix mb20">
						<!-- 第一个 -->
						<FormItem prop="imgUrl1" class="fl">
							<div class="upBox fl" :class="showOne==false?'ml140':''">
								<Upload
									v-model="formKey.imgUrl1"
									v-if="showimg1"
									:show-upload-list="false"
									:default-file-list="uploadForm.defaultList"
									:headers="uploadForm.headers"
									:action="uploadForm.action"
									:data="uploadForm.data"
									:name="uploadForm.name"
									:on-success="onSuccess"
									:max-size="2048"
									:on-exceeded-size="handleMaxSize"
									:on-format-error="handleFormatError"
								>
									<div class="upCircle">
										<Icons type="xinzeng" size="30" color="#cccccc" class="ml10 ib mt8" />
									</div>
								</Upload>
								<div class="demo-upload-list" v-if="!showimg1">
									<img :src="formKey.imgUrl1" />
									<div class="demo-upload-list-cover">
										<Icon type="ios-trash-outline" @click.native="handleRemove1()" size="26"></Icon>
									</div>
								</div>
							</div>
						</FormItem>
						<!-- 第二个 -->
						<FormItem prop="imgUrl2" class="fl" v-if="showOne">
							<div class="upBox fl" style="margin-left:-40px">
								<Upload
									v-if="showimg2"
									v-model="formKey.imgUrl2"
									:show-upload-list="false"
									:default-file-list="uploadForm.defaultList"
									:headers="uploadForm.headers"
									:action="uploadForm.action"
									:data="uploadForm.data"
									:name="uploadForm.name"
									:on-success="onUploadSuccess"
									:max-size="2048"
									:on-exceeded-size="handleMaxSize"
									:on-format-error="handleFormatError"
								>
									<div class="upCircle">
										<Icons type="xinzeng" size="30" color="#cccccc" class="ml10 ib mt8" />
									</div>
								</Upload>
								<div class="demo-upload-list" v-if="!showimg2">
									<img :src="formKey.imgUrl2" />
									<div class="demo-upload-list-cover">
										<Icon type="ios-trash-outline" @click.native="handleRemove2()" size="26"></Icon>
									</div>
								</div>
							</div>
						</FormItem>
					</div>
					<div class="clearfix">
						<FormItem
							style="width:280px"
							v-if="showOne"
							prop="url1"
							class="fl ml65"
							key="1"
							label="超链接地址1"
						>
							<Input class="w145x" v-model="formKey.url1" placeholder="请输入地址" />
						</FormItem>
						<FormItem v-if="!showOne" label="超链接地址" class="ml20f" key="2">
							<Input class="w475x" v-model="formKey.url1" placeholder="请输入地址" />
							<span class="ml5">(没有可以不填)</span>
						</FormItem>
						<FormItem style="width:280px" class="fl" v-if="showOne" label="超链接地址2" prop="url2">
							<Input class="w145x" v-model="formKey.url2" placeholder="请输入地址" />
						</FormItem>
					</div>
					<FormItem class="pb20">
						<Button
							type="primary"
							:class="showOne==false?'ml100':''"
							class=" ft20 w260x ml120"
							@click.prevent="submit"
						>
							<span>确认保存</span>
						</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
	</div>
</template>
<script>
	import { uploadImg } from "@/api/common";
	import Tables from "@/components/tables";
	import Icons from "@/components/icons";
	import Modals from "@/components/modals";
	import { getToken } from "@/libs/util";
	import {
		electronicImageConfigDetail,
		electronicImageConfigList,
		electronicImageConfigDel,
		electronicImageConfigAdd,
		electronicImageConfigUpt
	} from "@/api/system";
	export default {
		name: "gameUp",
		components: {
			Icons,
			Tables,
			Modals
		},
		data() {
			return {
				showDatas: true,
				newPosition: "",
				newUplist: "",
				name: "",
				path1: "",
				path2: "",
				newId: "",
				showimg1: true,
				showimg2: true,
				formKey: {
					siteId: this.$root.nowSite.id,
					title: "",
					position: "",
					desc_json: "",
					url1: "",
					url2: "",
					imgUrl1: "",
					imgUrl2: ""
				},
				rules: {
					imgUrl1: [
						{
							required: true,
							message: "请上传图片",
							trigger: "change"
						}
					],
					imgUrl2: [
						{
							required: true,
							message: "请上传图片",
							trigger: "change"
						}
					],
					position: [
						{
							required: true,
							message: "请选择上传位置",
							trigger: "change",
							pattern: /.+/
						}
					],
					title: [
						{
							required: true,
							message: "请输入标题",
							trigger: "blur",
							pattern: /.+/
						}
					],
					url1: [
						{
							required: true,
							message: "请输入超链接地址",
							trigger: "blur",
							pattern: /.+/
						}
					],
					url2: [
						{
							required: true,
							message: "请输入超链接地址",
							trigger: "blur",
							pattern: /.+/
						}
					]
				},
				imgSrc: "",
				showOne: true,
				uploadForm: {
					headers: { Authorization: getToken() },
					action: "/api/v2/uploadImg",
					data: { siteId: this.$root.nowSite.id },
					name: "img",
					defaultList: [],
					path: "",
					src: ""
				},
				title: "",
				upList: [
					{ name: "PC热门游戏", value: "pc_hot" },
					{ name: "PC banner", value: "pc" },
					{ name: "IOS banner", value: "ios" },
					{ name: "Android banner", value: "android" },
					{ name: "H5 bannner", value: "h5" }
				],
				table: {
					loading: true,
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					columns: [
						{
							title: "标题",
							key: "title",
							align: "center",
							minWidth: 45
						},
						{
							title: "上传位置",
							key: "position",
							align: "center",
							minWidth: 95,
							tooltip: true,
							render: (h, params) => {
								return h(
									"span",
									this.upList.map(t => {
										if (t.value == params.row.position) {
											return t.name;
										}
									})
								);
							}
						},
						{
							title: "最后编辑人",
							key: "updater",
							align: "center",
							minWidth: 60,
							render: (h, params) => {
								return (
									<span>{params.row.updater ? params.row.updater : "-"}</span>
								);
							}
						},
						{
							title: "最后编辑时间",
							key: "updated_at",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								return <span>{this.$root.unixTime(params.row.updated_at)}</span>;
							}
						},
						{
							title: "操作",
							key: "",
							align: "center",
							minWidth: 95,
							render: (h, params) => {
								return (
									<span>
										<a
											class="mr10"
											onClick={() => {
												this.addImg("edit", params);
											}}
										>
											编辑
										</a>
										<a
											onClick={() => {
												this.onDelete(params);
											}}
										>
											删除
										</a>
									</span>
								);
							}
						}
					],
					data: []
				}
			};
		},
		mounted() {
			const data = { siteId: this.$root.nowSite.id };
			this.getData({ params: data });
		},
		methods: {
			submit() {
				this.$refs.Form.validate(valid => {
					let b = [
						{
							title: this.formKey.title,
							image: this.path1,
							url: this.formKey.url1
						},
						{
							title: this.formKey.title,
							image: this.path2,
							url: this.formKey.url2
						}
					];
					this.formKey.desc_json = JSON.stringify(b);
					const { desc_json, siteId, title, position } = this.formKey;
					const data = {
						desc_json,
						siteId: this.$root.nowSite.id,
						title,
						position
					};
					if (valid) {
						this.$refs.addImg.show();
						if (this.title.includes("新增")) {
							if (data.position != "pc_hot") {
								data.desc_json = JSON.stringify([JSON.parse(data.desc_json)[0]]);
							}
							electronicImageConfigAdd(data, true)
								.then(res => {
									if (res.code == 200 && res.code != undefined) {
										this.$refs.addImg.hide();
										this.$Message.success({ content: "新增成功" });
										this.getData({ params: { siteId: this.$root.nowSite.id } });
									}
								})
								.catch(error => this.$refs.addImg.spinHide());
						} else {
							if (data.position != "PC热门游戏") {
								data.desc_json = JSON.stringify([JSON.parse(data.desc_json)[0]]);
							}
							data.id = this.newId;
							this.upList.forEach(t => {
								if (t.name == data.position) {
									data.position = t.value;
								}
							});

							electronicImageConfigUpt(data, true)
								.then(res => {
									if (res.code == 200 && res.code != undefined) {
										this.$refs.addImg.hide();
										this.$Message.success({ content: "修改成功" });
										this.getData({ params: { siteId: this.$root.nowSite.id } });
									}
								})
								.catch(error => this.$refs.addImg.spinHide());
						}
					}
				});
			},
			handleFormatError() {
				this.$Tip.info({ content: "请上传图片" });
			},
			handleMaxSize() {
				this.$Message.error("上传图片体积最大为2M");
			},
			//热门的第一张
			onSuccess(res) {
				this.showimg1 = false;
				const { path, host, src } = res.data;
				this.path1 = path;
				this.imgSrc = `${host}/${src}`;
				this.formKey.imgUrl1 = this.imgSrc;
			},
			//热门的第二张
			onUploadSuccess(res) {
				this.showimg2 = false;
				const { path, host, src } = res.data;
				this.path2 = path;
				this.imgSrc = `${host}/${src}`;
				this.formKey.imgUrl2 = this.imgSrc;
			},
			//删除第一张
			handleRemove1() {
				this.showimg1 = true;
				this.formKey.imgUrl1 = "";
			},
			//删除第二张
			handleRemove2() {
				this.showimg2 = true;
				this.formKey.imgUrl2 = "";
			},
			//监听上传位置
			changePostion(name) {
				this.title = "新增图片";
				//  this.$refs.Form.resetFields();
				if (name == "pc_hot") {
					this.showOne = true;
				} else {
					this.showOne = false;
				}
			},
			addImg(type, params) {
				if (type == "add") {
					this.$nextTick(() => {
						if (this.newUplist[0].value == "pc_hot") {
							this.showOne = true;
							this.formKey.position = this.newUplist[0].value;
						} else {
							this.formKey.position = this.newUplist[0].value;
							this.showOne = false;
						}
					});
					this.$refs.addImg.show();
				}

				if (type == "edit") {
					this.title = "编辑图片";
					if (params.row.position == "pc_hot") {
						this.showOne = true;
					} else {
						this.showOne = false;
					}

					this.$refs.addImg.spinShow();
					const { id } = params.row;
					this.newId = id;
					const data = {
						siteId: this.$root.nowSite.id,
						id
					};
					electronicImageConfigDetail(data).then(res => {
						if (res.code == 200 && res.code != undefined) {
							this.$refs.addImg.spinHide();
							this.showimg1 = false;
							this.showimg2 = false;
							this.formKey.title = res.data.title;
							this.formKey.url1 = res.data.desc_json[0].url;
							if (res.data.desc_json.length > 1) {
								this.formKey.url2 = res.data.desc_json[1].url;
							}
							this.formKey.imgUrl1 =
								location.origin + res.data.desc_json[0].image_show;
							if (res.data.desc_json.length > 1) {
								this.formKey.imgUrl2 =
									location.origin + res.data.desc_json[1].image_show;
							}

							this.formKey.position = res.data.position;
							this.upList.forEach(t => {
								if (t.value == this.formKey.position) {
									this.formKey.position = t.name;
								}
							});
							this.showDatas = false;
							setTimeout(() => {
								this.showDatas = true;
							}, 100);
							this.$refs.addImg.show();
						}
					});
				} else {
					// this.title = "新增PC热门游戏";
					this.title = "新增图片";
					this.$refs.Form.resetFields();
					this.formKey = {};
					this.showimg1 = true;
					this.showimg2 = true;
				}
			},

			getData(data) {
				this.$root.startTableLoading();
				electronicImageConfigList(data)
					.then(res => {
						if (res.code != undefined && res.code == 200) {
							const { data } = res;
							this.table.data = data;
							this.$root.endTableLoading();
							//重组数据，过滤出2个数组中，不相同的项，组成新的数组
							let c = [];
							this.upList.forEach(m => {
								data.forEach(t => {
									if (m.value == t.position) {
										c.push({ name: m.name, value: t.position });
									}
								});
							});

							this.newUplist = this.upList.filter(item => {
								let m = c.map(k => k.name);
								return !m.includes(item.name);
							});
						}
					})
					.catch(error => this.$root.endTableLoading());
			},
			//删除
			onDelete(params) {
				this.upList.forEach(t => {
					if (t.value == params.row.position) {
						this.newPosition = t.name;
					}
				});
				let text = "您确定删除" + this.newPosition + "?";
				let msg = "删除" + this.newPosition + "成功";
				const data = {
					siteId: this.$root.nowSite.id,
					id: params.row.id
				};
				this.$Tip.confirm({
					content: text,
					onOk: () => {
						electronicImageConfigDel(data, true).then(res => {
							if (res.code != undefined && res.code == 200) {
								this.table.data.splice(params.index, 1);
								this.getData({ params: { siteId: this.$root.nowSite.id } });
								this.$Message.success({ content: msg });
							}
						});
					}
				});
			}
		}
	};
</script>
<style lang="less" scoped>
  @import "../../../../src/styles/button";
	/deep/.ivu-form-item-label {
		width: 110px !important;
	}
	/deep/.ivu-form-item-error-tip {
		margin-left: 10px;
	}
	.upBox {
		width: 230px;
		height: 138px;
		border: 1px solid #cdcdcd;
		background-color: #f9f9f9;
		position: relative;
	}
	.upCircle {
		position: absolute;
		top: 30%;
		left: 40%;
		right: 0;
		bottom: 0;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background-color: #fff;
		border: 1px solid #cdcdcd;
	}

	.demo-upload-list {
		display: inline-block;
		width: 100%;
		height: 100%;
		text-align: center;
		line-height: 140px;
		overflow: hidden;
		background: #fff;
		position: relative;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
	}
	.demo-upload-list img {
		width: 100%;
		height: 100%;
	}
	.demo-upload-list-cover {
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.6);
	}
	.demo-upload-list:hover .demo-upload-list-cover {
		display: block;
	}
	.demo-upload-list-cover i {
		color: #fff;
		font-size: 1.25rem /* 20/16 */;
		cursor: pointer;
	}
</style>