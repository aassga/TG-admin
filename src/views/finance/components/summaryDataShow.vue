<template>
	<div class="mt20" style="[v-cloak] {display: none;}" v-cloak>
		<div class="clearfix">
			<div class="fl w24 bl bb br bt mr15" v-if="tableData.deposit.total>0">
				<div class="f6f8-bg bb clearfix">
					<span class="ib pt12 pb12 pl20">{{tableData.deposit.name}}</span>
					<div class="fr pt12 pb12 ib mr20 red-font">
						<span class="ib pl20 cs" >{{tableData.deposit.total}}</span>
					</div>
				</div>
				<ul class="middle-con ft14">
					<li class="bb" v-for="(t,i) in tableData.deposit.list" :key="i" v-if="Number(t.total) > 0">
						<span class="ib pt12 pb12 pl20">
							<span class="ib box mr5" :class="i<5||i==0?'ss'+(i+1):i>=5&&i<10?'ss'+(i-4):'ss'+(i-9)"></span>
								{{t.name}}
						</span>
						<div class="fr pt12 pb12 ib mr20 blue-font">
							<span class="ib pl20">{{t.total}}</span>
						</div>
					</li>
				</ul>
			</div>
			<div class="fl w24 bl bb br bt mr15" v-if="tableData.withdrawals.total>0">
				<div class="f6f8-bg bb clearfix">
					<span class="ib pt12 pb12 pl20">{{tableData.withdrawals.name}}</span>
					<div class="fr pt12 pb12 ib mr20 red-font">
						<span class="ib pl20 cs" >{{tableData.withdrawals.total}}</span>
					</div>
				</div>
				<ul class="middle-con ft14">
					<li class="bb" v-for="(t,i) in tableData.withdrawals.list" :key="i" v-if="Number(t.total) > 0">
						<div :class="t.name=='现金利润'||t.name=='打码倍数'?'f6Color':''">
							<span class="ib pt12 pb12 pl20">
								<span class="ib box mr5"  :class="i<5||i==0?'ss'+(i+1):i>=5&&i<10?'ss'+(i-4):'ss'+(i-9)"></span>
									<!-- <span>{{roundNum}}</span> -->
									{{t.name}}
							</span>
							<div class="fr pt12 pb12 ib mr20 blue-font">
								<span class="ib pl20">{{t.total}}</span>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="fl w24 bl bb br bt mr15" v-if="tableData.bonus.total!=0">
				<div class="f6f8-bg bb clearfix">
					<span class="ib pt12 pb12 pl20">{{tableData.bonus.name}}</span>
					<div class="fr pt12 pb12 ib mr20 red-font">
						<span class="ib pl20 cs" >{{tableData.bonus.total}}</span>
					</div>
				</div>
				<ul class="middle-con ft14">
					<li class="bb" v-for="(t,i) in tableData.bonus.list" :key="i" v-if="Number(t.total) !=0">
							<span class="ib pt12 pb12 pl20">
								<span class="ib box mr5" :class="i<5||i==0?'ss'+(i+1):i>=5&&i<10?'ss'+(i-4):'ss'+(i-9)"></span>
								{{t.name}}
							</span>
							<div class="fr pt12 pb12 ib mr20 blue-font">
								<span class="ib pl20">{{t.total}}</span>
							</div>
					</li>
				</ul>
			</div>
			<div class="fl w24  br  mr15">
				<div v-if="tableData.commission.total>0">
					<div class="f6f8-bg bb bl bt clearfix">
						<span class="ib pt12 pb12 pl20">{{tableData.commission.name}}</span>
						<div class="fr pt12 pb12 ib mr20 red-font">
							<span class="ib pl20 cs" >{{tableData.commission.total}}</span>
						</div>
					</div>
					<ul class="middle-con ft14">
						<li class="bb" v-for="(t,i) in tableData.commission.list" :key="i" v-if="Number(t.total) > 0">
							<span class="ib pt12 pb12 pl20">
								<span class="ib box mr5" :class="i<5||i==0?'ss'+(i+1):i>=5&&i<10?'ss'+(i-4):'ss'+(i-9)"></span>
									{{t.name}}
							</span>
							<div class="fr pt12 pb12 ib mr20 blue-font">
								<span class="ib pl20">{{t.total}}</span>
							</div>
						</li>
					</ul>
				</div>
				
				<div v-if="tableData.other.total>0">
					<div class="f6f8-bg bb bl bt clearfix">
						<span class="ib pt12 pb12 pl20">{{tableData.other.name}}</span>
						<div class="fr pt12 pb12 ib mr20 red-font">
							<span class="ib pl20 cs" >{{tableData.other.total}}</span>
						</div>
					</div>
					<ul class="middle-con ft14">
						<li class="bb" v-for="(t,i) in tableData.other.list" :key="i" v-if="Number(t.total) > 0">
							<span class="ib pt12 pb12 pl20">
								<span class="ib box mr5" :class="i<5||i==0?'ss'+(i+1):i>=5&&i<10?'ss'+(i-4):'ss'+(i-9)"></span>
									{{t.name}}
							</span>
							<div class="fr pt12 pb12 ib mr20 blue-font">
								<span class="ib pl20">{{t.total}}</span>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import { financeSummaryData } from "@/api/finance";
	export default {
		name: "summaryDataShow",
		data() {
			return {
				showFlag: true,
				tableData: {
					bonus: {
						name: "",
						total: "",
						list: []
					},
					deposit: {
						name: "",
						total: "",
						list: []
					},
					withdrawals: {
						name: "",
						total: "",
						list: []
					},
					other: {
						name: "",
						total: "",
						list: []
					},
					commission: {
						name: "",
						total: "",
						list: []
					}
				},
			};
		},
		methods: {
			initData(data) {
				for (let key in data.params) {
					if (!data.params[key]) delete data.params[key];
				}
				financeSummaryData(data).then(res => {
					if (res) {
						if (res.data&&res.data.code != 400) {
							for (let key in res.data) {
								if (key == 'commission') {
									res.data[key].list.forEach(t => {
										if (t.name == '日工资' || t.name == '月分红') t.name = this.$root.modeName() == 'mode_c' ? t.name + ':hide' : ''
										if (t.name == '自身返佣') t.name = this.$root.modeName() == 'mode_c' ? '直推返佣' : '自身返佣'
										if (t.name == '下级返佣') t.name = this.$root.modeName() == 'mode_c' ? '级差返佣' : '下级返佣'
									})
								}
							}
							this.tableData = res.data;
							this.$parent.flag = true;
						}
						if (res.data.code == 400) {
              let msg=res.data.message;
							this.$Tip.info({
								content: msg
							});
						}
					}
				});
			}
		}
	};
</script>
<style lang="less" scoped>
// 	.db {
// 		display: block;
// 	}
// 	ul {
// 		li {
// 			box-sizing: border-box;
// 			width: 10%;
// 			text-align: center;
// 			&:nth-last-child(1) {
// 				border-right: 1px solid #dcdcdc;
// 			}
// 			span {
// 				&:nth-child(1) {
// 					padding-top: 10px;
// 					padding-bottom: 10px;
// 				}
// 				&:nth-child(2) {
// 					padding-top: 10px;
// 					padding-bottom: 10px;
// 				}
// 			}
// 		}
// 	}
// 	.clearfix li span {
// 		border-left: 1px solid #dcdcdc;
// 	}
// 	.deposit {
// 		li {
// 			&:nth-last-child(1) {
//         border-right: 1px solid #dcdcdc;
// 			}
// 		}
//   }

.ss1 {
    background: #2d8cf0;
}
.ss2 {
    background: #ee8470;
}
.ss3 {
    background: #91c58a;
}
.ss4 {
    background: #f6d467;
}
.ss5 {
    background-color: #ff979e;
}
.box {
    width: 9px;
    height: 9px;
}



</style>


