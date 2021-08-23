/* eslint-disable no-unused-vars */
import Cookies from "js-cookie";
import getBrowserInfo from "get-browser-info";
// cookie保存的天数
import config from "@/config";
import {
  forEach,
  hasOneOf,
  objEqual
} from "@/libs/tools";
const {
  title,
  useI18n
} = config;

export const TOKEN_KEY = "token";

export const setToken = token => {
  let cookieExpires;
  if (token) cookieExpires = getExpires(token);
  else cookieExpires = "";
  localStorage.expires = token;
  // Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
};

export const getToken = () => {
  const token = localStorage.expires;
  if (token) return token;
  else return false;
};

export const getExpires = token => {
  // 对后台返回的base64的编码进行解码
  let obj =
    token &&
    window.atob(
      token.substring(token.indexOf(".") + 1, token.lastIndexOf("."))
    );
  let exp = JSON.parse(obj).exp;
  let cookieExpires = new Date(exp * 1000);
  return new Date(cookieExpires);
};

export const isTokenExpired = () => {
  if (getToken()) {
    let expiredTime = getExpires(getToken());
    expiredTime = new Date(expiredTime).getTime() / 1000;
    let nowTime = new Date().getTime() / 1000;
    // 如果 < 10分钟，则说明即将过期
    return expiredTime - nowTime < 10 * 60;
  } else return false;
};

export const isRefreshToken = () => {
  if (getToken()) {
    let expiredTime = getExpires(getToken());
    expiredTime = new Date(expiredTime).getTime() / 1000;
    let nowTime = new Date().getTime() / 1000;
    return expiredTime - nowTime < 100 * 60;
  } else return false;
};

export const setAdminId = adminId => {
  let cookieExpires;
  if (getToken()) cookieExpires = getExpires(getToken());
  Cookies.set("adminId", adminId, {
    expires: cookieExpires || 1
  });
};

export const getAdminId = () => {
  const adminId = Cookies.get("adminId");
  if (adminId) return adminId;
  else return false;
};

// export const setAuthMenu = (authMenu) => {
//   let cookieExpires
//   if (getToken()) cookieExpires = getExpires(getToken())
//   Cookies.set('authMenu', authMenu, {
//     expires: cookieExpires || 1
//   })
// }

// export const getAuthMenu = () => {
//   const authMenu = Cookies.get('authMenu')
//   if (authMenu) return authMenu
//   else return false
// }

export const setUserName = username => {
  let cookieExpires;
  if (getToken()) cookieExpires = getExpires(getToken());
  Cookies.set("username", username, {
    expires: cookieExpires || 1
  });
};

export const getUserName = () => {
  const username = Cookies.get("username");
  if (username) return username;
  else return false;
};

// export const getClientIp = (callback) => {
// const clientInfo = getBrowserInfo()
// if (clientInfo.engine === 'EdgeHTML') {
//   alert('对不起，暂不支持该浏览器')
//   return false
// }
//   var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection // compatibility for firefox and chrome
//   var pc = new myPeerConnection({ iceServers: [] })
//   var noop = function () {}
//   var localIPs = {}
//   var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g
//   var key
//   function ipIterate (ip) {
//     if (!localIPs[ip]) callback(ip)
//     localIPs[ip] = true
//   }
//   pc.createDataChannel('')
//   pc.createOffer().then(function (sdp) {
//     sdp.sdp.split('\n').forEach(function (line) {
//       if (line.indexOf('candidate') < 0) return
//       line.match(ipRegex).forEach(ipIterate)
//     })
//     pc.setLocalDescription(sdp, noop, noop)
//   })
//   pc.onicecandidate = function (ice) {
//     if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return
//     ice.candidate.candidate.match(ipRegex).forEach(ipIterate)
//   }
// }
// getClientIp(function (ip) {
//   window.localStorage.setItem('Client-IP-Addrs', ip)
// })
export const getClientIp = () => {
  const clientInfo = getBrowserInfo();
  if (clientInfo.engine === "EdgeHTML") {
    alert("对不起，暂不支持该浏览器");
    return false;
  }
  var RTCPeerConnection =
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection;
  if (RTCPeerConnection) {
    var rtc = new RTCPeerConnection({
      iceServers: []
    });
    if (1 || window.mozRTCPeerConnection) {
      try {
        rtc.createDataChannel("", {
          reliable: false
        });
      } catch (e) {}
    }
    rtc.onicecandidate = function (evt) {
      if (evt.candidate) grepSDP("a=" + evt.candidate.candidate);
    };
    rtc.createOffer(
      function (offerDesc) {
        grepSDP(offerDesc.sdp);
        rtc.setLocalDescription(offerDesc);
      },
      function (e) {
        console.warn("offer failed", e);
      }
    );
    var addrs = Object.create(null);
    addrs["0.0.0.0"] = false;

    function updateDisplay(newAddr) {
      if (newAddr in addrs) return;
      else addrs[newAddr] = true;
      var displayAddrs = Object.keys(addrs).filter(function (k) {
        return addrs[k];
      });
      for (var i = 0; i < displayAddrs.length; i++) {
        if (displayAddrs[i].length > 16) {
          displayAddrs.splice(i, 1);
          i--;
        }
      }
      window.localStorage.setItem("Client-IP-Addrs", displayAddrs[0]);
    }

    function grepSDP(sdp) {
      var hosts = [];
      sdp.split("\r\n").forEach(function (line, index, arr) {
        if (~line.indexOf("a=candidate")) {
          var parts = line.split(" ");
          var addr = parts[4];
          var type = parts[7];
          if (type === "host") updateDisplay(addr);
        } else if (~line.indexOf("c=")) {
          var parts = line.split(" ");
          var addr = parts[2];
          updateDisplay(addr);
        }
      });
    }
  }
};

