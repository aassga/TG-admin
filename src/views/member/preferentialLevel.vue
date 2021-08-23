<!--
 * @Author: your name
 * @Date: 2021-05-31 18:26:15
 * @LastEditTime: 2021-06-01 14:41:13
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \tgweb_admin_h5_v2\src\views\member\preferentialLevel.vue
-->
<template>
    <div>
        <div class="v2-search">
            <Form inline>
                <FormItem label="开始日期">
                    <DatePicker 
                     v-model="Time[0]"
                    placeholder="开始日期"></DatePicker>
                </FormItem>
                 <FormItem label="结束日期">
                    <DatePicker 
                     v-model="Time[1]"
                     placeholder="结束日期"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button :loading="$root.tableLoading"  @click.prevent="searchSubmit" type="primary">查询</Button>
                </FormItem>
            </Form>
        </div>
            <div class="v2-search bb">
      <ButtonGroup class="repay-button1" style="margin-bottom: 0.3px">
        <Button
          @click.native="tabClick(t)"
          class="fontColor"
          v-for="(t, i) in btnList"
          :class="tabName == t ? 'active' : ''"
          :key="i"
          >{{ t }}</Button
        >
     
      </ButtonGroup>
         <div class="fr">
           <Poptip
            trigger="hover"
            width="500"
            placement="left-start"
            word-wrap
            content="优惠层级：控制会员的优惠派送
    一级：新会员层，小于等于7天内注册的新会员
    二级：观察层，既不属于新会员层，又不属于正常会员层归类到此层级
    三级：正常会员层，注册超过7天，打码倍数满足5倍且存款满足5000
    四级：黑名单层 ，套利会员，不送任何优惠(除反水)，手动拉入活动
    黑名单的归类到此层级"
          
            class="ml14f"
          >
            <Icons type="bangzhutishi" color="#E4E4E4" :size="26"/>
          </Poptip>
          
          <p class="ib ft16 ml10 mb5">
          </p>
         </div>
    </div>
    
        <div class="v2-table">
      <Tables
        ref="tables"
        :columns="
          tabName == '等级统计'
            ? table.columns
            : tabName == '等级配置'
            ? table.columns1
            : table.columns2
        "
        :loading="$root.tableLoading"
        :value="table.data"
         :show-sizer="false"
         :page="false"
        :total="table.total"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
    </div>
    </div>
