<template>
        <div slot="content">
            <div class="v2-search bb">
                <ButtonGroup class="repay-button1" style="margin-bottom:0.5px">
                    <!-- <Button class="fontColor" :class="status ? 'active' : ''" @click="statusOn">电脑端</Button>
					<Button class="fontColor" :class="status ? '' : 'active'" @click="statusOff">H5</Button>-->
                    <!-- <Button class="fontColor" :class="status ? '' : 'active'" @click="statusIos">IOS</Button>
					<Button class="fontColor" :class="status ? '' : 'active'" @click="statusAndroid">Android</Button>-->
                    <Button v-for="(t, i) in btnList" :class="btnStatus == t.val ? 'active' : ''" :key="i" @click="statusType(t.val)">{{ t.name }}</Button>
                </ButtonGroup>
            </div>
            <div v-if="btnStatus == 'pc'">
                <div class="modal-overflow">
                    <ul class>
                        <template v-if="Array.isArray(pcList) && pcList.length > 0">
                            <li :class="[screen < 1600 ? 'pt10 pb5' : 'pt15 pb10']" v-for="(pc, i) in pcList" :key="pc.class_id">
                                <label style="width:145px;" class="txt-r ib mr30 ft14 fontColor">{{ pc.class_name }}</label>
                                <Select
                                    v-for="t in [0, 1, 2, 3, 4,5,6,7,8,9]"
                                    clearable
                                    filterable
                                    :key="t"
                                    v-model="pc.selected_id.split(',')[t]"
                                    class="mr10 fontColor"
                                    transfer
                                    :style="{ width: '130px', maxHeight: '150px' }"
                                    :placeholder="'通道' + (t === 0 ? '一' : t === 1 ? '二' : t === 2 ? '三' : t === 3 ? '四' : t === 4 ? '五': t === 5? '六' : t === 6? '七'  : t === 7? '八': t === 8? '九':'十') + ' 可查询'"
                                    @on-clear="resetSelected('pc', i, t)"
                                >
                                 <!-- :placeholder="'通道' + (t === 0 ? '一' : t === 1 ? '二' : t === 2 ? '三' : t === 3 ? '四' : '五') + ' 可查询'" -->
                                    <Option
                                        v-for="item in pc.payment_list"
                                        :value="item.id + ''"
                                        :key="item.id"
                                        :label="item.payName"
                                        :disabled="pc.selected_id.split(',').includes(item.id + '')"
                                        class="option-span fontColor"
                                        @click.native="!pc.selected_id.split(',').includes(item.id + '') && onPcChange(i, t, pc.class_id, item.id)"
                                        >{{ item.payName }}</Option
                                    >
                                </Select>
                            </li>
                            <Form style="text-align:center;">
                                <Button class="ivu-btn submit btw260 ft20 gd bg" @click="submit" type="primary">提交保存</Button>
                            </Form>
                        </template>
                        <li v-else class="txt-a">暂无支付方式</li>
                    </ul>
                </div>
            </div>
            <div v-if="btnStatus == 'h5'">
                <div class="modal-overflow">
                    <ul class>
                        <template v-if="Array.isArray(h5List) && h5List.length > 0">
                            <li :class="[screen < 1600 ? 'pt10 pb5' : 'pt15 pb10']" v-for="(h5, i) in h5List" :key="h5.class_id">
                                <label style="width:145px;" class="txt-r ib mr30 ft14 fontColor">{{ h5.class_name }}</label>
                                <Select
                                    v-for="t in [0, 1, 2, 3, 4,5,6,7,8,9]"
                                    clearable
                                    filterable
                                    transfer
                                    :key="t"
                                    v-model="h5.selected_id.split(',')[t]"
                                    class="mr10"
                                    :style="{ width: '130px' }"
                                    :placeholder="'通道' + (t === 0 ? '一' : t === 1 ? '二' : t === 2 ? '三' : t === 3 ? '四' : t === 4 ? '五': t === 5? '六' : t === 6? '七'  : t === 7? '八': t === 8? '九':'十') + ' 可查询'"
                                    @on-clear="resetSelected('h5', i, t)"
                                >
                                    <Option
                                        v-for="item in h5.payment_list"
                                        :value="item.id + ''"
                                        :key="item.id"
                                        :label="item.payName"
                                        :disabled="h5.selected_id.split(',').includes(item.id + '')"
                                        class="option-span"
                                        @click.native="!h5.selected_id.split(',').includes(item.id + '') && onH5Change(i, t, h5.class_id, item.id)"
                                        >{{ item.payName }}</Option
                                    >
                                </Select>
                            </li>
                            <Form style="text-align:center">
                                <Button class="ivu-btn submit btw260 ft20 gd bg" @click="submit" type="primary">提交保存</Button>
                            </Form>
                        </template>
                        <li v-else class="txt-a">暂无支付方式</li>
                    </ul>
                </div>
            </div>
            <!-- <div v-if="btnStatus=='android'">
				<div class="modal-overflow">
					<ul class>
						<template v-if="Array.isArray(androidList)&&androidList.length>0">
							<li
								:class="[screen<1600?'pt10 pb5':'pt15 pb10']"
								v-for="(android,i) in androidList"
								:key="android.class_id"
							>
								<label style="width:145px;" class="txt-r ib mr30 ft14 fontColor">{{android.class_name}}</label>
								<Select
									v-for="t in [0,1,2,3,4]"
									clearable
									filterable
									transfer
									:key="t"
									v-model="android.selected_id.split(',')[t]"
									class="mr32"
									:style="{width:'130px'}"
									:placeholder="'通道' + (t===0 ? '一' :t===1 ? '二' : t===2? '三' :t===3 ? '四' : '五')+' 可查询'"
									@on-clear="resetSelected('android',i,t)"
								>
									<Option
										v-for="item in android.payment_list"
										:value="item.id+''"
										:key="item.id"
										:label="item.payName"
										:disabled="android.selected_id.split(',').includes(item.id+'')"
										class="option-span"
										@click.native="!android.selected_id.split(',').includes(item.id+'')&&onAndroidChange(i,t,android.class_id,item.id)"
									>{{item.payName}}</Option>
								</Select>
							</li>
							<Form style="text-align:center">
								<Button class="ivu-btn submit btw260 ft20 gd bg" @click="submit" type="primary">提交保存</Button>
							</Form>
						</template>
						<li v-else class="txt-a">暂无支付方式</li>
					</ul>
				</div>
      </div> -->
      <!-- app -->
            <!-- <div v-if="btnStatus == 'app'">
                <div class="modal-overflow">
                    <ul class>
                        <template v-if="Array.isArray(iosList) && iosList.length > 0">
                            <li :class="[screen < 1600 ? 'pt10 pb5' : 'pt15 pb10']" v-for="(ios, i) in iosList" :key="ios.class_id">
                                <label style="width:145px;" class="txt-r ib mr30 ft14 fontColor">{{ ios.class_name }}</label>
                                <Select
                                    v-for="t in [0, 1, 2, 3, 4]"
                                    clearable
                                    filterable
                                    transfer
                                    :key="t"
                                    v-model="ios.selected_id.split(',')[t]"
                                    class="mr32"
                                    :style="{ width: '130px' }"
                                    :placeholder="'通道' + (t === 0 ? '一' : t === 1 ? '二' : t === 2 ? '三' : t === 3 ? '四' : '五') + ' 可查询'"
                                    @on-clear="resetSelected('ios', i, t)"
                                >
                                    <Option
                                        v-for="item in ios.payment_list"
                                        :value="item.id + ''"
                                        :key="item.id"
                                        :label="item.payName"
                                        :disabled="ios.selected_id.split(',').includes(item.id + '')"
                                        class="option-span"
                                        @click.native="!ios.selected_id.split(',').includes(item.id + '') && onIosChange(i, t, ios.class_id, item.id)"
                                        >{{ item.payName }}</Option
                                    >
                                </Select>
                            </li>
                            <Form style="text-align:center">
                                <Button class="ivu-btn submit btw260 ft20 gd bg" @click="submit" type="primary">提交保存</Button>
                            </Form>
                        </template>
                        <li v-else class="txt-a">暂无支付方式</li>
                    </ul>
                </div>
            </div> -->
        </div>
