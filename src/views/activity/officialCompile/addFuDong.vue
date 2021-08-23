<template>
    <div class="v2-search">
        <Form :label-width="110" ref="formKey" :model="formKey" :rules="rules">
            <div class="mb20">
                <FormItem label="浮动标题" prop="title" style="margin-bottom:20px">
                    <Input v-model="formKey.title" placeholder="请输入标题(20字以内)" :maxlength="20" class="w690x ml5" />
                </FormItem>
            </div>
            <div class="mb20">
                <FormItem label="浮动位置" prop="show_location">
                    <Select class="w190x ml5" v-model="formKey.show_location" @on-change="changeShowPage">
                        <Option value="left">左侧</Option>
                        <Option value="right">右侧</Option>
                    </Select>
                </FormItem>
            </div>
            <!-- <div class="mb20">
                <FormItem label="显示页面" prop="show_page">
                    <CheckboxGroup class="ml5" v-model="formKey.show_page">
                        <Checkbox label="1" :disabled="disabled1">
                            <span>首页</span>
                        </Checkbox>
                        <Checkbox label="2" :disabled="disabled2">
                            <span>游戏页</span>
                        </Checkbox>
                        <Checkbox label="3" :disabled="disabled3">
                            <span>文案页</span>
                        </Checkbox>
                        <Checkbox label="4" :disabled="disabled4">
                            <span>优惠页</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </div> -->
            <div class="mb20">
                <FormItem label="浮动状态">
                    <Select class="w190x ml5" v-model="formKey.status">
                        <Option value="yes">开启</Option>
                        <Option value="no">停用</Option>
                    </Select>
                </FormItem>
            </div>
            <FormItem label="图片">
                <div
                    v-for="(t, i) in imageList.length"
                    :key="i"
                    :class="t == imageList.length ? 'last w690x ml5 box' : 'w690x ml5 box mb25'"
                    @click="beforeUpload(arguments, i)"
                >
                    <Icon size="22" v-if="imageList.length !== 1" class="close" style="border:1px #CECECE " @click.prevent="remove(i)" type="md-close" />
                    <div class="paixuBox">
                        <Icons class="paixu" type="paixukongjian" color="#b3b3b3" size="24" />
                    </div>
                    <div class="right fl w644x p30">
                        <FormItem id="url">
                            <Select class="w180x h40x txt-a" v-model="imageList[i].url_type" @on-change="changeType">
                                <Option :value="item.url_type" v-for="item in connectionType" :key="item.title">{{ item.title }}</Option>
                            </Select>
                            <span class="pl10 pr10 ft20" style="color:rgb(150,150,150)">—</span>
                            <Select class="w180x h40x txt-a" placeholder="请选择" v-model="imageList[i].skip" v-if="imageList[i].url_type == 1">
                                <Option :value="item.skip" v-for="item in selectList" :key="item.title">{{ item.title }}</Option>
                            </Select>
                            <FormItem v-if="imageList[i].url_type == 2" style="display:inline-block !important">
                                <Input class="w180x txt-a" placeholder="请输入链接" v-model="imageList[i].url" />
                            </FormItem>
                            <FormItem v-if="imageList[i].url_type == 3" style="display:inline-block !important; margin-right:0">
                                <!-- <Input class="w180x txt-a" placeholder="请输入链接" v-model="imageList[i].url" /> -->
                                <InputNumber
                                    class="w68x"
                                    :max="9999"
                                    :min="0"
                                    :precision="0"
                                    :value="Number(imageList[i].x_axis) || null"
                                    @on-change="
                                        value => {
                                            imageList[i].x_axis = value;
                                        }
                                    "
                                    placeholder="X轴"
                                />
                                -
                                <InputNumber
                                    class="w68x"
                                    :max="9999"
                                    :min="0"
                                    :precision="0"
                                    :value="Number(imageList[i].y_axis) || null"
                                    @on-change="
                                        value => {
                                            imageList[i].y_axis = value;
                                        }
                                    "
                                    placeholder="Y轴"
                                />
                                -
                                <Input class="w193x txt-a" v-model="imageList[i].size" placeholder="请输入尺寸" />
                            </FormItem>
                        </FormItem>
                        <FormItem v-if="$route.params.page === 'edit'">
                            <UpLoads
                                :editPic="editPic[i]"
                                :headers="uploadForm.headers"
                                :data="uploadForm.data"
                                :name="uploadForm.name"
                                :action="uploadForm.action"
                                @overSize="handleMaxSize"
                                @on-success="uploadSuccess"
                                @on-format-error="handleFormatError"
                            />
                        </FormItem>
                        <FormItem v-else>
                            <UpLoads
                                :headers="uploadForm.headers"
                                :data="uploadForm.data"
                                :name="uploadForm.name"
                                :action="uploadForm.action"
                                @overSize="handleMaxSize"
                                @on-success="uploadSuccess"
                                @on-format-error="handleFormatError"
                            />
                        </FormItem>
                    </div>
                </div>
                <p class="ml5 addImg h42" @click.prevent="addImg"><Icons type="tianjialunbotuanniu" color="#62b1fd" size="14" class="pr15"></Icons>新增图片</p>
                <div style="text-align:center;margin-bottom:20px">
                    <Button class="addSave w200x mt20" type="primary" :loading="loading" @click.prevent="submit">{{
                        $route.params.page === 'edit' ? '确认保存' : '确认新增'
                    }}</Button>
                </div>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import Modals from '@/components/modals';
