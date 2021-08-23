<template>
    <div :style="screen < 1500 ? 'zoom:0.67' : screen >= 1500 && screen < 2000 ? 'zoom:0.72' : ''">
        <div v-for="(t, x) in classId" class="mb10 clearfix" :key="x">
            <div class="v2-button mb20 ft18">{{ t.name }}</div>
            <div class="db">
                <Button
                    class="mr20 ft14 w155x"
                    :class="platformId==t.current?'activeBtn':''"
                    style="height:36px"
                    :style="screen < 1500 ? 'zoom:1.4' : screen >= 1500 && screen < 2000 ? 'zoom:1.25' : ''"
                    :disabled="spinShow"
                    @click="setData(x,platformId)"
                    v-for="(item,platformId) in  t.btnType"
                    :key="item.name">
                    {{item.name}}
                </Button>
            </div>
            <Row v-if="spinShow&&(spinNum==x||spinNum=='')" style="height:250px;line-height:250px">
                <Spin size="large" fix>
                <div style="color: rgba(48, 140, 240, .7)" class="la-line-spin-fade la-sm">
                    <div v-for="t in 8" :key="'div'+t"></div>
                </div>
                </Spin>
            </Row>
            <div class="imgList mt20" v-else>
                
                    <div
                        class="move ib mr20 pl15 pr15 pt10 w365x txt-a h210 b mb20 fl" 
                        v-for="(img,index) in t.btnType[t.current].imgList"
                        @mouseover="move"
                        :draggable="draggable"
                        @dragstart="menuItemDrag(x, index)"
                        @dragover="menuItemOver"
                        @drop="menuItemDrop($event,index,t.btnType[t.current].imgList,x)"
                        @dragend="menuItemDragEnd" 
                        :key='img.id'>
                        <div class="imgBox txt-a h113"  @mouseover.stop="hand">
                            <div class="cover" style="line-height:113px;cursor:default">
                                <Icon size="26" type="ios-eye-outline" class="cs" @click="viewImg(t.btnType[t.current].imgList,img)"></Icon>
                            </div>
                            <Img :src="host+img.imageShow" v-show="show" @load="imgLoad" />
                        </div>
                        <footer>
                            <div class="move txt-l" style="height:50px;line-height:50px">
                                <span v-if="img.url" class="ib w100 f93 text-overflow-ellipsis" >链接地址 : {{img.url}}</span>
                            </div>
                            <div class="txt-l fl w20" @mouseover.stop="hand">
                                <Switch
                                    :disabled="disable"
                                    @on-change="changeState(img)"
                                    :value="img.status == 'yes' ? true : false">
                                    <span slot="open"></span>
                                    <span slot="close"></span>
                                </Switch>
                            </div>
                            <div class="fr w50 txt-r move" >
                                <span class="cs mr10 blue" @mouseover.stop="hand" @click="editImg(img)">编辑</span>
                                <span class="cs blue" @mouseover.stop="hand" @click="delLunbo(img,t.name)">删除</span>
                            </div>
                        </footer>
                    </div>
                <Upload
                    v-if="t.btnType[t.current].imgList.length<6"
                    style="cursor:default;vertical-align:top;"
                    class="ib w365x txt-a h210 b fl mb20"
                    :show-upload-list="false"
                    :headers="uploadForm.headers"
                    :action="uploadForm.action"
                    :data="uploadForm.data"
                    :name="uploadForm.name"
                    :on-success="uploadSuccess"
                    :format="['jpg', 'jpeg', 'png', 'gif']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                >
                    <div class="txt-a">
                        <div class="addImg" @click="addLunbo(x,t.current)">
                            <Icons type="tianjialunbotuanniu" color="#adadad" size="32"></Icons>
                        </div>
                        <p style="line-height:40px" class="f93">{{ game_size }}</p>
                    </div>
                </Upload>
            </div>
        </div>
        <Modal title="图片预览" v-model="visible">
            <img :src="imgName" v-if="visible" class="w100" />
        </Modal>
        <!-- 新增弹窗 -->
        <Modals
            ref="addLunbo"
            :title="isEdit?'编辑图片':'新增图片'"
            width="480"
        >
            <div slot="content">
                <div class="ib txt-a w100">
                    <div class="imgBox m10 h150" v-if="addImgList.imageShow">
                        <Icon size="18" class="close" type="md-close" @click="remove()" />
                        <div class="cover" :style="isEdit ? 'line-height:150px' : ''">
                            <Icon size="26" type="ios-eye-outline" @click="handleView(host + addImgList.imageShow)"></Icon>
                        </div>
                        <Img :src="host + addImgList.imageShow" />
                    </div>
                    <Form :label-width="90"
                         class="p20"
                         ref="addImg"
                         :model="addImgList"
                         :rules="rules"
                         label-position="right"
                         v-if="addImgList.imageShow">
                        <FormItem label="轮播位置 :" key="posi" prop="platformId" v-if="!isEdit">
                            <Select multiple class="txt-l" v-model="addImgList.platformId" transfer >
                                <Option
                                :value="i"
                                :disabled="t.imgList.length>=6"
                                v-for="(t, i) in classId[editType].btnType"
                                :key="'item' + i">
                                    {{ t.name }}
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem label="轮播位置 :" key="posi2" class="txt-l" v-if="isEdit">
                            <span style="line-height:34px">{{addImgList.platformName}}</span>
                        </FormItem>
                        <FormItem label="链接地址 :">
                            <Input v-model="addImgList.url" placeholder="请使用http://开头" />
                        </FormItem>
                    </Form>
                    <Upload
                        v-if="!addImgList.imageShow"
                        class="imgBox m10 h210"
                        :show-upload-list="false"
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
                    >
                        <div>
                            <p class="addImg1">
                                <Icons type="xiangji" color="#2d8cf0" :size="80"></Icons>
                            </p>
                        </div>
                    </Upload>
                </div>
                <div class="pt20 pb20 txt-a" style="border-top:1px solid rgba(199, 195, 195, 0.5)">
                    <Button type="primary" @click="submit" class="pt10 pb10 pl80 pr80 ft16 ivu-btn submit" :loading="$root.editBtnLoading">{{isEdit?'确认修改':'确认新增'}}</Button>
                </div>
            </div>
        </Modals>
        <!-- 查看轮播弹窗 -->
        <Modals ref="lookLunbo" title="查看PC端banner" width="1600" height="630">
            <div slot="content" class="mb30">
                <div class="lbList">
                    <span class="toLeft cs" @click="toLeft"><Icon size="26" color="#b3b3b3" type="ios-arrow-back"></Icon></span>
                    <div class="odiv">
                        <p v-for="(item, i) in lookLunboList" :class="imgIndex == i ? 'active op' : 'op'" :key="'lunbo' + i">
                            <Img :src="host + item.imageShow" />
                        </p>
                    </div>
                    <span class="toRight cs" @click="toRight"><Icon size="26" color="#b3b3b3" type="ios-arrow-forward"></Icon></span>
                    <ul>
                        <li v-for="(item, i) in lookLunboList" @click="setIndex(i)" :class="imgIndex == i ? 'actived cs' : 'cs'" :key="'look' + i"></li>
                    </ul>
                </div>
            </div>
        </Modals>
    </div>
