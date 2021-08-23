<template>
  <div>
    <Form ref="formKey" :model="formKey" :rules="rules" :label-width="110">
      <FormItem label="代理账号">
        <Input v-model="formKey.userName" disabled class="w260x"/>
      </FormItem>
      <FormItem label="代理类型" v-if="$route.query.stage == 'domain'">
        <Input v-model="formKey.agent_type" disabled class="w260x"/>
      </FormItem>
      <FormItem label="代理类型" v-if="$route.query.stage == 'code'">
        <Input v-model="formKey.is_agency" disabled class="w260x"/>
      </FormItem>
      <FormItem label="域名信息" prop="domain" v-if="$route.query.stage == 'domain'">
        <Input v-model="formKey.domain" class="w260x"/>
      </FormItem>
      <FormItem label="推广码" prop="invite_code" v-if="$route.query.stage == 'domain'">
        <Input placeholder="请输入推广码" v-model="formKey.invite_code"	class="w260x" maxlength="8"/>
      </FormItem>
       <FormItem label="域名描述" prop="domain_description">
          <Input placeholder="如 主域名/推广域名" v-model="formKey.domain_description"	class="w260x"/>
        </FormItem>
        <FormItem label="域名分组" >
          <Select class="w260x" v-model="formKey.group_id" clearable>
            <Option v-for="(t,i) in domainSumList" :key="i" :value="t" >{{t}}</Option>
          </Select>
          </FormItem>
          <FormItem label="开放等级" >
            <div class="ib">
              <Select class="w260x" v-model="formKey.level_label" @on-change="levelChange" multiple clearable >
              <Option v-for="(t,i) in openLevelList" :key="i" :value="t.levelLabel" >{{t.levelAlias}}</Option>
             </Select>
            </div>
				</FormItem>
          <FormItem label="注册层级" >
            <div class="ib">
              <Select class="w260x" v-model="formKey.register_level" @on-change="registerChange">
              <Option v-for="(t,i) in openLevelList" :key="i" :value="t.levelLabel" >{{t.levelAlias}}</Option>
             </Select>
            </div>
				</FormItem>
        <FormItem label="是否证书">
          <Select class="w260x" v-model="formKey.domain_certificate">
            <Option value="yes">是</Option>
            <Option value="no">否</Option>
          </Select>
       </FormItem>
      <FormItem label='下级类型' v-if="$route.query.stage == 'domain'">
        <Select class="w260x" v-model="formKey.is_agency" :disabled="selectDisabled">
          <Option value="0">会员</Option>
          <Option value="1">代理</Option>
        </Select>
      </FormItem>
      <FormItem label="邀请码" v-if="$route.query.stage == 'code'">
        <Input v-model="formKey.code" class="w260x" disabled/>
      </FormItem>
      <FormItem label='优惠活动链接' v-if="$route.query.stage == 'code'">
        <Input class="w260x" v-model="formKey.activity_url"/>
      </FormItem>
      <FormItem v-if="$route.query.stage == 'domain'">
        <Checkbox v-model="formKey.checkDomain">
          <span>域名检测</span>
        </Checkbox>
        <Poptip trigger="hover" content="选中后会自动检测域名是否正常" placement="right-end">
          <Icons type="bangzhutishi" color="#E4E4E4" :size="20"></Icons>
        </Poptip>
        <Checkbox v-model="formKey.is_fast" class="ml50">
          <span>域名加速</span>
        </Checkbox>
        <Poptip trigger="hover" content="选中后app会优先选择此域名" placement="right-end">
					<Icons type="bangzhutishi" color="#E4E4E4" :size="20"></Icons>
				</Poptip>
      </FormItem>
      <div v-show="$root.checkCommission()">
        <div style="marginTop:60px;">
          <rebate-select :data="rebate" @on-rebate-change="onRebateChange" ref="rebateSelect"></rebate-select>
          <refund-select :data="refund" @on-refund-change="onRefundChange" ref="refundSelect"></refund-select>
        </div>
      </div>
      <FormItem>
        <Button type="primary"  class="mt15 ivu-btn w320x commonSubmit" @click.prevent="submit" :loading="$root.editBtnLoading">确认保存</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import Icons from "@/components/icons";
