<template>
  <div>
    <div class="v2-search">
      <div v-if="type === 'first'">
        <Form ref="searchKey" inline>
          <FormItem label="发放状态">
            <Select
              class="s-80"
              v-model="recordForm.status"
              placeholder="全部"
              clearable
            >
              <Option value="no">未发放</Option>
              <Option value="yes">已发放</Option>
              <Option value="cancel">已取消</Option>
            </Select>
          </FormItem>
          <FormItem label="会员账号">
            <Input
              class="w190x"
              v-model="recordForm.username"
              @keyup.enter.native="getRecordData"
              placeholder="请输入会员账号"
            />
          </FormItem>
          <FormItem label="开始日期">
            <DatePicker
              type="date"
              class="s-140"
              placeholder="开始日期"
              v-model="recordTime[0]"
            ></DatePicker>
          </FormItem>
          <FormItem label="结束日期">
            <DatePicker
              type="date"
              class="s-140"
              placeholder="结束日期"
              v-model="recordTime[1]"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              class="search"
              :loading="$root.tableLoading"
              @click.prevent="getRecordData"
              >查询</Button
            >
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              class="ivu-btn export"
              @click.prevent="exportExcel"
              :loading="$root.exportBtnLoading"
              >导出Excel</Button
            >
          </FormItem>
          <Button
            v-show="sendTip"
            class="fr"
            type="primary"
            style="height: 36px"
            @click.prevent="sendDonate(recordForm, 'all')"
            >一键发放</Button
          >
          <Button
            v-show="sendPublic"
            class="fr mr20"
            type="primary"
            style="height: 36px"
            @click.prevent="sendPublicList"
            >公开名单</Button
          >
        </Form>
      </div>
      <div v-if="type === 'count'">
        <Form ref="searchKey" inline>
          <FormItem>
            <Button type="primary" @click="openAddDeploy">添加期数</Button>
          </FormItem>
          <FormItem label="状态">
            <Select
              class="s-80"
              v-model="searchKey.status"
              placeholder="全部"
              clearable
            >
              <Option value="on">未开始</Option>
              <Option value="open">进行中</Option>
              <Option value="off">已结束</Option>
              <!-- <Option value="open">统计中</Option>
              <Option value="off">計算中</Option> -->
            </Select>
          </FormItem>
          <FormItem label="开始日期">
            <DatePicker
              type="date"
              class="s-140"
              placeholder="开始日期"
              v-model="Time[0]"
            ></DatePicker>
          </FormItem>
          <FormItem label="结束日期">
            <DatePicker
              type="date"
              class="s-140"
              placeholder="结束日期"
              v-model="Time[1]"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              class="search"
              :loading="$root.tableLoading"
              @click.prevent="getDeployData"
              >查询</Button
            >
          </FormItem>
        </Form>
      </div>
      <div v-if="type === 'preset'">
        <Form ref="searchKey" inline>
          <FormItem v-if="presetTheDayList === 1">
            <Button type="primary" @click="openPreset">预设获奖名单</Button>
          </FormItem>
          <FormItem label="状态">
            <Select
              class="s-80"
              v-model="presetKey.public_status"
              placeholder="全部"
              clearable
            >
              <!-- <Option value="all">全部</Option> -->
              <Option value="no">未公开</Option>
              <Option value="yes">已公开</Option>
            </Select>
          </FormItem>
          <FormItem label="开始日期">
            <DatePicker
              type="date"
              class="s-140"
              placeholder="开始日期"
              v-model="Time[0]"
            ></DatePicker>
          </FormItem>
          <FormItem label="结束日期">
            <DatePicker
              type="date"
              class="s-140"
              placeholder="结束日期"
              v-model="Time[1]"
            ></DatePicker>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              class="search"
              :loading="$root.tableLoading"
              @click.prevent="getPresetList"
              >查询</Button
            >
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="v2-search bb">
      <span
        v-for="item in modeBtns"
        class="modeBtns ib cs ft16"
        @click="changeType(item)"
        :class="type === item.type ? 'active' : ''"
        :key="item.type"
        >{{ item.name }}</span
      >
    </div>
    <div class="v2-table">
      <Tables
        v-if="type === 'first'"
        ref="first"
        :columns="recordTable.columns"
        :loading="$root.tableLoading"
        :value="recordTable.data"
        :total="recordTable.total"
        @on-page-change="onRecordPageChange"
        :pageSizeOpts="recordTable.pageSizeOpts"
      ></Tables>
      <Tables
        v-if="type === 'count'"
        ref="count"
        :columns="table.columnsDeploy"
        :loading="$root.tableLoading"
        :value="table.data"
        :total="table.total"
        @on-page-change="onDeployPageChange"
        :pageSizeOpts="table.pageSizeOpts"
      ></Tables>
      <Tables
        v-if="type === 'preset'"
        ref="count"
        :columns="presetDataTable.columns"
        :loading="$root.tableLoading"
        :value="presetDataTable.data"
        :total="presetDataTable.total"
        @on-page-change="onPresetPageChange"
        :pageSizeOpts="presetDataTable.pageSizeOpts"
      ></Tables>
    </div>

    <Modals
      ref="sitePeriodModal"
      title="添加期数"
      :width="950"
      @closeModal="closeModel('addPeriod', typeBtn)"
    >
      <div
        slot="content"
        class="modal-overflow v2-form-wrapper pt10"
        style="max-height: 800px; overflow: auto"
      >
        <Form
          ref="periodNewForm"
          :model="periodForm"
          :rules="periodRule"
          :label-width="170"
          style="width: 850px"
        >
          <FormItem label="比赛期数" prop="level_range">
            <Select
              v-model="periodForm.level_range"
              class="w400x"
              placeholder="请选择期数"
            >
              <Option
                :disabled="
                  choseNumber.length >= 0 && String(choseNumber).includes(item)
                "
                v-for="(item, i) in 50"
                :value="item"
                :key="i"
                >第 {{ chineseNumber(item) }} 期
              </Option>
            </Select>
          </FormItem>
          <FormItem label="活动标题" prop="title">
            <Input
              v-model="periodForm.title"
              placeholder="请输入1~20个字的活动标题"
              class="w400x"
              :maxlength="20"
            />
          </FormItem>
          <div class="clearfix">
            <FormItem class="ib fl" label="统计时段" prop="stats_start">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                v-model="periodForm.stats_start"
                placeholder="开始时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
            <span class="fl ib ml20 mr10 h36">-</span>
            <FormItem
              class="ib fl"
              style="margin-left: -195px"
              prop="stats_end"
            >
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                v-model="periodForm.stats_end"
                placeholder="结束时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
          </div>
          <FormItem label="有效打码" prop="bet_amount">
            <Input
              v-model="periodForm.bet_amount"
              placeholder="请输入活动游戏配置类型累积有效打码"
              class="w400x"
            />
          </FormItem>
          <!-- <FormItem label="初始金额" prop="ini_amount">
            <Input
              v-model="periodForm.ini_amount"
              placeholder="此金额会从会员账号扣除,且会翻10倍作为参赛的初始资金"
              class="w400x"
            />
          </FormItem> -->
          <div class="clearfix">
            <FormItem class="ib fl" label="比赛时间" prop="start_time">
              <DatePicker
                type="datetime"
                v-model="periodForm.start_time"
                placeholder="开始时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
            <span class="fl ib ml20 mr10 h36">-</span>
            <FormItem class="ib fl" style="margin-left: -195px" prop="end_time">
              <DatePicker
                type="datetime"
                v-model="periodForm.end_time"
                placeholder="结束时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
          </div>
          <FormItem label="排名奖金" class="ivu-form-item-required">
            <Tables
              ref="table"
              :value="table.rankData"
              :columns="table.columnsRank"
              :page="false"
              class="w400x rank-box"
            >
            </Tables>
            <div>
              <footer
                class="txt-a footer c62Color cs w400x"
                style="background: #f4faff"
                v-if="isEdit && table.rankData.length < 100"
                @click.prevent="addConfig('addConfig')"
              >
                <Icons type="xinzeng" size="14" class="mr5"></Icons>添加
              </footer>
            </div>
            <div class="ivu-form-item-error-tip" v-if="showTip">
              请添加排名和奖金
            </div>
          </FormItem>
          <FormItem label="游戏配置" class="ivu-form-item-required clearfix">
            <div class="fl">
              <Checkbox
                :indeterminate="allIndeterminate"
                v-model="allCheckAll"
                @click.prevent.native="handleCheckAll('typeAll', typeBtn)"
                >全选</Checkbox
              >
            </div>
            <div class="fl">
              <span
                v-for="(item, index) in newNav"
                class="all-btn-bg pl20 pr20 ib ft14 w105x cs tag"
                @click="getType(item, index,'addPeriod')"
                :class="typeBtn === item.type ? 'active-all-btn-bg' : ''"
                :key="item.typeBtn"
                >{{ item.name }}</span
              >
            </div>
            <div
              class="fl b mt5"
              style="width: 630px; height: 7em; overflow-y: auto"
            >
              <Checkbox
                class="ml5 fl"
                :indeterminate="indeterminate[typeBtn]"
                v-model="checkAll[typeBtn]"
                @click.prevent.native="handleCheckAll('gameAll', typeBtn)"
                >全选
              </Checkbox>
              <CheckboxGroup
                class="ml5"
                v-model="periodForm.checkAllGroup[typeBtn]"
                @on-change="checkAllGroupChange($event, typeBtn)"
              >
                <Checkbox
                  v-for="item in gameList"
                  :key="item.name"
                  :label="item.name"
                ></Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
          <FormItem>
            <Button
              class="submit h50"
              type="primary"
              style="width: 400px; margin-bottom: 40px"
              :loading="$root.editBtnLoading"
              @click.prevent="submitAddDeploy"
              >确认添加</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>
    <Modals
      ref="siteEditModal"
      title="编辑期数"
      :width="950"
      @closeModal="closeModel('editPeriod', typeBtn)"
    >
      <div
        slot="content"
        class="modal-overflow v2-form-wrapper pt10"
        style="max-height: 800px; overflow: auto"
      >
        <Form
          ref="periodEditForm"
          :model="periodForm"
          :rules="periodRule"
          :label-width="170"
          style="width: 850px"
        >
          <FormItem label="比赛期数" prop="level_range">
            <Select
              v-model="periodForm.level_range"
              class="w400x"
              placeholder="请选择期数"
              disabled
            >
              <Option
                v-for="item in table.data"
                :key="item.level_range"
                :value="item.level_range"
              >
                第 {{ chineseNumber(item.level_range) }} 期</Option
              >
            </Select>
          </FormItem>
          <FormItem label="活动标题" prop="title">
            <Input
              v-model="periodForm.title"
              placeholder="请输入1~20个字的活动标题"
              class="w400x"
              :maxlength="20"
            />
          </FormItem>
          <div class="clearfix">
            <FormItem class="ib fl" label="统计时段" prop="stats_start">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                v-model="periodForm.stats_start"
                placeholder="开始时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
            <span class="fl ib ml20 mr10 h36">-</span>
            <FormItem
              class="ib fl"
              style="margin-left: -195px"
              prop="stats_end"
            >
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                v-model="periodForm.stats_end"
                placeholder="结束时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
          </div>
          <FormItem label="有效打码" prop="bet_amount">
            <Input
              v-model="periodForm.bet_amount"
              placeholder="请输入累积有效打码"
              class="w400x"
            />
          </FormItem>
          <!-- <FormItem label="初始金额" prop="ini_amount">
            <Input
              v-model="periodForm.ini_amount"
              placeholder="此金额会从会员账号扣除,且会翻10倍作为参赛的初始资金"
              class="w400x"
            />
          </FormItem> -->
          <div class="clearfix">
            <FormItem class="ib fl" label="比赛时间" prop="start_time">
              <DatePicker
                type="datetime"
                v-model="periodForm.start_time"
                placeholder="开始时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
            <span class="fl ib ml20 mr10 h36">-</span>
            <FormItem class="ib fl" style="margin-left: -195px" prop="end_time">
              <DatePicker
                type="datetime"
                v-model="periodForm.end_time"
                placeholder="结束时间"
                style="width: 195px;"
                placement="bottom"
              ></DatePicker>
            </FormItem>
          </div>
          <FormItem label="排名獎金" class="ivu-form-item-required">
            <Tables
              ref="table"
              :value="editDeployTable.data"
              :columns="editDeployTable.columns"
              :page="false"
              class="w400x"
            >
            </Tables>
            <div>
              <footer
                class="txt-a footer c62Color cs w400x"
                style="background: #f4faff"
                @click.prevent="addConfig('editConfig')"
              >
                <Icons type="xinzeng" size="14" class="mr5"></Icons>添加
              </footer>
            </div>
          </FormItem>
          <FormItem label="游戏配置" class="ivu-form-item-required clearfix">
            <div class="fl">
              <Checkbox
                :indeterminate="allIndeterminate"
                v-model="allCheckAll"
                @click.prevent.native="handleCheckAll('typeAll', typeBtn)"
                >全选</Checkbox
              >
            </div>
            <div class="fl">
              <span
                v-for="(item, index) in newNav"
                class="all-btn-bg pl20 pr20 ib ft14 w105x cs tag"
                @click="getType(item, index,'editPeriod')"
                :class="typeBtn === item.type ? 'active-all-btn-bg' : ''"
                :key="item.typeBtn"
                >{{ item.name }}</span
              >
            </div>
            <div
              class="fl b mt5"
              style="width: 630px; height: 7em; overflow-y: auto"
            >
              <Checkbox
                class="ml5 fl"
                :indeterminate="indeterminate[typeBtn]"
                v-model="checkAll[typeBtn]"
                @click.prevent.native="handleCheckAll('gameAll', typeBtn)"
                >全选
              </Checkbox>
              <CheckboxGroup
                class="ml5"
                v-model="periodForm.checkAllGroup[typeBtn]"
                @on-change="checkAllGroupChange($event, typeBtn)"
              >
                <Checkbox
                  v-for="item in gameList"
                  :key="item.name"
                  :label="item.name"
                ></Checkbox>
              </CheckboxGroup>
            </div>
          </FormItem>
          <FormItem>
            <Button
              class="submit h50"
              type="primary"
              style="width: 400px; margin-bottom: 40px"
              :loading="$root.editBtnLoading"
              @click.prevent="submitEditDeploy"
              >确认保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>

    <Modals ref="siteShowModal" title="活动详情" :width="950">
      <div
        slot="content"
        class="modal-overflow v2-form-wrapper pt10"
        style="max-height: 800px; overflow: auto"
      >
        <Form :label-width="170" style="width: 850px; min-height: 650px">
          <FormItem label="比赛期数">
            <span>第 {{ chineseNumber(periodForm.level_range) }} 期</span>
          </FormItem>
          <FormItem label="活动标题">
            <span>{{ periodForm.title }}</span>
          </FormItem>
          <div class="clearfix">
            <FormItem class="ib fl" label="统计时段">
              {{ this.$root.newFormatTime(periodForm.stats_start) }} <span >-</span> {{ this.$root.newFormatTime(periodForm.stats_end) }} 
            </FormItem>
          </div>
          <FormItem label="有效打码">
            <span>{{ periodForm.bet_amount }}</span>
          </FormItem>
          <!-- <FormItem label="初始金额">
            <span>{{ periodForm.ini_amount }}</span>
          </FormItem> -->
          <div class="clearfix">
            <FormItem class="ib fl" label="比赛时间">
              {{ this.$root.formatTimeS(periodForm.start_time) }} <span >-</span> {{ this.$root.formatTimeS(periodForm.end_time) }}
            </FormItem>
          </div>
          <FormItem label="排名奖金">
            <Tables
              ref="table"
              :value="detailsDeployTable.data"
              :columns="detailsDeployTable.columns"
              :page="false"
              :loading="$root.tableLoading"
              class="w400x"
            >
            </Tables>
          </FormItem>
          <FormItem label="游戏配置" v-if="detailsGameList !== undefined">
            <div>
              <span
                v-for="(item,key) in detailsGameList"
                :key="item.typeBtn"
                class="cs tag"
                style="padding:11px 0"
                ><span
                  class="all-btn-bg pl20 pr20 ib ft14 w105x"
                  @click="getDetailsType(key)"
                  :class="typeBtn === key ? 'active-all-btn-bg' : ''"
                  v-if="detailsGameList[key].length >0"
                  >{{ changeChineName(key) }}</span
                ></span
              >
            </div>
            <div>
              <div
                v-for="(item, index) in detailsGameList[typeBtn]"
                :key="index"
                class="pt10 pr20 ib ft14"
              >
                <span>{{ item.name }}</span>
              </div>
            </div>
          </FormItem>
        </Form>
      </div>
    </Modals>

    <Modals
      ref="sitePresetAddModal"
      title="预设获奖名单"
      :width="750"
      @closeModal="closeModel('addPreset', typeBtn)"
    >
      <div
        slot="content"
        class="modal-overflow v2-form-wrapper pt10"
        style="max-height: 800px; overflow: auto"
      >
        <Form
          ref="presetForm"
          :model="presetForm"
          :rules="presetRule"
          :label-width="200"
          style="width: 700px"
        >
          <FormItem label="比赛期数" prop="stage"
            ><span
              style="position: relative; top: 1px"
              v-if="this.presetList.length !== 0"
              >第 {{ chineseNumber(this.levelRange) }} 期</span
            ></FormItem
          >
          <FormItem label="获奖名单">
            <span
              style="position: absolute; top: 3px; left: -5.5em; color: #f60"
              >*</span
            >
            <Tables
              ref="table"
              :value="presetTable.data"
              :columns="presetTable.columns"
              :page="false"
              :loading="$root.tableLoading"
              class="w400x rank-box"
            >
            </Tables>
            <div>
              <footer
                class="txt-a footer c62Color cs w400x"
                style="background: #f4faff"
                v-if="isEdit && presetTable.data.length < 100"
                @click.prevent="addConfig('presetConfig')"
              >
                <Icons type="xinzeng" size="14" class="mr5"></Icons>添加
              </footer>
            </div>
          </FormItem>
          <FormItem>
            <Button
              class="submit h50"
              type="primary"
              style="width: 400px"
              :loading="$root.editBtnLoading"
              @click.prevent="submitAddPreset"
              >确认添加</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>

    <Modals
      ref="sitePresetModal"
      title="编辑获奖名单"
      :width="750"
      @closeModal="closeModel('editPreset', typeBtn)"
    >
      <div slot="content" class="modal-overflow v2-form-wrapper pt10">
        <Form
          ref="presetNewForm"
          :model="presetNewForm"
          :rules="presetNewRule"
          :label-width="250"
          style="width: 700px"
        >
          <FormItem label="比赛期数" prop="stage"
            ><span style="position: relative; top: 1px"
              >第 {{ chineseNumber(presetNewForm.stage) }} 期</span
            ></FormItem
          >
          <FormItem label="会员账号" prop="userName">
            <Input
              v-model="presetNewForm.userName"
              placeholder="请输入1~20个字的活动标题"
              class="w340x"
              :maxlength="20"
              disabled
            />
          </FormItem>
          <FormItem label="赛间打码" prop="bet_amount">
            <Input
              v-model="presetNewForm.bet_amount"
              placeholder="请输入累积有效打码"
              class="w340x"
            />
          </FormItem>
          <FormItem>
            <Button
              class="submit h50"
              type="primary"
              :loading="$root.editBtnLoading"
              @click.prevent="submit"
              >确认保存</Button
            >
          </FormItem>
        </Form>
      </div>
    </Modals>

    <Modals ref="errorTip" title="温馨提醒" :width="550" @closeModal="closeModel('errorTip')">
      <div
        slot="content"
        class="modal-overflow v2-form-wrapper"
        style="display: block"
      >
        <div class="txt flex-row" style="padding: 0px 10px">
          <i
            size="26"
            class="iconfont icon-danchuangtishi"
            style="font-size: 26px; color: rgb(87, 163, 243)"
          ></i>
          <div class="font">{{ errorTable.msg }}</div>
        </div>
        <div class="txt flex-row" style="margin: -55px 0 0 0; padding: 0 15px">
          <div class="font">
            <span v-for="item in errorTable.userNames" :key="item.index">{{
              item
            }}</span>
          </div>
        </div>
        <div class="btns flex-row">
          <Button
            class="submit h50"
            type="primary"
            :loading="$root.editBtnLoading"
            @click="closeModel('errorTip')"
            >确认</Button
          >
        </div>
      </div>
    </Modals>
  </div>
