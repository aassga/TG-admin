<template>
	<div>
		<div class="v2-search clearfix">
			<div class="fl">
				<Button class="w120x h36" type="primary"  v-if="!isEdit" @click="changeOddset(!isEdit)">修改赔率</Button>
				<div class="ib">
					<Button  v-if="isEdit" class="mr20 h36" @click="()=>{isEdit=false;getData(formKey)}">取消</Button>
					<Button  v-if="isEdit" class="h36" type="primary"  @click="save()">保存</Button>
				</div>
			</div>
			<div class="fl clearfix" style="display:none">
				<span class="ib mr15">玩法</span>
				<Input placeholder="请输入" class="w120x h36" />
				<Button type="primary" class="ivu-btn bg ib ml20">查询</Button>
			</div>
			<div class="font-bold ft18 fr mr30">当前彩票：{{$route.query.lotterName|| ""}}</div>
    </div>
    <div class="v2-search bb"  v-if="!spinShow">
			<span class="modeBtns ib cs ft16" @click="setBtn(t.val)" v-for="(t,i) in btnList" :class="t.val==btnType ? 'active':''" :key="i" >
				{{t.name}}
			</span>
    </div>
		<Row v-if="spinShow" style="height:300px;line-height:300px">
      <Spin size="large" fix>
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div'+t"></div>
        </div>
      </Spin>
    </Row>
		<Row>
			<!-- 特码/正码 -->
			<div class="v2-table" v-if="btnType=='specialList'||btnType=='orthocodeList'">
				<SpecialList
					ref="SpecialList"
					@getLoad="setLoading"
					:List="List"
					:spinShow="spinShow"
					:allData="oddData"
					:btnType="btnType"
					:isEdit="isEdit"
				></SpecialList>
			</div>
			<div v-if="!spinShow" >
				<!-- 正码1-6/色波/一肖/位数/特码生肖 -->
				<div  class="v2-table" v-if="btnType=='orthocodeListS'||btnType=='colorList'||btnType=='oneAnimalList'||btnType=='specialAnimalList'">
					<Tables
						:columns="table.columns"
						:value="table.data"
						:page="false">
					</Tables>
				</div>
				<!-- 正特码/全部中/连码 -->
				<div class="v2-table" v-if="btnType=='evenList'||btnType=='allList'||btnType=='orthocodeSpyList'">
					<div v-for="(t,i) in allListData" :key='i' class="mb10" :class="btnType=='orthocodeSpyList'?'mb10':''">
						<table
							class="bt ivu-table  ivu-table-default ivu-table-border w100 clearfix"
							cellspacing="0"
							cellpadding="0"
							style="border-left: 1.3px solid #dcdcdc;border-top: 1.3px solid #dcdcdc"
						>
							<thead style="font-size:1rem" :class="screen<1690?'bt':''">
								<td class="w75 ivu-table-column-center bg">{{btnType=='allList'?(t.title).substring(0,t.title.length-4):t.title}}</td>
								<td class="w125 ivu-table-column-center bg">赔率</td>
								<td class="w125 ivu-table-column-center bg">返水(%)</td>
							</thead>
							<tr>
								<td class="w75 ivu-table-column-center">
									<P class="w10 lh40 txt-a fl numberBox" v-for="item in (t.ball.split('-'))" :key='item'>
										<span
											class="number ib"
											:style="item=='01'||item=='02'||item=='07'||item=='08'||item=='12'||item=='13'||item=='18'||item=='19'||item=='23'||
														item=='24'||item=='29'||item=='30'||item=='34'||item=='35'||item=='40'||item=='45'||item=='46'?'background:#f36055'
														:item=='03'||item=='04'||item=='09'||item=='10'||item=='14'||item=='15'||item=='20'||item=='25'||item=='26'||item=='31'||item=='36'||
														item=='37'||item=='41'||item=='42'||item=='47'||item=='48'?'background:#20a2d8'
														:'background:#49bb27'"
										>{{item}}</span>
									</P>
								</td>
								<td class="w125 ivu-table-column-center">
									<span v-if='!isEdit'>{{t.oddsMax}}</span>
									<div v-else>
										<InputNumber v-if="!String(t.oddsMax).includes('/')" class="ib" v-model="t.oddsMax" :step="0.01" :min="0"></InputNumber>
										<Input v-else class="ib w80x" v-model="t.oddsMax" :step="0.01" :min="0" />
									</div>
								</td>
								<td class="w125 ivu-table-column-center">
									<span v-if='!isEdit'>{{t.fsrate}}</span>
									<div v-else>
										<InputNumber class="ib" v-model="t.fsrate" :step="0.01" :min="0" disabled></InputNumber>
									</div>
								</td>
							</tr>
						</table>
					</div>
				</div>
				<!--合肖/生肖连/尾数连  -->
				<div class="v2-table boTabel" v-if="btnType=='sumList'||btnType=='animalsList'||btnType=='mantissaList'">
					<div  v-for="(t,key,n) of allListData"  v-if="key!='list'" :key='key'>
						<table
							class="bt ivu-table  ivu-table-default ivu-table-border clearfix"
							:class="btnType=='sumList'?'w20 fl':btnType=='animalsList'?'w25 fl':'w100'"
							cellspacing="0"
							cellpadding="0"
							style="border-top: 1.3px solid #dcdcdc !important"
							:style="btnType=='sumList'&&(n==1||n==6)?'border-left: 1.3px solid #dcdcdc;'
											:btnType=='animalsList'&&(n==1||n==5)?'border-left: 1.3px solid #dcdcdc'
											:btnType=='mantissaList'?'border-left: 1.3px solid #dcdcdc':''"
						>
							<thead style="font-size:1rem">
									<td v-if="btnType=='sumList'" class="w34 br0 ivu-table-column-center bg">{{key=='objTwo'?'二肖':key=='objTree'?'三肖'
										:key=='objFour'?'四肖':key=='objFiv'?'五肖':key=='objSix'?'六肖':key=='objSeven'?'七肖':key=='objEight'?'八肖':key=='objNine'?'九肖'
										:key=='objTen'?'十肖':key=='objElen'?'十一肖':''}}</td>
									<td v-if="btnType=='animalsList'" class="w34 br0 ivu-table-column-center bg">{{key=='objTwo'?'二肖连中':key=='objTree'?'三肖连中'
										:key=='objFour'?'四肖连中':key=='objFiv'?'五肖连中':key=='objTwoNo'?'二肖连不中':key=='objTreeNo'?'三肖连不中':key=='objFourNo'?'四肖连不中':''}}</td>
									<td v-if="btnType=='mantissaList'" class="w34 ivu-table-column-center bg">{{key=='objTwo'?'二尾连中':key=='objTree'?'三尾连中'
										:key=='objFour'?'四尾连中':key=='objTwoNo'?'二尾连不中':key=='objTreeNo'?'三尾连不中':key=='objFourNo'?'四尾连不中':''}}</td>
									<td class="w33 ivu-table-column-center bg" :class="btnType=='sumList'||btnType=='animalsList'?'br0':''">赔率</td>
									<td class="w33 ivu-table-column-center bg" style="border-right:0">返水(%)</td>
							</thead>
							<tr v-for="(item,i) in t">
									<td class="w34 ivu-table-column-center" style="border:0" :class="btnType=='mantissaList'?'br1':''">{{item.ball}}</td>
									<td class="w33 ivu-table-column-center" style="border:0" :class="btnType=='mantissaList'?'br1':''">
										<span v-if='!isEdit'>{{item.oddsMax}}</span>
										<div v-else>
											<InputNumber class="ib" v-model="item.oddsMax" :step="0.01" :min="0"></InputNumber>
										</div>
									</td>
									<td class="w33 ivu-table-column-center" style="border:0" :class="i=='0'&&btnType=='mantissaList'?'bb0':''">
										<span v-if='!isEdit'>{{item.fsrate}}</span>
										<div v-else>
											<InputNumber class="ib" v-model="item.fsrate" :step="0.01" :min="0" disabled></InputNumber>
										</div>
									</td>
							</tr>
						</table>
					</div>
				</div>
				<div 	v-if="btnType == 'orthocodeSpyList'" class="box">
					<div v-for="(t,i) in compensateDate" :key="i+'box'" class="w25 fl ">
						<div v-if='!isEdit' class="specialListTr ">
							<span class="w33 ib txt-a">{{t.ball}}</span>
							<span class="w33 ib txt-a">{{t.oddsMax}}</span>
							<span class="w33 ib txt-a">{{t.fsrate}}</span>
						</div>
						<div v-else  class="specialListTr">
							<span class="w33 ib txt-a">{{t.ball}}</span>
							<span class="w33 ib txt-a">
								<InputNumber class="w80 ib" v-model="t.oddsMax" :step="0.01" :min="0"></InputNumber>
							</span>
							<span class="w33 ib txt-a">
								<InputNumber class="w80 ib" v-model="t.fsrate" :step="0.01" :min="0"></InputNumber>
							</span>
						</div>
					</div>
					<div v-for="t in (4-(compensateDate.length)%4)" :key="t" class="w25 fl specialListTr "></div>
				</div>
			</div>
		</Row>
	</div>
