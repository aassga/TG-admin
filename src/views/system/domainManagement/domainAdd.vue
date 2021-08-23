<template>
	<div>
		<!-- 新 -->
		<div>
			<Form ref="addForm" :label-width="85" :model="addForm" :rules="addFormRules">
				<FormItem label="域名类型">
					<Select class="w260x" @on-change="changeDomain" v-model="addForm.domainTransform">
						<Option value="1">代理域名</Option>
						<Option value="2">大股东域名</Option>
					</Select>
				</FormItem>
				<FormItem label="代理账号" v-if="showInput">
					<AutoSearch
						:placeholder="'代理账号,默认查询'"
						:clearable="false"
						:siteId="$root.nowSite.id"
						@changeShow="changeShow"
						@sendSuperior="getSuperior"
						@sendResult="getResult"
						@sendId="getId"
					></AutoSearch>
				</FormItem>
				<FormItem label="大股东账号" prop="uname" v-if="!showInput">
					<!-- <Input v-model="batchForm.uname" class="w260x" placeholder="请输入大股东账号"/> -->
					<Select
						v-model="addForm.uname"
						class="w260x"
						placeholdeer="请选择大股东账号"
						@on-change="changeStrong"
					>
						<Option v-for="(t,i) in batchList" :key="i" :value="t.userName">{{t.userName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="域名信息" prop="domain">
					<Input
						type="textarea"
						v-model="addForm.domain"
						class="w260x"
						:autosize="{minRows: 2, maxRows: 4}"
						:rows="4"
						placeholder="可批量添加，一行一个，如：xxx.com      yyy.com"
					/>
					 <Checkbox v-model="addForm.is_auto_www" style="margin-top:-5px" class="ml10">自动添加www域名</Checkbox>
              </FormItem>
				<FormItem label="域名描述" prop="domain_description" key="domain_description">
				<Input placeholder="如 主域名/推广域名" v-model="addForm.domain_description"	class="w260x"/>
				</FormItem>
				<FormItem label="域名分组"  key="group_id">
					<Select class="w260x" v-model="addForm.group_id" clearable >
					<Option v-for="(t,i) in domainSumList" :key="i" :value="t" >{{t}}</Option>
					</Select>
				</FormItem>
				<FormItem label="开放等级"  key="level_label">
					<Select class="w260x" v-model="addForm.level_label" @on-change="levelChange" multiple clearable >
					<Option v-for="(t,i) in openLevelList" :key="i" :value="t.levelLabel" >{{t.levelAlias}}</Option>
					</Select>
				</FormItem>
				  <FormItem label="注册层级" class="registerLevel" >
            <!-- <div class="ib"> -->
              <Select class="w260x registerLevel" v-model="addForm.register_level" @on-change="registerChange">
              <Option v-for="(t,i) in openLevelList" :key="i" :value="t.levelLabel" >{{t.levelAlias}}</Option>
             </Select>
            <!-- </div> -->
				</FormItem>
				<FormItem label="是否证书">
				<Select class="w260x" v-model="addForm.domain_certificate">
					<Option value="yes">是</Option>
					<Option value="no">否</Option>
				</Select>
				</FormItem>
				<FormItem label="下级类型">
					<Select class="w260x" v-model="addForm.is_agency" :disabled="disabled">
						<Option value="0">会员</Option>
						<Option value="1">代理</Option>
					</Select>
				</FormItem>
				<FormItem label="状态">
					<Select v-model="addForm.status" class="w260x">
						<Option value="yes">开启</Option>
						<Option value="no">关闭</Option>
					</Select>
               </FormItem>
				<FormItem class="clearfix">
				<Checkbox v-model="addForm.checkDomain">
								<span>域名检测</span>
							</Checkbox>
							<Poptip trigger="hover" content="选中后会自动检测域名是否正常" placement="right-end">
								<Icons type="bangzhutishi" color="#E4E4E4" :size="20"></Icons>
							</Poptip>
				<Checkbox v-model="addForm.is_fast" class="ml50">
								<span>域名加速</span>
								<Poptip trigger="hover" content="选中后app会优先选择此域名" placement="right-end">
									<Icons type="bangzhutishi" color="#E4E4E4" :size="20"></Icons>
								</Poptip>
							</Checkbox>
				</FormItem>
				<div v-show="rebateShow && $root.checkCommission()">
					<rebateSelect
						ref="rebateSelect"
						:editable="editable"
						:data="rebate"
						@on-rebate-change="onRebateChange"
					></rebateSelect>
					<refundSelect
						ref="refundSelect"
						:editable="editable"
						:data="refund"
						@on-refund-change="onRefundChange"
					></refundSelect>
				</div>
				<FormItem>
					<Button type="primary" class=" ivu-btn submit bg mt10" :loading="$root.editBtnLoading" style="width:260px" @click.prevent="submit('single')">确认添加</Button>
				</FormItem>
			</Form>
		</div>
	</div>
</template>
<script>
	import { mapState } from 'vuex'
	import rebateSelect from "@/components/rebate-select";
	import refundSelect from "@/components/refund-select";
	import AutoSearch from "@/components/auto-search";
	import { agencyGetName } from "@/api/agency";
	import Icons from "_c/icons";
	import { agencyDomainCreate,domainGroupList } from "@/api/system";
	import { getMemberLevelData } from "@/api/member"
	import {
		agencyRebatePlatform,
		agencyDomainAddBatch,
		agencyDomainAdd
	} from "@/api/agency";
	export default {
		name: "addDomain",
		components: {
			rebateSelect,
			refundSelect,
			AutoSearch,
			Icons
		},
		data() {
			return {
				is_auto_www:true,
				openLevelList:[],
				domainSumList:[],
				StrongUid: "",
				newUid: "",
				showInput: true,
				batchList: [],
        		disabled: false,
				addForm: {
					
					domain:'',
					is_auto_www:true,
					domain_description:'',
					group_id:'',
					domain_certificate:"yes",
					domainTransform: "1",
					status: "yes",
					uname: "",
					checkDomain: false,
					is_fast:false,
					level_label:'',
					register_level:'',
					is_agency:
						this.$route.query.stage == "single"
							? this.$root.checkCommission()
								? "1"
								: "0"
							: "1"
				},
				addFormRules: {
					group_id:[{required: true, message: "请选择域名分组", trigger: "change" }],
					domain: [{ required: true, message: "请输入域名", trigger: "blur" }
						// { pattern: /^([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, message: '请输入正确的域名', trigger: 'blur'}
					],
                 domain_description:[{required:true,message:"请输入域名描述",trigger:"blur"}]
				},
				// batchForm: {
				// 	checkDomain: false,
				// 	is_fast:false,
				// 	is_agency:
				// 		this.$route.query.stage == "single"
				// 			? this.$root.checkCommission()
				// 				? "1"
				// 				: "0"
				// 			: "1"
				// },
				// batchFormRules: {
				// 	uname: [
				// 		{
				// 			required: true,
				// 			message: "请选择大股东账号",
				// 			trigger: "change"
				// 		}
				// 	],
				// 	urlstr: [
				// 		{
				// 			required: true,
				// 			message: "请输入域名",
				// 			trigger: "blur"
				// 		},
				// 		{
				// 			message: "请输入域名",
				// 			// message: "请检查您填写的域名格式,并以英文分号;结束",
				// 			// pattern: /^(([a-zA-Z\d]*[a-zA-Z\d-_]{1,15}\.)+([a-zA-Z\d-_][^ ]{1,5}\;))*$/,
				// 			trigger: "blur"
				// 		}
				// 	]
				// },
				rebateShow: false,
				rebate: [],
				refund: {},
				editable: true
			};
		},
		// 针对大股东 都能编辑
		// beforeRouteEnter(to, from, next) {
		//   next(vm => {
		//     if (!vm.$root.checkCommission() && vm.$route.query.stage == 'batch') vm.editable = true //b模式大股东可调
		//     if (!vm.$root.checkCommission() && vm.$route.query.stage == 'single') vm.editable = false
		//   })
		// },
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.disabled = vm.$root.modeName() == "no" ? false : true;
			});
		},
		mounted() {
			this.$Message.config({
				top: 50,
				duration: 1
			});
			// 批量添加大股东
			if (this.$route.query.stage != "single") {
				let data = {
					type: "shareholder",
					content: this.$root.nowSite.id,
					siteId: this.$root.nowSite.id
				};
				agencyGetName(data).then(res => {
					this.batchList = res.data;
				});
			}
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
			  registerChange(val){
      this.addForm.register_level=val;

    },
			levelChange(val){
				this.levelList = val.join(',');
			},
			// 获取开放等级
			getOpenLevel(data){
				getMemberLevelData(data).then(res=>{
					if(res!=undefined && res.code == 200){
						this.openLevelList = res.data;
					}
				})
			},
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
			changeStrong(val) {
        let postData={siteId:this.$root.nowSite.id,uname:val}
        this.getRebateSetting(postData);
				let id = [];
				let d = this.batchList.filter(k => {
					if (k.userName == val) {
						id.push(k.id);
					}
				});
				this.StrongUid = String(id);
			},
			changeDomain(name) {
				//代理域名
				if (name == 1) {
					this.showInput = true;
				}
				//大股东域名
				if (name == 2) {
					this.showInput =false;
				}
			},
			changeShow(flag) {
				this.rebateShow = flag;
			},
			getId(val) {
				this.newUid = val;
			},
			getResult(val) {
				if (val == "") {
					this.addForm.uname = "";
				}
			},
			// input搜索框
			getSuperior(value) {
				this.addForm.uname = value;
				this.rebateShow = true;
				let postData = {
					uname: value,
					siteId: this.$root.nowSite.id
				};
				this.getRebateSetting(postData);
			},
			// 获取返点/返水数据
			getRebateSetting(data) {
				agencyRebatePlatform(data).then(res => {
					let { rebate, platform } = res.data;
					rebate.forEach(item => {
						item.parent_rebate = item.rebate;
					});
					this.rebate = rebate;
					for (let i in platform) {
						platform[i].list.forEach(item => {
							item.parent_refund = Number(item.value);
							item.name_cn = item.name;
							item.name_en = item.key;
							item.refund = item.value;
						});
					}
					this.refund = platform;
					this.rebateShow = true;
				});
			},
			onRebateChange(res) {
        // console.log(res)
				this.addForm.rebate = res;
			},
			onRefundChange(res) {
				this.addForm.refund = res;
			},
			submit() {
				//console.log(this.addForm)
				this.$root.startEditLoading();
				this.$refs.addForm.validate(valid => {
	
					if (valid) {

				
					if (!this.addForm.uname) {
						this.$Tip.info({ content: "请输入代理账号" });
						return false;
					}
					// 	if (!this.addForm.register_level) {
					// 	this.$Tip.info({ content: "请选择注册层级" });
					// 	return false;
					// }
					if (!this.addForm.rebate) {
						this.addForm.rebate = this.$refs.rebateSelect.createData();
					}
					if (!this.addForm.refund) {
						this.addForm.refund = this.$refs.refundSelect.createData();
					}
					
					this.addForm.level_label = this.levelList;
					let postData = {
						...this.addForm,
						uid: this.newUid || this.StrongUid,
						siteId: this.$root.nowSite.id
					};
					if (postData.uid == "") {
						return false;
					}
					for (let key in postData) {
						if (!postData[key]) delete postData[key];
					}

					postData.checkDomain = postData.checkDomain ? "yes" : "no";
					postData.is_auto_www=postData.is_auto_www?'yes':'no';
          			postData.is_fast = postData.is_fast?"yes":"no";
					agencyDomainCreate(postData, true).then(res => {
						if (res == "undefined") return false;
						if (res != undefined && res.code == 200) {
							this.$root.endEditLoading();
							const { exists } = res.data;
							if (exists != "") {
								let msg = `其中【${exists}】已绑定代理，同一个域名不能绑定多个代理`;
								this.$Tip.confirm({
									content: msg,
									onOk: () => {
										this.goAgencyDomain()
									}
								});
							} else {
								if (postData.rebate != "{}" && postData.refund != "{}") {
									this.$Message.success("添加代理域名成功");
								}
							}

							if (postData.rebate == "{}" && postData.refund == "{}") {
								this.$Message.success("添加大股东域名成功");
							}
							this.goAgencyDomain();
						}
					});
							
				}
				});
			},
			// 新增成功返回域名列表页
			goAgencyDomain() {
				this.$router.push({ name: "agencyDomain" });
			}
		}
	};
</script>
<style lang="less" scoped>
	@import "../../../styles/button.less";
	/deep/.ivu-form-item-error-tip {
		top: 5px;
		left: 260px;
		width: 400px;
	}
	
	// .registerLevel{
	// 	/deep/.ivu-form-item-label{
	// 		margin-left:-14px;
	// 		width: 100px!important;
	// 	}
	// }
</style>


