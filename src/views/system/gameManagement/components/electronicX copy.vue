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
              :class="{'hotActive':aKey==i}"
              @click="() => { aKey=i ,setColor()}"
              :key="item.id"
              v-for="(item,i) in aList"
            >
              <span class="ft14">{{item.name}}</span>
              <span
                class="biaoji pl5 pr5 cd"
                v-if="item.leftColumn"
              >
                <span class="ib sanjiaoxing"></span>
                移动侧栏
              </span>
            </Button>
            <Input
              class="w135x ml20"
              v-if="aList[aKey].games.length"
              placeholder="请输入关键字"
              v-model="text"
              clearable
            />
            <div class="lh60 txt-a xColor" v-if="aList.length==0">暂未设置标签,请前往排序类别配置</div>
            <div
              class="mb20 gamebox mt20"
              v-if="text&&aList[aKey].games.filter(item=>item.name.includes(text)).length!=0"
            >
              <div
                class="w220x txt-a ib po-re h60"
                v-for="(item,i) in aList[aKey].games.filter(item=>item.name.includes(text))"
                :key="item.id"
              >
                <Button
                  class="w187x ft14"
                  :class="{'move':isEdit&&!(adminType!='super'&&item.slock==1),'super':isEdit&&adminType!='super'&&item.slock==1}"
                  :draggable="!isEdit?false:(adminType!='super'&&item.slock==1)?false:true"
                  @dragstart.native="menuItemDrag('搜索标签',item,i)"
                  @dragover.native="menuItemOver"
                  @dragend.native="menuItemDragEnd"
                >
                  <span class="ib gamename w110x">{{item.name}}</span>
                  <span class="line" v-if="typeId==10001&&item.line">({{item.line}})</span>
                </Button>
                <Icon
                  class="close cs"
                  v-if="isEdit&&(adminType=='super'||!item.slock)"
                  @click.stop="remove('a',item.id)"
                  type="md-close"
                />
                <Icons
                  :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                  v-if="(isEdit || item.lock == 1 ||item.slock)"
                  @click.native="lockGame(item.lock,aList[aKey].games.filter(item=>item.name.includes(text)),i)"
                  :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                  :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                  class="gameLock"
                  size="20"
                ></Icons>
                <span class="line gamePlatform">
                  <span class="ib sanjiaoxing"></span>
                  {{item.className}}
                </span>
              </div>
            </div>
            <div
              v-if="aList[aKey].games.length==0&&text"
              class="txt-a mb20 mt20"
              style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
            >
              <span>暂无数据!</span>
            </div>
            <div
              v-if="aList[aKey].games.filter(t=>t.name.includes(text)).length==0&&aList[aKey].games.length!=0&&text"
              class="txt-a mb20 mt20"
              style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
            >
              <span>匹配不到搜索关键词！请重新输入关键字</span>
            </div>
            <div
              class="titbox mb20 mt20"
              v-if="aList[aKey].games.length==0&&aList.length!=0"
              @drop="menuItemDrop($event,i,'标签',aList[aKey].games)"
              @dragover.prevent
            >{{isEdit?'可拖动下方游戏进行添加并排序':'编辑添加游戏'}}</div>
            <div
              class="mb20 gamebox mt20 aaa"
              v-if="aList[aKey].games.length"
              @drop="menuItemDrop($event,aList[aKey].games.length-1,'标签',aList[aKey].games)"
              @dragover.prevent
            >
              <div
                class="w220x txt-a ib po-re h60"
                v-for="(item,i) in aList[aKey].games"
                @drop.stop="menuItemDrop($event,i,'标签',aList[aKey].games)"
                :key="item.id"
              >
                <Button
                  class="w187x ft14"
                  :class="{'move':isEdit&&!(adminType!='super'&&item.slock==1),'super':isEdit&&adminType!='super'&&item.slock==1}"
                  :draggable="!isEdit?false:(adminType!='super'&&item.slock==1)?false:true"
                  @dragstart.native="menuItemDrag('标签',item,i)"
                  @dragover.native="menuItemOver"
                >
                  <span class="ib gamename w110x">{{item.name}}</span>
                  <span class="line" v-if="typeId==10001&&item.payline">({{item.payline}})</span>
                </Button>
                <Icon
                  class="close cs"
                  v-if="isEdit&&(adminType=='super'||!item.slock)"
                  @click.stop="remove('a',item.id)"
                  type="md-close"
                />
                <Icons
                  :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                  v-if="(isEdit || item.lock == 1 ||item.slock)"
                  @click.native="lockGame(item.lock,aList[aKey].games,i)"
                  :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                  :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                  class="gameLock"
                  size="20"
                ></Icons>
                <span class="line gamePlatform">
                  <span class="ib sanjiaoxing"></span>
                  {{item.className}}
                </span>
              </div>
            </div>
            <div v-if="isEdit&&aList.length">
              <div class="mb20 fc">
                {{typeId==10001?'电子全部游戏':typeId==10005?'捕鱼全部游戏':'棋牌全部游戏'}}
                <Input class="w135x ml20" placeholder="请输入关键字" v-model="text2" clearable />
              </div>
              <div class="mb20 gameListBox" v-if="allGames.filter(item=>item.name.includes(text2)).length" @scroll.passive="getScroll($event,1)">
                <div
                  v-if="i>=minNum1&&i<=maxNum1"
                  class="ib w220x txt-a po-re h60"
                  v-for="(item,i) in allGames.filter(item=>item.name.includes(text2))"
                  :draggable="!isEdit?false:item.color=='1'?false:true"
                  @dragstart="menuItemDrag('平台',item,i)"
                  @dragover="menuItemOver"
                  @dragend="menuItemDragEnd"
                  :key="item.id"
                >
                  <Button class="w187x ft14 title" :class="(isEdit&&item.color==1)?'super':'move'">
                    <span class="ib gamename w110x">{{item.name}}</span>
                    <span class="line" v-if="typeId==10001&&item.payline">({{item.payline}})</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:2px">
                    <span class="ib sanjiaoxing"></span>
                    {{item.className}}
                  </span>
                </div>
                <div v-else class="ib w220x fl txt-a po-re h60"></div>
              </div>
              <div v-if='allGames.length==0' class="txt-a gameListBox b">暂无数据</div>
              <div v-if='allGames.length!=0&&allGames.filter(item=>item.name.includes(text2)).length==0' class="txt-a gameListBox b">匹配不到搜索关键词！请重新输入关键字</div>
            </div>
          </TabPane>
          <!-- 平台 -->
          <TabPane :label="typeId=='10004'?'棋牌游戏平台':typeId=='10005'?'捕鱼游戏平台':'电子游艺平台'" key="1">
            <div class="mb20">
              <Button
                class="mr20 mb20 w135x title"
                v-for="(item,i) in bList"
                :class="{'hotActive':bKey1==i}"
                @click.native.prevent.stop="setList(i,0,0)"
                :key="item.id"
              >
                <span class="ft14">{{item.name}}</span>
              </Button>
            </div>
            <Input
              v-if="typeId=='10005'&&bList.length"
              class="w135x mb20"
              placeholder="请输入关键字"
              v-model="text"
              clearable
            />
            <div v-if="type==10005&&bList.length==0" class="lh60 txt-a xColor">该平台暂未配置平台,请前往排序类别配置</div>
            <!-- 捕鱼全部游戏--搜索 -->
            <div
              class="mb20 gameListBox"
              v-if="typeId==10005&&text&&bList[bKey1].games.length"
            >
              <div
                class="ib w220x txt-a po-re h60"
                v-for="(item,i) in bList[bKey1].games.filter(item=>item.name.includes(text))"
                :key="item.id"
              >
                <Button
                  class="w187x ft14 title"
                  :class="{'super':isEdit&&adminType!='super'&&item.slock==1,'move':isEdit&&!(adminType!='super'&&item.slock==1)}"
                  :draggable="isEdit&&!(adminType!='super'&&item.slock=='1')"
                  @dragstart.native="menuItemDrag('搜索游戏',item,i)"
                  @dragover.native="menuItemOver"
                  @dragend.native="menuItemDragEnd"
                >
                  <span class="ib gamename w110x">{{item.name}}</span>
                </Button>
                <span class="line gamePlatform" style="bottom:2px" v-if="bList[bKey1].name=='全部'">
                  <span class="ib sanjiaoxing"></span>
                  {{item.className}}
                </span>
                <Icons
                  :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                  v-show="(isEdit || item.lock == 1 ||item.slock)"
                  @click.native="lockGame(item.lock,bList[bKey1].games,i)"
                  :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                      :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                  class="gameLock cs"
                  size="20"
                ></Icons>
              </div>
            </div>
            <div
              v-if="type==10005&&bList[bKey1].games.length==0&&text"
              @drop="menuItemDrop($event,i,'游戏',bList[bKey1].games,typeId)"
              @dragover.prevent
              class="txt-a mb20"
              style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
            >
              <span>暂无数据!</span>
            </div>
            <!-- 捕鱼游戏 -->
            <div
              class="mb20 gameListBox"
              v-if="typeId==10005"
              :style="bList[bKey1].games.length==0?'display:none':''"
              @drop="menuItemDrop($event,bList[bKey1].games.length-1,'游戏',bList[bKey1].games,typeId)"
              @dragover.prevent
            >
              <div
                class="ib w220x txt-a po-re h60"
                v-if="i>=minNum3&&i<=maxNum3"
                v-for="(item,i) in bList[bKey1].games"
                :key="item.id"
                @drop.stop="menuItemDrop($event,i,'游戏',bList[bKey1].games,typeId)"
              >
                <Button
                  class="w187x ft14 title"
                  :class="{'super':isEdit&&adminType!='super'&&item.slock==1,'move':isEdit&&!(adminType!='super'&&item.slock==1)}"
                  :draggable="isEdit&&!(adminType!='super'&&item.slock=='1')"
                  @dragstart.native="menuItemDrag('游戏',item,i)"
                  @dragover.native="menuItemOver"
                  @dragend.native="menuItemDragEnd"
                >
                  <span class="ib gamename w110x">{{item.name+'1'}}</span>
                </Button>
                <span class="line gamePlatform" style="bottom:2px" v-if="bList[bKey1].name=='全部'">
                  <span class="ib sanjiaoxing"></span>
                  {{item.className}}
                </span>
                 <Icon
                  class="close cs"
                  v-if="isEdit&&(adminType=='super'||!item.slock)&&bList[bKey1].name!='全部'"
                  @click.stop="remove('b',item.id)"
                  type="md-close"
                />
                <Icons
                  :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                  v-show="(isEdit || item.lock == 1 ||item.slock)"
                  @click.native="lockGame(item.lock,bList[bKey1].games,i)"
                  :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                      :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                  class="gameLock cs"
                  size="20"
                ></Icons>
              </div>
              <div v-else class="ib w220x txt-a po-re h60 fl"></div>
            </div>
            <div
              v-if="type==10005&&bList[bKey1].games.length==0"
              @drop="menuItemDrop($event,i,'游戏',bList[bKey1].games,typeId)"
              @dragover.prevent
              class="txt-a mb20"
              style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
            >
              <span>暂无数据!</span>
            </div>
          <!-- 二级分类 -->
            <div class="mb20" v-if="typeId!='10005'">
              <div class="mb20">
                二级分类名称 :
                <span class="fc ml20" style="font-size:0.875rem ">游戏类型</span>
              </div>
              <div class="platformBtn" v-if="showTwo&&typeId!='10005'" style="line-height:50px">
                <Button
                  class="mr20 mb20 w135x title"
                  :class="{'hotActive':bKey2==i}"
                  @click.native=" setList(bKey1,i,0)"
                  v-for="(item,i) in bList[bKey1].list"
                  :key="item.id"
                >
                  <span class="ft14">{{item.name}}</span>
                </Button>
                <Input
                  v-if="typeId!='10001'"
                  class="w135x mb20 ml20"
                  placeholder="请输入关键字"
                  v-model="text"
                  clearable
                />
              </div>
              <div v-else class="lh60 txt-a xColor">该平台暂未配置二级分类,请前往排序类别配置</div>
            </div>
            <!-- 棋牌三级分类 -->
            <div class="mb20" v-if="typeId!='10001'&&showTwo&&text">
              <div class="gameListBox" style="max-height:200px" v-if="bList[bKey1].list[bKey2].games.length&&text">
                <div
                  class="w220x txt-a po-re ib h60"
                  v-for="(item,i) in bList[bKey1].list[bKey2].games.filter(t=>t.name.includes(text))"
                  :key="item.id"
                >
                  <Button
                    class="w187x ft14 title"
                    :class="{'super':isEdit&&adminType!='super'&&item.slock==1,'move':isEdit&&!(adminType!='super'&&item.slock==1)}"
                    :draggable="isEdit&&!(adminType!='super'&&item.slock=='1')"
                    @dragstart.native="menuItemDrag('搜索游戏',item,i)"
                    @dragover.native="menuItemOver"
                    @dragend.native="menuItemDragEnd"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:3px">
                    <span class="ib sanjiaoxing"></span>
                    {{item.className}}
                  </span>
                  <Icons
                    :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                    v-show="(isEdit || item.lock == 1 ||item.slock)"
                    @click.native="lockGame(item.lock,bList[bKey1].list[bKey2].games.filter(item=>item.name.includes(text)),i)"
                    :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                      :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                    class="gameLock cs"
                    size="20"
                  ></Icons>
                  <Icon
                    v-show="isEdit&&bList[bKey1].list[bKey2].name!='全部游戏'"
                    class="close cs"
                    style="top:6px, right:3px"
                    @click.stop="remove('b',item.id)"
                    type="md-close"
                  />
                </div>
              </div>
              <div
                class="lh60 txt-a mb20"
                @drop="menuItemDrop($event,i,'游戏',bList[bKey1].list[bKey2].games,typeId)"
                @dragover.prevent
                style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
                v-if="text&&bList[bKey1].list[bKey2].games.filter(t=>t.name.includes(text)).length==0"
              >暂无数据</div>
            </div>
            <!-- 棋牌三级分类 -->
            <div class="mb20" v-if="typeId!='10001'&&showTwo">
              <div
                class="gameListBox"
                v-if="bList[bKey1].list[bKey2].games.length"
                @drop.stop="menuItemDrop($event,i,'游戏',bList[bKey1].list[bKey2].games,typeId)"
                @dragover.prevent
              >
                <div
                  class="w220x txt-a po-re ib h60"
                  v-for="(item,i) in bList[bKey1].list[bKey2].games"
                  :key="item.id"
                  v-if="i>=minNum3&&i<=maxNum3"
                  @drop.stop="menuItemDrop($event,i,'游戏',bList[bKey1].list[bKey2].games,typeId)"
                >
                  <Button
                    class="w187x ft14 title"
                    :class="{'super':isEdit&&adminType!='super'&&item.slock==1,'move':isEdit&&!(adminType!='super'&&item.slock==1)}"
                    :draggable="isEdit&&!(adminType!='super'&&item.slock=='1')"
                    @dragstart.native="menuItemDrag('游戏',item,i)"
                    @dragover.native="menuItemOver"
                    @dragend.native="menuItemDragEnd"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:3px">
                    <span class="ib sanjiaoxing"></span>
                    {{item.className}}
                  </span>
                  <Icons
                    :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                    v-show="(isEdit || item.lock == 1 ||item.slock)"
                    @click.native="lockGame(item.lock,bList[bKey1].list[bKey2].games.filter(item=>item.name.includes(text)),i)"
                    :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                      :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                    class="gameLock cs"
                    size="20"
                  ></Icons>
                  <Icon
                    v-show="isEdit&&bList[bKey1].list[bKey2].name!='全部游戏'"
                    class="close cs"
                    style="top:6px, right:3px"
                    @click.stop="remove('b',item.id)"
                    type="md-close"
                  />
                </div>
              </div>
              <div
                class="lh60 txt-a mb20"
                @drop="menuItemDrop($event,i,'游戏',bList[bKey1].list[bKey2].games,typeId)"
                @dragover.prevent
                style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
                v-if="!bList[bKey1].list[bKey2].games.length"
              >暂无数据</div>
            </div>

            <!-- 电子三级分类 -->
            <div class="mb20" v-if="typeId=='10001'&&showTwo">
              <div class="mb20">
                三级分类名称 :
                <span class="fc ml20" style="font-size:0.875rem ">赔付线数</span>
              </div>
              <div class="platformBtn" style="line-height:50px" v-if="typeId=='10001'&&showTre">
                <Button
                  class="mr20 mb20 w135x title"
                  :class="{'hotActive':bKey3==i}"
                  @click="setList(bKey1,bKey2,i)"
                  v-for="(item,i) in bList[bKey1].list[bKey2].list"
                  :key="item.id"
                >
                  <span class="ft14">{{item.name}}</span>
                </Button>
                <Input class="w135x mb20 ml20" placeholder="请输入关键字" v-model="text" clearable />
              </div>
              <div class="lh60 txt-a xColor" v-if="!showTre">该平台暂未配置三级分类,请前往排序类别配置</div>
              <div
                class="mb20 gameListBox"
                style="max-height:200px"
                @scroll.passive="getScroll($event,2)"
                v-if="showTre&&text&&bList[bKey1].list[bKey2].list[bKey3].games.filter(item=>item.name.includes(text)).length"
                @dragover.prevent
              >
                <div
                  class="ib w220x txt-a po-re h60"
                  v-if="i>=minNum2&&i<=maxNum2"
                  v-for="(item,i) in bList[bKey1].list[bKey2].list[bKey3].games.filter(item=>item.name.includes(text))"
                  :key="item.id"
                >
                  <Button
                    class="w187x ft14 title"
                    :class="{'super':isEdit&&adminType!='super'&&item.slock==1,'move':isEdit&&!(adminType!='super'&&item.slock==1)}"
                    :draggable="isEdit&&!(adminType!='super'&&item.slock=='1')"
                    @dragstart.native="menuItemDrag('搜索游戏',item,i)"
                    @dragover.native="menuItemOver"
                    @dragend.native="menuItemDragEnd"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                    <span class="line" v-if="typeId==10001&&item.payline">({{item.payline}})</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:2px" v-if="bKey1=='0'">
                    <span class="ib sanjiaoxing"></span>
                    {{item.className}}
                  </span>
                  <Icons
                    :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                    v-show="(isEdit || item.lock == 1 ||item.slock)"
                    @click.native="lockGame(item.lock,bList[bKey1].list[bKey2].list[bKey3].games.filter(item=>item.name.includes(text)),i)"
                    :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                      :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                    class="gameLock cs"
                    size="20"
                  ></Icons>
                  <Icon
                    v-show="isEdit"
                    class="close cs"
                    style="top:6px, right:3px"
                    @click.stop="remove('b',item.id)"
                    type="md-close"
                  />
                </div>
                <div v-else class="ib w220x txt-a po-re h60 fl"></div>
              </div>
              <div v-if="showTre">
                <span
                  class="txt-a mb20 ib w100"
                  style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
                  v-if="bList[bKey1].list[bKey2].list[bKey3].games.length==0&&text"
                >暂无数据!</span>
                <span
                  class="txt-a mb20 ib w100"
                  style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
                  v-if="bList[bKey1].list[bKey2].list[bKey3]&&bList[bKey1].list[bKey2].list[bKey3].games.filter(t=>t.name.includes(text)).length==0&&bList[bKey1].list[bKey2].list[bKey3].games.length!=0&&text"
                >匹配不到搜索关键词！请重新输入关键字</span>
                <div
                  class="mb20 gameListBox"
                  @scroll.passive="getScroll($event,3)"
                  :style="bList[bKey1].list[bKey2].list[bKey3].games.length==0?'display:none':''"
                  @drop="menuItemDrop($event,bList[bKey1].list[bKey2].list[bKey3].games.length-1,'游戏',bList[bKey1].list[bKey2].list[bKey3].games,typeId)"
                  @dragover.prevent
                >
                  <div
                    class="ib w220x txt-a po-re h60"
                    v-if="i>=minNum3&&i<=maxNum3"
                    v-for="(item,i) in bList[bKey1].list[bKey2].list[bKey3].games"
                    :key="item.id"
                    @drop.stop="menuItemDrop($event,i,'游戏',bList[bKey1].list[bKey2].list[bKey3].games,typeId)"
                  >
                    <Button
                      class="w187x ft14 title"
                      :class="{'super':isEdit&&adminType!='super'&&item.slock==1,'move':isEdit&&!(adminType!='super'&&item.slock==1)}"
                      :draggable="isEdit&&!(adminType!='super'&&item.slock=='1')"
                      @dragstart.native="menuItemDrag('游戏',item,i)"
                      @dragover.native="menuItemOver"
                      @dragend.native="menuItemDragEnd"
                    >
                      <span class="ib gamename w110x">{{item.name}}</span>
                      <span class="line" v-if="typeId==10001&&item.payline">({{item.payline}})</span>
                    </Button>
                    <span
                      class="line gamePlatform"
                      style="bottom:2px"
                      v-if="bList[bKey1].name=='全部'"
                    >
                      <span class="ib sanjiaoxing"></span>
                      {{item.className}}
                    </span>
                    <Icons
                      :type="item.lock ==!0 ? 'suodingpaixu1' : 'jiesuopaixu'"
                      v-show="(isEdit || item.lock == 1 ||item.slock)"
                      @click.native="lockGame(item.lock,bList[bKey1].list[bKey2].list[bKey3].games,i)"
                      :color="item.lock ==!0&&item.slock!=1 ? '#CECECE'
                      :item.lock ==!0&&item.slock==1?'rgb(255, 38, 38)' : 'orange'"
                      class="gameLock cs"
                      size="20"
                    ></Icons>
                    <Icon
                      v-show="isEdit&&(adminType=='super'||!item.slock)&&!(bList[bKey1].list[bKey2].list[bKey3].name=='全部'&&bList[bKey1].list[bKey2].name=='全部游戏')"
                      class="close cs"
                      style="top:6px, right:3px"
                      @click.stop="remove('b',item.id)"
                      type="md-close"
                    />
                  </div>
                  <div v-else class="ib w220x txt-a po-re h60 fl"></div>
                </div>
                <div
                  v-if="bList[bKey1].list[bKey2].list[bKey3].games.length==0"
                  @drop="menuItemDrop($event,i,'游戏',bList[bKey1].list[bKey2].list[bKey3].games,typeId)"
                  @dragover.prevent
                  class="txt-a mb20"
                  style="line-height:100px;height:102px;background:#f6f6f8;border:1px solid #dcdcdc"
                >
                  <span>暂无数据!</span>
                </div>
              </div>
            </div>
            <!-- 平台全部游戏 -->
            <div v-if="isEdit&&allGamesShow">
              <div class="mb20 fc">
                全部游戏
                <Input class="w135x ml20" placeholder="请输入关键字" v-model="text2" clearable />
              </div>
              <div
                class="mb20 gameListBox"
                @scroll.passive="getScroll($event,4)"
                v-if="isEdit&&allGames.filter(item=>item.name.includes(text2)).length!=0"
              >
                <div
                  v-if="i>=minNum4&&i<=maxNum4"
                  class="w220x txt-a po-re ib h60"
                  v-for="(item,i) in allGames.filter(item=>item.name.includes(text2))"
                  :key="i"
                >
                  <Button
                    class="w187x ft14 title"
                    :class="{'super':item.color,
                      'move':isEdit&&item.color!='1'}"
                    :draggable="!isEdit?false:item.color=='1'?false:true"
                    @dragstart.native="menuItemDrag('全部游戏',item,i)"
                  >
                    <span class="ib gamename w110x">{{item.name}}</span>
                    <span class="line" v-if="typeId==10001&&item.payline">({{item.payline}})</span>
                  </Button>
                  <span class="line gamePlatform" style="bottom:3px">
                    <span class="ib sanjiaoxing"></span>
                    {{item.className}}
                  </span>
                </div>
                <div v-else class="w220x txt-a fl po-re ib h60"></div>
              </div>
            </div>
            <span class="txt-a ib" style="line-height:30px">
              <Icons style="vertical-align:middle" type="suodingpaixu1" size="20" color="#CECECE" />&nbsp;锁定后,排序不会因为用户习惯发生变化
            </span>
          </TabPane>
        </Tabs>
      </Row>
    </Row>
  </div>
