<template>
    <div class="ib" ref="content">
        <Select transfer class="className fontColor"  filterable placeholder="请选择" multiple v-model="checkedArray" @on-change="sendCheckedArray">
            <Option class="fontColor" v-for="(t, i) in payWay" :key="i" :value="t.id">{{ t.className }}</Option>
        </Select>
        <div class="mt30 clearfix">
           
            <div class="clearfix mb10 fl" style="margin-left:-78px;" v-for="(t, i) in methodsList" :key="i" v-if="checkedArray && checkedArray.includes(t.id)">
                <span style="width:82px;display:inline-block" class="fl" v-if='t.id!=1166&&t.id!=1171' >
                    <label>{{ t.className }}</label>
                </span>
                <RadioGroup v-model="modelData[i].limit" @on-change="sendCheckedArray" class="fl"  v-if='t.id!=1166&&t.id!=1171'>
                    <Radio label="limit" class="mr5">
                        <span>限额</span>
                    </Radio>
                    <Radio label="format">
                        <span>固定金额</span>
                    </Radio>
                </RadioGroup>
                <!-- 固定金额 -->
                <div class="fr" style="margin-rigth:60px;" v-show="modelData[i].limit == 'format'"  v-if='t.id!=1166&&t.id!=1171'>
                    <span class="ml80">固定金额</span>
                    <Input
                        type="text"
                        placeholder="固定金额"
                        class="w280x ml20"
                        v-model="modelData[i].formatAmount"
                        @on-blur="sendCheckedArray"
                        @on-keyup="modelData[i].formatAmount = modelData[i].formatAmount && modelData[i].formatAmount.replace(/[^\d\,]/g, '')"
                    />
                    <div class="clearfix mt5">
                        <span class="fl ml80">常用金额</span>
                        <Input
                            type="text"
                            class="w280x  ml20"
                            @on-blur="sendCheckedArray"
                            @on-keyup="modelData[i].quick_amount = modelData[i].quick_amount && modelData[i].quick_amount.replace(/[^\d\,.]/g, '')"
                            v-model="modelData[i].quick_amount"
                            style="margin-left:20px"
                            placeholder="客户端快捷按钮,多个以英文逗号隔开"
                        />
                    </div>
                    <div class="clearfix mt5" v-if="$route.name === 'paymentAdd' || $route.name === 'paymentEdit' || $route.name === 'paymentManager'">
                        <span class="ml80">手续费比例</span>
                        <Input
                            type="text"
                            class="w280x ml5"
                            @on-blur="sendCheckedArray"
                            @on-keyup="modelData[i].handle_fee = modelData[i].handle_fee && modelData[i].handle_fee.replace(/[^\d\,.]/g, '')"
                            v-model="modelData[i].handle_fee"
                            placeholder="请输入手续费比例"
                        />
                    </div>
                </div>
                <!-- 限额 -->
                <div class="fr frPosition" v-show="modelData[i].limit == 'limit'" v-if='t.id!=1166&&t.id!=1171'>
                    <div class="clearfix">
                        <span class="fl ml80">限额</span>
                        <InputNumber
                            placeholder="单笔下限"
                            :min="1"
                            :max="999999999"
                            style="width:118px;margin-left:47px;margin-right:14px"
                            v-model="modelData[i].minAmount"
                            @on-change="sendCheckedArray"
                        />
                        <span>—</span>
                        <InputNumber
                            :min="1"
                            :max="999999999"
                            placeholder="单笔上限"
                            class="ml15"
                            style="width:118px;"
                            v-model="modelData[i].maxAmount"
                            @on-change="sendCheckedArray"
                        />
                        <span class="fl ml80">常用金额</span>
                        <Input
                            class="w280x fl ml20"
                            style="margin-top:5px"
                            v-model="modelData[i].quick_amount"
                            @on-keyup="modelData[i].quick_amount = modelData[i].quick_amount && modelData[i].quick_amount.replace(/[^\d\,.]/g, '')"
                            @on-blur="sendCheckedArray"
                            placeholder="客户端快捷按钮,多个以英文逗号隔开"
                        />
                        <div v-if="$route.name === 'paymentAdd' || $route.name === 'paymentEdit' || $route.name === 'paymentManager'">
                            <span class="fl ml80">手续费比例</span>
                            <Input
                                type="text"
                                class="w280x fl ml5"
                                style="margin-top:5px"
                                @on-blur="sendCheckedArray"
                                @on-keyup="modelData[i].handle_fee = modelData[i].handle_fee && modelData[i].handle_fee.replace(/[^\d\,.]/g, '')"
                                v-model="modelData[i].handle_fee"
                                placeholder="请输入手续费比例"
                            />
                        </div>
                    </div>
                </div>
            </div>
            </div>
    </div>
    