</template>
<script>
	import Tables from "@/components/tables";
  import { lotteryOddsSiteId, lotteryUpdateOddsSiteidLid } from "@/api/lottery";
	import SpecialList from "./components/specialList"
	import { getUserType } from "@/libs/util";
	export default {
    components:{
			SpecialList,
			Tables
    },
		data() {
			return {
				screen:screen.width,
				style:this.btnType=='sumList'?'border-right:0;nth-child(5):border-right:1px solid red':'',
				isEdit:false,
				spinShow:true,
				compensateDate:[],
				allListData:[],
				List:[],
				oddsInfoList:[],
        btnType:'specialList',
				oddData: {},
				formKey: {
					lotteryId: this.$route.query.lotteryId,
					siteId: this.$root.nowSite.id,
					lotterName:this.$route.query.lotterName,
				},
				btnList: [
					{ name: "特码", val: "specialList" },
					{ name: "正码", val: "orthocodeList" },
					{ name: "正特码", val: "orthocodeSpyList" },
					{ name: "正码1-6", val: "orthocodeListS" },
					{ name: "连码", val: "evenList" },
					{ name: "色波", val: "colorList" },
					{ name: "一肖/位数", val: "oneAnimalList" },
					{ name: "特码生肖", val: "specialAnimalList" },
					{ name: "合肖", val: "sumList" },
					{ name: "生肖连", val: "animalsList" },
					{ name: "尾数连", val: "mantissaList" },
					{ name: "全不中", val: "allList" },
				],
					table: {
					total: 0,
					data: [],
					// loading: true,
					columns: [
						{
							title:'正特码',
							key: "ball",
							align: "center",
							minWidth:120,
						},
						{
							title: "赔率",
							key: "oddsMax",
							align: "center",
							minWidth:120,
							render: (h, params) =>
								h("div", [
									h("span",{style: {display: !this.isEdit ? "inline-block" : "none"}},Number(params.row.oddsMax).toFixed(2)),
									h("InputNumber", {
										style: { display: this.isEdit ? "inline-block" : "none" },
										class: "w80",
										props: {
											value: Number(
												params.row.oddsMax
											),
											min: 0.01,
											max: 9999999999,
										},
										on: {
											"on-change": e => {
												if (!e) e = 0;
												this.table.data[params.index].oddsMax = e;
											}
										}
									})
								])
						},
						{
							title: "返水(%)",
							key: "fsrate",
							align: "center",
							minWidth:120,
							render: (h, params) =>
								h("div", [
									h("span",{style: {display: !this.isEdit ? "inline-block" : "none"}},Number(params.row.fsrate).toFixed(2)),
									h("InputNumber", {
										style: { display: this.isEdit ? "inline-block" : "none" },
										class: "w80",
										props: {
											value: Number(
												params.row.fsrate
											),
											min: 0.01,
											max: 9999999999,
											disabled:true,
										},
										on: {
											"on-change": e => {
												if (!e) e = 0;
												this.table.data[params.index].fsrate = e;
											}
										}
									})
								])
						},

					]
				}
			};
		},
		created() {
			this.getData(this.formKey);
    },

		methods: {
			save(){//提交
				this.spinShow=true;
				// if(this.btnType=='specialList'||this.btnType=='orthocodeList'){
				// 	this.$refs.SpecialList.submit();
				// }else{
				// 	if(this.btnType=='orthocodeSpyList'||this.btnType=='evenList'||this.btnType=='allList'){
				// 		this.oddData.oddsInfo.map(item=>{
				// 			this.allListData.map(m=>{
				// 				if(item.title==m.title&&item.ball==m.ball){
				// 					item=m;
				// 				};
				// 			})
				// 			if(this.btnType=='orthocodeSpyList'){
				// 				this.compensateDate.map(m=>{
				// 					if(item.title==m.title&&item.ball==m.ball){
				// 						item==m;
				// 					}
				// 				})
				// 			}
				// 		});
				// 	}else if(this.btnType=='sumList'||this.btnType=='animalsList'||this.btnType=='mantissaList'){
				// 		this.oddData.oddsInfo.map(item=>{
				// 			for(let key in this.allListData){
				// 				if(key!='list'){
				// 					this.allListData[key].map(m=>{
				// 						if(item.title==m.title&&item.ball==m.ball){
				// 							item=m;
				// 						}
				// 					})
				// 				}
				// 			}
				// 		})
				// 	}else if(this.btnType=='orthocodeListS'||this.btnType=='colorList'||this.btnType=='oneAnimalList'||this.btnType=='specialAnimalList'){
				// 		this.oddData.oddsInfo.map(item=>{
				// 			if(item.title==this.table.data[0].title&&item.ball==this.table.data[0].ball){
				// 				item=this.table.data[0];
				// 			};
				// 		});
				// 	}
				// 	this.oddData.oddsInfo.map(item=>{
				// 		item.oddsMin=item.oddsMax
				// 	})
				// 	let data={
				// 			id:this.oddData.id,
				// 			oddsInfo:JSON.stringify(this.oddData.oddsInfo)
				// 		}
				// 	this.submitDate(data)
				// }

				this.oddData.oddsInfo.map(item=>{item.oddsMin=item.oddsMax+''})
				let data={
							id:this.oddData.id,
							oddsInfo:JSON.stringify(this.oddData.oddsInfo)
						}
					this.submitDate(data)
			},
			submitDate(data){
				lotteryUpdateOddsSiteidLid(data,true).then(res=>{
					if(res&&res.code==200){
						this.$Message.success("更新成功");
						this.getData(this.formKey);
						this.isEdit=false;
						this.spinShow=false;
						this.$forceUpdate();
					}
				}).catch(error=>this.spinShow=false)
			},
			setLoading(){
				this.spinShow = false;
			},
      changeOddset(val){
        this.isEdit=val
			},
			setBtn(val){
				this.btnType = val;
				// this.showComponent = val;
				this.getTableDate(val);
			},
			getTableDate(val){
				if(val=='specialList'){ //特码
						this.List = this.oddsInfoList.specialList;
				}if(val=='orthocodeList'){ //正码
					this.List = this.oddsInfoList.orthocodeList;
				}
				if(val=='orthocodeSpyList'){  //正特码数据
					this.compensateDate=this.oddsInfoList.orthocodeSpyList.list.filter(item=>{return item.title!="正码特1-49"});
					this.allListData = this.oddsInfoList.orthocodeSpyList.list.filter(item=>{return item.title=="正码特1-49"})
				}else if(val=='evenList'){ //连码
					this.allListData = this.oddsInfoList.evenList.list
				}else if(val=='allList'){ //全不中
					this.allListData = this.oddsInfoList.allList.list;
				}else if(val=='orthocodeListS'){ //正码1-6
					this.table.data = this.oddsInfoList.orthocodeListS.list;
					this.table.columns[0].title="正码1-6";
				}else if(val=='colorList'){ //色波
					this.table.data = this.oddsInfoList.colorList.list;
					this.table.columns[0].title="色波";
				}else if(val=='oneAnimalList'){ //一肖
					this.table.data = this.oddsInfoList.oneAnimalList.list;
					this.table.columns[0].title="一肖/位数";
				}else if(val=='specialAnimalList'){ //特码生肖
					this.table.data = this.oddsInfoList.specialAnimalList.list;
					this.table.columns[0].title="特码生肖";
				}else if(val=='sumList'){ //合肖
					this.allListData = this.oddsInfoList.sumList;
				}else if(val=='animalsList'){ //生肖连
					this.allListData = this.oddsInfoList.animalsList;
				}else if(val=='mantissaList'){ //尾数连
					this.allListData = this.oddsInfoList.mantissaList;
				}
				this.spinShow = false;
			},
			getData(data) {
				this.spinShow=true;
				lotteryOddsSiteId(data).then(res => {
					this.oddData = res.data;
					const { oddsInfo } = this.oddData;
					let obj = {};
					obj.specialList = {
						//特码
						objA: [],
						list: [],
						objB: [],
						objT: []
					};

					obj.orthocodeList = {
						//正码
						objA: [],
						list: [],
						objB: [],
						objT: []
					};
					obj.orthocodeSpyList = {
						//正码特
						list: []
					};
					obj.orthocodeListS = {
						list: []
					}; //正码1-6
					obj.evenList = {
						list: []
					}; //连码
					obj.colorList = {
						list: []
					}; //色波
					obj.oneAnimalList = {
						list: []
					}; //一肖/尾数
					obj.specialAnimalList = {
						list: []
					}; //特码生肖
					obj.sumList = {
						list: [],
						objTwo: [],
						objTree: [],
						objFour: [],
						objFiv: [],
						objSix: [],
						objSeven: [],
						objEight: [],
						objNine: [],
						objTen: [],
						objElen: []
					}; //合肖
					obj.animalsList = {
						list: [],
						objTwo: [],
						objTree: [],
						objFour: [],
						objFiv: [],
						objTwoNo: [],
						objTreeNo: [],
						objFourNo: []
					}; //生肖连
					obj.mantissaList = {
						list: [],
						objTwo: [],
						objTree: [],
						objFour: [],
						objTwoNo: [],
						objTreeNo: [],
						objFourNo: []
					}; //尾数连
					obj.allList = {
						list: [],
						objFifNo: [],
						objSixNo: [],
						objSeven: [],
						objEightNo: [],
						objNineNo: [],
						objTenNo: [],
						objElevenNo: [],
						objTweleNo: []
					}; //全不中

					let list = [];
					oddsInfo.forEach(t => {
						if (t.title.includes("特码")) {
							obj.specialList.list.push(t);
						}
						if (
							t.title.includes("正码A1-49") ||
							t.title.includes("正码B1-49") ||
							t.playway == "20205,20206"
						) {
							obj.orthocodeList.list.push(t);
						}
						if (t.title.includes("正码特")) {
							obj.orthocodeSpyList.list.push(t);
						}

						if (t.title.includes("正码1-6")) {
							obj.orthocodeListS.list.push(t);
						}

						if (t.title.includes("连码")) {
							obj.evenList.list.push(t);
						}
						if (t.title.includes("色波")) {
							obj.colorList.list.push(t);
						}
						if (t.playway == "20214" || t.playway == "20215") {
							obj.oneAnimalList.list.push(t);
						}
						if (t.title.includes("特肖")) {
							obj.specialAnimalList.list.push(t);
						}
						if (t.title.includes("合肖")) {
							obj.sumList.list.push(t);
						}
						if (t.title.includes("生肖连")) {
							obj.animalsList.list.push(t);
						}
						if (t.title.includes("尾数连")) {
							obj.mantissaList.list.push(t);
						}
						if (t.title.includes("全不中")) {
							obj.allList.list.push(t);
						}
					});
					obj.specialList.list.forEach(k => {
						if (k.title.includes("特码A1")) {
							obj.specialList.objA.push(k);
						}
						if (k.title.includes("特码B")) {
							obj.specialList.objB.push(k);
						}
						if (k.playway == "20201,20202") {
							obj.specialList.objT.push(k);
						}
					});
					obj.orthocodeList.list.forEach(m => {
						if (m.title.includes("正码A")) {
							obj.orthocodeList.objA.push(m);
						}
						if (m.title.includes("正码B")) {
							obj.orthocodeList.objB.push(m);
						}
						if (m.playway == "20205,20206") {
							obj.orthocodeList.objT.push(m);
						}
					});
					obj.sumList.list.forEach(m => {
						if (m.playway == "20260") {
							obj.sumList.objTwo.push(m);
						}
						if (m.playway == "20261") {
							obj.sumList.objTree.push(m);
						}
						if (m.playway == "20262") {
							obj.sumList.objFour.push(m);
						}
						if (m.playway == "20263") {
							obj.sumList.objFiv.push(m);
						}
						if (m.playway == "20264") {
							obj.sumList.objSix.push(m);
						}
						if (m.playway == "20265") {
							obj.sumList.objSeven.push(m);
						}
						if (m.playway == "20266") {
							obj.sumList.objEight.push(m);
						}
						if (m.playway == "20267") {
							obj.sumList.objNine.push(m);
						}
						if (m.playway == "20268") {
							obj.sumList.objTen.push(m);
						}
						if (m.playway == "20269") {
							obj.sumList.objElen.push(m);
						}
					});
					obj.animalsList.list.forEach(m => {
						if (m.playway == "20247") {
							obj.animalsList.objTwo.push(m);
						}
						if (m.playway == "20248") {
							obj.animalsList.objTree.push(m);
						}
						if (m.playway == "20249") {
							obj.animalsList.objFour.push(m);
						}
						if (m.playway == "20250") {
							obj.animalsList.objFiv.push(m);
						}
						if (m.playway == "20251") {
							obj.animalsList.objTwoNo.push(m);
						}
						if (m.playway == "20252") {
							obj.animalsList.objTreeNo.push(m);
						}
						if (m.playway == "20253") {
							obj.animalsList.objFourNo.push(m);
						}
					});
					obj.mantissaList.list.forEach(m => {
						if (m.playway == "20254") {
							obj.mantissaList.objTwo.push(m);
						}
						if (m.playway == "20255") {
							obj.mantissaList.objTree.push(m);
						}
						if (m.playway == "20256") {
							obj.mantissaList.objFour.push(m);
						}
						if (m.playway == "20257") {
							obj.mantissaList.objTwoNo.push(m);
						}
						if (m.playway == "20258") {
							obj.mantissaList.objTreeNo.push(m);
						}
						if (m.playway == "20258") {
							obj.mantissaList.objFourNo.push(m);
						}
					});
					obj.allList.list.forEach(m => {
						if (m.playway == "20270") {
							obj.allList.objFifNo.push(m);
						}
						if (m.playway == "20271") {
							obj.allList.objSixNo.push(m);
						}
						if (m.playway == "20272") {
							obj.allList.objSeven.push(m);
						}
						if (m.playway == "20273") {
							obj.allList.objEightNo.push(m);
						}
						if (m.playway == "20274") {
							obj.allList.objNineNo.push(m);
						}
						if (m.playway == "20275") {
							obj.allList.objTenNo.push(m);
						}
						if (m.playway == "20276") {
							obj.allList.objElevenNo.push(m);
						}
						if (m.playway == "20277") {
							obj.allList.objTweleNo.push(m);
						}
					});
					this.oddsInfoList=obj;
					if(this.btnType=='specialList'){
						this.List = this.oddsInfoList.specialList;
					}if(this.btnType=='orthocodeList'){
						this.List = this.oddsInfoList.orthocodeList;
					}
					this.getTableDate(this.btnType)
					this.$forceUpdate();
				});
			}
		}
	};