</template>
<script>
import Icons from "_c/icons";
import Tables from "@/components/tables";
import {bonusLevelSummary,bonusLevelEdit}from "@/api/member";
import { InputNumber } from 'view-design';
export default{
    components:{Tables,Icons},
      data(){
          return{
            Time:[],
            searchKey:{
          
        siteId: this.$root.nowSite.id,
            },
              btnList:['等级统计','等级配置'],
              tabName:'等级统计',
                table: {
        loading: true,
        total: 100,
        pageSizeOpts: [20, 30, 40, 50],
        columns: [
          {
            title: "优惠等级",
            key: "level_alias",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "会员人数",
            key: "member_count",
            align: "center",
            minWidth: 60,
              render: (h, params) => (
              <span class="blue-font"
              onClick={()=>{
              
                const {level}=params.row;
             
                this.$router.push({
                  name:'preferentialLevelDetial',
                  query:{level,...this.searchKey},
                })
              }}
              >{params.row.member_count}</span>
            ),
          },
          {
            title: "有效投注",
            key: "report_valid_bet_amount",
            align: "center",
            minWidth: 80,
     
          },
          {
            title: "优惠金额",
            key: "report_bonus_amount",
            align: "center",
            minWidth: 60,
         
          },
                    {
            title: "存款金额",
            key: "report_deposit_amount",
            align: "center",
            minWidth: 75,
     
          },
          {
            title: "取款金额",
            key: "report_withdrawals_amount",
            align: "center",
            minWidth: 75,
        
          },
          {
            title: "网站盈利",
            key: "report_profit_amount",
            align: "center",
            minWidth: 75,
       
          },
          {
            title: "现金利润",
            key: "report_cash_amount",
            align: "center",
        
            minWidth: 130,
                 render: (h, params) => {
                            let color = params.row.report_cash_amount > 0 ? '#FF2626' : 'rgb(35, 153, 97)';
                            return <span style={{ color }}>{this.$root.keepTwo(params.row.report_cash_amount)}</span>;
                        }
          },
          {
            title: "打码倍数",
            key: "report_multiple",
            align: "center",
            minWidth: 95,
            tooltip: true,
           
          },
        ],
        columns1: [
          {
            title: "等级",
            key: "level_name",
            align: "center",
            minWidth: 60,
            tooltip: true,
          },
          {
            title: "等级别称",
            key: "level_alias",
            align: "center",
            minWidth: 70,
            className: "pl15 pr15",
            render:(h,params)=>{
              const { level_alias } = params.row;
              return(
                <div>
                <span    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "none"
                          : "inline-block",
                         
                    }} >{level_alias}</span>
                    <Input
                    style={{
                    
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}
                    placeholder="最多不超过10个字"
                    type="text"
                    maxlength='10'
                    value={level_alias}
                    onInput={(e) => {
                   
                      
                      if (e) {
                        this.$set(params.row, "level_alias", e);
                      } else {
                        this.$set(params.row, "level_alias", "");
                      }
                    }}
                  />   
                </div>
              )
            }
          },
          // {
          //   title: "注册天数",
          //   key: "conf_reg_day",
          //   align: "center",
          //   minWidth: 50,
          //   render:(h,params)=>{
          //     const {conf_reg_day,conf_reg_symbol}=params.row;
          //     console.log(conf_reg_day)
          //     console.log(conf_reg_symbol)
          //     return h('div',[
          //       h('span',{
          //         style:{
          //              display:
          //               params.row.showStatus == "input"
          //                 ? "none"
          //                 : "inline-block",
          //         }
          //       },conf_reg_symbol),
          //       h('Select',{
          //         	style: {
					// 						    display:
          //               params.row.showStatus == "input"
          //                 ? "inline-block"
          //                 : "none",width:'80px',
					// 							margin: "10px auto",
									              
					// 						},
          //             	props: {
					// 							value: params.row.conf_reg_symbol,
          //               transfer:true,
					// 						},
          //             	on: {
					// 							"on-change": val => {
          //                             if (val) {
          //               this.$set(params.row, "conf_reg_symbol", val);
          //             } else {
          //               this.$set(params.row, "conf_reg_symbol", "");
          //             }
                       
					// 							}
					// 						}

          //       },[
          //         // ≤   ＜ = ≥  ＞
          //           	h("Option", {
					// 							props: {
					// 								value: '<=',
					// 								label:'<='
					// 							}
					// 						}),
					// 						h("Option", {
					// 							props: {
					// 								value: '<',
					// 								label: '<'
					// 							}
					// 						}),
          //             	h("Option", {
					// 							props: {
					// 								value: '=',
					// 								label: '='
					// 							}
					// 						}),
          //             	h("Option", {
					// 							props: {
					// 								value: '>=',
					// 								label: '>='
					// 							}
					// 						}),
          //             	h("Option", {
					// 							props: {
					// 								value: '>',
					// 								label: '>'
					// 							}
					// 						}),
                    
          //       ]),
          //       h('span',{
          //         style:{
                   
          //               display:
          //               params.row.showStatus == "input"
          //                 ? "none"
          //                 : "inline-block",
          //         }
          //       },conf_reg_day
          //       ),
          //        h('Input',{
          //         style:{
          //               width:'60px',
          //               marginLeft:'10px',
          //               display:
          //               params.row.showStatus == "input"
          //                 ? "inline-block"
          //                 : "none",
          //         },
          //         	props: {
					// 							value: params.row.conf_reg_day,
          //               transfer:true,
                       
					// 						},
          //           on:{
          //            "input":val=>{
          //              if(val){
          //                 this.$set(params.row, "conf_reg_day", val);
          //              }else{
          //                 this.$set(params.row, "conf_reg_day", '');
          //              }
          //            }
          //           }
          //       },  
          //       )
          //     ])
          //   }
          
          // },
          // {
          //   title: "打码倍数",
          //   key: "conf_multiple",
          //   align: "center",
          //   minWidth: 50,
          //   className: "pl15 pr15",
          //        render:(h,params)=>{
          //     const { conf_multiple } = params.row;
          //     return(
          //       <div>
          //       <span    style={{
          //             display:
          //               params.row.showStatus == "input"
          //                 ? "none"
          //                 : "inline-block",
          //           }} >{conf_multiple}</span>
          //           <Input
          //          required
          //           style={{
          //             display:
          //               params.row.showStatus == "input"
          //                 ? "inline-block"
          //                 : "none",
          //           }}
          //           placeholder="请输入打码倍数"
          //           type="text"
          //           pattern="^1[345678][0-9]{9}$"
          //           value={conf_multiple}
                 
          //           onInput={(e) => {
                   
          //             if (e) {
          //               //   var isletter = /^[1-9]\d*$/.test(e);
                       
          //               // //   if(isletter){
          //               // //     console.log(e)
          //               // //       this.$set(params.row, "conf_multiple", e);
          //               // // }else {
          //               // //   console.log(e)
          //               // //      this.$Tip.info({ content: "列名不能含有中文跟数字！" });
                          
          //               // // }
                      
                     
          //             } else {
          //               this.$set(params.row, "conf_multiple", "");
          //             }
          //           }}
          //         />   
          //       </div>
          //     )
          //   }
          // },
          {
            title: "备注",
            key: "remark",
            align: "center",
            minWidth: 120,
              className: "pl15 pr15",
            tooltip: true,
                 render:(h,params)=>{
              const { remark } = params.row;
              return(
                <div>
                <span    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "none"
                          : "inline-block",
                    }} >{this.$root.text(remark)}</span>
                    <Input
                    maxlength="30"
                    style={{
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}
                    placeholder="最多不超过30个字"
                    type="text"
                    value={remark}
                    onInput={(e) => {
                      if (e) {
                        this.$set(params.row, "remark", e);
                      } else {
                        this.$set(params.row, "remark", "");
                      }
                    }}
                  />   
                </div>
              )
          }},
          {
            title: "操作",
            key: "content",
            align: "center",
   
            render:(h,params)=>{
              return(
                <div>
                  <span   class="blue-font cs"
                  style={{ display:
                        params.row.showStatus == "span"
                          ? "inline-block"
                          : "none",}}
                    onClick={() => {
                      this.$set(params.row, "showStatus", "input");
                    }}
                  >编辑</span>

                  <span   style={{
                      display:
                        params.row.showStatus == "input"
                          ? "inline-block"
                          : "none",
                    }}>
                    <a
                    onClick={()=>{
                      let newData=[];
                      Array(params.row).forEach(t=>{
                        let m={
                          id:t.id,
                          level_alias:t.level_alias,
                          conf_reg_symbol:t.conf_reg_symbol,
                          // conf_reg_day:t.conf_reg_day,
                          // conf_multiple:t.conf_multiple,
                          remark:t.remark
                        }
                        newData.push(m)
                      })
                      let data={
                        siteId:this.$root.nowSite.id,
                        json:JSON.stringify(newData),
                      }
                      // level_alias
                      
                
                      if(!params.row.level_alias){
                          this.$Tip.info({ content: "请输入等级别称！" });
                        return  false

                      }
                     
                     bonusLevelEdit(data, true).then((res) => {
                          if (res != undefined && res.code == 200) {
                            this.$Message.success("更新成功");
                            params.row.showStatus = "span";
                         
                          }
                        });
                    }}
                    >确定</a>
                    <a   class="ml10"  onClick={() => {
                        params.row.showStatus = "span";
                        if(!params.row.level_alias||!params.row.remark){
                         this.searchSubmit()
                        }
                      }}>取消</a>
                    </span>
                 </div>
              )
            }
          },
        ],
        data: [],
      },

          }
      },
      mounted(){
        let data ={
          siteId:this.$root.nowSite.id,
        }
         this.getData({params:data})
      },
      methods:{
        searchSubmit(){
       
          let data={...this.searchKey};
              if (this.$root.validateTime(this.Time)) {
        const [startTime, endTime] = this.$root.validateTime(this.Time);
        this.searchKey.startTime = data.startTime =
          startTime && this.$root.formatTimeS(startTime);
        this.searchKey.endTime = data.endTime =
          endTime && this.$root.formatnightTimeS(endTime);
      } else {
        return false;
      }
       for (let key in data) {
        if (!data[key]) delete data[key];
      }
       this.getData({params:data});


        },
          getData(data){
             this.$root.startTableLoading();
            bonusLevelSummary(data)
          .then((res) => {
            if (res != undefined && res.code == 200) {
           
              const { data, } = res;
            res.data.forEach((item) => (item.showStatus = "span"));
              this.table.data = data;
          
            }
            this.$root.endTableLoading();
          })
          .catch((err) => this.$root.endTableLoading());
            
          },
          tabClick(t){
           this.tabName = t;
           let  data={...this.searchKey}
           this.getData({params:data});
       
          },
      }
  }

</script>