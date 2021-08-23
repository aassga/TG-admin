/* eslint-disable space-before-function-paren */
// 根节点的mixns
import { mapState, mapActions } from 'vuex'
const rootMixins = {
  data() {
    return {
      tableLoading: false,
      searchBtnLoading: false,
      exportBtnLoading: false,
      editBtnLoading: false
    }
  },
  computed: {
    ...mapState({
      nowSite: state => state.user.nowSite
    })
  },
  created() {
    this.$Message.config({
      top: 50,
      duration: 1
    })
    this.getNewRoute()
  },
  methods: {
    ...mapActions(['getNewRoute']),
    // 开启表格的loading还有查询按钮的loading
    startTableLoading() {
      this.tableLoading = true
      this.searchBtnLoading = true
    },
    startSearchBtnLoading() {
      this.searchBtnLoading = true
    },
    endSearchBtnLoading() {
      this.searchBtnLoading = false
    },
    // 关闭表格的loading还有查询按钮的loading
    endTableLoading() {
      this.tableLoading = false
      this.searchBtnLoading = false
    },
    // 开启编辑页loading
    startEditLoading() {
      this.editBtnLoading = true
    },
    // 关闭编辑页loading
    endEditLoading() {
      this.editBtnLoading = false
    },
    // // 为了做验证的时分秒默认时间
    newDefaultEnd() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    newDefaultStart() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 00:00:00')
    },
    // 获取表格搜索栏默认的时间
    startTime(type) {
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return this.$moment().startOf('day').format(type)
    },
    // 获取当前对应格式的时间
    newstartTime() {
      return this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    },
    endTime(type) {
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return this.$moment().format(type)
    },
    midnight(type) {
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return this.$moment().endOf('day').set('hours', 23).set('minutes', 59).set('seconds', 59).format(type)
    },
    // 获取距离目前多少天前的时间
    fromNow(num, type) {
      let moment = this.$moment
      type = type === 1 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
      return moment().day(moment().day() - num).format(type)
    },
    // 转换时间为YYYY-MM-DD格式
    formatTime(time) {
      return this.$moment(time).format('YYYY-MM-DD')
    },
    formatTime2(time) {
      return this.$moment(time).format('YYYYMMDD')
    },
    // 转换时间为YYY-MM-DD HH:mm-SS
    formatTimeS(time) {
      return this.$moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    // 转换时间为YYY/MM/DD HH:mm-SS
    formatTimeSS(time) {
      return this.$moment(time).format('YYYY/MM/DD HH:mm:ss')
    },
    formatTimeXS(time) {
      return this.$moment(time).format('YYYY/MM/DD')
    },
    formatTimeStart(time) {
      return this.$moment(time).format('YYYY/MM/DD 00:00:00')
    },
    formatTimeEnd(time) {
      return this.$moment(time).format('YYYY/MM/DD 23:59:59')
    },
    formatTimeX(time) {
      return this.$moment(time).format('YYYY-MM-DD 00:00:00')
    },
    formatnightTimeS(time) {
      return this.$moment(time).format('YYYY-MM-DD 23:59:59')
    },
    // 财务
    cwTimeS(time) {
      return this.$moment(time).format('YYYY-MM-DD 08:00:00')
    },
    cwNightTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 07:59:59')
    },
    // 美东
    enTimeS(time) {
      return this.$moment(time).format('YYYY-MM-DD 00:00:00')
      // return this.$moment(time).format('YYYY-MM-DD 12:00:00')
    },
    enNightTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 23:59:59')
      // return this.$moment(time).format('YYYY-MM-DD 11:59:59')
    },
    newFormatTime(time) {
      return this.$moment(time).format('YYYY-MM-DD HH:mm')
    },
    moneyTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 08:00:00')
    },
    lastTime(time) {
      return this.$moment(time).format('YYYY-MM-DD 07:59:59')
    },
    nextTime(time) {
      return this.$moment(time).day(this.$moment(time).day() + 1).format('YYYY-MM-DD 07:59:59')
    },
    // 时间戳并转换时间为YYYY-MM-DD HH:mm:ss格式
    unixTime(time) {
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format('YYYY-MM-DD HH:mm:ss')
      return str
    },
    newUnixTime(time) {
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format('YYYY-MM-DD HH:mm')
      return str
    },
    returnDayTime(time) {
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format('YYYY-MM-DD')
      return str
    },
    unixTimeMMDD(time, split='') {     // MMDD格式
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format(`MM${split}DD`)
      return str
    },
    unixTimeMD(time, split='') {     // MD格式
      let str = Number(time) === 0 ? '-' : this.$moment.unix(time).format(`M${split}D`)
      return str
    },
    // 获取手个月之前的日期
    twomonth() {
      return this.$moment(new Date()).subtract(2, 'months').format('YYYY-MM-DD 00:00:00')
    },
    // 获取三个月之前的时间
    threemonth() {
      let start_date = this.$moment(new Date()).subtract(3, 'months').format('YYYY-MM-DD 00:00:00')
      let end_date = this.$moment()
      return end_date.diff(start_date, 'days')
    },
    // 获取六个月之前的日期
    sixmonth() {
      return this.$moment(new Date()).subtract(6, 'months').format('YYYY-MM-DD 00:00:00')
    },
    // 验证查询页面的时间
    validateTime(Time) {
      if( ((Time[0] && !Time[1]) || (Time[1] && !Time[0])))  {
        this.$Tip.info({ content: '请输入开始和结束时间' })
        return false
      }

      if (Time[0] && Time[1]) {
        const [startTime, endTime] = Time
        
        if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
          this.$Tip.info({ content: '结束时间必须大于开始时间！' })
          return false
        } else if (new Date(endTime).getTime() - new Date(startTime).getTime() === 0) {
          return Time
        }
        return Time
      }
      return Time
    },
    
    // 美东时间校验
    mdValidateTime(Time) {
      if ((Time[0] && !Time[1]) || (Time[1] && !Time[0])) {
        this.$Tip.info({ content: '请输入开始和结束时间' })
        return false
      }
      if (Time[0] && Time[1]) {
        const [ startTime, endTime ] = Time
        if (new Date(endTime).getTime() - new Date(startTime).getTime() < 0) {
          this.$Tip.info({ content: '结束时间必须大于开始时间' })
          return false
        } else if (new Date(endTime).getTime() - new Date(startTime).getTime() === 0) {
          this.$Tip.info({ content: '结束时间必须大于开始时间' })
          return false
        }
        return Time
      }
      return Time
    },
    // 加上时分秒后的验证
    effectTime(Time) {
      if (!Time[0] || !Time[1]) {
        this.$Tip.info({ content: '请输入开始和结束时间' })
        return false
      }
      if (Time[0] && Time[1]) {
        const [startTime, endTime] = Time
        if (new Date(endTime).valueOf() - new Date(startTime).valueOf() < 1) {
          this.$Tip.info({ content: '结束时间必须大于开始时间！' })
          return false
        } else if (new Date(endTime).getTime() - new Date(startTime).getTime() === 0) {
          return Time
        }
        return Time
      }
      return Time
    },
    // 验证查询页面的时间
    validatecourseTime(Time) {
      if (!Time[0] || !Time[1]) {
        this.$Message.error('请输入开始和结束时间')
        return false
      }

      if (Time[0] && Time[1]) {
        const [startTime, endTime] = Time
        if (new Date(endTime).getTime() - new Date(startTime).getTime() <= 0) {
          this.$Message.error('结束时间必须大于开始时间！')
          return false
        } else if (new Date(endTime).getTime() - new Date(startTime).getTime() === 0) {
          return Time
        }
        return Time
      }
      return Time
    },
    // 验证查询页面大于七天的时间
    checkSevenTime(Time) {
      if (Time[0] && Time[1]) {
        const [startTime, endTime] = Time
        if (new Date(endTime).getTime() - new Date(startTime).getTime() > 604800000) {
          return  false;
        }
        return  Time
      }
    },
    // 过滤返回空的数据
    text(text) {
      // eslint-disable-next-line no-unneeded-ternary
      return text ? text : '-'
    },
    keepTwo(num) {
      if (num == null) return '0.00'
      var result = parseFloat(num)
      result = Math.round(num * 100) / 100
      var sx = result.toString()
      var posDes = sx.indexOf('.')
      if (posDes < 0) {
        posDes = sx.length
        sx += '.'
      }
      while (sx.length <= posDes + 2) {
        sx += 0
      }
      return sx
    },
    // 查询用户名的校验  排除模糊的情况
    validateName(name) {
      name = String(name)
      let reg = /^[a-zA-Z0-9-_]{5,20}$/
      let flag
      // 多个用户名查询
      if (name.includes(',')) {
        for (let item of name.split(',')) {
          flag = reg.test(item)
          return flag
        }
        return flag
      } else {
        flag = reg.test(name)
      }
      return flag
    },
    // 去掉输入框的空格
    trimAll(name) {
      return name.replace(/\s+/g, '')
    },
    //去掉html的标签符号
    trimPhtml(html){
      return html.replace(/<\/?.+?>/g,"")
    },
    //去掉html的标签符号,除了图片
    trimHtml(html){
      return html.replace(/<(?!img).*?>/g, "")
    },
    trimImg(img){
      if(img.includes('src')){
        return (img.split("src=")[1].split('title')[0]).replace(/\"/g, "")
      }
    },

    //去掉空字符串
    trimString(string){
       return  string.replace(/\"/,"")
    },
    // 校验Ip
    checkIp(ip) {
      let reg = /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/
      return reg.test(ip)
    },
    // 做添加期数的限制
    beforeToday() {
      return this.$moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    },
    hoursTime(time) {
      let sumTime
      if (time >= 3600) {
        let hours = Math.floor(time / 3600)
        let min = Math.floor(time / 60) % 60
        let seconds = time % 60
        sumTime = hours + '时' + min + '分' + seconds + '秒'
      } else if (time < 3600 && time >= 60) {
        let min = Math.floor(time / 60)
        let seconds = time % 60
        sumTime = min + '分' + seconds + '秒'
      } else if (time < 60 && time >= 0) {
        let seconds = time
        sumTime = seconds + '秒'
      } else {
        sumTime = '0秒'
      }
      return sumTime
    },
    // 今天
    todayStartTime() {
      return this.$moment().startOf('day').format('YYYY-MM-DD 00:00:00')
    },
    todayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 昨天
    yesterdayStartTime() {
      return this.$moment().day(this.$moment().day() - 1).startOf('day').format('YYYY-MM-DD 00:00:00')
    },
    // 昨天累计减
    yesterdayFullStartTime(message) {
      return this.$moment().day(this.$moment().day()+message - 1).startOf('day').format('YYYY-MM-DD')
    },
    //明天不要时分秒
    tomorrowFullStartTime() {
      return this.$moment().day(this.$moment().day() + 1).startOf('day').format('YYYY-MM-DD')
    },
    yesterdayEndTime() {
      return this.$moment().day(this.$moment().day() - 1).startOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 最近7天的时间
    weekDayStartTime() {
      return this.$moment().day(this.$moment().day() - 7).format('YYYY-MM-DD 00:00:00')
    },
    weekDayStartTimeY() {
      return this.$moment().day(this.$moment().day() - 7).format('YYYY-MM-DD')
    },
    weekDayEndTime() {
      return this.$moment().startOf('day').format('YYYY-MM-DD 23:59:59')
    },
    weekDayEndTimeY() {
      return this.$moment().startOf('day').format('YYYY-MM-DD')
    },
    // 本月时间
    monthDayStartTime() {
      return this.$moment().month(this.$moment().month()).startOf('month').format('YYYY-MM-DD 00:00:00')
    },
    monthDayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 当天计算的本月时间
    monthStartTime() {
      return this.$moment().month(this.$moment().month()).startOf('month').format('YYYY-MM-DD')
    },
    monthEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD')
    },
    monthEndTimeNew() {//月底结束
      return this.$moment().month(this.$moment().month()).endOf('month').format('YYYY-MM-DD')
    },
    // 上月时间，整天计算
    lastMonthStartTime() {
      return this.$moment().month(this.$moment().month() - 1).startOf('month').format('YYYY-MM-DD')
    },
    lastMonthEndTime() {
      return this.$moment().month(this.$moment().month() - 1).endOf('month').format('YYYY-MM-DD')
    },
    // 上月时间
    lastMonthDayStartTime() {
      return this.$moment().month(this.$moment().month() - 1).startOf('month').format('YYYY-MM-DD 00:00:00')
    },
    // 上个月第一天的时间不要时分秒
    lastMonthDayFullStartTime() {
      return this.$moment().month(this.$moment().month() - 1).startOf('month').format('YYYY-MM-DD')
    },
    lastMonthDayEndTime() {
      return this.$moment().month(this.$moment().month() - 1).endOf('month').format('YYYY-MM-DD 23:59:59')
    },
    // 总数据 不规范的3个月
    totalDataStartTime() {
      return this.$moment().subtract(3, 'months').add(2, 'days').startOf('day').format('YYYY-MM-DD 00:00:00')
    },
    totalDataEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
    },
    // 综合报表财务模式下的今天
    cwTodayStartTime() {
      return this.$moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD 08:00:00')
    },
    cwTodayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 07:59:59')
    },
    // 财务时间 昨天
    cwYesterdayStartTime() {
      return this.$moment().subtract(2, 'days').format('YYYY-MM-DD 08:00:00')
    },
    cwYesterdayEndTime () {
      return this.$moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 07:59:59')
    },
    // 财务时间本月
    cwMonthStartTime() {
      return this.$moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD 08:00:00')
    },
    cwMonthEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 07:59:59')
    },
    // 财务时间 上月
    cwLastMonthStartTime() {
      return this.$moment().startOf('month').subtract(1, 'months').subtract(1, 'days').format('YYYY-MM-DD 08:00:00')
    },
    cwLastMonthEndTime() {
      return this.$moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 07:59:59')
    },
    // 综合报表美东模式下的今天
    enTodayStartTime() {
      return this.$moment().startOf('day').format('YYYY-MM-DD 00:00:00')
      // return this.$moment().subtract(1, 'days').startOf('day').format('YYYY-MM-DD 12:00:00')
    },
    enTodayEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
      // return this.$moment().endOf('day').format('YYYY-MM-DD 11:59:59')
    },
    // 美东时间 昨天
    enYesterdayStartTime() {
      return this.$moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00')
      // return this.$moment().subtract(2, 'days').format('YYYY-MM-DD 12:00:00')
    },
    enYesterdayEndTime () {
      return this.$moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 23:59:59')
      // return this.$moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD 11:59:59')
    },
    // 美东时间本月
    enMonthStartTime() {
      return this.$moment().startOf('month').format('YYYY-MM-DD 00:00:00')
      // return this.$moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD 12:00:00')
    },
    enMonthEndTime() {
      return this.$moment().endOf('day').format('YYYY-MM-DD 23:59:59')
      // return this.$moment().endOf('day').format('YYYY-MM-DD 11:59:59')
    },
    // 美东时间 上月
    enLastMonthStartTime() {
      return this.$moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD 00:00:00')
      // return this.$moment().startOf('month').subtract(1, 'months').subtract(1, 'days').format('YYYY-MM-DD 12:00:00')
    },
    enLastMonthEndTime() {
      return this.$moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59:59')
      // return this.$moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 11:59:59')
    },
    // 判断佣金模式下的b模式 false为b模式
    checkCommission() {
      let mode = JSON.parse(localStorage.accessSite).find(item => item.id === this.nowSite.id).personal_commission_mode
      if (mode === 'mode_b') return false
      else return true
    },
    // 不想改前面了 直接返回模式名称
    modeName() {
      let mode = JSON.parse(localStorage.accessSite).find(item => item.id === this.nowSite.id).personal_commission_mode
      return mode
    },
    groupLenth(){
       return localStorage.groupListLength
    },
    // 获取不同彩种的号码长度
    getLotteryLength(lid) {
      // console.log(lid)
      lid = Number(lid)
      let length
      if (lid === 12 || lid === 13 || lid === 3630 || lid === 10044 || lid === 10045||lid===3) length = 10
      else if (lid === 16 || lid === 17 || lid === 24) length = 5
      else if (lid === 18 || lid === 19) length = 7
      else if (lid === 3631 || lid === 3632 || lid === 27) length = 3
      return length
    },
    // 去掉彩票期数里的年
    removeYear(issue) {
      issue = String(issue)
      let year = new Date().getFullYear()
      if (Number(issue.substring(0, 4)) === Number(year)) {
        return issue.substring(4, issue.length)
      } else {
        return issue
      }
    },
    //以什么为段位
    getType(N,Q){
      let R=[],F;
      for(let F=0;F<Q.length;){
        R.push(Q.slice(F,F+=N))
      }
      return R
    },
    //替换换行符
    getLine(line){
      line.replace(/(\r\n|\n|\r)/gm , '|')
      console.log(line)
      return line
    },
     ArabiSimplified(Num) {
     
       let newchar='';
     if(Num==1){
      newchar='一';
     }else if(Num==2){
      newchar='二';
     }else if(Num==3){
      newchar='三';
     }else if(Num==4){
      newchar='四';
     }else if(Num==5){
      newchar='五';
     }else if(Num==6){
      newchar='六';
     }else if(Num==7){
      newchar='七';
     }else if(Num==8){
      newchar='八';
     }else if(Num==9){
      newchar='九';
     }else if(Num==10){
      newchar='十';
     }else if(Num==11){
      newchar='十一';
     }else if(Num==12){
      newchar='十二';
     }else if(Num==13){
      newchar='十三';
     }else if(Num==14){
      newchar='十四';
     }else if(Num==15){
      newchar='十五';
    }else if(Num==16){
      newchar='十六';
    }else if(Num==17){
      newchar='十七';
    }else if(Num==18){
      newchar='十八';
    }else if(Num==19){
      newchar='十九';
    }else if(Num==20){
      newchar='二十';
    }else if(Num==0){
      newchar='未分层';
    }
    else{
      newchar='-';
    }
    return newchar;
   
}
  },
}

// eslint-disable-next-line eol-last
export default rootMixins