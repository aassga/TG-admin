<template>
    <div>
    <Modals ref="editSiteModals" title="编辑管理站点" width="1140" height="600">
        <div slot="content">
            <div class="top ml35 ib ">
                <Input v-model="searchWord"   placeholder="关键字查询" class="w415x" @input="search($event,'edit')" >
                    <Icon type="ios-search" slot="prefix" />
                </Input>
            </div>
            <div  style="height:480px;overflow-y: auto;">
              <div v-for="(item, key, index) in allSiteListNew" v-if="item.siteCount&&item.siteCount>0"  :key="index" class="pl35"> 
                <div class="ft16 mt10 " >
                 <span class="ib" >
                <checkbox  class="ft16"  :indeterminate="item.indeterminate" @on-change="val => checkAll(item,val)" v-model="item.checked">{{ item.name == 'yunbo' ? '云博' : item.name == 'lottery' ? '彩票' : '包网' }}</checkbox>
                </span>
                <p class="pl5 ib" >(站点{{ item.siteCount}})</p>
               </div>
               <ul class="clearfix ft14" >
                <li  v-for="(t,i) in item.list" :key="i" class="fl pl10   box">
                    <checkbox  :disabled="t.allow_chk=='no'" @on-change="val =>checkOne(item,t,val)" v-model="t.checked" >  {{t.siteName}}</checkbox>
                </li>
                </ul> 
              </div>
            </div>
          <Button type="primary" :loading="$root.editBtnLoading"  @click="save" class="mb20 ivu commonSubmit w260x" style="margin-left:38%">确认保存</Button>
            </div>
          
      
    </Modals>
    <Modals ref="detialSiteModals" title="管理站点详情" width="1140"  height="600">
        <div slot="content">
            <div class="top ml35 ib ">
                <Input v-model="searchWord"   placeholder="关键字查询" class="w300x" @input="search($event,'detial')"   >
                <Icon type="ios-search" slot="prefix" />
                </Input>
            </div>
            <div style="height:480px;overflow-y: auto;">
              <div v-if="f.siteCount&&f.siteCount>0"  v-for="(f, key, index) in this.detialData"  :key="index" class="pl35 mb40"> 
                <div class="ft16 mt10" >
                <span  v-if="f.name" class="ib ">
                <span >{{ f.name == 'yunbo' ? '云博' : f.name == 'lottery' ? '彩票' : '包网' }}</span>
                </span>
                <p class="pl5 ib"  >(站点{{ f.siteCount}})</p>
               </div>
               <ul class="clearfix  mb10 ft14" >
                <li  v-for="(n,i) in f.list" :key="i" class="fl pl10  box">
                    <span >  {{n.siteName}}</span>
                </li>
                </ul> 
               </div>
           </div>
            </div>
        </Modals>
    </div>
          
    
