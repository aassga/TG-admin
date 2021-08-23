<template>
    <div>
        <Form :model="formKey" ref="formKey" :rules="rules" :label-width="120">
            <FormItem label="创建人">
                <Input class="w320x" v-model="username" disabled />
            </FormItem>
            <FormItem label="管理员账号" prop="userName">
                <Input v-model="formKey.userName" class="w320x" placeholder="请输入6-20位数字或字母" :disabled="$route.query.id ? true : false" />
            </FormItem>
            <FormItem label="管理员密码" prop="password" v-if="!$route.query.id">
                <Input v-model="formKey.password" class="w320x" placeholder="请输入8-20位数字或字母" />
            </FormItem>
            <FormItem label="管理员别称" prop="otherName">
                <Input v-model="formKey.otherName" class="w320x" placeholder="请输入管理员别称" :maxlength="15" />
            </FormItem>
            <FormItem label="管理员角色" prop="groupId">
                <Select v-model="formKey.groupId" placeholder="请选择管理员角色" clearable >
                    <Option v-for="(t,i) in rolesList" :value="t.id" :key="i">{{t.title}}</Option>
                </Select>
                <Button  style="height:36px;" v-if="formKey.groupId==5"  class="oldColor w120x ib ml20" type="primary" @click="changeCurrentBtn">编辑权限</Button>
            </FormItem>
             <div class="ml20">
                <span  class="ml20 ib xColor">*</span>
                <span class="pl5 ib mb10">管理站点</span>
                <span class="blue-font cs pl10 " @click="editSite">编辑</span>
                <span class="ml10 blue-font ml10" v-if="this.$route.query.id"  @click="detialSite('detial')" >详情</span>
            </div>
            <div class="ml20 mt10 mb10">
                <!-- <span  class="ml20 ib xColor">*</span> -->
                <span class=" ib ml30 mb10">操作等级</span>
                <span class="blue-font cs pl10 ib" v-if="this.formKey.siteId.length>0" @click="editMoney()">编辑</span>
                <span v-else class="gray-font  pl10 ib" >编辑</span>
                <span class="ml10 blue-font" v-if="this.formKey.siteId.length>0&&this.$route.query.id"  @click="detailMoney()" >详情</span>
            </div>
            <EditSiteModals :editId="editId" :newSiteId="newSiteId" :site="site" :accessSite="accessSite"  @onSiteChange="onSiteChange" ref="mangerModals"></EditSiteModals>
            <DetialSiteModals ref="mangeDetialModals" :newSiteId="newSiteId"  :site="site" :accessSite="accessSite"></DetialSiteModals>
            <!-- <FormItem label="管理站点">
                <SiteSelect
                    class="ib"
                    ref="SiteSelect"
                    mode="多选"
                    filterable
                    :clearable="false"
                    :siteList="accessSite || []"
                    :isEdit="$route.query.id ? true : false"
                    @on-site-change="onSiteChange"
                />
                   
            </FormItem> -->
              <FormItem label="取款单笔限额">
                <InputNumber class="w145x" 
                :formatter="value =>formKey.smallWithdrawalsMoney= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]" 
                 :value="Number(formKey.smallWithdrawalsMoney)||null" 
                  @on-change="(e)=>{if(!e){formKey.smallWithdrawalsMoney=e=0}}"
                  placeholder="0或空表示无下限" />
                <span class="ml10 mr10">-</span> 
                 <InputNumber class="w150x" 
                   :formatter="value =>formKey.bigWithdrawalsMoney= value =  /\d+(\.\d)?/g.exec(`${value}`)[0]" 
                    :value="Number(formKey.bigWithdrawalsMoney)||null" 
                      @on-change="(e)=>{if(!e){formKey.bigWithdrawalsMoney=e=0}}"
                  placeholder="0或空表示无上限" />
                  <Poptip
                  word-wrap 
            class="ml10"
            trigger="hover"
            content="控制管理员审核会员时可看到和审核的单笔取款订单金额。
