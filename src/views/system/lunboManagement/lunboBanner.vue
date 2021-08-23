<template>
    <div :style="screen < 1500 ? 'zoom:0.67' : screen >= 1500 && screen < 2000 ? 'zoom:0.72' : ''">
        <div v-for="(t, x) in dataList" class="mb10" :key="'chat' + x">
            <div class="v2-button mb10 ft18"  :style="screen < 1500 ? 'height:60px;line-height:60px' : ''">
                <Icons :type="t.clientType == 'pc' ? 'zhongduan-PC' : 'zhongduan-shouji'" color="#C5C5C5" />
                {{ t.clientType == 'pc' ? 'PC' : 'MB' }}端轮播图
            </div>
            <div class="bannerList">
                <div
                    class="banner mr20 mb20 "
                    v-for="(item, i) in t.body"
                    :key="i"
                    :draggable="draggable"
                    @mousedown="move"
                    @dragstart="menuItemDrag(x, i)"
                    @dragover="menuItemOver"
                    @drop="menuItemDrop($event, x, i,t.body,t.clientType)"
                    @dragend="menuItemDragEnd"
                >
                    <div class="imgbox">
                        <div class="cover" style="cursor:default" @mousedown.stop="hand">
                            <Icon size="26" type="ios-eye-outline" class="cs" @click="viewImg(t.body, x, i)"></Icon>
                        </div>
                        <Img style="border-radius:10px" :src="host + item.imgShow" v-show="show" @load="imgLoad" />
                    </div>
                    <p class="title pl10 move ib" v-if="item.foward_type != '1'">
                        链接地址:
                        {{
                            item.foward_type == '2'
                                ? '真人视讯'
                                : item.foward_type == '3'
                                ? '彩票游戏'
                                : item.foward_type == '4'
                                ? '棋牌游戏'
                                : item.foward_type == '5'
                                ? '电子游艺'
                                : item.foward_type == '6'
                                ? '体育投注'
                                : item.foward_type == '7'
                                ? '捕鱼达人'
                                : item.foward_type == '8'
                                ? '优惠活动'
                                :item.foward_type == '9'
                                ? '存款列表'
                                :item.foward_type=='10'
                                ? '免息借呗'
                                :item.foward_type=='11'
                                ?'余额宝'
                                :item.foward_type=='12'
                                ? '在线客服'
                                :item.foward_type=='13'
                                ?'下载APP':''
                        }}
                    </p>
                    <p class="title pl10 pr10 move ib w100" v-if="item.foward_type == '1'" style=" overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                        <span v-if="item.target != '#'" >链接地址: {{ item.target }}</span>
                    </p>
                    <footer>
                        <div class="left fl w20 txt-a" @mousedown.stop="hand">
                            <i-switch class="ml10" size="large" :value="item.status == 'yes' ? true : false" @on-change="changeState(x, i, item.status)">
                                <span slot="open"></span>
                                <span slot="close"></span>
                            </i-switch>
                        </div>
                        <div class="left fl ml5 title" v-if="t.clientType!='pc'">
                            <span>{{item.ios==true?'IOS':''}}</span>
                            <span>
                                <span v-if="item.ios==true&&item.h5==true">/</span>
                                {{item.h5==true?'H5':''}}
                                <span v-if="item.h5==true&&item.android==true&&item.ios==false">/</span>
                            </span>
                            <span>
                                <span v-if="item.ios==true&&item.android==true&&item.h5==true">/</span>
                                {{item.android==true?'Android':''}}
                            </span>
                           
                        </div>
                        <div class="right fr w30">
                            <span  @mousedown.stop="hand" @click="editBanner(t.clientType, x, i)" class="cs">编辑</span>
                            <span  @mousedown.stop="hand" @click="delLunbo(x, i)" class="cs">删除</span>
                        </div>
                    </footer>
                </div>
                <!-- 新增图片 -->
                <Upload
                    style="cursor:default"
                    class="addBanner banner mb20 w320x txt-a"
                    v-if="t.body.length < 12"
                    :headers="uploadForm.headers"
                    :action="uploadForm.action"
                    :data="uploadForm.data"
                    :name="uploadForm.name"
                    multiple
                    :on-success="uploadSuccess"
                    :format="['jpg', 'jpeg', 'png', 'gif']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                >
                    <div class="upLoad txt-a">
                        <div class="addImg" @click="addLunbo(x, t.clientType)">
                            <Icons type="tianjialunbotuanniu" color="#adadad" size="36"></Icons>
                        </div>
                        <p class="size">{{ t.slideshow_size.replace('x', ' * ') }}</p>
                    </div>
                </Upload>
            </div>
        </div>
        <!-- 新增弹窗 -->
        <Modals
            ref="addLunbo"
            :title="
                clientType == 'pc' && !isEdit
                    ? 'PC端banner新增'
                    : clientType == 'pc' && isEdit
                    ? 'PC端banner编辑'
                    : clientType != 'pc' && !isEdit
                    ? 'MB端banner新增'
                    : 'MB端banner编辑'
            "
            :width="isEdit ? 760 : addImgList.length < 2 ? 800 : 1200"
            @closeModal="closeModal"
        >
            <div slot="content">
                <div class="imglist mb20">
                    <div class="imgOne" :style="isEdit ? 'width:720px;margin-top:0' : ''" v-for="(item, i) in addImgList" :key="'div' + i" v-if="!isEdit || item.imgShow">
                        <div class="box" :style="isEdit ? 'height:320px' : ''">
                            <Icon size="18" class="close" type="md-close" @click="remove(i)" />
                            <div class="cover" :style="isEdit ? 'line-height:320px' : ''">
                                <Icon size="26" class="cs" type="ios-eye-outline" @click="handleView(host + item.imgShow)"></Icon>
                            </div>
                            <Img :src="host + item.imgShow" />
                        </div>
                        <Form :label-width="90" label-position="left">
                            <FormItem label="链接地址">
                                <Select v-model="item.foward_type" v-if="clientType=='pc'" transfer>
                                    <Option :value="t.value" v-for="(t, i) in options" :key="'item' + i">{{ t.name }}</Option>
                                </Select>
                                <Select v-model="item.foward_type" v-else transfer>
                                    <Option :value="t.value" v-for="(t, i) in options2" :key="'item' + i">{{ t.name }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem v-if="item.foward_type == 1">
                                <Input v-model="item.target" placeholder="请使用http://开头" />
                            </FormItem>
                            <FormItem label="开放终端" class="fl" v-if="clientType!='pc'">
                                <Checkbox v-model="item.h5">H5端</Checkbox>
                                <Checkbox v-model="item.ios">IOS端</Checkbox>
                                <Checkbox v-model="item.android">Android端</Checkbox>
                            </FormItem>
                        </Form>
                    </div>
                    <Upload
                        v-if="(!isEdit && addImgList.length < 9) || (isEdit && addImgList[0] && !addImgList[0].imgShow)"
                        :style="isEdit ? 'width:720px;height:320px;margin-bottom:40px' : ''"
                        :headers="uploadForm.headers"
                        :action="uploadForm.action"
                        :data="uploadForm.data"
                        :name="uploadForm.name"
                        :multiple="!isEdit"
                        :on-success="uploadSuccess"
                        :format="['jpg', 'jpeg', 'png', 'gif']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                    >
                        <div class="upLoad2 txt-a" :style="isEdit ? 'width:720px;height:320px' : ''">
                            <p class="addImg" :style="isEdit ? 'border:0' : ''">
                                <Icons :type="isEdit ? 'xiangji' : 'tianjialunbotuanniu'" :color="isEdit ? '#2d8cf0' : '#adadad'" :size="isEdit ? 80 : 36"></Icons>
                            </p>
                            <p class="size2" :style="isEdit ? 'margin-top:220px' : ''">{{ editType == '0' ? pc_size : mb_size }}</p>
                        </div>
                    </Upload>
                </div>
                <div class="pt20 pb20 txt-a" style="border-top:1px solid rgba(199, 195, 195, 0.5)">
                    <Button type="primary" @click="submit" class="pt10 pb10 pl80 pr80 ft16 ivu-btn submit" :loading="$root.editBtnLoading">确认新增</Button>
                </div>
            </div>
        </Modals>
        <!-- 查看轮播弹窗 -->
        <Modals ref="lookLunbo" @closeModal="closeModal2" :title="visible?'图片预览':this.clientType == 'pc' ? '查看PC端banner' : '查看MB端banner'" width="1600" height="630">
            <div slot="content" :class="visible?'':'mb30'">
                <div class="lbList" v-if='!visible'>
                    <span class="toLeft cs" @click="toLeft"><Icon size="26" color="#b3b3b3" type="ios-arrow-back"></Icon></span>
                    <div class="odiv">
                        <p v-for="(item, i) in lookLunboList" :class="imgIndex == i ? 'active op' : 'op'" :key="'lunbo' + i">
                            <Img :src="host + item.imgShow" />
                        </p>
                    </div>
                    <span class="toRight cs" @click="toRight"><Icon size="26" color="#b3b3b3" type="ios-arrow-forward"></Icon></span>
                    <ul>
                        <li v-for="(item, i) in lookLunboList" @click="setIndex(i)" :class="imgIndex == i ? 'actived cs' : 'cs'" :key="'look' + i"></li>
                    </ul>
                </div>
                <div class="lbList txt-a" style="height:610px" v-else>
                    <img :src="imgName" v-if="visible" style="height:100%" />
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import Icons from '_c/icons';
import Modals from '@/components/modals';
import { activityImgConfigList, logoList, addLogoHandler } from '@/api/system';
import { getUserType, getToken } from '@/libs/util';
import { setTimeout } from 'timers';
export default {
    name: 'lunboBanner',
    components: {
        Icons,
        Modals
    },
    data() {
        return {
        
            h5:false,
            imgCount: 0,
            show: false,
            draggable: '',
            flag: false,
            lunboIndex: '0',
            screen: screen.width,
            pc_size: '0',
            mb_size: '0',
            imgIndex: 0,
            lookLunboList: [],
            editType: 0, //编辑类型
            editIndex: '',
            dataList: [], //图片数据
            host: '',
            isEdit: false,
            clientType: '',
            promotionId: '',
            visible: false,
            adminType: getUserType(),
            addImgList: [], //新增图片
            // editImgList: [], //编辑图片
            authInPage: JSON.parse(localStorage.authInPage),
            uploadForm: {
                headers: { Authorization: getToken() },
                action: '/api/v2/uploadImg',
                data: { siteId: this.$root.nowSite.id },
                name: 'img',
                defaultList: [],
                path: '',
                src: ''
            },
            options: [//pc
                { name: '自定义', value: '1' },
                { name: '真人视讯', value: '2' },
                { name: '彩票游戏', value: '3' },
                { name: '棋牌游戏', value: '4' },
                { name: '电子游艺', value: '5' },
                { name: '体育投注', value: '6' },
                { name: '捕鱼达人', value: '7' },
                { name: '优惠活动', value: '8' },
                {name:'存款列表',value:'9'},
                {name:'免息借呗',value:'10'},
                {name:'在线客服',value:'12'},
                {name:'下载APP',value:'13'},
            ],
            options2: [ //mb
                { name: '自定义', value: '1' },
                { name: '真人视讯', value: '2' },
                { name: '彩票游戏', value: '3' },
                { name: '棋牌游戏', value: '4' },
                { name: '电子游艺', value: '5' },
                { name: '体育投注', value: '6' },
                { name: '捕鱼达人', value: '7' },
                { name: '优惠活动', value: '8' },
                {name:'存款列表',value:'9'},
                {name:'免息借呗',value:'10'},
                {name:'余额宝',value:'11'},
                {name:'在线客服',value:'12'},
                {name:'下载APP',value:'13'},
            ],
            // options2: [{ name: '自定义上线', value: '1' }, { name: '即时上线', value: '2' }]
        };
    },
    watch: {
        '$root.nowSite.id': function(val, oldval) {
            this.getData();
        }
    },
    created() {
        this.host = location.origin;
        //获取轮播尺寸
        this.$nextTick(() => {
            const data = { siteId: this.$root.nowSite.id };
            activityImgConfigList(data, true).then(res => {
                if (res.code == 200) {
                    res.data.map(item => {
                        if (item.client_type == 'pc') {
                            this.pc_size = item.slideshow_size;
                        }
                        if (item.client_type != 'pc') {
                            this.mb_size = item.slideshow_size;
                        }
                    });
                }
                this.getData();
            });
        });
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        closeModal() {
            this.imgCount = 0;
        },
        closeModal2() {
            this.visible = false;
        },
        imgLoad() {
            let _this = this;
            _this.show = true;
        },
        move() {
            this.draggable = true;
        },
        hand() {
            this.draggable = false;
        },
        setIndex(i) {
            this.imgIndex = i;
        },
        toLeft() {
            this.imgIndex--;
            if (this.imgIndex < 0) {
                this.imgIndex = this.lookLunboList.length - 1;
            }
        },
        toRight() {
            this.imgIndex++;
            if (this.imgIndex > this.lookLunboList.length - 1) {
                this.imgIndex = 0;
            }
        },
        //查看轮播图片
        viewImg(val, x, i) {
            this.$nextTick(() => {
                this.lookLunboList = val;
                this.clientType = this.dataList[x].clientType;
                this.imgIndex = i;
                this.$refs.lookLunbo.show();
            });
            this.flag = true;
        },
        //关闭轮播图
        changeflag() {
            this.flag = false;
        },
        //放大图片
        handleView(item) {
            this.imgName = item;
            this.visible = true;
            this.$refs.lookLunbo.show();
        },
        //新增-删除图片
        remove(i) {
            if (!this.isEdit) {
                this.addImgList.splice(i, 1);
            } else {
                this.addImgList[i].img = '';
                this.addImgList[i].imgShow = '';
            }
        },
        //打开-新增轮播图窗口
        addLunbo(x, val) {
            this.imgCount = 0;
            this.editType = x;
            this.isEdit = false;
            this.clientType = val;
            this.addImgList = [];
        },
        //修改数据
        changeDate(newBody, msg) {
            let body = JSON.parse(newBody);

            body.map(item => {
                item.android=item.android==true?1:0;
                item.ios=item.ios==true?1:0;
                item.h5=item.h5==true?1:0;
                delete item.imgShow;
            });
            // body.sort((a, b) => {
            //     return b.status.length - a.status.length;
            // });
            let data = {
                siteId: this.$root.nowSite.id,
                body: JSON.stringify(body),
                clientType: this.clientType == 'pc' ? 'pc' : 'mobile',
                position: 'banner'
            };
            addLogoHandler(data, true)
                .then(res => {
                    this.$root.endEditLoading();
                    if (res.code == 200) {
                        this.dataList = [];
                        this.$Message.success(msg);
                        this.getData();
                        this.$refs.addLunbo.hide();
                        this.isEdit = false;
                    }
                })
                .catch(() => this.$root.endEditLoading());
        },
        //状态切换
        changeState(x, i, status) {
            let newStatus = status == 'yes' ? 'no' : 'yes';
            let newBody = this.dataList[x].body.slice(0);
            this.clientType = this.dataList[x].clientType;
            newBody[i].status = newStatus;
            let newitem = newBody[i];
            if(newStatus=='no'){
                newBody.splice(i,1);
                newBody.push(newitem)
            }else{
                newBody.splice(i,1);
                newBody.unshift(newitem)
            }
            let msg = `${newStatus == 'no' ? '停用' : '启用'}状态成功`;
            this.changeDate(JSON.stringify(newBody), msg);
        },
        //新增提交
        submit() {
            let data, newBody, msg;
            if (!this.isEdit) {//新增
                  
                for (let item of this.addImgList) {
                    // if(item){
                    //     item.h5=item.h5==true?1:0;
                    //     item.android=item.android==true?1:0;
                    //     item.ios=item.ios==true?1:0;
                    // }
                    if (item.foward_type == '1') {
                        if (!item.target) {
                            item.target = '#';
                        }
                    }
                    if (!item.foward_type) {
                        this.$Message.error('请选择链接');
                        return;
                    }
                }
                if (this.addImgList.length + this.dataList[this.editType].body.length > 12) {
                    this.$Message.error('最多只能显示12张图片');
                    return;
                }
                let currentList = this.dataList[this.editType].body;
                newBody = this.addImgList.concat(currentList);
                msg = '添加轮播图成功';
            } else {
                // if(this.addImgList){
                //     this.addImgList.forEach(t=>{
                //         t.h5=t.h5==true?1:0;
                //         t.android=t.android==true?1:0;
                //         t.ios=t.ios==true?1:0;
                //     })
                // }
                if (!this.addImgList[0].img) {
                    this.$Message.error('请上传图片');
                    return;
                }
                if (this.addImgList[0].target == '') this.addImgList[0].target = '#';
                newBody = this.dataList[this.editType].body;
                newBody[this.editIndex] = this.addImgList[0];
                msg = '编辑轮播图成功';
            }
            
       
            this.$root.startEditLoading();
           
            this.changeDate(JSON.stringify(newBody), msg);
        },
        //点击编辑
        editBanner(type, x, i) {
            this.editIndex = i;
            this.editType = x;
            this.addImgList = [];
            this.isEdit = true;
            let obj = { ...this.dataList[x].body[i] };
            this.addImgList.push(obj);
            this.clientType = type;
            this.$refs.addLunbo.show();
        },
        //载入页面获取数据
        getData() {
            this.dataList = [];
            const data = { siteId: this.$root.nowSite.id, position: 'banner', clientType: 'pc,mobile', type_size: 'slideshow_size' };
            logoList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    let pcList, mbList, iosList, android, h5List;
                    res.data.map(item => {
                        if (item.clientType == 'pc') {
                            pcList = item;
                            this.pc_size = item.slideshow_size.replace('x', ' * ');
                        } else {
                          
                            if (item.clientType == 'mobile') {
                            
                                item.body.forEach(t=>{
                                    t.android=t.android==1?true:false;
                                    t.ios=t.ios==1?true:false;
                                    t.h5=t.h5==1?true:false;
                                  
                                })
                              
                                mbList = item;
                            } else if (item.clientType == 'h5') {
                                h5List = item;
                            } else if (item.clientType == 'ios') {
                                iosList = item;
                            } else if (item.clientType == 'android') {
                                android = item;
                            }
                            this.mb_size = item.slideshow_size.replace('x', ' * ');
                        }
                    });
                    if (!pcList) {
                        let pc_obj = {
                            bodyFormatType: JSON,
                            body: [],
                            clientType: 'pc',
                            created_at: '',
                            offline_at: '',
                            position: 'banner',
                            promotionId: '145',
                            publish_at: '0',
                            siteId: this.$root.nowSite.id,
                            slideshow_size: this.pc_size,
                            sort: 0,
                            status: 'yes',
                            title: ''
                        };
                        this.dataList.unshift(pc_obj);
        
                    } else {
                        this.dataList.unshift(pcList);
                    }
                    let shouji = mbList || h5List || iosList || android;
                    if (!shouji) {
                        let mb_obj = {
                            bodyFormatType: JSON,
                            body: [],
                            clientType: 'mobile',
                            created_at: '',
                            offline_at: '',
                            position: 'banner',
                            promotionId: 144,
                            publish_at: 0,
                            siteId: this.$root.nowSite.id,
                            slideshow_size: this.mb_size,
                            sort: 0,
                            status: 'yes',
                            title: ''
                        };
                        this.dataList.push(mb_obj);
                    } else {
                        this.dataList.push(shouji);
                    }
                }
            });
        },
        //上传成功
        uploadSuccess(res, type, useType) {
            this.imgCount = 0;
            this.host = res.data.host;
            if (!this.isEdit) {
                let obj = {
                    status: 'yes',

                    target: '#',
                    foward_type: '1'
                };
                obj.img = res.data.path;
                obj.imgShow = res.data.src;
                this.addImgList.push(obj);
                this.$refs.addLunbo.show();
            } else {
                this.addImgList[0].img = res.data.path;
                this.addImgList[0].imgShow = res.data.src;
            }
        },

        handleFormatError(file) {
            this.$Tip.info({ content: '请上传图片' });
        },
        handleMaxSize(file) {
            this.$Message.error('上传图片体积最大为2M');
        },
        handleBeforeUpload(file) {
            if (this.isEdit) return;
            this.imgCount++;
            let currentNum = this.dataList[this.editType].body.length;
            let addNum = this.addImgList.length;
            if (this.imgCount > 12 - currentNum) {
                let num = 12 - currentNum;
                this.$Message.error(`最多可上传${num}张`);
                this.imgCount--;
                return false;
            } else if (this.imgCount > 9) {
                this.$Message.error(`最多可上传9张`);
                this.imgCount--;
                return false;
            } else if (this.imgCount + addNum > 9) {
                let num = 9 - addNum;
                this.$Message.error(`最多可上传${num}张`);
                this.imgCount--;
                return false;
            } else if (this.imgCount + addNum + currentNum > 12) {
                let num = 12 - addNum - currentNum;
                this.$Message.error(`最多可上传${num}张`);
                this.imgCount--;
                return false;
            }
        },
        //删除
        delLunbo(x, i) {
            this.clientType = this.dataList[x].clientType;
            this.isEdit = true;
            this.$Tip.confirm({
                content: `您确定要删除此${this.clientType == 'pc' ? 'PC' : 'MB'}端banner吗？`,
                onOk: () => {
                    let newBody = this.dataList[x].body;
                    newBody.splice(i, 1);
                    let msg = '删除轮播图成功';
                    this.changeDate(JSON.stringify(newBody), msg);
                }
            });
        },
        //拖拽排序
        menuItemDrag(x, i) {
            this.i = i;
            this.clientType = this.dataList[x].clientType;
        },
        menuItemDragEnd() {
            this.i = null;
        },
        menuItemOver(e) {
            if (this.i !== null) e.preventDefault();
        },
        menuItemDrop($event, x, newIndex,list,clientType) {
            if (clientType!= this.clientType) return;
            if (this.i !== null) {
                let changeOne = list[this.i];
                // let newBody = this.dataList[x].body;
                list.splice(this.i, 1);
                list.splice(newIndex, 0, changeOne);
                // list.sort((a, b) => {
                //     return b.status.length - a.status.length;
                // });
                let data = {
                    siteId: this.$root.nowSite.id,
                    body: JSON.stringify(list),
                    clientType: clientType,
                    position: 'banner'
                };
                addLogoHandler(data, true).then(res => {
                    if (res.code === 200) {
                        if (this.i != newIndex) {
                            this.i = null;
                            this.$Message.success('排序更新成功');
                           // this.getData();
                        } else {
                            return false;
                        }
                    }
                });
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
@import '../../../styles/class.less';
/deep/td.ivu-table-column-center:nth-child(2) {
    text-align: left !important;
    padding-left: 20px;
    vertical-align: middle;
}
/deep/.ivu-table-cell {
    margin-top: 3px;
    color: #444;
}
.h360 {
    height: 360px;
}
.move {
    cursor: move;
}
.v2-button {
    height: 46px;
    line-height: 46px;
    color: #939393;
    font-size: 16px;
    border: 1px solid #cdcdcd;
    padding: 0 30px;
    border-radius: 25px;
}
.banner {
    width: 365px;
    height: 280px;
    display: inline-block;
    vertical-align: top;
    // background: rgb(243, 243, 243);
    border: 1px solid #cdcdcd;
    position: relative;
    cursor: move;
    .imgbox {
        height: 170px;
        margin: 10px;
        background: white;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        text-align: center;
        img {
            height: 170px;
        }
    }
    .upLoad {
        width: 300px !important;
        height: 180px;
        margin: 20px;
        display: inline-block;
        vertical-align: top;
        position: relative;
    }
    .left {
        line-height: 36px;
        z-index: 10;
    }
    .right {
        line-height: 36px;
        text-align: right;
        z-index: 10;
        span {
            padding-right: 10px;
            color: #2d8cf0;
        }
    }
}
.addBanner {
    background-color: #f9f9f9;
}
.size {
    margin-top: 150px;
    font-size: 1.125rem /* 18/16 */;
}
.size2 {
    margin-top: 140px;
    color: #939393;
    font-size: 1.125rem /* 18/16 */;
}
.imgbox:hover .cover {
    display: block;
}

.title {
    line-height: 40px;
    height: 40px;
    color: #939393 !important;
}

.addImg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 78px;
    border-radius: 50%;
    border: solid 1px #cccccc;
    color: #adadad;
}
.upLoad2 {
    width: 360px;
    height: 180px;
    margin: 20px;
    display: inline-block;
    vertical-align: top;
    // background: rgb(243, 243, 243);
    position: relative;
}
.editUpLoad {
    width: 720px;
    height: 360px;
    .upLoad {
        width: 720px;
        height: 360px;
        display: inline-block;
        vertical-align: top;
        background: rgb(243, 243, 243);
        position: relative;
        .size2 {
            margin-top: 240px;
        }
    }
}
.box:hover .cover {
    display: block;
}
.imgOne {
    margin: 20px 20px 0 20px;
    width: 360px;
    // height: 320px;
    text-align: center;
    display: inline-block;
    vertical-align: top;
    .box {
        width: 100%;
        height: 180px;
        position: relative;
        overflow: hidden;
    }
    img {
        height: 100%;
        border-radius: 10px;
    }
}
.close {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: white;
    opacity: 0.35;
    background-color: #000000;
    z-index: 100;
}
.cover {
    height: 100%;
    width: 100%;
    position: absolute;
    display: none;
    text-align: center;
    line-height: 180px;
    background: rgba(0, 0, 0, 0.6);
    i {
        color: white;
    }
}
/deep/.ivu-upload {
    display: inline-block;
}
/deep/ .ivu-upload-list {
    display: none;
}
/deep/.ivu-form-item {
    margin-bottom: 10px;
    margin-top: 20px;
}
// .ivu-modal-content {
//   overflow: visible !important;
// }

// .aaa{
//   position: fixed;
//   left: 0;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   margin: auto;
//   width:1200px;
//   height: 600px;
//   background: white;
//   border:1px solid gray;
//   border-radius: 10px;
//   z-index: 1000;
//   header{
//     width: 100%;
//     height: 50px;
//     line-height: 50px;
//     font-size: 24px;
//     background: #2D8CF0;
//     color:white;
//     text-align: center;
//   }
//   .imgItem {
//     height: 500px;
//     line-height: 500px;
//     text-align: center;
//     img {
//       height: 400px;
//       vertical-align: middle;
//     }
//   }

// }
//lunbo样式
.lbList {
    width: 100%;
    height: 540px;
    position: relative;
    span {
        position: absolute;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        border: 1px solid #cdcdcd;
        line-height: 40px;
        text-align: center;
    }
    .toLeft {
        left: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 100;
    }
    .toRight {
        right: 10px;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 100;
    }
    .odiv {
        height: 100%;
        // white-space: nowrap;
        .op {
            transition: 0.8s;
            position: absolute;
            // display: inline-block;
            height: 100%;
            width: 100%;
            text-align: center;
            line-height: 540px;
            opacity: 0;
            img {
                height: 360px;
                vertical-align: middle;
            }
        }
        .active {
            opacity: 1;
        }
    }
    ul {
        position: absolute;
        bottom: -20px;
        text-align: center;
        width: 100%;
        z-index: 100;
        li {
            width: 20px;
            height: 20px;
            margin: 0 15px;
            display: inline-block;
            border-radius: 50%;
            border: 1px solid #707070;
        }
        .actived {
            background: #707070;
        }
    }
}

.lh50 {
    line-height: 50px;
    float: right;
    margin-right: 10px;
}
</style>

