<template>
  <div>
    <Modals ref="sendLoan" title="自动出款" width="710">
      <div slot="content">
        <div>
                   <!-- <Icons
                     class="ml5 blue-font"
                     size="15"
                     @click="shuaxin"
                     :class="isRotate?'rotate':'rotate1'"
                      type="huiyuanchaxunshuaxin"
                  ></Icons> -->
                  <!-- <Icon type="md-refresh" size="20"   class="ml5 blue-font" :class="isRotate?'rotate':'rotate1'" @click="shuaxin(index)"  /> -->
                  <!-- <Icon type="ios-refresh"  />  -->
                  <!-- <Icon type="ios-arrow-back"   :class="isRotate?'rotate':'rotate1'" @click="shuaxin" /> -->
          <Tables
            class="ml50 mr50"
            ref="tableNewData"
            style="overflow-y:auto;height:250px"
            :columns="tableNewData.columns"
            :loading="tableNewData.loading"
            :value="tableNewData.data"
            :page="false"
            :showSizer="false"
            @shuaxin="shuaxin"
          >
        </Tables>
        </div>
        <!-- <Table  :columns="columns12" :data="data6">
          <template slot-scope="{ row }" slot="name">
              <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row, index }" slot="action">
              <Button type="primary" size="small" style="margin-right: 5px" @click="show(index,row)">View</Button>
              <Button type="error" size="small" @click="remove(index)">Delete</Button>
          </template>
      </Table> -->
        <Button
          :class="{disabled:!this.click}"
          @click="countStop"
          size="large"
          style="margin-left:290px"
          class="mb20 ft16 mt10 loanClick"
          :loading="$root.editBtnLoading"
          type="primary"
        >{{content}}</Button>
      </div>
    </Modals>
    <!-- 审核失败提示框 -->
     <Modal v-model="isShow" :width="550" :mask-closable="false"  :scrollable='true'>
      <div  class="header" slot="header">温馨提示</div>
      <Icons slot="close" type="guanbi" class="lh50" color="white" :size="24"></Icons>
      <div class="content" style="position:relative;">
        <div class="txt flex-row">
              <Icons color="#57A3F3" class="iconfont" type="danchuangtishi" :size="26"></Icons>
              <div class="font">{{failureText}}</div>
            </div>
            <div class="btns flex-row">
              <Button type="error" @click="close">确定</Button>
            </div>
      </div>
    </Modal>
  </div>
