<template>
	<div>
		<div class="v2-button">
			<Button @click="changeBtn('当前结算')" :class="btnName == '当前结算' ? 'bd-bg' : 'bg-or'">当前结算</Button>
			<Button @click="changeBtn('历史发放')" :class="btnName == '历史发放' ? 'bd-bg' : 'bg-or'">历史发放</Button>
		</div>
		<div>
			<CurrentPay ref="CurrentPay" v-if="btnName == '当前结算'"></CurrentPay>
			<HistoryIssue ref="HistoryIssue" v-else></HistoryIssue>
			<!-- <components :is="showComponent" ref="component"></components> -->
		</div>
	</div>
</template>
<script>
import CurrentPay from './components/currentPay'
import HistoryIssue from './components/historyIssue'
export default {
	name: 'activityHongyundangtouList',
	components: {
		CurrentPay, HistoryIssue
	},
	data() {
		return {
			btnName: '当前结算'
		}
	},
	methods: {
		changeBtn(name) {
			this.btnName = name
		}
	}
}
</script>
<style lang="less" scoped>
.bd-bg {
  height: 36px;
  background-color: #2d8cf0;
  color: #ffffff;
  box-shadow: 0;
  &:focus {
    box-shadow: 0 0 0 0;
  }
}
.bg-or {
	height: 36px;
	background: #ffffff;
	border: 1px solid #eaeaea;
	color: #666666;
  &:focus {
    box-shadow: 0 0 0 0;
  }
  &:hover {
    background: #f4f9ff;
    border: 1px solid #2d8cf0;
    color: #2d8cf0;
  }
}
</style>
