<template>
	<div>
		<div class="v2-search">
			<Form ref="searchKey" inline>
				<div class="v2-button mb0">
					<Button
						@click="showModal('addLottery')"
						v-if="showAdd && ((adminType == 'super') || (authInPage.indexOf('lotteryAddNum') != -1))"
					>添加开奖</Button>
					<Button
						@click="revocation"
						v-if="(adminType == 'super') || (authInPage.indexOf('lotteryRevocation') != -1)"
					>撤单</Button>
				</div>
				<FormItem label="彩票名称">
					<LotterySelect
						ref="lotterySelect"
						:mode="'官方彩'"
						class="s-140"
						:clearable="false"
						@on-lottery-change="OnLotteryChange"
						@on-name-change="onNameChange"
						@send-officialList="getLotteryList"
					></LotterySelect>
				</FormItem>
				<FormItem label="期数">
					<Input clearable v-model="searchKey.issue" placeholder="请输入期数" class="s-140" />
				</FormItem>
				<FormItem label="状态">
					<Select v-model="searchKey.status" class="s-140" placeholder="全部" clearable>
						<Option value="1">已结算</Option>
						<Option value="2">未结算</Option>
					</Select>
				</FormItem>
				<FormItem>
					<Button
						class="search"
						type="primary"
						@click.prevent="searchSubmit('search')"
						:loading="$root.tableLoading"
					>查询</Button>
				</FormItem>
			</Form>
		</div>
		<div class="v2-table">
			<Tables
				ref="tables"
				:columns="table.columns"
				:loading="$root.tableLoading"
				:value="table.data"
				:total="table.total"
				@on-page-change="onPageChange"
				@on-page-size-change="onPageSizeChange"
				:pageSizeOpts="table.pageSizeOpts"
			></Tables>
		</div>
		<!-- 开奖回滚 -->
		<Modals ref="lotteryBack" title="开奖回滚" width="800">
			<div slot="content" class="ft14 ml0">
				<div class="mb20 ml20 mt20">彩票名称: {{lotteryName}}</div>
				<Form
					ref="lotteryBackInfo"
					:model="lotteryBackInfo"
					:rules="lotteryBackInfoValidate"
					:label-width="110"
					inline
				>
					<div class="ml105f">
						<FormItem>
							<span class="pl15 pr15">{{lotteryBackInfo.issue}}期</span>
							<span class="pr15">撤回类型</span>
							<Select style="width:140px;" v-model="lotteryBackInfo.type">
								<Option value="1">撤回未中奖注单</Option>
								<Option value="2">撤回所有注单</Option>
							</Select>
						</FormItem>
						<FormItem label="开奖号码" prop="lotteryNum">
							<Input
								class="w240x mb20"
								placeholder="如：1,2,3,4,5,6,7(以英文逗号隔开)"
								v-model="lotteryBackInfo.lotteryNum"
							/>
						</FormItem>
					</div>
					<Button
						type="primary"
						class="ivu-btn submit ft20 mb50"
						style="margin-left:250px"
						@click="searchSubmit('back')"
					>确认回滚</Button>
				</Form>
			</div>
		</Modals>
		<!-- 添加开奖 -->
		<Modals ref="addLottery" title="添加开奖" width="560">
			<div slot="content">
				<Form
					ref="addLotteryInfo"
					:model="addLotteryInfo"
					:rules="addLotteryInfoValidate"
					style="width:560px;"
					:label-width="170"
				>
					<FormItem label="期数" class="mt20" prop="issue">
						<Input v-model="addLotteryInfo.issue" placeholder="如2019001" class="w240x" />
					</FormItem>
					<FormItem label="封盘时间" prop="openingTime">
						<DatePicker
							transfer
							style="width:240px;"
							v-model="addLotteryInfo.openingTime"
							type="datetime"
							placeholder="请选择封盘时间"
						></DatePicker>
					</FormItem>
					<FormItem label="开奖号码" prop="number">
						<Input
							v-model="addLotteryInfo.number"
							class="w240x mb20"
							placeholder="如：1,2,3,4,5,6,7(以英文逗号隔开)"
						/>
					</FormItem>
					<FormItem>
						<Button type="primary" class="w240x ft20 mb20 ivu-btn submit" @click="searchSubmit('add')">确认添加</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
		<!-- 修改开奖号码 -->
		<Modals ref="editLotteryNum" title="修改开奖号码" :width="800">
			<div slot="content" class="v2-form-wrapper">
				<div class="lotteryMan">
					<Form style="width:800px;">
						<FormItem>
							<div class="ml30">
								彩票名称
								<span class="pl20">{{lotteryName}}</span>
							</div>
						</FormItem>
						<FormItem>
							<div class="ml30 ft14 clearfix">
								<div class="fl mr20">{{editInfo.issue}}期</div>
								<div class="fl" style="vertical-align: middle;">
									<p v-for="(t,i) in editInfo.number" :key="i" class="fl">
										<Input class="ib" v-model="editInfo.number[i]" />
										<span class="p10 yc">-</span>
									</p>
								</div>
							</div>
						</FormItem>
						<FormItem class="center">
							<Button type="primary" class="ivu commonSubmit w240x ft20" @click="searchSubmit('edit')">确认保存</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		</Modals>
		<!-- 撤单功能 -->
		<Modals ref="revocation" title="撤单" :width="560">
			<div slot="content">
				<Form
					ref="revocationInfo"
					style="width: 560px;"
					:model="revocationInfo"
					:rules="revocationRules"
					:label-width="170"
				>
					<FormItem label="彩票名称" prop="lid">
						<Select
							placeholder="请选择"
							class="w240x"
							transfer
							v-model="revocationInfo.lid"
							clearable
							@on-change="setLotteryName"
						>
							<Option v-for="(t,i) in componentsLotteryList" :key="'official'+i" :value="t.id">{{t.name}}</Option>
						</Select>
					</FormItem>
					<FormItem label="期数" prop="issue">
						<Input class="w240x" v-model="revocationInfo.issue" />
					</FormItem>
					<FormItem>
						<Button type="primary" class="w240x ivu-btn commonSubmit w240x" @click="revocationSubmit">确认撤单</Button>
					</FormItem>
				</Form>
			</div>
		</Modals>
	</div>
