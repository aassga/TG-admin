<template>
	<Modals title="投注记录" ref="betRecord">
		<div slot="content">
			<Tables
				class="ml20 mr20"
				:height="table.data.length > 8 ? '700' : ''"
				:page="false"
				:more="table.more"
				:loading="table.loading"
				:value="table.data"
				:columns="table.columns"
			>
      </Tables>
      <div class="txt-a" >
            <Button class="mt50  mb50 w260x  h50 ft20  ">查看存取款总汇</Button>
      </div>

		</div>
	</Modals>
</template>
<script>
  import {platformBetTotal}  from  "@/api/finance";
	import Modals from "_c/modals";
	import Tables from "_c/tables";
	export default {
    props: ["uid"],
		components: {
			Modals,
			Tables
		},
		data() {
			return {
				table: {
					data: [],
					columns: [
						{
							title: "投注类型",
							key: "",
							align: "center"
						},
						{
							title: "投注金额",
							key: "",
							align: "center"
						},

				]
				}
			};
    },
		methods: {
      getData(){
        const  data={
          uid:this.uid,
          siteId:this.$root.nowSite.id,
        }
        platformBetTotal(data).then(res=>{
              this.table.data=res.data;
        })
        // this.$refs.betRecord.show()
      }
    }
	};
</script>
<style lang="less" scoped></style>