import UpLoads from '../components/uploads';
import { uploadImg, getActivityImgConfigSize } from '@/api/common';
import { floatImgAdd, floatImgEdit, floatImgDetail, floatImgDrag, floatImgList } from '@/api/activity';
import { mapState } from 'vuex';
import Icons from '_c/icons';
import { getUserName, getToken } from '@/libs/util';
export default {
    name: 'addFuDong',
    components: {
        UpLoads,
        Icons
    },
    data() {
        return {
            loading: false,
            current: [],
            disabled1: false,
            disabled2: false,
            disabled3: false,
            disabled4: false,
            floatImgList: [], //浮动图列表
            editPic: [],
            imgIndex: 0,
            imageList: [{ url_type: '1', image: '', skip: '', url: '', x_axis: '', y_axis: '', size: '' }],
            formKey: {
                siteId: this.$root.nowSite.id,
                title: '',
                show_page: ['1','2','3','4'],
                show_location: 'left',
                status: 'yes',
                image: {}
            },
            connectionType: [
                { url_type: '1', title: '内部链接' },
                { url_type: '2', title: '外部链接' },
                { url_type: '3', title: '二维码链接' }
            ],
            selectList: [
                { skip: '1', title: '在线客服' },
                { skip: '2', title: '免费开户' },
                { skip: '3', title: '网银转账' },
                { skip: '4', title: '优惠活动' },
                { skip: '5', title: '开元棋牌' },
                { skip: '6', title: '余额宝' },
                { skip: '7', title: '免息借呗' },
                { skip: '8', title: '捕鱼游戏' },
                { skip: '9', title: '乐游棋牌' },
                { skip: '10', title: '天豪棋牌' },
                { skip: '11', title: 'AG视讯' },
                { skip: '12', title: 'BG视讯' }
            ],
            uploadList: [],
            uploadForm: {
                headers: { Authorization: getToken() },
                action: '/api/v2/uploadImg',
                data: { siteId: this.$root.nowSite.id },
                name: 'img'
            },
            rules: {
                title: [
                    { required: true, message: '请输入6-20标题', trigger: 'blur' },
                    {
                        type: 'string',
                        min: 6,
                        message: '请输入6-20位标题',
                        trigger: 'blur'
                    }
                ],
                show_page: [
                    {
                        required: true,
                        message: '请选择显示页面',
                        pattern: /.+/,
                        trigger: 'change'
                    }
                ]
            }
        };
    },
    created() {
        //获取编辑值
        this.$nextTick(() => {
            if (this.$route.params.page === 'edit') {
                // 直接用this.$root.nowSite.id异步第一次请求失败用页面传过来的参数
                let data = {
                    id: this.$route.query.id,
                    siteId: this.$route.query.siteId
                };
                floatImgDetail(data).then(res => {
                    if (res.code === 200) {
                        this.formKey = res.data;
                        // if (res.data.show_page.length >= 2) {
                            this.formKey.show_page = ['1','2','3','4'];
                        // } else {
                        //     this.formKey.show_page = Array(res.data.show_page);
                        // }
                        this.imageList = JSON.parse(res.data.image);
                        this.editPic = JSON.parse(this.formKey.image_show); //展示图片
                    }
                });
            }
            floatImgList({ siteId: this.$root.nowSite.id }).then(res => {
                if (res != undefined && res.code == 200) {
                    this.floatImgList = res.data;
                    //不可选位置
                    this.disabled(this.formKey.show_location);
                }
            });
        });
    },
    methods: {
        disabled(val) {
            this.current = [];
            let str = '';
            this.floatImgList.map(item => {
                if (item.show_location == val && item.id != this.$route.query.id) {
                    str += item.show_page;
                }
            });
            this.current = str.split('');
            if (this.current.includes('1')) {
                this.disabled1 = true;
            } else {
                this.disabled1 = false;
            }
            if (this.current.includes('2')) {
                this.disabled2 = true;
            } else {
                this.disabled2 = false;
            }
            if (this.current.includes('3')) {
                this.disabled3 = true;
            } else {
                this.disabled3 = false;
            }
            if (this.current.includes('4')) {
                this.disabled4 = true;
            } else {
                this.disabled4 = false;
            }
        },
        changeShowPage(val) {
            this.disabled(val);
            if (this.formKey.show_location && this.disabled1 && this.disabled2 && this.disabled3) {
                if (this.formKey.show_location == 'left') this.$Message.error('左侧显示页面已满，请选择右侧浮动位置');
                if (this.formKey.show_location == 'right') this.$Message.error('右侧显示页面已满，请选择左侧浮动位置');
            }
        },
        changeType(val) {
            this.imageList[this.imgIndex].skip = '';
            this.imageList[this.imgIndex].url = '';
            this.imageList[this.imgIndex].x_axis = '';
            this.imageList[this.imgIndex].y_axis = '';
            this.imageList[this.imgIndex].size = '';
        },
        //文件上传成功后复制img地址，并打开显示
        uploadSuccess(res, type, useType) {
            if (res.code === 200) {
                this.imageList[this.imgIndex].image = res.data.path;
            }
        },
        handleFormatError(file) {
            this.$Tip.info({ content: '请上传图片' });
        },
        beforeUpload(value, index) {
            this.imgIndex = index;
        },
        handleMaxSize(file) {
            this.$Message.error('上传图片体积最大为2M');
        },
        //提交
        submit() {
            let sizeError = false;
            this.imageList.map(item => {
                for (let key in item) {
                    if (!item[key]) {
                        delete item[key];
                    }
                }
                if (item.size) {
                    let reg = /^[1-9]{1}\d{1,3}[*]{1}[1-9]{1}\d{1,3}$/;
                    if (!reg.test(item.size)) {
                        this.$Message.error('请输入正确的尺寸(例如:100*100)');
                        sizeError = true;
                    }
                }
            });
            if (sizeError) return;
            let data = { ...this.formKey };
            data.image = JSON.stringify(this.imageList);
            data.show_page = data.show_page.join(',');
            this.$refs.formKey.validate(valid => {
                if (valid) {
                    for (let item of this.imageList) {
                        if (item.url_type == '1') {
                            if (!item.skip) {
                                this.$Message.error('请选择链接');
                                return;
                            }
                        } else {
                            // if (!item.url) {
                            //   this.$Message.error("请输入链接");
                            //   return
                            // }
                        }
                        if (!item.image) {
                            this.$Message.error('请上传图片');
                            return;
                        }
                    }
                    //新增浮动图
                    if (this.$route.params.page !== 'edit') {
                        this.loading = true;
                        floatImgAdd(data, true)
                            .then(res => {
                                if (res != undefined && res.code == 200) {
                                    this.$Message.success('新增浮动图成功');
                                    this.$router.push({
                                        name: 'floatImgList'
                                    });
                                }else {this.loading = false}
                            })
                            .catch(error => (this.loading = false));
                    } else {
                        //编辑浮动图
                        this.formKey.id = this.$route.query.id;
                        delete data.image_show
                        delete data.sort
                        this.loading = true;
                        floatImgEdit(data, true)
                            .then(res => {
                                if (res.code === 200) {
                                    this.$Message.success('浮动图更新成功');
                                    this.$router.push({
                                        name: 'floatImgList'
                                    });
                                }else {this.loading = false}
                            })
                            .catch(error => (this.loading = false));
                    }
                }
            });
        },
        addImg() {
            let obj = { url_type: '1', image: '', skip: '', url: '' };
            this.imageList.push(obj);
        },
        //删除图片
        remove(i) {
            this.imageList.splice(i, 1);
        }
    }
};
</script>
<style lang="less" >
@import '../../../styles/button.less';
.ivu-form-item-content {
    margin-left: 0 !important;
}
.w690x {
    .last {
        margin-bottom: 0 !important;
    }
}
.box {
    height: 260px;
    border: solid 1px #e4e4e4;
    position: relative;
    .paixuBox {
        width: 44px;
        height: 100%;
        float: left;
        background: #e9e9e9;
        text-align: center;
        line-height: 258px;
        .paixun {
            display: inline;
            vertical-align: middle;
        }
    }
    .right {
        height: 258px;
        background-color: #f6f6f8;
        box-sizing: border-box;
    }
}
.addSave {
    height: 50px;
    background-color: #2d8cf0;
    color: white;
}
.addImg {
    text-align: center;
    color: #62b1fd;
    background: #f4faff;
    border: 1px solid #e1e1e1;
    border-top: 0;
}

.close {
    position: absolute;
    right: 15px;
    top: 10px;
    color: rgb(184, 177, 177);
}
#url {
    margin-right: 0 !important;
    .ivu-form-item-content {
        margin-right: 0;
    }
}
.txt-a {
    .ivu-input {
        text-align: center !important;
    }
}
</style>