</template>
<script>
import Tables from "_c/tables";
import Icons from "_c/icons";
import Modals from "@/components/modals";
import Preset from "./components/preset_table";
import {
  getZhengbasaiRecordList,
  getzhengbasaiConfigList,
  zhengbasaiAddConfig,
  zhengbasaiDelConfig,
  sendZhengbasaiDonate,
  cancelZhengbasaiDonate,
  getzhengbasaiStageList,
  getPresetZhengbasaiStageList,
  getZhengbasaiPrearrangedList,
  getPresetZhengbasaiPresetTheDayList,
  zhengbasaiAddPrearranged,
  zhengbasaiDelPrearranged,
  zhengbasaiEditPrearranged,
  sendZhengbasaiPublic,
} from "@/api/activity";
import { getgameClassData } from "@/api/common";

export default {
  name: "competition",
  components: {
    Tables,
    Modals,
    Icons,
    Preset,
  },
  data() {
    return {
      typeBtn: "lottery",
      newNav: [
        { id: 10000, name: "彩票游戏", type: "lottery" },
        { id: 10001, name: "电子游艺", type: "slot" },
        { id: 10002, name: "体育赛事", type: "sport" },
        { id: 10003, name: "真人视讯", type: "live_casino" },
        { id: 10004, name: "棋牌游戏", type: "chess" },
        { id: 10005, name: "捕鱼游戏", type: "getfish" },
      ],
      allIndeterminate: false,
      indeterminate: {
        lottery: false,
        slot: false,
        sport: false,
        live_casino: false,
        chess: false,
        getfish: false,
      },
      gameList: [],
      detailsGameList: [],
      allCheckAll: false,
      checkAll: {
        lottery: false,
        slot: false,
        sport: false,
        live_casino: false,
        chess: false,
        getfish: false,
      },
      nameObj: {
        lottery: [],
        slot: [],
        sport: [],
        live_casino: [],
        chess: [],
        getfish: [],
      },
      recordForm: {
        siteId: this.$root.nowSite.id,
        status: "all",
        username: "",
      },
      searchKey: {
        siteId: this.$root.nowSite.id,
        status: "all",
      },
      presetKey: {
        siteId: this.$root.nowSite.id,
        public_status: "no",
      },
      periodForm: {
        level_range: "",
        title: "",
        // ini_amount: "", // TODO
        bet_amount: "",
        stats_start: "",
        stats_end: "",
        start_time: "",
        end_time: "",
        checkAllGroup: {},
      },
      periodRule: {
        level_range: [
          {
            required: true,
            message: "请选择期数",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入1~20个字的活动标题",
            trigger: "blur",
          },
        ],
        stats_start: [
          {
            required: true,
            message: "请选择统计时段",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        stats_end: [
          {
            required: true,
            message: "请选择统计时段",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        // ini_amount: [
        //   {
        //     required: true,
        //     message: "请输入初始金额",
        //     trigger: "blur",
        //     pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
        //   },
        // ], // TODO
        bet_amount: [
          {
            required: true,
            message: "请输入活动游戏配置类型累积有效打码",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
          },
        ],
        start_time: [
          {
            required: true,
            message: "请选择比赛时间",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
        end_time: [
          {
            required: true,
            message: "请选择比赛时间",
            trigger: "blur",
            pattern: /.+/,
          },
        ],
      },
      presetForm: {
        level_range: "",
        reward_amount: "",
      },
      presetRule: {
        level_range: [],
      },
      presetNewForm: {
        id: "",
        stage: "",
        userName: "",
        bet_amount: "",
      },
      presetNewRule: {
        stage: [],
        userName: [],
        bet_amount: [
          {
            required: true,
            message: "请输入赛间打码",
            trigger: "blur",
            pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/,
          },
        ],
      },
      choseNumber: [],
      presetList: [],
      newArrData: [],
      errorTable: [],
      presetTheDayList: [],
      statsStar: "",
      type: "first",
      rowIndex: "",
      levelRange: "",
      showTip: false,
      isEdit: true,
      reward: false,
      sendTip: false,
      sendPublic: false,
      recordTablePublicStatus: "",
      isStatusEnd: false,
      isAnyCanDonate: false,
      Time: [],
      recordTime: [],
      modeBtns: [
        { type: "first", name: "争霸赛记录" },
        { type: "count", name: "争霸赛配置" },
        { type: "preset", name: "已预设名单" },
      ],

      table: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 50, 100, 150],
        data: [],
        rankData: [],
        columns: [],
        columnsDeploy: [
          {
            title: "期数",
            key: "level_range",
            align: "center",
            minWidth: 30,
            render: (h, params) => {
              return <span>第 {this.chineseNumber(params.row.level_range)} 期</span>;
            },
          },
          {
            title: "统计时段",
            key: "condition",
            align: "center",
            minWidth: 150,
            render: (h, params) => {
              return (
                <div>
                  <span>{params.row.condition.stats_start}</span> ~{" "}
                  <span>{params.row.condition.stats_end}</span>
                </div>
              );
            },
          },
          {
            title: "累积有效打码",
            key: "condition",
            align: "center",
            minWidth: 50,
            tooltip: true,
            render: (h, params) => {
              return (
                "span",
                [h("span", Number(params.row.condition.bet_amount).toFixed(2))]
              );
            },
          },
          // {
          //   title: "初始金额",
          //   key: "condition",
          //   align: "center",
          //   minWidth: 50,
          //   tooltip: true,
          //   render: (h, params) => {
          //     return (
          //       "span",
          //       [h("span", Number(params.row.condition.ini_amount).toFixed(2))]
          //     );
          //   },
          // }, // TODO
          {
            title: "最高奖金",
            key: "reward_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "比赛时间",
            key: "created_at",
            align: "center",
            minWidth: 200,
            tooltip: true,
            render: (h, params) => {
              return (
                <span>
                  {params.row.start_time} ~ {params.row.end_time}
                </span>
              );
            },
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            minWidth: 20,
            render: (h, params) => {
              let status =
                params.row.status === "on" || params.row.status === "stats"
                  ? "未开始"
                  : params.row.status === "open"
                  ? "进行中"
                  : "已结束";
              let color =
                params.row.status === "on" || params.row.status === "stats"
                  ? "#2D8cF0"
                  : params.row.status === "open"
                  ? "#FF2626"
                  : "#666666";
              return <span style={{ color }}>{status}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 90,
            render: (h, params) => {
              return (
                <div>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status === "on" ||
                        params.row.status === "stats"
                          ? "inline-block"
                          : "none",

                      color:
                        params.row.status !== "on" ||
                        params.row.status !== "stats"
                          ? "#2D8cF0"
                          : "",
                    }}
                    onClick={() => {
                      this.openEditDeploy(params, "editPeriod");
                    }}
                  >
                    編輯
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status === "on" ||
                        params.row.status === "stats"
                          ? "none"
                          : "inline-block",
                      color:
                        params.row.status !== "on" ||
                        params.row.status !== "stats"
                          ? "#2D8cF0"
                          : "",
                    }}
                    onClick={() => {
                      this.openEditDeploy(params, "detailsPeriod");
                    }}
                  >
                    详情
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.status == "on"
                          ? "inline-block"
                          : "none",
                    }}
                    onClick={() => {
                      this.delDeployConfig(params);
                    }}
                  >
                    刪除
                  </span>
                </div>
              );
            },
          },
        ],
        columnsRank: [
          {
            title: "争霸赛排名",
            key: "rewards",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                "div",
                [
                  h("InputNumber", {
                    class: "w30",
                    props: {
                      value: this.table.rankData[params.index].rank_start,
                      min: 1,
                      max: 500,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = null;
                        this.table.rankData[params.index].rank_start = e;
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      class: "ml10 mr10",
                    },
                    "~"
                  ),
                  h("InputNumber", {
                    class: "w30",
                    props: {
                      value: this.table.rankData[params.index].rank_end,
                      min: 1,
                      max: 500,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = null;
                        this.table.rankData[params.index].rank_end = e;
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "争霸赛奖金",
            key: "reward_amount",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                "div",
                [
                  h("InputNumber", {
                    class: "w80",
                    props: {
                      value: this.table.rankData[params.index].reward_amount,
                      min: 1,
                      max: 9999999999,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = null;
                        this.table.rankData[params.index].reward_amount = e;
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              return (
                <span
                  class="blue-font"
                  onClick={() => {
                    this.delAddConfig(params, "addPeriod");
                  }}
                >
                  删除
                </span>
              );
            },
          },
        ],
      },
      //爭霸賽排名
      editDeployTable: {
        pageSizeOpts: [20, 50, 100, 150],
        data: [],
        columns: [
          {
            title: "争霸赛排名",
            key: "rewards",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                "div",
                [
                  h("InputNumber", {
                    class: "w30",
                    props: {
                      value:
                        Number(params.row.rank_start) === null ||
                        Number(params.row.rank_start) === ""
                          ? null
                          : Number(params.row.rank_start),
                      min: 1,
                      max: 500,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = null;
                        this.editDeployTable.data[params.index].rank_start = e;
                      },
                    },
                  }),
                  h(
                    "span",
                    {
                      class: "ml10 mr10",
                    },
                    "~"
                  ),
                  h("InputNumber", {
                    class: "w30",
                    props: {
                      value:
                        Number(params.row.rank_end) === null ||
                        Number(params.row.rank_end) === ""
                          ? null
                          : Number(params.row.rank_end),
                      min: 1,
                      max: 500,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = null;
                        this.editDeployTable.data[params.index].rank_end = e;
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "争霸赛奖金",
            key: "reward_amount",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                "div",
                [
                  h("InputNumber", {
                    class: "w80",
                    props: {
                      value:
                        Number(params.row.reward_amount) === null ||
                        Number(params.row.reward_amount) === ""
                          ? null
                          : Number(params.row.reward_amount),
                      min: 1,
                      max: 9999999999,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = null;
                        this.editDeployTable.data[
                          params.index
                        ].reward_amount = e;
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              return (
                <span
                  class="blue-font"
                  onClick={() => {
                    this.delAddConfig(params, "editPeriod");
                  }}
                >
                  删除
                </span>
              );
            },
          },
        ],
      },
      detailsDeployTable: {
        loading: true,
        data: [],
        columns: [
          {
            title: "争霸赛排名",
            key: "rewards",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                <div>
                  <span>第 {params.row.rank_start}</span>
                  <span
                    style={{
                      display:
                        params.row.rank_end === null
                          ? "none"
                          : params.row.rank_end === ""
                          ? "none"
                          : "inline-block",
                    }}
                  >
                    {" "}
                    ~ {params.row.rank_end}{" "}
                  </span>
                  <span> 名</span>
                </div>
              );
            },
          },
          {
            title: "争霸赛奖金",
            key: "reward_amount",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                "div", [h("span", Number(params.row.reward_amount).toFixed(2))]
              );
            },
          },
        ],
      },
      presetTable: {
        total: 0,
        loading: true,
        data: [],
        columns: [
          {
            title: "会员帐号",
            key: "userName",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                "div",
                [
                  h("Input", {
                    class: "w50",
                    props: {
                      value: this.presetTable.data[params.index].userName,
                    },
                    on: {
                      "on-blur": (e) => {
                        if (!e) e = null;
                        this.presetTable.data[params.index].userName =
                          e.target.value;
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "赛间打码",
            key: "bet_amount",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                "div",
                [
                  h("InputNumber", {
                    class: "w80",
                    props: {
                      value: this.presetTable.data[params.index].bet_amount,
                      min: 1,
                      max: 9999999999,
                    },
                    on: {
                      "on-change": (e) => {
                        if (!e) e = null;
                        this.presetTable.data[params.index].bet_amount = e;
                      },
                    },
                  }),
                ]
              );
            },
          },
          {
            title: "操作",
            key: "action",
            align: "center",
            render: (h, params) => {
              return (
                <span
                  class="blue-font"
                  onClick={() => {
                    this.delAddConfig(params, "addPreset");
                  }}
                >
                  删除
                </span>
              );
            },
          },
        ],
      },
      recordTable: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 50, 100, 150],
        data: [],
        columns: [
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 95,
            render: (h, params) => {
              return (
                <div>
                  <span>{params.row.userName}</span>
                  <span
                    class="celan pl10 pr10"
                    style={{
                      display:
                        params.row.stats_bet_amount &&
                        params.row.stats_bet_amount === "0.00"
                          ? "inline-block"
                          : "none",
                    }}
                  >
                    预设
                  </span>
                </div>
              );
            },
          },
          {
            title: "达标打码",
            key: "stats_bet_amount",
            align: "center",
            minWidth: 95,
            tooltip: true,
          },
          {
            title: "赛间打码",
            key: "race_bet_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "排名",
            key: "rank",
            align: "center",
            minWidth: 50,
            render: (h, params) => {
              return (
                <span>{+params.row.rank || "-" }</span>
              );
            },
          },
          {
            title: "会员输赢",
            key: "net_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
            render: (h, params) => {
              let color =
                params.row.net_amount > 0 ? "#FF2626" :
                params.row.net_amount < 0 ? "#06bc22" : "#444";
              return <span style={{ color }}>{params.row.net_amount}</span>;
            },
          },
          {
            title: "奖金金额",
            key: "reward_amount",
            align: "center",
            minWidth: 50,
            tooltip: true,
          },
          {
            title: "发放状态",
            key: "status",
            align: "center",
            minWidth: 35,
            render: (h, params) => {
              let status = params.row.status === "no" ? "未发放" :
                params.row.status === "yes" ? "已发放" : "已取消";
              let color =
                params.row.status === "no" ? "#FF2626" :
                params.row.status === "yes" ? "#2D8cF0" : "#666666";
              return <span style={{ color }}>{status}</span>;
            },
          },
          {
            title: "名单状态",
            key: "public_status",
            align: "center",
            minWidth: 35,
            render: (h, params) => {
              let public_status =
                params.row.public_status === "no" ? "未公开" : 
                params.row.public_status === "yes" ? "已公开" : "-";
              let color =
                params.row.public_status === "no" ? "#FF2626" :
                params.row.public_status === "yes" ? "#2D8cF0" : "#239961";
              return <span style={{ color }}>{public_status}</span>;
            },
          },
          {
            title: "比赛日期",
            key: "race_date",
            align: "center",
            minWidth: 50,
            tooltip: true,
            render: (h, params) => {
              return (
                <span>
                  {this.$root.formatTime(params.row.race_date * 1000)}
                </span>
              );
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 90,
            render: (h, params) => {
              return (
                <div>
                  <p
                    style={{
                      display:
                        params.row.stats_bet_amount !== "0.00" && 
                        params.row.rank !== 0  && 
                        params.row.status === "no"
                        ? "inline-block" : "none",
                      color: params.row.stage !== "0" ? "#2d8cf0" : "#c3c3c3",
                    }}
                  >
                    <span class="ib mr10 blue-font"
                          onClick={() => { this.cancelSendDonate(params, "nosend"); }}
                    >
                      取消发放
                    </span>
                    <span class="ib mr10 blue-font"
                      onClick={() => { this.sendDonate(params, "single"); }}
                    >
                      发放
                    </span>
                  </p>
                  <span class="ib mr10 blue-font"
                        style={{
                            display:
                              params.row.stats_bet_amount !== "0.00" && 
                              params.row.rank !== 0  && 
                              (params.row.status === "no" || params.row.status === "cancel")
                              ? "none" : "inline-block"
                          }}
                  >
                    -
                  </span>
                </div>
              );
            },
          },
        ],
      },
      presetDataTable: {
        total: 0,
        loading: true,
        pageSizeOpts: [20, 50, 100, 150],
        data: [],
        columns: [
          {
            title: "期数",
            key: "stage",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let stage = params.row.stage;
              return <span>第 {this.chineseNumber(stage)} 期</span>;
            },
          },
          {
            title: "会员账号",
            key: "userName",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let userName = params.row.userName;
              let startUserName = userName.slice(0, 3);
              let endUserName = userName.slice(-4);
              return (
                <span>
                  {startUserName}****{endUserName}
                </span>
              );
            },
          },
          {
            title: "赛间打码",
            key: "bet_amount",
            align: "center",
            minWidth: 160,
          },
          {
            title: "排名",
            key: "rank",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              return (
                <span>{+params.row.rank || "-" }</span>
              );
            },
          },
          {
            title: "奖金金额",
            key: "reward_amount",
            align: "center",
            minWidth: 100,
          },
          {
            title: "比赛日期",
            key: "race_date",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let raceDatege = params.row.race_date;
              return (
                <span>
                  {raceDatege == 0
                    ? null
                    : this.$root.formatTime(raceDatege * 1000)}
                </span>
              );
            },
          },
          {
            title: "名单状态",
            key: "public_status",
            align: "center",
            minWidth: 100,
            render: (h, params) => {
              let public_status =
                params.row.public_status === "no" ? "未公开" : "已公开";
              let color =
                params.row.public_status === "no" ? "#FF2626" : "#2D8cF0";
              return <span style={{ color }}>{public_status}</span>;
            },
          },
          {
            title: "操作",
            align: "center",
            minWidth: 90,
            render: (h, params) => {
              return (
                <div>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.public_status !== "yes" ||
                        params.row.public_status === "no"
                        ? "inline-block" : "none",
                    }}
                    onClick={() => {
                      this.openEditPreset(params);
                    }}
                  >
                    编辑
                  </span>
                  <span
                    class="ib mr10 blue-font"
                    style={{
                      display:
                        params.row.public_status !== "open" ||
                        params.row.public_status === "no"
                        ? "inline-block" : "none",
                    }}
                    onClick={() => {
                      this.delPresetConfig(params);
                    }}
                  >
                    删除
                  </span>
                </div>
              );
            },
          },
        ],
      },
    };
  },
  watch: {
    'recordTable.data': {
      handler(data) {
        this.$nextTick(function(){
          this.isAnyCanDonate = !data.length ? false : data.some(item => item.rank > 0 && item.status == "no");        //含任一已排名但未發放
          this.sendPublic = !!data.length
          this.showSendDonate();
        })
      }
    },
    'presetList.status': {
      immediate: true,
      handler(val) {
        this.isStatusEnd = val === "end" || val === "off"
      }
    }
  },
  created() {
    this.getPresetStageList();
    this.getRecordData(this.recordForm);
  },
  methods: {
    changeChineName(key){
      let chineseName =  this.newNav.filter((item)=>{
        return item.type === key  
      })
      return chineseName[0].name || ''
    },
    getGameList() {
      let data = {
        params: {
          siteId: this.$root.nowSite.id,
        },
      };
      getgameClassData(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.newNav = res.data;
            this.newNav.sort(function (a, b) {
              return a.id - b.id;
            });
            this.newNav.forEach((item) => {
              item.list.forEach((itemList) => {
                if (itemList.platform) {
                  itemList.code = itemList.platform;
                }
                delete itemList.classId;
                delete itemList.status;
                delete itemList.platform;
              });
            });
            this.gameList = this.newNav[0].list;
          }
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
    },
    getDeployData() {
      let data = {
        params: {
          siteId: this.$root.nowSite.id,
          status:
            this.searchKey.status == undefined ? "all" : this.searchKey.status,
          page: this.page,
        },
      };
      for (let key in this.searchKey) {
        if (!this.searchKey[key]) delete this.searchKey[key];
      }
      if (this.$root.validateTime(this.Time)) {
        const [start_time, end_time] = this.$root.validateTime(this.Time);
        data.params.start_time = start_time && this.$root.formatTimeX(start_time);
        data.params.end_time = end_time && this.$root.formatnightTimeS(end_time);
      }
      this.searchKey.start_time = data.params.start_time;
      this.searchKey.end_time = data.params.end_time;
      for (let key in data.params) {
        if (!data.params[key]) delete data.params[key];
      }

      this.$root.startTableLoading();
      
      getzhengbasaiConfigList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            const { data, total } = res.data;
            this.table.data = data;
            this.table.total = total;
            data.forEach((res) => {
              res.start_time = this.$moment
                .unix(res.start_time)
                .format("YYYY-MM-DD HH:mm:ss");
              res.end_time = this.$moment
                .unix(res.end_time)
                .format("YYYY-MM-DD HH:mm:ss");
              res.condition = JSON.parse(res.condition);
              res.condition.stats_start = this.$moment
                .unix(res.condition.stats_start)
                .format("YYYY-MM-DD HH:mm");
              res.condition.stats_end = this.$moment
                .unix(res.condition.stats_end)
                .format("YYYY-MM-DD HH:mm");
              let newArr = res.condition.rewards;
              this.newArrData = newArr.sort(function (a, b) {
                return b.reward_amount - a.reward_amount;
              });
              res.reward_amount = this.newArrData[0].reward_amount;
            });
          }
          this.$root.endTableLoading();
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });

      // 期數 list api
      getzhengbasaiStageList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            this.numberTable = res.data;
            let arr = [];
            res.data.forEach((el) => {
              arr.push(parseInt(el));
            });
            this.choseNumber = arr;
          }
        })
        .catch((error) => {
          return error;
        });
    },
    handleCheckAll(key, typeBtn) {
      switch (key) {
        case "typeAll":
          if (this.allIndeterminate) {
            this.allCheckAll = false;
            this.checkAll[typeBtn] = false
            for (let el in this.indeterminate) {
              this.indeterminate[el] = false
            }
          } else {
            this.allCheckAll = !this.allCheckAll;
            this.checkAll[typeBtn] = !this.checkAll[typeBtn];
          }
          this.allIndeterminate = false          
          this.indeterminate[typeBtn] = false
          if (this.allCheckAll) {
            this.newNav.forEach((item) => {
              this.checkAll[item.type] = true;
            });
            this.newNav.forEach((item) => {
              this.periodForm.checkAllGroup[item.type] = [];
              item.list.forEach((res) => {
                this.periodForm.checkAllGroup[item.type].push(res.name);
              });
            });
            this.nameObj = {
              lottery: [{ id: 0, code: "all", name: "all" }],
              slot: [{ id: 0, code: "all", name: "all" }],
              sport: [{ id: 0, code: "all", name: "all" }],
              live_casino: [{ id: 0, code: "all", name: "all" }],
              chess: [{ id: 0, code: "all", name: "all" }],
              getfish: [{ id: 0, code: "all", name: "all" }],
            };
          } else {
            this.newNav.forEach((item) => {
              this.checkAll[item.type] = false;
              this.nameObj[item.type] = this.periodForm.checkAllGroup[item.type] = [];
            });
          }
          break;
        case "gameAll":
          if (this.indeterminate[typeBtn]) {
            this.checkAll[typeBtn] = false;
          } else {
            this.checkAll[typeBtn] = !this.checkAll[typeBtn];
          }
          this.allIndeterminate = false  
          this.indeterminate[typeBtn] = false;
          if (this.checkAll[typeBtn]) {
            this.nameObj[typeBtn] = [];
            this.periodForm.checkAllGroup[typeBtn] = [];
            this.gameList.forEach((res) => {
              this.periodForm.checkAllGroup[typeBtn].push(res.name);
            });
            this.allGameList = [{ id: 0, code: "all", name: "all" }];
            this.nameObj[typeBtn].push(this.allGameList[0]);
          } else {
            this.nameObj[typeBtn] = this.periodForm.checkAllGroup[typeBtn] = [];
          }
          break;
        default:
          break;
      }
    },
    checkAllGroupChange(data, key) {
      this.nameObj[key] = [];
      data.forEach((selectsData) => {
        let newGameNav = this.gameList.filter((res) => {
          return res.name === selectsData;
        });
        this.nameObj[key].push(newGameNav[0]);
      });
      this.allIndeterminate = data.length > 0 ? true : false;
      this.indeterminate[key] = data.length > 0 ? true : false;
      this.checkAll[key] = false;
    },
    getType(item) {
      this.typeBtn = item.type;
      this.gameList = item.list;
    },
    getDetailsType(key) {
      this.typeBtn = key
      this.detailsGameList[this.typeBtn].forEach((res) => {
        if (res.id === 0 && res.code === "all" && res.name === "all") {
          this.detailsGameList[this.typeBtn] = this.newNav.filter((el)=>{
            return el.type === this.typeBtn
          })[0].list
        }
      });
    },
    sendPublicList() {
      let confirmMsg = "您确定在客户单公开此期排名名单？";
      let data = {
        siteId: this.$root.nowSite.id,
      };

      if (this.recordTime) {
        const [start_time, end_time] = this.recordTime;
        data.start_time = !start_time || start_time === "Invalid date" ? undefined : this.$root.formatTime(start_time);
        data.end_time = !end_time || end_time === "Invalid date" ? undefined : end_time && this.$root.formatTime(end_time);
      }
      this.recordTime.start_time = data.start_time;
      this.recordTime.end_time = data.end_time;
      
      this.$Tip.confirm({
        content: confirmMsg,
        onOk: () => {
          this.$root.startTableLoading();
          sendZhengbasaiPublic(data, true)
            .then((res) => {
              if (
                res !== undefined &&
                res.code === 200 &&
                res.data.code !== 400
              ) {
                this.$Message.success({ content: res.data });
                this.getRecordData();
              }
              this.$root.endTableLoading();
            })
            .catch((error) => {
              this.$root.endTableLoading();
            });
        },
      });
    },
    closeModel(key, typeBtn) {
      switch (key) {
        case "addPeriod":
          this.periodForm.level_range = ''
          this.checkAll[typeBtn] = false;
          this.periodForm.checkAllGroup = {}
          this.$refs.periodNewForm.resetFields();
          this.table.rankData.splice(this.table.rankData);
          break;
        case "editPeriod":
          this.periodForm.level_range = ''
          this.indeterminate = {};
          this.periodForm.checkAllGroup = {}
          this.getDeployData();
          break; 
        case "addPreset":
          this.$refs.presetForm.resetFields();
          this.presetTable.data.splice(this.presetTable.data);
          break;
        case "editPreset":
          this.$refs.presetNewForm.resetFields();
          break;
        case "errorTip":
          this.$refs.errorTip.hide();
        default:
          break;
      }
      this.showTip = false;
    },
    getPresetList() {
      let params = {
        siteId: this.$root.nowSite.id,
        public_status:
          this.presetKey.public_status === undefined
            ? "all"
            : this.presetKey.public_status,
        page: this.page,
        status :'all'
      };
      for (let key in this.presetKey) {
        if (!this.presetKey[key]) delete this.presetKey[key];
      }
      if (this.$root.validateTime(this.Time)) {
        const [start_time, end_time] = this.$root.validateTime(this.Time);

        params.start_time = start_time && this.$root.formatTime(start_time);
        params.end_time = end_time && this.$root.formatTime(end_time);
      }

      this.presetKey.start_time = params.start_time;
      this.presetKey.end_time = params.end_time;
      for (let key in params) {
        if (!params[key]) delete params[key];
      }
      this.$root.startTableLoading();
      getZhengbasaiPrearrangedList(params)
        .then((res) => {
          if (res && res.code === 200) {
            const { data, total } = res.data;
            this.presetDataTable.data = data;
            this.presetDataTable.total = total;
            this.getPresetStageList();
          }
          this.$root.endTableLoading();
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
        this.getPresetTheDayList();

    },

    openPreset() {
      this.$refs.sitePresetAddModal.show();
    },
    openEditPreset(params) {
      this.$refs.sitePresetModal.show();
      this.presetNewForm.id = params.row.id;
      this.presetNewForm.stage = params.row.stage;
      let startUserName = params.row.userName.slice(0, 3);
      let endUserName = params.row.userName.slice(-4);
      this.presetNewForm.userName = startUserName + "****" + endUserName;
      this.presetNewForm.bet_amount = parseInt(params.row.bet_amount);
    },
    delPresetConfig(params) {
      let text =
        params.row === "yes"
          ? ""
          : "您确定删除【第" + `${params.row.stage}` + "期】吗？";
      let msg = params.row === "yes" ? "" : "刪除成功";
      const data = {
        siteId: this.$root.nowSite.id,
        id: params.row.id,
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          // 不是代理升降级都可以调接口
          zhengbasaiDelPrearranged(data, true).then((res) => {
            if (res != undefined && res.code == 200 && res.data.code != 400) {
              this.$Message.config({ top: 150, duration: 1 });
              this.$Message.success({ content: msg });
              this.getPresetList(); 
            } else if (
              res != undefined &&
              res.code == 200 &&
              res.data.code == 400
            ) {
              this.tip = res.data.message;
              this.$refs.autoSearch.removeDefault();
              this.$refs.removeMembers.show();
            }
          });
        },
      });
    },
    resetDeployForm() {
      for (let index in this.periodForm) {
        this.periodForm[index] = "";
      }
    },
    resetPresetForm() {
      for (let index in this.presetForm) {
        this.presetForm[index] = "";
      }
    },
    resetPresetNewForm() {
      for (let index in this.presetNewForm) {
        this.presetNewForm[index] = "";
      }
    },

    submit() {
      this.$refs.presetNewForm.validate((valid) => {
        if (valid) {
          let data = {
            siteId: this.$root.nowSite.id,
            id: this.presetNewForm.id,
            bet_amount: this.presetNewForm.bet_amount,
          };
          this.$root.startTableLoading();
          zhengbasaiEditPrearranged(data).then((res) => {
            if (this.bet_amount === null) {
              this.$Tip.info({ content: "请输入赛间打码" });
              this.$root.endTableLoading();
            } else if (res != undefined && res.code == 200) {
              this.$Message.success("修改成功");
              this.$refs.sitePresetModal.hide();
              this.getPresetList();
              this.$root.endTableLoading();
            } else {
              this.$refs.sitePresetModal.hide();
            }
          });
        }
      });
    },
    submitAddPreset() {
      this.$refs.presetForm.validate((valid) => {
        if (valid) {
          let rewards = [];
          this.presetTable.data.forEach((res) => {
            rewards.push(res);
            delete res.initRowIndex;
            this.userName = res.userName;
            this.betAmount = res.bet_amount;
            if (this.userName === null && this.betAmount === null) {
              this.$Tip.info({ content: "请添加获奖名单！" });
              this.stopPropagation();
            } else if (this.userName === null || this.userName === "") {
              this.$Tip.info({ content: "会员账号不能为空！" });
              this.stopPropagation();
            } else if (this.betAmount === null || this.betAmount === "") {
              this.$Tip.info({ content: "赛间打码不能为空！" });
              this.stopPropagation();
            }
          });
          let data = {
            siteId: this.$root.nowSite.id,
            stage: this.levelRange,
            config: JSON.stringify(rewards),
          };

          if (this.Time) {
            const [start_time, end_time] = this.Time;
            data.start_time = !start_time || start_time === "Invalid date" ? undefined : this.$root.formatTime(start_time);
            data.end_time = !end_time || end_time === "Invalid date" ? undefined : this.$root.formatTime(end_time);
          }
          this.Time.start_time = data.start_time;
          this.Time.end_time = data.end_time;

          if (rewards.length == 0) {
            this.$Tip.info({ content: "请添加获奖名单！" });
          } else {
            this.$root.startTableLoading();
            zhengbasaiAddPrearranged(data).then((res) => {
              if (res !== undefined && res.status === 410) {
                this.errorTable = res;
                this.errorTable.userNames = res.userNames.join();
                this.$refs.errorTip.show();
              } else if (res != undefined && res.code == 200) {
                this.$Message.success("添加成功");
                this.resetPresetForm();
                this.reward = true;
                this.$refs.sitePresetAddModal.hide();
                this.getPresetList();
              }
              this.$root.endTableLoading();
            });
          }
        }
      });
    },
    submitAddDeploy() {
      this.$refs.periodNewForm.validate((valid) => {
        if (valid == false) {
          this.showTip = true;
        } else if (valid == true) {
          let rewards = [];
          this.table.rankData.forEach((res) => {
            delete res.initRowIndex;
            if (
              res.rank_start === null &&
              res.rank_end === null &&
              res.reward_amount === null
            ) {
              this.$Tip.info({ content: "排名和奖金不可为空白！" });
              this.stopPropagation();
            } else if (res.rank_start == null) {
              res.rank_start = res.rank_end;
              res.rank_end = null;
            } else {
              res.rank_start = res.rank_start;
              res.rank_end = res.rank_end;
            }
            rewards.push(res);
          });
          if (rewards.length === 0) {
            this.showTip = true;
          } else {
            let games = this.nameObj;
            let selectChese = []
            for(let el in games) {
              selectChese.push(games[el].length > 0 ? true : false)
            } 
            this.allChese = selectChese.some((item)=>{
              return item
            })
            if(!this.allChese ) {
              this.$Tip.info({ content: "请选择游戏配置！" });
              this.stopPropagation();
            }else{
              let periodAddData = {
                title: this.periodForm.title,
                bet_amount: this.periodForm.bet_amount,
                // ini_amount: this.periodForm.ini_amount, // TODO
                stats_start: this.$root.formatTimeS(this.periodForm.stats_start),
                stats_end: this.$root.formatTimeS(this.periodForm.stats_end),
                rewards: rewards,
                games: games,
              };
              const data = {
                siteId: this.$root.nowSite.id,
                active_type: "zhengbasai", // TODO active_type
                config: JSON.stringify(periodAddData),
                level_range: this.periodForm.level_range,
                start_time: this.$root.formatTimeS(this.periodForm.start_time),
                end_time: this.$root.formatTimeS(this.periodForm.end_time),
              };
              this.$root.startTableLoading();
              zhengbasaiAddConfig(data).then((res) => {
                if (res != undefined && res.code == 200) {
                  this.$Message.success("添加成功");
                  this.periodForm.level_range = ''
                  this.indeterminate = {};
                  this.periodForm.checkAllGroup = {}
                  this.table.rankData.splice(this.table.rankData);
                  this.$refs.sitePeriodModal.hide();
                  this.getDeployData();
                  this.$root.endTableLoading();
                } 
              });
            } 
          }
        }
      });
    },
    submitEditDeploy() {
      this.$refs.periodEditForm.validate((valid) => {
        if (valid) {
          let rewards = [];
          this.editDeployTable.data.forEach((res) => {
            rewards.push(res);
            delete res.initRowIndex;
          });

          let games = this.nameObj;
          let selectChese = []
          for(let el in games) {
            selectChese.push(games[el].length > 0 ? true : false)
          } 
          this.allChese = selectChese.some((item)=>{
            return item
          })
          if(!this.allChese ) {
            this.$Tip.info({ content: "请选择游戏配置！" });
            this.stopPropagation();
          }else{
            let periodEditData = {
              title: this.periodForm.title,
              bet_amount: this.periodForm.bet_amount,
              // ini_amount: this.periodForm.ini_amount,
              stats_start: this.$root.formatTimeS(this.periodForm.stats_start),
              stats_end: this.$root.formatTimeS(this.periodForm.stats_end),
              rewards: rewards,
              games: games,
            };
            const data = {
              siteId: this.$root.nowSite.id,
              active_type: "zhengbasai", // TODO active_type 
              config: JSON.stringify(periodEditData),
              level_range: this.periodForm.level_range,
              start_time: this.$root.formatTimeS(this.periodForm.start_time),
              end_time: this.$root.formatTimeS(this.periodForm.end_time),
            };
            this.$root.startTableLoading();
            zhengbasaiAddConfig(data).then((res) => {
              if (res != undefined && res.code == 200) {
                this.$Message.success("保存成功");
                this.periodForm.level_range = ''
                this.indeterminate = {};
                this.$refs.siteEditModal.hide();
                this.getDeployData();
                this.$root.endTableLoading();
              } 
            });
          }  
        }
      });
    },

    changeType(item) {
      this.type = item.type;
      this.reward = true;
      if (this.type == "first") {
        this.getRecordData();
      } else if (this.type == "count") {
        this.getGameList();
        this.getDeployData();
      } else if (this.type == "preset") {
        this.getPresetList();
      }
    },
    onDeployPageChange(page) {
      this.page = page;
      this.getDeployData(page);
    },
    onRecordPageChange(page) {
      this.page = page;
      this.getRecordData(page);
    },
    onPresetPageChange(page) {
      this.page = page;
      this.getPresetList(page);
    },
    openAddDeploy() {
      this.typeBtn= 'lottery'
      this.periodForm.level_range = ''
      this.periodForm.checkAllGroup= {}
      this.gameList = this.newNav[0].list
      this.nameObj[this.typeBtn]= []
      this.indeterminate = {}
      this.allCheckAll = false
      this.allIndeterminate = false
      this.checkAll[this.typeBtn] = false
      this.$refs.sitePeriodModal.show();
      this.$refs.periodNewForm.resetFields();
      this.table.rankData.splice(this.table.rankData);
    },

    openEditDeploy(params, key) {
      this.periodForm.level_range = ''
      this.periodForm.checkAllGroup = {}
      this.rowIndex = params.index;
      this.editDeployTable.data = params.row.condition.rewards;
      this.detailsDeployTable.data = params.row.condition.rewards;
      let newArr = params.row.condition.rewards;
      this.detailsDeployTable.data = newArr.sort(function (a, b) {
        return a.rank_start - b.rank_start;
      });
      this.detailsGameList = params.row.condition.games
      switch (key) {
        case "editPeriod":
          this.typeBtn = "lottery";
          this.nameObj = this.detailsGameList
          this.gameList = this.newNav[0].list;    
          for (let itemType in this.detailsGameList) {
            // this.$nextTick(()=>{
              this.detailsGameList[itemType].forEach((el)=>{
                if (el.id === 0 && el.code === "all" && el.name === "all"){
                  this.checkAllBox = []
                  this.newNav.forEach((item) => {
                    item.list.forEach((res) => {
                      this.checkAllBox.push(res.name);
                    });
                  }); 
                  this.periodForm.checkAllGroup[itemType] = this.checkAllBox
                }else{
                  if(Array.isArray(this.periodForm.checkAllGroup[itemType])){
                    this.periodForm.checkAllGroup[itemType].push(el.name)
                  }else{
                    this.periodForm.checkAllGroup[itemType]= []
                    this.periodForm.checkAllGroup[itemType].push(el.name)
                  }
                }
                this.allIndeterminate = this.periodForm.checkAllGroup[itemType].length > 0 ? true : false;
                if(this.periodForm.checkAllGroup[itemType] === [] || this.periodForm.checkAllGroup[itemType].length>0){
                  this.indeterminate[itemType] = true
                }else{
                  this.indeterminate[itemType] = false
                }
              })
            // })
          }
          this.$refs.siteEditModal.show();     
          break;
        case "detailsPeriod":
          if(this.detailsGameList !== undefined){
            this.typeBtn = "lottery";
            this.detailsGameList[this.typeBtn].forEach((res) => {
              if (res.id === 0 && res.code === "all" && res.name === "all") {
                this.detailsGameList[this.typeBtn] = this.newNav.filter((el)=>{
                  return el.type === this.typeBtn
                })[0].list
              }
            });
          }
          this.$refs.siteShowModal.show();
          break;
      }
      this.periodForm.level_range = params.row.level_range;
      this.periodForm.title = params.row.condition.title;
      // this.periodForm.ini_amount = params.row.condition.ini_amount; // TODO
      this.periodForm.bet_amount = params.row.condition.bet_amount;
      this.periodForm.stats_start = params.row.condition.stats_start;
      this.periodForm.stats_end = params.row.condition.stats_end;
      this.periodForm.start_time = params.row.start_time;
      this.periodForm.end_time = params.row.end_time;
      this.periodForm.rank_start = params.row.condition.rewards.rank_start;
      this.periodForm.rank_end = params.row.condition.rewards.rank_end;
      this.periodForm.reward_amount =
        params.row.condition.rewards.reward_amount;
    },
    addConfig(key) {
      //爭霸賽配置
      this.rankNewTable = {
        rank_start: null,
        rank_end: null,
        reward_amount: null,
      };
      //已預設名單
      this.presetNewTable = {
        userName: null,
        bet_amount: null,
      };
      switch (key) {
        case "addConfig":
          this.table.rankData.push(this.rankNewTable);
          this.showTip = false;
          break;
        case "editConfig":
          this.editDeployTable.data.push(this.rankNewTable);
          break;
        case "presetConfig":
          this.presetTable.data.push(this.presetNewTable);
          break;
        default:
          break;
      }
    },

    delAddConfig(params, key) {
      switch (key) {
        case "addPeriod":
          this.table.rankData.splice(params.index,1);
          break;
        case "editPeriod":
          this.editDeployTable.data.splice(params.index, 1);
          break;
        case "addPreset":
          this.presetTable.data.splice(params.index, 1);
          break;
        default:
          break;
      }
    },
    delDeployConfig(params) {
      let text = "您确定删除【第" + `${params.row.level_range}` + "期】吗？";
      let msg = "发放成功";
      const data = {
        siteId: this.$root.nowSite.id,
        id: params.row.level_id,
      };
      this.$Tip.confirm({
        content: text,
        onOk: () => {
          // 不是代理升降级都可以调接口
          zhengbasaiDelConfig(data, true).then((res) => {
            if (res != undefined && res.code == 200 && res.data.code != 400) {
              this.$Message.config({ top: 150, duration: 1 });
              this.$Message.success({ content: msg });
              this.getDeployData(data);
            } else if (
              res != undefined &&
              res.code == 200 &&
              res.data.code == 400
            ) {
              this.tip = res.data.message;
              this.$refs.autoSearch.removeDefault();
              this.$refs.removeMembers.show();
            }
          });
        },
      });
    },
    getPresetStageList() {
      let params = {
          siteId: this.$root.nowSite.id
      };
      
      if (this.Time) {
        const [start_time, end_time] = this.Time;
        params.start_time = !start_time || start_time === "Invalid date" ? undefined : this.$root.formatTime(start_time);
        params.end_time = !end_time || end_time === "Invalid date" ? undefined : this.$root.formatTime(end_time);
      }
      this.Time.start_time = params.start_time;
      this.Time.end_time = params.end_time;

      this.$root.startTableLoading();
      let data = {
        params: {...params}
      }
      getPresetZhengbasaiStageList(data)
        .then((res) => {
          if (res != undefined && res.code === 200) {
            this.presetList = res.data;
            this.levelRange = this.presetList.level_range;
            this.recordTime[0] = this.$root.unixTime(
              this.presetList.start_time
            );
            this.recordTime[1] = this.$root.unixTime(this.presetList.end_time);
            (this.recordTime = [this.recordTime[0], this.recordTime[1]]),
              this.getRecordData(this.recordTime);
          }
          this.$root.endTableLoading();
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
    },

    getPresetTheDayList() {
      let params = {
        siteId: this.$root.nowSite.id,
      };
      if (this.Time) {
        const [start_time, end_time] = this.Time;
        params.start_time = !start_time || start_time === "Invalid date" ? undefined : this.$root.formatTime(start_time);
        params.end_time = !end_time || end_time === "Invalid date" ? undefined : this.$root.formatTime(end_time);
      }
      this.Time.start_time = params.start_time;
      this.Time.end_time = params.end_time;
      
      getPresetZhengbasaiPresetTheDayList(params)
        .then((res) => {
          if (res != undefined && res.code === 200) {
            this.presetTheDayList = res.data.prearranged;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
    },

    getRecordData() {
      let params = {
        siteId: this.$root.nowSite.id,
        status: this.recordForm.status === undefined ? "all" : this.recordForm.status,
        start_time: this.recordForm.start_time,
        end_time: this.recordForm.end_time,
        page: this.page,
      };
      for (let key in this.recordTime) {
        if (!this.recordTime[key]) delete this.recordTime[key];
      }
      if (this.recordTime) {
        const [start_time, end_time] = this.recordTime;
        params.start_time = !start_time || start_time === "Invalid date" ? undefined : this.$root.formatTime(start_time);
        params.end_time = !end_time || end_time === "Invalid date" ? undefined : this.$root.formatTime(end_time);
      }
      this.recordTime.start_time = params.start_time;
      this.recordTime.end_time = params.end_time;

      if (this.recordTime.start_time > this.recordTime.end_time) {
        this.$Tip.info({ content: "结束时间必须大于开始时间！" });
        return false;
      }

      if (this.recordForm.username) {
        params.username = this.$root.trimAll(this.recordForm.username);
      }

      if (!this.$root.validateName(params.username)) {
        this.$Tip.info({ content: "您所查询的会员账号不正确，请重新输入" });
        return false;
      }

      for (let key in params) {
        if (!params[key]) delete params[key];
      }

      this.$root.startTableLoading();
      
      getZhengbasaiRecordList(params, true)
        .then((res) => {
          if (res && res.code === 200) {
            const { data, total } = res.data;
            this.recordTable.data = data;
            this.recordTablePublicStatus = this.recordTable.data[0].public_status;
            this.recordTable.total = total;
          }
          this.$root.endTableLoading();
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
    },
    showSendDonate() {
      this.sendTip =
        this.isAnyCanDonate
    },
    sendDonate(params, type) {
      let unGetDonateLength = this.recordTable.data.filter( item => item.status === "no" ).length;
      let confirmMsg = unGetDonateLength === 0 ? "所选时间段无未发放优惠的会员！" :
                      (type === "all" ? "您确定一键发放会员的优惠吗？" : "您确定发放此会员的优惠吗？");

      let request = {};
      if (type === "single") {
        request.uid = params.row.uid;
        request.id = params.row.id;
        request.siteId = params.row.siteId;
      } else {
        request.siteId = params.siteId;
      }

      if (this.recordTime) {
        const [start_time, end_time] = this.recordTime;
        request.start_time = !start_time || start_time === "Invalid date" ? undefined : this.$root.formatTime(start_time);
        request.end_time = !end_time || end_time === "Invalid date" ? undefined : this.$root.formatTime(end_time);
      }
      this.recordTime.start_time = request.start_time;
      this.recordTime.end_time = request.end_time;

      if (unGetDonateLength === 0) {
        this.$Tip.info({
          content: confirmMsg
        });
      } else {
        this.$Tip.confirm({
          content: confirmMsg,
          onOk: () => {
            this.$root.startTableLoading();
            sendZhengbasaiDonate(request, true)
              .then((res) => {
                if (res != undefined && res.code == 200 && res.data.code != 400) {
                  this.$Message.success({ content: res.data });
                  this.getRecordData();
                }
                this.$root.endTableLoading();
              })
              .catch((error) => {
                this.$root.endTableLoading();
              });
          },
        });
      }
    },

    cancelSendDonate(params, type) {
      let data = params.row;
      let request = {
        siteId: data.siteId,
        id: data.id,
      };

      this.$Tip.confirm({
        content: "您确定取消发放此会员的优惠吗？",
        onOk: () => {
          this.$root.startTableLoading();
          cancelZhengbasaiDonate(request, true)
            .then((res) => {
              if (res != undefined && res.code == 200 && res.data.code != 400) {
                this.$Message.success({ content: res.data });
                this.getRecordData();
              }
              this.$root.endTableLoading();
            })
            .catch((error) => {
              this.$root.endTableLoading();
            });
        },
      });
    },
    exportExcel() {
      let data = {
        isExport: 1,
        siteId: this.$root.nowSite.id,
        status: this.recordForm.status == undefined ? "all" : this.recordForm.status,
        username: this.recordForm.userName,
        type: this.type,
      };
      let timeArr = [this.recordForm.start_time, this.recordForm.end_time];
      if (!this.$root.validateTime(timeArr)) {
        return false;
      }
      data.start_time = this.$root.formatTime(timeArr[0]);
      data.end_time = this.$root.formatTime(timeArr[1]);

      for (let key in data) {
        if (!data[key] || key == "limit" || key == "page") delete data[key];
      }
      data.isExport = 1;
      let openr = window.open();
      getZhengbasaiRecordList(data)
        .then((res) => {
          if (res != undefined && res.code == 200) {
            let region = res.data.downloadUrl.split(".com")[1];
            let openr1 = openr ? openr : window;
            openr1.location.href = region;
          } else {
            openr.close();
          }
        })
        .catch((error) => {
          this.$root.endTableLoading();
        });
    },
    chineseNumber(num) {
      const changeNum = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
      ];
      const unit = ["", "十", "百"];
      num = parseInt(num);
      const getWan = (temp) => {
        const strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
          if (i == 0 && strArr[i] == 0) {
            newNum = "";
          } else if (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0) {
            newNum = "";
          } else if (i > 0 && strArr[i] === "1") {
            newNum = (strArr[i] == 0 ? unit[0] : unit[i]) + newNum;
          } else {
            newNum =
              changeNum[strArr[i]] +
              (strArr[i] == 0 ? unit[0] : unit[i]) +
              newNum;
          }
        }
        return newNum;
      };
      const overWan = Math.floor(num / 100);
      let noWan = num % 100;
      if (noWan.toString().length < 2) noWan = "0" + noWan;
      return overWan ? getWan(overWan) + "百" + getWan(noWan) : getWan(num);
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../../styles/button.less";
/deep/.v2-search {
  .blue-bd {
    background: #2d8cf0;
    color: #fff;
  }
}
.modeBtns {
  border: 0;
  border-radius: 0;
  line-height: 36px;
  height: 36px;
  text-align: center;
  padding: 0 15px;
}
.active {
  border: 1px solid #2d8cf0;
  border-bottom: 0;
  color: #2d8cf0;
  box-sizing: border-box !important;
}
.footer {
  border: 1px solid #dcdcdc;
  border-top: 0;
  line-height: 48px;
}
/deep/.rank-box {
  .ivu-table-tip {
    height: 48px;
  }
}
/deep/.ivu-row {
  margin-top: 0 !important;
}
/deep/.ivu-page {
  margin-top: 15px;
}
.not-touch {
  color: #c3c3c3;
  pointer-events: none;
  cursor: no-drop;
}
/deep/.celan {
  background: #d05157;
  color: white;
  position: absolute;
  left: 0;
  margin-top: -13px;
}

/deep/.txt {
  padding-top: 0 !important;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  height: 107px;
}
/deep/.font {
  font-size: 20px;
  margin-left: 10px;
  color: #444;
  word-break: break-all;
}
/deep/.btns {
  padding-bottom: 33px;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
/deep/.flex-row {
  padding-top: 0 !important;
}
.bg-color-blue {
  &:nth-child(odd) {
    background-color: #8ac3ff;
    color: #fff;
  }
  &:nth-child(even) {
    background-color: #fff;
  }
}

/deep/.all-btn-bg {
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-left: 0;
  text-align: center;
}

/deep/.active-all-btn-bg {
  background-color: #8ac3ff;
  color: #ffffff;
}
/deep/.ivu-form-item-error-tip {
  width: 230px;
}
/deep/.ivu-modal-body {
  min-height: 635px;
}
</style>


