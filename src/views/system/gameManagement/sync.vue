<template>
  <div class="v2-search">
      <Row v-if='spinShow' style="height:100px">
        <Spin size="large" fix v-if="spinShow">
          <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
            <div v-for="t in 8" :key="'div'+t"></div>
          </div>
        </Spin>
      </Row>
   
   <Row class="w100" v-if='!spinShow'>
     <P class="ft16 pl10 pb10" >请选择同步内容</p>
     <div class="divBox mb10" v-for='item in data' :key='item.id'>
       <div class='bg'><Checkbox class="checkbox ft16 pl10" v-model="item.checked" @on-change='onChange($event,item)'>{{item.name}}</Checkbox></div>
       <ul v-if="item.id==4||item.id==7" class="pl20 w100 ul1">
         <li class="fl lh36" v-if="t.name!='彩票侧边栏'&&t.name!='侧边栏版式'" v-for="t in item.list" :key='t.id'>
           <Checkbox v-model="t.checked" @on-change='textContent'>{{t.name}}</Checkbox>
         </li>
         <li style="width:100%;clear: both !important" v-if="t.name=='彩票侧边栏'" v-for="t in item.list" :key='t.id'>
           <div>
             <p class="lh36">{{t.name}}</p>
             <ul class="w100 ul2">
              <li v-for='m in t.list' class="fl" :key='m.id'><Checkbox v-model="m.checked" @on-change='textContent'>{{m.name}}</Checkbox></li>
            </ul>
           </div>
         </li>
       </ul>
       <ul v-else  class="pl20 w100 ul2">
         <li class="lh36 pl5 pr5" v-for="t in item.list" :key='t.id'>
           <div>
             {{t.name}}
             <ul class="w100 ul3">
              <li v-for='m in t.list' class="fl" :key='m.id'><Checkbox v-model="m.checked" @on-change='textContent'>{{m.name}}</Checkbox></li>
            </ul>
           </div>
         </li>
       </ul>
     </div>
     <div  class="txt-a w100 h20" style="color:red"><span v-show="nocontent">请选择同步内容</span></div>
     <div class="divBox">
       <div class="bg"><Checkbox class="checkbox ft16 pl10" v-model="checkAll" @on-change='changeSite'>全部</Checkbox></div>
       <ul class="pl20">
         <li class="fl lh36 w200x" v-for="t in accessSite.filter(m=>m.id!=siteId)" :key='t.id'>
           <Checkbox v-model="t.checked" @on-change=textSite>{{t.siteName}}</Checkbox>
         </li>
       </ul>
     </div>
     <div class="w100 mt10 txt-a">
        <div class="txt-a w100 h20" style="color:red;"><span  v-show="noSite">请选择同步站点</span></div>
        <Button type="primary" :loading='load' class="ivu-btn submit h50" @click="submit">确认同步</Button>
      </div>
   </Row>
  </div>