export const setUserType = type => {
  let cookieExpires;
  if (getToken()) cookieExpires = getExpires(getToken());
  Cookies.set("type", type, {
    expires: cookieExpires || 1
  });
};

export const getUserType = () => {
  const type = Cookies.get("type");
  if (type) return type;
  else return false;
};

export const setAccessInLocal = site => {
  localStorage.accessSite = JSON.stringify(site);
};

export const getAccessFromLocal = site => {
  const accessSite = localStorage.accessSite;
  if (accessSite) return JSON.parse(accessSite);
  else return false;
};
// 数组去重
export const rmRepeatItem = arr => {
  let res = [];
  for (let j = 0; j < arr.length; j++) {
    if (!res.includes(arr[j])) {
      res[res.length] = arr[j];
    }
  }
  return res;
};

export const setNowSiteInLocal = site => {
  localStorage.nowSite = JSON.stringify(site);
};

export const getNowSiteFromLocal = site => {
  const nowSite = localStorage.nowSite;
  if (nowSite) return JSON.parse(nowSite);
  else return false;
};

// export const testPath = (path) => {
//   let key, value;
//   if (/^\/member/i.test(path)) {
//     key = "member";
//     value = "会员管理";
//   } else if (/^\/finance/i.test(path)) {
//     key = "finance";
//     value = "财务管理";
//   } else if (/^\/agency/i.test(path)) {
//     key = "agency";
//     value = "代理管理";
//   } else if (/^\/report/i.test(path)) {
//     key = "report";
//     value = "报表管理";
//   } else if (/^\/lottery/i.test(path)) {
//     key = "lottery";
//     value = "彩票管理";
//   } else if (/^\/activity/i.test(path)) {
//     key = "activity";
//     value = "活动管理";
//   } else if (/^\/system/i.test(path)) {
//     key = "system";
//     value = "系统配置";
//   } else {
//     key = "member";
//     value = "会员管理";
//   }
//   return { key, value };
// }

export const hasChild = item => {
  return item.children && item.children.length !== 0;
};