</template>
<script>
import Icons from '_c/icons';
import Modals from '@/components/modals';
import draggable from "vuedraggable";
import {slideshowList,slideshowAdd,slideshowUp,slideshowDel,slideshowSort,activityImgConfigList} from '@/api/system';
import { getToken } from '@/libs/util';
export default {
    name: 'lunboBanner',
    components: {
        Icons,
        Modals,
        draggable
    },
    data() {
        return {
            spinNum:'',
            show:false,
            spinShow:true,
            disable:false,
            draggable:false,
            dragClassId:'',
            flag: false,
            game_size:'',
            current:'',
            screen: screen.width,
            pc_size: '0',
            mb_size: '0',
            imgIndex: 0,
            lookLunboList: [],
            editType: '10000', //编辑类型
            host: '',
            isEdit: false,
            visible: false,
            addImgList: {}, //新增图片
            classId:{
                // '10000':{
                //     name:'MB彩票游戏',
                //     current:'1',
                //     btnType:{
                //         '1':{name:'推荐游戏',imgList:[]},
                //         '2':{name:'热门游戏',imgList:[]},
                //         '3':{name:'最新游戏',imgList:[]},
                //     },

                // },
                '10001':{
                    name:'MB电子游艺',
                    current:'1',
                    btnType:{
                        '1':{name:'推荐游戏',imgList:[]},
                        '2':{name:'热门游戏',imgList:[]},
                        '3':{name:'最新游戏',imgList:[]},
                    },
                },
                // '10002':{
                //     name:'MB体育赛事',
                //     current:'1',
                //     btnType:{
                //         '1':{name:'推荐游戏',imgList:[]},
                //         '2':{name:'热门游戏',imgList:[]},
                //         '3':{name:'最新游戏',imgList:[]},
                //     },
                // },
                // '10003':{
                //     name:'MB真人视讯',
                //     current:'1',
                //     btnType:{
                //         '1':{name:'推荐游戏',imgList:[]},
                //         '2':{name:'热门游戏',imgList:[]},
                //         '3':{name:'最新游戏',imgList:[]},
                //     },
                // },
                '10004':{
                    name:'MB棋牌游戏',
                    current:'1',
                    btnType:{
                        '1':{name:'推荐游戏',imgList:[]},
                        '2':{name:'热门游戏',imgList:[]},
                        '3':{name:'最新游戏',imgList:[]},
                    },
                },
                '10005':{
                    name:'MB捕鱼游戏',
                    current:'1',
                    btnType:{
                        '1':{name:'推荐游戏',imgList:[]},
                        '2':{name:'热门游戏',imgList:[]},
                        '3':{name:'最新游戏',imgList:[]},
                    },
                }
            },
            uploadForm: {
                headers: { Authorization: getToken() },
                action: '/api/v2/uploadImg',
                data: { siteId: this.$root.nowSite.id },
                name: 'img',
                defaultList: [],
                path: '',
                src: ''
            },
            rules: {
                platformId:[
                    { type:'array', required: true, message: "请选择轮播位置", trigger: "change" },
                ]
            }
        };
    },
    created() {
        this.host = location.origin;
        //获取轮播尺寸
        this.$nextTick(() => {
            const data = { siteId: this.$root.nowSite.id };
            activityImgConfigList(data, true).then(res => {
                if (res.code == 200) {
                    res.data.map(item => {
                        if (item.client_type == 'mobile') {
                            this.game_size = item.game_shuffling_size.replace('x', ' * ');
                        }
                    });
                }
                this.listData();
            });
        });
        this.$Message.config({
            top: 50,
            duration: 1
        });
    },
    methods: {
        listData(){ //第一次进入数据
            const data = { siteId: this.$root.nowSite.id,platformId:1 };
            slideshowList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    res.data.map(item=>{
                        for(let key in this.classId){
                            for(let k in this.classId[key].btnType){
                                if(item.classId==key&&item.platformId==k){
                                   this.classId[key].btnType[k].imgList.push(item)
                                }
                            }
                        }
                    })
                    this.spinShow=false;
                }
            }).catch(error=>this.spinShow=false);
        },
        setData(key,platformId){
            this.spinNum = key;
            this.spinShow=true;
            const data = { siteId: this.$root.nowSite.id,classId:key,platformId:platformId };
            this.classId[key].current = platformId
            slideshowList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    this.classId[key].btnType[platformId].imgList = res.data;
                     this.spinShow=false;
                }
            }).catch(error=>this.spinShow=false);
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
        viewImg(list,img) {
            this.$nextTick(() => {
                this.lookLunboList = list;
                this.imgIndex = img.sort;
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
        },
        //新增-删除图片
        remove() {
            this.addImgList.imageShow="";
            this.addImgList.image="";
            this.$forceUpdate();
        },
        //打开-新增轮播图窗口
        addLunbo(x,platformId) {
            this.editType = x;
            this.current = platformId;
            this.isEdit = false;
            this.addImgList = {};
        },
        //状态切换
        changeState(val) {
            this.disable = true;
            let msg = `${val.status == 'yes' ? '停用' : '启用'}状态成功`;
            let data={
                    siteId:this.$root.nowSite.id,
                    id:val.id,
                    url:val.url,
                    image:val.image,
                    status:val.status=='yes'?'no':'yes'
                }
            slideshowUp(data,true).then(res=>{
                if(res&&res.code==200) this.$Message.success(msg);
                this.disable = false;
            })
        },
        //新增提交
        submit() {
            let data;
            if (!this.addImgList.image) {
                this.$Message.error('请上传图片');
                return;
            }
            if(!this.isEdit){
                this.$refs.addImg.validate(valid => {
                if (valid) {
                    if (!this.isEdit) {
                        data={...this.addImgList};
                        data.siteId = this.$root.nowSite.id;
                        data.platformId = this.addImgList.platformId.join(',');
                        delete data.imageShow
                        slideshowAdd(data,true).then(res=>{
                            if(res&&res.code==200){
                                this.$Message.success('新增成功');
                                this.$refs.addLunbo.hide();
                                this.getData(this.editType,this.current);
                            }
                        })

                    }
                }
            })
            }else{
                let data={
                    siteId:this.$root.nowSite.id,
                    id:this.addImgList.id,
                    url:this.addImgList.url,
                    image:this.addImgList.image,
                    status:this.addImgList.status
                }
                slideshowUp(data,true).then(res=>{
                    if(res&&res.code==200) this.$Message.success('编辑成功');
                    this.$refs.addLunbo.hide();
                    this.getData(this.editType,this.current);
                })
            }

        },
        //点击编辑
        editImg(val) {
            this.editType = val.classId;
            this.current = val.platformId;
            this.isEdit = true;
            this.addImgList={...val};
            this.addImgList.platformId=[val.platformId]
            this.$refs.addLunbo.show();
        },
        //切换按钮获取数据
        getData(classId,platformId) {
            const data = { siteId: this.$root.nowSite.id,classId:classId,platformId:platformId };
            slideshowList(data).then(res => {
                if (res != undefined && res.code == 200) {
                    this.classId[classId].btnType[platformId].imgList = res.data;
                }
                // this.spinShow = false;
            });
            this.isEdit = false;
        },
        //上传成功
        uploadSuccess(res, type, useType) {
            this.host = res.data.host;
            if (!this.isEdit) {
                this.addImgList = {
                    image:res.data.path,
                    classId:this.editType,
                };
                this.addImgList.imageShow = res.data.src;
                this.$refs.addLunbo.show();
            } else {
                this.addImgList.image = res.data.path;
                this.addImgList.imageShow = res.data.src;
            }
        },

        handleFormatError(file) {
            this.$Tip.info({ content: '请上传图片' });
        },
        handleMaxSize(file) {
            this.$Message.error('上传图片体积最大为2M');
        },
        //删除
        delLunbo(val,name) {
            this.$Tip.confirm({
                content: `您确定要删除【${val.platformName}】轮播吗？`,
                onOk: () => {
                   slideshowDel({id:val.id},true).then(res=>{
                       if(res&&res.code==200) this.$Message.success(name+'轮播删除成功');
                       this.getData(val.classId,val.platformId);
                   })
                }
            });
        },
        //拖拽排序
        // end(val,list){
        //     if(val.oldIndex==val.newIndex) return;
        //     let data={
        //         id:list[val.oldIndex].id,
        //         oldIndex:val.oldIndex,
        //         newIndex:val.newIndex
        //     }
        //     slideshowSort(data,true).then(res=>{
        //         if(res&&res.code==200){
        //             this.$Message.success('排序成功');
        //         }
        //     })
        // }
        menuItemDrag(x, i) {
            this.i = i;
            this.dragClassId = x;
        },
        menuItemDragEnd() {
            this.i = null;
        },
        menuItemOver(e) {
            if (this.i !== null) e.preventDefault();
        },
        menuItemDrop($event, newIndex,list,classId) {
            if (classId!= this.dragClassId||this.i==newIndex) return;
            if (this.i !== null) {
                let id = list[this.i].id;
                let changeOne = list[this.i];
                list.splice(this.i, 1);
                list.splice(newIndex, 0, changeOne);     
                let data = {
                    id: id,
                    oldIndex:this.i,
                    newIndex:newIndex
                };
                slideshowSort(data,true).then(res=>{
                    if(res&&res.code==200){
                        this.$Message.success('排序成功');
                    }
                })
            }
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../styles/button.less';
@import '../../../styles/class.less';
.f93{
    color:#939393;
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
.lh36 {
    height: 36px;
    line-height:36px
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
.addImg{
    margin-top:60px;
    display: inline-block;
    cursor: pointer;
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
    border: solid 1px #cccccc;
    color: #adadad;
}
.addImg1{
    margin-top:60px;
    display: inline-block;
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
}
.imgBox {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    img {
        height: 100%;
        border-radius: 10px;
    }
}
.imgBox:hover .cover {
    display: block !important;
}
.cover {
    height: 100%;
    width: 100%;
    position: absolute;
    display: none;
    text-align: center;
    line-height: 150px;
    background: rgba(0, 0, 0, 0.6);
    i {
        color: white;
    }
}
.ivu-form .ivu-form-item {
    margin-bottom: 20px;
}
.activeBtn {
    background: #2b85e4;
    color:white;
}
.move {
    cursor: move;
}
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
</style>

