<template>
	<div>
		<div class="v2-search">
			<Button type="primary" class="ivu cardNutton">VIP设置</Button>
			<Button class="ml20 ivu cardNutton" type="primary">经验规则设置</Button>
		</div>
		<div class="v2-table">
			<Tables
				ref="tables"
				:loading="$root.tableLoading"
				:columns="table.columns"
				:value="table.data"
				:total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
        		@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
			></Tables>
		</div>
	</div>
</template>
<script>
	import Tables from "_c/tables";
	export default {
		name: "gradeList",
		components: {
			Tables
		},
		data() {
			return {
				table: {
					data: [],
					pageSizeOpts: [20, 30, 40, 50],
					total: 0,
					loading: false,
					columns: [
						{
							title: "VIP等级",
							align: "center",
							key: ""
						},
						{
							title: "晋级所需经验",
							align: "center",
							key: ""
						},
						{
							title: "晋级礼包",
							align: "center",
							key: ""
						},
						{
							title: "会员人数",
							align: "center",
							key: ""
						}
					]
				}
			};
		},
		methods: {
      onPageChange(){

      },
      onPageSizeChange(){

      }
    },
	};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
</style>