</template>
<script >
import Modals from "_c/modals";
import Tables from "@/components/tables";
import Icons from "@/components/icons";
import {
  automaticWithdrawalEnableList,
  withdrawalsAudit,
  automaticWithdrawalMerchantBalance
} from "@/api/finance";
export default {
  props: ["loanUid", "datatail",'newActualAmount'],
  components: {
    Modals,
    Tables,
    Icons
  },
  data() {
    return {
      loading:false,
      isRotate: false,
      newBlance:'',
	    failureText:'',
      isShow:false,
      authMoney:'',
      message: "",
      loading:true,
      content: "确认提交",
      totalTime: 5,
      click: true,
      canClick: true,
      currentChoose: "",
      automaticWithdrawalId: "",
      columns12: [
                    {
                        title: 'Name',
                        slot: 'name'
                    },
                    {
                        title: 'Age',
                        key: 'age'
                    },
                    {
                        title: 'Address',
                        key: 'address'
                    },
                    {
                        title: 'Action',
                        slot: 'action',
                        width: 150,
                        align: 'center'
                    }
                ],
      data6: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park'
                    }
                ],  
 
      tableNewData: {
        columns: [
          {
            title: "选择平台",
            key: "id",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
             
              let id = params.row.id;
              let auth_money=params.row.auth_money;
               
              let flag = false;
              if (this.currentChoose === id) {
                flag = true;
              } else {
                flag = false;
              }
              let self = this;
              return h("div", [
                h("Radio", {
                  props: {
                    value: flag
                  },
                  on: {
                    "on-change": () => {
                    
                      this.authMoney=auth_money;
                      (this.automaticWithdrawalId = id),
                        (self.currentChoose = id);
                    }
                  }
                })
              ]);
            }
          },
          {
            title: "出款平台",
            key: "api_name",
            minWidth: 90,
            align: "center",
            tooltip: true,
            // slot: 'operation',
            isBlue:false,
          },
          // {
          //   title: "商户余额",
          //   key: "merchant",
          //   align: "center",
          //   minWidth: 130,
          //   render: (h, params) => {
          //     return (
          //       <div>
          //         <span>
          //           {params.row.balance ? params.row.balance : "暂无数据"}
          //         </span>
          //         <span
          //           onClick={() => {
          //             this.changeFresh(params,'merchant');
          //           }}
          //         >
          //           {" "}
          //           <Icons
          //             class="ml5 blue-font"
          //             size="15"
          //             type="huiyuanchaxunshuaxin"
          //           ></Icons>
                    
          //         </span>
          //       </div>
          //     );
          //   }
          // },
          // <Icon type="md-refresh" size="20"   class="ml5 blue-font" :class="isRotate?'rotate':'rotate1'" @click="shuaxin"  />
        //   {
        //   title: "商户余额2",
        //     key: "balance",
        //     align: "center",
        //     // slot: 'action',
        //     isBlue:false,
        //     minWidth: 130,
        //     render:(h,params)=>{
        //       return h('div',[
        //         h('Icon',{
        //           props:{
        //             type:'md-refresh',
        //             size:'20',
        //             color:'#2d8cf0',
        //           },
        //           class:"isRotate?'rotate':'rotate1'",
        //           on:{
        //             click:()=>{
        //               this.changeFresh(params,'balance');
        //              this.shuaxin(params.index,params)
                  
        //             }
        //           }
        //         },),
        //         h('span',params.row.balance ? params.row.balance : "暂无数据")
        //       ],1111)
        //     }
        //  },
        //   {
        //   title: "商户余额3",
        //     key: "balance",
        //     align: "center",
        //     // slot: 'action',
        //     isBlue:false,
        //     minWidth: 130,
        //     render:(h,params)=>{

        //       // console.log( this.tableNewData)
        //       // console.log(params.row)
        //       return h('div',[
        //         h('Button',{
        //           props:{
        //             size:'small',
        //             loading:params.row.isBlue,
        //             type:'primary'
        //           },
        //           on:{
        //             click:()=>{
        //               console.log(params.index)
        //               this.changeFresh(params,'balance');
        //               this.show(params.index,params)
        //             }
        //           }
        //         },params.row.balance ? params.row.balance : "暂无数据")
        //       ])
        //     }
        //  },
          {
            title: "商户余额",
            key: "balance",
            align: "center",
            minWidth: 130,
            render: (h, params) => {
              this.newBlance=params.row.balance;
              return (
               
                <div>
                  <span>
                    {params.row.balance ? params.row.balance : "暂无数据"}
                  </span>
                   <span
                    onClick={() => {
                      this.changeFresh(params,'balance');
                    }}
                  >
                  
                  
                 <Icon type="md-refresh" size="20" id="rotate"   class="ml5 blue-font rotate" className={this.isRotate?'rotate':'rotate1'}  onClick={()=>{this.shuaxin()}}   />
                  </span>
                  </div>
                  // <Icon type="md-refresh" size="20"   class="ml5 blue-font" :class="isRotate?'rotate':'rotate1'" onClick={()=>{this.shuaxin()}}   />
              );
            }
          },
          // <span
          //           onClick={() => {
          //             this.changeFresh(params,'merchant');
          //           }}
          //         >
                  
          //           <Icons
          //             class="ml5 blue-font"
          //             size="15"
          //             type="huiyuanchaxunshuaxin"
          //           ></Icons>
                    
          //         </span>
          {
            title:'授权额度',
            key:'auth_money',
            align:'center',
            minWidth: 130,
            render: (h, params) => {
              return (
                <div>
                  <span>
                    {params.row.auth_money?(params.row.auth_money=='0.00'?'无限制':params.row.auth_money):'暂无数据'}
                  </span>
                  <span
                    onClick={() => {
                      this.changeFresh(params,'authMoney');
                    }}
                  >
                    {" "}
                    <Icons
                      class="ml5 blue-font"
                      size="15"
                      type="huiyuanchaxunshuaxin"
                    ></Icons>
                  </span>
                </div>
              );
            }

          }
        ],
        data: []
      }
    };
  },

  methods: {
    // show (index,row) {
    //   console.log(row)
    //             this.$Modal.info({
    //                 title: 'User Info',
    //                 content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
    //             })
    //         },
    show(index,params){
     
      params.row.isBlue=true;
      this.tableNewData.columns[index].isBlue=true;
      // this.tableNewData.params[index].isBlue=true;

      setTimeout(()=>{
        // this.tableNewData.columns[index].isBlue=false;
        params.row.isBlue=false;
      },1000)

    },
    shuaxin(index,row){

 
	},
	close(){
		this.isShow = false;
		this.$parent.$refs.auditModal.hide();
	},
    changeFresh(params,type) {
      let data={
        siteId: this.$root.nowSite.id,
        id: params.row.id
      }
      if(type=='balance'){
        data.balance_type='balance';
      }
      if(type=='authMoney'){
        data.balance_type='auth_money';
      }
      automaticWithdrawalMerchantBalance(data, true).then(res => {
        if (res != undefined && res.code == 200) {
         
          this.tableNewData.data.forEach(t => {
            if (t.id == params.row.id) {
              t.balance =res.data.message == undefined ? res.data : res.data.message;
            }
          });
        }
      });
    },
    countStop() {
      const vm = this;
   
      this.datatail.automaticWithdrawalId = this.automaticWithdrawalId;
      if (this.datatail.automaticWithdrawalId == "") {
        this.$Message.success({ content: "请选择出款平台" });
        return false;
      }
      if (!this.click) return;
      this.click = false;
      this.content = this.totalTime + `秒后重新点击`;
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.content = this.totalTime + "s后重新点击";
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.content = "确认提交";
          this.totalTime = 5;
          this.click = true; //这里重新开启
        }
      }, 1000);

      if (this.datatail.remark == "") {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$Message.destroy();
          this.$Message.error("请选择拒绝原因");
          this.$root.endEditLoading();
        }, 200);
        return false;
      }
       //授权额度（this.authMoney）需要大于实际出款额度（this.newActualAmount）
      //  console.log(this.authMoney,'授权额度')
      //  console.log(this.newActualAmount,'实际出款额度')
      //  console.log(this.newBlance,'商户余额')
      //  if(Number(this.authMoney)>=Number(this.newActualAmount)||Number(this.authMoney)==0){
        //  if(Number(this.newBlance)>=Number(this.newActualAmount)){
          withdrawalsAudit(this.datatail).then(async (res) => {
            if (res != undefined && res.code == 200) {
              this.$root.endEditLoading();
              this.$refs.sendLoan.hide();
              if (res.data.code == 400) {
                let msg = res.data.message;
                if (msg) {
                  this.failureText = msg;
                  this.isShow = true;
                }
              }
              if (res.data && res.data == "审核成功") {
                this.$parent.$refs.auditModal.hide();
              }
              let params = {
                ...this.$parent.searchKey,
                siteId: this.$root.nowSite.id
              };
              this.$parent.getData({ params });
            }
          });

        //  }else{
        //     this.$Tip.success({content:'当前出款平台余额不足！'})
        //     return false
        //  }
  

      //  }else{
      //    this.$Tip.success({content:'当前出款平台授权余额不足，请联系管理员！'})
      //    return false
      //  }
   
    },
    countDown() {
      if (!this.canClick) return;
      this.canClick = false;
      let clickOK = window.setInterval(() => {
        this.totalTime--;
        if (this.totalTime < 0) {
          window.clearInterval(clickOK);
          this.totalTime = 5;
          this.canClick = true;
        }
      }, 1000);
    },
    showModal() {
      this.$refs.sendLoan.show();
      this.$refs.sendLoan.spinShow();
      this.getData();
    },
    getData() {
      const loanData = {
        uid: this.loanUid,
        siteId: this.$root.nowSite.id
      };
      automaticWithdrawalEnableList(loanData)
        .then(res => {
          this.loanList = res.data;
          // this.tableNewData.columns.forEach(t=>this.$set(t,'isBlue',true))
         
          this.tableNewData.data = res.data;
          this.tableNewData.data.forEach(t=>this.$set(t,'isBlue',false))
          this.tableNewData.columns.forEach((t)=>{
    
             if(t.title=='测试'){
             this.$set(t,'slot','action')
             }
          })
       
          this.$refs.sendLoan.spinHide();
        })
        .catch(error => {
          this.$refs.sendLoan.spinHide();
        });
    }
  }
};
</script>
<style lang="less" scoped>