</template>
<script>
import { GameSortV4List,SynchronousGameSortV4Data} from "@/api/system";
import Tables from "@/components/tables";
import { getUserType } from "@/libs/util";
import { Row } from "view-design";
import Icons from "_c/icons";
import { mapState } from 'vuex';
export default {
  name: "sortType",
  components: { Tables, Icons },
  computed:{
        ...mapState({
        accessSite: state => state.user.accessSite,
    }),
  },
  data() {
    return {
      data:[],
      checkList:[],
      spinShow:false,
      checkType:[],
      checkAll:false,
      load:false,
      nocontent:false,
      noSite:false,
      siteId:this.$root.nowSite.id
    };
  },
  mounted() {
    this.getData();
    this.accessSite.forEach(t=>t.checked=false)
  },
  methods: {
    changeSite(val) {
      if(val) {
        this.accessSite.forEach(t=>{
          t.checked =true
        })
      }else{
        this.accessSite.forEach(t=>{
          t.checked =false
        })
      }
      this.textSite()
    },
    textSite(){
      let arr=[];
      this.accessSite.forEach(t=>{
          if(t.checked) {
            arr.push(t.id)
          }
        })
      if(!arr.length) {
        this.noSite = true
      }else{this.noSite=false}
    },
      onChange(val,data){
        if(data.id==1||data.id==2||data.id==3){  //棋牌捕鱼电子
          if(val) { 
            data.list.forEach(t => {
              t.list.forEach(m=>{
                m.checked=true
              })
            });
          }else {
            data.list.forEach(t => {
              t.list.forEach(m=>{
                m.checked=false
              })
            });
          }
          this.$forceUpdate()
        }else{ //彩票 手机端
          if(val) { 
            data.list.forEach(t => {
              if(t.name!='彩票侧边栏'&&t.name!='侧边栏版式')  t.checked = true;
              if(t.name == '彩票侧边栏') {
                t.list.forEach(m=>m.checked = true)
              }
            });
          }else {
            data.list.forEach(t => {
              t.checked= false
              if(t.name=='彩票侧边栏') {
                t.list.forEach(m=>{
                  m.checked = false
                })
              }
            });
          }
        }
        this.textContent()
      },
      textContent(){
        let arr=[]
        this.data.forEach(item=>{
          item.list.forEach(t=>{
            if(t.checked) {
              arr.push(t.id)
            };
            t.list.forEach(m=>{
              if(m.checked) arr.push(m.id)
            })
          })
        })
        if(!arr.length) {
          this.nocontent = true;
        }else{
          this.nocontent = false
        }
      },
      getData(){
          let data={
              siteId:this.$root.nowSite.id
          }
        this.spinShow = true;
        GameSortV4List(data).then(res=>{
           if(res&&res.code==200) {
               this.data=[]
               for(let key in res.data.siteData){
                   if(key!=5&&key!=6){
                       if(key!=4) { 
                         res.data.siteData[key].sort=key
                       }else{
                         res.data.siteData[key].sort=0
                       }
                       this.data.push(res.data.siteData[key]);
                       
                       console.log(data)
                   }
               }
               this.data.sort((a,b)=>{
                         return a.sort-b.sort
                       })
               this.spinShow = false;
           }else {
             this.spinShow = false;
           }
       }).catch(error=>{
          this.spinShow = false;
        })
      },
      submit(){
        let gId =[];
        let toSiteIds =[];
        this.accessSite.forEach(t=>{
          if(t.checked) {
            toSiteIds.push(t.id)
          }
        })
        this.data.forEach(item=>{
          item.list.forEach(t=>{
            if(t.checked) {
              gId.push(t.id)
            };
            t.list.forEach(m=>{
              if(m.checked) gId.push(m.id)
            })
          })
        })
        let data = {
          fromSiteIds:this.$root.nowSite.id,
          toSiteIds:toSiteIds.toString(),
          gIds:gId.toString()
        }
        if(!gId.length) {
          this.nocontent = true
        }else{ this.nocontent=false}
        if(!toSiteIds.length) {
          this.noSite = true
        }else{ this.noSite=false}
        if(this.nocontent||this.noSite) return
        this.load = true
        SynchronousGameSortV4Data(data,true).then(res=>{
          if(res&&res.code==200){
            this.$Message.success('数据同步成功')
            this.load=false
          }else{
            this.load = false
          }
        }).catch(error=>this.load=false)
      }
      
        
  }
};
</script>

<style lang="less" scoped>
@import "../../../styles/button.less";
@import '../../../styles/class.less';
ul {
  overflow: hidden;
  li {
    padding: 5px 15px 5px 0 !important;
  }
}
.ul1 li {
  width: 200px;
}
.ul2 li {
  width: 100%;
}
.ul3 li {
  width: 200px !important;
}
.divBox {
  .bg {
    width: 100%;
    background: rgb(224, 223, 223);
  }
  .checkbox {
    height: 42px;
    line-height: 42px;
  }
}
</style>