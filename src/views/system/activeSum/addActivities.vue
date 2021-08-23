<template>
    <div class="v2-search" :key="$route.meta.title">
        <Form ref="formKey" :label-width="80" :model="formKey" :rules="rules">
            <FormItem style="margin-bottom:20px !important" label="活动类型">
                <Select v-model="formKey.activity_type" class="w419x">
                    <Option value="normal_activity">常规活动</Option>
                    <Option value="url_activity">链接活动</Option>
                    <Option value="apply_activity">报名活动</Option>
                </Select>
            </FormItem>
            <FormItem style="margin-bottom:20px !important" label="活动标题" prop="title">
                <Input placeholder="请输入标题(20字以内)" class="w419x" v-model="formKey.title" />
            </FormItem>
            <FormItem style="margin-bottom:20px !important" label="副标题">
                <Input class="w419x" v-model="formKey.child_title" />
            </FormItem>
            <FormItem style="margin-bottom:20px !important" label="活动时间" prop="activity_date_type">
                <Select class="w419x" v-model="formKey.activity_date_type">
                    <Option value="lasting">永久上架</Option>
                    <Option value="custom">自定义时间</Option>
                </Select>
            </FormItem>
            <div label="起止时间" class="clearfix mb20 duringTime" v-if="formKey.activity_date_type == 'custom'">
                <FormItem label="开始日期" class="fl ivu-form-item-required" prop="online_time">
                    <DatePicker
                        type="datetime"
                        placeholder="开始日期"
                        class="w150x"
                        v-model="formKey.online_time"
                        size="large"
                        format="yyyy-MM-dd HH:mm"
                        :options="timeOptions"
                    ></DatePicker>
                </FormItem>
                <!-- <span class=" fl  ib">——</span> -->
                <FormItem label="结束日期" class="fl" prop="offline_time">
                    <DatePicker
                        type="datetime"
                        placeholder="结束日期"
                        class="w150x"
                        v-model="formKey.offline_time"
                        size="large"
                        format="yyyy-MM-dd HH:mm"
                        :options="timeOptions"
                    ></DatePicker>
                </FormItem>
            </div>
            <div class="active clearfix">
                <span class="xColor fl mt10 mlf5" style="margin-left:13px;color:#ed4014">*</span>
                <FormItem label="活动分类" prop="activity_cate_name" class="activeClass">
                    <Select class="w420x" v-model="formKey.activity_cate_id" multiple @on-change="delActCeId">
                        <Option :value="0" key="0">全部</Option>
                        <Option :value="item.id" v-for="item in actlist" :key="item.id">{{ item.activity_cate_name }}</Option>
                    </Select>
                </FormItem>
            </div>
            <div class="mb20">
                <FormItem label="显示状态">
                    <!-- <span class="ml10" >显示状态</span> -->
                    <Switch v-model="formKey.status" size="large">
                        <span slot="open">开启</span>
                        <span slot="close">停用</span>
                    </Switch>
                    <span class="ml30" style="vertical-align:middle">登录显示</span>
                    <Switch class="ml20" v-model="formKey.read_status" size="large" style="vertical-align:text-top">
                        <span slot="open">开启</span>
                        <span slot="close">停用</span>
                    </Switch>
                    <span class="ml30" style="vertical-align:middle">跳转按钮</span>
                    <Switch class="ml20" v-model="formKey.jump_switch" size="large" style="vertical-align:text-top">
                        <span slot="open">开启</span>
                        <span slot="close">停用</span>
                    </Switch>
                </FormItem>
            </div>
            <div class="mb20" v-if="formKey.jump_switch">
                <FormItem label="按钮名称" class="jumpButton" prop="jump_button_name">
                    <Input class="w419x" v-model="formKey.jump_button_name" />
                </FormItem>
                <FormItem class="mt10" label="跳转链接" prop="jump_button_url">
                    <Input class="w419x" v-model="formKey.jump_button_url" />
                </FormItem>
            </div>
            <div class="mb20">
                <FormItem label="发布平台" prop="client_type">
                    <CheckboxGroup class="ml5" v-model="formKey.client_type">
                        <Checkbox label="pc"><span>PC</span></Checkbox>
                        <Checkbox label="mobile"><span>移动端</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </div>
            <FormItem label="标题图片" prop="image" class="pic">
                <span v-show="false">{{ formKey.image }}</span>
                <div class="mb mb20 ml5" :style="formKey.client_type.length < 2 ? { textAlign: 'center' } : {}">
                    <!-- <span class="ml0">标题图片</span> -->
                    <p class="font" style="text-align: left">{{ `尺寸限制：PC-${imgLimitSize.pc}px 移动端-${imgLimitSize.mobile}px` }}</p>
                    <div class="upload-img">
                        <UpLoads
                            v-for="item in [{ ...this.uploadForm, showType: 'pc' }, { ...this.uploadForm, showType: 'mobile' }]"
                            v-bind="item"
                            :key="item.showType"
                            v-show="formKey.client_type.includes(item.showType)"
                            @overSize="handleMaxSize"
                            @on-success="uploadSuccess"
                            @on-format-error="handleFormatError"
                            :editPic="$route.params.page === 'edit' ? imageShow : {}"
                        />
                    </div>
                </div>
            </FormItem>
            <div v-if="formKey.activity_type == 'normal_activity'">
                <div class="mb mt40 ml5">
                    <span class="mr3 ib" style="text-align:right;width:80px" prop="desc_type">编辑内容</span>
                    <div class="v2-button ml10">
                        <Button class="w148x fl mt10 fontColor" :class="this.seltext == true ? 'active' : ''" @click="onText">文本</Button>
                         <!-- <Button class="w148x fl mt10 fontColor" :class="this.selimg == true ? 'active' : ''" @click="onImg">图片</Button> -->
                    </div>
                    <div class="upload-img edit-img mt20" v-show="selimg" :style="formKey.client_type.length < 2 ? { textAlign: 'center' } : {}">
                        <p class="font txt-l ">
                            {{
                                `宽度限制：PC-${imgLimitSize.pc.slice(0, imgLimitSize.pc.indexOf('x'))}px 移动端-${imgLimitSize.mobile.slice(
                                    0,
                                    imgLimitSize.mobile.indexOf('x')
                                )}px`
                            }}
                        </p>
                        <UpLoads
                            v-for="item in [{ ...this.uploadForm, showType: 'pc' }, { ...this.uploadForm, showType: 'mobile' }]"
                            v-bind="item"
                            :key="item.showType"
                            v-show="formKey.client_type.includes(item.showType)"
                            @overSize="handleMaxSize"
                            useType="edit"
                            @on-success="uploadSuccess"
                            @on-format-error="handleFormatError"
                            :editPic="$route.params.page === 'edit' && formKey.desc_type === 'pic' ? descriptionShow : {}"
                        />
                    </div>
                </div>
                <!-- 选择pc和手机 -->
                <div class="mb20 add-acitivity" v-show="seltext" key="txt">
                    <div v-for="item in ['pc', 'mobile']" :key="item">
                        <span v-show="formKey.client_type.includes(item)" class="ib" style="width:80px;text-align:right">{{ item === 'pc' ? 'PC端' : '移动端' }}</span>
                        <UE
                            :defaultMsg="item === 'pc' ? defaultMsg1 : defaultMsg2"
                            :config="config"
                            :id="item === 'pc' ? ue1 : ue2"
                            :ref="item === 'pc' ? ue1 : ue2"
                            class="editor"
                            :class="item === 'pc' ? 'pc-editor' : 'yd-editor'"
                            v-show="formKey.client_type.includes(item)"
                        ></UE>
                    </div>
                </div>
            </div>
            <div v-if="formKey.activity_type == 'url_activity'" class="mt40">
                <div v-for="item in ['pc', 'mobile']" :key="item" class="mb20 mobile">
                    <FormItem
                        :label="`${item === 'pc' ? 'PC' : '移动端'}地址`"
                        :prop="item == 'pc' ? 'url_link_pc' : 'url_link_mobile'"
                        class="mb20 mt20"
                        v-if="formKey.client_type.includes(item)"
                    >
                        <Input placeholder="请输入标题文件地址" v-model="formKey.url_link[item]" class="w609x ml5" :key="item" />
                    </FormItem>
                </div>
            </div>
        </Form>

        <Button class="ivu-btn addSave ml100 mt20" :style="formKey.activity_type == 'apply_activity' ? 'margin-top:60px' : ''" @click="submit">{{
            $route.params.page === 'edit' ? '确认保存' : '确认新增'
        }}</Button>
        <Modal title="图片预览" class-name="vertical-center-modal"> </Modal>
    </div>