</template>
<script>
import { getpaymentID } from '@/api/finance';
export default {
    props: {
        methodsdetail: Array,
        className: String, //样
        defaultChecked: Array //默认选中的支付方式
      
    },
    data() {
        return {
            modelData: [],
            checkedArray: [],
            checkobject: { formatAmount: {}, limitAmount: {} },
            methodsList: [],
            payWay: [],
            payname: [],
            regMoney:'',
        };
    },
    methods: {
        sendCheckedArray(value) {
            // console.log(value)
            let newarray = [];
            this.checkedArray.map(item => {
                this.modelData.map(newitem => {
                    if (item == newitem.id) {
                        newarray.push(newitem);
                    }
                });
            });
            // console.log(this.checkedArray)
            const { formatAmount, limitAmount } = this.checkobject;
            Object.keys(formatAmount).forEach(el => {
                delete formatAmount[el];
            });
            Object.keys(limitAmount).forEach(el => {
                delete limitAmount[el];
            });
            newarray.map((item, index) => {
                this.payname.push(item.className);
                //固定金额
                if (item.limit == 'format') {
                    let key = item.id + '';
                    formatAmount[key] = {};
                    formatAmount[key].name = item.className;
                    formatAmount[key].formatAmount = item.formatAmount;
                    formatAmount[key].quick_amount = item.quick_amount;
                    formatAmount[key].handle_fee = item.handle_fee;
                    if (item.formatAmount) {
                        var Regx = /^[A-Za-z]*$/;
                        if (Regx.test(item.formatAmount)) {
                            this.$Message.error('请输入正确的固定金额');
                            item.formatAmount = ' ';
                        } else {
                            var index = item.formatAmount.split(',').indexOf('');
                            if (index != -1) {
                                this.$Message.error('请输入正确的固定金额');
                                item.formatAmount = ' ';
                            }
                        }
                    }
                }
                if (item.limit == 'limit') {
                    //限额
                    let key2 = item.id + '';
                    limitAmount[key2] = {};
                    limitAmount[key2].name = item.className;
                    limitAmount[key2].minAmount = item.minAmount;
                    limitAmount[key2].maxAmount = item.maxAmount;
                    limitAmount[key2].quick_amount = item.quick_amount;
                    limitAmount[key2].handle_fee = item.handle_fee;
                    // if (
                     
                    //   Number(this.regMoney)<Number(item.maxAmount)
                    // ) {
                    //   this.$Message.error("上限金额必须小于"+this.regMoney);
                    //   return false
                    // }
                }
            });
            let newkey = 'newarray';
            let newvalue = newarray;
            this.checkobject[newkey] = newvalue;

            this.$emit('sendArray', this.checkobject);
        },
        getpayselectlist() {
            const data = {
                classType: 'payment'
            };
            getpaymentID(data).then(res => {
                this.payWay = res.data;
                // console.log(this.payWay )
                this.methodsList = res.data;
                this.modelData = [];
                this.methodsList.map(item => {
                    let data = {};
                    data.limit = 'limit';
                    data.id = item.id;
                    data.className = item.className;
                    data.minAmount = null;
                    data.maxAmount = null;
                    data.quick_amount = null;
                    data.handle_fee = '';
                    data.formatAmount = null;
                    this.modelData.push(data);
                });
                if (this.methodsdetail.length > 0) {
                    this.methodsdetail.map(item => {
                        this.modelData.map(newitem => {
                            if (newitem.id == item.id) {
                                //固定金额
                                if (item.type == 'formatAmount') {
                                    newitem.limit = 'format';
                                    newitem.formatAmount = item.amount_limit;
                                    newitem.quick_amount = item.quick_amount;
                                    newitem.handle_fee = item.handle_fee;
                                } else {
                                    //限额
                                    let newlimit = item.amount_limit.split('-');
                                    newitem.minAmount = Number(newlimit[0]);
                                    newitem.maxAmount = Number(newlimit[1]);
                                    newitem.quick_amount = item.quick_amount;
                                    newitem.handle_fee = item.handle_fee;
                                }
                            }
                        });
                    });
                }
            });
        },
        getdefaultChecked() {
            if (this.defaultChecked.length > 0) {
                this.checkedArray = [];
                this.defaultChecked.map(item => {
                    this.checkedArray.push(item);
                    // console.log(this.checkedArray)
                });
            }
        }
    },
    watch: {
        defaultChecked: function(val, oldval) {
            this.getdefaultChecked();
        },
        methodsdetail: function(val, oldval) {
            this.getpayselectlist();
        }
    }
};
</script>
<style lang="less" scoped >
.frPosition {
    position: relative;
    right: 0;
}
.limitMoney {
    margin-left: 56px;
    width: 150px;
    height: 36px;
    .ivu-input-number-input {
        vertical-align: text-bottom;
    }
}
.w280x {
    box-sizing: border-box;
    width: 278px !important;
}
/deep/.ivu-input {
    height: 30px;
}
.w110x {
    width: 110px;
}

.w245x {
    width: 245px;
}
.mlf70 {
    margin-left: -70px;
}

.h50 {
    height: 50px;
}
.w500 {
    width: 500px;
}
/deep/.ivu-tag-text {
    color: #444;
}
.className {
    width: 358px;
}
.ivu-input-number-input-wrap {
    box-sizing: border-box;
}
</style>


