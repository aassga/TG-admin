<template>
	<div>
		<div class="content mt20" style="position: relative" >
			<Spin fix size="small" v-if="spin"></Spin>
			<div class="top ml35 ib">
				<Input
					v-model="searchWord"
					placeholder="关键字查询"
					class="w415x"
					@input="search($event)"
				>
					<Icon type="ios-search" slot="prefix" />
				</Input>
			</div>
			<div style="height: 480px; overflow-y: auto">
				<div
					v-for="(item, key, index) in allSiteListNew"
					v-if="item.siteCount && item.siteCount > 0"
					:key="index"
					class="pl35"
				>
					<div class="ft16 mt10">
						<span class="ib">
							<checkbox
								class="ft16"
								:indeterminate="item.indeterminate"
								@on-change="(val) => checkAll(item, val)"
								v-model="item.checked"
								>{{
									item.name == "yunbo"
										? "云博"
										: item.name == "lottery"
										? "彩票"
										: "包网"
								}}</checkbox
							>
						</span>
						<p class="pl5 ib">(站点{{ item.siteCount }})</p>
					</div>
					<ul class="clearfix ft14">
						<li v-for="(t, i) in item.list" :key="i" class="fl pl10 box">
							<checkbox
								@on-change="(val) => checkOne(item, t, val)"
								v-model="t.checked"
              >
              <!-- {{t.checked}} -->
								{{ t.siteName }}</checkbox
							>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Icons from "_c/icons";
	import Modals from "_c/modals";
	import { mapState } from "vuex";
	import{customSiteItems}  from '@/api/common';
	export default {
		components: { Icons, Modals },
		props: {
			title: {
				type: String,
				default: "请选择站点",
			},
			siteCount: {
				yunbo: null,
				lottery: null,
				cover_network: null,
				custom_site: null,
			}, //站点数量
		},
		data() {
			return {
				searchData: [],
				searchWord: "", //搜索关键字
				spin: false,
				allSiteListNew: [],
				newData: [],
				accessSite:[],
				allSiteList: {
					yunbo: [],
					lottery: [],
					cover_network: [],
				}, //所有站点,
			};
		},
		mounted() {
			customSiteItems().then(res=>{
						if(res!=undefined&&res.code==200){
							 const { site_list } = res.data;
							 this.accessSite=site_list;
							 this.getData();
						}
					})
        

		},
		// computed:{
		// 	...mapState({
		// 		accessSite:(state)=>state.user.accessSite,
		// 	})

		// },
		methods: {
			getData() {
				for (let key in this.allSiteList) {
					this.accessSite&&this.accessSite.forEach((item) => {
						if (key == item.site_class) {
							this.allSiteList[key].push(item);
						}
					});
				}

				for (let key in this.allSiteList) {
					let e = {};
					let count = 0;
					e.name = key;

					e.list = this.allSiteList[key].filter(
						(x, index, self) => self.indexOf(x) === index
					);
          e.siteCount = this.allSiteList[key].length;

					if (e.list) {
						e.list.forEach((t) => {
							t.checked = false;
						});
					}
					this.allSiteListNew.push(e);
					this.newData.push(e);
				}
				this.allSiteListNew = this.allSiteListNew.filter(
					(x, index, self) => self.indexOf(x) === index
		);
		console.log(this.allSiteListNew)
        // localStorage.list=JSON.stringify(this.allSiteListNew);
			},
			checkAll(parent, val) {
        // this.$forceUpdate();

				this.$set(parent, "checked", val);
				this.$set(parent, "indeterminate", false);

				parent.list.forEach((m) => {
					//编辑的时候默认，假如
					if (m.allow_chk) {
						if (m.allow_chk == "yes") {
							this.$set(m, "checked", val);
						}
					} else {
						this.$set(m, "checked", val);
					}
				});
        this.$emit("getChicked", this.allSiteListNew, "all");
			},
			checkOne(parent, t, val) {

				this.$set(t, "checked", val);
				let count = 0;
				parent.list.forEach((m) => {


         if (m.checked) count++;

				});
				if (count) {
					if (count < parent.list.length) {
						this.$set(parent, "checked", false);
						this.$set(parent, "indeterminate", true);
					} else {
						this.$set(parent, "checked", true);
						this.$set(parent, "indeterminate", false);
					}
				} else {
					this.$set(parent, "checked", false);
					this.$set(parent, "indeterminate", false);
        }
          this.$emit("getChicked", this.allSiteListNew, "one");
             this.$forceUpdate();
			},
			search() {

        let search = event.data;

				if (search) {
					let m = [];

					this.allSiteListNew.forEach((t) => {
						let v = {};
						this.searchData = t.list.filter(function (product) {
							// 每一项数据
							return Object.keys(product).some(function (key) {
								// 每一项数据的参数名
								return (
									String(product[key]) // toLowerCase() 方法用于把字符串转换为小写。
										.toLowerCase() // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
										.indexOf(search) > -1
								);
							});
						});

						v.name = t.name;
						v.list = this.searchData;
            v.siteCount = v.list.length;

						m.push(v);
					});

          this.allSiteListNew = m;
					// this.$forceUpdate();
				} else {
					this.allSiteList.yunbo = [];
					this.allSiteList.lottery = [];
          this.allSiteList.cover_network = [];
					this.allSiteListNew = this.newData.filter(
						(x, index, self) => self.indexOf(x) === index
					);
				}
			},
		},
	};
</script>
<style lang="less" scoped>
	@import "../../styles/color.less";
	@import "../../styles/button.less";

	/deep/.ivu-modal-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		.ivu-modal {
			top: 0;
			margin: 0;
		}
	}
	/deep/.ivu-modal-content {
		overflow: hidden;

		.ivu-modal-body {
			padding: 0;
		}
		.ivu-modal-header {
			padding: 0;
			.header {
				height: 50px;
				line-height: 50px;
				text-align: center;
				font-size: 1.4375rem;
				color: #fff;
				background: @btnColor;
			}
		}
		.ivu-modal-close {
			top: 0;
		}
		.ivu-modal-footer {
			display: none;
		}
	}
	.lh50 {
		line-height: 50px;
	}

	.box {
		border-radius: 5px;
		line-height: 30px;
		height: 30px;
		border: 1px solid #dcdcdc;
		margin-right: 15px;
		margin-top: 15px;
		width: 150px;
	}
</style>