</template>
<script>
import Tables from "@/components/tables";
import Modals from "@/components/modals";
import { mapState } from "vuex";
import LotterySelect from "@/components/lottery-select";
import {
  lotteryOpenNumberList,
  lotteryNameList,
  lotteryPayMoney,
  lotteryAddNum,
  lotteryUpNum,
  lotteryAgainPrize,
  lotteryRevocation
} from "@/api/lottery";
import { getUserType } from '@/libs/util';
export default {
  name: "lotteryManagement",
  components: {
    Tables,
    Modals,
    LotterySelect
  },
  computed: {
    ...mapState({
      sixLotteryColor: state => state.info.sixLotteryColor
    })
  },
  data() {
    return {
      showAdd: false,
      componentsLotteryList: [],
      adminType: getUserType(),
      authInPage: JSON.parse(localStorage.authInPage),
      currentIndex: 0,
      lotteryName: "香港六合彩",
      selectLotteryList: [], //下拉框所有彩种数据
      searchKey: { issue: "", lid: 1 },
      //添加新的开奖信息
      addLotteryInfo: {
        issue: "",
        openingTime: "",
        number: ""
      },
      // 撤单信息
      revocationInfo: {
        siteId: this.$root.nowSite.id,
        lid: null,
        lname: '',
        issue: ''
      },
      revocationRules: {
        lid: [{ required: true, message: '请选择彩票', trigger: "change", pattern: /.+/ }],
        issue: [
          { required: true, message: '请输入期数', trigger: 'blur' },
          { pattern: /^[+]{0,1}(\d+)$/, message: "请输入正确的期数", trigger: 'blur'}
        ]
      },
      //修改信息
      editInfo: {},
      addLotteryInfoValidate: {
        issue: [
          { required: true, message: "请输入期数", trigger: "blur" },
          { message: "请输入合法期数", trigger: "blur", pattern: /^[+]{0,1}(\d+)$/ }
        ],
        openingTime: [
          { required: true, message: "请选择封盘时间", trigger: "blur", pattern: /.+/ }
        ],
        number: [
          { required: true, message: "请输入开奖号码", trigger: "blur" }
        ]
      },
      //回滚信息
      lotteryBackInfo: {
        lotteryNum: ""
      },
      lotteryBackInfoValidate: {
        lotteryNum: [
          { required: true, message: "请输入开奖号码", trigger: "blur" }
        ]
      },
      table: {
        total: 0,
        title: "开奖管理",
        pageSizeOpts: [20, 30, 40,50],
        data: [],
        columns: [
          {
            title: "期数",
            key: "issue",
            align: "center",
            minWidth: 100
            // render: (h, params) => <span>{this.$root.removeYear(params.row.issue)}</span>
          },
          {
            title: "开奖结果",
            key: "resultInfo",
            align: "center",
            minWidth:200,
            render: (h, params) => {
              let bgColor;
              const { lotteryId, resultInfo } = params.row;
              return resultInfo.split(",").map(num => {
                //  1香港六合彩 18快速六合彩  19 5分六合彩
                if (lotteryId == 1 || lotteryId == 18 || lotteryId == 19) {
                  this.sixLotteryColor.map(item => {
                    if (item.number.includes(num * 1)) bgColor = item.color
                  });
                } else {
                  let c1 = parseInt(Math.random() * 256);
                  let c2 = parseInt(Math.random() * 256);
                  let c3 = parseInt(Math.random() * 256);
                  bgColor = `rgba(${c1},${c2},${c3},.9)`;
                }
                return h(
                  "span",
                  {
                    style: {
                      color: "#fff",
                      cursor: "pointer",
                      width: "20px",
                      height: "20px",
                      marginLeft: "5px",
                      display: "inline-block",
                      backgroundColor: bgColor,
                      textShadow: "1px 1px 1px #000"
                    }
                  },
                  num
                );
              });
            }
          },
          {
            title: "开奖时间",
            key: "openingTime",
            align: "center",
            minWidth:130,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.openingTime)}</span>
            )
          },
          {
            title: "添加时间",
            key: "addTime",
            align: "center",
            minWidth:130,
            render: (h, params) => (
              <span>{this.$root.unixTime(params.row.addTime)}</span>
            )
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth:50,
            render: (h, params) => {
              const { status } = params.row
              let color = status === 'no' ? 'red' : 'green'
              return <span style={{color}}>{status == 'no' ? '未结算' : '已结算'}</span>
            }
          },
          {
            title: "操作",
            align: "center",
            minWidth:85,
            render: (j, params) => {
              return h("div", [
                h(
                  "a",
                  {
                    style: {
                      display: (params.row.status === 'no') && ((this.adminType == 'super') || (this.authInPage.indexOf('lotteryUpNum') != -1)) ? 'inline-block' : 'none',
                      paddingRight: "15px"
                    },
                    on: {
                      click: () => {
                        const { issue, resultInfo } = params.row;
                        this.$refs.editLotteryNum.show();
                        this.editInfo = {
                          issue,
                          lid: this.searchKey.lid,
                          number: resultInfo.split(",")
                        };
                        this.currentIndex = params.index;
                      }
                    }
                  },
                  "修改"
                ),
                h(
                  "a",
                  {
                    style: {
                      display: (params.row.status == 'yes') && ((this.adminType == 'super') || (this.authInPage.indexOf('lotteryAgainPrize') != -1)) ? 'inline-block' : 'none',
                      paddingRight: "15px"
                    },
                    on: {
                      click: () => {
                        const { issue, resultInfo } = params.row;
                        this.lotteryBackInfo = {
                          type: "1",
                          issue
                        };
                        this.$refs.lotteryBackInfo.resetFields();
                        this.$refs.lotteryBack.show();
                      }
                    }
                  },
                  "回滚"
                ),
                h(
                  "a",
                  {
                    style: {
                      display: (this.adminType == 'super') || (this.authInPage.indexOf('lotteryPayMoney') != -1) ? 'inline-block' : 'none'
                    },
                    on: {
                      click: () => {
                        let data = {
                          issue: params.row.issue,
                          lid: this.searchKey.lid,
                          siteId: this.$root.nowSite.id
                        };
                        lotteryPayMoney(data).then(res => {
                          if(res != undefined && res.data == 200){
                            this.getData({ params: this.searchKey });
                          }
                        });
                      }
                    }
                  },
                  "结算"
                )
              ]);
            }
          }
        ]
      }
    };
  },
  mounted() {
    // if((this.authInPage.indexOf('lotteryUpNum')==-1)&&this.authInPage.indexOf('lotteryPayMoney')==-1&&this.authInPage.indexOf('lotteryAgainPrize')==-1){
    //   let arr=[]; 
    //   this.table.columns.forEach(t=>{
    //     if(t.title!='操作'){arr.push(t)}
    //   })
    //   this.table.columns=arr;
    // }

    this.$nextTick(() => {
      this.$refs.lotterySelect.init();
      this.getData({ params: {...this.searchKey, status: "0"} });
      this.$Message.config({
        top: 50,
        duration: 1
      })
    });
    
  },
  methods: {
    resetForm() {
      for (let key in this.addLotteryInfo) {
        delete this.addLotteryInfo[key];
      }
    },
    setLotteryName(value) {
      this.revocationInfo.lname = this.revocationInfo.lid && this.componentsLotteryList.find(item => item.id == value).name
    },
    // 撤单
    revocation() {
      this.$refs.revocationInfo.resetFields()
      this.$refs.revocation.show()
    },
    getLotteryList(res) {
      this.componentsLotteryList = res
    },
    getData(data) {
      if (!data.params.status) data.params.status = '0'
      this.$root.startTableLoading(this);
      lotteryOpenNumberList(data).then(res => {
        const { data, total } = res.data;
        let statusList=[];
        data&&data.forEach(t=>{
          statusList.push(t.status)
      
        })
        // if(statusList.includes('no')){
        //   }else{
        //     let arr=[]; 
        //     this.table.columns.forEach(t=>{
        //       if(t.title!='操作'){arr.push(t)}
        //     })
        //     this.table.columns=arr;
        //   }
        this.table.total = total;
        this.table.data = data;
        this.$root.endTableLoading()
      }).catch(error=> this.$root.endTableLoading());
    },
    //提交撤单
    revocationSubmit() {
      this.$refs.revocationInfo.validate(valid => {
        if (valid) {
          this.$refs.revocation.spinShow()
          lotteryRevocation(this.revocationInfo, true).then(res => {
            if (res != undefined && res.code == 200) {
              this.$refs.revocation.spinHide()
              this.$refs.revocation.hide()
              this.$Message.success('撤单成功')
              this.searchSubmit('search')
            } else {
              this.$refs.revocation.spinHide()
            }
          }).catch(error => {
            this.$refs.revocation.spinHide()
          })
        }
      })
    },
    // 点击出现弹窗
    showModal(name) {
      this.$refs.addLotteryInfo.resetFields();
      this.resetForm();
      this.$refs[name].show();
    },
    OnLotteryChange(res) {
      this.searchKey.lid = res;
    },
    onNameChange(list) {
      this.selectLotteryList = list;
    },
    onPageChange(page) {
      if (!this.searchKey.status) this.searchKey.status = '0'
      let data = { ...this.searchKey };
      this.getData({ params: this.searchKey, query: { page } });
    },
    onPageSizeChange(pageSize) {
      this.searchKey.limit = pageSize;
      this.getData({ params: this.searchKey });
    },
    // 表单提交  search查询  add添加开奖  edit修改  back回滚
    searchSubmit(modalName) {
      switch (modalName) {
        case "search":
          this.selectLotteryList.forEach(item => {
            item.id == this.searchKey.lid ? (this.lotteryName = item.name) : "";
          });
          this.showAdd = this.searchKey.lid == 1 ? false : true
          // 显示修改，回滚时的彩票名字
          if(this.searchKey.issue) this.searchKey.issue = this.$root.trimAll(this.searchKey.issue)
          for(let key in this.searchKey) {
            if(!this.searchKey[key]) delete this.searchKey[key]
          }
          if (!this.searchKey.status) this.searchKey.status = '0'
          this.getData({ params: this.searchKey });
          this.$refs.tables.setPage();
          break;
        case "add":
          this.$refs.addLotteryInfo.validate(valid => {
            if (valid) {
              this.$refs.addLottery.spinShow();
              let data = { ...this.addLotteryInfo, lid: this.searchKey.lid };
              data.openingTime = this.$root.formatTimeS(data.openingTime);
              lotteryAddNum(data, true)
                .then(res => {
                  if (res != undefined && res.code == 200) {
                    this.$Message.success('添加成功')
                    this.$refs.addLottery.spinHide();
                    this.$refs.addLottery.hide();
                    this.getData({ params: this.searchKey })
                    this.$refs.addLotteryInfo.resetFields();
                  }
                  else this.$refs.addLottery.spinHide()
                })
                .catch(error => {
                  this.$refs.addLottery.spinHide();
                });
            }
          });
          break;
        case "edit":
          let { number, issue } = this.editInfo;
          let list = []
          if (this.searchKey.lid != 10) {
            number.forEach(item => {
              if (String(item).length == 1) list.push(item)
              else list.push(item)
            })
          } else number.forEach(t => list.push(t))
          let postData = {
            issue: String(issue),
            number: list.join(","),
            lid: this.searchKey.lid
          };
          this.$refs.editLotteryNum.spinShow();
          lotteryUpNum(postData, true)
            .then(res => {
              if (res != undefined && res.code == 200) {
                this.$Message.success('修改开奖号码成功')
                this.$refs.editLotteryNum.hide();
                this.table.data[this.currentIndex].resultInfo = postData.number;
              }
              this.$refs.editLotteryNum.spinHide();
            })
            .catch(error => {
              this.$refs.editLotteryNum.spinHide();
            });
          break;
        case "back":
          this.$refs.lotteryBackInfo.validate(valid => {
            let { type, issue, lotteryNum } = this.lotteryBackInfo;
            let list = []
            if (this.searchKey.lid != 10) {
              lotteryNum.split(',').forEach(item => {
                if (String(item).length == 1) list.push(item)
                else list.push(item)
              })
            } else lotteryNum.split(',').forEach(t => list.push(t))
            if (valid) {
              this.$refs.lotteryBack.spinShow();
              let postData = {
                lid: this.searchKey.lid,
                type,
                issue: String(issue),
                result: list.join(',')
              }
              lotteryAgainPrize(postData, true)
                .then(res => {
                  this.$refs.lotteryBack.spinHide();
                  if (res != undefined && res.code == 200) {
                    this.$Message.success('回滚成功')
                    this.$refs.lotteryBack.hide();
                    this.getData({ params: this.searchKey });
                  }
                })
                .catch(error => {
                  this.$refs.lotteryBack.spinHide();
                });
            }
          });
          break;
      }
    }
  }
};
</script>
<style lang="less" scoped>
	@import "../../styles/button.less";
	@import "../../styles/class.less";
	@import "../../styles/lottery.less";
	.jz {
		padding-left: 110px !important;
	}
	.inline {
		display: inline-block;
	}
	.yc:nth-child(7) {
		display: none !important;
	}
	.ivu-modal {
		width: 560px;
	}
	.ib {
		width: 40px;
		height: 36px;
	}
	.ivu-form-item-content {
		p:nth-last-child(1) {
			span:nth-last-child(1) {
				display: none !important;
			}
		}
	}

	.center {
		text-align: center;
	}
	/deep/.ivu-form-item-error-tip {
		left: 0px;
		top: 35px;
		width: 120px;
	}
	/deep/.ivu-table-header {
		th {
			&:nth-child(1) {
				.ivu-lotteryckbox {
					display: none;
				}
			}
		}
	}
	//modal提示小图标距左边的距离
	/deep/.ivu-modal-content {
		/deep/.ivu-modal-body {
			/deep/.txt {
				/deep/i {
					display: inline-block !important;
					margin-left: 15px !important;
				}
			}
		}
	}
</style>