/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = list => {
  let res = [];
  forEach(list, item => {
    if (item.meta && !item.meta.hideInMenu) {
      let obj = {
        icon: (item.meta && item.meta.icon) || "",
        name: item.name,
        meta: item.meta
      };
      if (hasChild(item) || (item.meta && item.meta.showAlways)) {
        obj.children = getMenuByRouter(item.children);
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href;
      res.push(obj);
    }
  });
  return res;
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = {
    ...homeRoute,
    icon: homeRoute.meta.icon
  };
  let routeMetched = route.matched;
  if (routeMetched.some(item => item.name === homeRoute.name))
    return [homeItem];
  let res = routeMetched
    .filter(item => {
      return item.meta === undefined || !item.meta.hideInBread;
    })
    .map(item => {
      let meta = {
        ...item.meta
      };
      if (meta.title && typeof meta.title === "function") {
        meta.__titleIsFunction__ = true;
        meta.title = meta.title(route);
      }
      let obj = {
        icon: (item.meta && item.meta.icon) || "",
        name: item.name,
        meta: meta
      };
      return obj;
    });
  res = res.filter(item => {
    return !item.meta.hideInMenu;
  });
  return [{
      ...homeItem,
      to: homeRoute.path
    },
    ...res
  ];
};

export const getRouteTitleHandled = route => {
  let router = {
    ...route
  };
  let meta = {
    ...route.meta
  };
  let title = "";
  if (meta.title) {
    if (typeof meta.title === "function") {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else title = meta.title;
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

export const showTitle = (item, vm) => {
  let {
    title,
    __titleIsFunction__
  } = item.meta;
  if (!title) return;
  if (useI18n) {
    if (title.includes("{{") && title.includes("}}") && useI18n)
      title = title.replace(/({{[\s\S]+?}})/, (m, str) =>
        str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim()))
      );
    else if (__titleIsFunction__) title = item.meta.title;
    else title = vm.$t(item.name);
  } else title = (item.meta && item.meta.title) || item.name;
  return title;
};

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list);
};
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList;
  return list ? JSON.parse(list) : [];
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = "home") => {
  let i = -1;
  let len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    let item = routers[i];
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName);
      if (res.name) return res;
    } else {
      if (item.name === homeName) homeRoute = item;
    }
  }
  return homeRoute;
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const {
    name,
    path,
    meta
  } = newRoute;
  let newList = [...list];
  // 添加meta.title的比较，解决动态改变title需要来回点击两次生效的问题
  if (newList.findIndex(item => item.name === name) >= 0) {
    newList = newList.map(route => {
      if (route.name === name && route.meta.title !== meta.title) {
        route.meta.title = meta.title;
      }
      return route;
    });
    return newList;
  } else
    newList.push({
      name,
      path,
      meta
    });
  return newList;
};

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split("?")[1].split("&");
  let paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split("=");
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = getHomeRoute(list, 'memberSearch');
  } else {
    const index = list.findIndex(item => routeEqual(item, route));
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = file => {
  let nameSplit = file.name.split(".");
  let format = nameSplit[nameSplit.length - 1];
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsText(file); // 以文本格式读取
    let arr = [];
    reader.onload = function (evt) {
      let data = evt.target.result; // 读到的数据
      let pasteData = data.trim();
      arr = pasteData
        .split(/[\n\u0085\u2028\u2029]|\r\n?/g)
        .map(row => {
          return row.split("\t");
        })
        .map(item => {
          return item[0].split(",");
        });
      if (format === "csv") resolve(arr);
      else reject(new Error("[Format Error]:你上传的不是Csv文件"));
    };
  });
};

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = array => {
  let columns = [];
  let tableData = [];
  if (array.length > 1) {
    let titles = array.shift();
    columns = titles.map(item => {
      return {
        title: item,
        key: item
      };
    });
    tableData = array.map(item => {
      let res = {};
      item.forEach((col, i) => {
        res[titles[i]] = col;
      });
      return res;
    });
  }
  return {
    columns,
    tableData
  };
};

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode;
    } else {
      return findNodeUpper(ele.parentNode, tag);
    }
  }
};

export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode;
  if (parentNode) {
    let classList = parentNode.classList;
    if (
      classList &&
      classes.every(className => classList.contains(className))
    ) {
      return parentNode;
    } else {
      return findNodeUpperByClasses(parentNode, classes);
    }
  }
};
/**
 * 校验快速彩票是否符合规范
 */
export const testfastLotteryInfo = type => {
  let number = Number(type);
  if (
    number === 12 ||
    number === 13 ||
    number === 3630 ||
    number === 10044 ||
    number === 10045
  ) {
    // 快速赛车
    return {
      maxNum: 11,
      count: 10,
      repeat: false
    };
  } else if (number === 16 || number === 17) {
    // 快速时时彩
    return {
      maxNum: 10,
      count: 5,
      repeat: false
    };
  } else if (number === 18 || number === 19) {
    // 快速6合彩
    return {
      maxNum: 50,
      count: 7,
      repeat: false
    };
  } else if (number === 24) {
    return {
      maxNum: 12,
      count: 5,
      repeat: false
    };
  } else if (number === 27) {
    return {
      maxNum: 7,
      count: 3,
      repeat: false
    };
  } else if (number === 3631 || number === 3632) {
    return {
      maxNum: 7,
      count: 3,
      repeat: true
    };
  }
};
export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase();
  if (ele.childNodes.length) {
    let i = -1;
    let len = ele.childNodes.length;
    while (++i < len) {
      let child = ele.childNodes[i];
      if (child.tagName === tagName) return child;
      else return findNodeDownward(child, tag);
    }
  }
};
export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access);
};

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  // 放宽判断路由相同的条件
  const meta1 = route2.meta || {};
  const meta2 = route2.meta || {};
  // return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
  return route1.name === route2.name && meta1.title === meta2.title;
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length;
  let res = false;
  doCustomTimes(len, index => {
    if (routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

export const localSave = (key, value) => {
  localStorage.setItem(key, value);
};

export const localRead = key => {
  return localStorage.getItem(key) || "";
};

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60);
      };
  }
  const difference = Math.abs(from - to);
  const step = Math.ceil((difference / duration) * 50);

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback();
      return;
    }

    let d = start + step > end ? end : start + step;
    if (start > end) {
      d = start - step < end ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }
    window.requestAnimationFrame(() => scroll(d, end, step));
  };
  scroll(from, to, step);
};

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem);
  const pageTitle = showTitle(handledRoute, vm);
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title;
  window.document.title = resTitle;
};
/**
 * @param {*} obj 排序控件交互
 */