.rotate {
  transition: all 1s;
}
.rotate1 {
  transform: rotate(360deg);
  -ms-transform: rotate(360deg); /* IE 9 */
  -moz-transform: rotate(360deg); /* Firefox */
  -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
  -o-transform: rotate(360deg); /* Opera */
  transition: all 1s;
}
.rotate2 {
  transition: all 0.5s;
}
.rotate3 {
  transform: rotate(180deg);
  -ms-transform: rotate(180deg); /* IE 9 */
  -moz-transform: rotate(180deg); /* Firefox */
  -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
  -o-transform: rotate(180deg); /* Opera */
  transition: all 0.5s;
}

.loanClick {
  .disabled {
    background-color: #ddd;
    border-color: #ddd;
    color: #57a3f3;
    cursor: not-allowed; // 鼠标变化
  }
}
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
      background: #ed4014;
    }
  }
	.content{
		.txt {
  -webkit-box-pack: center;
  justify-content: center;
  height: 107px;
  .iconfont {
    color: #ed4014 !important;
  }
  .font {
    font-size: 20px;
    margin-left: 10px;
    color: rgb(68, 68, 68);
    word-break: break-all;
  }
}
.btns {
  padding-bottom: 33px;
  -webkit-box-pack: center;
  justify-content: center;
  .ivu-btn {
    width: 120px;
    height: 50px;
    font-size: 20px;
  }
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


</style>

