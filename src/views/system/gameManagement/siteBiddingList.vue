<template>
  <div class="siteBiddingList"> 
    <Row class="v2-search">
      <Select v-model="formKey.classification" @on-change='modelChange' class="w120x mr20 txt-a" label="5">
        <Option :value="t.key" v-for='t in model' :key='t.key'>{{t.name}}</Option>
      </Select>
      <span>
        <Tag class="pl20 pr20 ib ft14 w135x cs tag"
          v-for="(item,i) in Nav"
          :key='i'
          :disabled="spinShow"
          @click.native="getCurrentList(item.id)"
          :class="formKey.type == item.id ? 'active' : ''">
          {{item.name}}
        </Tag>
      </span>
      <Input class="w120x ml20" v-model="userGame" placeholder="搜索关键字" />
      <div class="v2-button fr">
        <Button v-if="!isEdit" type="primary" style="height:36px" :loading='loading||spinShow' @click="()=>isEdit=true">编辑</Button>
        <Button v-if="isEdit&&formKey.type==10004" type="primary" style="height:36px" :loading='loading' @click="editPlatform">编辑棋牌平台</Button>
        <Button v-if="isEdit" class="mr20" style="height:36px" :loading="loading" @click="getData({...formKey})">取消</Button>
        <Button v-if="isEdit" type="primary" style="height:36px" :loading="loading" @click.native="submit()">保存</Button>
      </div>
    </Row>
    <Row v-if='spinShow' style="height:300px">
      <Spin size="large" fix v-if="spinShow">
        <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
          <div v-for="t in 8" :key="'div'+t"></div>
        </div>
      </Spin>
    </Row>
    <div v-else>
      <!-- 热门/捕鱼 -->
      <draggable 
        class="dataBox b mb20 pl20"
        v-if='formKey.type!=10004&&userGame.length'
        element="div"
        :options="{filter: '.disabled',disabled:!isEdit,fallbackClass:true,animation: 150,ghostClass: 'opacity:1'}"
        :group="{ name: 'people', pull: 'clone', put: false }"
        @start="start($event,dataList.filter(item=>item.name.includes(userGame)),'search')"
        :sort='false'
        :class="screen<=1690?'zoom125 lh50':'lh62'"
        @moved="true"
        :list="dataList.filter(item=>item.name.includes(userGame))"
      >
        <Button class="gameButtom w120x mr20 h36x" v-for='t in dataList.filter(item=>item.name.includes(userGame))' :key='t.id'>
          {{t.name}}
          <Icon
            class="close"
            v-if="isEdit"
            @click.stop="remove(dataList,t.id)"
            type="md-close"
          />
        </Button>
        <span class="w100 db txt-a" v-if='!dataList.filter(item=>item.name.includes(userGame)).length'>未搜索到相关游戏</span>
      </draggable>
      <draggable
        class="dataBox b mb20  pl20"
        v-if='formKey.type!=10004'
        element="div"
        @add='add'
        :options="{filter:'.disabled',disabled:!isEdit, fallbackClass:true,group:'people',animation: 150,ghostClass: 'opacity:1'}"
        :class="screen<=1690?'zoom125 lh50':'lh62'"
        @moved="true"
        :list="copyDataList"
        @end='end'
      >
        <Button class="gameButtom w120x mr20 h36x" v-for='t in dataList' :key='t.id'>
          {{t.name}}
          <Icon
            class="close"
            v-if="isEdit"
            @click.stop="remove(dataList,t.id)"
            type="md-close"
          />
        </Button>
        <!-- <span v-if='!dataList.length'>暂无数据</span> -->
      </draggable>
      <!-- 棋牌 -->
      <Row v-if='formKey.type==10004&&dataList.class.length'>
        <div class="mb20">
          <Button 
            class="gameButtom w120x mr20 h36x" 
            @click="getGameList(t.id)" 
            v-for='t in dataList.class' 
            :class="c3Key==t.id?'activePlatform':''" 
            :key='t.id'>{{t.name}}</Button>
        </div>
        <draggable 
          class="dataBox b mb20 lh62 pl20"
          v-if='formKey.type==10004&&userGame.length'
          element="div"
          :options="{filter:'.disabled',disabled:!isEdit, fallbackClass:true,group:'people',animation: 150,ghostClass: 'opacity:1'}"
          :class="screen<=1690?'zoom125':''"
          @moved="true"
          @start="start($event,dataList.list[c3Key].filter(item=>item.name.includes(userGame)),'search')"
          :list="dataList.list[c3Key].filter(item=>item.name.includes(userGame))"
        >
          <Button class="gameButtom w120x mr20 h36x" v-for='t in dataList.list[c3Key].filter(item=>item.name.includes(userGame))' :key='t.id'>
            {{t.name}}
            <Icon
              class="close"
              v-if="isEdit"
              @click.stop="remove(dataList.list[c3Key],t.id)"
              type="md-close"
            />
          </Button>
          <!-- <span v-if='!dataList.list[c3Key].length'>暂无数据</span> -->
        </draggable>
        <draggable 
          class="dataBox b mb20 lh62 pl20"
          v-if='formKey.type==10004'
          element="div"
          @add='add'
          @end='end'
          :options="{filter:'.disabled',disabled:!isEdit, fallbackClass:true,group:'people',animation: 150,ghostClass: 'opacity:1'}"
          :class="screen<=1690?'zoom125':''"
          @moved="true"
          :list="copyDataList.list[c3Key]"
        >
          <Button class="gameButtom w120x mr20 h36x" v-for='t in dataList.list[c3Key]' :key='t.id'>
            {{t.name}}
            <Icon
              class="close"
              v-if="isEdit"
              @click.stop="remove(dataList.list[c3Key],t.id)"
              type="md-close"
            />
          </Button>
          <!-- <span v-if='!dataList.list[c3Key].length'>暂无数据</span> -->
        </draggable>
      </Row>
      <Row v-if="formKey.type==10004&&!dataList.class.length" class="txt-a">
        <span class="txt-a pl30 pr30 ib mt100">
          <Icons type="danchuangtishi" color="red" :size="16" class="pl10"></Icons>
          暂无棋牌平台，请点击 “编辑棋牌平台” 添加
        </span>
      </Row>
      <Row v-if="(formKey.type!=10004||dataList.class.length)&&isEdit">
        <div class="Nav mb10 mt10" v-if="formKey.type=='20001'">
          <Tag class="pl20 pr20 ib ft14 w135x cs tag"
            v-for='(t,key) in c2' 
            :key='key'
            @click.native="getPlatformList(key)"
            :class="c2Key == key ? 'active1' : ''">
            {{key=='10001'?'电子':key=='10004'?'棋牌':'捕鱼'}}
          </Tag>
          <Input class="w120x ml20" v-model="gameName" placeholder="搜索关键字" />
          <span class="vb ml20">(下方游戏为配置项.,可拖动至上方游戏中)</span>
        </div>
        <div v-else class="mb10 mt10 h40x">
          <span class="ft16">{{formKey.type=='10005'?'全部捕鱼游戏':'全部棋牌游戏'}}</span>
          <Input class="ml20 w120x" placeholder="请输入关键字"/>
        </div>
        <div class="platform txt-l lh62 mb20" v-if='formKey.type!=10004'>
          <Button class="buttom w120x mr20 h36x" 
            @click.native="getGameList(t.id)" 
            :class="c3Key==t.id?'activePlatform':''" 
            v-for='t in c2[c2Key]' 
            :key='t.id'>{{t.name}}</Button>
        </div>
        <draggable 
          class="gamebox txt-l  b pl20"
          :style="screen<1690?'max-height:400px':'max-height:800px'"
          :options="{filter: '.disabled',disabled:!isEdit,fallbackClass:true,animation: 150,ghostClass: 'opacity:1'}"
          :group="{ name: 'people', pull: 'clone', put: false }"
          @start="start($event,'','')"
          :class="screen<1690?'zoom125 lh50':'lh62'"
          :sort='false'
          :list="c3[c3Key].filter(item=>item.name.includes(gameName))"
        >
          <Button 
            :class="{disabled:formKey.type!='10004'?dataList.find(game => game.id === t.id)
              :dataList.list[c3Key]?dataList.list[c3Key].find(game => game.id === t.id):false}"
            class="gameButtom w120x mr20 h36x" 
            v-for='t in c3[c3Key].filter(item=>item.name.includes(gameName))' :key='t.id'>
            {{t.name}}
          </Button>
          <!-- :class="{disabled:formKey.type!='10004'?dataList.find(game => game.id === t.id)
              :dataList.class.length?dataList.list[c3Key].find(game => game.id === t.id):false}" -->
        </draggable>
      </Row>
    </div>
    <Modals ref="addPlatform" title="编辑棋牌平台" width="900">
      <div slot="content" class="p20">
        <Row v-if='formKey.type==10004&&dataList.class'>
          <P class="ft16 mb20">我的棋牌</P>
          <draggable
            class="gamebox txt-l lh62 b pl20 mb20"
            :options="{filter:'.disabled',fallbackClass:true,group:'people',animation: 150,ghostClass: 'opacity:1'}"
            :class="screen<1690?'zoom125 lh62':'lh62'"
            @moved="true"
            :list="selectPlatform"
          >
            <Button 
              class="gameButtom w120x mr20 h36x" 
              v-for='t in selectPlatform' 
              :key='t.id'>
              {{t.name}}
              <Icon
                class="close"
                v-if="isEdit"
                @click.stop="remove(selectPlatform,t.id,'modaldel')"
                type="md-close"
              />
            </Button>
          </draggable>
          <P class="ft16 mb20">全部棋牌游戏<span class="ft12 pl10" style="color:#888">(下方为配置项.,可拖动至上方编辑框中)</span></P>
          <draggable
            class="gamebox txt-l lh62 b pl20 mb20"
            :options="{filter: '.disabled',disabled:!isEdit,fallbackClass:true,animation: 150,ghostClass: 'opacity:1'}"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :class="screen<1690?'zoom125 lh62':'lh62'"
            :sort='false'
            :list="c2[c2Key]"
          >
            <Button 
              class="gameButtom w120x mr20 h36x"
              v-for='t in c2[c2Key]' 
              :class="{disabled:selectPlatform.find(game => game.id === t.id)}"
              :key='t.id'>{{t.name}}</Button>
          </draggable>
        </Row>
        <Row class="txt-a">
          <Button type='primary' @click="modalSave" class="w260x" style="height:42px">确认保存</Button>
        </Row>
      </div>
    </Modals>
  </div>