</template>
<script>
import Modals from '@/components/modals';
import { paymentsetting, payMentDetail } from '@/api/member';

export default {
    components: { Modals },
    name:"paymentSet",
    data() {
        return {
            btnStatus: 'pc',
            btnList: [
                { name: '电脑端', val: 'pc' },
                { name: 'H5端', val: 'h5' },
                // { name: 'App', val: 'app' }
                // { name: "Android", val: "android" }
            ],
            status: true,
            screen: screen.width,
            formKey: {
                levelLabel: '',
                data: {
                    pc: {},
                    h5: {},
                    // android: {},
                    ios: {}
                }
            },
            pcList: [], // pc总数居
            h5List: [],
            // androidList: [],
            iosList: [],
            pcBtnDisabled: true,
            // h5BtnDisabled: true,
            pcSelect: '',
            h5Select: ''
        };
    },
    mounted() {
       this.resetForm();
       this.formKey.levelLabel =this.$route.query.levelLable;
         const data = {
                siteId: this.$root.nowSite.id,
                levelLabel:this.$route.query.levelLable
            };
        payMentDetail(data).then(res => {
                const { pc, h5, ios } = res.data;
                this.pcList = pc;
                this.h5List = h5;
                this.iosList = ios;
                // this.androidList = android;
                this.delSelectedId(this.pcList);
                this.delSelectedId(this.h5List);
                this.delSelectedId(this.iosList);
                // this.delSelectedId(this.androidList);
                this.$refs.PaymentModifyModal.show();
            });
    },
    methods: {
        statusType(val) {
            this.btnStatus = val;
        },
        //  statusOn(){
        // this.status = true;
        // },
        // statusOff(){
        //   this.status=false;
        // },
        // statusIos(){},
        // statusAndroid(){},
        resetForm() {
            this.formKey.data.pc = {};
            this.formKey.data.h5 = {};
            // this.formKey.data.android = {};
            this.formKey.data.ios = {};
        },
        init(levelLabel) {
            this.resetForm();
            this.formKey.levelLabel = levelLabel;
            const data = {
                siteId: this.$root.nowSite.id,
                levelLabel: levelLabel
            };
            payMentDetail(data).then(res => {
                const { pc, h5, ios } = res.data;
                this.pcList = pc;
                this.h5List = h5;
                this.iosList = ios;
                // this.androidList = android;
                this.delSelectedId(this.pcList);
                this.delSelectedId(this.h5List);
                this.delSelectedId(this.iosList);
                // this.delSelectedId(this.androidList);
                this.$refs.PaymentModifyModal.show();
            });
        },
        onPcChange(p_i, t_i, c_id, id) {
            // this.pcBtnDisabled = false;
            this.createData('pc', p_i, t_i, c_id, id);
        },
        onH5Change(p_i, t_i, c_id, id) {
            // this.h5BtnDisabled = false;
            this.createData('h5', p_i, t_i, c_id, id);
        },
        // onAndroidChange(p_i, t_i, c_id, id) {
        //     // this.h5BtnDisabled = false;
        //     this.createData('android', p_i, t_i, c_id, id);
        // },
        onIosChange(p_i, t_i, c_id, id) {
            // this.h5BtnDisabled = false;
            this.createData('ios', p_i, t_i, c_id, id);
        },
        createData(key, p_i, t_i, c_id, id) {
            /**
             * key 判断平台的key,指向data的目标列表 pc | h5
             * p_i 最上层index
             * t_i 当前通道的index
             * c_id 父级id
             * id 当前选择项
             */
            // let targetList = key === "ios" ? "iosList" : ("h5"?"h5List":("ios"?"iosList":"iosList"));
            let targetList = key === 'h5' ? 'h5List' : key === 'pc' ? 'pcList' : key === 'ios' ? 'iosList' : 'androidList';

            if (this[targetList][p_i].selected_id.split(',').includes(id)) return false;
            let ids = this[targetList][p_i].selected_id.split(',');
            ids[t_i] = id;
            this[targetList][p_i].selected_id = ids.join(',');
            this.formKey.data[key][c_id] = ids.join(',');
        },
        submit() {
            let params = { ...this.formKey };
            params.siteId = this.$root.nowSite.id;
            params.data.pc = this.completeParams('pc');
            params.data.h5 = this.completeParams('h5');
            // params.data.android = this.completeParams('android');
            params.data.ios = this.completeParams('ios');
            params = Object.assign(params, this.formKey);
            const { pc, h5, ios } = params.data;
            // if (!Object.keys(pc).length || !Object.keys(h5).length) {
            //   this.$Tip.info({
            //     content: "PC或H5的支付通道必须至少选择一个"
            //   });
            //   this.dsbBtn();
            //   return false;
            // }
            params.data = JSON.stringify(params.data);
            this.$refs.PaymentModifyModal.spinShow();
            paymentsetting(params, true)
                .then(res => {
                    //更改弹窗模式
                    this.$refs.PaymentModifyModal.spinHide();
                    if (res.code && res.code === 200) {
                        this.$Message.success(`修改${res.data}`);
                    }
                    this.$refs.PaymentModifyModal.hide();
                    this.resetForm();
                })
                .catch(err => {
                    this.$refs.PaymentModifyModal.spinHide();
                });
        },
        // dsbBtn () {
        //   this.h5BtnDisabled = true;
        //   this.pcBtnDisabled = true;
        // },
        completeParams(key) {
            // 如果有默认的通道并且没有触发通道change事件，则需要补全之前默认的的通道信息提交后台
            // let targetList = key === "pc" ? "pcList" : "h5List";
            //let targetList = key === 'h5' ? 'h5List' : key === 'pc' ? 'pcList' : key === 'ios' ? 'iosList' : 'androidList';
            let targetList = key === 'h5' ? 'h5List' : key === 'pc' ? 'pcList' : 'iosList';
            let data = {};
            this[targetList].forEach(pay => {
                if (pay.selected_id) data[pay.class_id] = pay.selected_id;
            });
            return data;
        },
        resetStatus() {
            this.dsbBtn();
        },
        resetSelected(type, i, t) {
            if (type === 'pc') {
                let arr = this.pcList[i].selected_id.split(',');
                arr[t] = undefined;
                let selected_id = arr.join(',');
                this.pcList[i].selected_id = selected_id;
                // this.pcBtnDisabled = false
                return;
            } else if (type === 'h5') {
                let arr = this.h5List[i].selected_id.split(',');
                arr[t] = undefined;
                let selected_id = arr.join(',');
                this.h5List[i].selected_id = selected_id;
                // this.h5BtnDisabled = false
                return;
            } else if (type === 'ios') {
                let arr = this.iosList[i].selected_id.split(',');
                arr[t] = undefined;
                let selected_id = arr.join(',');
                this.iosList[i].selected_id = selected_id;
                return;
            }
        },
        // 删除在下拉框中没有的id
        delSelectedId(arg) {
            if (Array.isArray(arg) && arg.length > 0) {
                arg.forEach(el => {
                    let arr = [];
                    if (el.payment_list.length > 0) {
                        el.payment_list.forEach(el => {
                            arr.push(el.id + '');
                        });
                    } else {
                        el.selected_id = '';
                    }
                    if (el.selected_id) {
                        let id = el.selected_id.split(',');
                        if (id.length > 0) {
                            id.forEach((el, index, arr1) => {
                                if (!arr.includes(el)) {
                                    arr1[index] = undefined;
                                }
                            });
                        }
                        el.selected_id = id.toString();
                    }
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/tabs.less';
@import '../../styles/button.less';
.btw260 {
    margin: 20px auto 30px;
}
.option-span.ivu-select-item {
    height: 100%;
    padding: 7px 16px;
}
.ivu-select-item {
    padding: 0;
}
.modal-overflow {
    min-height: 100px;
}
/deep/.ivu-select-input {
    color: #444;
}
</style>


