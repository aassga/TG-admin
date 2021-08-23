<template>
    <div class="cardLeft">
        <Form ref="formKey" :model="formKey" :rules="rules" :label-width="125">
            <FormItem label="创建人">
                <Input v-model="username" class="w275x" disabled />
            </FormItem>
            <div :class="$route.params.page === 'edit'|| $route.params.page === 'transferEdit'?'rukuan':''">
                <FormItem label="入款类型">
                    <Select class="w275x" v-model="formKey.inCard" @on-change="changeBank" :disabled="$route.params.page === 'edit'|| $route.params.page === 'transferEdit'">
                        <Option value="card">网银转账</Option>
                        <Option value="code">扫码支付</Option>
                        <Option value="transfer_bank">转卡支付</Option>
                        <Option value="transfer_account">转账支付</Option>
                        <Option value="virtual">虚拟货币</Option>
                    </Select>
                </FormItem>
            </div>
            <div class="star" v-if="formKey.inCard == 'code'">
                <FormItem label="扫码类型"  prop="codeType">
                    <Select v-model="formKey.code.id" clacodeTypess="w275x" @on-change="typeChange1" :disabled="editDisabled">
                        <Option v-for="(item, i) in scanTypeList" :key="i" :value="item.id" @click.native="getCodeType(item.id, item.className)">{{ item.className }}</Option>
                    </Select>
                </FormItem>
            </div>

            <div class="star" v-if="formKey.inCard == 'transfer_bank'">
                <FormItem label="转卡类型"  prop="transferType">
                    <Select v-model="formKey.transfer.id" class="w275x" key="transfer_bank" @on-change="typeChange2" :disabled="editDisabled">
                        <Option v-for="(t, i) in scanTypeList" :key="i" :value="t.id" @click.native="getType(t.id, t.className)">{{ t.className }}</Option>
                    </Select>
                </FormItem>
            </div>
            <div class="star" :class="$route.params.page === 'edit'?'rukuan':''" v-if="formKey.inCard == 'transfer_account'">
                <FormItem label="转账类型"  prop="codeType">
                    <Select v-model="formKey.code.id" class="w275x" :disabled="transDisabled" @on-change="accountChange" >
                        <Option v-for="(item, i) in scanTypeList" :key="i" :value="item.id" @click.native="getCodeType(item.id, item.className)">{{ item.className }}</Option>
                    </Select>
                </FormItem>
            </div>


            <div class="star" v-if="formKey.inCard != 'code'&&formKey.inCard != 'transfer_account'&&formKey.inCard != 'virtual'">
                <FormItem label="银行名称" prop="bankName">
                    <AutoComplete
                        ref="bank"
                      
                        placeholder="请输入转入银行名称"
                        v-model="formKey.bankName"
                        :data="bankList"
                        class="w275x"
                        :disabled="editDisabled"
                        element-id="autoSearch"
                        :filter-method="filterMethod"
                        @on-select="onSelect"
                    ></AutoComplete>
                </FormItem>
            </div>
            <div class="star" v-if="formKey.inCard != 'code'&&formKey.inCard != 'transfer_account'&&formKey.inCard != 'virtual'">
                <FormItem label="银行卡号" prop="cardNum">
                    <Input class="w275x"
                    type="text"
                    @on-keyup="formKey.cardNum=formKey.cardNum.replace(/[^\d]/g,'')"
                     placeholder="请输入银行卡号"  v-model="formKey.cardNum" :disabled="editDisabled" key="card" />
                </FormItem>
            </div>
            <div class="star" v-if="formKey.inCard != 'code'&&formKey.inCard != 'transfer_account'&&formKey.inCard != 'virtual'">
                 <FormItem label="持卡姓名" prop="cardName">
                    <Input placeholder="请输入持卡姓名" v-model="formKey.cardName" class="w275x" :disabled="editDisabled" />
                </FormItem>
            </div>
            <div  v-if="formKey.inCard == 'code'">
                <FormItem label="收款姓名" prop="payName">
                     <Input v-model="formKey.payName" placeholder="请输入收款姓名" class="w275x" :disabled="editDisabled" />
                </FormItem>
            </div>
            <div class="star" v-if="formKey.inCard == 'transfer_account'&&formKey.code.className == '微信转账'">
                 <FormItem label="微信昵称" prop="cardName">
                    <Input v-model="formKey.cardName" :disabled="editDisabled"  placeholder="请输入微信昵称" class="w275x" />
                </FormItem>
            </div>
            <div class="star" v-if="formKey.inCard == 'transfer_account'&&formKey.code.className == '微信转账'">
                 <FormItem label="微信账号" prop="cardNum">
                    <Input v-model="formKey.cardNum" :disabled="editDisabled" placeholder="请输入微信账号" class="w275x" />
                </FormItem>
            </div>
            <div class="star" v-if="formKey.inCard == 'transfer_account'&&formKey.code.className == '支付宝转账'">
                <FormItem label="收款姓名" prop="cardName">
                    <Input v-model="formKey.cardName" placeholder="请输入收款姓名" :disabled="editDisabled" class="w275x" />
                 </FormItem>
            </div>
            <div class="star" v-if="formKey.inCard == 'transfer_account'&&formKey.code.className == '支付宝转账'">
                 <FormItem label="支付宝账号" prop="cardNum">
                    <Input v-model="formKey.cardNum" placeholder="请输入支付宝账号" :disabled="editDisabled" class="w275x" />
                </FormItem>
            </div>
            <!-- 虚拟货币 -->
            <div v-if="formKey.inCard == 'virtual'">
                <div :class="$route.params.page === 'edit'?'':'star'">
                    <FormItem label="转账类型">
                    <Input v-model="formKey.virtual.className" class="w275x"  placeholder="USTD转账" disabled/>
                    </FormItem>
                 </div>
                 <div class="star">
                    <FormItem label="备注名称" prop="pay_name" >
                    <Input v-model="formKey.pay_name" class="w275x" :disabled="editDisabled" placeholder="用于区分后台汇款信息"  />
                    </FormItem>
                 </div>
                 <div class="star">
                    <FormItem label="收款地址" prop="address">
                    <Input v-model="formKey.address" class="w275x" placeholder="请输入USDT-ERC20收款地址"  :disabled="editDisabled"/>
                    </FormItem>
                 </div>
            </div>

            <!-- 632棋牌 id 63   k78棋牌 id 41   k78棋牌-B站 id  70   839棋牌 id 42  935棋牌  id 43        A-开元棋牌  id  25 -->
            <!-- <span v-if="this.$root.nowSite.id==63||this.$root.nowSite.id==41||this.$root.nowSite.id==70||this.$root.nowSite.id==42||this.$root.nowSite.id==43
            ||this.$root.nowSite.id==25||this.$root.nowSite.id==22"> -->
            <span v-if="String(chessList)&&String(chessList).includes($root.nowSite.id)">
            <div class="star">
                <FormItem label="支付限额" class="money bottom30" v-if="formKey.inCard != 'card'&&formKey.inCard != 'transfer_account' && formKey.inCard != 'virtual'
                ">
                    <FormItem class="ib fl" prop="min_amount" >
                        <InputNumber
                            type="text"
                            
                            :min="1"
                            :max="999999999"
                            :value="Number(formKey.min_amount) || null"
                            :formatter="value => (formKey.min_amount = value = /\d+(\.\d{1,2})?/g.exec(`${value}`)[0])"
                            style="width:125px"
                            :disabled="editDisabled"
                            placeholder="单笔下限"
                        />
                    </FormItem>
                    <FormItem class="ib fl">
                        <span class="pl10 pr10">-</span>
                    </FormItem>
                    <FormItem class="ib fl" prop="max_amount">
                        <InputNumber
                            :value="Number(formKey.max_amount) || null"
                            style="width:125px"
                            :max="999999999"
                            :min="1"
                           :disabled="editDisabled"
                            :formatter="value => (formKey.max_amount = value = /\d+(\.\d{1,2})?/g.exec(`${value}`)[0])"
                            placeholder="单笔上限"
                        />
                    </FormItem>
                </FormItem>
            </div>
        </span>

            <span v-if="String(chessList)&&String(chessList).includes($root.nowSite.id)">
            <FormItem label="常用金额" prop="quick_amount" v-if="formKey.inCard != 'card'&&formKey.inCard != 'transfer_account' && formKey.inCard != 'virtual'">
                <Input class="w275x" :disabled="editDisabled" type="text" v-model="formKey.quick_amount" placeholder="客户端快捷按钮,多个以英文逗号隔开" />
            </FormItem>
           </span>
            <FormItem label="开户类型" prop="cardAddressIsDiv" v-if="String(chessList).includes($root.nowSite.id)&&(formKey.inCard == 'card')" >
                <Select class="w275x" v-model='formKey.cardAddressIsDiv'  @on-change="changeAccount" :disabled="editDisabled"  >
                    <Option value="cardAddress">开户网点</Option>
                    <Option value="customize">自定义</Option>
                </Select>
            </FormItem>
            <!-- <FormItem label="开放分组" Key="group_id"  v-show="selectList.length>1"  prop="group_id">
                 	<Select v-model="formKey.group_id">
						<Option v-for="(t,i) in selectList" :value="t.group_id" :key="i+1">{{t.group_name}}</Option>
					</Select>
            </FormItem> -->
  
            <div class="star" v-if="(formKey.cardAddressIsDiv=='cardAddress'||formKey.cardAddressIsDiv=='customize'||(!String(chessList).includes($root.nowSite.id)))&&(formKey.inCard == 'card')">
                <FormItem
                class="bank"
                :label="String(chessList).includes($root.nowSite.id)?(formKey.cardAddressIsDiv=='cardAddress'?'开户网点':'自定义'):'开户网点'"
                :prop="String(chessList).includes($root.nowSite.id)?(formKey.cardAddressIsDiv=='cardAddress'?'cardAddress':'cardAddress'):'cardAddress'"
                >
                    <Input  v-model="formKey.cardAddress"  class="w275x"  :placeholder="String(chessList).includes($root.nowSite.id)?(formKey.cardAddressIsDiv=='cardAddress'?'请输入开户网点(竖版app.h5/pc)':'请输入自定义说明文字(横板app)'):'例:四川省成都市'" :disabled="editDisabled"/>
                </FormItem>
            </div>
                       <FormItem label="开放分组" key="group_id"  prop="group_id" v-if="this.$root.groupLenth()>1" >
						<GroupSelect
						class="aaa"
						placeholder="请选择"
						ref="GroupSelect"
						clearable
						width="86"
						:levelType="'group'"
                        :disabled="levelDisabled"
						@on-level-change="groupChange"
					/>
               </FormItem> 

            <FormItem label="开放等级" key="level-select" prop="levelLabel">
                <LevelSelect ref="LevelSelect" mode="多选" levelType="member" @on-level-change="levelChange" all-modal :disabled="levelDisabled" />
            </FormItem>
            <FormItem label="开放终端" class="clearfix">
                <span class="fl xColor" style="margin-left:-80px;padding-top:2px">*</span>
                <div class="fl">
                    <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll" :disabled="levelDisabled">全选</Checkbox>
                </div>
                <CheckboxGroup v-model="formKey.terminal" prop="terminal" @on-change="checkAllGroupChange" class="fl" >
                    <Checkbox label="pc" :disabled="levelDisabled">PC</Checkbox>
                    <Checkbox label="h5" :disabled="levelDisabled">H5</Checkbox>
                    <Checkbox label="android" :disabled="levelDisabled">Android</Checkbox>
                    <Checkbox label="ios" :disabled="levelDisabled">IOS</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="二维码" v-if="formKey.inCard == 'code'" prop="src">
                <uploadImg @path="getImgPath" @getSrc="getSrc" :src="src" :transDisabled="transDisabled"> </uploadImg>
            </FormItem>
            <FormItem label="二维码" v-if="formKey.inCard == 'virtual'&& isEdit">
                <img :src="usdt_src" class="codeImg" />
            </FormItem>
            <FormItem label="备注信息" prop="remarks" key="remarks" v-if="formKey.inCard == 'transfer_account'" >
                <Input placeholder="请输入备注信息" :disabled="editDisabled" v-model="formKey.remarks"   class="w275x"/>
            </FormItem>
            <FormItem label="当前状态" :prop="$route.params.page === 'edit'|| $route.params.page === 'transferEdit'?'':'status'">
                <Select class="w275x" v-model="formKey.status" :disabled="upDisabled">
                    <Option value="yes">正常</Option>
                    <Option value="no">停用</Option>
                </Select>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="$root.editBtnLoading" class="export ft20" @click.prevent="submit">确认保存</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import { companyBankCardCreate, companyBankCardUpdate, QRCodeList, paymentClassName, QRCodeCreate, QRCodeUpdate,virtualCreate,virtualUpdate} from '@/api/finance';