（包含线上取款和货币取款）
如设置的限额为1~500，则此管理员只可看到和审核此金额范围内的订单，
不在此范围内的订单此管理员不可见"
            placement="right-start"
          >
            <Icons :type="'bangzhutishi'" :size="20" :color="'#dcdcdc'"></Icons>
            </Poptip>
            </FormItem>
               <FormItem label="加款单笔限额">
                <Input class="w320x" v-model="formKey.maxAddMoney" placeholder="0或空表示无上限" />
                  <Poptip
            class="ml10"
            trigger="hover"
            content="控制管理员在加款减款菜单中可加款的单笔最大额度"
            placement="right-start"
          >
            <Icons :type="'bangzhutishi'" :size="20" :color="'#dcdcdc'"></Icons>
            </Poptip>
            </FormItem>
            <FormItem label="加款信用额度">
               <Input class="w320x" v-model="formKey.balance" placeholder="0或空表示无上限"/>
                 <Poptip
                    class="ml10"
                    trigger="hover"
                    content="控制管理员在加款减款菜单中可加款的单笔总额度"
                    placement="right-start"
                >
                <Icons :type="'bangzhutishi'" :size="20" :color="'#dcdcdc'"></Icons>
                </Poptip>
            </FormItem>
       
            <Modals ref="moneyModals" title="编辑出入款操作等级" width="1140" >
                <div slot="content" >
                    <div  class="mb20"  :style="levelPermission.length>5?'height:490px;overflow-y:auto':'{height:`${(levelPermission.length)*100}px`}'">
                 <LevelSelect v-show="false" ref="LevelSelect" mode="多选" levelType="member" @on-change="onLevelChange" />
                
                 <div v-for="(permission, y) in levelPermission" :key="'persi' + y">
                     
                     <div v-if="permission.levels.length" class="mb10">
                        <div style="display: inline-block;" > 
                        <Checkbox class="ib pl50 pr10 fl  "   v-model="permission.checked" :indeterminate="permission.indeterminate" @on-change="val => checkAll(permission, val)">
                         <span  class="ft15">{{ permission.siteName }}</span>
                        </Checkbox> 
                       </div>
                        <div >
                             <div class="ib ml40" >
                                 <Checkbox 
                                    class=" boxLive  mt5"
                                     v-for="t in permission.levels.slice(0,20)"
                                     :value="t.levelLabel"
                                     :key="t.id"
                                     v-model="t.checked"
                                     @on-change="val => checkOne(permission, t, val)"
                                     >{{ t.levelName }}</Checkbox
                                 >
                         
                             </div>
                             <div class="ml80 ">
                                 <Checkbox
                                     v-for="t in permission.levels.slice(20, permission.levels.length)"
                                     :value="t.levelLabel"
                                     :key="t.id"
                                     v-model="t.checked"
                                     @on-change="val => checkOne(permission, t, val)"
                                     >{{ t.levelName }}</Checkbox
                                 >
                             </div>
                        </div>
                     </div>
                 </div>
                </div>
                 <Button type="primary" @click="saveMoney"   class= "ivu-btn submit mb30"  style="margin-left:39%" >确认保存</Button>
                </div>
            </Modals>

            <Modals ref="moneyDetialModals" title="出入款操作等级详情" width="1140" height="600">
                <div slot="content"  >
                    <div class="mb20"  :style="detialData.length>5?'height:505px;overflow-y:auto':'{height:`${(detialData.length)*100}px`}'">
                 <LevelSelect v-show="false" ref="LevelSelect" mode="多选" levelType="member" @on-change="onLevelChange" />
                
                 <div v-for="(permission, y) in detialData" :key="'persi' + y" >
                     
                     <div v-if="permission.levels.length" class="mb10 ">
                        <div class="clearfix"> 
                        <p class="pl30 ib  fl mb5  ft15" v-if="permission.levels.length>0"  >{{permission.siteName}}</p>
                       </div>
                     
                         <div  v-if="permission.newLength>0">
                             <div class="ib ml20">
                               
                                 <span  class=" ib  boxLive ml10 mt5"
                                 v-if=" t.levelNameNew"
                                 v-for="t in permission.levels.slice(0,16)"
                                 :value="t.levelLabel"
                                 :key="t.id">{{ t.levelNameNew }}</span>
                                
                             </div>
                             <div class="ml80">
                                 <span  class="ib br bl bb bt pl5 pt5 pb5"  v-for="t in permission.levels.slice(16, permission.levels.length)"
                                 :value="t.levelLabel"
                                 :key="t.id">{{ t.levelName }}</span>
                             </div>
                         
                        </div >
                        <p v-else  class="ib ml30" style="color:#918b8b;" >无配置操作等级</p>
                        
                     </div>
                 </div>
                </div>
                </div>  
            </Modals>

            <FormItem label="状态" v-if="$route.params.page == 'edit'">
                <Select v-model="formKey.status" class="w320x">
                    <Option value="yes">正常</Option>
                    <Option value="no">停用</Option>
                </Select>
            </FormItem>
            <FormItem class="origin">
                <Button @click.prevent="saveAll">{{ $route.params.page == 'edit' ? '确认保存' : '确认添加' }}</Button>
            </FormItem>
        </Form>

        <!-- 编辑权限弹框 -->
        <Modals title="编辑权限"   :width="screen<1600?'1200':'1140'" ref="editPermission" height="600">
            <div slot="content">
                <ButtonGroup style="marginLeft: 12px;">
                    <Button
                        class="fontColor ft16 h40x"
                        v-for="(t, i) in currentPermission"
                        :key="i"
                        :class="currentBtn == t.menu_name ? 'bd-bg w160x' : 'bg-or w160x'"
                        @click="changeCurrent(t.menu_name)"
                    >
                        <span>{{ t.menu_name }}</span>
                    </Button>
                </ButtonGroup>
                <div style="maxHeight: 480px;overflow-y: auto;">
                    <div v-for="(t, i) in currentPermission" v-if="t.menu_name == currentBtn" :key="i" class="clearfix">
                        <div v-for="(item, index) in t.newList" :key="'in' + index" class="pre" @click="checkChange(item)" v-if="!item.value.includes('hide')">
                            <Checkbox v-model="item.checked" :label="item.name" class="ml10">
                                <span @click="checkChange(item)">{{ item.value }}</span>
                                <Poptip v-if="tipList[item.name]" trigger="hover" :content="tipList[item.name]" transfer>
                                    <Icons type="bangzhutishi" color="#E4E4E4" size="18"></Icons>
                                </Poptip>
                            </Checkbox>
                        </div>
                    </div>
                </div>
                <Button class="tijiao" @click="savePremission">提交保存</Button>
            </div>
        </Modals>

    </div>
