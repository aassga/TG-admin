<template>
  <div ref="dragable" v-if="typeId=='10001'||typeId=='10004'||typeId=='10005'">
    <!-- 新版电子游艺排序 -->
    <Row>
      <Row v-if="spinShow" style="height:300px;line-height:300px">
        <Spin size="large" fix v-if="spinShow">
          <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
            <div v-for="t in 8" :key="'div'+t"></div>
          </div>
        </Spin>
      </Row>
      <Row v-if="!spinShow">
        <!-- 标签 -->
        <Tabs :active-key="activeKey" :animated="false" class="mb20" @on-click="getActiveKey">
          <TabPane :label="typeId=='10004'?'棋牌游戏标签':typeId=='10005'?'捕鱼游戏标签':'电子游艺标签'" key="0">
            <Button
              class="w135x ft14 mr20 title"
              :class="{'hotActive':currentHot==i,'move':isEdit&&!(adminType!='super'&&item.super==1)}" 
              @click="() => { currentHot=i;setColor() }"
              :key="item.id"
              v-for="(item,i) in hotTitleList"
              :draggable="!isEdit?false:(adminType!='super'&&item.super==1)?false:true"
              @dragstart.native="menuItemDrag('标签标题',item,i)"
              @dragover.native="menuItemOver"
              @drop.native.stop="menuItemDrop($event,i,'标签标题',hotTitleList)"
              @dragend.native="menuItemDragEnd"
            >
              <span class="ft14">{{item.name}}</span>
              <span class="biaoji pl5 pr5 cs" 
                v-if="isEdit&&typeId!='10005'"
                @click.stop='setLeftMenu(item,i)'
                :style="item.leftMenu?'color:red;border:1px solid red':'color:#2d8cf0;border:1px solid #2d8cf0'">
                {{item.leftMenu?'取消侧栏':'标位侧栏'}}
              </span>
              <span class="biaoji pl5 pr5 cd" 
                v-if="item.leftMenu&&!isEdit&&typeId!='10005'"
                style="color:white;background:red;border-radius:0">
                <span class="ib sanjiaoxing"></span>
                移动侧栏
              </span>
            </Button>
            <Input class="w135x ml20" placeholder="请输入关键字" v-model="text" clearable />
            <div class="mb20 gamebox mt20" v-if="hotTitleList[currentHot].list.filter(item=>item.name.includes(text)).length!='0'&&text"
            >
              <div class="w220x txt-a ib po-re h60"
                v-for="(item,i) in hotTitleList[currentHot].list.filter(item=>item.name.includes(text))"
                :key="item.id"
              >
                <Button
                  class="w187x ft14"
                  :class="{'move':isEdit&&!(adminType!='super'&&item.super==1),'super':isEdit&&adminType!='super'&&item.super==1}" 
                  :draggable="!isEdit?false:(adminType!='super'&&item.super==1)?false:true"
                  @dragstart.native="menuItemDrag('搜索标签',item,i)"
                  @dragover.native="menuItemOver"
                  @dragend.native="menuItemDragEnd"
                >             
                  <span class="ib gamename w110x">{{item.name}}</span>
                  <span class="line" v-if='typeId==10001&&item.line'>({{item.line}})</span>
                </Button>
                <Icon
                  class="close"
                  v-if="isEdit&&(adminType=='super'||!item.super)"
                  @click.stop="remove(item.id,hotTitleList[currentHot].list,'标签',i,'child')"
                  type="md-close"
                />
                <Icons
                  :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                  
                  v-if="(isEdit || item.lock == 1 )&&(adminType=='super'||!item.super)"
                  @click.native="lockGame(item.id,item.lock,hotTitleList[currentHot].list.filter(item=>item.name.includes(text)),i)"
                  :color="item.lock ==!0&&item.super!=1 ? '#CECECE'
                  :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : 'orange'"
                  class="gameLock"
                  size="20"
                ></Icons>
                <span class="line gamePlatform"><span class="ib sanjiaoxing"></span>{{getP(item.upid)}}</span>
              </div>
            </div>  
            <div
              v-if="!hotTitleList[currentHot].list || hotTitleList[currentHot].list.length == 0"
              class="titbox mb20 mt20"
              @drop="menuItemDrop($event,i,'标签',hotTitleList[currentHot].list)"
              @dragover.prevent
            >{{isEdit?'可拖动下方游戏进行添加并排序':'编辑添加游戏'}}</div>
            <div 
              class="txt-a mb20 mt20 titbox"
              v-if="hotTitleList[currentHot].list.filter(item=>item.name.includes(text)).length==0&&hotTitleList[currentHot].list.length>0" 
            >
              <span>匹配不到搜索关键词！请重新输入关键字</span>
            </div>
            <div class="mb20 gamebox mt20" v-if="hotTitleList[currentHot].list.length>0"
              @drop="menuItemDrop($event,hotTitleList[currentHot].list.length-1,'标签',hotTitleList[currentHot].list,'box')"
              @dragover.prevent
            >
              <div class="w220x txt-a ib po-re h60"
                v-for="(item,i) in hotTitleList[currentHot].list"
                @drop.stop="menuItemDrop($event,i,'标签',hotTitleList[currentHot].list)"
                :key="item.id"
              >
                <Button
                  class="w187x ft14"
                  :class="{'move':isEdit&&!(adminType!='super'&&item.super==1),'super':isEdit&&adminType!='super'&&item.super==1}" 
                  :draggable="!isEdit?false:(adminType!='super'&&item.super==1)?false:true"
                  @dragstart.native="menuItemDrag('标签',item,i)"
                  @dragover.native="menuItemOver"
                  @dragend.native="menuItemDragEnd"
                >             
                  <span class="ib gamename w110x">{{item.name}}</span>
                  <span class="line" v-if='typeId==10001&&item.line'>({{item.line}})</span>
                </Button>
                <Icon
                  class="close cs"
                  v-if="isEdit&&(adminType=='super'||!item.super)"
                  @click.stop="remove(item.id,hotTitleList[currentHot].list,'标签',i,'child')"
                  type="md-close"
                />
                <Icons
                  :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                  v-if="(isEdit || item.lock == 1 )&&(adminType=='super'||!item.super)"
                  @click.native="lockGame(item.id,item.lock,hotTitleList[currentHot].list,i)"
                  :color="item.lock ==!0&&item.super!=1 ? '#CECECE'
                  :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : 'orange'"
                  class="gameLock"
                  size="20"
                ></Icons>
                <span class="line gamePlatform"><span class="ib sanjiaoxing"></span>{{getP(item.upid)}}</span>
              </div>
            </div> 
            <div  v-if='isEdit'>
              <div class="mb20 fc">{{typeId==10001?'电子全部游戏':typeId==10005?'捕鱼全部游戏':'棋牌全部游戏'}}
                <Input class="w135x ml20" placeholder="请输入关键字" v-model="text2" clearable />
              </div>
              <div class="mb20 gameListBox" 
                @scroll.passive="getScroll($event,1)"  
                v-if="electronicList['0'].list['0_0'].list['0_0_0'].list.filter(item=>item.name.includes(text2)).length>0">
                <div
                  v-if="i>=minNum1&&i<=maxNum1"
                  class="ib w220x txt-a po-re h60"
                  v-for="(item,i) in electronicList['0'].list['0_0'].list['0_0_0'].list.filter(item=>item.name.includes(text2))"
                  :draggable="!isEdit?false:item.color=='1'?false:true"
                  @dragstart="menuItemDrag('平台',item,i)"
                  @dragover.native="menuItemOver"
                  @dragend.native="menuItemDragEnd"
                  :key="item.id"
                >
                  <Button
                    class="w187x ft14 title"
                    :class="(isEdit&&item.color=='1')?'super':'move'"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                    <span class="line" v-if='typeId==10001&&item.line'>({{item.line}})</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:2px"><span class="ib sanjiaoxing"></span>{{getP(item.upid)}}</span>
                </div>
                <div v-else class="ib w220x fl txt-a po-re h60"></div>  
              </div>
            </div>
          </TabPane>
          <!-- 平台 -->
          <TabPane :label="typeId=='10004'?'棋牌游戏平台':typeId=='10005'?'捕鱼游戏平台':'电子游艺平台'" key="1">
            <Input v-if="typeId=='10005'" class="w135x mb20" placeholder="请输入关键字" v-model="text" clearable />
            <div class="mb20" v-if="electronicList.length&&typeId!='10005'">
              <!-- <div class="mb20 fc">{{typeId=='10004'?'棋牌游戏平台':typeId=='10005'?'捕鱼游戏平台':'电子游艺平台'}}</div> -->
              <Button
                class="mr20 mb20 w135x title"
                v-for="(item,i) in electronicList"
                :class="{'hotActive':currentPlatform==i,'move':isEdit&&!(adminType!='super'&&item.super==1),'super':(isEdit&&adminType!='super'&&item.super==1)}" 
                @click.native.prevent.stop=" getGameType(item,item.id,i)"
                :draggable="!isEdit||item.name=='全部'?false:(adminType!='super'&&item.super==1)?false:true"
                @dragstart.native="menuItemDrag('平台',item,i)"
                @dragover.native="menuItemOver"
                @drop.native="menuItemDrop($event,i,'平台',electronicList)"
                @dragend.native="menuItemDragEnd"
                :key="item.id">
                <span class="ft14">{{item.name}}</span>
                <Icons
                  @click.native.prevent.stop="lockGame(item.id,item.lock,electronicList,i)"
                  :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                  v-if="(isEdit || item.lock == 1 )&&(adminType=='super'||!item.super)&&item.name!='全部'"
                  :color="item.lock ==!0&&item.super!=1 ? '#CECECE':item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : 'orange'"
                  class="gameLock"
                  style="left:-8px"
                  size="20"
                ></Icons>
              </Button> 
            </div>
            <div class="mb20" v-if="electronicList.length&&typeId!='10005'">
              <div class="mb20">
                二级分类名称 :
                <span class="fc ml20" style="font-size:0.875rem ">游戏类型</span>
                <span class="ib w80x txt-a cs"
                  v-if='isEdit&&Object.keys(electronicList[currentPlatform].list).length>1'
                  :style="{color:isEdit?'#2d8cf0':'#888888'}"
                  @click="!isEdit?'':del('二级分类',electronicList[currentPlatform].list)"
                >删除
                </span>
              </div>
              <div class="platformBtn" style="line-height:50px">
                <Button
                  class="mr20 mb20 w135x title"
                  :class="{'hotActive':currentType==key,'move':isEdit&&!(adminType!='super'&&item.super==1)}" 
                  @click.native=" selectType(item,key,i)"
                  v-for="(item,key,i) in (electronicList[currentPlatform].list)"
                  :draggable="!isEdit?false:true"
                  @dragstart.native="menuItemDrag('二级',item,key)"
                  @dragover.native="menuItemOver"
                  @drop.native="menuItemDrop($event,i,'二级',electronicList[currentPlatform].list)"
                  @dragend.native="menuItemDragEnd"
                  :key="item.id"
                >
                  <Icon
                    v-if="isEdit&&item.name!='全部游戏'"
                    type="md-create"
                    class="bianji cs"
                    style="left:5px"
                    @click.stop="changeTitle('二级分类',key,item.name)"
                    size="16"
                  />
                  <span class="ft14">{{item.name}}</span>
                  <Icon
                    v-if="isEdit&&item.name!='全部游戏'"
                    class="close cs"
                    style="right:-8px;top:-11px"
                    @click.stop="remove(item.name,electronicList[currentPlatform].list,'二级分类', key)"
                    type="md-close"
                  />
                </Button>
                <Button v-if='isEdit&&Object.keys(electronicList[currentPlatform].list).length<9' class="w50x ft14 mb20" @click="!isEdit?'':addTitle('二级分类')">
                  <Icons type="tianjialunbotuanniu" color="#adadad" size="14"></Icons>
                </Button>
                <Input v-if="typeId!='10001'" class="w135x mb20 ml20" placeholder="请输入关键字" v-model="text" clearable />
              </div>
            </div>
            <div class="mb20" v-if="electronicList.length">
              <div class="mb20" v-if="typeId=='10001'">
                三级分类名称 :
                <span class="fc ml20" style="font-size:0.875rem ">赔付线数</span>
                <span class="ib w80x txt-a cs"
                  :style="{color:isEdit?'#2d8cf0':'#888888'}"
                  v-if='isEdit&&Object.keys(electronicList[currentPlatform].list[currentType].list).length>1'
                  @click="!isEdit?'':del('三级分类',electronicList[currentPlatform].list[currentType].list)">
                  删除
                </span>
              </div>
              <div class="platformBtn" style="line-height:50px" v-if="typeId=='10001'">
                <Button
                  class="mr20 mb20 w135x title"
                  :class="{'hotActive':currentWire==key,'move':isEdit&&!(adminType!='super'&&item.super==1)}" 
                  @click="selectWire(item,key)"
                  v-for="(item,key,i) in (electronicList[currentPlatform].list[currentType].list)"
                  :draggable="!isEdit||item.name=='全部'?false:(adminType!='super'&&item.super==1)?false:true"
                  @dragstart.native="menuItemDrag('三级',item,key)"
                  @dragover.native="menuItemOver"
                  @drop.native="menuItemDrop($event,i,'三级',electronicList[currentPlatform].list[currentType].list)"
                  @dragend.native="menuItemDragEnd"
                  :key="item.name"
                >
                  <Icon
                    v-if="isEdit&&item.name!='全部'"
                    type="md-create"
                    class="bianji cs"
                    style="left:5px"
                    @click.stop="changeTitle('三级分类',key,item.name)"
                    size="16"
                  />
                  <span class="ft14">{{item.name}}</span>
                  <Icon
                    v-if="isEdit&&item.name!='全部'"
                    class="close cs"
                    style="right:-8px;top:-11px"
                    @click.stop="remove(item.name,electronicList[currentPlatform].list[currentType].list,'三级分类',key)"
                    type="md-close"
                  />
                </Button>
                <Button v-if='isEdit&&Object.keys(electronicList[currentPlatform].list[currentType].list).length<9' class="w50x ft14 mb20" @click="!isEdit?'':addTitle('三级分类')">
                  <Icons type="tianjialunbotuanniu" color="#adadad" size="14"></Icons>
                </Button>
                <Input class="w135x mb20 ml20" placeholder="请输入关键字" v-model="text" clearable />
              </div>
              <div class="mb20 gameListBox" 
                @scroll.passive="getScroll($event,2)" 
                v-if="electronicList[currentPlatform].list[currentType].list[currentWire].list.filter(item=>item.name.includes(text)).length>0&&text"
                @dragover.prevent>
                <div
                  class="ib w220x txt-a po-re h60"
                  v-if="i>=minNum2&&i<=maxNum2"
                  v-for="(item,i) in electronicList[currentPlatform].list[currentType].list[currentWire].list.filter(item=>item.name.includes(text))"
                  :key="item.id"
                >
                  <Button
                    class="w187x ft14 title"
                    :class="{'super':isEdit&&adminType!='super'&&item.super==1,'move':isEdit&&!(adminType!='super'&&item.super==1)}" 
                    :draggable="isEdit&&!(adminType!='super'&&item.super=='1')"
                    @dragstart.native="menuItemDrag('搜索游戏',item,i)"
                    @dragover.native="menuItemOver"
                    @dragend.native="menuItemDragEnd"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                    <span class="line" v-if='typeId==10001&&item.line'>({{item.line}})</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:2px" v-if="currentPlatform=='0'"><span class="ib sanjiaoxing"></span>{{getP(item.upid)}}</span>
                  <Icons
                    :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                    v-show="(isEdit || item.lock == 1 )&&(adminType=='super'||!item.super)"
                    @click.native="lockGame(item.id,item.lock,electronicList[currentPlatform].list[currentType].list[currentWire].list.filter(item=>item.name.includes(text)),i)"
                    :color="item.lock ==!0&&item.super!=1 ? '#CECECE'
                      :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : 'orange'"
                    class="gameLock cs"
                    size="20"
                  ></Icons>
                  <Icon
                    v-show="isEdit&&(adminType=='super'||!item.super)&&currentWire!=(platformId+'_0_0')"
                    class="close cs"
                    style="top:6px, right:3px"
                    @click.stop="remove(item.name,electronicList[currentPlatform].list[currentType].list[currentWire].list,'游戏',i)"
                    type="md-close"
                  />
                  <Icon
                    v-show="isEdit&&typeId=='10001'&&(adminType=='super'||!item.super)&&currentWire==currentType+'_0'"
                    type="md-create"
                    class="bianji cs"
                    @drop.native.stop="menuItemDrop($event,i,'游戏',(electronicList[currentPlatform].list[currentType].list[currentWire].list))"
                    style="top:26px !important"
                    @click="setLine(item)"
                    size="16"
                  />
                </div>
                <div v-else class="ib w220x txt-a po-re h60 fl"></div>
              </div>
              <div v-if='electronicList[currentPlatform].list[currentType].list[currentWire].list.length==0&&text' 
                @dragover.prevent
                class="txt-a mb20" style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc">
                <span>暂无数据!</span>
              </div>
              <div v-if="electronicList[currentPlatform].list[currentType].list[currentWire].list.filter(item=>item.name.includes(text)).length==0
                &&electronicList[currentPlatform].list[currentType].list[currentWire].list.length!=0&&text" 
                class="txt-a mb20" style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc">
                <span>匹配不到搜索关键词！请重新输入关键字</span>
              </div>
              <div class="mb20 gameListBox" 
                @scroll.passive="getScroll($event,3)"
                :style="electronicList[currentPlatform].list[currentType].list[currentWire].list.length==0?'display:none':''"
                @drop="currentWire==currentType+'_0'&&currentType==electronicList[currentPlatform].id+'_0'?''
                  :menuItemDrop($event,electronicList[currentPlatform].list[currentType].list[currentWire].list.length-1,'游戏',(electronicList[currentPlatform].list[currentType].list[currentWire].list),'box')"
                @dragover.prevent
              >
                <div
                  class="ib w220x txt-a po-re h60"
                  v-if="i>=minNum3&&i<=maxNum3"
                  v-for="(item,i) in electronicList[currentPlatform].list[currentType].list[currentWire].list"
                  :key="item.id"
                  @drop.stop="menuItemDrop($event,i,'游戏',(electronicList[currentPlatform].list[currentType].list[currentWire].list))"
                >
                  <!-- <Poptip trigger="click" :content="item.name"> -->
                  <Button
                    class="w187x ft14 title"
                    :class="{'super':isEdit&&adminType!='super'&&item.super==1,'move':isEdit&&!(adminType!='super'&&item.super==1)}"
                    :draggable="isEdit&&!(adminType!='super'&&item.super=='1')"
                    @dragstart.native="menuItemDrag('游戏',item,i)"
                    @dragover.native="menuItemOver"
                    @dragend.native="menuItemDragEnd"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                    <span class="line" v-if='typeId==10001&&item.line'>({{item.line}})</span>
                  </Button>
                  <!-- </Poptip> -->
                  <span class="line gamePlatform" style="bottom:2px" v-if="currentPlatform=='0'"><span class="ib sanjiaoxing"></span>{{getP(item.upid)}}</span>
                  <Icons
                    :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                    v-show="(isEdit || item.lock == 1 )&&(adminType=='super'||!item.super)"
                    @click.native="lockGame(item.id,item.lock,electronicList[currentPlatform].list[currentType].list[currentWire].list,i)"
                    :color="item.lock ==!0&&item.super!=1 ? '#CECECE'
                      :item.lock ==!0&&item.super==1?'rgb(255, 38, 38)' : 'orange'"
                    class="gameLock cs"
                    size="20"
                  ></Icons>
                  <Icon
                    v-show="isEdit&&(adminType=='super'||!item.super)&&currentWire!=(platformId+'_0_0')"
                    class="close cs"
                    style="top:6px, right:3px"
                    @click.stop="remove(item.name,electronicList[currentPlatform].list[currentType].list[currentWire].list,'游戏',i)"
                    type="md-close"
                  />
                  <Icon
                    v-show="isEdit&&typeId=='10001'&&(adminType=='super'||!item.super)&&currentWire==currentType+'_0'"
                    type="md-create"
                    class="bianji cs"
                    @drop.native.stop="menuItemDrop($event,i,'游戏',(electronicList[currentPlatform].list[currentType].list[currentWire].list))"
                    style="top:26px !important"
                    @click="setLine(item)"
                    size="16"
                  />
                </div>
                <div v-else class="ib w220x txt-a po-re h60 fl"></div>
              </div>
              <div v-if='electronicList[currentPlatform].list[currentType].list[currentWire].list.length==0' 
                @drop="menuItemDrop($event,i,'游戏',(electronicList[currentPlatform].list[currentType].list[currentWire].list))"
                @dragover.prevent
                class="txt-a mb20" style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc">
              <span>暂无数据!</span>
              </div>
            </div>
            <!-- 平台全部游戏 -->
            <div v-if="currentWire!=(platformId+'_0_0')&&isEdit">
              <div class="mb20 fc">{{electronicList[currentPlatform].name!='全部'?electronicList[currentPlatform].name+'全部游戏':'全部游戏'}}
                <Input class="w135x ml20" placeholder="请输入关键字" v-model="text2" clearable />
              </div>
              <div class="mb20 gameListBox" @scroll.passive="getScroll($event,4)" v-if="isEdit&&electronicList[currentPlatform].list[platformId+'_0'].list[platformId+'_0_0'].list.filter(item=>item.name.includes(text2)).length!=0">
                <div
                  v-if='i>=minNum4&&i<=maxNum4'
                  class="w220x txt-a po-re ib h60"
                  v-for="(item,i) in electronicList[currentPlatform].list[platformId+'_0'].list[platformId+'_0_0'].list.filter(item=>item.name.includes(text2))"
                  :key="i"
                >
                  <Button

                    class="w187x ft14 title"
                    :class="{'super':item.color=='1','move':isEdit&&item.color!='1'}"
                    :draggable="!isEdit?false:item.color=='1'?false:true"
                    @dragstart.native="menuItemDrag('全部游戏',item,i)"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                    <span class="line" v-if='typeId==10001&&item.line'>({{item.line}})</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:3px" v-if="currentPlatform==0" ><span class="ib sanjiaoxing"></span>{{getP(item.upid)}}</span>
                </div>
                <div v-else class="w220x txt-a fl po-re ib h60"></div>
              </div>
            </div>
            <div v-if="electronicList[currentPlatform].list[platformId+'_0'].list[platformId+'_0_0'].list.filter(item=>item.name.includes(text2)).length==0" 
                class="txt-a" style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc">
              <span>匹配不到搜索关键词！请重新输入关键字</span>
            </div>
            <span class="txt-a ib" style="line-height:30px" v-if="electronicList.length">
              <Icons style="vertical-align:middle" type="suodingpaixu1" size="20" color="#CECECE"/>&nbsp;锁定后,排序不会因为用户习惯发生变化
            </span>
          </TabPane>
        </Tabs>
      </Row>
    </Row>
    <Modals :title="editTitle?`编辑${addType}名称`:`新增${addType}名称`" ref="addTitle" :width='360'>
      <div slot="content" class="mb30 p30 pb5" style="text-align:center">
        <Form style="text-align:center;margin-left:3px">
          <FormItem :label="addType=='标签'?'输入标签':addType=='三级分类'?'赔付线数':'输入名称'" :label-width="100">
            <input 
                  v-if="addType!='标签'"
                  v-model="hotTitle"
                  class="input"
                  style="height:40px;width:117px"
                  :placeholder="addType=='三级分类'?'输入分类名称':'输入1-6位名称'"
                  :maxlength="6"
                  />
          </FormItem>
        </Form>
        <div class="txt-a mt45">
          <Button class="ft20 w260x"  style="height:50px !important;" type="primary" @click="submit">{{!editTitle?'确认新增':'确认修改'}}</Button>
        </div>
      </div>
    </Modals>
    <Modals ref="setGameLine" :title="gameLine.name" :width='360'>
      <div slot="content" class="mb30 p30 pb5">
        <div>
          <span class="pl35 pr20 ft14">游戏线数</span>
          <Input class="w150x" 
            v-model="gameLine.line"
            maxlength="6"
            placeholder="游戏线数"
           /> 
        </div>
        <div class="txt-a mt45">
          <Button class="w260x ft20" style="height:50px !important" type="primary" @click="submitLine">确认保存</Button>
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import { getUserType } from "@/libs/util";
import Modals from "@/components/modals";
import Icons from "@/components/icons";
import draggable from "vuedraggable";
import { Spin } from "view-design";
import { systemSiteGameSlotList, systemSiteGameSlotUp,systemSiteGameChessFishList,systemSiteGameChessFishUp } from "@/api/system";
export default {
  name: "Electronic",
  props: {
    isEdit: {
      type: Boolean,
      required:true
    },
    typeId:{
      type: String,
      required:true
    }
  },
  components: {
    draggable,
    Icons,
    Modals
  },
  data() {
    return {
      minNum1:0,
      maxNum1:200,
      minNum2:0,
      maxNum2:200,
      minNum3:0,
      maxNum3:200,
      minNum4:0,
      maxNum4:200,
      minNum5:0,
      maxNum5:200,
      minNum6:0,
      maxNum6:200,
      activeKey:'0',
      gameLine:{},//设置线束游戏
      type:'',
      text:'',//搜索
      text2:'',
      spinShow:true,
      dianziList:[], //电子游戏列表
      dianziLable:[],//电子标签
      chessList:[], //
      chessLable:[],
      buyuList:[],
      buyuLable:[],
      beforeId: null,
      editTitle: false,
      dragItem: {}, //被拖动的原素
      dragType: "",
      editKey: "",
      title: [],
      currentPlatform: 0, //电子游艺默认 key1
      platformId:0,
      currentType: "0_0", //二级分类当前选中 key2
      currentWire: "0_0_0", //当前赔付线数 key3
      addType: "",
      disabled: false,
      lineNumber: [], //赔付线数
      currentHot: "0", //电子排序当前热门选中
      hotTitle: "", //电子热门标签
      hotTitleList: [], //电子游艺热门标签列表
      electronicList: [], //电子游艺列表
      adminType: getUserType(),
    };
  },
  watch: {
    typeId: {
      handler(newTypeId, oldTypeId) {
        if(newTypeId == oldTypeId) return;
        this.currentHot = 0;
        this.currentPlatform= 0;
        this.platformId=0;
        this.currentType= "0_0", 
        this.currentWire= "0_0_0", 
        this.type = newTypeId;
        this.text = '';
        this.text2='';
        if(newTypeId == 10001||newTypeId==10004||newTypeId==10005) this.setDate();
      },
      deep: true
    },
    isEdit:{
       handler(newTypeId, oldTypeId) {
        if(newTypeId&&(this.typeId==10001||this.typeId==10004||this.typeId==10005)) this.setColor();
      },
      deep: true
    },
    spinShow:{
       handler(newTypeId, oldTypeId) {
        if(newTypeId==false&&(this.typeId=='10001'||this.typeId=='10004'||this.typeId=='10005')){
          this.$emit("getLoad",false)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getDate();
    });
  },
  methods: {
    getDate(){
      let data = { siteId: this.$root.nowSite.id };
      systemSiteGameSlotList(data).then(res => {
        if (res.code == 200) {
          this.dianziLable = res.data.json.label||[];
          // if(this.dianziLable.length<4){
          //   this.dianziLable= [{name:'推荐游戏',list:[],id:0},{name:'热门游戏',list:[],id:1},{name:'最新游戏',list:[],id:2},{name:'彩金池游戏',list:[],id:3}]
          // };
          this.dianziList = res.data.json.platform;
          this.setDate();
          this.spinShow = false;
        }
      });
      systemSiteGameChessFishList(data).then(res=>{
        if(res.code == 200){
          this.chessLable = res.data[0].json.label||[];
          this.chessList = res.data[0].json.platform;
          this.buyuLable = res.data[1].json.label||[];
          this.buyuList = res.data[1].json.platform;
          if(this.chessLable.length==0){
            this.chessLable= [{name:'推荐游戏',list:[],id:0},{name:'热门游戏',list:[],id:1},{name:'最新游戏',list:[],id:2}]
          };
          if(this.buyuLable.length==0){
            this.buyuLable= [{name:'推荐游戏',list:[],id:0},{name:'热门捕鱼',list:[],id:1}]
          };
          this.buyuLable = this.buyuLable.slice(0,2);
          this.setDate();
        }    
      })
    },
    quxiao(){
      this.spinShow = true;
      this.currentPlatform='0';
      this.platformId=0;
      this.currentType='0_0';
      this.currentWire='0_0_0'
      this.getDate();
    },
    getP(id){
      let msg=id=='10014'?'AE':id=='10015'?'AG':id=='10016'?'BBIN':id=='10018'?'CQ9':id=='10019'?'DT':id=='10020'?'FG':id=='10021'?'JDB':
              id=='10022'?'MG':id=='10023'?'MW':id=='10024'?'PT':id=='10025'?'TTG':id=='10041'?'VG':id=='11320'?'PG':id=='10694'?'天豪':id=='10612'?'乐游':
              id=='10042'?'开元':id=='10732'?'FG':id=='10636'?'大战':id=='10055'?'AG':id=='10056'?'FG':id=='10057'?'CQ9':id=='10053'?'MW':
              id=='10054'?'JDB':id=='10058'?'BG':id=='11660'?'天豪':id=='11661'?'乐游':id=='11659'?'开元':id=='11440'?'BBIN':id=='11677'?'PT':id=='11662'?'VG':'';
      return msg
    },
    getActiveKey(val){ //标签平台切换
      this.activeKey = val;
      this.text='';
      this.text2='';
      if(this.isEdit&&this.activeKey==0) this.setColor();
    },
    setLine(val){ //设置游戏线数
      this.gameLine = JSON.parse(JSON.stringify(val));
      this.$refs.setGameLine.show();
    },
    setColor(){ //全部平台样式置灰
      if(this.activeKey=='1'){ //平台
        this.electronicList[this.currentPlatform].list[this.platformId+'_0'].list[this.platformId+'_0_0'].list.map(item=>{
          item.color='0';
          if(this.currentWire==this.currentType+'_0'){ //全部时 置灰全部游戏
            this.electronicList[this.currentPlatform].list[this.currentType].list[this.currentType+'_0'].list.map(t=>{
              if(t.id ==item.id) item.color='1';
            })
          }else{ //不为全部时 置灰所有线的游戏
            for(let key in this.electronicList[this.currentPlatform].list[this.currentType].list){
              if(key != this.currentType+'_0'){
                this.electronicList[this.currentPlatform].list[this.currentType].list[key].list.map(t=>{
                  if(t.id == item.id) item.color = '1';
                })
              }
            }
          }
        })
      }else{ //标签
        this.electronicList['0'].list['0_0'].list['0_0_0'].list.map(item=>{
          item.color='0'
          this.hotTitleList[this.currentHot].list.map(t=>{
            if(t.id == item.id) item.color='1';
          })
        })
      }
       this.$forceUpdate();
    },
    submitLine(){ //游戏线束提交
      // if(!this.gameLine.line) {this.$Message.error('请输入线数');return };
      this.electronicList.map(item=>{
        for (let t in item.list) {
          for(let m in item.list[t].list){
            item.list[t].list[m].list.map(k=>{
              if(k.id == this.gameLine.id) {
                k.line = this.gameLine.line;
              }
            })
          }
        }
      });
      this.hotTitleList.map(item=>{
        item.list.map(t=>{
          if(t.id == this.gameLine.id) {t.line = this.gameLine.line};
        })
      })
      this.$refs.setGameLine.hide();
      this.$forceUpdate();
    },
    setLeftMenu(val,i){ //开启关闭侧边栏
      if(val.leftMenu) this.hotTitleList[i].leftMenu = 0;
      else this.hotTitleList[i].leftMenu = 1;
      this.$forceUpdate();
    },
    getScroll(e,type){ //数据节流
      let scrollHeight = e.target.scrollHeight;
      let scrollTop = e.target.scrollTop;
      let height = e.target.clientHeight;
      let width = e.target.clientWidth;
      if(type==1) {this.minNum1 = ((scrollTop/60)*(Math.floor(width/220)))-200;
                  this.maxNum1 =this.minNum1+400;};
      if(type==2) {this.minNum2 = ((scrollTop/60)*(Math.floor(width/220)))-200;
                  this.maxNum2 =this.minNum2+400;}
      if(type==3) {this.minNum3 = ((scrollTop/60)*(Math.floor(width/220)))-200;
                  this.maxNum3 =this.minNum3+400;}
      if(type==4) {this.minNum4 = ((scrollTop/60)*(Math.floor(width/220)))-200;
                  this.maxNum4 =this.minNum4+400;}
      if(type==5) {this.minNum5 = ((scrollTop/60)*(Math.floor(width/220)))-200;
                  this.maxNum5 =this.minNum5+400;}
      if(type==6) {this.minNum6 = ((scrollTop/60)*(Math.floor(width/220)))-200;
                  this.maxNum6 =this.minNum6+400;}
      // if(scrollHeight-scrollTop-height<=5){
      //   if(this.num<=this.electronicList[0].list['0_0'].list['0_0_0'].list.length){
      //     this.num = this.num+200;
      //   }
      // };
      this.$forceUpdate();
    },
    setDate(){ //设置数据
      this.currentPlatform = 0;
      this.hotTitleList = this.type=='10001'?this.dianziLable:this.type=='10004'?this.chessLable:this.type=='10005'?this.buyuLable:'';
      this.electronicList = this.type=='10001'?this.dianziList:this.type=='10004'?this.chessList:this.type=='10005'?this.buyuList:'';
    },
    //添加标签
    addTitle(val) {
      this.mbChecked = false;
      this.hotTitle = '';
      this.editTitle = false;
      this.addType = val;
      this.$refs.addTitle.show();
    },
    //编辑标题
    changeTitle(val, key,name) {
      this.editKey = key;
      this.addType = val;
      this.hotTitle = name;
      this.editTitle = true;
      this.$forceUpdate();
      this.$refs.addTitle.show();
    },
    //删除
    remove(name, list, type, i, child) {
      if (type == "标签") {    
        this.hotTitleList[this.currentHot].list = list.filter(   //删除标签子类
          i => i.id != name
        );
      } else if (type == "二级分类") {
        let _this=this;
        this.$Tip.confirm({
					content: `您确定删除二级分类【${name}】吗? 删除后对应数据会消失`,
					onOk: () => {
            if (this.currentType == i) {
              //当被选择项删除时，默认选择全部
              this.currentType = this.electronicList[this.currentPlatform].id+"_0";
              this.currentWire = this.electronicList[this.currentPlatform].id+"_0_0";
            }
            Object.keys(list).map(function(key) {
              if (list[key].name == name) {
                delete list[key];
                _this.$forceUpdate();
              }
            });
					}
        });
        
        this.selectType(list[this.currentType], this.currentType);
      } else if (type == "三级分类") {
        
        let _this=this;
        this.$Tip.confirm({
					content: `您确定删除三级分类【${name}】吗? 删除后对应数据会消失`,
					onOk: () => {
            if (this.currentWire == i) this.currentWire = "0_0_0"; //当被选择项删除时，默认选择全部
            Object.keys(list).map(function(key) {
              if (list[key].name == name) delete list[key];
              _this.$forceUpdate();
            });
					}
        });
        this.selectWire(list[this.currentWire], this.currentWire);
      }else if(type == '游戏'){
        let id = list[i].id;
        if(this.currentWire==this.currentType+'_0'){ //全部
          for(let key in this.electronicList[this.currentPlatform].list[this.currentType].list){
            this.electronicList[this.currentPlatform].list[this.currentType].list[key].list.map((item,index)=>{
              if(item.id == id) {
                this.electronicList[this.currentPlatform].list[this.currentType].list[key].list.splice(index,1);
              }
            })
          };
        }else{  //非全部类别
          list.splice(i,1);
          this.$forceUpdate();
        }
      };
      this.setColor();
      this.$forceUpdate();
    },
    //重置list列表的 key及id值
    setKey() {
      this.hotTitleList.map((item, i) => {
        item.id = i;
        if(item.leftMenu==true)item.leftMenu = 1;
        if(item.leftMenu == false)item.leftMenu =0;
      });
      this.electronicList.map(item => {

        let length = 0;
        for (let t in item.list) {
          let newKey = item.id + "_" + length;
          if (newKey != t) {
            item.list[newKey] = item.list[t];
            delete item.list[t];
          }
          item.list[newKey].id = length;
          let long = 0;
          for (let m in item.list[newKey].list) {
            let insideKey = newKey + "_" + long;
            if (insideKey != m) {
              item.list[newKey].list[insideKey] = item.list[newKey].list[m];
              delete item.list[newKey].list[m];
            }
            item.list[newKey].list[insideKey].id = long;
            long++;
          }
          length++;
        }
      });
    },
    //锁定排序
    lockGame(id, lock, list ,i) {
      if (!this.isEdit) return;
      this.$set(list[i], "lock", lock == 0 ? 1 : 0);
      if(this.adminType=="super"){
        this.$set(list[i],'super',lock?0:1)
      };
      this.$forceUpdate(); //强制更新试图
    },
    //电子游艺平台切换获取游戏类型
    getGameType(val, id, i) { 
      let key = id + "_0";
      this.currentPlatform = i;
      this.platformId = this.electronicList[this.currentPlatform].id;
      this.beforeId = this.electronicList[i].id
      this.currentType = key;
      this.currentWire = key + "_0";
    },
    selectType(val, key) { //切换二级分类
      if(this.currentType==key) return;
      this.currentType = key;
      this.currentWire = key + "_0";
      if(this.isEdit&&this.currentWire!=(this.platformId+'_0_0')) this.setColor();
     
    },
    selectWire(val, key) { //切换三级分类
      this.currentWire = key;
      if(this.isEdit&&this.currentWire!=(this.platformId+'_0_0')) this.setColor();
    },
    del(type,list){
      let text = `确定删除${type}所有分类吗?`
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          if(type=='三级分类'){
            for(let key in list){
              this.currentWire = this.currentType+'_0';
              if(key != (this.currentType+'_0')) delete list[key];
            }
          }else if(type=="二级分类"){
            this.currentType = this.platformId+"_0";
            for(let key in list){
              if(key != (this.platformId+'_0')) {
                delete list[key]
              };
            }
          }
          this.$forceUpdate();
        }
      });
    },
    //数据提交
    submit() {
      if(!this.hotTitle&&this.addType!='标签'){
        this.$Message.error('请输入标题');
        return
      };
      let curlist = this.addType == '平台'?this.electronicList
              :this.addType == '标签'?this.hotTitleList
              :this.addType == '二级分类'?this.electronicList[this.currentPlatform].list
              :this.addType == '三级分类'?this.electronicList[this.currentPlatform].list[this.currentType].list:null;
      if(Object.keys(curlist).length>=9&&!this.editTitle){
        this.$Message.error("当前标签数量已达上限");
        return
      }
      for(let key in curlist){
        if(curlist[key].name == this.hotTitle&&key!=this.editKey){
          this.$Message.error(`${this.addType}名重复`);
          return
        }
      }
      if(!this.editTitle){
        let addTitle = {
          id:Object.keys(curlist).length,
          name: this.addType=='三级分类'?this.hotTitle:this.hotTitle,
        };
        if(this.addType == '二级分类'){
          let key = this.platformId + "_" + Object.keys(curlist).length;
          let list = {};
          list[key + "_0"] = { id: 0, name: "全部", list: [] };
          addTitle.list = list;
          curlist[key] = addTitle;
        }else if(this.addType == '三级分类'){
          let key = this.currentType + "_" + (Object.keys(curlist).length);
          addTitle.list = [];
          curlist[key] = addTitle;
        }
        this.$forceUpdate();
      }else{
        curlist[this.editKey].name = this.hotTitle;
      }
      this.$refs.addTitle.hide();
    },
    //电子游戏排序数据更新
    updateDate() {
      this.setKey();
      let newData = { label: this.hotTitleList, platform: this.electronicList };
      let title = JSON.parse(JSON.stringify(newData));
      if (title.platform) {        //提交数据，去掉title里最里层游戏列表，减少数据
        title.platform.map(item => {
          for (let key in item.list) {
            for (let k in item.list[key].list) {
              delete item.list[key].list[k].list;
            }
          }
        });
      };
      newData.platform.map(item=>{
        for(let key in item.list){
          for(let k in item.list[key].list){
            item.list[key].list[k].list.map(item=>{
              if(!item.line) {item.line=null}
              
              // else{
              //   // console.log(typeof ((item.line)*1))
              //   if(typeof ((item.line)*1)=='number'&&(item.line/1)){
              //     item.line = item.line+'线';
              //   }
              // }
            })
          }
        }
      })
      if(this.type == '10001'){
        let data = {
          siteId: this.$root.nowSite.id,
          type: 10001,
          json: JSON.stringify(newData)
        };
        data.title = JSON.stringify(title);
        systemSiteGameSlotUp(data, true).then(res => {
          if (res.code == 200) {
            this.$Message.success("数据更新成功");
          }
          this.editTitle = false;
          this.hotTitle = "";
          this.$emit('getLoad',false)
        });
      }
      if(this.type =='10004'||this.type=='10005'){
        let data = {
          siteId: this.$root.nowSite.id,
          type: this.type == '10004'?1:2,
          json: JSON.stringify(newData),
        };
        systemSiteGameChessFishUp(data,true).then(res=>{
          if(res&&res.code == 200) {
            this.$Message.success("数据更新成功");
          }
          this.editTitle = false;
          this.hotTitle = "";
          this.$emit('getLoad',false);
        })
      }
    },
    //排序超管锁提示
    testSuper(list,newIndex,i){
      let newItem = JSON.parse(JSON.stringify(this.dragItem));
      newItem.super=0;
      if(this.adminType != 'super'){
        let arr =[];
        list.map((item,i)=>{if(item.super==1) arr.push(i)});
        arr.sort((a,b)=>{return a-b});
        let minIndex = arr[arr.length-1]||null;
        if(newIndex<minIndex&&minIndex) {
        this.$Message.error("请排放在超管锁定之后")
          return
        }
        list.splice(newIndex+1, 0, newItem);
      }else{
        list.splice(newIndex+1, 0, newItem);
      }
      this.$forceUpdate();
      this.$Message.success('添加成功')
    },
     //拖拽排序
    menuItemDrag(type, item, i) {
      this.i = i;
      this.dragItem = item;
      this.dragType = type;
    },
    menuItemDragEnd() {
      this.i = null;
    },
    menuItemOver(e) {
      if (this.i !== null) e.preventDefault();
    },
    menuItemDrop($event, newIndex, type, list,box) {
      if(!this.isEdit) return;
      if (this.i !== null) {
        if (this.dragType == type) {
          //排序
          if(box=='box') return;
          if((this.dragType == '搜索游戏'||this.dragType =='搜索标签') && this.text) return;
          if(type=='三级'){
            if(newIndex==0) return;
            for(let key in list){
              if(list[key]==this.dragItem){
                let oldObj = {...list[this.currentType+'_'+newIndex]};
                list[this.currentType+'_'+newIndex] = this.dragItem;
                list[key] = oldObj;
              }
            }
            this.setKey();
            this.$forceUpdate();
            return
          };
          if(type=='二级'){
            if(newIndex==0) return;
            for(let key in list){
              if(list[key]==this.dragItem){
                let oldObj = {...list[this.electronicList[this.currentPlatform].id+'_'+newIndex]};
                list[this.electronicList[this.currentPlatform].id+'_'+newIndex] = this.dragItem;
                list[key] = oldObj;
              }
            };
            this.setKey();
            this.$forceUpdate();
            return
          }
          if (list[newIndex].name == "全部") return;
          if (this.i == newIndex) return;
          if(this.adminType != 'super'){
            let arr =[];
            list.map((item,i)=>{
              if(item.super==1) arr.push(i)
            })
            arr.push(this.i);
            arr.sort((a,b)=>{return a-b});
            let currentIndex = arr.indexOf(this.i);
            let minIndex = arr[currentIndex-1];
            let maxIndex = arr[currentIndex+1]||99999;
            // if(newIndex<=minIndex||newIndex>=maxIndex) return
            if(newIndex<=minIndex){
              this.$Message.error("请排在超管锁定之后");
              return
            }else if(newIndex>=maxIndex){
              this.$Message.error("请排在超管锁定之前");
              return
            } 
          }
          let newObj = list[this.i];
          list.splice(this.i, 1);
          list.splice(newIndex, 0, newObj);
          list.find((t,i) => {
            if (t.id == this.beforeId) this.currentPlatform = i
          })
        } else {   //拖拽新增
          if(this.dragType=='二级'||this.dragType=='三级') return;
          if(this.dragType=='标签标题'||type=="标签标题") return;
          if(this.dragType=='游戏'&&type=='平台') return;
          if(this.dragType=='搜索游戏'||this.dragType=='搜索标签'){
            if(this.adminType!='super'){
              let arr =[];
              list.map((item,i)=>{
                if(item.super==1) arr.push(i)
              });
              let index;
              list.map((item,i)=>{
                if(item.id==this.dragItem.id){index = i}
              })
              arr.push(index);
              arr.sort((a,b)=>{return a-b});
              
              let currentIndex = arr.indexOf(index);
              let minIndex = arr[currentIndex-1];
              let maxIndex = arr[currentIndex+1]||99999;
              if(newIndex<=minIndex){
                this.$Message.error("请排在超管锁定之后");
                return
              }else if(newIndex>=maxIndex){
                this.$Message.error("请排在超管锁定之前");
                return
              } 
            }       
            this.dragItem.super=0;
            list.map((item,i)=>{  
              if(item.id==this.dragItem.id){
                list.splice(i,1);
                if(i>newIndex+1){
                  list.splice(newIndex+1,0,this.dragItem);
                }else if(i<newIndex+1){
                  list.splice(newIndex,0,this.dragItem);
                }else{return}
              }
            })
            this.$forceUpdate();
            return
          }else{
            let newItem = JSON.parse(JSON.stringify(this.dragItem));
            newItem.super=0;
            this.testSuper(list,newIndex,this.i)
            if(type=='游戏'){
              if(this.currentType!=this.currentPlatform+'_0'){//二级分类不为全部时
                if(this.currentWire!=this.currentType+"_0"){//3级分类不为全部时
                  let arr = this.electronicList[this.currentPlatform].list[this.currentType].list[this.currentType+'_0'].list.filter(item=>item.id==this.dragItem.id);
                  if(arr.length==0){
                    this.electronicList[this.currentPlatform].list[this.currentType].list[this.currentType+'_0'].list.push(newItem)
                  }
                }
              }
            }
          }
          this.setColor();
        }
        this.$forceUpdate();
      }
    }
  },
};
</script>
<style lang="less" scoped>
// @import "../../../styles/button.less";
.fc {
  color: #2d8cf0;
  font-size: 1rem;
}
@active: #2d8cf0;
@icon-close-border: #cecece;
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  width: 20px;
  border-radius: 10px;
  background: #2d8cf0;
}
.move {
  cursor: move;
}
.cd{
  cursor: default
}
.ft16 {
  color:#666666;
}
.po-re {
  position: relative;
}
.gamename {
  padding-right:3px; 
  overflow: hidden;
  height: 35px;
  line-height: 35px;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-size: .875rem /* 14/16 */;
}
.lotterType {
  border-radius: 20px;
  border: solid 1px #62b1fd;
  height: 42px;
  span {
    vertical-align: middle;
  }
}
.fontColor {
  color: #62b1fd;
}