export const sortInteraction = obj => {
  let list = document.querySelectorAll(".ivu-table-cell-sort");
  let upList = document.querySelectorAll(".ivu-icon-md-arrow-dropup");
  let downList = document.querySelectorAll(".ivu-icon-md-arrow-dropdown");
  for (let i = 0; i < list.length; i++) {
    if (list[i].innerText === obj.column.title && obj.order === "asc") {
      downList[i].style.display = "none";
      upList[i].style.display = "block";
    } else if (list[i].innerText === obj.column.title && obj.order === "desc") {
      upList[i].style.display = "none";
      downList[i].style.display = "block";
    } else {
      upList[i].style.display = "block";
      downList[i].style.display = "block";
    }
  }
};
/**
 * @param {*} Time 绑定的时间数组
 * @param {*} timeType  时区
 * @param {*} that vue实例
 */
export const checkDayBtn = (Time, timeType, that) => {
  let btn = "";
  let diff =
    (new Date(that.$root.formatTime(Time[1])) -
      new Date(that.$root.formatTime(Time[0]))) /
    (1000 * 60 * 60 * 24);
  if (
    (timeType === "cn" && timeType === "en" && diff < 0) ||
    (timeType === "cw" && diff < 1)
  ) {
    this.$Tip.info({
      content: "结束时间必须大于开始时间"
    });
    return false;
  } else if (timeType === "cn") {
    let st = that.$root.formatTimeS(Time[0]);
    let et = that.$root.formatnightTimeS(Time[1]);
    if (diff === 0) {
      if (
        st === that.$root.todayStartTime() &&
        et === that.$root.todayEndTime()
      )
        btn = "今天";
      else if (
        st === that.$root.yesterdayStartTime() &&
        et === that.$root.yesterdayEndTime()
      )
        btn = "昨天";
      else btn = "";
    } else {
      if (
        st === that.$root.weekDayStartTime() &&
        et === that.$root.weekDayEndTime()
      )
        btn = "最近7天";
      else if (
        st === that.$root.monthDayStartTime() &&
        et === that.$root.monthDayEndTime()
      )
        btn = "本月";
      else if (
        st === that.$root.lastMonthDayStartTime() &&
        et === that.$root.lastMonthDayEndTime()
      )
        btn = "上月";
      else if (
        st === that.$root.totalDataStartTime() &&
        et === that.$root.totalDataEndTime()
      )
        btn = "总数据";
      else btn = "";
    }
  } else if (timeType === "en") {
    let st = that.$root.enTimeS(Time[0]);
    let et = that.$root.enNightTime(Time[1]);
    if (diff === 0) {
      if (
        st === that.$root.enTodayStartTime() &&
        et === that.$root.enTodayEndTime()
      )
        btn = "今天";
      else if (
        st === that.$root.enYesterdayStartTime() &&
        et === that.$root.enYesterdayEndTime()
      )
        btn = "昨天";
      else btn = "";
    } else {
      if (
        st === that.$root.enMonthStartTime() &&
        et === that.$root.enMonthEndTime()
      )
        btn = "本月";
      else if (
        st === that.$root.enLastMonthStartTime() &&
        et === that.$root.enLastMonthEndTime()
      )
        btn = "上月";
      else btn = "";
    }
  } else if (timeType === "cw") {
    let st = that.$root.cwTimeS(Time[0]);
    let et = that.$root.cwNightTime(Time[1]);
    if (diff === 1) {
      if (
        st === that.$root.cwTodayStartTime() &&
        et === that.$root.cwTodayEndTime()
      )
        btn = "今天";
      else if (
        st === that.$root.cwYesterdayStartTime() &&
        et === that.$root.cwYesterdayEndTime()
      )
        btn = "昨天";
    } else {
      if (
        st === that.$root.cwMonthStartTime() &&
        et === that.$root.cwMonthEndTime()
      )
        btn = "本月";
      else if (
        st === that.$root.cwLastMonthStartTime() &&
        et === that.$root.cwLastMonthEndTime()
      )
        btn = "上月";
      else btn = "";
    }
  }
  return btn;
};

//判断对象是否为空
export const isEmptyObject = obj => {
  for (let i in obj) {
    return false;
  }
  return true;
};