<template>
	<div>
		<div class="v2-table">
			<Tables
				ref="table"
				:loading="$root.tableLoading"
				:total="table.total"
				:value="table.data"
				:columns="table.columns"
				:pageSizeOpts="table.pageSizeOpts"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
			></Tables>
		</div>
		<!-- 余额抵扣审核 -->
		<Modals ref="review" title="余额抵扣审核" :width="460">
			<div slot="content">
				<p class="ft14 ml85 mt20">
					<span class="pr10">会员账号：</span>
					<span>{{reviewInfo.userName}}</span>
				</p>
				<p class="ft14 ml85 mt20">
					<span class="pr10">订单号：</span>
					<span>{{reviewInfo.order_number}}</span>
				</p>
				<p class="ft14 ml85 mt20">
					<span class="pr10">欠款金额</span>
					<span>{{reviewInfo.undone_amount}}</span>
				</p>
				<p class="ft14 ml85 mt20">
					<span class="pr10">还款金额</span>
					<span class="red-font">{{reviewInfo.return_amount}}</span>
				</p>
				<p class="ft14 ml85 mt20">
					<span class="pr10">操作类型：</span>
					<RadioGroup v-model="reviewInfo.type">
						<Radio label="success">通过</Radio>
						<Radio label="fail" class="ml5">拒绝</Radio>
					</RadioGroup>
				</p>
				<p class="ft14 ml85 mt20">
					<span class="pr10">备注信息：</span>
					<Input
						type="textarea"
						v-model="reviewInfo.remark"
						placeholder="此栏位仅供管理者记录其他咨询，会员无法检视"
						:rows="4"
						class="b w260x mt10 mb20"
					/>
				</p>
				<Button type="primary" class="w260x ml85 h50x ft20 mb20" @click="searchSubmit">确定</Button>
			</div>
		</Modals>
	</div>
</template>
<script>
import Tables from '_c/tables';
import Modals from '_c/modals';
import { repaymentList, checkRepayment, cancelCheckRepayment } from "@/api/activity";
export default {
  components: {
    Tables,Modals
  },
  data() {
    return {
      limit: 20,
      reviewInfo: {},
      limit: 0,
      table: {
        total: 0,
        data: [],
        pageSizeOpts: [20,50,100,150],
        loading: true,
        columns: [
          {
            title: '订单号',
            key: 'order_number',
            align: 'center',
            minWidth:120,
            tooltip:true,
          },
          {
            title: '会员账号',
            key: 'userName',
            align: 'center',
            minWidth:95,
            tooltip:true,
          },
          {
            title: '欠款金额',
            key: 'undone_amount',
            align: 'center',
            minWidth:75,
          },
          {
            title: '还款金额',
            key: 'return_amount',
            align: 'center',
            minWidth:75,
            render: (h,params) => <span style={{color: '#118C1E'}}>{params.row.return_amount}</span>
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            minWidth:40,
            render: (h,params) => {
              let color = params.row.status == 0 ? '#E2930E' : params.row.status == 1 ? '#118C1E' : '#FF0000';
              let text = params.row.status == 0 ? '待审核' : params.row.status == 1 ? '成功' : '失败';
              return <span style={{color}}>{text}</span>
            }
          },
          // {
          //   title: '操作',
          //   align: 'center',
          //   minWidth:40,
          //   render: (h,params) => {
          //     if (params.row.status == 0) {
          //       return (
          //         <span
          //           class="blue-font"
          //           onClick={() => {
          //             let { userName, order_number, undone_amount, return_amount, id } = params.row;
          //             this.reviewInfo = {
          //               userName,
          //               order_number,
          //               undone_amount,
          //               return_amount,
          //               type: "success",
          //               id,
          //               siteId: this.$root.nowSite.id
          //             };
          //             this.modalsShow("review");
          //           }}
          //         >
          //           审核
          //         </span>
          //       );
          //     } else {
          //       return <span class="blue-font" onClick={() => {
          //         this.$Message.config({
          //           top: 50,
          //           duration: 1
          //         })
          //         this.$Tip.confirm({
          //           content: '您确定撤销审核吗？撤销后，将重新审核！',
          //           onOk: () => {
          //             let data = {
          //               siteId: this.$root.nowSite.id,
          //               id: params.row.id
          //             }
          //           cancelCheckRepayment(data, true).then(res => {
          //             if (res != undefined && res.code == 200) {
          //               this.$Message.success('还款审核成功')
          //               this.getData({ params: this.searchKey})
          //             } else {
          //               this.$Message.error('还款审核失败')
          //             }
          //           })
          //           }
          //         })
          //       }}>撤销</span>;
          //     }
          //   }
          // },
          {
            title:"审核者",
            key:"review_username",
            align:"center",
            render:(h,params)=>{
              return(<span>{params.row.review_username?params.row.review_username:"-"}</span>)
            }
          },{
            title:"审核时间",
            key:"review_succes_date",
            align:"center",
             minWidth:130,
            render:(h,params)=>{
              return (<span>{this.$root.unixTime(params.row.review_succes_date)}</span>)
            }
          }
        ]
      },
      searchKey: {}
    }
  },
  methods: {
    getData(data) {
      this.searchKey = data.params
      this.$root.startTableLoading(this)
      repaymentList(data).then(res => {
        if (res != undefined && res.code == 200) {
          let { data,total } = res.data.data
          this.table.data = data
          this.table.total = total
        }
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading())
    },
    onPageChange(page) {
      for(let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key]
      }
      // let data = {
      //   ...this.searchKey,
      //   startTime: this.$root.formatTimeS(this.Time[0]),
      //   endTime: this.$root.formatnightTime(this.Time[1])
      // }
      this.getData({ params: this.searchKey, query: { page }})
    },
    onPageSizeChange(pageSize) {
      this.limit = pageSize
      // this.searchKey.limit = pageSize
      for(let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key]
      }
      let data = { ...this.searchKey, limit: this.limit}
      //  let data = {
      //   ...this.searchKey,
      //   startTime: this.$root.formatTimeS(this.Time[0]),
      //   endTime: this.$root.formatnightTime(this.Time[1])
      // }
      this.getData({ params: data })
    },
    modalsShow(name) {
      this.$refs[name].show()
    },
    searchSubmit() {
      this.$refs.review.spinShow()
      this.$Message.config({
        top: 50,
        duration: 1
      })
      let { id, siteId, remark, type } = this.reviewInfo
      // if (!remark || remark.length < 2){
      //   this.$Tip.info({ content: '备注字段最小两字符'})
      //   this.$refs.review.spinHide()
      //   return false
      // } else {
        let data = {
          id, siteId, status: type == 'success' ? 1 : 2,
          remark
        }
        checkRepayment(data, true).then(res => {
          this.$refs.review.spinHide()
          if (res != undefined && res.code == 200) {
            this.$refs.review.hide()
            this.$Message.success('余额还款成功')
            this.getData({ params: this.searchKey})
          } else {
            this.$Message.error('余额还款失败')
          }
        }).catch(error => {
          this.$refs.review.spinHide()
        })
      // }
    }
  }
}
</script>
<style lang="less" scoped>
	.b {
		display: block;
	}
</style>