</template>
<script>
import UE from '_c/UE';
import { activityCateList, activityIns, activityUpt, activityDetail } from '@/api/system';
import { uploadImg, getActivityImgConfigSize } from '@/api/common';
import { getUserName, getToken } from '@/libs/util';
import { mapState } from 'vuex';
import UpLoads from './components/uploads';

export default {
    name: 'addActivities',
    components: {
        UpLoads,
        UE
    },
    data() {
        const validatePic = (rule, val, cb) => {
            if (this.formKey.client_type.includes('pc')) {
                if (!this.formKey.image.pc) {
                    // 采用信息提示，因为复用一个验证函数所以在勾选标题图片时候不会消除红色
                    // cb(new Error('请选择PC标题图片'))
                    this.$Message.error({ content: '请选择PC标题图片' });
                    return;
                }
            }
            if (this.formKey.client_type.includes('mobile')) {
                if (!this.formKey.image.mobile) {
                    // cb(new Error('请选择移动端标题图片'))
                    this.$Message.error({ content: '请选择移动端标题图片' });
                    return;
                }
            }
            cb();
        };
        const validatePUrl = (rule, val, cb) => {
            if (this.formKey.client_type.includes('pc')) {
                if (this.formKey.url_link.pc === undefined || this.formKey.url_link.pc.trim() === '') {
                    cb(new Error('请输入PC地址'));
                } else {
                    cb();
                }
            }
        };
        const validateMUrl = (rule, val, cb) => {
            if (this.formKey.client_type.includes('mobile')) {
                if (this.formKey.url_link.mobile === undefined || this.formKey.url_link.mobile.trim() === '') {
                    cb(new Error('请输入移动端地址'));
                } else {
                    cb();
                }
            }
        };
        //结束开始时间验证
        const validateTime = (rule, val, cb) => {
            if (this.formKey.online_time instanceof Date) {
                if (this.formKey.online_time.getTime() < val.getTime()) {
                    cb();
                } else {
                    cb(new RangeError('结束时间小于开始时间'));
                }
            } else {
                this.$refs.formKey.validateField('online_time');
            }
        };

        return {
            screen: screen.width,
            serchKey: {
                siteId: this.$root.nowSite.id
            },
            actlist: [],
            imgLimitSize: {
                pc: '750x280',
                mobile: '750x280'
            },
            timeOptions: {
                disabledDate(val) {
                    if (val.getTime() < new Date().getTime() - 86400000) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            rules: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                activity_date_type: [{ required: true, trigger: 'change', message: '请选择活动时间', pattern: /.+/ }],
                child_title: { required: true, message: '请输入副标题', trigger: 'blur', pattern: /.+/ },
                client_type: [{ required: true, message: '请选择客户端', trigger: 'change', pattern: /.+/ }],
                online_time: [{ type: 'date', required: true, message: '请选择开始日期', trigger: 'blur', pattern: /.+/ }],
                offline_time: [{ required: true, message: '请选择结束日期', trigger: 'blur', pattern: /.+/ }, { required: true, validator: validateTime }],
                activity_type: [{ required: true, message: '请选择活动类型', pattern: /.+/, trigger: 'change' }],
                image: [{ type: 'object', required: true, validator: validatePic, trigger: 'blur' }],
                url_link_pc: [{ required: true, validator: validatePUrl, trigger: 'blur' }],
                url_link_mobile: [{ required: true, validator: validateMUrl, trigger: 'blur' }],
                jump_button_url: [{ required: true, message: '请输入跳转链接', trigger: 'blur', pattern: /.+/ }],
                jump_button_name: [
                    {
                        required: true,
                        message: '请输入按钮名称',
                        trigger: 'blur'
                        // pattern: /.+/
                    }
                ]
            },

            //图片上传
            uploadList: [],
            uploadForm: {
                headers: { Authorization: getToken() },
                action: '/api/v2/uploadImg',
                data: { siteId: this.$root.nowSite.id },
                name: 'img'
            },
            //编辑框
            defaultMsg1: '',
            defaultMsg2: '',
            config: {
                initialFrameWidth: 900,
                initialFrameHeight: 350
            },
            ue1: 'ue1',
            ue2: 'ue2',
            showPcImg: false,
            showMoImg: false,
            seltext: true,
            selimg: false,
            type: false,
            visible: false,
            content: '',
            pc: true,
            h5: false,
            formKey: {
                jump_switch: false, //0关，1开
                adminId: 0,
                adminName: '',
                title: '',
                child_title: '',
                status: true,
                read_status: false,
                jump_button_name: '',
                jump_button_url: '',
                // desc_format_type: "text",
                activity_type: 'normal_activity',
                activity_date_type: 'lasting',
                //上传参数
                activity_cate_id: [],
                online_time: '',
                offline_time: '',
                client_type: [],
                image: {},
                desc_type: '',
                description: {},
                url_link: {}
            },
            imageShow: {},
            descriptionShow: {}
        };
    },
    watch: {
        'formKey.client_type': {
            handler(val) {}
        },
        'formKey.activity_type'() {
            // this.clearEditor()
        }
    },
    created() {
        if (this.$route.params.page === 'create') {
            this.getActivelist();
        }
        this.getActivityImgConfigSize();
        //刷新时候清除文本框的内容
        // this.clearEditor()
        //用户信息存入sessiStorage丢失处理
        if (!this.$store.state.user.userInfo) {
            this.$Tip.error({ content: '请重新登录', onOk: () => this.$store.commit('closeTag', this.$route) });
            setTimeout(this.$Tip.hide, 1000);
        } else {
            this.formKey.adminId = this.$store.state.user.userInfo.adminId;
            this.formKey.adminName = this.$store.state.user.userInfo.userName;
        }
    },
    methods: {
        handleFormatError(file) {
            this.$Tip.info({ content: '请上传图片' });
        },

        //文件上传成功后复制img地址，并打开显示
        uploadSuccess(res, type, useType) {
            if (res.code === 200) {
                if (useType === 'edit') {
                    this.formKey.description[type] = res.data.path;
                } else {
                    this.formKey.image[type] = res.data.path;
                }
            }
        },
        //这两个方法以及data函数里的一些showimg,seltext。。。等等可以借鉴新增公告里的
        handleView(val) {},

        handleMaxSize(file) {
            this.$Message.error('上传图片体积最大为2M');
        },
        onText() {
            this.seltext = true;
            this.selimg = false;
            this.formKey.desc_type = 'text';
            //切换文本编辑器是清空内容
            // this.clearEditor()
            // this.formKey.description.value = ' '
        },
        onImg() {
            this.selimg = true;
            this.seltext = false;
            this.formKey.desc_type = 'pic';
            // this.formKey.description = {}
        },
        //提交表单信息
        submit() {
            this.$refs.formKey.validate(valid => {
                if (valid) {
                    for (let key in this.formKey) {
                        if (!this.formKey[key] && key != 'status') delete this.formKey[key];
                    }
                    if (this.formKey.activity_cate_id.length == 0) {
                        this.$Message.error('请选择活动分类');
                        return;
                    }

                    if (this.formKey.activity_type == 'normal_activity') {
                        if (this.formKey.client_type.includes('pc') && this.formKey.client_type.indexOf('mobile') == -1) {
                            if (this.$refs.ue1[0].getUEContent() == '') {
                                this.$Message.error('请输入PC端内容');
                                return false;
                            }
                        }
                        if (this.formKey.client_type.includes('mobile') && this.formKey.client_type.indexOf('pc') == -1) {
                            if (this.$refs.ue2[0].getUEContent() == '') {
                                this.$Message.error('请输入移动端内容');
                                return false;
                            }
                        }
                        if (this.formKey.client_type.includes('mobile') && this.formKey.client_type.includes('pc')) {
                            if (this.$refs.ue1[0].getUEContent() == '') {
                                this.$Message.error('请输入PC端内容');
                                return false;
                            }

                            if (this.$refs.ue2[0].getUEContent() == '') {
                                this.$Message.error('请输入移动端内容');
                                return false;
                            }
                        }
                    }

                    let data = { ...this.formKey, ...this.serchKey };

                    data.jump_switch = data.jump_switch == true ? '1' : '0';

                    Object.keys(this.formKey.image).forEach(el => {
                        if (!this.formKey.client_type.includes(el)) {
                            delete this.formKey.image[el];
                            delete this.imageShow[el];
                        }
                    });

                    Object.keys(this.formKey.description).forEach(el => {
                        if (!this.formKey.client_type.includes(el) && el !== 'value') {
                            delete this.formKey.description[el];
                            delete this.descriptionShow[el];
                        }
                    });

                    Object.keys(data).forEach(val => {
                        if (val === 'activity_cate_id') {
                            if (this.formKey[val].includes(0) && this.formKey[val].length === 1) {
                                //[0]
                                data[val] = this.formKey[val].toString();
                            } else {
                                let arr = [...this.formKey[val]];
                                // arr.unshift(0)
                                data[val] = arr.toString();
                            }
                        } else if (val === 'child_title') {
                            if (this.formKey[val].trim() === '') {
                                data[val] = ' ';
                                // delete data[val]
                            }
                        } else if (val === 'client_type') {
                            data['client_type'] = this.formKey['client_type'].join(',');
                        } else if (val === 'status') {
                            data['status'] = this.formKey['status'] === true ? 'yes' : 'no';
                        } else if (val === 'read_status') {
                            data['read_status'] = this.formKey['read_status'] === true ? 'login_after' : 'login_before';
                        } else if (val === 'image') {
                            data[val] = JSON.stringify(this.formKey.image);
                        } else if (val === 'activity_date_type') {
                            //用户点击非lasting会把此字段读取进去提交删除
                            if (this.formKey[val] === 'lasting') {
                                delete data.online_time;
                                delete data.offline_time;
                            } else {
                                data.online_time = this.$root.formatTimeS(data.online_time);
                                data.offline_time = this.$root.formatTimeS(data.offline_time);
                            }
                        } else if (val === 'activity_type') {
                            if (data[val] === 'normal_activity') {
                                if (this.seltext) {
                                    this.formKey.client_type.map(item => {
                                        if (!(data.description instanceof Object)) {
                                            data.description = {};
                                        }

                                        item === 'pc' ? (data.description[item] = this.$refs.ue1[0].getUEContent()) : (data.description[item] = this.$refs.ue2[0].getUEContent());
                                    });
                                    data.description = JSON.stringify(data.description);
                                    data.desc_type = 'text';
                                } else if (this.selimg) {
                                    data.description = JSON.stringify(this.formKey.description);
                                    data.desc_type = 'pic';
                                }
                                delete data['url_link'];
                            } else if (data[val] === 'url_activity') {
                                delete data.description;
                                delete data.desc_type;
                                data['url_link'] = JSON.stringify(this.formKey.url_link);
                            }
                        }
                    });
                    //console.log(data);
                    if (this.$route.params.page === 'edit') {
                        //console.log(data);
                        activityUpt(data, true).then(res => {
                            try {
                                if (res.code === 200) {
                                    this.resetForm(this.formKey);
                                    this.$store.commit('closeTag', this.$route);
                                    setTimeout(() => {
                                        this.$Message.success('活动更新成功');
                                    }, 1000);
                                    this.$router.push({
                                        name: 'activeList'
                                    });
                                }
                            } catch (e) {}
                        });
                    } else {
                        activityIns(data, true).then(res => {
                            try {
                                if (res.code === 200) {
                                    this.resetForm(this.formKey);
                                    this.$store.commit('closeTag', this.$route);
                                    setTimeout(() => {
                                        this.$Message.success('活动添加成功');
                                    }, 1000);
                                    this.$router.push({
                                        name: 'activeList'
                                    });
                                }
                            } catch (e) {}
                        });
                    }
                }
            });
        },
        //清空表单
        resetForm(obj) {
            //文本编辑框修复不知道咋回事不会
            // this.clearEditor()
            for (let val in obj) {
                if (typeof obj[val] === 'object') {
                    if (obj[val] instanceof Array) {
                        obj[val] = [];
                    } else {
                        if (val === 'description') {
                            Object.keys(obj[val]).map(item => {
                                if (item !== 'value') {
                                    delete obj[val][item];
                                } else {
                                    obj[val][item] = ' ';
                                }
                            });
                        } else {
                            obj[val] = {};
                        }
                    }
                } else {
                    if (val === 'status' && val === 'read_status' && val == 'jump_button_name') {
                        obj[val] = false;
                    } else {
                        obj[val] = '';
                    }
                }
            }
        },
        getActivelist() {
            return activityCateList({ siteId: this.$root.nowSite.id }).then(res => {
                this.actlist = res.data;
                if (this.$route.params.page === 'create') {
                    // if (this.actlist[0] && this.actlist[0].id) {
                    //   this.formKey.activity_cate_id = this.actlist[0].id
                    // }
                }
                if (res.code !== 200) {
                    this.$Tips.error('无法获取活动分类');
                }
            });
        },
        getActivityImgConfigSize() {
            getActivityImgConfigSize({ siteId: this.$root.nowSite.id, type: 'activity_size' }).then(res => {
                if (res && res.code === 200) {
                    const { data } = res;
                    if (Array.isArray(data))
                        data.forEach(el => {
                            this.imgLimitSize[el.client_type] = el.activity_size;
                        });
                }
            });
        },
        // clearEditor () {
        //   this.$nextTick(() => {
        //     if (document.querySelector('.add-acitivity .w-e-text')) {
        //       document.querySelector('.add-acitivity .w-e-text').innerHTML = ''
        //     }
        //   })
        // },
        //初始化编辑框内容
        initEdit(obj) {
            Object.keys(this.formKey).forEach(el => {
                if (el === 'activity_cate_id') {
                    if (obj[el]) {
                        this.formKey[el] = obj[el].split(',').map(el => +el);
                    }
                } else if (el === 'client_type') {
                    if (obj[el]) {
                        this.formKey[el] = obj[el].split(',');
                    }
                } else if (el === 'image') {
                    if (obj[el]) {
                        this.formKey[el] = JSON.parse(obj['image']);
                        this.imageShow = JSON.parse(obj['imageShow']);
                    }
                } else if (el === 'status') {
                    this.formKey[el] = obj[el] === 'yes' ? true : false;
                } else if (el === 'read_status') {
                    // console.log(43333)

                    this.formKey[el] = obj[el] === 'login_before' ? false : true;
                } else if (el === 'online_time') {
                    if (obj[el]) {
                        this.formKey.online_time = this.$root.unixTime(obj[el]);
                    }
                } else if (el === 'offline_time') {
                    if (obj[el]) {
                        this.formKey.offline_time = this.$root.unixTime(obj[el]);
                    }
                } else if (el === 'url_link') {
                    if (obj.activity_type === 'url_activity') {
                        if (obj[el] !== '') {
                            this.formKey[el] = obj[el].startsWith('{') ? JSON.parse(obj[el]) : obj[el];
                        }
                    }
                } else {
                    if (obj.activity_type === 'url_activity') {
                        obj.description = {};
                        obj.descriptionShow = {};
                    }
                    if (obj[el]) {
                        this.formKey[el] = obj[el];
                    }
                }
            });
            if (this.formKey.activity_type === 'normal_activity') {
                if (this.formKey.desc_type && this.formKey.desc_type === 'text') {
                    this.onText();
                    this.formKey.description = this.formKey.description && JSON.parse(this.formKey.description);

                    this.defaultMsg1 = this.formKey.description.pc ? this.formKey.description.pc : '';

                    this.defaultMsg2 = this.formKey.description.mobile ? this.formKey.description.mobile : '';
                } else if (this.formKey.desc_type === 'pic') {
                    this.onImg();
                    this.formKey.description = JSON.parse(obj['description']);
                    this.descriptionShow = JSON.parse(obj['descriptionShow']);
                }
            }
            //修复链接活动对调位置出错
            this.formKey.url_link === '' ? (this.formKey.url_link = {}) : void 0;
            const { id } = obj;
            this.formKey.id = id;
        },
        delActCeId() {
            let arr = this.formKey.activity_cate_id;
            let len = arr.length;
            if (arr.includes(0) && len > 1) {
                if (arr[len - 1] === 0) {
                    this.formKey.activity_cate_id = arr.filter(el => el === 0);
                } else {
                    this.formKey.activity_cate_id = arr.filter(el => el !== 0);
                }
            }
            this.active_id = this.formKey.activity_cate_id;
        }
    },
    mounted() {
        //获取编辑值
        this.$nextTick(() => {
            if (this.$route.params.page === 'edit') {
                // 直接用this.$root.nowSite.id异步第一次请求失败用页面传过来的参数
                this.getActivelist()
                    .then(() => {
                        let data = { id: this.$route.query.id, siteId: this.$route.query.siteId };
                        activityDetail(data).then(res => {
                            if (res.code === 200) {
                                res.data.jump_switch = res.data.jump_switch == 1 ? true : false;
                                this.initEdit(res.data);
                            }
                        });
                    })
                    .catch();
            }
        });
        if (this.$route.params.page === 'create') {
            this.formKey.client_type.push(...['pc', 'mobile']);
        }
    }
};
</script>
<style scoped lang="less">
@import '../../../styles/button.less';
.jumpButton {
    margin-bottom: 20px !important;
    /deep/.ivu-form-item-label {
        width: 82px !important;
    }
}

.activeClass {
    /deep/.ivu-form-item-label {
        margin-left: -19px !important;
    }
}
.mr3 {
    margin-right: 3px;
}
.mr25 {
    margin-right: 25px;
}
.ml85 {
    margin-left: 85px;
}
.font {
    color: #c5c5c5;
}
.v2-search {
    margin-left: 50px;
}
.v2-button {
    display: inline-block;
    vertical-align: middle;
}
.v2-button .ivu-btn {
    border-color: #dcdcdc;
    // color:#C5C5C5;
    color: #666666;
    background-color: #fff;
}
/deep/.v2-button .active {
    background-color: #2d8cf0;
    border-color: #62b1fd;
    // color: #62B1FD;
    color: #fff;
    box-shadow: none !important;
}
.upLoad {
    width: 345px;
    height: 140px;
    border: 1px solid #e4e4e4;
}
.upLoad :nth-child(1) {
    border-left: 0;
}
.upLoadPC {
    width: 690px;
    height: 140px;
    border: 1px solid #e4e4e4;
}
/deep/.ivu-form-item-error-tip {
    top: 33px;
}
.demo-upload-list {
    display: inline-block;
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 140px;
    // border: 1px solid transparent;
    // border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
    // margin-right: 4px;
}
.demo-upload-list img {
    width: 100%;
    height: 100%;
}
.demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
    display: block;
}
.demo-upload-list-cover i {
    color: #fff;
    font-size: 1.25rem /* 20/16 */;
    cursor: pointer;
    margin: 0 2px;
}
.vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    /deep/.ivu-modal {
        top: 0;
    }
}
// 上传图片样式
.upload-img {
    width: 750px;
    height: 185px;
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    .content {
        margin-left: 10px;
        margin-bottom: 20px;
    }
}
/deep/.pic.ivu-form-item {
    margin: 0;
    height: 190px;
}
.edit-img {
    margin-left: 95px;
    position: relative;
}
//编辑框样式
.editor {
    display: inline-block;
    margin-left: 10px;
    vertical-align: top;
    margin-bottom: 10px;
}
.pc-editor {
    margin-left: 20px;
}
.yd-editor {
    margin-left: 20px;
}

/deep/.ivu-form-item-content {
    margin-left: 5px !important;
}
.active {
    /deep/.ivu-form-item-content {
        height: auto;
    }
    /deep/.ivu-select .ivu-select-selection {
        height: auto !important;
        .ivu-tag-text {
            color: #444;
        }
    }
}

.txt-l {
    position: absolute;
    top: -30px;
}
/deep/.content-txt {
    line-height: 34px;
}
/deep/.content-title {
    line-height: 40px;
}
/deep/ .content {
    height: 149px !important;
}

.mobile {
    /deep/.ivu-form-item-label {
        width: 82px !important;
    }
}
</style>
