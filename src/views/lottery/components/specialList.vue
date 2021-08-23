<template>
	<div>
		<div class="v2-table" v-if='!spinShow'>
			<table
				class="bt ivu-table ivu-table-default ivu-table-border w100 clearfix"
				cellspacing="0"
				cellpadding="0"
				border="0"
				style="border-bottom:1px solid #dcdcdc !important"
			>
				<tr style="font-size:1rem;background:#f6f6f8" class="ivu-table-column-center w100 bl clearfix">
					<!-- 特码A  赔率  返水(%) -->
					<th class="ivu-table-column-center w100 bl" colspan="3" :class="screen<1690?'bt':''">
						<span class="fl w7 font-none">{{btnType=='specialList'?'特码A':'正码A'}}</span>
						<span class="fl w6 font-none">赔率</span>
						<span class="fl w8 font-none">返水(%)</span>
					</th>
				</tr>
				<div>
					<div v-for="(t,i) in  specialListSum" :key="i" class="w20 fl specialListTr" :class="screen<1690?'bb':''">
						<tr
							v-for="(m,x) in  t.list"
							:key="x"
							class="ma w100 ivu-table-column-center"
							style="display:flex;line-height:48px"
						>
							<td class="w33 ivu-table-column-center specialListTd">
								<span class="specialListBoll">{{m.ball}}</span>
							</td>
							<td class="w33 ivu-table-column-center">
								<div v-if="!Edit">{{m.oddsMax}}</div>
								<div v-else>
									<InputNumber class="ib w80" v-model="m.oddsMax" :step="0.01" :min="0"></InputNumber>
								</div>
							</td>
							<td class="w34 ivu-table-column-center">
								<div v-if="!Edit">{{m.fsrate}}</div>
								<InputNumber v-else class="ib w80" v-model="m.fsrate" :step="0.01" :min="0" disabled></InputNumber>
							</td>
						</tr>
						<tr style="height:48px" v-if='i==4&&!Edit' v-for="item in (10-(t.list.length)%10)" :key="item+'a'" class="w100 fl specialListTr"></tr>
						<tr v-if="Edit&&i==4" class="w100 ma ivu-table-column-center" style="display:flex;line-height:48px">
							<td class="w33 ivu-table-column-center specialListTd">统一设置</td>
							<td class="w33 ivu-table-column-center">
								<InputNumber  
									class="w80"
									v-model="UnifiedSetA"
									:step="0.01" 
									:min="0"
									@on-change="setAllA"
								/>
							</td>
							<td class="w34"></td>
						</tr>
					</div>
				</div>
			</table>
			<table
				class="bt ivu-table mt10 ivu-table-default ivu-table-border w100 clearfix"
				cellspacing="0"
				cellpadding="0"
				border="0"
				style="margin-top:10px !important;border-bottom:1px solid #dcdcdc !important"
			>
				<tr style="font-size:1rem;background:#f6f6f8" class="ivu-table-column-center w100 bl clearfix">
					<!-- 特码B  赔率  返水(%) -->
					<th class="ivu-table-column-center w100 bl" colspan="3" :class="screen<1690?'bt':''">
						<span class="fl w7 font-none">{{btnType=='specialList'?'特码B':'正码B'}}</span>
						<span class="fl w6 font-none">赔率</span>
						<span class="fl w8 font-none">返水(%)</span>
					</th>
				</tr>
				<div>
					<div v-for="(t,i) in  specialListSumB" :key="i" class="w20 fl specialListTr" :class="screen<1690?'bb':''">
						<tr
							v-for="(m,x) in  t.list"
							:key="x"
							class="ma w100 ivu-table-column-center"
							style="display:flex;line-height:48px"
						>
							<td class="w33 ivu-table-column-center specialListTd">
								<span class="specialListBoll">{{m.ball}}</span>
							</td>
							<td class="w33 ivu-table-column-center">
								<div v-if="!Edit">{{m.oddsMax}}</div>
								<div v-else>
									<InputNumber class="ib w80" v-model="m.oddsMax" :step="0.01" :min="0"></InputNumber>
								</div>
							</td>
							<td class="w34 ivu-table-column-center">
								<div v-if="!Edit">{{m.fsrate}}</div>
								<InputNumber v-else class="ib w80" v-model="m.fsrate" :step="0.01" :min="0"></InputNumber>
							</td>
						</tr>
						<tr style="height:48px" v-if='i==4&&!Edit' v-for="item in (10-(t.list.length)%10)" :key="item+'a'" class="w100 fl specialListTr"></tr>
						<tr v-if="Edit&&i==4" class="ma w100 ivu-table-column-center" style="display:flex;line-height:48px">
							<td class="w33 ivu-table-column-center">统一设置</td>
							<td class="w33 ivu-table-column-center">
								<InputNumber  
									class="w80"
									v-model="UnifiedSetB"
									:step="0.01" 
									:min="0"
									@on-change="setAllB"
								/>
							</td>
							<td class="w34"></td>
						</tr>
					</div>
				</div>
      </table>
      <table
				class="bt ivu-table mt10 ivu-table-default ivu-table-border w100 clearfix"
				cellspacing="0"
				cellpadding="0"
				border="0"
				style="margin-top:10px !important"
			>
				<tr style="font-size:1rem;background:#f6f6f8" class="ivu-table-column-center w100 bl clearfix">
				</tr>
				<div>
					<div v-for="(t,i) in  specialListSumT" :key="i" class="fl specialListTr " :class="{w25:btnType=='orthocodeList',w20:btnType=='specialList',bt:screen<1690}">
						<tr
							v-for="(m,x) in  t.list"
							:key="x"
							class="ma w100 ivu-table-column-center"
							style="display:flex;line-height:48px"
						>
							<td class="w33 ivu-table-column-center ">
								<P>{{m.ball}}</P>
							</td>
							<td class="w33 ivu-table-column-center">
								<div class="txt-a" v-if="!Edit">{{m.oddsMax}}</div>
								<div v-else>
									<InputNumber class="ib w80" v-model="m.oddsMax" :step="0.01" :min="0"></InputNumber>
								</div>
							</td>
							<td class="w34 ivu-table-column-center">
								<div v-if="!Edit">{{m.fsrate}}</div>
								<InputNumber v-else class="ib w80" v-model="m.fsrate" :step="0.01" :min="0"></InputNumber>
							</td>
						</tr>
						<tr  style="height:48px;border:0 !important" v-if="btnType=='specialList'&&(i==2||i==3||i==4)" v-for="item in (4-(t.list.length)%4)" :key="item+'a'" class="w100 fl specialListTr"></tr>
					</div>
				</div>
			</table>
		</div>
	</div>