</div>
</template>
<script>
import {customSiteItems} from "@/api/common";
import Modals from "_c/modals";
    export default{
        components:{
            Modals

        },
        props:["accessSite","site","newSiteId","editId"],
        data(){
            return{
            detialData:[],
            idDetial:[],
            disabled:true,
            ids:[],
            newData:[],
            searchData:[],
            indeterminate:false,
            searchWord: '', //搜索关键字
            loading:false,
            allSiteListNew:[],
            allSiteList: {
                yunbo: [],
                lottery: [],
                cover_network: []
            }, //所有站点,
            detailNew:{
                yunbo: [],
                lottery: [],
                cover_network: []
            },
            siteCount: {
                yunbo: null,
                lottery: null,
                cover_network: null,
                custom_site: null
            }, //站点数量
            }
        },
        methods:{
            save(){
               if(this.editId){//编辑
                this.allSiteListNew.forEach(t=>{
                        t.list.forEach(m=>{
                           if(m.checked==true&&m.allow_chk=='yes'){
                             this.ids.push(m)
                           }
                        })
      
                })
                this.idDetial=[];
                this.detailNew.yunbo = [];
                this.detailNew.lottery = [];
                this.detailNew.cover_network = [];
                for(let key in this.detailNew){       
                        this.allSiteListNew.forEach(t=>{
                          t.list.forEach(m=>{
                              this.ids.forEach(k=>{
                                  if(k.id==m.id&&k.allow_chk=='yes'){
                                      if(key==m.site_class){
                                        this.detailNew[key].push(m)
                                      }
                                    
                                  }
                              })

                          })
                      })
                }

                for (let key in this.detailNew){
                    let e={};
                    e.name=key;
                    e.list=this.detailNew[key].filter((x, index,self)=>self.indexOf(x)===index)
                    e.siteCount=this.detailNew[key].length;
                    this.idDetial.push(e);
                }
                    //   this.$forceUpdate();

               }else{
                   this.allSiteListNew.forEach(t=>{
                       t.list.forEach(m=>{
                           if(m.checked==true){
                               this.ids.push(m)
                           }
                       })
                   })
               }
                this.$refs.editSiteModals.hide();
                this.ids = this.ids.filter((x, index,self)=>self.indexOf(x)===index);
                // console.log(this.ids)
                this.$emit('onSiteChange',this.ids,'selectSave');

                this.allSiteListNew.forEach(t=>{
                    t.list.forEach(m=>{
                        if(m.checked==true){
                        this.$set(m, 'checked', false); 
                        }
                    })
                })
                //管理站点详情
                           
                this.allSiteListNew=[];
                this.allSiteList.yunbo = [];
                this.allSiteList.lottery = [];
                this.allSiteList.cover_network = [];
            },
            checkAll(parent,val){
              
                this.$set(parent, 'indeterminate', false);
                this.$set(parent, 'checked', val);
                parent.list.forEach(m => {
                    //编辑的时候默认，假如
                    if(m.allow_chk){
                        if(m.allow_chk=='yes'){
                        this.$set(m, 'checked', val);
                    }
                    }else{
                        this.$set(m, 'checked', val);
                    }
                   
             
            });
          
            },
            checkOne(parent,t,val){
                this.$set(t, 'checked', val);
                let count = 0;
                parent.list.forEach(m => {
                if(m.checked)count++;
                });
                if(count){
                    if(count<parent.list.length){
                        this.$set(parent, 'checked', false);
                    this.$set(parent, 'indeterminate', true);

                    }else{
                        this.$set(parent, 'checked', true);
                    this.$set(parent, 'indeterminate', false);
                    }

                }else{
                    this.$set(parent, 'checked', false);
                this.$set(parent, 'indeterminate', false);  
                }


            },
            search(event,type){
                // console.log(event)
                // console.log(type)
                let search = event;
                // console.log(type)
                if(type=='edit'){
                if(search){
                    let m=[]
                    this.allSiteListNew.forEach(t=>{
                        let v={};
                        // console.log(t.list)
                        this.searchData =t.list.filter(function(product) {  // 每一项数据
                            // console.log(product)
                        return Object.keys(product).some(function(key) {  // 每一项数据的参数名
                            // console.log(key)
                            // console.log(product[key])
                        return (
                            String(product[key])// toLowerCase() 方法用于把字符串转换为小写。
                            .toLowerCase()// indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
                            .indexOf(search) > -1
                        );
                        });
                        });
                      v.name=t.name;
                      v.list=this.searchData;
                      v.siteCount=v.list.length;
                      m.push(v)
                    })
                    // console.log(m)
                    this.allSiteListNew=m;
                    // this.$forceUpdate();
                }else{
                    // console.log(this.newData)
                    this.allSiteList.yunbo = [];
                    this.allSiteList.lottery = [];
                    this.allSiteList.cover_network = [];
                    this.allSiteListNew=this.newData.filter((x,index,self)=>self.indexOf(x)===index);
                    
                }
               
                }
                if(type=='detial'){
                    if(search){
                        let m=[]
                        this.detialData.forEach(t=>{
                            let v={};
                            this.searchData =t.list.filter(function(product) {  
                            // 每一项数据
                            return Object.keys(product).some(function(key) {
                            // 每一项数据的参数名
                            return (
                                String(product[key])
                                // toLowerCase() 方法用于把字符串转换为小写。
                                .toLowerCase()
                                // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
                                .indexOf(search) > -1
                            );
                            });
                            });
                        v.name=t.name;
                        v.list=this.searchData;
                        v.siteCount=v.list.length;
                        m.push(v)
                        })
                        this.detialData=m;
                    }else{
                        this.detialData=this.idDetial.filter((x,index,self)=>self.indexOf(x)===index);
                        this.detailNew.yunbo = [];
                        this.detailNew.lottery = [];
                        this.detailNew.cover_network = [];
                    }
                    this.$forceUpdate();
                }
           
            },
            show(type,siteId){//管理站点弹框
                this.allSiteListNew=[];
                this.newData=[];
                this.searchWord='';
                this.allSiteList.yunbo = [];
                this.allSiteList.lottery = [];
                this.allSiteList.cover_network = [];
              this.getData(type,siteId);
               this.$refs.editSiteModals.show();
            },
            showDetial(type,siteId){//管理站点详情
                this.searchWord='';
                this.idDetial=[];
                this.detailNew.yunbo = [];
                this.detailNew.lottery = [];
                this.detailNew.cover_network = [];
                this.getData(type,siteId);
                this.$refs.detialSiteModals.show();
            },
            getData(type,siteId ){
                // console.log(siteId)
                if(type=='detial'){
                        for (let key in this.allSiteList){
                                this.site.forEach(item=>{
                                if(this.site) {
                                    siteId.forEach(m=>{if(m==item.id){ item.checked=true;}})
                                    if(key==item.site_class){
                                  this.allSiteList[key].push(item);
                                }
                                }     
                            })
                        }

                      for (let key in this.allSiteList ){
                          let e={};
                          e.name=key;
                          e.list=this.allSiteList[key].filter((x, index,self)=>self.indexOf(x)===index) 
                          e.siteCount=this.allSiteList[key].length;
                          this.allSiteListNew.push(e);
                      }
                     
                      for(let key in this.detailNew){    
                        this.allSiteListNew.forEach(t=>{
                          t.list.forEach(m=>{
                              if(siteId.length!=0){ 
                               let c=this.newSiteId.concat(siteId)//接口返回的应该展示id,加上保存的
                                c.forEach(k=>{
                                      if(k==m.id){
                                          if(key==m.site_class){
                                            this.detailNew[key].push(m)
                                          } 
                                      }
                                  })

                              }else{

                                  this.newSiteId.forEach(k=>{
                                      if(k==m.id){
                                          if(key==m.site_class){
                                            this.detailNew[key].push(m)
                                          } 
                                      }
                                  })
                              }
                          })
                        })
                      }
                   
                      for (let key in this.detailNew){
                          let e={};
                          e.name=key;
                          e.list=this.detailNew[key].filter((x, index,self)=>self.indexOf(x)===index)
                          e.siteCount=e.list.length;
                          this.idDetial.push(e)
                      }
                      this.detialData=this.idDetial;
                }

                if(type=='edit'){//编辑
                      for (let key in this.allSiteList){
                                this.site.forEach(item=>{
                                    // console.log(siteId)
                                if(siteId&&siteId.length>0){//确认之后保存的
                                    // console.log(this.newSiteId)
                                    siteId.forEach(m=>{
                                       if(m==item.id){  
                                           item.checked=true;
                                       }
                                    })
                                    if(item.allow_chk=='no')item.checked=true;
                                    if(key==item.site_class){this.allSiteList[key].push(item);}
                                }else{//第一次默认的
                                    // console.log(this.newSiteId)
                                    this.newSiteId.forEach(m=>{
                                       if(m==item.id){  
                                           item.checked=true;
                                       }
                                    })
                                    if(key==item.site_class){this.allSiteList[key].push(item);}
                                }
                          })
                      }
                     
                      for (let key in this.allSiteList ){
                          let e={};
                          let count=0;
                          e.name=key;
                          e.list=this.allSiteList[key].filter((x, index,self)=>self.indexOf(x)===index) 
                          if(e.list){
                              e.list.forEach(m=>{if(m.checked==true){count++;}})
                              if(count){
                                  if(count<e.list.length){
                                     e.checked=false;
                                     e.indeterminate=true;
                                  }else{
                                      e.checked=true;
                                      e.indeterminate=false;
                                  }
                              }else{
                                  e.indeterminate=false;
                                  e.checked=false;
                              }
                          }
                          e.siteCount=this.allSiteList[key].length;
                          this.allSiteListNew.push(e);
                          this.newData.push(e);
                      }

                      for(let key in this.detailNew){    
                        this.allSiteListNew.forEach(t=>{
                          t.list.forEach(m=>{
                              this.newSiteId.forEach(k=>{
                                  if(k==m.id&&m.allow_chk=='yes'){
                                      if(key==m.site_class){this.detailNew[key].push(m)} 
                                  }
                              })
                          })
                      })
                      }
                      for (let key in this.detailNew){
                          let e={};
                          e.name=key;
                          e.list=this.detailNew[key].filter((x, index,self)=>self.indexOf(x)===index)
                          e.siteCount=this.detailNew[key].length;
                          this.idDetial.push(e);
                      }
                      this.allSiteListNew = this.allSiteListNew.filter((x, index,self)=>self.indexOf(x)===index) 
                }

                    

                if(type=='add'){
                    // console.log(siteId)
                     for (let key in this.allSiteList){
                          this.accessSite.forEach(item=>{
                              if(siteId){
                                 siteId.forEach(t=>{
                                    if(t==item.id){  
                                           item.checked=true;
                                       }
                                 })
                                 if(key==item.site_class){
                                  this.allSiteList[key].push(item);
                              }
                              }else{
                                if(key==item.site_class){
                                  this.allSiteList[key].push(item);
                              }
                              this.ids.forEach(m=>{
                                  if(m==item.id){ item.checked=true;}
                              })
                              }
                          
                          })
                      }

                      for (let key in this.allSiteList ){
                          let e={}
                          let count=0;
                          e.name=key;
                          e.list=this.allSiteList[key].filter((x, index,self)=>self.indexOf(x)===index) 
                          e.siteCount=this.allSiteList[key].length;
                          this.allSiteListNew.push(e);
                          this.newData.push(e);
                      }
                      this.allSiteListNew = this.allSiteListNew.filter((x, index,self)=>self.indexOf(x)===index) 
                }
                     
            }
        }
    }
</script>
<style lang="less" scoped>
@import "../../../../styles/button.less";
    .box{
        border-radius: 5px;
        line-height: 40px;
            height:40px;
            border:1px solid #dcdcdc;
            margin-right:15px;
            margin-top:15px;
            width: 200px;
    }

</style>