//电子游艺排序、
.hotActive {
  background: #2d8cf0;
  color: white;
  .close {
    color: #ccc;
  }
  .bianji {
    color: white;
  }
}
/deep/.ivu-tabs-bar {
  border:none;
}
.gamebox {
  background: #f6f6f8;
  min-height: 60px;
  line-height: 60px;
  border: 1px solid #dcdcdc;
}
.gameListBox {
  background: #f6f6f8;
  max-height:450px;
  // padding-top: 20px;
  // padding-bottom: 20px;
  box-sizing: border-box;
  line-height: 60px;
  border: 1px solid #dcdcdc;
  overflow-y: auto;
  overflow-x: hidden;
  button {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.title {
  position: relative;
  // span{
  //   height: 35px;
  //   line-height: 35px

  // }
}

.biaoji{
  position: absolute;
  top: -15px;
  right: 0px;
  border-radius: 3px;
  font-size: .75rem;
  background: white;
}
.close {
  position: absolute;
  top: 4px;
  right: 7px;
  color: #ccc;
  text-align: center;
  line-height: 20px;
  width: 20px;
  height: 20px;
  // background: #f0ebeb;
  background: white;
  box-sizing: border-box;
  border:1px solid #dcdcdc;
  border-radius: 50%;
  z-index: 100
}
.close:hover {
  color:red;
  border:1px solid red;
}
.titbox {
  text-align: center;
  line-height: 60px;
  border: 1px solid #dcdcdc;
  background: #f6f6f8;
  color: #666666;
  display: block;
  height: 60px;
  width: 100%;
}
.line {
  display:inline-block;
  vertical-align: top !important;
  font-size: 0.75rem; 
  line-height: 35px;
}

/deep/.super {
  background: white;
  color: #dfd3d3;
}
.w50x {
  background:#f6f6f8;
}
.input {
  width: 100%;
  text-indent: 10px;
  border-radius: 3px;
  color:#444;
  border:1px solid #e4e4e4;
}
.btnBox {
  background:#f6f6f8;
  width:100%;
  height:100%;
  text-align:left;
  border:0;
  display: block;
}
.gamePlatform{
  position: absolute;
  bottom: 2px;
  right: 16px;
  width: 40px;
  height: 16px;
  background: #c2dffd;
  z-index: 100;
  color:#5188be;
  line-height: 16px;
  text-align: center;
  font-size: 0.75rem;
}
.gameLock {
  position: absolute;
  top: -14px;
  left: 6px;
  height: 20px;
  z-index: 100;
}
.bianji {
  position: absolute;
  top: 9px;
  left: 20px;
  color: #ccc;
}
.sanjiaoxing{
    display:block;
    width:0;
    height:0;
    border-width:8px 0 8px 5px;
    border-style:solid;
    border-color:transparent transparent transparent white;/*透明 透明 透明 黄*/
    position:absolute;
    top:0px;
    left:0px;
}
// .ivu-tabs{
//   overflow:visible;
// }
/deep/.ivu-tabs-nav {
  font-size: 1rem !important;
  font-weight: 549;
}
.ivu-btn {
  height: 36px !important;
}
.hotActive.super{
  background: #62b1fd;
}
.ivu-tabs{
  overflow:visible;
}
/deep/.ivu-form-item-label {
  padding-right:0 !important; 
}
/deep/.ivu-form-item-content{
  text-align: left;
  padding-left:20px; 
}
</style>