</template>
<script>
	import { lotteryUpdateOddsSiteidLid } from "@/api/lottery";
	export default {
		name: "SpecialList",
		props: ["List", "isEdit","btnType","allData","spinShow"],
		data() {
			return {
				screen:screen.width,
				UnifiedSetA:0,//统一设置A
				UnifiedSetB:0,
				ListData:[],
				specialListSum: [],
        specialListSumB: [],
        specialListSumT:[],
				specialList: "",
				specialListOne: [],
				specialListTwo: [],
				specialListTree: [],
				specialListFour: [],
				specialListFif: [],
				Edit: false
			};
		},
		watch: {
			List: {
				handler(val, oldVal) {
					// if(val.length==undefined) this.oddsInfoList=val;
					let  specialList  = this.List;
					this.getData(specialList)
				},
				deep: true
			},
			isEdit: {
				handler(val, oldVal) {
					this.UnifiedSetA=0;
					this.UnifiedSetB=0;
					this.Edit = val;
					this.transform();
				},
				deep: true
			},
		},
		mounted() {
			let _this=this;
			let props = {..._this._props};
			this.ListData = {..._this._props.List}; //获取全部游戏列表
			if(this.ListData.list){
				this.getData(this.ListData)
			};
			this.btnType = props.btnType
			this.Edit = props.isEdit;
		},
		methods:{
			getData(specialList){
				this.specialList = specialList;
					this.specialListSum = [];
					this.$root.getType(10, this.specialList.objA).forEach(t => {
						this.specialListSum.push(Object.assign({}, { list: t }));
					});
					this.specialListSumB = [];
					this.$root.getType(10, this.specialList.objB).forEach(t => {
						this.specialListSumB.push(Object.assign({}, { list: t }));
					});
					if(this.btnType=='specialList'){
						this.specialListSumT=[];
          	this.$root.getType(4, this.specialList.objT.slice(0,8)).forEach(t => {
							this.specialListSumT.push(Object.assign({}, { list: t }));
						});
						this.$root.getType(3, this.specialList.objT.slice(8)).forEach(t => {
							this.specialListSumT.push(Object.assign({}, { list: t }));
						});
					}else	if(this.btnType=='orthocodeList'){
						this.specialListSumT=[];
          	this.$root.getType(1, this.specialList.objT).forEach(t => {
							this.specialListSumT.push(Object.assign({}, { list: t }));
							this.$forceUpdate();
						});
					}
				this.$emit('getLoad',false)
			},
			transform() {
				if (this.isEdit == false) {
					let newSpecialListSum = [];
					this.specialListSum.forEach(t => {
						t.list.forEach(m => {
							newSpecialListSum.push(m);
						});
					});
					let newSpecialListSumB = [];
					this.specialListSumB.forEach(t => {
						t.list.forEach(m => {
							newSpecialListSumB.push(m);
						});
					});
				}
			},
			setAllA(val){
				this.specialList.objA.map(item=>{
					item.oddsMax = this.UnifiedSetA;
				})
			},
			setAllB(val){
				this.specialList.objB.map(item=>{
					item.oddsMax = this.UnifiedSetB;
				})
			}

		}
	};