</template>
<script>
import { getUserType } from "@/libs/util";
import Icons from "@/components/icons";
import draggable from "vuedraggable";
import { Spin } from "view-design";
import {
  GameSortV4Up //修改
} from "@/api/system";
export default {
  name: "ElectronicX",
  props: {
    isEdit: {
      type: Boolean,
      required: true
    },
    typeId: {
      type: String,
      required: true
    },
    cId: {
      type: String,
      required: true
    },
    dataList: {
      type: Object,
      required: true
    }
  },
  components: {
    draggable,
    Icons
  },
  data() {
    return {
      dataCid: "",
      showTwo: false, //二级分类显示
      showTre: false, //三级分类显示
      allGamesShow: false, //全部游戏显示
      allIndex: "", //全部游戏下标
      minNum1: 0,
      maxNum1: 200,
      minNum2: 0,
      maxNum2: 200,
      minNum3: 0,
      maxNum3: 200,
      minNum4: 0,
      maxNum4: 200,
      activeKey: "0",
      type: "",
      text: "", //搜索
      text2: "",
      spinShow: true,
      beforeId: null,
      dragItem: {}, //被拖动的原素
      dragType: "",
      data: [],
      bKey: 0, //电子游艺默认 key1
      addType: "",
      disabled: false,
      aKey: "0", //电子排序当前热门选中
      bKey1: 0,
      bKey2: 0,
      bKey3: 0,
      allGames: [], //所以游戏
      aList: [], //电子游艺热门标签列表
      bList: [], //电子游艺列表
      adminType: getUserType()
    };
  },
  watch: {
    typeId: {
      handler(newTypeId, oldTypeId) {
        if (newTypeId == oldTypeId) return;
        this.dataCid =
          newTypeId == "10000"
            ? "4"
            : newTypeId == "10001"
            ? "2"
            : newTypeId == "10002"
            ? "6"
            : newTypeId == "10003"
            ? "5"
            : newTypeId == "10004"
            ? "1"
            : newTypeId == "10005"
            ? "3"
            : "7";
        this.aKey = 0;
        this.bKey1 = 0;
        this.bKey2 = 0;
        this.bKey3 = 0;
        this.type = newTypeId;
        this.text = "";
        this.text2 = "";
        if (newTypeId == 10001 || newTypeId == 10004 || newTypeId == 10005)
          this.setDate(newTypeId, this.dataCid);
      },
      deep: true
    },
    isEdit: {
      handler(newTypeId, oldTypeId) {
        if(newTypeId){
          if(this.activeKey=='0'){
            this.allGamesShow = true
          }else if(this.typeId==10005&&this.bList[this.bKey1].name!='全部'){
            this.allGamesShow = true
          }
        }
      },
      deep: true
    },
    spinShow: {
      handler(newTypeId, oldTypeId) {
        if (
          newTypeId == false &&
          (this.typeId == "10001" ||
            this.typeId == "10004" ||
            this.typeId == "10005")
        ) {
          this.$emit("getLoad", false);
        }
      },
      deep: true
    }
  },
  mounted() {
      let _this = this;
      let props = { ..._this._props };
      this.data = props.dataList; //获取全部游戏列表
      this.type=props.typeId;
      this.dataCid = props.cId;
      if(props.typeId==10001||props.typeId==10004||props.typeId==10005){
        this.setDate(props.typeId,props.cId)
      }
  },
  methods: {
    setList(key1, key2, key3) {
      this.bKey1 = key1;
      this.bKey2 = key2;
      this.bKey3 = key3;
      this.showTwo = this.bList[this.bKey1].list.length; //二级分类是否显示
      this.showTre = this.showTwo
        ? this.bList[this.bKey1].list[this.bKey2].list.length
        : 0; //三级分类是否显示
      if (this.type == 10005) {
        if(this.isEdit && this.bList[key1].name!='全部') this.allGamesShow = true
        else this.allGamesShow = false
        this.setAllGame();
        this.setColor();
      }
      if (this.showTwo && this.type == 10004) {
        if(this.activeKey=='1'){
           this.allGamesShow =
          this.bList[this.bKey1].list[this.bKey2].name == "全部游戏"
            ? false
            : true;
        }
        // if(this.bList[this.bKey1].name!='全部'){  //棋牌初始数据
        //   if(this.bList[this.bKey1].list[this.bKey2].name=='全部游戏'){
        //     this.data.allGames[10004].list.forEach(t=>{
        //       if(t.name==this.bList[this.bKey1].name){
        //         this.bList[this.bKey1].list[this.bKey2].games=t.list
        //       }
        //     })
        //   };
        // }else{
        //   if(this.bList[this.bKey1].list[this.bKey2].name=='全部游戏'){
        //     this.bList[this.bKey1].list[this.bKey2].games=[]
        //     this.data.allGames[10004].list.forEach(t=>{
        //       t.list.forEach(m=>{
        //         this.bList[this.bKey1].list[this.bKey2].games.push(m)
        //       })
        //     })
        //   };
        // }
        this.setAllGame();
         this.setColor();
      }
      if (this.type == 10001 && this.showTwo && this.showTre) {
          this.allGamesShow =
          this.bList[this.bKey1].list[this.bKey2].name == "全部游戏" &&
          this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name ==
            "全部"
            ? false
            : true;
          // if(this.bList[this.bKey1].name!='全部'){   //电子初始数据
          //   if(this.bList[this.bKey1].list[this.bKey2].name=='全部游戏'&&this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name=='全部'){
          //     this.data.allGames[10001].list.forEach(t=>{
          //       if(t.name==this.bList[this.bKey1].name){
          //         this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].games=t.list
          //       }
          //     })
          //   };
          // }else{
          //   this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].games=[]
          //   if(this.bList[this.bKey1].name=='全部'&&this.bList[this.bKey1].list[this.bKey2].name=='全部游戏'&&this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name=='全部'){
          //     this.data.allGames[10001].list.forEach(t=>{
          //         t.list.forEach(m=>{
          //           this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].games.push(m)
          //         })

          //     })
          //   }
          // }
        this.setAllGame();
        this.setColor();
      }else{
        if(this.type==10001) this.allGamesShow = false;
      }
      if(this.activeKey==0){
        this.setAllGame();
        this.setColor();
      }
    },
    setAllGame() {
      this.allGames = [];
      if (this.bList[this.bKey1].name == "全部" || this.activeKey == "0") {
        this.data.allGames[this.type]&&this.data.allGames[this.type].list.forEach(t => {
          if (t.list) {
            t.list.forEach(m => {
              this.allGames.push(m);
            });
          }
        });
      } else {
        this.data.allGames[this.type]&&this.data.allGames[this.type].list.forEach(t => {
          if (t.name == this.bList[this.bKey1].name) {
            this.allGames = t.list;
          }
        });
      }
    },
    setDate(typeId, cid) {
      //设置数据
      this.aList = this.data.siteData[cid].list[0].list || [];
      this.bList = this.data.siteData[cid].list[1].list || [];
      this.spinShow = false;
      this.setList(this.bKey1, this.bKey2, this.bKey3);
      this.$forceUpdate();
    },
    remove(type, id) {
      if (type == "a") {
        this.aList[this.aKey].games = this.aList[this.aKey].games.filter(
          t => t.id != id
        );
      } else {
        if (this.typeId == "10001") {
          if(this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name=='全部'){
            this.bList[this.bKey1].list[this.bKey2].list.forEach(t=>{
              t.games= t.games.filter(m=>m.id!=id)
            })
          }else{
            this.bList[this.bKey1].list[this.bKey2].list[
              this.bKey3
            ].games = this.bList[this.bKey1].list[this.bKey2].list[
              this.bKey3
            ].games.filter(t => t.id != id);
          }
        } else if(this.typeId=='10004'){
          this.bList[this.bKey1].list[this.bKey2].games = this.bList[
            this.bKey1
          ].list[this.bKey2].games.filter(t => t.id != id);
        }else {
          this.bList[this.bKey1].games = this.bList[
            this.bKey1
          ].games.filter(t => t.id != id);
        }
      }
      this.setColor()
    },
    quxiao() {
      // this.spinShow = true;
      this.bKey1 = 0;
      this.bKey2 = 0;
      this.bKey3 = 0;
      this.setDate(this.type,this.dataCid)
    },
    getActiveKey(val) {
      //标签平台切换
      this.activeKey = val;
      this.text = "";
      this.text2 = "";
      this.setList(0, 0, 0);
    },
    setColor() {
      //全部平台样式置灰
      if (this.activeKey == "1") {
        //平台
        if (this.type == "10001") {
           if(this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].name=='全部'){
                this.allGames.map(t => {
                  t.color = 0;
                  this.bList[this.bKey1].list[this.bKey2].list[this.bKey3].games.forEach(m=>{
                    if(m.id==t.id) t.color=1;
                  })
                })
              }else{
                this.allGames.forEach(t=>{
                  t.color=0;
                  this.bList[this.bKey1].list[this.bKey2].list.forEach(m=>{
                    if(m.name!='全部'){
                      m.games.forEach(i=>{
                        if(i.id==t.id) t.color=1
                      })
                    }
                  })
                })
                
              }
        } else if(this.type=='10004'){
          //棋牌
          this.allGames.map(t => {
            t.color = 0;
            this.bList[this.bKey1].list[this.bKey2].games.forEach(m => {
              // if (m.name != "全部游戏") {
                // m.games.forEach(i => {
                  if (m.id == t.id) t.color = 1;
                // });
              // }
            });
          });
        }else {
          this.allGames.map(t => {
            t.color = 0;
            this.bList[this.bKey1].games.forEach(m => {
              if(m.id == t.id) t.color=1
            });
          });
        }
      } else {
        //标签
        this.allGames.forEach(item => {
          item.color = 0;
          this.aList[this.aKey].games.map(t => {
            if (t.id == item.id) item.color = 1;
          });
        });
      }
      this.$forceUpdate();
    },
    getScroll(e, type) {
      //数据节流
      let scrollHeight = e.target.scrollHeight;
      let scrollTop = e.target.scrollTop;
      let height = e.target.clientHeight;
      let width = e.target.clientWidth;
      if (type == 1) {
        this.minNum1 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum1 = this.minNum1 + 400;
      }
      if (type == 2) {
        this.minNum2 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum2 = this.minNum2 + 400;
      }
      if (type == 3) {
        this.minNum3 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum3 = this.minNum3 + 400;
      }
      if (type == 4) {
        this.minNum4 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum4 = this.minNum4 + 400;
      }
      if (type == 5) {
        this.minNum5 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum5 = this.minNum5 + 400;
      }
      if (type == 6) {
        this.minNum6 = (scrollTop / 60) * Math.floor(width / 220) - 200;
        this.maxNum6 = this.minNum6 + 400;
      }
      this.$forceUpdate();
    },

    //锁定排序
    lockGame(lock, list, i) {
      if (!this.isEdit) return;
      if(this.adminType != "super"&&list[i].slock) return; 
      this.$set(list[i], "lock", !lock ? 1 : 0);
      if (this.adminType == "super") {
        this.$set(list[i], "slock", lock ? 0 : 1);
      }
      this.$forceUpdate(); //强制更新试图
    },
    //电子游戏排序数据更新
    updateDate() {
      let json = [];
      //标签
      this.aList.forEach(t => {
        let obj = {
          gid: t.id,
          list: t.games
        };
        json.push(obj);
      });
      if (this.type == "10001") {
        this.bList.forEach(t => {
          t.list.forEach(m => {
            if (m.list) {
              m.list.forEach(i => {
                let obj = {
                  gid: i.id,
                  list: i.games
                };
                json.push(obj);
              });
            }
          });
        });
      } else if (this.type == "10004") {
        this.bList.forEach(t => {
          t.list.forEach(m => {
            let obj = {
              gid: m.id,
              list: m.games
            };
            json.push(obj);
          });
        });
      } else {
        this.bList.forEach(t => {
          let obj = {
            gid: t.id,
            list: t.games
          };
          json.push(obj);
        });
      }
      let data = {
        siteId: this.$root.nowSite.id,
        json: JSON.stringify(json)
      };
      GameSortV4Up(data, true).then(res => {
        if (res && res.code == 200) {
          this.$Message.success("数据更新成功");
        }
        this.$emit("getLoad", false);
      });
    },
    //排序超管锁提示
    testSuper(list, newIndex, i) {
      let newItem = JSON.parse(JSON.stringify(this.dragItem));
      if (this.adminType != "super") {
        let arr = [];
        list.map((item, i) => {
          if (item.slock == 1) arr.push(i);
        });
        arr.sort((a, b) => {
          return a - b;
        });
        let minIndex = arr[arr.length - 1] || null;
        if (newIndex < minIndex && minIndex) {
          this.$Message.error("请排放在超管锁定之后");
          return;
        }
        list.splice(newIndex + 1, 0, newItem);
      } else {
        list.splice(newIndex + 1, 0, newItem);
      }
      this.$forceUpdate();
      this.$Message.success("添加成功");
      this.setColor()
    },
    //拖拽排序
    menuItemDrag(type, item, i) {
      this.i = i;
      this.dragItem = {...item, hot:0,lock:0,slock:0};
      this.dragType = type;
    },
    menuItemDragEnd() {
      this.i = null;
    },
    menuItemOver(e) {
      if (this.i !== null) e.preventDefault();
    },
    menuItemDrop($event, newIndex, type, list, typeId) {
      if (!this.isEdit) return;
      if (this.i !== null) {
        if (this.dragType == type) {
          //排序
          if (
            (this.dragType == "搜索游戏" || this.dragType == "搜索标签") &&this.text
          )
            return;
          // if (list[newIndex].name == "全部") return;
          if (this.i == newIndex) return;
          if (this.adminType != "super") {
            let arr = [];
            list.map((item, i) => {
              if (item.slock == 1) arr.push(i);
            });
            arr.push(this.i);
            arr.sort((a, b) => {
              return a - b;
            });
            let currentIndex = arr.indexOf(this.i);
            let minIndex = arr[currentIndex - 1];
            let maxIndex = arr[currentIndex + 1] || 99999;
            // if(newIndex<=minIndex||newIndex>=maxIndex) return
            if (newIndex <= minIndex) {
              this.$Message.error("请排在超管锁定之后");
              return;
            } else if (newIndex >= maxIndex) {
              this.$Message.error("请排在超管锁定之前");
              return;
            }
          }
          let newObj = list[this.i];
          list.splice(this.i, 1);
          list.splice(newIndex, 0, newObj);
          list.find((t, i) => {
            if (t.id == this.beforeId) this.currentPlatform = i;
          });
        } else {
          //拖拽新增
          if (this.dragType == "游戏" && type == "平台") return;
          if (this.dragType == "搜索游戏" || this.dragType == "搜索标签") {
            if (this.adminType != "super") {
              let arr = [];
              list.map((item, i) => {
                if (item.slock == 1) arr.push(i);
              });
              let index;
              list.map((item, i) => {
                if (item.id == this.dragItem.id) {
                  index = i;
                }
              });
              arr.push(index);
              arr.sort((a, b) => {
                return a - b;
              });
              let currentIndex = arr.indexOf(index);
              let minIndex = arr[currentIndex - 1];
              let maxIndex = arr[currentIndex + 1] || 99999;
              if (newIndex <= minIndex) {
                this.$Message.error("请排在超管锁定之后");
                return;
              } else if (newIndex >= maxIndex) {
                this.$Message.error("请排在超管锁定之前");
                return;
              }
            }
            list.map((item, i) => {
              if (item.id == this.dragItem.id) {
                list.splice(i, 1);
                if (i >= newIndex + 1) {
                  list.splice(newIndex + 1, 0, this.dragItem);
                } else if (i < newIndex + 1) {
                  list.splice(newIndex, 0, this.dragItem);
                } else {
                  return;
                }
              }
            });
            this.$forceUpdate();
            return;
          } else {
            let newItem = JSON.parse(JSON.stringify(this.dragItem));
            if (type == "游戏") {
              if (typeId == "10001") {
                //电子排序
                if (
                  this.bList[this.bKey1].list[this.bKey2].name != "全部游戏" ||
                  this.bList[this.bKey1].list[this.bKey2].list[this.bKey3]
                    .name != "全部"
                ) {
                  //二级分类不为全部时3级分类不为全部时
                  this.testSuper(list, newIndex, this.i);
                  this.bList[this.bKey1].list[this.bKey2].list.forEach(t=>{
                    if(t.name=='全部'){
                      let arr = t.games.filter(i=>i.id==newItem.id)
                      if(arr.length==0){
                        t.games.push(newItem)
                      }
                    }
                  })
                }
              } else if(typeId==10004){
                //棋牌捕鱼排序
                if (
                  this.bList[this.bKey1].list[this.bKey2].name != "全部游戏"
                ) {
                  //二级分类不为全部时3级分类不为全部时
                  this.testSuper(list, newIndex, this.i);
                }
              }else{
                 this.testSuper(list, newIndex, this.i);
              }
            } else {
              this.testSuper(list, newIndex, this.i);
            }
          }
          this.setColor();
        }
        this.$forceUpdate();
      }
    }
  }
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
.cd {
  cursor: default;
}
.ft16 {
  color: #666666;
}
.po-re {
  position: relative;
}
.gamename {
  padding-right: 3px;
  overflow: hidden;
  height: 35px;
  line-height: 35px;
  text-overflow: ellipsis;
  vertical-align: middle;
  font-size: 0.875rem /* 14/16 */;
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
  border: none;
}
.gamebox {
  background: #f6f6f8;
  min-height: 60px;
  line-height: 60px;
  border: 1px solid #dcdcdc;
}
.gameListBox {
  background: #f6f6f8;
  max-height: 450px;
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

.biaoji {
  position: absolute;
  top: -11px;
  right: 0px;
  font-size: 0.75rem;
  color:white;
  background:red;
  border-radius:0
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
  border: 1px solid #dcdcdc;
  border-radius: 50%;
  z-index: 100;
}
.close:hover {
  color: red;
  border: 1px solid red;
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
  display: inline-block;
  vertical-align: top !important;
  font-size: 0.75rem;
  line-height: 35px;
}

/deep/.super {
  background: white;
  color: #dfd3d3;
}
.w50x {
  background: #f6f6f8;
}
.input {
  width: 100%;
  text-indent: 10px;
  border-radius: 3px;
  color: #444;
  border: 1px solid #e4e4e4;
}
.btnBox {
  background: #f6f6f8;
  width: 100%;
  height: 100%;
  text-align: left;
  border: 0;
  display: block;
}
.gamePlatform {
  position: absolute;
  bottom: 2px;
  right: 16px;
  width: 62px;
  height: 16px;
  background: #c2dffd;
  z-index: 100;
  color: #5188be;
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
.sanjiaoxing {
  display: block;
  width: 0;
  height: 0;
  border-width: 8px 0 8px 5px;
  border-style: solid;
  border-color: transparent transparent transparent white; /*透明 透明 透明 黄*/
  position: absolute;
  top: 0px;
  left: 0px;
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
.hotActive.super {
  background: #62b1fd;
}
.ivu-tabs {
  overflow: visible;
}
/deep/.ivu-form-item-label {
  padding-right: 0 !important;
}
/deep/.ivu-form-item-content {
  text-align: left;
  padding-left: 20px;
}
</style>