<template>
	<div style="height: 100%">
		<Layout style="height: 100%" class="main">
			<Header class="header-con">
				<header-bar @on-close-all="handleCloseTag" ref="headerBar">
					<notice :notice="notice" :newStr="newStr" />
					<user />
					<sy-log
						:messageCount="messageCount"
						v-if="adminType == 'super' || authInPage.indexOf('inBox') != -1"
					/>
					<fullscreen v-model="isFullscreen" style="margin-right: 10px;" />
				</header-bar>
			</Header>
			<Layout>
				<Sider
					hide-trigger
					collapsible
					:width="screen==1440?210:180"
					:collapsed-width="50"
					v-model="collapsed"
					class="left-sider"
					:style="{overflow: 'hidden'}"
				>
					<side-menu
						accordion
						ref="sideMenu"
						:active-name="$route.name"
						:collapsed="collapsed"
						@on-select="turnToPage"
						:menu-list="menuList"
					>
						<!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
						<div class="logo-con">
							<span
								v-show="!collapsed"
								class="ft20"
								style="color:#fff"
							>{{allRoutes[activeMenu].meta.title}}</span>
							<Icons @click.native="handleCollapsedChange" :type="expandIcon" style="color:#fff" />
						</div>
					</side-menu>
				</Sider>
				<Content class="main-content-con">
					<Layout class="main-layout-con">
						<div class="tag-nav-wrapper" :style="style2">
							<tags-nav
								:value="$route"
								@input="handleClick"
								:list="tagNavList"
								@on-close="handleCloseTag"
							/>
						</div>
						<Content :class="[screen >1760 ? 'content-wrapper minh' : 'content-wrapper']" :style="style">
							<member-add-sub-money />
							<keep-alive :include="cacheList" :exclude="notCacheList">
								<router-view :key="$route.fullPath + '-' + nowSite.siteCode" />
							</keep-alive>
							<ABackTop :height="100" :bottom="80" :right="10" :duration="0" container=".content-wrapper"></ABackTop>
							<audio
								controls="controls"
								muted="muted"
								:loop="play.deposit_offline"
								style="display:none"
								ref="deposit_offline"
							>
								<source src="../../assets/audio/kai-jiang.mp3" type="audio/mpeg" />
							</audio>
							<audio
								controls="controls"
								muted="muted"
								:loop="play.withdrawals"
								style="display:none"
								ref="withdrawals"
							>
								<source src="../../assets/audio/backcash.mp3" type="audio/mpeg" />
							</audio>
						</Content>
					</Layout>
				</Content>
			</Layout>
		</Layout>
		<Modals
			v-if="rentType!='rent'"
			ref="modals"
			title="系统通知"
			width="600"
			@modalVisible="modalChange(arguments)"
		>
			<div slot="content" class="modal-overflow w480x">
				<div class="w480x ml60">
					<p class="txt-a ft16">{{countTitle}}</p>
					<p class="pt20 txt-a ft14">{{countTime}}</p>
					<div v-if="countImg" class="pt20 txt-a ma w300x h300">
						<img style="width:100%;heigth:100%" :src="countImg" />
					</div>
					<p class="mt20 ft14 mb20 breakWord">{{countContent}}</p>
				</div>
			</div>
		</Modals>
	</div>