</template>
<script>
import Icons from '_c/icons';
import Modals from '@/components/modals';
import draggable from "vuedraggable";
import {siteBiddingList,siteBiddingUp} from '@/api/system';
import { getToken } from '@/libs/util';
export default {
    name: 'siteBiddingList',
    components: {
        Icons,
        Modals,
        draggable
    },
    data() {
        return {
          type:'',
          copyDataList:[],
          dragItem:{},
          isEdit:false,
          loading:false,
          spinShow:true,
          screen:screen.width,
          selectPlatform:[],
          copyList:{},
          gameName:'',
          userGame:'',
          Nav:[
            {id:20001,name:'热门游戏'},
            {id:10005,name:'捕鱼游戏'},
            {id:10004,name:'棋牌游戏'},
          ],
          c1:[],
          dataList:[],
          c2:[],
          c3:[],
          c2Platform:[],
          c2Key:'10001',
          c3Key:'',
          qipaiKey:'',
          formKey:{
            siteId:this.$root.nowSite.id,
            classification:5,
            type:20001
          },
          model:[
            {key:5,name:'5分模式'},
            {key:10,name:'10分模式'},
            {key:15,name:'15分模式'}
          ]

        }
    },
    mounted(){
      this.getData({...this.formKey})
    },
    methods: {
      modelChange(val){
        this.getData({...this.formKey})
      },
      remove(list,id,type){
        if(type=='modaldel'){
          this.selectPlatform = list.filter(i => i.id !== id);
           delete this.copyList[id];
        }else{
          if(this.formKey.type!='10004') this.dataList = list.filter(i => i.id !== id);
          else this.dataList.list[this.c3Key] = list.filter(i => i.id !== id);
        }
        this.copyDataList=JSON.parse(JSON.stringify(this.dataList))
      },
      getCurrentList(val){
        this.formKey.type=val;
        if(val!='20001') {
          this.c2Key=val;
          this.c3Key=this.c2[this.c2Key][0].id
        }
        this.getData({...this.formKey})
        this.isEdit = false;
      },
      getData(data){
        this.spinShow = true;
        siteBiddingList(data).then(res=>{
          if(res&&res.code==200){
            const {c1, c2, c3}=res.data.BasicData;
            this.c1 = c1;
            this.c2 = c2;
            this.c3 = c3;
            this.dataList = res.data.list;
            if(this.formKey.type==10004&&!Object.keys(this.dataList).length) {
              this.dataList ={
                class:[],
                list:{}
              }
            }
            if(this.formKey.type=='20001') this.c2Key='10001';
            this.c3Key = this.formKey.type == 10004?this.dataList.class[0].id: this.c2[this.c2Key][0].id;
            this.spinShow = false;
            this.isEdit = false;
            this.copyDataList=JSON.parse(JSON.stringify(this.dataList)) 
          }else{
            this.spinShow=false;
            this.isEdit = false;
          }
        }).catch(error=>this.spinShow=false,this.isEdit = false)
      },
      getPlatformList(val){
        this.c2Key = val;
        this.c3Key = this.c2[val][0].id;
      },
      getGameList(val){
        this.c3Key = val;
        this.$forceUpdate();
      },
      editPlatform(){
        this.selectPlatform = JSON.parse(JSON.stringify(this.dataList.class));
        this.copyList = JSON.parse(JSON.stringify(this.dataList.list));
        this.$refs.addPlatform.show();
      },
      modalSave(){
        this.dataList.class = this.selectPlatform;
        this.dataList.class.map(t=>{
          if(!this.copyList[t.id]) this.copyList[t.id]=[];
        });
        this.dataList.list = this.copyList;
        this.submit();
        this.$refs.addPlatform.hide();
      },
      submit(){
        let data={...this.formKey};
        data.json=JSON.stringify(this.dataList)
        this.loading = true;
        siteBiddingUp(data,true).then(res=>{
          if(res&&res.code==200){
            this.$Message.success('保存成功');
            this.loading = false;
            this.isEdit= false;
            this.getData({...this.formKey});
            this.userGame='';
            this.gameName='';
          }else{this.loading = false;this.isEdit=false}
        }).catch(error=>this.loading=false,this.isEdit=false);
      },
      start($event,list,type){
        this.type=type;
        if(type=='search'){
          this.dragItem=list[$event.oldIndex];
        }
        this.copyDataList = JSON.parse(JSON.stringify(this.dataList));
      },
      add($event){
        if(this.type=='search'&&this.formKey.type!='10004'){
          this.copyDataList.map((item,i)=>{
            if(item.id==this.dragItem.id&&i!=$event.newIndex){
              this.copyDataList.splice(i,1);
              this.dragItem={};
            }
          })
        };
        if(this.type=='search'&&this.formKey.type=='10004'){
          this.copyDataList.list[this.c3Key].map((item,i)=>{
            if(item.id==this.dragItem.id&&i!=$event.newIndex){
              this.copyDataList.list[this.c3Key].splice(i,1);
              this.dragItem={};
            }
          })
        }
        this.dataList = JSON.parse(JSON.stringify(this.copyDataList))
        this.$forceUpdate();
      },
      end(){
        console.log(111)
        this.dataList=JSON.parse(JSON.stringify(this.copyDataList))
      }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
@import '../../../styles/class.less';
  .lh62{
    min-height: 62px !important;
  }
  .gameButtom{
    position: relative;
    background: white !important;
    /deep/span{
      width: 92px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow:ellipsis;
    }
  }
  .close:hover {
    color:red;
    border:1px solid red;
  }
  .close {
    position: absolute !important;
    top: -10px;
    right: -10px;
    color: #ccc;
    text-align: center;
    line-height: 18px;
    width: 20px;
    height: 20px;
    background: white;
    box-sizing: border-box;
    border:1px solid #dcdcdc;
    border-radius: 50%;
    z-index: 100
  }
.siteBiddingList{
  .active {
    background: white !important;
    box-sizing: border-box;
    border-top: 3px solid #2d8cf0;
    line-height: 33px !important;
    /deep/.ivu-tag-text{
      color:#2d8cf0 !important;
    }
  }
  .vb {
    vertical-align: bottom;
    color:#888;
  }
  .dataBox {
    min-height: 60px;
    line-height: 60px;
  }
  .active1{
    border:1px solid #2d8cf0;
  }
  .activePlatform {
    border:1px solid #2d8cf0;
  }
  .gamebox {
    background: #f6f6f8;
    overflow: auto;
  }
 
}
  
 .zoom125{
    zoom:1.25;
    .gameButtom{
      width: 100px;
      height: 30px;
      line-height: 28px;
      padding: 0;
      /deep/span{
        width: 80px;
        line-height: 19px;
        vertical-align: middle;
        font-size: 0.725rem !important;
      }
    }
  }
  .lh50 {
    line-height: 46px;
    min-height: 46px;
  }

</style>