</script>
<style lang="less" scoped>
	.specialListTr:first-child {
		border-left: 1px solid #dcdcdc !important ;
		tr {
			td {border:0}
			&:first-child {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(2) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(3) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(4) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(5) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(6) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(7) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(8) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(9) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(10) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
		}
	}
	.specialListTr:nth-child(2) {
		border-left: 1px solid #dcdcdc !important ;
		tr {
			td {border:0}
			&:nth-child(1) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(2) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(3) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(4) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(5) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(9) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(10) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(5) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(6) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(7) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(8) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
		}
	}
	.specialListTr:nth-child(3) {
		border-left: 1.3px solid #dcdcdc !important ;
		tr {
			td {border:0}
			&:nth-child(1) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(2) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(7) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(8) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(3) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(4) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(9) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(10) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(7) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(8) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(5) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(6) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
		}
	}
	.specialListTr:nth-child(4) {
		border-left: 1px solid #dcdcdc !important ;
		border-right: 1px solid #dcdcdc !important ;
		td {border:0}
		tr {
			&:nth-child(1) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(2) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(3) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(8) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(9) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(10) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(4) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(5) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(6) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(7) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
		}
	}
	.specialListTr:nth-child(5) {
		border-right: 1px solid #dcdcdc !important ;
		td {border:0}
		tr {
			&:nth-child(1) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(2) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(7) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(8) {
				span {
					color: #fff;
					background-color: #20a2d8;
				}
			}
			&:nth-child(3) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(4) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(9) {
				span {
					color: #fff;
					background-color: #49bb27;
				}
			}
			&:nth-child(5) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
			&:nth-child(6) {
				span {
					color: #fff;
					background-color: #f36055;
				}
			}
		}
	}
	.specialListBoll:first-child {
		width: 26px;
		height: 26px;
		line-height: 26px;
		border-radius: 50%;
		// background-color: pink;
		display: inline-block;
	}
</style>