</template>
<script>
	import SideMenu from "./components/side-menu";
	import HeaderBar from "./components/header-bar";
	import TagsNav from "./components/tags-nav";
	import User from "./components/user";
	import ABackTop from "./components/a-back-top";
	import Fullscreen from "./components/fullscreen";
	import SyLog from "./components/sy-log";
	import Cookies from "js-cookie";
	import Icons from "@/components/icons";
	import Modals from "_c/modals";
	import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
	import {
		getNewTagList,
		routeEqual,
		getMenuByRouter,
		getToken,
		setStage,
		getStage,
		isRefreshToken,
		getUserType
	} from "@/libs/util";
	import { adminMassageUp } from "@/api/system";
	import routers from "@/router/routers";
	import allRoutes from "@/router/routes";
	import { remind, refreshToken } from "@/api/common";
	import Notice from "./components/header-notice/notice";
	import "./main.less";
	import itemMixin from "./components/side-menu/item-mixin";
	import memberAddSubMoney from "@/views/member/memberAddSubMoney.vue";
     import advReport from "@/views/report/activity_data/advReport.vue";
	export default {
		name: "Main",
		components: {
			SideMenu,
			HeaderBar,
			TagsNav,
			Fullscreen,
			SyLog,
			User,
			ABackTop,
			Icons,
			Notice,
			memberAddSubMoney,
			Modals,
			advReport
		},
		data() {
			return {
				newStr:'',
				rentType: localStorage.loginType,
				countTitle: "",
				countTime: "",
				countContent: "",
				countImg: "",
				newImg: "",
				contentMessage: "",
				adminMassage: [],
				style: screen.width < 1600 ? "padding:15px !important" : "",
				style2: screen.width < 1600 ? "margin:10px 15px 0 15px !important" : "",
				adminType: getUserType(),
				authInPage: JSON.parse(localStorage.authInPage),
				screen: screen.width,
				collapsed: false,
				isFullscreen: false,
				allRoutes: allRoutes,
				messageCount: 0, // 未读信息数量,
				timer: null,
				notice: "",
				play: {
					deposit_offline: false,
					withdrawals: false
				}
			};
		},
		computed: {
			...mapState({
				nowSite: state => state.user.nowSite,
				tagNavList: state => state.app.tagNavList,
				activeMenu: state => state.app.activeMenu,
				addSubMoney: state => state.app.addSubMoney,
				passwordStatus:state=>state.app.passwordStatus,
				activeMenu: state => state.app.activeMenu,
				allMenu: state => state.app.allMenu,
				authMenu: state => state.user.authMenu
			}),
			notCacheList() {
				return [
					this.$route.meta && this.$route.meta.notCache ? this.$route.name : ""
				];
			},
			cacheList() {
				const list = [
					...(this.tagNavList.length
						? this.tagNavList
								.filter(item => !(item.meta && item.meta.notCache))
								.map(item => item.name)
						: [])
				];
				return list;
			},
			menuList() {
				let isLength = Object.keys(this.$store.state.app.allMenu).length;
				if (isLength) {
					const activeMenu = this.$store.state.app.activeMenu;
					let menu = this.$store.state.app.allMenu[activeMenu].children;
					return getMenuByRouter(menu.length && menu);
				}
			},
			expandIcon() {
				return this.collapsed ? "cebianlanzhankai" : "cebianlanshouqi";
			},
			token() {
				return getToken();
			}
		},
		beforeDestroy() {
			clearInterval(this.timer);
			this.timer = null;
		},
		watch: {
			$route: {
				handler(newRoute) {
					const { name, query, params, meta, path } = newRoute;
					this.addTag({
						route: { name, query, params, meta, path },
						type: "push"
					});
					this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
					this.$refs.sideMenu.updateOpenName(newRoute.name);
				},
				deep: true
			},
			"$root.nowSite.id"(val) {
				let list = JSON.parse(this.authMenu);
				list.forEach(t => {
					if (t.menu_name == "会员管理") {
						for (let key in t.list) {
							if (
								key == "member_wage_config_list" ||
								key == "member_profit_config_list"
							) {
								if (this.$root.modeName() == "mode_c")
									t.list[key] = t.list[key].includes("hide")
										? ""
										: t.list[key] + ":hide";
								else
									t.list[key] = t.list[key].includes("hide")
										? t.list[key].split(":")[0]
										: t.list[key];
							}
							if (key == "refund_commission_wage_profit")
								t.list[key] =
									this.$root.modeName() == "mode_c" ? "返佣" : "返佣/工资/分红";
						}
					}
					if (t.menu_name == "财务管理") {
						for (let key in t.list) {
							if (
								key == "send_agency_share_out_bonus" ||
								key == "send_agency_wage"
							) {
								if (this.$root.modeName() == "mode_c")
									t.list[key] = t.list[key].includes("hide")
										? ""
										: t.list[key] + ":hide";
								else
									t.list[key] = t.list[key].includes("hide")
										? t.list[key].split(":")[0]
										: t.list[key];
							}
						}
					}
				});
				this.setAuthMenu(JSON.stringify(list));
			}
		},
		mounted() {
			let that = this;
			/**
			 * @description 初始化设置面包屑导航和标签导航
			 */
			this.setTagNavList();
			this.setHomeRoute(routers);
			const { name, params, query, meta, path } = this.$route;
			this.addTag({
				route: { name, params, query, meta, path }
			});
			// 设置初始语言
			// 如果当前打开页面不在标签栏中，跳到homeName页
			if (!this.tagNavList.find(item => item.name === this.$route.name)) {
				this.$router.push({
					name: this.$config.homeName
				});
			}
			window.addEventListener("resize", () => {
				if (document.documentElement.clientWidth <= 1470) this.collapsed = true;
			});
			// 定时发送remind请求
			this.remindInterval();
		},
		methods: {
			...mapMutations([
				"setFlag",
				"setActiveMenu",
				"setTagNavList",
				"addTag",
				"setHomeRoute",
				"closeTag",
				"showAddSubMoney",
				"showPasswordAdvModals",
				"refreshMenuItem",
				"setNowActive",
				"setToken",
				"setAuthMenu",
				"setCollapsed"
			]),
			...mapActions(["handleLogin", "handleLogOut"]),
			//点击菜单
			turnToPage(route) {
				let { name, params, query, path } = {};
			
				if (route === "memberSearchFunds") {
				
					this.showAddSubMoney(!this.addSubMoney);
					return;
				}
				if (typeof route === "string") name = route;
				else {
					name = route.name;
					params = route.params;
					query = route.query;
					path = route.path;
				}
				this.refreshMenuItem(route);
				if (name.indexOf("isTurnByHref_") > -1) {
					window.open(name.split("_")[1]);
					return;
        }
        //三级菜单默认跳转到对应的页面
				this.menuList.forEach(t => {
					if (name == t.name) {
						if (t.children) {
							if (t.children.length == 1) {
								t.children.forEach(m => {
									name = m.name;
									this.$router.push({ name, params, query, path });
								});
							} else if (t.children.length > 1) {
								this.$router.push({ name, params, query, path });
							}
						} else {
							this.$router.push({ name, params, query, path });
						}
					} else {
						this.$router.push({ name, params, query, path });
					}
				});
			},
			modalChange(value) {
				let flag = value[0];
				this.setFlag(flag);
			},
			handleCollapsedChange() {
				this.collapsed = !this.collapsed;
			},
			// 关闭窗口
			handleCloseTag(res, type, route) {
				if (type !== "others") {
					if (type === "all") {
						this.turnToPage(this.$config.homeName);
					} else {
						if (routeEqual(this.$route, route)) {
							this.closeTag(route);
						}
					}
				}
				this.setTagNavList(res);
			},
			handleClick(item) {
				this.setActiveMenu(item);
				this.turnToPage(item);
			},
			// 获取公告信息
			getRemind() {
				let str = "";
				remind({ siteId: this.$root.nowSite.id }).then(res => {
					if (res != undefined && res.data) {
					
						if (res.data.adminMassage) {
						
							this.adminMassage = res.data.adminMassage;
							this.contentMessage = this.adminMassage.content;
							if (this.contentMessage != undefined) {
								localStorage.countMessage = JSON.stringify(this.adminMassage);
								const { created_at, content, title } = JSON.parse(
									localStorage.countMessage
								);
								this.countTime = this.$root.unixTime(created_at);
								this.countTitle = this.$root.trimString(title);
								this.countContent = this.$root.trimPhtml(content);
								this.countImg = this.$root.trimImg(content);
							}
							if (this.adminMassage.length == undefined) {
								if (this.rentType != "rent") {
									this.$refs.modals.show();
									const data = { id: this.adminMassage.id };
									adminMassageUp(data, true);
								}
							}
							this.refreshToken();
							this.messageCount = res.data.data.filter(
								item => item.code == "message"
							)[0]
								? res.data.data.filter(t => t.code == "message")[0].count
								: 0;
								this.newStr=res.data.data;
							for (let item of res.data.data) {
								// if (item.code !== "message") {
								// 	str += `${item.name}: ${item.count}条 `;
								// 	console.log(str)
								// }
								if (item.code=="deposit_offline") {
									this.playSound("deposit_offline");
								}
								if (item.code=="withdrawals") {
									this.playSound("withdrawals");
								}
								
              }
              if(res.data.data.balance==0){
				
                 this.notice = str+`信用额度￥${res.data.data.balance}`;
              }else{
			
                this.notice=str
              }
						}
					}
				});
			},
			// 根据remind返回信息播放音乐
			playSound(arg) {
				if (typeof arg === "string") {
					this.$refs[arg].load();
					this.play[arg] = true;
					setTimeout(() => {
						this.play[arg] = false;
					}, 5000);
					let playPromise = this.$refs[arg].play();
					if (playPromise !== undefined) {
						playPromise
							.then(() => {
								this.play[arg] = true;
								setTimeout(() => {
									this.play[arg] = false;
								}, 5000);
								this.$refs[arg].play();
							})
							.catch(() => {});
					}
				}
			},
			// 根据remind接口在token即将过期时刷新token
			refreshToken() {
				if (isRefreshToken()) {
					refreshToken(true).then(res => {
						if (res != undefined && res.code == 200) {
							this.setToken(res.data);
						}
					});
				}
			},
			// 定时请求
			remindInterval() {
				clearInterval(this.timer);
				this.timer = null;
				this.getRemind();

				this.timer = setInterval(() => {
					this.getRemind();
				}, 15000);
			}
		}
	};
</script>

<style lang="less" scoped >
	@import "./main.less";
</style>