</template>
<script>
import { mapState } from 'vuex';
import MoneyModals from "./components/moneyModals"
import LevelSelect from '@/components/level-select';
import SiteSelect from '_c/site-select';
import Modals from '_c/modals';
import EditSiteModals from "./components/selectModals";
import DetialSiteModals from "./components/selectModals";
import { getMemberLevelData } from '@/api/member';
import { adminNewDetail, adminNewAdd, adminNewUpdate,adminRolesList } from '@/api/system';
import { getUserName } from '@/libs/util';
import { getUserType } from "@/libs/util";
import Icons from '_c/icons';
export default {
    name: 'adminEdit',
    computed: {
        ...mapState({
            accessSite: state => state.user.accessSite,
            authMenu: state => state.user.authMenu,
            tipList: state => state.info.tipList
        })
    },
    components: {
        Modals,
        MoneyModals,
        SiteSelect,
        LevelSelect,
        Icons,
        EditSiteModals,
        DetialSiteModals
    },
    data() {
        return {
            adminType: getUserType(),
            editId:'',
            newLevlId:[],
            saveId:'',
            newSiteId:[],
            editSiteId:[],
            newId:[],
            site:[],
            rolesList:[],
            detialDataNew:[],
            detialData:[],
            screen: screen.width,
            editHg: screen < 1500 && screen > 1400 ? '580px' : '680px',
            rentType: localStorage.rentType,
            postData: {
                menu: []
            },
            username: '',
            exitAuthMenu: [], // 编辑时的权限
            showPermission: [],
            currentBtn: '会员管理',
            menuName: '',
            currentPermission: [], // 总的权限
            finance: [],
            system:[],
            formKey: {
                userName: '',
                password: '',
                otherName: '',
                groupId:'',
                siteId: [],
                levelId: [],
                maxAddMoney: '',
                smallWithdrawalsMoney:'',
                bigWithdrawalsMoney:'',
                status: '',
                balance:'',
            },
            rules: {
                userName: [
                    {
                        required: true,
                        message: '请输入管理员账号',
                        trigger: 'blur'
                    },
                    {
                        trigger: 'blur',
                        message: '请输入6-20位数字字母',
                        pattern: /^[A-Za-z0-9]{6,20}$/
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入管理员密码',
                        trigger: 'blur'
                    },
                    {
                        required: true,
                        message: '请输入8-20位数字字母',
                        pattern: /^[A-Za-z0-9]{8,20}$/
                    }
                ],
                otherName: [
                    {
                        required: true,
                        message: '请输入管理员别称',
                        trigger: 'blur'
                    }
                ],
                groupId:[
                    {
                        required:true,
                        message:'请选择管理员角色',
                        trigger: 'change',
                        pattern: /.+/
                    }
                ]
            },
            levelPermission: [] // 出入款等级
        };
    },
    created() {
     
        this.goRolesList()
        this.$nextTick(() => {
            this.$Message.config({
                top: 50,
                duration: 1
            });

            // 得到的是能够编辑的所有权限
			this.currentPermission = JSON.parse(this.authMenu);
            this.currentPermission.forEach(item => {
                item.newList = [];
                for (let key in item.list) {
                    item.newList.push({
                        name: key,
                        value: item.list[key],
                        checked: false
                    });
                }
                if (this.rentType == 'rent') {
                    item.newList.forEach(t => {

                        for (let key in t) {
                            if (
                                t[key] == '快速彩票' ||
                                t[key] == '彩票时间设置' ||
                                t[key] == '香港六合彩开盘设置' ||
                                t[key] == '赔率设置' ||
                                t[key] == '官方彩开奖' ||
                                t[key] == '快速彩开奖' ||
                                t[key] == '快速彩票排行榜' ||
                                t[key] == '高杀率名单' ||
                                t[key] == '快速彩黑名单' ||
                                t[key] == '回滚结算' ||
                                t[key] == '彩票撤单' ||
                                t[key] == '新增站点' ||
                                t[key] == '全站维护' ||
                                t[key] == '游戏控制/返水设置' ||
                                t[key] == '游戏维护' ||
                                t[key] == '系统预设' ||
                                t[key] == '支付平台管理' ||
                                t[key] == '鸿运当头记录/设置' ||
                                t[key] == '支付统计' ||
                                t[key] == '支付方式'
                            ) {
                                t[key] = 'hide';
                            }
                            if (t[key] == '单站游戏') {
                                t[key] = '游戏管理';
                            }
                        }
                    });
                }
            });
            if (this.$route.query.id) {
                this.editId=this.$route.query.id;
                adminNewDetail({ adminId: this.$route.query.id }).then(res => {
                    let { siteId, levelId, maxAddMoney,maxWithdrawalsMoney,balance, authMenu, status, userName, password, otherName,groupId, createUserName,site} = res.data;
                    // console.log(this.site)
                    
                    this.username = createUserName;
                    if (res.data.authMenu) {
                        this.exitAuthMenu = JSON.parse(res.data.authMenu);
                        this.currentPermission.forEach(item => {
                            item.newList.forEach(child => {
                                this.exitAuthMenu.forEach(inline => {

                                    for (let key in inline.list) {
                                        if (key == child.name) {
                                            child.checked = true;
                                        }
                                    }
                                });
                            });
                        });
                    } else {
                        this.exitAuthMenu = [];
                    }
                    this.newSiteId=siteId = siteId.split(',');//newSiteId 应该选中的站点
                    // console.log(this.newSiteId)
                    this.formKey.levelId = levelId.split(',');
                    this.newLevlId=this.formKey.levelId;
                    this.formKey.userName = userName;
                    this.site=site; //编辑能否选择的站点;
                    // console.log(this.site)
                    let m=[];
                   this.newSiteId.forEach(t=>{m.push(Number(t))})
                //    console.log(this.newSiteId)
                //    this.editSiteId=this.site.filter((item) =>m.includes(item.id));//过滤数据
                   this.editSiteId=this.site.filter((item) =>m.includes(item.id)&&item.allow_chk=='yes');//过滤数据

                //    console.log(this.editSiteId)
                    this.onSiteChange(this.editSiteId,'default');//传应该选中的站点
                    // this.formKey.password = '12345678'
                    this.formKey.otherName = otherName;
                    let d=[];
                    if(groupId){d.push(groupId);this.formKey.groupId=d;}
                  
                    this.formKey.maxAddMoney = maxAddMoney;
                    this.formKey.smallWithdrawalsMoney=maxWithdrawalsMoney&&maxWithdrawalsMoney.split("-")[0];
                    this.formKey.bigWithdrawalsMoney=maxWithdrawalsMoney&&maxWithdrawalsMoney.split("-")[1];
                    this.formKey.balance=balance;
                    this.formKey.id = res.data.id;
                    this.formKey.status = status;
                    this.$refs.SiteSelect.setDefaultSite(siteId);
                });
            } else {
                this.username = getUserName();
            }

            this.currentPermission.forEach(t => {
                if (t.menu_name == '财务管理') {
                    this.finance = t.newList;
                }
                 
            });
              this.currentPermission.forEach(t => {
               if (t.menu_name == '系统管理') {
                    this.system = t.newList;
                    // console.log(this.system)
                }
                
            });
        });
    },
    watch: {
        finance: {
            handler(val) {
                if(val){
                    let flag1 = val.find(t => t.name == 'third_payment_manage_edit');
                let flag2 = val.find(t => t.name == 'single_payment_manage_edit');
                if(flag1){
                    if (flag1.checked) this.$set(flag2, 'checked', true);
                    }
                }
               
            },
            deep: true
        },
        system:{
            handler(val){
                if(val){
                let flag1= val.find(t => t.name == 'game_sort_v4_sync_site');
                let flag2= val.find(t => t.name == 'game_sort_v4');
                if(flag1){
                    if (flag1.checked) this.$set(flag2,'checked', true);
                    }
                }
            },
             deep: true
        }
    },
    methods: {
        editSite(){//管理站点弹框；
            // console.log(this.formKey.siteId)
            // console.log()
           this.$refs.mangerModals.show(this.$route.params.page,this.formKey.siteId);
        },  
        detialSite(type){//管理站点详情；
            if(this.formKey.siteId){
                this.$refs.mangeDetialModals.showDetial(type,this.formKey.siteId)
            }else{
                this.$refs.mangeDetialModals.showDetial(type)
            }
        },
        goRolesList(){
            adminRolesList().then(res=>{
                if(res!=undefined&&res.code==200){
                    this.rolesList=res.data;
                }
            })
        },
        detailMoney(){//操作等级详情
            this.detialData=[];
            this.createData()
            if(this.levelPermission.length){
                this.levelPermission.forEach(t=>{
                if(t.checked==true){
                    t.name=t.siteName;
                }
                let c=[];
                t.levels.forEach(m=>{
                        if(m.checked==true){
                            m.levelNameNew=m.levelName;
                            c.push(m);
                        }
                })
                t.newLength=c.length
                this.detialData.push(t)
              })
              let sortArr = this.detialData.sort((a,b) => {
                  return b.newLength-a.newLength;});
              this.detialData=this.detialData.filter((x, index,self)=>self.indexOf(x)===index)
            }   
            setTimeout(()=>{
                this.$refs.moneyDetialModals.show();

              },1000)
        },
        saveMoney(){
          this.$refs.moneyModals.hide();
          this.$refs.moneyDetialModals.hide();
        //   this.detialData=[];
        },
        editMoney(){//操作等级的弹框
            this.createData();
            this.$refs.moneyModals.show()
        },
        checkChange(data) {
            let con = this.currentPermission.find(t => t.menu_name == this.currentBtn).newList.find(k => k.name == data.name);
            this.$set(con, 'checked', !con.checked);
            this.createData();
        },
        createData() {
            let idList = [];
            this.levelPermission.forEach(item => {
                item.levels.forEach(level => {
                    if (level.checked) {
                        idList.push(level.id);
                    }
                });
            });
            let _idList = [];
            _idList.forEach(id => {
                if (!_idList.includes(id)) {
                    _idList.push(id);
                }
            });
            this.formKey.levelId = _idList;
        },
        checkAll(parent, val) {
            // console.log(parent)
            this.$set(parent, 'indeterminate', false);
            this.$set(parent, 'checked', val);
            parent.levels.forEach(level => {
                this.$set(level, 'checked', val);
            });
            this.createData();
        },
        checkOne(parent, le, val) {
           
            this.$set(le, 'checked', val);
            let count = 0;
            parent.levels.forEach(level => {
                if (level.checked) count++;
            });
            if (count) {
                if (count < parent.levels.length) {
                    this.$set(parent, 'checked', false);
                    this.$set(parent, 'indeterminate', true);
                } else {
                    this.$set(parent, 'checked', true);
                    this.$set(parent, 'indeterminate', false);
                }
            } else {
                this.$set(parent, 'checked', false);
                this.$set(parent, 'indeterminate', false);
            }
            this.createData();
        },
        onSiteChange(res,type) {
            let id=[];
            let siteName=[];
                res&&res.forEach(t=>{
                  
                    if(type=='default'){//默认加载
                        id.push(t.id)
                         siteName.push(t.siteName)
                    }else if(type=='addSecond'){
                    
                        if(t){
                            id.push(t.siteId);
                        siteName.push(t.siteName);
                        }
                      

                    }else if(type=='selectSave'){
                     
                        if(t.checked){
                        id.push(t.id)
                         siteName.push(t.siteName)
                      }
                    }
                })
                // console.log(id,'我是id')
                // console.log(siteName,'我是名称')
          
            if (id) {
                //  添加
                if (!this.$route.query.id) {
          
                    const { siteId } = this.formKey;
                    //  console.log(id.length,'我是长度')
                    //  console.log(siteId.length,'我是长度')
                    if (id.length > siteId.length) {
                        this.levelPermission=[];
                        res.forEach(t=>{
                          if(t.checked==true){
                               var obj={};
                              obj.siteName=t.siteName;
                              obj.siteId=t.id;
                              obj.levels = [];
                          this.$refs.LevelSelect.init(obj.siteId).then(res => {
                              obj.levels = res;

                          });
                          this.levelPermission.push(obj);
                          }
                         
                            
                     
                        })
                       
                    }else if(id.length==siteId.length){
                        this.levelPermission=[];
                        res.forEach(t=>{
                            if(t.checked==true){
                                let obj={};
                                 obj.siteName=t.siteName;
                                obj.siteId=t.id;
                                obj.levels = [];
                                this.$refs.LevelSelect.init(obj.siteId).then(res => {
                                    obj.levels = res;
                                });
                            this.levelPermission.push(obj);
                            }
                        })


                    } else if (id.length < siteId.length) {
                      
                        this.levelPermission=[];
                        res.forEach(t=>{
                            if(t.checked==true){
                                let obj={};
                                 obj.siteName=t.siteName;
                                obj.siteId=t.id;
                                obj.levels = [];
                                this.$refs.LevelSelect.init(obj.siteId).then(res => {
                                    obj.levels = res;
                                });
                            this.levelPermission.push(obj);
                            }
                        })
                    }
                    this.formKey.siteId = id;

                }
                if (this.$route.query.id) {
                    this.levelPermission = [];
                    // 经历两次change，后台脏数据
                    const len1 = this.formKey.siteId.length;
                    const len2 = id.length;
                    this.formKey.siteId = id;
                    // if (len1 === len2) return;
                    const waitFor = (item, i) => {
                        return new Promise(resolve => {
                            //编辑的leevl 请求对应次数
                            // item=this.newSiteId;
                            let obj = {};
                            obj.siteId = item;
                            obj.siteName = siteName[i];
                            obj.levels = [];
                            this.$refs.LevelSelect.init(item).then(res => {
                                obj.levels = res;
                                this.levelPermission.push(obj);
                                // console.log(this.levelPermission)
                                // 编辑check同步
                                this.levelPermission.forEach(parent => {
                                    let count = 0;
                                    parent.levels.forEach(level => {
                                        this.newLevlId.forEach(_level => {
                                            if (level.id == +_level) {
                                                count++;
                                                this.$set(level, 'checked', true);
                                            }
                                        });
                                    });
                                    if (count) {
                                        if (count < parent.levels.length) {
                                            this.$set(parent, 'checked', false);
                                            this.$set(parent, 'indeterminate', true);
                                        } else {
                                            this.$set(parent, 'checked', true);
                                            this.$set(parent, 'indeterminate', false);
                                        }
                                    } else {
                                        this.$set(parent, 'checked', false);
                                        this.$set(parent, 'indeterminate', false);
                                    }
                                });
                            });
                        });
                    };
                    id.forEach((item, i) => {
                        waitFor(item, i);
                    });
                    // console.log(id)
                    this.formKey.siteId=id;
                }
            }
            if (!id.length) {
                this.levelPermission = [];
            }
        },
        changeCurrentBtn() {
            this.$refs.editPermission.show();
            this.changeCurrent(this.currentBtn);
            this.currentBtn = '会员管理';
        },
        onLevelChange(res) {
            this.formKey.levelId = res;
        },
        changeCurrent(stage) {
            this.currentBtn = stage;
        },
        // 获取编辑后的权限
        savePremission() {
            this.postData.menu = JSON.parse(JSON.stringify(this.currentPermission));
            this.postData.menu.forEach(item => {
                item.newList = item.newList.filter(item => item.checked == true);

                item.newList.forEach(t => {
                    delete t.checked;
                });
            });
            this.postData.menu.forEach(item => {
                item.list = {};
                item.newList.forEach((temp, index) => {
                    item.list[temp.name] = temp.value;
                });
                delete item.newList;
            });
            this.$refs.editPermission.hide();
        },
        // 确认新增信息的保存
        saveAll() {
            this.$refs.formKey.validate(valid => {
                if (valid) {
                    let { userName, password, otherName,groupId, maxAddMoney,smallWithdrawalsMoney,bigWithdrawalsMoney,balance, siteId, status } = this.formKey;
                    let m=[];
                
                    if (siteId.length == 0) {
                        this.$Tip.info({ content: '请选择管理站点' });
                        return false;
                    }  
                    let arr = [];
                    let data = {
                        userName,
                        password,
                        otherName,
                        groupId,
                        maxAddMoney,
                        maxWithdrawalsMoney:`${smallWithdrawalsMoney}-${bigWithdrawalsMoney}`,
                        balance,
                        siteId: siteId.join(','),
                        status
                    };
                    for (let key in data){
                            if(!data[key]) delete data[key]
                        }
                    if (!data.maxAddMoney) data.maxAddMoney = 0;
                    console.log(data)
                    if(!data.balance)data.balance=0;
                    this.levelPermission.forEach(item => {
                        for (let key in item) {
                            item.levels.forEach(site => {
                                if (site.checked) arr.push(site.id);
                            });
                        }
                    });
                    arr = Array.from(new Set(arr));
                    data.levelId = arr.join(',');
                    // if(data.levelId.length==0){
                    //     this.$Tip.info({ content: '请选择操作等级' });
                    //     return false;
                    // }
                    if (this.postData.menu.length > 1) {
                        data.menu = JSON.stringify(this.postData.menu);
                    } else {
                        this.postData.menu = this.exitAuthMenu;
                        data.menu = JSON.stringify(this.postData.menu);
                    }
                    if (this.$route.params.page == 'add') {
                     
                        adminNewAdd(data, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success(res.data);
                                this.$router.push({ name: 'admin' });
                            }
                        });
                    } else {
                        if(groupId!=5){
                            data.menu=[];
                        }
                        let f=[];//拼接原来的id 传过去
                        this.site.forEach(t=>{
                            if(t.allow_chk=='no'){
                              f.push(t.id)
                            }
                        })
                        // console.log(f)
                        let n=this.formKey.siteId+`,${f}`;
                         n=(n&&n.split(",")).filter((x, index,self)=>self.indexOf(x)===index);
                        data.siteId=String(n);
                        data.adminId = this.$route.query.id;
                        adminNewUpdate(data, true).then(res => {
                            if (res != undefined && res.code == 200) {
                                this.$Message.success(res.data);
                                this.$router.push({ name: 'admin' });
                            }
                        });
                    }
                }
            });
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
/deep/.ivu-btn-group {
    /deep/.ivu-btn {
        span {
            margin-top: 3px;
        }
    }
}
.bd-bg {
    background-color: #2d8cf0;
    color: #ffffff;
    box-shadow: 0;
    &:focus {
        box-shadow: 0 0 0 0;
    }
}
.bg-or {
    border: 1px solid #eaeaea;
    &:focus {
        box-shadow: 0 0 0 0;
    }
    &:hover {
        background: #f4f9ff;
        border: 1px solid #2d8cf0;
        color: #2d8cf0;
    }
}
.pre {
    display: block;
    width: 18.5%;
    float: left;
    margin-left: 13.5px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #e4e4e4;
    // margin-top: 20px;
    margin-block-end: 15px;
    /deep/.ivu-checkbox-wrapper,
    .ivu-checkbox-wrapper-checked,
    .ivu-checkbox-default {
        margin-left: 18px;
    }
}
/deep/.ivu-checkbox-wrapper {
    font-size: 12px;
}   

.tijiao {
    display: block;
    width: 260px;
    margin: 20px auto;
    background-color: #2d8cf0;
    color: #ffffff;
    height: 50px;
    font-size: 1.25rem /* 20/16 */;
    position: absolute;
    left: 38%;
    bottom: 20px;
}
.clearfix {
    margin-top: 20px;
}
/deep/.origin {
    button {
        display: inline-block;
        width: 320px;
        background: #2d8cf0;
        color: #ffffff;
        height: 50px;
        font-size: 1.25rem /* 20/16 */;
    }
}
/deep/.ivu-tag-text {
    color: #444;
}
/deep/.ivu-select-selection {
    color: #444;
}
//管理站点选中的颜色
/deep/.ivu-select-multiple .ivu-select-item-selected {
    color: rgba(45, 140, 240, 0.9) !important;
}
/deep/ .ivu-select {
    width: 320px !important;
}
/deep/.ivu-poptip-rel {
    vertical-align: middle;
}
.boxLive{
   width: 100px;
   height: 50px;
   line-height: 50px; 
   border:1px solid #dcdcdc;
   border-radius: 5px;
   padding-left: 10px;}
</style>