// import { getMemberGroupList} from '@/api/member';
import { mapState } from 'vuex';
import { getUserName, getAccessFromLocal, getToken, getUserType } from '@/libs/util';
import LevelSelect from '@/components/level-select';
import uploadImg from '@/components/upload-img';
import { AutoComplete } from 'view-design';
import GroupSelect from "@/components/group-select";
export default {
    name: 'bankCardEdit',
    components: {
        LevelSelect,
        AutoComplete,
        uploadImg,
        GroupSelect
    },
    computed: {
        username() {return getUserName();}, // 默认创建人
        accessSite() { return getAccessFromLocal();},
        ...mapState({
            token: state => state.user.token,
            bankList: state => state.info.bankList,
            chessList:state=>state.info.chessList,
        })
    },
    data() {
        const validateCardNum = (rule,val,cb) => {
            if(this.formKey.code!=undefined){
                let className = this.formKey.code.className;
                if(this.formKey.cardNum == ''||this.formKey.cardNum==undefined){
                    if(className == '微信转账'){
                        cb(new Error('请输入微信账号'));
                        return;
                    }else if(className == '支付宝转账'){
                        cb(new Error('请输入支付宝账号'));
                        return;
                    }else{
                        cb(new Error('请输入银行卡卡号'));
                        return;
                    }

                }else{
                    if(className == '微信转账'){
                        let reg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/;
                        if(!reg.test(val)) {
                            cb(new Error('6-20个字母、数字、下划线或减号,必须以字母开头'));
                            return;
                        }
                    }

                    if(this.formKey.inCard == 'card'||this.formKey.inCard == 'transfer_bank'){
                        let reg = /^[0-9-+\/\s]{9,25}$/;

                        if(!reg.test(val)) {
                            cb(new Error('请输入9-25位以内的银行卡号'));
                            return;
                        }
                    }
                    cb();
                }
            }else{
                if(val == ''){
                   cb(new Error('请输入银行卡卡号'));
                    return;
                }else{
                   let reg = /^(([0-9]\d*))$/;
                    if(!reg.test(val)) {
                        cb(new Error('请输入正确银行卡卡号'));
                        return;
                    }
                }
                cb();
            }

        };
        const validateCardName = (rule,val,cb) => {
            if(this.formKey.code!=undefined){
                let className = this.formKey.code.className;
                if(this.formKey.cardName == ''|| this.formKey.cardName==undefined){
                    if(className == '微信转账'){
                        cb(new Error('请输入微信昵称'));
                        return;
                    }else if(className == '支付宝转账'){
                        cb(new Error('请输入收款姓名'));
                        return;
                    }else{
                       cb(new Error('请输入持卡姓名'));
                         return;
                    }
                }else{
                    if(this.formKey.inCard == 'card'||this.formKey.inCard == 'transfer_bank'){
                       let reg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
                        if(!reg.test(val)) {
                            cb(new Error('请输入中文姓名'));
                            return;
                        }
                    }
                }
                 cb();
            }else{
                if(val == ''){
                    cb(new Error('请输入持卡姓名'));
                    return;
                }else{
                    let reg = /^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/;
                    if(!reg.test(val)) {
                        cb(new Error('请输入中文姓名'));
                        return;
                    }
                }
                cb();
            }

        };
        const validateCodeType = (rule,val,cb) => {//扫码类型 //转账类型的校验
            if(this.formKey.code!=undefined){
                let className = this.formKey.code.className;
                if(this.formKey.inCard == 'transfer_account'){
                    if(this.formKey.code.id == undefined){
                       cb(new Error('请选择转账类型'));
                        return;
                    }
                }else{
                  if(this.formKey.code.id == undefined){
                       cb(new Error('请选择扫码类型'));
                        return;
                    }
                }
                cb();
            }else{
                cb();
            }


        }
        const validateBankName = (rule,val,cb) => {
             if(val == ''||val==undefined){
                if(this.formKey.inCard == 'transfer_bank' || this.formKey.inCard == 'card'){
                    cb(new Error('请选择或输入银行名称'));
                    return;
                }
              }else{
                cb();
              }
        }
        const validateTransferType = (rule,val,cb) => {
                if(this.formKey.transfer.id == ''){
                    cb(new Error('请选择转卡类型'));
                    return;
                }
                cb();
        }
        const validateCardAddressDiv = (rule,val,cb) => {
            if(this.formKey.cardAddressIsDiv==undefined){
                 cb(new Error('请选择开户类型'));
                return;
            }
            cb();
        }
        const validateLevelLabel = (rule,val,cb) =>{
            this.$nextTick(()=>{
                if(this.formKey.levelLabel==undefined || this.formKey.levelLabel.length==0){
                    cb(new Error('请选择开放等级'));
                    return;
                }
                cb();
            })

        }
        const validateCardAddress = (rule,val,cb) => {
            if(this.formKey.cardAddress==''||this.formKey.cardAddress==undefined){
                    cb(new Error('请输入内容'));
                    return;
                }
                cb();
        }
        const validateRemarks = (rule,val,cb) => {
            if(this.formKey.remarks == ''||this.formKey.remarks == undefined){
                cb(new Error('请输入备注信息'));
                    return;
            }
            cb();
        }
        return {
            	selectList:[],
            levelDisabled:false,
            upDisabled:false,
            usdt_src:'',
            isEdit:false,
            accountType:'',
            src: '',
            editDisabled: false,
            transDisabled: false,
            adminType: getUserType(),
            authInPage: JSON.parse(localStorage.authInPage),
            imgPath: '',
            indeterminate: true,
            checkAll: false,
            scanTypeList: {},
            formKey: {
                 group_id:'',
                remarks:'',
                cardAddressIsDiv:'',
                cardAddressAccount:'',
                username: this.username,
                siteName: this.$root.nowSite.siteName,
                siteId: this.$root.nowSite.id,
                transfer: { id: '', className: '' },
                code: { id: '', className: '' },
                classId: '',
                inCard: 'card',
                qr_code: '',
                status: 'yes',
                levelLabel: '',
                cardNum: '',
                bankName: '',
                cardName: '',
                min_amount: '',
                max_amount: '',
                quick_amount: '',
                cardAddress: '',
                id: '',
                src: '',
                imgUrl: '',
                codeType: '',
                transferType: '',
                payName:'',
                virtual:{id: '', className: '',classType:''},
                pay_name:'',
                address:''
            },
            rules: {
                transferType: [
                     {validator:validateTransferType,trigger: 'change',required: true,}
                ],
                group_id:[{required: true,message: '请选择开放分组',trigger: 'change',pattern: /.+/}],
                levelLabel: [{validator:validateLevelLabel,trigger: 'change',required: true,}],
                bankName: [{validator:validateBankName,trigger: 'change',required: true,}],
                cardNum: [{validator:validateCardNum,trigger: 'blur',required: true,}],
                id: [{required: true,message: '请选择转账类型',trigger: 'change',pattern: /.+/}],
                remarks:[
                 {validator:validateRemarks,trigger: 'blur',required: true,}
                ],
                cardName: [
                    {validator:validateCardName,trigger: 'blur'}
                ],
                customize:[
                {
                        required: true,
                        message: '请输入自定义文字',
                        trigger: 'blur',
                        pattern: /.+/
                },
                ],
                cardAddress:[
                     {validator:validateCardAddress,trigger: 'blur'}
                // {
                //         required: true,
                //         message: '请输入内容',
                //         trigger: 'blur',
                //         pattern: /.+/
                // },
                ],
                cardAddress1: [
                    {
                        required: true,
                        message: '请输入银行归属地',
                        trigger: 'blur'
                    },
                    {
                        pattern: /[\u4E00-\u9FA5\\s]+/,
                        message: '请输入正确的归属地',
                        trigger: 'blur'
                    }
                ],
                payName: [
                    {
                        required: true,
                        message: '请输入收款姓名',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/,
                        message: '请输入中文姓名',
                        trigger: 'blur'
                    }
                ],
                min_amount: [
                    {
                        required: true,
                        message: '请输入支付下限',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        message: '请输入正确的金额',
                        pattern: /^(([1-9]\d*))(\.\d{1,2})?$/,
                        trigger: 'blur'
                    }
                ],
                max_amount: [
                    {
                        required: true,
                        message: '请输入支付上限',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        message: '请输入正确的金额',
                        pattern: /^(([1-9]\d*))(\.\d{1,2})?$/,
                        trigger: 'blur'
                    },
                    // 校验支付上下限制
                    {
                        required: true,
                        validator: (rule, val, cb) => {
                            this.$refs.formKey.validateField('min_amount');
                            if (+this.formKey.min_amount < +val) {
                                cb();
                            } else {
                                cb(new RangeError('支付上限须大于支付下限'));
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                min_amount:[
                    {
                        required: true,
                        message: '请输入下限金额',
                        trigger: 'blur',
                        pattern: /.+/
                    },
                ],
                max_amount:[
                    {
                        required: true,
                        message: '请输入上限金额',
                        trigger: 'blur',
                        pattern: /.+/
                    },
                ],
                quick_amount: [
                    {
                        required: true,
                        message: '请输入常用金额',
                        trigger: 'blur',
                        pattern: /.+/
                    },
                    {
                        pattern: /^[0-9,.]+$/,
                        message: '只支持数字，小数,和英文逗号',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        validator: (rule, val, cb) => {
                            this.$refs.formKey.validateField('min_amount');
                            this.$refs.formKey.validateField('max_amount');
                            val.split(',').map((item, index) => {
                                if (+this.formKey.min_amount <= +item && item <= +this.formKey.max_amount) {
                                    if (val.split(',').length == index + 1) {
                                        cb();
                                    }
                                } else {
                                    cb(new RangeError('常用金额必须大于支付下限小于支付上限'));
                                    return;
                                }
                            });
                        },
                        trigger: 'blur'
                    }
                ],
                src: [
                    {
                        required: true,
                        message: '请上传二维码图片',
                        trigger: 'change',
                        pattern: /.+/
                    }
                ],
                codeType: [
                    {validator:validateCodeType,trigger: 'change',pattern: /.+/, required: true,}
                ],
                status: [
                    {
                        required: true,
                        message: '请选择状态',
                        trigger: 'change'
                    }
                ],
                terminal: [
                    {
                        required: true,
                        message: '请选择开放终端',
                        trigger: 'change',
                        pattern: /.+/
                    }
                ],
                cardAddressIsDiv:[{validator:validateCardAddressDiv,trigger: 'change',pattern: /.+/, required: true,}],
                pay_name: [
                    {
                        required: true,
                        message: '请输入备注名称',
                        trigger: 'blur'
                    },
                    {
                        pattern:/^[\w\W]{1,20}$/,
                        message:'请输入1~20位备注名称',
                        trigger:'blur'
                    }
                ],
                address: [
                    {
                        required: true,
                        message: '请输入收款地址',
                        trigger: 'blur'
                    },
                    {
                        pattern: /^[0-9A-Za-z]{20,50}$/,
                        message: '请输入20~50位数字或字母',
                        trigger: 'blur'
                    }
                ],
            }
        };
    },
    watch: {
        '$root.nowSite': {
            handler(val, oldVal) {
                this.$nextTick(() => {
                    const { name } = this.$route;
                    name === 'bankCardEdit' && this.$refs.LevelSelect.init(val.id)
                    if(this.$root.groupLenth()>1){
                       this.$refs.GroupSelect.init(val.id);
                    }
                  
                });
            },
            deep: true,
            immediate: true
        }
    },

    created() {
       
        this.$nextTick(() => {
            let type = this.$route.query.inCard == 'code'?'qr_code'
            :this.$route.query.inCard == 'transfer_bank'?'transfer_bank'
            :this.$route.query.inCard == 'transfer_account'?'transfer_account'
            :this.$route.query.inCard == 'virtual'?'virtual'
            :'';
            if(type != '') this.scanType(type);
            if (Object.keys(this.$route.query).length) {
                this.formKey = this.$route.query;

                if (this.$route.query.inCard == 'transfer_bank') {
                    this.formKey.transfer = {
                        id: this.$route.query.classId,
                        className: this.$route.query.className
                    };
                }
                if (this.$route.query.inCard == 'transfer_account') {
                    this.formKey.code = {
                        id: this.$route.query.classId,
                        className: this.$route.query.className
                    };
                    this.formKey.remarks = this.$route.query.remarks;
                }

                if (this.$route.query.inCard == 'code') {
                    const { src } = this.$route.query;
                    this.src = src;
                    this.formKey.code = {
                        id: this.$route.query.classId,
                        className: this.$route.query.className
                    };
                }
                if(this.$route.query.inCard == 'virtual'){
                    const { src } = this.$route.query;
                    this.src = src;
                    this.usdt_src = src;
                    this.formKey.virtual = {
                        id: this.$route.query.classId,
                        className: this.$route.query.className,
                        classType:this.$route.query.classType
                    };
                    this.formKey.terminal = this.$route.query.device.split(',');
                    if(this.$route.params.page == 'edit') this.isEdit = true;
                }
                //接受点击编辑银行卡的值
                let { levelLabel, levelAlias, terminal, devices,device,group_id,group_name} = this.formKey;
                // console.log(group_id,group_name,'我是编辑的值')
                this.$refs.LevelSelect.init(this.$root.nowSite.id, { levelLabel, levelAlias });
                  if(this.$root.groupLenth()>1){
                       this.$refs.GroupSelect.init(this.$root.nowSite.id, { group_id,group_name });
                    }
                if(typeof terminal=="string"){
                  this.formKey.terminal = (terminal&&terminal.split(',')) || (devices && devices.split(','));
                }else if(typeof terminal=="object"){
                  this.formKey.terminal=terminal;
                }

            }
       
            if (this.$route.params.page == 'edit'||this.$route.params.page == 'transferEdit') {
           console.log(this.authInPage)
                 if (this.adminType == 'super' ) { // 超管
                    this.editDisabled = false;
                    this.levelDisabled = false;
                     this.transDisabled = false;
                    }
                if(this.authInPage.indexOf('companyBankCardUpdate') != -1&& this.authInPage.indexOf('incomeCardManageOpenLevel') == -1){//有编辑权限，等级和分组不可编辑
                     this.levelDisabled = true;
                      this.editDisabled = false;

                }
                if(this.authInPage.indexOf('QRCodeUpdate') != -1&& this.authInPage.indexOf('incomeCardManageOpenLevel') == -1){
                     this.transDisabled = true;
                     this.editDisabled = false;
                }


                if (this.authInPage.indexOf('companyBankCardUpdate') != -1 && this.authInPage.indexOf('incomeCardManageOpenLevel') != -1) { 
                    //有编辑权限，并且有编辑等级权限
                    this.editDisabled = false;
                     this.levelDisabled =false;
                }

                if (this.authInPage.indexOf('QRCodeUpdate') == -1 && this.authInPage.indexOf('incomeCardManageOpenLevel') != -1) {
                    this.transDisabled = true; 
                    }
            if(this.authInPage.indexOf('incomeCardManageOpenLevel') != -1){//只有等级和开放终端的权限
                   this.editDisabled = true;
                this.levelDisabled =false;
                this.upDisabled=true;

            }
            if(this.authInPage.indexOf("companyBankCardUpdate")!=-1&&this.authInPage.indexOf("QRCodeUpdate")!=-1&&this.authInPage.indexOf("incomeCardManageOpenLevel")!=-1){
                //有开放等级和编辑权限
                this.editDisabled = false;
                   this.levelDisabled =false;
                    this.upDisabled=false;

            }
            }
        });
    },

    methods: {
           groupChange(res){
                this.formKey.group_id = res.group_id;
           
		},
       
        //扫码类型
        typeChange1(val){
            this.formKey.code.id = val;
        },
        //转卡类型
        typeChange2(val){
            this.formKey.transfer.id = val;
        },
        //转账类型
        accountChange(val){
            this.formKey.code.id = val;
            this.$refs.formKey.fields.forEach(function(e){
                if(e.prop) e.resetField();
            })
        },
        onSelect(val){
            this.$refs.bank._watcher.vm.$refs.input.focus();
        },
        changeAccount(t){
            this.accountType==t;
            this.formKey.cardAddress='';
            this.formKey.cardAddressIsDiv = t;

        },
        getSrc(val) {
            this.formKey.src = val;
        },
        changeBank(val) {
            this.formKey.code = {};
            this.formKey.bankName = '';
            this.$refs.formKey.fields.forEach(function(e){
                if(e.prop) e.resetField();
            });
            let type = this.formKey.inCard == 'code'?'qr_code'
            :this.formKey.inCard == 'transfer_bank'?'transfer_bank'
            :this.formKey.inCard == 'transfer_account'?'transfer_account'
            :this.formKey.inCard == 'virtual'?'virtual'
            :'';
            if(type!='') this.scanType(type);
        },
        getImgPath(path) {
            this.imgPath = path;
        },
        getCodeType(id, className) {
            this.$nextTick(function() {
                this.formKey.codeType = id;
                this.formKey.code = { id, className };
            });
        },
        getType(id, className) {
            this.formKey.transferType = id;
            this.formKey.transfer = { id, className };
        },
        filterMethod(value, option) {
            // 搜索补全项
            return option.indexOf(value) != -1;
        },
        scanType(val) {
            //扫码的类型
            const data = { classType: val, siteId: this.$root.nowSite.id };
            paymentClassName(data).then(res => {
                if(val == 'virtual'){
                    if(res.data.length){
                        this.formKey.virtual.className = res.data[0].className;
                        this.formKey.virtual.id = res.data[0].id;
                        this.formKey.virtual.classType = res.data[0].classType;
                    }
                }else{
                    this.scanTypeList = res.data;
                }
            });
        },
        levelChange(res) {
          this.formKey.levelLabel = res.levelLabel;
        },
        groupChange(res){
            this.formKey.group_id=res.group_id;
        },
        handleCheckAll() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                this.formKey.terminal = ['pc', 'h5', 'android', 'ios'];
            } else {
                this.formKey.terminal = [];
            }
        },
        checkAllGroupChange(data) {
            if (data.length === 4) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        goCardList(data) {
            //添加之后对应的跳转
            console.log(data)
            const { inCard, classId, className,group_id,status} = data;
            if (data.inCard == 'transfer_bank' || data.inCard == 'code' || data.inCard == 'transfer_account'||data.inCard == 'virtual' ) {
                this.$router.push({ name: 'systemInPaymentCard', params: { inCard, classId, className ,group_id,status} });
            } else if (data.inCard == 'card') {
                this.$router.push({ name: 'systemInPaymentCard', params: { inCard: data.inCard, className: '银行卡管理',group_id,status } });
            }
        },
        submit() {
            // 提交
            this.$root.startEditLoading();
            if (this.formKey.terminal && this.formKey.terminal.length > 0) {
            } else {
                this.$Message.error('请选择开放终端');
                this.$root.endEditLoading();
                return;
            }

           for (let  key in this.formKey){
               if(!this.formKey[key]) delete this.formKey[key]
           }

            this.$refs.formKey.validate(valid => {
                if (valid) {

                    if (this.$route.params.page == 'create') {
                        //添加
                        let params = {
                            ...this.formKey,
                            levelLabel: String(this.formKey.levelLabel),
                            terminal: String(this.formKey.terminal)
                        };
                        params.group_id=this.formKey.group_id;
                        params.status=this.formKey.status;
                        if (params.inCard == 'card') {
                            if(this.formKey.bankName==''){
                                this.$Message.error('请选择银行名称');
                                this.$root.endEditLoading();
                                return;
                            }

                            for (let key in params) {
                                if (!params[key]) delete params[key];
                                if (key == 'code' || key == 'transfer'||key == 'virtual') {
                                    delete params[key];
                                }
                            }
                            companyBankCardCreate(params, true).then(res => {
                                if (res != undefined && res.code == 200) {
                                    const {inCard,group_id,status}=params;
                                    this.$root.endEditLoading();
                                    this.$Message.success({ content: '添加入款卡成功' });
                                    this.goCardList({
                                        inCard: params.inCard,
                                        group_id,
                                        status
                                         
                                    });
                                }

                            });
                        }
                        // 扫码支付
                        if (params.inCard === 'code') {
                           if(this.formKey.src == undefined){
                               this.$Message.error('请上传二维码图片');
                                this.$root.endEditLoading();
                                return;
                           }
                            params.className = this.formKey.code.className;
                            params.classId = this.formKey.code.id;
                            params.devices = String(this.formKey.terminal);
                            params.qr_code = this.imgPath;
                              params.group_id=this.formKey.group_id;
                              params.status=this.formKey.status;
                            for (let key in params) {
                                if (!params[key]) delete params[key];
                                if (key == 'code' || key == 'transfer'||key=='virtual') {
                                    delete params[key];
                                }
                            }
                            QRCodeCreate(params, true).then(res => {
                                let { className, classId,group_id, status} = params;
                                if (res != undefined && res.code == 200) {
                                    this.$root.endEditLoading();
                                    this.goCardList({
                                        inCard: params.inCard,
                                        classId: classId,
                                        className: className,
                                        group_id,
                                        status
                                    });
                                    this.$Message.success({ content: '添加二维码成功' });
                                }
                            });
                        }
                        //转卡支付
                        if (params.inCard == 'transfer_bank') {
                            params.className = this.formKey.transfer.className;
                            params.classId = this.formKey.transfer.id;
                            params.cardAddress='我是默认的';
                             params.group_id=this.formKey.group_id;
                              params.status=this.formKey.status;
                            for (let key in params) {
                                if (!params[key]) delete params[key];
                                if (key == 'code' || key == 'transfer'||key=='virtual') {
                                    delete params[key];
                                }
                            }
                            companyBankCardCreate(params, true).then(res => {
                                const { className, classId, inCard ,group_id,status} = params;
                                if (res != undefined && res.code == 200) {
                                    this.$root.endEditLoading();
                                    this.goCardList({
                                        inCard: inCard,
                                        classId: classId,
                                        className: className,
                                          group_id,
                                            status
                                    });
                                    this.$Message.success({ content: '添加转账银行卡成功' });
                                }
                            });
                        }
                        if(params.inCard == 'transfer_account'){
                            //转账支付
                            params.className = this.formKey.code.className;
                                params.classId = this.formKey.code.id;
                                params.cardAddress = this.formKey.code.className == '微信转账'?'微信':'支付宝';
                                params.bankName = this.formKey.code.className;
                                  params.group_id=this.formKey.group_id;
                              params.status=this.formKey.status;
                                for (let key in params) {
                                    if (!params[key]) delete params[key];
                                    if (key == 'code' || key == 'transfer'||key=='virtual') {
                                        delete params[key];
                                    }
                                }
                                companyBankCardCreate(params, true).then(res => {
                                    const { className, classId, inCard,group_id,status } = params;
                                    if (res != undefined && res.code == 200) {
                                        this.$root.endEditLoading();
                                        this.goCardList({
                                            inCard: inCard,
                                            classId: classId,
                                            className: className,
                                            group_id,
                                            status
                                        });

                                        this.$Message.success({ content: '添加'+this.formKey.code.className+'成功' });
                                    }
                                });
                        }
                        //虚拟货币
                        if(params.inCard == 'virtual'){
                            params.classType = this.formKey.virtual.classType;
                            params.classId = this.formKey.virtual.id;
                            params.device  = String(this.formKey.terminal);
                            params.className = this.formKey.virtual.className;
                              params.group_id=this.formKey.group_id;
                              params.status=this.formKey.status;

                            for (let key in params) {
                                if (!params[key]) delete params[key];
                                if (key == 'code' || key == 'transfer'||key=='virtual'||key=='inCard'||key=='terminal'||key=='src') {
                                    delete params[key];
                                }
                            }

                            virtualCreate(params,true).then(res=>{
                                const { className, classId,group_id,status} = params;

                                const inCard = this.formKey.inCard;
                                if (res != undefined && res.code == 200) {
                                        this.$root.endEditLoading();
                                        this.goCardList({
                                            inCard: inCard,
                                            classId: classId,
                                            className: className,
                                            group_id,
                                            status
                                        });
                                        this.$Message.success({ content: '添加'+this.formKey.virtual.   className+'成功' });
                                    }
                            })
                        }
                    }

                if (this.$route.params.page == 'edit' || this.$route.params.page == 'transferEdit' ) {
                            // 编辑
                            let params = {
                                ...this.formKey,
                                id: this.formKey.id,
                                levelLabel: String(this.formKey.levelLabel),
                                terminal: String(this.formKey.terminal),
                                siteId: this.$root.nowSite.id
                            };
                            for (let key in params) {
                                if (key == 'code' || key == 'src' || key == 'transfer'||key == 'virtual'||key=='group_name') delete params[key];
                            }
                            if (params.inCard == 'code') {
                                params.classId = this.formKey.code.id;
                                params.className = this.formKey.code.className;
                                params.devices = params.terminal;
                                params.qr_code = this.imgPath;
                                 params.group_id=this.formKey.group_id;
                              params.status=this.formKey.status;
                                
                                QRCodeUpdate(params, true).then(res => {
                                    if (res != undefined && res.code == 200) {
                                        this.$root.endEditLoading();
                                        this.$Message.success({ content: '编辑二维码成功' });
                                        const { inCard, classId, className,group_id,status} = params;
                                        this.goCardList({ inCard, classId, className,group_id,status});
                                    }
                                });
                            }
                            if (params.inCard == 'card') {
                                params.id=this.$route.query.id;
                                for (let key in params){
                                    if(!params[key]) delete params[key];
                                }
                                if(this.formKey.bankName==''){
                                this.$Message.error('请选择银行名称');
                                this.$root.endEditLoading();
                                return;
                                }
                                companyBankCardUpdate(params, true).then(res => {
                                    if (res != undefined && res.code == 200) {
                                        this.$root.endEditLoading();
                                        this.$Message.success({ content: '修改入款卡成功' });
                                        const { inCard, classId, className,group_id,status } = params;
                                        this.goCardList({ inCard, classId, className,group_id,status});
                                    }
                                });
                            }
                            if (params.inCard == 'transfer_bank') {
                                params.classId = this.formKey.transfer.id;
                                params.className = this.formKey.transfer.className;
                                   params.group_id=this.formKey.group_id;
                              params.status=this.formKey.status;
                                companyBankCardUpdate(params, true).then(res => {
                                    if (res != undefined && res.code == 200) {
                                        this.$root.endEditLoading();
                                        this.$Message.success({ content: '修改成功' });
                                        const { inCard, classId, className,group_id, status} = params;
                                        this.goCardList({ inCard, classId, className,group_id,status});
                                    }
                                });
                            }

                            if (params.inCard == 'transfer_account') {
                                params.classId = this.formKey.code.id;
                                params.className = this.formKey.code.className;
                                   params.group_id=this.formKey.group_id;
                              params.status=this.formKey.status;
                                companyBankCardUpdate(params, true).then(res => {
                                    if (res != undefined && res.code == 200) {
                                        this.$root.endEditLoading();
                                        this.$Message.success({ content: '修改成功' });
                                        const { inCard, classId, className,group_id, status } = params;
                                        this.goCardList({ inCard, classId, className,group_id,status });
                                    }
                                });
                            }
                            if(params.inCard == 'virtual'){
                                params.classId = this.formKey.virtual.id;
                                params.classType = this.formKey.virtual.classType;
                                params.device = params.terminal;
                            
                                params.group_id=this.formKey.group_id;
                                params.status=this.formKey.status;
                                virtualUpdate(params,true).then(res=>{
                                    const { className, classId, inCard,group_id,status} = params;
                                    if (res != undefined && res.code == 200) {
                                         this.$root.endEditLoading();
                                         this.$Message.success({ content: '修改成功' });
                                         this.goCardList({ inCard, classId, className,group_id,status });
                                 }
                                })
                        }
                    }
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../styles/button.less';
/deep/.ivu-form-item-error-tip {
    width: 340px;
    left: -8px;
    top: 38px;
    font-size: 0.875rem;
}
.cardLeft {
    .ivu-form-item {
        &:nth-last-child(1) {
            button {
                width: 275px;
                height: 50px;
                font-size: 1.25rem /* 20/16 */;
            }
        }
    }
}
.money {
    /deep/.ivu-form-item-error-tip {
        width:360px;
        left: 0;
        top: 100%;
    }
}
/deep/.bottom30 {
    margin-bottom: 0;
}

// 二维码的样式
.upLoad {
    width: 270px;
    height: 270px;
    border: 1px solid #e4e4e4;
    border-radius: 5px;
}

.demo-upload-list {
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 140px;

    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    // margin-right: 4px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 1.25rem /* 20/16 */;
    cursor: pointer;
    margin: 100px 10px;
}
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    /deep/.ivu-modal {
        top: 0;
    }
}
/deep/.ivu-auto-complete.ivu-select-dropdown {
    max-height: 200px !important;
}
//存入账户的选中的颜色变为蓝色
/deep/.ivu-select-multiple .ivu-select-item-selected {
    color: rgba(45, 140, 240, 0.9) !important;
}
/deep/.ivu-select {
    width: 275px !important;
}
.star{
/deep/ .ivu-form-item-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 0.875rem;
    color: #ed4014;
}
}
.codeImg{
    width: 270px;
	height: 270px;
	border: 1px solid #e4e4e4;
	border-radius: 5px;
}
/deep/.rukuan .ivu-select-disabled .ivu-select-selection .ivu-select-arrow{
    display:none;
}
</style>