import {
  agencyRebatePlatform,
  agencyDomainList,
  agencyDomainUpdate,
  agencyDomainDetails,
  agencyInviteCodeDetail,
  agencyInviteCodeUpdate
} from "@/api/agency";
import{
  domainGroupList
}from "@/api/system";
import { getMemberLevelData } from "@/api/member"
import RefundSelect from "@/components/refund-select";
import RebateSelect from "@/components/rebate-select";
export default {
  name: "editDomain",
  components: {
    Icons,
    RefundSelect,
    RebateSelect
  },
  data() {
    return {
      levelList:"",
      openLevelList:[],
      domainSumList:[],
      selectDisabled: false,
      rebate: [],
      refund: {},
      formKey: {
          domain_description:'',
          group_id:'',
          domain_certificate:"",
          userName:"",
          agent_type:"",
          is_agency:"",
          domain:"",
          checkDomain:"",
          is_fast:"",
          level_label:"",
          invite_code:"",
          register_level:'',
      },
      rules: {
        domain: [
          {
            required: true,
            message: "请输入网址",
            trigger: "blur"
          }
        ],
        group_id:[{required: true, message: "请选择域名分组", trigger: "change" }],
        domain_description:[
            {
              required:true,
              message:"请输入域名描述",
              trigger:"blur"
            }
        ],
        invite_code: [
          { pattern: /^[a-zA-Z0-9]{8}$/, message: '请输入正确的推广码', trigger: 'change'}
        ]
      }
      // editable: this.$root.checkCommission()
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let data = {
        siteId: vm.$root.nowSite.id,
        id: vm.$route.query.id
      };
      vm.getData(data);
      vm.selectDisabled = vm.$root.modeName() == 'no' ? false : true
    });
  },
  mounted() {
    this.$Message.config({
      top: 50,
      duration: 1
    });
    let params={
				siteId:this.$root.nowSite.id,
				show_count:'yes',
			}
    this.getGroupList(params);
    let data={
				siteId:this.$root.nowSite.id,
				 purpose: "list"
			}
			this.getOpenLevel(data);
  },
  methods: {
    registerChange(val){
      this.formKey.register_level=val;

    },
    levelChange(val){
      // console.log(val)
      this.levelList = val.join(',');

    },
    // 获取开放等级
			getOpenLevel(data){
				getMemberLevelData(data).then(res=>{
					if(res!=undefined && res.code == 200){
						this.openLevelList = res.data;
					}
				})
			},
    getGroupList(params){
				domainGroupList(params).then(res=>{
					  if(res!=undefined&&res.code==200){
						let arr=[];
                      res.data.forEach(t=>{
                         arr.push(t.group_id) 
                      })
                     this.domainSumList=arr;
					  }
				})
			},
    submit() {
      this.$root.startEditLoading();
      if (!this.formKey.rebate) {
        this.formKey.rebate = this.$refs.rebateSelect.createData();
      }
      // if (!this.formKey.rebate && !this.editable) this.formKey.rebate = this.$refs.rebateSelect.createParentData()
      if (!this.formKey.platform) {
        this.formKey.platform = this.$refs.refundSelect.createData();
      }
      this.formKey.level_label = this.levelList;
      //console.log(this.$route.query.stage )
      if (this.$route.query.stage == "domain") {
        this.$refs.formKey.validate(valid => {
          if (valid) {
            let {
              id,
              is_agency,
              status,
              admin_status,
              domain,
              rebate,
              platform,
              checkDomain,
              is_fast,
              domain_description,
              register_level,
              group_id,
              level_label,
              domain_certificate,
              invite_code
            } = this.formKey;
            let data = {
              siteId: this.$root.nowSite.id,
              id,
              is_agency,
              status,
              admin_status,
              domain,
              rebate,
              platform,
              is_fast:is_fast ? 'yes' : 'no',
              checkDomain: checkDomain ? "yes" : "no",
              domain_description,
              register_level,
              group_id,
              level_label,
              domain_certificate,
              invite_code
            };
            if(data.level_label == "") delete data.level_label;
            if(domain_certificate==""){
              this.$Tip.success({content:"请选择是否证书"})
              return false
            }
            // if(!data.register_level){
            //     this.$Tip.success({content:"注册层级必填"})
            //     return false

            // }
            delete this.formKey.agent_type;
            delete this.formKey.userName;
            agencyDomainUpdate(data, true).then(res => {
              if (res == undefined) return false;
              if (res != undefined && res.code == 200) {
                this.$root.endEditLoading();
                this.$Message.success("更新成功");
                this.goDomainList();
              }
            });
          }
        });
      } else {
        let { id, siteId, status, admin_status, rebate, platform, code, activity_url } = this.formKey
        let data = { id, siteId, status, admin_status, rebate, platform, activity_url }
        agencyInviteCodeUpdate(data, true).then(res => {
          if (res != undefined && res.code == 200) {

            this.$root.endEditLoading();
            this.$Message.success('修改成功')
            this.$router.push({ name: 'agencyInviteCode'})
          }
        })
      }
    },
    onRebateChange(res) {
   
      this.formKey.rebate = res;
    },
    onRefundChange(res) {
      this.formKey.platform = res;
    },
    //格式化数据
    getRebateData(rebate, platform) {
     
      this.rebate = rebate;
      this.rebate.forEach(item => {
					item.rebate = Number(item.rebate).toFixed(2);
				});
      // 给refund添加父级返水属性
      for (let i in platform) {
        platform[i].list.forEach(item => {
          item.name_cn = item.name;
          item.name_en = item.key;
          item.parent_refund = Number(item.parent_refund);
        });
      }
      this.refund = platform;
    },
    // 修改后跳回域名列表
    goDomainList() {
      this.$router.push({
        name: "agencyDomain"
      });
    },
    getData(data) {
      if (this.$route.query.stage == "domain") {
        agencyDomainDetails(data).then(res => {
          let {
            userName,
            domain,
            rebate,
            platform,
            agent_type,
            id,
            is_agency,
            status,
            admin_status,
            is_fast,
            checkDomain,
            domain_certificate,
            domain_description,
            group_id,
            levelLabel,
            register_level,
            invite_code
          } = res.data;
         let level_label = [];
         for(let key in res.data.levelLabel){
           if(res.data.levelLabel[key] != ',') level_label.push(res.data.levelLabel[key]*1);
         }
          // this.formData.userName = userName
          let level = agent_type - 1;
          this.formKey = {
            userName,
            domain,
            agent_type,
            id,
            is_agency: String(is_agency),
            status,
            admin_status,
            domain_description,
            group_id,
            level_label,
            domain_certificate,
            invite_code,
            register_level
          };
          
          this.formKey.checkDomain = checkDomain == "yes" ? true : false;
          this.formKey.is_fast = is_fast == 'yes' ? true :false;
          this.formKey.agent_type = level > 0 ? `${level}级代理` : "大股东";
          if ((this.$root.modeName() == 'mode_a') || (this.$root.modeName() == 'mode_b' && this.$route.query.type == '大股东')) this.formKey.is_agency = '1'
          if (this.$root.modeName() == 'mode_b' && this.$route.query.type == '代理') this.formKey.is_agency = '0'
          this.getRebateData(rebate, platform);
        });
      } else {
        agencyInviteCodeDetail(data).then(res => {
          let { userName, agencyCode, platform, rebate, status, admin_status, id, is_agency, activity_url,register_level} = res.data;
          console.log(register_level)
          let level_label = res.data.levelLabel&&res.data.levelLabel.split(',');
          this.formKey = {register_level:register_level&&register_level.split(','), userName, code: agencyCode, siteId: this.$root.nowSite.id, id, status, admin_status, is_agency: is_agency == 0 ? '会员' : '代理会员', activity_url };

          this.getRebateData(rebate, platform);
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/button.less";
// .w260x {
//   width: 260px;
//   height: 36px;
// }
/deep/.ivu-form-item-error-tip {
  left: 260px;
  top:5px;
}

</style>


