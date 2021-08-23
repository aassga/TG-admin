<template>
    <div class="clearfix">
       <div class="fl">
           <p class="iconColor ft14">*温馨提示：活动开关用于控制转盘活动浮窗的显示。</p>
       </div>
       <div class="fr">
           <Form inline>
               <FormItem>
                    <Switch v-model="isOpen" size="large" :disabled="disabled">
                        <span slot="open">开启</span>
                        <span slot="close">停用</span>
                    </Switch>
               </FormItem>
                <FormItem>
                    <Button v-show="!isEdit" type="primary" class="bj-btn" @click.prevent="onEdit">编辑</Button>
                    <div v-show="isEdit" class="fr">
                        <Button type="primary" class="bj-btn" @click.prevent="save" :loading="$root.tableLoading">保存</Button>
                    </div>
                    <div v-show="isEdit" class="fr mr20">
                        <Button type="primary" class="bj-btn" @click.prevent="cancel" :loading="$root.tableLoading">取消</Button>
                    </div>
                </FormItem>
           </Form>
       </div>
    </div>
</template>

<script>
import Tables from '_c/tables';
import {getActiveChessTaskDateAndSwitch} from '@/api/activity';
import { getActiveChessTaskVipList} from '@/api/activity';
export default {
    props:['open'],
    data() {
        return {
            isOpen:false,
            disabled:true,
            isEdit:false
        }
    },
    mounted() {
        let data = {active_type: 'zhuanpan',siteId:this.$root.nowSite.id};
        this.getData(data);
    },
    methods: {
      getData(data){
          this.$root.startTableLoading();
          getActiveChessTaskVipList(data).then(res=>{
              if(res!=undefined && res.code == 200){
                  this.isOpen = res.data.activeChessTaskDateAndSwitch == 'open'?true:false;
                  this.$root.endTableLoading();
              }
          }).catch(error=>this.$root.endTableLoading())
      },
        onEdit(){
            this.isEdit = !this.isEdit;
            this.disabled = false;
        },
        save(){
            let status = this.isOpen?'open':'off';
            let data={
                siteId:this.$root.nowSite.id,
                active_type:'zhuanpan',
                status:status,
            }
            this.$root.startTableLoading();
            getActiveChessTaskDateAndSwitch(data).then(res=>{
            if(res!=undefined && res.code == 200){
                this.isEdit = false;
                this.disabled = true;
                this.$root.endTableLoading();
            }
        }).catch(error=>his.$root.endTableLoading())
        },
        cancel(){
            this.$root.startTableLoading();
            this.isEdit = false;
            this.disabled = true;
            let data = {active_type: 'zhuanpan',siteId:this.$root.nowSite.id};
            this.getData(data);
        }
    },
}
</script>

<style lang="less" scoped>
    .bj-btn {
    width: 80px;
    height: 36px;
    line-height: 36px;
}
</style>