</script>
<style lang="less" scoped >
  @import "../../styles/button.less";
  	/deep/.v2-search {
		.blue-bd {
			background: #2d8cf0;
			color: #fff;
		}
	}
	.br0{
		border-right: 0;
	}
	.bg{
		background: #f6f6f8;
	}
	.bb0{
		border-bottom: 0;
	}
  .modeBtns {
  border:0;
  border-radius: 0;
  line-height: 36px;
  height: 36px;
  text-align: center;
  padding: 0 15px;
}
.active {
  border:1px solid #2D8CF0;
  border-bottom: 0;
  color:#2D8CF0;
  box-sizing: border-box !important;
}
/deep/.number {
	width: 26px !important;
	height: 26px !important;
	line-height: 26px !important;
	border-radius: 50% !important;
	// background-color: pink !important;
	display: inline-block;
	color:white;
}
.specialListTr {
	display: flex;
	justify-content: space-around;
	height: 42px;
	line-height: 42px;
	border-left: 1px solid #dcdcdc;
}
.box {
	overflow: hidden;
	border: 1px solid #dcdcdc;
	border-left: 0;
}
.boTabel{
	.ivu-table {
		border-right: 1.3px solid #dcdcdc;
		border-bottom: 1.3px solid #dcdcdc;
		margin-bottom:10px;
	}
}

.br1 {
	border-right: 1px solid #dcdcdc !important;
}
.ivu-table:before{
	display: none;
}
.ivu-table {
	thead{
		td {
			height:40px !important ;
		}
	}
}
</style>


